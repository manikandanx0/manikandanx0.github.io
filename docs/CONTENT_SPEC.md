# Content Management & Blog Architecture Specification (`CONTENT_SPEC.md`)

**Site Context:** `manikandanx0.tech`  
**Writing Hub Routes:** `/writing`, `/writing/blog/[slug]`, `/writing/ctf/[slug]`, `/writing/leetcode/[slug]`, `/projects`, `/projects/[slug]`.

---

## 1. Audit of the Current Writing & Content System

### Storage & Architecture
The site currently utilizes **Astro Content Collections** configured via Astro 5's modern `glob` loader in `src/content.config.ts`. Content is stored exclusively as static Markdown (`.md`) files with YAML frontmatter.

| Collection | Loader Path | Schema Highlights | Active Content Items |
| :--- | :--- | :--- | :--- |
| **`blog`** | `./src/content/blog` | `title`, `date`, `excerpt`, `tags`, `draft` | 5 items (`intro-to-ml.md`, `build-a-home-cyber-lab.md`, `top-5-protocols-every-cs-major-should-know.md`, `data-exploration-in-pandas-and-numpy.md`, `grid-layout-notes.md`) |
| **`ctf`** | `./src/content/ctf` | `title`, `date`, `event`, `difficulty`, `tags`, `draft` | 1 item (`warmup-web-challenge.md`) |
| **`leetcode`** | `./src/content/leetcode` | `title`, `date`, `problemNumber`, `problemUrl`, `difficulty`, `tags`, `timeComplexity`, `spaceComplexity`, `draft` | 1 item (`two-sum-hashmap.md`) |
| **`projects`**| `./src/content/projects` | `title`, `date`, `summary`, `stack`, `repoUrl`, `liveUrl`, `featured`, `draft` | 1 item (`respinner-ui.md`) |

### How a New Post is Added Today (Manual Step-by-Step)
1. **File Creation:** Manually create a `.md` file under the appropriate directory (`src/content/blog/`, `src/content/ctf/`, `src/content/leetcode/`, or `src/content/projects/`).
2. **Frontmatter Configuration:** Hand-write valid YAML frontmatter adhering strictly to the Zod schema in `src/content.config.ts` (e.g. formatting dates as `YYYY-MM-DD`, supplying tag arrays, setting `draft: false`).
3. **Content Writing:** Author post content using standard Markdown syntax.
4. **Build & OG Generation:** Run `pnpm build` (or `npm run build`). The build process triggers `scripts/generate-og.ts`, which uses `@resvg/resvg-js` and `satori` to dynamically construct and save Open Graph social cards (`.png`) into `public/og/writing/<type>/<slug>.png`.

### Analysis of the Numbering Scheme (`LOG-01`, `BLOG-01`, `OP-01`, `LC-001`, `CTF-01`)
* **Current Implementation:** In `src/pages/writing/index.astro` and `src/pages/index.astro`, numbers like `LOG-01`, `BLOG-01`, `OP-01`, and `CTF-01` are **auto-generated dynamically** during rendering based on the array iteration index:
  ```astro
  <span>BLOG-{String(i + 1).padStart(2, "0")} // ESSAY</span>
  ```
  *(Exception: LeetCode logs use `LC-${String(post.data.problemNumber).padStart(3, "0")}` directly from frontmatter).*
* **Maintenance Risk:**
  - Because display identifiers like `LOG-01` or `BLOG-02` rely on chronological array index sorting, inserting a backdated post or deleting an existing entry **renumbers all subsequent items across the site**.
  - If external posts or social shares reference `LOG-02`, that label will drift to a different post whenever new content is inserted before it.

---

## 2. Scaling Analysis & System Gaps

To scale the portfolio beyond a handful of posts to 50+ technical articles, the following gaps must be resolved:

