# BPP Analytics & Design

Sitio del estudio: [bppanalyticsanddesign.com](https://www.bppanalyticsanddesign.com/). Sociología aplicada a decisiones sobre lo que todavía no pasó. Buenos Aires y Madrid.

## Cómo está hecho

HTML plano generado con [Eleventy 3](https://www.11ty.dev/) (Nunjucks), CSS y JavaScript escritos a mano, sin frameworks en el navegador. Fuentes self-hosted, sin cookies, sin formularios, sin medición de visitas y sin servicios externos.

- Un layout base con head, nav y footer (`src/_includes/layouts/base.njk`).
- Ocho páginas y el 404 como templates en `src/**/index.njk` y `src/404.njk`, más dos redirecciones estáticas (`src/usina/index.html`, `src/reporte-impacto/index.html`).
- Las señales existen una sola vez (`src/_includes/partials/senales-cards.njk`) y se incluyen donde hacen falta. Lo mismo el cierre de página (`cierre.njk`) y la navegación de los casos (`caso-nav.njk`), que salen del front matter, el botón "Copiar dirección" (`copiar-mail.njk`) y "Seguí leyendo" (`seguir-leyendo.njk`), que lleva adentro la lista de casos y tesis.
- `sitemap.xml` se genera (`src/sitemap.njk`) con las páginas que declaran `sitemap:` en su front matter.
- Política de seguridad estricta: `style-src 'self'`, sin estilos inline.

## Trabajar en local

```bash
npm ci            # una vez
npm run check     # genera _site/ desde cero y corre el chequeo (estructura, enlaces y anclas internas, imágenes, JSON-LD, sitemap)
python3 -m http.server 8000 --directory _site
```

`npm run serve` levanta Eleventy con recarga y rehace el CSS y el JS minificados cuando cambia la fuente. `_site/` y los archivos minificados no se versionan: los genera Vercel al publicar.

## Publicar

Merge a la rama por defecto. Vercel instala, construye y publica `_site/`, y arma un preview por cada otra rama. El chequeo (`npm run check`) ya no corre solo: hay que correrlo antes de mergear.

## Estructura

```
src/                   páginas, layout, parciales, styles.css y main.js
img/, fonts/           assets que se copian tal cual
docs/                  PDF publicados y docs/historial.md; los .md no se publican
DESIGN.md, VOICE.md    fuentes de verdad del sistema visual y de la voz
CLAUDE.md              guía de trabajo para Claude Code
.eleventy.js           configuración del build
scripts/check-site.mjs chequeo del sitio generado
```

## Antes de tocar algo

Leer `DESIGN.md` (paleta Tinta, tipografía, ritmo vertical, componentes) y `VOICE.md` (registro, reglas de escritura). Si una idea contradice esos archivos, ganan los archivos. El contexto de las decisiones está en `docs/historial.md`.

## Contacto

bppanalyticsanddesign@gmail.com
