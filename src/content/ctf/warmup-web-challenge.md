---
title: Warmup Web Challenge Writeup
date: 2026-08-07
event: MiniCTF 2026
difficulty: easy
tags: [web, xss, beginner]
draft: false
---

This challenge had a reflected XSS sink hidden behind a weak input filter.

## Steps

1. Enumerated endpoints
2. Found unsanitized query reflection
3. Used encoded payload to bypass naive filter

## Flag

`flag{sample-ctf-writeup}`
