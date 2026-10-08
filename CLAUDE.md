# CLAUDE.md - BPP Analytics & Design Website

**Project**: BPP Analytics & Design Corporate Website
**Tech Stack**: HTML plano generado con Eleventy 3 (Nunjucks), CSS y JS a mano, sin frameworks en runtime. Sin PWA (retirada 2026-09).
**Build**: `npm run build` → Eleventy genera `_site/`, csso y terser minifican. Los `.min` ya no se versionan.
**Deploy**: Vercel, conectado al repo. Publica producción al mergear en la rama por defecto y arma un preview por cada otra rama. GitHub Pages y `deploy.yml` se retiraron (2026-10).
**Last Updated**: 2026-10-08 (diseño v3)

---

## Fuentes de verdad

Antes de tocar estilos, tokens, componentes o copy:

- Sistema visual: leer `/DESIGN.md` en la raíz del repo.
- Voz y registro de escritura: leer `/VOICE.md` en la raíz del repo.

Estos dos archivos son la fuente de verdad del proyecto. Si una auditoría, un brief anterior, o una sugerencia de modelo contradice lo que está en esos archivos, ganan los archivos.

---

## 1. Project Overview

### Purpose
Sitio de BPP Analytics & Design: estudio de investigación, diseño de futuros, datos e IA y comunicación estratégica. Trabaja con quienes deciden en el sector público y en empresas, en Buenos Aires y Madrid (la misma descripción que `llms.txt`).

### Key Features
- **Responsive design**: Mobile-first, desktop adapted, accessible (WCAG 2.1 AA)
- **Sin medición**: el sitio no mide visitas. Plausible se retiró el 2026-10-08 ("Eliminar, sacar, plausible")
- **Contacto**: mail directo (`mailto:`) con promesa de respuesta en 48 h hábiles. Sin formulario: menos fricción y ningún servicio externo.
- **Structured data**: JSON-LD por página (`src/_includes/jsonld/`): ProfessionalService y Organization en la home, CollectionPage con ItemList en Lo hecho y Pensamiento, CreativeWork, Report, ScholarlyArticle, PrivacyPolicy

### Pages
- `index.html` - Homepage (nombre y frase, cuatro movimientos, Hechos con los tres casos, Pensamiento en filas, nosotros con equipo y clientes, cuándo escribirnos y contacto)
- `proyectos/` - Lo hecho, en dos secciones: Casos y Docencia y jornadas
- `proyectos/trace-group/` - Provocación Trace Group: un caso escrito como pregunta "¿Y si…?" (ficha + objeto + cómo se construyó). No explica el método ni la iniciativa; la fecha 2032 marca la ficción. Nunca se dice que fue adoptada. Ver VOICE.md, "Vocabulario propio"
- `proyectos/gabinete-extemporaneo/` - Caso Gabinete Extemporáneo (Escuela de Innovación, ITBA): una instalación de bienvenida entregada como diseño y especificación. No dice que esté construida ni muestra lo de adentro
- `proyectos/natalidad/` - Caso natalidad y matrículas (ficha + informe con fuentes oficiales); `reporte-impacto/` solo redirige
- `pensamiento/` - Hub único de ideas: señales, artículos y tesis (La Usina vive acá como serie)
- `usina/` - Solo redirección a `/pensamiento/#tesis` (meta refresh, noindex); `usina/tesis-01/` sigue siendo la URL de la tesis
- `privacidad/` - Política de privacidad
- `404.html` - Página de error propia

---

## 2. Claude Skills Available

Las siguientes skills están disponibles en `~/.claude/skills/` y deben cargarse antes de trabajar en diseño o código frontend:

### Skills de Diseño y UX

1. **frontend-design**
   - Prevención de "AI slop" (estéticas genéricas generadas por IA)
   - Tipografía distintiva (evitar Inter, Roboto, Space Grotesk)
   - Selección de color y composición audaz
   - Creación de atmósfera (gradientes, texturas, efectos)

