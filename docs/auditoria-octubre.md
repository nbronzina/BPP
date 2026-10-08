# Auditoría de octubre: qué falta decidir

Fecha: 8 de octubre de 2026. Medido sobre el build de esta rama, que a la vista es idéntico a producción (`99f266f`): estilos computados de nueve páginas en catorce anchos, estados de hover y foco, capturas y una traza de comportamiento, sin una sola diferencia. Lo que se podía optimizar sin cambiar lo que se ve ni lo que se dice ya está hecho en el mismo PR que trae este archivo. Lo que queda cambia algo visible, algo que se dice o algo que se mide, así que cada punto termina en una decisión de Nicolás.

Cómo se midió: Chromium 141 sin interfaz (el motor de Chrome y Edge), Lighthouse 12.8 y axe-core 4.14, con el sitio servido en local con compresión y caché como las sirve Vercel. "4G lenta" es la de Lighthouse: 150 ms de latencia, 1,6 Mbps y la CPU cuatro veces más lenta. No se pudo medir: producción (PageSpeed respondió 429 desde este entorno), los previews de Vercel (piden login) y Safari. KB son 1000 bytes.

Cuando todas las decisiones estén tomadas, este archivo se retira como se retiró `auditoria-fase2.md`: queda en git.

**Estado al 8 de octubre:** los puntos 1 a 5 están resueltos y aplicados ("Cambiar 1, corregir 2, arreglar 3, eliminar 4, fijar 5"). El 10 se descartó el mismo día, cuando se sacó Plausible ("Eliminar, sacar, plausible"): el sitio ya no mide visitas. Los textos del 6 se aplicaron con la pasada de copy; del 6 quedan las imágenes y una decisión. Quedan abiertos 7 a 9 y 11.

## Orden sugerido

| # | Qué | Por qué en este lugar | Costo | Estado |
|---|---|---|---|---|
| 1 | Privacidad dice que el sitio lo aloja GitHub | Era lo único publicado que era falso | Un párrafo | Aplicado |
| 2 | `Contacto_mail` cuenta cosas que no son conversaciones | Infla la métrica que más importa | Una línea de JS | Aplicado |
| 3 | Teclado y accesibilidad | El enlace de salto no salta; CLAUDE.md promete WCAG 2.1 AA | Unas 30 líneas | Aplicado |
| 4 | El fundido de página | Las herramientas de auditoría no ven el inicio | Una regla de CSS | Aplicado |
| 5 | Literata más liviana | Hasta 98 KB menos en las páginas de lectura | Dos archivos de fuente | Aplicado |
| 6 | Lo que se ve al compartir y lo que leen los buscadores | El inicio se comparte con el copy anterior | Textos e imágenes | Textos aplicados; quedan imágenes |
| 7 | Las tarjetas, en un solo lugar | Ya no coinciden entre el inicio y los listados | Medio día | Abierto |
| 8 | Que Vercel corra el chequeo | Se perdió al salir de GitHub Actions | Un archivo | Abierto |
| 9 | Contenido propio en el dominio | Doce de doce textos y clases enlazan afuera | Trabajo editorial | Abierto |
| 10 | Tres números de Plausible | Antes de tocar la primera pantalla del inicio | Mirar el panel | Descartado: sin Plausible |
| 11 | Menores | | | Abierto |
| 12 | Medido y descartado | | | |

## 1. La política de privacidad dice que el sitio lo aloja GitHub

Texto publicado hoy, sección 4:

> **GitHub**, que aloja el sitio (GitHub Pages). Como cualquier servidor web, puede registrar la dirección IP de cada visita según su propia política de privacidad. Nosotros no accedemos a esos registros.

Desde la mudanza de octubre el sitio lo sirve Vercel, una empresa de Estados Unidos. GitHub ya no recibe visitas. La última oración también hay que revisarla: conviene confirmar en el panel de Vercel si se ven registros de las peticiones. Si se ven, "no accedemos" pasa a ser una práctica de ustedes y no algo que el sitio impida.

