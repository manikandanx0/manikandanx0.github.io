import fs from 'node:fs/promises';
import path from 'node:path';
import {
  generateOgImage,
  generateHomeOgImage,
  generateWritingIndexOgImage,
  generateWorksIndexOgImage,
  generateAboutOgImage,
} from '../src/lib/generateOgImage.ts';

// Helper to parse frontmatter from markdown files without external dependencies
function parseFrontmatter(content: string) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};
  const frontmatterStr = match[1];
  const data: Record<string, any> = {};

  for (const line of frontmatterStr.split('\n')) {
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    let value = line.slice(colonIdx + 1).trim();

    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
    if (value === 'true') value = true;
    if (value === 'false') value = false;

    data[key] = value;
  }
  return data;
}

async function processCollection(dir: string, typeName: string, getRelPath: (slug: string) => string) {
  const fullDir = path.resolve(dir);
  try {
    const files = await fs.readdir(fullDir);
    for (const file of files) {
      if (!file.endsWith('.md')) continue;
      const filePath = path.join(fullDir, file);
      const content = await fs.readFile(filePath, 'utf-8');
      const data = parseFrontmatter(content);

      if (data.draft === true) continue;

      const slug = file.replace(/\.md$/, '');
      const title = data.title || slug;
      const subtitle = data.excerpt || data.summary || data.event || undefined;
      const date = data.date || undefined;
      const tags = Array.isArray(data.tags)
        ? data.tags
        : typeof data.tags === 'string'
          ? data.tags.split(',').map((t) => t.trim())
          : undefined;

      const relPath = getRelPath(slug);

      await generateOgImage({
        title,
        type: typeName,
        subtitle,
        date,
        tags,
        outputPath: `public${relPath}`,
      });
      console.log(`[OG Script] Generated slug card: ${relPath}`);
    }
  } catch (err) {
    console.warn(`[OG Script] Error processing ${dir}:`, err);
  }
}

async function main() {
  console.log('[OG Script] Starting pre-build OG image generation for all template types...');

  // 1. Static Pages
  await generateHomeOgImage();
  console.log('[OG Script] Generated static card: /og/home.png');

  await generateWritingIndexOgImage();
  console.log('[OG Script] Generated static card: /og/writing-index.png');

  await generateWorksIndexOgImage();
  console.log('[OG Script] Generated static card: /og/works-index.png');

  await generateAboutOgImage();
  console.log('[OG Script] Generated static card: /og/about.png');

  // 2. Dynamic Content Slug Pages
  await processCollection('src/content/blog', 'blog', (slug) => `/og/writing/blog/${slug}.png`);
  await processCollection('src/content/ctf', 'ctf', (slug) => `/og/writing/ctf/${slug}.png`);
  await processCollection('src/content/leetcode', 'leetcode', (slug) => `/og/writing/leetcode/${slug}.png`);
  await processCollection('src/content/projects', 'project', (slug) => `/og/projects/${slug}.png`);

  console.log('[OG Script] OG image generation complete.');
}

main().catch(console.error);
