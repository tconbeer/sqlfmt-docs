// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'sqlfmt',
  tagline: "sqlfmt formats your dbt SQL files so you don't have to.",
  url: 'https://docs.sqlfmt.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'tconbeer', // Usually your GitHub org/user name.
  projectName: 'sqlfmt-docs', // Usually your repo name.

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: '/',
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl:
            'https://github.com/tconbeer/sqlfmt-docs/tree/main/',
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'sqlfmt',
        // logo: {
        //   alt: 'My Site Logo',
        //   src: 'img/logo.svg',
        // },
        items: [
          {
            type: 'doc',
            docId: 'intro',
            position: 'left',
            label: 'Documentation',
          },
          {
            href: 'https://github.com/tconbeer/sqlfmt',
            label: 'GitHub',
            position: 'right',
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
                to: '/getting-started/installation',
              },
              {
                label: 'Configuration',
                to: '/getting-started/configuring-sqlfmt',
              },
              {
                label: 'dbt',
                to: '/integrations/dbt',
              },
              {
                label: 'Style Guide',
                to: '/style',
              },
            ],
          },
          {
            title: 'sqlfmt Resources',
            items: [
              {
                label: 'Web Formatter',
                href: 'https://sqlfmt.com/',
              },
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
        copyright: `Copyright © ${new Date().getFullYear()} Ted Conbeer`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
