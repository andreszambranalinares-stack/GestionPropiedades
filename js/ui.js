/**
 * UI.js
 * Maneja la lógica de visualización, manipulación del DOM y eventos.
 */

const UI = {
    // Referencias a contenedores globales
    containers: {
        login: document.getElementById('view-login'),
        header: document.getElementById('app-header'),
        main: document.getElementById('app-main'),
        dashboard: document.getElementById('view-dashboard'),
        buildingDetails: document.getElementById('view-building-details'),
        historico: document.getElementById('view-history'),
        stats: document.getElementById('view-stats'),
        tax: document.getElementById('view-tax')
    },

    // Referencias a elementos específicos
    elements: {
        activeUserBadge: document.getElementById('active-user-badge'),
        btnLogout: document.getElementById('btn-logout'),
        headerTitle: document.getElementById('header-title'),
        buildingsList: document.getElementById('buildings-list'),
        
        // Building Details
        btnBackDashboard: document.getElementById('btn-back-dashboard'),
        currentBuildingName: document.getElementById('current-building-name'),
        apartmentsList: document.getElementById('apartments-list'),
        
        // Modal Inquilino
        modalTenant: document.getElementById('modal-tenant'),
        formTenant: document.getElementById('form-tenant'),
        btnCancelTenant: document.getElementById('btn-cancel-tenant'),
        btnVacateTenant: document.getElementById('btn-vacate-tenant'),
        
        // Inputs form
        tenantUnitType: document.getElementById('tenant-unit-type'),
        tenantName: document.getElementById('tenant-name'),
        tenantPhone: document.getElementById('tenant-phone'),
        tenantEmail: document.getElementById('tenant-email'),
        tenantEntry: document.getElementById('tenant-entry'),
        tenantRent: document.getElementById('tenant-rent'),
        modalAptId: document.getElementById('modal-apt-id'),
        modalBuildingId: document.getElementById('modal-building-id'),

        // Invoice
        btnBackFromInvoice: document.getElementById('btn-back-from-invoice'),
        btnPrintInvoice: document.getElementById('btn-print-invoice'),
        invNumber: document.getElementById('inv-number'),
        invDate: document.getElementById('inv-date'),
        invIssuerName: document.getElementById('inv-issuer-name'),
        invTenantName: document.getElementById('inv-tenant-name'),
        invTenantAddress: document.getElementById('inv-tenant-address'),
        invMonth: document.getElementById('inv-month'),
        invBuildingDetail: document.getElementById('inv-building-detail'),
        invAmount: document.getElementById('inv-amount'),
        invTotal: document.getElementById('inv-total'),
        
        // Report
        btnGenerateReport: document.getElementById('btn-generate-report'),
        btnBackFromReport: document.getElementById('btn-back-from-report'),
        btnPrintReport: document.getElementById('btn-print-report'),
        repBuildingName: document.getElementById('rep-building-name'),
        repMonthYear: document.getElementById('rep-month-year'),
        repDateGenerated: document.getElementById('rep-date-generated'),
        reportTbody: document.getElementById('report-tbody'),
        repTotalExpected: document.getElementById('rep-total-expected'),
        repTotalCollected: document.getElementById('rep-total-collected'),

        // New Building Modal
        btnNewBuilding: document.getElementById('btn-new-building'),
        modalBuilding: document.getElementById('modal-building'),
        formBuilding: document.getElementById('form-building'),
        btnCancelBuilding: document.getElementById('btn-cancel-building'),
        bldName: document.getElementById('bld-name'),
        bldAddress: document.getElementById('bld-address'),
        bldCity: document.getElementById('bld-city'),
        bldApts: document.getElementById('bld-apts'),
        bldEditId: document.getElementById('bld-edit-id'),
        modalBuildingTitle: document.getElementById('modal-building-title'),
        btnEditBuilding: document.getElementById('btn-edit-building'),
        filterTagSelect: document.getElementById('filter-tag-select'),
        searchBuilding: document.getElementById('search-building'),
        dashboardSummary: document.getElementById('dashboard-summary'),

        // Modal PIN
        modalPin: document.getElementById('modal-pin'),
        formPin: document.getElementById('form-pin'),
        pinInput: document.getElementById('pin-input'),
        pinUserName: document.getElementById('pin-user-name'),
        pinError: document.getElementById('pin-error'),
        btnCancelPin: document.getElementById('btn-cancel-pin'),
        loginHint: document.getElementById('login-hint'),

        // Managers
        btnManageManagers: document.getElementById('btn-manage-managers'),
        btnBackFromManagers: document.getElementById('btn-back-from-managers'),
        btnNewManager: document.getElementById('btn-new-manager'),
        managersList: document.getElementById('managers-list'),
        modalManager: document.getElementById('modal-manager'),
        formManager: document.getElementById('form-manager'),
        btnCancelManager: document.getElementById('btn-cancel-manager'),
        managerName: document.getElementById('manager-name'),
        managerEmail: document.getElementById('manager-email'),
        managerPhone: document.getElementById('manager-phone'),
        managerRole: document.getElementById('manager-role'),
        managerPin: document.getElementById('manager-pin'),
        managerEditId: document.getElementById('manager-edit-id'),
        modalManagerTitle: document.getElementById('modal-manager-title'),
        
        btnMobileMenu: document.getElementById('btn-mobile-menu'),
        appNav: document.getElementById('app-nav'),

        // Tags
        tagsInput: document.getElementById('tagsInput'),
        tagInput: document.getElementById('tagInput'),

        // Invoice Opts
        modalInvoiceOpts: document.getElementById('modal-invoice-options'),
        formInvoiceOpts: document.getElementById('form-invoice-opts'),
        invOptBId: document.getElementById('inv-opt-b-id'),
        invOptAId: document.getElementById('inv-opt-a-id'),
        invIssuerSelect: document.getElementById('inv-issuer-select'),
        btnCancelInvOpts: document.getElementById('btn-cancel-inv-opts'),
        
        // Supplements & Period Options
        invPeriodType: document.getElementById('inv-period-type'),
        invCustomDates: document.getElementById('inv-custom-dates'),
        invDateStart: document.getElementById('inv-date-start'),
        invDateEnd: document.getElementById('inv-date-end'),
        invSupAgua: document.getElementById('inv-sup-agua'),
        invSupLuz: document.getElementById('inv-sup-luz'),
        invSupInternet: document.getElementById('inv-sup-internet'),
        invSupComunidad: document.getElementById('inv-sup-comunidad'),

        // Report additions (Gastos)
        reportGastosTbody: document.getElementById('report-gastos-tbody'),
        repTotalExpenses: document.getElementById('rep-total-expenses'),
        repTotalNet: document.getElementById('rep-total-net'),

        // Modal Expenses
        modalExpense: document.getElementById('modal-expense'),
        formExpense: document.getElementById('form-expense'),
        expenseBId: document.getElementById('expense-b-id'),
        expenseDesc: document.getElementById('expense-desc'),
        expenseType: document.getElementById('expense-type'),
        expenseDate: document.getElementById('expense-date'),
        expenseAmount: document.getElementById('expense-amount'),

        // Historico & Búsquedas
        historicoTbody: document.getElementById('historico-tbody'),

        // Stats & Tax
        chartContainer: document.getElementById('chart-container'),
        taxYear: document.getElementById('tax-year'),
        taxTrim: document.getElementById('tax-trim'),
        taxContent: document.getElementById('tax-content'),
        taxPeriodTitle: document.getElementById('tax-period-title'),
        taxIngresos: document.getElementById('tax-ingresos'),
        taxGastos: document.getElementById('tax-gastos'),
        taxNeto: document.getElementById('tax-neto'),

        // Documents
        tenantFileUpload: document.getElementById('tenant-file-upload'),
        tenantFilesList: document.getElementById('tenant-files-list')
    },
    
    tagsActuales: [],
    pinUserId: null,

    init() {
        this.bindEvents();
    },

    bindEvents() {
        // Eventos Modal PIN (login)
        this.elements.formPin.addEventListener('submit', (e) => {
            e.preventDefault();
            App.verifyPin(this.pinUserId, this.elements.pinInput.value);
        });
        this.elements.btnCancelPin.addEventListener('click', () => {
            this.elements.modalPin.close();
        });
        this.elements.pinInput.addEventListener('input', () => {
            this.elements.pinError.classList.add('hidden');
        });

        // Eventos Header
        this.elements.btnLogout.addEventListener('click', () => {
            App.logout();
        });

        this.elements.btnMobileMenu.addEventListener('click', (e) => {
            e.stopPropagation();
            this.elements.appNav.classList.toggle('nav-active');
        });
        // Esconder el menú móvil si se hace clic en un nav link o fuera del menú
        this.elements.appNav.querySelectorAll('a').forEach(aEl => {
            aEl.addEventListener('click', () => {
                this.elements.appNav.classList.remove('nav-active');
            });
        });
        document.addEventListener('click', (e) => {
            if (!this.elements.appNav.contains(e.target)) {
                this.elements.appNav.classList.remove('nav-active');
            }
        });

        // Eventos Dashboard
        this.elements.btnBackDashboard.addEventListener('click', () => {
            const user = Store.getActiveUser();
            App.loadDashboard(user);
        });

        // Eventos Modal Inquilino
        this.elements.btnCancelTenant.addEventListener('click', () => {
            this.elements.modalTenant.close();
        });

        this.elements.formTenant.addEventListener('submit', (e) => {
            e.preventDefault();
            this.elements.modalTenant.close();
            const bId = this.elements.modalBuildingId.value;
            const aId = this.elements.modalAptId.value;
            const tipoUnidad = this.elements.tenantUnitType.value;
            const data = {
                nombre: this.elements.tenantName.value,
                telefono: this.elements.tenantPhone.value,
                email: this.elements.tenantEmail.value,
                fechaEntrada: this.elements.tenantEntry.value,
                alquiler: parseFloat(this.elements.tenantRent.value) || 0
            };
            App.saveTenant(bId, aId, tipoUnidad, data);
        });

        // Evento de Subida de Archivo
        this.elements.tenantFileUpload.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if(!file) return;
            const bId = this.elements.modalBuildingId.value;
            const aId = this.elements.modalAptId.value;
            
            this.elements.tenantFileUpload.disabled = true;
            try {
                await App.uploadDocument(bId, aId, file);
                this.elements.tenantFileUpload.value = '';
                App.loadDocumentsList(bId, aId);
            } catch (err) {
                alert("Error al subir archivo");
            }
            this.elements.tenantFileUpload.disabled = false;
        });

        this.elements.btnVacateTenant.addEventListener('click', () => {
            const bId = this.elements.modalBuildingId.value;
            const aId = this.elements.modalAptId.value;
            this.elements.modalTenant.close();
            App.vacateTenant(bId, aId); // App ya pide confirmación y redirige al historial
        });

        // Eventos Invoice
        this.elements.btnBackFromInvoice.addEventListener('click', () => {
            this.showAppLayout();
            this.showView('building-details');
        });

        this.elements.btnPrintInvoice.addEventListener('click', () => {
            window.print();
        });

        // Eventos Reporte
        this.elements.btnBackFromReport.addEventListener('click', () => {
            this.showAppLayout();
            this.showView('building-details');
        });
        this.elements.btnPrintReport.addEventListener('click', () => {
            window.print();
        });
        
        // Eventos Building, Filtro y Buscador
        this.elements.filterTagSelect.addEventListener('change', () => {
            const user = Store.getActiveUser();
            App.loadDashboard(user);
        });
        this.elements.searchBuilding.addEventListener('input', () => {
            const user = Store.getActiveUser();
            App.loadDashboard(user);
        });

        this.elements.btnNewBuilding.addEventListener('click', () => {
             this.elements.modalBuildingTitle.textContent = "Nuevo Inmueble";
             this.elements.bldEditId.value = '';
             this.elements.bldApts.disabled = false;
             document.getElementById('bld-type').disabled = false;
             this.elements.formBuilding.reset();
             document.getElementById('bld-apts-group').style.display = 'block';
             document.getElementById('bld-apts-label').textContent = 'Nº de Apartamentos (*)';
             document.getElementById('bld-type').value = 'edificio';
             this.tagsActuales = [];
             this.renderizarTags();
             this.elements.modalBuilding.showModal();
        });
        this.elements.btnEditBuilding.addEventListener('click', () => {
             const building = Store.getBuildingById(this.elements.modalBuildingId.value);
             if(building) {
                 this.elements.modalBuildingTitle.textContent = "Editar Inmueble";
                 this.elements.bldEditId.value = building.id;
                 this.elements.bldName.value = building.nombre;
                 this.elements.bldAddress.value = building.direccion;
                 this.elements.bldCity.value = building.localidad;
                 this.elements.bldApts.value = building.apartamentos.length;
                 this.elements.bldApts.disabled = true; // No permitir cambiar nº apts
                 document.getElementById('bld-type').value = building.tipoInmueble || 'edificio';
                 document.getElementById('bld-type').disabled = true; // No permitir cambiar el tipo
                 
                 // trigger change logic for layout without re-enabling
                 if (building.tipoInmueble === 'local' || building.tipoInmueble === 'piso') {
                     document.getElementById('bld-apts-group').style.display = 'none';
                 } else if (building.tipoInmueble === 'garaje') {
                     document.getElementById('bld-apts-group').style.display = 'block';
                     document.getElementById('bld-apts-label').textContent = 'Nº de Plazas (*)';
                 } else {
                     document.getElementById('bld-apts-group').style.display = 'block';
                     document.getElementById('bld-apts-label').textContent = 'Nº de Apartamentos (*)';
                 }

                 this.tagsActuales = building.etiquetas ? building.etiquetas.slice() : [];
                 this.renderizarTags();
                 this.elements.modalBuilding.showModal();
             }
        });
        this.elements.btnCancelBuilding.addEventListener('click', () => {
            this.elements.modalBuilding.close();
        });
        this.elements.formBuilding.addEventListener('submit', (e) => {
            e.preventDefault();
            this.elements.modalBuilding.close();
            const id = this.elements.bldEditId.value;
            const nombre = this.elements.bldName.value;
            const direccion = this.elements.bldAddress.value;
            const localidad = this.elements.bldCity.value;
            const numApt = parseInt(this.elements.bldApts.value) || 1;
            const tipoInmueble = document.getElementById('bld-type').value;
            App.saveBuilding(id, nombre, direccion, localidad, numApt, this.tagsActuales.slice(), tipoInmueble);
        });

        document.getElementById('bld-type').addEventListener('change', (e) => {
            const val = e.target.value;
            const group = document.getElementById('bld-apts-group');
            const label = document.getElementById('bld-apts-label');
            const input = document.getElementById('bld-apts');
            if (val === 'edificio') {
                group.style.display = 'block';
                label.textContent = 'Nº de Apartamentos (*)';
                input.min = "1"; input.value = "1";
            } else if (val === 'garaje') {
                group.style.display = 'block';
                label.textContent = 'Nº de Plazas (*)';
                input.min = "1"; input.value = "1";
            } else {
                group.style.display = 'none';
                input.value = "1";
            }
        });

        // Tags Evento
        this.elements.tagInput.addEventListener('keypress', (e) => this.agregarTag(e));

        // Eventos Managers
        this.elements.btnManageManagers.addEventListener('click', () => {
            App.loadManagersView();
        });
        this.elements.btnBackFromManagers.addEventListener('click', () => {
             const user = Store.getActiveUser();
             App.loadDashboard(user);
        });
        this.elements.btnNewManager.addEventListener('click', () => {
            this.elements.modalManagerTitle.textContent = "Añadir Nuevo Gestor";
            this.elements.managerEditId.value = '';
            this.elements.formManager.reset();
            this.elements.modalManager.showModal();
        });
        this.elements.btnCancelManager.addEventListener('click', () => {
            this.elements.modalManager.close();
        });
        this.elements.formManager.addEventListener('submit', (e) => {
            e.preventDefault();
            const id = this.elements.managerEditId.value;
            const nombre = this.elements.managerName.value;
            const email = this.elements.managerEmail.value;
            const telefono = this.elements.managerPhone.value;
            const rol = this.elements.managerRole.value;
            const pin = this.elements.managerPin.value;
            App.saveManager(id, nombre, email, telefono, rol, pin);
            this.elements.modalManager.close();
        });

        // Eventos Invoice Opts
        this.elements.invPeriodType.addEventListener('change', (e) => {
            if(e.target.value === 'custom') {
                this.elements.invCustomDates.style.display = 'flex';
            } else {
                this.elements.invCustomDates.style.display = 'none';
            }
        });

        this.elements.btnCancelInvOpts.addEventListener('click', () => {
            this.elements.modalInvoiceOpts.close();
        });
        this.elements.formInvoiceOpts.addEventListener('submit', (e) => {
            e.preventDefault();
            const bId = this.elements.invOptBId.value;
            const aId = this.elements.invOptAId.value;
            const issuerName = this.elements.invIssuerSelect.value;
            
            const pType = this.elements.invPeriodType.value;
            const dStart = this.elements.invDateStart.value;
            const dEnd = this.elements.invDateEnd.value;
            
            const extras = {
                agua: parseFloat(this.elements.invSupAgua.value) || 0,
                luz: parseFloat(this.elements.invSupLuz.value) || 0,
                internet: parseFloat(this.elements.invSupInternet.value) || 0,
                comunidad: parseFloat(this.elements.invSupComunidad.value) || 0
            };

            this.elements.modalInvoiceOpts.close();
            App.generateInvoiceFinal(bId, aId, issuerName, pType, dStart, dEnd, extras);
        });

        // Evento Generar Reporte Detalle Edificio
        this.elements.btnGenerateReport.addEventListener('click', () => {
            const bId = this.elements.modalBuildingId.value;
            App.generateBuildingReport(bId);
        });

        // Evento Gastos
        this.elements.formExpense.addEventListener('submit', (e) => {
            e.preventDefault();
            const bId = this.elements.expenseBId.value;
            const desc = this.elements.expenseDesc.value;
            const type = this.elements.expenseType.value;
            const date = this.elements.expenseDate.value;
            const amount = this.elements.expenseAmount.value;
            this.elements.modalExpense.close();
            App.saveGasto(bId, date, desc, type, amount);
        });
    },

    openPinModal(user) {
        this.pinUserId = user.id;
        this.elements.pinUserName.textContent = user.nombre.split(' ')[0];
        this.elements.pinInput.value = '';
        this.elements.pinError.classList.add('hidden');
        this.elements.modalPin.showModal();
        this.elements.pinInput.focus();
    },

    showPinError() {
        this.elements.pinError.classList.remove('hidden');
        this.elements.pinInput.value = '';
        this.elements.pinInput.focus();
    },

    closePinModal() {
        this.elements.modalPin.close();
    },

    openExpenseModal(bId) {
        this.elements.expenseBId.value = bId;
        this.elements.formExpense.reset();
        this.elements.expenseDate.value = new Date().toISOString().split('T')[0];
        this.elements.modalExpense.showModal();
    },

    // FUNCIONES DE ETIQUETAS
    agregarTag(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            const input = this.elements.tagInput;
            const tag = input.value.trim();
            
            if (tag && !this.tagsActuales.includes(tag)) {
                this.tagsActuales.push(tag);
                this.renderizarTags();
                input.value = '';
            }
        }
    },

    renderizarTags() {
        const container = this.elements.tagsInput;
        container.innerHTML = '';

        this.tagsActuales.forEach(tag => {
            const tagEl = document.createElement('div');
            tagEl.className = 'tag-item';
            tagEl.appendChild(document.createTextNode(tag));
            const btnRemove = document.createElement('button');
            btnRemove.type = 'button';
            btnRemove.textContent = '×';
            btnRemove.addEventListener('click', () => this.eliminarTag(tag));
            tagEl.appendChild(btnRemove);
            container.appendChild(tagEl);
        });

        container.appendChild(this.elements.tagInput);
    },

    eliminarTag(tag) {
        this.tagsActuales = this.tagsActuales.filter(t => t !== tag);
        this.renderizarTags();
    },

    exportBackup() {
        const dataStr = Store.exportDataString();
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `backup_alquileres_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    },

    importBackup(event) {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target.result;
            if (Store.importDataString(content)) {
                alert("Datos importados con éxito. La aplicación se recargará.");
                location.reload();
            } else {
                alert("El archivo JSON no es válido o está corrupto.");
            }
        };
        reader.readAsText(file);
    },

    /**
     * Renderización y control de Vistas
     */
    showView(viewId) {
        // Ocultar todas las vistas
        document.querySelectorAll('.view').forEach(view => {
            view.classList.remove('view-active');
        });
        
        // Mostrar la solicitada
        const targetView = document.getElementById(`view-${viewId}`);
        if(targetView) {
            targetView.classList.add('view-active');
        }
    },

    showAppLayout() {
        this.containers.login.classList.add('hidden');
        this.containers.header.classList.remove('hidden');
        this.containers.main.classList.remove('hidden');
    },

    showLoginLayout() {
        this.containers.login.classList.remove('hidden');
        this.containers.header.classList.add('hidden');
        this.containers.main.classList.add('hidden');
        this.elements.appNav.classList.remove('nav-active'); // cerrar hoja de menú móvil
        this.showView('login');

        // Dynamically render managers
        const gestores = Store.getManagers();
        const userButtonsContainer = document.querySelector('.user-buttons');
        if(userButtonsContainer) {
            userButtonsContainer.innerHTML = '';
            gestores.forEach(g => {
                const btn = document.createElement('button');
                btn.className = 'btn btn-large btn-user';
                btn.textContent = g.nombre;
                btn.addEventListener('click', () => {
                    App.login(g.id);
                });
                userButtonsContainer.appendChild(btn);
            });
        }

        // Primer arranque: solo existe el admin de fábrica → mostrar el PIN inicial
        if (this.elements.loginHint) {
            const soloAdminInicial = gestores.length === 1 && gestores[0].id === 'admin-init' && gestores[0].pin === '0000';
            if (soloAdminInicial) {
                this.elements.loginHint.textContent = 'Primer acceso: entra con el PIN 0000 y crea tus gestores en "Gestionar Gestores".';
                this.elements.loginHint.classList.remove('hidden');
            } else {
                this.elements.loginHint.classList.add('hidden');
            }
        }
    },

    updateHeaderActiveUser(user) {
        if(user) {
            const shortName = user.nombre.split(' ')[0];
            let rolText = '';
            if (user.rol === 'admin') rolText = 'Admin';
            if (user.rol === 'gestor') rolText = 'Gestor';
            if (user.rol === 'visualizador') rolText = 'Solo Vista';
            this.elements.activeUserBadge.textContent = `${shortName} · ${rolText}`;
        }
    },

    /**
     * Render principal de Dashboard
     */
    renderDashboard(buildings, allTags = []) {
        this.showAppLayout();
        this.showView('dashboard');
        this.elements.headerTitle.textContent = "Mis Inmuebles";

        const currentUser = Store.getActiveUser();
        if (currentUser && currentUser.rol === 'visualizador') {
            document.getElementById('btn-new-building').style.display = 'none';
        } else {
            document.getElementById('btn-new-building').style.display = 'inline-flex';
        }
        
        if (currentUser && currentUser.rol !== 'admin') {
            document.getElementById('btn-manage-managers').style.display = 'none';
        } else {
            document.getElementById('btn-manage-managers').style.display = 'inline-flex';
        }
        
        // Rellenar select de filtro
        const filterVal = this.elements.filterTagSelect.value;
        this.elements.filterTagSelect.innerHTML = '<option value="">Todos</option>';
        allTags.forEach(t => {
            const opt = document.createElement('option');
            opt.value = t;
            opt.textContent = t;
            if(t === filterVal) opt.selected = true;
            this.elements.filterTagSelect.appendChild(opt);
        });

        // Resumen global de la cartera (mes en curso)
        this.renderDashboardSummary(buildings);

        // Filtrar edificios por etiqueta y por texto de búsqueda
        let displayedBuildings = buildings;
        if (filterVal) {
            displayedBuildings = displayedBuildings.filter(b => b.etiquetas && b.etiquetas.includes(filterVal));
        }
        const searchVal = (this.elements.searchBuilding.value || '').trim().toLowerCase();
        if (searchVal) {
            displayedBuildings = displayedBuildings.filter(b =>
                (b.nombre || '').toLowerCase().includes(searchVal) ||
                (b.direccion || '').toLowerCase().includes(searchVal) ||
                (b.localidad || '').toLowerCase().includes(searchVal)
            );
        }

        this.elements.buildingsList.innerHTML = '';

        if (displayedBuildings.length === 0) {
            const msg = (buildings.length === 0)
                ? '<h3 style="margin-bottom: 15px; color: var(--color-secondary);">¡Bienvenido a tu panel vacío!</h3><p>Aún no has registrado ningún edificio o unidad de alquiler.</p>'
                : '<p>Ningún inmueble coincide con la búsqueda o el filtro actual.</p>';
            this.elements.buildingsList.innerHTML = `<div style="grid-column: 1 / -1; padding: 40px; text-align: center; color: var(--color-text-muted); background: white; border-radius: 8px; border: 1px dashed var(--color-border);">${msg}</div>`;
            return;
        }

        const mesActual = new Date().toISOString().slice(0, 7);

        displayedBuildings.forEach(building => {
            const numApartamentos = building.apartamentos.length;
            const ocupados = building.apartamentos.filter(a => a.inquilino !== null).length;
            const pendientes = building.apartamentos.filter(a => {
                if (!a.inquilino) return false;
                const pago = (a.pagos || []).find(p => p.mes === mesActual);
                return !pago || !pago.pagado;
            }).length;

            const card = document.createElement('div');
            card.className = 'card building-card';

            let etiquetasHTML = '';
            if (building.etiquetas && building.etiquetas.length > 0) {
                etiquetasHTML = '<div>' +
                    building.etiquetas.map(tag => `<span class="tag">${tag}</span>`).join('') +
                    '</div>';
            }

            const iconState = pendientes > 0 ? 'pending' : (ocupados === 0 ? 'vacant' : '');
            const pendientesHTML = pendientes > 0
                ? `<span class="badge badge-pending"><i class="ti ti-alert-circle" aria-hidden="true"></i> ${pendientes} sin cobrar</span>`
                : (ocupados > 0 ? `<span class="badge badge-active"><i class="ti ti-check" aria-hidden="true"></i> Al día</span>` : '');

            card.innerHTML = `
                <div class="prop-card-head">
                    <div class="prop-icon ${iconState}"><i class="ti ti-building" aria-hidden="true"></i></div>
                    <div>
                        <h4 class="prop-name">${building.nombre}</h4>
                        <p class="prop-addr">${building.localidad || ''}</p>
                    </div>
                </div>
                ${etiquetasHTML}
                <div class="prop-occupancy">
                    <span><strong>${ocupados}</strong> de ${numApartamentos} unidades ocupadas</span>${pendientesHTML}
                </div>
                <button class="btn btn-primary btn-block" onclick="App.openBuilding('${building.id}')">Ver Unidades</button>
            `;

            this.elements.buildingsList.appendChild(card);
        });
    },

    /**
     * Tarjetas-resumen del mes en curso para toda la cartera
     */
    renderDashboardSummary(buildings) {
        const container = this.elements.dashboardSummary;
        if (!container) return;

        const mesActual = new Date().toISOString().slice(0, 7);
        let totalUnidades = 0, ocupadas = 0, pendientes = 0, cobrado = 0, previsto = 0;

        buildings.forEach(b => {
            b.apartamentos.forEach(apt => {
                totalUnidades++;
                if (!apt.inquilino) return;
                ocupadas++;
                const alquiler = parseFloat(apt.inquilino.alquiler) || 0;
                previsto += alquiler;
                const pago = (apt.pagos || []).find(p => p.mes === mesActual && p.pagado);
                if (pago) {
                    cobrado += (typeof pago.importe === 'number') ? pago.importe : alquiler;
                } else {
                    pendientes++;
                }
            });
        });

        if (totalUnidades === 0) {
            container.innerHTML = '';
            return;
        }

        const fmt = (n) => n.toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
        container.innerHTML = `
            <div class="stat-card">
                <div class="stat-label"><i class="ti ti-building" aria-hidden="true"></i> Unidades ocupadas</div>
                <div class="stat-value blue">${ocupadas} / ${totalUnidades}</div>
                <div class="stat-tag">en cartera</div>
            </div>
            <div class="stat-card">
                <div class="stat-label"><i class="ti ti-alert-circle" aria-hidden="true"></i> Cobros pendientes</div>
                <div class="stat-value ${pendientes > 0 ? 'red' : 'green'}">${pendientes}</div>
                <div class="stat-tag">este mes</div>
            </div>
            <div class="stat-card">
                <div class="stat-label"><i class="ti ti-coin" aria-hidden="true"></i> Cobrado</div>
                <div class="stat-value green">€${fmt(cobrado)}</div>
                <div class="stat-tag">este mes</div>
            </div>
            <div class="stat-card">
                <div class="stat-label"><i class="ti ti-chart-bar" aria-hidden="true"></i> Renta prevista</div>
                <div class="stat-value">€${fmt(previsto)}</div>
                <div class="stat-tag">mensual</div>
            </div>
        `;
    },

    /**
     * Renderiza los detalles de un edificio
     */
    renderBuildingDetails(building) {
        this.showAppLayout();
        this.showView('building-details');
        
        // Almacenar id del edificio actual en el hidden input del tenant modal global por si acaso, o local.
        this.elements.modalBuildingId.value = building.id;
        
        this.elements.headerTitle.textContent = "Detalles Inmueble";
        this.elements.currentBuildingName.textContent = building.nombre;
        this.elements.apartmentsList.innerHTML = '';

        const badgeDiv = document.getElementById('buildingPendingBadge');
        if (badgeDiv) {
            const mesActual = new Date().toISOString().slice(0, 7);
            const pendientes = building.apartamentos.filter(apt => {
                if (!apt.inquilino) return false;
                const pago = (apt.pagos || []).find(p => p.mes === mesActual);
                return !pago || !pago.pagado;
            }).length;

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

        // Fechas para cobros
        const fechaActual = new Date();
        const mesActualFormat = `${fechaActual.getFullYear()}-${String(fechaActual.getMonth() + 1).padStart(2, '0')}`;
        
        const mesesNombres = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        const mesLiteral = mesesNombres[fechaActual.getMonth()];

        const user = Store.getActiveUser();
        if (user && user.rol === 'visualizador') {
            document.getElementById('btn-edit-building').style.display = 'none';
            document.getElementById('btn-add-expense').style.display = 'none'; // btn gasto
        } else {
            document.getElementById('btn-edit-building').style.display = 'inline-flex';
            document.getElementById('btn-add-expense').style.display = 'inline-flex';
        }

        building.apartamentos.forEach(apt => {
            const isOcupado = apt.inquilino !== null;
            const isPagado = isOcupado && apt.pagos.some(p => p.mes === mesActualFormat && p.pagado);

            // Icono Tipo de Unidad (Tabler outline)
            let unitIcon = '<i class="ti ti-building" aria-hidden="true"></i>'; // defecto apartamento
            if (apt.tipo === 'Garaje') unitIcon = '<i class="ti ti-car" aria-hidden="true"></i>';
            else if (apt.tipo === 'Trastero') unitIcon = '<i class="ti ti-box" aria-hidden="true"></i>';
            else if (apt.tipo === 'Local Comercial') unitIcon = '<i class="ti ti-building-store" aria-hidden="true"></i>';
            else if (apt.tipo === 'Oficina') unitIcon = '<i class="ti ti-briefcase" aria-hidden="true"></i>';
            else if (apt.tipo === 'Otro') unitIcon = '<i class="ti ti-key" aria-hidden="true"></i>';

            const card = document.createElement('div');
            card.className = 'card apt-card';

            let statusHtml = '';
            if(!isOcupado) {
                statusHtml = `<span class="apt-status vacant">Desocupado</span>`;
            } else if(isPagado) {
                statusHtml = `<span class="apt-status occupied">Al día</span>`;
            } else {
                statusHtml = `<span class="apt-status pending">Pendiente ${mesLiteral}</span>`;
            }

            let detailsHtml = '';
            if(isOcupado) {
                const nombre = apt.inquilino.nombre || '<span style="color:var(--color-primary); cursor:pointer" onclick="App.openTenantModal(\''+building.id+'\', \''+apt.id+'\')">+ Añadir Nombre</span>';
                const alquiler = apt.inquilino.alquiler ? `€${apt.inquilino.alquiler}` : '-';
                detailsHtml = `
                    <div class="apt-details">
                        <p><strong>Inc:</strong> ${nombre}</p>
                        <p><strong>Alquiler:</strong> ${alquiler}/mes</p>
                    </div>
                `;
            } else {
                detailsHtml = `<p class="text-muted" style="font-size:14px; margin: 8px 0;">Unidad disponible</p>`;
            }

            let actionsHtml = `<div class="apt-actions" style="flex-wrap: wrap;">`;
            if (isOcupado && user.rol !== 'visualizador') {
                const alquilerNumber = parseFloat(apt.inquilino.alquiler) || 0;
                if (!isPagado) {
                    if (alquilerNumber > 0) {
                        actionsHtml += `<button class="btn btn-primary" style="flex:1; padding:8px; font-size:14px; min-width:80px;" onclick="App.markPaid('${building.id}', '${apt.id}', '${mesActualFormat}')">Cobrar</button>`;
                    } else {
                        actionsHtml += `<button class="btn btn-secondary" style="flex:1; padding:8px; font-size:14px; min-width:80px; opacity: 0.6; cursor: not-allowed;" disabled title="Falta importe de alquiler">Bloqueado</button>`;
                    }
                } else {
                    actionsHtml += `<button class="btn btn-secondary" style="flex:1; padding:8px; font-size:14px; background:var(--color-success); border-color:var(--color-success); min-width:80px; cursor: pointer;" onclick="App.unmarkPaid('${building.id}', '${apt.id}', '${mesActualFormat}')" title="Clic para deshacer">Pagado ↩</button>`;
                }
                actionsHtml += `<button class="btn btn-outline" style="flex:1; padding:8px; font-size:14px; min-width:80px;" onclick="App.generateInvoiceOpts('${building.id}', '${apt.id}')">Factura</button>`;
            } else if (isOcupado && user.rol === 'visualizador') {
                actionsHtml += `<button class="btn btn-outline" style="flex:1; padding:8px; font-size:14px; min-width:80px;" onclick="App.generateInvoiceOpts('${building.id}', '${apt.id}')">Factura</button>`;
            }
            if (user.rol !== 'visualizador') {
                actionsHtml += `<button class="btn btn-outline" style="flex:1; padding:8px; font-size:14px; min-width:80px;" onclick="App.openTenantModal('${building.id}', '${apt.id}')">${isOcupado ? 'Editar' : 'Ocupar'}</button>`;
            }
            actionsHtml += `</div>`;

            card.innerHTML = `
                <div class="apt-header">
                    <div class="apt-num" title="${apt.tipo || 'Apartamento'}">${unitIcon} ${apt.numero}</div>
                    ${statusHtml}
                </div>
                ${detailsHtml}
                ${actionsHtml}
            `;
            this.elements.apartmentsList.appendChild(card);
        });
    },

    openTenantModal(building, apt) {
        this.elements.modalBuildingId.value = building.id;
        this.elements.modalAptId.value = apt.id;
        
        // Reset form
        this.elements.formTenant.reset();
        this.elements.tenantUnitType.value = apt.tipo || 'Apartamento';
        
        if (apt.inquilino) {
            this.elements.tenantName.value = apt.inquilino.nombre || '';
            this.elements.tenantPhone.value = apt.inquilino.telefono || '';
            this.elements.tenantEmail.value = apt.inquilino.email || '';
            this.elements.tenantEntry.value = apt.inquilino.fechaEntrada || new Date().toISOString().split('T')[0];
            this.elements.tenantRent.value = apt.inquilino.alquiler || '';
            this.elements.btnVacateTenant.classList.remove('hidden');
        } else {
            this.elements.tenantEntry.value = new Date().toISOString().split('T')[0];
            this.elements.btnVacateTenant.classList.add('hidden');
        }
        
        this.elements.modalTenant.showModal();
    },

    renderInvoice(building, apt, user, pType, dStart, dEnd, extras) {
        this.showAppLayout();
        this.showView('invoice');
        
        const fechaActual = new Date();
        const numApt = apt.numero;
        const nombreEdificio = building.nombre;
        const direccion = building.direccion;
        const localidad = building.localidad;
        const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        const currentMonthName = monthNames[fechaActual.getMonth()];
        const rentBase = parseFloat(apt.inquilino.alquiler) || 0;
        
        let rentAmount = rentBase;
        let subTitle = `Alquiler correspondiente al mes de <strong id="inv-month">${currentMonthName}</strong>`;
        
        // Determinar periodo y facturación base
        if (pType === 'custom' && dStart && dEnd) {
            const startStr = new Date(dStart).toLocaleDateString('es-ES');
            const endStr = new Date(dEnd).toLocaleDateString('es-ES');
            
            const startD = new Date(dStart);
            const endD = new Date(dEnd);
            // math to calc days inclusive
            const daysDiff = Math.round((endD - startD) / (1000 * 60 * 60 * 24)) + 1;
            
            if (daysDiff > 0) {
                const pricePerDay = rentBase / 30; // Mes asume 30 días
                rentAmount = pricePerDay * daysDiff;
                subTitle = `Periodo facturado: <strong>${startStr}</strong> al <strong>${endStr}</strong> (${daysDiff} días)`;
            }
        }

        // Generar un ID de factura único simple para el mes/año/apto
        const numFactura = `${fechaActual.getFullYear()}-${String(fechaActual.getMonth()+1).padStart(2,'0')}-${numApt}`;
        
        this.elements.invNumber.textContent = numFactura;
        this.elements.invDate.textContent = fechaActual.toLocaleDateString('es-ES');
        this.elements.invIssuerName.textContent = user.nombre;
        
        this.elements.invTenantName.textContent = apt.inquilino.nombre;
        this.elements.invTenantAddress.textContent = `${direccion}, Apt. ${numApt}, ${localidad}`;
        
        // Construir el body de la factura
        const tbody = document.querySelector('.invoice-table tbody');
        tbody.innerHTML = `
            <tr>
                <td>${subTitle}<br>
                    <small style="color:var(--color-text-muted)">Apt. ${numApt} - ${nombreEdificio}</small>
                </td>
                <td class="amount">€${rentAmount.toFixed(2)}</td>
            </tr>
        `;
        
        let total = rentAmount;

        // Añadir suplementos
        if(extras) {
            if(extras.agua > 0) {
                total += extras.agua;
                tbody.innerHTML += `<tr><td>Suplemento: Suministro de Agua</td><td class="amount">€${extras.agua.toFixed(2)}</td></tr>`;
            }
            if(extras.luz > 0) {
                total += extras.luz;
                tbody.innerHTML += `<tr><td>Suplemento: Suministro Eléctrico (Luz)</td><td class="amount">€${extras.luz.toFixed(2)}</td></tr>`;
            }
            if(extras.internet > 0) {
                total += extras.internet;
                tbody.innerHTML += `<tr><td>Suplemento: Internet / WiFi</td><td class="amount">€${extras.internet.toFixed(2)}</td></tr>`;
            }
            if(extras.comunidad > 0) {
                total += extras.comunidad;
                tbody.innerHTML += `<tr><td>Suplemento: Cuota de Comunidad</td><td class="amount">€${extras.comunidad.toFixed(2)}</td></tr>`;
            }
        }
        
        this.elements.invTotal.textContent = total.toFixed(2);
    },

    /**
     * Tareas de reporte mensual
     */
    renderBuildingReport(building, totalCollected, reportItems, totalExpenses, monthLabel, gastosDelMes) {
        this.showAppLayout();
        this.showView('report');
        
        this.elements.repBuildingName.textContent = building.nombre;
        this.elements.repMonthYear.textContent = monthLabel;
        this.elements.repDateGenerated.textContent = new Date().toLocaleDateString('es-ES');
        
        this.elements.repTotalCollected.textContent = totalCollected.toFixed(2);
        this.elements.repTotalExpenses.textContent = totalExpenses.toFixed(2);
        this.elements.repTotalNet.textContent = (totalCollected - totalExpenses).toFixed(2);
        
        this.elements.reportTbody.innerHTML = '';
        reportItems.forEach(item => {
            const tr = document.createElement('tr');
            
            let statusText = '';
            if (item.status === 'vacant') statusText = '<span style="color:#8A95A3">Vacío</span>';
            if (item.status === 'paid') statusText = '<span style="color:#3B6D11; font-weight:500">✔ Pagado</span>';
            if (item.status === 'pending') statusText = '<span style="color:#A32D2D; font-weight:500">✖ Pendiente</span>';
            
            tr.innerHTML = `
                <td data-label="Apt."><strong>${item.numApt}</strong></td>
                <td data-label="Inquilino">${item.inquilino}</td>
                <td data-label="Estado">${statusText}</td>
                <td data-label="Importe" class="amount">€${item.alquiler.toFixed(2)}</td>
            `;
            this.elements.reportTbody.appendChild(tr);
        });

        this.elements.reportGastosTbody.innerHTML = '';
        if (gastosDelMes.length === 0) {
            this.elements.reportGastosTbody.innerHTML = '<tr><td colspan="4" style="text-align:center; color:#999;">No hay gastos registrados en este mes.</td></tr>';
        } else {
            gastosDelMes.forEach(gasto => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td data-label="Concepto">${gasto.concepto} <button class="btn btn-icon" style="color:var(--color-danger); padding:0; margin-left:5px;" onclick="App.deleteGasto('${building.id}', '${gasto.id}')">✖</button></td>
                    <td data-label="Tipo">${gasto.tipo}</td>
                    <td data-label="Fecha">${gasto.fecha}</td>
                    <td data-label="Importe" class="amount text-danger">-€${gasto.importe.toFixed(2)}</td>
                `;
                this.elements.reportGastosTbody.appendChild(tr);
            });
        }
    },

    renderDocumentList(files) {
        this.elements.tenantFilesList.innerHTML = '';
        if(files.length === 0) {
            this.elements.tenantFilesList.innerHTML = '<li style="color:#999; padding:5px;">Sin documentos</li>';
            return;
        }
        files.forEach(f => {
            const li = document.createElement('li');
            li.style = "display:flex; justify-content:space-between; align-items:center; padding:5px; border-bottom:1px solid #ddd;";
            
            const btnDownload = document.createElement('button');
            btnDownload.textContent = f.fileName;
            btnDownload.style = "background:none; border:none; color:var(--color-primary); cursor:pointer; text-decoration:underline; font-size:12px; padding:0; text-align:left;";
            btnDownload.onclick = (e) => {
                e.preventDefault();
                App.downloadDocument(f);
            };

            const btnDelete = document.createElement('button');
            btnDelete.innerHTML = '<i class="ti ti-trash" aria-hidden="true"></i>';
            btnDelete.style = "background:none; border:none; cursor:pointer; color:var(--color-danger);";
            btnDelete.onclick = (e) => {
                e.preventDefault();
                App.deleteDocument(f.id, f.tenantApt);
            };

            li.appendChild(btnDownload);
            li.appendChild(btnDelete);
            this.elements.tenantFilesList.appendChild(li);
        });
    },

    renderHistory(historico) {
        this.showAppLayout();
        this.showView('history');
        
        this.elements.historicoTbody.innerHTML = '';
        if (historico.length === 0) {
            this.elements.historicoTbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:20px; color:#999;">No hay registros en el histórico.</td></tr>';
            return;
        }

        historico.forEach(h => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td data-label="Nombre" style="padding:10px; border-bottom:1px solid var(--color-border); font-weight:500;">${h.nombre}</td>
                <td data-label="Edificio (Apt)" style="padding:10px; border-bottom:1px solid var(--color-border);">${h.edificioName} (Apt. ${h.aptNum})</td>
                <td data-label="Contacto" style="padding:10px; border-bottom:1px solid var(--color-border); font-size:13px; color:var(--color-text-muted);">
                    ${h.telefono ? '<i class="ti ti-phone" aria-hidden="true"></i> '+h.telefono : ''} <br> ${h.email ? '<i class="ti ti-mail" aria-hidden="true"></i> '+h.email : ''}
                </td>
                <td data-label="Periodo Total" style="padding:10px; border-bottom:1px solid var(--color-border);">
                    ${h.mesesAlquilado > 0 ? h.mesesAlquilado + ' mes(es)' : '< 1 mes'}
                    <div style="font-size:11px; color:var(--color-text-muted);">(Desde: ${h.fechaEntrada || 'N/A'})</div>
                </td>
                <td data-label="Fecha Salida" style="padding:10px; border-bottom:1px solid var(--color-border); color:var(--color-danger);">${h.fechaSalida}</td>
                <td data-label="Acción" style="padding:10px; border-bottom:1px solid var(--color-border); text-align:center;">
                    <button class="btn btn-icon" style="color:var(--color-danger);" onclick="App.deleteHistorico('${h.id}')" title="Eliminar registro"><i class="ti ti-trash" aria-hidden="true"></i></button>
                </td>
            `;
            this.elements.historicoTbody.appendChild(tr);
        });
    },

    renderStats(dataChart) {
        this.showAppLayout();
        this.showView('stats');
        
        // dataChart = array of 12 numbers
        const maxVal = Math.max(...dataChart, 1000); // 1000 min para escala
        this.elements.chartContainer.innerHTML = '';
        const months = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
        
        const mesEnCurso = new Date().getMonth();
        dataChart.forEach((val, index) => {
            const percentage = (val / maxVal) * 100;
            const barWrapper = document.createElement('div');
            barWrapper.style = "flex:1; display:flex; flex-direction:column; align-items:center; height:100%; justify-content:flex-end;";

            // Barras en azul claro; el mes en curso resaltado en azul de acción
            const barColor = index === mesEnCurso ? 'var(--zam-blue)' : 'var(--blue-bg)';
            const bar = document.createElement('div');
            bar.style = `width:80%; max-width:40px; background:${barColor}; height:${Math.max(percentage, 2)}%; border-radius:3px 3px 0 0; transition:height 0.3s ease; position:relative;`;
            bar.title = `€${val.toFixed(2)}`;

            // Label
            const label = document.createElement('div');
            label.textContent = months[index];
            label.style = "margin-top:5px; font-size:10px; color:var(--text-muted);";

            // Tooltip (purely visual over)
            const tooltip = document.createElement('span');
            tooltip.textContent = Math.round(val);
            tooltip.style = "position:absolute; top:-20px; left:50%; transform:translateX(-50%); font-size:10px; color:var(--text-primary); font-weight:500;";
            bar.appendChild(tooltip);

            barWrapper.appendChild(bar);
            barWrapper.appendChild(label);
            this.elements.chartContainer.appendChild(barWrapper);
        });
    },

    renderTaxReport(trimestre, ano, ingresos, gastos, neto) {
        this.showAppLayout();
        this.showView('tax');
        
        this.elements.taxPeriodTitle.textContent = `Ejercicio: ${ano} - Trimestre ${trimestre}`;
        this.elements.taxIngresos.textContent = ingresos.toFixed(2);
        this.elements.taxGastos.textContent = gastos.toFixed(2);
        this.elements.taxNeto.textContent = neto.toFixed(2);
        this.elements.taxContent.style.display = 'block';
    },

    renderManagers(managers) {
        this.showAppLayout();
        this.showView('managers');
        
        const currentUser = Store.getActiveUser();
        if (currentUser && currentUser.rol !== 'admin') {
            this.elements.btnNewManager.style.display = 'none';
        } else {
            this.elements.btnNewManager.style.display = 'inline-flex';
        }

        this.elements.managersList.innerHTML = '';
        managers.forEach(gestor => {
            const card = document.createElement('div');
            card.className = 'manager-card';
            
            let rolBadge = 'Gestor';
            let rolClass = 'badge-info';
            if (gestor.rol === 'admin') {
                rolBadge = 'Administrador';
                rolClass = 'badge-pending';
            } else if (gestor.rol === 'visualizador') {
                rolBadge = 'Visualizador';
                rolClass = 'badge-vacant';
            }

            card.innerHTML = `
                <div class="manager-name">${gestor.nombre}</div>
                <div class="manager-email">${gestor.email}</div>
                <div style="margin-bottom: 10px;">
                    <span class="badge ${rolClass}">${rolBadge}</span>
                </div>
                ${gestor.telefono ? `<div style="font-size: 12px; color: var(--color-text-muted); margin-bottom: 8px;"><i class="ti ti-phone" aria-hidden="true"></i> ${gestor.telefono}</div>` : ''}
                <div class="manager-actions" style="display: ${currentUser && currentUser.rol !== 'admin' ? 'none' : 'flex'}">
                    <button class="btn btn-outline btn-small" onclick="App.openEditManager('${gestor.id}')">Editar</button>
                    <button class="btn btn-danger btn-small" onclick="App.removeManager('${gestor.id}')">Eliminar</button>
                </div>
            `;
            this.elements.managersList.appendChild(card);
        });
    }
};
