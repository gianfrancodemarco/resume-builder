# Changelog

All notable changes to this project are documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.1.0] - 2026-10-18

### Added

- Three more accent colours: Charcoal, Brown and Indigo ([#94](https://github.com/gianfrancodemarco/resume-builder/pull/94)).

### Changed

- **Landing page:** the footer is gone. The personal site link and the GitHub star button are in a nav row at the top, next to the theme toggle ([#96](https://github.com/gianfrancodemarco/resume-builder/pull/96)).
- **Calmer light theme** ([#96](https://github.com/gianfrancodemarco/resume-builder/pull/96)): on the landing page, a fainter background, no floating shapes and solid white cards. In the editor, a darker backdrop behind the preview, an indigo AI notice, a grey GitHub star and a dashed "Add section" button. Dark mode is unchanged.
- Visit statistics moved from Simple Analytics, whose free plan keeps only 30 days, to [GoatCounter](https://www.goatcounter.com), which keeps them with no time limit. Neither uses cookies.

### Fixed

- Light-theme styles from the landing page leaked into the rest of the app ([#96](https://github.com/gianfrancodemarco/resume-builder/pull/96)).

## [2.0.0] - 2026-10-16

A rebuild of the rendering, the data model and the editor. Resumes are now typeset with Typst and stored as standard JSON Resume files.

### ⚠️ Breaking changes

- **New data format.** Resumes are stored and exported as [JSON Resume](https://jsonresume.org/schema). Files exported from 1.x can't be imported, and there is no migration.
- **Saved resumes from 1.x are not loaded.** 1.x kept your resume in the browser under different keys, so 2.0 starts from the sample resume. Your 1.x data is left in the browser's storage, but it can't be imported.
- **Fewer design options.** Free-form colours, the sidebar width setting and the custom CSS section are gone. Pick a layout, an accent colour, a font pairing, a text size and a density instead.
- **HTML export removed.** Export as PDF, JSON Resume or plain text.

### Added

- **Typst rendering** ([#82](https://github.com/gianfrancodemarco/resume-builder/pull/82)): resumes are typeset with [Typst](https://typst.app) compiled to WebAssembly, in the browser. The preview and the PDF come from the same compiled document, so they're identical. Fonts are embedded, and the output is the same on every browser and device.
- **JSON Resume** ([#83](https://github.com/gianfrancodemarco/resume-builder/pull/83)): import a `resume.json` from any JSON Resume tool, or export yours. The design and section layout travel along in its `meta` field. Every standard section is supported, and text fields use Markdown.
- **Support for more scripts** ([#83](https://github.com/gianfrancodemarco/resume-builder/pull/83)): Cyrillic, Greek, Hebrew and Vietnamese text renders correctly, with fallback fonts loaded only when needed.
- **Five layouts** ([#85](https://github.com/gianfrancodemarco/resume-builder/pull/85)): Sidebar, Classic, Minimal (ATS friendly), Banner and Timeline.
- **Five-dot language ratings** ([#85](https://github.com/gianfrancodemarco/resume-builder/pull/85)), derived from CEFR levels or common wording such as "Native" or "Fluent".
- **CV import progress** ([#85](https://github.com/gianfrancodemarco/resume-builder/pull/85)): a dialog shows the current step and elapsed time while a CV is converted, and the import can be cancelled.
- **Split download button** ([#85](https://github.com/gianfrancodemarco/resume-builder/pull/85)): one click downloads the PDF, and the menu offers JSON Resume and plain text.
- A "Star on GitHub" link in the top bar ([#85](https://github.com/gianfrancodemarco/resume-builder/pull/85)).
- Light theme on the homepage, and a short loading screen while the app starts ([#84](https://github.com/gianfrancodemarco/resume-builder/pull/84)).

### Changed

- **Redesigned editor** ([#84](https://github.com/gianfrancodemarco/resume-builder/pull/84)): a top bar, Content / Design / AI tabs and a live preview with zoom, fit-to-width and a page count.
  - **Content:** each section is a card. Sections and entries are reordered by drag and drop, edited in place and hidden individually.
  - **Design:** layout, accent colour, font pairing, size and density. Every other colour is derived from the accent with readable contrast.
  - **AI:** AI generation and CV import are grouped in one tab.
- Forms are generated from the JSON Resume fields, with month and year date pickers, list editors and Markdown text fields ([#84](https://github.com/gianfrancodemarco/resume-builder/pull/84)).
- Your resume is saved in the browser every second, and before the page closes ([#84](https://github.com/gianfrancodemarco/resume-builder/pull/84)).
- Refreshed light and dark palettes and nicer form fields ([#84](https://github.com/gianfrancodemarco/resume-builder/pull/84)).
- The desktop editor is used down to tablet width ([#84](https://github.com/gianfrancodemarco/resume-builder/pull/84)).
- Tighter, more consistent spacing in every layout ([#85](https://github.com/gianfrancodemarco/resume-builder/pull/85)).
- Rewritten README with a demo, a layout gallery and badges ([#86](https://github.com/gianfrancodemarco/resume-builder/pull/86)).

### Removed

- The HTML templates and their Vue components, replaced by the Typst templates ([#82](https://github.com/gianfrancodemarco/resume-builder/pull/82)).
- The old resume data and style classes, and the custom CSS section ([#83](https://github.com/gianfrancodemarco/resume-builder/pull/83), [#84](https://github.com/gianfrancodemarco/resume-builder/pull/84)).

### Fixed

- Extra white space in PDFs exported on Safari and Android. PDFs no longer depend on the browser's print engine ([#82](https://github.com/gianfrancodemarco/resume-builder/pull/82)).
- Broken unit tests for the AI components ([#83](https://github.com/gianfrancodemarco/resume-builder/pull/83)).

## [1.8.0] - 2025-12-11

### Added

- Page break guides in the preview ([#80](https://github.com/gianfrancodemarco/resume-builder/pull/80)).
- An optional photo in the two-column template, with zoom and position sliders ([#81](https://github.com/gianfrancodemarco/resume-builder/pull/81)).

## [1.7.0] - 2025-10-26

### Fixed

- Deleting custom sections, employment history and education entries ([#79](https://github.com/gianfrancodemarco/resume-builder/pull/79)).

## [1.6.1] - 2025-10-19

### Fixed

- Ordering of education and employment history ([#75](https://github.com/gianfrancodemarco/resume-builder/pull/75)).
- Sections not appearing in the side menu ([#78](https://github.com/gianfrancodemarco/resume-builder/pull/78)).

## [1.6.0] - 2025-09-10

### Added

- Audio transcription in AI generation ([#69](https://github.com/gianfrancodemarco/resume-builder/pull/69)).

## [1.5.0] - 2025-09-08

### Added

- AI Hub, with CV conversion ([#65](https://github.com/gianfrancodemarco/resume-builder/pull/65)) and AI generation ([#67](https://github.com/gianfrancodemarco/resume-builder/pull/67)).
- Employment history and education can be reordered among the custom sections ([#64](https://github.com/gianfrancodemarco/resume-builder/pull/64)).

## [1.4.0] - 2025-07-24

### Added

- Plain text export ([#57](https://github.com/gianfrancodemarco/resume-builder/pull/57)).

### Changed

- Each template is rendered by its own component ([#55](https://github.com/gianfrancodemarco/resume-builder/pull/55)).

## [1.3.0] - 2025-07-19

### Added

- Advanced style section for custom CSS embedded in the resume ([#51](https://github.com/gianfrancodemarco/resume-builder/pull/51)).
- More test coverage ([#52](https://github.com/gianfrancodemarco/resume-builder/pull/52), [#53](https://github.com/gianfrancodemarco/resume-builder/pull/53)).

## [1.2.3] - 2025-07-09

### Added

- Dockerfile and Docker Compose ([#49](https://github.com/gianfrancodemarco/resume-builder/pull/49)).

### Fixed

- Theme not kept on reload ([#50](https://github.com/gianfrancodemarco/resume-builder/pull/50)).

## [1.2.2] - 2025-06-30

### Fixed

- White space in the template previews ([#41](https://github.com/gianfrancodemarco/resume-builder/pull/41)).
- The sidebar reappearing when reloading with the one-column modern template ([#43](https://github.com/gianfrancodemarco/resume-builder/pull/43)).

## [1.2.1] - 2025-06-30

### Fixed

- Heading text not visible in light mode ([#38](https://github.com/gianfrancodemarco/resume-builder/pull/38)).

## [1.2.0] - 2025-06-29

### Added

- More style controls ([#27](https://github.com/gianfrancodemarco/resume-builder/pull/27)).
- Example templates ([#28](https://github.com/gianfrancodemarco/resume-builder/pull/28)).

### Changed

- Personal information can no longer be hidden ([#26](https://github.com/gianfrancodemarco/resume-builder/pull/26)).

## [1.1.0] - 2025-06-21

### Added

- Data is saved in the browser at regular intervals ([#21](https://github.com/gianfrancodemarco/resume-builder/pull/21)).
- The sidebar can be removed by setting its width to 0 ([#22](https://github.com/gianfrancodemarco/resume-builder/pull/22)).

## [1.0.0] - 2025-06-21

First stable release.

### Added

- JSON export and import ([#7](https://github.com/gianfrancodemarco/resume-builder/pull/7)).
- Rich text editors ([#11](https://github.com/gianfrancodemarco/resume-builder/pull/11)).
- Import of CVs not created with Resume Builder ([#16](https://github.com/gianfrancodemarco/resume-builder/pull/16)).
- Sidebar that spans every page ([#6](https://github.com/gianfrancodemarco/resume-builder/pull/6)).

### Changed

- Restyled editor and homepage ([#15](https://github.com/gianfrancodemarco/resume-builder/pull/15), [#18](https://github.com/gianfrancodemarco/resume-builder/pull/18)).

### Fixed

- Freezes on mobile caused by a recursive update ([#9](https://github.com/gianfrancodemarco/resume-builder/pull/9)).

[2.1.0]: https://github.com/gianfrancodemarco/resume-builder/compare/v2.0.0...v2.1.0
[2.0.0]: https://github.com/gianfrancodemarco/resume-builder/compare/v1.8.0...v2.0.0
[1.8.0]: https://github.com/gianfrancodemarco/resume-builder/compare/v1.7.0...v1.8.0
[1.7.0]: https://github.com/gianfrancodemarco/resume-builder/compare/v1.6.1...v1.7.0
[1.6.1]: https://github.com/gianfrancodemarco/resume-builder/compare/v1.6.0...v1.6.1
[1.6.0]: https://github.com/gianfrancodemarco/resume-builder/compare/v1.5.0...v1.6.0
[1.5.0]: https://github.com/gianfrancodemarco/resume-builder/compare/v1.4.1...v1.5.0
[1.4.0]: https://github.com/gianfrancodemarco/resume-builder/compare/v1.3.0...v1.4.0
[1.3.0]: https://github.com/gianfrancodemarco/resume-builder/compare/v1.2.3...v1.3.0
[1.2.3]: https://github.com/gianfrancodemarco/resume-builder/compare/v1.2.2...v1.2.3
[1.2.2]: https://github.com/gianfrancodemarco/resume-builder/compare/v1.2.1...v1.2.2
[1.2.1]: https://github.com/gianfrancodemarco/resume-builder/compare/v1.2.0...v1.2.1
[1.2.0]: https://github.com/gianfrancodemarco/resume-builder/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/gianfrancodemarco/resume-builder/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/gianfrancodemarco/resume-builder/releases/tag/v1.0.0
