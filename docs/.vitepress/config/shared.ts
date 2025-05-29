import { defineConfig } from 'vitepress'
import { tabsMarkdownPlugin } from 'vitepress-plugin-tabs'
import { fileURLToPath } from 'url'

export const shared = defineConfig({
  title: 'Cryptdatum',
  srcDir: 'content',

  rewrites: {
    'en/:rest*': ':rest*',
  },

  lastUpdated: true,
  markdown: {
    math: true,
    toc: {
      level: [2, 3],
      linkTag: 'a',
    },
    // anchor: {
    //   permalink: markdownItAnchor.permalink.headerLink()
    // },
    config(md) {
      md.use(tabsMarkdownPlugin)
    },
  },

  vite: {
    resolve: {
      alias: [
        {
          find: /^.*\/VPNavBarMenu\.vue$/,
          replacement: fileURLToPath(
            new URL('../theme/components/VPNavBarMenu.vue', import.meta.url),
          ),
        },
      ],
    },
  },

  head: [
    [
      'link',
      {
        rel: 'icon',
        type: 'image/svg+xml',
        href: '/assets/cryptdatum-logo.svg',
      },
    ],
    [
      'link',
      {
        rel: 'icon',
        type: 'image/png',
        href: '/assets/cryptdatum-logo-mini.png',
      },
    ],
    ['meta', { name: 'theme-color', content: '#5f67ee' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:locale', content: 'en' }],
    [
      'meta',
      {
        property: 'og:title',
        content: 'Crypdatum | Flexible and Secure Data Format',
      },
    ],
    ['meta', { property: 'og:site_name', content: 'Crypdatum' }],
    [
      'meta',
      {
        property: 'og:image',
        content: 'https://cryptdatum.dev/assets/cryptdatum-og.jpg',
      },
    ],
    ['meta', { property: 'og:url', content: 'https://cryptdatum.dev/' }],
  ],

  themeConfig: {
    logo: { src: '/assets/cryptdatum-logo-yellow.svg', width: 24, height: 24 },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/digafin/cryptdatum' },
    ],

    search: {
      provider: 'local',
    },

    outline: [2, 3],

    editLink: {
      pattern:
        'https://github.com/digafin/cryptdatum/edit/main/docs/content/:path',
    },

    specs: {
      title: 'Specs',
      latest: 'v1.0.0-rc.1',
      items: [
        {
          text: 'v1.0.0-rc.1',
          link: '/specs/v1.0.0-rc.1/',
        },
      ],
    },
  },
})
