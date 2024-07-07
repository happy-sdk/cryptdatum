import { defineConfig } from 'vitepress'
import { tabsMarkdownPlugin } from 'vitepress-plugin-tabs'
import markdownItAnchor from 'markdown-it-anchor'
import { fileURLToPath } from 'url'

export const shared = defineConfig({
  title: 'Cryptdatum',

  srcDir: 'content',

  rewrites: {
    'en/:rest*': ':rest*',
  },

  vite: {
    resolve: {
      alias: [
        {
          find: '@',
          replacement: fileURLToPath(new URL('./src', import.meta.url))
        },
        {
          find: /^.*\/VPNavBarMenu\.vue$/,
          replacement: fileURLToPath(
            new URL(
              '../theme/components/VPNavBarMenu.vue',
              import.meta.url
            )
          )
        }
      ],
    },
  },

  markdown: {
    math: true,
    toc: {
      level: [1, 3],
      linkTag: 'router-link',
    },
    // anchor: {
    //   permalink: markdownItAnchor.permalink.headerLink()
    // },
    config(md) {
      md.use(tabsMarkdownPlugin)
    }
  },

  lastUpdated: true,
  cleanUrls: true,
  metaChunk: true,

  sitemap: {
    hostname: 'https://cryptdatum.dev',
    transformItems(items) {
      return items.filter((item) => !item.url.includes('migration'))
    }
  },

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/assets/cryptdatum-logo.svg' }],
    ['link', { rel: 'icon', type: 'image/png', href: '/assets/cryptdatum-logo-mini.png' }],
    ['meta', { name: 'theme-color', content: '#5f67ee' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:locale', content: 'en' }],
    ['meta', { property: 'og:title', content: 'Crypdatum | Flexible and Secure Data Format' }],
    ['meta', { property: 'og:site_name', content: 'Crypdatum' }],
    ['meta', { property: 'og:image', content: 'https://cryptdatum.dev/assets/cryptdatum-og.jpg' }],
    ['meta', { property: 'og:url', content: 'https://cryptdatum.dev/' }],
  ],

  themeConfig: {
    logo: { src: '/assets/cryptdatum-logo-yellow.svg', width: 24, height: 24 },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/happy-sdk/cryptdatum' }
    ],
    search: {
      provider: 'local'
    },
  },
})

