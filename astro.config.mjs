// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://manikandanx0.tech',
  integrations: [
    sitemap({
      filter: (page) => page !== 'https://manikandanx0.tech/404/' && page !== 'https://manikandanx0.tech/404',
    }),
  ],
  markdown: {
    shikiConfig: {
      themes: {
        dark: 'github-dark',
        light: 'github-light',
      },
    },
  },
});