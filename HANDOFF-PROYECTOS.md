# Handoff: escribir una página de proyecto nueva

Documento generado el 2026-09-08 desde el repositorio del sitio de BPP Analytics & Design, commit `39e75b8`. Todo lo que está en bloques de código es el archivo fuente tal cual, sin resumir ni editar. El texto fuera de los bloques solo dice qué es cada cosa y dónde vive.

Una página de proyecto es una carpeta `src/proyectos/<slug>/` con un único `index.njk` (front matter YAML + HTML con Nunjucks). No hay markdown ni componentes: el contenido y la estructura viven en ese archivo, y el layout `src/_includes/layouts/base.njk` pone head, nav y footer alrededor. La URL resultante es `/proyectos/<slug>/`.

Para publicar una página nueva hay que tocar, además del `index.njk` nuevo:

1. Un include JSON-LD en `src/_includes/jsonld/` (uno por página, se declara en el front matter).
2. La tarjeta en `src/proyectos/index.njk` (sección Casos) y, si va en la home, otra en `src/index.njk`.
3. La lista `ItemList` de `src/_includes/jsonld/proyectos.njk`.
4. `sitemap.xml` (a mano).
5. La lista `pages` de `scripts/check-site.mjs`, que corre en CI y falla si la página no existe.
6. Las imágenes en `img/`, ya procesadas (ver sección 5).

---

## 1. Stack y estructura

- Generador: Eleventy 3.1.6 con templates Nunjucks. Node 22.
- CSS y JS escritos a mano en `src/styles.css` y `src/main.js`; se minifican con csso-cli 4.0.2 y terser 5.51.2 en el build. Sin Tailwind, sin preprocesador, sin framework en el navegador.
- Fuentes self-hosted (Plus Jakarta Sans y Literata) en `fonts/`.
- Publicación: GitHub Pages desde `_site/`, construido por GitHub Actions al hacer push a la rama por defecto. `_site/` y los `.min` no se versionan.
- Métricas: Plausible. Sin cookies, sin formularios.

### `package.json`

```json
{
  "name": "bpp-site",
  "private": true,
  "description": "Sitio de BPP Analytics & Design. HTML plano generado con Eleventy; CSS y JS a mano.",
  "scripts": {
    "build": "eleventy && npm run build:css && npm run build:js",
    "build:css": "csso src/styles.css -o _site/styles.min.css --no-restructure",
    "build:js": "terser src/main.js -o _site/main.min.js --compress passes=2,dead_code=true,drop_console=true --mangle --comments false",
    "serve": "eleventy --serve",
    "check": "eleventy && npm run build:css && npm run build:js && node scripts/check-site.mjs"
  },
  "devDependencies": {
    "@11ty/eleventy": "^3.1.0",
    "csso-cli": "^4.0.2",
    "terser": "^5.31.0"
  }
}
```

### `.eleventy.js`

```js
// Eleventy: genera el sitio en _site/ a partir de src/.
// Sin frameworks en runtime: el HTML sale plano, el CSS y el JS se minifican aparte (package.json).
export default function (eleventyConfig) {
  // Año del copyright horneado en el build: el footer no depende de JS.
  eleventyConfig.addGlobalData("buildYear", () => new Date().getFullYear());
  // Assets que se copian tal cual, desde la raíz del repo al de _site/
  eleventyConfig.addPassthroughCopy({
    img: "img",
    fonts: "fonts",
    "robots.txt": "robots.txt",
    "sitemap.xml": "sitemap.xml",
    "llms.txt": "llms.txt",
    CNAME: "CNAME",
    "favicon.ico": "favicon.ico",
    "favicon.svg": "favicon.svg",
    "favicon-16x16.png": "favicon-16x16.png",
    "favicon-32x32.png": "favicon-32x32.png",
    "apple-touch-icon.png": "apple-touch-icon.png",
    // Kill-switch del service worker retirado: borrar en 2027
    "sw.js": "sw.js",
    "sw.min.js": "sw.min.js",
  });
  // Documentos públicos (PDF de la tesis). Los .md de docs/ nunca se publican.
  eleventyConfig.addPassthroughCopy("docs/*.pdf");
  // styles.css y main.js viven en src/ pero no son templates
  eleventyConfig.ignores.add("src/styles.css");
  eleventyConfig.ignores.add("src/main.js");
  return {
    dir: { input: "src", output: "_site", includes: "_includes", data: "_data" },
    htmlTemplateEngine: false, // src/usina/index.html (redirección) se copia sin procesar
    markdownTemplateEngine: "njk",
  };
}
```

### Árbol de directorios (3 niveles, sin `node_modules`, `_site`, `.git`)

Los archivos de cuarto nivel que importan acá: `src/_includes/layouts/base.njk`, `src/_includes/partials/{nav,footer,cierre,senales-cards}.njk`, `src/_includes/jsonld/{index,proyectos,proyectos-trace-group,natalidad,pensamiento,usina-tesis-01,privacidad}.njk`, `src/proyectos/trace-group/index.njk`, `src/proyectos/natalidad/index.njk`, `src/usina/tesis-01/index.njk`.

```text
.
.claude
.claude/settings.local.json
.claude/skills
.claude/skills/bpp-brand
.eleventy.js
CLAUDE.md
CNAME
DESIGN.md
README.md
VOICE.md
apple-touch-icon.png
docs
docs/framework-senales-debiles.md
docs/historial.md
docs/tesis-01-el-actante-siempre-disponible.pdf
favicon-16x16.png
favicon-32x32.png
favicon.ico
favicon.svg
fonts
fonts/literata-latin-italic.woff2
fonts/literata-latin.woff2
fonts/plus-jakarta-sans-latin-italic.woff2
fonts/plus-jakarta-sans-latin.woff2
img
img/2026-ano-analogico-mobile.webp
img/2026-ano-analogico.webp
img/CuadroMatriculaOptima.webp
img/EscInn.svg
img/Ezequiel-240.webp
img/Ezequiel-480.webp
img/Ezequiel-768.webp
img/Heated.svg
img/JornadaCESBA-480.webp
img/JornadaCESBA-800.webp
img/JornadaCESBA-mobile.webp
img/MapaMatriculaOptima.webp
img/Nicolas-240.webp
img/Nicolas-480.webp
img/Nicolas-768.webp
img/Sergio-240.webp
img/Sergio-480.webp
img/Sergio-768.webp
img/algoritmizar-potrero-mobile.webp
img/algoritmizar-potrero.webp
img/algoritmos-sociologia-branding-mobile.webp
img/algoritmos-sociologia-branding.webp
img/alquileres-negociacion-mobile.webp
img/alquileres-negociacion.webp
img/aula-vacia-1800.webp
img/aula-vacia-mobile.webp
img/aula-vacia.webp
img/branding-fenomeno-social-mobile.webp
img/branding-fenomeno-social.webp
img/buque-metanero-mobile.webp
img/buque-metanero.webp
img/comunicaciones-syp.svg
img/cuando-artefacto-piensa-mobile.webp
img/cuando-artefacto-piensa.webp
img/dron-medicion-mobile.webp
img/dron-medicion.webp
img/informe-2032-portada-mobile.webp
img/informe-2032-portada.webp
img/informe-mesa-mobile.webp
img/informe-mesa.webp
img/inhabiting-future-mobile.webp
img/inhabiting-future.webp
img/lab-logo-coral.webp
img/logo-cesba.webp
img/logo.svg
img/logo.webp
img/manifiesto-bar.webp
img/masterclass-ia-udit-mobile.webp
img/masterclass-ia-udit.webp
img/medicion-pozo-mobile.webp
img/medicion-pozo.webp
img/micelio.svg
img/og-image.jpg
img/olamestudio.svg
img/otros-futuros-ied-mobile.webp
img/otros-futuros-ied.webp
img/otros-futuros.svg
img/personal-software-mobile.webp
img/personal-software.webp
img/planta-camiones-mobile.webp
img/planta-camiones.webp
img/refineria-verificador-mobile.webp
img/refineria-verificador.webp
img/tesis01-cuarto-mobile.webp
img/tesis01-cuarto.webp
img/trace-logo.svg
img/verificacion-campo-mobile.webp
img/verificacion-campo.webp
img/we-trace-login-mobile.webp
img/we-trace-login.webp
img/we-trace-portafolio-mobile.webp
img/we-trace-portafolio.webp
img/workshop-latam2036-mobile.webp
img/workshop-latam2036.webp
llms.txt
package-lock.json
package.json
robots.txt
scripts
scripts/check-site.mjs
sitemap.xml
src
src/404.njk
src/_data
src/_data/site.json
src/_includes
src/_includes/jsonld
src/_includes/layouts
src/_includes/partials
src/index.njk
src/main.js
src/pensamiento
src/pensamiento/index.njk
src/privacidad
src/privacidad/index.njk
src/proyectos
src/proyectos/index.njk
src/proyectos/natalidad
src/proyectos/trace-group
src/reporte-impacto
src/reporte-impacto/index.html
src/styles.css
src/usina
src/usina/index.html
src/usina/tesis-01
sw.js
sw.min.js
```

---

## 2. Template de referencia

Cada página es un solo archivo: front matter YAML entre `---` y después el HTML del `<main>`. No hay separación contenido/componente. El layout que envuelve todo es `base.njk` (más abajo), que a su vez incluye `partials/nav.njk`, `partials/footer.njk` y, si la página declara `cierreTitulo`, `partials/cierre.njk` (el bloque final con CTA al mail).

### 2.1 `/proyectos/trace-group/`

**`src/proyectos/trace-group/index.njk`** (264 líneas, verbatim)

```html
---
layout: "layouts/base.njk"
title: "Trace Group — De la señal al servicio – BPP Analytics & Design"
description: "¿Y si un cargamento de gas quedara afuera de Europa por su metano, y no por su precio? Este es ese escenario, y el objeto que lo hace tangible. Provocación para Trace Group, vía Clusterciar. BPP, 2026."
ogType: "article"
section: "proyectos"
ogTitle: "Trace Group — De la señal al servicio"
ogDescription: "¿Y si un cargamento de gas quedara afuera de Europa por su metano, y no por su precio? Este es ese escenario, y el objeto que lo hace tangible. Provocación, 2026."
bodyClass: "reporte-page secondary-page page-lectura"
jsonld: "jsonld/proyectos-trace-group.njk"
cierreTitulo: "Si en tu organización hay una señal que nadie mira, hablemos."
cierreCta: "Escribinos"
---
  <main id="main-content">

    <!-- Sticky TOC (Desktop) -->
    <aside class="sticky-toc" id="stickyToc" aria-label="Índice del proyecto">
      <p class="toc-heading">Navegación</p>
      <ul>
        <li><a href="#sec-intro">El escenario</a></li>
        <li><a href="#sec-objeto">El objeto</a></li>
        <li><a href="#sec-contexto">Lo real</a></li>
        <li><a href="#sec-como">Cómo lo hicimos</a></li>
        <li><a href="#sec-creditos">Créditos</a></li>
      </ul>
    </aside>

    <!-- Mobile TOC Button -->
    <button class="mobile-toc-btn" id="mobileTocBtn" aria-label="Abrir índice de navegación">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M3 4h18v2H3V4zm0 7h18v2H3v-2zm0 7h18v2H3v-2z"/>
      </svg>
    </button>

    <!-- Mobile TOC Overlay -->
    <div class="mobile-toc-overlay" id="mobileTocOverlay" aria-label="Navegación del proyecto">
      <button class="close-btn" id="closeMobileToc" aria-label="Cerrar índice">×</button>
      <div class="toc-content">
        <p class="toc-title">Navegación del proyecto</p>
        <ul class="report-toc-list editorial-list">
          <li><span class="editorial-arrow" aria-hidden="true">→</span> <a href="#sec-intro">El escenario: 2032</a></li>
          <li><span class="editorial-arrow" aria-hidden="true">→</span> <a href="#sec-objeto">El objeto</a></li>
          <li><span class="editorial-arrow" aria-hidden="true">→</span> <a href="#sec-contexto">Lo real: tres señales</a></li>
          <li><span class="editorial-arrow" aria-hidden="true">→</span> <a href="#sec-como">Cómo lo hicimos</a></li>
          <li><span class="editorial-arrow" aria-hidden="true">→</span> <a href="#sec-creditos">Créditos</a></li>
        </ul>
      </div>
    </div>

    <!-- Share Buttons (Desktop) -->
    <div class="share-buttons" id="shareButtons">
      <a href="https://www.linkedin.com/sharing/share-offsite/?url=https://www.bppanalyticsanddesign.com/proyectos/trace-group/" target="_blank" rel="noopener noreferrer" aria-label="Compartir en LinkedIn">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      </a>
      <a href="https://twitter.com/intent/tweet?url=https://www.bppanalyticsanddesign.com/proyectos/trace-group/&text=Trace%20Group%3A%20de%20la%20se%C3%B1al%20al%20servicio" target="_blank" rel="noopener noreferrer" aria-label="Compartir en Twitter">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      </a>
      <a href="mailto:?subject=Trace%20Group%3A%20de%20la%20se%C3%B1al%20al%20servicio%20-%20BPP&body=Te%20comparto%20este%20proyecto%20sobre%20un%20informe%20de%20verificaci%C3%B3n%20de%20emisiones%20fechado%20en%202032:%20https://www.bppanalyticsanddesign.com/proyectos/trace-group/" aria-label="Compartir por email">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
        </svg>
      </a>
    </div>

    <!-- HERO DEL PROYECTO -->
    <section class="hero-section section-wide">
      <p class="report-label">PROVOCACIÓN · 2026</p>
      <h1 class="tagline">Trace Group — De la señal al servicio</h1>
      <p class="hero-sub">
        ¿Y si un cargamento de gas quedara afuera de Europa por su metano, y no por su precio? Este es ese escenario, y el objeto que lo hace tangible.
      </p>
      <p class="report-tags">
        Energía · Verificación de emisiones · 2032
      </p>
      <dl class="ficha-tecnica">
        <div class="ficha-row"><dt>Año</dt><dd>2026</dd></div>
        <div class="ficha-row"><dt>Destinatario</dt><dd>Trace Group (vía Clusterciar)</dd></div>
        <div class="ficha-row"><dt>Campo</dt><dd>Verificación de emisiones de metano</dd></div>
        <div class="ficha-row"><dt>Estado</dt><dd>Provocación presentada, 2026</dd></div>
      </dl>
    
      <figure class="hero-figura">
        <img src="/img/we-trace-login.webp" alt="Pantalla de ingreso de we.trace, la plataforma de verificación de emisiones que emite el informe de 2032" width="1200" height="898" loading="eager" fetchpriority="high" decoding="async">
      </figure>
    </section>

    <!-- INTRODUCCIÓN -->
    <section class="content-section reporte-section" id="sec-intro">
      <article class="actividad-card actividad-card--light">
        <h2>El escenario: 2032</h2>
        <p>
          <strong>¿Y si un cargamento de gas quedara afuera de Europa por su metano, y no por su precio?</strong>
        </p>
        <p>
          Hoy el gas compite por precio. El reglamento europeo de metano mueve la competencia: desde 2027 el gas importado tiene que mostrar cómo midió su metano, no solo cuánto declaró, y prevé topes de intensidad de metano desde 2030. Un cargamento puede quedar afuera por lo que se le escapa en el camino.
        </p>
        <figure class="figura">
          <picture>
            <source srcset="/img/planta-camiones-mobile.webp" type="image/webp" media="(max-width: 600px)">
            <img src="/img/planta-camiones.webp" alt="Una planta de gas en la meseta, con torres y tanques, y una fila de camiones cisterna blancos bajo el brazo de carga; un operario junto al primer camión" width="1200" height="670" loading="lazy" decoding="async">
          </picture>
          <figcaption>Una planta de gas y los camiones que la cargan: el escenario transcurre en un lugar así.</figcaption>
        </figure>
        <p>
          Para el gas argentino eso ya tiene nombre y fecha. El contrato existe: gas de Vaca Muerta, licuado en el Golfo San Matías, con destino a Wilhelmshaven. La habilitación existe: desde 2025 firma una persona certificada, no una empresa. Lo que no existe es quien junte las dos cosas y firme esa verificación desde Río Negro.
        </p>
        <p>
          Fin de mes de 2032, en una oficina de Río Negro. El metanero ya cargó y sobre el escritorio está el lote SESA-LNG-2032-0847: identificación del cargo, inventario de emisiones por etapa, cálculo de intensidad, la declaración de verificación que espera una firma. De los siete embarques del ciclo, uno quedó en "propuesta de mejora" y hay que reconciliarlo antes de cerrar. No es un hito. Es el trabajo de todos los meses.
        </p>
        <figure class="figura">
          <picture>
            <source srcset="/img/refineria-verificador-mobile.webp" type="image/webp" media="(max-width: 600px)">
            <img src="/img/refineria-verificador.webp" alt="Un operario con casco y chaleco reflectante, de espaldas, mira una planta de gas con la antorcha encendida; meseta seca y bardas al fondo, su sombra larga sobre el ripio" width="1200" height="670" loading="lazy" decoding="async">
          </picture>
          <figcaption>El escenario empieza en una planta, no en un despacho: la verificación se firma donde se mide.</figcaption>
        </figure>
        <p>
          Este es el objeto que hace tangible ese escenario: el informe de verificación de ese lote, fechado en 2032 y empaquetado como un ejecutable de 3,4 MB que se abre con doble clic, y we.trace, la plataforma que lo emite. Debajo, la investigación regulatoria que lo sostiene, verificada norma por norma. Lo que sigue es ese objeto y cómo lo construimos.
        </p>
      </article>
    </section>

    <!-- EL OBJETO -->
    <section class="content-section reporte-section" id="sec-objeto">
      <article class="actividad-card actividad-card--light">
        <h2>El objeto</h2>
        <p>
          Dos piezas, deliberadamente distintas. El informe es un ejecutable de 3,4 MB, sin backend ni red: se abre con doble clic y muestra el documento de verificación completo. Identificación del cargo, inventario de emisiones por etapa, cálculo de intensidad, declaración de verificación independiente. Cada cifra técnica está trazada. Donde corresponde, normas reales: ISSA 5000, ISO 14064, OGMP 2.0. Donde no, consistencia interna.
        </p>
        <figure class="figura">
          <picture>
            <source srcset="/img/informe-2032-portada-mobile.webp" type="image/webp" media="(max-width: 600px)">
            <img src="/img/informe-2032-portada.webp" alt="Portada del Informe de Intensidad de Emisiones de Embarque: referencia SESA-LNG-2032-0847, buque LNG Maran Phoebe, ruta Golfo San Matías a Wilhelmshaven, emisor Trace Group S.A., aseguramiento limitado y hash del documento" width="1252" height="947" loading="lazy" decoding="async">
          </picture>
          <figcaption>El informe del lote SESA-LNG-2032-0847: Golfo San Matías a Wilhelmshaven, aseguramiento limitado, hash del documento.</figcaption>
        </figure>
        <p>
          we.trace es la plataforma que lo emite: login, portafolio de verificaciones, detalle de caso. Tiene el sistema visual genérico de cualquier SaaS empresarial, a propósito, frente al cuidado tipográfico del documento. El contraste es el argumento: la plataforma es infraestructura; el informe es lo que importa.
        </p>
        <figure class="figura">
          <picture>
            <source srcset="/img/we-trace-portafolio-mobile.webp" type="image/webp" media="(max-width: 600px)">
            <img src="/img/we-trace-portafolio.webp" alt="Portafolio de verificaciones de we.trace: siete embarques del ciclo 2032 con cliente, ruta, destino, estado y origen, y un aviso de tres casos pendientes de reconciliación" width="1248" height="939" loading="lazy" decoding="async">
          </picture>
          <figcaption>we.trace, siete embarques del ciclo 2032. Cuatro estados posibles, no dos: la plataforma admite que un embarque puede no cerrar.</figcaption>
        </figure>
        <p>
          El informe no cierra perfecto a propósito, en un solo lugar: declara una divergencia metodológica en vez de resolverla. Un verificador que admite dónde el método no alcanza es más creíble que uno que no.
        </p>
      </article>
    </section>

    <!-- LO REAL -->
    <section class="content-section reporte-section" id="sec-contexto">
      <article class="actividad-card actividad-card--light">
        <h2>Lo real: tres señales</h2>
        <p><strong>Tres hechos verificados contra fuente primaria.</strong> Ninguno proyectado. El escenario se apoya en ellos y en nada más.</p>

        <div class="impact-top impact-top--spacing-md">
          <h3>Junio de 2025</h3>
        </div>
        <p>
          La Resolución 277/2025 reemplazó el registro de auditoras por certificación individual bajo la norma API 653. La habilitación dejó de estar en la empresa y pasó a estar en la persona que firma.
        </p>
        <figure class="figura">
          <picture>
            <source srcset="/img/dron-medicion-mobile.webp" type="image/webp" media="(max-width: 600px)">
            <img src="/img/dron-medicion.webp" alt="Un dron con un sensor colgando vuela bajo, centrado, sobre una planta de gas desenfocada al atardecer" width="1200" height="670" loading="lazy" decoding="async">
          </picture>
          <figcaption>Lo que se mide en campo es lo que después se firma.</figcaption>
        </figure>

        <div class="impact-top impact-top--spacing-lg">
          <h3>Marzo de 2026</h3>
        </div>
        <p>
          Southern Energy firmó con la alemana SEFE el mayor contrato de exportación de GNL de la historia argentina. Gas de Vaca Muerta, licuado en el Golfo San Matías, con destino a Wilhelmshaven.
        </p>
        <figure class="figura">
          <picture>
            <source srcset="/img/buque-metanero-mobile.webp" type="image/webp" media="(max-width: 600px)">
            <img src="/img/buque-metanero.webp" alt="Un buque metanero con tanques esféricos, solo en mar abierto, visto desde arriba; su estela recta llega hasta el borde inferior de la foto" width="1200" height="670" loading="lazy" decoding="async">
          </picture>
          <figcaption>Una ruta que se sigue de punta a punta.</figcaption>
        </figure>

        <div class="impact-top impact-top--spacing-lg">
          <h3>Desde 2027</h3>
        </div>
        <p>
          Ese gas necesita demostrar cómo se midió su huella de metano ante el Reglamento de Metano de la Unión Europea. No alcanza con declarar la huella: hay que mostrar el método de medición.
        </p>
        <figure class="figura">
          <picture>
            <source srcset="/img/medicion-pozo-mobile.webp" type="image/webp" media="(max-width: 600px)">
            <img src="/img/medicion-pozo.webp" alt="Un sensor de metano con antena y panel solar sobre un poste, en primer plano, junto a la boca de un pozo de gas; meseta seca y bardas al fondo" width="1200" height="670" loading="lazy" decoding="async">
          </picture>
          <figcaption>La huella se mide en el pozo, no en la planilla.</figcaption>
        </figure>

        <p class="text-spacing-md">
          Juntas abren una pregunta que ningún deck responde solo: ¿quién va a ser el primero en ofrecer esa verificación desde Río Negro?
        </p>
        <p class="ficha-caso-fuentes"><strong>Fuentes:</strong> Resolución 277/2025 (Argentina, junio de 2025); contrato de exportación de GNL entre Southern Energy y SEFE (marzo de 2026); Reglamento (UE) de metano. Referencias técnicas del informe: ISSA 5000, ISO 14064, OGMP 2.0. El informe está fechado en 2032.</p>
      </article>
    </section>

    <!-- CÓMO LO HICIMOS -->
    <section class="content-section reporte-section" id="sec-como">
      <article class="actividad-card actividad-card--light">
        <h2>Cómo lo hicimos</h2>
        <p>
          <strong>El objeto en lugar del argumento.</strong> Podríamos haber explicado en abstracto por qué ese servicio tiene sentido. Preferimos construir el informe completo, con la textura de un documento regulatorio real: trazabilidad de buque, factores de emisión, una declaración de aseguramiento con su lenguaje técnico. Un objeto así no vende el servicio. Lo hace pensable.
        </p>
        <figure class="figura">
          <picture>
            <source srcset="/img/informe-mesa-mobile.webp" type="image/webp" media="(max-width: 600px)">
            <img src="/img/informe-mesa.webp" alt="Un informe impreso abierto sobre una mesa de madera, con tablas y un gráfico de línea; tres pares de manos alrededor, una señala una cifra, otra escribe una nota al margen, y una taza de café" width="1200" height="670" loading="lazy" decoding="async">
          </picture>
          <figcaption>Un deck se aprueba. Un objeto se discute.</figcaption>
        </figure>
        <p>
          <strong>Futuro mundano.</strong> El principio rector es el de Nick Foster: no la fantasía de una planta perfecta, sino el día de trabajo aburrido de alguien en una oficina de Río Negro. Por eso el escenario es un cierre de mes con un lote por reconciliar, no una inauguración. El futuro no llega con un gran anuncio. Llega como rutina.
        </p>
        <p>
          <strong>Verificar antes de citar.</strong> Cada norma se contrastó con la fuente real antes de usarse. Eso incluyó correcciones sobre la marcha: una norma que resultó estar en vías de reemplazo, un factor de conversión que no correspondía al tipo de gas. Lo difícil no fue imaginar 2032 sino resistir la tentación de cerrarlo perfecto.
        </p>
        <figure class="figura">
          <picture>
            <source srcset="/img/verificacion-campo-mobile.webp" type="image/webp" media="(max-width: 600px)">
            <img src="/img/verificacion-campo.webp" alt="Cinco personas con cascos y chalecos reflectantes caminan de espaldas por un camino de tierra en un pad de gas; una boca de pozo y una camioneta blanca a un costado, bardas al fondo" width="1200" height="670" loading="lazy" decoding="async">
          </picture>
          <figcaption>Cinco personas y un recorrido: la verificación es trabajo de campo.</figcaption>
        </figure>
        <p>
          <strong>Lo que abre.</strong> Una conversación con Trace Group, vía Clusterciar, sobre un servicio que hoy no existe. Presentada en 2026. Lo que la organización haga con ella no forma parte de lo que publicamos.
        </p>
      </article>
    </section>

    <!-- CRÉDITOS -->
    <section class="content-section reporte-section" id="sec-creditos">
      <article class="actividad-card actividad-card--light">
        <h2>Créditos</h2>
        <dl class="ficha-tecnica">
          <div class="ficha-row"><dt>Equipo</dt><dd>Nicolás Bronzina, Sergio Petrocelli, Ezequiel Politi · BPP Analytics &amp; Design</dd></div>
          <div class="ficha-row"><dt>Destinatario</dt><dd>Trace Group, vía Clusterciar</dd></div>
          <div class="ficha-row"><dt>Año</dt><dd>2026</dd></div>
          <div class="ficha-row"><dt>Relacionado</dt><dd><a href="/proyectos/natalidad/">Impacto de la caída de la natalidad</a> · <a href="/usina/tesis-01/">El actante siempre disponible</a></dd></div>
        </dl>
        <p class="reporte-fuente">BPP Analytics &amp; Design · Buenos Aires · Madrid</p>
      </article>
    </section>

    <!-- CIERRE: afirmación + CTA (reemplaza al enlace de retorno; el inicio queda en el nav) -->
    <section class="section cierre-section" aria-labelledby="cierre-heading">
{% include "partials/cierre.njk" %}
    </section>
  </main>
```

