---
title: "Notes on 'A Philosophy of Software Design'"
description: "Key insights on deep modules, information hiding, and reducing cognitive taxes from John Ousterhout's classic."
date: 2024-09-05
updated: 2025-01-28
tags: ["books", "architecture", "design", "complexity"]
category: "books"
minutesRead: 6
---

John Ousterhout's *A Philosophy of Software Design* is one of the most practical software engineering books written in the last decade. Rather than dogmatic design patterns, it focuses on the root enemy of software development: **complexity**.

Here are the central ideas that fundamentally reshape how we design systems.

## Nature of Complexity

Complexity is anything that makes software hard to understand or modify. It is characterized by three symptoms:

1. **Change Amplification:** A simple change requires modifications in dozens of scattered places.
2. **Cognitive Load:** How much knowledge a developer must load into working memory to complete a task.
3. **Unknown Unknowns:** When it is not obvious which pieces of code must be changed to achieve a goal.

## Deep vs. Shallow Modules

The most powerful design heuristic in the book is the concept of **Deep Modules**:

> *"A module is deep when it provides powerful functionality through a simple, minimal interface."*

```text
Deep Module:          Shallow Module:
┌──────────────┐      ┌────────────────────────────┐
│ Simple API   │      │ Verbose & Complex API      │
├──────────────┤      ├────────────────────────────┤
│ Rich Hidden  │      │ Minimal Implementation     │
│ Logic        │      └────────────────────────────┘
└──────────────┘
```

When abstractions are deep, they hide implementation details and relieve callers from bookkeeping duties. See our garden exploration on [[abstractions-hide-complexity]].

## Tactical vs. Strategic Programming

- **Tactical Programming:** Quick hacks, shipping the immediate feature as fast as possible without considering future architectural debt.
- **Strategic Programming:** Investing 10–20% of engineering time into getting abstractions right and continually pruning code entropy.

Related thoughts: [[complexity-grows-unless-pruned]] and [Complexity Is a Compounding Tax](/blog/complexity-is-a-tax).
