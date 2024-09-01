import { defineConfig } from 'vitepress'

export const en = defineConfig({
  lang: 'en-US',
  description: 'Cryptdatum dataformat',
  themeConfig: {
    nav: nav(),
    specs: {
      title: 'Specs',
      latest: '/specs/v1.0/introduction',
      items: [
        { text: 'v1.0 (latest)', link: '/specs/v1.0/introduction' },
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
            text: 'Specification v1.0',
            items: [
              { text: 'Introduction', link: 'introduction' },
              { text: 'Design', link: 'design' },
              { text: 'Byte Ordering', link: 'byte-ordering' },
              { text: 'Constants', link: 'constants' },
              { text: 'Feature Flags', link: 'feature-flags' },
              { text: 'Header', link: 'header' },
              { text: 'Metadata', link: 'metadata' },
              { text: 'Payload', link: 'payload' },
              { text: 'Checksum', link: 'checksum' },
              { text: 'Data Signing', link: 'data-signing' },
              { text: 'Compression', link: 'compression' },
              { text: 'Encryption', link: 'encryption' },
              { text: 'File extension', link: 'file-extension' },
              { text: 'Specification Versioning', link: 'specification-versioning' },
              { text: 'Error Handling', link: 'error-handling' },
              { text: 'Implementations', link: 'implementations' },
              { text: 'API', link: 'api' },
              { text: 'Cryptdatum Evolution', link: 'cryptdatum-evolution' },
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
    { text: 'Develop', link: '/develop/developing-with-cryptdatum', activeMatch: '/develop/' },
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
      link: '../develop/developing-with-cryptdatum',
      activeMatch: '/develop/',
    }
  ]
}

function sidebarDevelop() {
  return [
    {
      text: 'Developer Guide',
      items: [
        { text: 'Developing with Cryptdatum', link: 'developing-with-cryptdatum' },
      ]
    },
    {
      text: 'Libraries',
      items: [
        { text: 'Libraries', link: 'libraries' },
        { text: 'Develop library', link: 'develop-library' },
      ],
    },
  ]
}
