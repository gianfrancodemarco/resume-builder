// "Timeline" layout: dates in a narrow left column, entries along a vertical
// line in the accent color. Contact details sit in the header.
#import "lib.typ": look, section-body, entry-header, entry-content, contact-line, page-footer

#let render(d) = {
  let colors = d.colors.pairs().map(((k, v)) => (k, rgb(v))).to-dict()
  let s = d.sizes
  let base = s.base * 1pt
  let section-gap = s.section * 1pt
  let content-gap = s.content * 1pt
  let date-column = 74pt
  let rail = 1.2pt + colors.primary.transparentize(55%)
  let indent = 14pt

  set document(title: d.title, author: d.personal.name)
  set page(
    paper: "a4",
    margin: (x: 44pt, top: 40pt, bottom: 46pt),
    fill: colors.background,
    footer: page-footer(d.personal.name, colors.dates),
  )
  set text(font: d.fonts.body, size: base, fill: colors.text)
  set par(leading: 0.5em, spacing: 0.65em)

  let heading-text(body, ..args) = text(font: d.fonts.heading, weight: "bold", ..args, body)
  let lk = look(
    link: colors.link,
    muted: colors.dates,
    accent: colors.primary,
    rating-fill: colors.primary,
    rating-track: colors.primary.transparentize(78%),
    gap: 0.65em,
    item-gap: content-gap,
    dates: "none",
  )

  // Header: name and title on the left, contact details on the right
  block(width: 100%, below: section-gap, {
    grid(
      columns: (1fr, auto),
      column-gutter: 20pt,
      align: bottom,
      {
        heading-text(d.personal.name, size: s.heading * 1.15pt, fill: colors.primary)
        if d.personal.title != "" {
          v(7pt, weak: true)
          text(size: base * 1.1, fill: colors.subtitle, d.personal.title)
        }
      },
      {
        let contact = contact-line(d.header, link-fill: colors.link, sep: linebreak())
        if contact != none { align(right, text(size: 0.86em, fill: colors.dates, contact)) }
      },
    )
    v(12pt, weak: true)
    line(length: 100%, stroke: 1.2pt + colors.primary)
  })

  // Content shifted to the right of the date column
  let right-column(body) = grid(columns: (date-column, 1fr), [], pad(left: indent, body))

  for section in d.main {
    block(width: 100%, sticky: true, below: content-gap,
      heading-text(upper(section.title), size: base * 1.02, fill: colors.primary, tracking: 1.5pt))

    if section.kind == "entries" {
      for e in section.items {
        grid(
          columns: (date-column, 1fr),
          // "Jan 2018 –" over "Feb 2020", rather than wrapping inside a date
          align(right, pad(right: indent, top: 1pt, text(size: 0.85em, fill: colors.dates,
            e.date.split(" – ").join([ –#linebreak()])))),
          block(width: 100%, stroke: (left: rail), inset: (left: indent, bottom: content-gap * 1.3), {
            // Dot on the line, level with the entry title
            place(dx: -indent - 3.6pt, dy: 0.25em, circle(radius: 3pt, fill: colors.primary))
            entry-header(e, lk)
            entry-content(e, lk)
          }),
        )
      }
      v(section-gap - content-gap * 1.3, weak: true)
    } else {
      block(width: 100%, below: section-gap, right-column(section-body(section, lk)))
    }
  }
}
