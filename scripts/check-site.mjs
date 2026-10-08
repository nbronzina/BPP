// Chequeo del sitio generado en _site/. Se corre con `npm run check` antes de mergear:
// desde que el sitio se publica por Vercel no hay CI que lo corra solo.
//
// Qué mira, sin dependencias:
//   - cada página tiene title, description, canonical correcto, un solo h1, nav, main y footer;
//   - el JSON-LD es JSON válido y no hay ids repetidos;
//   - todo enlace, imagen, srcset y ancla interna apunta a algo que existe, y ninguna ruta es relativa;
//   - cada <img> lleva alt, width y height;
//   - el sitemap y las páginas indexables coinciden, y las fechas no están en el futuro;
//   - los assets críticos están, y avisa (sin fallar) de imágenes que nadie usa.
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const OUT = process.argv[2] || "_site";
const SITE = JSON.parse(readFileSync("src/_data/site.json", "utf8")).url; // https://www.bppanalyticsanddesign.com
const REQUIRED = ["styles.min.css", "main.min.js", "fonts/plus-jakarta-sans-latin.woff2", "fonts/literata-latin.woff2", "img/logo.svg", "img/og-image.jpg", "sitemap.xml", "robots.txt", "llms.txt", "404.html",
  "usina/index.html", "reporte-impacto/index.html"]; // las dos redirecciones viejas: hay enlaces afuera que todavía las usan

const problems = [];
const warnings = [];
const fail = (where, msg) => problems.push(`${where}: ${msg}`);

const walk = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
const files = walk(OUT).map((f) => relative(OUT, f).split("\\").join("/"));
const fileSet = new Set(files);
const urlOf = (f) => "/" + f.replace(/(^|\/)index\.html$/, "$1");           // index.html → "/", proyectos/index.html → "/proyectos/"
const pages = new Map(files.filter((f) => f.endsWith(".html")).map((f) => [urlOf(f), readFileSync(join(OUT, f), "utf8")]));
const isRedirect = (s) => /http-equiv="refresh"/.test(s);
const isNoindex = (s) => /<meta name="robots" content="[^"]*noindex/.test(s);
const idsOf = (s) => [...s.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);

