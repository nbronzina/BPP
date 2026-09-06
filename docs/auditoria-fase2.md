# Auditoría externa, Fase 2: mediciones

Fecha: 2026-09-06. Medido sobre `src/styles.css` (1.116 selectores individuales) y las ocho páginas generadas en `_site/` después de la Fase 1. Este documento no cambia nada: cada punto termina en una decisión de Nicolás. El script que produjo las listas es reproducible; las cifras se recalculan con un build nuevo.

## 2.1 Deriva entre documentación y producción

El brief afirma tres derivas. Solo una existe.

- **Color.** DESIGN.md documenta `#c16f52` y `#12151a` como sistema vigente (v2). `#ce7352` y `#0a0a0a` aparecen solo como historia de la v1 ("era v1, no se vuelve a saturar"). No hay deriva.
- **Responsive.** DESIGN.md dice "Mobile-first, desktop adapted" y CLAUDE.md lo repite dos veces. El CSS tiene 121 reglas bajo `min-width: 769px` y 8 bajo `max-width: 768px`. No hay deriva.
- **Tipografía.** DESIGN.md documenta Plus Jakarta Sans y Literata self-hosted, que es lo que corre. **CLAUDE.md, línea 140, dice "Work Sans (Google Fonts)".** Esa línea es vieja. En el mismo archivo quedaron otras cinco líneas de una etapa anterior: el checklist con "Contact form submits" (172) y "Form submission and validation" (317), "IntersectionObserver in main.js (lines 102-130)" y `will-change` (197-198), "generates cache-busting hashes" (311) y "Always commit both source and minified files together" (312). Ninguna es cierta hoy.

Decisión: actualizar esas seis líneas de CLAUDE.md. DESIGN.md no necesita cambios por este punto.

## 2.2 Breakpoints

18 media queries distintas. Las dos principales concentran el trabajo: `min-width: 769px` (121 reglas) y `min-width: 1025px` (6). El resto:

| Query | Reglas | Qué toca |
|---|---|---|
| `(min-width: 768px) and (max-width: 1024px)` | 12 | about-grid, contact, content-section, hero, nav, section, service-card, services-grid, footer. Rango tablet que solapa un píxel con 769. |
| `(max-width: 768px)` | 8 | `*`, hero, mobile-menu-btn, nav-container, nav-cta, nav-logo, section, main. Restos desktop-first. |
| `(max-width: 390px)` | 4 | service-card, tagline, h1, h2 |
| `(min-width: 1280px)` | 3 | actividades-container, section-content, services-grid |
| `(max-width: 1535px)` | 3 | mobile-toc-btn, share-buttons, sticky-toc |
| `(min-width: 1100px)` | 3 | data-rail-label, data-rail-value, toc-data-rail (riel de datos del reporte) |
| `(max-width: 360px)` | 2 | hero, tagline |
| `(max-width: 1200px)` | 1 | actividades-container |
| `(max-width: 900px)` | 1 | services-container |
| `(min-width: 900px)` | 1 | report-scenarios-grid |
| `(max-height: 500px) and (orientation: landscape)` | 1 | hero |
| `(min-width: 769px) and (max-width: 1024px)` | 1 | |

Más las de preferencia: `prefers-reduced-motion` (20 reduce, 12 no-preference), `pointer: coarse` (8), `hover: none` (1).

Decisión: consolidar a 769 / 1025 / 1280 y migrar los ocho `max-width: 768px`. Los de 900 y 1200 se pueden absorber en 1025; 360 y 390 son ajustes de titular que podrían resolverse con `clamp`.

## 2.3 Código muerto

