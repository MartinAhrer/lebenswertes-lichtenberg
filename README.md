# LB Verein website

The Verein's public website, built with [Hugo](https://gohugo.io/) and the [Blowfish](https://blowfish.page/) theme. Content is written in Markdown and hosted on Cloudflare Pages.

## Requirements

You need [Docker](https://www.docker.com/) with Compose, and Git. You don't need to install Hugo, because all local builds run it in a container.

Clone the repository with its theme:

```sh
git clone --recurse-submodules <repository-url>
```

If you already cloned without the theme, run `git submodule update --init`.

## Local preview and build

Start the preview, including drafts, at <http://localhost:1313/>. It updates when you save a file:

```sh
docker compose up server
```

Stop it with `Ctrl+C`. If you delete a page, its old URL keeps working in the preview until you restart it. This doesn't affect the published site.

Build the site as it would be published. The result goes to `public/`, which isn't committed:

```sh
docker compose run --rm hugo --gc --minify
```

The build prints one warning that `quotes404.json` is overridden. This is expected: `data/quotes404.json` is deliberately empty so the error page doesn't show the theme's film quotes.

## Editing content

Pages live in `content/` as Markdown files, and a file's location sets its URL.

| Page | File | URL |
| --- | --- | --- |
| Startseite | `content/_index.md` | `/` |
| Über uns | `content/ueber-uns.md` | `/ueber-uns/` |
| Aktuelles | `content/aktuelles/_index.md` | `/aktuelles/` |
| Kontakt | `content/kontakt.md` | `/kontakt/` |
| Impressum | `content/impressum.md` | `/impressum/` |
| Datenschutz | `content/datenschutz.md` | `/datenschutz/` |

### Add a page

Create a Markdown file in `content/` with a title. To show it in the header or footer, add it to `config/_default/menus.de.toml`.

```markdown
---
title: "Mitgliedschaft"
---

Text der Seite.
```

### Add a news post

Create a file such as `content/aktuelles/sommerfest.md` with a title and date. It appears on `/aktuelles/` and the Startseite.

```markdown
---
title: "Sommerfest"
date: 2026-06-20
---

Text des Beitrags.
```

### Hold content back

Add `draft: true` to a file's front matter to keep it out of the published site. It still appears in the local preview.

A post with a future date isn't published until the first build after that date. There are no scheduled builds, so push a commit or retry the deployment in Cloudflare on or after that day.

### Placeholders

Text still waiting for real information contains the word `PLATZHALTER`. To find what's left:

```sh
grep -r PLATZHALTER content/
```

## Deployment

Cloudflare Pages builds the site on every push:

- A push to `main` updates the live site.
- A push to any other branch creates a separate preview URL and leaves the live site unchanged.
- If a build fails, the previous version stays live.

### Cloudflare settings

| Setting | Value |
| --- | --- |
| Production branch | `main` |
| Build command | `sh scripts/cloudflare-build.sh` |
| Output directory | `public` |
| Environment variable | `HUGO_VERSION=0.167.0` for production and preview |
| Web Analytics | Off |

Cloudflare can't use the local container, so `HUGO_VERSION` must match the image tag in `compose.yaml`. Without it, Cloudflare uses its default Hugo, which is too old for the theme. The build log should show `v0.167.0` and `+extended`.

`baseURL` in `config/_default/hugo.toml` must match the live address, including after adding a custom domain.

## Upgrading Hugo and the theme

Each Blowfish release supports a specific range of Hugo versions, listed under `min` and `max` in `themes/blowfish/config.toml`. v3.9.0 supports 0.164.0 to 0.167.0, so a newer Hugo isn't automatically compatible.

Change all of these together:

1. Check out the new theme tag: `git -C themes/blowfish fetch --tags`, then `git -C themes/blowfish checkout <tag>`.
2. Update the image tag in `compose.yaml`.
3. Update `HUGO_VERSION` in Cloudflare and in this README.
4. Run a local build, then check a preview deployment before merging to `main`.

## Launch checklist

- [ ] `grep -r PLATZHALTER content/` finds nothing.
- [ ] Impressum and Datenschutz contain reviewed text, and Datenschutz names Cloudflare as the host.
- [ ] The site title in `config/_default/languages.de.toml` is the Verein's real name. It's currently derived from the repository name.
- [ ] `baseURL` matches the live address.
- [ ] Remove the example post, `content/aktuelles/erste-neuigkeit.md`.
