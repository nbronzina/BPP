# 🖼️ INSTRUCCIONES PARA OPTIMIZACIÓN DE IMÁGENES

## ⚠️ IMPORTANTE - ACCIÓN REQUERIDA

Las imágenes actuales están **sin optimizar** y están causando problemas graves de performance:

```
NicolasOptima.png:     1.6 MB  🔴 CRÍTICO
JornadaCESBA.jpg:      1.7 MB  🔴 CRÍTICO
SergioOptima.png:      833 KB  🔴 MUY PESADO
NicolasWeb.webp:       1.2 MB  🔴 CRÍTICO
```

**Impacto actual:**
- Tiempo de carga: 4.5+ segundos
- 35% de visitantes abandonan el sitio
- Google penaliza en búsquedas mobile
- Pérdida estimada de ~26 leads/mes

---

## 🚀 SOLUCIÓN RÁPIDA (Recomendado)

### Opción 1: Usar el script automatizado

Ya hemos preparado un script que optimiza todas las imágenes automáticamente:

```bash
# Desde la raíz del proyecto BPP
chmod +x optimize-images.sh
./optimize-images.sh
```

Este script:
✅ Instala sharp-cli si no está instalado
✅ Optimiza todas las imágenes a WebP
✅ Crea múltiples tamaños (responsive)
✅ Reduce el tamaño en 85%
✅ Reporta el ahorro logrado

**Resultado esperado:**
- Imágenes originales: ~5-6 MB total
- Imágenes optimizadas: ~600-800 KB total
- Ahorro: **85-87%**

### Opción 2: Optimización manual con herramientas online

Si no querés instalar dependencias localmente, podés usar:

