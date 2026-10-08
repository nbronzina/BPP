---
version: v3.0
name: BPP Analytics & Design
description: Sistema visual del estudio. Fondo Tinta (azul-negro frío), un solo acento terracota que también es el color del logo, dos familias con rol fijo (Plus Jakarta Sans para la interfaz, Literata para la prosa larga), siete tamaños de letra y un solo borde izquierdo por ancho de pantalla. Enlaces tipográficos con una flecha que dibuja el sitio. Cajas solo para lo que es un objeto. Corner brackets como firma exclusiva de La Usina.
evolution: "v1 (alpha): Space Mono, negro puro y naranja saturado. v2 (beta-inclusive, 2026-05-04): fondo levantado, blanco cálido y terracota desaturado. v2.1 (2026-06-11): Plus Jakarta Sans como familia única. v2.2 (soft-editorial, 2026-08-21): geometría blanda, dos pesos, brackets solo para La Usina, grano análogo. v2.4 (2026-09): base Tinta. v2.6 a v2.11 (septiembre y octubre de 2026): Literata para la lectura larga, sin papel, sin apariciones al scroll ni fundido de página. v3.0 (2026-10-08): el archivo describe lo que hay; una grilla, siete tamaños, una sola tarjeta, logo y acento del mismo color, inicio más corto y con el nav a la vista."
colors:
  primary: "#c16f52"                # acento y logo
  on-primary: "#12151a"
  background: "#12151a"             # Tinta
  background-deep: "#0d1014"        # registro hondo: Cuatro movimientos y contacto
  surface: "#1a1e25"
  border: "#2b313a"                 # borde de superficies y controles
  line: "rgba(250,248,246,0.08)"    # línea susurro: filas, fichas y separadores
  text-high: "rgba(250,248,246,0.95)"
  text-mid: "rgba(250,248,246,0.75)"
  text-low: "rgba(250,248,246,0.55)"
  paper: "#f4efe8"                  # figuras con fondo blanco y documentos de Gabinete
  ink: "#26221f"                    # texto sobre papel
  focus-ring: "#c16f52"
typography:
  # Dos pesos (400 y 700, más itálica 400) y siete tamaños, --fs-1 a --fs-7.
  # Los tres primeros crecen con el ancho entre 390 y 1280 px. Mínimo: 15 px.
  display:                          # --fs-1, 40 → 72: título del inicio, de Lo hecho y de Pensamiento
    fontFamily: Plus Jakarta Sans
    fontWeight: 700
    fontSize: clamp(2.5rem, 1.624rem + 3.596vw, 4.5rem)
    lineHeight: 1.05
    letterSpacing: -0.03em
  h1:                               # --fs-2, 32 → 48: título de documento, cierre, cifra
    fontFamily: Plus Jakarta Sans
    fontWeight: 700
    fontSize: clamp(2rem, 1.562rem + 1.798vw, 3rem)
    lineHeight: 1.1
    letterSpacing: -0.02em
  h2:                               # --fs-3, 26 → 34: título de bloque, numeración, cita destacada
    fontFamily: Plus Jakarta Sans
    fontWeight: 700
    fontSize: clamp(1.625rem, 1.406rem + 0.899vw, 2.125rem)
    lineHeight: 1.15
    letterSpacing: -0.01em
  h3:                               # --fs-4, 21 → 24: títulos de tarjeta, servicio y fila
    fontFamily: Plus Jakarta Sans
    fontWeight: 700
    fontSize: clamp(1.3125rem, 1.23rem + 0.337vw, 1.5rem)
    lineHeight: 1.25
  body:                             # --fs-5, 19
    fontFamily: Plus Jakarta Sans
    fontWeight: 400
    fontSize: 1.1875rem
    lineHeight: 1.6
  body-lectura:                     # --fs-5, 19, solo en la prosa de .page-lectura
    fontFamily: Literata
    fontWeight: 400
    fontSize: 1.1875rem
    lineHeight: 1.7
  body-sm:                          # --fs-6, 17
    fontFamily: Plus Jakarta Sans
    fontWeight: 400
    fontSize: 1.0625rem
    lineHeight: 1.55
  etiqueta:                         # --fs-7, 15: el único texto en mayúsculas
    fontFamily: Plus Jakarta Sans
    fontWeight: 400
    fontSize: 0.9375rem
    lineHeight: 1.4
    letterSpacing: 0.08em
    textTransform: uppercase
spacing:
  grid: 8px                         # --space-1 a --space-24: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96
  section: 160px                    # 80 px debajo de 769
  block-edge: 120px                 # 64 px debajo de 769
layout:
  gutter: "24px; 64px desde 769; 96px desde 1025"
  frame-max: 1200px
  medida: 40rem
  breakpoints: "769 (tablet hasta 1024), 1025, 1280"
rounded:
  none: 0px
  sm: 4px                           # anillo de foco, sello, aviso del CTA, gráfico dentro del papel
  md: 16px                          # imágenes, figuras, superficies, documentos, escenarios
  pill: 999px                       # solo el botón flotante "Índice"
  full: 50%                         # solo los botones de compartir
elevation:
  shadow: "0 12px 24px -12px rgba(0,0,0,0.4)"
components:
  cta-link:
    backgroundColor: transparent
    textColor: "{colors.primary}"
    typography: "{typography.body-sm}"
    fontWeight: 700
  cta-primary:
    backgroundColor: transparent
    textColor: "{colors.primary}"
    typography: "{typography.body}"
    fontWeight: 700
  nav-link:
    backgroundColor: transparent
    textColor: "{colors.text-high}"
    typography: "{typography.body-sm}"
  nav-link-hover:
    textColor: "{colors.primary}"
  tarjeta:
    backgroundColor: transparent
    imageRounded: "{rounded.md}"
  superficie:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.md}"
    padding: 24px
---

## Overview

BPP opera como un estudio de diseño estratégico, no como una agencia corporativa. El sistema visual refleja esa posición: editorial, denso, sin adornos. La referencia más cercana es Superflux por el rigor del encuadre, y Linked by Air por la economía tipográfica. Metahaven queda como techo lejano, no como molde.

