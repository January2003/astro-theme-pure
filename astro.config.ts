import cloudflare from '@astrojs/cloudflare'
import AstroPureIntegration from 'astro-pure'
import { defineConfig, fontProviders } from 'astro/config'
import rehypeKatex from 'rehype-katex'
import remarkMath from 'remark-math'

// Local integrations
import rehypeAutolinkHeadings from './src/plugins/rehype-auto-link-headings.ts'
// Shiki
import {
  addCollapse,
  addCopyButton,
  addLanguage,
  addTitle,
  updateStyle
} from './src/plugins/shiki-custom-transformers.ts'
import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerRemoveNotationEscape
} from './src/plugins/shiki-official/transformers.ts'
import config from './src/site.config.ts'

// https://astro.build/config
export default defineConfig({
  // [Basic]
  site: 'https://astro-pure.js.org',
  // Deploy to a sub path
  // https://astro-pure.js.org/docs/setup/deployment#platform-with-base-path
  // base: '/astro-pure/',
  trailingSlash: 'never',
  // root: './my-project-directory',
  server: { host: true },

  // [Adapter]
  // https://docs.astro.build/en/guides/deploy/
  adapter: cloudflare(),
  output: 'server',

  // [Assets]
  image: {
    responsiveStyles: true,
    service: { entrypoint: 'astro/assets/services/sharp' },
    remotePatterns: [
      // Allow improve Github activity chart
      {
        protocol: 'https',
        hostname: '**.rshah.org'
      }
    ]
  },

  // [Markdown]
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [
      [rehypeKatex, {}],
      [
        rehypeAutolinkHeadings,
        {
          behavior: 'append',
          properties: { className: ['anchor'] },
          content: { type: 'text', value: '#' }
        }
      ]
    ],
    // https://docs.astro.build/en/guides/syntax-highlighting/
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark'
      },
      transformers: [
        // @ts-ignore this happens due to multiple versions of shiki types
        transformerNotationDiff(),
        // @ts-ignore this happens due to multiple versions of shiki types
        transformerNotationHighlight(),
        // @ts-ignore this happens due to multiple versions of shiki types
        transformerRemoveNotationEscape(),
        // Custom transformers
        // @ts-ignore this happens due to multiple versions of shiki types
        updateStyle(),
        // @ts-ignore this happens due to multiple versions of shiki types
        addTitle(),
        // @ts-ignore this happens due to multiple versions of shiki types
        addLanguage(),
        // @ts-ignore this happens due to multiple versions of shiki types
        addCopyButton(2000),
        // @ts-ignore this happens due to multiple versions of shiki types
        addCollapse(15)
      ]
    }
  },

  // [Integrations]
  integrations: [
    AstroPureIntegration(config)
  ],

  // [Experimental]
  experimental: {
    contentIntellisense: true,
    svgo: true,
    fonts: [
      {
        provider: fontProviders.fontshare(),
        name: 'Satoshi',
        cssVariable: '--font-satoshi',
        styles: ['normal', 'italic'],
        weights: [400, 500],
        subsets: ['latin']
      }
    ]
  }
})
