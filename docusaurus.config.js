// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'sqlfmt',
  tagline: "sqlfmt formats your dbt SQL files so you don't have to.",
  onBrokenLinks: 'throw',
  markdown: {hooks: {onBrokenMarkdownLinks: 'throw'}},
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://sqlfmt.com',
  baseUrl: '/',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  plugins: ["posthog-docusaurus"],

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/tconbeer/sqlfmt-docs/tree/main/',
        },
        blog: false,
        // {
        //   showReadingTime: true,
        //   feedOptions: {
        //     type: ['rss', 'atom'],
        //     xslt: true,
        //   },
        //   // Please change this to your repo.
        //   onInlineTags: 'warn',
        //   onInlineAuthors: 'warn',
        //   onUntruncatedBlogPosts: 'warn',
        // },
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/logo.png',
      colorMode: {
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: 'sqlfmt',
        logo: {
          href: "/",
          alt: 'sqlfmt Logo',
          src: 'img/logo.png',
        },
        items: [
          {
            type: 'doc',
            docId: 'intro',
            position: 'left',
            label: 'Documentation',
          },
          {
            href: 'https://github.com/tconbeer/sqlfmt',
            position: 'right',
            // label: "GitHub",
            className: "header--github-link",
            "aria-label": "GitHub repository link",
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Installation',
                to: '/docs/getting-started/installation',
              },
              {
                label: 'Commands',
                to: '/docs/getting-started/using-sqlfmt',
              },
              {
                label: 'Configuration',
                to: '/docs/getting-started/configuring-sqlfmt',
              },
              {
                label: 'Style Guide',
                to: '/docs/style',
              },
            ],
          },
          {
            title: 'sqlfmt Resources',
            items: [
              {
                label: 'PyPI',
                href: 'https://pypi.org/project/shandy-sqlfmt/',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/tconbeer/sqlfmt',
              },
            ],
          },
          {
            title: 'About Ted Conbeer',
            items: [
              {
                label: 'Personal Site',
                href: 'https://tedconbeer.com/',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/tconbeer/',
              },
              {
                label: 'Twitter',
                href: 'https://twitter.com/tedconbeer/',
              },
              {
                label: 'LinkedIn',
                href: 'https://linkedin.com/in/tedconbeer',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Ted Conbeer. <a href="/docs/privacy">Privacy Policy</a>. Icons by <a href="https://icons8.com" target="_blank">Icons8</a>`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
      posthog: {
        apiKey: "phc_JvcbkJ52TJpVaMxGHRGOxYrcOuTKU05949sLeVp8r7g",
        enableInDevelopment: true
      }
    }),
};

export default config;