El sistema existe para hacer legible una práctica (investigación, prototipos, futuros, datos) en un formato que quien decide pueda leer sin sentirse empujado. El fondo Tinta da gravedad sin agresividad. Las dos familias tienen rol fijo: la sans ordena y la serif se reserva para leer de corrido. El terracota aparece donde hay acción o dato, nunca como decoración.

Este archivo describe lo que hay en el sitio (v3.0, 8 de octubre de 2026). Si el código y este archivo no coinciden, uno de los dos está mal y se corrige en el mismo cambio. Es la fuente de verdad: si un brief, una auditoría o un agente propone cambiar un token sin pasar por acá, la propuesta se descarta. Los cambios de identidad (color, familias, logo, navegación, la primera pantalla del inicio) los deciden los socios y quedan en el Changelog con la formulación anterior.

Los archivos con prefijo `_prototype-*` están fuera del sistema por diseño. Si un prototipo se promueve a producción, se alinea primero y después se renombra sin el prefijo.

## Colors

Un acento y una base fría. El terracota y el blanco cálido del texto son lo único cálido de la paleta: por eso el acento salta.

- **Primary `#c16f52`.** Terracota BPP. Único acento y, desde v3.0, también el color del logo. Va en enlaces y CTAs, cifras, la numeración de Cuatro movimientos, estados activos (el filtro de Pensamiento, la sección actual del índice de un caso, la línea de la página actual en el nav), líneas de acento (cita destacada, aviso, lectura propia de las señales) y los brackets de La Usina. Sobre Tinta da 4,93:1. Nunca es fondo de un bloque; como fondo aparece solo en dos controles: el enlace de salto, que se ve con el foco, y los botones de compartir con hover o foco. Sin variantes (no hay primary-light ni primary-dark) y sin `opacity`. En rgba es `rgba(193,111,82,…)`, nunca `rgba(206,115,82,…)`, que era v1.
- **Background `#12151a`, Tinta.** Azul-negro frío (v2.4). Ni marrón ni negro puro.
- **Background-deep `#0d1014`.** Registro hondo: las bandas de Cuatro movimientos y del contacto del inicio. Cada una lleva una luz fría tenue (un `radial-gradient` azulado al 5 o 6 %) que entra por un lado distinto.
- **Surface `#1a1e25`.** Superficies: señales, tarjeta de la tesis, escenarios, avisos, índice de los casos, aviso del CTA del cierre.
- **Border `#2b313a`.** Borde de superficies y controles: escenarios, índice, botones de compartir y botón "Índice", portada de los casos.
- **Line `rgba(250,248,246,0.08)`.** Línea susurro. Separa filas, fichas, los datos de las tarjetas, las secciones de un caso y el cierre.
- **Text-high `rgba(250,248,246,0.95)`.** Títulos, cuerpo de la sans, nombres, enlaces del nav. 15,6:1 sobre surface.
- **Text-mid `rgba(250,248,246,0.75)`.** Bajadas, descripciones, prosa en Literata, valores de las fichas. 9,4:1.
- **Text-low `rgba(250,248,246,0.55)`.** Etiquetas, fechas, fuentes, pies de figura, rótulos de las fichas. 5,5:1: es el piso para cualquier texto.
- **Paper `#f4efe8` e ink `#26221f`.** Dos usos y ninguno más: `.figura__papel`, que enmarca los gráficos de fondo blanco (el PNG se funde con `mix-blend-mode: multiply`), y los documentos de Gabinete, que reproducen papeles de la instalación. Sobre papel, el tipo de documento va en `#8a4b31` y el sello en `#9c4f34` (5,3:1).

Reglas:

- La jerarquía se construye con tamaño y peso primero, y con los tres niveles de alfa después.
- El alfa va en el color o en `opacity`, nunca en los dos: 0,75 × 0,6 = 0,45, que no pasa AA. Ningún texto lleva `opacity`.
- La base del texto es `rgba(250,248,246,…)`, nunca `rgba(255,255,255,…)`.
- Las fotos e ilustraciones de las tarjetas llevan un velo cálido (`filter: sepia(0.12) saturate(0.95)`) que las une a la paleta.
- Los logos de clientes van en un solo tono: silueta blanca al 75 %. CESBA y Speculative Futures Madrid, que tienen detalle adentro, van en grises. Nunca en sus colores.

## Typography

**Dos familias con rol fijo, servidas desde `/fonts/`.** Plus Jakarta Sans para todo lo que es interfaz: títulos, navegación, tarjetas, etiquetas, CTAs, fichas y el texto de las páginas que no son de lectura. Literata solo para la prosa de lectura larga (`.page-lectura`: los tres casos y la tesis): párrafos, listas y definiciones dentro de sus secciones. Decisión de los socios, 2026-09: un documento de tres mil palabras se lee mejor en serif, y la serif no entra en ninguna otra superficie.

**Pesos:** 400 y 700, más itálica 400 (decisión 2026-08-21: los intermedios se percibían como otra tipografía). Los archivos son variables en peso (400..700), pero no se usan otros valores.

**Literata** (Google/TypeTogether, OFL) va con el tamaño óptico fijo en 19 (`literata-latin-opsz19.woff2` y su itálica), porque es el único tamaño en que se usa: cuerpo de 19 px con `line-height: 1.7`. Nunca en títulos ni fuera de `.page-lectura`. Si la serif pasa a otro tamaño, hay que volver a los archivos con el eje óptico completo (7..72), que siguen en git.

**Carga:** `@font-face` en `styles.css` (subset latin, `font-display: swap`) y `<link rel="preload">` de la regular de Plus Jakarta Sans en cada `<head>`, más la de Literata en las páginas de lectura. Sin Google Fonts y nunca `@import`. Mientras carga la fuente, `Plus Jakarta Sans Fallback` (Arial con métricas ajustadas) ocupa el mismo espacio y el texto no salta.

### Siete tamaños

