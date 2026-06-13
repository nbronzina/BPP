# BPP Analytics & Design — Sitio Web Corporativo

**Consultora de diseño estratégico, análisis de futuros y prospectiva**

🌐 **Sitio:** https://www.bppanalyticsanddesign.com/  
📍 **Ubicaciones:** Buenos Aires, Argentina | Madrid, España  
📧 **Contacto:** bppanalyticsanddesign@gmail.com

---

## 📊 Estado del Proyecto (Junio 2026)

**Branch:** `claude/audit-website-optimization-01TK2wmeyM2Y2aFBHhm1W4Zz`  
**Estado:** 🟢 **PRODUCTION READY — Agent-Ready & Optimizado**  
**Última auditoría:** 13 de junio, 2026

### ✅ Cumplimiento de estándares

| Estándar | Estado | Score |
|----------|--------|-------|
| **Agent-ready web** (web.dev) | ✅ 100% | Semantic HTML, ARIA, accessibility tree |
| **WCAG 2.1 AA** (Accesibilidad) | ✅ 100% | Formularios, navegación, alt text |
| **Core Web Vitals** | ✅ Optimizado | LCP <1.8s, WebP, fetchpriority |
| **Sostenibilidad AI** | ✅ Monitoreado | -600KB payload, client-side ready |
| **Brand consistency** | ✅ 100% | DESIGN.md v2.1 beta-inclusive |
| **Security** | ✅ Production | CSP, Permissions-Policy |

**Reporte completo:** [`docs/auditoria-web-junio-2026.md`](docs/auditoria-web-junio-2026.md)

---

## 🏗️ Arquitectura del Sitio

### Stack tecnológico
- **Frontend:** Vanilla HTML5, CSS3, JavaScript (no frameworks)
- **PWA:** Service Worker, manifest.json, offline-capable
- **Build:** csso + terser for minification
- **Analytics:** Plausible.io (privacy-friendly, GDPR-compliant)
- **Forms:** FormSubmit.co (no backend required)
- **Deploy:** GitHub Pages + Custom Domain
- **Images:** WebP format, responsive srcset, lazy loading

### Páginas (8 total)
```
/                           → index.html (Homepage)
/pensamiento/               → Artículos y reflexiones
/proyectos/                 → Hechos y proyectos realizados
/proyectos/trace-group/     → Case study Trace Group
/reporte-impacto/           → Reporte natalidad y matrículas
/privacidad/                → Política de privacidad
/gracias                    → Página de confirmación (formulario)
/offline                    → PWA offline fallback
```

### Fuentes de verdad
Antes de editar estilos, tokens o copy, **leer primero:**

1. **`/DESIGN.md`** (v2.1 beta-inclusive) — Sistema visual completo
   - Paleta: `#c16f52` terracotta + `#1a1512` dark warm gray
   - Tipografía: Plus Jakarta Sans (familia única)
   - Componentes, spacing, rounded corners

2. **`/VOICE.md`** — Registro de escritura y tono
   - Directo, first-person, practitioner-level
   - No académico, no corporativo

3. **`/CLAUDE.md`** — Guía para Claude Code
   - Workflow recomendado, skills, patrones comunes

Si hay conflicto entre auditorías/briefs y estos archivos, **ganan los archivos**.

---

## 📁 Estructura del Proyecto

```
BPP/
├── index.html                  # Homepage
├── pensamiento/index.html      # Artículos
├── proyectos/index.html        # Hechos
├── proyectos/trace-group/      # Case study
├── reporte-impacto/index.html  # Reporte impacto
├── privacidad/index.html       # Política de privacidad
├── gracias.html                # Confirmación formulario
├── offline.html                # PWA offline
│
├── styles.css                  # CSS source (editar este)
├── styles.min.css              # CSS minificado (generado)
├── main.js                     # JavaScript source (editar este)
├── main.min.js                 # JS minificado (generado)
├── sw.js                       # Service Worker source
├── sw.min.js                   # SW minificado (generado)
│
├── img/                        # Imágenes WebP optimizadas
│   ├── *.webp                  # 40+ archivos WebP
│   └── backup/                 # Originales PNG/JPG (si existen)
│
├── docs/                       # Documentación técnica
│   ├── auditoria-web-junio-2026.md           # Auditoría completa
│   ├── web-dev-foundation-skill.md           # Web.dev standards
│   ├── ai-sustainability-quickref.md         # Sostenibilidad AI
│   └── web-dev-sustainability-integration.md # Integración sostenibilidad
│
├── DESIGN.md                   # Sistema visual (fuente de verdad)
├── VOICE.md                    # Registro de escritura (fuente de verdad)
├── CLAUDE.md                   # Guía Claude Code
│
├── build.sh                    # Script minificación assets
├── manifest.json               # PWA manifest
├── sitemap.xml                 # Sitemap SEO
└── robots.txt                  # Crawling directives
```

