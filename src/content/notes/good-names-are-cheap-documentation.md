---
title: "Good Names Are the Cheapest Documentation"
description: "Precise naming aligns code with mental models and eliminates the need for redundant comments."
stage: seedling
tags: ["clean-code", "refactoring"]
category: "clean-code"
created: 2024-11-05
updated: 2025-02-10
---

A variable or function name is read a hundred times more often than it is written. Investing a few minutes to find the exact, unambiguous name pays dividends across the entire lifetime of a codebase.

### Rules of Thumb

- **Name by intent, not implementation:** `isEligibleForDiscount()` rather than `checkUserFlagsAndOrderTotalGreaterThanFifty()`.
- **Avoid vague nouns:** Names like `Manager`, `Processor`, `Helper`, and `Data` obscure true domain responsibility.
- **Match precision to scope:** Loop indices can be `i` for a 2-line loop, but package-level types must be crystal clear.

Related thoughts on module clarity: [[abstractions-hide-complexity]].