Su include JSON-LD, declarado en el front matter (`jsonld: "jsonld/proyectos-trace-group.njk"`):

**`src/_includes/jsonld/proyectos-trace-group.njk`** (32 líneas, verbatim)

```html
<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": "Trace Group — De la señal al servicio",
    "headline": "Un informe de verificación de emisiones fechado en 2032, y la plataforma que lo emite",
    "description": "¿Y si un cargamento de gas quedara afuera de Europa por su metano, y no por su precio? Este es ese escenario, y el objeto que lo hace tangible. Tres señales del sector energético argentino (Resolución 277/2025, el contrato de exportación de GNL entre Southern Energy y SEFE, el Reglamento de Metano de la Unión Europea) y un informe de verificación de emisiones de metano fechado en 2032, empaquetado como ejecutable, con normas reales donde corresponde. Provocación presentada a Trace Group (vía Clusterciar) en 2026.",
    "genre": "Design fiction",
    "inLanguage": "es-AR",
    "datePublished": "2026-09-04",
    "dateModified": "2026-09-04",
    "author": {
      "@type": "Organization",
      "name": "BPP Analytics & Design",
      "url": "https://www.bppanalyticsanddesign.com/"
    },
    "publisher": {
      "@type": "Organization",
      "name": "BPP Analytics & Design",
      "url": "https://www.bppanalyticsanddesign.com/",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.bppanalyticsanddesign.com/img/logo.webp"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://www.bppanalyticsanddesign.com/proyectos/trace-group/"
    }
  }
</script>
```

### 2.2 `/proyectos/natalidad/`

**`src/proyectos/natalidad/index.njk`** (455 líneas, verbatim)

