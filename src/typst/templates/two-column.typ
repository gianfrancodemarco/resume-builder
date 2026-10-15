// "Sidebar" layout: a full-height colored sidebar next to the main column.
// Both columns flow across pages.
#import "lib.typ": look, section-body, avatar, page-footer

#let render(d) = {
  let colors = d.colors.pairs().map(((k, v)) => (k, rgb(v))).to-dict()
  let s = d.sizes
  let base = s.base * 1pt
  let section-gap = s.section * 1pt
  let content-gap = s.content * 1pt
  let sidebar-width = s.sidebar * 1pt
  let main-inset = 34pt
  let side-inset = 22pt

  set document(title: d.title, author: d.personal.name)
  set page(
    paper: "a4",
    margin: (top: 30pt, bottom: 42pt, x: 0pt),
    fill: colors.background,
    // Painted on every page so the sidebar always spans the full height
    background: place(if d.sidebarLeft { left } else { right },
      rect(width: sidebar-width, height: 100%, fill: colors.sidebarBackground)),
    // Page numbers under the main column, clear of the sidebar
    footer: pad(
      left: main-inset + if d.sidebarLeft { sidebar-width } else { 0pt },
      right: main-inset + if d.sidebarLeft { 0pt } else { sidebar-width },
      page-footer(d.personal.name, colors.dates),
    ),
  )
  set text(font: d.fonts.body, size: base, fill: colors.text)
  set par(leading: 0.5em, spacing: 0.65em)

  let heading-text(body, ..args) = text(font: d.fonts.heading, weight: "bold", ..args, body)

  // ---- Sidebar ----
  let sidebar = block(width: 100%, inset: (x: side-inset, top: 6pt), {
    set text(fill: colors.sidebarText, size: 0.94em)
    set par(leading: 0.45em)
    let lk = look(
      link: colors.sidebarText,
      muted: colors.sidebarText.transparentize(30%),
      accent: colors.sidebarText.transparentize(12%),
      rating-fill: colors.sidebarText,
      rating-track: colors.sidebarText.transparentize(70%),
      gap: 0.55em,
      item-gap: 7pt,
      dates: "below",
      wide: false,
    )
    for (i, section) in d.sidebar.enumerate() {
      block(width: 100%, sticky: true, above: if i == 0 { 0pt } else { section-gap * 0.85 }, below: 8pt, {
        heading-text(upper(section.title), size: 0.86em, tracking: 1.2pt)
        v(5pt, weak: true)
        line(length: 100%, stroke: 0.8pt + colors.sidebarText.transparentize(65%))
      })
      section-body(section, lk)
    }
  })

  // ---- Main column ----
  let lk = look(
    link: colors.primary,
    muted: colors.dates,
    accent: colors.primary,
    rating-fill: colors.primary,
    rating-track: colors.primary.transparentize(78%),
    gap: 0.65em,
    item-gap: content-gap * 1.4,
  )
  let main = block(width: 100%, inset: (x: main-inset), {
    block(width: 100%, below: section-gap, grid(
      columns: if d.image != none { (1fr, auto) } else { (1fr,) },
      column-gutter: 16pt,
      align: horizon,
      {
        heading-text(d.personal.name, size: s.heading * 1.15pt, fill: colors.primary)
        if d.personal.title != "" {
          v(8pt, weak: true)
          text(size: base * 1.02, fill: colors.subtitle, tracking: 1.4pt, upper(d.personal.title))
        }
      },
      ..if d.image != none { (avatar(d.image, size: 76pt),) },
    ))

    for section in d.main {
      block(width: 100%, sticky: true, below: content-gap, {
        heading-text(upper(section.title), size: s.heading * 0.54pt, fill: colors.primary, tracking: 1.5pt)
        v(5pt, weak: true)
        line(length: 100%, stroke: 0.8pt + colors.primary.transparentize(70%))
      })
      block(width: 100%, below: section-gap, section-body(section, lk))
    }
  })

  grid(
    columns: if d.sidebarLeft { (sidebar-width, 1fr) } else { (1fr, sidebar-width) },
    ..if d.sidebarLeft { (sidebar, main) } else { (main, sidebar) },
  )
}
