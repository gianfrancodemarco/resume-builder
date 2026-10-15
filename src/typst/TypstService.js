// Runs the Typst compiler (WebAssembly) in the browser. The same compiled
// document feeds the SVG preview and the PDF export, so they always match.
import { AVATAR_PATH, buildDocument, imageDataUrlToBytes } from './document'
import { fontUrls } from './fonts'
import mainTyp from './templates/main.typ?raw'
import libTyp from './templates/lib.typ?raw'
import twoColumnTyp from './templates/two-column.typ?raw'
import oneColumnModernTyp from './templates/one-column-modern.typ?raw'

const SOURCES = {
    '/main.typ': mainTyp,
    '/lib.typ': libTyp,
    '/two-column.typ': twoColumnTyp,
    '/one-column-modern.typ': oneColumnModernTyp,
}

// Typst formats: vector is rendered to SVG for the preview, pdf is downloaded
const FORMAT_VECTOR = 0
const FORMAT_PDF = 1

export class TypstCompileError extends Error {
    constructor(diagnostics) {
        const messages = (diagnostics || []).map(d => d.message || String(d))
        super(messages.length ? `Typst: ${messages.join('; ')}` : 'Typst compilation failed')
        this.diagnostics = diagnostics
    }
}

let enginePromise = null
// family name -> TTF buffers, for the families fetched so far
const loadedFonts = new Map()
let avatarSource = null
// The compiler holds shared state (sources, fonts), so jobs run one at a time
let queue = Promise.resolve()

function enqueue(job) {
    const run = queue.then(job, job)
    queue = run.catch(() => {})
    return run
}

async function createEngine() {
    const [typst, { default: compilerWasm }, { default: rendererWasm }] = await Promise.all([
        import('@myriaddreamin/typst.ts'),
        import('@myriaddreamin/typst-ts-web-compiler/wasm?url'),
        import('@myriaddreamin/typst-ts-renderer/wasm?url'),
    ])

    const compiler = typst.createTypstCompiler()
    // assets: false keeps typst.ts from downloading its default fonts from a CDN
    await compiler.init({ beforeBuild: [typst.loadFonts([], { assets: false })], getModule: () => compilerWasm })
    for (const [path, source] of Object.entries(SOURCES)) compiler.addSource(path, source)

    const renderer = typst.createTypstRenderer()
    await renderer.init({ getModule: () => rendererWasm })

    const setFonts = async () => {
        const builder = typst.createTypstFontBuilder()
        await builder.init({ getModule: () => compilerWasm })
        for (const buffers of loadedFonts.values()) {
            for (const buffer of buffers) await builder.addFontData(buffer)
        }
        await builder.build(async resolver => compiler.setFonts(resolver))
    }

    return { compiler, renderer, setFonts }
}

function getEngine() {
    if (!enginePromise) {
        enginePromise = createEngine().catch(error => {
            enginePromise = null
            throw error
        })
    }
    return enginePromise
}

async function fetchFamily(family) {
    return Promise.all(fontUrls(family).map(async url => {
        const res = await fetch(url)
        if (!res.ok) throw new Error(`Could not load font ${url}`)
        return new Uint8Array(await res.arrayBuffer())
    }))
}

/** Fetches families not loaded yet and hands the full set to the compiler. */
async function ensureFonts(engine, families) {
    const missing = families.filter(f => !loadedFonts.has(f))
    if (!missing.length) return
    const buffers = await Promise.all(missing.map(fetchFamily))
    missing.forEach((family, i) => loadedFonts.set(family, buffers[i]))
    await engine.setFonts()
}

async function syncAvatar(engine, dataUrl) {
    if (!dataUrl || dataUrl === avatarSource) return
    engine.compiler.mapShadow(AVATAR_PATH, await imageDataUrlToBytes(dataUrl))
    avatarSource = dataUrl
}

async function compile(resumeData, resumeStyle, format) {
    const engine = await getEngine()
    return enqueue(async () => {
        const { data, fonts } = buildDocument(resumeData, resumeStyle)
        await ensureFonts(engine, fonts)
        await syncAvatar(engine, resumeData.personal?.image?.data)
        engine.compiler.mapShadow('/data.json', new TextEncoder().encode(JSON.stringify(data)))

        const { result, diagnostics } = await engine.compiler.compile({
            mainFilePath: '/main.typ',
            format,
            diagnostics: 'full',
        })
        if (!result) throw new TypstCompileError(diagnostics)
        return { engine, result }
    })
}

// The renderer rounds the SVG size up to whole points (an A4 page becomes 596pt
// wide instead of 595.28pt), which leaves a blank strip along the edges. Set the
// exact document size so the SVG maps 1:1 onto the pages.
function fitSvg(svg, { width, height }) {
    const end = svg.indexOf('>')
    const root = svg.slice(0, end)
        .replace(/\sviewBox="[^"]*"/, ` viewBox="0 0 ${width} ${height}"`)
        .replace(/\s(data-)?width="[^"]*"/g, (_, data) => ` ${data || ''}width="${width}"`)
        .replace(/\s(data-)?height="[^"]*"/g, (_, data) => ` ${data || ''}height="${height}"`)
    return root + svg.slice(end)
}

export class TypstService {
    /** Starts downloading the compiler, so the first preview appears sooner. */
    static preload() {
        getEngine().catch(() => {})
    }

    /**
     * @returns {Promise<{ svg: string, size: { width: number, height: number }, pages: Array<{ width: number, height: number }> }>}
     *   One SVG with all pages stacked vertically, its size, and each page's size, all in pt
     */
    static async renderSvg(resumeData, resumeStyle) {
        const { engine, result } = await compile(resumeData, resumeStyle, FORMAT_VECTOR)
        const { renderer } = engine
        return renderer.runWithSession(async session => {
            renderer.manipulateData({ renderSession: session, action: 'reset', data: result })
            const pages = session.retrievePagesInfo().map(p => ({ width: p.width, height: p.height }))
            const svg = await renderer.renderSvg({
                renderSession: session,
                data_selection: { body: true, defs: true, css: true, js: false },
            })
            const size = {
                width: Math.max(...pages.map(p => p.width)),
                height: pages.reduce((sum, p) => sum + p.height, 0),
            }
            return { svg: fitSvg(svg, size), size, pages }
        })
    }

    /** @returns {Promise<Uint8Array>} */
    static async renderPdf(resumeData, resumeStyle) {
        const { result } = await compile(resumeData, resumeStyle, FORMAT_PDF)
        return result
    }
}
