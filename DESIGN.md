---
version: soft-editorial-2.2
name: BPP Analytics & Design
description: Sistema visual del estudio. Fondo dark warm gray, tipografía Plus Jakarta Sans (familia única, jerarquía por peso y tamaño), acento terracota y corner brackets como firma exclusiva de La Usina. Geometría blanda, elevación por superficie y sombra cálida, grano análogo sutil. Editorial inclusivo, no corporativo.
evolution: "v1 (alpha) usaba Space Mono monowidth + negro puro + contraste alto como signature. v2 (beta-inclusive) prioriza diseño inclusivo: reduce fatiga visual con warm off-white, terracota desaturado, y dark warm gray. v2.1 consolida la tipografía en Plus Jakarta Sans como familia única (decisión 2026-06-11). v2.2 (soft-editorial, decisión 2026-08-21) abandona la geometría de wireframe: los corner brackets dejan de ser dispositivo global y quedan reservados como firma de La Usina; los bordes de 1px bajan a susurro (alpha ≤ 0.15) y la elevación pasa a superficie + sombra cálida; radios md 8px → 16px; badges rectangulares → pill; se suma grano análogo sutil (~3.5% opacity) sobre toda la página."
colors:
  primary: "#c16f52"
  on-primary: "#1a1512"
  background: "#1a1512"
  background-deep: "#16110e"   # registro hondo: secciones de peso (services, contacto)
  surface: "#221d18"
  text-high: "rgba(250,248,246,0.95)"
  text-mid: "rgba(250,248,246,0.75)"
  text-low: "rgba(250,248,246,0.55)"
  text-faint: "rgba(250,248,246,0.35)"
  border: "rgba(250,248,246,0.12)"
  border-active: "#c16f52"
  focus-ring: "rgba(193,111,82,0.2)"
typography:
  # Decisión 2026-08-21 (feedback socios): DOS pesos únicamente — 400 y 700
  # (+ itálica 400). Los intermedios (500/600) y el light (300) se percibían
  # como tipografías distintas. Escala global subida: base 19px, mínimo 15px.
  wayfinding:
    fontFamily: Plus Jakarta Sans
    fontWeight: 400
    fontSize: 0.9375rem
    letterSpacing: 0.12em
  h1:
    fontFamily: Plus Jakarta Sans
    fontWeight: 700
    fontSize: clamp(3rem, 7vw, 4.5rem)
    lineHeight: 1.08
    letterSpacing: -0.01em
  h2:
    fontFamily: Plus Jakarta Sans
    fontWeight: 700
    fontSize: clamp(2.375rem, 5vw, 3.25rem)
    lineHeight: 1.15
  body-md:
    fontFamily: Plus Jakarta Sans
    fontWeight: 400
    fontSize: 1.1875rem
    lineHeight: 1.6
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontWeight: 400
    fontSize: 1rem
    lineHeight: 1.55
  metadata:
    fontFamily: Plus Jakarta Sans
    fontWeight: 400
    fontSize: 0.9375rem
    letterSpacing: 0.08em
spacing:
  xs: 8px
  sm: 16px
  md: 24px
  lg: 48px
  xl: 96px
  section: 160px
rounded:
  none: 0px
  sm: 4px
  md: 16px
  pill: 999px
  full: 50%
components:
  cta-typographic:
    backgroundColor: "transparent"
    textColor: "{colors.primary}"
    typography: "{typography.body-md}"
    rounded: "{rounded.none}"
    padding: 0px
  cta-typographic-hover:
    textColor: "{colors.primary}"
  nav-link:
    backgroundColor: "transparent"
    textColor: "{colors.text-high}"
    typography: "{typography.metadata}"
    padding: 8px
  nav-link-hover:
    textColor: "{colors.primary}"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-high}"
    rounded: "{rounded.md}"
    padding: 24px
---

## Overview

BPP opera como un estudio de diseño estratégico, no como una agencia corporativa. El sistema visual refleja esa posición: editorial, denso, sin adornos. La referencia más cercana es Superflux por el rigor del encuadre, y Linked by Air por la economía tipográfica. Metahaven queda como techo lejano, no como molde.

