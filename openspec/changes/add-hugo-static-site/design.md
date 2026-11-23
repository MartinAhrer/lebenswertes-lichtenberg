# Design

## Context

The repository contains only IDE metadata and OpenSpec files, with no commits and no git remote. Hugo, Go and the GitHub CLI are not installed on the development machine, while Docker 29.2.1 and Compose v5.1.0 are. See `proposal.md` for motivation and scope, and the specs for required behaviour.

Facts checked on 2026-11-04 that shape this design:

| Item | Finding |
| --- | --- |
| Blowfish | Latest release is v3.9.0. It declares Hugo Extended 0.164.0 to 0.167.0 and ships a German translation (`i18n/de.yaml`). |
| Hugo | Latest release and Homebrew are both 0.169.0, which is above the Blowfish maximum. |
| Hugo image | The official `ghcr.io/gohugoio/hugo:v0.167.0` image is the Extended edition, supports amd64 and arm64, and works from `/project`. |
| Cloudflare Workers Builds | The build image includes Hugo Extended and defaults to 0.147.7, which is below the Blowfish minimum. The `HUGO_VERSION` build variable selects another version. Builds set `WORKERS_CI_BRANCH` to the pushed branch. |
| Cloudflare guidance | Cloudflare recommends Workers for new projects, and its dashboard marks Pages as legacy. Workers static assets serve a static site with a `wrangler.jsonc` file and support custom domains and per-branch previews. Preview URLs on `workers.dev` send `X-Robots-Tag: noindex`. |

## Goals / Non-Goals

**Goals:**

- Keep the site maintainable with only Docker, a text editor and Git.
- Stay close to Blowfish defaults so theme upgrades remain simple.
- Make local and hosted builds use the same versions.

**Non-Goals:**

- Copied theme layouts or a Node.js/Tailwind build. Blowfish ships compiled CSS, and additions stay in small project files that use the theme's extension points. The one exception is a copied hero partial that adds missing alt text (see Decision 9).
- Automated tests or a CI pipeline beyond Cloudflare's build. Verification is by build checks and inspecting the output.
- Migrating to Workers. See Decision 5.
- Running the container for production builds. See Decision 8.

## Decisions

### 1. Pin Hugo Extended 0.167.0

Use the newest version inside the Blowfish range. Blowfish requires the Extended edition.

- **Alternative: a native Hugo install.** Rejected because Homebrew's 0.169.0 is outside the range the theme declares, and a pinned install would need admin rights and differ per machine.
- **Alternative: the latest version with no pin.** Rejected because local and hosted builds would drift apart.

Locally, the image tag in `compose.yaml` sets the version (see Decision 8). On Cloudflare, set `HUGO_VERSION=0.167.0`. Upgrades change the theme tag, the image tag, `HUGO_VERSION` and the README together.

### 2. Add Blowfish as a Git submodule at tag v3.9.0

The theme lives at `themes/blowfish`, pinned to the release tag.

- **Alternative: Hugo Modules.** Rejected because a submodule works the same in the container and on Cloudflare, with no module tooling or module cache to manage.
- **Alternative: copy the theme into the repository.** Rejected because it adds a large amount of vendored code and makes upgrades harder.

The cost is that contributors must clone with `--recurse-submodules`, which the README documents.

### 3. Copy the theme's configuration into `config/_default/` and adapt it

Blowfish expects site configuration split across `config/_default/`. Copy its files, then rename `languages.en.toml` and `menus.en.toml` to their `.de.toml` equivalents.

