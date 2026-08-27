---
title: "Abstractions Should Hide Complexity, Not Shift It"
description: "A good abstraction encapsulates difficult details behind a simple, intuitive surface."
stage: evergreen
tags: ["design", "architecture", "simplicity"]
category: "design"
created: 2024-09-12
updated: 2025-02-01
---

The fundamental purpose of an abstraction is to reduce the amount of information a developer must hold in their head simultaneously.

In *A Philosophy of Software Design*, John Ousterhout defines a **deep module** as one that provides powerful functionality through a simple, minimal interface:

```text
Deep Module:
┌──────────────────────────────┐
│       Simple Interface       │
├──────────────────────────────┤
│                              │
│   Extensive Implementation   │
│       & Hidden Details       │
│                              │
└──────────────────────────────┘
```

### The Failure Mode: Shallow Abstractions

When an abstraction merely renames underlying operations or requires the caller to manage low-level state transitions, it is a *shallow abstraction*. Shallow abstractions add indirection without reducing cognitive load.

Key tenets:
- **Hide implementation details:** Callers shouldn't need to know internal caching strategies or lock orderings.
- **Provide sensible defaults:** Common use cases should require zero configuration.
- Connects directly with [[complexity-grows-unless-pruned]] and [[good-names-are-cheap-documentation]].