```html
---
layout: "layouts/base.njk"
title: "Impacto de la caída de la natalidad en las matrículas escolares – BPP Analytics & Design"
description: "Caída de la natalidad y matrícula escolar: lo que analizamos para un colegio de la Ciudad de Buenos Aires, con un estudio regional de Areco y Giles, tres escenarios y cuatro líneas de trabajo. Caso BPP, 2025."
ogType: "article"
section: "proyectos"
ogTitle: "Impacto de la caída de la natalidad en las matrículas escolares"
ogDescription: "Caso 2025: lo que encontramos para el Colegio Francesco Faà di Bruno sobre natalidad y matrícula, con tres escenarios y cuatro líneas de trabajo, sobre series oficiales."
bodyClass: "reporte-page secondary-page page-lectura"
jsonld: "jsonld/natalidad.njk"
cierreTitulo: "Si tenés una decisión así encima, hablemos antes de la emergencia."
cierreCta: "Escribinos"
---
  <main id="main-content">

    <!-- Sticky TOC (Desktop) -->
    <aside class="sticky-toc" id="stickyToc" aria-label="Índice del reporte">
      <p class="toc-label">Navegación</p>
      <ul>
        <li><a href="#sec-contexto">Resumen ejecutivo</a></li>
        <li><a href="#sec-ficha">El caso en cuatro respuestas</a></li>
        <li><a href="#sec-contexto-general">Contexto general</a></li>
        <li><a href="#sec-metodologia">Metodología</a></li>
        <li><a href="#sec-escenarios">Escenarios</a></li>
        <li><a href="#sec-oportunidades">Oportunidades</a></li>
        <li><a href="#sec-estudio-regional">Estudio regional</a></li>
        <li><a href="#sec-recomendaciones">Recomendaciones</a></li>
      </ul>
      <!-- Rail de cifras (scrollytelling): la cifra se actualiza según la
           sección visible. Decorativo — duplica datos del contenido. -->
      <div class="toc-data-rail" id="dataRail" aria-hidden="true">
        <span class="data-rail-value">−42,8&nbsp;%</span>
        <span class="data-rail-label">población de 4 años en la Ciudad de Buenos Aires, 2016–2026</span>
      </div>
    </aside>

    <!-- Mobile TOC Button -->
    <button class="mobile-toc-btn" id="mobileTocBtn" aria-label="Abrir índice de navegación">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M3 4h18v2H3V4zm0 7h18v2H3v-2zm0 7h18v2H3v-2z"/>
      </svg>
    </button>

    <!-- Mobile TOC Overlay -->
    <div class="mobile-toc-overlay" id="mobileTocOverlay" aria-label="Navegación del reporte">
      <button class="close-btn" id="closeMobileToc" aria-label="Cerrar índice">×</button>
      <div class="toc-content">
        <p class="toc-title">Navegación del reporte</p>
        <ul class="report-toc-list editorial-list">
          <li><span class="editorial-arrow" aria-hidden="true">→</span> <a href="#sec-contexto">Resumen ejecutivo</a></li>
          <li><span class="editorial-arrow" aria-hidden="true">→</span> <a href="#sec-ficha">El caso en cuatro respuestas</a></li>
          <li><span class="editorial-arrow" aria-hidden="true">→</span> <a href="#sec-contexto-general">Contexto general</a></li>
          <li><span class="editorial-arrow" aria-hidden="true">→</span> <a href="#sec-metodologia">Metodología</a></li>
          <li><span class="editorial-arrow" aria-hidden="true">→</span> <a href="#sec-escenarios">Escenarios</a></li>
          <li><span class="editorial-arrow" aria-hidden="true">→</span> <a href="#sec-oportunidades">Oportunidades</a></li>
          <li><span class="editorial-arrow" aria-hidden="true">→</span> <a href="#sec-estudio-regional">Estudio regional</a></li>
          <li><span class="editorial-arrow" aria-hidden="true">→</span> <a href="#sec-recomendaciones">Recomendaciones</a></li>
        </ul>
      </div>
    </div>

    <!-- Share Buttons (Desktop) -->
    <div class="share-buttons" id="shareButtons">
      <a href="https://www.linkedin.com/sharing/share-offsite/?url=https://www.bppanalyticsanddesign.com/proyectos/natalidad/" target="_blank" rel="noopener noreferrer" aria-label="Compartir en LinkedIn">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      </a>
      <a href="https://twitter.com/intent/tweet?url=https://www.bppanalyticsanddesign.com/proyectos/natalidad/&text=Impacto%20de%20la%20ca%C3%ADda%20de%20la%20natalidad%20en%20las%20matr%C3%ADculas%20escolares" target="_blank" rel="noopener noreferrer" aria-label="Compartir en Twitter">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      </a>
      <a href="mailto:?subject=Reporte%20de%20Impacto%20-%20BPP&body=Te%20comparto%20este%20reporte%20sobre%20el%20impacto%20de%20la%20ca%C3%ADda%20de%20la%20natalidad:%20https://www.bppanalyticsanddesign.com/proyectos/natalidad/" aria-label="Compartir por email">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
        </svg>
      </a>
    </div>

    <!-- HERO DEL REPORTE -->
    <section class="hero-section section-wide">
      <p class="report-label">ANÁLISIS ESTRATÉGICO · 2025</p>
      <h1 class="tagline">Impacto de la caída de la natalidad <span class="h1-light">en las matrículas escolares</span></h1>
      <p class="hero-sub">
        En 2025 el Colegio Francesco Faà di Bruno nos pidió entender qué iba a pasar con su matrícula a medida que caen los nacimientos. Cruzamos series oficiales de la Ciudad, del país y de dos partidos bonaerenses, y construimos tres escenarios. Esto es lo que encontramos.
      </p>
      <p class="report-tags">
        Educación · Prospectiva · Datos &amp; escenarios
      </p>
      <dl class="ficha-tecnica">
        <div class="ficha-row"><dt>Año</dt><dd>2025</dd></div>
        <div class="ficha-row"><dt>Cliente</dt><dd>Colegio Francesco Faà di Bruno</dd></div>
        <div class="ficha-row"><dt>Campo</dt><dd>Natalidad y matrícula escolar</dd></div>
        <div class="ficha-row"><dt>Estado</dt><dd>Publicado</dd></div>
      </dl>
    
      <figure class="hero-figura">
        <img src="/img/aula-vacia.webp" srcset="/img/aula-vacia.webp 1200w, /img/aula-vacia-1800.webp 1800w" sizes="(max-width: 1200px) 100vw, 1008px" alt="Aula vacía de una escuela primaria de Buenos Aires, con sillas y pupitres en luz de tarde" width="1200" height="800" loading="eager" fetchpriority="high" decoding="async">
      </figure>
    </section>

    <!-- RESUMEN EJECUTIVO -->
    <section class="content-section reporte-section section-separator" id="sec-contexto">
      <article class="actividad-card actividad-card--light">
        <h2>Resumen ejecutivo</h2>
        <p><strong>Lo que ya estaba decidido:</strong><br>Menos nacimientos hoy = menos estudiantes mañana.<br>Los chicos que van a faltar en 2032 no nacieron en 2026. El dato ya está; la decisión, no.</p>
        <p>
          Partimos de un hecho que no se discute: la caída sostenida de la
          natalidad en Argentina está modificando de manera estructural el
          sistema educativo. Menos nacimientos hoy son menos estudiantes en los
          próximos años, con efectos directos sobre la planificación académica,
          el uso de la infraestructura, la sostenibilidad financiera y el rol
          social de las escuelas.
        </p>
        <p>
          Analizamos datos demográficos nacionales y regionales, proyectamos su
          impacto en la matrícula escolar y exploramos distintas opciones para el
          Colegio Francesco Faà di Bruno, con un estudio complementario de dos
          partidos de la provincia de Buenos Aires, San Antonio de Areco y San
          Andrés de Giles.
        </p>
        <p>
          Lo que pedía el colegio no era entender el problema: eran decisiones
          que se pudieran tomar ese mismo año, antes de que la caída llegara a
          las aulas.
        </p>
      </article>

      <!-- Pull Quote -->
      <div class="pull-quote">
        <p>Los chicos que van a faltar en 2032 no nacieron en 2026. El dato ya está; la decisión, no.</p>
      </div>

      <!-- STRIP DE KPIs -->
      <article class="actividad-card actividad-card--light">
        <h2>Las cifras que pesaron más</h2>
        <p>
          Antes de proyectar nada, ordenamos las series que sacan el problema
          del futuro y lo ponen en el presente. Seis datos.
        </p>

        <div class="impact-list">
          <ul>
            <li><strong>En la Ciudad de Buenos Aires:</strong> la población de 4 años pasó de 44.076 en 2016 a 25.201 proyectados para 2026, <strong>−42,8&nbsp;%</strong> (Gráfico 4, UEICEE).</li>
            <li><strong>En el estudio regional:</strong> los nacimientos cayeron <strong>−55,8&nbsp;%</strong> en San Antonio de Areco y <strong>−43,3&nbsp;%</strong> en San Andrés de Giles entre 2014 y 2024. Ambos partidos caen más fuerte que el promedio bonaerense.</li>
            <li><strong>En el país:</strong> los nacimientos bajaron <strong>−31,8&nbsp;%</strong> entre 2011 y 2021.</li>
            <li><strong>Matrícula primaria:</strong> la proyección oficial es de <strong>−27&nbsp;%</strong> entre 2025 y 2030, más de un millón de alumnos menos.</li>
            <li><strong>Variación regional:</strong> ninguna provincia se salva, pero el rango va de <strong>−19,4&nbsp;%</strong> en Santiago del Estero a <strong>−36,1&nbsp;%</strong> en Tierra del Fuego.</li>
            <li><strong>Tendencias en CABA y PBA:</strong> consolidación de grupos de edad más envejecidos y cohortes escolares más pequeñas.</li>
          </ul>
        </div>
        <p><strong>Traducido:</strong> para un colegio que no se adapta, esto son aulas vacías y una presión financiera que no se sostiene.</p>
        <p class="reporte-fuente"><em>Fuentes: nacimientos por partido, Ministerio de Salud de la provincia de Buenos Aires, dataset «Nacidos vivos» (serie 2005–2024). Nacimientos nacionales, DEIS, Ministerio de Salud de la Nación (serie 2011–2021). Proyección de matrícula, Dirección Nacional de Población–RENAPER, «Natalidad y educación en Argentina» (agosto de 2025); para las figuras de la Ciudad, UEICEE (Ministerio de Educación, GCABA) sobre Estadísticas Vitales. Todas son series oficiales; la lectura para el caso del colegio es nuestra.</em></p>
      </article>
    </section>

    <!-- FICHA DEL CASO: cuatro respuestas fijas + fuentes, antes del reporte largo -->
    <section class="content-section reporte-section section-separator ficha-caso" id="sec-ficha" aria-labelledby="ficha-heading">
      <h2 id="ficha-heading" class="ficha-caso-title">El caso en cuatro respuestas</h2>
      <dl class="ficha-caso-grid">
        <div class="ficha-caso-item"><dt>Qué nos pidieron</dt><dd>El Colegio Francesco Faà di Bruno, en la Ciudad de Buenos Aires, nos pidió entender qué iba a pasar con su matrícula a medida que caen los nacimientos. No querían un diagnóstico nacional: querían una lectura para su zona, más un estudio complementario de dos partidos bonaerenses, San Antonio de Areco y San Andrés de Giles, con decisiones que se pudieran tomar hoy.</dd></div>
        <div class="ficha-caso-item"><dt>Qué hicimos</dt><dd>Cruzamos las series de la Ciudad (población de 4 años y matrícula de nivel inicial, nacimientos por zona) con las nacionales y con un estudio regional de dos partidos, Areco y Giles, hecho sobre nacimientos por partido. Con eso construimos tres escenarios para el colegio, tendencial, transformador y disruptivo, y cuatro líneas de trabajo ordenadas. Ningún escenario es un pronóstico.</dd></div>
        <div class="ficha-caso-item"><dt>Qué pasó después</dt><dd>Entregamos el informe en 2025 junto con las recomendaciones de la sección 6. Lo que el colegio decidió después no forma parte de lo que publicamos.</dd></div>
        <div class="ficha-caso-item"><dt>Qué diríamos hoy</dt><dd>El dato que más pesó fue el de la Ciudad, no el nacional: la población de 4 años cae más del 40&nbsp;% en diez años y no todas las zonas caen igual, y eso cambia la urgencia. Lo que sigue faltando es el cruce entre la matrícula histórica del propio colegio y los nacimientos de su zona. Sin ese cruce, la proyección fina queda pendiente.</dd></div>
      </dl>
      <p class="ficha-caso-fuentes"><strong>Fuentes:</strong> Ministerio de Salud de la provincia de Buenos Aires, dataset «Nacidos vivos» por partido (serie 2005–2024); DEIS, Ministerio de Salud de la Nación, nacimientos nacionales (serie 2011–2021); Dirección Nacional de Población–RENAPER, «Natalidad y educación en Argentina» (agosto de 2025); para las figuras de la Ciudad, UEICEE (Ministerio de Educación, GCABA) sobre Estadísticas Vitales. Todas son series oficiales; la lectura para el caso del colegio es nuestra.</p>
    </section>

    <!-- CONTEXTO GENERAL -->
    <section class="content-section reporte-section section-separator" id="sec-contexto-general">
      <article class="actividad-card actividad-card--light">
        <h2>1. Contexto general</h2>
        <p><strong>Por qué esto no se revierte:</strong><br>La baja natalidad no es temporal. Es estructural. Y redefine quién sobrevive en el sistema educativo.</p>
        <p>
          El descenso de la fecundidad es un fenómeno prolongado en Argentina
          y en buena parte de la región. A medida que las familias tienen menos
          hijos y a edades más avanzadas, se reduce la cantidad de niñas y niños
          que ingresan al sistema educativo, especialmente en los primeros años
          de escolaridad.
        </p>
        <p>
          Esta dinámica no afecta a todas las instituciones por igual.
          Escuelas con propuestas más flexibles, servicios complementarios
          y una misión clara hacia sus comunidades están mejor posicionadas
          para sostener su matrícula o incluso crecer en nuevos segmentos.
        </p>
        <p>
          El Colegio Francesco Faà di Bruno, como muchas instituciones de
          inspiración religiosa, partía de una posición que no todas tienen:
          un capital simbólico fuerte, una comunidad consolidada y margen para
          diversificar su oferta frente a nuevas necesidades educativas y
          sociales. Fue lo primero que anotamos.
        </p>
      </article>

      <!-- DATOS DEMOGRÁFICOS Y MATRÍCULA -->
      <article class="actividad-card actividad-card--light">
        <div class="impact-top">
          <h3>1.1. Datos demográficos y efectos en la matrícula</h3>
        </div>
        <p>
          La baja natalidad se traduce, con algunos años de demora, en menor
          cantidad de alumnos en los niveles inicial y primario. Analizamos
          series históricas y proyecciones oficiales, vinculando nacimientos,
          población por edad y matrícula en distintos niveles educativos.
        </p>
          <figure class="figura">
            <div class="figura__papel"><img src="/img/CuadroMatriculaOptima.webp" alt="Gráfico 4: población de 4 años y matrícula de sala de 4 en la Ciudad de Buenos Aires, 2016 a 2026" width="1174" height="891" loading="lazy" decoding="async"></div>
            <figcaption>Población de 4 años y matrícula de sala de 4 (nivel inicial), Ciudad de Buenos Aires, 2016–2026; la línea punteada es proyección. Fuente indicada en el gráfico: Unidad de Evaluación Integral de la Calidad y Equidad Educativa (Ministerio de Educación del GCABA) y Estadísticas Vitales (Ministerio de Salud).</figcaption>
          </figure>
        <p class="impact-number-hero">−27&nbsp;%</p>
        <p>
          Es la caída proyectada de la matrícula primaria del país entre 2025
          y 2030, según la Dirección Nacional de Población. Más de un millón
          de alumnos. No es una hipótesis sobre 2035: son los chicos que ya
          nacieron, contados.
        </p>
        <div class="ficcion-aviso">
          <p><strong>Lo que esto significaba para el colegio:</strong></p>
          <ul class="impact-list">
            <li>→ Cursos más chicos cada año</li>
            <li>→ Aulas subutilizadas</li>
            <li>→ Más presión sobre costos fijos</li>
            <li>→ Necesidad de subir cuotas o ajustar gastos</li>
          </ul>
        </div>
        <p>
          El gráfico muestra cómo, aun sin cambios bruscos de contexto, la matrícula proyectada desciende año a año,
          obligando a las escuelas a repensar tamaños de curso, uso de aulas y planificación de personal docente.
        </p>
      </article>

      <!-- DISTRIBUCIÓN REGIONAL -->
      <article class="actividad-card actividad-card--light">
        <div class="impact-top">
          <h3>1.2. Diferencias regionales</h3>
        </div>
        <p class="impact-number-hero">−19&nbsp;% a −36&nbsp;%</p>
        <p>
          Es el rango de caída proyectada de matrícula primaria entre
          provincias, de Santiago del Estero a Tierra del Fuego. Ninguna
          se salva; lo que cambia es cuánto tiempo tiene cada una.
        </p>
        <figure class="figura">
          <div class="figura__papel">
            <picture>
              <source srcset="/img/MapaMatriculaOptima.webp 1024w" type="image/webp">
              <img src="/img/MapaMatriculaOptima.webp" alt="Mapa de la Ciudad de Buenos Aires dividido en zona norte, centro y sur, con nacimientos de 2012 y 2022 y tasa global de fecundidad por zona; la caída es mayor en el sur (−51,5 %) que en el norte (−30,2 %)." width="1024" height="741" loading="lazy" decoding="async">
            </picture>
          </div>
          <figcaption>Nacimientos (2012 y 2022) y tasa global de fecundidad por zona de la Ciudad de Buenos Aires: norte, centro y sur. Fuente indicada en el mapa: Unidad de Evaluación Integral de la Calidad y Equidad Educativa (Ministerio de Educación, GCABA) sobre Estadísticas Vitales del Ministerio de Salud y de la Dirección General de Estadística y Censos (GCABA).</figcaption>
        </figure>
        <p>
          El mapa muestra: algunas zonas tienen descensos moderados que se pueden gestionar.
          Otras concentran caídas pronunciadas que ponen en riesgo la continuidad de varias
          escuelas en un mismo territorio.
        </p>
      </article>
    </section>

    <!-- METODOLOGÍA -->
    <section class="content-section reporte-section section-separator" id="sec-metodologia">
      <article class="actividad-card actividad-card--light">
        <h2>2. Cómo construimos este análisis</h2>
        <p><strong>Cómo lo calculamos:</strong><br>Datos oficiales, contexto territorial y tres escenarios. Ninguno
        es un pronóstico: sirven para ordenar qué convenía decidir ese año y qué podía esperar.</p>
        <p>
          Combinamos tres enfoques, cada uno con su fuente:
        </p>
        <ul class="impact-list">
          <li><strong>Análisis de datos demográficos y educativos:</strong> uso de fuentes oficiales, series históricas y proyecciones para entender la evolución de nacimientos, población por edad y matrícula.</li>
          <li><strong>Perspectiva territorial:</strong> foco en la Ciudad de Buenos Aires, el área de influencia del Colegio Francesco Faà di Bruno y el estudio regional sobre San Antonio de Areco y San Andrés de Giles.</li>
          <li><strong>Enfoque prospectivo y estratégico:</strong> construcción de escenarios, identificación de riesgos y oportunidades, y formulación de líneas de acción posibles para las instituciones educativas.</li>
        </ul>
      </article>

      <!-- ESCUELAS CONFESIONALES -->
      <article class="actividad-card actividad-card--light">
        <div class="impact-top">
          <h3>2.1. Fortalezas de las escuelas religiosas que identificamos como ventaja</h3>
        </div>
        <p>
          En un contexto de caída de natalidad, las escuelas de inspiración
          religiosa tienen cartas que jugar. Anotamos cuatro:
        </p>
        <ul class="impact-list">
          <li>Tradición y sentido de pertenencia comunitaria.</li>
          <li>Propuestas formativas integrales (académicas, espirituales, sociales).</li>
          <li>Capacidad de articular redes de apoyo con parroquias, movimientos y organizaciones locales.</li>
          <li>Potencial para diversificar servicios educativos y comunitarios más allá de la jornada escolar clásica.</li>
        </ul>
        <p>
          El desafío que le planteamos al colegio: convertir estas fortalezas
          en decisiones concretas que sostuvieran matrícula, ampliaran alcance
          territorial y respondieran a nuevas demandas educativas.
        </p>
      </article>
    </section>

    <!-- ESCENARIOS -->
    <section class="content-section reporte-section section-separator" id="sec-escenarios">
      <article class="actividad-card actividad-card--light">
        <h2>3. Los escenarios que planteamos</h2>
        <p><strong>Tres escenarios, ninguno gratis:</strong><br>Los armamos para que el colegio pudiera ordenar qué cambiar ese año y qué dejar para después.</p>
        <p>
          A partir de los datos y del contexto institucional construimos tres escenarios orientativos.
          No son predicciones: son herramientas para pensar decisiones inmediatas con impacto en los próximos años.
        </p>
      </article>

      <div class="report-scenarios-grid">
        <!-- Escenario 1 - Accordion -->
        <div class="scenario-accordion">
          <h3 class="scenario-accordion-title">
            <button class="scenario-accordion-header" aria-expanded="false" aria-controls="scenario1Content">
              3.1. Escenario tendencial — sostener con lo mínimo
              <span class="toggle-icon" aria-hidden="true">▼</span>
            </button>
          </h3>
          <div class="scenario-accordion-content" id="scenario1Content">
            <p>
              El colegio mantiene su propuesta actual con pocos cambios. Se realizan ajustes graduales para adaptarse a la disminución de matrícula, pero sin transformaciones profundas.
            </p>
            <p><strong>CUÁNDO TIENE SENTIDO:</strong><br>Para un colegio cuya matrícula actual es sostenible por 5-7 años más
            y que prefiere cambios graduales a transformaciones abruptas.</p>
            <p><strong>QUÉ IMPLICA:</strong></p>
            <ul class="impact-list">
              <li>Matrícula en descenso progresivo, cursos más chicos, posible cierre de divisiones</li>
              <li>Uso de infraestructura por debajo de capacidad</li>
              <li>Mayor presión financiera, dependencia de aumentos de cuota</li>
              <li>Dificultad para incorporar nuevas familias o alcanzar nuevos perfiles</li>
            </ul>
          </div>
        </div>

        <!-- Escenario 2 - Accordion -->
        <div class="scenario-accordion">
          <h3 class="scenario-accordion-title">
            <button class="scenario-accordion-header" aria-expanded="false" aria-controls="scenario2Content">
              3.2. Escenario transformador — reconvertir para sostener
              <span class="toggle-icon" aria-hidden="true">▼</span>
            </button>
          </h3>
          <div class="scenario-accordion-content" id="scenario2Content">
            <p>
              El colegio impulsa cambios significativos en su propuesta educativa y en la forma de vincularse con la comunidad, manteniendo su identidad institucional.
            </p>
            <p><strong>CUÁNDO TIENE SENTIDO:</strong><br>Para un colegio que ve señales de caída próxima y quiere adelantarse
            con cambios que preserven su identidad y amplíen su alcance.</p>
            <p><strong>QUÉ IMPLICA:</strong></p>
            <ul class="impact-list">
              <li>Revisión de formatos pedagógicos y curriculares.</li>
              <li>Incorporación de talleres, actividades extracurriculares y servicios complementarios.</li>
              <li>Uso más eficiente de la infraestructura en distintos horarios.</li>
              <li>Apertura a alianzas con otras instituciones y organizaciones locales.</li>
            </ul>
          </div>
        </div>

        <!-- Escenario 3 - Accordion -->
        <div class="scenario-accordion">
          <h3 class="scenario-accordion-title">
            <button class="scenario-accordion-header" aria-expanded="false" aria-controls="scenario3Content">
              3.3. Escenario disruptivo — expandir la misión educativa
              <span class="toggle-icon" aria-hidden="true">▼</span>
            </button>
          </h3>
          <div class="scenario-accordion-content" id="scenario3Content">
            <p>
              El colegio se posiciona como un nodo educativo y comunitario ampliado. A partir de su identidad religiosa, diseña nuevas formas de acompañar trayectorias vitales y formativas en distintas etapas de la vida.
            </p>
            <p><strong>CUÁNDO TIENE SENTIDO:</strong><br>Para un colegio con capacidad de liderazgo para una transformación profunda
            y una comunidad dispuesta a explorar nuevas formas de hacer escuela.</p>
            <p><strong>QUÉ IMPLICA:</strong></p>
            <ul class="impact-list">
              <li>Propuestas educativas flexibles para infancias, adolescentes, adultos y personas mayores.</li>
              <li>Formación continua, actividades culturales y espacios comunitarios.</li>
              <li>Uso intensivo de infraestructura, incluyendo horarios extendidos y fines de semana.</li>
              <li>Modelo de sostenibilidad basado en múltiples fuentes de ingreso y alianzas estratégicas.</li>
            </ul>
            <p>
              <strong>NO SIGNIFICA</strong> abandonar la escuela actual, sino ampliar el alcance y la misión del colegio,
              combinando educación formal, acompañamiento comunitario y espacios de encuentro.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- OPORTUNIDADES Y ESTUDIO REGIONAL -->
    <section class="content-section reporte-section section-separator" id="sec-oportunidades">
      <article class="actividad-card actividad-card--light">
        <h2>4. Las oportunidades que identificamos</h2>
        <p><strong>Dónde quedaba margen:</strong><br>Aun con menos nacimientos, había espacio para innovar, abrir la escuela
        y fortalecer el rol del colegio en el territorio.</p>
        <p>
          Las cuatro que dejamos por escrito:
        </p>
        <ul class="impact-list">
          <li>→ Diseñar propuestas educativas que integren tecnología, acompañamiento personalizado y comunidad</li>
          <li>→ Abrir la escuela a nuevos públicos (familias, personas adultas mayores, jóvenes en formación laboral)</li>
          <li>→ Usar los datos de matrícula y demografía como insumo regular para la planificación institucional</li>
          <li>→ Articular redes con otras escuelas, parroquias y organizaciones sociales del territorio</li>
        </ul>
      </article>

      <article class="actividad-card actividad-card--light" id="sec-estudio-regional">
        <h2>5. Estudio demográfico regional</h2>
        <p><strong>Areco y Giles, en concreto:</strong><br>San Antonio de Areco y San Andrés de Giles muestran cómo se combinan
        baja natalidad y baja densidad poblacional.</p>
        <p>
          Complementamos el análisis con un estudio específico sobre San
          Antonio de Areco y San Andrés de Giles, dos partidos de la
          provincia de Buenos Aires que muestran cómo se manifiestan estas
          tendencias en contextos de menor densidad poblacional.
        </p>
        <p>
          El informe regional profundizó en:
        </p>
        <ul class="impact-list">
          <li>Evolución de la población total y de las cohortes en edad escolar.</li>
          <li>Distribución de la matrícula entre escuelas estatales y de gestión privada.</li>
          <li>Riesgos de cierre o subutilización de instituciones educativas.</li>
          <li>Posibles líneas de acción conjunta a nivel municipal y comunitario.</li>
        </ul>
      </article>
    </section>

    <!-- RECOMENDACIONES AL COLEGIO -->
    <section class="content-section reporte-section section-separator" id="sec-recomendaciones">
      <article class="actividad-card actividad-card--light">
        <h2>6. Lo que recomendamos</h2>
        <p>
          Le propusimos al Colegio Francesco Faà di Bruno cuatro líneas de
          trabajo al cerrar el estudio. Van en orden: cada una necesita la
          anterior.
        </p>
        <div class="impact-list">
          <ul>
            <li><strong>Profundizar con datos propios.</strong> Le pedimos cruzar la matrícula histórica del colegio con los nacimientos de su zona de la Ciudad. Nosotros trabajamos con series oficiales; la proyección fina exige los números internos de la institución.</li>
            <li><strong>Conversar con la comunidad.</strong> Que la discusión se abriera con equipo directivo, docentes y familias antes de que la caída de matrícula se convirtiera en una decisión de emergencia.</li>
            <li><strong>Probar a escala chica.</strong> Ensayar propuestas educativas o comunitarias nuevas mientras todavía hubiera margen financiero para que alguna fallara.</li>
            <li><strong>Planificar a cinco años.</strong> Un plan escrito que integrara misión, oferta y sostenibilidad, con los números adentro y revisión anual.</li>
          </ul>
        </div>
      </article>
    </section>

    <!-- CIERRE: afirmación + CTA (reemplaza al enlace de retorno; el inicio queda en el nav) -->
    <section class="section cierre-section" aria-labelledby="cierre-heading">
{% include "partials/cierre.njk" %}
    </section>
  </main>
```

Su include JSON-LD (`jsonld: "jsonld/natalidad.njk"`):

**`src/_includes/jsonld/natalidad.njk`** (32 líneas, verbatim)

```html
<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Report",
    "name": "Impacto de la caída de la natalidad en las matrículas escolares",
    "headline": "Impacto de la caída de la natalidad en las matrículas escolares",
    "description": "Caso 2025: lo que BPP Analytics & Design analizó para el Colegio Francesco Faà di Bruno sobre la caída de la natalidad en Argentina y su efecto en las matrículas escolares, con un estudio regional, tres escenarios y cuatro líneas de trabajo.",
    "inLanguage": "es-AR",
    "datePublished": "2025-04-01",
    "dateModified": "2025-04-01",
    "author": {
      "@type": "Organization",
      "name": "BPP Analytics & Design",
      "url": "https://www.bppanalyticsanddesign.com/"
    },
    "publisher": {
      "@type": "Organization",
      "name": "BPP Analytics & Design",
      "url": "https://www.bppanalyticsanddesign.com/",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.bppanalyticsanddesign.com/img/logo.webp"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://www.bppanalyticsanddesign.com/proyectos/natalidad/"
    }
  }
  
</script>
```

### 2.3 Layout y parciales que envuelven una página de proyecto

**`src/_includes/layouts/base.njk`** (66 líneas, verbatim)

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="color-scheme" content="dark">
    <meta name="description" content="{{ description }}">
    <meta name="author" content="{{ site.name }}">
    <meta name="robots" content="{{ robots or "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" }}">
    <title>{{ title }}</title>

    <link rel="canonical" href="{{ site.url }}{{ page.url }}">

    <meta property="og:type" content="{{ ogType or "website" }}">
    <meta property="og:url" content="{{ site.url }}{{ page.url }}">
    <meta property="og:title" content="{{ ogTitle or title }}">
    <meta property="og:description" content="{{ ogDescription or description }}">
    <meta property="og:image" content="{{ ogImage or site.ogImage }}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:locale" content="es_AR">
    <meta property="og:site_name" content="{{ site.name }}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{{ ogTitle or title }}">
    <meta name="twitter:description" content="{{ ogDescription or description }}">
    <meta name="twitter:image" content="{{ ogImage or site.ogImage }}">

    <link rel="icon" href="/favicon.svg" type="image/svg+xml">
    <link rel="icon" href="/favicon.ico" sizes="any">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
    <meta name="theme-color" content="#12151a">

    <meta http-equiv="Content-Security-Policy" content="{{ site.csp }}">
    <!-- Permissions-Policy solo funciona como header HTTP. GitHub Pages no permite headers
         propios; si algún día se pone Cloudflare adelante, va ahí y no acá. -->
    <meta name="referrer" content="strict-origin-when-cross-origin">

    <link rel="preconnect" href="https://plausible.io">
    {%- if homepage %}
    <link rel="preload" as="image" href="/img/logo.svg" type="image/svg+xml" fetchpriority="high">
    {%- endif %}
    <link rel="preload" href="/fonts/plus-jakarta-sans-latin.woff2" as="font" type="font/woff2" crossorigin>
    {%- if bodyClass and "page-lectura" in bodyClass %}
    <link rel="preload" href="/fonts/literata-latin.woff2" as="font" type="font/woff2" crossorigin>
    {%- endif %}
    <link rel="preload" href="/main.min.js" as="script">

    <link rel="stylesheet" href="/styles.min.css">
    <script defer data-domain="{{ site.plausibleDomain }}" src="https://plausible.io/js/script.js"></script>
    {%- if homepage %}
    <link rel="prefetch" href="/proyectos/" as="document">
    <link rel="prefetch" href="/pensamiento/" as="document">
    {%- endif %}
{% if jsonld %}{% include jsonld %}{% endif -%}
</head>
<body{% if bodyClass %} class="{{ bodyClass }}"{% endif %}>
    <a href="#main-content" class="skip-link" aria-label="Saltar navegación e ir directamente al contenido principal">Saltar al contenido principal</a>
{% include "partials/nav.njk" %}
{{ content | safe }}
{% include "partials/footer.njk" %}
    <script src="/main.min.js" defer></script>
</body>
</html>
```

**`src/_includes/partials/nav.njk`** (23 líneas, verbatim)

```html
<nav role="navigation" aria-label="Navegación principal de BPP Analytics &amp; Design" id="stickyNav">
    <div class="nav-container">
        <a href="/" class="nav-logo" id="navLogo" aria-label="BPP Analytics &amp; Design - Inicio">
            <img src="/img/logo.svg" alt="BPP Analytics &amp; Design" width="28" height="52" loading="eager" decoding="async" fetchpriority="high">
        </a>
        <button class="mobile-menu-btn" id="mobileMenuBtn" aria-label="Abrir menú de navegación" aria-expanded="false" aria-controls="navLinks">
            <span></span>
            <span></span>
            <span></span>
        </button>
        <ul class="nav-links" id="navLinks">
            <li><a href="/proyectos/"{% if section == "proyectos" %} aria-current="{{ 'page' if page.url == '/proyectos/' else 'true' }}"{% endif %}>Lo hecho</a></li>
            <li><a href="/pensamiento/"{% if section == "pensamiento" %} aria-current="{{ 'page' if page.url == '/pensamiento/' else 'true' }}"{% endif %}>Pensamiento</a></li>
            {%- if not homepage %}
            <li><a href="/#contact">Hablemos</a></li>
            {%- endif %}
        </ul>
        {%- if homepage %}
        <a href="#contact" class="nav-cta">Hablemos</a>
        {%- endif %}
    </div>