2. **ui-ux-pro-max**
   - Base de datos con 50+ estilos, 161 paletas de color, 57 font pairings
   - Sistema de razonamiento para matching producto-estilo-color
   - Reglas de accesibilidad, performance, motion, navegación
   - Búsqueda por dominio: `--design-system`, `--domain <ux|style|color|typography>`

3. **bencium-innovative-ux-designer**
   - Dirección creativa audaz con Design Thinking Protocol
   - Pregunta primero (purpose, tone, constraints, differentiation)
   - Luego comete BOLD: elige extremo estético y ejecuta con precisión
   - Variante "innovative" con énfasis en composición no-predecible

### Skills de Auditoría

4. **web-design-guidelines**
   - Auditoría automática contra 100+ reglas de Vercel Web Interface Guidelines
   - Cubre accesibilidad (WCAG), performance (Core Web Vitals), UX patterns
   - Fetch en vivo desde source URL: siempre actualizado
   - Output terse: `file:line` format

### Skills de Identidad

5. **bpp-brand** *(SIEMPRE CARGAR ÚLTIMO - TIENE PRIORIDAD)*
   - Identidad específica BPP: #c16f52 terracotta (también el logo), fondo Tinta azul-negro (#12151a)
   - Puntero a DESIGN.md y VOICE.md: corner brackets solo en La Usina, sin glow, editorial feel
   - Voice: directo, first-person, practitioner-level (no académico, no corporativo)
   - Pairing con frontend-design: dirección estética ya definida (refined dark editorial (base Tinta fría) with warm orange accent)

### Skills de Desarrollo y Testing

6. **gstack** - Garry Tan's development workflow tools
   - **IMPORTANTE**: Use `/browse` skill from gstack for ALL web browsing
   - **NEVER** use `mcp__claude-in-chrome__*` tools
   - Available skills:
     - `/browse` - Fast headless browser for testing and dogfooding (~100ms per command)
     - `/review` - Code review workflow
     - `/ship` - Deployment and shipping workflow
     - `/plan-ceo-review` - CEO-level planning review
     - `/plan-eng-review` - Engineering planning review
     - `/retro` - Retrospective workflow
   - Use for: QA testing, site dogfooding, user flow verification, bug filing with evidence

### Workflow Recomendado

```bash
# Al inicio de sesión de diseño/frontend:
/frontend-design
/ui-ux-pro-max
/bencium-innovative-ux-designer
/web-design-guidelines
/bpp-brand  # ÚLTIMO - sobreescribe defaults genéricos
```

**IMPORTANTE**: `bpp-brand` define la dirección estética del proyecto. Cuando `frontend-design` o `bencium-innovative-ux-designer` pregunten por aesthetic direction, la respuesta es siempre: **"refined dark editorial (base Tinta fría) with warm orange accent"**. Nunca derivar hacia defaults genéricos de AI (purple gradients, Inter font, glass morphism).

---

## 3. Architecture

### File Structure
```
/
├── src/                        # TODO lo que se publica sale de acá
│   ├── _includes/layouts/base.njk      # head + nav + footer únicos
│   ├── _includes/partials/             # nav, footer, cierre, copiar-mail, seguir-leyendo, caso-nav, senales-cards, piezas (macros tarjeta y fila)
│   ├── _includes/jsonld/<pagina>.njk   # JSON-LD por página
│   ├── _data/site.json                 # nombre, URL, mail, CSP
│   ├── _data/piezas.mjs                # casos, docencia, artículos y tesis: una entrada por pieza
│   ├── index.njk, proyectos/ (+ trace-group/, gabinete-extemporaneo/, natalidad/), pensamiento/, privacidad/, usina/tesis-01/, 404.njk
│   ├── usina/index.html                # redirección a /pensamiento/#tesis (no se procesa)
│   ├── reporte-impacto/index.html      # redirección a /proyectos/natalidad/ (no se procesa)
│   ├── sitemap.njk                     # genera sitemap.xml con las páginas que declaran `sitemap:`
│   ├── styles.css                      # CSS fuente (editar este)
│   └── main.js                         # JS fuente (editar este)
├── .eleventy.js                # config: input src/, output _site/, passthrough de img/, fonts/, docs/*.pdf…
├── package.json                # scripts build / check / serve
├── scripts/check-site.mjs      # chequeo del sitio generado (a mano, con npm run check)
├── img/, fonts/                # assets (passthrough)
├── docs/                       # *.pdf se publica; *.md nunca
├── robots.txt, favicons, llms.txt   # passthrough
├── sw.js / sw.min.js           # kill-switch del SW retirado (borrar en 2027)
└── _site/                      # salida generada (ignorada por git)
```