| Setting | Value | Reason |
| --- | --- | --- |
| `theme` | `blowfish` | Enables the theme. |
| `baseURL` | `https://lebenswertes-lichtenberg.this-7f8.workers.dev/` | Production URL. See Open Questions. |
| `defaultContentLanguage` | `de` | German-only site. |
| Language `locale` | `de` | Sets the page language and selects the German translation. |
| Language `dateFormat` | `2. January 2006` | German date format. |
| `colorScheme` and `defaultAppearance` | `burufugu` and `dark` | Matches the Blowfish example site. Visitors can still switch appearance. |
| `homepage.layout` | `landing` | Shows a large hero with the campaign headline and buttons, like the Blowfish example site. |
| `homepage.showRecent` | `true` | Lists recent news on the Startseite. |
| `mainSections` | `["aktuelles"]` | Sets the source for recent news. |
| `enableSearch` | `false` | Search is out of scope. |
| Taxonomy pages | None | Tags and author pages aren't needed for the first version. |
| Main menu | Über uns, Aktuelles, Kontakt | Required navigation. |
| Footer menu | Impressum, Datenschutz | Required legal links. `footer.showMenu` is already on by default. |
| Language `title` | `Für ein lebenswertes Lichtenberg` | The site name. |
| `list.showHero` and `list.heroStyle` | `true` and `background` | Shows the Aktuelles image behind its title, like the Blowfish example site. This is a site-wide setting, and Aktuelles is currently the only list page. |
| `article.showHero` and `article.heroStyle` | `true` and `background` | Shows a post's image behind its title, like the Blowfish example site. Posts without an image show the background backdrop instead. |
| `backgroundCanvas` and `defaultBackgroundImage` | `true` and `images/site-background.svg` | Shows the example site's fixed backdrop on every page. The SVG is copied from the theme's `exampleSite/assets/images/v3/`, which is MIT-licensed like the theme. |
| `homepage.layoutBackgroundBlur` | `true` | Matches the Blowfish example site. |
| `list.showSummary` and `summaryLength` | `true` and `30` | Shows news previews. The theme's default `summaryLength` of 0 leaves them empty. |
| `homepage.showMoreLink` and `showMoreLinkDest` | `true` and `/aktuelles/` | Links from recent news to the full list. |
| `header.layout` | `banner` | Adds the floating header and site-wide banner. See Decision 9. |
| `header.mobileMenuStyle` | `dropdown` | Matches the Blowfish example site. |
| `homepage.cardView` and `list.cardView` | `true` | Shows news as cards. |
| `list.groupByYear` and `article.showWordCount` | `false` | Removes detail that adds little on a small news list. |
| `article.showReadingProgress` and `highlightCurrentMenuArea` | `true` | Matches the Blowfish example site. |

Three small overrides complete the German error page and interface text without changing theme layouts:

- `i18n/de.yaml` adds strings missing from the theme's German translation, including the error page button and menu labels.
- `data/quotes404.json` is an empty list, so the theme doesn't replace the error page's explanation with a random film quote. Hugo prints a harmless warning about this override on every build.
- A `cascade` entry in `hugo.toml`, targeting the path `/404`, replaces Hugo's built-in English error page title.

### 4. Use German URL slugs and a simple content layout

Use ASCII slugs, so `content/ueber-uns.md` serves "Über uns" at `/ueber-uns/`. News posts live at `content/aktuelles/<slug>.md`, and the section's list page comes from `content/aktuelles/_index.md`. The Startseite comes from `content/_index.md`.

Drafts and future-dated content rely on Hugo's defaults (`buildDrafts = false`, `buildFuture = false`), and the local preview (`docker compose up server`, see Decision 8) shows drafts. A future-dated post goes live only on the next build after its date, because there are no scheduled rebuilds.

### 5. Host on Cloudflare Workers with Workers Builds

A Worker named `lebenswertes-lichtenberg` serves the static files in `public/` as static assets, with no Worker script. Workers Builds connects it to the GitHub repository and builds on every push, which gives the required production and preview behaviour without any CI code.

`wrangler.jsonc` sets the assets directory, `not_found_handling: "404-page"` so unknown URLs get Hugo's `404.html` with status 404, and `html_handling: "auto-trailing-slash"` for Hugo's `folder/index.html` pages. An empty `previews` block enables Worker Previews, which `npx wrangler preview` requires. Each preview is named after its git branch. Wrangler marks Worker Previews as an open beta. Workers Builds ignores build settings in that file, so the dashboard holds them:

| Setting | Value |
| --- | --- |
| Production branch | `main` |
| Build command | `sh scripts/cloudflare-build.sh` |
| Deploy command | `npx wrangler deploy` |
| Preview builds | On for all other branches, with the default preview command `npx wrangler preview` |
| Build variable | `HUGO_VERSION=0.167.0` |
| Web Analytics | Off, as required by the no-tracking requirement |