</nav>
```

**`src/_includes/partials/footer.njk`** (43 líneas, verbatim)

```html
<footer role="contentinfo">
  <div class="footer-grid">
    <div class="footer-left">
      <div class="footer-main-line">
        <span class="footer-brand">BPP Analytics &amp; Design</span>
        <span class="footer-separator">·</span>
        <span class="footer-copy">&copy; {{ buildYear }}</span>
      </div>
      <div class="footer-practice">
        <span class="footer-tagline">Investigación · Futuros · Datos e IA · Comunicación estratégica</span>
        <span class="footer-location">Buenos Aires — Madrid</span>
      </div>
      <div class="footer-links-line">
        <a href="mailto:bppanalyticsanddesign@gmail.com" class="footer-link">bppanalyticsanddesign@gmail.com</a>
        <span class="footer-separator">·</span>
        <a href="/privacidad/" class="footer-link">Política de Privacidad</a>
      </div>
    </div>
    <div class="social-icons">
      <a href="https://instagram.com/bppanalyticsanddesign" target="_blank" rel="noopener noreferrer" aria-label="Seguinos en Instagram">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      </a>
      <a href="https://www.linkedin.com/company/103852773" target="_blank" rel="noopener noreferrer" aria-label="Conectá con nosotros en LinkedIn">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      </a>
      <a href="https://www.youtube.com/channel/UCsyo1JTEY86Go8IaQO3_RtQ" target="_blank" rel="noopener noreferrer" aria-label="Seguinos en YouTube">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      </a>
      <a href="https://substack.com/@bppanalyticsdesign" target="_blank" rel="noopener noreferrer" aria-label="Leé nuestro newsletter en Substack">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z"/>
        </svg>
      </a>
    </div>
  </div>