### Design System
La descripción completa está en `/DESIGN.md` (v3.0). Lo que más se toca:
- **Colors**: CSS custom properties in `:root` (`src/styles.css`)
- **Typography**: Plus Jakarta Sans (interfaz) y Literata (prosa larga), self-hosted en `/fonts/`. Siete tamaños, `--fs-1` a `--fs-7`; nada por debajo de 15 px. Mayúsculas solo en `.etiqueta`
- **Grilla**: un solo borde izquierdo por ancho. Nav, footer, `.cabecera` y cada `.bloque` llevan `--marco` a los lados (24 / 64 / 96 px o lo que sobre de una columna de 1200). Adentro nada se centra; el texto se acota con `--medida` (40rem)
- **Spacing**: 8px base grid (multiples of 8); 160 px de silencio entre bloques desde 769 (80 en el teléfono)
- **Breakpoints**: base móvil; `min-width: 769px` (escritorio, con el rango `769–1024` para tablet), `1025px` (grillas anchas), `1280px` (medida máxima e índice pegajoso de los casos). No agregar otros valores. `1536px` dejó de usarse en octubre de 2026, cuando el índice pasó a 1280.
- **Animations**: sin apariciones al scroll; solo transiciones de color y opacidad

---

## 4. Development Workflow

### Making Changes
1. **Edit sources**: páginas en `src/**/index.njk`, layout y parciales en `src/_includes/`, `src/styles.css`, `src/main.js`
2. **Build**: `npm run check` genera `_site/` y corre el chequeo
3. **Test locally**: `python3 -m http.server 8000 --directory _site`
4. **Commit**: solo fuentes; `_site/` y los `.min` no se versionan
5. **Push** a la rama de trabajo y PR contra la rama por defecto (el repo no tiene `main`): Vercel arma el preview de la rama y publica producción al mergear. `npm run check` ya no corre solo: hay que correrlo antes de mergear

**Reglas del layout**
- Front matter por página: `title`, `description`, `ogType`, `section` (`proyectos` | `pensamiento` | `privacidad` | `inicio`, marca el `aria-current` del nav), `bodyClass` (solo en los casos, `reporte-page page-lectura`, y en la tesis, `page-lectura`), `jsonld` (ruta del include), `sitemap` (`lastmod`, `priority`, `changefreq`; sin esto la página no entra al sitemap y el chequeo falla), `homepage: true` solo en index.
- Cada página es una `.cabecera` y una serie de `<section class="bloque">`: así toma el marco y el ritmo. No se escriben paddings laterales ni márgenes entre secciones a mano.
- Las tarjetas y las filas salen de `src/_data/piezas.mjs` con las macros de `partials/piezas.njk` (`tarjeta`, `fila`). Sumar un caso, una clase o un artículo es sumar una entrada ahí: Lo hecho, Pensamiento, el JSON-LD de los dos y "Seguí leyendo" (`largas`) la toman solos; el inicio elige por id (`inicio.casos`, `inicio.textos`). Las imágenes de tarjeta son un WebP de 800 px por pieza.
- Las páginas de caso declaran además `indice` y `compartir`: de ahí salen el índice pegajoso, el índice móvil y los botones de compartir (`partials/caso-nav.njk`). No se copia ese bloque.
- El cierre (`partials/cierre.njk`, ya es un `.bloque`) sale de `cierreTitulo`, `cierreTexto` (opcional), `cierreCta` y `cierreAsunto` (asunto del mail, default "Hablemos"). Los casos y la tesis incluyen después `partials/seguir-leyendo.njk`, que lista las piezas largas de `piezas.largas` menos la propia.
- Rutas siempre absolutas desde la raíz (`/img/…`, `/proyectos/`), nunca `../`.
- Las señales existen una sola vez: `partials/senales-cards.njk`, incluido en Pensamiento (el inicio no tiene radar de señales desde septiembre).
- `usina/index.html` es una redirección estática; no lleva layout.

