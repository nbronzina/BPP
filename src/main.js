// =====================================================
// main.js – Comportamiento global del sitio de BPP
// -----------------------------------------------------
// Menú móvil, anclas, "Copiar dirección" y lo propio de cada
// tipo de página: índice, escenarios y rail de cifras en los
// casos; filtro en Pensamiento; "Ver proceso" en el inicio.
// Sin apariciones al scroll, sin formulario, sin PWA y sin
// medición de visitas (Plausible se retiró el 2026-10-08).
// Las flechas de los enlaces las dibuja el CSS (/img/flecha.svg)
// y el nav del inicio se ve desde el principio (v3, octubre de 2026).
// =====================================================

document.addEventListener("DOMContentLoaded", function () {
  const body = document.body;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // =====================================================
  // SCROLL RESTORATION - Asegurar inicio en top
  // =====================================================
  // Prevenir que el navegador restaure la posición de scroll
  // y asegurar que la página siempre inicie en el top,
  // EXCEPTO en navegación back/forward (ahí el navegador debe
  // restaurar la posición donde estaba el usuario)
  const navEntry = performance.getEntriesByType('navigation')[0];
  if (navEntry?.type !== 'back_forward') {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    // Forzar scroll al top cuando la página carga,
    // salvo que haya un ancla en la URL (deep links como ../#contact)
    if (!window.location.hash) {
      window.scrollTo(0, 0);
    }
  }

  // =====================================================
  // BLOQUE NAV / NAVEGACIÓN
  // -----------------------------------------------------
  // Controla el menú mobile, cierre por clic externo,
  // tecla Escape y smooth scroll para anclas internas.
  // =====================================================

  // -------------------------
  // Navegación / Mobile menu
  // -------------------------
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const navLinks = document.getElementById("navLinks");

  if (mobileMenuBtn && navLinks) {
    // Create overlay element
    const overlay = document.createElement('div');
    overlay.className = 'mobile-menu-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    document.body.appendChild(overlay);

    // Mark current page in nav
    const currentPath = window.location.pathname;
    navLinks.querySelectorAll("a").forEach((link) => {
      const linkPath = new URL(link.href, window.location.origin).pathname;
      // "page" solo en la página exacta; "true" en sus hijas (Trace Group, natalidad, tesis).
      // El HTML ya viene marcado desde el layout; esto solo repite el criterio si el JS corre.
      if (linkPath === currentPath) {
        link.classList.add('current-page');
        link.setAttribute('aria-current', 'page');
      } else if (currentPath.startsWith(linkPath) && linkPath !== '/') {
        link.classList.add('current-page');
        link.setAttribute('aria-current', 'true');
      }
    });

    const toggleMenu = () => {
      const isActive = navLinks.classList.toggle("active");
      mobileMenuBtn.classList.toggle("active");
      overlay.classList.toggle("active");
      mobileMenuBtn.setAttribute("aria-expanded", isActive ? "true" : "false");

      // Body scroll lock
      if (isActive) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    };

    const closeMenu = () => {
      navLinks.classList.remove("active");
      mobileMenuBtn.classList.remove("active");
      overlay.classList.remove("active");
      mobileMenuBtn.setAttribute("aria-expanded", "false");
      document.body.style.overflow = '';
    };

    // Es un <button>: Enter y Espacio ya llegan como click.
    mobileMenuBtn.addEventListener("click", toggleMenu);

    // Cerrar menú al hacer click en un link
    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        if (navLinks.classList.contains("active")) {
          closeMenu();
        }
      });
    });

    // Cerrar con Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && navLinks.classList.contains("active")) {
        closeMenu();
        mobileMenuBtn.focus();
      }
    });

    // Cerrar al hacer click en overlay
    overlay.addEventListener("click", closeMenu);

    // Cerrar al hacer click fuera
    document.addEventListener("click", (e) => {
      if (
        navLinks.classList.contains("active") &&
        !navLinks.contains(e.target) &&
        !mobileMenuBtn.contains(e.target)
      ) {
        closeMenu();
      }
    });
  }

  // -------------------------
  // Smooth scroll para anclas internas
  // (solo para IDs en la misma página)
  // Respects prefers-reduced-motion
