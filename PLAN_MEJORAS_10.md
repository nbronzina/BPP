# Plan de Mejoras: 9.3/10 → 10/10

**Score Actual:** 9.3/10

| Categoría | Actual | Objetivo | Gap |
|-----------|--------|----------|-----|
| Performance | 90 | 95-100 | +5-10 |
| SEO | 100 | 100 | ✅ |
| Accessibility | 95 | 100 | +5 |
| Best Practices | 95 | 100 | +5 |
| PWA | 85 | 95 | +10 |

---

## 🎯 MEJORAS PRIORITARIAS PARA 10/10

### 1. **PERFORMANCE (90 → 100)** +10 puntos

#### A. Critical CSS Inline (Impacto: +3 puntos)
**Qué:** Poner el CSS crítico inline en `<head>` y cargar el resto async
**Cómo:**
- Extraer CSS crítico (above-the-fold)
- Inline en `<style>` en head
- Cargar resto con `media="print" onload="this.media='all'"`

**Beneficio:** Render más rápido, elimina render-blocking CSS

---

#### B. Optimizar Fuentes con Subsetting (Impacto: +2 puntos)
**Qué:** Cargar solo caracteres latinos usados
**Cómo:**
- Cambiar Google Fonts URL a: `&text=...` con solo caracteres usados
- O self-host fuentes con WOFF2 subsetted

**Beneficio:** Reduce tamaño de fuentes 70-80%

---

#### C. Preconnect Adicionales (Impacto: +1 punto)
**Qué:** Agregar preconnect a recursos externos
```html
<link rel="preconnect" href="https://formsubmit.co">
<link rel="preconnect" href="https://plausible.io">
```

---

#### D. Comprimir HTML/CSS (Impacto: +2 puntos)
**Qué:** Minificar HTML y CSS
**Cómo:** Usar build tool (ej: html-minifier, cssnano)
**Beneficio:** Reduce tamaño 15-20%

---

#### E. Lazy Load Iframes (si hubiera) (Impacto: +2 puntos)
**Ya implementado:** Lazy loading en imágenes ✅

---

### 2. **ACCESSIBILITY (95 → 100)** +5 puntos

#### A. ARIA Landmarks Completos (Impacto: +2 puntos)
**Qué:** Agregar roles ARIA semánticos
```html
<header role="banner">
<nav role="navigation" aria-label="Navegación principal">
<main role="main">
<section role="region" aria-labelledby="servicios-heading">
<footer role="contentinfo">
```

---

#### B. Mejorar Contraste en Textos Secundarios (Impacto: +2 puntos)
**Problema actual:** `--color-text-secondary: #b0b0b0` sobre `#0f0f0f`
**Ratio actual:** ~6.5:1 (AA compliant pero justo)
**Objetivo:** 7:1+ (AAA compliant)

**Cambio:**
```css
--color-text-secondary: #c5c5c5; /* de #b0b0b0 */
```

---

#### C. Focus Visible en Todos los Interactivos (Impacto: +1 punto)
**Agregar focus a:**
- Todos los links del footer
- Social icons
- Form inputs (ya tienen ✅)

```css
footer a:focus-visible,
.social-icons a:focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
}
```

---

### 3. **BEST PRACTICES (95 → 100)** +5 puntos

#### A. Content Security Policy (Impacto: +3 puntos)
**Qué:** Header CSP para prevenir XSS
**Problema:** GitHub Pages no permite headers custom
**Solución:** Meta tag CSP

```html
<meta http-equiv="Content-Security-Policy" content="
    default-src 'self';
    script-src 'self' https://plausible.io;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    font-src https://fonts.gstatic.com;
    img-src 'self' data:;
    connect-src 'self' https://formsubmit.co https://plausible.io;
">
```

---

#### B. Permissions-Policy (Impacto: +1 punto)
```html
<meta http-equiv="Permissions-Policy" content="
    geolocation=(),
    microphone=(),
    camera=()
">
```

---

#### C. Referrer-Policy (Impacto: +1 punto)
```html
<meta name="referrer" content="strict-origin-when-cross-origin">
```

---

### 4. **PWA (85 → 95)** +10 puntos

#### A. Manifest Mejorado (Impacto: +3 puntos)
**Agregar a `site.webmanifest`:**

