# Boletín de Actualizaciones (Changelog)

Todas las novedades y evoluciones técnicas del "Sistema de Gestión de Alquileres" quedan documentadas en este boletín.

## [V6.0] - Enterprise: Documentación, Tributos y Gastos (Actual)
### Añadido
- **Libro de Gastos e Impuestos:** Nueva funcionalidad para declarar gastos estructurales dentro de un edificio (reparaciones, impuestos, etc.). El "Reporte del Mes" sustrae ahora estos gastos de los alquileres cobrados para ofrecer un **Beneficio Neto**.
- **Historial de Inquilinos (Agenda):** Al desocupar un piso, los datos del arrendatario anterior ya no se volatilizan; se archivan de manera permanente en el listado *Ex-Inquilinos* con las fechas y teléfonos intactos.
- **Bóveda Documental (IndexedDB):** Capacidad nativa local para subir archivos Binarios (como Contratos en PDF y fotos de DNIs) directo al perfil de cada inquilino. Sin llenar el localStorage, sin bases de datos externas.
- **Gráficos Estadísticos:** Nuevo panel inteligente en *Estadísticas* que procesa una docena de barras gráficas anuales fabricadas íntegramente con CSS reflejando la rentabilidad mensual.
- **Declaración Tributaria (Hacienda):** Creador oficial de borradores impositivos para IRPF. Pudiendo elegir año y trimestre oficial, se calcula el peso de alquileres vs. gastos estructurales, mostrando el cómputo final legal a declarar a la Agencia Tributaria.

---

## [V5.0] - Reportes de Contabilidad y Recibos Dinámicos
### Añadido
- **Reporte Mensual por Edificio:** Capacidad para calcular el "Total Bruto Esperado" vs. el "Total Real Cobrado" por edificio.
- **Cobro por Días (Recibos Personalizados):** Al solicitar un recibo, opción de recalcular algorítmicamente el "precio por día".
- **Suplementos Funcionales:** Añadidos apartados numéricos de anexión de facturas (Agua, Luz, Internet y Comunidad).

---

## [V4.0] - Correcciones de Despliegue y UX
### Cambiado
- **Bloqueo Inteligente de Cobros:** La funcionalidad de marcar pagos ahora desactiva el botón de cobro para alquileres "0".

---

## [V3.0] - Filtros, Ediciones y Solución Mobile
### Añadido
- Desplegable selector **"Filtros de Etiquetas"**.
- Funcionalidad activa en botón: **"Editar Edificio"** y **"Editar Gestor"**.

---

## [V2.0] - Etiquetas y Gestores Activos
### Añadido
- **Sistema base de Etiquetas (Tags)** y **Roles de Gestores**.

---

## [V1.0] - MVP Principal de Gestión
### Añadido
- Arquitectura Local-First (`localStorage`) base.
