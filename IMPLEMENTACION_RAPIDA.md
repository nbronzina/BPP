# 🚀 GUÍA DE IMPLEMENTACIÓN RÁPIDA
## Soluciones Críticas Listas para Deploy

---

## 1. OPTIMIZACIÓN DE IMÁGENES (CRÍTICO)

### Script de Optimización Automática

```bash
#!/bin/bash
# optimize-images.sh - Ejecutar en la raíz del proyecto

echo "🖼️  Iniciando optimización de imágenes..."

# Instalar dependencias si no existen
if ! command -v sharp &> /dev/null; then
    echo "Instalando sharp-cli..."
    npm install -g sharp-cli
fi

# Crear directorio temporal
mkdir -p img/optimized

# Optimizar PNGs grandes a WebP
echo "Optimizando NicolasOptima.png..."
sharp -i img/NicolasOptima.png -o img/optimized/NicolasOptima.webp --webp "{quality:82,effort:6}"
sharp -i img/NicolasOptima.png -o img/optimized/Nicolas-480.webp -w 480 --webp "{quality:80,effort:6}"
sharp -i img/NicolasOptima.png -o img/optimized/Nicolas-768.webp -w 768 --webp "{quality:82,effort:6}"

echo "Optimizando SergioOptima.png..."
sharp -i img/SergioOptima.png -o img/optimized/SergioOptima.webp --webp "{quality:82,effort:6}"
sharp -i img/SergioOptima.png -o img/optimized/Sergio-480.webp -w 480 --webp "{quality:80,effort:6}"
sharp -i img/SergioOptima.png -o img/optimized/Sergio-768.webp -w 768 --webp "{quality:82,effort:6}"

echo "Optimizando EzequielOptima.jpeg..."
sharp -i img/EzequielOptima.jpeg -o img/optimized/EzequielOptima.webp --webp "{quality:82,effort:6}"
sharp -i img/EzequielOptima.jpeg -o img/optimized/Ezequiel-480.webp -w 480 --webp "{quality:80,effort:6}"
sharp -i img/EzequielOptima.jpeg -o img/optimized/Ezequiel-768.webp -w 768 --webp "{quality:82,effort:6}"

echo "Optimizando JornadaCESBA.jpg..."
sharp -i img/JornadaCESBA.jpg -o img/optimized/JornadaCESBA.webp --webp "{quality:80,effort:6}"
sharp -i img/JornadaCESBA.jpg -o img/optimized/JornadaCESBA-800.webp -w 800 --webp "{quality:78,effort:6}"

echo "Optimizando logo.png..."
sharp -i img/logo.png -o img/optimized/logo.webp --webp "{quality:90,effort:6}"

# Resumen
echo ""
echo "✅ Optimización completada!"
echo "📊 Comparación de tamaños:"

du -h img/NicolasOptima.png img/optimized/NicolasOptima.webp 2>/dev/null || echo "Archivos originales y optimizados"
du -h img/SergioOptima.png img/optimized/SergioOptima.webp 2>/dev/null
du -h img/JornadaCESBA.jpg img/optimized/JornadaCESBA.webp 2>/dev/null

echo ""
echo "🔄 Próximo paso: Mover archivos optimizados y actualizar HTML"
echo "   mv img/optimized/* img/"
echo "   Luego actualizar referencias en index.html"
```

### Hacer Ejecutable y Correr

```bash
chmod +x optimize-images.sh
./optimize-images.sh
```

---

## 2. MINIFICACIÓN CSS/JS (CRÍTICO)

### Script de Build

```bash
#!/bin/bash
# build.sh - Minificar assets

echo "🔧 Iniciando build..."

# Instalar dependencias
npm install -g csso-cli terser html-minifier-terser

# Minificar CSS
echo "Minificando CSS..."
csso styles.css --output styles.min.css
echo "✅ styles.css: $(wc -c < styles.css) → $(wc -c < styles.min.css) bytes"

# Minificar JS
echo "Minificando JavaScript..."
terser main.js -o main.min.js --compress passes=2 --mangle
echo "✅ main.js: $(wc -c < main.js) → $(wc -c < main.min.js) bytes"

# Minificar Service Worker
terser sw.js -o sw.min.js --compress passes=2 --mangle
echo "✅ sw.js: $(wc -c < sw.js) → $(wc -c < sw.min.js) bytes"

# Minificar HTML (opcional)
html-minifier-terser index.html \
  --collapse-whitespace \
  --remove-comments \
  --minify-css true \
  --minify-js true \
  -o index.min.html

echo ""
echo "✅ Build completado!"
echo "📦 Ahorro total: ~60% del tamaño original"
```

