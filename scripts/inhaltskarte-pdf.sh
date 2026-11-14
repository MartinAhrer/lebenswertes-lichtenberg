#!/bin/sh
# Renders the content map (docs/inhaltskarte/) with its sketches to build/Inhaltskarte.pdf.
# Needs Node.js and Google Chrome or Chromium. Set CHROME to the browser's path if it isn't found.
set -eu

root=$(cd "$(dirname "$0")/.." && pwd)
tool="$root/scripts/inhaltskarte-pdf"
out="$root/build/Inhaltskarte.pdf"

if [ -z "${CHROME:-}" ]; then
  for candidate in \
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
    "/Applications/Chromium.app/Contents/MacOS/Chromium" \
    google-chrome chromium chromium-browser; do
    if command -v "$candidate" >/dev/null 2>&1 || [ -x "$candidate" ]; then
      CHROME=$candidate
      break
    fi
  done
fi
[ -n "${CHROME:-}" ] || { echo "Chrome or Chromium not found. Set CHROME to its path." >&2; exit 1; }

# Install the pinned Markdown renderer on first use
[ -d "$tool/node_modules/marked" ] || npm install --prefix "$tool" --no-audit --no-fund --silent

# Render into a temporary copy of the map, so the HTML can load the sketches by relative path
work=$(mktemp -d)
trap 'rm -rf "$work"' EXIT
cp "$root"/docs/inhaltskarte/*.svg "$root/docs/inhaltskarte/README.md" "$work/"
node "$tool/render.mjs" "$work" "$work/index.html"

mkdir -p "$root/build"
"$CHROME" --headless --disable-gpu --no-pdf-header-footer --allow-file-access-from-files \
  --print-to-pdf="$out" "file://$work/index.html" 2>/dev/null

echo "Wrote $out"
