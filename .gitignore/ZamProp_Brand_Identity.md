# ZamProp — Identidad de Marca
### Documento de Brand Guidelines v1.0

---

## 1. Visión general

**ZamProp** es una aplicación web de gestión de propiedades inmobiliarias, desarrollada bajo la marca familiar **Zambrana**. La aplicación permite a propietarios, gestores y agencias gestionar su cartera de alquileres y propiedades de forma centralizada, clara y profesional.

Este documento define los estándares visuales y de comunicación de la marca, y sirve como referencia para el diseño e implementación de la interfaz de la aplicación.

---

## 2. Nombre de marca

### Nombre principal

> **ZamProp**

El nombre surge de la combinación de **Zam** (raíz del apellido Zambrana) y **Prop** (abreviatura de *Properties*), en línea con la nomenclatura de aplicaciones SaaS modernas.

### Criterios de elección

| Criterio | Valoración |
|---|---|
| Pronunciabilidad (ES/EN) | ✅ Natural en ambos idiomas |
| Disponibilidad como dominio | ✅ `zamprop.es` / `zamprop.app` |
| Funcionamiento en app store | ✅ Corto, sin ambigüedad |
| Coherencia con la marca Zambrana | ✅ Mantiene la raíz familiar |
| Escalabilidad (compraventa, comunidades) | ✅ No limita a solo alquiler |

### Alternativas consideradas

- **Zamquileres** — muy memorable, pero limita la marca al alquiler residencial.
- **ZamFlow** — transmite agilidad, pero es más genérico.
- **ZamEstate** — tono más formal, orientado a agencias o gestorías.

### Escritura correcta

- ✅ **ZamProp**
- ✅ **Zam**Prop (en composiciones donde se remarque la raíz)
- ❌ Zamprop, ZAMPROP, zamprop

---

## 3. Eslogan

### Principal

> **Tu cartera inmobiliaria, bajo control.**

### Alternativas aprobadas

- *Gestiona propiedades sin complicaciones.*
- *Todo tu alquiler en un solo sitio.* *(si el foco es 100% alquiler)*

El eslogan debe transmitir **control, claridad y simplicidad**. Se evitan términos técnicos o anglicismos en el mensaje principal.

---

## 4. Logo

### Concepto

El logo de ZamProp se compone de dos elementos:

1. **Símbolo (icono Z):** Una letra Z geométrica construida con trazos rectos, que evoca tanto la inicial del apellido Zambrana como una forma arquitectónica limpia. La parte inferior del trazo izquierdo de la Z lleva un acento en naranja (`#E87D3E`), que actúa como diferenciador visual y añade calidez a la composición.

2. **Logotipo (wordmark):** El nombre **ZamProp** escrito en tipografía sin serifa, peso 500, donde la sílaba `Prop` aparece en naranja para reforzar la división semántica y la paleta de la marca.

### Construcción del símbolo

```
╔══════════════╗
║              ║
║   ─────────  ║   ← trazo superior (blanco)
║          ╱   ║
║        ╱     ║
║      ╱       ║
║    ╱         ║
║  ─────────   ║   ← trazo inferior (naranja, acento de marca)
║              ║
╚══════════════╝

Fondo: Azul marino  #0B2545
Trazo Z: Blanco     #FFFFFF
Acento: Naranja     #E87D3E
Border-radius: 10px (proporcional al tamaño)
```

### Versiones del logo

#### Versión principal — sobre fondo oscuro

Se usa sobre fondos azul marino (`#0B2545`) o fondos oscuros en general. Es la versión primaria de la marca.

- Fondo del ícono: `#0B2545`
- Color interior del símbolo: blanco + naranja
- Texto: blanco / subtítulo en `#5B8FCE`

#### Versión clara — sobre fondo blanco o neutro

Se usa sobre fondos claros (`#F4F6FA`, blanco, gris claro). Apropiada para documentos, tarjetas, cabeceras claras.

- Fondo del ícono: `#1A6FA8`
- Texto: `#0B2545` / acento `Prop` en `#E87D3E`

#### Versión monocromática

Para contextos de un solo color (impresión B&W, marca de agua):

- Todo en `#0B2545` o en blanco, sin naranja.

### Espaciado y área de respeto

