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

    // Usuarios permitidos del sistema
    USERS: [
        { id: "andres", nombre: "Andrés Zambrana Linares" },
        { id: "manuel", nombre: "Manuel Pedro Zambrana Bernabé" }
    ],

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
                    { id: 'andres', nombre: 'Andrés Zambrana Linares', email: 'andres@ejemplo.com', telefono: '', rol: 'admin' },
                    { id: 'manuel', nombre: 'Manuel Pedro Zambrana Bernabé', email: 'manuel@ejemplo.com', telefono: '', rol: 'admin' }
                ];
                changed = true;
            }
            if(!this.data.historico) {
                this.data.historico = [];
                changed = true;
            }
            // Comprobar que todos los edificios tengan su array de gastos
            this.data.edificios.forEach(b => {
                if(!b.gastos) {
                    b.gastos = [];
                    changed = true;
                }
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
        if (!this.activeUserId) return null;
        return this.USERS.find(u => u.id === this.activeUserId);
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
     * Actualiza los datos del inquilino en un apartamento específico
     */
    updateTenant(buildingId, aptId, tenantData) {
        const building = this.getBuildingById(buildingId);
        if(!building) return;
        const apt = building.apartamentos.find(a => a.id === aptId);
        if(!apt) return;
        
        apt.inquilino = {
            ...apt.inquilino,
            ...tenantData
        };
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
        
        if(index >= 0) {
            apt.pagos[index].pagado = true;
            apt.pagos[index].fecha = hoy;
        } else {
            apt.pagos.push({ mes: mes, pagado: true, fecha: hoy });
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
    addBuilding(nombre, direccion, localidad, numApt, etiquetas = []) {
        const bId = `b-${Date.now()}`;
        const building = {
            id: bId,
            nombre: nombre,
            direccion: direccion,
            localidad: localidad,
            etiquetas: etiquetas,
            gastos: [],
            apartamentos: []
        };
        for(let i=1; i<=numApt; i++) {
            building.apartamentos.push({
                id: `${bId}-${i.toString().padStart(2,'0')}`,
                numero: i.toString().padStart(2,'0'),
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
    addManager(nombre, email, telefono, rol, id = null) {
        if (!this.data.gestores) this.data.gestores = [];
        
        if (id) {
            const manager = this.data.gestores.find(g => g.id === id);
            if (manager) {
                manager.nombre = nombre;
                manager.email = email;
                manager.telefono = telefono;
                manager.rol = rol;
            }
        } else {
            this.data.gestores.push({
                id: 'gestor-' + Date.now(),
                nombre,
                email,
                telefono,
                rol
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
     * Datos por defecto - Edificio Corredera
     */
    seedInitialData() {
        const apartamentos = [];
        
        // Crear 12 apartamentos
        for (let i = 1; i <= 12; i++) {
            const numero = i.toString().padStart(2, '0');
            // Las 2 últimas están vacías, las otras 10 ocupadas pero sin datos
            const isOcupado = i <= 10;
            
            apartamentos.push({
                id: `corredera-001-${numero}`,
                numero: numero,
                inquilino: isOcupado ? {
                    nombre: "",
                    telefono: "",
                    email: "",
                    alquiler: null,
                    fechaInicio: ""
                } : null,
                pagos: []
            });
        }

        const corredera = {
            id: "corredera-001",
            nombre: "Edificio Corredera",
            direccion: "Calle Corredera, s/n",
            localidad: "Jerez de la Frontera",
            etiquetas: ['Jerez Centro', 'Centro Histórico'],
            apartamentos: apartamentos
        };

        this.data.edificios.push(corredera);
        
        // Seed gestores iniciales si no hay
        if (!this.data.gestores || this.data.gestores.length === 0) {
            this.data.gestores = [
                { id: 'andres', nombre: 'Andrés Zambrana Linares', email: 'andres@ejemplo.com', telefono: '', rol: 'admin' },
                { id: 'manuel', nombre: 'Manuel Pedro Zambrana Bernabé', email: 'manuel@ejemplo.com', telefono: '', rol: 'admin' }
            ];
        }

        this.save();
    }
};