Redacción posible. Corrige el hecho; el texto final es de ustedes, idealmente con la mirada de alguien que sepa de protección de datos:

> **Vercel**, que aloja el sitio. Como cualquier servidor web, registra la dirección IP y el navegador de cada visita para servir las páginas y protegerlas de abusos, según su propia política de privacidad, y puede tratar esos datos fuera del Espacio Económico Europeo. No usamos esos registros para identificar a nadie.

Con el cambio hay que mover tres fechas: "Última actualización" en la página, `dateModified` en `src/_includes/jsonld/privacidad.njk` y `sitemap.lastmod` en el front matter.

Resuelto el 8 de octubre: se publicó la redacción de arriba, con las tres fechas movidas.

## 2. `Contacto_mail` cuenta cosas que no son conversaciones

`main.js` cuenta como conversación iniciada cualquier clic en un enlace `mailto:`. La traza de comportamiento lo muestra:

| Clic | Eventos que salen |
|---|---|
| Mail del bloque de contacto del inicio | `Contacto_mail {ubicacion: contact}` |
| Mail del footer | `Contacto_mail {ubicacion: footer}` |
| "Compartir por email" en cualquiera de los tres casos | `Compartir_reporte {plataforma: email}` **y** `Contacto_mail {ubicacion: desconocida}` |
| Dirección de datos personales en Privacidad | `Contacto_mail {ubicacion: desconocida}` |

El botón de compartir es un `mailto:?subject=…` sin destinatario: quien comparte un caso suma una "conversación". Para mirar hacia atrás, en Plausible alcanza con excluir `ubicacion = desconocida`.

Arreglo: contar solo los `mailto:` a la dirección del estudio y dejar afuera el de Privacidad (`.legal-link`). La serie cambia desde el día del arreglo.

Resuelto el 8 de octubre: ya no cuentan los `mailto:?` sin destinatario ni los `.legal-link`. La traza de comportamiento pasa de 111 a 107 eventos; los cuatro que se fueron son exactamente esos clics.

## 3. Teclado y accesibilidad

Probado con teclado simulado en Chromium, a 1440 y a 390 px:

- **El enlace de salto no salta, en todas las páginas.** Enter sobre "Saltar al contenido principal" deja el foco en el mismo enlace; el Tab siguiente va al logo del nav. El manejador de anclas de `main.js` cancela el salto nativo y desplaza la página sin mover el foco. Arreglo: después de desplazar, poner el foco en el destino.
- **Foco invisible en el inicio.** Arriba de todo, los Tab 2 a 5 caen en el logo, Lo hecho, Pensamiento y Hablemos con opacidad 0: el nav está escondido hasta que se scrollea. Arreglo: `nav:focus-within` lo muestra mientras tiene el foco. Con mouse o dedo no cambia nada.
- **Foco invisible en el menú móvil cerrado (≤ 768 px), en todas las páginas.** Tres Tab recorren los enlaces del menú, que está fuera de pantalla y con opacidad 0. Arreglo: `visibility: hidden` mientras está cerrado, con la misma animación de 0,3 s.
- **Sin JavaScript, el nav del inicio no aparece nunca.** CLAUDE.md dice que el sitio funciona sin JS. Arreglo: `@media (scripting: none)`.

DESIGN.md, Layout: "La navbar superior es elemento fijo del sistema y **no se toca**. Cualquier tarea que implique rediseño de navegación requiere validación explícita antes de ejecutar." Los tres arreglos que tocan el nav no lo rediseñan: cambian solo lo que pasa con el foco del teclado o sin JS. Igual lo tocan, así que piden el sí explícito. El del enlace de salto es solo JS.

Además, axe-core (todas sus reglas, WCAG 2.1 A y AA) encuentra tres fallos:

