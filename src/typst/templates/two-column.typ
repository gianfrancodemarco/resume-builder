// "2 Columns" templates (TwoColumnsBlue, TwoColumnsGreen): a full-height
// colored sidebar next to the main column. Both columns flow across pages.
#import "lib.typ": rich, rich-style, avatar, joined

#let render(d) = {
  let colors = d.colors.pairs().map(((k, v)) => (k, rgb(v))).to-dict()
  let s = d.sizes
  let base = s.base * 1pt
  let section-gap = s.section * 1pt
  let content-gap = s.content * 1pt
  let sidebar-width = s.sidebar * 1pt
  let has-sidebar = sidebar-width > 0pt

  set document(title: d.title, author: d.personal.name)
  set page(
    paper: "a4",
    margin: (top: 21pt, bottom: 36pt, x: 0pt),
    fill: colors.background,
    // Painted on every page so the sidebar always spans the full height
    background: if has-sidebar {
      place(if d.sidebarLeft { left } else { right },
        rect(width: sidebar-width, height: 100%, fill: colors.sidebarBackground))
    },
  )
  set text(font: d.fonts.body, size: base, fill: colors.text)
  set par(leading: 0.7em, spacing: 0.7em)

  let heading-text(body, ..args) = text(font: d.fonts.heading, weight: "bold", ..args, body)

  // ---- Sidebar ----
  let sidebar = block(width: 100%, inset: (x: 21pt, top: 9pt), {
    set text(fill: colors.sidebarText)
    set par(leading: 0.6em)
    let st = rich-style(
      link: colors.link,
      bar-fill: colors.sidebarText,
      bar-track: colors.sidebarText.transparentize(80%),
      gap: 0.6em + 3pt,
    )
    for (i, section) in d.sidebar.enumerate() {
      block(
        width: 100%,
        above: if i == 0 { 0pt } else { 12pt },
        below: 6pt,
        inset: (bottom: 3pt),
        stroke: (bottom: 1.5pt + colors.sidebarText.transparentize(80%)),
        heading-text(section.title, tracking: 0.375pt),
      )
      block(width: 100%, below: 6pt, rich(section.content, st))
    }
  })

  // ---- Main column ----
  let st = rich-style(
    link: colors.primary,
    bar-fill: colors.primary,
    bar-track: colors.primary.transparentize(85%),
    gap: 0.7em,
  )
  let section-title(title) = block(below: content-gap, heading-text(
    upper(title), size: s.heading * 0.56pt, fill: colors.primary, tracking: 1.5pt))
  let item(..rows) = block(width: 100%, below: content-gap,
    stack(spacing: content-gap * 0.5, ..rows.pos().filter(r => r != none)))

  let main = block(width: 100%, inset: (x: 36pt), {
    block(width: 100%, below: content-gap + 4pt, grid(
      columns: if d.image != none { (1fr, auto) } else { (1fr,) },
      column-gutter: 12pt,
      align: horizon,
      {
        heading-text(d.personal.name, size: s.heading * 1pt, fill: colors.primary, tracking: 0.375pt)
        if d.personal.title != "" {
          v(8pt, weak: true)
          heading-text(upper(d.personal.title), size: base, fill: colors.subtitle, tracking: 1.5pt)
        }
      },
      ..if d.image != none { (avatar(d.image),) },
    ))

    for section in d.main {
      block(width: 100%, below: section-gap, {
        section-title(section.title)
        if section.type == "experiences" {
          for e in section.items {
            item(
              text(weight: "bold", joined(" - ", e.title, e.company)),
              if e.period != "" { text(fill: colors.dates, e.period) },
              if e.description.len() > 0 { block(width: 100%, rich(e.description, st)) },
            )
          }
        } else if section.type == "education" {
          for e in section.items {
            item(
              text(weight: "bold", joined(" - ", e.degree, e.school)),
              {
                let lines = ()
                if e.period != "" { lines.push(text(fill: colors.dates, e.period)) }
                if e.mark != "" { lines.push(text(e.mark)) }
                if lines.len() > 0 { stack(spacing: 0.7em, ..lines) }
              },
              if e.thesis.len() > 0 { block(width: 100%, rich(e.thesis, st)) },
            )
          }
        } else {
          block(width: 100%, rich(section.content, st))
        }
      })
    }
  })

  if has-sidebar {
    grid(
      columns: if d.sidebarLeft { (sidebar-width, 1fr) } else { (1fr, sidebar-width) },
      ..if d.sidebarLeft { (sidebar, main) } else { (main, sidebar) },
    )
  } else {
    main
  }
}
