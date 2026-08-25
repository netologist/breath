---
title: "Complexity Grows Automatically; Simplicity Takes Effort"
description: "Entropy is the default state of any evolving codebase. Keeping systems simple requires deliberate pruning."
stage: evergreen
tags: ["architecture", "systems", "philosophy"]
category: "architecture"
created: 2024-10-04
updated: 2025-01-20
---

Software systems are subject to architectural entropy. Every new feature, edge case, and temporary shortcut adds cognitive weight. Without deliberate refactoring, systems become difficult to understand, modify, and maintain.

### The Mechanism of Accumulation

Complexity rarely arrives in one massive disaster. It accumulates through hundreds of small decisions:
- Adding boolean flags to multi-purpose functions.
- Leaking leaky abstractions into high-level domain logic.
- Suppressing edge-case warnings instead of fixing root invariants.

### Countermeasures

1. **Strategic Refactoring:** Dedicate 10-20% of every feature cycle to pruning dead abstractions and unifying fragmented patterns.
2. **Design for Deletion:** Make modules modular and isolated enough that whole subsystems can be deleted in a single pull request.
3. Keep module interfaces deep: see [[abstractions-hide-complexity]].