El logo debe tener un área libre de otros elementos equivalente al **alto del símbolo** en cada uno de sus cuatro lados. No se colocará ningún texto, icono o borde dentro de esta zona de exclusión.

### Usos incorrectos

- ❌ Modificar la proporción entre símbolo y wordmark
- ❌ Usar el naranja en el trazo superior de la Z
- ❌ Usar el logo sobre fondos que no contrasten suficientemente
- ❌ Aplicar sombras, degradados o efectos al símbolo
- ❌ Rotar o deformar el símbolo
- ❌ Cambiar los colores por fuera de la paleta aprobada

---

## 5. Favicon

El favicon de ZamProp es una versión reducida del símbolo, sin el wordmark. Funciona de forma autónoma a cualquier tamaño.

### Especificaciones por tamaño

| Tamaño | Uso | Border-radius |
|---|---|---|
| 512×512 px | PWA / splash screen | 113px |
| 192×192 px | PWA / icono Android | 43px |
| 64×64 px | Marcadores navegador | 14px |
| 32×32 px | Pestaña navegador | 7px |
| 16×16 px | Pestaña navegador mínima | 3px |

### Notas de legibilidad

A 16×16 px, el trazo superior de la Z y el acento naranja inferior siguen siendo reconocibles. Se recomienda aumentar el `stroke-width` del trazo proporcionalmente al reducir el tamaño para mantener la legibilidad.

---

## 6. Paleta de colores

### Colores principales

| Nombre | Hex | Uso |
|---|---|---|
| **Navy** | `#0B2545` | Fondo principal, header, fondo del símbolo |
| **Zam Blue** | `#1A6FA8` | Color de acción, enlaces, fondo del icono (versión clara) |
| **Prop Orange** | `#E87D3E` | Acento de marca, CTA, acento en logo |

### Colores secundarios

| Nombre | Hex | Uso |
|---|---|---|
| **Surface** | `#F4F6FA` | Fondo de la aplicación, tarjetas, fondos neutros |
| **Sky** | `#5B8FCE` | Texto secundario, iconos sobre fondos oscuros, subtítulos en header |
| **White** | `#FFFFFF` | Texto sobre Navy, trazo del símbolo |
| **Dark text** | `#1A1A2E` | Texto principal sobre fondos claros |

### Colores semánticos (estados)

| Estado | Color | Hex |
|---|---|---|
| Activo / Ocupado | Verde | `#3B6D11` sobre `#EAF3DE` |
| Vacío / Alerta | Ámbar | `#854F0B` sobre `#FAEEDA` |
| Error / Morosidad | Rojo | `#A32D2D` sobre `#FCEBEB` |
| Información | Azul | `#185FA5` sobre `#E6F1FB` |

### Reglas de uso del color

- El naranja **nunca** se usa como color de fondo de áreas grandes.
- El Navy es el color dominante en cabeceras y elementos primarios de navegación.
- Los colores semánticos solo se usan para transmitir estados, nunca de forma decorativa.
- Se garantiza siempre un ratio de contraste mínimo de **4.5:1** (WCAG AA).

---

## 7. Tipografía

### Familia tipográfica

**Inter** (Google Fonts, licencia libre) — o **Geist** como alternativa moderna.

Ambas son tipografías sin serifa, diseñadas para interfaces digitales, con excelente legibilidad en pantalla desde tamaños pequeños.

```
font-family: 'Inter', system-ui, -apple-system, sans-serif;
```

### Escala tipográfica

| Rol | Tamaño | Peso | Uso |
|---|---|---|---|
| Display / Logo | 28–32px | 500 | Nombre de marca en header |
| Heading 1 | 24px | 500 | Títulos de sección principal |
| Heading 2 | 18px | 500 | Subtítulos, nombres de pantalla |
| Body | 14–16px | 400 | Contenido general, tablas |
| Label / Badge | 11–12px | 500 | Etiquetas de estado, metadatos |
| Caption | 11px | 400 | Textos auxiliares, timestamps |
| Subtítulo de marca | 11px | 400 | Espaciado 0.12em, uppercase |

### Reglas tipográficas

- Solo se usan dos pesos: **400 (regular)** y **500 (medium)**. No se usa negrita 700 en la interfaz.
- El espaciado de línea estándar es `line-height: 1.6` para cuerpo de texto.
- Las etiquetas de estado (badges) van en mayúsculas con `letter-spacing: 0.06em`.

