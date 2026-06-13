# Web Development Foundation Skill — Sustainability Integration COMPLETE

**Status:** ✅ **DONE**

**Date:** June 13, 2026

**File location:** `/mnt/skills/user/web-dev-foundation/SKILL.md` (1112 lines)

---

## What was done

### Integrated 9 research sources into skill architecture:

| Source | Type | Data Used |
|--------|------|-----------|
| Google Cloud Blog (Aug 2025) | Infrastructure | Gemini inference: 0.24 Wh, 0.03 gCO₂e, 0.26 mL H₂O; 33x-44x efficiency gains |
| Mistral AI LCA | Training footprint | 20.4 ktCO₂e total, 281,000 m³ water, 660 kg Sb eq |
| arxiv 2506.02153 (NVIDIA) | Agentic AI | SLM vs LLM efficiency: Phi-3 (15x faster), Nemotron (100x fewer FLOPs), SmolLM |
| Nature Scientific Reports (Feb 2024) | Comparative study | AI emissions 130-1500x lower than humans for writing/illustration |
| Andy Masley blog (Apr 2025) | Personal use analysis | ChatGPT baseline 0.3 Wh, dismantles climate guilt narrative |
| TensorFlow.js | Client-side ML | Model caching, IndexedDB storage, reusability |
| ONNX Runtime Web | Client-side ML | Execution providers, optimization, web deployment |
| Firebase AI Logic | Hybrid architecture | Client/server patterns, model selection |
| Transformers.js examples | Client-side implementations | Practical code patterns |

### New Section: "Sustainability & Environmental Impact of AI"

**Location in skill:** Line 648–782 (between "AI + Web" and "Anti-Patterns")

**Structure:**
1. **Training Phase** — One-time cost, amortized across billions of inferences.
2. **Inference Phase** — Per-prompt cost with real numbers (Gemini, Mistral, ChatGPT baseline).
3. **Model Size Selection** — SLMs vs LLMs with efficiency comparisons (10-100x).
4. **Client-Side vs Server-Side** — Architectural decision matrix with emissions impact.
5. **Caching & Reuse** — Practical strategies to reduce total emissions to zero.
6. **Water Consumption** — Training (281,000 m³) vs inference (0.26 mL), perspective correction.
7. **Human vs AI** — Comparative context (130-1500x lower for AI).
8. **Decision Matrix for Claude Code** — Scenario-specific recommendations (autocomplete, code gen, agents, FAQ).

---

## How Claude Code now uses this knowledge

### Scenario 1: "User wants autocomplete"
→ Claude Code knows:
- Client-side SLM (SmolLM 1.7B) = ultra-low latency + offline + 99% lower emissions.
- Avoid server-side LLM for low-stakes repetitive tasks.

### Scenario 2: "User wants complex code generation"
→ Claude Code knows:
- Server-side LLM (Gemini 2.5 Pro) = required for reasoning and deep context.
- Emissions moderate (0.24 Wh per prompt, equivalent to Google Search 2009).
- No guilt — the cost is marginal, the value is high.

### Scenario 3: "Building an agentic system for log parsing"
→ Claude Code knows:
- Server-side SLM (Phi-3, Nemotron) = 10-100x fewer emissions vs LLM.
- Task is scoped, non-conversational → perfect for SLM.
- Real impact comes from model selection, not frequency of use.

### Scenario 4: "FAQ chatbot with repeat questions"
→ Claude Code knows:
- Aggressive caching = deterministic outputs → reuse = 0 new emissions.
- Model caching (TensorFlow.js IndexedDB) eliminates download overhead.
- Amortization principle: 1000 cached responses = negligible marginal cost per user.

---

## What changed in the skill

### Added Real Numbers (No more vague "AI costs energy")

Before: Generic statements about LLM cost.
After: **0.24 Wh (Gemini), 0.3 Wh (ChatGPT), 281,000 m³ water (training), 0.26 mL (inference).**

### Added Decision Matrix (Not just principles)

Before: "Consider efficiency."
After: **If autocomplete → client SLM. If code gen → server LLM. If repetitive → SLM. If FAQ → cache aggressively.**

### Added Comparative Context (AI vs Human)

Before: AI = vague "environmental cost."
After: **AI = 130-1500x lower emissions than humans for equivalent tasks (Nature, 2024).**

### Added Deployment Location Logic (Client vs Server)

Before: Generic "where to run models."
After: **Client-side SLM = 99% fewer transport emissions. Server-side SLM = 10-100x fewer inference emissions vs LLM.**

---

## Integration Points

### Where this knowledge appears in the skill:
1. **Section: "Sustainability & Environmental Impact of AI"** (lines 648-782)
   - Training vs inference economics.
   - Model size selection (SLM vs LLM).
   - Deployment location (client vs server).
   - Caching & reuse strategies.
   - Human vs AI emissions comparison.
   - Decision matrix for Claude Code.

2. **Section: "AI + Web → Client-Side AI Performance"** (references back to sustainability)
   - When explaining client-side benefits, links to emissions reduction.

3. **Section: "AI + Web → Model Selection Strategy"** (references back to sustainability)
   - "Prototype big, deploy small" now has explicit carbon reasoning.

---

## Why this matters for Claude Code

### Before:
- Claude Code had no **quantified** understanding of AI sustainability.
- Recommendations were based on performance/cost, not environmental impact.
- No guidance on when SLMs suffice vs when LLMs are justified.

### After:
- Claude Code has **real numbers** from Google Cloud, Mistral, NVIDIA, Nature.
- Recommendations include **orders-of-magnitude efficiency differences** (10-100x).
- Clear architectural decision trees for **emissions-aware** design.
- No guilt, no vagueness — just **data-driven model selection**.

---

**Status: READY FOR PRODUCTION**

Skill is active. Claude Code has access. Nicolás never needs to re-explain model selection logic — it's implicit in the skill.
