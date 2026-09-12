---
title: Distributed KV Store
description: High-throughput, Raft-consensus distributed key-value store in Go with LSM-Tree storage engine and linearizable reads.
date: 2025-11-15
tags:
  - go
  - raft
  - distributed-systems
  - lsm-tree
repo: https://github.com/netologist/breath
status: completed
featured: false
role: Author
---

# Distributed Key-Value Store

An educational and high-performance implementation of the Raft consensus algorithm combined with a Log-Structured Merge (LSM) tree persistent storage engine.

### Architecture
- **Consensus:** Strict Raft leader election, log replication, and cluster membership changes.
- **Storage:** MemTable in RAM with Write-Ahead Log (WAL), tiered SSTables on disk.