---

## 8. Iconografía

Se utiliza la librería **Tabler Icons** (outline), disponible como webfont y SVG. Criterios:

- Solo versión **outline** (no filled).
- Tamaño estándar: 18–20px en navegación, 16px en tablas e inline.
- Color: heredado del elemento padre (currentColor).
- No se diseñan iconos propios salvo el símbolo de marca.

Iconos principales de la aplicación:

| Icono | Uso |
|---|---|
| `ti-home` | Dashboard / inicio |
| `ti-building` | Propiedades |
| `ti-users` | Inquilinos |
| `ti-file-invoice` | Contratos / documentos |
| `ti-coin` | Pagos / finanzas |
| `ti-bell` | Notificaciones |
| `ti-settings` | Configuración |
| `ti-logout` | Cerrar sesión |

---

## 9. Tono de comunicación

### Voz de marca

ZamProp habla con un tono **profesional pero cercano**. No es una app de banca ni una startup de Silicon Valley. Es una herramienta hecha por y para personas que gestionan propiedades reales, con nombres y apellidos.

### Principios de comunicación

- **Directo:** sin rodeos ni tecnicismos innecesarios.
- **Claro:** cada dato tiene su lugar, sin sobrecargar la interfaz.
- **Confiable:** transmite seriedad sin frialdad.
- **Local:** puede hacer referencias al contexto andaluz/español sin forzarlo.

### Ejemplos de texto de interfaz

| ❌ Evitar | ✅ Usar |
|---|---|
| "No se han encontrado registros" | "Aún no tienes propiedades añadidas" |
| "Error 404" | "Esta página no existe" |
| "El inquilino ha sido eliminado satisfactoriamente" | "Inquilino eliminado correctamente" |
| "Procesando solicitud..." | "Guardando..." |

---

## 10. Aplicación en UI — Reglas generales

### Layout

- Sidebar de navegación izquierda en escritorio; bottom navigation bar en móvil.
- Cabecera en Navy (`#0B2545`) con logo blanco.
- Fondo de la aplicación: `#F4F6FA`.
- Tarjetas (cards) sobre blanco (`#FFFFFF`) con borde `0.5px solid` y `border-radius: 12px`.

### Componentes clave

**Tarjeta de propiedad:**
- Nombre de propiedad: 15px / 500
- Dirección: 13px / 400 / color secundario
- Badge de estado: 11px / 500 / fondo semántico

**Barra de estadísticas:**
- Número destacado: 20–24px / 500 / color de estado
- Etiqueta: 12px / 400 / color secundario

**Botón primario:**
- Fondo: `#1A6FA8`
- Texto: blanco
- Hover: `#0B2545`
- Border-radius: 8px

**Botón secundario:**
- Fondo: transparente
- Borde: `0.5px solid #1A6FA8`
- Texto: `#1A6FA8`

---

## 11. Archivos de marca

Los siguientes activos deben generarse y mantenerse actualizados:

| Archivo | Formato | Descripción |
|---|---|---|
| `logo-dark.svg` | SVG | Logo completo sobre fondo oscuro |
| `logo-light.svg` | SVG | Logo completo para fondo claro |
| `logo-mono.svg` | SVG | Logo monocromático |
| `favicon.svg` | SVG | Símbolo para favicon |
| `favicon-32.png` | PNG | Favicon 32×32 |
| `favicon-16.png` | PNG | Favicon 16×16 |
| `og-image.png` | PNG 1200×630 | Imagen para redes sociales / Open Graph |
| `brand-guidelines.md` | MD | Este documento |

---

## 12. Resumen de identidad

| Elemento | Valor |
|---|---|
| **Nombre** | ZamProp |
| **Eslogan principal** | Tu cartera inmobiliaria, bajo control. |
| **Color primario** | Navy `#0B2545` |
| **Color de acción** | Zam Blue `#1A6FA8` |
| **Color de acento** | Prop Orange `#E87D3E` |
| **Tipografía** | Inter / Geist (weight 400 y 500) |
| **Iconografía** | Tabler Icons (outline) |
| **Estilo general** | Plano, limpio, profesional, sin sombras ni degradados |

---

*ZamProp — Documento de Identidad de Marca v1.0*
*Desarrollado por Andrés Zambrana Linares*