| Token | Tamaño | Dónde |
|---|---|---|
| `--fs-1` | 40 → 72 px | Título del inicio, de Lo hecho y de Pensamiento |
| `--fs-2` | 32 → 48 px | Título de documento (casos, tesis, privacidad, 404), cierre, cifra, año de la credencial de Gabinete |
| `--fs-3` | 26 → 34 px | Títulos de bloque (`h2`), numeración de Cuatro movimientos, cita destacada, cifra del rail de natalidad, título de la tesis en Pensamiento |
| `--fs-4` | 21 → 24 px | Títulos de tarjeta, servicio y fila (`h3`); frase del inicio; enlaces del menú del teléfono; mail del contacto desde 769 |
| `--fs-5` | 19 px | Cuerpo, también en Literata; bajadas; CTA principal |
| `--fs-6` | 17 px | Descripciones de tarjeta y fila, enlaces de tarjeta y de bloque, nav, pies de figura, valores de las fichas, footer |
| `--fs-7` | 15 px | Etiquetas, rótulos de fichas y datos, fuentes |

Los tres primeros crecen con el ancho entre 390 y 1280 px (`clamp`); los otros cuatro son fijos. **15 px es el mínimo** (decisión de los socios, 2026-08-21): no hay texto más chico en ninguna página. Lo único fuera de la escala es el glifo × del botón que cierra el índice del teléfono, que no es texto.

Interletrado: −0,03em en `--fs-1`, −0,02em en `--fs-2`, −0,01em en `--fs-3` y +0,08em en las etiquetas. Los títulos van con `text-wrap: balance` y sin cortes de palabra; los párrafos, con `text-wrap: pretty` y corte automático. Las cifras van en estilo lineal, y tabulares en la numeración y los datos grandes.

### Mayúsculas

Solo en la **etiqueta** (`.etiqueta`): el tipo y la fecha de una pieza ("Provocación · agosto 2026"), el dato de una fila ("Artículo en LinkedIn · junio 2026", "Tesis · PDF de 56 páginas") y el rótulo de cada señal ("Señal débil") y de la tesis. Es lo que orienta: qué es y de cuándo. Van por CSS (`text-transform: uppercase`): en el HTML el texto va en caja normal, como se lee. Nunca en títulos, cuerpo, CTAs, nav, botones ni rótulos de fichas.

La excepción son los documentos de Gabinete: reproducen papeles administrativos y llevan en mayúsculas el tipo de documento y el sello, adentro de `.documento`.

## Layout

**Base móvil.** Los estilos sin media query son los del teléfono; el escritorio se construye encima con `min-width`. Puntos de corte: **769** (con el rango 769–1024 para tablet), **1025** y **1280**. No se agregan otros.

**Una grilla: un solo borde izquierdo por ancho.** El nav, el footer, la cabecera y cada bloque de `<main>` llevan a los lados `--marco`: el margen (`--gutter`: 24 px, 64 desde 769 y 96 desde 1025) o lo que sobre a cada lado de una columna de 1200 px, lo que sea mayor. Medido en nueve páginas, el logo, los títulos, las bajadas y las etiquetas arrancan en 24, 24, 64, 96, 120 y 360 px a 390, 768, 1024, 1280, 1440 y 1920 de ancho. Adentro de esa columna nada se centra ni suma sangría.

**Medida.** El texto de lectura se acota con `max-width` y queda alineado a la izquierda: `--medida`, 40rem, unos 70 caracteres por línea a 19 px en las dos familias. Va en rem y no en ch porque el cero de Plus Jakarta Sans es ancho y 70ch daban casi 100 caracteres. Las fuentes, a 15 px, van en 36rem. Los títulos se acotan en `ch` de su propio tamaño.

**Ritmo vertical.** Entre dos bloques hay siempre `--spacing-section` de silencio: **160 px** desde 769 y 80 en el teléfono; cada bloque pone la mitad arriba y la mitad abajo. De la cabecera al primer bloque, y del último bloque al footer, `--spacing-block-edge` (120 y 64). El silencio de 160 px es la firma del sistema: recortarlo para "mostrar más" rompe el tono. Dentro de un bloque rige la grilla de 8 (`--space-1` a `--space-24`).

**Separadores.** Entre las secciones de un caso y antes del cierre va una línea susurro del ancho del contenido, en la mitad exacta del silencio. Las bandas hondas (Cuatro movimientos y contacto) separan por fondo, sin línea.

**Navegación.** El nav es fijo y está a la vista en todas las páginas, también en el inicio desde v3.0: logo a la izquierda, las tres secciones en el medio y "Hablemos" a la derecha; en el teléfono, "Hablemos" y el menú. La navbar es elemento fijo del sistema y **no se toca**: cualquier rediseño de navegación requiere validación explícita antes de ejecutar. Hubo tres excepciones validadas, todas en el Changelog (v2.10, v2.11 y v3.0).

**Primera pantalla del inicio.** El nombre y la frase, alineados a la columna, sin ocupar la pantalla entera. A 1440 × 900 la banda de Cuatro movimientos empieza a 439 px y su título se lee en la primera vista; a 390 × 844 empieza a 372 px. El logo va una sola vez, en el nav. El título es el único movimiento de entrada del sitio (`textReveal`).

**Casos desde 1280.** El índice pegajoso va a la derecha; la cabecera y las secciones del caso le reservan 344 px (280 de índice, 32 de margen y 32 de aire), o el marco de siempre si es mayor.

## Elevation & Depth

Una sombra y un anillo de foco.

- **Sombra (`--shadow`): `0 12px 24px -12px rgba(0,0,0,0.4)`.** Para lo que flota o es un objeto: las superficies de las señales y de la tesis, el botón "Índice" y el aviso del CTA del cierre. Las superficies suman un brillo de 1 px arriba (`inset 0 1px 0 rgba(250,248,246,0.05)`). Regla: negra, alfa ≤ 0,4 y blur ≤ 24 px.
- **Foco:** `outline: 2px solid #c16f52`, separado 3 px y con radio de 4, solo con teclado (`:focus-visible`). Da 4,93:1 sobre Tinta. Es requisito WCAG (2.4.7), no decoración: no se saca ni se esconde. El destino de un ancla recibe el foco con un `tabindex` temporal y no lleva anillo.
- **Grano análogo:** ruido al 3,5 % sobre toda la página (`body::after`) y al 5 % dentro de las superficies. Rompe el render perfecto sin ensuciar el texto.
- **Transparencias:** desde 769, el nav y el índice de los casos usan Tinta translúcida con `backdrop-filter: blur()`. En las páginas de lectura el nav es sólido.