| Criterio | Dónde | Qué pasa | Arreglo |
|---|---|---|---|
| 2.5.3 Etiqueta en el nombre (A) | 25 enlaces: los "Leer más" y "Ver proyecto" de las tarjetas, "Ver pensamiento" y "Ver lo hecho" del inicio, y el CTA de cierre de Lo hecho, Pensamiento y la tesis | El `aria-label` no contiene el texto visible: quien navega por voz dice "Leer más" y no pasa nada. `cierre.njk` fija `aria-label="Escribinos"` aunque el enlace diga "Hablemos" | `aria-label` que empiece por el texto visible; en el cierre, sacarlo |
| 1.4.1 Uso del color (A) | 8 enlaces `.legal-link` en Privacidad y en la 404 | Sin subrayado, y contra el texto vecino 2,66:1 (pide 3:1) | Subrayarlos. Hoy lo impiden `.legal-page a` y `.legal-link`, las dos con `text-decoration: none` y más específicas que la regla que subraya los enlaces de la prosa (`main p a`) |
| 1.4.3 Contraste (AA) | Las tres etiquetas `.actividad-category-badge` del inicio | 3,89:1 a 15 px (pide 4,5:1) | Fondo más oscuro o sin fondo. Es color: se decide a ojo |

Resuelto el 8 de octubre: aplicados todos. Con teclado simulado, el enlace de salto deja el foco en el contenido en siete páginas y dos anchos, ningún Tab cae en algo invisible y el menú cerrado no recibe foco; la misma prueba contra producción falla 22 veces. axe-core: 0 fallos en las nueve páginas, en móvil y escritorio. Las etiquetas pasaron a fondo Tinta.

## 4. El fundido de página

```css
@media (prefers-reduced-motion: no-preference) {
    body { animation: fadeIn 0.6s ease-in; }   /* de opacidad 0 a 1 */
}
```

Entró en noviembre de 2025 (commit "Update styles.css"). Las apariciones al scroll se retiraron el 5 de septiembre; esta quedó. DESIGN.md no la menciona.

Chromium no cuenta como pintado el contenido que aparece con opacidad 0. Lo medido: el primer pintado ocurre, pero el FCP llega recién cuando se pinta otra cosa (una imagen que termina de cargar), o no llega. Mediana de cinco cargas en frío, 4G lenta, 412 px:

| Página | Primer pintado | FCP hoy | LCP hoy | FCP y LCP sin fundido |
|---|---|---|---|---|
| `/` | 840 ms | no se registra (0 de 5) | no se registra | 828 ms |
| `/proyectos/` | 736 ms | 1076 ms | 1076 ms | 716 ms |
| `/pensamiento/` | 724 ms | no se registra | no se registra | 712 ms |
| Trace Group | 880 ms | 1096 ms | 1176 ms | 912 ms |
| Gabinete Extemporáneo | 892 ms | 1104 ms | 1932 ms | 904 ms |
| Natalidad | 1028 ms | 1552 ms | no se registra | 968 ms |
| Tesis 01 | 836 ms | 1044 ms | 1360 ms | 844 ms |
| Privacidad | 696 ms | no se registra | no se registra | 684 ms |

Lighthouse no puede puntuar el inicio: corta con `NO_FCP` ("The page did not paint any content"). Es el mismo motor que usa PageSpeed Insights, así que cualquiera que audite el sitio con esa herramienta ve un error en vez de un número.

Sin el fundido, Lighthouse móvil da rendimiento 100 en el inicio, Lo hecho, Pensamiento y Privacidad (LCP 1,4 a 1,5 s) y 96 a 98 en las páginas de lectura (LCP 2,4 a 2,8 s), con TBT 0 y CLS 0 en todas. En escritorio (inicio y Lo hecho), 100.

Lo que ve quien entra: con `ease-in`, durante los primeros 0,2 s el texto está por debajo del 20 % de opacidad y llega a la mitad recién a los 0,4 s. Pasa en cada navegación entre páginas, no solo en la primera.

