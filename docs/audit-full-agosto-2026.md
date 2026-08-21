# Full Audit + Ideas de Referentes — Agosto 2026

**Método:** 3 agentes en paralelo — (1) research de estudios referentes, (2) audit de código con rúbrica gstack `/review` + `/cso`, (3) audit UX/UI + behavioural design + detección de "feeling IA" con rúbrica gstack `/design-review` contra DESIGN.md y VOICE.md.
**Score de diseño:** C+ · **Score anti-slop (feeling IA):** C · **Trunk test del home:** FAIL
**Nota:** el research de referentes no pudo fetchear los sitios en vivo (egress bloqueado en sandbox) — es reconstrucción de conocimiento, verificar visualmente antes de copiar detalles.

---

## 1. BUGS (roto hoy — arreglar ya)

| # | Dónde | Qué |
|---|---|---|
| B1 | `reporte-impacto/index.html:561,572,606,607` | Los 4 CTAs de descarga del PDF usan `docs/…` relativo → resuelven a `/reporte-impacto/docs/…` → **404**. Fix: `../docs/`. |
| B2 | `proyectos/trace-group/index.html:89,118` | Referencian `img/logo.png` que no existe (solo hay .webp). Fallback del `<picture>` roto + JSON-LD con logo 404. |

## 2. RIESGOS (código)

- **R1 — Cache del SW sin bump automático** (`sw.js:1`, `build.sh`): assets cache-first congelados hasta bump manual de `CACHE_NAME`; build.sh imprime hashes pero no los usa. Deploy que olvide el bump = HTML nuevo con CSS/JS viejo.
- **R2 — Form fetch al endpoint no-AJAX de FormSubmit** (`main.js:468`): puede fallar por CORS y mostrar error aunque el mail salga. Fix: `formsubmit.co/ajax/<email>` en el fetch.
- **R3 — CSP con `unsafe-inline` en script-src** en las 10 páginas por un solo `onload=` del preload de CSS. Quitarlo anula la mayor debilidad del CSP.
- **R4 — deploy.yml publica docs internos**: auditorías, benchmarking, especificaciones — todo `docs/*.md` interno queda público y servido. Agregar al `rm -f` del workflow (este archivo incluido).
- **R5 — Quiz scoring hardcodea q1..q5** (`main.js:1212`): agregar una pregunta rompe el score en silencio.
- **R6 — Manifest solo en index y gracias**: el install prompt monta listeners muertos en las demás páginas.
- Menores: `Permissions-Policy`/`referrer` faltan en gracias y offline; actions de CI pineadas a tag y no a SHA.

## 3. DEUDA (código)

- **106 clases CSS muertas** de layouts anteriores (`.hero-viz`, `.argentina-map`, `.trust-badge*`, `.breadcrumbs*` ×2, `.proyecto-*`, `.thinking-*`, `.cta-button`…) — cientos de líneas eliminables de las 6.355.
- Tokens duplicados/huérfanos en `:root` (`--spacing-card` ×2, `--color-bg-light`, `--z-*` sin uso).
- `<style>` inline de trace-group redefine `:root` contradiciendo styles.css (gana según orden de carga).
- `<h3>` dentro de `<button>` en acordeones del reporte (inválido + rompe navegación SR).
- Quiz results sin `aria-live` ni foco (SR no se entera del resultado).
- `console.log` de debug en main.js; `scrollRestoration='manual'` global mata el back/forward scroll.
- `site.webmanifest` con `#0a0a0a` (negro puro prohibido por DESIGN.md) — el splash PWA sale fuera de marca.

## 4. BEHAVIOURAL DESIGN (lo que pierde plata)

1. **El primer scroll exporta tráfico**: tras el hero vienen 5 cards y 4 de 5 CTAs van a LinkedIn/Medium. El visitante se va antes de saber qué vendés. → About+Método antes de las cards, o links externos al final de páginas internas.
2. **El quiz desperdicia el pico de intención**: todos los resultados linkean `#services` (hacia arriba), nunca `#contact` (justo debajo). Una línea en main.js.
3. **Cuatro promesas de contacto contradictorias**: "llamada de 30 min en la semana" vs "24 horas" vs "propuesta en 2 días" vs "llamada *si hay match*" (gracias.html). Unificar en una sola, idéntica en todos lados.
4. **La autoridad enterrada**: la tesis de 56 páginas es un link inline dentro de un párrafo; el reporte es la card 9 de 9 en proyectos. → La Usina al nav global + bloque "Investigación publicada" antes del form.
5. **"Señales de la semana" fechadas enero, leídas en agosto**: frescura falsa que erosiona confianza. Renombrar + fechar + CTA a Substack.
6. Menores: marquee de logos ilegible (15s), links de metodología a `.md` crudo, "Agendá" sin agenda real, hero 100vh sin CTA ni scroll cue.