// -------------------------
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    const href = anchor.getAttribute("href");
    if (!href || href === "#") return;

    anchor.addEventListener("click", function (e) {
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        target.scrollIntoView({
          behavior: prefersReducedMotion ? "auto" : "smooth",
          block: "start"
        });
        // El foco va al destino, como en un salto nativo: "Saltar al contenido principal" y los
        // índices dejan el teclado donde quedó la vista. El tabindex temporal se va al salir.
        if (!target.matches("a[href], button, input, select, textarea, [tabindex]")) {
          target.setAttribute("tabindex", "-1");
          target.addEventListener("blur", () => target.removeAttribute("tabindex"), { once: true });
        }
        target.focus({ preventScroll: true });
      }
    });
  });

  // "Copiar dirección" (partials/copiar-mail.njk): aparece solo si el navegador puede copiar.
  if (navigator.clipboard && navigator.clipboard.writeText) {
    document.querySelectorAll(".copiar-mail").forEach((btn) => {
      const aviso = btn.nextElementSibling;  // role="status": lo lee el lector de pantalla
      const texto = btn.textContent;
      let vuelta;
      const avisar = (mensaje) => {
        btn.textContent = mensaje;
        if (aviso) aviso.textContent = mensaje;
        clearTimeout(vuelta);
        vuelta = setTimeout(() => {
          btn.textContent = texto;
          if (aviso) aviso.textContent = "";
        }, 2500);
      };
      btn.hidden = false;
      btn.addEventListener("click", () => {
        navigator.clipboard.writeText(btn.dataset.copiar).then(
          () => avisar("Dirección copiada"),
          () => avisar("No se pudo copiar")
        );
      });
    });
  }

  // =====================================================
  // BLOQUE CASOS LARGOS (reporte-page)
  // -----------------------------------------------------
  // Índice, compartir, escenarios y rail de cifras.
  // =====================================================

  if (body.classList.contains("reporte-page")) {
    const reporteSections = document.querySelectorAll("section.caso-seccion");

    // Sticky TOC (desde 1280px) y botones de compartir
    const stickyToc = document.getElementById("stickyToc");
    const shareButtons = document.getElementById("shareButtons");
    const cierreCaso = document.querySelector(".cierre");
    if (stickyToc || shareButtons) {
      const showThreshold = 400; // aparecen después de 400px de scroll
      let stickyVisible = null;
      let tocVisible = null;
      const handleStickyElements = () => {
        const visible = window.scrollY > showThreshold;
        // El índice es del caso: se va cuando el cierre llega a su altura. El cierre y
        // "Seguí leyendo" van centrados a todo el ancho y el índice los pisaría.
        const enCaso = !cierreCaso || !stickyToc ||
          cierreCaso.getBoundingClientRect().top > stickyToc.getBoundingClientRect().bottom + 48;
        if (visible !== stickyVisible) {
          stickyVisible = visible;
          if (shareButtons) shareButtons.classList.toggle("visible", visible);
        }
        if (stickyToc && (visible && enCaso) !== tocVisible) {
          tocVisible = visible && enCaso;
          stickyToc.classList.toggle("visible", tocVisible);
        }
      };

      window.addEventListener("scroll", handleStickyElements, { passive: true });
      handleStickyElements();

      // Highlight active section in TOC
      if (stickyToc) {
        const tocLinks = stickyToc.querySelectorAll("a");
        const sections = document.querySelectorAll("section[id]");

        let currentTocId = null;
        const highlightTocLink = () => {
          let current = "";
          sections.forEach((section) => {
            if (window.scrollY >= section.offsetTop - 200) {
              current = section.getAttribute("id");
            }
          });
          if (current === currentTocId) return; // misma sección: no se toca el DOM
          currentTocId = current;

          tocLinks.forEach((link) => {
            link.classList.toggle("active", link.getAttribute("href") === "#" + current);
          });
        };

        window.addEventListener("scroll", highlightTocLink, { passive: true });
        highlightTocLink();
      }
    }

    // Índice de pantalla chica: botón "Índice" y diálogo
    const mobileTocBtn = document.getElementById("mobileTocBtn");
    const mobileTocOverlay = document.getElementById("mobileTocOverlay");
    const closeMobileToc = document.getElementById("closeMobileToc");

    if (mobileTocBtn && mobileTocOverlay) {
      const enfocables = () => [...mobileTocOverlay.querySelectorAll("button, a[href]")];
      mobileTocBtn.addEventListener("click", () => {
        mobileTocOverlay.classList.add("active");
        document.body.style.overflow = "hidden";
        // El foco entra al diálogo (visibility pasa a visible en el mismo cuadro).
        if (closeMobileToc) closeMobileToc.focus();
      });

      // Al cerrar sin elegir sección, el foco vuelve al botón. Con un enlace, lo lleva el
      // manejador de anclas a la sección.
      const closeToc = (devolverFoco) => {
        if (!mobileTocOverlay.classList.contains("active")) return;
        mobileTocOverlay.classList.remove("active");
        document.body.style.overflow = "";
        if (devolverFoco) mobileTocBtn.focus();
      };

      if (closeMobileToc) {
        closeMobileToc.addEventListener("click", () => closeToc(true));
      }

      mobileTocOverlay.addEventListener("click", (e) => {
        if (e.target === mobileTocOverlay) {
          closeToc(true);
        }
      });

      // Escape cierra; Tab no se sale del diálogo mientras está abierto.
      mobileTocOverlay.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          closeToc(true);
        } else if (e.key === "Tab") {
          const f = enfocables();
          const primero = f[0], ultimo = f[f.length - 1];
          if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
          else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
        }
      });

      // Close on link click
      mobileTocOverlay.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => closeToc(false));
      });

      // El botón se esconde mientras se baja leyendo (tapaba el final de los renglones) y
      // vuelve al subir. Arriba de todo queda a la vista. Umbral de 8px para no parpadear.
      let ultimoY = window.scrollY;
      const ocultarAlBajar = () => {
        const y = window.scrollY;
        if (Math.abs(y - ultimoY) < 8) return;
        mobileTocBtn.classList.toggle("is-oculto", y > ultimoY && y > 200);
        ultimoY = y;
      };
      window.addEventListener("scroll", ocultarAlBajar, { passive: true });
    }

    // Escenarios (acordeones)
    const accordionHeaders = document.querySelectorAll(".scenario-accordion-header");
    if (accordionHeaders.length) {
      const toggleAccordion = (header) => {
        const isActive = header.classList.contains("active");
        // El button vive dentro de un <h3>; el contenido se ubica
        // por su id declarado en aria-controls
        const scenarioId = header.getAttribute("aria-controls");
        const content = document.getElementById(scenarioId);
        if (!content) return;

        // Toggle current accordion
        if (isActive) {
          header.classList.remove("active");
          header.setAttribute("aria-expanded", "false");
          content.classList.remove("active");
        } else {
          header.classList.add("active");
          header.setAttribute("aria-expanded", "true");
          content.classList.add("active");
        }
      };

      // Son <button>: Enter y Espacio ya llegan como click.
      accordionHeaders.forEach((header) => {
        header.addEventListener("click", () => toggleAccordion(header));
      });
    }

    // Rail de cifras (scrollytelling, desktop)
    // -----------------------------------------------------
    // Una cifra grande en accent bajo el sticky TOC que se
    // actualiza según la sección visible. El markup #dataRail
    // solo existe en /proyectos/natalidad/ (null-safe). Las cifras
    // son las del contenido de la página, no inventadas.
    const dataRail = document.getElementById("dataRail");
    if (dataRail && "IntersectionObserver" in window) {
      const railValue = dataRail.querySelector(".data-rail-value");
      const railLabel = dataRail.querySelector(".data-rail-label");

      const railFigures = {
        "sec-contexto": {
          value: "−42,8 %",
          label: "población de 4 años en la Ciudad de Buenos Aires, 2016–2026"
        },
        "sec-contexto-general": {
          value: "−27 %",
          label: "matrícula primaria proyectada, 2025–2030 (DNP)"
        },
        "sec-escenarios": {
          value: "3",
          label: "escenarios: tendencial, transformador, disruptivo"
        },
        "sec-oportunidades": {
          value: "−19 a −36 %",
          label: "caída de matrícula según provincia"
        }
      };

      let railTimeout;

      const setRailFigure = (id) => {
        const fig = railFigures[id];
        if (!fig || !railValue || !railLabel) return;
        if (dataRail.dataset.current === id) return;
        dataRail.dataset.current = id;

        const apply = () => {
          railValue.textContent = fig.value;
          railLabel.textContent = fig.label;
        };

        if (prefersReducedMotion) {
          apply();
        } else {
          // Fade out → swap → fade in (transición de opacity en CSS)
          clearTimeout(railTimeout);
          dataRail.classList.add("is-switching");
          railTimeout = setTimeout(() => {
            apply();
            dataRail.classList.remove("is-switching");
          }, 180);
        }
      };

      const railObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setRailFigure(entry.target.id);
            }
          });
        },
        {
          // Banda central del viewport: manda la sección que la cruza
          rootMargin: "-40% 0px -50% 0px",
          threshold: 0
        }
      );

      reporteSections.forEach((sec) => {
        if (sec.id && railFigures[sec.id]) {
          railObserver.observe(sec);
        }
      });
    }
  }

  // =====================================================
  // FILTRO DE ARTÍCULOS
  // -----------------------------------------------------
  // Filtra por movimiento en Pensamiento (única página con
  // .filter-btn; Lo hecho no tiene filtro).
  // =====================================================
  const filterButtons = document.querySelectorAll('.filter-btn');
  const articulos = document.querySelectorAll('.tarjeta[data-tags]');

  if (filterButtons.length > 0 && articulos.length > 0) {
    const applyFilter = (btn) => {
      const filter = btn.getAttribute('data-filter');

      filterButtons.forEach(b => {
        b.classList.remove('filter-btn--active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('filter-btn--active');
      btn.setAttribute('aria-pressed', 'true');

      // La tarjeta que no corresponde se esconde con el atributo hidden: sale de la vista,
      // de la grilla y del árbol de accesibilidad.
      articulos.forEach(articulo => {
        const tags = (articulo.getAttribute('data-tags') || '').split(',');
        articulo.hidden = filter !== 'todos' && !tags.includes(filter);
      });
    };

    // Son <button>: Enter y Espacio ya llegan como click.
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => applyFilter(btn));
    });
  }

  // =====================================================
  // SERVICE TIMELINES
  // -----------------------------------------------------
  // Expandable timeline accordions in service cards
  // =====================================================
  const timelineToggles = document.querySelectorAll('.service-timeline-toggle');

  if (timelineToggles.length) {
    timelineToggles.forEach(toggle => {
      toggle.addEventListener('click', () => {
        const timeline = toggle.nextElementSibling;
        const isExpanded = toggle.getAttribute('aria-expanded') === 'true';

        if (isExpanded) {
          // Collapse
          toggle.setAttribute('aria-expanded', 'false');
          timeline.setAttribute('hidden', '');
          timeline.setAttribute('aria-hidden', 'true');
          toggle.querySelector('span:first-child').textContent = 'Ver proceso';
        } else {
          // Expand
          toggle.setAttribute('aria-expanded', 'true');
          timeline.removeAttribute('hidden');
          timeline.setAttribute('aria-hidden', 'false');
          toggle.querySelector('span:first-child').textContent = 'Ocultar proceso';
        }
      });
    });
  }

});
