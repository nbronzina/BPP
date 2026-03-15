# CLAUDE.md - BPP Analytics & Design Website

**Project**: BPP Analytics & Design Corporate Website
**Tech Stack**: Vanilla HTML/CSS/JS, Progressive Web App (PWA)
**Build**: csso + terser for minification
**Deploy**: GitHub Pages
**Last Updated**: 2026-03-11

---

## 1. Project Overview

### Purpose
Corporate website for BPP Analytics & Design, a consulting firm specializing in data analysis and process optimization for the public sector in Argentina and LATAM.

### Key Features
- **Responsive design**: Desktop-first, accessible (WCAG 2.1 AA)
- **PWA**: Installable, offline-capable, works on iOS and Android
- **Analytics**: Plausible.io for privacy-friendly tracking
- **Contact form**: FormSubmit integration (no backend required)
- **Structured data**: JSON-LD for SEO (FAQ, ProfessionalService schemas)

### Pages
- `index.html` - Homepage (hero, services, team, activities, contact form)
- `reporte-impacto.html` - Impact report on birth registration in Argentina
- `privacidad.html` - Privacy policy (GDPR-compliant)

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
   - Identidad específica BPP: #ce7352 orange, dark backgrounds (#0a2540)
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
├── sw.js                   # Service Worker source
├── sw.min.js               # Service Worker minified
├── manifest.json           # PWA manifest
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
1. **Edit source files**: `styles.css`, `main.js`, `sw.js` (never edit `.min.*` directly)
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
- [ ] PWA install prompt appears after 50% scroll (desktop + iOS)
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
- **Contact form**: `#contactForm` submits to FormSubmit
- **Validation**: HTML5 required fields
- **Feedback**: `#formMessage` shows success/error
- **Tracking**: `Contacto_enviado` event on successful submit

### PWA
- **Manifest**: `manifest.json` defines app name, icons, theme
- **Service Worker**: `sw.min.js` caches assets for offline use
- **Install prompt**: Shows after 50% scroll, respects 30-day dismiss
- **iOS support**: Custom instructions for "Add to Home Screen"

### Analytics (Plausible)
- **Helper function**: `trackEvent(name, props)` in `main.js`
- **Events tracked**: Section views, CTA clicks, form submissions, PWA installs
- **Privacy**: No cookies, GDPR-compliant, self-hosted script

### Animations
- **Scroll reveals**: Elements with `[data-animate]` fade up when visible
- **Implementation**: IntersectionObserver in `main.js` (lines 102-130)
- **Performance**: Uses `will-change` and `transform` for GPU acceleration

---

## 6. Brand Identity

### Color Palette
```css
/* Primary palette */
--color-primary: #0a2540;      /* Dark navy (headers, text) */
--color-accent: #ce7352;       /* Terracotta (CTAs, links) */
--color-accent-bright: #d4845e; /* Lighter terracotta (hover) */

/* Neutral palette */
--color-white: #ffffff;
--color-light: #f7f9fc;        /* Backgrounds */
--color-text: #333333;         /* Body text */
--color-text-light: #666666;   /* Secondary text */
```

**Usage**:
- **CTAs and links**: `--color-accent` (#ce7352)
- **Headings**: `--color-primary` (#0a2540)
- **Body text**: `--color-text` (#333333)
- **Backgrounds**: `--color-light` (#f7f9fc)

**Updating colors**: Edit CSS custom properties in `styles.css:10-27`, then run `./build.sh`

### Typography
- **Headings**: Work Sans, 700 weight
- **Body**: Work Sans, 400/500 weight
- **Fallback**: system-ui, -apple-system, sans-serif

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
- **Media queries**: Desktop-first with mobile/tablet overrides (max-width: 1024px, 768px, 480px)
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
- **NEVER assume a file is unused based on index.html alone** — the site has multiple HTML files: index.html, proyectos/index.html, reporte-impacto/index.html, privacidad/index.html. Always grep all HTML files before archiving or deleting any asset: `grep -r "filename" *.html **/*.html`

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
- **Media queries**: Desktop-first with mobile/tablet overrides (max-width: 1024px, 768px, 480px)
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
- PWA install prompt (desktop + iOS)

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
- `manifest.json` - PWA config
- `sitemap.xml` - SEO (after adding pages)

### Files to Never Edit Manually
- `styles.min.css` - Generated by build.sh
- `main.min.js` - Generated by build.sh
- `sw.min.js` - Generated by build.sh

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
