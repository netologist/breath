---
title: Evaluating Latency and Partition Tolerance in Multi-Raft Clusters
description: An empirical study analyzing quorum consensus behaviors and tail latency during cross-datacenter network partitions and disk stalls.
date: 2025-06-18
venue: ACM SIGOPS Operating Systems Review
authors:
  - Hüseyin Özgan
  - Jane Smith
url: https://doi.org/10.1145/example-paper
pdfUrl: https://arxiv.org/pdf/2301.00001.pdf
doi: 10.1145/3456789.012345
tags:
  - distributed-systems
  - raft
  - fault-tolerance
  - research
featured: true
---

# Abstract

Multi-Raft architectures partition state machines into multiple distinct consensus groups to achieve horizontal scale. However, asymmetric network partitions and transient storage stalls can trigger cascading leader elections. This paper presents an empirical evaluation of latency under simulated adversarial partitions in multi-region deployments.

### Research Findings
- Tail latencies under single-node partition regimes.
- Pre-vote algorithms drastically cut unneeded term bumps.
- Optimizing heartbeat intervals versus false election triggers.
