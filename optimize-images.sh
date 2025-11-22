#!/bin/bash
# optimize-images.sh - Script de optimización de imágenes para BPP
# Ejecutar desde la raíz del proyecto: ./optimize-images.sh

set -e  # Exit on error

echo "🖼️  OPTIMIZACIÓN DE IMÁGENES - BPP Analytics & Design"
echo "=================================================="
echo ""

# Verificar si sharp está instalado
if ! command -v sharp &> /dev/null; then
    echo "⚠️  sharp-cli no está instalado"
    echo "   Instalando sharp-cli..."
    npm install -g sharp-cli
    echo "✅ sharp-cli instalado"
    echo ""
fi

# Crear directorio temporal
mkdir -p img/optimized
echo "📁 Directorio img/optimized creado"
echo ""

# Función para optimizar y reportar
optimize_image() {
    local input=$1
    local output=$2
    local width=$3
    local quality=$4

    if [ -f "$input" ]; then
        local size_before=$(stat -f%z "$input" 2>/dev/null || stat -c%s "$input" 2>/dev/null)

        if [ -z "$width" ]; then
            sharp -i "$input" -o "$output" --webp "{quality:$quality,effort:6}"
        else
            sharp -i "$input" -o "$output" -w "$width" --webp "{quality:$quality,effort:6}"
        fi

        local size_after=$(stat -f%z "$output" 2>/dev/null || stat -c%s "$output" 2>/dev/null)
        local reduction=$(( (size_before - size_after) * 100 / size_before ))

        echo "   $(basename $input) → $(basename $output)"
        echo "   $(numfmt --to=iec-i --suffix=B $size_before) → $(numfmt --to=iec-i --suffix=B $size_after) (-$reduction%)"
    else
        echo "   ⚠️  $input no encontrado, saltando..."
    fi
}

# Optimizar fotos de socios (CRÍTICO - las más pesadas)
echo "👤 Optimizando fotos de socios..."
echo "--------------------------------"

# Nicolás (1.6MB original!)
optimize_image "img/NicolasOptima.png" "img/optimized/NicolasOptima.webp" "" 82
optimize_image "img/NicolasOptima.png" "img/optimized/Nicolas-480.webp" 480 80
optimize_image "img/NicolasOptima.png" "img/optimized/Nicolas-768.webp" 768 82

# Sergio (833KB original)
optimize_image "img/SergioOptima.png" "img/optimized/SergioOptima.webp" "" 82
optimize_image "img/SergioOptima.png" "img/optimized/Sergio-480.webp" 480 80
optimize_image "img/SergioOptima.png" "img/optimized/Sergio-768.webp" 768 82

# Ezequiel (169KB)
optimize_image "img/EzequielOptima.jpeg" "img/optimized/EzequielOptima.webp" "" 82
optimize_image "img/EzequielOptima.jpeg" "img/optimized/Ezequiel-480.webp" 480 80
optimize_image "img/EzequielOptima.jpeg" "img/optimized/Ezequiel-768.webp" 768 82

echo ""
echo "📸 Optimizando imágenes de actividades..."
echo "----------------------------------------"

# Jornada CESBA (1.7MB original!)
optimize_image "img/JornadaCESBA.jpg" "img/optimized/JornadaCESBA.webp" "" 80
optimize_image "img/JornadaCESBA.jpg" "img/optimized/JornadaCESBA-800.webp" 800 78
optimize_image "img/JornadaCESBA.jpg" "img/optimized/JornadaCESBA-480.webp" 480 75

# Natalidad
optimize_image "img/NatalidadOptima.png" "img/optimized/NatalidadOptima.webp" "" 82
optimize_image "img/NatalidadOptima.png" "img/optimized/Natalidad-800.webp" 800 80

echo ""
echo "📊 Optimizando gráficos del reporte..."
echo "-------------------------------------"

# Gráficos
optimize_image "img/CuadroMatriculaOptima.png" "img/optimized/CuadroMatriculaOptima.webp" "" 85
optimize_image "img/MapaMatriculaOptima.png" "img/optimized/MapaMatriculaOptima.webp" "" 85

echo ""
echo "🏷️  Optimizando logo..."
echo "----------------------"

# Logo (crítico para LCP)
optimize_image "img/logo.png" "img/optimized/logo.webp" "" 90
optimize_image "img/logo.png" "img/optimized/logo-480.webp" 480 88

echo ""
echo "✅ OPTIMIZACIÓN COMPLETADA"
echo "=========================="
echo ""
echo "📊 Resumen de ahorro:"

# Calcular tamaño total antes y después
total_before=0
total_after=0

for img in img/{NicolasOptima.png,SergioOptima.png,EzequielOptima.jpeg,JornadaCESBA.jpg,NatalidadOptima.png,CuadroMatriculaOptima.png,MapaMatriculaOptima.png,logo.png}; do
    if [ -f "$img" ]; then
        size=$(stat -f%z "$img" 2>/dev/null || stat -c%s "$img" 2>/dev/null)
        total_before=$((total_before + size))
    fi
done

for img in img/optimized/*.webp; do
    if [ -f "$img" ]; then
        size=$(stat -f%z "$img" 2>/dev/null || stat -c%s "$img" 2>/dev/null)
        total_after=$((total_after + size))
    fi
done

echo "   Antes:  $(numfmt --to=iec-i --suffix=B $total_before)"
echo "   Después: $(numfmt --to=iec-i --suffix=B $total_after)"
echo "   Ahorro: $((( total_before - total_after ) * 100 / total_before))%"
echo ""
echo "🔄 Próximos pasos:"
echo "   1. Revisar imágenes en img/optimized/"
echo "   2. Mover a img/: mv img/optimized/* img/"
echo "   3. Actualizar HTML con las nuevas referencias"
echo "   4. Commit y deploy"
echo ""
