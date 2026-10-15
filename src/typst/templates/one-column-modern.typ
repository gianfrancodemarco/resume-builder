// "Classic" layout: one column, section titles in a narrow left column.
#import "lib.typ": look, section-body, page-footer

#let render(d) = {
  let colors = d.colors.pairs().map(((k, v)) => (k, rgb(v))).to-dict()
  let s = d.sizes
  let base = s.base * 1pt
  let section-gap = s.section * 1pt
  let content-gap = s.content * 1pt
  let rule = 0.6pt + colors.text.transparentize(78%)

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
    item-gap: content-gap * 1.4,
    strong-font: d.fonts.heading,
  )

  // Header: name on the left, title on the right
  block(width: 100%, below: section-gap, {
    grid(
      columns: (1fr, auto),
      column-gutter: 16pt,
      align: bottom,
      heading-text(d.personal.name, size: s.heading * 1.1pt, fill: colors.primary),
      text(font: d.fonts.heading, size: s.heading * 0.62pt, fill: colors.subtitle, d.personal.title),
    )
    v(10pt, weak: true)
    line(length: 100%, stroke: 1.2pt + colors.primary)
  })

  for (i, section) in d.main.enumerate() {
    if i > 0 {
      block(above: 0pt, below: section-gap * 0.75, line(length: 100%, stroke: rule))
    }
    block(width: 100%, below: section-gap * 0.75, grid(
      columns: (24%, 76%),
      block(sticky: true, inset: (right: 14pt),
        heading-text(upper(section.title), size: 0.9em, fill: colors.primary, tracking: 0.8pt)),
      section-body(section, lk),
    ))
  }
}
