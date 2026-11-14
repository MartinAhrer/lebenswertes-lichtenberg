# Proposal

## Why

The site is built and the pages exist, but they are still filled with lorem ipsum and `PLATZHALTER` markers. The Verein's content authors have to supply the real text and images, but they can't tell from a Markdown file which part of a page a field fills, how long it can be, or what image size works. Before asking them for content, they need one overview that names every building block of the site and shows where it appears.

## What Changes

- Add a German content map for authors to the repository, in `docs/inhaltskarte/`.
- Draw each page type as a hand-sketched wireframe (SVG) with numbered blocks: shared elements, Startseite, Aktuelles, news post, simple page and error page.
- For every block, give a stable name and ID, its purpose, length or image limits, and the file and front-matter field or Markdown element that fills it.
- Mark blocks that the site fills automatically, such as the recent posts, reading time and footer line, so authors know they don't need to supply them.
- Stop showing a date, reading time and previous/next links on text pages such as Über uns and Kontakt. These pages have no date, so the theme showed "1. Januar 0001" and linked them to each other like news posts. Found while taking the block inventory.
- Link the map from the README's editing section, and make updating the map part of every change that adds, removes or moves a block.

**Assumptions to confirm during review** (not explicitly requested):

- Authors read the map on GitHub or in an editor's Markdown preview, so it doesn't need to be published on the website.
- The page types listed above cover every page. The four simple pages (Über uns, Kontakt, Impressum, Datenschutz) share one sketch.
- The limits are recommendations measured on the current layout, not limits the build enforces.

**Out of scope for this change:**

- Writing the real content, or replacing any `PLATZHALTER` text.
- A form, spreadsheet or CMS for collecting content.
- Changing the site's layout or adding new building blocks.
- Automated checks that content stays within the limits.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `public-site`: adds a requirement that only news posts show a date, reading time and previous/next links. Like `content-authoring`, this capability comes from `add-hugo-static-site`.
- `content-authoring`: adds requirements for a content map that names every building block with its source, limits and sketch, and for keeping it up to date. This capability is introduced by the change `add-hugo-static-site`, which isn't archived yet, so that change should be archived first.

## Impact

- **Repository:** adds `docs/inhaltskarte/` with a German Markdown guide and one SVG sketch per page type, and a link in `README.md`. To fix the text pages, `config/_default/params.toml` turns off the date, reading time and previous/next links, and `content/aktuelles/_index.md` turns them back on for news posts. No templates change.
- **Published site:** text pages lose the false date line and previous/next links. Hugo builds only `content/`, so `docs/` isn't published.
- **Dependencies:** none. The sketches are hand-written SVG files with no external fonts or images.
- **People:** gives the Verein a document to send to authors when asking for content.
