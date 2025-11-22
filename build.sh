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
    csso styles.css --output styles.min.css
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

# Minificar Service Worker
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

# Actualizar referencias en main.min.js
if [ -f "main.min.js" ]; then
    # Actualizar referencia al service worker
    sed -i.bak 's|/sw\.js|/sw.min.js|g' main.min.js
    rm -f main.min.js.bak
    echo "✅ Referencias actualizadas en main.min.js"
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
echo "   - sw.min.js"
echo ""
echo "🔄 Próximos pasos:"
echo "   1. Actualizar index.html para usar .min.css y .min.js"
echo "   2. Actualizar reporte-impacto.html"
echo "   3. Actualizar privacidad.html"
echo "   4. Test local: python3 -m http.server 8000"
echo "   5. Commit y deploy"
echo ""