Lo que se pierde si se saca: el gesto de entrada. El fundido del título del inicio (`textReveal`) puede quedarse: no afecta la medición. Un fundido que arranca en 0,01 en lugar de 0 también se probó: Chromium tampoco lo registra.

No está verificado en producción ni en un teléfono real. La comprobación lleva medio minuto: pagespeed.web.dev con la dirección del inicio. Si devuelve el error de "no pintó contenido", es esto.

Resuelto el 8 de octubre: se sacó. Lighthouse móvil del inicio: rendimiento 100, FCP 1,0 s, LCP 1,5 s.

## 5. Literata más liviana

Literata se usa en un solo tamaño, 19 px, con pesos 400 y 700 y su itálica (medido sobre cada nodo de texto de las nueve páginas, en tres anchos). Los archivos traen el eje de tamaño óptico completo (7 a 72) y pesos hasta 900. Fijando el tamaño óptico en 19, que es el valor que el navegador aplica a 19 px (verificado: mismo ancho de línea que en modo automático), y el peso entre 400 y 700:

| Archivo | Hoy | Recortado |
|---|---|---|
| `literata-latin.woff2` | 85,7 KB | 37,4 KB |
| `literata-latin-italic.woff2` | 88,8 KB | 38,7 KB |

| Página (primera visita, móvil) | Transferido hoy | Recortado | LCP Lighthouse hoy | Recortado |
|---|---|---|---|---|
| Trace Group | 232 KB | 184 KB | 2,4 s | 2,0 s |
| Gabinete Extemporáneo | 360 KB | 261 KB | 2,8 s | 2,4 s |
| Natalidad | 308 KB | 260 KB | 2,7 s | 2,6 s |
| Tesis 01 | 290 KB | 191 KB | 2,4 s | 1,9 s |

Gabinete y la tesis bajan la itálica completa (88,8 KB) para un puñado de palabras: en Gabinete, "Learn" y "Uninvited Guests"; en la tesis, dos frases del resumen y el título dentro de la cita sugerida.

No es idéntico al píxel. Los avances de cada letra quedan redondeados a la unidad: una línea de 1127 px se mueve entre −0,17 y +1,22 px (la itálica es la que más se mueve). En 161 anchos por cuatro páginas (644 combinaciones, 52.256 bloques de texto), 29 combinaciones tienen un párrafo que corta una línea una palabra antes o después. En Safari no se pudo verificar: si Safari aplicara el tamaño óptico con otra escala, ahí el texto se vería apenas más fino, igual que hoy en Chrome.

Lo mismo con Plus Jakarta Sans entre 400 y 700: 27,3 a 20,2 KB en todas las páginas, con el mismo tipo de corrimiento en las negritas.

DESIGN.md: "**No ejecutar auditorías de performance que toquen tipografía o color sin revisar este archivo.** Si la auditoría recomienda cambiar el sistema híbrido por motivos de carga, se evalúa manualmente". Por eso no está aplicado. Si se prueba, los archivos nuevos llevan otro nombre para que ninguna caché mezcle versiones, y se mira el preview en un iPhone.

Resuelto el 8 de octubre: aplicado, con nombres nuevos (`literata-latin-opsz19.woff2` y su itálica). Plus Jakarta Sans queda como está. Conviene mirar una página de lectura en un iPhone con el preview antes de mergear.

## 6. Lo que se ve al compartir y lo que leen los buscadores

