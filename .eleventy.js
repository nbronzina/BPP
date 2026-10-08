// Eleventy: genera el sitio en _site/ a partir de src/.
// Sin frameworks en runtime: el HTML sale plano, el CSS y el JS se minifican aparte (package.json).
import { execSync } from "node:child_process";
import { bandera } from "./lib/bandera.mjs";

export default function (eleventyConfig) {
  // Año del copyright horneado en el build: el footer no depende de JS.
  eleventyConfig.addGlobalData("buildYear", () => new Date().getFullYear());
  // Assets que se copian tal cual, desde la raíz del repo al de _site/
  eleventyConfig.addPassthroughCopy({
    img: "img",
    fonts: "fonts",
    "robots.txt": "robots.txt",
    "llms.txt": "llms.txt",
    "favicon.ico": "favicon.ico",
    "favicon.svg": "favicon.svg",
    "favicon-16x16.png": "favicon-16x16.png",
    "favicon-32x32.png": "favicon-32x32.png",
    "apple-touch-icon.png": "apple-touch-icon.png",
    // Kill-switch del service worker retirado: borrar en 2027
    "sw.js": "sw.js",
    "sw.min.js": "sw.min.js",
  });
  // Documentos públicos (PDF de la tesis). Los .md de docs/ nunca se publican.
  eleventyConfig.addPassthroughCopy("docs/*.pdf");
  // El sitemap sale de las páginas que declaran `sitemap:` en su front matter (src/sitemap.njk).
  // Orden fijo por URL para que el archivo generado no cambie entre builds.
  eleventyConfig.addCollection("sitemap", (api) =>
    api.getAll().filter((p) => p.data.sitemap).sort((a, b) => a.url.localeCompare(b.url))
  );
  // Titulares partidos por el sentido desde el front matter: "Estos textos son | la parte pública…".
  // Cada tramo entre barras va en un .junto (styles.css); el resto lo resuelve lib/bandera.mjs.
  // Escapa el texto: devuelve HTML listo para | safe.
  const escapar = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  eleventyConfig.addFilter("sentido", (s) => {
    const tramos = String(s ?? "").split(/\s+\|\s+/);
    return tramos.length < 2 ? escapar(s ?? "") : tramos.map((t) => `<span class="junto">${escapar(t)}</span>`).join(" ");
  });
  // Composición en bandera (lib/bandera.mjs): dónde no puede cortar una línea. Solo en el HTML.
  eleventyConfig.addTransform("bandera", function (content) {
    return (this.page.outputPath || "").endsWith(".html") ? bandera(content) : content;
  });
  // styles.css y main.js viven en src/ pero no son templates
  eleventyConfig.ignores.add("src/styles.css");
  eleventyConfig.ignores.add("src/main.js");
  // `npm run serve`: Eleventy no genera los minificados, así que en local el sitio salía sin CSS
  // ni JS. Al servir los genera después de cada build y los rehace cuando cambia la fuente.
  // En `npm run build` esto no corre: ahí los generan build:css y build:js, como siempre.
  eleventyConfig.addWatchTarget("./src/styles.css");
  eleventyConfig.addWatchTarget("./src/main.js");
  eleventyConfig.on("eleventy.after", ({ runMode }) => {
    if (runMode === "build") return;
    execSync("npm run --silent build:css && npm run --silent build:js", { stdio: "inherit" });
  });
  return {
    dir: { input: "src", output: "_site", includes: "_includes", data: "_data" },
    htmlTemplateEngine: false, // src/usina/index.html (redirección) se copia sin procesar
    markdownTemplateEngine: "njk",
  };
}