</footer>
```

**`src/_includes/partials/cierre.njk`** (13 líneas, verbatim)

```html
{#- Cierre de página: afirmación centrada + CTA tipográfico.
    Variables (front matter): cierreTitulo, cierreTexto (opcional), cierreCta (texto del link, sin flecha), cierreHref (default /#contact).
    En Lo hecho y Pensamiento vive dentro de la última .section; en las páginas de caso va envuelto en su propia <section class="section cierre-section">. -#}
        <div class="proyectos-cta">
            <h3 id="cierre-heading" class="proyectos-cta-headline">{{ cierreTitulo }}</h3>
{%- if cierreTexto %}
            <p class="proyectos-cta-text">{{ cierreTexto }}</p>
{%- endif %}
            <a href="{{ cierreHref or '/#contact' }}" class="cta-primary" data-preview="Te responde uno de nosotros tres en 48 horas hábiles" aria-label="Escribinos">
                {{ cierreCta }} →
            </a>
        </div>
```

Datos globales que usa el layout (`{{ site.* }}`):

**`src/_data/site.json`** (8 líneas, verbatim)

```json
{
  "name": "BPP Analytics & Design",
  "url": "https://www.bppanalyticsanddesign.com",
  "ogImage": "https://www.bppanalyticsanddesign.com/img/og-image.jpg?v=2",
  "plausibleDomain": "bppanalyticsanddesign.com",
  "csp": "default-src 'self'; script-src 'self' https://plausible.io; style-src 'self'; font-src 'self'; img-src 'self' data:; connect-src 'self' https://plausible.io; base-uri 'self'; form-action 'none'; object-src 'self';"
}
```

---

## 3. Índice "Lo hecho"

No hay componente de tarjeta ni data file ni colección: las tarjetas son HTML escrito a mano dentro de `src/proyectos/index.njk`, un `<article class="actividad-entrada">` por proyecto. El orden es el orden del documento; no existe campo de destacado ni de orden. La página tiene dos secciones, `#casos` (trabajo para un cliente) y `#docencia` (clases y jornadas); un proyecto nuevo va en `#casos`.

### 3.1 Sección Casos completa, con la entrada de trace-group tal cual está escrita

Recorte de `src/proyectos/index.njk` desde el comentario `<!-- Casos` hasta el cierre de la sección:

```html
    <!-- Casos: trabajo para un cliente, con ficha y fuentes -->
    <section id="casos" class="section" aria-labelledby="casos-heading">
        <div class="senales-header">
            <h2 id="casos-heading" class="senales-title">Casos</h2>
            <p class="hero-sub hero-sub--seccion">Trabajo para una organización, con ficha, fuentes y estado. Lo que no tiene fuente no se publica.</p>
        </div>

        <div class="actividades-container">
            <article id="caso-trace-group" class="actividad-entrada" aria-label="Provocación para Trace Group: un informe de verificación de emisiones fechado en 2032">
                <div class="actividad-imagen">
                    <picture>
                        <source srcset="/img/we-trace-login-mobile.webp" type="image/webp" media="(max-width: 600px)">
                        <source srcset="/img/we-trace-login.webp 1200w" type="image/webp">
                        <img src="/img/we-trace-login.webp" alt="Pantalla de ingreso de we.trace, la plataforma de verificación de emisiones que emite el informe de 2032" loading="lazy" decoding="async" width="1200" height="898">
                    </picture>
                </div>
                <div class="actividad-texto">
                    <div class="actividad-meta">
                        <time class="actividad-fecha" datetime="2026-08">Agosto 2026</time>
                        <span class="actividad-separador"> · </span>
                        <span class="actividad-tags">Energía · Verificación de emisiones · 2032</span>
                    </div>
                    <h3>Trace Group — De la señal al servicio</h3>
                    <p class="actividad-descripcion">
                        ¿Y si un cargamento de gas quedara afuera de Europa por su metano, y no por su precio? Este es ese escenario, y el objeto que lo hace tangible.
                    </p>
                    <dl class="actividad-datos">
                        <div class="actividad-dato"><dt>Contexto</dt><dd>Trace Group, vía Clusterciar</dd></div>
                        <div class="actividad-dato"><dt>Estado</dt><dd>Provocación presentada, 2026</dd></div>
                        <div class="actividad-dato"><dt>Lectura</dt><dd>6 min</dd></div>
                    </dl>
                    <a
                      href="/proyectos/trace-group/"
                      class="cta-link"
                      aria-label="Ver la provocación Trace Group: de la señal al servicio"
                    >
                        Ver proyecto
                    </a>
                </div>
            </article>

            <article id="caso-natalidad" class="actividad-entrada" aria-label="Reporte sobre impacto de la caída de la natalidad en matrículas escolares">
                <div class="actividad-imagen">
                    <picture>
                        <source srcset="/img/aula-vacia-mobile.webp" type="image/webp" media="(max-width: 600px)">
                        <img src="/img/aula-vacia.webp" alt="Aula vacía de una escuela primaria de Buenos Aires, con sillas y pupitres en luz de tarde" width="1200" height="800" loading="lazy" decoding="async">
                    </picture>
                </div>
                <div class="actividad-texto">
                    <div class="actividad-meta">
                        <time class="actividad-fecha" datetime="2025-04">Abril 2025</time>
                        <span class="actividad-separador"> · </span>
                        <span class="actividad-tags">Educación · Análisis demográfico</span>
                    </div>
                    <h3>Impacto de la caída de la natalidad</h3>
                    <p class="actividad-descripcion">
                        Lo que la caída de la natalidad hace con la matrícula de un colegio, en tres escenarios y cuatro líneas de trabajo.
                    </p>
                    <dl class="actividad-datos">
                        <div class="actividad-dato"><dt>Contexto</dt><dd>Colegio de la Ciudad de Buenos Aires</dd></div>
                        <div class="actividad-dato"><dt>Estado</dt><dd>Entregado, 2025</dd></div>
                        <div class="actividad-dato"><dt>Lectura</dt><dd>11 min</dd></div>
                    </dl>
                    <a
                      href="/proyectos/natalidad/"
                      class="cta-link"
                      aria-label="Ir al reporte completo sobre el impacto de la caída de la natalidad en las matrículas escolares"
                    >
                        Ver proyecto
                    </a>
                </div>
            </article>
        </div>
    </section>
```

### 3.2 La misma tarjeta en la home

`src/index.njk` repite a mano un subconjunto de tarjetas en la sección `#actividades` ("Pensamiento y trabajo aplicado"), con el mismo markup. Entrada de trace-group:

```html
            <article class="actividad-entrada" data-tags="futuros,investigacion" aria-label="Provocación para Trace Group: un informe de verificación de emisiones fechado en 2032">
                <div class="actividad-imagen">
                    <picture>
                        <source srcset="/img/we-trace-login.webp 1200w" type="image/webp">
                        <img src="/img/we-trace-login.webp" alt="Pantalla de ingreso de we.trace, la plataforma de verificación de emisiones que emite el informe de 2032" loading="lazy" decoding="async" width="1200" height="898">
                    </picture>
                </div>
                <div class="actividad-texto">
                    <div class="actividad-meta">
                        <time class="actividad-fecha" datetime="2026-08">Agosto 2026</time>
                        <span class="actividad-separador"> · </span>
                        <span class="actividad-tags">Energía · Verificación de emisiones · 2032</span>
                    </div>
                    <h3>Trace Group — De la señal al servicio</h3>
                    <p class="actividad-descripcion">
                        ¿Y si un cargamento de gas quedara afuera de Europa por su metano, y no por su precio? Este es ese escenario, y el objeto que lo hace tangible.
                    </p>
                    <dl class="actividad-datos">
                        <div class="actividad-dato"><dt>Contexto</dt><dd>Trace Group, vía Clusterciar</dd></div>
                        <div class="actividad-dato"><dt>Estado</dt><dd>Provocación presentada, 2026</dd></div>
                        <div class="actividad-dato"><dt>Lectura</dt><dd>6 min</dd></div>
                    </dl>
                    <a
                      href="/proyectos/trace-group/"
                      class="cta-link"
                      aria-label="Ver la provocación Trace Group: de la señal al servicio"
                    >
                        Ver proyecto
                    </a>
                </div>
            </article>
```

### 3.3 Lista estructurada de la página Lo hecho

`src/_includes/jsonld/proyectos.njk` declara la `CollectionPage` con su `ItemList`; un proyecto nuevo se agrega ahí a mano:

**`src/_includes/jsonld/proyectos.njk`** (26 líneas, verbatim)

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "Lo hecho - BPP Analytics & Design",
  "description": "Casos, clases y jornadas de investigación, diseño de futuros, datos e IA y comunicación. Cada uno con fuente.",
  "url": "https://www.bppanalyticsanddesign.com/proyectos/",
  "publisher": { "@type": "Organization", "name": "BPP Analytics & Design", "url": "https://www.bppanalyticsanddesign.com/" },
  "mainEntity": {
    "@type": "ItemList",
    "itemListOrder": "https://schema.org/ItemListOrderDescending",
    "numberOfItems": 8,
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Trace Group. De la señal al servicio", "url": "https://www.bppanalyticsanddesign.com/proyectos/trace-group/" },
      { "@type": "ListItem", "position": 2, "name": "Impacto de la caída de la natalidad", "url": "https://www.bppanalyticsanddesign.com/proyectos/natalidad/" },
      { "@type": "ListItem", "position": 3, "name": "Cuando el artefacto piensa", "url": "https://www.bppanalyticsanddesign.com/proyectos/#docencia-ort" },
      { "@type": "ListItem", "position": 4, "name": "Otros Futuros: tutor invitado en defensa de proyecto IED Madrid", "url": "https://www.bppanalyticsanddesign.com/proyectos/#docencia-ied-defensa" },
      { "@type": "ListItem", "position": 5, "name": "Inhabiting the Future: charla outdoor en Matadero Madrid", "url": "https://www.bppanalyticsanddesign.com/proyectos/#docencia-matadero" },
      { "@type": "ListItem", "position": 6, "name": "Workshop LATAM·2036: diseñar futuros desde la fuga", "url": "https://www.bppanalyticsanddesign.com/proyectos/#docencia-ied-workshop" },
      { "@type": "ListItem", "position": 7, "name": "Jornada de diseño de futuros para la gestión pública", "url": "https://www.bppanalyticsanddesign.com/proyectos/#docencia-cesba" },
      { "@type": "ListItem", "position": 8, "name": "Masterclass sobre inteligencia artificial para diseñadores UX", "url": "https://www.bppanalyticsanddesign.com/proyectos/#docencia-udit" }
    ]
  }
}
</script>
```

### 3.4 Chequeo de CI

`scripts/check-site.mjs` corre en cada build (`npm run check`) y falla si falta una página de la lista `pages`. La página nueva se agrega a esa lista:

**`scripts/check-site.mjs`** (24 líneas, verbatim)

```js
// Chequeo mínimo del sitio generado: existen las páginas, no quedan rutas relativas
// rotas, y los assets críticos están en _site/. Corre en CI antes de publicar.
import { readFileSync, existsSync } from "node:fs";
const pages = ["index.html","proyectos/index.html","proyectos/trace-group/index.html","proyectos/natalidad/index.html","pensamiento/index.html","usina/tesis-01/index.html","privacidad/index.html","404.html","usina/index.html"];
const assets = ["styles.min.css","main.min.js","fonts/plus-jakarta-sans-latin.woff2","img/logo.svg","sitemap.xml","robots.txt","CNAME"];
let fail = 0;
for (const p of pages) {
  const f = `_site/${p}`;
  if (!existsSync(f)) { console.error(`falta ${f}`); fail++; continue; }
  const s = readFileSync(f, "utf8");
  if (p !== "usina/index.html") {
    for (const [name, re] of [["<title>", /<title>[^<]+<\/title>/], ["canonical", /rel="canonical"/], ["footer", /<footer/], ["main", /id="main-content"/], ["nav", /<nav /]]) {
      if (!re.test(s)) { console.error(`${f}: sin ${name}`); fail++; }
    }
    if (/"\.\.\//.test(s)) { console.error(`${f}: rutas relativas ../ residuales`); fail++; }
    for (const m of s.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
      try { JSON.parse(m[1]); } catch { console.error(`${f}: JSON-LD inválido`); fail++; }
    }
  }
}
for (const a of assets) if (!existsSync(`_site/${a}`)) { console.error(`falta _site/${a}`); fail++; }
if (fail) { console.error(`check-site: ${fail} problema(s)`); process.exit(1); }
console.log(`check-site: ${pages.length} páginas y ${assets.length} assets OK`);
```

### 3.5 Sitemap

`sitemap.xml` se edita a mano. Entrada actual de trace-group:

```xml
  <url>
    <loc>https://www.bppanalyticsanddesign.com/proyectos/trace-group/</loc>
    <lastmod>2026-06-09</lastmod>
    <priority>0.9</priority>
    <changefreq>monthly</changefreq>
  </url>
```

---

## 4. Estilos

No hay Tailwind ni config. Todo el CSS está en `src/styles.css` (4391 líneas). Abajo va, verbatim, lo que una página de proyecto necesita: primero las `@font-face` y los tokens de `:root`, después todas las reglas cuyo selector usa alguna clase o id presente en las dos páginas de proyecto y en `cierre.njk`, y por último las reglas de las tarjetas de Lo hecho. Las reglas se extrajeron por selector con css-tree, en el orden del archivo, con sus `@media` alrededor. Los breakpoints del sitio son cuatro y no se agregan otros: `min-width: 769px` (escritorio; `769–1024` es tablet), `1025px`, `1280px` y `1536px` (índice pegajoso de los casos).

### 4.1 Fuentes y tokens (`src/styles.css`, líneas 1 a 171)

```css
/* Literata self-hosted (variable: peso 400..700, tamaño óptico 7..72, subset latin).
   Solo para el cuerpo de lectura larga sobre papel (.page-lectura). Headings, labels,
   navegación y UI siguen en Plus Jakarta Sans. */
@font-face {
    font-family: 'Literata';
    font-style: normal;
    font-weight: 400 700;
    font-display: swap;
    src: url('fonts/literata-latin.woff2') format('woff2');
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
@font-face {
    font-family: 'Literata';
    font-style: italic;
    font-weight: 400 700;
    font-display: swap;
    src: url('fonts/literata-latin-italic.woff2') format('woff2');
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

/* Fallback con métricas ajustadas: mientras carga la webfont, Arial ocupa el mismo espacio
   y el layout no salta (antes vivía en el CSS crítico inline). */
@font-face {
    font-family: 'Plus Jakarta Sans Fallback';
    src: local('Arial');
    size-adjust: 106.5%;
    ascent-override: 89.8%;
    descent-override: 22.2%;
    line-gap-override: 0%;
}

/* Plus Jakarta Sans self-hosted (variable 400..700, subset latin). Sin dependencia de Google. */
@font-face {
    font-family: 'Plus Jakarta Sans';
    font-style: normal;
    font-weight: 400 700;
    font-display: swap;
    src: url('fonts/plus-jakarta-sans-latin.woff2') format('woff2');
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
@font-face {
    font-family: 'Plus Jakarta Sans';
    font-style: italic;
    font-weight: 400 700;
    font-display: swap;
    src: url('fonts/plus-jakarta-sans-latin-italic.woff2') format('woff2');
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

/* Plus Jakarta Sans se carga vía <link> en el <head> de cada página
   (evita la cadena render-blocking de @import dentro del CSS) */

/* =========================
   Reset & Variables
   ========================= */

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

.nav-container{width:100%;padding:0 6rem;display:flex;justify-content:space-between;align-items:center}

:root {
    /* Terracotta BPP - DESIGN.md: un solo acento, sin variantes de escala. */
    --orange-500: #c16f52;  /* Principal (brand) - terracotta desaturado */

    /* Base colors - Inclusive dark (lifted warm gray, no pure black) */
    --color-bg: #12151a;           /* Dark warm brown - lifted para reducir contraste extremo */
    --color-surface: #1a1e25;      /* Surface elevated - warm gray */
    --color-border: #2b313a;       /* Border - warm taupe, más visible */

    /* Text colors - Inclusive design (warm off-white unificado) */
    --color-text: #faf8f6;              /* Blanco cálido principal - reduce fatiga visual */
    --color-text-light: #faf8f6;        /* Unificado con primary */
    --color-text-secondary: rgba(250, 248, 246, 0.87);  /* Warm off-white con opacidad - WCAG AA */
    --color-text-muted: rgba(250, 248, 246, 0.65);      /* Muted pero mantiene temperatura cálida */
    /* Jerarquía de texto verificada sobre surface #1a1e25 (WCAG 2.1):
       high 0.95 → 15.6:1 · mid 0.75 → 9.4:1 · low 0.55 → 5.5:1 (mínimo para texto de cuerpo, AA)
       faint 0.40 → 3.6:1: SOLO texto grande (≥24px o ≥18.66px bold) o decorativo. Nunca cuerpo. */
    --color-text-high: rgba(250, 248, 246, 0.95);
    --color-text-mid: rgba(250, 248, 246, 0.75);
    --color-text-low: rgba(250, 248, 246, 0.55);
    --color-text-faint: rgba(250, 248, 246, 0.40);

    /* Accent colors (legacy compatibility) */
    --color-accent: var(--orange-500);
    --color-accent-bright: var(--orange-500);

    /* v2.3 — Superficie de lectura (body.page-lectura). Papel cálido, nunca
       blanco puro, para documentos largos. Contraste medido sobre --paper
       #f4efe8 (WCAG 2.1): ink-high 14.1:1 · ink-mid 8.3:1 · ink-low 5.5:1
       (piso para cuerpo y metadata) · accent-on-paper 5.2:1 · hover 6.9:1.
       #c16f52 da 3.2:1 sobre papel: solo texto ≥24px o ≥18.66px bold. */
    --paper: #f4efe8;                 /* superficie de lectura */

    /* Spacing Scale - 8px grid system (como Gmail, Figma, Tailwind) */
    --space-1: 0.25rem;   /* 4px - micro spacing */
    --space-2: 0.5rem;    /* 8px - tight spacing */
    --space-3: 0.75rem;   /* 12px - compact */
    --space-4: 1rem;      /* 16px - base unit */
    --space-5: 1.25rem;   /* 20px - comfortable */
    --space-6: 1.5rem;    /* 24px - relaxed */
    --space-8: 2rem;      /* 32px - spacious */
    --space-10: 2.5rem;   /* 40px - generous */
    --space-12: 3rem;     /* 48px - section gap */
    --space-16: 4rem;     /* 64px - large section */
    --space-20: 5rem;     /* 80px - extra large */
    --space-24: 6rem;     /* 96px - massive */

    /* Ritmo vertical entre bloques de <main> (mobile base; desktop en la media query de abajo).
       --spacing-section es el silencio total entre dos bloques; cada bloque aporta la mitad
       (--spacing-block) arriba y abajo. Hero → primer bloque y último bloque → footer usan
       --spacing-block-edge. Ver "Ritmo vertical" más abajo. */
    --spacing-section: 80px;             /* DESIGN.md: silencio visual entre bloques */
    --spacing-block: calc(var(--spacing-section) / 2);          /* 40px: mitad del gap, por lado */
    --spacing-block-edge: 64px;                                  /* hero → primer bloque, último → footer */
    --nav-height: 76px;                                          /* nav fijo: el hero descuenta esto para que el aire arriba sea real */
    --hero-top: calc(var(--nav-height) + var(--spacing-block-edge)); /* aire visible entre el nav y el primer texto del hero = edge */
    --spacing-hero-bottom: calc(var(--spacing-block-edge) - var(--spacing-block)); /* 24px: lo que aporta el hero */

    /* Horizontal padding scale (mobile-first) */
    --spacing-horizontal-mobile: var(--space-5);   /* 20px */
    --spacing-horizontal-tablet: var(--space-16);  /* 64px */
    --spacing-horizontal-desktop: var(--space-24); /* var(--space-24) */

    /* Typography - Escala optimizada para Plus Jakarta Sans */
    --font-size-base: 1.1875rem;  /* 19px — subido de 17px (feedback socios: tipografía chica) */

    /* Solo h1, h2, h3 diferenciados por tamaño - progresión armónica */
    --font-size-h3: clamp(1.875rem, 4vw, 2.375rem);      /* 26px → 32px */
    --font-size-h2: clamp(2.375rem, 5vw, 3.25rem);      /* 32px → 42px */
    --font-size-h1: clamp(3rem, 7vw, 4.5rem);      /* 42px → 56px */
    --font-size-display: clamp(4rem, 9vw, 5.5rem);   /* 56px → 72px - hero */

    /* Typography - Special (numbers, icons) */
    --font-size-number-sm: 2rem;
    --font-size-number-md: 2.5rem;
    --font-size-number-lg: 3rem;
    --font-size-icon: 1.75rem;

    /* Typography - Line heights */
    --line-height-heading: 1.2;
    --line-height-body: 1.8;  /* Increased for better readability */

    /* Typography - Font family - Plus Jakarta Sans (única, versátil) */
    --font-display: 'Plus Jakarta Sans', sans-serif;     /* Display */
    --font-heading: 'Plus Jakarta Sans', sans-serif;     /* Headings */
    --font-body: 'Plus Jakarta Sans', 'Plus Jakarta Sans Fallback', sans-serif;        /* Body */
    --font-label: 'Plus Jakarta Sans', sans-serif;      /* etiquetas y metadata; la mono se retiró en v2.1 */

    /* Borders & Shadows */
    --border-radius: 16px;             /* v2.2 soft: 8px → 16px */
    --border-card: 1px solid rgba(193, 111, 82, 0.12);  /* v2.2: susurro, no línea */
    --shadow-card: 0 24px 48px -28px rgba(0, 0, 0, 0.55);
    --shadow-card-hover: 0 28px 56px -24px rgba(0, 0, 0, 0.6), 0 0 40px -12px rgba(193, 111, 82, 0.22);

    /* Transitions */
    --transition-fast: 0.2s ease;
    --transition-normal: 0.3s ease;

    /* Z-index layers */
    --z-nav-mobile: 999;
    --z-nav-btn: 1001;
    --z-modal: 10000;

    /* Logo crossfade (Superflux pattern) - tunable */
    --nav-logo-height: 40px;
    --nav-transition: 0.3s;
}
```

### 4.2 Reglas que usan las páginas de proyecto

Clases tipográficas y de bloque que aparecen en trace-group y natalidad: h1 con `.tagline` y `.h1-light`, bajada `.hero-sub`, ficha `.ficha-caso` / `.ficha-row`, figuras `.figura` con `figcaption`, secciones `.content-section.reporte-section` con `.actividad-card` (variante `--light` para fondo claro), dato grande `.impact-top`, fuentes `.ficha-caso-fuentes`, índice pegajoso `.sticky-toc`, overlay móvil `.mobile-toc-overlay`, botones de compartir `.share-buttons`. El `bodyClass` de estas páginas es `reporte-page secondary-page page-lectura`: `page-lectura` activa Literata para la prosa larga.

```css
.hero-fullscreen + .section { padding-top: calc(var(--spacing-block-edge) - var(--space-6)); }

@media (min-width: 769px) {
    .hero-fullscreen + .section { padding-top: calc(var(--spacing-block-edge) - var(--space-12)); }
}

.tagline {
    font-family: var(--font-display);
    font-size: clamp(2.5rem, 7vw, 5rem); /* v2.2: escala editorial — el titular ES el hero */
    font-weight: 700;
    line-height: 1.08; /* v2.2: leading apretado a escala grande */
    margin-bottom: var(--space-8);
    letter-spacing: -0.01em; /* Looser en mobile - previene overflow */
    color: var(--color-text);
    hyphens: auto; /* Mobile: permite partir palabras si hace falta */
    word-break: normal; /* Mobile: wrapping natural */
    overflow-wrap: normal; /* Don't force wrap long words */
    max-width: 100%; /* Prevent overflow en mobile */
}

@media (min-width: 769px) {
    .tagline {
            font-size: var(--font-size-display);
            line-height: 1.05;
            letter-spacing: -0.04em;
            hyphens: none; /* No hyphenation - keep words complete */
            word-break: keep-all; /* Prevent breaking within words */
            max-width: 1200px; /* Ensure enough space for full title */
        }
}

.cta-primary {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    background: transparent;
    color: var(--color-accent);
    border: none;
    padding: var(--space-2) 0;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 1.0625rem;
    font-weight: 700;
    text-decoration: underline;
    text-decoration-color: rgba(193, 111, 82, 0.4);
    text-underline-offset: 4px;
    cursor: pointer;
    transition: color 0.2s ease, text-decoration-color 0.2s ease;
    min-height: 44px;
    text-align: left;
    /* Mobile: botones apilados a ancho completo */
    width: 100%;
    margin-bottom: var(--space-4);
}

@media (min-width: 769px) {
    .cta-primary {
            width: auto;
            margin-bottom: 0;
        }
}

.cta-primary:hover {
    color: var(--color-accent-bright);
    text-decoration-color: var(--color-accent);
}

.cta-primary .cta-arrow {
    display: inline-block;
    transition: transform 0.2s ease;
}

.cta-primary:hover .cta-arrow--left {
    transform: translateX(-4px);
}

@media (prefers-reduced-motion: reduce) {
    .cta-primary .cta-arrow {
            transition: none;
        }
    .cta-primary:hover .cta-arrow--left {
            transform: none;
        }
}

.section {
    padding: var(--spacing-block) var(--spacing-horizontal-mobile);
    max-width: 1400px;
    margin-left: auto;
    margin-right: auto;
}

.section-wide {
    max-width: 1600px;
}

@media (min-width: 769px) {
    .section {
            padding: var(--spacing-block) var(--space-24);
        }
}

.ficha-caso {
    /* Misma columna que las secciones: hereda ancho y padding lateral de .content-section;
       acá solo el ritmo vertical. Antes margin 0 horizontal la dejaba pegada al borde. */
    padding-top: var(--space-10);
    padding-bottom: var(--space-10);
    margin-top: var(--space-10);
    margin-bottom: var(--space-10);
    margin-left: auto;
    margin-right: auto;
    border-top: 1px solid var(--color-border);
    border-bottom: 1px solid var(--color-border);
}

.ficha-caso-title {
    font-size: 1.1875rem;
    font-weight: 700;
    color: var(--color-text-high);
    margin-bottom: var(--space-8);
}

.ficha-caso-grid {
    display: grid;
    gap: var(--space-6);
    margin: 0;
}

.ficha-caso-item dt {
    font-size: 0.9375rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--color-accent);
    margin-bottom: var(--space-2);
}

.ficha-caso-item dd {
    margin: 0;
    color: var(--color-text-mid);
    line-height: 1.65;
}

.ficha-caso-fuentes {
    margin-top: var(--space-8);
    font-size: 0.9375rem;
    line-height: 1.6;
    color: var(--color-text-low);
}

.ficha-caso-fuentes strong { color: var(--color-text-mid); font-weight: 700; }

.reporte-page .ficha-caso { margin: 0 auto; border: 0; }

.ficha-caso-fuentes a { color: inherit; text-decoration: underline; text-underline-offset: 3px; }

@media (min-width: 769px) {
    .ficha-caso-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--space-8) var(--space-12); }
}

.proyectos-cta {
    max-width: 900px;
    margin: var(--space-16) auto 0;
    padding: var(--space-12) 0;
    text-align: center;
    border-top: 1px solid rgba(250, 248, 246, 0.08);
}

.proyectos-cta-headline {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-weight: 700;
    font-size: var(--font-size-h2);
    color: rgba(250, 248, 246, 0.95);
    margin-bottom: var(--space-4);
}

.proyectos-cta-text {
    font-size: var(--font-size-base);
    color: rgba(250, 248, 246, 0.87);  /* WCAG AA compliant (antes 0.6) */
    margin-bottom: var(--space-8);
}

@media (min-width: 769px) and (max-width: 1024px) {
    .section {
            padding: var(--spacing-block) var(--spacing-horizontal-tablet);
        }
    .content-section {
            padding: var(--spacing-block) var(--spacing-horizontal-tablet);
        }
}

@media (max-width: 768px) {
    .hero, .section, main {
            width: 100%;
            max-width: 100%;
            overflow-x: clip;
        }
}

.impact-top {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.impact-top--spacing-md {
  margin-top: var(--space-8);
}

.impact-top--spacing-lg {
  margin-top: var(--space-10);
}

.text-spacing-md {
  margin-top: var(--space-6);
}

.impact-list {
  margin-top: var(--space-4);
  padding-left: var(--space-5);
}

.impact-list li {
  margin-bottom: var(--space-2);
}

.actividad-card--light {
  background: rgba(250, 248, 246, 0.02);
  border: 1px solid rgba(193, 111, 82, 0.45);
  padding: var(--space-8);
  border-radius: 8px;
}

.actividad-card--light h3 {
  color: var(--color-text);
}

.actividad-card--light ul {
  padding-left: var(--space-5);
}

.hero-section {
    position: relative;
    padding: var(--hero-top) var(--space-6) var(--spacing-hero-bottom);
    max-width: 1200px;
    margin: 0 auto;
    text-align: left;
}

.hero-section h1 {
    font-size: var(--font-size-h2);
    font-weight: 700;
    color: var(--color-text);
    margin-bottom: var(--space-3);
}

.hero-sub {
    font-size: var(--font-size-base);
    color: var(--color-text-secondary);
    max-width: 900px;
    text-wrap: balance;
}

.content-section {
    max-width: 1200px;
    margin: 0 auto;
    padding: var(--spacing-block) var(--spacing-horizontal-mobile);
    display: flex;
    flex-direction: column;
    gap: var(--space-8);
}

.reporte-section h2 {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: var(--font-size-h3);
    font-weight: 700;
    color: var(--color-text);
    text-align: left;
    line-height: var(--line-height-heading);
    margin-bottom: var(--space-4);
}

.reporte-section h3 {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: var(--font-size-base);
    font-weight: 700;
    color: var(--color-text);
    text-align: left;
    line-height: var(--line-height-heading);
    margin-bottom: var(--space-3);
}

.reporte-section p,
.reporte-section li {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: var(--font-size-base);
    font-weight: 400;
    color: rgba(250, 248, 246, 0.65);  /* antes .87 × opacity .75; el alfa va en un solo lugar */
    text-align: left;
    line-height: var(--line-height-body);
    max-width: 65ch;
}

@media (min-width: 769px) {
    .hero-section {
            padding: var(--hero-top) var(--space-8) var(--spacing-hero-bottom);
        }
    .content-section {
            padding: var(--spacing-block) var(--spacing-horizontal-desktop);
        }
}

.reporte-page .hero-section {
    /* Mismo padding lateral que .content-section: el hero, la ficha y las cards
       comparten un solo borde izquierdo. */
    padding: var(--hero-top) var(--spacing-horizontal-mobile) var(--spacing-hero-bottom);
    max-width: 1200px;
    margin: 0 auto;
    text-align: left;
}

@media (min-width: 769px) {
    .reporte-page .hero-section {
            padding-left: var(--space-24);
            padding-right: var(--space-24);
        }
}

.reporte-page .report-label {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: var(--font-size-base);
    color: var(--color-accent);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: var(--space-6);
}

.reporte-page .hero-section h1 {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: var(--font-size-h2);
    font-weight: 700;
    color: var(--color-text);
    text-align: left;
    line-height: var(--line-height-heading);
    margin-bottom: var(--space-3);
}

.reporte-page .hero-sub {
    font-size: var(--font-size-base);
    color: rgba(250, 248, 246, 0.65);
    max-width: 900px;
}

.reporte-page .report-tags {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: var(--font-size-base);
    color: rgba(250, 248, 246, 0.61);
    margin-top: var(--space-4);
}

.reporte-page .actividad-card--light {
    background: rgba(250, 248, 246, 0.02);
    border: 1px solid rgba(193, 111, 82, 0.4);
    border-radius: 8px;
}

.reporte-page .impact-number-hero {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: clamp(2.5rem, 5vw, 4rem);
    font-weight: 700;
    color: var(--color-accent);
    line-height: 1.1;
    margin: var(--space-6) 0;
}

.reporte-page .section-separator {
    /* La línea queda centrada en el silencio: --spacing-block arriba (padding del bloque
       anterior) y --spacing-block abajo (padding de .content-section). */
    border-top: 1px solid rgba(250, 248, 246, 0.08);
}

.report-scenarios-grid {
  display: grid;
  /* Antes: gap 32 + margin-bottom 24 de cada acordeón. Mismo espacio visible entre
     acordeones, pero sin margen colgando bajo el último (sumaba al gap entre bloques). */
  gap: calc(var(--space-8) + var(--space-6)) var(--space-8);
}

@media (min-width: 1025px) {
    .report-scenarios-grid {
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }
}

.report-toc-list {
  list-style: none;
  padding-left: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.report-toc-list li {
  display: flex;
  align-items: baseline;
  gap: var(--space-2);
}

.editorial-arrow {
  color: var(--color-text-muted);  /* Warm muted para decorativo */
  font-weight: 400;
  flex-shrink: 0;
}

.report-toc-list a {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: var(--font-size-base);
  font-weight: 400;
  color: rgba(250, 248, 246, 0.61);
  text-decoration: none;
  transition: color 0.3s ease;
}

.report-toc-list a:hover {
  color: var(--color-accent);
}

.reporte-page .cta-primary,
.legal-page .cta-primary {
  color: var(--color-accent);
}

.sticky-toc {
  position: fixed;
  top: 100px;
  right: var(--space-8);
  max-width: 280px;
  background: rgba(250, 248, 246, 0.02);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(193, 111, 82, 0.3);
  border-radius: 8px;
  padding: var(--space-6);
  z-index: 100;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s, visibility 0.3s;
}

.sticky-toc.visible {
  opacity: 1;
  visibility: visible;
}

.sticky-toc h3,
.sticky-toc .toc-label {
  font-size: var(--font-size-base);
  font-weight: 700;
  color: var(--color-accent);
  margin-bottom: var(--space-4);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.sticky-toc ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sticky-toc li {
  margin-bottom: var(--space-3);
}

.sticky-toc a {
  font-size: var(--font-size-base);
  color: var(--color-text-light);
  text-decoration: none;
  transition: color 0.3s;
  display: block;
  padding: var(--space-1) 0;
}

.sticky-toc a:hover,
.sticky-toc a.active {
  color: var(--color-accent);
  padding-left: var(--space-2);
}

.mobile-toc-btn {
  position: fixed;
  bottom: var(--space-8);
  right: var(--space-8);
  width: 56px;
  height: 56px;
  background: var(--color-accent);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  display: none;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s, background 0.3s;
}

.mobile-toc-btn:hover {
  background: var(--color-accent-bright);
}

.mobile-toc-btn svg {
  width: 24px;
  height: 24px;
  fill: #12151a;
}

.mobile-toc-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(18, 21, 26, 0.95);
  z-index: 9998;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s, visibility 0.3s;
  overflow-y: auto;
  padding: var(--space-8);
}

.mobile-toc-overlay.active {
  opacity: 1;
  visibility: visible;
}

.mobile-toc-overlay .toc-content {
  max-width: 600px;
  margin: 0 auto;
  padding-top: var(--space-8);
}

.mobile-toc-overlay .toc-title {
  font-family: var(--font-display);
  font-size: var(--font-size-h2);
  font-weight: 700;
  letter-spacing: 0;
  line-height: 1.2;
  color: var(--color-text);
  text-wrap: balance;
  margin: 0 0 var(--space-5);
}

.mobile-toc-overlay .close-btn {
  position: absolute;
  top: var(--space-6);
  right: var(--space-6);
  background: transparent;
  border: none;
  color: var(--color-accent);
  font-size: 2rem;
  cursor: pointer;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pull-quote {
  margin: var(--space-8) 0; /* Mobile base */
  padding: 1.5rem 1.5rem var(--space-6) var(--space-8); /* Mobile base */
  background: rgba(250, 248, 246, 0.04);
  border-radius: 8px;
  position: relative;
}

.pull-quote::before {
  content: '"';
  position: absolute;
  top: -10px;
  left: var(--space-5);
  font-size: 5rem;
  color: var(--color-accent);
  opacity: 0.3;
  font-family: Georgia, serif;
  line-height: 1;
}

.pull-quote p {
  font-size: var(--font-size-base);
  font-weight: 700;
  color: var(--color-text);
  margin: 0;
  position: relative;
  z-index: 1;
}

.scenario-accordion {
  margin-bottom: 0;  /* la separación la pone el row-gap de .report-scenarios-grid */
}

.scenario-accordion-title {
  margin: 0;
}

.scenario-accordion-header {
  width: 100%;
  background: rgba(250, 248, 246, 0.02);
  border: 1px solid rgba(193, 111, 82, 0.4);
  border-radius: 8px;
  padding: var(--space-5) var(--space-6); /* Mobile base */
  text-align: left;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-3);
  transition: background-color 0.3s ease, border-color 0.3s ease;
  margin-bottom: 0;
  font-family: inherit;
  font-size: var(--font-size-base);
  font-weight: inherit;
  color: var(--color-text);
}

.scenario-accordion-header:hover {
  background: rgba(193, 111, 82, 0.05);
  border-color: var(--color-accent);
}

.scenario-accordion-header.active {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  border-bottom-color: transparent;
}

.scenario-accordion-header .toggle-icon {
  font-size: 1.5rem;
  color: var(--color-accent);
  transition: transform 0.3s;
}

.scenario-accordion-header.active .toggle-icon {
  transform: rotate(180deg);
}

.scenario-accordion-content {
  max-height: 0;
  overflow: hidden;
  visibility: hidden; /* colapsado de verdad: fuera del árbol de accesibilidad y del orden de tabulación */
  transition: max-height 0.4s ease-out, padding 0.4s ease-out, visibility 0.4s;
  background: rgba(250, 248, 246, 0.02);
  border: 1px solid rgba(193, 111, 82, 0.4);
  border-top: none;
  border-bottom-left-radius: var(--space-3);
  border-bottom-right-radius: var(--space-3);
  padding: 0 var(--spacing-horizontal-mobile); /* Mobile base */
}

.scenario-accordion-content.active {
  max-height: 2000px;
  visibility: visible;
  padding: var(--space-5) var(--space-6); /* Mobile base */
}

.reporte-page .hero-section {
  position: relative;
  overflow: hidden;
    padding-top: var(--hero-top);
}

.share-buttons {
  position: fixed;
  left: var(--space-8);
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  z-index: 100;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s, visibility 0.3s;
}

.share-buttons.visible {
  opacity: 1;
  visibility: visible;
}

.share-buttons a {
  width: 44px;
  height: 44px;
  background: rgba(250, 248, 246, 0.05);
  border: 1px solid rgba(193, 111, 82, 0.3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease, transform 0.3s ease;
  text-decoration: none;
}

.share-buttons a:hover {
  background: var(--color-accent);
  border-color: var(--color-accent);
}

.share-buttons svg {
  width: 20px;
  height: 20px;
  fill: var(--color-text-light);
  transition: fill 0.3s;
}

.share-buttons a:hover svg {
  fill: #12151a;
}

@media (max-width: 1535px) {
    .sticky-toc {
        display: none;
      }
    .mobile-toc-btn {
        display: flex;
      }
    .share-buttons {
        display: none;
      }
}

@media (min-width: 769px) {
    .pull-quote {
        padding: var(--space-8) var(--space-10);
        margin: var(--space-12) 0;
      }
    .scenario-accordion-header {
        padding: var(--space-6) var(--space-8);
      }
    .scenario-accordion-content {
        padding: 0 var(--space-8);
      }
    .scenario-accordion-content.active {
        padding: var(--space-6) var(--space-8);
      }
}

.h1-light {
  font-weight: inherit;
}

@media (prefers-reduced-motion: no-preference) {
    .cta-primary {
        transition: color 0.2s ease, text-decoration-color 0.2s ease, font-weight 0.25s ease;
      }
    .cta-primary:hover {
        font-weight: 700;
      }
}

.toc-data-rail {
    display: none;
}

@media (min-width: 1536px) {
    .toc-data-rail {
            display: block;
            margin-top: var(--space-5);
            padding-top: var(--space-5);
            border-top: 1px solid rgba(250, 248, 246, 0.06);
        }
    .data-rail-value {
            display: block;
            font-size: 2.25rem;
            font-weight: 700;
            line-height: 1.05;
            letter-spacing: -0.01em;
            font-variant-numeric: tabular-nums;
            color: var(--color-accent);
        }
    .data-rail-label {
            display: block;
            margin-top: var(--space-2);
            font-size: 0.9375rem;
            font-weight: 400;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            line-height: 1.5;
            color: rgba(250, 248, 246, 0.55);
        }
}

@media (prefers-reduced-motion: no-preference) {
    .data-rail-value,
        .data-rail-label {
            transition: opacity 0.18s ease;
        }
    .toc-data-rail.is-switching .data-rail-value,
        .toc-data-rail.is-switching .data-rail-label {
            opacity: 0;
        }
}

.ficha-tecnica {
    margin: var(--space-8) 0 0;
    max-width: 560px;
}

.ficha-row {
    display: flex;
    align-items: baseline;
    gap: var(--space-4);
    padding: var(--space-2) 0;
    border-top: 1px solid rgba(250, 248, 246, 0.06);
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 0.9375rem;
    font-weight: 400;
    letter-spacing: 0.08em;
    text-transform: uppercase;
}

.ficha-row:last-child {
    border-bottom: 1px solid rgba(250, 248, 246, 0.06);
}

.ficha-row dt {
    flex: 0 0 6.5rem;
    color: rgba(250, 248, 246, 0.55);
}

.ficha-row dd {
    margin: 0;
    color: rgba(250, 248, 246, 0.75);
}

.reporte-fuente {
  font-size: 0.9375rem;
  line-height: 1.55;
  color: rgba(250, 248, 246, 0.55);
  border-top: 1px solid rgba(250, 248, 246, 0.06);
  padding-top: var(--space-3);
  margin-top: var(--space-4);
}

.ficcion-aviso {
  background: var(--color-surface);
  border-left: 3px solid var(--orange-500);
  border-radius: 0 var(--border-radius) var(--border-radius) 0;
  padding: var(--space-5) var(--space-6);
  margin: var(--space-6) 0;
  color: rgba(250, 248, 246, 0.85);
}

.ficcion-aviso strong {
  color: var(--color-accent);
}

.page-lectura main > :is(.reporte-section, .thesis-abstract-section, .thesis-cover-section, .thesis-cite-section, .legal-content) :is(p, li, dd, blockquote, figcaption, td) {
    font-family: 'Literata', Georgia, 'Times New Roman', serif;
    font-optical-sizing: auto;
    font-size: 1.1875rem; /* 19px: la base del sitio, sin heredar los 16px viejos de .reporte-section */
    line-height: 1.7;
}

.page-lectura main > :is(.reporte-section, .thesis-abstract-section, .thesis-cover-section, .thesis-cite-section, .legal-content) :is(p, li, dd, blockquote) strong { font-weight: 700; }

.page-lectura main > :is(.reporte-section, .thesis-abstract-section, .thesis-cover-section, .thesis-cite-section, .legal-content) :is(p, li, dd, blockquote) em { font-style: italic; }

.page-lectura main > :is(.reporte-section, .thesis-abstract-section, .thesis-cover-section, .thesis-cite-section, .legal-content) :is(.ficha-caso-fuentes, .reporte-fuente, .senal-fuente, .cta-primary, .cta-link, .btn, .ficha-caso dt, .toc-data-rail, .sticky-toc, .share-buttons, .thesis-cite__note, .impact-label, .escenario-label, .senal-label) ,
.page-lectura main > :is(.reporte-section, .thesis-abstract-section, .thesis-cover-section, .thesis-cite-section, .legal-content) :is(nav, button, label, .senal-label) * {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: inherit;
    line-height: inherit;
}

.contact-address > :last-child,
.contact-direct > :last-child,
.content-section > :last-child,
.thesis-abstract > :last-child,
.legal-hero > :last-child,
.legal-content > :last-child { margin-bottom: 0; }

.content-section > :last-child > .cta-primary { margin-bottom: 0; }

.reporte-section .scenario-accordion-title { margin: 0; }

.hero-section .actividades-label { margin-top: 0; }

.cierre-section .proyectos-cta { margin-top: 0; }

.proyectos-cta-headline {
    line-height: 1.15;
    text-wrap: balance;
}

.figura {
    margin: var(--space-6) 0;
}

.figura img {
    display: block;
    max-width: 100%;
    height: auto;
}

.figura__papel {
    background: var(--paper);
    padding: var(--space-4);
    border-radius: var(--border-radius);
}

.figura__papel img {
    display: block;
    width: 100%;
    height: auto;
    border-radius: calc(var(--border-radius) - 6px);
    mix-blend-mode: multiply;
}

.figura figcaption,
.page-lectura main .figura figcaption {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 1rem;
    line-height: 1.5;
    color: var(--color-text-low);
    margin-top: var(--space-3);
}

.thesis-cover-links .cta-primary { margin: 0; }

.mobile-toc-btn {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    transition: border-color 0.3s;
}

.mobile-toc-btn:hover,
.mobile-toc-btn:focus-visible {
    background: var(--color-surface);
    border-color: var(--color-accent);
}

.mobile-toc-btn svg { fill: var(--color-accent); }

.hero-section h1.tagline { margin-bottom: 1.5rem; }

.hero-section .hero-sub { max-width: 800px; margin: 0 auto; }

@media (pointer: coarse) {
    .nav-links a, .filter-btn, .cta-link, .sticky-toc a, .report-toc-list a, [role="navigation"] a {
            min-height: 44px;
            display: inline-flex;
            align-items: center;
        }
    .close-btn { min-width: 44px; min-height: 44px; }
}

.hero-figura {
    margin: var(--space-10) 0 0;
    border-radius: var(--border-radius);
    overflow: hidden;
    border: 1px solid var(--color-border);
    background: var(--color-surface);
}

.hero-figura img { display: block; width: 100%; height: auto; }
```

### 4.3 Reglas de las tarjetas de Lo hecho

```css
h1,
h2,
h3,
h4,
h5,
h6,
.service-title,
.service-category,
.actividad-meta,
.actividades-label,
.contact-label,
button {
    hyphens: none;
}

.hero-fullscreen + .section { padding-top: calc(var(--spacing-block-edge) - var(--space-6)); }

@media (min-width: 769px) {
    .hero-fullscreen + .section { padding-top: calc(var(--spacing-block-edge) - var(--space-12)); }
}

.tagline {
    font-family: var(--font-display);
    font-size: clamp(2.5rem, 7vw, 5rem); /* v2.2: escala editorial — el titular ES el hero */
    font-weight: 700;
    line-height: 1.08; /* v2.2: leading apretado a escala grande */
    margin-bottom: var(--space-8);
    letter-spacing: -0.01em; /* Looser en mobile - previene overflow */
    color: var(--color-text);
    hyphens: auto; /* Mobile: permite partir palabras si hace falta */
    word-break: normal; /* Mobile: wrapping natural */
    overflow-wrap: normal; /* Don't force wrap long words */
    max-width: 100%; /* Prevent overflow en mobile */
}

@media (min-width: 769px) {
    .tagline {
            font-size: var(--font-size-display);
            line-height: 1.05;
            letter-spacing: -0.04em;
            hyphens: none; /* No hyphenation - keep words complete */
            word-break: keep-all; /* Prevent breaking within words */
            max-width: 1200px; /* Ensure enough space for full title */
        }
}

.cta-link {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    color: var(--color-accent) !important;
    text-decoration: none;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 1rem;
    font-weight: 400;
    background: none !important;
    border: none;
    padding: 0;
    cursor: pointer;
    transition: opacity 0.3s ease, text-shadow 0.3s ease;
}

.cta-link::after {
    content: '→';
}

.cta-link:hover {
    opacity: 0.85;
}

.section {
    padding: var(--spacing-block) var(--spacing-horizontal-mobile);
    max-width: 1400px;
    margin-left: auto;
    margin-right: auto;
}

.section-wide {
    max-width: 1600px;
}

@media (min-width: 769px) {
    .section {
            padding: var(--spacing-block) var(--space-24);
        }
}

.services-grid,
.actividades-container {
    max-width: 1400px;  /* Estandarizado (era 1080px) */
    margin-left: auto;
    margin-right: auto;
    padding-left: 0;  /* El padding viene del contenedor padre ahora */
    padding-right: 0;
}

@media (min-width: 1280px) {
    .services-grid,
    .actividades-container {
            max-width: 1180px;
        }
}

.actividad-entrada.hidden {
    display: none;
}

.actividades-label {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: var(--font-size-base);
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--color-text);  /* Blanco puro, border naranja como marca */
    opacity: 1;
    padding-left: var(--space-6);
    margin-top: var(--space-8);
    margin-bottom: var(--space-12);
}

.actividades-container {
    display: flex;
    flex-direction: column;
}

.actividad-entrada {
    display: grid;
    grid-template-columns: 1fr;
    grid-auto-rows: auto;
    gap: 0;
    align-items: stretch;
    min-height: auto;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--border-radius);
    overflow: hidden;  /* una sola tarjeta: imagen y texto en el mismo recuadro */
}

.actividad-entrada:nth-child(even) {
    grid-template-columns: 1fr;
}

.actividad-entrada:nth-child(even) .actividad-imagen {
    order: -1;  /* Always first on mobile */
}

.actividad-entrada:nth-child(even) .actividad-texto {
    order: 0;  /* Always second on mobile */
}

.actividad-imagen {
    overflow: hidden;
    height: auto;
    aspect-ratio: 16 / 9;  /* Las ilustraciones son 16:9: se ven enteras, sin recorte */
    order: -1;  /* Always first on mobile */
}

.actividad-entrada {
    opacity: 1;
    transform: translateY(0);
    transition: opacity 0.6s ease, transform 0.6s ease;
}

@media (prefers-reduced-motion: reduce) {
    .actividad-entrada {
            opacity: 1 !important;
            transform: none !important;
            transition: none !important;
        }
}

.actividad-imagen img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

.actividad-texto {
    padding: var(--space-5) var(--space-5);  /* Reducido de --space-8: menos altura en mobile */
    display: flex;
    flex-direction: column;
    justify-content: center;
    background: transparent;
    order: 0;  /* Always second on mobile */
}

.actividad-meta {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: var(--font-size-base);
    text-transform: uppercase;
    margin-bottom: var(--space-3);
}

.actividad-fecha {
    color: var(--color-text-muted);  /* Warm muted para meta secundaria */
}

.actividad-separador {
    color: var(--color-text-muted);  /* Warm muted para separador */
}

.actividad-tags {
    color: var(--color-text-muted);  /* Warm muted para tags */
}

.actividad-entrada h3 {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: var(--font-size-h3);
    font-weight: 700;
    color: var(--color-text);
    opacity: 1;
    line-height: 1.3;
    margin-top: var(--space-3);
}

.actividad-descripcion {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: var(--font-size-base);
    font-weight: 400;
    color: var(--color-text);
    opacity: 0.75;
    line-height: 1.6;
    margin-top: var(--space-3);
}

.actividad-entrada {
    position: relative;
}

@media (min-width: 769px) {
    .actividad-entrada {
            grid-template-columns: 1.5fr 1fr;  /* imagen más ancha = más alta: iguala la altura del texto */
            min-height: 0;
            align-items: stretch;
        }
    .actividad-entrada:nth-child(even) {
            grid-template-columns: 1fr 1.5fr;
        }
    .actividad-entrada:nth-child(even) .actividad-imagen {
            order: 2;  /* Right side on even cards */
        }
    .actividad-entrada:nth-child(even) .actividad-texto {
            order: 1;  /* Left side on even cards */
        }
    .actividad-imagen {
            height: auto;
            align-self: stretch;
            position: relative;
            aspect-ratio: auto;
            min-height: 0;
            order: 0;  /* Default order on desktop */
        }
    .actividad-texto {
            padding: var(--space-8) var(--space-10);
            order: 0;  /* Default order on desktop */
        }
}

@media (min-width: 769px) and (max-width: 1024px) {
    .section {
            padding: var(--spacing-block) var(--spacing-horizontal-tablet);
        }
}

@media (max-width: 768px) {
    .hero, .section, main {
            width: 100%;
            max-width: 100%;
            overflow-x: clip;
        }
}

.hero-section {
    position: relative;
    padding: var(--hero-top) var(--space-6) var(--spacing-hero-bottom);
    max-width: 1200px;
    margin: 0 auto;
    text-align: left;
}

.hero-section h1 {
    font-size: var(--font-size-h2);
    font-weight: 700;
    color: var(--color-text);
    margin-bottom: var(--space-3);
}

.hero-sub {
    font-size: var(--font-size-base);
    color: var(--color-text-secondary);
    max-width: 900px;
    text-wrap: balance;
}

@media (min-width: 769px) {
    .hero-section {
            padding: var(--hero-top) var(--space-8) var(--spacing-hero-bottom);
        }
}

.reporte-page .hero-section {
    /* Mismo padding lateral que .content-section: el hero, la ficha y las cards
       comparten un solo borde izquierdo. */
    padding: var(--hero-top) var(--spacing-horizontal-mobile) var(--spacing-hero-bottom);
    max-width: 1200px;
    margin: 0 auto;
    text-align: left;
}

@media (min-width: 769px) {
    .reporte-page .hero-section {
            padding-left: var(--space-24);
            padding-right: var(--space-24);
        }
}

.reporte-page .hero-section h1 {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: var(--font-size-h2);
    font-weight: 700;
    color: var(--color-text);
    text-align: left;
    line-height: var(--line-height-heading);
    margin-bottom: var(--space-3);
}

.reporte-page .hero-sub {
    font-size: var(--font-size-base);
    color: rgba(250, 248, 246, 0.65);
    max-width: 900px;
}

.senales-header {
    margin-bottom: var(--space-12);
    text-align: center;
}

.senales-title {
    font-family: var(--font-heading);
    font-size: var(--font-size-h2);
    font-weight: 700;
    color: var(--color-text);
    line-height: var(--line-height-heading);
}

.reporte-page .hero-section {
  position: relative;
  overflow: hidden;
    padding-top: var(--hero-top);
}

.h1-light {
  font-weight: inherit;
}

@media (prefers-reduced-motion: no-preference) {
    .cta-link {
        transition: opacity 0.2s ease, font-weight 0.25s ease;
      }
    .cta-link:hover {
        font-weight: 700;
      }
}

@media (min-width: 1025px) {
    .actividad-entrada {
            width: 95%;
            margin-right: auto;   /* impares: hacia la izquierda */
        }
    .actividad-entrada:nth-child(even) {
            margin-right: 0;
            margin-left: auto;    /* pares: hacia la derecha */
        }
    .actividad-entrada + .actividad-entrada {
            margin-top: var(--space-16);
        }
}

.actividad-entrada + .actividad-entrada { margin-top: var(--space-10); }

@media (min-width: 769px) and (max-width: 1024px) {
    .actividad-entrada + .actividad-entrada { margin-top: var(--space-12); }
}

.actividad-imagen img {
  filter: sepia(0.12) saturate(0.95);
}

.page-lectura main > :is(.reporte-section, .thesis-abstract-section, .thesis-cover-section, .thesis-cite-section, .legal-content) :is(.ficha-caso-fuentes, .reporte-fuente, .senal-fuente, .cta-primary, .cta-link, .btn, .ficha-caso dt, .toc-data-rail, .sticky-toc, .share-buttons, .thesis-cite__note, .impact-label, .escenario-label, .senal-label) ,
.page-lectura main > :is(.reporte-section, .thesis-abstract-section, .thesis-cover-section, .thesis-cite-section, .legal-content) :is(nav, button, label, .senal-label) * {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: inherit;
    line-height: inherit;
}

@media (min-width: 769px) {
    .actividad-imagen img {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            object-fit: contain;
        }
}

.hero-section .actividades-label { margin-top: 0; }

.hero-section h1.tagline { margin-bottom: 1.5rem; }

.hero-section .hero-sub { max-width: 800px; margin: 0 auto; }

.hero-sub--seccion { margin: var(--space-3) auto 0; }

@media (pointer: coarse) {
    .nav-links a, .filter-btn, .cta-link, .sticky-toc a, .report-toc-list a, [role="navigation"] a {
            min-height: 44px;
            display: inline-flex;
            align-items: center;
        }
}

.actividad-datos {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
    margin: var(--space-4) 0 0;
    font-size: 1rem;
    line-height: 1.5;
}

.actividad-dato {
    display: grid;
    grid-template-columns: 7.5rem 1fr;
    gap: var(--space-3);
    align-items: baseline;
}

.actividad-dato dt {
    font-size: 0.8125rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--color-text-low);
}

.actividad-dato dd {
    margin: 0;
    color: var(--color-text);
    opacity: 0.85;
}

.actividad-entrada .cta-link { margin-top: var(--space-4); }

.actividad-ctas { display: flex; flex-wrap: wrap; gap: var(--space-2) var(--space-6); }
```

---

## 5. Imágenes

- Viven todas en `img/`, en una sola carpeta plana, y se copian tal cual a `_site/img/` (passthrough en `.eleventy.js`). Se referencian con ruta absoluta `/img/nombre.webp`.
- Nombre en minúsculas y kebab-case, en castellano, describiendo el contenido (`planta-camiones`, `medicion-pozo`, `informe-mesa`). La variante para móvil lleva el sufijo `-mobile`.
- Formato: WebP para fotos y capturas; SVG para logos; el único JPG es `og-image.jpg` (1200×630) porque los scrapers de redes no leen WebP.
- Tamaños en las páginas de proyecto: figura a 1200 px de ancho (calidad 80) y `-mobile` a 800 px (calidad 78). Las capturas de software se guardan enteras, sin recortar, al ancho que tengan (1248 y 1252 px en trace-group). El hero de natalidad tiene además una variante `-1800` para pantallas densas.
- No hay componente de imagen ni build step de optimización. Las imágenes se procesan fuera del repo con sharp antes de subirlas; este es el pipeline exacto con el que se generaron las siete fotos de trace-group (color intacto, grano suave gaussiano, sin recorte):

```js
const sharp = require("sharp");
const base = await sharp(origen).resize({ width: 1200, kernel: "lanczos3" }).toBuffer();
const { width, height } = await sharp(base).metadata();
const noise = await sharp({ create: { width, height, channels: 3, background: "#808080",
  noise: { type: "gaussian", mean: 128, sigma: 10 } } }).png().toBuffer();
const grained = await sharp(base).composite([{ input: noise, blend: "overlay" }]).png().toBuffer();
await sharp(grained).webp({ quality: 80 }).toFile("img/<nombre>.webp");
await sharp(grained).resize({ width: 800 }).webp({ quality: 78 }).toFile("img/<nombre>-mobile.webp");
```

- Markup de una figura con pie de foto, tal cual está en trace-group. El pie va en `<figcaption>` dentro de `<figure class="figura">`; `width` y `height` son los píxeles reales del archivo grande; `loading="lazy"` y `decoding="async"` siempre, salvo la primera imagen del hero:

```html
        <figure class="figura">
          <picture>
            <source srcset="/img/planta-camiones-mobile.webp" type="image/webp" media="(max-width: 600px)">
            <img src="/img/planta-camiones.webp" alt="Una planta de gas en la meseta, con torres y tanques, y una fila de camiones cisterna blancos bajo el brazo de carga; un operario junto al primer camión" width="1200" height="670" loading="lazy" decoding="async">
          </picture>
          <figcaption>Una planta de gas y los camiones que la cargan: el escenario transcurre en un lugar así.</figcaption>
        </figure>
```

- Inventario actual de `img/` (nombre, píxeles, peso):

```text
2026-ano-analogico-mobile.webp               800x447   54 KB
2026-ano-analogico.webp                     1600x893  148 KB
CuadroMatriculaOptima.webp                  1174x891   70 KB
EscInn.svg                                  1544x280   10 KB
Ezequiel-240.webp                            240x240    4 KB
Ezequiel-480.webp                            480x480   20 KB
Ezequiel-768.webp                            768x768   61 KB
Heated.svg                                  1766x426    6 KB
JornadaCESBA-480.webp                        480x344   25 KB
JornadaCESBA-800.webp                        800x573   63 KB
JornadaCESBA-mobile.webp                     800x450   52 KB
MapaMatriculaOptima.webp                    1024x741   50 KB
Nicolas-240.webp                             240x240    3 KB
Nicolas-480.webp                             480x480    8 KB
Nicolas-768.webp                             768x768   24 KB
Sergio-240.webp                              240x240    5 KB
Sergio-480.webp                              480x480   11 KB
Sergio-768.webp                              768x768   32 KB
algoritmizar-potrero-mobile.webp             800x447   89 KB
algoritmizar-potrero.webp                   1600x893  247 KB
algoritmos-sociologia-branding-mobile.webp   800x447   42 KB
algoritmos-sociologia-branding.webp         1600x893  132 KB
alquileres-negociacion-mobile.webp           800x447   23 KB
alquileres-negociacion.webp                 1600x893   52 KB
aula-vacia-1800.webp                       1800x1200  356 KB
aula-vacia-mobile.webp                       800x450   52 KB
aula-vacia.webp                             1200x800  135 KB
branding-fenomeno-social-mobile.webp         800x447   24 KB
branding-fenomeno-social.webp               1600x893   57 KB
buque-metanero-mobile.webp                   800x447   70 KB
buque-metanero.webp                         1200x670  160 KB
comunicaciones-syp.svg                      3400x816   19 KB
cuando-artefacto-piensa-mobile.webp         1376x768   57 KB
cuando-artefacto-piensa.webp                1600x892  104 KB
dron-medicion-mobile.webp                    800x447   27 KB
dron-medicion.webp                          1200x670   63 KB
informe-2032-portada-mobile.webp             800x605   18 KB
informe-2032-portada.webp                   1252x947   47 KB
informe-mesa-mobile.webp                     800x447   38 KB
informe-mesa.webp                           1200x670  100 KB
inhabiting-future-mobile.webp                800x450   82 KB
inhabiting-future.webp                      1200x900  173 KB
lab-logo-coral.webp                          509x186   18 KB
logo-cesba.webp                              420x522   10 KB
logo.svg                                    737x1358    1 KB
logo.webp                                   737x1358   25 KB
manifiesto-bar.webp                          194x188   21 KB
masterclass-ia-udit-mobile.webp              800x450   61 KB
masterclass-ia-udit.webp                    1199x675  126 KB
medicion-pozo-mobile.webp                    800x447   56 KB
medicion-pozo.webp                          1200x670  129 KB
micelio.svg                                 1416x312    3 KB
og-image.jpg                                1200x630   34 KB
olamestudio.svg                              112x138    3 KB
otros-futuros-ied-mobile.webp                800x800   64 KB
otros-futuros-ied.webp                     1200x1020  205 KB
otros-futuros.svg                           2283x426    5 KB
personal-software-mobile.webp                800x447   23 KB
personal-software.webp                      1600x893   58 KB
planta-camiones-mobile.webp                  800x447   46 KB
planta-camiones.webp                        1200x670  112 KB
refineria-verificador-mobile.webp            800x447   75 KB
refineria-verificador.webp                  1200x670  191 KB
tesis01-cuarto-mobile.webp                   800x446   65 KB
tesis01-cuarto.webp                         1600x892  215 KB
trace-logo.svg                              1791x300    5 KB
verificacion-campo-mobile.webp               800x447   69 KB
verificacion-campo.webp                     1200x670  165 KB
we-trace-login-mobile.webp                   800x450   17 KB
we-trace-login.webp                         1200x898   47 KB
we-trace-portafolio-mobile.webp              800x602   31 KB
we-trace-portafolio.webp                    1248x939   81 KB
workshop-latam2036-mobile.webp              1200x675   28 KB
workshop-latam2036.webp                     1118x935   49 KB
```

---

## 6. Navegación y meta

### 6.1 Nav lateral de secciones

Se declara a mano en cada página, no se genera desde los headings. Son tres bloques al principio del `<main>`: el `<aside class="sticky-toc">` de escritorio, el botón `.mobile-toc-btn` y el overlay `.mobile-toc-overlay` con la misma lista. Los `href` apuntan a los `id` de cada `<section class="content-section reporte-section" id="sec-…">`. Recorte de trace-group:

```html
    <!-- Sticky TOC (Desktop) -->
    <aside class="sticky-toc" id="stickyToc" aria-label="Índice del proyecto">
      <p class="toc-heading">Navegación</p>
      <ul>
        <li><a href="#sec-intro">El escenario</a></li>
        <li><a href="#sec-objeto">El objeto</a></li>
        <li><a href="#sec-contexto">Lo real</a></li>
        <li><a href="#sec-como">Cómo lo hicimos</a></li>
        <li><a href="#sec-creditos">Créditos</a></li>
      </ul>
    </aside>

    <!-- Mobile TOC Button -->
    <button class="mobile-toc-btn" id="mobileTocBtn" aria-label="Abrir índice de navegación">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M3 4h18v2H3V4zm0 7h18v2H3v-2zm0 7h18v2H3v-2z"/>
      </svg>
    </button>

    <!-- Mobile TOC Overlay -->
    <div class="mobile-toc-overlay" id="mobileTocOverlay" aria-label="Navegación del proyecto">
      <button class="close-btn" id="closeMobileToc" aria-label="Cerrar índice">×</button>
      <div class="toc-content">
        <p class="toc-title">Navegación del proyecto</p>
        <ul class="report-toc-list editorial-list">
          <li><span class="editorial-arrow" aria-hidden="true">→</span> <a href="#sec-intro">El escenario: 2032</a></li>
          <li><span class="editorial-arrow" aria-hidden="true">→</span> <a href="#sec-objeto">El objeto</a></li>
          <li><span class="editorial-arrow" aria-hidden="true">→</span> <a href="#sec-contexto">Lo real: tres señales</a></li>
          <li><span class="editorial-arrow" aria-hidden="true">→</span> <a href="#sec-como">Cómo lo hicimos</a></li>
          <li><span class="editorial-arrow" aria-hidden="true">→</span> <a href="#sec-creditos">Créditos</a></li>
        </ul>
      </div>
    </div>

```

El comportamiento (mostrar el índice después de 400 px de scroll, marcar el enlace activo, abrir y cerrar el overlay móvil, medir lectura al 75 %, compartir) está en `src/main.js`, dentro del bloque que corre solo cuando `<body>` tiene la clase `reporte-page`. Bloque completo, verbatim:

```js
  // =====================================================
  // BLOQUE CASOS LARGOS (reporte-page)
  // -----------------------------------------------------
  // Profundidad de lectura y secciones vistas.
  // =====================================================

  if (body.classList.contains("reporte-page")) {
    // Profundidad de lectura: un caso leído hasta el 75 % es la segunda
    // métrica que importa (la primera es Contacto_mail). Se dispara una vez.
    let casoLeido = false;
    const medirLectura = () => {
      if (casoLeido) return;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total > 0 && window.scrollY / total >= 0.75) {
        casoLeido = true;
        trackEvent("Caso_leido_75", { pagina: window.location.pathname });
        window.removeEventListener("scroll", medirLectura);
      }
    };
    window.addEventListener("scroll", medirLectura, { passive: true });

    const reporteSections = document.querySelectorAll("section.reporte-section");
    const seenReportSections = new Set();

    if (reporteSections.length && "IntersectionObserver" in window) {
      const sectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const sec = entry.target;
              if (sec.id && !seenReportSections.has(sec.id)) {
                seenReportSections.add(sec.id);
                trackEvent("Reporte_seccion_vista", { id: sec.id });
              }
            }
          });
        },
        {
          threshold: 0.2,
          rootMargin: "0px 0px -50px 0px",
        }
      );

      reporteSections.forEach((sec) => sectionObserver.observe(sec));
    }

    // Sticky TOC (escritorio) y botones de compartir
    const stickyToc = document.getElementById("stickyToc");
    const shareButtons = document.getElementById("shareButtons");
    if (stickyToc || shareButtons) {
      const handleStickyElements = () => {
        const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
        const showThreshold = 400; // Show after scrolling 400px

        if (stickyToc) {
          if (scrollPosition > showThreshold) {
            stickyToc.classList.add("visible");
          } else {
            stickyToc.classList.remove("visible");
          }
        }

        if (shareButtons) {
          if (scrollPosition > showThreshold) {
            shareButtons.classList.add("visible");
          } else {
            shareButtons.classList.remove("visible");
          }
        }
      };

      window.addEventListener("scroll", handleStickyElements);
      handleStickyElements();

      // Highlight active section in TOC
      if (stickyToc) {
        const tocLinks = stickyToc.querySelectorAll("a");
        const sections = document.querySelectorAll("section[id]");

        const highlightTocLink = () => {
          let current = "";
          sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop - 200) {
              current = section.getAttribute("id");
            }
          });

          tocLinks.forEach((link) => {
            link.classList.remove("active");
            if (link.getAttribute("href") === "#" + current) {
              link.classList.add("active");
            }
          });
        };

        window.addEventListener("scroll", highlightTocLink);
        highlightTocLink();
      }
    }

    // 3. Mobile TOC Toggle
    const mobileTocBtn = document.getElementById("mobileTocBtn");
    const mobileTocOverlay = document.getElementById("mobileTocOverlay");
    const closeMobileToc = document.getElementById("closeMobileToc");

    if (mobileTocBtn && mobileTocOverlay) {
      mobileTocBtn.addEventListener("click", () => {
        mobileTocOverlay.classList.add("active");
        document.body.style.overflow = "hidden";
        trackEvent("Mobile_TOC_abierto");
      });

      const closeToc = () => {
        mobileTocOverlay.classList.remove("active");
        document.body.style.overflow = "";
      };

      if (closeMobileToc) {
        closeMobileToc.addEventListener("click", closeToc);
      }

      mobileTocOverlay.addEventListener("click", (e) => {
        if (e.target === mobileTocOverlay) {
          closeToc();
        }
      });

      // Close on link click
      mobileTocOverlay.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", closeToc);
      });
    }

    // 4. Scenario Accordions
    const accordionHeaders = document.querySelectorAll(".scenario-accordion-header");
    if (accordionHeaders.length) {
      const toggleAccordion = (header) => {
        const isActive = header.classList.contains("active");
        // El button vive dentro de un <h3>; el contenido se ubica
        // por su id declarado en aria-controls
        const scenarioId = header.getAttribute("aria-controls");
        const content = document.getElementById(scenarioId);
        if (!content) return;

        // Close all other accordions (optional - remove if you want multiple open)
        // accordionHeaders.forEach(h => {
        //   if (h !== header) {
        //     h.classList.remove("active");
        //     h.setAttribute("aria-expanded", "false");
        //     h.nextElementSibling.classList.remove("active");
        //   }
        // });

        // Toggle current accordion
        if (isActive) {
          header.classList.remove("active");
          header.setAttribute("aria-expanded", "false");
          content.classList.remove("active");
        } else {
          header.classList.add("active");
          header.setAttribute("aria-expanded", "true");
          content.classList.add("active");
          trackEvent("Escenario_expandido", { id: scenarioId });
        }
      };

      accordionHeaders.forEach((header) => {
        header.addEventListener("click", () => toggleAccordion(header));

        // Keyboard support for Enter and Space
        header.addEventListener("keydown", (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleAccordion(header);
          }
        });
      });
    }

    // 5. Sticky Download Bar (Mobile)

    // 6. Share Button Tracking
    if (shareButtons) {
      shareButtons.querySelectorAll("a").forEach((btn) => {
        btn.addEventListener("click", () => {
          const label = btn.getAttribute("aria-label") || "";
          const platform = label.includes("LinkedIn")
            ? "linkedin"
            : label.includes("Twitter")
            ? "twitter"
            : "email";
          trackEvent("Compartir_reporte", { plataforma: platform });
        });
      });
    }

    // 7. Rail de cifras (scrollytelling, desktop)
    // -----------------------------------------------------
    // Extiende el patrón IntersectionObserver del reporte:
    // una cifra grande en accent bajo el sticky TOC que se
    // actualiza según la sección visible. El markup #dataRail
    // solo existe en /proyectos/natalidad/ (null-safe). Las cifras
    // son las del contenido de la página, no inventadas.
    const dataRail = document.getElementById("dataRail");
    if (dataRail && "IntersectionObserver" in window) {
      const railValue = dataRail.querySelector(".data-rail-value");
      const railLabel = dataRail.querySelector(".data-rail-label");

      const railFigures = {
        "sec-contexto": {
          value: "−42,8 %",
          label: "población de 4 años en la Ciudad de Buenos Aires, 2016–2026"
        },
        "sec-contexto-general": {
          value: "−27 %",
          label: "matrícula primaria proyectada, 2025–2030 (DNP)"
        },
        "sec-escenarios": {
          value: "3",
          label: "escenarios: tendencial, transformador, disruptivo"
        },
        "sec-oportunidades": {
          value: "−19 a −36 %",
          label: "caída de matrícula según provincia"
        }
      };

      let railTimeout;

      const setRailFigure = (id) => {
        const fig = railFigures[id];
        if (!fig || !railValue || !railLabel) return;
        if (dataRail.dataset.current === id) return;
        dataRail.dataset.current = id;

        const apply = () => {
          railValue.textContent = fig.value;
          railLabel.textContent = fig.label;
        };

        if (prefersReducedMotion) {
          apply();
        } else {
          // Fade out → swap → fade in (transición de opacity en CSS)
          clearTimeout(railTimeout);
          dataRail.classList.add("is-switching");
          railTimeout = setTimeout(() => {
            apply();
            dataRail.classList.remove("is-switching");
          }, 180);
        }
      };

      const railObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setRailFigure(entry.target.id);
            }
          });
        },
        {
          // Banda central del viewport: manda la sección que la cruza
          rootMargin: "-40% 0px -50% 0px",
          threshold: 0
        }
      );

      reporteSections.forEach((sec) => {
        if (sec.id && railFigures[sec.id]) {
          railObserver.observe(sec);
        }
      });
    }
  }
