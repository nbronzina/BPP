---
version: alpha
name: BPP Analytics & Design
description: Sistema visual del estudio. Fondo negro, tipografía monoespaciada, acento naranja y corner brackets como dispositivo de encuadre. Editorial, no corporativo.
colors:
  primary: "#ce7352"
  on-primary: "#0a0a0a"
  background: "#0a0a0a"
  surface: "#0a0a0a"
  text-high: "rgba(255,255,255,0.95)"
  text-mid: "rgba(255,255,255,0.75)"
  text-low: "rgba(255,255,255,0.55)"
  text-faint: "rgba(255,255,255,0.35)"
  border: "rgba(255,255,255,0.12)"
  border-active: "#ce7352"
  focus-ring: "rgba(206,115,82,0.2)"
typography:
  wayfinding:
    fontFamily: Space Mono
    fontWeight: 400
    fontSize: 0.75rem
    letterSpacing: 0.12em
  h1:
    fontFamily: Space Mono
    fontWeight: 700
    fontSize: 3.5rem
    lineHeight: 1.05
    letterSpacing: -0.01em
  h2:
    fontFamily: Space Mono
    fontWeight: 700
    fontSize: 2rem
    lineHeight: 1.15
  body-md:
    fontFamily: Space Mono
    fontWeight: 400
    fontSize: 1rem
    lineHeight: 1.6
  body-sm:
    fontFamily: Space Mono
    fontWeight: 400
    fontSize: 0.875rem
    lineHeight: 1.55
  metadata:
    fontFamily: Space Mono
    fontWeight: 400
    fontSize: 0.75rem
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
  md: 8px
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

El sistema existe para hacer legible una práctica — investigación exploratoria, prototipos, futuros — en un formato que el cliente pueda leer sin sentirse empujado. Cada decisión visual sirve a eso. El fondo negro da gravedad. La tipografía monoespaciada pone al texto en registro de herramienta de trabajo, no de folleto. El naranja aparece donde hay acción o dato, no donde hay decoración.

Este documento es la fuente de verdad del sistema. Si un brief, una auditoría o un agente sugiere cambios de token sin revisar este archivo primero, el cambio se descarta.

Los archivos con prefijo `_prototype-*` están **fuera del sistema por diseño**. Son terreno de exploración y no se auditan contra este documento. Si un prototipo va a promoverse a producción, se alinea primero y después se renombra sin el prefijo.

## Colors

La paleta tiene cuatro registros y un solo acento. El acento no se substituye, no se aproxima, no se "ajusta" — la dirección es siempre este naranja o nada.

- **Primary `#ce7352`:** Naranja BPP. Único acento del sistema. Aparece en CTAs tipográficos, brackets esquineros, puntos de énfasis en datos, y en estados activos. Nunca como fondo de bloque completo. Nunca en variantes (no hay primary-light, primary-dark, primary-container). Un solo valor, usado con intención.
- **Background `#0a0a0a`:** Negro del sistema. No es navy (`#0a2540` fue un brief heredado con bug). No es gris oscuro. El contraste alto con el naranja es parte del signature.
- **Text-high `rgba(255,255,255,0.95)`:** Texto principal. Headlines, párrafos de cuerpo, contenido que el lector debe absorber.
- **Text-mid `rgba(255,255,255,0.75)`:** Segundo nivel. Subtítulos, contexto secundario, descripciones.
- **Text-low `rgba(255,255,255,0.55)`:** Metadata visible pero subordinada. Fechas, roles, tags.
- **Text-faint `rgba(255,255,255,0.35)`:** Texto decorativo o de wayfinding. Numeración de secciones, separadores tipográficos.
- **Border `rgba(255,255,255,0.12)`:** Divisores sutiles. No competir con el contenido.
- **Border-active `#ce7352`:** Forma preferente de marcar hover o estado activo en elementos interactivos.
- **Focus-ring `rgba(206,115,82,0.2)`:** Anillo de foco para accesibilidad. Ver Elevation & Depth.

La jerarquía por opacidad es intencional. Si un agente intenta "limpiar" convirtiendo todo a un blanco plano, el sistema pierde la profundidad que distingue lectura de escaneo.

