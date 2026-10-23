# Website

This website is built using [Docusaurus](https://docusaurus.io/), a modern static website generator.

## Installation

Use the Node.js version in `.nvmrc` (e.g. `nvm use`).

```bash
npm install
```

## Local Development

```bash
npm start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

## Build

```bash
npm run build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

## Tests

Playwright smoke tests run against the production build (`docusaurus serve`):

```bash
npx playwright install chromium  # once
npm test                         # build, then run the smoke tests
npm run test:e2e                 # run the smoke tests against an existing build
```

## Deployment

Uses docker and GitHub Actions. Just push a commit to `main`.