// Las piezas del sitio, escritas una sola vez: casos, docencia, artículos y la tesis.
// De acá salen las tarjetas (partials/tarjeta.njk) del inicio, Lo hecho y Pensamiento, la lista
// del inicio, "Seguí leyendo" (partials/seguir-leyendo.njk) y las listas de los datos
// estructurados de Lo hecho y Pensamiento. Sumar una pieza es sumar una entrada acá.
//
// Campos:
//   id           ancla de la tarjeta en su página (#caso-…, #docencia-…, #art-…)
//   url          la página propia (casos y tesis); en el resto, el enlace principal
//   tipo         qué es la pieza. Va arriba del título, en mayúsculas, con la fecha:
//                "Provocación · agosto 2026". En los casos es el mismo de la cabecera del caso
//   fecha        AAAA-MM para <time datetime>; fechaTexto, como se lee
//   titulo, descripcion   los de la tarjeta
//   bajada       la versión corta para las listas; si no está, va la descripción
//   imagen       800 px de ancho, 16:9 o casi: la tarjeta la recorta a 16:9 desde el centro
//   datos        la ficha corta de la tarjeta, [etiqueta, valor]
//   enlaces      [{ texto, href, aria, externo }]. El aria-label empieza por el texto visible
//                (WCAG 2.5.3) y el texto dice adónde lleva: "Leer en Medium", nunca "Leer más"
//   lectura      el largo, para "Seguí leyendo" (casos y tesis)
//   fuente       dónde se publicó (artículos): la lista del inicio lo dice al lado del tipo
//   movimientos  para el filtro de Pensamiento: investigacion, futuros, datos-ia, comunicacion
//   temas        no se muestran: quedan como dato

const linkedin = (href, titulo) => ({
  texto: "Leer en LinkedIn", href, externo: true, aria: `Leer en LinkedIn: ${titulo} (nueva pestaña)`,
});
const medium = (href, titulo) => ({
  texto: "Leer en Medium", href, externo: true, aria: `Leer en Medium: ${titulo} (nueva pestaña)`,
});

// Los artículos llevan dónde se publicaron y quién los firma; la ficha de la tarjeta sale de ahí.
const articulo = ({ fuente, autor, origen, ...resto }) => ({
  ...resto,
  tipo: "Artículo",
  fuente,
  datos: [["Publicado en", fuente], ["Autor", autor], ...(origen ? [["Origen", origen]] : [])],
});