- **350 clases en el CSS, 226 en el HTML. 120 sin ningún uso** (ni en HTML ni en `main.js`). Tres de la lista son artefactos de URLs dentro del CSS (`w3`, `org`, `woff2`) y no cuentan.
- **`.page-papel`: 103 reglas** sin página que las active. Documentado como sistema dormido en `docs/historial.md`.
- Tokens definidos sin uso: `--color-bg-warm`, `--spacing-card`, `--spacing-gap`, `--transition-slow`.
- Tokens alias con valor idéntico a otro: `--color-accent-bright` = `--orange-500` (10 usos), `--color-accent` = `--orange-500` (106 usos; este alias sí tiene sentido como capa semántica).
- `direction: ltr` 2 veces, `rtl` 0. Resto de un zigzag viejo.
- `:root` declarado 4 veces, 3 sin media query.

Lista completa de clases sin uso:

about-cta, about-label, about-pain-list, about-purpose, about-separator, actividad-autor, actividad-content, actividad-imagen--papel, actividad-inline-link, actividad-link, actividades-cta-link, approach-description, approach-label, approach-label--bpp, approach-svg, arrow, back-link, badge-label, badge-separator, bpp-path, btn, btn-download, btn-download-main, card-static, clientes-label, clientes-section, contact-grid, container, context-label, cta-arrow--right, cta-section, data-label, data-point, date, download-buttons, equipo-label, escenario-label, exploration-dot, flow-dot, footer-colofon, hero-break, hero-content, hero-figura--papel, hero-figura__cap, hero-grid, hero-logo, hero-scroll-cue, hero-sub-secondary, honeypot, icon, identity-badge, identity-note, impact-icon, impact-label, impact-number, impact-number--spacing, indice-autor, indice-fecha, institutional-context, institutional-description, legal-spacing, locations, logo, medium, method-link, nav, nav-logo-icon, nav-wordmark, page-papel, perfil-name, perfil-tagline, proof-label, proof-link, proof-separator, proyecto-descripcion, proyecto-disciplinas, proyecto-imagen, proyecto-imagen-link, proyecto-item, proyecto-nombre, proyectos-container, proyectos-intro, proyectos-intro-headline, proyectos-intro-text, quote-box, quote-box--compact, reading-progress-bar, report-back-link, section-content, section-divider-top, section-eyebrow, section-header, section-icon, senal-impact, senal-link, senal-location, senal-sector, senales-badge, senales-container, senales-more, senales-widget, service-card, service-method, service-proof, services-cta, services-cta-link, services-cta-subtext, services-label, sticky-download-bar, studio-note, subtitle, text-link-underline, traditional-line, usina-intro, viz-caption, viz-label, viz-metric.

Familias reconocibles: el formulario retirado (`honeypot`, `contact-grid`), la descarga pegajosa (`sticky-download-bar`, `btn-download`), el widget de señales de la home (`senales-*`), la grilla vieja de proyectos (`proyecto-*`), las pruebas de servicio (`service-proof`, `proof-*`), el papel (`page-papel`, `*--papel`).

Decisión: borrar las 117 reales y las 103 reglas de papel, o conservar el papel y borrar el resto. Estimación: entre un cuarto y un tercio del CSS.

## 2.4 Selectores duplicados

Fuera de media queries. Solo las propiedades que una declaración posterior pisa:

| Selector | Veces | Pisado |
|---|---|---|
| `li` | 8 | `font-size` base → 1.1875rem; `max-width` 100% → 70ch |
| `.btn-download` | 7 | `padding` (clase sin uso) |
| `h1`, `h2`, `h3`, `h4`, `h5`, `h6` | 6, 6, 6, 4, 4, 4 | `hyphens: none` → `auto` |
| `.service-block` | 5 | `box-shadow` |
| `.thesis-*-section` (4 selectores) | 5 | `font-family` Literata → Plus Jakarta; `font-size` y `line-height` → inherit (es el override intencional de v2.3) |
| `.services-grid` | 4 | `max-width` 1400 → 900 → none; `display` flex → grid; `gap`; `margin-bottom` |
| `.service-timeline-toggle` | 4 | `gap`, `padding`, `border` 1px → 0, `color`, `margin-top` |
| `button`, `dd`, `p`, `a`, `.about-cta a`, `.mobile-menu-btn` | 5, 5, 4, 4, 4, 4 | nada pisado: cada declaración suma propiedades distintas |