### Build (`package.json`)
```bash
npm run build   # eleventy + csso + terser → _site/
npm run check   # borra _site/, build y scripts/check-site.mjs (estructura de cada página, enlaces y anclas internas, imágenes, JSON-LD, sitemap)
npm run serve   # eleventy --serve con recarga; rehace también el CSS y el JS minificados al cambiar la fuente
```

### Testing Checklist
- [ ] Mobile menu works (open/close/escape/outside click)
- [ ] Smooth scroll to anchors (`#services`, `#nosotros`, `#contact`, etc.)
- [ ] El `mailto:` de contacto y el CTA de cada cierre abren el mail (el cierre, con el asunto de la página); "Copiar dirección" copia la dirección
- [ ] Las imágenes de tarjeta son un WebP de 800 px (los archivos `-mobile`), declarado en `src/_data/piezas.mjs`

---

## 5. Key Components

### Navigation
- **Desktop**: Horizontal menu in header
- **Mobile**: Hamburger menu (toggle with `mobileMenuBtn`)
- **Hablemos**: `.nav-cta`, afuera de la lista y a la vista en todas las páginas, también en el teléfono. La página actual se marca con subrayado; solo la página exacta (`aria-current="page"`) deja de ser clicable
- **Visible en todas las páginas**: desde v3.0 (2026-10-08) el inicio ya no esconde el nav ni tiene un logo grande en el hero; el logo va una sola vez, en el nav
- **Accessibility**: ARIA labels, keyboard navigation (Escape to close). El menú móvil cerrado queda con `visibility: hidden` (no recibe foco)
- **Smooth scroll**: Internal anchor links (`#services`, `#nosotros`, `#contact`, etc.). El foco va al destino: así funciona "Saltar al contenido principal"
- **aria-label**: si un enlace lo lleva, empieza por el texto visible ("Leer en Medium: …"). WCAG 2.5.3. Los enlaces dicen adónde llevan ("Leer el caso", "Leer en LinkedIn"), nunca "Leer más"

### Forms
- **Contacto directo**: bloque `.contact-direct` en `#contact` con `mailto:`; no hay formulario. El CTA de cada cierre también abre el mail, con el asunto de la página (`cierreAsunto`). La dirección vive en `site.email`
- **Copiar dirección**: `partials/copiar-mail.njk`, bajo el mail del contacto y en cada cierre. Sale con `hidden` y `main.js` lo muestra solo si el navegador puede copiar

### Medición
- **No hay.** Plausible se retiró el 2026-10-08 con todo el código que le mandaba eventos (`trackEvent`, secciones vistas, profundidad de lectura). La CSP solo admite el propio dominio y la política de privacidad dice que el sitio no mide visitas: volver a medir es una decisión de los socios y cambia esa página
- **Conversaciones**: se ven en la casilla. El asunto de cada cierre dice desde qué página escribió la persona

### Animations
- **Sin apariciones al scroll** (retiradas 2026-09-05) **ni fundido de página** (retirado 2026-10-08: escondía la primera pintura). El único movimiento de entrada es el del título del inicio (`textReveal`). El único IntersectionObserver de `main.js` no anima contenido: cambia la cifra del rail de natalidad.
- **Transiciones**: solo color y opacidad en hover/focus; `prefers-reduced-motion` las anula.

---

## 6. Brand Identity

