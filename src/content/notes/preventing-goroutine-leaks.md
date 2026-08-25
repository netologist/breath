---
title: "Preventing and Detecting Goroutine Leaks"
description: "Common leak patterns in Go concurrency and how to audit them with tooling."
stage: budding
tags: ["go", "performance", "concurrency"]
category: "go"
created: 2024-11-20
updated: 2025-01-10
---

In Go, starting a goroutine is as simple as the `go` keyword. But an abandoned goroutine that never exits is a permanent memory leak — its stack and heap allocations cannot be reclaimed by the garbage collector.

### The Classic Nil Channel / Blocked Receive Leak

```go
func QueryFirst(ctx context.Context, urls []string) string {
    ch := make(chan string) // Unbuffered!
    for _, url := range urls {
        go func(u string) {
            ch <- fetch(u) // Blocked forever if context cancels or first response wins!
        }(url)
    }
    return <-ch
}
```

### Detection Tools

1. **`go.uber.org/goleak`:** Catch leaked goroutines in unit tests before merging to `main`:
   ```go
   func TestMain(m *testing.M) {
       goleak.VerifyTestMain(m)
   }
   ```
2. **Runtime metrics:** Track `runtime.NumGoroutine()` in production dashboards to spot upward-trending slopes.

See also the full guide on managing lifecycles in the blog: [Managing Goroutine Lifecycles in Go](/blog/golang-goroutines).
