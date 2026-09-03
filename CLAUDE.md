# CLAUDE.md - BPP Analytics & Design Website

**Project**: BPP Analytics & Design Corporate Website
**Tech Stack**: Vanilla HTML/CSS/JS, sin PWA (retirada 2026-09: nadie instala la web de una consultora)
**Build**: csso + terser for minification
**Deploy**: GitHub Pages
**Last Updated**: 2026-03-11

---

## Fuentes de verdad

Antes de tocar estilos, tokens, componentes o copy:

- Sistema visual: leer `/DESIGN.md` en la raíz del repo.
- Voz y registro de escritura: leer `/VOICE.md` en la raíz del repo.

Estos dos archivos son la fuente de verdad del proyecto. Si una auditoría, un brief anterior, o una sugerencia de modelo contradice lo que está en esos archivos, ganan los archivos.

---

## 1. Project Overview

### Purpose
Corporate website for BPP Analytics & Design, a consulting firm specializing in data analysis and process optimization for the public sector in Argentina and LATAM.

### Key Features
- **Responsive design**: Mobile-first, desktop adapted, accessible (WCAG 2.1 AA)
- **Analytics**: Plausible.io for privacy-friendly tracking
- **Contacto**: mail directo (`mailto:`) con promesa de respuesta en 48 h hábiles. Sin formulario: menos fricción y ningún servicio externo.
- **Structured data**: JSON-LD for SEO (FAQ, ProfessionalService schemas)

### Pages
- `index.html` - Homepage (hero, about, servicios, hechos, confianza, señales, contacto)
- `proyectos/` - Hechos (lista de proyectos)
- `proyectos/trace-group/` - Caso Trace Group (ficha + diagnóstico, sin ficción ni cifras sin fuente)
- `reporte-impacto/` - Caso natalidad y matrículas (ficha + informe con fuentes oficiales)
- `pensamiento/` - Hub único de ideas: señales, artículos y tesis (La Usina vive acá como serie)
- `usina/` - Solo redirección a `/pensamiento/#tesis` (meta refresh, noindex); `usina/tesis-01/` sigue siendo la URL de la tesis
- `privacidad/` - Política de privacidad

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
   - Identidad específica BPP: #c16f52 terracotta, dark warm gray backgrounds (#1a1512)
   - Corner brackets, glow effects, editorial feel
   - Voice: directo, first-person, practitioner-level (no académico, no corporativo)
   - Pairing con frontend-design: dirección estética ya definida (refined dark editorial with warm orange accent)

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

**IMPORTANTE**: `bpp-brand` define la dirección estética del proyecto. Cuando `frontend-design` o `bencium-innovative-ux-designer` pregunten por aesthetic direction, la respuesta es siempre: **"refined dark editorial with warm orange accent"**. Nunca derivar hacia defaults genéricos de AI (purple gradients, Inter font, glass morphism).

---

## 3. Architecture

### File Structure
```
/
├── index.html              # Homepage
├── reporte-impacto.html    # Impact report
├── privacidad.html         # Privacy policy
├── styles.css              # Source CSS (edit this)
├── styles.min.css          # Minified CSS (generated)
├── main.js                 # Source JavaScript (edit this)
├── main.min.js             # Minified JavaScript (generated)
├── sw.js / sw.min.js       # Kill-switch: desregistra el SW viejo en clientes que lo tenían. Borrar en 2027.
├── fonts/                  # Plus Jakarta Sans woff2 self-hosted
├── sitemap.xml             # SEO sitemap
├── robots.txt              # Search engine directives
├── build.sh                # Build script (minification)
├── img/                    # Images (WebP + fallbacks)
└── [documentation files]   # Audit reports, guides
```

### Design System
- **Colors**: CSS custom properties in `:root` (styles.css lines 10-27)
- **Typography**: Work Sans (Google Fonts), system fonts as fallback
- **Spacing**: 8px base grid (multiples of 8)
- **Breakpoints**: 480px (mobile), 768px (tablet), 1024px (desktop)
- **Animations**: Fade-up on scroll via IntersectionObserver

---

## 4. Development Workflow

### Making Changes
1. **Edit source files**: `styles.css`, `main.js` (never edit `.min.*` directly)
2. **Run build**: `./build.sh` to regenerate minified files
3. **Test locally**: Open HTML files in browser, check mobile view
4. **Commit**: Include both source and minified files in commit
5. **Push**: Deploy to GitHub Pages (auto-updates in 2-3 minutes)

### Build Script (`build.sh`)
```bash
# Minifies CSS with csso
# Minifies JS with terser
# Generates cache-busting hashes (optional)
./build.sh
```

**When to run**:
- After editing `styles.css` or `main.js`
- Before committing CSS/JS changes
- Before deploying to production

### Testing Checklist
- [ ] Mobile menu works (open/close/escape/outside click)
- [ ] Smooth scroll to anchors (`#servicios`, `#nosotros`, etc.)
- [ ] Contact form submits and shows success/error messages
- [ ] Images load in WebP format with fallbacks
- [ ] Analytics events tracked (check Plausible)

---

## 5. Key Components

### Navigation
- **Desktop**: Horizontal menu in header
- **Mobile**: Hamburger menu (toggle with `mobileMenuBtn`)
- **Accessibility**: ARIA labels, keyboard navigation (Escape to close)
- **Smooth scroll**: Internal anchor links (`#servicios`, `#nosotros`, etc.)

