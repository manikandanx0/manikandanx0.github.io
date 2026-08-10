import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const blog = await getCollection('blog', ({ data }) => !data.draft);
  const ctf = await getCollection('ctf', ({ data }) => !data.draft);
  const leetcode = await getCollection('leetcode', ({ data }) => !data.draft);

  const blogItems = blog.map((post) => ({
    title: post.data.title,
    pubDate: post.data.date,
    description: post.data.excerpt,
    link: `/writing/blog/${post.id.replace(/\.md$/, '')}/`,
    categories: post.data.tags,
  }));

  const ctfItems = ctf.map((post) => ({
    title: `[CTF] ${post.data.title}`,
    pubDate: post.data.date,
    description: `${post.data.event}${post.data.difficulty ? ` · ${post.data.difficulty.toUpperCase()}` : ''}`,
    link: `/writing/ctf/${post.id.replace(/\.md$/, '')}/`,
    categories: post.data.tags,
  }));

  const leetcodeItems = leetcode.map((post) => ({
    title: `[LC-${String(post.data.problemNumber).padStart(4, '0')}] ${post.data.title}`,
    pubDate: post.data.date,
    description: `${post.data.difficulty.toUpperCase()}${post.data.timeComplexity ? ` · Time: ${post.data.timeComplexity}` : ''}${post.data.spaceComplexity ? ` · Space: ${post.data.spaceComplexity}` : ''}`,
    link: `/writing/leetcode/${post.id.replace(/\.md$/, '')}/`,
    categories: post.data.tags,
  }));

  const items = [...blogItems, ...ctfItems, ...leetcodeItems].sort(
    (a, b) => b.pubDate.valueOf() - a.pubDate.valueOf()
  );

  return rss({
    title: 'mani.tech — Transmissions',
    description: 'CTF writeups, DSA logs, and engineering essays from mani.tech',
    site: context.site!,
    items,
    customData: `<language>en-us</language>`,
  });
}
