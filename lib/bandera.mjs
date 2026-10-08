// Composición en bandera: cada página pasa por acá antes de escribirse en _site/.
// Sigue los consejos de Enric Jardí (Veintidós consejos sobre tipografía, Actar, 2007; ampliado
// en Cincuenta y tantos consejos sobre tipografía, GG, 2021): texto a caja izquierda, titulares
// partidos por el sentido y ninguna palabra suelta al final de un bloque. El navegador decide
// dónde corta cada línea; esto solo le dice dónde no conviene cortar.
//
// Qué va junto con la palabra que sigue:
//   - toda palabra de una o dos letras: a, y, de, la, en, un, se… ("y decidís", "de la natalidad");
//   - en titulares y textos grandes, además, artículos, preposiciones, conjunciones y
//     demostrativos cortos: del, las, con, por, que, para, esta… ("con fuente y año");
//   - la cifra y su unidad, la palabra y su número: "48 horas", "−42,8 %", "agosto 2026", "Gráfico 4";
//   - la raya y el punto medio separadores, con la palabra de antes, para que ninguna línea
//     empiece con ellos: "Trace Group —", "LinkedIn ·";
//   - las dos últimas palabras de un bloque, para que no quede una sola en la última línea.
// Además no corta palabras compuestas ni códigos ("humano–IA", "2016–2026", "TRN-2028-0412") y
// deja cortar un mail solo después de la arroba.
//
// Cómo: los grupos cortos se unen con espacios de no separación (U+00A0). En titulares, un grupo
// más largo va en <span class="junto"> (styles.css: inline-block con max-width 100 %): se mueve
// entero a la línea siguiente y, si no entra en ninguna, se corta adentro, así nada se desborda
// en una pantalla angosta. En el texto corrido no: movería palabras enteras y la bandera quedaría
// más despareja. Un grupo que no entra ni así se parte donde menos molesta: después de
// una palabra de contenido o, si no hay, después de la palabra de función más larga; nunca
// después de una de una o dos letras.
//
// Solo toca el texto visible de <body>. No entra en <script>, <style>, <pre>, <code>, <textarea>
// ni <svg>, ni en los atributos (alt, aria-label y title quedan como están).

const NBSP = " ";
const WJ = "⁠";

const SALTAR = new Set(["script", "style", "pre", "code", "textarea", "svg", "head", "title"]);
const VACIOS = new Set(["br", "wbr", "img", "input", "meta", "link", "hr", "source", "col", "area", "base", "embed", "track"]);
const EN_LINEA = new Set(["a", "strong", "em", "b", "i", "span", "time", "abbr", "cite", "q", "small", "sup", "sub", "mark", "dfn", "s", "u"]);
const FIN_DE_BLOQUE = new Set(["p", "li", "dd", "dt", "h1", "h2", "h3", "h4", "h5", "h6", "figcaption", "blockquote", "td", "th", "button", "summary", "address"]);

// Largo de un grupo (en caracteres), según el tamaño de la letra: hasta el primero, con
// espacios de no separación; hasta el segundo, en <span class="junto">; más largo, se parte.
// Los números salen de la columna más angosta del sitio (320 px de pantalla) y de la de 360.
const TOPES = {
  fs1: [10, 15],   // 40 → 72 px: título del inicio, de Lo hecho y de Pensamiento
  fs2: [13, 20],   // 32 → 48 px: título de documento, cierre, cifra
  fs3: [16, 24],   // 26 → 34 px: títulos de bloque, cita destacada
  fs4: [20, 30],   // 21 → 24 px: títulos de tarjeta y fila, frase del inicio, bajadas
  texto: [16, 16], // texto corrido: solo espacios de no separación
};

function nivel(pila) {
  const tiene = (c) => pila.some((e) => e.cls.includes(c));
  const tag = (t) => pila.some((e) => e.tag === t);
  if (tiene("inicio-titulo")) return "fs1";
  if (tag("h1")) return tiene("cabecera--documento") ? "fs2" : "fs1";
  if (tiene("cierre__titulo") || tiene("cifra") || tiene("documento__anio")) return "fs2";
  if (tag("h2") || tiene("pull-quote") || tiene("tesis-card__title") || tiene("toc-title") || tiene("data-rail-value")) return "fs3";
  if (tag("h3") || tag("h4") || tiene("inicio-frase") || tiene("services-lead") || tiene("bajada") || tiene("cierre__texto")) return "fs4";
  return "texto";
}

