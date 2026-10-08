# Historial del sitio

Un solo documento en lugar de las auditorías, benchmarks y reportes de optimización que se acumularon entre junio y septiembre de 2026. Los originales siguen en el historial de git (fueron eliminados en el commit que creó este archivo); acá queda lo que sirve para tomar decisiones hoy.

## Junio 2026: auditoría y optimización

- Auditoría técnica completa (semántica, accesibilidad WCAG 2.1 AA, Core Web Vitals, seguridad). El sitio ya era HTML plano con CSS y JS a mano.
- Imágenes convertidas a WebP con srcset: el peso bajó de 5,1 MB a unos 800 KB.
- Benchmarking de agencias de diseño estratégico y prospectiva (dos versiones): sirvió para fijar la dirección "editorial oscuro con acento cálido" y descartar las estéticas genéricas.
- Se probaron y después se retiraron: quiz de diagnóstico, PWA con service worker, formulario de contacto con servicio externo.

## Agosto 2026: auditoría integral y referentes

- Auditoría con ojos frescos de copy, UX writing y guías de interfaz.
- Nace La Usina (investigación propia) con su primera tesis, y el radar de señales con fuente y año.
- Feedback de los socios que fijó dos reglas duraderas: tipografía más grande (cuerpo 19 px) y solo dos pesos (400 y 700).

## Septiembre 2026: rediseño por capas

Aplicado de lo micro a lo macro, cada capa verificada en navegador antes de la siguiente.

1. **Contraste y fuentes.** Jerarquía de texto con ratios verificados; fuentes self-hosted. Después, Literata para la prosa de lectura larga.
2. **Cortar.** Fuera quiz, PWA y formulario. Contacto por mail con una promesa: respuesta en 48 horas hábiles.
3. **Casos verificables.** Ficha de cuatro respuestas más fuentes en cada proyecto. Lo que no tiene fuente no se publica; la ficción se marca como tal.
4. **Un solo lugar para lo que pensamos.** Pensamiento reúne señales, artículos y tesis; `/usina/` redirige.
5. **Paleta Tinta.** Base azul-negro (`#12151a`) en lugar del marrón; terracota y crema como lo único cálido. El sistema de superficie clara de lectura se probó, quedó dormido y el 2026-09-06 se retiró del CSS (sigue en git, `body.page-papel`).
6. **Eleventy.** Layout único para head, nav y footer; build en GitHub Actions; los minificados dejan de versionarse.
7. **Ritmo vertical único.** 160 px entre bloques y 120 en los bordes en escritorio; 80 y 64 en móvil. Medido con script en todas las páginas.
8. **Seguridad.** CSP sin `unsafe-inline`: sin estilos inline ni CSS crítico; la redirección lleva hash.
9. **Auditoría externa en tres fases (6 de septiembre).** Fase 0 reportó, Fase 1 cortó, Fase 2 midió: CSS purgado un 26 % con css-tree y verificado por estilos computados; breakpoints consolidados en cuatro valores; Casos separados de Docencia; privacidad reescrita sobre lo que el sitio hace de verdad; página 404 propia. El informe de mediciones (`docs/auditoria-fase2.md`) se retiró el 7 de septiembre una vez aplicadas todas sus decisiones; sigue en git.
10. **Imágenes en serie (7 de septiembre).** Las fotos de Trace Group se regeneraron como una sola serie (un lugar, una luz, un sujeto por foto) y volvieron al color: son imágenes del escenario, no de archivo. Las ilustraciones de Pensamiento pasaron al isotipo hueco y a 1600 px de ancho.

## Octubre 2026: publicación por Vercel y limpieza del repo

> **Formulación original (septiembre, punto 6):** "Eleventy. Layout único para head, nav y footer; build en GitHub Actions; los minificados dejan de versionarse."

- **Qué cambió.** El dominio apunta a Vercel, que construye y publica al mergear en la rama por defecto y arma un preview por cada otra rama. GitHub Pages quedó despublicado y se borraron `deploy.yml` y `CNAME` (8 de octubre). GitHub igual intenta construir el sitio en cada push hasta que en Settings, Pages, la rama quede en None.
- **Qué se perdió.** `deploy.yml` era lo único que corría `scripts/check-site.mjs` solo. Vercel corre el build, no el chequeo: `npm run check` se corre a mano antes de mergear. Un cambio que construye pero rompe un enlace sale publicado.
- **Qué se ganó a cambio.** El chequeo dejó de mirar una lista de páginas escrita a mano y recorre `_site/`: enlaces y anclas internas, `alt` y medidas de cada imagen, ids repetidos, un solo `h1`, canonical, JSON-LD y la coincidencia entre sitemap y páginas indexables.
- **Limpieza sin cambios a la vista.** `styles.css` sin las declaraciones que otra regla del mismo selector pisaba (125,6 → 114,1 KB de fuente; 68,4 → 63,0 KB minificado); `main.js` sin los `keydown` duplicados de los botones; la navegación de los casos en un parcial; el sitemap generado desde el front matter. Verificado contra el build anterior por estilos computados de las nueve páginas en catorce anchos, estados forzados de hover y foco, capturas y una traza de comportamiento.
- **Pared de logos.** Entra Speculative Futures Madrid, primero; sale Manifiesto Bar.
- **Lo que quedó para decidir** está en `docs/auditoria-octubre.md`, con lo medido para cada punto. Se retira cuando estén todas las decisiones tomadas.
- **Decisiones del 8 de octubre (puntos 1 a 5 de la auditoría).**
  - Privacidad: decía que el sitio lo aloja GitHub; ahora dice Vercel y qué registra.
  - `Contacto_mail` deja de contar el "compartir por email" de los casos y los mails de Privacidad y de la 404.
  - Teclado y AA. Formulación original en DESIGN.md: "La navbar superior es elemento fijo del sistema y **no se toca**". Cambió solo lo que pasa con el foco del teclado y sin JavaScript; con mouse o dedo el nav se ve igual. También: el enlace de salto mueve el foco, 25 `aria-label` empiezan por el texto visible, los enlaces legales van subrayados y las etiquetas de categoría pasan a fondo Tinta (3,89:1 → 4,93:1). Se perdió el tinte terracota de esas etiquetas.
  - Fundido de página. Formulación original, en el CSS de noviembre de 2025: "Fade-in animation only if motion is allowed". Se retiró porque Chromium no registraba la primera pintura (Lighthouse cortaba el inicio con `NO_FCP`) y el texto llegaba a la mitad de opacidad a los 0,4 s en cada página. Se perdió el gesto de entrada.
  - Literata. Formulación original en DESIGN.md: "variable en peso 400..700 y tamaño óptico 7..72, con `font-optical-sizing: auto`". Pasó a tamaño óptico fijo en 19: 98 KB menos en Gabinete y la tesis. Se perdió el ajuste óptico en otros tamaños; no es idéntico al píxel (en 29 de 644 combinaciones de página y ancho un párrafo corta una línea una palabra antes o después).

