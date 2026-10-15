// Downloads the static TTF fonts used by the Typst renderer into public/fonts.
// Typst cannot use woff/woff2 nor system fonts in the browser, so every family
// offered in the UI must be shipped as TTF. Run with: node scripts/fetch-fonts.mjs
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { FONT_FAMILIES } from '../src/typst/fonts.js'

const OUT_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'public', 'fonts')
const API = 'https://gwfh.mranftl.com/api/fonts'

async function getMeta(id, subsets) {
    const res = await fetch(`${API}/${id}${subsets ? `?subsets=${subsets.join(',')}` : ''}`)
    if (!res.ok) throw new Error(`Font ${id} not found (${res.status})`)
    return res.json()
}

for (const family of FONT_FAMILIES) {
    // Ask for every script the family offers (Cyrillic, Greek, Vietnamese…);
    // by default the files are subset to Latin only
    const { subsets } = await getMeta(family.id)
    const meta = await getMeta(family.id, subsets)
    const dir = path.join(OUT_DIR, family.id)
    await fs.mkdir(dir, { recursive: true })

    for (const variant of family.variants) {
        const entry = meta.variants.find(v => v.id === variant)
        if (!entry?.ttf) throw new Error(`Font ${family.id} has no ${variant} variant`)
        const ttf = await fetch(entry.ttf)
        if (!ttf.ok) throw new Error(`Download failed for ${entry.ttf}`)
        await fs.writeFile(path.join(dir, `${variant}.ttf`), Buffer.from(await ttf.arrayBuffer()))
        console.log(`${family.name} ${variant}`)
    }
}