- **El inicio se comparte con el copy anterior.** `og:description`, lo que muestran LinkedIn y WhatsApp: "Trabajamos con líderes que enfrentan decisiones críticas y no pueden equivocarse. Ordenamos el caos con datos, diseñamos futuros, convertimos análisis en acción y comunicamos lo que se decide." La meta description y `llms.txt` ya usan el copy actual.
- **Imagen al compartir.** Solo Gabinete tiene la suya (un recorte de 1200 × 630 de su portada). Trace Group, Natalidad y la tesis comparten la genérica con el logo. El mismo recorte, hecho con la portada de cada caso, completa el patrón.
- **Datos estructurados del inicio**, que leen Google y los asistentes:
  - La descripción de la organización es otra: "Estudio de diseño estratégico, comunicación y análisis de futuros…".
  - Los cargos no son los de la página: "Futurista", "Comunicación Estratégica", "Senior Data & Insights Analyst".
  - La descripción de Ezequiel nombra a Grupo QuintoAndar y a la Universidad de San Andrés. La biografía visible dice "una empresa de tecnología inmobiliaria". Si no nombrarla es a propósito, el JSON-LD lo desarma.
  - El catálogo de servicios lista cuatro servicios viejos, uno de ellos "Estrategia de Implementación" con "hojas de ruta" (VOICE.md las prohíbe). La página tiene otros cuatro: investigación exploratoria, diseño de futuros y prototipos, datos e IA aplicada, comunicación estratégica.
  - `serviceType` está en inglés y `sameAs` no incluye YouTube, que sí está en el footer.
  - Las fechas son fijas: Trace Group dice `dateModified` 2026-09-04 y la página cambió el 8 de septiembre.
- **Título de Lo hecho:** "Hechos | BPP Analytics & Design". CLAUDE.md fija "Hechos" para el título de la sección y no se toca; el `<title>` podría sumar qué hay adentro sin perder la palabra ("Hechos: casos, clases y jornadas | …"). Seis páginas tienen descripciones de más de 160 caracteres y Google las corta.
- Dos enlaces de Pensamiento a LinkedIn llevan `?trackingId=…` ("Por qué los algoritmos no bastan…" y "El Branding como fenómeno social…").

Decisión: aprobar los textos nuevos, elegir las tres imágenes y decidir si el JSON-LD nombra a QuintoAndar y San Andrés.

Resuelto en parte el 8 de octubre, con la pasada de copy: `og:description`, descripción de la organización, cargos, catálogo de servicios y `serviceType` del JSON-LD iguales a la página; YouTube en `sameAs`; `dateModified` de los casos tomado del `sitemap.lastmod`; el `<title>` de Lo hecho suma "casos, clases y jornadas"; las descripciones quedan en 160 caracteres o menos; los enlaces de Pensamiento sin `?trackingId`. Quedan las imágenes al compartir de Trace Group, Natalidad y la tesis, y decidir si el JSON-LD nombra a QuintoAndar y San Andrés (hoy sí).

## 7. Las tarjetas, en un solo lugar

Hay 20 tarjetas: 5 en el inicio, 9 en Lo hecho, 6 en Pensamiento. Cuatro del inicio repiten tarjetas de los listados y ya no coinciden. Lo que eso produce hoy, a la vista:

- En las tres tarjetas del inicio con etiqueta, el separador y los temas salen en blanco pleno; la fecha de al lado, al 65 %. Usan `.bpp-text-muted`, una clase sin CSS desde el 9 de junio.
- Las tarjetas de Trace Group y Gabinete del inicio no tienen la imagen móvil: en un teléfono bajan 47,8 y 90,9 KB en lugar de los 17,6 y 21,5 KB que baja Lo hecho.
- Desde 1025 px el espacio entre tarjetas es de 40 px. La regla de 64 px pierde contra otra que viene después en el CSS.
- En pantallas de densidad 1, cada tarjeta baja el archivo de 1440 a 1600 px para un hueco de unos 690. Recorriendo la página entera, de los 1014 KB de imágenes de Lo hecho unos 783 son resolución que no se ve; en Pensamiento, 585 de 710; en el inicio, 629 de 798 (estimado: bytes × (1 − (necesario/real)²)). De las 16 imágenes de tarjeta, 9 ya tienen una versión de 800 px con el mismo encuadre y 1 ya es de 800: alcanza con el marcado. Las otras 6 necesitan una versión nueva.
- Las listas de los datos estructurados de Lo hecho y Pensamiento son una tercera copia, con nombres que ya difieren de los títulos.

