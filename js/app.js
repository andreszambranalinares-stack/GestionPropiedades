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
        Store.setActiveUser(userId);
        const user = Store.getActiveUser();
        this.loadDashboard(user);
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

    saveTenant(buildingId, aptId, data) {
        Store.updateTenant(buildingId, aptId, data);
        this.openBuilding(buildingId); // Refresh view
    },

    vacateTenant(buildingId, aptId) {
        Store.vacateTenant(buildingId, aptId);
        this.openBuilding(buildingId); // Refresh view
    },

    markPaid(buildingId, aptId, mes) {
        Store.markPaid(buildingId, aptId, mes);
        this.openBuilding(buildingId); // Refresh view
    },

    unmarkPaid(buildingId, aptId, mes) {
        if(confirm("¿Estás seguro de que quieres anular el pago registrado para este mes?")) {
            Store.unmarkPaid(buildingId, aptId, mes);
            this.openBuilding(buildingId); // Refresh view
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
            const isPagado = isOcupado && apt.pagos.some(p => p.mes === mesActualFormat && p.pagado);
            const alquiler = isOcupado ? (parseFloat(apt.inquilino.alquiler) || 0) : 0;

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

    saveBuilding(id, nombre, direccion, localidad, numApt, etiquetas) {
        if(id) {
            Store.updateBuilding(id, nombre, direccion, localidad, etiquetas);
        } else {
            Store.addBuilding(nombre, direccion, localidad, numApt, etiquetas);
        }
        const user = Store.getActiveUser();
        this.loadDashboard(user);
    },

    loadManagersView() {
        const managers = Store.getManagers();
        UI.renderManagers(managers);
    },

    saveManager(id, nombre, email, telefono, rol) {
        Store.addManager(nombre, email, telefono, rol, id);
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
        if(confirm('¿Estás seguro de que quieres eliminar este gestor?')) {
            Store.removeManager(id);
            this.loadManagersView();
        }
    },

    // --- FUNCIONES V6 (Gastos, Stats, Historico, IDB) --- //
    
    saveGasto(bId, date, desc, type, amount) {
        Store.addGasto(bId, date, desc, type, amount);
        this.openBuilding(bId); // refresh
    },

    deleteGasto(bId, gastoId) {
        if(confirm("¿Borrar este gasto?")) {
            Store.deleteGasto(bId, gastoId);
            this.generateBuildingReport(bId); // refresh report live
        }
    },

    async uploadDocument(bId, aId, file) {
        const tenantAptLabel = `${bId}___${aId}`;
        await IDBManager.saveFile(tenantAptLabel, file);
    },

    async loadDocumentsList(bId, aId) {
        const tenantAptLabel = `${bId}___${aId}`;
        const files = await IDBManager.getFilesByTenant(tenantAptLabel);
        UI.renderDocumentList(files);
    },

    async deleteDocument(docId, tenantAptLabel) {
        if(confirm("¿Eliminar este documento permanentemente?")) {
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
        if(confirm("¿Eliminar permanentemente este registro del historial?")) {
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
            // Ingresos
            b.apartamentos.forEach(apt => {
                apt.pagos.forEach(p => {
                    if(p.pagado && p.mes.startsWith(year.toString())) {
                        const m = parseInt(p.mes.split('-')[1]) - 1; 
                        const amount = apt.inquilino ? (parseFloat(apt.inquilino.alquiler) || 0) : 0;
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
            // Ingresos
            b.apartamentos.forEach(apt => {
                apt.pagos.forEach(p => {
                    const[y, m] = p.mes.split('-');
                    if (p.pagado && y === year && validMonths.includes(m) && apt.inquilino) {
                        ingresos += parseFloat(apt.inquilino.alquiler) || 0;
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
