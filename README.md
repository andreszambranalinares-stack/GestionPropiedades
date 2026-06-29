# ZamProp — Tu cartera inmobiliaria, bajo control.

> Aplicación web offline para la gestión profesional de propiedades, alquileres, inquilinos y facturación. Sin servidores. Sin complicaciones.

---

## ¿Qué es ZamProp?

**ZamProp** es una herramienta de gestión inmobiliaria desarrollada bajo la marca familiar **Zambrana**. Diseñada para propietarios, gestores y agencias que quieren tener su cartera de alquileres organizada de forma clara y profesional, sin depender de servicios en la nube ni suscripciones externas.

Todo ocurre en tu navegador. Tus datos son tuyos.

---

## Características principales

**100% Offline y local**
Los datos se almacenan en el `localStorage` del navegador. No hay backend, no hay base de datos externa, no hay nada que salga de tu dispositivo.

**Gestión multi-propiedad**
Crea tantos edificios como necesites, con un número flexible de apartamentos asociados. Organízalos mediante etiquetas personalizadas.

**Control de inquilinos**
Visualiza el estado de cada apartamento de un vistazo: desocupado, ocupado al día o pendiente de pago.

**Gestión multi-usuario**
Perfiles diferenciados de administrador, gestor y visualizador. Controla quién interactúa con la aplicación y quién emite los recibos.

**Motor de facturas**
Genera recibos profesionales adaptados a impresión. Los datos del inquilino y del gestor se extraen automáticamente.

---

## Cómo iniciar

No necesitas instalar nada. Sin Apache, sin Node.js, sin configuración.

```
1. Descarga o clona el repositorio
2. Abre index.html haciendo doble clic
3. La app se carga directamente en tu navegador
```

En la primera ejecución, ZamProp inyecta automáticamente un edificio de muestra y gestores básicos para que puedas explorar la interfaz sin configuración previa.

---

## Despliegue en Cloudflare Pages

ZamProp es una app **estática** (sin build), así que se publica en **Cloudflare Pages** sin paso de compilación. Los datos siguen viviendo en el navegador de cada usuario (`localStorage` + IndexedDB); Cloudflare solo sirve los ficheros.

### Opción A — Conectar el repositorio (recomendado)

1. En el panel de Cloudflare: **Workers & Pages → Create → Pages → Connect to Git**.
2. Selecciona este repositorio.
3. Configuración de build:
   - **Framework preset:** None
   - **Build command:** *(vacío)*
   - **Build output directory:** `/`
4. **Deploy**. Cada push a la rama de producción se publica automáticamente.

### Opción B — Despliegue directo por CLI

```
npx wrangler pages deploy . --project-name=zamprop
```

### Ficheros de configuración incluidos

| Archivo         | Rol                                                                 |
| --------------- | ------------------------------------------------------------------- |
| `wrangler.toml` | Nombre del proyecto y directorio de salida para Pages               |
| `_headers`      | Cabeceras de seguridad (CSP, X-Frame-Options…) y caché              |
| `_redirects`    | Fallback de página única                                            |

> La CSP de `_headers` permite las fuentes externas que usa la app (Google Fonts e iconos Tabler vía jsDelivr). Si en el futuro añades otro CDN, recuerda incluirlo allí.

---

## Versión en la nube (Supabase) — en construcción

ZamProp está migrando a una versión **multi-usuario en la nube** con
**Supabase**: registro de usuarios y **grupos** para compartir propiedades
(p. ej. tú y un familiar en el mismo grupo ven la misma cartera). Las
propiedades se organizan **por grupos** para poder escalar a otros usuarios
con total aislamiento de datos (seguridad RLS).

Guía completa y hoja de ruta por fases: [`docs/SUPABASE_SETUP.md`](docs/SUPABASE_SETUP.md).

> La versión local (localStorage) sigue funcionando; la nube se incorpora
> de forma incremental sin romperla.

---

## Arquitectura del proyecto

ZamProp sigue una estructura **MVC en Vanilla JS**, sin frameworks ni dependencias externas.

| Archivo          | Rol         | Descripción                                                |
| ---------------- | ----------- | ---------------------------------------------------------- |
| `index.html`     | Estructura  | Vistas principales, cabeceras y modales                    |
| `css/styles.css` | Diseño      | Sistema de variables, Mobile First                         |
| `js/app.js`      | Controlador | Captura señales de la UI, valida y delega                  |
| `js/store.js`    | Modelo      | Interactúa con `localStorage`, inyecta seed inicial        |
| `js/ui.js`       | Vista       | Renderiza HTML dinámico, gestiona listeners y transiciones |

---

## Consideraciones sobre los datos

Dado que todo reside en el `localStorage` del navegador, **vaciar la caché o borrar los datos de navegación eliminará tus registros de forma irreversible**.

Se recomienda no utilizar ZamProp en modo incógnito para evitar pérdidas de datos al cerrar la sesión.

> **Próximamente:** Exportación de copia de seguridad en formato `.json` para proteger tus registros ante cualquier imprevisto.

---



## Tecnologías utilizadas

- HTML5 / CSS3 / JavaScript ES6+ (Vanilla, sin frameworks)
- `localStorage` para persistencia de datos
- Arquitectura MVC modular
- Sistema de diseño Mobile First

---

_ZamProp — Desarrollado por Andrés Zambrana Linares_
