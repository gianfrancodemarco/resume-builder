// @vitest-environment node
// Compiles every template with the real Typst compiler, so template errors
// fail the test suite instead of only showing up in the browser.
import fs from 'node:fs'
import path from 'node:path'
import { beforeAll, describe, expect, it } from 'vitest'
import { createTypstCompiler, createTypstFontBuilder, loadFonts } from '@myriaddreamin/typst.ts'
import sample from '@jsonresume/schema/sample.resume.json'
import { AVATAR_PATH, buildDocument } from '@/typst/document'
import { FONT_FAMILIES } from '@/typst/fonts'
import { addSection, applyTemplate, prepareResume, sampleResume, settingsOf } from '@/resume/resume'
import { SECTION_KEYS } from '@/resume/sections'
import { TEMPLATES } from '@/resume/templates'

const ROOT = path.resolve(__dirname, '../../..')
const TEMPLATES_DIR = path.resolve(__dirname, '../templates')
const WASM = path.join(ROOT, 'node_modules/@myriaddreamin/typst-ts-web-compiler/pkg/typst_ts_web_compiler_bg.wasm')

// 1x1 transparent PNG
const PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64')

let compiler

beforeAll(async () => {
    const wasm = fs.readFileSync(WASM)
    compiler = createTypstCompiler()
    await compiler.init({ beforeBuild: [loadFonts([], { assets: false })], getModule: () => wasm })

    const fonts = createTypstFontBuilder()
    await fonts.init({ getModule: () => wasm })
    for (const family of FONT_FAMILIES) {
        for (const variant of family.variants) {
            await fonts.addFontData(fs.readFileSync(path.join(ROOT, 'public/fonts', family.id, `${variant}.ttf`)))
        }
    }
    await fonts.build(async resolver => compiler.setFonts(resolver))

    for (const file of fs.readdirSync(TEMPLATES_DIR)) {
        compiler.addSource(`/${file}`, fs.readFileSync(path.join(TEMPLATES_DIR, file), 'utf8'))
    }
    compiler.mapShadow(AVATAR_PATH, new Uint8Array(PNG))
}, 60000)

async function compilePdf(resume) {
    const { data } = buildDocument(resume)
    compiler.mapShadow('/data.json', new TextEncoder().encode(JSON.stringify(data)))
    return compiler.compile({ mainFilePath: '/main.typ', format: 1, diagnostics: 'full' })
}

// Every section, every field type and Markdown feature, and a photo
function fullResume() {
    const resume = prepareResume(sample)
    resume.basics.image = 'data:image/png;base64,'
    resume.basics.summary = [
        '### Heading', 'Text with **bold**, *italic*, ~~strike~~, `code` and a [link](https://example.com).',
        '- one\n- two', '1. first', '> quote', '---', '#set page(width: 1pt) $x$ *y [z] \\ // <b>html</b>',
    ].join('\n\n')
    for (const key of SECTION_KEYS) {
        if (!settingsOf(resume).sections.some(s => s.key === key)) addSection(resume, key)
    }
    settingsOf(resume).sections.forEach((section, i) => { section.column = i % 2 ? 'sidebar' : 'main' })
    return resume
}

describe('Typst templates', () => {
    for (const key of Object.keys(TEMPLATES)) {
        it(`compiles ${key} with the sample resume`, async () => {
            const resume = sampleResume()
            applyTemplate(resume, key)
            const { result, diagnostics } = await compilePdf(resume)
            expect(diagnostics ?? []).toEqual([])
            expect(new TextDecoder().decode(result.slice(0, 5))).toBe('%PDF-')
        })

        it(`compiles ${key} with every section and Markdown feature`, async () => {
            const resume = fullResume()
            applyTemplate(resume, key)
            const { result, diagnostics } = await compilePdf(resume)
            expect(diagnostics ?? []).toEqual([])
            expect(result.length).toBeGreaterThan(0)
        })
    }

    it('compiles with the sidebar on the left and with no sidebar', async () => {
        for (const sidebarWidth of [280, 0]) {
            const resume = fullResume()
            Object.assign(settingsOf(resume).spacing, { sidebarLeft: true, sidebarWidth })
            const { diagnostics } = await compilePdf(resume)
            expect(diagnostics ?? []).toEqual([])
        }
    })

    it('compiles an empty resume', async () => {
        for (const key of Object.keys(TEMPLATES)) {
            const resume = prepareResume({})
            applyTemplate(resume, key)
            const { diagnostics } = await compilePdf(resume)
            expect(diagnostics ?? []).toEqual([])
        }
    })
})
