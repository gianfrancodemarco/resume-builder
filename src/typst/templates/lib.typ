// Shared helpers for the resume templates.

// Default look of rich text; templates override fields with `rich-style(...)`.
#let rich-style(
  link: auto,          // link color, auto inherits the text color
  bar-fill: black,     // filled part of language proficiency bars
  bar-track: luma(85%),// empty part of language proficiency bars
  gap: 0.65em,         // space between paragraphs, normally the line spacing
) = (link: link, bar-fill: bar-fill, bar-track: bar-track, gap: gap)

#let proficiency-bar(label, value, st) = block(width: 100%, above: st.gap, below: st.gap + 2pt, {
  block(below: 3pt, text(label))
  layout(size => box(
    width: calc.min(size.width, 187.5pt),
    height: 6pt,
    radius: 3pt,
    clip: true,
    fill: st.bar-track,
    stroke: 0.75pt + st.bar-fill,
    place(top + left, box(width: value * 1%, height: 100%, fill: st.bar-fill)),
  ))
})

#let aligned(align-name, body) = {
  if align-name == "center" { align(center, body) }
  else if align-name == "right" { align(right, body) }
  else if align-name == "justify" { par(justify: true, body) }
  else { body }
}

// Renders the node tree produced by src/typst/richtext.js. Strings are plain
// text; dictionaries are elements keyed by `t`.
#let rich(nodes, st) = {
  for node in nodes {
    if type(node) == str {
      node
    } else if node.t == "br" {
      linebreak()
    } else if node.t == "hr" {
      block(above: st.gap + 4pt, below: st.gap + 4pt, line(length: 100%, stroke: 0.5pt))
    } else if node.t == "p" or node.t == "div" {
      // An empty paragraph is an intentional blank line
      let body = if node.c.len() == 0 { sym.space.nobreak } else { rich(node.c, st) }
      block(width: 100%, above: st.gap, below: st.gap, aligned(node.at("align", default: none), body))
    } else if node.t == "h" {
      let scale = (1.5em, 1.3em, 1.15em, 1em, 1em, 1em).at(node.level - 1)
      block(width: 100%, above: st.gap + 4pt, below: st.gap + 2pt,
        aligned(node.at("align", default: none), text(size: scale, weight: "bold", rich(node.c, st))))
    } else if node.t == "strong" {
      text(weight: "bold", rich(node.c, st))
    } else if node.t == "em" {
      text(style: "italic", rich(node.c, st))
    } else if node.t == "u" {
      underline(rich(node.c, st))
    } else if node.t == "s" {
      strike(rich(node.c, st))
    } else if node.t == "code" {
      text(font: "Cousine", size: 0.9em, rich(node.c, st))
    } else if node.t == "a" {
      let body = underline(rich(node.c, st))
      let body = if st.link == auto { body } else { text(fill: st.link, body) }
      if node.href == "" { body } else { link(node.href, body) }
    } else if node.t == "span" {
      let args = (:)
      if "color" in node and node.color != none { args.fill = rgb(node.color) }
      if "size" in node { args.size = node.size * 1pt }
      if "scale" in node { args.size = node.scale * 1em }
      if "font" in node { args.font = node.font }
      text(..args, rich(node.c, st))
    } else if node.t == "ul" or node.t == "ol" {
      let items = node.items.map(item => rich(item, st))
      let body = if node.t == "ul" { list(tight: true, ..items) } else { enum(tight: true, ..items) }
      block(width: 100%, above: st.gap, below: st.gap, body)
    } else if node.t == "quote" {
      block(width: 100%, above: st.gap + 2pt, below: st.gap + 2pt, inset: (left: 8pt),
        stroke: (left: 1.5pt + luma(60%)), rich(node.c, st))
    } else if node.t == "bar" {
      proficiency-bar(node.label, node.value, st)
    }
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

// "a sep b", skipping empty parts
#let joined(sep, ..parts) = parts.pos().filter(p => p != "").join(sep)
