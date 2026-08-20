# LA USINA — Fase 1: Especificación + Audit

**Fecha:** 2026-06-13
**Estado:** STOP — esperando decisiones de Nicolás antes de escribir código
**Brief:** Sección `/usina` + Tesis 01 "El actante siempre disponible" renderizada en web

---

## Hallazgo 1 (BLOCKER): el contenido de Tesis 01 no está en el repo

Se buscó en todo el repositorio (`grep` + `find` por "usina", "tesis", "actante"):

- ❌ No existe el PDF de 56 páginas
- ❌ No existe el deck 16:9 ni el carousel de LinkedIn
- ❌ No existen assets gráficos de la tesis
- ❌ No existe el texto de capítulos, abstract, tabla 7-functions ni referencias

Lo único que aparece es la tesis de licenciatura de Ezequiel sobre alquileres (obra distinta, ya publicada como card en pensamiento/proyectos).

**Consecuencia:** Fase 1 no puede "mapear estructura de Tesis 01" contra el documento real. Puedo construir toda la infraestructura (rutas, componentes, tipografía, TOC) en Fase 2, pero el render de la tesis necesita el contenido.

**Necesito de Nicolás:** el PDF (o mejor: el texto fuente en Markdown/Docx) + los gráficos exportados. Con el texto fuente el render HTML es fiel y editable; desde PDF hay que extraer y re-verificar todo.

---

## Hallazgo 2 (CONFLICTO): el brief especifica tokens v1 prohibidos por DESIGN.md v2.1

El brief pide "diseño coherente con DESIGN.md v2 + VOICE.md" pero especifica:

| Brief pide | DESIGN.md v2.1 dice | Regla |
|---|---|---|
| Paleta `#ce7352` | **Prohibido explícito** — "No saturar el terracotta. `#ce7352` era v1" | Usar `#c16f52` |
| Fondo `#0a0a0a` | **Prohibido explícito** — "No bajar el fondo a negro puro. `#0a0a0a` era v1" | Usar `#1a1512` |
| Piazzolla + Archivo | **Familia única Plus Jakarta Sans** (decisión 2026-06-11: "una sola familia, jerarquía por peso y tamaño") | Sin nuevas familias |

Per CLAUDE.md: *"Si una auditoría, un brief anterior, o una sugerencia de modelo contradice lo que está en esos archivos, ganan los archivos."*

**Recomendación:** construir La Usina con los tokens v2.1 vigentes (`#c16f52`, `#1a1512`, Plus Jakarta Sans). La diferenciación editorial de la sección se logra con jerarquía, densidad y componentes — no con una paleta/tipografía paralela que fragmentaría el sistema.

**Alternativa si La Usina debe tener identidad tipográfica propia:** actualizar DESIGN.md primero (agregar una sección "Sub-marca La Usina" con Piazzolla/Archivo como excepción documentada), después construir. El orden importa: DESIGN.md es canon, no se contradice desde el código.

**Decisión requerida de Nicolás:** ¿v2.1 estricto o excepción documentada en DESIGN.md?

---

## Estructura propuesta (sigue patrón del sitio)

```
/usina/index.html            → héroe La Usina (2-3 párrafos, link a Tesis 01)
/usina/tesis-01/index.html   → Tesis 01 renderizada
/usina/tesis-02/…            → futuras tesis (misma plantilla)
```

Coincide con el patrón existente (`pensamiento/`, `proyectos/`, `proyectos/trace-group/`).

## Componentes: qué se reusa y qué es nuevo

**Reusable (ya existe en styles.css):**
- `aside.sticky-toc` + mobile TOC overlay — ya implementado en reporte-impacto, con fix reciente de jerarquía (`p.toc-label`). Sirve tal cual para el TOC de capítulos.
- Corner brackets — dispositivo de encuadre ya en el sistema.
- `.actividad-card` / `.section-heading` / CTAs tipográficos.
- Critical CSS inline + carga async de styles.min.css (patrón de todas las páginas secundarias).

**Nuevo (Fase 2):**
- `.thesis-chapter` — sección numerada, jerarquía H2/H3.
- `.concept-callout` — para los dos conceptos originales. Propuesta: border-left 2px `--orange-500` + fondo `--color-surface` (mismo lenguaje que `.term-card` ya existente — coherencia sin inventar nada).
- `.reference-list` — referencias clickeables (DOI/URL, `rel="noopener"`).
- `.metadata-bar` — fecha, versión, links a PDF/deck/carousel.
- Tabla 7-functions en CSS Grid semántico (`<table>` real con estilos Grid en desktop, colapso a cards en mobile — patrón responsive del sitio, min-width: 769px).

## Caracteres especiales (∈, →, etc.)

- `→` ya se usa en el sitio (`.cta-link::after`) — cubierto por Plus Jakarta Sans.
- `∈` y símbolos matemáticos: PJS no garantiza cobertura completa de Mathematical Operators. Fallback: stack `'Plus Jakarta Sans', 'Noto Sans Math', sans-serif` solo si la tesis los usa (a confirmar cuando llegue el contenido). No se agrega font nueva preventivamente.

## Restricciones confirmadas (no se tocan)

- Nav principal / breadcrumb global ✅
- Logo + footer ✅
- CSS variables de `:root` ✅
- Sin Space Mono / IBM Plex / Work Sans / DM Sans ✅ (tampoco están hoy)
- Sin emojis/GIFs/animaciones fuera de VOICE.md ✅
- Breakpoints del sitio actual (base mobile, min-width: 769px) ✅

## Analytics (pregunta 5 del brief)

Factible con lo existente: `trackEvent(name, props)` + Plausible ya están. Scroll-depth por capítulo se implementa con el mismo IntersectionObserver que usa `[data-animate]` — evento `Tesis01_capitulo_visto` con prop del capítulo. Costo cero en dependencias.

## SEO previsto (Fase 2)

- Schema.org `ScholarlyArticle` para Tesis 01 (autores, fecha, abstract).
- Entradas en sitemap.xml para `/usina/` y `/usina/tesis-01/`.
- Canonical + OG por página (patrón existente).

---

## Preguntas abiertas para Nicolás (del brief + nuevas)

1. **[NUEVA — blocker] Contenido:** ¿me pasás el texto fuente de la tesis (ideal: Markdown/Docx) + gráficos exportados? ¿O solo el PDF de 56pp?
2. **[NUEVA — conflicto] Tokens:** ¿v2.1 estricto (`#c16f52`/`#1a1512`/PJS) o excepción "La Usina" documentada primero en DESIGN.md (Piazzolla/Archivo/`#ce7352`)?
3. **Tabla 7-functions:** recomiendo HTML table + CSS hover con highlight de fila. Modal/detalle por fila agrega JS y fricción de lectura; solo lo justifica si cada función tiene >1 párrafo de detalle. ¿Cuánto contenido tiene cada fila?
4. **Conceptos clave:** recomiendo callout visual (border-left accent + surface, como `.term-card`) — es más escaneable que solo color+bold y ya es lenguaje del sitio. ¿OK?
5. **TOC:** recomiendo el patrón existente de reporte-impacto (sticky desktop + botón/overlay mobile) — ya está construido y testeado. ¿OK?
6. **PDF descargable:** ¿el original de 56pp o genero versión optimizada (~Ghostscript, -50% peso)?
7. **Scroll-depth analytics:** ¿lo activo? (costo cero, ver arriba)

---

**Próximo paso:** con las respuestas 1 y 2 arranco Fase 2. El resto tiene recomendación default — si no contestás, uso la recomendación.
