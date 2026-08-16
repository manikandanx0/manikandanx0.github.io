---
title: Grid Layout Notes
date: 2026-08-08
excerpt: Notes on building a modular dotted-grid layout in Astro.
tags: [astro, css, ui]
draft: true
---

I wanted a layout that feels like graph paper without becoming noisy.

## What I changed

- Reusable two-column layout shell
- Dotted texture inside framed elements
- Consistent spacing tokens across pages

## Why this works

The same layout primitives are reused for home, listing, and detail pages.