// Palabras de función que, en un titular, no cierran una línea: artículos, contracciones,
// preposiciones y conjunciones cortas, y demostrativos.
const FUNCION = new Set([
  "del", "los", "las", "una", "unos", "unas", "con", "por", "sin", "que", "sus", "mis", "tus", "les", "nos",
  "para", "pero", "como", "ante", "bajo", "tras", "desde", "hasta", "hacia", "entre", "sobre", "según",
  "esta", "este", "esto", "ese", "esa", "eso", "muy", "más", "qué",
]);

const LETRAS = "A-Za-zÁÉÍÓÚÜÑáéíóúüñ";
const CORTA = new RegExp(`^[${LETRAS}]{1,2}$`);
const ABRE = /^[¿¡«“"'(]+/;
const CIERRA = /[.,;:)?!»”"']+$/;
const NUMERO = /^[−+-]?\d[\d.,]*$/;
const NUMERO_CORTO = /^\d{1,4}[.,;:)?!»”]*$/;
const PALABRA = new RegExp(`^[${LETRAS}]+\\.?$`);
const MINUSCULA = /^[a-záéíóúüñ%º]/;
const COMPUESTO = new RegExp(`([${LETRAS}0-9])([-–])(?=[${LETRAS}0-9])`, "g");
const MAIL = /([\w.+-]+)@([\w-]+\.[\w.-]+)/g;
const RAYA_ABRE = new RegExp(`(^|[\\s(\u00a0])—(?=[${LETRAS}0-9¿¡«])`, "g");
const RAYA_CIERRA = new RegExp(`([${LETRAS}0-9.,;:?!»)])—`, "g");

// Términos que no se parten: nombres propios de dos palabras y expresiones fijas que aparecen en
// títulos. Si un titular parte uno de estos, sumarlo acá.
const TERMINOS = [
  "Buenos Aires", "La Usina", "inteligencia artificial", "diseño de futuros", "señales débiles",
  "diseño ficción", "design fiction", "fenómeno social", "título universitario", "estrategia de marca",
];
const TERMINO = new RegExp(`(^|[^${LETRAS}])(${TERMINOS.map((x) => x.replace(/ /g, "[ \\t\\n\\r]+")).join("|")})(?=[^${LETRAS}]|$)`, "gi");
// Una cita corta entre comillas latinas (hasta tres palabras) no se parte: «negociación libre».
const CITA = /«([^«»<]{1,40})»/g;

