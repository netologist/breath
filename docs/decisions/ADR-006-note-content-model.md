# ADR-006: Note content model — captured stage, PARA, and source provenance

## Status
Accepted

## Date
2026-08-27

## Context

The author wants to run a PARA/CODE knowledge workflow: AI-generated research
content lands in the notes as raw **captures**, is later organized (PARA),
distilled, and finally expressed as mature notes or documents. The existing
notes schema has `stage: seedling | budding | evergreen` (maturity) and
`category` (topic), but no way to mark raw research input, no PARA axis, and no
provenance for where AI content came from.

## Decision

- **One new stage value:** `stage: captured` is added **before** `seedling`. The
  maturity ladder becomes `captured → seedling → budding → evergreen`, with
  `evergreen` unchanged as the terminal stage for distilled notes. No other
  labels are introduced — a distilled note is still an `evergreen` (or a
  published document). `captured` marks raw, unprocessed input (typically
  AI-generated) — research material, not a claim the author stands behind.
- **Captured notes are private by default:** the `captured` stage implies the
  ADR-004 private mechanism (excluded from all public surfaces, auth-gated
  URL). Captured notes must live under `content/notes/private/` so their URL
  carries the gated prefix. An author can explicitly publish one later by
  distilling it (moving it up the ladder) and setting `private: false`.
- **PARA as a frontmatter field:** `para: projects | areas | resources |
  archives` (optional). Chosen over a folder structure because PARA's nature is
  that notes move between categories over time; a folder move would change the
  URL and break wikilinks, a field edit does not. PARA is orthogonal to the
  topical `category`, the lifecycle `stage`, and the visibility `private`.
- **Provenance:** `source` — an optional free-text string recording where the
  content came from (LLM name, URL, document, graphify query). Used primarily
  on captured notes so distillation can answer "where did I get this?".
- **No drafts for notes:** the author explicitly opted out. `private` /
  `public` is sufficient — WIP notes stay private. Posts keep their existing
  `draft` support unchanged.

## Alternatives Considered

### PARA as folders (`content/notes/projects/...`)
- Pros: physical organization matches PARA's mental model.
- Cons: notes moving between PARA categories changes URLs and breaks wikilinks;
  conflicts with the `content/notes/private/` gating convention.
- Rejected.

### `captured` as a separate boolean instead of a stage value
- Pros: stage stays untouched.
- Cons: capture is genuinely a lifecycle stage (before seedling); a boolean
  would need special-casing everywhere the stage is rendered.
- Rejected.

### Draft support for notes
- Pros: parity with posts.
- Cons: the author judged private/public sufficient; drafts would add a second
  "not public" concept that overlaps `private`.
- Rejected by the author.

## Consequences

- The stage enum, `para`, and `source` extend the notes schema; UIs that render
  stage labels need a `captured` entry (`evergreen` rendering is unchanged).
- A `stage: captured` note outside `content/notes/private/` is a config error —
  it would be excluded from listings but its URL would not be auth-gated. The
  guide must state the convention.
- Distillation is a manual authoring process (stage + visibility edits), not a
  theme feature.
