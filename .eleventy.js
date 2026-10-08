// Eleventy: genera el sitio en _site/ a partir de src/.
// Sin frameworks en runtime: el HTML sale plano, el CSS y el JS se minifican aparte (package.json).
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
  // styles.css y main.js viven en src/ pero no son templates
  eleventyConfig.ignores.add("src/styles.css");
  eleventyConfig.ignores.add("src/main.js");
  return {
    dir: { input: "src", output: "_site", includes: "_includes", data: "_data" },
    htmlTemplateEngine: false, // src/usina/index.html (redirección) se copia sin procesar
    markdownTemplateEngine: "njk",
  };
}
