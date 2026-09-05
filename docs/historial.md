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
5. **Paleta Tinta.** Base azul-negro (`#12151a`) en lugar del marrón; terracota y crema como lo único cálido. El sistema de superficie clara de lectura se probó y quedó dormido (`body.page-papel`).
6. **Eleventy.** Layout único para head, nav y footer; build en GitHub Actions; los minificados dejan de versionarse.
7. **Ritmo vertical único.** 160 px entre bloques y 120 en los bordes en escritorio; 80 y 64 en móvil. Medido con script en todas las páginas.
8. **Seguridad.** CSP sin `unsafe-inline`: sin estilos inline ni CSS crítico; la redirección lleva hash.

## Decisiones vigentes que no conviene rediscutir sin motivo

- Oscuro, no claro. Los socios lo eligieron con el prototipo de papel a la vista.
- Vos como registro. Medio estudio está en Madrid y se decidió igual.
- Dos familias tipográficas con rol fijo, dos pesos, un solo tamaño de cuerpo.
- Sin formulario, sin PWA, sin cookies.
- Cada cifra con fuente. Trace Group es una propuesta en curso y se dice así.

## Métricas que importan

Dos eventos en Plausible: `Contacto_mail` (conversación iniciada) y `Caso_leido_75` (un caso leído hasta el 75 %). El resto es contexto.

## Pendientes conocidos

- Archivos vectoriales de Olam Estudio y Manifiesto para la pared de logos.
- Un caso con IA real para que el servicio "Datos e IA" tenga con qué sostenerse.
- Extraer artículos y equipo a datos de Eleventy para que existan una sola vez.