`.filter-btn` no llega a 4 fuera de media: las tres declaraciones que vio el brief quedan en 2 en el fuente más una bajo `pointer: coarse`. La de borde completo con radio 8px sigue y la última la pisa (borde inferior 2px, radio 0). Primera declaración muerta, confirmado.

Decisión: fundir `.services-grid` y `.service-timeline-toggle` en una sola declaración cada uno (las versiones vivas son las de v2.5); dejar los `h1-h6` como están (la segunda declaración es la regla de `hyphens` global, no un error).

## 2.5 `--font-mono`

`--font-mono: 'Plus Jakarta Sans', monospace`. 12 usos: `.senal-label`, `.timeline-week`, `.service-deliverable`, `.footer-practice`, `.transformation-card .card-icon`, `.identity-badge .badge-label`, `.identity-badge .badge-separator`, `.studio-note`, `.context-label`, `.proof-label`, `.senales-badge`, `.approach-label`. De esos, **cuatro están en páginas vivas**: la etiqueta SEÑAL DÉBIL, la semana del proceso de servicio, la línea de entregables y la línea de práctica del footer. Los otros ocho son clases sin uso.

Decisión: DESIGN.md v2.1 retiró Space Mono a propósito ("una sola familia"). Renombrar el token a `--font-label` es coherente con eso. Recuperar una mono real contradice el archivo.

## 2.6 Doble atenuación

Alfa en el color y además `opacity`, en la misma regla. Ratios sobre `#12151a`:

| Regla | Composición | Alfa real | Ratio |
|---|---|---|---|
| `.hero-tagline` (2 declaraciones) | rgba .85 × opacity .85 | .72 | 9,35:1 |
| `.reporte-section p`, `.reporte-section li` | text-secondary .87 × .75 | .65 | 7,79:1 |
| `.reporte-page .hero-sub` | .87 × .75 | .65 | 7,79:1 |
| `.reporte-page .report-tags` | .87 × .70 | .61 | 6,92:1 |
| `.report-toc-list a` | .87 × .70 | .61 | 6,92:1 |

Ninguna falla, pero todas duplican la intención. Y un hallazgo nuevo del mismo patrón, esta vez **con fallo AA en producción**:

| Regla | Composición | Ratio | Dónde |
|---|---|---|---|
| **`.contact-city`** | accent × opacity .70 | **3,01:1** | "BUENOS AIRES" y "MADRID" en Conversemos, 19px mayúsculas |
| `.thesis-download:hover` | accent × .75 | 3,27:1 | estado hover del enlace de descarga |
| `.reporte-page .report-label` | accent × .90 | 4,23:1 | una etiqueta del reporte |
| `.pull-quote::before` | accent × .30 | 1,50:1 | comillas decorativas, no es texto |

El accent pleno sobre `#12151a` da 4,93:1. Cualquier `opacity` sobre él lo baja de 4,5. Regla propuesta para DESIGN.md: **el alfa va en el color o en `opacity`, nunca en los dos; y el accent nunca lleva `opacity`.**

Decisión: `.contact-city` es un fallo real y debería ir a una Fase 1 bis junto con el hover de la tesis.

## 2.7 Datos estructurados

El brief no los vio porque el snapshot borra los `<script>`. Existen en las ocho páginas, desde `src/_includes/jsonld/`:

| Página | Tipos |
|---|---|
| `/` | Organization, WebSite, ProfessionalService (con tres Person, dos PostalAddress, OfferCatalog de cuatro Service) |
| `/proyectos/`, `/pensamiento/` | CollectionPage |
| `/proyectos/trace-group/` | CreativeWork (genre design fiction) |
| `/reporte-impacto/` | Report |
| `/usina/tesis-01/` | ScholarlyArticle con tres autores, isPartOf Periodical |
| `/privacidad/` | PrivacyPolicy |