**Prohibido en la web:** glow (cualquier `box-shadow` en el acento), sombras de color, alfa mayor a 0,4, blur mayor a 24 px, `filter: drop-shadow()` en la interfaz y la sombra como estado de hover.

**Excepción:** los overlays OBS (`bpp_overlay_*.html`) usan glow y drop-shadow a propósito, por el contexto de transmisión en vivo. Ese lenguaje no se traslada al sitio.

## Shapes

**Radios:**

- **16 px (`--radius`):** imágenes de tarjeta, figuras, superficies, documentos de Gabinete, escenarios, índice de los casos, portada.
- **4 px (`--radius-sm`):** anillo de foco, sello de Gabinete, aviso del CTA, el gráfico dentro de `.figura__papel`.
- **Pill (999 px):** solo el botón flotante "Índice" de los casos (y la barra de desplazamiento).
- **50 %:** solo los botones circulares de compartir.
- **0:** todo lo demás. Los avisos y las citas con línea de acento a la izquierda llevan radio solo del lado derecho (`0 16px 16px 0`).

Sin 8, 10, 12 ni 24 px. Si algo pide "un poco más redondo", la pregunta es si pertenece al sistema.

**Cajas solo para objetos.** La prosa, las tarjetas, las filas, la ficha técnica y el cierre van sin caja: los separa el aire o una línea susurro. Llevan caja (superficie o papel, con radio) las piezas que son un objeto en sí: las señales y la tesis en Pensamiento, las figuras, los documentos de Gabinete, los escenarios (son controles), el aviso de ficción y la cita sugerida de la tesis.

**Corner brackets:** firma exclusiva de La Usina. Solo en la tarjeta de la tesis (`.tesis-card`): esquinas superior izquierda e inferior derecha, en el acento al 30 %. En el resto del sitio no se usan (v2.2).

## Components

### Enlaces de acción

BPP no usa botones con fondo. Los CTAs son tipografía en el acento, en negrita, con una flecha que dibuja el sitio.

- **`.cta-link`:** enlaces de tarjeta y de bloque ("Leer el caso", "Ir a Lo hecho"). 17 px, sin subrayado hasta el hover.
- **`.cta-primary`:** la acción principal de un bloque (el CTA del cierre, el de la tesis). 19 px, subrayado al 40 % que pasa a pleno con hover o foco, 44 px de alto mínimo.
- **La flecha** es `/img/flecha.svg` aplicada como máscara en el color del texto, a 0,85em. Plus Jakarta Sans no trae → ni ←, y cada sistema ponía otra. Modificadores: `.cta--abajo` (descargar, desplegar: la flecha gira 90°) y `.cta--atras` (volver: va antes del texto, girada 180°). La misma flecha usan "Ver proceso" y los escenarios.
- **Hover y foco:** subrayado o color, y la flecha se corre 4 px hacia donde lleva (`translate`, solo la flecha). Nada más: sin `scale`, sin empujes verticales, sin sombras, sin filtros.
- **Texto:** dice adónde lleva ("Leer el caso", "Leer en LinkedIn"), nunca "Leer más". Si el enlace lleva `aria-label`, empieza por el texto visible (WCAG 2.5.3).
- Los enlaces dentro de un párrafo van subrayados con el acento al 45 % (WCAG 1.4.1), en todas las páginas.

### Etiqueta y bajada

- **`.etiqueta`:** 15 px, peso 400, +0,08em, mayúsculas por CSS, text-low. "Tipo · fecha", con la fecha en `<time>`.
- **`.bajada`:** el párrafo que sigue a un título de página o de bloque. 19 px, text-mid, `--medida`.

### Tarjeta

Una sola plantilla para casos, docencia y artículos: la macro `tarjeta` de `src/_includes/partials/piezas.njk`, con los datos en `src/_data/piezas.mjs`. Hay una entrada por pieza; el inicio elige por id y las listas del JSON-LD salen de los mismos datos.

- Imagen 16:9 de 800 px, con radio de 16 y el velo cálido; etiqueta (tipo · fecha); título `h3`; descripción en 17 px y text-mid; ficha corta opcional (un `dl` de dos columnas en 15 px, rótulos de 6,5rem) sobre una línea susurro; enlaces al pie.
- **Sin caja:** sin fondo, borde ni sombra. La separa el aire.
- Con un solo enlace, toda la tarjeta responde al clic (el `::before` del enlace la cubre) y el nombre del enlace sigue siendo su texto.
- **Disposición:** una columna en el teléfono; en tablet (769–1024), una tarjeta por fila con la imagen a la izquierda (5 a 7); tres columnas desde 1025.

### Fila

Para listas de textos: Pensamiento en el inicio y "Seguí leyendo" en los casos y la tesis (macro `fila`).

- Título enlazado (`h3`, 21 a 24 px, text-high, pasa al acento con hover), bajada en 17 px y una etiqueta con el tipo y un dato (fecha o largo de lectura). Las filas se separan con línea susurro.
- Toda la fila responde al clic; el nombre del enlace es el título.
- Desde 769, la etiqueta va a la derecha, en la línea del título.

### Cierre

Lo último de Lo hecho, Pensamiento, los casos y la tesis (`partials/cierre.njk`): una afirmación en `--fs-2`, un texto opcional, el CTA principal, que abre el mail con un asunto propio de la página, y debajo la dirección con "Copiar dirección". Una línea susurro lo separa del bloque anterior. "Copiar dirección" es un control secundario y tipográfico: color del texto, subrayado al 30 % y acento con hover o foco. Aparece solo si el navegador puede copiar.

### Nav