---

## 3. CONFIGURACIÓN NGINX (COMPRESIÓN)

```nginx
# /etc/nginx/sites-available/bppanalyticsanddesign.com

server {
    listen 443 ssl http2;
    server_name www.bppanalyticsanddesign.com bppanalyticsanddesign.com;

    # SSL certificates (Let's Encrypt recomendado)
    ssl_certificate /etc/letsencrypt/live/bppanalyticsanddesign.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/bppanalyticsanddesign.com/privkey.pem;

    # SSL optimization
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    root /var/www/bppanalyticsanddesign.com/html;
    index index.html;

    # GZIP Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1000;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/javascript
        application/javascript
        application/json
        application/xml
        image/svg+xml
        font/woff2;
    gzip_proxied any;

    # Brotli Compression (mejor que gzip)
    brotli on;
    brotli_comp_level 6;
    brotli_types
        text/plain
        text/css
        text/javascript
        application/javascript
        application/json
        image/svg+xml
        font/woff2;

    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;

    # Cache control para assets estáticos
    location ~* \.(jpg|jpeg|png|webp|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location ~* \.(css|js|woff2|woff|ttf)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location ~* \.(html)$ {
        expires 1h;
        add_header Cache-Control "public, must-revalidate";
    }

    # Service Worker - no cachear
    location = /sw.js {
        add_header Cache-Control "no-cache, no-store, must-revalidate";
        expires 0;
    }

    # Redirect www to non-www
    if ($host = www.bppanalyticsanddesign.com) {
        return 301 https://bppanalyticsanddesign.com$request_uri;
    }

    # Main location
    location / {
        try_files $uri $uri/ =404;
    }
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name bppanalyticsanddesign.com www.bppanalyticsanddesign.com;
    return 301 https://bppanalyticsanddesign.com$request_uri;
}
```

### Activar configuración

```bash
# Crear symlink
sudo ln -s /etc/nginx/sites-available/bppanalyticsanddesign.com /etc/nginx/sites-enabled/

# Test configuración
sudo nginx -t

# Reload
sudo systemctl reload nginx
```

---

## 4. GITHUB ACTIONS - CI/CD AUTOMÁTICO

```yaml
# .github/workflows/deploy.yml

name: Build and Deploy

on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'

    - name: Install dependencies
      run: |
        npm install -g csso-cli terser sharp-cli

    - name: Optimize images
      run: |
        mkdir -p img/optimized
        sharp -i img/logo.png -o img/optimized/logo.webp --webp "{quality:90,effort:6}"
        # Añadir más comandos según necesites

    - name: Minify CSS
      run: |
        csso styles.css --output styles.min.css

    - name: Minify JavaScript
      run: |
        terser main.js -o main.min.js --compress passes=2 --mangle
        terser sw.js -o sw.min.js --compress passes=2 --mangle

    - name: Run Lighthouse CI
      run: |
        npm install -g @lhci/cli
        lhci autorun --config=lighthouserc.json || echo "Lighthouse warnings"

    - name: Deploy to GitHub Pages
      if: github.ref == 'refs/heads/main'
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./
        exclude_assets: '.github,.gitignore,optimize-images.sh,build.sh'
```

### Lighthouse CI Config

```json
{
  "ci": {
    "collect": {
      "staticDistDir": "./",
      "url": [
        "http://localhost/index.html",
        "http://localhost/reporte-impacto.html",
        "http://localhost/privacidad.html"
      ]
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", {"minScore": 0.85}],
        "categories:accessibility": ["error", {"minScore": 0.95}],
        "categories:seo": ["error", {"minScore": 0.90}]
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    }
  }
}
```

---

## 5. PACKAGE.JSON - SCRIPTS NPM