- **Decisiones de interfaz del 8 de octubre ("Hacer todo", sobre nueve propuestas).**
  - "Hablemos" a la vista en todas las páginas. Formulación original en DESIGN.md: "La navbar superior es elemento fijo del sistema y **no se toca**". Segunda excepción validada: fuera del inicio, "Hablemos" era un ítem más del menú y en el teléfono quedaba adentro del desplegable. Ahora va afuera, en acento, y la página actual se marca con subrayado.
  - El cierre abre el mail. Antes, "Escribinos →" llevaba a `/#contact`: otra página y otro clic antes del mail. Ahora abre el mail con el asunto de cada página, y debajo están la dirección y "Copiar dirección" (en una Mac, un enlace de mail abre Apple Mail aunque la persona use Gmail).
  - "Seguí leyendo" al final de los casos y la tesis. Reemplaza las filas "Relacionado" de los créditos, que estaban en mayúsculas y solo en dos de los cuatro textos.
  - Cuatro movimientos enlaza los dos casos que nombra.
  - Un solo eje izquierdo en los heros: la bajada iba centrada bajo un título alineado a la izquierda (168 px corrida en Lo hecho, Pensamiento y la tesis; 104 en los casos).
  - La ficha de Créditos igual a la del hero: sus valores salían en Literata de 19 px y en mayúsculas.
  - Índice de los casos desde 1280. Formulación original, en el CSS: "Índice pegajoso solo desde 1536px: a 1440 su columna de 280px pisa el texto de 70ch". Ahora el caso le deja lugar, así que el texto de 1280 a 1695 px queda más angosto (800 px a 1280 en lugar de 1008). Se perdió ese ancho; aun en 1536 el índice pisaba 48 px de dos casos. Debajo de 1280, el botón dice "Índice" y se esconde mientras se baja leyendo.
  - Numeración solo donde hay secuencia: queda el 01 a 04 de los cuatro movimientos y sale del índice de Pensamiento y de las situaciones de Conversemos.
  - Bajada de Lo hecho. Formulación original: "Trabajamos con líderes que enfrentan decisiones críticas. Cada proyecto es una pregunta difícil que necesitaba respuesta antes de que fuera tarde. Investigación, diseño de futuros, análisis estratégico y comunicación aplicados donde más importa." Ahora nombra los tres casos.
  - El hero del inicio sigue a pantalla completa, como se decidió el 6 de septiembre.
- **Plausible, fuera (8 de octubre).** Formulación original en CLAUDE.md: "Analytics: Plausible.io for privacy-friendly tracking"; en este archivo: "Dos eventos en Plausible: `Contacto_mail` (conversación iniciada) y `Caso_leido_75` (un caso leído hasta el 75 %). El resto es contexto." Decisión: "Eliminar, sacar, plausible". Salieron el script, `plausible.io` de la CSP y todo el código de `main.js` que solo existía para medir; la política de privacidad dice ahora que el sitio no mide visitas. Qué se perdió: cualquier número sobre visitas, de dónde llegan y qué se lee, y con eso el dato que pedía el punto 10 de la auditoría para revisar el hero del inicio.

## Decisiones vigentes que no conviene rediscutir sin motivo

- Oscuro, no claro. Los socios lo eligieron con el prototipo de papel a la vista.
- Vos como registro. Medio estudio está en Madrid y se decidió igual.
- Dos familias tipográficas con rol fijo, dos pesos, un solo tamaño de cuerpo.
- Sin animaciones de entrada: ni al scroll ni al cargar la página. La única es la del título del inicio.
- Sin formulario, sin PWA, sin cookies, sin medición de visitas.
- Cada cifra con fuente. Trace Group es una provocación (un caso construido antes de que exista el encargo, escrito como pregunta "¿Y si…?") y se dice así, nunca "propuesta", "pitch" ni "piloto". Ver "Vocabulario propio" en VOICE.md.

## Métricas

Ninguna desde el 8 de octubre de 2026: el sitio no mide visitas. Las conversaciones se cuentan en la casilla de correo, y el asunto de cada cierre dice desde qué página escribió la persona.

## Pendientes conocidos

- Archivo vectorial de Olam Estudio para la pared de logos.
- Un caso con IA real para que el servicio "Datos e IA" tenga con qué sostenerse.
- Extraer artículos y equipo a datos de Eleventy para que existan una sola vez.
- Que Vercel corra `npm run check` en cada deploy, para recuperar el chequeo automático.