- **Logo:** `/img/logo.svg`, 40 px de alto, en `#c16f52`. Una sola vez por página.
- **Enlaces:** 17 px, text-high, acento con hover. La página actual lleva una línea de 1 px en el acento debajo (`aria-current`); solo la página exacta deja de ser clicable.
- **"Hablemos" (`.nav-cta`):** en el acento, afuera de la lista y a la vista en todas las páginas, también en el teléfono.
- **Teléfono:** panel desde la derecha con los enlaces a 21 px y un velo sobre la página. Cerrado no recibe foco (`visibility: hidden`); Escape y el clic afuera lo cierran.
- **Fondo:** Tinta al 95 % en el teléfono; al 65 % con desenfoque desde 769; sólido en las páginas de lectura.

### Footer

La marca y el año en una línea; la práctica y las ciudades en 15 px; el mail y la política de privacidad en 17 px; los íconos sociales a 24 px en text-low, acento con hover. Borde superior en el acento al 20 %.

### Inicio

- **Cuatro movimientos:** filas separadas por línea susurro, con el número (01 a 04) en el acento a `--fs-3`, a la izquierda desde 769. La numeración existe solo acá, porque es un orden de trabajo. "Ver proceso" despliega las etapas.
- **Hechos** muestra los tres casos en tarjetas; **Pensamiento**, la tesis y los dos artículos más recientes en filas. Cada bloque termina con un enlace a su sección.
- **Equipo:** retratos recortados y compuestos sobre Tinta, sin marco ni sombra; nombre, rol, ciudad y una bio de perspectiva. Una columna en el teléfono; en tablet, un socio por fila con el retrato a la izquierda; tres columnas desde 1025. Sin efectos de hover.
- **Clientes:** logos en un solo tono (ver Colors), en una fila que se acomoda al ancho. Dos ajustes de alto: las marcas cuadradas, más altas; los wordmarks muy anchos, más bajos.
- **Contacto:** tres situaciones separadas por línea, el mail en grande, "Copiar dirección", la promesa de respuesta y las dos direcciones.

### Casos como documento

Un caso se lee como un documento, no como una grilla de tarjetas.

- **Cabecera:** etiqueta, título en `--fs-2`, bajada y ficha técnica (filas con línea susurro, rótulo en 15 px y valor en 17 px; desde 769, rótulos en una columna de 9rem). La portada, si hay, con borde y radio de 16.
- **Secciones:** título `h2` en `--fs-3` y prosa en Literata (19 px, 1,7, text-mid, `--medida`), sin cajas.
- **Figura:** imagen con radio de 16; los gráficos de fondo blanco van sobre papel (`.figura__papel`). Pie en la sans, 17 px, text-low.
- **Cita destacada:** una frase del propio caso, en la sans a `--fs-3` y en negrita, con una línea de 3 px del acento a la izquierda. Sin caja ni comillas.
- **Cifra:** un dato en `--fs-2` y en el acento, antes del párrafo que lo explica.
- **Aviso** (`.ficcion-aviso`): interrumpe la lectura a propósito (la frontera entre dato y ficción, lo que implica). Superficie con línea de acento a la izquierda.
- **Fuentes:** 15 px, text-low, 36rem.
- **El caso en cuatro respuestas:** la pregunta en 19 px y negrita, la respuesta en Literata; dos columnas desde 1025.
- **Escenarios:** acordeones uno debajo del otro, con caja porque son controles; la flecha gira al abrir.
- **Documentos de Gabinete:** papeles de la instalación reproducidos como texto sobre `--paper`, con tachados (spans vacíos: lo que no se puede contar no existe en el DOM), renglones en blanco y el sello ARCHIVADO.
- **Índice:** desde 1280, pegajoso a la derecha (280 px); aparece después de 400 px de scroll y se va al llegar al cierre. En natalidad suma el rail de cifras. Debajo de 1280, un botón "Índice" (pastilla) que se esconde mientras se baja leyendo y abre un diálogo: Escape lo cierra y el foco vuelve al botón.
- **Compartir:** desde 1280, botones circulares a la izquierda.
- **Seguí leyendo:** después del cierre, las otras piezas largas en filas.

### Pensamiento

- **Índice:** tres filas tipográficas al principio de la página.
- **Señales:** superficies con la etiqueta, el titular en 19 px, el análisis, la lectura propia con línea de acento y la fuente al pie. Una columna; tres desde 1280.
- **Filtro:** botones tipográficos en 17 px; el activo, en el acento y subrayado con 2 px.
- **Tesis de La Usina:** la única tarjeta con corner brackets.

### Logo

Archivo `/img/logo.svg` con el relleno en `#c16f52`, el mismo naranja del acento (desde v3.0; antes `#e9804d`). Los favicons, el ícono de Apple, `img/logo.webp` y la imagen al compartir salen del mismo color. Sin filtros ni variantes.

## Do's and Don'ts

Los errores que se repiten, para que no se reintroduzcan.

### Do

- Validar cualquier cambio de token contra este archivo antes de aplicarlo, y actualizar este archivo en el mismo cambio.
- Usar `#c16f52` exacto, también en rgba: `rgba(193,111,82,…)`.
- Usar los siete tamaños de la escala (`--fs-1` a `--fs-7`), nada por debajo de 15 px.
- Usar los pesos 400 y 700 (más itálica 400) y cargar las fuentes con `@font-face`.
- Llevar todo bloque nuevo al marco (`.bloque` o `.cabecera`) y acotar el texto con `--medida`, alineado a la izquierda.
- Mantener 160 px de silencio entre bloques desde 769 (80 en el teléfono).
- Escribir mayúsculas solo en `.etiqueta`, y por CSS.
- Implementar los CTAs como tipografía con la flecha del sitio (`.cta-link`, `.cta-primary`).
- Sumar una pieza nueva como una entrada en `src/_data/piezas.mjs`, no como una tarjeta escrita a mano.
- Dar caja solo a lo que es un objeto; separar el resto con aire o con línea susurro.
- Mantener el anillo de foco en `:focus-visible`.
- Reservar los corner brackets para La Usina.
- Mantener el grano análogo del body (~3,5 %).

### Don't