El sistema existe para hacer legible una práctica — investigación exploratoria, prototipos, futuros — en un formato que el cliente pueda leer sin sentirse empujado. Cada decisión visual sirve a eso. El fondo dark warm gray da gravedad sin agresividad. La tipografía híbrida (geométrica para estructura, neutral para lectura) mantiene personalidad donde importa y optimiza legibilidad donde se necesita. El terracotta aparece donde hay acción o dato, no donde hay decoración.

**Evolución v1 → v2 (beta-inclusive):** La versión alpha usaba negro puro (`#0a0a0a`), Space Mono monowidth exclusiva, y naranja saturado (`#ce7352`) como signature de alto contraste. La versión beta-inclusive prioriza diseño inclusivo: warm off-white reduce fatiga ocular, terracotta desaturado mantiene identidad sin strain visual, dark warm gray lifted reduce contraste extremo. El sistema mantiene densidad editorial pero humaniza el contraste para sesiones prolongadas. No es deriva — es evolución intencional aprobada 2026-05-04.

Este documento es la fuente de verdad del sistema. Si un brief, una auditoría o un agente sugiere cambios de token sin revisar este archivo primero, el cambio se descarta.

Los archivos con prefijo `_prototype-*` están **fuera del sistema por diseño**. Son terreno de exploración y no se auditan contra este documento. Si un prototipo va a promoverse a producción, se alinea primero y después se renombra sin el prefijo.

## Colors

La paleta tiene cuatro registros y un solo acento. Temperatura cálida unificada (warm gray fondo + warm off-white texto + terracotta accent) para coherencia inclusiva.

**Principio inclusivo:** Pure black + pure white + naranja saturado generan fatiga visual acumulativa, especialmente en lecturas largas o uso nocturno. El sistema beta-inclusive reduce strain manteniendo legibilidad WCAG AA y personalidad visual.

- **Primary `#c16f52`:** Terracotta BPP. Único acento del sistema. Desaturado ~15% vs. v1 para reducir agresividad visual sin perder identidad. Aparece en CTAs tipográficos, brackets esquineros, puntos de énfasis en datos, y en estados activos. Nunca como fondo de bloque completo. Nunca en variantes (no hay primary-light, primary-dark, primary-container). Un solo valor, usado con intención. **No se vuelve a saturar** — la dirección es terracotta orgánico, no "highlighter alert".

- **Background `#1a1512`:** Dark warm gray del sistema. Lifted ~40% lightness vs. negro puro (`#0a0a0a` de v1) para reducir contraste extremo. Mantiene atmósfera oscura editorial pero elimina "halo effect" de texto blanco sobre negro puro. Temperatura marrón (no gris neutro) armoniza con terracotta y off-white.

- **Surface `#221d18`:** Elevated surface. Ligeramente más claro que background para jerarquía de profundidad en cards.

- **Text-high `rgba(250,248,246,0.95)`:** Texto principal. Warm off-white en lugar de blanco puro. Headlines, párrafos de cuerpo, contenido que el lector debe absorber. El tono cálido reduce fatiga ocular y armoniza con la paleta marrón-terracotta.

- **Text-mid `rgba(250,248,246,0.75)`:** Segundo nivel. Subtítulos, contexto secundario, descripciones.

- **Text-low `rgba(250,248,246,0.55)`:** Metadata visible pero subordinada. Fechas, roles, tags.

- **Text-faint `rgba(250,248,246,0.40)`:** Solo texto grande (≥24px, o ≥18.66px en bold) o decorativo: numeración de secciones, separadores. Da 3.6:1 sobre surface, que es el mínimo WCAG para texto grande. Nunca para cuerpo, metadata ni fuentes: ahí el piso es text-low (0.55, 5.5:1).

- **Border `rgba(250,248,246,0.12)`:** Divisores sutiles. No competir con el contenido.

- **Border-active `#c16f52`:** Forma preferente de marcar hover o estado activo en elementos interactivos.

- **Focus-ring `rgba(193,111,82,0.2)`:** Anillo de foco para accesibilidad. Ver Elevation & Depth.

