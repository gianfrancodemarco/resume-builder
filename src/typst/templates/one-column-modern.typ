// "1 Column Modern" template: framed page, section titles in a narrow left column.
#import "lib.typ": rich, rich-style, joined

#let render(d) = {
  let colors = d.colors.pairs().map(((k, v)) => (k, rgb(v))).to-dict()
  let s = d.sizes
  let base = s.base * 1pt
  let section-gap = s.section * 1pt
  let content-gap = s.content * 1pt
  let rule = 0.75pt + colors.text

  set document(title: d.title, author: d.personal.name)
  set page(
    paper: "a4",
    margin: 30pt,
    fill: colors.background,
    background: rect(width: 100%, height: 100%, stroke: rule),
  )
  set text(font: d.fonts.body, size: base, fill: colors.text)
  set par(leading: 0.65em, spacing: 0.65em)

  let heading-text(body, ..args) = text(font: d.fonts.heading, weight: "bold", ..args, body)
  let st = rich-style(
    link: colors.link,
    bar-fill: colors.primary,
    bar-track: colors.primary.transparentize(85%),
  )
  let small(body) = {
    set text(size: 0.9em)
    set par(leading: 0.55em)
    body
  }

  // Header: name on the left, title on the right
  block(width: 100%, inset: (bottom: content-gap), stroke: (bottom: rule), below: section-gap, grid(
    columns: (1fr, auto),
    column-gutter: 12pt,
    align: bottom,
    heading-text(d.personal.name, size: s.heading * 1pt, fill: colors.primary),
    heading-text(d.personal.title, size: s.heading * 0.75pt, fill: colors.subtitle),
  ))

  for (i, section) in d.main.enumerate() {
    let last = i == d.main.len() - 1
    block(
      width: 100%,
      inset: (bottom: if last { 0pt } else { content-gap }),
      stroke: (bottom: if last { none } else { rule }),
      below: section-gap,
      grid(
        columns: (25%, 75%),
        pad(right: 15pt, heading-text(upper(section.title), fill: colors.primary)),
        {
          if section.type == "experiences" {
            for e in section.items {
              block(width: 100%, below: content-gap, {
                block(below: 0.5em, heading-text(joined(" | ", e.title, e.period)))
                if e.company != "" { block(below: 0.8em, e.company) }
                small(rich(e.description, st))
              })
            }
          } else if section.type == "education" {
            for e in section.items {
              block(width: 100%, below: content-gap, {
                block(below: 0.5em, heading-text(joined(" | ", e.school, e.period)))
                if e.degree != "" { block(below: 0.8em, e.degree) }
                if e.mark != "" { block(below: 0.6em, small(e.mark)) }
                if e.thesis.len() > 0 { block(above: 0.6em, small(rich(e.thesis, st))) }
              })
            }
          } else {
            rich(section.content, st)
          }
        },
      ),
    )
  }
}
