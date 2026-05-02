# Implementation Plan Index

Full build of `thegoldiraguide.com` — a branded educational hub for Liberty Gold Silver. Decomposed into independently shippable plans. Each plan produces working, tested software on its own and leaves the codebase in a deployable state.

## Execution order

Plans must be shipped in order. Later plans assume earlier ones are merged.

| # | Plan | File | Tag |
|---|------|------|-----|
| 1 | Foundation & Infrastructure | [`2026-04-19-foundation-infrastructure.md`](./2026-04-19-foundation-infrastructure.md) | `v0.1.0-foundation` |
| 2 | Sanity CMS & Authorship | [`2026-04-19-sanity-cms-authorship.md`](./2026-04-19-sanity-cms-authorship.md) | `v0.2.0-sanity` |
| 3 | Content Pillars & IA | [`2026-04-19-content-pillars-ia.md`](./2026-04-19-content-pillars-ia.md) | `v0.3.0-ia` |
| 4 | GSEO Surface | [`2026-04-19-gseo-surface.md`](./2026-04-19-gseo-surface.md) | `v0.4.0-gseo` |
| 5 | Interactive Tools Suite | [`2026-04-19-interactive-tools-suite.md`](./2026-04-19-interactive-tools-suite.md) | `v0.5.0-tools` |
| 6 | Real-Time Market Data | [`2026-04-19-real-time-market-data.md`](./2026-04-19-real-time-market-data.md) | `v0.6.0-market-data` |
| 7 | Data Visualization | [`2026-04-19-data-visualization.md`](./2026-04-19-data-visualization.md) | `v0.7.0-visualization` |
| 8 | Design System & A11y Polish | [`2026-04-19-design-system-a11y-polish.md`](./2026-04-19-design-system-a11y-polish.md) | `v1.0.0` |
| 9 | Strategic Content Authoring | [`2026-04-19-strategic-content-authoring.md`](./2026-04-19-strategic-content-authoring.md) | `v1.1.0-strategic-content` |
| 10 | Interactive Calculators | [`2026-04-22-interactive-calculators.md`](./2026-04-22-interactive-calculators.md) | `v1.2.0-calculators` |
| 11 | Ownership Disclosure & Editorial Tone | [`2026-04-22-ownership-disclosure-tone.md`](./2026-04-22-ownership-disclosure-tone.md) | `v1.3.0-ownership-tone` |
| 12 | Homepage Visual Redesign | [`2026-04-23-homepage-visual-redesign.md`](./2026-04-23-homepage-visual-redesign.md) | `v1.4.0-home-visual` |

## Dependency graph

```
1 ──▶ 2 ──▶ 3 ──▶ 4
               │
               ├──▶ 5 ──▶ 6 ──▶ 7
                              │
                              ▼
                              8
```

- **1 → 2:** Sanity schemas need the Next.js app + CI gates.
- **2 → 3:** Pillar routes read from Sanity.
- **3 → 4:** JSON-LD emission uses routed pages.
- **3 → 5:** Tool routes live inside the `(marketing)` group.
- **5 → 6:** Live ticker plugs into the existing ROI calculator.
- **5 → 7:** Charts replace the tabular trajectory in the Fee Drag Analyzer.
- **6 → 7:** Historical-spot chart depends on the market data pipeline.
- **8:** Runs across every prior plan once features are complete.

## How to execute

For each plan, in order:

1. `git checkout -b plan-N-<short-name>` from the tag of the previous plan.
2. Invoke the plan via `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans`.
3. Merge via PR when all CI gates are green.
4. Tag the plan's milestone (shown in the table above) and push the tag.
5. Proceed to the next plan.

## Source specifications

The three specs these plans implement:

- `Branded Gold IRA Education Site Strategy.md`
- `Designing a Financial Education Platform.md`
- `Technical Specification For Financial Platform.md`

If any specification conflicts with a plan step, the plan wins — the plan is the authoritative execution contract.
