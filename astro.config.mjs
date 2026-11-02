// @ts-check
import { defineConfig } from 'astro/config';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import sitemap from '@astrojs/sitemap';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  },
  build: {
    inlineStylesheets: 'always'
  },
  vite: {
    plugins: [tailwindcss()],
  },
  site: 'https://linyangsun.github.io',
  base: '/',
  integrations: [
    sitemap({
      // Keep internal visualizers out of the public sitemap.
      filter: (page) => {
        const pathname = new URL(page).pathname;
        return pathname !== '/dev-tools' && !pathname.startsWith('/dev-tools/');
      },
    }),
  ],
});