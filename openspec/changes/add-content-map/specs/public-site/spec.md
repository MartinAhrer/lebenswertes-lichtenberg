# Spec Delta

## ADDED Requirements

### Requirement: Post details only on news posts
News posts SHALL show their date, reading time and links to the previous and next post. Other pages, such as Über uns, Kontakt, Impressum and Datenschutz, SHALL show none of these.

#### Scenario: Viewing a text page
- **WHEN** a visitor opens Über uns, Kontakt, Impressum or Datenschutz
- **THEN** the page shows no date and no reading time
- **AND** shows no links to a previous or next page

#### Scenario: Viewing a news post
- **WHEN** a visitor opens a news post
- **THEN** the post shows its date and reading time under its title
- **AND** links to the previous or next post where one exists