- **No volver a Space Mono** (v1) **ni reintroducir el híbrido Bros Oskon + Chivo** (especificado en v2, nunca en producción; v2.1 lo retiró).
- **No agregar familias tipográficas.** Atkinson, IBM Plex, Lexend, Work Sans e Inter ya fueron retiradas o rechazadas. Literata no sale de la prosa de `.page-lectura`.
- **No agregar tamaños, pesos ni puntos de corte.**
- **No saturar el terracota** (`#ce7352` era v1), **no bajar el fondo a negro puro** (`#0a0a0a` era v1), **no usar blanco puro** (`rgba(255,255,255,…)` era v1).
- **No centrar bloques ni sumar sangrías dentro de la columna:** un solo borde izquierdo.
- **No usar mayúsculas** en títulos, nav, botones, CTAs ni rótulos.
- **No numerar lo que no es una secuencia.** La numeración queda solo en Cuatro movimientos.
- **No usar `transform: scale()` ni `translateY()` en hovers**, ni glow, sombras de color o sombras como estado de hover.
- **No usar radios fuera de 16, 4, pill y 50 %**, y pill y 50 % solo donde dice Shapes.
- **No convertir CTAs en botones con fondo** ni escribir la flecha como carácter.
- **No poner el logo dos veces en una página**, ni en otro color que el acento.
- **No mostrar los logos de clientes en sus colores.**
- **No trasladar el lenguaje de los overlays OBS a la web.**
- **No ejecutar auditorías de performance que toquen tipografía o color sin revisar este archivo.** Si una auditoría lo recomienda, se evalúa a mano: no se aplica.
- **No interpretar "editorial dark" como "bold and dramatic".** El sistema es denso pero sobrio.

## Voice

La voz del estudio está documentada en `VOICE.md` como archivo hermano de este documento. El sistema visual y la voz se co-determinan: las decisiones de densidad tipográfica y economía cromática vienen del mismo principio que rige el copy, editorial y no corporativo, concreto y no abstracto. Cualquier decisión de copy que contradiga el registro definido en `VOICE.md` genera fricción con este sistema visual.

## Referencias

- **Superflux** (superflux.in): rigor del encuadre, copy de proyecto sin adorno.
- **Linked by Air:** economía tipográfica, uso disciplinado de pocas familias.
- **Metahaven:** techo lejano de densidad editorial, no molde.

Estudios que **no** son referencia: landing pages SaaS con gradientes y glows, sitios de consultoras Big Four, thought leadership corporativo. Si una sugerencia acerca el sistema a ese territorio, la sugerencia se rechaza.

## Validación

Este archivo (v3) cumple en parte con la especificación `@google/design.md` (alpha spec, Google Labs). El linter reporta errores y advertencias, todos intencionales:

**Errores intencionales:**
- **rgba() en tokens de color:** los niveles de texto (`text-high`, `text-mid`, `text-low`) y la línea susurro usan `rgba(250,248,246,…)` con distinto alfa, para mantener la misma relación sobre Tinta, surface y el registro hondo. El linter espera hex o nombrados.
- **Tokens descriptivos:** el gutter, la medida y los puntos de corte del YAML están escritos como texto, porque cambian con el ancho.

**Advertencias intencionales:**
- **border-radius: 50 %:** solo en los botones circulares de compartir.
- **Valores fuera de los tokens:** el brillo interior de las superficies y el anillo de foco se escriben en su regla, no como token.

**Decisión:** no corregir estos casos. El sistema prioriza coherencia semántica, diseño inclusivo y legibilidad del código sobre la conformidad estricta con el linter alpha de Google Labs.

## Changelog

**v3.0 un sistema que describe lo que hay (2026-10-08):** propuesta de diseño en tres niveles, aprobada entera por Nicolás: "Hacé todo, desde nivel 1 al último". Se mantienen Tinta, el terracota `#c16f52`, las dos familias, los CTAs tipográficos, el silencio de 160 px, los documentos de Gabinete y la numeración 01 a 04. Las cifras de abajo están medidas en las nueve páginas, antes y después.

*Nivel 1, sin cambiar la identidad:*
- Este archivo pasa a describir el sitio y resuelve las ocho contradicciones que listó la auditoría de octubre. Decía, entre otras cosas: "Pesos cargados: 300, 400, 500, 600, 700"; fuentes "cargada vía `<link>`"; "Prohibido: radios mayores a 8px"; corner brackets que "aparecen en hero, en cards de proyecto"; una sombra "`0 2px 8px rgba(0,0,0,0.3)`" junto a una "sombra cálida (`--shadow-card`)"; el logo como "SVG base64 embebido, aplicado con `filter: brightness(0) invert(1)`"; un efecto de equipo con foto flotante que "no se reemplaza con un tooltip ni con un card", y que ya no existía; y un fondo "dark warm gray" de "temperatura marrón".
- Una grilla. Antes había entre 7 y 11 bordes izquierdos distintos por ancho de pantalla (bloques centrados en 800 o 900 px, sangrías de 24 px, desplazamientos de grilla rota); ahora uno, `--marco`.
- Siete tamaños de letra. Antes había 15 o 16 tamaños de Plus Jakarta Sans por ancho, de 13 a 73,6 px, con los rótulos de las fichas en 13 px; ahora `--fs-1` a `--fs-7` y ningún texto por debajo de 15 px.
- Una sola tarjeta, con los datos en un archivo (punto 7 de la auditoría). Antes eran veinte tarjetas escritas a mano en tres páginas, que ya no coincidían entre el inicio y los listados, más una tercera copia en el JSON-LD; eran cajas (superficie, borde y radio) con la imagen alternando de lado. Ahora la tarjeta no tiene caja y cada imagen de tarjeta es un archivo de 800 px.
- La flecha la dibuja el sitio. Antes era el carácter → de una fuente del sistema, distinta en cada dispositivo; el JS que la envolvía no encontraba la del cierre, y solo la flecha hacia atrás se movía con el hover.
- La cita destacada pierde la caja y la comilla. Antes: fondo blanco al 4 %, radio de 8 px y una comilla de Georgia de 5rem en el acento al 30 %, con el texto a 19 px.
- Una sombra, de alfa 0,4 y blur 24. Antes: `0 24px 48px -28px rgba(0,0,0,0.55)` y glow terracota al hover.
- Radios: 16, 4, pill y 50 %. Antes había, además, 8 y 10 px.
- La medida de lectura pasa a `--medida`, 40rem: unos 70 caracteres por línea en las dos familias. Antes era `70ch`, y como el cero de las dos familias es ancho, la prosa de los casos y la tesis tenía entre 78 y 93 caracteres por línea a 1440, y la de privacidad, 87.
- Sale `--color-text-faint`: ningún texto lo usaba.
- Las dos últimas consultas `max-width` (documentos de Gabinete e índice de los casos) pasan a base móvil. En el teléfono, el sello ARCHIVADO deja de tapar el encabezado del documento.

