// Chequeo mínimo del sitio generado: existen las páginas, no quedan rutas relativas
// rotas, y los assets críticos están en _site/. Corre en CI antes de publicar.
import { readFileSync, existsSync } from "node:fs";
const pages = ["index.html","proyectos/index.html","proyectos/trace-group/index.html","reporte-impacto/index.html","pensamiento/index.html","usina/tesis-01/index.html","privacidad/index.html","usina/index.html"];
const assets = ["styles.min.css","main.min.js","fonts/plus-jakarta-sans-latin.woff2","img/logo-160.webp","sitemap.xml","robots.txt","CNAME"];
let fail = 0;
for (const p of pages) {
  const f = `_site/${p}`;
  if (!existsSync(f)) { console.error(`falta ${f}`); fail++; continue; }
  const s = readFileSync(f, "utf8");
  if (p !== "usina/index.html") {
    for (const [name, re] of [["<title>", /<title>[^<]+<\/title>/], ["canonical", /rel="canonical"/], ["footer", /<footer/], ["main", /id="main-content"/], ["nav", /<nav /]]) {
      if (!re.test(s)) { console.error(`${f}: sin ${name}`); fail++; }
    }
    if (/"\.\.\//.test(s)) { console.error(`${f}: rutas relativas ../ residuales`); fail++; }
    for (const m of s.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
      try { JSON.parse(m[1]); } catch { console.error(`${f}: JSON-LD inválido`); fail++; }
    }
  }
}
for (const a of assets) if (!existsSync(`_site/${a}`)) { console.error(`falta _site/${a}`); fail++; }
if (fail) { console.error(`check-site: ${fail} problema(s)`); process.exit(1); }
console.log(`check-site: ${pages.length} páginas y ${assets.length} assets OK`);