// Resuelve una URL interna ("/img/x.webp?v=2", "/proyectos/#casos") a archivo + ancla.
function resolve(ref) {
  const [pathAndQuery, hash = ""] = ref.split("#");
  let path = decodeURI(pathAndQuery.split("?")[0]).replace(/^\//, "");
  if (path === "" || path.endsWith("/")) path += "index.html";
  return { file: path, hash };
}
function checkInternal(where, ref, { anchor = true } = {}) {
  const { file, hash } = resolve(ref);
  if (!fileSet.has(file)) return fail(where, `apunta a algo que no existe: ${ref}`);
  if (anchor && hash && file.endsWith(".html")) {
    const target = pages.get(urlOf(file));
    if (target && !idsOf(target).includes(hash)) fail(where, `el ancla no existe en la página de destino: ${ref}`);
  }
}

let links = 0, images = 0;
for (const [url, html] of pages) {
  const where = url;
  if (isRedirect(html)) {
    const m = html.match(/http-equiv="refresh" content="0; url=([^"]+)"/);
    if (!m) fail(where, "redirección sin destino");
    else checkInternal(where, m[1]);
    continue;
  }
  // estructura mínima
  for (const [name, re] of [["<title>", /<title>[^<]+<\/title>/], ["description", /<meta name="description" content="[^"]+">/], ["lang", /<html lang="[A-Za-z-]+">/], ["nav", /<nav /], ["main", /id="main-content"/], ["footer", /<footer/]]) {
    if (!re.test(html)) fail(where, `sin ${name}`);
  }
  const canonical = (html.match(/<link rel="canonical" href="([^"]+)">/) || [])[1];
  if (canonical !== SITE + url) fail(where, `canonical ${canonical || "ausente"}; debería ser ${SITE + url}`);
  const h1 = (html.match(/<h1[\s>]/g) || []).length;
  if (h1 !== 1) fail(where, `${h1} elementos <h1> (tiene que haber uno)`);
  if (/"\.\.\//.test(html)) fail(where, "rutas relativas ../ residuales");
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(m[1]); } catch { fail(where, "JSON-LD inválido"); }
  }
  const ids = idsOf(html);
  const dup = [...new Set(ids.filter((id, i) => ids.indexOf(id) !== i))];
  if (dup.length) fail(where, `ids repetidos: ${dup.join(", ")}`);

  // imágenes: alt, width, height
  for (const m of html.matchAll(/<img\b[^>]*>/g)) {
    images++;
    const tag = m[0];
    const src = (tag.match(/\ssrc="([^"]+)"/) || [])[1] || "(sin src)";
    for (const attr of ["alt", "width", "height"]) if (!new RegExp(`\\s${attr}="`).test(tag)) fail(where, `<img src="${src}"> sin ${attr}`);
  }

  // referencias internas: href, src, srcset, y las URL absolutas al propio sitio (canonical, og:image, JSON-LD…).
  // Lo que está dentro de un comentario HTML no se publica como enlace: no se mira.
  const live = html.replace(/<!--[\s\S]*?-->/g, "");
  const refs = new Set();
  for (const m of live.matchAll(/\s(?:href|src)="([^"]+)"/g)) refs.add(m[1]);
  for (const m of live.matchAll(/\ssrcset="([^"]+)"/g)) for (const c of m[1].split(",")) refs.add(c.trim().split(/\s+/)[0]);
  // (se corta en & para no tragarse el resto de un enlace de compartir que lleva la URL como parámetro)
  for (const m of live.matchAll(new RegExp(SITE.replace(/[.]/g, "\\.") + '(/[^"\\s<>&]*)', "g"))) refs.add(m[1]);
  // Un "@id" de JSON-LD con # nombra un nodo del grafo, no un ancla: se le pide la página, no el id.
  const nodeIds = new Set([...html.matchAll(/"@id":\s*"([^"]+)"/g)].map((m) => m[1].replace(SITE, "")));
  for (const ref of refs) {
    // Regla del repo: rutas siempre absolutas desde la raíz. Una relativa se rompe al mover la página.
    if (!/^(\/|#|https?:|mailto:|tel:|data:)/.test(ref)) { fail(where, `ruta relativa: ${ref} (usar /…)`); continue; }
    if (ref.startsWith("#")) { if (ref.length > 1 && !ids.includes(ref.slice(1))) fail(where, `ancla sin destino en la misma página: ${ref}`); links++; continue; }
    if (ref.startsWith("/") && !ref.startsWith("//")) { checkInternal(where, ref, { anchor: !nodeIds.has(ref) }); links++; }
  }
}

// sitemap ↔ páginas indexables
const sitemap = existsSync(join(OUT, "sitemap.xml")) ? readFileSync(join(OUT, "sitemap.xml"), "utf8") : "";
// "Hoy" es la fecha más adelantada que hay ahora en algún huso (UTC+14): un lastmod puesto pasada
// la medianoche de Madrid no es futuro aunque el reloj del servidor todavía marque el día anterior.
const today = new Date(Date.now() + 14 * 3600e3).toISOString().slice(0, 10);
const inSitemap = new Set();
for (const m of sitemap.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
  const loc = (m[1].match(/<loc>([^<]+)<\/loc>/) || [])[1] || "";
  const lastmod = (m[1].match(/<lastmod>([^<]+)<\/lastmod>/) || [])[1];
  const url = loc.replace(SITE, "");
  inSitemap.add(url);
  const page = pages.get(url);
  if (!page) fail("sitemap.xml", `lista una página que no existe: ${loc}`);
  else if (isRedirect(page) || isNoindex(page)) fail("sitemap.xml", `lista una página que no se indexa: ${loc}`);
  if (!lastmod || !/^\d{4}-\d{2}-\d{2}$/.test(lastmod)) fail("sitemap.xml", `${url}: lastmod ausente o con formato raro (${lastmod})`);
  else if (lastmod > today) fail("sitemap.xml", `${url}: lastmod en el futuro (${lastmod})`);
}
for (const [url, html] of pages) {
  if (!isRedirect(html) && !isNoindex(html) && !inSitemap.has(url)) fail("sitemap.xml", `falta la página ${url} (agregar \`sitemap:\` a su front matter)`);
}
for (const m of sitemap.matchAll(/<image:loc>([^<]+)<\/image:loc>/g)) checkInternal("sitemap.xml", m[1].replace(SITE, ""));

// assets críticos y huérfanos
for (const a of REQUIRED) if (!fileSet.has(a)) fail("_site", `falta ${a}`);
const everything = [...pages.values()].join("\n") + sitemap + (fileSet.has("styles.min.css") ? readFileSync(join(OUT, "styles.min.css"), "utf8") : "");
for (const f of files.filter((f) => f.startsWith("img/") || f.startsWith("fonts/"))) {
  if (!everything.includes(f.split("/").pop())) warnings.push(`nadie referencia ${f}`);
}

for (const w of warnings) console.warn(`aviso: ${w}`);
if (problems.length) {
  for (const p of problems) console.error(p);
  console.error(`check-site: ${problems.length} problema(s)`);
  process.exit(1);
}
console.log(`check-site: ${pages.size} páginas, ${links} referencias internas y ${images} imágenes OK`);
