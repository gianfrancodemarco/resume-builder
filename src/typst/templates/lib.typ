// Shared helpers for the resume templates. Sections arrive in the generic
// shapes built by src/typst/document.js (see the kinds documented there).

// How rich text and section bodies look; templates override fields per column.
#let look(
  link: auto,           // link color, auto inherits the text color
  muted: luma(50%),     // dates, locations, secondary text
  rating-fill: black,      // filled dots of language ratings
  rating-track: luma(80%), // empty dots of language ratings
  gap: 0.65em,          // space between paragraphs, a bit more than the line spacing
  item-gap: 9pt,        // space between items of a section
  strong-font: auto,    // font of item titles, auto inherits
  accent: auto,         // organization line of entries, auto inherits
  dates: "right",       // entry dates: "right" of the title, "below" it (narrow columns) or "none"
  wide: true,           // full-width column: skills on one line each, languages side by side
) = (
  link: link, muted: muted, rating-fill: rating-fill, rating-track: rating-track, gap: gap, item-gap: item-gap,
  strong-font: strong-font, accent: accent, dates: dates, wide: wide,
)

#let colored(fill, body) = if fill == auto { body } else { text(fill: fill, body) }

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

// Five dots, filled according to a 0-100 level
#let rating(level, lk) = {
  let filled = calc.round(level / 20)
  box(baseline: -0.1em, stack(dir: ltr, spacing: 2.5pt, ..range(5).map(i =>
    circle(radius: 2.6pt, fill: if i < filled { lk.rating-fill } else { lk.rating-track }, stroke: none))))
}

// The title, organization and dates of an entry. Sticky, so it is never left
// alone at the bottom of a page.
#let entry-header(e, lk) = block(width: 100%, sticky: true, below: 0.45em, {
  let org = joined(" · ", e.subtitle, e.location)
  // Entries without a title (e.g. a reference) use the organization as title
  let (title, org) = if e.title != "" { (e.title, org) } else { (org, none) }
  let title = if title == none { none } else { maybe-link(e.href, strong-text(lk, title)) }
  let date = if e.date == "" { none } else { text(fill: lk.muted, size: 0.92em, e.date) }

  if lk.dates == "right" and date != none {
    grid(columns: (1fr, auto), column-gutter: 12pt, title, date)
  } else if title != none {
    title
  }
  // Title, organization and date read as one unit: tight lines
  if org != none { block(above: 0.38em, colored(lk.accent, org)) }
  if lk.dates == "below" and date != none { block(above: 0.38em, date) }
})

// The content of an entry below its header. Its own block, so the paragraph
// spacing inside does not add to the gap under the header.
#let entry-content(e, lk) = block(width: 100%, above: 0.45em, {
  for detail in e.details { block(below: 0.3em, detail) }
  rich(e.summary, lk)
  highlights(e.highlights, lk)
  if e.keywords.len() > 0 { block(above: lk.gap, text(fill: lk.muted, e.keywords.join(" · "))) }
})

// A job, degree, project, award…
#let entry(e, lk) = block(width: 100%, below: lk.item-gap, {
  entry-header(e, lk)
  entry-content(e, lk)
})

// Renders a section's content by kind; templates can pass their own `entry`
#let section-body(section, lk, entry: entry) = {
  if section.kind == "text" {
    rich(section.content, lk)
  } else if section.kind == "contact" {
    // One per line, as tight as the lines of a paragraph
    for item in section.items { block(above: 0.4em, below: 0.4em, maybe-link(item.href, item.text)) }
  } else if section.kind == "links" {
    for item in section.items {
      let body = underline(item.text)
      let body = if lk.link == auto { body } else { text(fill: lk.link, body) }
      block(above: 0.4em, below: 0.4em, {
        if item.label != "" { item.label + ": " }
        maybe-link(item.href, body)
      })
    }
  } else if section.kind == "tags" {
    for item in section.items {
      // One line per group in wide columns, so tight like lines of text
      let gap = if lk.wide { 0.4em } else { lk.gap + 2pt }
      block(above: gap, below: gap, {
        strong-text(lk, item.name)
        if item.level != "" { text(fill: lk.muted, " · " + item.level) }
        if item.keywords.len() > 0 {
          // Wide columns keep each group on one line: "Frontend: Vue, TypeScript"
          if lk.wide { if item.name != "" { ": " } } else { linebreak() }
          item.keywords.join(", ")
        }
      })
    }
  } else if section.kind == "languages" {
    // Name with a dot rating on the same line (aligned right in narrow
    // columns, right after the name in wide ones), fluency in words below
    let language(item) = block(width: 100%, above: 0.75em, below: 0.75em, breakable: false, {
      if item.level == none {
        item.name
      } else if lk.wide {
        item.name + h(8pt) + rating(item.level, lk)
      } else {
        grid(columns: (1fr, auto), column-gutter: 8pt, align: horizon, item.name, rating(item.level, lk))
      }
      if item.fluency != "" { block(above: 0.3em, text(size: 0.88em, fill: lk.muted, item.fluency)) }
    })
    if lk.wide {
      grid(columns: (1fr, 1fr, 1fr), column-gutter: 18pt, ..section.items.map(language))
    } else {
      for item in section.items { language(item) }
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

// Contact details and profiles on one wrapping line, for layouts that show
// them in the header
#let contact-line(header, link-fill: auto, sep: "  ·  ") = {
  // Each item is a box, so lines wrap between items and never inside one
  let items = header.contact.map(c => box(maybe-link(c.href, c.text)))
  // Profiles show their address (github.com/jane) when they have one
  let profile(l) = if l.href != "" { l.href.replace(regex("^https?://(www\.)?"), "") } else { joined(": ", l.label, l.text) }
  let items = items + header.links.map(l => box(maybe-link(l.href, colored(link-fill, profile(l)))))
  if items.len() > 0 { items.join(sep) }
}

// "Jane Doe · 2/3" at the bottom of pages, only for resumes longer than one page
#let page-footer(name, fill, alignment: right) = context {
  let total = counter(page).final().first()
  if total > 1 {
    align(alignment, text(size: 0.78em, fill: fill, [#name · #counter(page).display() / #total]))
  }
}