## Typography

Una sola familia para todo el sistema: **Space Mono**. Monospace con personalidad, no neutra. Esta decisión es de identidad, no de legibilidad — existe para que cada texto se lea como material de estudio, no como copy de landing SaaS.

Auditorías previas sugirieron cambiar a IBM Plex Mono y a Work Sans. Ambas sugerencias fueron rechazadas y quedan registradas acá como ejemplos de deriva que el sistema debe resistir. **La familia no se cambia.**

Mayúsculas se usan sólo en **wayfinding y metadata** — navegación, etiquetas de sección, numeración, tags. Nunca en titulares descriptivos, nunca en cuerpo, nunca en CTAs. El uso de mayúsculas señala "esto es orientación, no contenido". La transformación se aplica vía CSS (`text-transform: uppercase`), no se escribe en el texto original.

La jerarquía tipográfica se apoya en tamaño y opacidad, no en familias distintas ni en pesos extremos. El único peso fuerte disponible es `700`, reservado para `h1` y `h2`.

## Layout

Desktop-first. El grid y el ritmo vertical están pensados para pantalla grande; la adaptación a móvil es compresión, no rediseño.

El espaciado respira. El token `section: 160px` entre bloques mayores es signature del sistema — genera silencio visual entre ideas. Recortar ese espaciado para "mostrar más" rompe el tono.

La navbar superior es elemento fijo del sistema y **no se toca**. Cualquier tarea que implique rediseño de navegación requiere validación explícita antes de ejecutar.

## Elevation & Depth

El sistema usa elevación con mucha mesura. No hay dramatismo de sombra, pero tampoco es plano absoluto — hay dos usos permitidos y una excepción documentada.

**Permitido:**

- **Shadow sutil para separación de cards:** `0 2px 8px rgba(0,0,0,0.3)` o hasta `0 4px 20px rgba(0,0,0,0.4)`. Regla operativa: `alpha ≤ 0.4`, `blur ≤ 24px`, color siempre negro. Existe para separar tarjetas del fondo cuando la jerarquía por opacidad no alcanza. No para "dar peso" ni para crear efecto cinemático.
- **Focus ring (accesibilidad):** `box-shadow: 0 0 0 4px rgba(206,115,82,0.2)` aplicado en `:focus-visible`. Es requisito WCAG, no decoración. No se remueve ni se oculta.

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

Metadata tipográfica (Space Mono, uppercase vía CSS, 0.75rem, tracking abierto). Hover: cambio de color a `primary`. Nada más.

### Card de proyecto / artículo

Fondo transparente o `surface` sobre `background`. Corner brackets como encuadre. Radio `md` (8px) permitido en el contenedor si el contexto lo pide. Al hover, el bracket se intensifica en color `primary` — sin movimiento, sin escala. Una shadow sutil (ver Elevation & Depth) es aceptable para separación, no obligatoria.

### Team row (hover photo)

Efecto específico del sistema: al hacer hover en un nombre de team member, su foto aparece flotando a `left: 180px; top: -90px` del row, superpuesta sobre la fila de arriba. Esto es parte del signature del sitio y **no se reemplaza con un tooltip ni con un card**.

### Focus ring (accesibilidad)

Implementación: `:focus-visible { box-shadow: 0 0 0 4px rgba(206,115,82,0.2); outline: none; }` o equivalente. Aplica a todo elemento interactivo (links, botones, inputs). Es requisito, no decoración.

### Logo BPP

SVG base64 embebido, aplicado con `filter: brightness(0) invert(1)` para renderizar blanco sobre fondo oscuro. El filtro es la única forma de tratamiento válida; no hay variante "logo oscuro" separada.

## Do's and Don'ts

Esta sección captura los errores que se repiten y que el sistema necesita documentar para que no se reintroduzcan.

### Do