Regla operativa: la jerarquía se construye con tamaño y peso primero, y con los cuatro niveles de alpha después. No se aplica `opacity` a elementos con texto legible: el alpha ya está calibrado y la opacidad encima lo rompe (0.75 × 0.6 = 0.45, que no pasa AA). La jerarquía por opacidad se mantiene intencional. La base cálida (`rgba(250,248,246,...)` en lugar de `rgba(255,255,255,...)`) es el cambio core — permite profundidad jerárquica sin agresividad visual.

## Typography

**Familia única: Plus Jakarta Sans (self-hosted).**

**Evolución v1 → v2 → v2.1:** La versión alpha usaba Space Mono monowidth exclusiva — identidad radical donde cada texto se leía "como material de estudio". La v2 beta-inclusive especificó un híbrido ZT Bros Oskon (display) + Chivo (body) que **nunca llegó a producción**: el sitio se construyó entero sobre Plus Jakarta Sans. La v2.1 (2026-06-11) reconoce esa realidad y la consolida como decisión: una sola familia, jerarquía por peso y tamaño.

**Plus Jakarta Sans** (Tokotype, opensource, servida desde `/fonts/`):
- Uso: todo el sistema — headings, navegación, body copy, metadata, CTAs
- Carácter: Geométrica humanista, moderna sin ser genérica. Buena legibilidad en textos largos y personalidad suficiente en titulares con peso 600-700.
- Pesos cargados: 300, 400, 500, 600, 700 + itálica 400. No cargar pesos que no se usan.
- Carga: `@font-face` en `styles.css` apuntando a `/fonts/plus-jakarta-sans-latin*.woff2` (variable 400..700, subset latin, `font-display: swap`), más `<link rel="preload" as="font">` de la regular en cada `<head>`. Sin Google Fonts: un origen menos en la CSP, sin dependencia externa, y el mismo archivo se cachea para todo el sitio. Nunca `@import` dentro del CSS.
- Jerarquía: peso 600-700 para headings y CTAs, 400-500 para body y metadata. La jerarquía se apoya en tamaño, peso y opacidad.

**Rationale de v2.1:** El híbrido Bros Oskon + Chivo era una especificación sin implementación (0% en producción). Mantener una fuente de verdad que contradice el 100% del sitio generaba drift permanente. Plus Jakarta Sans ya demostró funcionar en todos los contextos del sitio (hero, artículos largos, formularios, metadata). Las fuentes Bros Oskon y Chivo se retiraron del repo.

Mayúsculas se usan sólo en **wayfinding y metadata** — navegación, etiquetas de sección, numeración, tags. Nunca en titulares descriptivos, nunca en cuerpo, nunca en CTAs. El uso de mayúsculas señala "esto es orientación, no contenido". La transformación se aplica vía CSS (`text-transform: uppercase`), no se escribe en el texto original.

La jerarquía tipográfica se apoya en tamaño, peso y opacidad dentro de la misma familia.

## Layout

**Mobile-first, desktop adapted.** Los estilos base describen la experiencia en móvil; el desktop se construye encima con `@media (min-width: 769px)`. La pantalla grande expande el grid y el ritmo vertical — no es la referencia desde la que se recorta. Al escribir CSS nuevo: primero el caso móvil sin media query, después el enhancement desktop.

El espaciado respira. El token `section: 160px` entre bloques mayores es signature del sistema — genera silencio visual entre ideas. Recortar ese espaciado para "mostrar más" rompe el tono.

La navbar superior es elemento fijo del sistema y **no se toca**. Cualquier tarea que implique rediseño de navegación requiere validación explícita antes de ejecutar.

## Elevation & Depth

El sistema usa elevación con mucha mesura. No hay dramatismo de sombra, pero tampoco es plano absoluto — hay dos usos permitidos y una excepción documentada.

**Permitido:**