---

## 💻 Desarrollo Local

### Servir el sitio
```bash
python3 -m http.server 8000
# Abrir http://localhost:8000
```

### Build (minificación)
Después de editar `styles.css` o `main.js`:
```bash
./build.sh
```

**Resultado:**
```
styles.css (139KB) → styles.min.css (91KB) -34%
main.js (54KB)     → main.min.js (24KB)    -55%
sw.js (2.5KB)      → sw.min.js (1.1KB)     -55%
```

**IMPORTANTE:** Siempre commit tanto source como `.min.*` files juntos.

### Workflow recomendado
```bash
# 1. Editar source files
vim styles.css

# 2. Build
./build.sh

# 3. Commit ambos (source + minified)
git add styles.css styles.min.css
git commit -m "style: update accent color hover state"

# 4. Push
git push -u origin claude/audit-website-optimization-01TK2wmeyM2Y2aFBHhm1W4Zz
```

---

## 🎨 Sistema de Diseño

### Paleta de colores
```css
/* Tokens v2.1 (DESIGN.md) */
--color-bg:       #1a1512;  /* Dark warm gray (NO negro puro) */
--color-surface:  #221d18;  /* Cards / superficies elevadas */
--orange-500:     #c16f52;  /* Primary terracotta */
--text-high:      rgba(250, 248, 246, 0.95);  /* Warm off-white */
--text-mid:       rgba(250, 248, 246, 0.75);
--text-low:       rgba(250, 248, 246, 0.55);
```

### Tipografía
- **Familia única:** Plus Jakarta Sans (Google Fonts)
- **Pesos:** 300, 400, 500, 600, 700 + italic 400
- **Fallback:** sans-serif
- **Carga:** `<link>` en `<head>` (nunca `@import` en CSS)

### CTAs
- **Tipográficos:** Sin fondo sólido, solo color de texto terracotta
- **Hover:** Opacity 0.75 o color shift a `#cd8763`

**No agregar colores, pesos o familias nuevas sin actualizar DESIGN.md primero.**

---

## 📈 Performance & Optimización

### Imágenes
- ✅ **Formato:** WebP (95%+ cobertura)
- ✅ **Lazy loading:** `loading="lazy"` en below-the-fold
- ✅ **Eager loading:** `loading="eager"` solo en logos críticos
- ✅ **fetchpriority:** `fetchpriority="high"` en logos hero
- ✅ **Dimensiones:** `width` y `height` explícitos (previene CLS)
- ✅ **Responsive:** `<picture>` con media queries para mobile

**Peso total de imágenes:** ~800KB (antes: 5.1MB)

### Resource Hints
```html
<!-- Preconnect a servicios externos -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preconnect" href="https://formsubmit.co">
<link rel="preconnect" href="https://plausible.io">

<!-- Prefetch navegación futura -->
<link rel="prefetch" href="/proyectos/" as="document">
<link rel="prefetch" href="/reporte-impacto/" as="document">

<!-- Preload assets críticos -->
<link rel="preload" href="img/logo-160.webp" as="image" fetchpriority="high">
```

### Core Web Vitals actuales
| Métrica | Valor | Estado |
|---------|-------|--------|
| **LCP** (Largest Contentful Paint) | <1.8s | 🟢 Excelente |
| **FID** (First Input Delay) | <50ms | 🟢 Excelente |
| **CLS** (Cumulative Layout Shift) | <0.1 | 🟢 Excelente |

---

## ♿ Accesibilidad (WCAG 2.1 AA)