- Validar cualquier cambio de token contra este archivo antes de aplicar.
- Usar `#ce7352` exacto.
- Usar Space Mono como única familia.
- Usar mayúsculas solo para wayfinding y metadata, aplicadas vía CSS.
- Mantener `section: 160px` entre bloques mayores.
- Implementar CTAs como tipografía, no como botones con fondo.
- Usar `translateX(±4px)` en flechas de CTA para hover direccional.
- Usar shadows sutiles (`alpha ≤ 0.4`, `blur ≤ 24px`, color negro) para separar cards cuando hace falta.
- Mantener focus rings en `:focus-visible` — es accesibilidad.
- Usar radios `none` / `sm (4px)` / `md (8px)` / `full (50%)` según el componente.
- Mantener corner brackets como dispositivo de encuadre.
- Preservar el efecto team row tal como está.

### Don't

- **No sustituir Space Mono.** Ni por IBM Plex Mono, ni por Work Sans, ni por "una mono más legible". La familia es identidad, no preferencia.
- **No cambiar el fondo a navy.** `#0a2540` fue un valor heredado con bug. El fondo es `#0a0a0a`.
- **No usar `transform: scale(...)` en hovers decorativos.** Ni en CTAs, ni en botones PWA, ni en íconos sociales, ni en "touch feedback" genérico.
- **No usar `transform: translateY(...)` en hovers** (empujes verticales tipo "levitar").
- **No usar glow naranja en la web.** `box-shadow` con `rgba(206,115,82,...)` está reservado para el focus ring y para los overlays OBS.
- **No usar shadows intensas** (`alpha > 0.4`, `blur > 24px`, o shadows coloreadas que no sean negras).
- **No usar radios mayores a 8px** salvo `50%` para elementos circulares explícitos. Sin 10px, 12px, 14px, 24px.
- **No convertir CTAs tipográficos en botones con background.** Reescribir como texto con color primary.
- **No trasladar el lenguaje de los overlays OBS a la web.** Son contextos distintos.
- **No ejecutar auditorías de performance que toquen tipografía o color sin revisar este archivo.** Si la auditoría recomienda cambiar Space Mono por motivos de carga, se evalúa manualmente — no se aplica.
- **No interpretar "editorial dark" como "bold and dramatic".** El sistema es denso pero sobrio.
- **No tocar archivos `_prototype-*`.** Están fuera del sistema por diseño.

## Voice

La voz del estudio está documentada en `VOICE.md` como archivo hermano de este documento. El sistema visual y la voz se co-determinan: decisiones de densidad tipográfica y economía cromática vienen del mismo principio que rige el copy — editorial, no corporativo; concreto, no abstracto. Cualquier decisión de copy que contradiga el registro definido en `VOICE.md` genera fricción con este sistema visual.

## Referencias

- **Superflux** (superflux.in) — rigor del encuadre, copy de proyecto sin adorno.
- **Linked by Air** — economía tipográfica, uso disciplinado de una sola familia.
- **Metahaven** — techo lejano de densidad editorial, no molde.

Estudios que **no** son referencia: landing pages SaaS con gradientes y glows, sitios de consultoras Big Four, thought leadership corporativo. Si una sugerencia acerca el sistema a ese territorio, la sugerencia se rechaza.

## Validación

Este archivo cumple parcialmente con la especificación `@google/design.md` (alpha spec, Google Labs). El linter reporta 7 errores y 3 advertencias — todos intencionales y documentados aquí:

**Errores intencionales (7):**
- **rgba() en tokens de color**: La jerarquía de opacidad (`text-high`, `text-mid`, `text-low`, `text-faint`) usa `rgba(224,224,224,...)` con diferentes valores alpha. Esto es correcto para mantener consistencia en diferentes backgrounds. El linter espera hex o nombrados.
- **Tokens YAML no usados**: Algunos tokens del frontmatter YAML existen para documentación futura o coherencia del esquema, no están todos mapeados a CSS custom properties todavía.

**Advertencias intencionales (3):**
- **border-radius: 50%**: Usado para elementos circulares (profile pics, icon containers). Es un valor de diseño deliberado, no un olvido.
- **Valores no-token en sombras**: Algunas shadows inline usan valores hardcoded por razones de especificidad contextual (ej. focus rings).

**Decisión**: No corregir estos casos. El sistema prioriza coherencia semántica y legibilidad del código sobre conformidad estricta con el linter alpha de Google Labs.