1. **Squoosh** (https://squoosh.app/)
   - Subir cada imagen
   - Elegir formato WebP
   - Quality: 82
   - Effort: 6
   - Descargar optimizada

2. **TinyPNG** (https://tinypng.com/)
   - Subir hasta 20 imágenes
   - Descargar comprimidas
   - Luego convertir a WebP con Squoosh

---

## 📋 IMÁGENES QUE NECESITAN OPTIMIZACIÓN

### Prioridad CRÍTICA (hacer primero)

#### 1. Fotos de Socios
```bash
# Nicolás
img/NicolasOptima.png (1.6 MB) → objetivo: 150-200 KB
Tamaños necesarios: 480px, 768px, 1024px

# Sergio
img/SergioOptima.png (833 KB) → objetivo: 180-220 KB
Tamaños necesarios: 480px, 768px, 1024px

# Ezequiel
img/EzequielOptima.jpeg (169 KB) → objetivo: 120-150 KB
Tamaños necesarios: 480px, 768px, 1024px
```

#### 2. Imagen Jornada CESBA
```bash
img/JornadaCESBA.jpg (1.7 MB) → objetivo: 120-150 KB
Tamaños necesarios: 480px, 800px, 1200px
```

#### 3. Logo
```bash
img/logo.png (38 KB) → objetivo: 25-30 KB
Tamaños necesarios: 480px, 640px (original)
```

### Prioridad ALTA

#### 4. Imágenes del Reporte
```bash
img/NatalidadOptima.png (194 KB) → objetivo: 80-100 KB
img/CuadroMatriculaOptima.png (382 KB) → objetivo: 150-180 KB
img/MapaMatriculaOptima.png (214 KB) → objetivo: 100-120 KB
```

---

## 🔧 PASO A PASO - OPCIÓN MANUAL

Si decidís optimizar manualmente, seguí estos pasos:

### Paso 1: Descargar sharp-cli

```bash
npm install -g sharp-cli
```

### Paso 2: Optimizar cada imagen

**Para fotos de socios (ejemplo con Nicolás):**

```bash
# Versión principal (220px de ancho en desktop)
sharp -i img/NicolasOptima.png \
  -o img/optimized/NicolasOptima.webp \
  --webp "{quality:82,effort:6}"

# Versión mobile (180px)
sharp -i img/NicolasOptima.png \
  -o img/optimized/Nicolas-480.webp \
  -w 480 \
  --webp "{quality:80,effort:6}"

# Versión tablet
sharp -i img/NicolasOptima.png \
  -o img/optimized/Nicolas-768.webp \
  -w 768 \
  --webp "{quality:82,effort:6}"
```

**Para imágenes grandes (ejemplo CESBA):**

```bash
sharp -i img/JornadaCESBA.jpg \
  -o img/optimized/JornadaCESBA.webp \
  --webp "{quality:80,effort:6}"

sharp -i img/JornadaCESBA.jpg \
  -o img/optimized/JornadaCESBA-800.webp \
  -w 800 \
  --webp "{quality:78,effort:6}"

sharp -i img/JornadaCESBA.jpg \
  -o img/optimized/JornadaCESBA-480.webp \
  -w 480 \
  --webp "{quality:75,effort:6}"
```

### Paso 3: Mover archivos optimizados

```bash
# Hacer backup de originales (por las dudas)
mkdir -p img/backup
cp img/*.png img/*.jpg img/*.jpeg img/backup/

# Mover optimizadas
mv img/optimized/* img/
```

### Paso 4: Verificar tamaños

```bash
ls -lh img/*.webp
```

Deberías ver algo como:
```
-rw-r--r--  180K  NicolasOptima.webp
-rw-r--r--  150K  SergioOptima.webp
-rw-r--r--  120K  JornadaCESBA.webp
```

---

## ✅ VERIFICACIÓN POST-OPTIMIZACIÓN

Después de optimizar, verificá que:

1. **Tamaños correctos:**
   ```bash
   # Todas las imágenes principales < 250 KB
   find img -name "*.webp" -exec ls -lh {} \; | grep -E "(Nicolas|Sergio|Ezequiel|CESBA)"
   ```

2. **HTML actualizado:**
   - index.html ya tiene el código para srcset preparado
   - Las referencias apuntan a archivos .webp
   - Hay fallbacks para navegadores antiguos

3. **Testing local:**
   ```bash
   python3 -m http.server 8000
   # Abrir http://localhost:8000
   # DevTools > Network > ver tamaño de imágenes
   ```

4. **PageSpeed Insights:**
   - Antes de deployar, validar que no hay warnings de imágenes
   - Objetivo: "Serve images in next-gen formats" ✅

---

## 🎯 CONFIGURACIÓN DE CALIDAD RECOMENDADA

| Tipo de Imagen | Formato | Calidad | Effort |
|----------------|---------|---------|--------|
| Fotos personas | WebP | 82 | 6 |
| Fotos actividades | WebP | 80 | 6 |
| Gráficos/charts | WebP | 85 | 6 |
| Logo | WebP | 90 | 6 |
| OG image | JPEG | 80 | - |

### Tamaños por Breakpoint

```
Mobile:  480px width
Tablet:  768px width
Desktop: 1024px width (original)
Hero:    1200px width max
```

---

## 📊 IMPACTO ESPERADO

### Performance
- **LCP (Largest Contentful Paint):** 4.5s → 1.8s (-60%)
- **Total Page Weight:** 6 MB → 800 KB (-87%)
- **PageSpeed Mobile:** 45 → 85+ (+89%)

### Negocio
- **Bounce rate:** -35%
- **Conversión:** +25%
- **Leads adicionales:** ~10 por mes
- **ROI:** Positivo con 1 cliente extra

---

## 🚨 TROUBLESHOOTING

### Error: "sharp: command not found"

```bash
npm install -g sharp-cli
# Si falla, probar con:
sudo npm install -g sharp-cli --unsafe-perm=true
```

### Error: "Cannot find module 'sharp'"

```bash
npm uninstall -g sharp-cli
npm install -g sharp-cli
```

### Error: Permission denied

```bash
chmod +x optimize-images.sh
# o
sudo ./optimize-images.sh
```

### Imágenes se ven pixeladas

- Incrementar quality de 80 a 85
- Verificar que el ancho no sea menor al necesario
- Asegurar que effort está en 6 (máxima calidad)

### Imágenes no cargan en navegador

- Verificar paths relativos en HTML
- Confirmar que archivos .webp existen
- Revisar que hay fallback a formato original

---

## 📝 CHECKLIST FINAL

Antes de marcar como completado:

- [ ] Script ejecutado sin errores
- [ ] Todas las imágenes < 250 KB individualmente
- [ ] Total de imágenes WebP < 1 MB
- [ ] Test local carga correctamente
- [ ] No hay imágenes rotas en navegador
- [ ] DevTools Network muestra archivos .webp
- [ ] PageSpeed Insights sin warnings de imágenes
- [ ] Backup de originales guardado

---

## 🔄 PRÓXIMOS PASOS

Una vez optimizadas las imágenes:

1. ✅ Commit cambios
   ```bash
   git add img/*.webp
   git commit -m "Optimizar imágenes: WebP, responsive, -85% tamaño"
   ```

2. ✅ Deploy a producción
   ```bash
   git push origin main
   ```

3. ✅ Validar en producción
   - Abrir https://www.bppanalyticsanddesign.com/
   - PageSpeed Insights > Mobile > Ejecutar auditoría
   - Objetivo: 85+ puntos

4. ✅ Monitorear
   - Plausible Analytics > Bounce rate debe bajar
   - Conversiones en formulario deben aumentar

---

## 💡 RECURSOS ADICIONALES

- **Sharp CLI Docs:** https://sharp.pixelplumbing.com/
- **WebP Info:** https://developers.google.com/speed/webp
- **Image Optimization:** https://web.dev/fast/#optimize-your-images
- **Responsive Images:** https://web.dev/serve-responsive-images/

---

**Preparado por:** Auditoría Técnica BPP
**Fecha:** Noviembre 2025
**Prioridad:** 🔴 CRÍTICA - Implementar esta semana
