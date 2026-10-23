# syntax=docker/dockerfile:1

# Node.js Active LTS, pinned to an exact patched release (and digest) so a
# rebuild can never pull an older, vulnerable Node. Renovate keeps it current.
# Node only builds the site; it never ships in the final image.
FROM node:24.22.1-trixie-slim@sha256:43b9ba1142b8dcf33fa8f922ca1be85714adc444e0586c7cf7726daaeabc1bea AS build
WORKDIR /opt/docusaurus
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Serve the static build with Caddy, as an unprivileged user. Pinned to a minor
# line so rebuilds pick up patch releases; Renovate proposes new minors.
FROM caddy:2.11-alpine AS serve
COPY --from=build /opt/docusaurus/build /srv
COPY <<"EOF" /etc/caddy/Caddyfile
{
	admin off
}

# The caddy base image also exposes 80, and Traefik routes to a container's
# lowest exposed port unless told otherwise, so listen there as well.
:3000, :80 {
	root * /srv
	encode zstd gzip

	# Docusaurus emits every page as <route>/index.html; serve each route with
	# or without a trailing slash, with no redirect and no SPA fallback.
	try_files {path} {path}/index.html {path}.html
	file_server

	header {
		X-Content-Type-Options "nosniff"
		Referrer-Policy "strict-origin-when-cross-origin"
		X-Frame-Options "DENY"
	}

	# Only /assets/ holds content-hashed file names; everything else revalidates.
	@hashed path /assets/*
	header @hashed Cache-Control "public, max-age=31536000, immutable"
	@unhashed not path /assets/*
	header @unhashed Cache-Control "no-cache"

	handle_errors 404 {
		header Cache-Control "no-cache"
		rewrite * /404.html
		file_server
	}
}
EOF
# The base image leaves its config and data directories writable by any user.
USER nobody
EXPOSE 3000
