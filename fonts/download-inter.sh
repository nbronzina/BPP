#!/bin/bash
# Script para descargar fuentes Inter WOFF2 desde Google Fonts

# URLs conocidas de Inter WOFF2 (estas URLs son estables)
declare -A fonts=(
  ["inter-300.woff2"]="https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2"
  ["inter-400.woff2"]="https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyf.woff2"
  ["inter-500.woff2"]="https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fAZ9hiA.woff2"
  ["inter-600.woff2"]="https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZ9hiA.woff2"
  ["inter-700.woff2"]="https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYAZ9hiA.woff2"
)

cd /home/user/BPP/fonts
for file in "${!fonts[@]}"; do
  echo "Descargando $file..."
  curl -s -L "${fonts[$file]}" -o "$file" --retry 3
  if [ -f "$file" ]; then
    size=$(ls -lh "$file" | awk '{print $5}')
    echo "✓ $file ($size)"
  fi
done

echo "Fuentes descargadas completamente"
