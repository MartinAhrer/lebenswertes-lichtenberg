# Tasks

Tasks marked **(account access)** need the repository owner's GitHub or Cloudflare account.

## 1. Tooling and repository setup

- [x] 1.1 Add `compose.yaml` as described in `design.md` Decision 8 and verify `docker compose run --rm hugo version` shows `v0.167.0` and `+extended`
- [x] 1.2 Add `.gitignore` entries for `public/`, `resources/_gen/` and `.hugo_build.lock` and verify `git check-ignore` matches each path
- [x] 1.3 Add Blowfish as a Git submodule at `themes/blowfish`, check out tag `v3.9.0`, and verify `git submodule status` shows that tag

## 2. Site configuration

- [x] 2.1 Copy the theme's `config/_default/` files into the project, rename the language and menu files to `languages.de.toml` and `menus.de.toml`, and verify `docker compose run --rm hugo config` succeeds
- [x] 2.2 Set `theme`, `baseURL` and `defaultContentLanguage = "de"`, and set the German `locale`, title and `dateFormat`, then verify `docker compose run --rm hugo config` reports these values
- [x] 2.3 Set the `page` homepage layout, recent news, `mainSections = ["aktuelles"]` and `enableSearch = false`, remove the taxonomies, and verify `docker compose run --rm hugo` builds with no theme compatibility warning
- [x] 2.4 Configure the main menu (Über uns, Aktuelles, Kontakt) and footer menu (Impressum, Datenschutz), and verify after task 3 that the built pages contain all five links

## 3. Content

- [x] 3.1 Create `content/_index.md`, `content/ueber-uns.md` and `content/kontakt.md` in German with `PLATZHALTER` markers for unknown Verein details, and verify each renders at its required URL
- [x] 3.2 Create `content/impressum.md` and `content/datenschutz.md` with `PLATZHALTER` markers and no invented legal wording, name Cloudflare as the host in the Datenschutz placeholder, and verify each renders at its required URL
- [x] 3.3 Create `content/aktuelles/_index.md` and one past-dated example post marked `PLATZHALTER`, and verify the post appears on `/aktuelles/` and the Startseite with a German-formatted date
- [x] 3.4 Verify `grep -r PLATZHALTER content/` finds every placeholder and that the marker is visible on the rendered pages

## 4. Build script and documentation

- [x] 4.1 Add `scripts/cloudflare-build.sh` to print `hugo version`, stop on any error, and choose the base URL from `CF_PAGES_BRANCH` and `CF_PAGES_URL`; verify by running it in the container (`docker compose run --rm --entrypoint sh` with `-e` for the variables) with `CF_PAGES_BRANCH=main`, then with a preview branch and example URL, and inspecting `sitemap.xml` each time
- [x] 4.2 Write `README.md` covering cloning with `--recurse-submodules`, the Docker requirement, building with `docker compose run --rm hugo --gc --minify`, local preview with `docker compose up server`, adding pages and news posts, the Cloudflare settings and why `HUGO_VERSION` must match the image tag, upgrading Hugo and the theme together, and a launch checklist; verify the documented commands run as written

## 5. Local integration checks

- [x] 5.1 Build from a fresh clone with submodules following the README, using only Docker, and verify the build succeeds with no version compatibility warning and `git status` shows no generated files
- [x] 5.2 Add a temporary draft and a temporary future-dated post, verify neither appears in the output of `docker compose run --rm hugo` and that the draft appears under `docker compose up server`, then remove both files
- [x] 5.3 Inspect `public/` and verify every generated HTML page has `lang="de"`, the main navigation and the legal footer links, including `404.html`
- [x] 5.4 Add a second, newer temporary post, verify `/aktuelles/` lists it first, then remove it
- [x] 5.5 Search `public/` for script, stylesheet and font references and verify all use the site's own origin and that no analytics, advertising or tracking code is present
- [x] 5.6 Open the pages in a browser at 375 pixels and at desktop width, and verify there is no horizontal page scrolling and that all navigation links work and German theme text appears
- [x] 5.7 Edit a Markdown file while `docker compose up server` is running and verify the browser at `http://localhost:1313/` updates; if it doesn't, add `--poll 700ms` as described in `design.md` and check again

## 6. Hosting setup

- [ ] 6.1 **(account access)** Create the GitHub repository, add it as `origin` and push `main`, then verify the theme submodule shows on GitHub at tag `v3.9.0`
- [ ] 6.2 **(account access)** Create the Cloudflare Pages project through Git integration with the settings in `design.md` Decision 5, including `HUGO_VERSION=0.167.0` for production and preview, and verify Web Analytics is off
- [ ] 6.3 **(account access)** Confirm the assigned `pages.dev` address; if it differs from `baseURL`, update `baseURL` and push, then verify the setting matches

## 7. Deployment verification

- [ ] 7.1 Verify the production build log shows `v0.167.0` and `+extended`, and that every required URL returns HTTP status 200
- [ ] 7.2 Verify that an unknown production URL returns HTTP status 404 with the German error page, and that production HTML and `sitemap.xml` use only the configured production URL
- [ ] 7.3 Load production pages with browser developer tools open and verify no script, stylesheet or font is requested from another domain
- [ ] 7.4 Push a temporary branch and verify its preview URL serves the change, internal links and assets stay on the preview URL, responses include `X-Robots-Tag: noindex`, and production is unchanged
- [ ] 7.5 Push a commit that breaks the build to the temporary branch, verify the deployment is reported as failed and production is unchanged, then delete the branch
- [ ] 7.6 Push a small content change to `main` and verify production updates without manual steps

## Workflow follow-up

- Replace all `PLATZHALTER` content with real text from the Verein, including reviewed Impressum and Datenschutz text, before announcing the site.
- Archive this change after the implementation is reviewed.