### 1. Frontmatter Schema Disparity & Missing Fields
* **Current Gap:** Schema definitions are fragmented across collections. Key metadata fields required for long-form content are absent:
  - `readingTime` (needed for long technical guides like `build-a-home-cyber-lab.md`).
  - `updatedDate` (crucial for updating technical writeups over time).
  - `canonicalUrl` (override for cross-posted articles on Medium/Dev.to).
  - `coverImage` (optional hero image override for social previews).

### 2. Lack of Index Pagination
* **Current Gap:** `src/pages/writing/index.astro` renders all entries in a single DOM tree. While manageable for 7 posts, rendering 50+ posts with tag elements will inflate DOM size and impair mobile performance.

### 3. Client-Side Search & Filtering Limitations
* **Current Gap:** Tag filtering in `writing/index.astro` currently uses a client-side `<script is:inline>` tag manipulating element `style.display`. It lacks:
  - Full-text search (searching post titles or excerpts).
  - URL query state persistence (e.g. `/writing?sector=blog&tag=ml` cannot be bookmarked or shared).
  - Compatibility with View Transitions (`DOMContentLoaded` event listener does not re-fire on soft page navigation).

### 4. RSS Feed Aggregation (`src/pages/rss.xml.ts`)
* **Audit Findings:** RSS feed currently aggregates `blog`, `ctf`, and `leetcode` entries into a unified XML feed. However, it lacks full content bodies (`content` key) and `readingTime` metadata.

---

## 3. Strategic Content Management Recommendation

We evaluated three potential content workflows for a solo developer:

| Criteria | Option A: Markdown + Astro Content Collections + Scaffolding Tooling | Option B: Lightweight Headless CMS (TinaCMS / Decap) | Option C: Status Quo (Manual File Creation) |
| :--- | :--- | :--- | :--- |
| **Authoring Experience** | Native Markdown in IDE or Obsidian. Fast and familiar. | Visual UI form editor in browser. | Manual file & frontmatter creation. Error-prone. |
| **Dependencies & Overhead** | Zero external runtime or server dependencies. | Requires local backend server, git gateway, or third-party auth. | Zero dependencies. |
| **Build & Deploy Impact** | Instant build times; native Astro V5 integration. | Increases build complexity; sync delays with Git. | Instant build times. |
| **Obsidian Integration** | **Direct match.** (`src/content` already contains `.obsidian` vaults). | Conflicts with local vault sync. | Manual copying needed. |

### Recommendation: **Option A (Enhanced Plain Markdown + CLI Scaffolding + Obsidian Workflow)**
* **Why:** As a solo developer specializing in AI, Systems, and Security, fighting a CMS interface introduces friction. Storing posts as raw Markdown in Git guarantees content longevity, offline editing capability, and zero vendor lock-in.
* **Proposed Enhancements:**
  1. **CLI Content Scaffolder (`pnpm new:post`):** An interactive Node/TS script (`scripts/create-post.ts`) that prompts for title, collection, and tags, then automatically generates a pre-populated Markdown template with valid YAML frontmatter.
  2. **Obsidian Vault Alignment:** Clean up `.obsidian` directories inside `src/content/` and formalize an Obsidian vault template with properties mapping to Astro Zod schemas.
  3. **Static Post Identifiers:** Introduce an optional `customId` or fixed `slug` anchor in frontmatter to prevent number-drift when posts are added or reordered.

---

## 4. Overlap & Cross-References with Animation Spec

1. **Writing Hub Filter Transition Animation:**
   - When switching sector tabs (`BLOGS` vs `CODE LOGS` vs `CTF WRITEUPS`) or clicking tag pills in `writing/index.astro`, grid items should transition smoothly using CSS fade/transform micro-animations rather than instant DOM display toggles.
2. **Post Detail Reveal Stagger:**
   - Detail pages (`/writing/blog/[slug]`, etc.) will utilize Motion's `.enter()` keyframes to stagger the header element (`.post-hero`) followed by the content container (`.content-panel.prose`).
3. **Draft / Incoming State Indicators:**
   - Empty sector cards (`[ TRANSMISSION PENDING ]`) and status badges (`● LIVE`) will share pulse animations (`.blink`) defined in `animation.css`.
