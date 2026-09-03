#!/bin/bash
# Envoltorio de compatibilidad: el build real vive en package.json (Eleventy + csso + terser).
# Uso: ./build.sh  → genera _site/ listo para publicar.
set -e
cd "$(dirname "$0")"
[ -d node_modules ] || npm ci --no-audit --no-fund
npm run check
echo "✅ Sitio generado en _site/ (servir con: python3 -m http.server 8000 --directory _site)"
