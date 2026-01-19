# Fuentes Inter

Las fuentes Inter se sirven desde Google Fonts CDN por compatibilidad.
Para self-hosting completo, descargar los archivos WOFF2 desde:
https://fonts.google.com/specimen/Inter

Archivos necesarios:
- inter-300.woff2 (Inter Light)
- inter-400.woff2 (Inter Regular)
- inter-500.woff2 (Inter Medium)
- inter-600.woff2 (Inter SemiBold)
- inter-700.woff2 (Inter Bold)

Los @font-face ya están configurados en el critical CSS inline.
Para usar fuentes locales, reemplazar las URLs de Google Fonts con:
url('/fonts/inter-XXX.woff2')