## 5. FEELING "HECHO POR IA" (lo pedido explícito)

Señales detectadas, por fuerza:

1. **Estadísticas estilo LLM**: "crecen 200% más rápido", "40% más probabilidad (ITONICS 2025)" — nadie que hizo el trabajo escribe así. Borrar o reemplazar por un caso propio con número real.
2. **Emojis como UI**: 📄 📘 en methodology-links. Fuera.
3. **Timelines clónicos**: los 4 servicios repiten "Semana 1/2/4" idéntico. Un practicante real varía (uno tarda 6 semanas, otro "semana 2-3").
4. **Grillas 3-columnas perfectamente simétricas** (señales, transformation-cards) — el layout IA más reconocible.
5. **Quiz = SaaS genérico**: progress bar + niveles + botón sólido naranja. Único bloque que podría estar en cualquier landing de HubSpot.
6. **Azul frío fuera de paleta** en el gradiente del hero (`rgba(10,37,64,…)`) — "ambiente" genérico en un sistema cálido.
7. **Cero idiosincrasia fuera de Usina**: sin colofón, sin fechas de edición, sin firmas. La página de la tesis (cita sugerida, disclaimer, "56 páginas") es el único lugar con textura humana — ese registro es el modelo a replicar.

## 6. COHERENCIA DESIGN.md / VOICE.md

- **Botones sólidos prohibidos**: quiz-submit/reset y filter-btn--active con fondo naranja.
- **Cuatro variantes del primary** (`#b8705a`, `#cd8763`, `#d98f6e`, `rgba(203,112,67)`) donde el sistema exige solo `#c16f52`.
- **`--spacing-section` 40-48px** vs los 160px que DESIGN.md declara signature — el "silencio visual" está aplastado a un tercio.
- **Corner brackets animados en hover** (DESIGN.md: "se intensifica en color, sin movimiento") y ausentes en reposo fuera de Usina.
- **VOICE**: cierres con pregunta retórica prohibida (proyectos:461, pensamiento:354), "claramente" en el quiz (index:953), "hojas de ruta" (metáfora prohibida) en JSON-LD, name-dropping académico (Voros/IDEO/Ries).

## 7. IDEAS DE REFERENTES (top 10, impacto/esfuerzo)

1. **Colofón técnico en footer** (Linked by Air): "Plus Jakarta Sans · sin cookies · HTML+CSS a mano · última act. ago 2026". Esfuerzo casi nulo, señal enorme de criterio humano.
2. **Numeración serial** (Normally): "Usina #01 — 08.2026" en cada entrega; el contador comunica práctica viva.
3. **Ficha de museo por proyecto** (Superflux): bloque final "Equipo / Comisionado por / Período / Estado" en tipografía pequeña con corner brackets.
4. **Bylines con nombre + fecha** (Other Internet): "Por Nicolás y Sergio — marzo 2026" en cada ensayo. Tres sociólogos con nombre > "equipo BPP".
5. **Abrir cada proyecto con la pregunta, no el entregable** (Superflux): puro copy, cero CSS.
6. **Footnotes reales** en textos largos (Other Internet): el gesto académico que tres sociólogos pueden hacer con legitimidad.
7. **Framework de señales débiles como producto versionado** (IF): página propia con "v0.9 — changelog" visible (conecta con el pending de CLAUDE.md y arregla los links a .md crudo).
8. **Índice-tabla plano** (Order): `/index` con proyecto · tipo · año como lista tipográfica densa — natural con los CTAs tipográficos de BPP.
9. **Links salientes honestos** (LBA): lo externo se lista como link con una línea factual, sin case-study inflado.
10. **Timestamp de última edición por página**: barato, y en un estudio de foresight la frescura fechada es argumento.

---

## PLAN DE EJECUCIÓN PROPUESTO (3 olas)

**Ola 1 — Bugs + quick wins de conversión (1 sesión):**
B1, B2, quiz→#contact, promesa única de contacto, borrar stats "200%"/emojis, azul del hero, La Usina al nav global.

**Ola 2 — Sistema y feeling (1-2 sesiones):**
Purga del primary a #c16f52 único, sin botones sólidos, brackets estáticos, spacing-section al alza, colofón + timestamps + bylines, variar timelines de servicios, reordenar funnel del home (About antes de cards).

**Ola 3 — Deuda técnica (1 sesión):**
Purga de 106 clases muertas, CSP sin unsafe-inline, bump automático de SW en build.sh, fetch AJAX de FormSubmit, manifest en subpáginas, a11y del quiz y acordeones, deploy.yml sin docs internos.
