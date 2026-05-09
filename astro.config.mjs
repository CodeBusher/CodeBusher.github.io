import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import expressiveCode from 'astro-expressive-code';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

const mathRehype = [
  rehypeKatex,
  {
    strict: 'ignore',
    throwOnError: false,
  },
];

export default defineConfig({
  trailingSlash: 'always',
  site: 'https://codebusher.github.io',
  integrations: [
    expressiveCode(),
    mdx({
      remarkPlugins: [remarkMath],
      rehypePlugins: [mathRehype],
    }),
    sitemap(),
  ],
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [mathRehype],
    syntaxHighlight: 'shiki',
  },
});