*Nivel 2:*
- Mayúsculas solo donde orientan: el tipo de pieza y el año. Antes: "Mayúsculas se usan sólo en wayfinding y metadata — navegación, etiquetas de sección, numeración, tags", que en la práctica eran 209 textos en 25 clases (nueve páginas a 1440). Ahora son 67, todos etiquetas salvo los cinco de los documentos de Gabinete. Salen los rótulos en mayúsculas que iban sobre los títulos de bloque.
- Los casos son documentos: la prosa va sin cajas, y llevan caja solo las figuras, los documentos, los escenarios y el aviso.
- Los logos de clientes, en un tono. Antes, cada uno en su color.
- Un inicio más corto. "Pensamiento y trabajo aplicado", con cinco tarjetas, pasa a dos bloques: "Hechos", con los tres casos en tarjetas, y "Pensamiento", con la tesis y los dos artículos más recientes en filas. El inicio mide 10.509 px a 390 de ancho (antes 14.354) y 6.480 a 1440 (antes 9.338).

*Nivel 3, identidad:*
- El logo pasa al color del acento: de `#e9804d` a `#c16f52`. Antes había dos naranjas, el del logo más claro y más saturado que el de los enlaces. Cambian también los favicons, el ícono de Apple, `img/logo.webp` y la imagen al compartir.
- La primera pantalla del inicio deja de ocupar la pantalla entera, el nav se ve desde el principio y el logo va una sola vez. Antes (2026-09-06): "el hero del inicio ocupa la primera pantalla entera: descuenta el alto del nav fijo y centra el bloque de marca en lo que se ve, sin que asome la sección siguiente", con un logo grande en el hero que se cruzaba con el del nav al bajar. Es la tercera excepción validada a "la navbar no se toca": en el inicio el nav ya no se esconde. Ahora Cuatro movimientos empieza a 439 px en 1440 × 900 y a 372 px en 390 × 844; antes, justo en el borde inferior de la pantalla.

**v2.11 UX de octubre (2026-10-08):** decisiones de Nicolás sobre nueve propuestas de interfaz ("Hacer todo").
- Navbar, segunda excepción validada a "no se toca": "Hablemos" va afuera del menú y a la vista en todas las páginas, también en el teléfono (antes, fuera del inicio, quedaba adentro del menú desplegable). La página actual se marca con el subrayado y el acento queda para "Hablemos". Desde un caso, "Lo hecho" vuelve a ser clicable.
- Cierre de página: el CTA abre el mail con un asunto propio de cada página en lugar de llevar a `/#contact`. Debajo van la dirección y "Copiar dirección", un control secundario y tipográfico: color de texto, subrayado susurro y acento con hover o foco. El mismo botón va bajo el mail del contacto del inicio.
- "Seguí leyendo": al final de los casos y de la tesis, después del cierre, las otras piezas largas en filas tipográficas como las del índice de Pensamiento. Reemplaza las filas "Relacionado" de los créditos.
- Un solo eje izquierdo en los heros: label, título, bajada y metadatos arrancan en la misma línea. La bajada iba centrada en 800 px y los labels tenían 24 px de sangría, resto del borde de color que llevaban antes de v2.2.
- Ficha técnica: la de Créditos es la misma que la del hero, en Plus Jakarta Sans (sus valores salían en Literata). En escritorio la columna de etiquetas mide 9rem, lo que ocupa la más larga; en el teléfono la etiqueta va arriba del valor.
- Índice de los casos desde 1280 px (antes 1536): el caso le reserva el ancho a la derecha hasta 1696 px y el índice se va cuando llega el cierre. El breakpoint de 1536 deja de usarse. Debajo de 1280, el botón flotante pasa de un círculo con las tres rayas del menú a una pastilla que dice "Índice", y se esconde mientras se baja leyendo.
- Numeración solo donde hay secuencia: queda el 01 a 04 de los cuatro movimientos y sale del índice de Pensamiento y de las situaciones de Conversemos.
- El hero del inicio sigue a pantalla completa (decisión del 2026-09-06). Se corrigió su descripción en "Paleta Tinta", que seguía diciendo 78svh.

**v2.10 auditoría de octubre (2026-10-08):** decisiones de Nicolás sobre `docs/auditoria-octubre.md`, puntos 3 a 5.
- Literata con el tamaño óptico fijo en 19 y peso 400..700: 85,7 → 37,4 KB la regular y 88,8 → 38,7 KB la itálica. Antes: "variable en peso 400..700 y tamaño óptico 7..72, con `font-optical-sizing: auto`". Se pierde el ajuste óptico en otros tamaños, que la serif no usa.
- Sin fundido de página al cargar (el `fadeIn` del body, de noviembre de 2025): Chromium no registraba la primera pintura y Lighthouse no podía medir el inicio. Se pierde el gesto de entrada; queda el del título del inicio.
- Navbar, excepción validada a "no se toca": en el inicio aparece si recibe el foco del teclado o si no hay JavaScript, y el menú móvil cerrado deja de recibir foco. Con mouse o dedo se ve igual que antes.
- Etiquetas de categoría (`.actividad-category-badge`): fondo `--color-bg` en lugar del terracota al 12 %, que dejaba el texto en 3,89:1. Sobre Tinta da 4,93:1.
- Enlaces de las páginas legales (`.legal-link`): subrayados como los de la prosa (WCAG 1.4.1).

