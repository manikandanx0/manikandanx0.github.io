# MANI.TECH — Typography System Correction
## Geist + Geist Mono

You are working on the existing MANI.TECH website.

Your task is to **audit the current typography implementation, fix inconsistencies, and enforce the typography system below across the entire site**.

Do not redesign the website.
Do not change the existing visual identity, layout, spacing system, colors, components, or content unless a change is strictly necessary to correct a typography-related problem.

The goal is to make the typography feel intentional, technical, modern, highly readable, and consistent.

---

## 1. FONT SYSTEM

Use exactly two typefaces.

### Geist

Use Geist for all human-readable content:

- Logo / wordmark
- Hero headlines
- H1 / H2 / H3
- Card titles
- Post titles
- Body text
- Paragraphs
- Descriptions
- Names
- Human-readable field values
- Buttons containing normal words or phrases

CSS variable:

```css
--font-display: 'Geist', 'Segoe UI', sans-serif;
```

### Geist Mono

Use Geist Mono for system/interface information:

* Navigation
* Labels
* Eyebrows
* Tags
* Chips
* Timestamps
* Dates
* Metadata
* Status indicators
* Technical identifiers
* Version numbers
* Categories
* System output
* Small UI strings

CSS variable:

```css
--font-mono: 'Geist Mono', 'SFMono-Regular', Consolas, 'Liberation Mono', monospace;
```

Do NOT introduce any third font.

Remove existing references to fonts such as:

* Space Grotesk
* IBM Plex Mono
* Plex Sans
* Chakra Petch
* Inter
* Roboto
* Any other decorative or fallback web font

Use the two-font system consistently.

---

# 2. FONT LOADING

Prefer the project's existing font-loading mechanism.

If the project uses Google Fonts, use the appropriate Geist/Geist Mono import.

If the project already bundles the fonts locally, keep the local approach.

Do not introduce unnecessary external font dependencies if the project already has a working font setup.

Make sure there are no duplicate font imports.

---

# 3. CORE TYPOGRAPHIC RULE

Use this semantic distinction:

> Geist = CONTENT
> Geist Mono = SYSTEM

Do NOT determine the font purely from font size.

Small text is not automatically Mono.

For example:

```text
NAME          Manikandan
LOCATION      Chennai, India
ROLE          AI/DS Student
```

The labels use Geist Mono.

The values use Geist.

But:

```text
STATUS        ACTIVE
VERSION       v3.2
UPDATED       2026-08-15
TIME          16:42:08
```

The system values can use Geist Mono because they represent machine/system information.

The distinction is based on what the text represents.

---

# 4. TYPE SCALE

Implement a coherent responsive scale.

Use these as the baseline:

```css
:root {
  --text-hero: clamp(2.25rem, 1.25rem + 3.5vw, 3.6rem);
  --text-h2: clamp(1.15rem, 0.95rem + 0.55vw, 1.35rem);
  --text-h3: clamp(1rem, 0.9rem + 0.3vw, 1.1rem);

  --text-logo: 1.15rem;

  --text-body: clamp(0.98rem, 0.9rem + 0.2vw, 1.05rem);
  --text-value: 0.95rem;

  --text-label: 0.8rem;
  --text-nav: 0.85rem;
  --text-tag: 0.75rem;
  --text-meta: 0.7rem;
}
```

Do not blindly apply these values to elements where they create layout problems.

Audit the existing site and adjust only where necessary to maintain:

* hierarchy
* readability
* responsive behavior
* accessibility
* visual consistency

---

# 5. TYPOGRAPHIC HIERARCHY

### Hero

```css
font-family: var(--font-display);
font-size: var(--text-hero);
font-weight: 700;
line-height: 1.05;
letter-spacing: -0.5px;
```

The hero should be the strongest typographic element.

Do not make the entire page bold to compete with it.

---

### H2 / Section Titles

```css
font-family: var(--font-display);
font-size: var(--text-h2);
font-weight: 600;
line-height: 1.2;
letter-spacing: 0;
```

---

### H3 / Card Titles

```css
font-family: var(--font-display);
font-size: var(--text-h3);
font-weight: 600;
line-height: 1.25;
letter-spacing: 0;
```

---

### Body

```css
font-family: var(--font-display);
font-size: var(--text-body);
font-weight: 400;
line-height: 1.65;
letter-spacing: normal;
```

Do not add tracking to paragraphs.

---

### Field Values

```css
font-family: var(--font-display);
font-size: var(--text-value);
font-weight: 500;
```

Use Geist for human-readable values.

---

### Navigation

```css
font-family: var(--font-mono);
font-size: var(--text-nav);
font-weight: 500;
letter-spacing: 1.5px;
```

Navigation should feel like interface/system text, but remain readable.

---

### Labels / Panel Titles

```css
font-family: var(--font-mono);
font-size: var(--text-label);
font-weight: 500;
letter-spacing: 1.5px;
```

---

### Tags / Chips

```css
font-family: var(--font-mono);
font-size: var(--text-tag);
font-weight: 500;
letter-spacing: 0.5px;
```

Do not make tags excessively large.

---

### Metadata / Timestamps

```css
font-family: var(--font-mono);
font-size: var(--text-meta);
font-weight: 400;
letter-spacing: 1.5px;
line-height: 1.4;
```

---

# 6. WEIGHT SYSTEM

Use only these weights unless the loaded font configuration requires otherwise:

```text
700 → Hero + logo
600 → H2/H3/titles
500 → Field values + interface UI
400 → Body + metadata
```

