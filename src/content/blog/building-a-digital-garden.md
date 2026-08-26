---
title: "Why Engineers Should Tend a Digital Garden"
description: "Moving away from transient streams toward compound personal knowledge networks."
date: 2024-12-01
updated: 2025-02-12
tags: ["garden", "learning", "writing"]
category: "garden"
minutesRead: 4
---

Most technical blogs operate like chronological streams: you write an article, publish it, and rarely touch it again. Over time, half of the archive becomes stale or obsolete.

A **Digital Garden** takes the opposite approach. It is an evolving workspace designed around ideas, connections, and continuous refinement.

## Streams vs. Gardens

| Aspect | The Stream (Traditional Blog) | The Garden (Digital Garden) |
| :--- | :--- | :--- |
| **Organization** | Chronological (reverse-date) | Associative / Interlinked |
| **Maturity** | All posts presumed "complete" | Explicit growth stages (🌱, 🌿, 🌲) |
| **Maintenance** | Publish and abandon | Continuous pruning and nurturing |
| **Structure** | Linear narrative | Web of connected concepts |

## How Breath Implements the Garden

1. **Bi-directional Wikilinks:** Connect notes using `[[note-slug]]` syntax to automatically generate rich backlink networks.
2. **Interactive Note Drawers:** Preview linked notes in Andy Matuschak-style slide-over panels without losing reading context.
3. **Maturity Badges:** Visually distinguish between raw sparks and battle-tested evergreen principles.

## In Practice

Andy Matuschak talks about this exact philosophy in his 2022 talk on working with evergreen notes:

https://www.youtube.com/watch?v=dGctPzUSzQ0

A useful conversation on the subject from X:

https://x.com/andy_matuschak/status/1438574028925181952

### Further Reading

The concept was popularized by [Maggie Appleton's essay on digital gardens](https://maggieappleton.com/garden-history), and the [Evergreen note-writing approach](https://notes.andymatuschak.org/z4SDCZQeRo4xFEQHJH9j4Q) is documented in detail by Andy Matuschak. For the tooling behind this site, check out the [Breath source code](https://github.com/netologist/breath) and the [Astro framework](https://astro.build). A second video walkthrough of the same ideas is embedded below:

https://youtu.be/a7mXKzV_1sQ
