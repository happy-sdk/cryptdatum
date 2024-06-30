import { defineConfig } from 'vitepress'

export const en = defineConfig({
  lang: 'en-US',
  description: 'Cryptdatum dataformat',
  themeConfig: {
    nav: nav(),
    specs: {
      title: 'Specs',
      latest: '/specs/v1.0',
      items: [
        { text: 'v1.0 (latest)', link: '/specs/v1.0', activeMatch: '/specs/v1.0'},
        { text: 'v1.1 (draft)',  link: '/specs/v1.1', activeMatch: '/specs/v1.1' },
      ]
    },
    sidebar: {
      '/guide/': {
        base: '/guide/',
        items: sidebarGuide(),
      },
      '/specs/v1.0/': {
        base: '/specs/v1.0/',
        items:   [
          {
            text: 'v1.0 Specification',
            children: [
              { text: 'Overview', link: '/specs/v1.0/' },
            ],
          },
        ],
      },
      '/develop/' : {
        base: '/develop/',
        items: sidebarDevelop(),
      }
    },

    editLink: {
      pattern: 'https://github.com/happy-sdk/cryptdatum/edit/main/docs/:path',
      text: 'Edit this page on GitHub'
    },

    footer: {
      message: 'Released under the Apache-2.0 license',
      copyright: 'Copyright © 2022-present The Happy Authors'
    }
  }
})

function nav() {
  return [
    { text: 'Guide', link: '/guide/what-is-cryptdatum', activeMatch: '/guide/' },
    { text: 'Download', link: '/downloads', activeMatch: '/downloads/' },
    { text: 'Develop', link: '/develop/', activeMatch: '/develop/' },
  ]
}

function sidebarGuide() {
  return [
    {
      text: 'Introduction',
      collapsed: false,
      items: [
        { text: 'What is Cryptdatum?', link: 'what-is-cryptdatum' },
        { text: 'Getting Started', link: 'getting-started' },
      ]
    },
    {
      text: 'Get Cryptdatum',
      collapsed: false,
      items: [
        { text: 'Download Client', link: '../downloads', activeMatch: '/downloads/' },
        { text: 'Download Server', link: '../downloads', activeMatch: '/downloads/' },
      ]
    },
    {
      text: 'Developer Guide',
      collapsed: false,
      link: '../develop/',
      activeMatch: '/develop/',
    }
  ]
}

function sidebarDevelop() {
  return [
    {
      text: 'Developer Guide',
      items: [
        { text: 'Developing with Cryptdatum', link: '/' },
      ]
    },
    {
      text: 'Libraries',
      link: '/develop',
      activeMatch: '/develop',
      items: [
        { text: 'Get library', link: 'libraries' },
        { text: 'Develop library', link: '/develop-library.md' },
      ],
    },
  ]
}
