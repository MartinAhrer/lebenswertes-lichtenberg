#!/bin/sh
# Build command for Cloudflare Workers Builds.
# Production (main) uses baseURL from the config, so canonical links and the sitemap
# point to the live address. Previews get root-relative links, so links and assets
# stay on whatever preview address Cloudflare assigns.
set -eu

hugo version

if [ "${WORKERS_CI_BRANCH:-}" = "main" ]; then
  hugo --gc --minify
else
  hugo --gc --minify --baseURL "/"
fi
