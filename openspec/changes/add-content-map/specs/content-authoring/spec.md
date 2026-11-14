# Spec Delta

## ADDED Requirements

### Requirement: Content map names every building block
The repository SHALL contain a content map for authors, in German, that lists every building block a visitor can see on the site. Each block SHALL have a German name and an ID that is unique across the map.

#### Scenario: Looking up a block seen on the site
- **GIVEN** any block a visitor can see on any page of the built site, including the header, banner and footer
- **WHEN** an author looks for it in the content map
- **THEN** the map lists the block with its German name and ID

#### Scenario: Language of the map
- **WHEN** an author opens the content map
- **THEN** its text, block names and sketch labels are in German

### Requirement: Content map shows each page type as a sketch
The content map SHALL show each page type as a sketch-style wireframe in which every block is marked with its ID where it appears on the page. Pages that share one layout MAY share one sketch.

#### Scenario: Finding where a block appears
- **GIVEN** a block listed in the content map
- **WHEN** an author looks at the sketch of the block's page type
- **THEN** the block's ID marks its position on that sketch

#### Scenario: Every page has a sketch
- **WHEN** an author looks for the sketch of any page on the site
- **THEN** the map names the sketch that shows that page's layout

#### Scenario: Reading the sketch
- **WHEN** an author views a sketch in the repository's web view or an editor's Markdown preview, in light or dark mode
- **THEN** the sketch and its labels are readable
- **AND** the sketch loads no external fonts or images

### Requirement: Content map describes what each block needs
For each block, the content map SHALL state its purpose, a limit for text length or image size and format, and the file and front-matter field or Markdown element that fills it.

#### Scenario: Preparing a text block
- **GIVEN** a block filled with text by an author
- **WHEN** the author reads its entry in the content map
- **THEN** the entry states what the text is for and a recommended maximum length
- **AND** names the file and field or Markdown element that holds the text

#### Scenario: Preparing an image block
- **GIVEN** a block that shows an image supplied by the Verein
- **WHEN** the author reads its entry in the content map
- **THEN** the entry states the minimum image size, orientation and file format, where the image file goes, and where its alternative text goes
- **AND** says that the Verein must hold the rights to the image and credit it if its license requires

#### Scenario: Staying within a limit
- **GIVEN** a text or image that meets the limit stated in the content map
- **WHEN** it is placed in its block and the site is viewed at phone and desktop width
- **THEN** the block shows it in full, without overflowing its block or causing horizontal page scrolling

### Requirement: Content map marks automatic blocks
The content map SHALL mark blocks that the site fills automatically or that are fixed by the site's setup, and SHALL say where their content comes from, so authors know they need not supply them.

#### Scenario: Recent posts on the Startseite
- **WHEN** an author reads the entry for the list of recent posts on the Startseite
- **THEN** the entry says the list is filled automatically from the news posts
- **AND** names the post fields that appear in it

### Requirement: Content map is reachable and kept current
The README SHALL link to the content map. When a change adds, removes, renames or moves a building block, the content map SHALL be updated in the same change.

#### Scenario: Finding the map
- **WHEN** an author reads the README's section on editing content
- **THEN** it links to the content map

#### Scenario: Site layout changes
- **GIVEN** a change that adds, removes, renames or moves a building block
- **WHEN** the change is reviewed
- **THEN** the content map's entries and sketches match the changed site

### Requirement: Content map is not published
The content map SHALL NOT be part of the published website.

#### Scenario: Building the site
- **WHEN** the site is built for production
- **THEN** the build output contains no page or file from the content map
