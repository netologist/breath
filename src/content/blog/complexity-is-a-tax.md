---
title: "Complexity Is a Compounding Tax"
description: "Every unnecessary line of code and leaky abstraction charges interest on every future engineer who touches the codebase."
date: 2024-11-10
updated: 2025-02-05
tags: ["philosophy", "systems", "simplicity"]
category: "engineering"
minutesRead: 4
---

In finance, compound interest works in your favor when you invest, but against you when you borrow. In software engineering, **accidental complexity is high-interest debt**.

Every abstraction that leaks its internals, every boolean configuration flag added to bypass a refactor, and every undocumented side-effect charges an ongoing tax on velocity.

## The Cognitive Budget

Engineers don't slow down because they type slower; they slow down because their working memory is saturated.

When a developer needs to hold 14 different invariants, flags, and edge cases in mind just to add a single field to an API, velocity grinds to a halt.

```text
Cognitive Load Curve:
High │                 / Accidental Complexity
     │               /
     │             /
     │           /
Low  │─────────/──────── Essential Domain Logic
     └─────────────────────────────── Time
```

## How to Fight the Tax

1. **Delete relentlessly:** Code that is deleted requires zero maintenance, produces zero bugs, and has zero security vulnerabilities.
2. **Favor deep interfaces:** Encapsulate difficult implementation details behind narrow APIs. See [[abstractions-hide-complexity]].
3. **Tend the garden:** Treat the codebase like an evolving system rather than a landfill. See [[garden|Digital Garden philosophy]].
