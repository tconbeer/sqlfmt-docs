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
PLAYWRIGHT_BASE_URL=http://127.0.0.1:3000 npm run test:e2e  # against a running site
```

## Deployment

Uses docker and GitHub Actions. Just push a commit to `main`.

The image builds the site with Node and serves `build/` with [Caddy](https://caddyserver.com/) on port 3000 (and 80, for Traefik); no Node runs in production. To try it locally:

```bash
docker build -t sqlfmt-docs . && docker run --rm -p 3000:3000 sqlfmt-docs
```
