# Spec Delta

## Purpose

Defines how repository changes reach the public website and preview environments, so publishing is automatic, repeatable and safe when a build fails.

## ADDED Requirements

### Requirement: Automatic production deployment
A push to the `main` branch SHALL build the site and publish the result to the production URL without manual steps.

#### Scenario: Pushing to main
- **WHEN** a commit that builds successfully is pushed to `main`
- **THEN** the production URL serves the updated site once the deployment finishes

### Requirement: Preview deployments for other branches
A push to any other branch SHALL publish the site to a separate preview URL and SHALL leave production unchanged.

#### Scenario: Pushing to a branch
- **WHEN** a commit that builds successfully is pushed to a branch other than `main`
- **THEN** a preview URL serves that version of the site
- **AND** the production URL keeps serving its existing version

#### Scenario: Browsing a preview
- **GIVEN** a preview deployment
- **WHEN** a reviewer follows internal links and loads the page's styles and scripts
- **THEN** they stay on and load from that preview's URL

#### Scenario: Search engines and previews
- **WHEN** any page of a preview deployment is requested
- **THEN** the response includes the header `X-Robots-Tag: noindex`

### Requirement: Failed builds do not change the live site
If a build fails, the site SHALL NOT publish partial output, and the previously deployed version SHALL remain live.

#### Scenario: Build failure on main
- **GIVEN** a working production deployment
- **WHEN** a commit that fails to build is pushed to `main`
- **THEN** the production URL keeps serving the previous version
- **AND** the deployment is reported as failed in the hosting dashboard

### Requirement: Production URLs are canonical
A production build SHALL use the configured production URL for absolute links, canonical links, the sitemap and feeds.

#### Scenario: Inspecting production output
- **WHEN** the production deployment's HTML and `sitemap.xml` are inspected
- **THEN** absolute links and canonical links use the configured production URL
- **AND** none use a per-deployment URL

### Requirement: Reproducible build versions
The repository and documentation SHALL pin the generator and theme versions, so a clean checkout builds with the same versions locally and on the host.

#### Scenario: Clean checkout
- **GIVEN** a fresh clone with its theme dependency initialised and Docker available
- **WHEN** the documented build command runs
- **THEN** the build succeeds with no version compatibility warning

#### Scenario: Hosted build version
- **WHEN** a hosted build runs
- **THEN** its build log shows the pinned generator version

### Requirement: Local builds run in a container
Local builds and previews SHALL run the pinned generator in a container, and SHALL NOT require the generator to be installed on the machine.

#### Scenario: Machine without Hugo
- **GIVEN** a machine with Docker and no local Hugo install
- **WHEN** a developer runs the documented build and preview commands
- **THEN** the site builds and the preview is reachable from the host browser

### Requirement: Generated output is not committed
Build output and local build caches SHALL be excluded from version control.

#### Scenario: Building locally
- **WHEN** a developer builds the site and runs `git status`
- **THEN** no generated output or build cache file appears as a change