Diferencias con la propuesta del brief: las colecciones son `CollectionPage` y no `ItemList` (se puede sumar `ItemList` con las tarjetas dentro); `Organization` de la home no declara `sameAs`.

## 2.8 Citabilidad de la tesis

El `ScholarlyArticle` ya tiene: headline, alternativeHeadline, author (tres Person), datePublished, inLanguage, isPartOf, url, sameAs. **No tiene:** DOI, licencia, `citation`, abstract, keywords. En el HTML: cero menciones de DOI, ORCID, licencia o BibTeX, y ningún `<time>`.

Lo que faltaría para que fuera citable por máquina: DOI en Zenodo, licencia declarada, `license`, `abstract`, `keywords` y `citation` en el JSON-LD, bloque BibTeX, abstract en inglés y `<time datetime>` en la barra de metadatos. **Decisión (2026-09-06): no se hace.** La tesis es un documento de trabajo y se cita con la cita sugerida de la página.

## 2.9 Arquitectura de URLs

Mecanismo que ya usa `/usina/index.html`: HTML estático fuera del layout, `<meta http-equiv="refresh" content="0; url=/pensamiento/#tesis">`, `<meta name="robots" content="noindex">`, `<link rel="canonical">` al destino, un párrafo con el enlace por si el refresh no corre, y CSP con hash para su `<style>`. Se reutiliza tal cual si `/reporte-impacto/` se mueve a `/proyectos/natalidad/`: dejar el stub en `/reporte-impacto/index.html` con passthrough en `.eleventy.js`, cambiar el sitemap y las tarjetas.

Los cuatro nombres para lo mismo siguen: nav "Lo hecho", `<title>` "Hechos", `<h2 class="sr-only">` "Hechos", etiqueta "HECHOS", URL `/proyectos/`. CLAUDE.md documenta la distinción Hechos / Lo hecho como intencional. La URL es la única que no dice ninguna de las dos.

## 2.10 Taxonomías

Matriz completa después de la Fase 1 (los filtros son los cuatro movimientos de la home):

| Página | Pieza | Etiquetas visibles | `data-tags` |
|---|---|---|---|
| Lo hecho | Trace Group | Energía · Diseño ficción | futuros, investigacion |
| | Cuando el artefacto piensa | Design fiction · Docencia | futuros |
| | Otros Futuros IED | Design fiction · Docencia · Latinoamérica | futuros |
| | Inhabiting the Future | Design fiction · Adaptación climática | futuros |
| | Workshop LATAM·2036 | Design fiction · Docencia · Latinoamérica | futuros |
| | Jornada CESBA | Gestión pública · Diseño ficción | investigacion, futuros |
| | Masterclass UDIT | Inteligencia artificial · Diseño UX · Docencia | datos-ia, futuros |
| | Natalidad | Educación · Análisis demográfico | datos-ia, investigacion |
| Pensamiento | Potrero | Sociología · Datos · IA · Fútbol | comunicacion, datos-ia |
| | Personal software | IA · Diseño · Estrategia · Personal Software | datos-ia, futuros |
| | Año analógico | Sociología · Futuro · Diseño · Prospectiva | investigacion, futuros |
| | Algoritmos no bastan | Sociología · Branding · Estrategia · Datos | comunicacion, datos-ia |
| | Alquileres | Sociología · Datos · Vivienda | datos-ia, investigacion |
| | Branding | Sociología · Branding · Estrategia | comunicacion |

Botones: Lo hecho 4 (Todos, Investigación, Futuros y prototipos, Datos e IA); Pensamiento 5 (más Comunicación). La asimetría es una decisión del 2026-09-05: sin hechos de comunicación, no hay botón.

El punto del brief sigue en pie: las etiquetas visibles son temas y los filtros son movimientos, y ninguna tarjeta muestra el movimiento por el que se la filtra. "Futuros y prototipos" devuelve 7 de 8 hechos.

