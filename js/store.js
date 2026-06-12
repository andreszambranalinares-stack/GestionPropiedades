/**
 * Store.js
 * Maneja la interacción con LocalStorage y la persistencia de datos (JSON).
 * Además, contiene el IDBManager para almacenar archivos binarios (Documentos).
 */

const IDBManager = {
    dbName: "gestion_alquileres_files",
    storeName: "documentos",
    db: null,

    init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, 1);
            
            request.onerror = (e) => reject("Error IDB");
            
            request.onupgradeneeded = (e) => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains(this.storeName)) {
                    // index by tenantApt param
                    const store = db.createObjectStore(this.storeName, { keyPath: "id" });
                    store.createIndex("tenantApt", "tenantApt", { unique: false });
                }
            };

            request.onsuccess = (e) => {
                this.db = e.target.result;
                resolve();
            };
        });
    },

    async saveFile(tenantAptLabel, file, customName) {
        if(!this.db) await this.init();
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction(this.storeName, "readwrite");
            const store = tx.objectStore(this.storeName);
            const id = Date.now().toString();
            const record = {
                id: id,
                tenantApt: tenantAptLabel, // Ej: "bld1-apt01"
                fileName: customName || file.name,
                fileType: file.type,
                blob: file,
                date: new Date().toISOString()
            };
            const req = store.add(record);
            req.onsuccess = () => resolve(record);
            req.onerror = () => reject("Error saving file");
        });
    },

    async getFilesByTenant(tenantAptLabel) {
        if(!this.db) await this.init();
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction(this.storeName, "readonly");
            const store = tx.objectStore(this.storeName);
            const index = store.index("tenantApt");
            const req = index.getAll(tenantAptLabel);
            
            req.onsuccess = (e) => resolve(e.target.result || []);
            req.onerror = () => reject("Error fetching files");
        });
    },

    async deleteFile(id) {
        if(!this.db) await this.init();
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction(this.storeName, "readwrite");
            const store = tx.objectStore(this.storeName);
            const req = store.delete(id);
            req.onsuccess = () => resolve();
            req.onerror = () => reject("Error deleting file");
        });
    }
};

