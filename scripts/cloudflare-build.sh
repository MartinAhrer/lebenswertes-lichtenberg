#!/bin/sh
# Build command for Cloudflare Pages.
# Production uses baseURL from the config. Previews use their own deployment URL
# so that links and assets stay on the preview.
set -eu

hugo version

if [ "${CF_PAGES_BRANCH:-}" = "main" ]; then
  hugo --gc --minify
else
  hugo --gc --minify --baseURL "$CF_PAGES_URL"
fi