const nucleo = (w) => w.replace(ABRE, "");
// Largo visible (una entidad cuenta como un carácter).
const largo = (s) => s.replace(/&[#\w]+;/g, "x").length;

// ¿Es una palabra que no puede cerrar una línea? 2: de una o dos letras; 1: de función; 0: no.
function pegajosa(w, display) {
  const n = nucleo(w);
  if (CIERRA.test(n)) return 0; // "no." o "de," cierran algo: ahí se puede cortar
  if (CORTA.test(n)) return 2;
  if (display && FUNCION.has(n.toLowerCase())) return 1;
  return 0;
}

// ¿La palabra a va junto con la b que le sigue?
const SEPARADOR = (b) => ["—", "·", "%"].includes(b.replace(CIERRA, ""));

const UNIDADES = new Set([
  "años", "año", "meses", "mes", "semanas", "semana", "días", "día", "horas", "hora", "minutos", "minuto",
  "min", "segundos", "páginas", "página", "palabras", "km", "kg", "kb", "mb", "px", "millones", "millón",
  "mil", "personas", "alumnos", "chicos", "embarques", "puntos", "veces", "escenarios", "socios",
]);
const MAYUSCULA = new RegExp(`^[«“"(]?[A-ZÁÉÍÓÚÜÑ][${LETRAS}]`);

function junto(a, b, display) {
  if (!a || !b) return false;
  if (SEPARADOR(b)) return true;
  if (pegajosa(a, display)) return true;
  // Dos palabras con mayúscula seguidas son casi siempre un nombre: "Matadero Madrid", "IED Madrid".
  if (MAYUSCULA.test(a) && MAYUSCULA.test(b) && !CIERRA.test(a)) return true;
  const n = nucleo(a);
  // La cifra y su unidad: "4 años", "30 minutos", "56 páginas" (no "2016 y", "25.201 proyectados").
  const nb = nucleo(b).replace(CIERRA, "").toLowerCase();
  if (NUMERO.test(n) && UNIDADES.has(nb)) return true;
  // La palabra y su número: "agosto 2026", "Gráfico 4", "Of. 4113", "Tesis 01".
  if (PALABRA.test(n) && NUMERO_CORTO.test(b)) return true;
  return false;
}

// Parte un grupo demasiado largo [desde, hasta] (índices de palabras en t) donde menos molesta.
// Devuelve el índice de la palabra después de la cual se corta, o -1.
function dondeCortar(t, palabras, display) {
  let mejor = -1, puntaje = -1, equilibrio = Infinity;
  const total = palabras.reduce((s, k) => s + largo(t[k]) + 1, -1);
  let acumulado = -1;
  for (let j = 0; j < palabras.length - 1; j++) {
    const k = palabras[j];
    acumulado += largo(t[k]) + 1;
    const p = pegajosa(t[k], display);
    const sig = t[palabras[j + 1]];
    const valor = SEPARADOR(sig) ? -1 : p === 0 ? 3 : p === 1 ? 1 + largo(nucleo(t[k])) / 10 : -1;
    const eq = Math.abs(total - 2 * acumulado);
    if (valor > puntaje || (valor === puntaje && eq < equilibrio)) { mejor = j; puntaje = valor; equilibrio = eq; }
  }
  return puntaje < 0 ? -1 : mejor;
}

export function bandera(html) {
  const partes = html.split(/(<!--[\s\S]*?-->|<[^>]+>)/);
  const pila = [];
  let enBody = false;

  // La etiqueta que sigue a la parte i: ¿abre un elemento en línea? ¿cierra un bloque?
  const siguiente = (i) => {
    for (let j = i + 1; j < partes.length; j++) {
      const p = partes[j];
      if (!p || p.startsWith("<!--")) continue;
      if (!p.startsWith("<")) return p.trim() ? { texto: true } : null;
      const m = p.match(/^<\s*(\/)?\s*([a-zA-Z0-9]+)/);
      return m ? { cierra: !!m[1], tag: m[2].toLowerCase() } : null;
    }
    return null;
  };

  for (let i = 0; i < partes.length; i++) {
    const p = partes[i];
    if (!p || p.startsWith("<!--")) continue;
    if (p.startsWith("<")) {
      const m = p.match(/^<\s*(\/)?\s*([a-zA-Z0-9]+)([^>]*)>$/);
      if (!m) continue;
      const cierra = !!m[1];
      const tag = m[2].toLowerCase();
      if (tag === "body") { enBody = !cierra; continue; }
      if (cierra) {
        const k = pila.map((e) => e.tag).lastIndexOf(tag);
        if (k >= 0) pila.length = k;
      } else if (!VACIOS.has(tag) && !/\/\s*$/.test(m[3])) {
        const cls = (m[3].match(/\bclass\s*=\s*"([^"]*)"/) || [, ""])[1].split(/\s+/).filter(Boolean);
        pila.push({ tag, cls });
      }
      continue;
    }
    if (!enBody || pila.some((e) => SALTAR.has(e.tag))) continue;

    const nv = nivel(pila);
    const display = nv !== "texto";
    const [tope, topeJunto] = TOPES[nv];
    // Dentro de un botón o un enlace no van <span>: pueden ser contenedores flex (el span pasaría a
    // ser otra caja) y un inline-block corta el subrayado del enlace. Ahí solo espacios de no separación.
    const sinCaja = !pila.some((e) => e.tag === "button" || e.tag === "a");
    const conSpan = display && sinCaja;
    const texto = p
      .replace(TERMINO, (m, antes, termino) => antes + termino.replace(/[ \t\n\r]+/g, NBSP))
      .replace(CITA, (m, adentro) => (adentro.trim().split(/\s+/).length <= 3 ? `«${adentro.replace(/[ \t\n\r]+/g, NBSP)}»` : m));
    const t = texto.split(/([ \t\n\r]+)/); // [palabra, sep, palabra, sep, …, palabra]
    const palabras = [];
    for (let k = 0; k < t.length; k += 2) if (t[k]) palabras.push(k);
    const sig = siguiente(i);

    // 1. Qué va junto, por la lengua (sin mirar largos).
    const une = new Set(); // índices de palabra k: la palabra k va junto con la siguiente
    for (let j = 0; j < palabras.length - 1; j++) {
      const k = palabras[j], k2 = palabras[j + 1];
      if (k2 !== k + 2) continue; // entre las dos hay algo más que un espacio
      if (junto(t[k], t[k2], display)) une.add(k);
    }
    // Viuda: la última palabra del bloque va con la anterior (si hay al menos tres). No en las
    // fichas (dt, dd): son valores cortos en columnas angostas.
    // Tampoco después de una coma o un punto: ahí cortar es natural ("que nadie mira, hablemos.").
    const cierraBloque = sig && sig.cierra && FIN_DE_BLOQUE.has(sig.tag) && sig.tag !== "dd" && sig.tag !== "dt";
    if (cierraBloque && palabras.length >= 3 && !CIERRA.test(t[palabras[palabras.length - 2]])) {
      une.add(palabras[palabras.length - 2]);
    }

    // 2. Grupos: tramos de palabras unidas. Cada uno se escribe según su largo.
    const grupos = [];
    let actual = [];
    for (const k of palabras) {
      actual.push(k);
      if (!une.has(k)) { grupos.push(actual); actual = []; }
    }
    if (actual.length) grupos.push(actual);

    const abre = new Map(), cierra = new Map();
    // Título de tarjeta con subtítulo ("Otros Futuros: tutor invitado…"): si no entra en una línea,
    // se corta después de los dos puntos. El subtítulo va entero en un .junto.
    const fuera = { abre: -1, cierra: -1 };
    if (conSpan && pila.some((e) => e.cls.includes("tarjeta__titulo"))) {
      const j = palabras.findIndex((k, x) => x > 0 && x < palabras.length - 3 && /:[»”"']*$|^[^:]*:$/.test(t[k]) && t[k].endsWith(":"));
      if (j >= 0) { fuera.abre = palabras[j + 1]; fuera.cierra = palabras[palabras.length - 1]; }
    }
    // Un grupo en <span class="junto">: si en la pantalla más angosta se corta adentro, que nunca
    // sea después de una palabra de una letra ni antes de una raya o un punto medio.
    const enSpan = (g) => {
      abre.set(g[0], true);
      cierra.set(g[g.length - 1], true);
      for (let j = 0; j < g.length - 1; j++) if (largo(nucleo(t[g[j]])) === 1 || SEPARADOR(t[g[j + 1]])) t[g[j] + 1] = NBSP;
    };
    // Un nombre propio de varias palabras ("European Design Encounters") tampoco se parte en el
    // texto corrido: si es largo, va en un .junto.
    const esNombre = (g) => g.every((k) => MAYUSCULA.test(t[k]));
    const resolver = (g) => {
      if (g.length < 2) return;
      const L = g.reduce((s, k) => s + largo(t[k]) + 1, -1);
      if (L <= tope) { for (let j = 0; j < g.length - 1; j++) t[g[j] + 1] = NBSP; return; }
      if ((conSpan || (sinCaja && esNombre(g))) && L <= Math.max(topeJunto, 30)) { enSpan(g); return; }
      const j = dondeCortar(t, g, display);
      if (j < 0) {
        if (conSpan) enSpan(g);
        else for (let x = 0; x < g.length - 1; x++) t[g[x] + 1] = NBSP;
        return;
      }
      resolver(g.slice(0, j + 1));
      resolver(g.slice(j + 1));
    };
    grupos.forEach(resolver);

    // Espacio al final de la parte, antes de un elemento en línea ("de <strong>44.076</strong>"):
    // si la última palabra es de una o dos letras, va junto con lo que sigue.
    const ultima = palabras[palabras.length - 1];
    if (ultima !== undefined && t[ultima + 1] !== undefined && t[ultima + 2] === "" &&
        sig && !sig.cierra && EN_LINEA.has(sig.tag) && pegajosa(t[ultima], display) === 2) {
      t[ultima + 1] = NBSP;
    }

    let s = "";
    for (let k = 0; k < t.length; k++) {
      if (k === fuera.abre) s += '<span class="junto">';
      if (abre.has(k)) s += '<span class="junto">';
      s += t[k];
      if (cierra.has(k)) s += "</span>";
      if (k === fuera.cierra) s += "</span>";
    }
    s = s.replace(COMPUESTO, `$1$2${WJ}`);
    // La raya de un inciso no queda sola al final ni al principio de una línea: "—validación, … decisión—".
    s = s.replace(RAYA_ABRE, `$1—${WJ}`).replace(RAYA_CIERRA, `$1${WJ}—`);
    s = s.replace(MAIL, "$1@<wbr>$2");
    partes[i] = s;
  }
  return partes.join("");
}