```json
{
  "name": "BPP Analytics & Design",
  "short_name": "BPP",
  "description": "Consultora de diseño estratégico y análisis de futuros",
  "categories": ["business", "productivity", "design"],
  "screenshots": [
    {
      "src": "/img/screenshot-mobile.png",
      "sizes": "540x720",
      "type": "image/png",
      "form_factor": "narrow"
    },
    {
      "src": "/img/screenshot-desktop.png",
      "sizes": "1920x1080",
      "type": "image/png",
      "form_factor": "wide"
    }
  ],
  "shortcuts": [
    {
      "name": "Contacto",
      "short_name": "Contacto",
      "description": "Contactar a BPP",
      "url": "/#contact",
      "icons": [{ "src": "/android-chrome-192x192.png", "sizes": "192x192" }]
    },
    {
      "name": "Servicios",
      "short_name": "Servicios",
      "url": "/#servicios",
      "icons": [{ "src": "/android-chrome-192x192.png", "sizes": "192x192" }]
    }
  ],
  "icons": [...],
  "theme_color": "#0f0f0f",
  "background_color": "#0f0f0f",
  "display": "standalone",
  "start_url": "/?source=pwa",
  "scope": "/",
  "orientation": "portrait-primary",
  "dir": "ltr",
  "lang": "es-AR"
}
```

---

#### B. Offline Page Mejorada (Impacto: +2 puntos)
**Crear:** `offline.html` con diseño BPP

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <title>Sin Conexión - BPP</title>
    <style>
        /* Estilos inline para funcionar offline */
    </style>
</head>
<body>
    <h1>Sin conexión</h1>
    <p>Parece que perdiste la conexión a internet.</p>
    <button onclick="location.reload()">Reintentar</button>
</body>
</html>
```

**Actualizar Service Worker:**
```javascript
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
      .catch(() => caches.match('/offline.html'))
  );
});
```

---

#### C. Install Prompt (Impacto: +2 puntos)
**Agregar prompt para instalar PWA:**

```javascript
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;

  // Mostrar botón "Instalar App"
  const installButton = document.createElement('button');
  installButton.textContent = 'Instalar App';
  installButton.onclick = async () => {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    deferredPrompt = null;
  };

  document.body.appendChild(installButton);
});
```

---

#### D. Más Tamaños de Iconos (Impacto: +1 punto)
**Agregar:**
- 72x72
- 96x96
- 128x128
- 144x144
- 152x152
- 384x384

---

#### E. Maskable Icon (Impacto: +2 puntos)
**Para Android adaptive icons:**

```json
{
  "src": "/android-chrome-512x512-maskable.png",
  "sizes": "512x512",
  "type": "image/png",
  "purpose": "maskable"
}
```

---

### 5. **EXTRAS PARA PERFECCIÓN**

#### A. Dark/Light Mode Toggle
**Impacto:** Mejor UX, no afecta score pero impresiona

#### B. Cookie Consent Banner
**Solo si usas cookies** (Plausible no necesita)

#### C. Animaciones Avanzadas
**Scroll-triggered animations con Intersection Observer**

#### D. Tests Automatizados
**Lighthouse CI en GitHub Actions**

---

## 📊 IMPACTO ESTIMADO POR MEJORA

### **Quick Wins (1-2 horas):**
1. ✅ ARIA Landmarks (+2)
2. ✅ Contraste mejorado (+2)
3. ✅ Preconnect adicional (+1)
4. ✅ Referrer-Policy (+1)
5. ✅ Focus visible footer (+1)
**Total Quick Wins: +7 puntos → Score: 9.6/10**

### **Medium Effort (2-4 horas):**
6. ✅ CSP Meta tag (+3)
7. ✅ Manifest mejorado (+3)
8. ✅ Offline page (+2)
9. ✅ Permissions-Policy (+1)
**Total Medium: +9 puntos → Score: 9.9/10**

### **Advanced (4-6 horas):**
10. ✅ Critical CSS inline (+3)
11. ✅ Font subsetting (+2)
12. ✅ Install prompt (+2)
13. ✅ HTML/CSS minify (+2)
14. ✅ Más iconos PWA (+1)
**Total Advanced: +10 puntos → Score: 10/10**

---

## 🎯 RECOMENDACIÓN

### **Para llegar a 9.5/10 (30-60 min):**
Implementar **Quick Wins** solamente:
- ARIA landmarks
- Contraste mejorado
- Preconnect/Meta policies
- Focus visible

### **Para llegar a 9.8/10 (2-3 horas):**
Quick Wins + Medium Effort:
- Todo lo anterior
- CSP
- Manifest mejorado
- Offline page

### **Para llegar a 10/10 (6-8 horas):**
Todo lo anterior + Advanced:
- Critical CSS
- Font optimization
- Minification
- Install prompt

---

## ✅ PRIORIDAD MÁXIMA (Si solo hacés 5 cosas)

1. **ARIA Landmarks** - 10 min, +2 puntos
2. **Contraste texto secundario** - 5 min, +2 puntos
3. **CSP Meta tag** - 15 min, +3 puntos
4. **Manifest mejorado** - 20 min, +3 puntos
5. **Offline page** - 30 min, +2 puntos

**Total: 80 min → +12 puntos → Score: 9.8/10** 🎯

---

¿Querés que implemente alguna de estas mejoras ahora?