Propuesta: un archivo de datos con una entrada por pieza y una sola plantilla de tarjeta. El inicio elige por id; las listas del JSON-LD salen de los mismos datos. Es el pendiente de `historial.md`: "Extraer artículos y equipo a datos de Eleventy para que existan una sola vez". Sumar un caso pasaría a ser una entrada.

Decisión: hacerlo, con los cambios visibles de arriba (temas al 65 %, imagen móvil, 64 px, imágenes a medida) o reproduciendo las diferencias de hoy.

## 8. Que Vercel corra el chequeo

Hasta el 8 de octubre, `deploy.yml` corría `scripts/check-site.mjs` antes de publicar. Vercel corre el build, no el chequeo. Un `vercel.json` lo recupera:

```json
{ "buildCommand": "npm run check" }
```

Un cambio que rompe un enlace, deja una imagen sin `alt` o saca una página del sitemap no se publica: producción sigue en la versión anterior y el deploy queda marcado como fallido en Vercel y en GitHub. El estado de cada preview se puede leer desde GitHub, así que si el build falla en Vercel se ve antes de mergear.

El mismo archivo puede llevar dos cosas más, que no se pueden comprobar desde acá porque los previews piden login:

- `"trailingSlash": true`. GitHub Pages redirigía `/proyectos` a `/proyectos/`. Hay que confirmar qué hace Vercel hoy con `/proyectos` sin barra: si responde la página sin redirigir, la misma página vive en dos direcciones (el canonical ya les dice a los buscadores cuál vale; la razón de Plausible, que la contaba como otra página, se fue con Plausible).
- Headers que solo funcionan como HTTP y no como `<meta>`: `frame-ancestors`, `Permissions-Policy`, `X-Content-Type-Options`. Hoy no están (lo dice el comentario de `base.njk`).

Decisión: sí o no a cada línea.

## 9. Contenido propio en el dominio

Los seis artículos de Pensamiento enlazan a LinkedIn. Las seis clases y jornadas de Lo hecho enlazan afuera: a Medium, a LinkedIn y a la nota del CESBA. La página de la tesis tiene 307 palabras; las 56 páginas están en el PDF. El texto largo propio del sitio son los tres casos (1075 a 2429 palabras) y el inicio.

Quien busca un tema, y no el nombre del estudio, encuentra LinkedIn. Publicar los artículos en el sitio, con la página de lectura que ya existe (`.page-lectura`, Literata a 19 px), y usar LinkedIn para distribuir con un enlace de vuelta, cambia eso. La tesis en HTML sería la pieza más fuerte: es investigación propia y ya tiene cita sugerida.

Decisión: si se hace y con qué texto se empieza. Es trabajo editorial, no de código.

## 10. Tres números de Plausible

**Descartado el 8 de octubre:** Plausible salió del sitio, así que estos números ya no existen. El hero del inicio quedó como está.

La primera pantalla del inicio, a 1440 × 900 y a 390 × 844, es el logo, el nombre y la bajada: sin nav (aparece al scrollear), sin CTA y sin indicio de que hay más abajo. El primer texto de la sección siguiente queda 72 px por debajo del borde en escritorio y 40 px en el teléfono. Si eso cuesta visitas lo dice un número que ya existe:

1. De las visitas a `/`, cuántas mandan `Seccion_vista` con `id: services`: son las que pasaron la primera pantalla.
2. `Contacto_mail` por fuente de tráfico, una vez arreglado el punto 2.
3. `Caso_leido_75` sobre visitas, por caso.

Aparte: `Reporte_seccion_vista` repite `Seccion_vista` con los mismos ids. Leer un caso entero manda entre 11 y 15 eventos, y entre 5 y 7 son esa repetición. Sacarlo no cambia nada de lo que se puede ver en el panel.

Decisión: mirar los tres números antes de tocar el inicio.

## 11. Menores

