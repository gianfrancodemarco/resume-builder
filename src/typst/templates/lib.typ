// Shared helpers for the resume templates. Sections arrive in the generic
// shapes built by src/typst/document.js (see the kinds documented there).

// How rich text and section bodies look; templates override fields per column.
#let look(
  link: auto,           // link color, auto inherits the text color
  muted: luma(50%),     // dates, locations, secondary text
  bar-fill: black,      // filled part of language bars
  bar-track: luma(85%), // empty part of language bars
  gap: 0.65em,          // space between paragraphs, normally the line spacing
  item-gap: 9pt,        // space between items of a section
  strong-font: auto,    // font of item titles, auto inherits
) = (link: link, muted: muted, bar-fill: bar-fill, bar-track: bar-track, gap: gap, item-gap: item-gap, strong-font: strong-font)

#let strong-text(lk, body) = {
  let body = text(weight: "bold", body)
  if lk.strong-font == auto { body } else { text(font: lk.strong-font, body) }
}

#let maybe-link(href, body) = if href == "" { body } else { link(href, body) }

// "a sep b", skipping empty parts; none when all parts are empty
#let joined(sep, ..parts) = parts.pos().filter(p => p != "" and p != none).join(sep)

// Renders the Markdown node tree produced by src/typst/markdown.js. Strings
// are plain text; dictionaries are elements keyed by `t`.
#let rich(nodes, lk) = {
  for node in nodes {
    if type(node) == str {
      node
    } else if node.t == "br" {
      linebreak()
    } else if node.t == "hr" {
      block(above: lk.gap + 4pt, below: lk.gap + 4pt, line(length: 100%, stroke: 0.5pt))
    } else if node.t == "p" {
      block(width: 100%, above: lk.gap, below: lk.gap, rich(node.c, lk))
    } else if node.t == "h" {
      let size = (1.5em, 1.3em, 1.15em, 1em, 1em, 1em).at(node.level - 1)
      block(width: 100%, above: lk.gap + 4pt, below: lk.gap + 2pt, text(size: size, weight: "bold", rich(node.c, lk)))
    } else if node.t == "strong" {
      text(weight: "bold", rich(node.c, lk))
    } else if node.t == "em" {
      text(style: "italic", rich(node.c, lk))
    } else if node.t == "s" {
      strike(rich(node.c, lk))
    } else if node.t == "code" {
      // No monospace font is bundled: mark code with a light background instead
      context box(fill: text.fill.transparentize(88%), inset: (x: 2pt), outset: (y: 2.5pt), radius: 2pt,
        rich(node.c, lk))
    } else if node.t == "a" {
      let body = underline(rich(node.c, lk))
      maybe-link(node.href, if lk.link == auto { body } else { text(fill: lk.link, body) })
    } else if node.t == "ul" or node.t == "ol" {
      let items = node.items.map(item => rich(item, lk))
      let body = if node.t == "ul" { list(tight: true, ..items) } else { enum(tight: true, ..items) }
      block(width: 100%, above: lk.gap, below: lk.gap, body)
    } else if node.t == "quote" {
      block(width: 100%, above: lk.gap + 2pt, below: lk.gap + 2pt, inset: (left: 8pt),
        stroke: (left: 1.5pt + luma(60%)), rich(node.c, lk))
    }
  }
}

// Bullet list of highlights, each a Markdown node tree
#let highlights(items, lk) = if items.len() > 0 {
  block(width: 100%, above: lk.gap, below: lk.gap, list(tight: true, ..items.map(h => {
    // A single paragraph renders inline so the bullets stay tight
    if h.len() == 1 and type(h.at(0)) == dictionary and h.at(0).t == "p" { rich(h.at(0).c, lk) } else { rich(h, lk) }
  })))
}

#let proficiency-bar(level, lk) = layout(size => box(
  width: calc.min(size.width, 187.5pt),
  height: 6pt,
  radius: 3pt,
  clip: true,
  fill: lk.bar-track,
  stroke: 0.75pt + lk.bar-fill,
  place(top + left, box(width: level * 1%, height: 100%, fill: lk.bar-fill)),
))

// A job, degree, project, award…: title line, date/location line, then content
#let entry(e, lk) = block(width: 100%, below: lk.item-gap, {
  let title = joined(" - ", e.title, e.subtitle)
  if title != none { block(below: 0.45em, maybe-link(e.href, strong-text(lk, title))) }
  let meta = joined(" · ", e.date, e.location)
  if meta != none { block(below: 0.45em, text(fill: lk.muted, meta)) }
  for detail in e.details { block(below: 0.45em, detail) }
  rich(e.summary, lk)
  highlights(e.highlights, lk)
  if e.keywords.len() > 0 { block(above: lk.gap, text(fill: lk.muted, e.keywords.join(" · "))) }
})

// Renders a section's content by kind; templates can pass their own `entry`
#let section-body(section, lk, entry: entry) = {
  if section.kind == "text" {
    rich(section.content, lk)
  } else if section.kind == "contact" {
    for item in section.items { block(below: lk.gap, maybe-link(item.href, item.text)) }
  } else if section.kind == "links" {
    for item in section.items {
      let body = underline(item.text)
      let body = if lk.link == auto { body } else { text(fill: lk.link, body) }
      block(below: lk.gap, {
        if item.label != "" { item.label + ": " }
        maybe-link(item.href, body)
      })
    }
  } else if section.kind == "tags" {
    for item in section.items {
      block(below: lk.gap + 2pt, {
        strong-text(lk, item.name)
        if item.level != "" { text(fill: lk.muted, " · " + item.level) }
        if item.keywords.len() > 0 { linebreak(); item.keywords.join(", ") }
      })
    }
  } else if section.kind == "languages" {
    for item in section.items {
      block(width: 100%, below: lk.gap + 3pt, {
        block(below: 3pt, {
          item.name
          if item.fluency != "" { text(fill: lk.muted, " · " + item.fluency) }
        })
        if item.level != none { proficiency-bar(item.level, lk) }
      })
    }
  } else if section.kind == "entries" {
    for e in section.items { entry(e, lk) }
  }
}

// Circular profile photo. x/y/scale follow the editor's CSS background
// semantics: scale is the image width in % of the frame, x/y position it.
#let avatar(img, size: 72pt) = context {
  let natural = measure(image(img.path))
  let w = size * img.scale / 100
  let h = w * (natural.height / natural.width)
  box(width: size, height: size, radius: size / 2, clip: true, fill: luma(93%),
    place(top + left, dx: (size - w) * img.x / 100, dy: (size - h) * img.y / 100,
      image(img.path, width: w)))
}