const casos = [
  {
    id: "caso-trace-group",
    url: "/proyectos/trace-group/",
    tipo: "Provocación",
    fecha: "2026-08", fechaTexto: "agosto 2026",
    titulo: "Trace Group — De la señal al servicio",
    descripcion: "¿Y si un cargamento de gas quedara afuera de Europa por su metano, y no por su precio? Este es ese escenario y su objeto: un informe de verificación fechado en 2032.",
    bajada: "¿Y si un cargamento de gas quedara afuera de Europa por su metano, y no por su precio?",
    imagen: { src: "/img/we-trace-login-mobile.webp", w: 800, h: 450, alt: "Pantalla de ingreso de we.trace, la plataforma de verificación de emisiones que emite el informe de 2032" },
    datos: [["Contexto", "Trace Group, vía Clusterciar"], ["Estado", "Provocación presentada, 2026"], ["Lectura", "6 min"]],
    enlaces: [{ texto: "Leer la provocación", href: "/proyectos/trace-group/", aria: "Leer la provocación: Trace Group, de la señal al servicio" }],
    lectura: "6 min de lectura",
    movimientos: "futuros,investigacion",
    temas: ["Energía", "Verificación de emisiones", "2032"],
  },
  {
    id: "caso-gabinete-extemporaneo",
    url: "/proyectos/gabinete-extemporaneo/",
    tipo: "Diseño de experiencia",
    fecha: "2026-03", fechaTexto: "marzo 2026",
    titulo: "Gabinete Extemporáneo",
    descripcion: "¿Y si te asignaran un puesto de trabajo antes de la primera clase? Una instalación que recibe a cada cohorte con un rol de 2028, una herramienta y un documento para firmar.",
    bajada: "¿Y si te asignaran un puesto de trabajo antes de la primera clase?",
    imagen: { src: "/img/gabinete-espera-mobile.webp", w: 800, h: 497, alt: "Un sillón gris vacío contra una pared blanca, con dos almohadones con el logo del ITBA, frente a una puerta cerrada de madera clara, sobre un piso vinílico con franjas azul marino" },
    datos: [["Contexto", "Escuela de Innovación, ITBA"], ["Estado", "Diseño entregado, 2026"], ["Lectura", "8 min"]],
    enlaces: [{ texto: "Leer el caso", href: "/proyectos/gabinete-extemporaneo/", aria: "Leer el caso: Gabinete Extemporáneo" }],
    lectura: "8 min de lectura",
    movimientos: "futuros,investigacion",
    temas: ["Educación ejecutiva", "Diseño de experiencia", "2028"],
  },
  {
    id: "caso-natalidad",
    url: "/proyectos/natalidad/",
    tipo: "Análisis estratégico",
    fecha: "2025-04", fechaTexto: "abril 2025",
    titulo: "Impacto de la caída de la natalidad",
    descripcion: "Lo que la caída de la natalidad hace con la matrícula de un colegio, en tres escenarios y cuatro líneas de trabajo.",
    imagen: { src: "/img/aula-vacia-mobile.webp", w: 800, h: 450, alt: "Aula vacía de una escuela primaria de Buenos Aires, con sillas y pupitres en luz de tarde" },
    datos: [["Contexto", "Colegio de la Ciudad de Buenos Aires"], ["Estado", "Entregado, 2025"], ["Lectura", "11 min"]],
    enlaces: [{ texto: "Leer el caso", href: "/proyectos/natalidad/", aria: "Leer el caso: impacto de la caída de la natalidad en las matrículas escolares" }],
    lectura: "11 min de lectura",
    temas: ["Educación", "Análisis demográfico"],
  },
];

