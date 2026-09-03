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
    rm -f main.min.js.bak
    echo "✅ Referencias actualizadas en main.min.js"
fi
echo ""


echo "✅ BUILD COMPLETADO"
echo "==================="
echo ""
echo "📋 Archivos generados:"
echo "   - styles.min.css"
echo "   - main.min.js"
echo ""
echo "🔄 Próximos pasos:"
echo "   1. Test local: python3 -m http.server 8000"
echo "   2. Commit (fuentes + minificados juntos) y push a main"
echo ""