- **Flechas.** El archivo de Plus Jakarta Sans es el subset latin de Google, idéntico byte a byte, y no trae → ni ← (sí ↑ y ↓). Las 16 → y la ← de las páginas, más las del índice móvil de los casos, las dibuja una fuente del sistema, distinta en cada dispositivo. Además, el JS que envuelve la flecha no encuentra la del CTA de cierre (el texto termina en espacios), y DESIGN.md pide "Usar `translateX(±4px)` en flechas de CTA para hover direccional": solo la flecha a la izquierda lo tiene.
- **DESIGN.md se contradice, o contradice al código, en ocho puntos.** Como es la fuente de verdad que cualquier agente lee antes de tocar estilos, cada contradicción es una instrucción doble:

  | Tema | Una parte dice | Otra parte dice | El código hace |
  |---|---|---|---|
  | Pesos | 400 y 700 (líneas 20–21) | 300 a 700 (153, 253) | 400 y 700 |
  | Carga | `@font-face` (154) | `<link>` (253) | `@font-face` |
  | Radios | Máximo 8 px, sin pills (201, 204, 278) | `md` 16 px, badges en pill (64, 260) | 16 px y pill |
  | Corner brackets | En hero y cards (195, 231) | Solo La Usina (4, 261) | Solo La Usina |
  | Sombras | Negras, alfa ≤ 0,4, blur ≤ 24 px, sin glow (177, 182–184) | "sombra cálida (`--shadow-card`)" (258) | Alfa 0,55, blur 48 px y glow terracota al hover |
  | Logo | SVG base64 con `filter: invert` (243) | | Archivo `logo.svg` en color |
  | Equipo | Foto flotante al hover, "preservar" (233–235, 263) | | No existe: grilla con fotos fijas |
  | Fondo | "Dark warm gray" (4, 104, 110, 264) | Tinta azul-negro frío (340) | Tinta |

  VOICE.md, línea 151, sigue describiendo el sistema híbrido de Bros Oskon y Chivo, que DESIGN.md retiró (línea 323).
- `HANDOFF-PROYECTOS.md` es una foto del commit `39e75b8` y ya tiene la nota de qué quedó viejo. Regenerarlo o borrarlo.
- `docs/framework-senales-debiles.md` es un borrador de marzo, anterior a VOICE.md: usa la raya como remate y frases como "cambia las reglas del juego".
- Después de la mudanza: confirmar la propiedad en Search Console y volver a mandar el sitemap, y revisar en Vercel, Domains, que `bppanalyticsanddesign.com` redirija a `www`.
- GitHub sigue corriendo "pages build and deployment" en cada push a la rama de trabajo, y falla. Settings, Pages, Branch: None.
- El mail de contacto es `@gmail.com`. Opinión, no medición: para quien decide en el sector público, una dirección del dominio pesa más.

## 12. Medido y descartado

- **Caché larga para fuentes e imágenes.** En una visita de cinco páginas con 4G lenta, las fuentes quedan listas entre 6 y 158 ms antes: la revalidación del CSS ya cuesta ese viaje. No compensa una regla que obliga a renombrar archivos cada vez que cambian.
- **Minificar el HTML.** Comprimido, el documento más pesado ocupa 11,1 KB: todos entran en el primer viaje de la conexión. Los comentarios son entre 0 y 2,2 % del HTML.
- **Imágenes de portada más chicas en el teléfono.** Un teléfono de densidad 3, como los iPhone de los últimos años, necesita el archivo de 1200 px igual. Una versión de 800 px solo ayudaría en densidad 2 o menos, y en Lighthouse. La excepción es Gabinete, que ya tiene la de 800 con el mismo encuadre: se puede sumar sin costo.
- **Plausible a través de Vercel** (ya no aplica: Plausible salió del sitio el 8 de octubre) para contar a quien usa bloqueadores. Funciona, pero cuenta a quien eligió bloquear la medición. Con la postura de la página de privacidad, queda anotado y no propuesto.
