# Resume Builder

A modern, single-page resume builder application built with Vue 3 and Vuetify. Create professional resumes with a beautiful UI and export them as HTML, PDF or JSON.

## Disclaimer

*This project is a work in progress and is provided "as is" without any warranties or guarantees. The developers are not responsible for any issues or damages that may arise from using this software. This application is developed using AI for code generation, embracing a "vibe coding" approach to enhance speed and efficiency. Users are encouraged to contribute to the project and report any bugs or issues they encounter. Please use this application at your own risk.*


## Features

![Resume Builder Screenshot](screenshot.png)

- 🎨 **Modern UI**: Clean and intuitive interface built with Vuetify 3
- 🔄 **Dynamic Sections**: Add, remove, reorder and hide any JSON Resume section, and place it in the main column or the sidebar
- 🎯 **Customizable Details**: Flexible detail fields with link support
- 🎨 **Simple Design Choices**: Two layouts, an accent color (all other colors are derived to stay readable), five font pairings, text size and density
- 💾 **Export**: Download as PDF, JSON Resume or plain text
- 📐 **Pixel-Perfect PDF**: Resumes are typeset with [Typst](https://typst.app) compiled to WebAssembly, right in the browser. The preview and the PDF come from the same compiled document, with embedded fonts, so the output is identical on every device
- 🔒 **Privacy First**: Everything stays in your browser
- 💾 **JSON Resume**: Resumes are stored in the open [JSON Resume](https://jsonresume.org/schema) format. Import a resume.json from any JSON Resume tool, and export one that other tools accept; the design and layout travel along in its `meta` field
- 🤖 **AI CV Conversion**: Convert existing CVs using AI models
- 📝 **Live Preview**: Real pages as you type, with zoom, fit-to-width and page count
- 📱 **Mobile Responsive**: Works seamlessly on desktop and mobile devices
- ✋ **Drag and Drop**: Reorder sections and entries, edit entries inline
- 📚 **CV Writing Guide**: Access to comprehensive CV writing resources

## Getting Started

### How it works

The resume is a [JSON Resume](https://jsonresume.org/schema) document; `src/resume/` holds the section definitions (which drive the editor forms, the renderer and the AI output schema) and the app settings stored under `meta.resumeBuilder`. Text fields use Markdown.

Templates live in `src/typst/templates` as Typst files. `src/typst/document.js` turns the resume into JSON that the templates read, and `src/typst/TypstService.js` runs the compiler in the browser to produce the SVG preview and the PDF. Fonts are bundled as TTF files in `public/fonts` (Typst cannot use system fonts in the browser); to change the set, edit `src/typst/fonts.js` and run `node scripts/fetch-fonts.mjs`.

### Prerequisites

- Node.js (v20 or higher) and npm/yarn, OR
- Docker and Docker Compose (v2.22.0 or later)

### Installation

#### Option 1: Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/gianfrancodemarco/resume-builder.git
   cd resume-builder
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

#### Option 2: Docker Development (Recommended)

1. Clone the repository:
   ```bash
   git clone https://github.com/gianfrancodemarco/resume-builder.git
   cd resume-builder
   ```

2. Start with Docker Compose Watch:
   ```bash
   docker compose up --build --watch
   ```

3. Open your browser and navigate to `http://localhost:5173`

## Technologies Used

- [Vue 3](https://vuejs.org/) - Progressive JavaScript framework
- [Vuetify 3](https://vuetifyjs.com/) - Material Design component framework
- [TipTap](https://tiptap.dev/) - Rich text editor
- [Phosphor Icons](https://phosphoricons.com/) - Icon library
- [Docker](https://www.docker.com/) - Containerization platform
- [Docker Compose](https://docs.docker.com/compose/) - File watching and hot reload

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Icons by [Phosphor Icons](https://phosphoricons.com/)
- CV Writing Guide by [Guido Penta](https://github.com/GuidoPenta/galactic-CV-guide-for-developers)
- Inspiration from modern resume templates
