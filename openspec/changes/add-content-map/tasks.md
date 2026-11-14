# Tasks

## 1. Block inventory and limits

- [x] 1.1 List every block visible on each page type in the local preview, including the header, banner, footer, background and error page. Assign IDs as in `design.md` Decision 3, and verify the list against the built HTML of every page in `public/`
- [x] 1.2 Record each block's purpose and its source (file and front-matter field, Markdown element, configuration file, or "automatisch"), and verify each source by changing it temporarily and seeing the block change in the preview
- [x] 1.3 Measure each text and image limit as in `design.md` Decision 5. Fill each block with test content at the candidate limit, and verify at 375 pixels and desktop width that it shows in full with no horizontal page scrolling. Then remove the test content and verify `git status` shows no content changes
- [x] 1.4 Try the post image as a page bundle (`design.md` Decision 6) on a temporary copy of a sample post. Verify the image appears behind the post title and on its card, with its `alt` text, then remove the copy
- [x] 1.5 Turn off date, reading time and previous/next links for pages outside Aktuelles as in `design.md` Decision 8, and verify in the built HTML that Über uns, Kontakt, Impressum and Datenschutz show none of them while news posts and the post cards still show date and reading time

## 2. Sketches

- [x] 2.1 Create `docs/inhaltskarte/gemeinsam.svg` in the sketch style of `design.md` Decision 2, with each `G` block marked by its ID. Verify it renders legibly in a browser and in an editor's Markdown preview, in light and dark mode
- [x] 2.2 Create `startseite.svg`, `aktuelles.svg`, `beitrag.svg`, `textseite.svg` and `fehlerseite.svg` in the same style, with the shared elements as grey `G` stubs. Verify every ID from task 1.1 appears on exactly one sketch, and that each sketch renders legibly in both modes
- [x] 2.3 Verify the SVG files reference no external fonts, images or scripts: `grep -E 'href|url\(|@import|<script' docs/inhaltskarte/*.svg` finds only internal references such as filter IDs

## 3. Map text and links

- [x] 3.1 Write `docs/inhaltskarte/README.md` in German, as in `design.md` Decision 4. Include an introduction, one section per sketch with its image and block table, the automatic blocks marked, the image section on rights, credit, formats and alternative text, and a note on how the phone layout differs. Verify every ID from task 1.1 has exactly one table row and every row states purpose, limit and source
- [x] 3.2 Link the map from the README's "Editing content" section and verify the link opens the map on GitHub-style Markdown rendering
- [x] 3.3 Add a `rules.tasks` entry to `openspec/config.yaml` requiring a task to update `docs/inhaltskarte/` when a change adds, removes, renames or moves a block, and verify `openspec instructions tasks --change add-content-map --json` shows the rule
- [x] 3.4 Add `scripts/inhaltskarte-pdf.sh` as in `design.md` Decision 9, document it in the README, and verify it writes `build/Inhaltskarte.pdf` with every sketch and table legible and each sketch section starting on a new page

## 4. Integration checks

- [x] 4.1 Build the site with `docker compose run --rm hugo --gc --minify` and verify `public/` contains nothing from `docs/inhaltskarte/`
- [x] 4.2 Walk through every page of the local preview with the map open, and verify each visible block can be found in the map by its sketch and ID
- [x] 4.3 Verify `openspec validate add-content-map` passes

## Workflow follow-up

- Archive `add-hugo-static-site` before archiving this change, because this change adds requirements to the `content-authoring` capability it introduces.
- Send the map to the Verein's content authors with the request for real content.
