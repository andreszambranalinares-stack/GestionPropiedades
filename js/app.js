/**
 * App.js
 * Lógica principal del controlador y punto de entrada.
 */

const App = {
    init() {
        console.log("Inicializando Aplicación de Alquileres...");
        
        // 1. Inicializar Datos
        Store.init();
        
        // 2. Inicializar Eventos UI
        UI.init();

        // 3. Determinar el flujo inicial
        const user = Store.getActiveUser();
        
        if (user) {
            // Usuario logueado, ir al dashboard
            this.loadDashboard(user);
        } else {
            // No hay usuario, mostrar login
            UI.showLoginLayout();
        }
    },

    login(userId) {
        const managers = Store.getManagers();
        const userToLogin = managers.find(m => m.id === userId);
        if(!userToLogin) return;

        // Modal propio en lugar de window.prompt (bloqueado en muchos navegadores móviles)
        UI.openPinModal(userToLogin);
    },

    verifyPin(userId, pin) {
        const managers = Store.getManagers();
        const userToLogin = managers.find(m => m.id === userId);
        if(!userToLogin) return;

        if (pin === userToLogin.pin) {
            UI.closePinModal();
            Store.setActiveUser(userId);
            this.loadDashboard(userToLogin);
        } else {
            UI.showPinError();
        }
    },

    logout() {
        Store.logout();
        UI.showLoginLayout();
    },

    loadDashboard(user) {
        UI.updateHeaderActiveUser(user);
        const buildings = Store.getBuildings();
        const tags = Store.getAllTags();
        UI.renderDashboard(buildings, tags);
    },

    openBuilding(buildingId) {
        const building = Store.getBuildingById(buildingId);
        if (building) {
            UI.renderBuildingDetails(building);
        }
    },

    openTenantModal(buildingId, aptId) {
        const building = Store.getBuildingById(buildingId);
        if (building) {
            const apt = building.apartamentos.find(a => a.id === aptId);
            if (apt) {
                UI.openTenantModal(building, apt);
                this.loadDocumentsList(buildingId, aptId);
            }
        }
    },

    saveTenant(buildingId, aptId, tipoUnidad, data) {
        const user = Store.getActiveUser();
        if (user && user.rol === 'visualizador') {
            alert("Acción no permitida. Tu rol es de solo lectura.");
            return;
        }
        Store.updateTenant(buildingId, aptId, tipoUnidad, data);
        this.openBuilding(buildingId); // Refresh view
    },

    vacateTenant(buildingId, aptId) {
        const user = Store.getActiveUser();
        if (user && user.rol === 'visualizador') {
            alert("Acción no permitida. Tu rol es de solo lectura.");
            return;
        }
        if(confirm("¿Seguro que deseas marcar este apartamento como desocupado? Se archivarán los datos del inquilino en Historial.")) {
            Store.vacateTenant(buildingId, aptId);
            this.openBuilding(buildingId); // Refresh view
            this.loadHistoryView(); // Redirect a historico según spec de UI
        }
    },

    markPaid(buildingId, aptId, mes) {
        const user = Store.getActiveUser();
        if (user && user.rol === 'visualizador') return;
        Store.markPaid(buildingId, aptId, mes);
        this.openBuilding(buildingId); // Refresh view
        
        // Después de guardar el pago
        edificioActual = Store.getBuildingById(buildingId);
        actualizarBadgePendientes(); // Llamar función para actualizar badge
    },

    unmarkPaid(buildingId, aptId, mes) {
        const user = Store.getActiveUser();
        if (user && user.rol === 'visualizador') return;
        if(confirm("¿Estás seguro de que quieres anular el pago registrado para este mes?")) {
            Store.unmarkPaid(buildingId, aptId, mes);
            this.openBuilding(buildingId); // Refresh view

            edificioActual = Store.getBuildingById(buildingId);
            actualizarBadgePendientes();
        }
    },

    generateInvoiceOpts(buildingId, aptId) {
        const building = Store.getBuildingById(buildingId);
        if (building) {
            const apt = building.apartamentos.find(a => a.id === aptId);
            if (apt) {
                if (!apt.inquilino || !apt.inquilino.alquiler || apt.inquilino.alquiler <= 0) {
                    alert("Asegúrate de haber introducido el importe de alquiler para generar la factura.");
                    return;
                }
                UI.elements.invOptBId.value = buildingId;
                UI.elements.invOptAId.value = aptId;
                
                // Rellenar select
                UI.elements.invIssuerSelect.innerHTML = '<option value="">Selecciona quién factura</option>';
                const gestores = Store.getManagers();
                gestores.forEach(g => {
                    const opt = document.createElement('option');
                    opt.value = g.nombre;
                    opt.textContent = `${g.nombre} (${g.rol})`;
                    UI.elements.invIssuerSelect.appendChild(opt);
                });
                
                UI.elements.modalInvoiceOpts.showModal();
            }
        }
    },

    generateInvoiceFinal(buildingId, aptId, issuerName, pType, dStart, dEnd, extras) {
        const building = Store.getBuildingById(buildingId);
        if (building) {
            const apt = building.apartamentos.find(a => a.id === aptId);
            if (apt) {
                // mock un usuario con el nombre seleccionado para reusar renderInvoice
                const mockUser = { nombre: issuerName };
                UI.renderInvoice(building, apt, mockUser, pType, dStart, dEnd, extras);
            }
        }
    },

    generateBuildingReport(buildingId) {
        const building = Store.getBuildingById(buildingId);
        if(!building) return;

        const fechaActual = new Date();
        const mesActualFormat = `${fechaActual.getFullYear()}-${String(fechaActual.getMonth() + 1).padStart(2, '0')}`; // Ej: 2026-04
        const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        const monthLabel = monthNames[fechaActual.getMonth()] + " " + fechaActual.getFullYear();
        
        let totalCollected = 0;
        let reportItems = [];

        building.apartamentos.forEach(apt => {
            const isOcupado = apt.inquilino !== null;
            const pagoMes = apt.pagos.find(p => p.mes === mesActualFormat && p.pagado);
            const isPagado = isOcupado && !!pagoMes;
            // Usar el importe guardado en el pago; si es un pago antiguo sin importe, usar el alquiler actual
            const alquiler = isOcupado
                ? ((isPagado && typeof pagoMes.importe === 'number') ? pagoMes.importe : (parseFloat(apt.inquilino.alquiler) || 0))
                : 0;

            let status = 'vacant';
            if (isOcupado) {
                status = isPagado ? 'paid' : 'pending';
                if (isPagado) totalCollected += alquiler;
            }

            reportItems.push({
                numApt: apt.numero,
                inquilino: isOcupado ? (apt.inquilino.nombre || 'Sin nombre') : '-',
                status: status,
                alquiler: alquiler
            });
        });

        // Filtrar gastos del mes
        const gastosDelMes = building.gastos ? building.gastos.filter(g => g.fecha.startsWith(mesActualFormat)) : [];
        let totalExpenses = 0;
        gastosDelMes.forEach(g => totalExpenses += g.importe);

        UI.renderBuildingReport(building, totalCollected, reportItems, totalExpenses, monthLabel, gastosDelMes);
    },

    saveBuilding(id, nombre, direccion, localidad, numApt, etiquetas, tipoInmueble) {
        const user = Store.getActiveUser();
        if (user && user.rol === 'visualizador') {
            alert("Permiso denegado.");
            return;
        }
        if(id) {
            Store.updateBuilding(id, nombre, direccion, localidad, etiquetas);
        } else {
            Store.addBuilding(nombre, direccion, localidad, numApt, etiquetas, tipoInmueble);
        }
        this.loadDashboard(user);
    },

    loadManagersView() {
        const managers = Store.getManagers();
        UI.renderManagers(managers);
    },

    saveManager(id, nombre, email, telefono, rol, pin) {
        const user = Store.getActiveUser();
        if (user && user.rol !== 'admin') {
            alert("Solo un Administrador puede crear o modificar gestores.");
            return;
        }
        Store.addManager(nombre, email, telefono, rol, pin, id);
        this.loadManagersView();
    },

    openEditManager(id) {
        const managers = Store.getManagers();
        const manager = managers.find(m => m.id === id);
        if(manager) {
            UI.elements.modalManagerTitle.textContent = "Editar Gestor";
            UI.elements.managerEditId.value = manager.id;
            UI.elements.managerName.value = manager.nombre;
            UI.elements.managerEmail.value = manager.email;
            UI.elements.managerPhone.value = manager.telefono || '';
            UI.elements.managerRole.value = manager.rol;
            UI.elements.modalManager.showModal();
        }
    },

    removeManager(id) {
        const user = Store.getActiveUser();
        if (user && user.rol !== 'admin') {
            alert("Solo un Administrador puede eliminar gestores.");
            return;
        }
        if(confirm('¿Estás seguro de que quieres eliminar este gestor permanentemente?')) {
            Store.removeManager(id);
            this.loadManagersView();
        }
    },

    // --- FUNCIONES V6 (Gastos, Stats, Historico, IDB) --- //
    
    saveGasto(bId, date, desc, type, amount) {
        const user = Store.getActiveUser();
        if (user && user.rol === 'visualizador') return;
        Store.addGasto(bId, date, desc, type, amount);
        this.openBuilding(bId); // refresh
    },

    deleteGasto(bId, gastoId) {
        const user = Store.getActiveUser();
        if (user && user.rol === 'visualizador') return;
        if(confirm("¿Estás seguro de que quieres borrar este gasto? Esta acción no se puede deshacer.")) {
            Store.deleteGasto(bId, gastoId);
            this.generateBuildingReport(bId); // refresh report live
        }
    },

    async uploadDocument(bId, aId, file) {
        const user = Store.getActiveUser();
        if (user && user.rol === 'visualizador') return;
        const tenantAptLabel = `${bId}___${aId}`;
        await IDBManager.saveFile(tenantAptLabel, file);
    },

    async loadDocumentsList(bId, aId) {
        const tenantAptLabel = `${bId}___${aId}`;
        const files = await IDBManager.getFilesByTenant(tenantAptLabel);
        UI.renderDocumentList(files);
    },

    async deleteDocument(docId, tenantAptLabel) {
        const user = Store.getActiveUser();
        if (user && user.rol === 'visualizador') return;
        if(confirm("¿Eliminar este documento permanentemente? Esta acción no se puede deshacer.")) {
            await IDBManager.deleteFile(docId);
            const [bId, aId] = tenantAptLabel.split('___');
            this.loadDocumentsList(bId, aId);
        }
    },

    downloadDocument(fileRecord) {
        const url = URL.createObjectURL(fileRecord.blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileRecord.fileName;
        a.click();
        URL.revokeObjectURL(url);
    },

    loadHistoryView() {
        const hist = Store.getHistorico();
        UI.renderHistory(hist);
    },

    deleteHistorico(id) {
        const user = Store.getActiveUser();
        if (user && user.rol === 'visualizador') return;
        if(confirm("¿Estás seguro de que quieres eliminar permanentemente este registro del historial? Se perderán estos datos para siempre.")) {
            Store.deleteHistorico(id);
            this.loadHistoryView();
        }
    },

    loadStatsView() {
        const year = new Date().getFullYear();
        const edificios = Store.getBuildings();
        let dataChart = [0,0,0,0,0,0,0,0,0,0,0,0];

        // Sumar todos los ingresos del año por mes y restar gastos
        edificios.forEach(b => {
            // Ingresos (importe guardado en el pago; fallback al alquiler actual para pagos antiguos)
            b.apartamentos.forEach(apt => {
                apt.pagos.forEach(p => {
                    if(p.pagado && p.mes.startsWith(year.toString())) {
                        const m = parseInt(p.mes.split('-')[1]) - 1;
                        const amount = (typeof p.importe === 'number')
                            ? p.importe
                            : (apt.inquilino ? (parseFloat(apt.inquilino.alquiler) || 0) : 0);
                        if(amount > 0) {
                            dataChart[m] += amount;
                        }
                    }
                });
            });
            // Gastos
            if(b.gastos) {
                b.gastos.forEach(g => {
                    if(g.fecha.startsWith(year.toString())) {
                        const m = parseInt(g.fecha.split('-')[1]) - 1;
                        dataChart[m] -= g.importe;
                    }
                });
            }
        });

        UI.renderStats(dataChart);
    },

    loadTaxView() {
        UI.showAppLayout();
        UI.showView('tax');
        UI.elements.taxContent.style.display = 'none'; // reset
        // Año y trimestre actuales por defecto
        if (!UI.elements.taxYear.value) {
            const hoy = new Date();
            UI.elements.taxYear.value = hoy.getFullYear();
            UI.elements.taxTrim.value = Math.floor(hoy.getMonth() / 3) + 1;
        }
    },

    generateTaxReport() {
        const trim = parseInt(UI.elements.taxTrim.value);
        const year = UI.elements.taxYear.value;
        const edificios = Store.getBuildings();

        let validMonths = [];
        if (trim === 1) validMonths = ['01','02','03'];
        else if(trim === 2) validMonths = ['04','05','06'];
        else if(trim === 3) validMonths = ['07','08','09'];
        else if(trim === 4) validMonths = ['10','11','12'];

        let ingresos = 0;
        let gastos = 0;

        edificios.forEach(b => {
            // Ingresos (importe guardado en el pago; fallback al alquiler actual para pagos antiguos)
            b.apartamentos.forEach(apt => {
                apt.pagos.forEach(p => {
                    const[y, m] = p.mes.split('-');
                    if (p.pagado && y === year && validMonths.includes(m)) {
                        ingresos += (typeof p.importe === 'number')
                            ? p.importe
                            : (apt.inquilino ? (parseFloat(apt.inquilino.alquiler) || 0) : 0);
                    }
                });
            });

            // Gastos
            if(b.gastos) {
                b.gastos.forEach(g => {
                    const[y, m] = g.fecha.split('-');
                    if(y === year && validMonths.includes(m)) {
                        gastos += g.importe;
                    }
                });
            }
        });

        const neto = ingresos - gastos;
        UI.renderTaxReport(trim, year, ingresos, gastos, neto);
    }
};

// Arrancar la app cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

// Variable global para compatibilidad con el modo estricto del prompt
let edificioActual;

function calcularPendientesEdificio(edificio) {
    if (!edificio) return 0;
    const mesActual = new Date().toISOString().slice(0, 7);
    
    return edificio.apartamentos.filter(apt => {
        if (!apt.inquilino) return false;
        const pago = apt.pagos && apt.pagos.find(p => p.mes === mesActual);
        return !pago || !pago.pagado;
    }).length;
}

// Función auxiliar
function actualizarBadgePendientes() {
    if (typeof calcularPendientesEdificio === 'function' && 
        typeof edificioActual !== 'undefined' && edificioActual) {
        const pendientes = calcularPendientesEdificio(edificioActual);
        const badgeDiv = document.getElementById('buildingPendingBadge');
        if (badgeDiv) {
            if (pendientes > 0) {
                const plural = pendientes > 1 ? 's' : '';
                badgeDiv.innerHTML = `
                    <div class="building-pending-badge">
                        <i class="ti ti-alert-circle" aria-hidden="true"></i> ${pendientes} apartamento${plural} pendiente${plural}
                    </div>
                `;
            } else {
                badgeDiv.innerHTML = '';
            }
        }
    }
}