```json
{
  "name": "bpp-analytics-design",
  "version": "2.0.0",
  "description": "Website for BPP Analytics & Design",
  "scripts": {
    "build": "npm run build:css && npm run build:js && npm run build:images",
    "build:css": "csso styles.css --output styles.min.css",
    "build:js": "terser main.js -o main.min.js --compress passes=2 --mangle && terser sw.js -o sw.min.js --compress passes=2 --mangle",
    "build:images": "bash optimize-images.sh",
    "serve": "python3 -m http.server 8000",
    "lighthouse": "lighthouse http://localhost:8000 --view --output=html --output-path=./lighthouse-report.html",
    "validate:html": "html-validate index.html reporte-impacto.html privacidad.html",
    "validate:css": "stylelint styles.css",
    "deploy": "npm run build && git add . && git commit -m 'Build: optimized assets' && git push"
  },
  "devDependencies": {
    "csso-cli": "^4.0.2",
    "terser": "^5.19.0",
    "sharp-cli": "^4.0.0",
    "html-validator-cli": "^7.2.0",
    "stylelint": "^15.10.0",
    "@lhci/cli": "^0.12.0"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/nbronzina/BPP.git"
  },
  "author": "BPP Analytics & Design",
  "license": "MIT"
}
```

### Instalar y usar

```bash
# Instalar dependencias
npm install

# Ejecutar build completo
npm run build

# Servir localmente y testear
npm run serve

# Ejecutar Lighthouse
npm run lighthouse

# Deploy automático
npm run deploy
```

---

## 6. CHECKLIST PRE-DEPLOY

```markdown
### Antes de hacer deploy:

#### Imágenes
- [ ] Ejecutar optimize-images.sh
- [ ] Verificar tamaños < 200KB por imagen
- [ ] Mover optimizadas a /img/
- [ ] Actualizar referencias en HTML

#### Assets
- [ ] Ejecutar build.sh o npm run build
- [ ] Verificar styles.min.css existe
- [ ] Verificar main.min.js existe
- [ ] Actualizar referencias en HTML (líneas 52, 567)

#### HTML
- [ ] Actualizar srcset en imágenes socios
- [ ] Añadir preload para assets críticos
- [ ] Verificar meta tags OG
- [ ] Eliminar meta keywords (línea 7)

#### Servidor
- [ ] Configurar Nginx con compresión
- [ ] Verificar SSL/HTTPS activo
- [ ] Configurar headers de seguridad
- [ ] Test cache headers

#### Testing
- [ ] Lighthouse score > 85 mobile
- [ ] Lighthouse score > 95 desktop
- [ ] Security headers A+
- [ ] Test en mobile real
- [ ] Test formulario de contacto
- [ ] Verificar Service Worker funciona

#### SEO
- [ ] Submit sitemap a Google Search Console
- [ ] Verificar robots.txt
- [ ] Test structured data en Schema.org validator
- [ ] Verificar canonical URLs
```

---

## 7. TESTING LOCAL

```bash
# 1. Build assets
npm run build

# 2. Servir con Python
python3 -m http.server 8000

# 3. En otra terminal, ejecutar Lighthouse
lighthouse http://localhost:8000 \
  --output=html \
  --output-path=./lighthouse-report.html \
  --view

# 4. Test security headers (necesita servidor real, no python)
# Usar https://securityheaders.com/ una vez deployed

# 5. Test performance
# PageSpeed Insights: https://pagespeed.web.dev/
# WebPageTest: https://www.webpagetest.org/
```

---

## 8. MONITOREO POST-DEPLOY

### Configurar alertas en Plausible (ya implementado)

```javascript
// Añadir en main.js - tracking de errores
window.addEventListener('error', (e) => {
  trackEvent('JavaScript_Error', {
    message: e.message,
    file: e.filename,
    line: e.lineno
  });
});

// Tracking de performance
window.addEventListener('load', () => {
  setTimeout(() => {
    const perfData = performance.getEntriesByType('navigation')[0];
    const lcp = perfData.loadEventEnd - perfData.fetchStart;

    if (lcp > 2500) {
      trackEvent('Performance_Warning', {
        metric: 'LCP',
        value: Math.round(lcp)
      });
    }
  }, 0);
});
```

### Sentry para error tracking (opcional)

```html
<!-- Añadir antes de </head> -->
<script
  src="https://browser.sentry-cdn.com/7.80.0/bundle.min.js"
  integrity="sha384-..."
  crossorigin="anonymous"
></script>
<script>
  Sentry.init({
    dsn: 'TU_SENTRY_DSN',
    environment: 'production',
    tracesSampleRate: 0.1,
  });
</script>
```

---

## 📞 SOPORTE Y CONTACTO

Si encuentras problemas durante la implementación:

1. Verificar logs del servidor: `sudo tail -f /var/log/nginx/error.log`
2. Validar HTML: `npm run validate:html`
3. Test Lighthouse: `npm run lighthouse`
4. Revisar Network tab en DevTools

---

**Documento preparado por:** Claude Code
**Última actualización:** Noviembre 2025