### Color Palette
La fuente de verdad es `/DESIGN.md` (v3.0). Resumen:
```css
/* Tokens (definidos en styles.css :root) */
--color-bg: #12151a;        /* Tinta: azul-negro frío (v2.4). NO marrón, NO negro puro */
--color-surface: #1a1e25;   /* superficies: señales, tesis, escenarios, avisos */
--orange-500: #c16f52;      /* Primary terracotta y color del logo (NO #ce7352, eso era v1) */
/* Texto: rgba(250, 248, 246, ...) warm off-white en tres niveles (NO blanco puro) */
```

**Usage**:
- **CTAs**: tipográficos, color `--orange-500`, con la flecha que dibuja el CSS (`/img/flecha.svg`); nunca botones con fondo sólido ni la flecha como carácter
- **rgba del primary**: `rgba(193, 111, 82, …)`, nunca `rgba(206, 115, 82, …)`
- **Logo**: `/img/logo.svg` en `#c16f52`, el mismo naranja del acento (antes `#e9804d`)

**Updating colors**: validar contra `/DESIGN.md` primero, editar `src/styles.css` `:root`, correr `npm run check`

### Typography
- **Dos familias con rol fijo**: Plus Jakarta Sans para interfaz y títulos; Literata solo para la prosa de lectura larga en páginas `.page-lectura`. Ambas self-hosted en `/fonts/`. Literata va con el tamaño óptico fijo en 19, el único tamaño en que se usa (`literata-latin-opsz19.woff2` y su itálica).
- **Carga**: `@font-face` en `src/styles.css`; el `<head>` solo precarga la regular (y Literata en las páginas `.page-lectura`). Nunca `@import` en CSS
- **Pesos**: 400 y 700 + itálica 400 únicamente (decisión 2026-08-21, feedback socios): no agregar otros
- **Tamaños**: siete, `--fs-1` a `--fs-7` (40→72, 32→48, 26→34, 21→24, 19, 17 y 15 px). No escribir tamaños sueltos
- **Fallback**: `--font-body` cae en `Plus Jakarta Sans Fallback` (Arial con métricas ajustadas, definida en `styles.css`); las reglas que escriben la familia a mano caen en `sans-serif`

### Tone and Voice
- **Professional**: Formal but approachable
- **Local**: "Vos" form (Argentine Spanish)
- **Jargon-free**: Explain technical concepts simply
- **Action-oriented**: Clear CTAs ("Hablemos de tu proyecto")

### Content Wording Distinctions

#### "Hechos" vs "Lo hecho"
These terms refer to the same section but use different wording intentionally — **never unify them**.

- **"Hechos"** (noun): Section heading in the content (`<h2 id="actividades-heading">Hechos</h2>`)
  - Meaning: "Facts" / "Accomplishments" / "Things Done"
  - Usage: Section titles, headings, content structure

- **"Lo hecho"** (past participle): Navigation link pointing to the Hechos section
  - Meaning: "What has been done" / "The work accomplished"
  - Usage: CTAs, navigation links, action-oriented references

**Rationale**: "Hechos" = direct noun for section identity; "Lo hecho" = narrative/action framing for user navigation. Reflects brand voice: direct, practitioner-level, avoiding corporate uniformity.

---

## 7. Code Style Guide

### CSS Rules
- **Custom properties**: Use variables for colors, spacing, breakpoints (defined in `:root`)
- **Naming**: BEM-like with modifiers (`.button--primary`, `.card--highlight`)
- **Media queries**: Mobile-first: base styles target mobile, desktop enhancements via `min-width` (769, 1025, 1280). No quedan overrides con `max-width`; el único rango es el de tablet (`769–1024`)
- **Specificity**: Single classes preferred, avoid `!important`

### JavaScript Rules
- **Null-safe DOM**: Always `if (element)` before adding listeners
- **Page-specific logic**: Conditional on `body.classList.contains("page-class")`
- **No globals**: Wrap in `DOMContentLoaded` listener

