// "Banner" layout: a full-width band in the accent color with name, title,
// contact details and photo, then one column.
#import "lib.typ": look, section-body, avatar, contact-line, page-footer

#let render(d) = {
  let colors = d.colors.pairs().map(((k, v)) => (k, rgb(v))).to-dict()
  let s = d.sizes
  let base = s.base * 1pt
  let section-gap = s.section * 1pt
  let content-gap = s.content * 1pt
  let margin-x = 44pt
  let margin-top = 38pt

  set document(title: d.title, author: d.personal.name)
  set page(
    paper: "a4",
    margin: (x: margin-x, top: margin-top, bottom: 46pt),
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
  )

  // Band across the top of the first page (the negative padding cancels the margins)
  pad(x: -margin-x, top: -margin-top, block(
    width: 100%,
    fill: colors.sidebarBackground,
    inset: (x: margin-x, top: 34pt, bottom: 26pt),
    below: section-gap,
    {
      set text(fill: colors.sidebarText)
      grid(
        columns: if d.image != none { (1fr, auto) } else { (1fr,) },
        column-gutter: 20pt,
        align: horizon,
        {
          heading-text(d.personal.name, size: s.heading * 1.2pt)
          if d.personal.title != "" {
            v(7pt, weak: true)
            text(size: base * 1.1, fill: colors.sidebarText.transparentize(15%), d.personal.title)
          }
          let contact = contact-line(d.header)
          if contact != none {
            v(12pt, weak: true)
            text(size: 0.88em, fill: colors.sidebarText.transparentize(10%), contact)
          }
        },
        ..if d.image != none { (avatar(d.image, size: 78pt),) },
      )
    },
  ))

  for section in d.main {
    block(width: 100%, sticky: true, below: content-gap, {
      box(width: 16pt, height: 3pt, fill: colors.primary, baseline: -0.32em)
      h(8pt)
      heading-text(upper(section.title), size: base * 1.02, fill: colors.primary, tracking: 1.4pt)
    })
    block(width: 100%, below: section-gap, section-body(section, lk))
  }
}