```

### 6.2 `<head>` y SEO

El `<head>` está en `base.njk` (sección 2.3). Cada página lo alimenta desde su front matter:

- `title` → `<title>` y `og:title` si no hay `ogTitle`.
- `description` → meta description y `og:description` si no hay `ogDescription`.
- `ogType` → `og:type` (`article` en las páginas de proyecto, `website` en el resto).
- `ogImage` → `og:image` y `twitter:image`. El layout hace `{{ ogImage or site.ogImage }}`, así que **sí se puede pasar una og:image propia por proyecto** poniendo `ogImage: "https://www.bppanalyticsanddesign.com/img/<archivo>"` en el front matter (URL absoluta). Hoy ninguna página lo hace: todas comparten `/img/og-image.jpg?v=2` (1200×630), y `og:image:width` y `og:image:height` están fijos en 1200×630 en el layout, así que una imagen propia debería respetar ese tamaño.
- `section` → `aria-current` del nav (`proyectos` para cualquier página bajo `/proyectos/`).
- `bodyClass`, `jsonld` (ruta del include), `robots` (opcional, `noindex` solo en redirecciones y 404), `cierreTitulo` / `cierreTexto` / `cierreCta` (bloque final).
- El canonical se arma solo con `{{ site.url }}{{ page.url }}`.

### 6.3 Links de "Relacionado" en créditos

Van dentro del `<dl class="ficha-caso">` de la sección `#sec-creditos`, como una fila más, con enlaces absolutos separados por ` · `. Tal cual está en trace-group:

