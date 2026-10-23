# syntax=docker/dockerfile:1

# Node.js Active LTS, pinned to an exact patched release (and digest) so a
# rebuild can never pull an older, vulnerable Node. Renovate keeps it current.
FROM node:24.22.1-trixie-slim@sha256:43b9ba1142b8dcf33fa8f922ca1be85714adc444e0586c7cf7726daaeabc1bea AS base
WORKDIR /opt/docusaurus

# Build the static site, then drop dev-only dependencies.
FROM base AS build
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build && npm prune --omit=dev

# Serve the build with `docusaurus serve`, as an unprivileged user.
FROM base AS serve
ENV NODE_ENV=production
COPY --from=build /opt/docusaurus /opt/docusaurus
USER node
EXPOSE 3000
CMD ["npm", "run", "serve", "--", "--host", "0.0.0.0", "--port", "3000", "--no-open"]