### Forms
- **Contacto directo**: bloque `.contact-direct` en `#contact` con `mailto:`; no hay formulario
- **Tracking**: `Contacto_mail` al hacer click en cualquier `mailto:` (prop `ubicacion` = id de la sección)

### Analytics (Plausible)
- **Helper function**: `trackEvent(name, props)` in `main.js`
- **Events tracked**: Section views, CTA clicks, `Contacto_mail` (conversación iniciada), `Caso_leido_75` (75 % de scroll en páginas `.reporte-page`). Son las dos métricas que importan; el resto es contexto.
- **Privacy**: No cookies, GDPR-compliant, self-hosted script

### Animations
- **Scroll reveals**: Elements with `[data-animate]` fade up when visible
- **Implementation**: IntersectionObserver in `main.js` (lines 102-130)
- **Performance**: Uses `will-change` and `transform` for GPU acceleration

---

## 6. Brand Identity

### Color Palette
La fuente de verdad es `/DESIGN.md` (v2.1 beta-inclusive). Resumen:
```css
/* Tokens v2 (definidos en styles.css :root) */
--color-bg: #1a1512;        /* Dark warm gray (NO negro puro) */
--color-surface: #221d18;   /* Cards / superficies elevadas */
--orange-500: #c16f52;      /* Primary terracotta (NO #ce7352, eso era v1) */
/* Texto: rgba(250, 248, 246, ...) warm off-white (NO blanco puro) */
```

**Usage**:
- **CTAs**: tipográficos, color `--orange-500` — nunca botones con fondo sólido
- **rgba del primary**: `rgba(193, 111, 82, …)`, nunca `rgba(206, 115, 82, …)`

**Updating colors**: validar contra `/DESIGN.md` primero, editar `styles.css` `:root`, correr `./build.sh`

### Typography
- **Familia única**: Plus Jakarta Sans (Google Fonts), todos los contextos
- **Carga**: `<link>` en el `<head>` de cada página (nunca `@import` en CSS)
- **Pesos**: 400 y 700 + itálica 400 únicamente (decisión 2026-08-21, feedback socios) — no agregar otros
- **Fallback**: sans-serif

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
- **Media queries**: Mobile-first — base styles target mobile, desktop enhancements via min-width: 769px (legacy max-width overrides remain and should be migrated when touched)
- **Specificity**: Single classes preferred, avoid `!important`

### JavaScript Rules
- **Null-safe DOM**: Always `if (element)` before adding listeners
- **Event tracking**: Use `trackEvent(name, props)` helper (checks `window.plausible`)
- **Page-specific logic**: Conditional on `body.classList.contains("page-class")`
- **No globals**: Wrap in `DOMContentLoaded` listener

### HTML Rules
- **Semantic structure**: `<section id="...">` for major blocks
- **Accessibility**: ARIA labels on buttons, semantic headings (h1 → h2 → h3)
- **Progressive enhancement**: Works without JS (forms still submit, links still work)
- **Structured data**: JSON-LD scripts for SEO (FAQ, ProfessionalService)
- **NEVER assume a file is unused based on index.html alone** — the site has multiple HTML files: index.html, proyectos/index.html, proyectos/trace-group/index.html, reporte-impacto/index.html, pensamiento/index.html, usina/tesis-01/index.html, privacidad/index.html. Always grep all HTML files before archiving or deleting any asset: `grep -r "filename" *.html **/*.html`

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
- **Media queries**: Mobile-first — base styles target mobile, desktop enhancements via min-width: 769px (legacy max-width overrides remain and should be migrated when touched)
- **Specificity**: Avoid `!important`, use single classes where possible

### JavaScript Patterns
- **Null-safe DOM access**: Always check `if (element)` before adding listeners
- **Page-specific logic**: Use `body.classList.contains("page-class")` for conditionals
- **Tracking**: Centralize via `trackEvent(name, props)` helper (checks `window.plausible`)
- **Animations**: IntersectionObserver triggers `.visible` class on `[data-animate]` elements

### HTML Patterns
- **Semantic structure**: `<section id="...">` with `data-animate` for scroll reveals
- **Progressive enhancement**: Works without JS (forms, navigation)
- **Accessibility**: ARIA labels on interactive elements, semantic headings

### Build Process
- **When to build**: After editing `styles.css` or `main.js`, run `./build.sh`
- **What it does**: Minifies CSS/JS with csso/terser, generates cache-busting hashes
- **Commits**: Always commit both source and minified files together

### Testing Checklist
- Mobile menu (open/close/escape/outside click)
- Smooth scroll to anchors
- Form submission and validation

---

## Quick Reference

### Common Tasks
```bash
# Edit styles
vim styles.css
./build.sh
git add styles.css styles.min.css
git commit -m "style: update accent color to #ce7352"

# Edit JavaScript
vim main.js
./build.sh
git add main.js main.min.js
git commit -m "feat: add new tracking event for downloads"

# Deploy
git push origin main
# Wait 2-3 minutes for GitHub Pages to update
```

### Important Files to Edit
- `styles.css` - All styles (source)
- `main.js` - All behavior (source)
- `index.html` - Homepage content
- `sitemap.xml` - SEO (after adding pages)

### Files to Never Edit Manually
- `styles.min.css` - Generated by build.sh
- `main.min.js` - Generated by build.sh

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
