# Spec Delta

## Purpose

Lets Verein editors create and change website content by editing Markdown files in the repository, without changing templates or site code.

## ADDED Requirements

### Requirement: Pages are authored in Markdown
The site SHALL generate each content page from a Markdown file in the repository, rendering its headings, lists, links and images as formatted HTML.

#### Scenario: Editing a page
- **GIVEN** an existing content page
- **WHEN** an editor changes the text of its Markdown file and the site is rebuilt
- **THEN** the page shows the new text
- **AND** no template or site code had to change

#### Scenario: Adding a page
- **WHEN** an editor adds a new Markdown file with a title and the site is rebuilt
- **THEN** the site includes a new page with that title at a URL derived from the file's location

### Requirement: News posts are dated Markdown files
Each news post SHALL be a single Markdown file with a title and publication date, and SHALL appear in the Aktuelles section once built.

#### Scenario: Publishing a news post
- **WHEN** an editor adds a Markdown file with a title and a past date to the Aktuelles section and the site is rebuilt
- **THEN** the post has its own page showing its title and date
- **AND** the post is listed on the Aktuelles page

#### Scenario: News order
- **GIVEN** several published news posts with different dates
- **WHEN** a visitor opens the Aktuelles page
- **THEN** the posts are listed with the newest first

### Requirement: Unfinished content is not published
Content marked as a draft, or dated in the future, SHALL be left out of production builds and SHALL be viewable locally by the editor on request.

#### Scenario: Draft in a production build
- **GIVEN** a Markdown file marked as a draft
- **WHEN** the production site is built
- **THEN** the build output contains no page or listing entry for that file

#### Scenario: Future-dated post in a production build
- **GIVEN** a news post dated in the future
- **WHEN** the production site is built before that date
- **THEN** the build output contains no page or listing entry for that post

#### Scenario: Previewing a draft locally
- **GIVEN** a Markdown file marked as a draft
- **WHEN** an editor runs the local preview with drafts enabled
- **THEN** the draft page is shown in the local preview

### Requirement: Placeholder content is identifiable
Any text standing in for information the Verein has not yet supplied SHALL contain the marker `PLATZHALTER`, both in the Markdown source and on the rendered page.

#### Scenario: Finding remaining placeholders
- **WHEN** a maintainer searches the content files for `PLATZHALTER`
- **THEN** every location still awaiting real content is found

#### Scenario: Placeholder seen on a page
- **GIVEN** a page that still contains placeholder text
- **WHEN** a reader views the page
- **THEN** the marker `PLATZHALTER` is visible in the text
