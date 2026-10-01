import { defineConfig } from 'vitepress'
import { tabsMarkdownPlugin } from 'vitepress-plugin-tabs'

export const shared = defineConfig({
  title: 'Cryptdatum',
  srcDir: 'content',
  base: '/cryptdatum/',

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

  head: [
    [
      'link',
      {
        rel: 'icon',
        type: 'image/svg+xml',
        href: '/cryptdatum/assets/cryptdatum-logo.svg',
      },
    ],
    [
      'link',
      {
        rel: 'icon',
        type: 'image/png',
        href: '/cryptdatum/assets/cryptdatum-logo-mini.png',
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
        content:
          'https://happy-sdk.github.io/cryptdatum/assets/cryptdatum-og.jpg',
      },
    ],
    [
      'meta',
      {
        property: 'og:url',
        content: 'https://happy-sdk.github.io/cryptdatum/',
      },
    ],
  ],

  themeConfig: {
    logo: { src: '/assets/cryptdatum-logo-yellow.svg', width: 24, height: 24 },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/happy-sdk/cryptdatum' },
    ],

    search: {
      provider: 'local',
    },

    outline: [2, 3],

    editLink: {
      pattern:
        'https://github.com/happy-sdk/cryptdatum/edit/main/docs/content/:path',
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
