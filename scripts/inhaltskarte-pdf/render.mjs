// Renders the content map (docs/inhaltskarte/README.md) to a print-ready HTML file next to the sketches.
// Usage: node render.mjs <map dir> <output html>
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { marked } from "marked";

const [mapDir, outFile] = process.argv.slice(2);
const markdown = readFileSync(join(mapDir, "README.md"), "utf8");

// GitHub-style heading IDs, so the map's internal links work in the PDF
const slug = (html) =>
  html.replace(/<[^>]+>/g, "").toLowerCase().replace(/[^\p{L}\p{N} -]/gu, "").trim().replace(/ /g, "-");
const renderer = new marked.Renderer();
// Each sketch section, such as "Startseite (S)", starts on a new page
renderer.heading = (text, level) => {
  const cls = level === 2 && /\([A-Z]\)$/.test(text) ? ' class="sketch"' : "";
  return `<h${level} id="${slug(text)}"${cls}>${text}</h${level}>\n`;
};
// Links to files outside the map don't work in a PDF, so show their text only
renderer.link = (href, title, text) => (href.startsWith("#") ? `<a href="${href}">${text}</a>` : text);

const body = marked.parse(markdown, { renderer, gfm: true });
const date = new Date().toLocaleDateString("de-AT", { day: "numeric", month: "long", year: "numeric" });

const css = `
@page { size: A4; margin: 14mm 14mm 16mm; }
html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
body { font: 10pt/1.45 -apple-system, "Segoe UI", Helvetica, Arial, sans-serif; color: #1f2328; background: #fff; margin: 0; }
h1 { font-size: 22pt; margin: 0 0 4pt; }
h2 { font-size: 15pt; margin: 16pt 0 8pt; break-after: avoid; }
h2.sketch { break-before: page; margin-top: 0; }
h1 + p, .stand { color: #57606a; }
img { display: block; max-width: 100%; max-height: 140mm; margin: 6pt auto 10pt; border: 0.5pt solid #d0d7de; border-radius: 4pt; break-inside: avoid; }
table { width: 100%; border-collapse: collapse; margin: 6pt 0 10pt; font-size: 8.5pt; }
thead { display: table-header-group; }
tr { break-inside: avoid; }
th, td { border: 0.5pt solid #d0d7de; padding: 3pt 5pt; vertical-align: top; text-align: left; }
th { background: #f6f8fa; }
td:first-child { font-weight: 600; white-space: nowrap; }
code { font: 8pt/1.3 Menlo, Consolas, monospace; background: #eff1f3; padding: 0 2pt; border-radius: 2pt; overflow-wrap: anywhere; }
pre { background: #f6f8fa; padding: 6pt 8pt; border-radius: 4pt; break-inside: avoid; }
pre code { background: none; padding: 0; }
a { color: #0969da; text-decoration: none; }
ul { padding-left: 14pt; }
hr { border: 0; border-top: 0.5pt solid #d0d7de; margin: 12pt 0; }
`;

writeFileSync(
  outFile,
  `<!doctype html><html lang="de"><head><meta charset="utf-8"><title>Inhaltskarte</title><style>${css}</style></head>
<body>${body.replace("</h1>", `</h1>\n<p class="stand">Stand: ${date}</p>`)}</body></html>\n`,
);
