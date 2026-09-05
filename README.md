# BPP Analytics & Design

Sitio del estudio: [bppanalyticsanddesign.com](https://www.bppanalyticsanddesign.com/). Sociología aplicada: de señales débiles a decisiones con fundamentos. Buenos Aires y Madrid.

## Cómo está hecho

HTML plano generado con [Eleventy 3](https://www.11ty.dev/) (Nunjucks), CSS y JavaScript escritos a mano, sin frameworks en el navegador. Fuentes self-hosted, sin cookies, sin formularios ni servicios externos salvo Plausible para métricas agregadas.

- Un layout base con head, nav y footer (`src/_includes/layouts/base.njk`).
- Siete páginas como templates en `src/**/index.njk`, más una redirección estática en `src/usina/index.html`.
- Las señales existen una sola vez (`src/_includes/partials/senales-cards.njk`) y se incluyen donde hacen falta.
- Política de seguridad estricta: `style-src 'self'`, sin estilos inline.

## Trabajar en local

```bash
npm ci            # una vez
npm run check     # genera _site/ y corre el chequeo (páginas, assets, JSON-LD, rutas)
python3 -m http.server 8000 --directory _site
```

`npm run serve` levanta Eleventy con recarga. `_site/` y los archivos minificados no se versionan: los genera GitHub Actions al publicar.

## Publicar

Merge a la rama por defecto. El workflow `.github/workflows/deploy.yml` instala, construye, chequea y publica `_site/` en GitHub Pages (fuente: GitHub Actions). Tarda dos o tres minutos.

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
