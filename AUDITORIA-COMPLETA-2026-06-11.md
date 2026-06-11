# Auditoría completa — BPP Analytics & Design
**Fecha**: 2026-06-11
**Alcance**: código (HTML/CSS/JS/SW/build), accesibilidad (WCAG 2.1 AA), performance, SEO, y consistencia visual contra DESIGN.md (v2 beta-inclusive) + VOICE.md.
**Método**: 3 auditorías paralelas con verificación línea por línea. Todos los hallazgos citan archivo:línea. `_prototype-*` y `bpp_overlay_*` excluidos por diseño.

> ⚠️ Nota: el workflow de deploy publica todo el repo (ver hallazgo S1). Este archivo también quedará público si se mergea sin resolver eso.

---

## Resumen ejecutivo

El sitio funciona, pero arrastra **4 capas de sistemas de diseño superpuestos** y una **PWA a medias que es la causa raíz de los problemas de cache de esta semana**. Hallazgos críticos:

1. **El Service Worker viejo congela visitantes en la versión vieja del sitio.** El precache referencia `/img/Ajedrez.{webp,png}` que no existen → `cache.addAll()` falla → ningún SW nuevo puede instalarse → la estrategia cache-first sirve el sitio viejo indefinidamente. **Esto explica por qué los tooltips "seguían viejos" a pesar de 7 bumps de cache (v144→v151)**: los bumps nunca llegan a instalarse en clientes con el SW viejo activo.
2. **Los tooltips están rotos en mobile y teclado.** El JS (main.js:1384-1407) togglea la clase `.tooltip-active`, pero esa clase se eliminó del CSS en el rework reciente. Solo funciona `:hover` (desktop con mouse).
3. **La tipografía del sistema v2 tiene 0% de implementación.** DESIGN.md define ZT Bros Oskon + Chivo (las fuentes están en `/fonts/`, 668KB, hasta precacheadas por el SW), pero ningún `@font-face` las carga. Todo el sitio corre sobre Plus Jakarta Sans (Google Fonts), una fuente que no pertenece a ningún sistema documentado.
4. **Los links `../#contact` de todas las subpáginas no funcionan**: `main.js:62` hace `scrollTo(0,0)` incondicional y devuelve al usuario al top. Afecta la conversión directa al formulario.

Drift estimado vs DESIGN.md v2: **~50% de implementación real**. Colores base bien (~85%), tipografía 0%, espaciado section 0%, CTAs ~30%, voz ~90%.

---

## 1. CRÍTICOS

| # | Hallazgo | Ubicación |
|---|----------|-----------|
| C1 | SW precachea `/img/Ajedrez.{webp,png}` inexistentes → `cache.addAll()` atómico falla → **visitantes con SW viejo congelados en sitio viejo, sin poder actualizar nunca** | sw.js:77-78 |
| C2 | Imagen rota visible en producción: "El Branding como fenómeno social" referencia los mismos Ajedrez.* inexistentes | proyectos/index.html:277-278 |
| C3 | Tooltips inaccesibles por touch y teclado: JS togglea `.tooltip-active` pero la clase no existe en CSS (eliminada en rework); `role="button"` en `<span>` no responde a Enter/Espacio y no hay keydown handler (WCAG 2.1.1, 1.4.13) | main.js:1374-1407 + styles.css:5187 |
| C4 | PWA incoherente: registro del SW comentado ("TEMPORARILY DISABLED") en main.js:291-299, ninguna página registra el SW, pero el manifest sigue linkeado y el botón "Instalar app" (index.html:1146) es UI muerta | main.js:291-299 |
| C5 | `scrollTo(0,0)` incondicional en DOMContentLoaded rompe **todos** los deep links `../#contact` desde subpáginas y los shortcuts del manifest (`/#contact`, `/#services`, `/#socios`) | main.js:62 |
| C6 | Tipografía v2 (Bros Oskon + Chivo) con 0% de implementación: sin `@font-face`, fuentes muertas en `/fonts/` (668KB). Todo el sitio usa Plus Jakarta Sans — fuera de todo sistema documentado | styles.css:2, 89-93 |

## 2. ALTOS

### Código
- **index.html:57 y 1181** — la homepage carga y preloadea `main.js` SIN minificar (52.9KB vs 23.5KB del min, con 5 console.logs en producción). Todas las demás páginas usan `main.min.js`.
- **main.js:452** — `querySelector(".form-submit")` devuelve null (el botón real es `.cta-primary`) → el submit nunca se deshabilita ni muestra "Enviando…" → doble envío posible.
- **deploy.yml** — `path: '.'` publica TODO el repo en producción: CLAUDE.md, DESIGN.md, VOICE.md, BENCHMARKING-REPORT-2026*.md (análisis competitivo), audits, prototipos. Accesible por URL directa. *(S1)*
- **sw.js:105-128** — cache-first sin expiración para HTML; runtime cache acumula sin límite (latente mientras el SW esté deshabilitado, pero es lo que congeló a los visitantes actuales).