- **Shadow sutil para separación de cards:** `0 2px 8px rgba(0,0,0,0.3)` o hasta `0 4px 20px rgba(0,0,0,0.4)`. Regla operativa: `alpha ≤ 0.4`, `blur ≤ 24px`, color siempre negro. Existe para separar tarjetas del fondo cuando la jerarquía por opacidad no alcanza. No para "dar peso" ni para crear efecto cinemático.
- **Focus ring (accesibilidad):** `box-shadow: 0 0 0 3px rgba(193,111,82,0.55)` aplicado en `:focus-visible`. El alpha 0.55 es el mínimo para cumplir contraste no-textual 3:1 (WCAG 2.4.7) sobre el fondo `#1a1512` — el valor histórico 0.2 era prácticamente invisible. Es requisito WCAG, no decoración. No se remueve ni se oculta.

**Prohibido en la web:**

- Glow naranja. `box-shadow` con cualquier `rgba(206,115,82,...)` fuera del focus ring queda fuera del sistema. El glow pertenece solo a los overlays OBS por el contexto de transmisión en vivo, y no se traslada al sitio.
- Shadows intensas: `alpha > 0.4`, `blur > 24px`, o cualquier combinación que sugiera "flotar con peso". El sistema es denso, no dramático.
- Shadows de color distinto al negro.
- Cualquier uso de `filter: drop-shadow(...)` en elementos de UI regulares.

**Excepción explícita:** los overlays OBS (`bpp_overlay_*.html`) usan glow y drop-shadow intencionalmente. Ese tratamiento está correcto en ese archivo y no se toca.

## Shapes

El sistema tiene dos formas estructurales y una escala acotada de radios.

**Formas estructurales:**

- **Corner brackets (`⌐ ¬ ⌙ ⌎`):** Encuadre principal de bloques destacados. Aparecen en hero, en cards de proyecto, en el frame de cada overlay. Son dispositivo signature — si un componente "importante" no tiene brackets, o está fuera del sistema, o está mal integrado.

**Radios permitidos:**

- **`rounded.none` (0px):** Default para frames, brackets, bloques grandes, hero. Esquina cuadrada es el tono por defecto.
- **`rounded.sm` (4px):** Inputs de formulario, badges pequeños, tags inline. Radio mínimo funcional.
- **`rounded.md` (8px):** Cards de proyecto o artículo, contenedores de imagen, botones auxiliares si existen. Radio discreto que separa sin anunciarse.
- **`rounded.full` (50%):** Solo para elementos explícitamente circulares — puntos indicadores, avatares, badges numéricos. Nunca para "suavizar" un rectángulo.

**Prohibido:** radios mayores a 8px fuera de `rounded.full`. Sin pills, sin `rounded-xl`, sin valores intermedios (10px, 12px, 14px, 24px). Si un elemento necesita "algo más redondo que md", la pregunta correcta es si pertenece al sistema.

## Components

### CTA tipográfico

BPP no usa botones con fondo sólido. Los CTAs son tipografía con color `primary`, frecuentemente acompañados de una flecha adyacente (`→` o `←`) y/o un subrayado implícito.

**Hover permitido:**

- Cambio de color del texto o del borde inferior.
- Cambio de opacidad del subrayado.
- **Desplazamiento direccional de la flecha adyacente:** `transform: translateX(±4px)` aplicado solo al ícono de flecha, no al texto. Es wayfinding (el lector ve hacia dónde va), no decoración. Se permite solo cuando hay flecha real en el markup.

**Hover prohibido:**

- `transform: scale(...)` en el texto del CTA o en el contenedor entero.
- `transform: translateY(...)` (empuje vertical).
- `box-shadow` de cualquier tipo (salvo focus ring por accesibilidad).
- `filter: brightness(...)` o cualquier otro filtro visual.

### Nav link

Metadata tipográfica (Plus Jakarta Sans, uppercase vía CSS, 0.75rem, tracking abierto). Hover: cambio de color a `primary`. Nada más.

### Card de proyecto / artículo

Fondo transparente o `surface` sobre `background`. Corner brackets como encuadre. Radio `md` (8px) permitido en el contenedor si el contexto lo pide. Al hover, el bracket se intensifica en color `primary` — sin movimiento, sin escala. Una shadow sutil (ver Elevation & Depth) es aceptable para separación, no obligatoria.

### Team row (hover photo)

Efecto específico del sistema: al hacer hover en un nombre de team member, su foto aparece flotando a `left: 180px; top: -90px` del row, superpuesta sobre la fila de arriba. Esto es parte del signature del sitio y **no se reemplaza con un tooltip ni con un card**.

