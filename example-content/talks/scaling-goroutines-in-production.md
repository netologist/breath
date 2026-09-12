---
title: Scaling Goroutines & Concurrency Patterns in Production
description: Deep dive into goroutine lifecycle management, channel patterns, worker pools, and memory leaks in high-load Go microservices.
date: 2026-05-20
event: GopherCon Europe 2026
location: Berlin, Germany
url: https://www.youtube.com/watch?v=dsTXcSeAZq8
slidesUrl: https://speakerdeck.com/player/a3674bbec0c44fb7b4df4c356e9c4038
tags:
  - go
  - concurrency
  - performance
  - systems
language: en
featured: true
---

# Talk Overview

Concurrency in Go is cheap, but goroutines are not free. In high-throughput distributed systems, unmanaged goroutine spawning leads to runaway memory usage, GC pressure, and latent goroutine leaks.

### Topics Covered
1. Channel ownership patterns: who closes what and when.
2. Context propagation, cancellation deadlines, and cascading timeouts.
3. Bounded worker pools vs dynamic fan-out workers.
4. Diagnosing production leaks using `net/http/pprof` and goroutine stack dumps.
