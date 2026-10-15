// "2 Columns" templates (TwoColumnsBlue, TwoColumnsGreen): a full-height
// colored sidebar next to the main column. Both columns flow across pages.
#import "lib.typ": look, section-body, avatar

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
    let lk = look(
      link: colors.link,
      muted: colors.sidebarText.transparentize(30%),
      bar-fill: colors.sidebarText,
      bar-track: colors.sidebarText.transparentize(80%),
      gap: 0.6em,
      item-gap: 9pt,
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
      block(width: 100%, below: 6pt, section-body(section, lk))
    }
  })

  // ---- Main column ----
  let lk = look(
    link: colors.primary,
    muted: colors.dates,
    bar-fill: colors.primary,
    bar-track: colors.primary.transparentize(85%),
    gap: 0.7em,
    item-gap: content-gap,
  )
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
        block(below: content-gap, heading-text(
          upper(section.title), size: s.heading * 0.56pt, fill: colors.primary, tracking: 1.5pt))
        section-body(section, lk)
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