Each non-production branch gets its own preview on `workers.dev`, which sends `X-Robots-Tag: noindex` by itself.

- **Alternative: Cloudflare Pages.** Rejected because Cloudflare's dashboard now marks Pages as legacy and new features go to Workers. Pages has no shutdown date, but moving later would mean moving a live site and its custom domain.
- **Alternative: Direct Upload from a CI pipeline.** Rejected because it adds CI code that Workers Builds makes unnecessary.

### 6. Select the base URL in a small build script

`scripts/cloudflare-build.sh` prints `hugo version` for the build log, then runs:

- `hugo --gc --minify` when `WORKERS_CI_BRANCH` is `main`, using the configured production URL.
- `hugo --gc --minify --baseURL "/"` otherwise, so preview pages use root-relative links and stay on the preview.

The script exits on any error. Workers Builds runs the deploy or preview command only after the build command succeeds, so a failed build isn't deployed.

- **Alternative: compute the preview address and pass it as `baseURL`.** Rejected because Cloudflare doesn't document how a branch name becomes the preview address. Root-relative links work at any address. Previews then have relative canonical links and sitemap entries, which is harmless because previews aren't indexed.
- **Alternative: no override.** Rejected because preview pages would link and load assets from production.

### 7. Mark placeholder content with `PLATZHALTER`

Unknown Verein details appear as visible text containing `PLATZHALTER`. The README's launch checklist includes searching for it. No names, addresses or legal wording are invented.

### 8. Run Hugo locally through Docker Compose

All local Hugo work runs in the official image, and `compose.yaml` keeps the commands short and the version pin in the repository:

```yaml
services:
  hugo:
    image: ghcr.io/gohugoio/hugo:v0.167.0
    command: build # the image's default command only prints help
    volumes: [".:/project", "hugo-cache:/cache"]
  server:
    extends: { service: hugo }
    command: server -D --renderToMemory --bind 0.0.0.0 --baseURL http://localhost:1313/
    ports: ["1313:1313"]
volumes:
  hugo-cache:
```

`--renderToMemory` keeps the preview out of `public/`. Without it, the server writes draft pages there and fails on later rebuilds if `public/` is deleted while it runs.

The build command is `docker compose run --rm hugo --gc --minify`, and the preview command is `docker compose up server`, which serves `http://localhost:1313/`.

Workers Builds runs its own build image, so production and preview deployments use the `HUGO_VERSION` build variable (Decision 5). Both environments use the same Hugo version, but not the same image.

- **Alternative: plain `docker run` commands.** Rejected because the mounts, port and image tag would have to be repeated in every command.
- **Alternative: build in the container for production too, using GitHub Actions and Direct Upload.** Rejected because it adds a CI pipeline and replaces the Git integration, for little benefit on a site this simple.

### 9. Add the banner through the theme's header setting

Blowfish chooses its header partial by name from `header.layout`. Set that to `banner` and add `layouts/partials/header/banner.html`, which calls the theme's `header/floating.html` and then renders the banner strip. The strip reads the Startseite's `heroImage` front matter and crops it with `Fill "1600x400 Center"`, so the banner always shows a band through the middle of the Startseite photo and can't drift to a different image. The Startseite skips the strip, because the `landing` layout already shows that photo as a large hero. Banner styles go in `assets/css/custom.css`, which the theme loads automatically.

- **Alternative: override `baseof.html` or the theme's header.** Rejected because copied layouts must be merged by hand on every theme upgrade.
- **Alternative: a homepage layout on its own.** Rejected because it only appears on the Startseite, and the banner is required on every page.

One theme partial is copied: `layouts/partials/hero/background.html`. The theme's `background` hero style draws a page's image without alternative text, which the Aktuelles image requirement needs. The copy only adds `alt` (front matter `alt`, else the page title) and must be merged on every theme upgrade. Long German words in titles hyphenate through `custom.css`, so they don't overflow at phone width.

The look follows the Blowfish example site where the theme provides the feature. Its analytics, Firebase, donation widget, sharing buttons and search stay off, as the no-tracking requirement and scope demand. Its number tiles are left out too, because they would need invented figures. View counts, the homepage layout switcher, edit links, taxonomies, related content and Zen mode also stay off, because they don't fit a small campaign site.

