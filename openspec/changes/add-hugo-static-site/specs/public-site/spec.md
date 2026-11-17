# Spec Delta

## Purpose

Defines what visitors experience on the Verein's public website: its pages, navigation, language, device support and privacy behaviour.

## ADDED Requirements

### Requirement: Site name
Every page SHALL show the site name "Für ein lebenswertes Lichtenberg" in its header and browser title.

#### Scenario: Identifying the site
- **WHEN** a visitor opens any page of the site
- **THEN** the page header shows "Für ein lebenswertes Lichtenberg"
- **AND** the browser title contains "Für ein lebenswertes Lichtenberg"

### Requirement: Site-wide banner
Every page SHALL show an image banner containing the site name directly under the main navigation. On the Startseite, the banner is the large hero image behind the campaign headline. On every other page, the banner SHALL show a 4 : 1 strip from the middle of the same photo, so the banner and the Startseite always show one photo.

#### Scenario: Banner on any page
- **WHEN** a visitor opens any page of the site, including the error page
- **THEN** an image banner with the site name appears directly under the main navigation

#### Scenario: Banner on the Startseite
- **WHEN** a visitor opens the Startseite
- **THEN** a large image appears behind the site name and campaign headline

#### Scenario: Banner matches the Startseite photo
- **GIVEN** the Startseite photo is replaced
- **WHEN** a visitor opens any other page
- **THEN** the banner shows a strip from the middle of the new photo, without a separate banner image being changed

#### Scenario: Banner on a phone
- **GIVEN** a browser viewport 375 pixels wide
- **WHEN** a visitor opens any page
- **THEN** the site name in the banner is fully visible and readable
- **AND** the banner causes no horizontal page scrolling

### Requirement: Campaign information on the Startseite
The Startseite SHALL inform citizens about the real estate project the Verein wants to block, with a headline, buttons leading to the main pages, and sections on what is at issue, what the Verein demands and how citizens can help.

#### Scenario: Learning about the campaign
- **WHEN** a visitor opens the Startseite
- **THEN** the page shows the campaign headline, buttons and the three sections
- **AND** the section on helping links to Kontakt and Aktuelles

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
The Startseite SHALL show the Verein's introductory text followed by a list of the most recent news posts, each linking to its post, and a link to the full Aktuelles page.

#### Scenario: News posts exist
- **GIVEN** at least one published news post
- **WHEN** a visitor opens the Startseite
- **THEN** the recent posts are listed and link to their pages
- **AND** a link leads to the Aktuelles page

### Requirement: Image on the Aktuelles page
The Aktuelles page SHALL show a large image with alternative text behind its title.

#### Scenario: Viewing the Aktuelles page
- **WHEN** a visitor opens the Aktuelles page at phone or desktop width
- **THEN** the image appears behind the page title, and the title stays readable
- **AND** the image has alternative text
- **AND** the image causes no horizontal page scrolling

### Requirement: News previews
The Aktuelles page SHALL show a short text preview of each listed news post.

#### Scenario: Scanning the news list
- **GIVEN** published news posts with body text
- **WHEN** a visitor opens the Aktuelles page
- **THEN** each listed post shows a preview of its text

### Requirement: Appearance of the Blowfish example site
The site SHALL look like the Blowfish example site wherever the theme provides the feature: the burufugu colour scheme in dark appearance by default with a switcher to light, a floating header, a site-wide background backdrop, a landing Startseite with hero image and buttons, news shown as cards, and page images shown as backgrounds behind the title. Example-site features that load third-party resources or need invented content SHALL be left out.

#### Scenario: First visit
- **GIVEN** a visitor whose browser has no stored appearance preference and does not ask for light mode
- **WHEN** the visitor opens any page
- **THEN** the page uses the burufugu colours in dark appearance
- **AND** the header floats above the page content

#### Scenario: Switching appearance
- **WHEN** a visitor selects the appearance switcher
- **THEN** the page changes to light appearance and stays readable

#### Scenario: Background backdrop
- **WHEN** a visitor opens any page, including the error page
- **THEN** the background backdrop appears behind the page content

#### Scenario: News as cards
- **WHEN** a visitor opens the Startseite or the Aktuelles page
- **THEN** news posts are shown as cards

#### Scenario: Appearance on a phone
- **GIVEN** a browser viewport 375 pixels wide
- **WHEN** a visitor opens any page in dark or light appearance
- **THEN** the page has no horizontal page scrolling

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

### Requirement: Image credits
Every photo on the site whose license requires credit SHALL be credited, with author, license and source, in a "Bildnachweis" section on the Datenschutz page.

#### Scenario: Finding an image credit
- **GIVEN** a photo on the site whose license requires credit
- **WHEN** a visitor follows the Datenschutz link in any page footer
- **THEN** the Bildnachweis section names the photo's author, license and source

### Requirement: No third-party resources or tracking
Pages SHALL load scripts, styles, fonts and images only from the site's own origin, and SHALL contain no analytics, advertising or tracking code, so that no consent banner is needed for them.

#### Scenario: Inspecting the generated site
- **WHEN** the generated HTML is searched for script, stylesheet, font and image references
- **THEN** every reference points to the site's own origin
- **AND** no analytics, advertising or tracking code is present

#### Scenario: Loading a page in a browser
- **WHEN** a visitor loads a page of the deployed site with browser developer tools open
- **THEN** no script, stylesheet, font or image is requested from another domain