### Accesibilidad
- **styles.css:3374-3378** — focus ring global = glow al 20% de alpha sobre `#1a1512`: prácticamente invisible, falla contraste no-textual 3:1 (WCAG 2.4.7).
- **styles.css:2852, 3269** — texto `rgba(250,248,246,0.4)` sobre `#1a1512` ≈ 3.7:1, falla AA (mínimo 4.5:1).
- **index.html:291+400, 500+508** — IDs duplicados `actividades-heading` y `services-heading` (h2 y h3 con el mismo id) rompen `aria-labelledby` e invalidan el HTML.
- **main.js:1377** — `aria-label="Definición: …"` reemplaza el nombre accesible del término: el lector de pantalla lee la definición entera en medio de la oración.
- **proyectos/index.html** (9 imágenes: líneas 153-399) — sin `width`/`height` → CLS en la página de Hechos.

### Diseño (violaciones explícitas de DESIGN.md)
- **styles.css:1200-1220** — `.cta-primary` es botón con fondo sólido + hover con glow naranja `0 0 20px/40px rgba(206,115,82,…)`. DESIGN.md: "BPP no usa botones con fondo sólido" + "glow naranja prohibido en web" + blur 40px > 24px. Triple violación en el CTA principal, replicada en el critical CSS de las 7 páginas.
- **styles.css:5152, 5162** — tooltips: `background: #000000` (Don't explícito: "No bajar el fondo a negro puro") y shadow `0 12px 32px rgba(0,0,0,0.9)` (alpha 0.9 > 0.4, blur 32 > 24). ⚠️ El negro puro fue pedido a mano esta semana para resolver percepción de transparencia — **decisión pendiente**: o se alinea a `surface #221d18`/negro permitido por excepción documentada en DESIGN.md, o se documenta la excepción. Hoy contradice la fuente de verdad.
- **privacidad/index.html:52, 88, 119** — página entera en `background: #0a0a0a` (negro puro v1) y `color: #ffffff` (blanco puro). Pisa los tokens v2.
- **~25 instancias de `rgba(206,115,82,…)`** (= `#ce7352` v1 disfrazado de rgba) en borders/backgrounds/glows fuera del focus ring — styles.css:96, 1096-1098, 1152-1154, 1667, 1755, 1780, 1821-1855, 1948, 2014, 2041, 2104, 2138, 2208, 2490, 2723, 2730, 2872, 2996-2998, 3169, 5635.
- **Hovers prohibidos**: `translateY` en .nav-cta (styles.css:759) y .hero-scroll-cue (636, 906); text-shadow glow en .cta-link (1258); box-shadow naranja en .transformation-card (1787) y .services-cta-link (1948).
- **styles.css:65, 134** — `--spacing-section: 40/48px`. El token signature `section: 160px` de DESIGN.md no existe en ningún CSS (el espaciado real es ~30% del definido).
- **styles.css:24-34** — escala `--orange-50…950` (11 variantes del primary). DESIGN.md: "Un solo valor, usado con intención. Nunca en variantes".
- **gracias.html:31-32** — carga un CUARTO set tipográfico (Atkinson Hyperlegible + IBM Plex Mono + Lexend Deca) que ni siquiera usa. IBM Plex Mono fue explícitamente rechazada según DESIGN.md.
- **styles.css:895** — `border-radius: 999px` (pill) en .hero-scroll-cue. "Sin pills" es prohibición explícita.

### Performance
- **styles.css:2** — `@import` de Google Fonts dentro del CSS (cadena de 4 saltos render-blocking) pidiendo 16 variantes cuando se usan ~4.
- **sw.js** — precache de 90 recursos = **16.4MB** en primera visita (latente).
- **img/** — 60MB total en el repo desplegado; `img/archive/` + `img/backup/` = 33MB públicos. Top: personal-software.png 4.5MB, algoritmos-sociologia-branding.png 3.0MB, 2026-ano-analogico.png 2.1MB.

## 3. MEDIOS

- CSP presente solo en 2 de 8 páginas (index, pensamiento). Faltante en proyectos, trace-group, reporte-impacto, privacidad, gracias, offline.
- Critical CSS inline desincronizado en las 7 páginas: define `nav{position:sticky}` mientras styles.css define `fixed` → salto de layout (CLS) al cargar el CSS completo.
- ~110 de 355 clases CSS huérfanas (~31% del archivo): breadcrumbs-*, testimonials-*, corner-bracket*, proyecto-*, hero-grid, service-card, trust-badge*, etc.
- Selectores triplicados: .pwa-dismiss-btn ×3, .form-submit ×3, .actividad-entrada ×3, + ~25 duplicados más.
- `proyectos.css` y `reporte-impacto.css` en raíz: huérfanos, ninguna página los referencia.
- Variables CSS indefinidas usadas: `--color-white` (styles.css:1512), `--color-border-card` (3919), `--font-family-base` (3923). 16 variables definidas sin uso.
- FormSubmit con email en claro + `_captcha=false` (mitigado parcialmente por honeypot).
- Links a `docs/*.md` con `target="_blank"` sin `rel="noopener"` (index.html:315, 348, 868, 871) que además abren markdown crudo sin estilos.
- Menú mobile sin focus trap (Tab escapa al fondo con el menú abierto).
- Marquee de logos sin pausa por teclado (sí respeta prefers-reduced-motion).
- Headings: salto h1→h3 en pensamiento (114→170); h2/h3 del TOC antes del h1 en reporte-impacto y trace-group.
- 4 páginas sin preconnect a fonts.googleapis.com aunque el CSS las importa.
- Colores de estado Material (#4CAF50/#F44336) en form success/error — fuera de paleta.
- `meta theme-color #0a0a0a` (negro puro v1) en las 8 páginas — debería ser `#1a1512`.
- VOICE.md: "Contactanos" genérico en reporte-impacto/index.html:538 (prohibición explícita); h1 de proyectos "De la incertidumbre a la acción" es tagline-promesa, patrón que VOICE.md descarta.
- Scroll listeners sin throttle en reporte-page (main.js:827-979) con layout thrashing.

## 4. BAJOS (selección)

- Quiz y service-toggle con encadenamientos sin null-check (main.js:1207, 1357, 996).
- Flecha `→` inyectada en CTAs sin `aria-hidden`; submit del form trackea doble evento.
- gracias.html: script Plausible legacy, manifest ?v=73 vs ?v=120, fallback logo-160.png inexistente.
- build.sh: sed del SW es no-op, hashes generados que nada inyecta, "próximos pasos" obsoletos.
- robots.txt: `Allow: /llms.txt` fuera de grupo User-agent.
- CLAUDE.md desactualizado: menciona Work Sans, paleta #0a2540, FAQ JSON-LD y estructura de archivos que ya no existen.
- index.html.tmp (40KB) en working tree.
- 20 usos de `!important` (los de reduced-motion son legítimos; el bloque 5409-5440 es parche de especificidad).

## 5. Lo que está bien ✔

- Tokens de color base v2 correctos en `:root` (#1a1512, #221d18, #c16f52, rgba warm off-white).
- Corner brackets presentes (hero, service blocks, actividades). Team row hover photo intacto. Focus ring global existe (aunque débil).
- Voz ~90% alineada a VOICE.md: voseo consistente, sin frases prohibidas, CTAs específicos, distinción Hechos/"Lo hecho" respetada.
- Formulario accesible: labels, aria-live, autocomplete, honeypot bien implementado.
- Critical CSS inline + stylesheet async: patrón correcto y consistente en las 8 páginas.
- Sitemap, canonical, meta descriptions, og:image, JSON-LD válidos. Skip links, lang, landmarks.
- prefers-reduced-motion cubierto en CSS (12 bloques) y JS.
- `transform: scale()` en hovers: 0 ocurrencias (cumple). Flechas con translateX(±4px): patrón permitido bien usado.

---

## Plan de acción priorizado

**Fase 1 — Sangrado (hoy):**
1. Quitar `/img/Ajedrez.*` de sw.js:77-78 y de proyectos/index.html:277-278 (o restaurar las imágenes).
2. Decidir PWA: reactivar (con SW arreglado + network-first para HTML) o retirar manifest/prompts/botón. Mientras esté a medias, los visitantes viejos siguen congelados — publicar un SW válido que haga `self.skipWaiting()` + limpieza es la única vía de rescate.
3. Restaurar `.tooltip-active` y `:focus-visible` en el CSS de tooltips + keydown en main.js (mobile y teclado hoy no tienen tooltips).
4. Fix `scrollTo(0,0)` → respetar `location.hash` (conversión a contacto desde subpáginas).
5. index.html → `main.min.js`.
6. Fix selector `.form-submit` → `.cta-primary` en main.js:452.

**Fase 2 — Sistema (esta semana):**
7. Decisión tipográfica: implementar Bros Oskon + Chivo según DESIGN.md (las fuentes ya están en /fonts/; convertir a woff2) o actualizar DESIGN.md si Plus Jakarta Sans es la dirección real. **Hoy la fuente de verdad y la producción se contradicen al 100%.** ⚠️ DESIGN.md exige evaluación manual de cambios tipográficos — no auto-aplicar.
8. Purgar v1: ~25 rgba(206,115,82), #0a0a0a en privacidad y theme-colors, #ffffff, glows, translateY, pill 999px, escala orange-50…950.
9. Decisión CTAs: .cta-primary como botón sólido viola DESIGN.md — alinear a CTA tipográfico o documentar excepción.
10. Resolver publicación de docs internos (deploy.yml `path: '.'`): excluir del artifact o sacar del repo.

**Fase 3 — Limpieza (cuando haya aire):**
11. Purga de CSS muerto (~31%), duplicados, variables rotas; CSP en las 6 páginas faltantes; sincronizar critical CSS (sticky→fixed); width/height en imágenes de proyectos; contraste 0.4→0.55; IDs duplicados; gracias.html (fuentes, plausible legacy); img/archive+backup fuera del deploy (33MB); CLAUDE.md actualizado.