### 10. Store images in the repository

Images live in the repository and are served from the site's own domain, which the no-third-party requirement needs. The Aktuelles image is `content/aktuelles/feature.jpg`, a CC0 sample photo that Hugo resizes for the hero. The Startseite photo is `assets/images/Lichtenberg_20121014.jpeg`, a CC BY-SA 3.0 photo of Lichtenberg by C-Lover from Wikimedia Commons, set in `heroImage`. The banner crops a wide strip from the same file (Decision 9). CC BY-SA licenses require visible credit, so the Datenschutz page has a Bildnachweis section, which every page links to from its footer.

- **Alternative: hotlink images from another site.** Rejected because every page view would send visitor data to that site.

## Risks / Trade-offs

- **The sample photo misrepresents the location** → The Aktuelles photo shows Amsterdam, not Lichtenberg. The page's `PLATZHALTER` line and the README's launch checklist flag it for replacement.
- **The image credit gets lost** → Replacing the Datenschutz placeholder could remove the Bildnachweis section that the Startseite photo's license requires. The README's launch checklist covers this.
- **Published claims create legal exposure** → Statements about a named project or developer can carry legal risk, such as defamation. Sample content invents no names or facts, and the Verein should have real claims checked before publishing them.

- **Local and hosted builds differ beyond the Hugo version** → The container runs on Alpine and Cloudflare on Ubuntu. Preview deployments show the Cloudflare result before anything reaches `main`.
- **File changes don't trigger live reload through the mount** → Add `--poll 700ms` to the server command if the check in the tasks fails.
- **The container's user can't write to the project on Linux** → The image runs as user `hugo`. Set `user:` in `compose.yaml` if a Linux contributor hits this.
- **Every editor who builds locally needs Docker** → Editors without Docker can still edit Markdown and review the result on a preview deployment.

- **Placeholder Impressum or Datenschutz goes public** → Git integration publishes every push to `main`, including to a public `workers.dev` address. Complete the legal pages before connecting the Worker to the repository or sharing the URL, and follow the README's launch checklist.
- **Privacy text misses the host** → Cloudflare processes visitor IP addresses even without analytics. The Datenschutz placeholder must name Cloudflare as the host, and whoever supplies the final text should cover this.
- **Applicable legal requirements are unknown** → Impressum duties differ between countries. This change leaves the wording to the Verein and doesn't assume a jurisdiction.
- **Theme features add third-party requests** → Blowfish has optional integrations, such as AdSense and Firebase, that load external resources. Leave them unconfigured, and search the generated HTML for external references before launch.
- **Hosted Hugo isn't the Extended edition or the pinned version** → The first deployment's build log must show `0.167.0` and `+extended`. Forgetting `HUGO_VERSION` falls back to 0.147.7, which is below the theme's minimum. The README lists this setting.
- **Submodule isn't fetched on Cloudflare** → Workers Builds clones the repository like Pages did, and the theme submodule has a public URL, so this should work. The first deployment confirms it.
- **`HUGO_VERSION` format differs on Workers Builds** → Cloudflare documents the variable but not the value format for Hugo. The first build log must show `v0.167.0` and `+extended`.
- **Blowfish falls behind Hugo** → The pin holds Hugo at 0.167.0 until the theme's range moves. This is acceptable for a site with no server-side exposure.

## Migration Plan

This is a new site, so nothing needs to be migrated.

1. Implement and verify the site locally.
2. Create the GitHub repository and push.
3. Create the Worker through Workers Builds and configure it as in Decision 5.
4. Verify the production and preview deployments.

**Rollback:** roll back to an earlier deployment in the Worker's Deployments view in the Cloudflare dashboard, or revert the commit on `main`.

## Open Questions

- **Production domain:** the Worker is named `lebenswertes-lichtenberg`, so its address is `https://lebenswertes-lichtenberg.<account-subdomain>.workers.dev/`. The account subdomain is known once the Cloudflare account exists, and `baseURL` is set then. The plan is to register `lebenswertes-lichtenberg.at` later and add it to the Worker as a custom domain. Then `baseURL` changes to `https://lebenswertes-lichtenberg.at/`.
