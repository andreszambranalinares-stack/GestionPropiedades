# Boletín de Actualizaciones (Changelog)

Todas las novedades y evoluciones técnicas del "Sistema de Gestión de Alquileres" quedan documentadas en este boletín.

## [V9.0] - Identidad Visual ZamProp (Actual)
### Cambiado
- **Nueva marca ZamProp:** Logotipo con símbolo "Z" en SVG, wordmark bicolor ("Zam" blanco / "Prop" naranja #E87D3E) y eslogan *"Tu cartera inmobiliaria, bajo control."* aplicados al login, sidebar, topbar móvil y documentos imprimibles (recibos y reportes).
- **Sistema de diseño completo:** Paleta corporativa (navy #0B2545, azul de acción #1A6FA8, acento naranja #E87D3E) con variables CSS globales y estados semánticos (ocupado/vacío/pendiente/informativo). Tipografía Inter restringida a pesos 400/500, sin sombras ni degradados, bordes de 0.5px.
- **Escritorio:** Sidebar fijo de 220px con navegación agrupada (Principal / Finanzas / Sistema), avatar y cierre de sesión en el pie; topbar blanco con título y subtítulo de página.
- **Móvil:** Topbar navy con logo, bottom navigation de 5 accesos (Inicio, Inquilinos, Informes, Hacienda, Más), hoja de menú flotante y botón flotante naranja (FAB) para crear inmuebles.
- **Iconografía Tabler (outline)** en toda la interfaz sustituyendo a los emojis; badges de estado unificados; gráfico de estadísticas en azul claro con el mes en curso resaltado.
- Sin cambios de lógica: misma navegación, mismos datos y mismas funciones; solo HTML visual y CSS.

---

## [V8.0] - Acceso Móvil, Resumen de Cartera y Contabilidad Fiable
### Corregido
- **Login en móvil reparado:** El acceso usaba `window.prompt()` para pedir el PIN, una función que muchos navegadores móviles y visores integrados (Instagram, WhatsApp, accesos directos a pantalla de inicio) bloquean silenciosamente, dejando la app clavada en la pantalla inicial. Ahora el PIN se introduce en un **modal propio** con teclado numérico. Además, se eliminaron los botones de usuario fijos del HTML que apuntaban a usuarios inexistentes: la pantalla de login se genera siempre desde la base de datos real.
- **Importes de cobro congelados:** Cada pago registra ahora el **importe en el momento del cobro**. Antes, Estadísticas, Reportes y Hacienda recalculaban con el alquiler *actual*, por lo que los ingresos pasados se corrompían si el inquilino se marchaba o se le actualizaba la renta. Los pagos antiguos se migran automáticamente.
- **Doble confirmación al desocupar:** Desocupar un piso pedía confirmación dos veces seguidas; ahora solo una.
- **Modales con scroll en móvil:** Los formularios largos (ficha de inquilino) ya permiten desplazarse hasta el botón Guardar en pantallas pequeñas.
- **Año fiscal dinámico:** La vista de Hacienda proponía siempre "2026" fijo; ahora propone el año y trimestre en curso.
- El selector de "Periodo Personalizado" de las facturas ya no aparece visible por defecto; etiquetas con comillas ya no rompen su botón de borrado; tabla de Ex-Inquilinos corregida.

### Añadido
- **Panel Resumen de Cartera:** Cuatro tarjetas en "Mis Inmuebles" con ocupación total, cobros pendientes del mes, total cobrado y renta mensual prevista.
- **Buscador de Inmuebles:** Filtro instantáneo por nombre, dirección o localidad, combinable con el filtro de etiquetas.
- **Aviso de impagos por edificio:** Cada tarjeta del panel indica "⚠️ N sin cobrar" o "✔ Al día" del mes en curso.
- **Ayuda de primer acceso:** En el primer arranque, la pantalla de login indica el PIN inicial (0000) y cómo crear gestores.
- **Diseño de oficina:** Rejilla multi-columna en pantallas grandes (hasta 1140px de ancho útil), cabecera compacta en móvil y menú móvil que se cierra al tocar fuera.

---

## [V6.0] - Enterprise: Documentación, Tributos y Gastos
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
