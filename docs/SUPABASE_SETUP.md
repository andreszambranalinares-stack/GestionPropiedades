# ZamProp en la nube — Guía de Supabase

Migración de ZamProp de almacenamiento local (localStorage) a la nube
con **Supabase**, con **registro de usuarios** y **grupos** para
compartir propiedades entre varias personas (p. ej. tú y tu padre en el
mismo grupo).

## Idea general

- Las **propiedades pertenecen a un grupo**, no a un usuario suelto.
- Un usuario puede estar en **varios grupos** con un **rol**:
  - `admin` — gestiona el grupo, invita y edita todo.
  - `gestor` — edita propiedades, inquilinos y pagos.
  - `visualizador` — solo lectura.
- Toda la seguridad la aplica **RLS** (Row Level Security) en la base de
  datos: aunque alguien manipule el cliente, solo verá los datos de sus
  grupos.

---

## Paso 1 — Crear el proyecto Supabase

1. Entra en <https://supabase.com> y crea un proyecto (plan free vale).
2. Apunta la contraseña de la base de datos y espera a que se aprovisione.

## Paso 2 — Crear el esquema

1. En el Dashboard: **SQL Editor → New query**.
2. Pega el contenido de [`supabase/schema.sql`](../supabase/schema.sql) y pulsa **Run**.
3. (Documentos) Pega también [`supabase/storage.sql`](../supabase/storage.sql) y **Run**.

Esto crea las tablas, los triggers, las funciones de apoyo y todas las
políticas RLS.

## Paso 3 — Configurar la autenticación

1. **Authentication → Providers → Email**: deja activado *Email*.
2. Para desarrollo puedes desactivar *Confirm email* (Authentication →
   Settings) para no tener que verificar el correo en cada prueba.
3. **Authentication → URL Configuration**: añade la URL de tu sitio en
   Cloudflare Pages (p. ej. `https://zamprop.pages.dev`) en *Site URL* y
   *Redirect URLs*.

## Paso 4 — Conectar la app

1. **Project Settings → API** y copia:
   - *Project URL*
   - *anon public* key
2. Pégalos en [`js/config.js`](../js/config.js).
   > La clave `anon` es pública por diseño; la seguridad la da RLS.
   > **Nunca** pongas aquí la `service_role` key.

## Paso 5 — Desplegar

Sube los cambios a la rama de producción; Cloudflare Pages publica solo
(ver sección de despliegue en el README). La CSP de `_headers` ya permite
las conexiones a `*.supabase.co`.

---

## Hoja de ruta por fases

| Fase | Qué incluye | Estado |
| ---- | ----------- | ------ |
| **1. Cimientos** | Esquema SQL, RLS, grupos, invitaciones, cliente JS (`ZampCloud`), config y CSP | ✅ Hecho |
| **2. Auth + grupos en la UI** | Pantalla de registro/login con Supabase, selector de grupo activo, panel de miembros e invitaciones | ⏳ Siguiente |
| **3. Propiedades en la nube** | Sustituir las lecturas/escrituras de `Store.js` (edificios, apartamentos, inquilinos, pagos, gastos) por la API `ZampCloud.Data` filtrada por grupo | ⏳ |
| **4. Documentos + migración** | Mover documentos de IndexedDB a Supabase Storage e importador de los datos locales existentes a la nube | ⏳ |

### Notas de diseño ya resueltas en la Fase 1

- **Clientes activos:** la tabla `tenants` unifica activos (`activo = true`)
  e históricos (`activo = false`). Esto habilita de forma natural el
  *directorio de clientes activos* que faltaba (`ZampCloud.Data.activeTenants`).
- **Escalable por grupos:** añadir un nuevo cliente/usuario es crear otro
  grupo; los datos quedan aislados por RLS sin tocar código.

---

## Archivos de esta migración

| Archivo | Rol |
| ------- | --- |
| `supabase/schema.sql` | Tablas, triggers, funciones RLS y políticas |
| `supabase/storage.sql` | Bucket privado de documentos y sus políticas |
| `js/config.js` | URL y anon key de tu proyecto |
| `js/cloud/supabase-client.js` | Cliente y API `ZampCloud` (Auth/Groups/Data) |
