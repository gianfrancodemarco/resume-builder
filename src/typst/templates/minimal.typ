// "Minimal" layout: centered header, one column, plain structure that
// applicant tracking systems read well. Contact details sit in the header.
#import "lib.typ": look, section-body, contact-line, page-footer

#let render(d) = {
  let colors = d.colors.pairs().map(((k, v)) => (k, rgb(v))).to-dict()
  let s = d.sizes
  let base = s.base * 1pt
  let section-gap = s.section * 1pt
  let content-gap = s.content * 1pt

  set document(title: d.title, author: d.personal.name)
  set page(
    paper: "a4",
    margin: (x: 52pt, top: 44pt, bottom: 46pt),
    fill: colors.background,
    footer: page-footer(d.personal.name, colors.dates, alignment: center),
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

  // Header
  align(center, block(below: section-gap, {
    heading-text(d.personal.name, size: s.heading * 1.25pt, fill: colors.primary)
    if d.personal.title != "" {
      v(7pt, weak: true)
      text(size: base * 1.12, fill: colors.subtitle, d.personal.title)
    }
    let contact = contact-line(d.header, link-fill: colors.link)
    if contact != none {
      v(9pt, weak: true)
      text(size: 0.9em, fill: colors.dates, contact)
    }
  }))

  for section in d.main {
    block(width: 100%, sticky: true, below: content-gap, {
      heading-text(upper(section.title), size: base * 1.02, fill: colors.primary, tracking: 1.6pt)
      v(4pt, weak: true)
      line(length: 100%, stroke: 0.7pt + colors.primary)
    })
    block(width: 100%, below: section-gap, section-body(section, lk))
  }
}
