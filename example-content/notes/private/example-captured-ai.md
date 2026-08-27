---
title: "AI Capture: Distributed Consensus and Raft Fundamentals"
description: "Raw AI research capture exploring Raft leader election, log replication, and Byzantine failure modes."
stage: captured
para: resources
source: "Claude research session on distributed systems consensus (2026-08-27)"
category: architecture
tags:
  - distributed-systems
  - consensus
  - ai-capture
created: 2026-08-27
private: true
---

# AI Capture: Distributed Consensus and Raft Fundamentals

> **Note lifecycle:** This is a **Captured** note (`stage: captured`). It represents raw, unprocessed AI research material stored in `content/notes/private/` behind Cloudflare Basic Auth.
> Once organized, distilled, and verified, it can advance to `stage: seedling` or `stage: budding`, and eventually become an `evergreen` note published publicly.

## Summary of Raft State Machine

Raft decomposes consensus into three independent subproblems:

1. **Leader Election:** A leader must be elected when an existing leader fails.
2. **Log Replication:** The leader accepts log entries from clients and replicates them across followers.
3. **Safety:** If any server has applied a particular log entry to its state machine, no other server may apply a different log entry for the same log index.

### Server States

At any time, each server is in one of three states:
- **Leader:** Handles all client requests and coordinates replication.
- **Follower:** Completely passive; responds to incoming RPCs.
- **Candidate:** Used during leader election to collect votes.

```
       [Start]
          |
          v
    +------------+    Times out, starts election    +-------------+
    |  Follower  | -------------------------------> |  Candidate  |
    +------------+                                  +-------------+
          ^                                                |
          |  Discovers current leader                      |  Receives votes from
          |  or higher term                                |  majority of servers
          |                                                v
          |           Discovers server with higher term   +-------------+
          +---------------------------------------------- |   Leader    |
                                                          +-------------+
```

## Provenance & Follow-up Actions

- **Source:** Generated via AI query on consensus protocols.
- **Related garden notes:** [[preventing-goroutine-leaks]] (Go concurrency in distributed nodes).
- **Distillation target:** Extract practical Go implementation notes into a public seedling note once tested.
