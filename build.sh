#!/bin/bash
# build.sh - Script de build para BPP Analytics & Design
# Minifica CSS, JavaScript y prepara assets para producción

set -e

echo "🔧 BUILD SCRIPT - BPP Analytics & Design"
echo "========================================"
echo ""

# Verificar dependencias
check_dependency() {
    if ! command -v $1 &> /dev/null; then
        echo "⚠️  $1 no está instalado, instalando..."
        npm install -g $2
        echo "✅ $1 instalado"
    fi
}

echo "📦 Verificando dependencias..."
check_dependency "csso" "csso-cli"
check_dependency "terser" "terser"
echo ""

# Minificar CSS
echo "🎨 Minificando CSS..."
if [ -f "styles.css" ]; then
    csso styles.css --output styles.min.css --no-restructure
    size_before=$(stat -f%z "styles.css" 2>/dev/null || stat -c%s "styles.css")
    size_after=$(stat -f%z "styles.min.css" 2>/dev/null || stat -c%s "styles.min.css")
    reduction=$(( (size_before - size_after) * 100 / size_before ))
    echo "   styles.css: $(numfmt --to=iec-i --suffix=B $size_before) → $(numfmt --to=iec-i --suffix=B $size_after) (-$reduction%)"
else
    echo "   ⚠️  styles.css no encontrado"
fi
echo ""

# Minificar JavaScript principal
echo "📜 Minificando JavaScript..."
if [ -f "main.js" ]; then
    terser main.js \
        -o main.min.js \
        --compress passes=2,dead_code=true,drop_console=true \
        --mangle \
        --comments false
    size_before=$(stat -f%z "main.js" 2>/dev/null || stat -c%s "main.js")
    size_after=$(stat -f%z "main.min.js" 2>/dev/null || stat -c%s "main.min.js")
    reduction=$(( (size_before - size_after) * 100 / size_before ))
    echo "   main.js: $(numfmt --to=iec-i --suffix=B $size_before) → $(numfmt --to=iec-i --suffix=B $size_after) (-$reduction%)"
else
    echo "   ⚠️  main.js no encontrado"
fi

# Actualizar referencias en main.min.js
if [ -f "main.min.js" ]; then
    # Actualizar referencia al service worker
    sed -i.bak 's|/sw\.js|/sw.min.js|g' main.min.js
    rm -f main.min.js.bak
    echo "✅ Referencias actualizadas en main.min.js"
fi
echo ""

# Bump automático del Service Worker: CACHE_NAME derivado del contenido
# de los assets minificados. Si cambia CSS o JS, cambia el cache y el SW
# se reinstala solo — sin bump manual.
if [ -f "sw.js" ] && [ -f "styles.min.css" ] && [ -f "main.min.js" ]; then
    # md5sum (Linux) con fallback a md5 -q (macOS)
    HASH=$(cat styles.min.css main.min.js | { md5sum 2>/dev/null || md5 -q /dev/stdin; } | cut -c1-8)
    if [ -n "$HASH" ]; then
        sed -i.bak "s/bpp-v[0-9a-z]*/bpp-v${HASH}/" sw.js
        rm -f sw.js.bak
        echo "🔁 SW cache bump: CACHE_NAME → bpp-v${HASH}"
    else
        echo "⚠️  SW cache bump omitido: no se pudo calcular hash (md5sum/md5 no disponibles)"
    fi
fi

# Minificar Service Worker (SIEMPRE después del bump, para que
# sw.min.js herede el CACHE_NAME nuevo)
if [ -f "sw.js" ]; then
    terser sw.js \
        -o sw.min.js \
        --compress passes=2 \
        --mangle \
        --comments false
    size_before=$(stat -f%z "sw.js" 2>/dev/null || stat -c%s "sw.js")
    size_after=$(stat -f%z "sw.min.js" 2>/dev/null || stat -c%s "sw.min.js")
    reduction=$(( (size_before - size_after) * 100 / size_before ))
    echo "   sw.js: $(numfmt --to=iec-i --suffix=B $size_before) → $(numfmt --to=iec-i --suffix=B $size_after) (-$reduction%)"
else
    echo "   ⚠️  sw.js no encontrado"
fi
echo ""

# Generar hash de archivos para cache busting (opcional)
echo "🔐 Generando hashes (cache busting)..."
if command -v shasum &> /dev/null; then
    echo "   styles.min.css: $(shasum -a 256 styles.min.css | cut -d' ' -f1 | cut -c1-8)"
    echo "   main.min.js: $(shasum -a 256 main.min.js | cut -d' ' -f1 | cut -c1-8)"
    echo "   sw.min.js: $(shasum -a 256 sw.min.js | cut -d' ' -f1 | cut -c1-8)"
fi
echo ""

echo "✅ BUILD COMPLETADO"
echo "==================="
echo ""
echo "📋 Archivos generados:"
echo "   - styles.min.css"
echo "   - main.min.js"
echo "   - sw.js (CACHE_NAME actualizado) + sw.min.js"
echo ""
echo "🔄 Próximos pasos:"
echo "   1. Test local: python3 -m http.server 8000"
echo "   2. Commit (fuentes + minificados juntos) y push a main"
echo ""
