// Entry point. /data.json is written by src/typst/TypstService.js from the
// output of buildDocument() in src/typst/document.js.
#import "two-column.typ"
#import "one-column-modern.typ"
#import "minimal.typ"
#import "banner.typ"
#import "timeline.typ"

#let data = json("/data.json")

#if data.template == "one-column-modern" {
  one-column-modern.render(data)
} else if data.template == "minimal" {
  minimal.render(data)
} else if data.template == "banner" {
  banner.render(data)
} else if data.template == "timeline" {
  timeline.render(data)
} else {
  two-column.render(data)
}
