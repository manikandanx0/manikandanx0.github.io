# Codebase & Site Discovery Audit (`SITE_AUDIT.md`)

**Site Context:** `manikandanx0.tech`  
**Purpose:** This document reports structural findings, inconsistencies, accessibility gaps, performance bottlenecks, and potential edge cases discovered during an end-to-end repository inspection. It is discovery-driven (reporting facts and observations) to assist in prioritization.

---

## 1. Client-Side Script & View Transition Lifecycle Gaps

### Finding: Inconsistent Event Handler Patterns
* **Observation:** In `src/pages/writing/index.astro`, script logic for sector and tag filtering is wrapped exclusively in a `DOMContentLoaded` event listener:
  ```javascript
  document.addEventListener("DOMContentLoaded", () => { ... });
  ```
  In contrast, `src/pages/about.astro` binds to both `DOMContentLoaded` and `astro:page-load`:
  ```javascript
  document.addEventListener("DOMContentLoaded", initAvatarDissolve);
  document.addEventListener("astro:page-load", initAvatarDissolve);
  ```
* **Impact:** Once Astro's `<ClientRouter />` is added to `BaseLayout.astro` (as specified in `ANIMATION_SPEC.md`), soft client-side navigation to `/writing` will **not** trigger `DOMContentLoaded`. As a result, the sector and tag filter buttons will become non-responsive when navigating via internal links.
* **Cross-Reference:** Flagged in `ANIMATION_SPEC.md` Section 2 as a prerequisite fix for route transition compatibility.

---

## 2. Text Extraction & Inline Spacing Anomalies

### Finding: Data Elements Rendered Without Separating Whitespace
* **Observation:** Multiple UI components output inline text elements without HTML spaces or CSS gap properties:
  1. **Homepage Hero Bar (`src/pages/index.astro` L52):** `<span class="blink">●</span>&thinsp;ONLINE // DISPATCH READY` uses thin space entities (`&thinsp;`), causing text extractors to read `●ONLINE // DISPATCH READY`.
  2. **Tag Chips Containers (`.feat__tags`, `.telem-tags`, `.post-hero-tags`):** When tags render as inline `<span>` elements inside flex containers, text copy-pasting or screen-reader reads can merge text (e.g. `AI / DSSecuritySystems` instead of `AI / DS Security Systems`).
  3. **Telemetry Metrics (`.telem-metric`):** Numerical values and labels are stacked vertically using flexbox, but lack fallback spacing when CSS styling fails to load or text is selected.
* **Cross-Reference:** Logged in `ANIMATION_SPEC.md` Section 4 as a shared pattern to fix before building animated telemetry components.

---

## 3. Font Loading Redundancy & Performance

### Finding: Duplicate Font Import Definitions
* **Observation:** Font imports are defined in two separate places:
  1. `src/layouts/BaseLayout.astro`: `<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono..." rel="stylesheet">` and `<link href="https://cdn.jsdelivr.net/npm/@fontsource/hack..." rel="stylesheet">`.
  2. `src/styles/global.css`: `@import url('https://fonts.googleapis.com/css2...')` and `@import url('https://cdn.jsdelivr.net/npm/@fontsource/hack...')`.
* **Impact:** Browsers parse both HTML link tags and CSS `@import` statements, triggering redundant HTTP network requests for the same font stylesheets. `@import` rules in CSS also block render trees until fetched.

---

## 4. Build Script Overhead & OG Image Generation

### Finding: Potential Double Execution of Open Graph Script
* **Observation:**
  - `package.json` L10 defines: `"build": "tsx scripts/generate-og.ts && astro build"`.
  - However, `src/pages/writing/[type]/[...slug].astro` and `src/pages/projects/[...slug].astro` also import and execute `generateOgImage()` directly inside `getStaticPaths()`.
* **Impact:** Running `pnpm build` executes `generate-og.ts` via `tsx` first, and then Astro's `getStaticPaths()` executes the same image generation calls again for every dynamic route, doubling PNG generation time during builds.

---

## 5. Residual Workspace Files & Directory Artifacts

### Finding: Non-Source Directory Artifacts
* **Observation:**
  1. `src/content/.obsidian` and `src/content/leetcode/.obsidian` exist within the source directory.
  2. Root directory contains empty files: `TODO.md` (0 bytes), `README.md` (0 bytes), and `CLAUDE.md` (9 bytes).
* **Impact:** While ignored by build tools, residual `.obsidian` folders inside content directories can trigger unnecessary file-watcher triggers in dev servers.

---

## 6. Accessibility & ARIA Attributes

### Finding: Unaudited Color Contrast & Missing ARIA Labels
* **Observation:**
  1. **Color Contrast:** Accent tokens like `--dim` (`#525684`) against background `#090a12` yield a contrast ratio of ~3.4:1, which falls below WCAG AA requirement (4.5:1) for small body text.
  2. **Filter Button State:** Filter buttons in `writing/index.astro` change visual state via `.active` class, but do not provide `aria-pressed="true|false"` or `aria-controls` for assistive technology.
  3. **Canvas Accessibility:** `#avatar-canvas` in `about.astro` lacks an `aria-label` or `role="img"` fallback description for screen readers.

---

## 7. CSS Variable Consistency

### Finding: Hardcoded Color Values in Component Styles
* **Observation:** `global.css` defines design tokens (`--surface`, `--panel`, `--border`, `--purple`, etc.). However, several `<style>` blocks in `index.astro`, `layout.css`, and `about.astro` use hardcoded RGB/RGBA values (e.g. `rgba(14, 15, 30, 0.95)`, `rgba(123, 63, 228, 0.18)`) instead of tokenized CSS variables with color-mix or opacity utilities.
* **Impact:** Theme adjustments (e.g. altering accent opacity or dark surface tint) require editing multiple files rather than updating `global.css` root tokens.

---

## Summary Table of Audit Findings

| Category | Item / Location | Severity / Priority | Suggested Action |
| :--- | :--- | :--- | :--- |
| **Routing / Scripts** | `writing/index.astro` `DOMContentLoaded` listener | **High** (Blocks ClientRouter) | Migrate listener to `astro:page-load`. |
| **Typography / Spacing** | Glued text & tag chip extraction on `index.astro` | **Medium** | Add gap & whitespace rules to shared tag/stat classes. |
| **Performance** | Duplicate font `@import` in `global.css` | **Medium** | Remove `@import` from `global.css`; rely on `<head>` preconnects. |
| **Build Optimization** | `package.json` `generate-og.ts` script duplication | **Low** | Consolidate OG generation inside `getStaticPaths` or standalone script. |
| **Cleanliness** | Residual `.obsidian` folders in `src/content/` | **Low** | Remove or exclude from content watchers. |
| **Accessibility** | Missing ARIA attributes on buttons & canvas | **Medium** | Add `aria-pressed`, `aria-label`, and audit contrast ratios. |
