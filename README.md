# Sistema de Gestión de Alquileres

Aplicación Web offline construida para simplificar y gestionar propiedades, apartamentos, inquilinos, pagos mensuales y generación de recibos/facturas en versión local (navegador).

## Características Principales

*   **100% Offline (Local):** Los datos persisten utilizando el `localStorage` del navegador. **No hay una base de datos externa ni backend**, por lo que tus datos no salen de tu ordenador/móvil.
*   **Gestión Multi-Propiedad:** Capacidad de crear infinitos edificios con un número flexible de apartamentos asociados y catalogarlos mediante **Etiquetas**.
*   **Control de Inquilinos:** Visualización del estado de apartamentos (Desocupados, Ocupados al día y Pendientes de pago mensual).
*   **Gestión Multi-Usuario:** Perfiles de administrador, gestor y visualizador para determinar de forma nominativa quién interactúa con la aplicación o quién emite los recibos.
*   **Motor de Facturas:** Diseño de recibos profesionales limpios y adaptados al formato de impresión que extraen automáticamente los datos del inquilino y del gestor seleccionado.

---

## Estructura del Proyecto (Arquitectura MVC)

El proyecto utiliza tecnologías base o Vanilla (sin frameworks complejos) divididas bajo la estructura Modelo-Vista-Controlador:

*   `index.html`: La columna vertebral de la aplicación; contiene las vistas principales, cabeceras y todos los `modals` o ventanas emergentes agrupados.
*   `css/styles.css`: Utilidad visual y sistema de diseño basado en variables compartidas. Sistema "Mobile First" (preferencia para uso en móviles y tablet).
*   `js/app.js`: Actúa como **Controlador**. Captura las señales de la UI, procesa validaciones y delega a la base de datos lo que se debe actualizar.
*   `js/store.js`: Actúa como **Modelo (Base de Datos)**. Interactúa únicamente con Storage. Si en la primera ejecución no detecta historial, inyecta (Seed) un Edificio de muestra y Gestores básicos.
*   `js/ui.js`: Actúa como **Vista**. Renderiza dinámicamente HTML a base del DOM, inyecta componentes, atiende Listeners y lanza las transiciones de menús.

---

## Consideraciones de Backup y Seguridad
Puesto que los datos radican por completo en el navegador del dispositivo donde utilizas esta interfaz (caché de sitio o `localStorage` atado al dominio), **borrar los datos de navegación o vaciar la memoria caché del navegador eliminará irreversiblemente tus registros**.
> **Se recomienda:** Implementar un botón extra en un futuro que permita "Descargar copia de seguridad" en un archivo `.json` que se pueda leer si se corrompe el navegador.

## ¿Cómo iniciar?
Simplemente abre el archivo `index.html` haciendo doble clic. No necesitas desplegar Apache o NodeJS.

---

## Roadmap de Futuro y Recomendaciones Técnicas
Para evolucionar la aplicación base actual hacia un sistema integral e inquebrantable de gestión, se recomiendan arquitectónicamente los siguientes 4 pilares en futuras actualizaciones (V6+):

1. **Gestión de Gastos y Mantenimientos:** A día de hoy la app controla ingresos puros. Añadir un sistema donde puedas adjudicar gastos a cada edificio (reparaciones fontanería, facturas de limpieza, seguros, IBI) te permitiría mostrar en el "Reporte de Mes" el **"Beneficio Neto Real"**.
2. **Histórico y Archivo de Inquilinos:** Actualmente si "Desocupas" un apartamento, el perfil del inquilino se esfuma. Construir una biblioteca de "Ex-inquilinos" o historial permitirá rescatar a quién le cobraste qué el año pasado o contactarle en caso de impagos pendientes.
3. **Almacenamiento Documental (Contratos y DNI):** Empleando bases de datos de indexación del navegador (como `IndexedDB` a cambio de `LocalStorage`) se podría habilitar un botón de "Subir y Adjuntar Archivos" para cada cliente, encriptando los JPG o PDF de sus contratos firmados para tenerlos archivados dentro del programa y decirle adiós al papel.
4. **Dashboard de Estadísticas Anual:** Una pestaña de gráficas visuales globales que resuma en una curva la salud de tus arrendamientos mes a mes, uniendo y contrastando los ingresos de todos los edificios a la vez durante todo el año fiscal.