### Focus ring (accesibilidad)

Implementación: `:focus-visible { box-shadow: 0 0 0 3px rgba(193,111,82,0.55); outline: none; }` o un `outline: 2px solid` con el color primary. Aplica a todo elemento interactivo (links, botones, inputs). Es requisito, no decoración.

### Logo BPP

SVG base64 embebido, aplicado con `filter: brightness(0) invert(1)` para renderizar blanco sobre fondo oscuro. El filtro es la única forma de tratamiento válida; no hay variante "logo oscuro" separada.

## Do's and Don'ts

Esta sección captura los errores que se repiten y que el sistema necesita documentar para que no se reintroduzcan.

### Do

- Validar cualquier cambio de token contra este archivo antes de aplicar.
- Usar `#c16f52` exacto (terracotta desaturado v2, no `#ce7352` de v1) — también en formato rgba: `rgba(193,111,82,…)`, nunca `rgba(206,115,82,…)`.
- Usar Plus Jakarta Sans en todo el sistema, cargada vía `<link>` (nunca `@import` en CSS), solo los pesos 300-700 + itálica 400.
- Usar mayúsculas solo para wayfinding y metadata, aplicadas vía CSS.
- Mantener `section: 160px` entre bloques mayores.
- Implementar CTAs como tipografía, no como botones con fondo.
- Usar `translateX(±4px)` en flechas de CTA para hover direccional.
- Elevar cards con superficie + sombra cálida (`--shadow-card`), no con bordes: los bordes de 1px se usan a alpha ≤ 0.15 ("susurro"), nunca como marco duro.
- Mantener focus rings en `:focus-visible` — es accesibilidad.
- Usar radios `none` / `sm (4px)` / `md (16px)` / `pill (999px)` / `full (50%)` según el componente. Badges y chips van en pill.
- Reservar los corner brackets como firma exclusiva de La Usina (`.tesis-card`, portadas de tesis). En el resto del sitio no se usan (v2.2).
- Mantener el grano análogo del body (~3.5% opacity): rompe el render perfecto sin ensuciar el texto.
- Preservar el efecto team row tal como está.
- Priorizar diseño inclusivo: warm off-white, terracotta desaturado, dark warm gray lifted.

### Don't

- **No volver a Space Mono monowidth única.** Fue v1 alpha.
- **No reintroducir el híbrido Bros Oskon + Chivo.** Fue una especificación v2 que nunca llegó a producción; v2.1 consolidó Plus Jakarta Sans como familia única (decisión 2026-06-11).
- **No agregar familias tipográficas adicionales** (Atkinson, IBM Plex, Lexend, Work Sans, Inter ya fueron retiradas o rechazadas). Una sola familia.
- **No saturar el terracotta.** `#ce7352` era v1. `#c16f52` es v2 — no se vuelve a saturar.
- **No bajar el fondo a negro puro.** `#0a0a0a` era v1. `#1a1512` es v2 (lifted para reducir contraste extremo).
- **No usar blanco puro.** `rgba(255,255,255,...)` era v1. `rgba(250,248,246,...)` es v2 (warm off-white inclusivo).
- **No usar `transform: scale(...)` en hovers decorativos.** Ni en CTAs, ni en botones PWA, ni en íconos sociales, ni en "touch feedback" genérico.
- **No usar `transform: translateY(...)` en hovers** (empujes verticales tipo "levitar").
- **No usar glow terracotta en la web.** `box-shadow` con `rgba(193,111,82,...)` está reservado para el focus ring y para los overlays OBS.
- **No usar shadows intensas** (`alpha > 0.4`, `blur > 24px`, o shadows coloreadas que no sean negras).
- **No usar radios mayores a 8px** salvo `50%` para elementos circulares explícitos. Sin 10px, 12px, 14px, 24px.
- **No convertir CTAs tipográficos en botones con background.** Reescribir como texto con color primary.
- **No trasladar el lenguaje de los overlays OBS a la web.** Son contextos distintos.
- **No ejecutar auditorías de performance que toquen tipografía o color sin revisar este archivo.** Si la auditoría recomienda cambiar el sistema híbrido por motivos de carga, se evalúa manualmente — no se aplica.
- **No interpretar "editorial dark" como "bold and dramatic".** El sistema es denso pero sobrio.
- **No tocar archivos `_prototype-*`.** Están fuera del sistema por diseño.
- **No justificar cambios con "v1 era mejor".** v1 alpha priorizaba signature máximo, v2 beta-inclusive prioriza diseño inclusivo. Son valores distintos, ambos válidos — v2 es el sistema activo.