const docencia = [
  {
    id: "docencia-ort",
    tipo: "Clase",
    fecha: "2026-05", fechaTexto: "mayo 2026",
    titulo: "Cuando el artefacto piensa",
    descripcion: "Clase a distancia: cuatro equipos tienen cincuenta minutos para convertir su escenario y su metáfora en un artefacto para discutir. Lo difícil es elegir cuál.",
    imagen: { src: "/img/cuando-artefacto-piensa-mobile.webp", w: 800, h: 447, alt: "Sesión de Zoom con estudiantes del Máster en Diseño Estratégico e Innovación de ORT Uruguay durante la clase de design fiction" },
    datos: [["Contexto", "Máster en Diseño Estratégico e Innovación, ORT Uruguay"], ["Serie", "Quinta clase de futuros, la primera a distancia"], ["Estado", "Realizado, artículo en Medium"]],
    enlaces: [medium("https://medium.com/@nbronzina/cuando-el-artefacto-piensa-06e2b89fb380", "Cuando el artefacto piensa")],
    temas: ["Design fiction", "Docencia"],
  },
  {
    id: "docencia-ied-defensa",
    tipo: "Tutoría",
    fecha: "2026-02", fechaTexto: "febrero 2026",
    titulo: "Otros Futuros: tutor invitado en defensa de proyecto IED Madrid",
    descripcion: "Tutoría y jurado en la defensa de LATAM·2036, un proyecto de diseño especulativo sobre la fuga de cerebros en Ecuador.",
    imagen: { src: "/img/otros-futuros-ied-mobile.webp", w: 800, h: 450, alt: "Otros Futuros - Tutor invitado en defensa de proyecto IED Madrid" },
    datos: [["Contexto", "Máster en Diseño de Producto Digital, IED Madrid"], ["Estado", "Realizado"]],
    enlaces: [linkedin("https://www.linkedin.com/feed/update/urn:li:activity:7427811274014535680/", "post sobre la defensa de LATAM·2036 en IED Madrid")],
    temas: ["Design fiction", "Docencia", "Latinoamérica"],
  },
  {
    id: "docencia-matadero",
    tipo: "Charla",
    fecha: "2026-01", fechaTexto: "enero 2026",
    titulo: "\"Inhabiting the Future\": charla al aire libre en Matadero Madrid",
    descripcion: "Charla al aire libre con estudiantes de Lyon sobre adaptación climática, con la ciudad como material de design fiction.",
    imagen: { src: "/img/inhabiting-future-mobile.webp", w: 800, h: 450, alt: "Charla outdoor Inhabiting the Future - Matadero Madrid" },
    datos: [["Contexto", "Matadero Madrid, European Design Encounters"], ["Estado", "Realizado, artículo en Medium"]],
    enlaces: [medium("https://medium.com/heated-consultancy/inhabiting-the-future-0cc470f47b93", "Inhabiting the Future")],
    temas: ["Design fiction", "Adaptación climática"],
  },
  {
    id: "docencia-ied-workshop",
    tipo: "Workshop",
    fecha: "2026-01", fechaTexto: "enero 2026",
    titulo: "Workshop LATAM·2036: Diseñar futuros desde la fuga",
    descripcion: "Workshop de diseño de futuros sobre la fuga de talento creativo ecuatoriano, con escenarios para Quito 2036.",
    imagen: { src: "/img/workshop-latam2036-mobile.webp", w: 800, h: 450, alt: "Tablero de Miro del workshop LATAM·2036: matriz de escenarios, notas y plantillas de los equipos" },
    datos: [["Contexto", "Máster en Diseño de Producto Digital, IED Madrid"], ["Estado", "Realizado, artículo en Medium"]],
    enlaces: [medium("https://medium.com/@nbronzina/dise%C3%B1ar-futuros-desde-la-fuga-27548f831e36", "Diseñar futuros desde la fuga")],
    temas: ["Design fiction", "Docencia", "Latinoamérica"],
  },
  {
    id: "docencia-cesba",
    tipo: "Jornada",
    fecha: "2025-10", fechaTexto: "octubre 2025",
    titulo: "Jornada de diseño de futuros para la gestión pública",
    descripcion: "Diseño ficción ante el Gobierno porteño: el Mercado de San Telmo en 2030 como artefacto para debatir y la propuesta de una unidad de anticipación de futuros que arranque como piloto.",
    imagen: { src: "/img/JornadaCESBA-mobile.webp", w: 800, h: 450, alt: "Jornada de diseño de futuros en CESBA Buenos Aires con panel de expertos en prospectiva estratégica y gestión pública" },
    datos: [
      ["Contexto", "CESBA, con la Subsecretaría de Análisis Prospectivo de la Ciudad"],
      ["Panel", "Nicolás Bronzina y Ezequiel Politi, con Fabien Girardin (Near Future Laboratory, Girardin & Nova) y Miriam Latorre (Escuela de Innovación del ITBA)"],
      ["Estado", "Realizado, insumo de una recomendación al Gobierno de la Ciudad"],
    ],
    enlaces: [
      { texto: "Nota del CESBA", href: "https://cesba.gob.ar/noticias/como-el-diseno-de-futuros-impulsa-la-gestion-publica-en-buenos-aires/", externo: true, aria: "Nota del CESBA sobre la jornada (nueva pestaña)" },
      { texto: "Artículo en Medium", href: "https://medium.com/@nbronzina/what-if-the-state-designed-futures-661a303aeb8f", externo: true, aria: "Artículo en Medium: What if the State Designed Futures? (nueva pestaña)" },
    ],
    temas: ["Gestión pública", "Diseño ficción"],
  },
  {
    id: "docencia-udit",
    tipo: "Masterclass",
    fecha: "2025-06", fechaTexto: "junio 2025",
    titulo: "Masterclass sobre inteligencia artificial para diseñadores UX",
    descripcion: "Tres clases magistrales y dos días de tutorías sobre cómo diseñar cuando el resultado es probabilístico, junto a Fabien Girardin y Rohit Gupta (Heated Studio).",
    imagen: { src: "/img/masterclass-ia-udit-mobile.webp", w: 800, h: 450, alt: "Masterclass IA para diseñadores UX en UDIT Madrid con Nicolás Bronzina, Fabien Girardin y Rohit Gupta" },
    datos: [["Contexto", "Máster en Experiencia de Usuario, UDIT Madrid"], ["Estado", "Realizado, artículo en Medium"]],
    enlaces: [medium("https://medium.com/@nbronzina/enseñando-inteligencia-artificial-a-diseñadores-ux-694c3a1611d7", "artículo sobre la masterclass en UDIT Madrid")],
    temas: ["Inteligencia artificial", "Diseño UX", "Docencia"],
  },
];

