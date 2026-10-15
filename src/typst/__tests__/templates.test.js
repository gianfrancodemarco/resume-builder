// @vitest-environment node
// Compiles every template with the real Typst compiler, so template errors
// fail the test suite instead of only showing up in the browser.
import fs from 'node:fs'
import path from 'node:path'
import { JSDOM } from 'jsdom'
import { beforeAll, describe, expect, it } from 'vitest'
import { createTypstCompiler, createTypstFontBuilder, loadFonts } from '@myriaddreamin/typst.ts'
import { AVATAR_PATH, buildDocument } from '@/typst/document'
import { FONT_FAMILIES } from '@/typst/fonts'
import { ResumeDataV2 } from '@/models/ResumeData/ResumeDataV2'
import { TemplateService } from '@/services/TemplateService'

const ROOT = path.resolve(__dirname, '../../..')
const TEMPLATES_DIR = path.resolve(__dirname, '../templates')
const WASM = path.join(ROOT, 'node_modules/@myriaddreamin/typst-ts-web-compiler/pkg/typst_ts_web_compiler_bg.wasm')

// 1x1 transparent PNG
const PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64')

let compiler

beforeAll(async () => {
    globalThis.DOMParser = new JSDOM().window.DOMParser
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

async function compilePdf(resumeData, resumeStyle) {
    const { data } = buildDocument(resumeData, resumeStyle)
    compiler.mapShadow('/data.json', new TextEncoder().encode(JSON.stringify(data)))
    return compiler.compile({ mainFilePath: '/main.typ', format: 1, diagnostics: 'full' })
}

function richResume() {
    const resume = ResumeDataV2.createDefault()
    resume.personal.image = { data: 'data:image/png;base64,', x: 30, y: 70, scale: 180 }
    resume.experiences[0].description = [
        '<h2>Heading</h2><p style="text-align: justify">Text with <strong>bold</strong>, <em>italic</em>, <u>underline</u>, <s>strike</s>, <code>code</code>.</p>',
        '<p></p><ul><li><p>one</p></li></ul><ol><li><p>two</p></li></ol><blockquote><p>quote</p></blockquote><hr>',
        '<p><span style="color: #ff0000; font-size: 18px; font-family: Lora">styled</span> <a href="https://example.com">link</a> <a>no href</a></p>',
        '#set page(width: 1pt) $x$ *y* [z] \\ // (A)[BAR:42]',
    ].join('')
    return resume
}

describe('Typst templates', () => {
    for (const { key } of TemplateService.getAllTemplates()) {
        it(`compiles ${key} with the default resume`, async () => {
            const { result, diagnostics } = await compilePdf(ResumeDataV2.createDefault(), TemplateService.createTemplateInstance(key))
            expect(diagnostics ?? []).toEqual([])
            expect(new TextDecoder().decode(result.slice(0, 5))).toBe('%PDF-')
        })

        it(`compiles ${key} with every rich text feature and an avatar`, async () => {
            const { result, diagnostics } = await compilePdf(richResume(), TemplateService.createTemplateInstance(key))
            expect(diagnostics ?? []).toEqual([])
            expect(result.length).toBeGreaterThan(0)
        })
    }

    it('compiles with the sidebar on the left and with no sidebar', async () => {
        for (const sidebarWidth of [280, 0]) {
            const style = TemplateService.createTemplateInstance('TwoColumnsBlue')
            style.spacing.sidebarLeft = true
            style.spacing.sidebarWidth = sidebarWidth
            const { diagnostics } = await compilePdf(ResumeDataV2.createDefault(), style)
            expect(diagnostics ?? []).toEqual([])
        }
    })

    it('compiles an empty resume', async () => {
        const { diagnostics } = await compilePdf(new ResumeDataV2({}), TemplateService.createTemplateInstance('TwoColumnsBlue'))
        expect(diagnostics ?? []).toEqual([])
    })
})