Decisión: o las etiquetas visibles pasan a ser los movimientos (y los temas se van), o el filtro se quita de Lo hecho porque con ocho piezas no discrimina.

## 2.11 El mismo componente con dos criterios

- Pensamiento: cada artículo tiene `id` (`art-potrero`…). Lo hecho: ninguna de las 8 tarjetas tiene `id`.
- `<picture>` con variante `-mobile`: Pensamiento 6 de 6, Lo hecho 3 de 8.
- Las tres señales: sin `id`, sin fecha de rastreo, sin `<time>`. El contenido original es el único que no se puede enlazar.

## 2.12 Ids heredados en `/reporte-impacto/`

| Sección | `id` |
|---|---|
| Resumen ejecutivo | `sec-contexto` |
| El caso en cuatro respuestas | `sec-ficha` |
| 1. Contexto general | `sec-contexto-general` |
| 2. Cómo construimos este análisis | `sec-metodologia` |
| 3. Los escenarios que planteamos | `sec-escenarios` |
| 4. Las oportunidades que identificamos | `sec-oportunidades` |
| 5. Estudio demográfico regional | `sec-estudio-regional` |
| 6. Lo que recomendamos | `sec-recomendaciones` |

Solo el primero desentona: `sec-contexto` es el resumen ejecutivo. Está referenciado desde el riel de datos en `main.js` y desde el índice. Cambiarlo rompe enlaces externos a `#sec-contexto`.

## 2.13 `<h3>` de cierre

Un solo partial, `src/_includes/partials/cierre.njk`, con `<h3 id="cierre-heading">`. En las tres páginas de caso (Trace Group, reporte, tesis) ese id es el `aria-labelledby` de la `<section class="cierre-section">`. En Lo hecho y Pensamiento vive dentro de la última sección.

Si se cambia a `<p>`, la sección de cierre necesita `aria-label` en vez de `aria-labelledby`. Es un cambio de dos archivos, pero el `<h3>` como cierre no es incorrecto: es una sección con título propio. Decisión de criterio, no de bug.

## 2.14 Activos

70 archivos en `/img/`. Seis sin uso: `NatalidadOptima-mobile.png`, `NatalidadOptima-mobile.webp`, `NatalidadOptima.webp`, `NatalidadWeb.webp` (el gráfico anterior del reporte), `logo-160.webp`, `.gitkeep`. 

Formatos: 47 WebP, 12 PNG, 3 JPG, 7 SVG, 1 `.gitkeep`. Los PNG son los fallback `-mobile.png` de seis `<picture>` (los navegadores sin WebP ya no existen en las métricas) y los cuatro logos sin vector (`lab-logo-coral`, `logo-cesba`, `olamestudio`, `manifiesto-bar`). Los JPG son fallback de `inhabiting-future` y `JornadaCESBA-opt`, que tienen WebP al lado.

El más pesado: `otros-futuros-ied-mobile.png`, **1,6 MB**, fallback PNG de una imagen que en WebP pesa 168 KB. Solo se descarga en navegadores sin WebP, pero está en el repo.

Decisión: borrar los seis sin uso y los fallback PNG/JPG (ocho archivos, 2,9 MB). Olam y Manifiesto siguen pendientes de vector.

## Resumen de decisiones

1. CLAUDE.md: seis líneas viejas.
2. `.contact-city` y `.thesis-download:hover`: dos fallos AA a corregir.
3. Papel: borrar o conservar. Con eso se decide un tercio del CSS.
4. Breakpoints: consolidar a tres.
5. `--font-mono`: renombrar.
6. Tesis: DOI y licencia. **Descartado el 2026-09-06 por decisión de Nicolás**: la tesis se cita con la cita sugerida de la página, sin DOI.
7. Filtros de Lo hecho: etiquetas por movimiento, o sin filtro.
8. `/reporte-impacto/`: mover bajo `/proyectos/` o dejar.
9. Imágenes: catorce archivos a borrar.