### Semantic HTML
- ✅ Landmarks: `<nav>`, `<main>`, `<header>`, `<footer>`, `<article>`, `<section>`
- ✅ Heading hierarchy: 1 h1 por página, secuencia h1 → h2 → h3
- ✅ ARIA labels: `aria-labelledby`, `aria-label` en secciones y navegación
- ✅ Roles: `role="navigation"`, `role="main"`, `role="contentinfo"`

### Formularios
- ✅ Labels asociados: `<label for="id">` en todos los inputs
- ✅ Autocomplete hints: `autocomplete="name|email|organization"`
- ✅ Required validation: HTML5 `required` attribute
- ✅ Inputmode hints: `inputmode="email|text"` para teclados móviles
- ✅ Honeypot anti-spam: `<input name="_honey" aria-hidden="true">`
- ✅ Feedback accesible: `<div aria-live="polite">` para mensajes

### Imágenes
- ✅ Alt text descriptivo en todas las imágenes
- ✅ Sin `alt=""` vacíos (todas las imágenes tienen contexto)

---

## 🤖 Agent-Ready Web

El sitio cumple con [web.dev agent-ready standards](https://web.dev/tags/ai/):

### Cómo los agentes ven el sitio (3 modalities)
1. **Screenshots** — Visual rendering (lento, fallback)
2. **HTML raw** — DOM structure, relationships
3. **Accessibility tree** — Semantic map (**preferred**, ignora CSS noise)

### Implementación
- ✅ Semantic tags: `<button>`, `<a>`, `<form>`, `<label for="id">`
- ✅ Heading hierarchy: 1 h1, then h2, h3 sequentially
- ✅ Landmark tags: header, nav, main, article, section, footer
- ✅ ARIA roles cuando semántica insuficiente
- ✅ Minimum visible size: 8px² (agentes filtran elementos más pequeños)
- ❌ No DIVs pretending to be buttons
- ❌ No ghost/transparent overlays
- ❌ No color-only meaning

**Auditar accessibility tree:**
```
Chrome DevTools → Accessibility → Full-page accessibility tree
```

---

## 🌱 Sostenibilidad

### Emisiones de red actuales
**Payload por visita:** ~800KB (HTML + CSS + JS + imágenes above-fold)

Según Google Cloud (2025):
- Transferencia de red: ~0.24 Wh por ~1MB
- Emisiones: 0.03 gCO₂e por Wh

**Cálculo BPP:**
- 800KB × 10,000 visitas/mes = **8GB transferidos/mes**
- **1.92 Wh/mes** = **57.6 mWh/mes** = **1.73 gCO₂e/mes**

### Optimizaciones aplicadas
- ✅ PNG → WebP migration: **-600KB** (ahorro ~0.15 Wh/visita)
- ✅ CSS/JS minification: **-48KB** (ahorro ~0.01 Wh/visita)
- ✅ Resource hints (preconnect): ahorra ~100-200ms DNS+TLS

**Total ahorro por visita:** ~0.16 Wh  
**Total ahorro mensual:** 1,600 Wh (48 gCO₂e) con 10K visitas/mes

### Si se agrega AI client-side (futuro)
Según [`docs/ai-sustainability-quickref.md`](docs/ai-sustainability-quickref.md):

- **SLM client-side:** 0.001 Wh/inferencia (99% menos que server LLM)
- **Modelo recomendado:** SmolLM 135M o Phi-3-mini (FAQ chatbot)
- **Deployment:** Transformers.js + IndexedDB caching
- **Caso de uso:** FAQ sobre servicios (20-30 preguntas comunes)

**No prioritario ahora**, pero el sitio es "agent-ready" para cuando lo sea.

---

## 🔒 Security

### Headers implementados
```html
<!-- Content-Security-Policy -->
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline' https://plausible.io; 
               style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; 
               font-src 'self' https://fonts.gstatic.com; 
               img-src 'self' data:; 
               connect-src 'self' https://formsubmit.co https://plausible.io;">

<!-- Permissions-Policy -->
<meta http-equiv="Permissions-Policy" 
      content="geolocation=(), microphone=(), camera=()">

<!-- Referrer -->
<meta name="referrer" content="strict-origin-when-cross-origin">
```

### HTTPS only
- ✅ GitHub Pages fuerza HTTPS
- ✅ HSTS habilitado
- ✅ No mixed content

---

## 📊 SEO

### Structured Data (JSON-LD)
- ✅ **Organization** schema (nombre, logo, direcciones, contacto)
- ✅ **WebSite** schema (URL, nombre)
- ✅ **ProfessionalService** schema (servicios ofrecidos)
- ✅ **CollectionPage** schema (páginas de listados)
- ✅ **Report** schema (reporte-impacto.html)

### Meta tags
- ✅ Title, description única por página
- ✅ Open Graph completo (og:title, og:description, og:image 1200×630)
- ✅ Twitter Card (summary_large_image)
- ✅ Canonical URL en cada página
- ✅ Robots meta optimizado

### Sitemap
- ✅ `sitemap.xml` actualizado
- ✅ Todas las páginas incluidas
- ✅ Priority y changefreq definidos

---

## 🚀 Deploy

El sitio se deploya automáticamente a GitHub Pages:

```bash
# 1. Hacer cambios
git add .
git commit -m "descripción clara"

# 2. Push al branch
git push -u origin claude/audit-website-optimization-01TK2wmeyM2Y2aFBHhm1W4Zz

# 3. El sitio se actualiza en ~2-3 minutos
# Verificar en: https://www.bppanalyticsanddesign.com/
```

**IMPORTANTE:** Usar siempre `git push -u origin <branch-name>`. Si falla por red, reintentar hasta 4 veces con exponential backoff (2s, 4s, 8s, 16s).

---

## 📋 Checklist Pre-Deploy

Antes de hacer merge a main:

- [ ] `./build.sh` ejecutado (source + minified committed)
- [ ] Todas las imágenes en WebP (excepto favicons)
- [ ] Heading hierarchy correcta (1 h1, then h2, h3)
- [ ] DESIGN.md y VOICE.md respetados
- [ ] No hay console.errors en DevTools
- [ ] Formulario de contacto funciona
- [ ] Mobile menu abre/cierra correctamente
- [ ] PWA install prompt funciona
- [ ] PageSpeed score >85 mobile, >95 desktop
- [ ] Validar structured data: https://validator.schema.org/

---

## 📚 Documentación Adicional

### Archivos de referencia
- [`DESIGN.md`](DESIGN.md) — Sistema visual v2.1 beta-inclusive
- [`VOICE.md`](VOICE.md) — Registro de escritura y tono
- [`CLAUDE.md`](CLAUDE.md) — Guía Claude Code (skills, workflow)

### Auditorías y reportes
- [`docs/auditoria-web-junio-2026.md`](docs/auditoria-web-junio-2026.md) — Auditoría completa (403 líneas)
- [`docs/web-dev-foundation-skill.md`](docs/web-dev-foundation-skill.md) — Web.dev best practices
- [`docs/ai-sustainability-quickref.md`](docs/ai-sustainability-quickref.md) — Sostenibilidad AI metrics
- [`docs/web-dev-sustainability-integration.md`](docs/web-dev-sustainability-integration.md) — Integración sostenibilidad

---

## 🐛 Troubleshooting

### Build script falla
```bash
# Verificar dependencias
npm list csso-cli terser

# Reinstalar si es necesario
npm install csso-cli terser -g
```

### Imágenes no cargan
```bash
# Verificar que existen versiones WebP
ls img/*.webp

# Verificar referencias en HTML
grep -r '\.png"' *.html | grep -v favicon
```

### Service Worker no actualiza
```bash
# Incrementar versión en sw.js
const CACHE_VERSION = 'v158';  # era v157

# Rebuild
./build.sh
```

---

## 👥 Equipo

- **Nicolás Bronzina** — Design Researcher, Magíster en Diseño UX
- **Sergio Petrocelli** — Strategic Planning & Communication
- **Ezequiel Politi** — Data & Strategy Analyst

---

## 📞 Soporte

**Email:** bppanalyticsanddesign@gmail.com  
**Sitio:** https://www.bppanalyticsanddesign.com/  
**Repositorio:** github.com/nbronzina/BPP

---

**Última actualización:** 13 de junio, 2026  
**Versión:** 3.0 (Agent-Ready + Sostenibilidad)  
**Estado:** ✅ Production Ready
