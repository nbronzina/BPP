# Sustainability & Environmental Impact of AI — Quick Reference

**For Claude Code: Architectural decisions, not personal guilt.**

---

## The Numbers (Real Data)

### Inference Cost (Per-Prompt)
| Model/Service | Energy | CO₂e | Water | Source |
|---|---|---|---|---|
| **Google Gemini (median)** | 0.24 Wh | 0.03 gCO₂e | 0.26 mL | Google Cloud Blog, 2025 |
| **ChatGPT baseline** | 0.3 Wh | — | — | Andy Masley analysis |
| **Mistral Le Chat (400-token)** | — | 1.14 gCO₂e | 45 mL | Mistral LCA, 2025 |
| **Google Search (2009)** | 0.3 Wh | — | — | Historical baseline |

**Takeaway:** Modern LLMs are **equivalent to or better than Google Search 2009**. Worrying about personal use is irrelevant to climate.

### Training Cost (One-Time, Amortized)
| Model | Total CO₂e | Water | Resource Depletion | Lifecycle |
|---|---|---|---|---|
| **Mistral Large 2** | 20.4 ktCO₂e | 281,000 m³ | 660 kg Sb eq | Training + manufacturing, ~18 mo post-launch |

**Insight:** Amortized across billions of inferences = negligible per-prompt.

---

## Model Selection: SLMs vs LLMs

### Small Language Models (SLMs) — <10B parameters

| Model | Size | Performance vs LLM | Speed | Efficiency | Use Case |
|---|---|---|---|---|---|
| **Phi-3 Small** | 7B | Code generation on par w/ 70B | ~15x faster | ✅ Excellent | Coding agents |
| **Nemotron-H** | 2-9B | Instruction following ≈ 30B | ~100x fewer FLOPs | ✅✅ Exceptional | Tool calling |
| **SmolLM2** | 125M-1.7B | Tool calling ≈ 14B | Ultra-fast | ✅✅✅ Perfect | Lightweight tasks |

**Rule:** For **repetitive, scoped, non-conversational tasks** (90% of agent workloads), SLMs suffice.

**Carbon Impact:** SLM vs LLM = **10-100x fewer emissions per inference**.

---

## Deployment Location Decision Tree

```
Does task require offline or ultra-low latency? (<500ms)
├─ YES → Client-side SLM (Transformers.js, ONNX Web, MediaPipe)
│    └─ Emissions: 99% less than server (no transport + amortized edge inference)
│
└─ NO → Is accuracy the priority OR conversation required?
     ├─ YES → Server-side LLM (Gemini 2.5 Pro, Claude Opus)
     │    └─ Emissions: moderate, offset with caching + hybrid
     │
     └─ NO → Server-side SLM (Phi-3, Nemotron, SmolLM)
          └─ Emissions: 10-100x lower than LLM, near-client-side efficiency
```

---

## Mitigation: Caching & Reuse

**Concept:** Model outputs are **deterministic** for identical prompts. Reuse = 0 new emissions.

### Strategies
| Technique | Mechanism | Impact |
|---|---|---|
| **Model caching (TensorFlow.js)** | Store model in IndexedDB, load once | Eliminates repeat downloads, ~80% less network CO₂ |
| **Output caching (LLMs)** | Cache prompt→response pairs (deduplication) | Reduces inference to ~0 for frequently asked questions |
| **Model preloading (client-side)** | Fetch model during idle network time | Avoids real-time network overhead |

**Example:** An FAQ chatbot with 1000 cached responses = **0 additional inference cost** until content changes.

---

## Perspective for Claude Code

### What matters architecturally:
1. **Model size selection** — SLM vs LLM (orders of magnitude difference in energy).
2. **Deployment location** — Client vs server (99% reduction for client-side with local model).
3. **Caching strategy** — One-time work amortized across reuses.

### What is noise:
- Whether a user prompts Claude Code 5 times or 50 times in a day.
- Guilt over individual API calls to hosted LLMs (Gemini/ChatGPT).
- Worrying about training costs as an end-user.

**Focus:** Design systems where AI inference is a **marginal cost**, not the bottleneck. Model selection and deployment strategy dominate carbon footprint.

---

## Human vs AI Emissions (Comparative Context)

| Task | Human (gCO₂e) | AI (gCO₂e) | Ratio |
|---|---|---|---|
| Writing 1-page document | 180 | 1.38 | 130x less for AI |
| Illustration (visual output) | 2700 | 1.80 | 1500x less for AI |

**Source:** Nature Scientific Reports (Feb 2024)

**Implication:** AI as a **productivity amplifier** reduces total emissions when displacing human labor for repetitive tasks (e.g., generating boilerplate docs, code).

---

## Decision Matrix for Claude Code

| Scenario | Recommended Approach | Why |
|---|---|---|
| **User wants autocomplete** | Client-side SLM (e.g., SmolLM 1.7B) | Ultra-low latency, zero transport, offline |
| **User wants complex code generation** | Server-side LLM (Gemini 2.5 Pro) | Requires reasoning, context window |
| **Repetitive agent tasks (e.g., log parsing)** | Server-side SLM (Phi-3, Nemotron) | 10-100x more efficient than LLM |
| **FAQ chatbot** | Server-side SLM + aggressive caching | Amortized emissions → 0 for cached answers |

---

## Sources (All Referenced)

- Google Cloud Blog: "Measuring the environmental impact of AI inference" (Aug 2025).
- Mistral AI: Comprehensive LCA of Large Language Models.
- arxiv:2506.02153: "Small Language Models are the Future of Agentic AI" (NVIDIA Research).
- Nature Scientific Reports: "The carbon emissions of writing and illustrating are lower for AI than for humans" (Feb 2024).
- Andy Masley: "Using ChatGPT is not bad for the environment — a cheat sheet" (Apr 2025).