## Voice

La voz del estudio está documentada en `VOICE.md` como archivo hermano de este documento. El sistema visual y la voz se co-determinan: decisiones de densidad tipográfica y economía cromática vienen del mismo principio que rige el copy — editorial, no corporativo; concreto, no abstracto. Cualquier decisión de copy que contradiga el registro definido en `VOICE.md` genera fricción con este sistema visual.

## Referencias

- **Superflux** (superflux.in) — rigor del encuadre, copy de proyecto sin adorno.
- **Linked by Air** — economía tipográfica, uso disciplinado de una sola familia.
- **Metahaven** — techo lejano de densidad editorial, no molde.

Estudios que **no** son referencia: landing pages SaaS con gradientes y glows, sitios de consultoras Big Four, thought leadership corporativo. Si una sugerencia acerca el sistema a ese territorio, la sugerencia se rechaza.

## Validación

Este archivo (v2 beta-inclusive) cumple parcialmente con la especificación `@google/design.md` (alpha spec, Google Labs). El linter reporta errores y advertencias — todos intencionales y documentados aquí:

**Errores intencionales:**
- **rgba() en tokens de color**: La jerarquía de opacidad (`text-high`, `text-mid`, `text-low`, `text-faint`) usa `rgba(250,248,246,...)` con diferentes valores alpha. Esto es correcto para mantener consistencia en diferentes backgrounds. El linter espera hex o nombrados.
- **Tokens YAML no usados**: Algunos tokens del frontmatter YAML existen para documentación futura o coherencia del esquema, no están todos mapeados a CSS custom properties todavía.

**Advertencias intencionales:**
- **border-radius: 50%**: Usado para elementos circulares (profile pics, icon containers). Es un valor de diseño deliberado, no un olvido.
- **Valores no-token en sombras**: Algunas shadows inline usan valores hardcoded por razones de especificidad contextual (ej. focus rings).

**Decisión**: No corregir estos casos. El sistema prioriza coherencia semántica, diseño inclusivo, y legibilidad del código sobre conformidad estricta con el linter alpha de Google Labs.

## Changelog

**v2.1 beta-inclusive (2026-06-11):**
- Tipografía: híbrido ZT Bros Oskon + Chivo (especificado, nunca implementado) → Plus Jakarta Sans como familia única en todo el sistema. Decisión de Nicolás tras auditoría completa que mostró 0% de implementación del híbrido.
- Focus ring: alpha 0.2 → 0.55 para cumplir contraste no-textual 3:1 (WCAG 2.4.7).
- Tokens rgba del primary normalizados a `rgba(193,111,82,…)` (el equivalente exacto de `#c16f52`); se purgó `rgba(206,115,82,…)` (v1).
- Fuentes Bros Oskon y Chivo retiradas del repo (`/fonts/`).

**v2 beta-inclusive (2026-05-04):**
- Tipografía: Space Mono monowidth única → ZT Bros Oskon (display/headings) + Chivo (body)
- Background: `#0a0a0a` negro puro → `#1a1512` dark warm gray lifted
- Text: `rgba(255,255,255,...)` blanco puro → `rgba(250,248,246,...)` warm off-white
- Primary: `#ce7352` naranja saturado → `#c16f52` terracotta desaturado
- Rationale: Priorización de diseño inclusivo sobre signature de alto contraste. Reduce fatiga visual, mejora legibilidad en textos largos, mantiene identidad editorial.

**v1 alpha (2024-2026):**
- Sistema original: Space Mono exclusiva, negro puro, contraste alto
- Signature: Monowidth radical, alto contraste como parte de identidad
- Mantenido en archivos `_archive/` para referencia histórica