### HTML Rules
- **Semantic structure**: `<section id="...">` for major blocks
- **Accessibility**: ARIA labels on buttons, semantic headings (h1 → h2 → h3)
- **Progressive enhancement**: funciona sin JS (no hay formularios; los enlaces y el mailto no dependen de nada)
- **Structured data**: un include JSON-LD por página
- **NEVER assume a file is unused based on index alone** — hay ocho páginas en `src/**/index.njk` más `src/404.njk` y los parciales en `src/_includes/`. Antes de archivar o borrar un asset: `grep -rn "filename" src/`

### Commit Format
```
type: brief description (50 chars max)

Optional body explaining why (not what).
Wrap at 72 characters.
```

**Types**: `feat`, `fix`, `style`, `refactor`, `docs`, `perf`, `chore`

**Example**:
```
feat: add WebP images with responsive srcset

Reduces page weight by 83% (5.1MB → 863KB).
Uses sharp-cli for conversion, maintains quality.
```

---

## 8. Known Patterns

### CSS Architecture
- **Single source of truth**: CSS custom properties in `:root` for colors, spacing, breakpoints
- **Naming**: BEM-like with modifiers (`--variant` syntax, not `--modifier`)
- **Media queries**: Mobile-first: base styles target mobile, desktop enhancements via `min-width` (769, 1025, 1280). No quedan overrides con `max-width`; el único rango es el de tablet (`769–1024`)
- **Specificity**: Avoid `!important`, use single classes where possible

### JavaScript Patterns
- **Null-safe DOM access**: Always check `if (element)` before adding listeners
- **Page-specific logic**: Use `body.classList.contains("page-class")` for conditionals
- **Sin reveals**: no existe `[data-animate]`; ningún IntersectionObserver anima contenido

### HTML Patterns
- **Semantic structure**: `<section id="...">` con `aria-labelledby`
- **Progressive enhancement**: funciona sin JS (enlaces, mailto, año del footer horneado en el build)
- **Accessibility**: ARIA labels on interactive elements, semantic headings

### Build Process
- **When to build**: After editing `src/styles.css` or `src/main.js`, run `npm run check`
- **What it does**: Eleventy genera `_site/`; csso y terser minifican CSS y JS
- **Commits**: solo fuentes; `_site/` y los `.min` no se versionan

### Testing Checklist
- Mobile menu (open/close/escape/outside click)
- Smooth scroll to anchors
- Índice de los casos: pegajoso desde 1280 y se va al llegar al cierre; debajo, botón "Índice" que se esconde al bajar y abre un diálogo (Escape cierra, el foco vuelve al botón)
- Filtro de Pensamiento (cada botón devuelve al menos una pieza; Lo hecho no tiene filtro)

---

## Quick Reference

### Common Tasks
```bash
# Edit styles
vim src/styles.css
npm run check
git add src/styles.css
git commit -m "style: ajustar contraste de metadata"

# Edit JavaScript
vim src/main.js
npm run check
git add src/main.js
git commit -m "feat: evento de descarga"

# Deploy
git push origin <rama-de-trabajo>
# Vercel arma el preview; al mergear el PR en la rama por defecto publica producción
```

### Important Files to Edit
- `src/styles.css` - All styles (source)
- `src/main.js` - All behavior (source)
- `src/index.njk` - Homepage content; `src/_includes/layouts/base.njk` - head/nav/footer
- `sitemap:` en el front matter de la página - el sitemap se genera; `lastmod` se cambia a mano cuando cambia el contenido

### Files to Never Edit Manually
- `_site/**` - Generado por Eleventy (no está en git)

---

## Pending Content

### Lead Magnet Framework
**PENDING**: Create downloadable "Framework de señales débiles" PDF to enable low-intent CTA:
- CTA text: "Descargar framework de señales débiles"
- Format: PDF, 4-6 pages
- Content: Methodology for identifying and interpreting weak signals in strategic contexts
- Purpose: Lead generation for low-intent visitors not ready for direct contact
- Location: /docs/framework-senales-debiles.pdf
- Referenced in: Not yet implemented (waiting for content creation)

---

**For questions or issues**: Contact BPP Analytics & Design at bppanalyticsanddesign@gmail.com