```html
          <div class="ficha-row"><dt>Relacionado</dt><dd><a href="/proyectos/natalidad/">Impacto de la caída de la natalidad</a> · <a href="/usina/tesis-01/">El actante siempre disponible</a></dd></div>
```

---

## 7. Convenciones

### 7.1 Comandos

```bash
npm ci            # una vez
npm run check     # eleventy + csso + terser → _site/, y después scripts/check-site.mjs
npm run serve     # eleventy --serve con recarga
python3 -m http.server 8000 --directory _site   # servir el sitio generado
```

No hay linter ni formateador configurados (ni ESLint, ni Prettier, ni Stylelint). El único chequeo automático es `npm run check`, que también corre en CI antes de publicar. La CSP es `style-src 'self'`: **no se puede usar `style="…"` inline** ni `<style>` en la página; todo va en `styles.css`.

### 7.2 Rutas y nombres

- Página: `src/proyectos/<slug>/index.njk` → `/proyectos/<slug>/`. Slug en minúsculas, kebab-case, sin acentos.
- Include JSON-LD: `src/_includes/jsonld/proyectos-<slug>.njk` (natalidad es la excepción histórica: `natalidad.njk`).
- Ids de sección: `sec-<nombre>` (`sec-intro`, `sec-objeto`, `sec-contexto`, `sec-como`, `sec-creditos`).
- Id de la tarjeta en Lo hecho: `caso-<slug>`.
- Rutas siempre absolutas desde la raíz, nunca `../`. El chequeo de CI falla si encuentra `"../`.

### 7.3 Reglas de CLAUDE.md que aplican a una página de proyecto

```markdown
### Pages
- `index.html` - Homepage (hero, cuatro movimientos, lo hecho, nosotros con equipo y red, cuándo escribirnos y contacto)
- `proyectos/` - Lo hecho, en dos secciones: Casos y Docencia y jornadas
- `proyectos/trace-group/` - Provocación Trace Group: un caso escrito como pregunta "¿Y si…?" (ficha + objeto + cómo se construyó). No explica el método ni la iniciativa; la fecha 2032 marca la ficción. Nunca se dice que fue adoptada. Ver VOICE.md, "Vocabulario propio"
- `proyectos/natalidad/` - Caso natalidad y matrículas (ficha + informe con fuentes oficiales); `reporte-impacto/` solo redirige
- `pensamiento/` - Hub único de ideas: señales, artículos y tesis (La Usina vive acá como serie)
- `usina/` - Solo redirección a `/pensamiento/#tesis` (meta refresh, noindex); `usina/tesis-01/` sigue siendo la URL de la tesis
- `privacidad/` - Política de privacidad
- `404.html` - Página de error propia (GitHub Pages la sirve sola)

---

```

```markdown
### Design System
- **Colors**: CSS custom properties in `:root` (`src/styles.css`)
- **Typography**: Plus Jakarta Sans (interfaz) y Literata (prosa larga), self-hosted en `/fonts/`
- **Spacing**: 8px base grid (multiples of 8)
- **Breakpoints**: base móvil; `min-width: 769px` (escritorio, con el rango `769–1024` para tablet), `1025px` (grillas anchas), `1280px` (medida máxima), `1536px` (índice pegajoso de los casos). No agregar otros valores.
- **Animations**: sin apariciones al scroll; solo transiciones de color y opacidad

---

```

```markdown
**Reglas del layout**
- Front matter por página: `title`, `description`, `ogType`, `section` (`proyectos` | `pensamiento` | `privacidad` | `inicio`, marca el `aria-current` del nav), `bodyClass`, `jsonld` (ruta del include), `homepage: true` solo en index.
- Rutas siempre absolutas desde la raíz (`/img/…`, `/proyectos/`), nunca `../`.
- Las señales existen una sola vez: `partials/senales-cards.njk`, incluido en index y Pensamiento.
- `usina/index.html` es una redirección estática; no lleva layout.

```

```markdown
### Typography
- **Dos familias con rol fijo**: Plus Jakarta Sans para interfaz y títulos; Literata solo para la prosa de lectura larga en páginas `.page-lectura`. Ambas self-hosted en `/fonts/`.
- **Carga**: `<link>` en el `<head>` de cada página (nunca `@import` en CSS)
- **Pesos**: 400 y 700 + itálica 400 únicamente (decisión 2026-08-21, feedback socios) — no agregar otros
- **Fallback**: sans-serif

```

```markdown
### Content Wording Distinctions

#### "Hechos" vs "Lo hecho"
These terms refer to the same section but use different wording intentionally — **never unify them**.

- **"Hechos"** (noun): Section heading in the content (`<h2 id="actividades-heading">Hechos</h2>`)
  - Meaning: "Facts" / "Accomplishments" / "Things Done"
  - Usage: Section titles, headings, content structure

- **"Lo hecho"** (past participle): Navigation link pointing to the Hechos section
  - Meaning: "What has been done" / "The work accomplished"
  - Usage: CTAs, navigation links, action-oriented references

**Rationale**: "Hechos" = direct noun for section identity; "Lo hecho" = narrative/action framing for user navigation. Reflects brand voice: direct, practitioner-level, avoiding corporate uniformity.

---

```

````markdown
### HTML Rules
- **Semantic structure**: `<section id="...">` for major blocks
- **Accessibility**: ARIA labels on buttons, semantic headings (h1 → h2 → h3)
- **Progressive enhancement**: funciona sin JS (no hay formularios; los enlaces y el mailto no dependen de nada)
- **Structured data**: un include JSON-LD por página
- **NEVER assume a file is unused based on index alone** — hay ocho páginas en `src/**/index.njk` más `src/404.njk` y los parciales en `src/_includes/`. Antes de archivar o borrar un asset: `grep -rn "filename" src/`

### Commit Format
```
type: brief description (50 chars max)

Optional body explaining why (not what).
Wrap at 72 characters.
```

**Types**: `feat`, `fix`, `style`, `refactor`, `docs`, `perf`, `chore`

**Example**:
```
feat: add WebP images with responsive srcset

Reduces page weight by 83% (5.1MB → 863KB).
Uses sharp-cli for conversion, maintains quality.
```

---

````

### 7.4 DESIGN.md: tipografía, componentes y lo que no se hace

```markdown
## Typography

**Dos familias con roles fijos (self-hosted).** Plus Jakarta Sans para todo lo que es interfaz: títulos, labels, navegación, tarjetas, metadata, CTAs. Literata solo para la prosa de lectura larga (`.page-lectura`: reporte de natalidad, Trace Group, tesis): párrafos, listas, definiciones, citas. Decisión de los socios, 2026-09: un documento de tres mil palabras se lee mejor en serif, y la serif no entra en ninguna otra superficie.

**Literata** (Google/TypeTogether, OFL, servida desde `/fonts/`): variable en peso 400..700 y tamaño óptico 7..72, con `font-optical-sizing: auto`. Cuerpo fijo en 1.1875rem (19px, la base del sitio) y `line-height 1.7`. Nunca en headings, nunca fuera de `.page-lectura`, nunca a menos de 17px.


**Evolución v1 → v2 → v2.1:** La versión alpha usaba Space Mono monowidth exclusiva — identidad radical donde cada texto se leía "como material de estudio". La v2 beta-inclusive especificó un híbrido ZT Bros Oskon (display) + Chivo (body) que **nunca llegó a producción**: el sitio se construyó entero sobre Plus Jakarta Sans. La v2.1 (2026-06-11) reconoce esa realidad y la consolida como decisión: una sola familia, jerarquía por peso y tamaño.

