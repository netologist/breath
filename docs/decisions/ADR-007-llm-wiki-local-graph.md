# ADR-007: LLM-Wiki — local knowledge graph with a privacy boundary

## Status
Accepted

## Date
2026-08-27

## Context

The author wants an LLM-Wiki workflow: AI agents query an indexed knowledge
graph of the site's documents (via Graphify) and generate research content.
The graph must include private and captured notes to be useful, but ADR-004
established that private content must never reach the public site. A graph
index is a derivative of the content — if it were deployed, private notes
would leak through it. Agent-generated output may also reference notes the
author meant to keep private.

## Decision

- **The graph is a local authoring tool:** `graphify-out/` (or equivalent) is
  gitignored and never deployed with the site. It is generated on demand by the
  author and queried by AI agents in the author's environment. Because it never
  ships, it may index **all** notes, including private and captured ones.
- **Recursive, private-aware wikilink resolution:** the wikilinks plugin scans
  the notes tree recursively (currently top-level only) so private/captured
  notes resolve correctly for the author (private↔private links work). When a
  **public** note links to a private or captured note, the build emits a
  warning — the link would otherwise silently 404 or leak a title.
- **Agent rule:** the site repo ships an instruction (AGENTS.md) stating that
  public output must not carry wikilinks or references to private/captured
  notes, even when the graph query returned them. This is a process rule, not
  theme code.
- **Theme contribution:** the workflow (build the local graph, query it, the
  privacy rules) is documented in the guide; Graphify is not a dependency of
  the theme.

## Alternatives Considered

### Deploy the graph with the site
- Pros: a queryable public garden graph.
- Cons: leaks private/captured note titles and structure (ADR-004 violation).
- Rejected.

### Index only public notes, deploy the graph
- Pros: no leak.
- Cons: halves the research workflow — captures and private reasoning stay
  outside the LLM-Wiki, defeating its purpose.
- Rejected.

## Consequences

- A fresh clone has no graph until the author generates one; agents in CI or
  other environments cannot see it. Acceptable: the graph is a personal
  authoring aid.
- Build warnings are advisory; the author is responsible for acting on them
  (the AGENTS.md rule makes the failure mode unlikely).
- Wikilinks to private notes now resolve author-side instead of 404ing — a
  usability improvement for the personal workflow.
