# Trends de diseño web 2026 — estudios de diseño estratégico

**Fecha:** 2026-08-21 · **Método:** research cruzado de ~15 fuentes (galerías con ejemplos reales priorizadas sobre listicles de marketing), filtrado contra DESIGN.md v2.2 soft-editorial y VOICE.md.

**Conclusión central:** la convergencia 2026 es *editorial + cálido + táctil + humano* — BPP ya está parado exactamente ahí. La jugada no es pivotar: es profundizar ejecución.

---

## Trends confirmadas (3+ fuentes) y veredicto para BPP

| Trend | Veredicto | Nota |
|---|---|---|
| Editorial-first / type-driven layouts | **YA LO TIENE** | El refresh v2.2 es esta ola; profundizar, no perseguir |
| Paletas cálidas terrosas ("nature distilled") | **YA LO TIENE** | #1a1512 + #c16f52 es la paleta que otros van a copiar; no diluir |
| Textura táctil / grano ("tactile rebellion") | **PROFUNDIZAR** | Grano ya está; evolución: densidad distinta por superficie |
| Anti-AI / imperfección humana como valor | **YA LO TIENE** | Sumar señales de "ficha de archivo" (ver aplicaciones) |
| Big type a escala viewport | **ADAPTAR** | Jerarquía elegante con PJS 300↔700, no tamaño bruto |
| Kinetic typography contenida | **ADAPTAR con freno** | Solo micro-movimientos, siempre prefers-reduced-motion |
| Scrollytelling para info compleja | **ADOPTAR** | BPP vende análisis: contar un caso con scroll ES el servicio |
| Broken grid / floating minimalism | **ADAPTAR** | Offsets moderados dentro de la grilla de 8px |
| Serif revival / pairing serif+sans | **IGNORAR** | DESIGN.md: familia única. Contraste por peso, no por familia |
| Variable fonts como infraestructura | **ADOPTAR** | PJS variable: 1 archivo vs 5, menos peso, micro-transiciones |
| Dark mode dominante (warm, no negro) | **YA LO TIENE** | #1a1512 es la versión correcta del trend |

## Trends a evitar (slop o moda que envejece mal)

- **Bento grids** — commoditizado; el nuevo hero genérico de SaaS
- **Glassmorphism** — blur frío mata la atmósfera de papel; veto sostenido
- **Neo-brutalism / retro pixel** — contra-reacción ruidosa; fechado en 18 meses
- **3D/WebGL heroes** — costo de performance brutal; señal de agencia grande
- **Neumorphism** — zombie trend de listicle
- **AI imagery genérica** (purple gradients, humanos sintéticos) — lo más quemado según encuestas 2026; una sola imagen así destruye el posicionamiento
- **Kinetic type espectáculo** (letras que persiguen el cursor) — Awwwards-bait

## Aplicaciones concretas (impacto/esfuerzo)

1. **[index] Hero a escala editorial** — h1 a `clamp(2.5rem, 8vw, 6rem)`, leading apretado, mezcla de peso 300/700 en la misma frase. El titular ES el hero. Alto/bajo.
2. **[global] PJS variable** — 1 woff2 reemplaza 5 pesos; hover de CTAs con transición de peso via `font-variation-settings`. Alto/bajo.
3. **[/proyectos] Scrollytelling en un caso insignia** — cifra sticky que se actualiza mientras el relato scrollea (extender el IntersectionObserver existente). Alto/medio.
4. **[/pensamiento] Índice archival** — listado ficha de archivo: número tabular, fecha, tema; hover revela extracto. Alto/medio.
5. **[/usina] Brackets que se dibujan** — animación de trazo al entrar en viewport, SOLO acá (refuerza que es firma). Medio/bajo.
6. **[index] Offsets en Hechos** — cards desalineadas ±1 columna del eje, más aire vertical. Medio/bajo.
7. **[global] Grano por capas** — noise más denso en surface que en bg (gramajes de papel distintos). Medio/bajo.
8. **[/proyectos] Ficha técnica por proyecto** — año / organismo / señal / estado en caps pequeñas. Medio/bajo.

## Fuentes

Creative Bloq (tactile rebellion, dic 2025) · Fireart · Squarespace ES (Archival Index, Floating Minimalism) · Wix ES · Envato Elements · DesignFlea (tipografía) · TheeDigital · line25 · crea8ivesolution (anti-AI) · brutalism.plus · dev.to/studiomeyer (retrospectiva jul 2026) · Awwwards · Naturaily · DesignMantic · writerdock (saturación bento).

Descartado por falta de ejemplos reales: "AI chatbots en todo sitio", "voice UI", neumorphism (solo en listicles de website builders).