**Plus Jakarta Sans** (Tokotype, opensource, servida desde `/fonts/`):
- Uso: todo el sistema — headings, navegación, body copy, metadata, CTAs
- Carácter: Geométrica humanista, moderna sin ser genérica. Buena legibilidad en textos largos y personalidad suficiente en titulares con peso 600-700.
- Pesos cargados: 300, 400, 500, 600, 700 + itálica 400. No cargar pesos que no se usan.
- Carga: `@font-face` en `styles.css` apuntando a `/fonts/plus-jakarta-sans-latin*.woff2` (variable 400..700, subset latin, `font-display: swap`), más `<link rel="preload" as="font">` de la regular en cada `<head>`. Sin Google Fonts: un origen menos en la CSP, sin dependencia externa, y el mismo archivo se cachea para todo el sitio. Nunca `@import` dentro del CSS.
- Jerarquía: peso 600-700 para headings y CTAs, 400-500 para body y metadata. La jerarquía se apoya en tamaño, peso y opacidad.

**Rationale de v2.1:** El híbrido Bros Oskon + Chivo era una especificación sin implementación (0% en producción). Mantener una fuente de verdad que contradice el 100% del sitio generaba drift permanente. Plus Jakarta Sans ya demostró funcionar en todos los contextos del sitio (hero, artículos largos, formularios, metadata). Las fuentes Bros Oskon y Chivo se retiraron del repo.

Mayúsculas se usan sólo en **wayfinding y metadata** — navegación, etiquetas de sección, numeración, tags. Nunca en titulares descriptivos, nunca en cuerpo, nunca en CTAs. El uso de mayúsculas señala "esto es orientación, no contenido". La transformación se aplica vía CSS (`text-transform: uppercase`), no se escribe en el texto original.

La jerarquía tipográfica se apoya en tamaño, peso y opacidad dentro de la misma familia.

```

```markdown
## Components

### CTA tipográfico

BPP no usa botones con fondo sólido. Los CTAs son tipografía con color `primary`, frecuentemente acompañados de una flecha adyacente (`→` o `←`) y/o un subrayado implícito.

**Hover permitido:**

- Cambio de color del texto o del borde inferior.
- Cambio de opacidad del subrayado.
- **Desplazamiento direccional de la flecha adyacente:** `transform: translateX(±4px)` aplicado solo al ícono de flecha, no al texto. Es wayfinding (el lector ve hacia dónde va), no decoración. Se permite solo cuando hay flecha real en el markup.

**Hover prohibido:**

- `transform: scale(...)` en el texto del CTA o en el contenedor entero.
- `transform: translateY(...)` (empuje vertical).
- `box-shadow` de cualquier tipo (salvo focus ring por accesibilidad).
- `filter: brightness(...)` o cualquier otro filtro visual.

### Nav link

Metadata tipográfica (Plus Jakarta Sans, uppercase vía CSS, 0.75rem, tracking abierto). Hover: cambio de color a `primary`. Nada más.

### Card de proyecto / artículo

Fondo transparente o `surface` sobre `background`. Corner brackets como encuadre. Radio `md` (8px) permitido en el contenedor si el contexto lo pide. Al hover, el bracket se intensifica en color `primary` — sin movimiento, sin escala. Una shadow sutil (ver Elevation & Depth) es aceptable para separación, no obligatoria.

### Team row (hover photo)

Efecto específico del sistema: al hacer hover en un nombre de team member, su foto aparece flotando a `left: 180px; top: -90px` del row, superpuesta sobre la fila de arriba. Esto es parte del signature del sitio y **no se reemplaza con un tooltip ni con un card**.

### Focus ring (accesibilidad)

Implementación: `:focus-visible { box-shadow: 0 0 0 3px rgba(193,111,82,0.55); outline: none; }` o un `outline: 2px solid` con el color primary. Aplica a todo elemento interactivo (links, botones, inputs). Es requisito, no decoración.

### Logo BPP

SVG base64 embebido, aplicado con `filter: brightness(0) invert(1)` para renderizar blanco sobre fondo oscuro. El filtro es la única forma de tratamiento válida; no hay variante "logo oscuro" separada.

## Do's and Don'ts

Esta sección captura los errores que se repiten y que el sistema necesita documentar para que no se reintroduzcan.

### Do

- Validar cualquier cambio de token contra este archivo antes de aplicar.
- Usar `#c16f52` exacto (terracotta desaturado v2, no `#ce7352` de v1) — también en formato rgba: `rgba(193,111,82,…)`, nunca `rgba(206,115,82,…)`.
- Usar Plus Jakarta Sans en todo el sistema, cargada vía `<link>` (nunca `@import` en CSS), solo los pesos 300-700 + itálica 400.
- Usar mayúsculas solo para wayfinding y metadata, aplicadas vía CSS.
- Mantener `section: 160px` entre bloques mayores.
- Implementar CTAs como tipografía, no como botones con fondo.
- Usar `translateX(±4px)` en flechas de CTA para hover direccional.
- Elevar cards con superficie + sombra cálida (`--shadow-card`), no con bordes: los bordes de 1px se usan a alpha ≤ 0.15 ("susurro"), nunca como marco duro.
- Mantener focus rings en `:focus-visible` — es accesibilidad.
- Usar radios `none` / `sm (4px)` / `md (16px)` / `pill (999px)` / `full (50%)` según el componente. Badges y chips van en pill.
- Reservar los corner brackets como firma exclusiva de La Usina (`.tesis-card`, portadas de tesis). En el resto del sitio no se usan (v2.2).
- Mantener el grano análogo del body (~3.5% opacity): rompe el render perfecto sin ensuciar el texto.
- Preservar el efecto team row tal como está.
- Priorizar diseño inclusivo: warm off-white, terracotta desaturado, dark warm gray lifted.

### Don't

- **No volver a Space Mono monowidth única.** Fue v1 alpha.
- **No reintroducir el híbrido Bros Oskon + Chivo.** Fue una especificación v2 que nunca llegó a producción; v2.1 consolidó Plus Jakarta Sans como familia única (decisión 2026-06-11).
- **No agregar familias tipográficas adicionales** (Atkinson, IBM Plex, Lexend, Work Sans, Inter ya fueron retiradas o rechazadas). Una sola familia.
- **No saturar el terracotta.** `#ce7352` era v1. `#c16f52` es v2 — no se vuelve a saturar.
- **No bajar el fondo a negro puro.** `#0a0a0a` era v1. `#12151a` es v2 (lifted para reducir contraste extremo).
- **No usar blanco puro.** `rgba(255,255,255,...)` era v1. `rgba(250,248,246,...)` es v2 (warm off-white inclusivo).
- **No usar `transform: scale(...)` en hovers decorativos.** Ni en CTAs, ni en botones PWA, ni en íconos sociales, ni en "touch feedback" genérico.
- **No usar `transform: translateY(...)` en hovers** (empujes verticales tipo "levitar").
- **No usar glow terracotta en la web.** `box-shadow` con `rgba(193,111,82,...)` está reservado para el focus ring y para los overlays OBS.
- **No usar shadows intensas** (`alpha > 0.4`, `blur > 24px`, o shadows coloreadas que no sean negras).
- **No usar radios mayores a 8px** salvo `50%` para elementos circulares explícitos. Sin 10px, 12px, 14px, 24px.
- **No convertir CTAs tipográficos en botones con background.** Reescribir como texto con color primary.
- **No trasladar el lenguaje de los overlays OBS a la web.** Son contextos distintos.
- **No ejecutar auditorías de performance que toquen tipografía o color sin revisar este archivo.** Si la auditoría recomienda cambiar el sistema híbrido por motivos de carga, se evalúa manualmente — no se aplica.
- **No interpretar "editorial dark" como "bold and dramatic".** El sistema es denso pero sobrio.
- **No tocar archivos `_prototype-*`.** Están fuera del sistema por diseño.
- **No justificar cambios con "v1 era mejor".** v1 alpha priorizaba signature máximo, v2 beta-inclusive prioriza diseño inclusivo. Son valores distintos, ambos válidos — v2 es el sistema activo.

```

### 7.5 VOICE.md completo

Es la fuente de verdad del registro de escritura, incluido el vocabulario propio ("Provocación", "Destinatario", cómo se escribe un caso "¿Y si…?"). Si algo de este handoff lo contradice, gana VOICE.md.

```markdown
name: BPP Analytics & Design — Voice
description: Registro de escritura del estudio. Editorial, directo, en primera persona. Aplica a copy web, LinkedIn, propuestas, materiales de cátedra, y cualquier pieza pública o semipública con firma BPP.
companion: DESIGN.md

BPP — Voice

Este archivo es la fuente de verdad del registro de escritura del estudio. No es una guía de estilo genérica. Es una descripción operativa de cómo escribe BPP y cómo decide qué no escribir. Cualquier pieza firmada por el estudio se produce contra este archivo. Si una pieza puede publicarla cualquier otra consultora sin cambiar nada, no es BPP.

El sistema visual que acompaña este registro está en DESIGN.md. Los dos archivos se leen juntos: la densidad del texto se apoya en la densidad del sistema visual, y al revés.

Identidad

BPP es un estudio de tres personas: Nicolás Bronzina (investigación y diseño), Sergio Petrocelli (planificación estratégica y comunicación), Ezequiel Politi (data y estrategia). Operan entre Buenos Aires y Madrid.

Cuando BPP escribe en primera persona, son los tres o uno en nombre de los tres. No hay "BPP dice" en tercera persona distante. No hay voz institucional despersonalizada. Si un texto no puede ser firmado por una persona real, no pertenece a este registro.

Registro

Practicante, no consultor. Habla alguien que hace el trabajo, no alguien que lo vende. Un cliente leyendo un texto de BPP debería pensar "esta gente se ensució las manos con esto", no "esta gente arma slides muy lindas".
Primera persona. Yo (cuando es Nicolás firmando), nosotros (cuando es BPP), vos (al lector en español rioplatense), usted nunca. En piezas en inglés: we, not "the team".
Editorial, no publicitario. Más cerca de un newsletter bien escrito que de una landing de SaaS.
Denso pero legible. Una idea por párrafo, pero la idea puede ser incómoda. BPP no teme ser específico al punto de perder lectores que no eran el público.

Diagnóstico previo

Antes de producir cualquier texto firmado BPP, se verifica internamente:

¿Hay algo concreto que decir? Si la idea es "queremos comunicar que hacemos foresight con IA", no hay texto posible — no es una idea, es una categoría. Hay que bajar a qué problema específico, qué cliente específico, qué contradicción específica.
¿Quién lo lee y qué sabe? Un director de estrategia en una automotriz española no es lo mismo que un decano de UDIT revisando una propuesta de cátedra. Si el texto intenta servir a los dos, termina no sirviendo a ninguno.
¿Qué tiene que hacer o sentir quien lee esto? Todo texto tiene una función. Si la función es "que reserve una reunión", el texto apunta ahí. Si la función es "que cambie de opinión sobre algo", el texto apunta ahí. Si no hay función clara, no hay texto.
¿Hay tensión real? El slop no tiene conflicto. BPP lo tiene: el trabajo del estudio existe porque hay decisiones difíciles, datos contradictorios, y escenarios donde lo que pasó antes no explica lo que viene. Si el texto pretende que todo es armonía y oportunidad, no es BPP.

Si las cuatro preguntas no tienen respuesta, no se escribe. Se pide más contexto.

Lo que no existe en este registro

"En el dinámico mundo de..."
"En el panorama actual..."
"Esto nos lleva a reflexionar..."
"Es importante destacar que..."
"Sin dudas," / "Claramente,"
Cualquier frase que pueda terminar en "— y eso marca la diferencia".
Cualquier construcción del tipo "a través de", "de la mano de", "en pos de".
Bullets de 3-5 palabras sin verbo.
Listas de 5 items que son la misma idea repetida 5 veces.
Cierres con pregunta retórica vacía ("¿Estás listo para el cambio?").
Adjetivos de superioridad sin evidencia ("innovador", "disruptivo", "único", "revolucionario").
Metáforas de navegación, viaje o construcción ("hoja de ruta", "puente", "pilares", "brújula").
"Thoughtful founder voice" — el registro de LinkedIn que premia el algoritmo. BPP no es eso.
El em-dash como recurso de remate ("hacemos X — y eso cambia todo"). Es la puntuación más delatora de texto generado por IA. Se permite solo en dos usos: par apareado que encierra un inciso real (—familia, amigos, instituciones—, sin espacios internos) y separador en títulos o etiquetas (Buenos Aires — Madrid). En prosa corriente se reemplaza por punto, dos puntos o coma, según lo que pida la oración.

Principios operativos

Especificidad

Siempre que se pueda, nombre propio antes que categoría, número antes que "muchos", situación antes que concepto. No "trabajamos con una automotriz europea en un proyecto de futuros"; sí "trabajamos con una automotriz europea en un escenario de 2030 donde los canales de venta actuales ya no existen". El segundo sigue siendo anónimo pero es específico.

Tensión

Todo texto tiene un antes y un después. Se muestra el antes. El conflicto no tiene que ser dramático — tiene que ser real. La resolución nunca es "el servicio BPP"; es el estado al que llega quien contrata el servicio.

Estructura

Se evita la secuencia "problema → solución → CTA". Es predecible y hace sonar al estudio como venta. Preferencia por: observación → tensión → pregunta abierta o implicación. El lector cierra el texto con algo para pensar, no con un impulso a clickear.

Ritmo

Oraciones cortas cuando hay peso. Oraciones largas cuando hay textura. Un párrafo de una sola oración carga peso y se usa con intención, no como recurso decorativo. Punto seguido antes que coma con conector. Menos "por un lado / por otro lado"; más "A. B."

Español rioplatense con registro cuidado

"Vos" en piezas personales, "tú" si el contexto es España y la pieza lo pide. Nunca mezclar en el mismo texto. Argentinismos (boludo, re-, laburar) no aparecen en material cliente; sí pueden aparecer en comunicación interna o en Slack. El registro por default es neutro rioplatense — calmado, directo, sin pose.

Formatos

Copy web (hero, servicios, about)

Hero: máximo 2 líneas. Una tensión, no una promesa. "Decisiones que no tienen vuelta atrás" funciona como hero. "Presión de tomar decisiones de millones" no funciona — es dramática y vacía. "Convertimos incertidumbre en decisiones que funcionan" es tagline, no hero.
Servicios: qué cambia para el cliente, no qué hace BPP. En vez de "Realizamos investigación exploratoria", algo como "Validamos hipótesis antes de que se vuelvan decisiones".
About: perspectiva, no biografía. Una bio que diga "sociólogo formado en USAL con máster en UX" es CV, no about. El about dice de qué se ocupa el estudio y por qué.
CTA: acción específica, nunca "Contactanos" genérico. "Hablemos antes de tu próxima decisión crítica" funciona; "Contactanos para más información" no.

LinkedIn

La primera línea nunca empieza con "Hoy quiero hablar de...". Empieza en el medio de algo que ya está pasando.
Sin emoji de apertura. Sin "Hilo 🧵" a menos que realmente sea un hilo.
El cierre no pide likes, compartidos ni comentarios. Termina con algo que valga la pena pensar o con una afirmación que cierre.
Hashtags: máximo dos, en español, específicos. #BPP y uno más, o ninguno. Nunca #Consulting #Strategy #Research — es slop en inglés genérico.
Largo: tan largo como necesita ser la idea, ni una oración más. Post de 8 líneas que dice algo vale más que post de 40 que no dice nada.

Propuesta / deck

Slide de problema: costo real de no resolverlo, con número o caso, no categoría abstracta.
Slide de solución: proceso, no lista de features.
Sin bullets en slides de narrativa — prosa breve o imagen con dato.
Cifras con contexto: no "3 semanas", sí "3 semanas desde kick-off hasta primer prototipo testeable".

Workshop / material de cátedra

La pregunta que abre la sesión tiene que ser incómoda. Si la pregunta la puede responder cualquier estudiante sin pensar, no sirve.
Ejemplos del mundo del participante, no de Silicon Valley. Para estudiantes en Madrid, no se ejemplifica con Airbnb; se ejemplifica con algo que conozcan.
Instrucciones de ejercicio: qué hacés, cuánto tiempo, cómo sabés que terminaste. Las tres cosas. No más.

Post interno / Slack / email a cliente

Registro más suelto, pero las mismas reglas aplican al nivel de idea: si no hay algo concreto que decir, se espera.
Es aceptable ser más breve. No es aceptable ser genérico.

Señales de alerta

Si al revisar un borrador aparece alguna de estas señales, se reescribe:

El párrafo podría ser de cualquier otra consultora del mundo.
Se puede reemplazar "BPP" por otro nombre y sigue funcionando igual.
Hay más de 3 bullets seguidos haciendo trabajo que podría hacer un párrafo.
Hay casi un adjetivo por sustantivo.
El texto explica lo que va a decir antes de decirlo ("En este post vamos a contar...").
Hay una metáfora de navegación, viaje o construcción.
El cierre es una pregunta que el lector no puede responder en concreto.
Cualquier párrafo empieza con "Es por eso que...".
El borrador usa "nosotros" cuando el texto es personal de Nicolás (o al revés).
Hay una frase que suena a que la escribió una IA — se reescribe en voz propia, aunque quede más larga.

Proceso de revisión

Antes de entregar un borrador:

Test de intercambiabilidad. ¿Puede decir esto cualquier otra empresa? Si sí, se reescribe.
Test de especificidad. ¿Hay al menos un detalle concreto por párrafo? Si no, se agrega.
Test de ritmo. Leer en voz alta mentalmente. ¿Hay variación? ¿Alguna oración tiene peso propio?
Test de función. ¿Qué tiene que hacer quien termina de leer esto? ¿Queda claro sin que el texto lo diga literal?

Referentes de voz

Textos que sirven como calibración:

Near Future Laboratory (briefings especulativos) — densos, sin condescender, con punto de vista.
superflux.in (copy de proyecto) — cada palabra trabaja, sin adorno.
Paul Soulellis (escritura sobre práctica) — primera persona sin pose académica.
Robin Sloan (newsletters) — conversacional pero preciso, nunca vago.

Lo que no es referente:

Thought leadership de LinkedIn con más de 5k likes.
Landing pages de SaaS con "Transform your workflow".
Blogs corporativos de consultoras grandes.
Material de marketing de agencias de "design thinking" con ilustraciones de personas saltando.

Relación con DESIGN.md

Este archivo y DESIGN.md son hermanos. La densidad tipográfica del sistema híbrido (ZT Bros Oskon en headings, Chivo en body, sobre dark warm gray) exige que el texto sea cuidado — los títulos geométricos anuncian peso, y el body legible no tolera relleno. El sistema v2 beta-inclusive permite textos largos sin fatiga (Chivo optimizada para lectura) pero mantiene que cada título sea intencional (Bros Oskon no perdona titulares genéricos).

Y al revés: el registro editorial y directo de este archivo exige que el sistema visual no compense con decoración. Si uno de los dos archivos deriva, el otro empieza a sentirse mal calibrado.

Cualquier cambio en registro o en sistema visual que implique modificar alguno de los dos archivos se revisa como una decisión sobre la identidad del estudio, no como una tarea de producción.

**Nota sobre evolución v1 → v2:** El sistema v1 alpha usaba Space Mono monowidth exclusiva — empujaba al texto a ser más breve por limitación de legibilidad en textos largos. El sistema v2 beta-inclusive (Bros Oskon + Chivo) permite textos más extensos (reportes, artículos pensamiento) sin comprometer rigor. La voz se mantiene — solo se expande el rango donde puede aplicarse sin cansar al lector.

Vocabulario propio

Provocación. Un caso que construimos antes de que exista el encargo: elegimos una organización, tomamos señales reales y le llevamos un artefacto terminado para discutir. Es el término del diseño ficción para un objeto hecho para abrir una conversación, no para cerrar una venta. Se escribe "provocación", nunca "propuesta", "pitch", "piloto" ni "propuesta en curso": esas palabras describen una relación comercial que no existe. La ficha lleva Destinatario, no Cliente, y el estado es "Provocación presentada, año". No se afirma que fue adoptada, encargada ni pagada; lo que la organización haga con ella no se publica.

Cómo se escribe una provocación: como pregunta. "¿Y si…?" es la pregunta introductoria del escenario y del artefacto: la página abre con ella, describe el escenario como un día cualquiera del futuro y presenta el objeto que lo hace tangible; después cuenta cómo se construyó, igual que lo hacen los estudios de futuros. Estructura fija, tomada de cómo Superflux publica un proyecto: escenario, objeto (con imágenes del artefacto), lo real (las señales con fuente), cómo lo hicimos y créditos. Sin ficha de cuatro respuestas ni capítulos de metodología: los principios van como párrafos dentro del relato. No explica el método ni la iniciativa: en el cuerpo del caso no aparecen "diseño ficción", "prototipo diegético" ni "por iniciativa propia". La fecha futura del artefacto marca la ficción sola; las señales de contexto llevan fuente. Primer caso: Trace Group, 2026.
```