**v2.7 sin papel (2026-09-06):**
- Se retiran del CSS las 103 reglas de `body.page-papel` y los tokens `--paper`, `--paper-elevated`, `--ink-*`, `--accent-on-paper*`. Ver "Superficie de lectura (v2.3): retirada".
- Regla nueva de contraste: el alfa va en el color o en `opacity`, nunca en los dos; y el accent `#c16f52` nunca lleva `opacity` (sobre `#12151a` da 4,93:1 y cualquier atenuación lo baja de AA).
- Breakpoints: 769 (con el rango 769–1024 para tablet), 1025, 1280 y 1536 para el índice pegajoso. No se agregan otros.

**v2.3 superficie de lectura (2026-09-03):**
- Documentos largos (`body.page-lectura`: reporte de natalidad, Trace Group, tesis-01) pasan el cuerpo a papel cálido `#f4efe8`; nav, footer y hero siguen oscuros. Tokens `--paper`, `--paper-elevated`, `--ink-*`, `--accent-on-paper`. Retirado en v2.7.

**v2.1 beta-inclusive (2026-06-11):**
- Tipografía: híbrido ZT Bros Oskon + Chivo (especificado, nunca implementado) → Plus Jakarta Sans como familia única en todo el sistema. Decisión de Nicolás tras auditoría completa que mostró 0% de implementación del híbrido.
- Focus ring: alpha 0.2 → 0.55 para cumplir contraste no-textual 3:1 (WCAG 2.4.7).
- Tokens rgba del primary normalizados a `rgba(193,111,82,…)` (el equivalente exacto de `#c16f52`); se purgó `rgba(206,115,82,…)` (v1).
- Fuentes Bros Oskon y Chivo retiradas del repo (`/fonts/`).

**v2 beta-inclusive (2026-05-04):**
- Tipografía: Space Mono monowidth única → ZT Bros Oskon (display/headings) + Chivo (body)
- Background: `#0a0a0a` negro puro → `#12151a` dark warm gray lifted
- Text: `rgba(255,255,255,...)` blanco puro → `rgba(250,248,246,...)` warm off-white
- Primary: `#ce7352` naranja saturado → `#c16f52` terracotta desaturado
- Rationale: Priorización de diseño inclusivo sobre signature de alto contraste. Reduce fatiga visual, mejora legibilidad en textos largos, mantiene identidad editorial.

**v1 alpha (2024-2026):**
- Sistema original: Space Mono exclusiva, negro puro, contraste alto
- Signature: Monowidth radical, alto contraste como parte de identidad
- Mantenido en archivos `_archive/` para referencia histórica

## Decisiones anteriores

Dos decisiones que ya no describen el sitio, con su texto de entonces. Quedan porque explican por qué el sistema es como es.

### Superficie de lectura (v2.3): retirada

> **Formulación original (2026-09-03):** "Oscuro = marca, papel = lectura larga. Nav, footer y el bloque hero/título de cada página siguen en el registro oscuro. El cuerpo de los documentos largos (reporte de natalidad, Trace Group, tesis-01) pasa a una superficie de papel cálido `#f4efe8`, con tinta `rgba(18, 21, 26, …)` y acento oscurecido `#9a4f36` para cumplir AA."

- **Qué resolvía.** La lectura de corrido de documentos de 2.000 a 3.000 palabras por gente que lee mucho en papel, a veces imprime, y se cansa del texto claro sobre oscuro.
- **Qué cambió.** El 2026-09-04 los socios eligieron todo Tinta con el prototipo a la vista. Las reglas quedaron dormidas bajo `body.page-papel` y el 2026-09-06 se retiraron del CSS: 103 reglas y ocho tokens que ninguna página activaba. Siguen en el historial de git.
- **Por qué.** Un sistema de dos superficies es dos veces el trabajo de contraste, tokens y componentes para una sola familia de páginas. Lo que el papel aportaba a la lectura larga se conservó por otra vía: Literata en la prosa, cuerpo de 19px, medida de 70ch (hoy `--medida`, 40rem) y nav sólido (`body.page-lectura`).
- **Qué se perdió.** La opción de imprimir con fondo claro sin hoja de estilos de impresión, y el corte visual entre marco y documento. Si se vuelve a necesitar, la referencia está en el commit que lo retiró.

Lo que hoy es papel en el sistema es otra cosa: `.figura__papel` (v2.6), que enmarca gráficos de fondo blanco, y los documentos de Gabinete. Son objetos, no una superficie de página (ver Colors).

### Paleta Tinta (v2.4, 2026-09)

Decisión de los socios: se mantiene el oscuro, cambia la base. El marrón cálido (`#1a1512`) pesaba y se había vuelto genérico. La base pasa a un azul-negro frío, **Tinta**, y el terracota y el texto crema quedan como lo único cálido: por eso el acento salta más que antes.

- `--color-bg: #12151a` · `--color-surface: #1a1e25` · `--color-bg-deep: #0d1014` · `--color-bg-warm: #161a20` · `--color-border: #2b313a`
- Acento sin cambios: `#c16f52`.
- Retratos del equipo recompuestos sobre `#12151a`.
- Hero acotado a `clamp(520px, 78svh, 820px)`, bloque centrado; la sección siguiente arranca a 48px. Desde el 2026-09-06 el hero del inicio ocupa la primera pantalla entera: descuenta el alto del nav fijo y centra el bloque de marca en lo que se ve, sin que asome la sección siguiente. Desde el 2026-10-08 (v3.0) ya no: ver Layout y Changelog.

#### Tinta en todo el sitio (2026-09-04)

Los socios pidieron sacar el papel: los tres documentos largos vuelven a fondo Tinta, con la serif y los 19px de cuerpo intactos. `body.page-lectura` significa solo "lectura larga": serif en la prosa y nav sólido. Las reglas del papel quedaron dormidas bajo `body.page-papel` hasta el 2026-09-06, cuando se retiraron del CSS (v2.7).
