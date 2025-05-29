import { defineConfig } from 'vitepress'

export const en = defineConfig({
  lang: 'en-US',

  description:
    'The Cryptdatum format is a powerful, flexible universal data format for storing data to be long term compatible accross domains',

  themeConfig: {
    nav: nav(),
    editLink: {
      text: 'Edit this page on GitHub',
    },
    sidebar: {
      '/docs/': {
        base: '/docs/',
        items: sidebarDocs(),
      },
      '/specs/v1.0.0-rc.1/': {
        items: [
          {
            text: 'Cover',
            link: '/specs/v1.0.0-rc.1/',
          },
          {
            text: 'Specification',
            base: '/specs/v1.0.0-rc.1/',
            items: [
              { text: '1. Introduction', link: '01-introduction' },
              { text: '2. Format Structure', link: '02-format-structure' },
              { text: '3. Feature Flags', link: '03-feature-flags' },
              { text: '4. Metadata', link: '04-metadata' },
              { text: '5. Checksums', link: '05-checksums' },
              { text: '6. Compression', link: '06-compression' },
              { text: '7. Encryption', link: '07-encryption' },
              { text: '8. Digital Signatures', link: '08-digital-signatures' },
              {
                text: '9. Format Identification',
                link: '09-format-identification',
              },
              { text: '10. Algorithm Registry', link: '10-algorithm-registry' },
              {
                text: '11. Security Considerations',
                link: '11-security-considerations',
              },
              { text: 'Appendices', link: 'appendices' },
              { text: 'Comments', link: 'comments' },
            ],
          },
        ],
      },
    },
  },
})

function nav() {
  return [
    { text: 'Docs', link: '/docs/', activeMatch: '/docs/' },
    { text: 'Download', link: '/downloads', activeMatch: '/downloads/' },
    { text: 'Libraries', link: '/libraries', activeMatch: '/libraries/' },
    { text: 'Specs', link: '/specs/latest/', activeMatch: '/specs/' },
  ]
}

function sidebarDocs() {
  return [
    {
      text: 'Documentation',
    },
    {
      text: 'Introduction',
      collapsed: false,
      items: [
        {
          text: 'What is Cryptdatum?',
          link: 'introduction/what-is-cryptdatum',
        },
        {
          text: 'Getting Started',
          link: 'introduction/getting-started',
        },
        {
          text: 'How Cryptdatum Works',
          link: 'introduction/how-cryptdatum-works',
        },
        {
          text: 'Frequently Asked Questions',
          link: 'introduction/faq',
        },
        {
          text: 'Community & Support',
          link: 'introduction/community-and-support',
        },
      ],
    },
    {
      text: 'Developer Guide',
      collapsed: false,
      items: [
        {
          text: 'Build your own',
          link: 'developer-guide/build-your-own',
        },
        {
          text: 'Develop library',
          link: 'developer-guide/develop-library',
        },
        {
          text: 'API Guidelines',
          link: 'developer-guide/api',
        },
        {
          text: 'Implementations',
          link: 'developer-guide/implementations',
        },
        {
          text: 'Error Handling',
          link: 'developer-guide/error-handling',
        },
      ],
    },
    {
      text: 'Contributing',
      collapsed: false,
      items: [
        {
          text: 'Contributing Guide',
          link: 'contributing/contributing-guide',
        },
        {
          text: 'Contributing to Specification',
          link: 'contributing/contributing-to-specification',
        },
        {
          text: 'Specification Versioning',
          link: 'contributing/specification-versioning',
        },
        {
          text: 'Cryptdatum Evolution',
          link: 'contributing/cryptdatum-evolution',
        },
      ],
    },
    {
      text: 'Showcase',
      collapsed: false,
      items: [
        {
          text: 'Showcase',
          link: 'showcase/',
          activeMatch: '^/docs/showcase($|/)',
        },
      ],
    },
  ]
}
