# Proposal

## Why

The Verein has no website yet, and this repository holds no site code. A static site written in Markdown gives the Verein a public presence that non-developers can update, with no server, database or CMS to maintain.

## What Changes

- Add a Hugo static site, using the Blowfish theme, with content authored as Markdown files.
- Publish the site in German only, including theme UI text and date formats.
- Add the first set of pages: Startseite, Über uns, Aktuelles (dated news posts), Kontakt, Impressum and Datenschutz.
- Build and host the site on Cloudflare Pages: pushes to `main` deploy to production, and other branches get preview deployments.
- Pin the Hugo and Blowfish versions so that local and hosted builds match.
- Run local builds and previews with Hugo in a Docker container, so no native install is needed. Cloudflare Pages keeps building with its own Hugo at the same version.
- Document how to run the site locally, edit content and deploy.

**Assumptions to confirm during review** (not explicitly requested):

- The page set above is a proposed starting point.
- The repository will be hosted on GitHub and connected to Cloudflare Pages through its Git integration.
- Real Verein details are not known yet, so pages ship with clearly marked placeholders. Legal text must be supplied by the Verein.

**Out of scope for this change:**

- An events calendar, contact form, member area, on-site search, analytics and additional languages.
- A custom logo or branding beyond Blowfish's built-in colour schemes.
- Writing final page copy or legal text.
- Registering a domain or configuring DNS for a custom domain.

## Capabilities

### New Capabilities

- `content-authoring`: How editors create and change site content as Markdown files, including drafts and dated news posts.
- `public-site`: The pages, navigation, language and privacy behaviour that visitors experience.
- `site-deployment`: How the site is built and published to production and preview environments, including reproducible build versions.

### Modified Capabilities

None. The project has no existing specs.

## Impact

- **Repository:** adds the Hugo site structure, a pinned theme dependency, a `compose.yaml`, a Cloudflare build script, `.gitignore` entries for build output and a README. No existing code is affected.
- **Dependencies:** Hugo Extended 0.167.0 and Blowfish v3.9.0. Blowfish v3.9.0 supports Hugo 0.164.0 to 0.167.0. Local work requires Docker with Compose.
- **External systems:** requires a GitHub repository and a Cloudflare account with a Pages project. Neither exists yet, and someone with account access must set them up.
- **Before public launch:** placeholder content, especially Impressum and Datenschutz, must be replaced with real text from the Verein.