const Store = {
    // Claves de LocalStorage
    KEYS: {
        DB: 'gestion_alquileres_db',
        ACTIVE_USER: 'gestion_alquileres_active_user'
    },

    // Estado principal
    data: {
        edificios: [],
        facturas: [],
        gestores: [],
        historico: [] // Historial de inquilinos
    },
    
    activeUserId: null,

    /**
     * Inicializar Store
     */
    init() {
        this.loadActiveUser();
        
        // Arrancar la base de binarios
        IDBManager.init().catch(console.error);

        const storedDb = localStorage.getItem(this.KEYS.DB);
        
        if (storedDb) {
            this.data = JSON.parse(storedDb);
            
            // Retro-compatibilidad de campos faltantes en DBs antiguas
            let changed = false;
            if(!this.data.gestores || this.data.gestores.length === 0) {
                this.data.gestores = [
                    { id: 'admin-init', nombre: 'Administrador Inicial', email: 'admin@local.test', telefono: '', rol: 'admin', pin: '0000' }
                ];
                changed = true;
            } else {
                // Ensure all users have a pin
                this.data.gestores.forEach(g => {
                    if (!g.pin) {
                        g.pin = '0000';
                        changed = true;
                    }
                });
            }
            if(!this.data.historico) {
                this.data.historico = [];
                changed = true;
            }
            // Comprobar que todos los edificios tengan su array de gastos y tipo de apartamento
            this.data.edificios.forEach(b => {
                if(!b.tipoInmueble) {
                    b.tipoInmueble = 'edificio';
                    changed = true;
                }
                if(!b.gastos) {
                    b.gastos = [];
                    changed = true;
                }
                b.apartamentos.forEach(a => {
                    if (!a.tipo) {
                        a.tipo = 'Apartamento';
                        changed = true;
                    }
                    if (!a.pagos) {
                        a.pagos = [];
                        changed = true;
                    }
                    // Migración: pagos antiguos sin importe heredan el alquiler actual
                    // mientras el inquilino siga viviendo (después ya quedaría fijado)
                    if (a.inquilino) {
                        const alquilerActual = parseFloat(a.inquilino.alquiler) || 0;
                        a.pagos.forEach(p => {
                            if (p.pagado && typeof p.importe !== 'number' && alquilerActual > 0) {
                                p.importe = alquilerActual;
                                changed = true;
                            }
                        });
                    }
                });
            });
            
            if(changed) this.save();
        } else {
            console.log("No DB found, seeding default data...");
            this.seedInitialData();
        }
    },

    /**
     * Guardar estado actual en LocalStorage
     */
    save() {
        localStorage.setItem(this.KEYS.DB, JSON.stringify(this.data));
    },

    /**
     * Gestión del usuario activo
     */
    setActiveUser(userId) {
        this.activeUserId = userId;
        localStorage.setItem(this.KEYS.ACTIVE_USER, userId);
    },

    loadActiveUser() {
        this.activeUserId = localStorage.getItem(this.KEYS.ACTIVE_USER);
    },

    getActiveUser() {
        if (!this.activeUserId || !this.data.gestores) return null;
        return this.data.gestores.find(u => u.id === this.activeUserId);
    },

    logout() {
        this.activeUserId = null;
        localStorage.removeItem(this.KEYS.ACTIVE_USER);
    },

    /**
     * Obtener lista de edificios
     */
    getBuildings() {
        return this.data.edificios;
    },

    /**
     * Obtener un edificio por su ID
     */
    getBuildingById(buildingId) {
        return this.data.edificios.find(b => b.id === buildingId);
    },

    /**
     * Actualiza los datos de la unidad y del inquilino
     */
    updateTenant(buildingId, aptId, tipoUnidad, tenantData) {
        const building = this.getBuildingById(buildingId);
        if(!building) return;
        const apt = building.apartamentos.find(a => a.id === aptId);
        if(!apt) return;
        
        if (tipoUnidad) {
            apt.tipo = tipoUnidad;
        }

        if (tenantData) {
            apt.inquilino = {
                ...apt.inquilino,
                ...tenantData
            };
        }
        this.save();
    },

    /**
     * Desocupa un apartamento y archiva el inquilino en Histórico
     */
    vacateTenant(buildingId, aptId) {
        const building = this.getBuildingById(buildingId);
        if(!building) return;
        const apt = building.apartamentos.find(a => a.id === aptId);
        if(!apt || !apt.inquilino) return;
        
        // Calcular meses
        const entryDateStr = apt.inquilino.fechaEntrada || new Date().toISOString().split('T')[0];
        const exitDateStr = new Date().toISOString().split('T')[0];
        const dEnd = new Date(exitDateStr);
        const dStart = new Date(entryDateStr);
        let months = (dEnd.getFullYear() - dStart.getFullYear()) * 12 + (dEnd.getMonth() - dStart.getMonth());
        if (months < 0) months = 0;

        // Copiar a histórico
        const pastTenant = {
            id: `hist-${Date.now()}`,
            edificioName: building.nombre,
            aptNum: apt.numero,
            nombre: apt.inquilino.nombre,
            telefono: apt.inquilino.telefono,
            email: apt.inquilino.email,
            alquiler: apt.inquilino.alquiler,
            fechaEntrada: entryDateStr,
            fechaSalida: exitDateStr,
            mesesAlquilado: months
        };
        this.data.historico.push(pastTenant);

        apt.inquilino = null;
        this.save();
    },

    /**
     * Marca como pagado un mes específico
     */
    markPaid(buildingId, aptId, mes) {
        // mes formato "YYYY-MM"
        const building = this.getBuildingById(buildingId);
        if(!building) return;
        const apt = building.apartamentos.find(a => a.id === aptId);
        if(!apt) return;

        const index = apt.pagos.findIndex(p => p.mes === mes);
        const hoy = new Date().toISOString().split('T')[0];
        // Guardar el importe en el momento del cobro: así estadísticas y Hacienda
        // siguen siendo correctas aunque el inquilino se vaya o cambie el alquiler
        const importe = apt.inquilino ? (parseFloat(apt.inquilino.alquiler) || 0) : 0;

        if(index >= 0) {
            apt.pagos[index].pagado = true;
            apt.pagos[index].fecha = hoy;
            apt.pagos[index].importe = importe;
        } else {
            apt.pagos.push({ mes: mes, pagado: true, fecha: hoy, importe: importe });
        }
        this.save();
    },

    /**
     * Revierte un pago marcado
     */
    unmarkPaid(buildingId, aptId, mes) {
        const building = this.getBuildingById(buildingId);
        if(!building) return;
        const apt = building.apartamentos.find(a => a.id === aptId);
        if(!apt || !apt.pagos) return;

        apt.pagos = apt.pagos.filter(p => p.mes !== mes);
        this.save();
    },

    /**
     * Añadir o actualizar edificio
     */
    addBuilding(nombre, direccion, localidad, numApt, etiquetas = [], tipoInmueble = 'edificio') {
        const bId = `b-${Date.now()}`;
        const building = {
            id: bId,
            nombre: nombre,
            direccion: direccion,
            localidad: localidad,
            etiquetas: etiquetas,
            tipoInmueble: tipoInmueble,
            gastos: [],
            apartamentos: []
        };
        for(let i=1; i<=numApt; i++) {
            let unitType = 'Apartamento';
            if (tipoInmueble === 'garaje') unitType = 'Plaza de Garaje';
            else if (tipoInmueble === 'local') unitType = 'Local Comercial';
            else if (tipoInmueble === 'piso') unitType = 'Apartamento';

            let prefix = tipoInmueble === 'garaje' ? 'Plaza ' : '';
            if (tipoInmueble === 'local' || tipoInmueble === 'piso') prefix = 'Única ';

            building.apartamentos.push({
                id: `${bId}-${i.toString().padStart(2,'0')}`,
                numero: prefix === 'Única ' ? '1' : `${prefix}${i.toString().padStart(2,'0')}`,
                tipo: unitType,
                inquilino: null,
                pagos: []
            });
        }
        this.data.edificios.push(building);
        this.save();
        return bId;
    },

    updateBuilding(bId, nombre, direccion, localidad, etiquetas) {
        const building = this.getBuildingById(bId);
        if(building) {
            building.nombre = nombre;
            building.direccion = direccion;
            building.localidad = localidad;
            building.etiquetas = etiquetas;
            this.save();
        }
    },

    /**
     * Obtener todas las etiquetas únicas
     */
    getAllTags() {
        const tagsSet = new Set();
        this.data.edificios.forEach(b => {
            if(b.etiquetas) {
                b.etiquetas.forEach(t => tagsSet.add(t));
            }
        });
        return Array.from(tagsSet).sort();
    },

    /**
     * Gastos
     */
    addGasto(buildingId, fecha, concepto, tipo, importe) {
        const building = this.getBuildingById(buildingId);
        if(!building) return;
        if(!building.gastos) building.gastos = [];
        
        building.gastos.push({
            id: `gasto-${Date.now()}`,
            fecha: fecha, // YYYY-MM-DD
            concepto: concepto,
            tipo: tipo,
            importe: parseFloat(importe) || 0
        });
        this.save();
    },

    deleteGasto(buildingId, gastoId) {
        const building = this.getBuildingById(buildingId);
        if(!building || !building.gastos) return;
        building.gastos = building.gastos.filter(g => g.id !== gastoId);
        this.save();
    },

    /**
     * Obtener listado de gestores
     */
    getManagers() {
        return this.data.gestores || [];
    },

    /**
     * Añadir o actualizar gestor
     */
    addManager(nombre, email, telefono, rol, pin, id = null) {
        if (!this.data.gestores) this.data.gestores = [];
        
        if (id) {
            const manager = this.data.gestores.find(g => g.id === id);
            if (manager) {
                manager.nombre = nombre;
                manager.email = email;
                manager.telefono = telefono;
                manager.rol = rol;
                if (pin) manager.pin = pin;
            }
        } else {
            this.data.gestores.push({
                id: 'gestor-' + Date.now(),
                nombre,
                email,
                telefono,
                rol,
                pin: pin || '0000'
            });
        }
        this.save();
    },

    /**
     * Eliminar gestor
     */
    removeManager(id) {
        if (!this.data.gestores) return;
        this.data.gestores = this.data.gestores.filter(g => g.id !== id);
        this.save();
    },

    /**
     * Obtener Histórico
     */
    getHistorico() {
        if (!this.data.historico) {
            this.data.historico = [];
            this.save();
        }
        return this.data.historico || [];
    },

    deleteHistorico(id) {
        if (!this.data.historico) return;
        this.data.historico = this.data.historico.filter(h => h.id !== id);
        this.save();
    },

    /**
     * Datos por defecto - Totalmente vacío
     */
    seedInitialData() {
        this.data.edificios = [];
        this.data.historico = [];
        
        // Seed gestor inicial administrador (sin él no hay forma de entrar)
        if (!this.data.gestores || this.data.gestores.length === 0) {
            this.data.gestores = [
                { id: 'admin-init', nombre: 'Administrador Inicial', email: 'admin@local.test', telefono: '', rol: 'admin', pin: '0000' }
            ];
        }

        this.save();
    },

    exportDataString() {
        return JSON.stringify(this.data);
    },

    importDataString(jsonStr) {
        try {
            const parsed = JSON.parse(jsonStr);
            if (parsed && typeof parsed === 'object') {
                this.data = {
                    edificios: parsed.edificios || [],
                    facturas: parsed.facturas || [],
                    gestores: parsed.gestores || [
                        { id: 'admin-init', nombre: 'Administrador Inicial', email: 'admin@local.test', telefono: '', rol: 'admin', pin: '0000' }
                    ],
                    historico: parsed.historico || []
                };
                
                // Asegurar tipos en las unidades si no existían
                this.data.edificios.forEach(b => {
                    b.apartamentos.forEach(a => {
                        if (!a.tipo) a.tipo = 'Apartamento';
                    });
                });

                this.save();
                return true;
            }
        } catch (e) {
            console.error("Error importando JSON", e);
        }
        return false;
    }
};