Do not use `700` everywhere.

Do not make field values bold merely to make them stand out.

Hierarchy should come from:

1. Size
2. Weight
3. Position
4. Whitespace
5. Color/contrast

—not from excessive bolding.

---

# 7. LETTER SPACING

Use tracking intentionally.

### Hero

```css
letter-spacing: -0.5px;
```

Do not use positive tracking on the hero.

### Headings

```css
letter-spacing: 0;
```

### Body

```css
letter-spacing: normal;
```

Never artificially track paragraphs.

### Mono UI

Labels:

```css
letter-spacing: 1.5px;
```

Navigation:

```css
letter-spacing: 1.5px;
```

Tags:

```css
letter-spacing: 0.5px;
```

Metadata:

```css
letter-spacing: 1.5px;
```

Do not use extreme letter spacing.

---

# 8. LINE HEIGHT

Use:

```css
Hero       → 1.05
H2         → 1.20
H3         → 1.25
Body       → 1.65
Metadata   → 1.40
```

Body text must have enough vertical breathing room to remain comfortable for long reading.

---

# 9. IMPORTANT: FIX EXISTING TYPOGRAPHY PROBLEMS

Before changing the implementation, inspect the entire project.

Search for:

* hardcoded font-family declarations
* old font imports
* CSS variables referencing old fonts
* component-level font overrides
* inline font styles
* Tailwind font classes if present
* duplicated font loading
* inconsistent font weights
* inconsistent heading sizes
* inconsistent letter spacing
* inconsistent line heights

Replace outdated typography rules with the new Geist + Geist Mono system.

Do not leave old font references behind.

---

# 10. TYPOGRAPHY CONSISTENCY AUDIT

Check every major UI area:

* Header
* Navigation
* Hero
* About section
* Profile information
* Sector sections
* Cards
* Blog/post listings
* Tags
* Filters
* Buttons
* Metadata
* Footer
* Mobile navigation
* Responsive layouts

The same semantic text should use the same typography regardless of which page or component it appears in.

For example:

If a tag uses Geist Mono on the homepage, it must not suddenly use Geist on the writing page.

If post titles use Geist 600, they should not use a different weight elsewhere.

---

# 11. ACCESSIBILITY AND READABILITY

Fix typography if the current implementation causes:

* text smaller than necessary
* poor contrast
* cramped line-height
* excessive tracking
* overly dense paragraphs
* headings that are too close in size
* poor mobile readability

Do not sacrifice readability for the "technical" aesthetic.

Geist Mono should primarily be used for short strings.

Do not use Geist Mono for long-form prose.

---

# 12. MOBILE TYPOGRAPHY

Audit the mobile layout specifically.

The typography must not:

* become too small
* create horizontal overflow
* cause headings to collide
* create awkward line breaks
* make navigation unreadable
* make tags/chips excessively wide

The hero may wrap naturally.

Do not force headlines onto one line if doing so damages readability.

Do not use aggressive negative tracking to force text to fit.

---

# 13. CONTENT VALUES VS SYSTEM VALUES

Use this distinction carefully.

### Human-readable → Geist

```text
Manikandan
Chennai, India
AI & Data Science
Cloud Security
Building practical systems...
```

### System-oriented → Geist Mono

```text
ACTIVE
v3.2
2026-08-15
16:42:08
CTF
READ_TIME: 04:32
STATUS: ONLINE
```

Labels:

```text
NAME
LOCATION
ROLE
STATUS
UPDATED
```

→ Geist Mono.

Values:

```text
Manikandan
Chennai, India
AI & DS Student
```

→ Geist unless the value is explicitly machine/system output.

---

# 14. DO NOT OVER-STYLE THE FONT

The typography should feel:

* technical
* precise
* modern
* editorial
* readable
* restrained

Avoid:

* excessive uppercase
* excessive tracking
* excessive bold
* overly condensed text
* too much Mono
* decorative font effects
* text shadows
* unnecessary gradients on text
* outlined text
* forced futuristic styling

The site should feel like a sophisticated technical dossier, not a sci-fi game interface.

---

# 15. IMPLEMENTATION RULE

Do not simply append new CSS over the old typography.

First inspect the existing typography system.

Then:

1. Identify existing font definitions.
2. Identify old font imports.
3. Identify component-specific overrides.
4. Replace the old font system with Geist + Geist Mono.
5. Normalize weights.
6. Normalize sizes.
7. Normalize line heights.
8. Normalize letter spacing.
9. Check desktop.
10. Check tablet.
11. Check mobile.
12. Remove obsolete typography code.
13. Verify that no third font remains.

Prefer a clean centralized typography system over scattered overrides.

---

# 16. FINAL CSS REFERENCE

The resulting system should conceptually follow:

```css
:root {
  --font-display: 'Geist', 'Segoe UI', sans-serif;
  --font-mono: 'Geist Mono', 'SFMono-Regular', Consolas, monospace;

  --text-hero: clamp(2.25rem, 1.25rem + 3.5vw, 3.6rem);
  --text-h2: clamp(1.15rem, 0.95rem + 0.55vw, 1.35rem);
  --text-h3: clamp(1rem, 0.9rem + 0.3vw, 1.1rem);
  --text-logo: 1.15rem;
  --text-body: clamp(0.98rem, 0.9rem + 0.2vw, 1.05rem);
  --text-value: 0.95rem;
  --text-label: 0.8rem;
  --text-nav: 0.85rem;
  --text-tag: 0.75rem;
  --text-meta: 0.7rem;
}
```