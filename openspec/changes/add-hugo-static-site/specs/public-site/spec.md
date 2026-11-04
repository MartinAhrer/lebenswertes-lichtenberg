# Spec Delta

## Purpose

Defines what visitors experience on the Verein's public website: its pages, navigation, language, device support and privacy behaviour.

## ADDED Requirements

### Requirement: Initial page set
The site SHALL provide these pages: Startseite at `/`, Über uns at `/ueber-uns/`, Aktuelles at `/aktuelles/`, Kontakt at `/kontakt/`, Impressum at `/impressum/` and Datenschutz at `/datenschutz/`.

#### Scenario: Opening each page
- **WHEN** a visitor requests any of the listed URLs
- **THEN** the site responds with the corresponding page and HTTP status 200

### Requirement: Main navigation
Every page SHALL show a main navigation linking to Über uns, Aktuelles and Kontakt, and SHALL offer a link back to the Startseite.

#### Scenario: Navigating from any page
- **GIVEN** a visitor is on any page of the site
- **WHEN** the visitor selects a main navigation link
- **THEN** the linked page opens

### Requirement: Legal pages reachable from every page
Every page SHALL show links to Impressum and Datenschutz in its footer.

#### Scenario: Finding the legal pages
- **GIVEN** a visitor is on any page of the site, including a news post or the error page
- **WHEN** the visitor looks at the page footer
- **THEN** links to Impressum and Datenschutz are present and open those pages

### Requirement: Recent news on the Startseite
The Startseite SHALL show the Verein's introductory text followed by a list of the most recent news posts, each linking to its post.

#### Scenario: News posts exist
- **GIVEN** at least one published news post
- **WHEN** a visitor opens the Startseite
- **THEN** the recent posts are listed and link to their pages

### Requirement: German language
The site SHALL be published in German, covering page content, theme interface text and dates, and SHALL declare German as the page language.

#### Scenario: Language declaration
- **WHEN** any generated HTML page is inspected
- **THEN** its root element declares the language `de`

#### Scenario: Theme text and dates
- **WHEN** a visitor views a news post or the Aktuelles page
- **THEN** interface text from the theme is in German
- **AND** dates use German formatting and month names, for example `4. November 2026`

### Requirement: German error page
A request for a URL that does not exist SHALL receive a German error page with HTTP status 404 and a link back to the Startseite.

#### Scenario: Unknown URL
- **WHEN** a visitor requests a URL that does not exist on the deployed site
- **THEN** the response has HTTP status 404
- **AND** the page explains the error in German and links to the Startseite

### Requirement: Usable on phones and desktops
All pages SHALL be readable and navigable at phone and desktop widths without horizontal page scrolling.

#### Scenario: Phone width
- **GIVEN** a browser viewport 375 pixels wide
- **WHEN** a visitor opens any page
- **THEN** the page has no horizontal page scrolling
- **AND** every main navigation link can be reached

### Requirement: No third-party resources or tracking
Pages SHALL load scripts, styles and fonts only from the site's own origin, and SHALL contain no analytics, advertising or tracking code, so that no consent banner is needed for them.

#### Scenario: Inspecting the generated site
- **WHEN** the generated HTML is searched for script, stylesheet and font references
- **THEN** every reference points to the site's own origin
- **AND** no analytics, advertising or tracking code is present

#### Scenario: Loading a page in a browser
- **WHEN** a visitor loads a page of the deployed site with browser developer tools open
- **THEN** no script, stylesheet or font is requested from another domain