const articulos = [
  articulo({
    id: "art-potrero",
    fecha: "2026-06", fechaTexto: "junio 2026",
    titulo: "¿Se puede algoritmizar el potrero?",
    descripcion: "Las marcas llegan al Mundial 2026 con IA y datos en tiempo real. Un algoritmo puede elegir cuándo publicar; el tono para hablarle a una hinchada lo decide la sociología.",
    imagen: { src: "/img/algoritmizar-potrero-mobile.webp", w: 800, h: 447, alt: "Ilustración del artículo ¿Se puede algoritmizar el potrero? - diagrama de red neuronal junto a vista aérea de una cancha de fútbol" },
    fuente: "LinkedIn", autor: "Sergio Petrocelli",
    enlaces: [linkedin("https://www.linkedin.com/pulse/se-puede-algoritmizar-el-potrero-bpp-analytics-and-design-eodce", "¿Se puede algoritmizar el potrero?")],
    movimientos: "comunicacion,datos-ia",
    temas: ["Sociología", "Datos", "IA", "Fútbol"],
  }),
  articulo({
    id: "art-personal-software",
    fecha: "2026-04", fechaTexto: "abril 2026",
    titulo: "La práctica del personal software",
    descripcion: "Tres aplicaciones construidas sin saber programar muestran qué cambia cuando prototipar deja de requerir un stack técnico.",
    imagen: { src: "/img/personal-software-mobile.webp", w: 800, h: 447, alt: "Ilustración sobre intent coding y personal software - pantalla con código y nota de pregunta" },
    fuente: "LinkedIn", autor: "Nicolás Bronzina",
    enlaces: [linkedin("https://www.linkedin.com/pulse/la-pr%C3%A1ctica-del-personal-software-bpp-analytics-and-design-dwyxe/", "La práctica del personal software")],
    movimientos: "datos-ia,futuros",
    temas: ["IA", "Diseño", "Estrategia", "Personal Software"],
  }),
  articulo({
    id: "art-ano-analogico",
    fecha: "2026-03", fechaTexto: "marzo 2026",
    titulo: "2026, año analógico. O: por qué el futuro ya no llega",
    descripcion: "iPods, vinilos y casetes leídos como prototipos involuntarios de futuros que nadie diseñó todavía.",
    imagen: { src: "/img/2026-ano-analogico-mobile.webp", w: 800, h: 447, alt: "Ilustración del artículo 2026, año analógico - artefactos retro y la cancelación del futuro" },
    fuente: "LinkedIn", autor: "Nicolás Bronzina",
    enlaces: [linkedin("https://www.linkedin.com/pulse/2026-a%C3%B1o-anal%C3%B3gico-o-por-qu%C3%A9-el-futuro-ya-llega-nrf0e/", "2026, año analógico")],
    movimientos: "investigacion,futuros",
    temas: ["Sociología", "Futuro", "Diseño", "Prospectiva"],
  }),
  articulo({
    id: "art-algoritmos",
    fecha: "2026-03", fechaTexto: "marzo 2026",
    titulo: "Por qué los algoritmos no bastan: El regreso de la sociología a la estrategia de marca",
    descripcion: "Los algoritmos registran comportamientos. Entender qué significan es trabajo de la sociología, que vuelve a la estrategia de marca.",
    imagen: { src: "/img/algoritmos-sociologia-branding-mobile.webp", w: 800, h: 447, alt: "Ilustración sobre sociología aplicada a estrategia de marca y las limitaciones de los algoritmos" },
    fuente: "LinkedIn", autor: "Sergio Petrocelli",
    enlaces: [linkedin("https://www.linkedin.com/pulse/por-qu%C3%A9-los-algoritmos-bastan-el-regreso-de-la-ixf1e/", "Por qué los algoritmos no bastan")],
    movimientos: "comunicacion,datos-ia",
    temas: ["Sociología", "Branding", "Estrategia", "Datos"],
  }),
  articulo({
    id: "art-alquileres",
    fecha: "2026-02", fechaTexto: "febrero 2026",
    titulo: "La ilusión de la \"negociación libre\": Lo que el aumento de la oferta no cuenta sobre los alquileres",
    descripcion: "Sin regulación, la negociación del alquiler no es libre: las inmobiliarias regulan de hecho y el inquilino no tiene opción real de decir que no.",
    imagen: { src: "/img/alquileres-negociacion-mobile.webp", w: 800, h: 447, alt: "Ilustración sobre negociación de alquileres y asimetrías del mercado inmobiliario" },
    fuente: "LinkedIn", autor: "Ezequiel Politi", origen: "Tesis de licenciatura en Sociología",
    enlaces: [linkedin("https://www.linkedin.com/pulse/la-ilusi%C3%B3n-de-negociaci%C3%B3n-libre-lo-que-el-aumento-oferta-politi-sxcwe/", "La ilusión de la negociación libre")],
    movimientos: "datos-ia,investigacion",
    temas: ["Sociología", "Datos", "Vivienda"],
  }),
  articulo({
    id: "art-branding",
    fecha: "2026-01", fechaTexto: "enero 2026",
    titulo: "El Branding como fenómeno social: Por qué tu empresa necesita un sociólogo y no solo un diseñador gráfico",
    descripcion: "Una marca existe en lo que la gente dice y hace con ella, y eso se estudia con sociología: por eso el equipo de marca necesita un sociólogo además de un diseñador.",
    imagen: { src: "/img/branding-fenomeno-social-mobile.webp", w: 800, h: 447, alt: "Branding como fenómeno social - arquitectura simbólica y estrategia" },
    fuente: "LinkedIn", autor: "Sergio Petrocelli",
    enlaces: [linkedin("https://www.linkedin.com/pulse/el-branding-como-fen%C3%B3meno-social-por-qu%C3%A9-tu-empresa-uzsdf/", "El branding como fenómeno social")],
    movimientos: "comunicacion",
    temas: ["Sociología", "Branding", "Estrategia"],
  }),
];

