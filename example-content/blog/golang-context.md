---
title: "Mastering context.Context in Go"
description: "How to propagate cancellation signals, request deadlines, and scoped metadata across API boundaries."
date: 2024-10-22
updated: 2025-01-12
tags: ["go", "concurrency", "patterns"]
category: "go"
series: "Go in Production"
seriesOrder: 1
minutesRead: 5
---

In Go, `context.Context` is the foundational primitive for carrying deadlines, cancellation signals, and request-scoped values across API boundaries and goroutines.

Understanding how context propagates is crucial for building reliable network services.

## The Rule of First Parameter

By convention and design, `ctx` is always passed as the first parameter to functions performing I/O:

```go
func QueryDatabase(ctx context.Context, query string) (*Result, error)
```

Never store a `Context` inside a struct; pass it explicitly down the call graph.

## 1. Deadlines and Timeouts

Always attach timeouts to outbound network requests to avoid hanging goroutines when upstream dependencies degrade:

```go
ctx, cancel := context.WithTimeout(parentCtx, 2*time.Second)
defer cancel()

req, err := http.NewRequestWithContext(ctx, http.MethodGet, targetURL, nil)
if err != nil {
    return err
}

resp, err := client.Do(req)
if err != nil {
    if errors.Is(ctx.Err(), context.DeadlineExceeded) {
        return fmt.Errorf("upstream service timed out after 2s: %w", err)
    }
    return err
}
```

## 2. Cancellation Trees

When a parent context is cancelled, all derived children are cancelled automatically. This creates clean hierarchical cleanup:

```text
HTTP Request Context (Cancelled on client disconnect)
 ├── DB Query Context (Cancelled immediately)
 └── Cache Lookup Context (Cancelled immediately)
```

## 3. Context Constructors at a Glance

| Constructor | Cancellation Trigger | Primary Use Case |
| :--- | :--- | :--- |
| `context.Background()` | Never | Root of all request and job execution trees |
| `context.TODO()` | Never | Development placeholder or un-refactored paths |
| `context.WithCancel()` | Explicit `cancel()` call | Graceful shutdown, user cancellation |
| `context.WithTimeout()` | Duration elapsed or explicit | Outbound HTTP calls, database queries |
| `context.WithDeadline()` | Absolute timestamp reached | Hard SLA cutoffs, scheduled batch jobs |
| `context.WithValue()` | Inherited from parent | Trace IDs, request authentication tokens |

## 4. Values in Context: What Belongs There?

Only request-scoped metadata belongs in `context.WithValue`:
- **Good:** Trace IDs, authenticated user claims, correlation IDs.
- **Bad:** Database connections, optional parameters, business domain models.

For further reading on lifecycle safety, see [Managing Goroutine Lifecycles in Go](/blog/golang-goroutines).