const tesis = {
  id: "tesis-01",
  url: "/usina/tesis-01/",
  tipo: "Tesis",
  serie: "La Usina · Tesis 01",
  fecha: "2026-08", fechaTexto: "agosto 2026",
  titulo: "El actante siempre disponible",
  subtitulo: "Inteligencia artificial generativa, socialización e identidad en la emergencia de nuevos vínculos humano–IA: una propuesta conceptual desde la teoría del actor-red.",
  autores: "Nicolás Bronzina · Sergio Petrocelli · Ezequiel Politi",
  descripcion: "Qué le pasa a la red de un adolescente cuando entra un interlocutor no humano, siempre disponible y con menos fricción que una persona.",
  datos: [["Estado", "Documento de trabajo, agosto 2026"], ["Formato", "PDF de 56 páginas, descarga directa"]],
  enlaces: [{ texto: "Leer la tesis", href: "/usina/tesis-01/" }],
  lectura: "PDF de 56 páginas",
  temas: ["Investigación", "IA", "Sociología", "Identidad"],
};

const todas = [...casos, ...docencia, ...articulos, tesis];
const porId = (id) => {
  const p = todas.find((x) => x.id === id);
  if (!p) throw new Error(`piezas.mjs: no hay ninguna pieza con id "${id}"`);
  return p;
};

export default {
  casos,
  docencia,
  articulos,
  tesis,
  // Las piezas largas, con página propia y tiempo de lectura: "Seguí leyendo" muestra las demás.
  largas: [...casos, tesis],
  // El inicio elige por id: los tres casos como tarjetas y tres textos como lista.
  inicio: {
    casos: ["caso-trace-group", "caso-gabinete-extemporaneo", "caso-natalidad"].map(porId),
    textos: ["tesis-01", "art-potrero", "art-personal-software"].map(porId),
  },
};
