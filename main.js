// =====================================================
// main.js – Comportamiento global del sitio de BPP
// -----------------------------------------------------
// Contiene navegación responsive, animaciones de scroll,
// tracking con Plausible, formulario de contacto,
// soporte PWA y lógica específica para páginas internas
// (política de privacidad y reporte de impacto).
// =====================================================

// =========================
// Helper de tracking (Plausible)
// Centraliza los eventos para evitar errores si el script
// aún no cargó o no está disponible.
// =========================
function trackEvent(name, props) {
  if (window.plausible && typeof window.plausible === "function") {
    window.plausible(name, { props: props || {} });
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const body = document.body;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // =====================================================
  // ARROW MICRO-INTERACTIONS
  // -----------------------------------------------------
  // Wrap arrows in CTA buttons with spans for animation
  // =====================================================
  const ctaButtons = document.querySelectorAll('.cta-primary');
  ctaButtons.forEach(btn => {
    const text = btn.textContent;
    // Match arrow characters (→, ←, ↓, ↑) at start or end of text
    const arrowPattern = /(^[→←↓↑]\s+)|(\s+[→←↓↑]$)/;
    const match = text.match(arrowPattern);

    if (match) {
      const arrow = match[0].trim();
      const isAtStart = match[1] !== undefined;
      const restText = text.replace(arrowPattern, '').trim();

      if (isAtStart) {
        btn.innerHTML = `<span class="cta-arrow cta-arrow--left" aria-hidden="true">${arrow}</span> ${restText}`;
      } else {
        btn.innerHTML = `${restText} <span class="cta-arrow cta-arrow--right" aria-hidden="true">${arrow}</span>`;
      }
    }
  });


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
      // Match exact paths or parent directories
      if (linkPath === currentPath ||
          (currentPath.startsWith(linkPath) && linkPath !== '/' && linkPath !== '../')) {
        link.classList.add('current-page');
        link.setAttribute('aria-current', 'page');
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

    mobileMenuBtn.addEventListener("click", toggleMenu);

    // Keyboard support for Enter and Space keys
    mobileMenuBtn.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleMenu();
      }
    });

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
      }
    });
  });

  // -------------------------
  // Hero → Navbar logo crossfade (Superflux pattern with IntersectionObserver)
  // -------------------------
  const heroLogo = document.querySelector('.hero-logo-large');
  const NAV_HEIGHT = 72; // Navbar height in pixels

  if (heroLogo && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Toggle .logo-pinned class when hero logo crosses navbar bottom edge
        document.body.classList.toggle('logo-pinned', !entry.isIntersecting);
      },
      {
        // Trigger when hero logo crosses navbar height
        rootMargin: `-${NAV_HEIGHT}px 0px 0px 0px`,
        threshold: 0
      }
    );

    observer.observe(heroLogo);
  } else if (heroLogo) {
    // Fallback for browsers without IntersectionObserver
    const handleScrollFallback = () => {
      const logoRect = heroLogo.getBoundingClientRect();
      document.body.classList.toggle('logo-pinned', logoRect.bottom < NAV_HEIGHT);
    };
    window.addEventListener('scroll', handleScrollFallback, { passive: true });
    handleScrollFallback();
  }

  // =====================================================
  // CARD REVEAL - Actividades (Hechos section)
  // -----------------------------------------------------
  // Revela cards completas (imagen + texto) con fade-up
  // =====================================================
  const actividadCards = document.querySelectorAll('.actividad-entrada');

  if (actividadCards.length && 'IntersectionObserver' in window) {
    const cardObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            cardObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -80px 0px'
      }
    );

    actividadCards.forEach(card => cardObserver.observe(card));
  }

  // =====================================================
  // BLOQUE TRACKING / ANIMACIONES
  // -----------------------------------------------------
  // IntersectionObserver para animar elementos con
  // [data-animate] y registrar secciones vistas.
// =====================================================

  const animatedEls = document.querySelectorAll("[data-animate]");
  const trackedSections = new Set();

  if (animatedEls.length && "IntersectionObserver" in window) {
    // Mark elements as ready for animation only if motion is allowed
    if (!prefersReducedMotion) {
      animatedEls.forEach(el => el.classList.add('animate-ready'));
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");

            const section = entry.target.closest("section");
            if (section && section.id && !trackedSections.has(section.id)) {
              trackedSections.add(section.id);
              trackEvent("Seccion_vista", { id: section.id });
            }
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    animatedEls.forEach((el) => observer.observe(el));
  }

  // Año dinámico en el footer (i18n-aware)
  const yearSpan = document.getElementById("currentYear");
  if (yearSpan) {
    yearSpan.textContent = new Intl.DateTimeFormat('es-AR', { year: 'numeric' }).format(new Date());
  }

  // =====================================================
  // BLOQUE TRACKING ESPECÍFICO INDEX
  // -----------------------------------------------------
  // Eventos de clic en CTA con intent-level segmentation
  // =====================================================

  // Track all CTA clicks with intent level
  function trackCTAClick(event) {
    const target = event.currentTarget;
    const ctaText = target.textContent.trim();
    const page = window.location.pathname || '/';

    // Determine intent level from CSS class
    let intentLevel = 'mid'; // default
    if (target.classList.contains('cta-primary')) {
      intentLevel = 'high';
    } else if (target.classList.contains('cta-link')) {
      intentLevel = 'mid';
    }

    trackEvent("CTA_clicked", {
      intent_level: intentLevel,
      page: page,
      cta_text: ctaText
    });
  }

  // Attach listeners to all CTA buttons and links
  const allCTAs = document.querySelectorAll('.cta-primary, .cta-link');
  allCTAs.forEach(cta => {
    cta.addEventListener('click', trackCTAClick);
  });

  const linkCesba = document.getElementById("linkCesba");
  if (linkCesba) {
    linkCesba.addEventListener("click", () => {
      trackEvent("Actividad_click", { tipo: "externo", destino: "CESBA" });
    });
  }

  const linkReporteNatalidad = document.getElementById("linkReporteNatalidad");
  if (linkReporteNatalidad) {
    linkReporteNatalidad.addEventListener("click", () => {
      trackEvent("Actividad_click", {
        tipo: "interno",
        destino: "reporte_impacto_natalidad",
      });
    });
  }

  // Contacto directo: un click en cualquier mailto cuenta como conversación iniciada
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="mailto:"]');
    if (!a) return;
    const section = a.closest("section, footer");
    trackEvent("Contacto_mail", { ubicacion: section && section.id ? section.id : (section ? section.tagName.toLowerCase() : "desconocida") });
  });

  // =====================================================
  // BLOQUE PÁGINA DE PRIVACIDAD (legal-page)
  // -----------------------------------------------------
  // Eventos de tracking específicos para la política de
  // privacidad: vista de página y clic en mail de contacto.
  // =====================================================

  if (body.classList.contains("legal-page")) {
    window.addEventListener("load", function () {
      trackEvent("Pagina_privacidad_vista");
    });

    const privacyEmailLink = document.getElementById("privacyEmailLink");
    if (privacyEmailLink) {
      privacyEmailLink.addEventListener("click", function () {
        trackEvent("Privacidad_contacto_click");
      });
    }
  }

  // =====================================================
  // BLOQUE REPORTE DE IMPACTO (reporte-page)
  // -----------------------------------------------------
  // Trackea qué secciones del reporte se vieron y las
  // descargas de PDFs asociados.
// =====================================================

  if (body.classList.contains("reporte-page")) {
    const reporteSections = document.querySelectorAll("section.reporte-section");
    const seenReportSections = new Set();

    if (reporteSections.length && "IntersectionObserver" in window) {
      const sectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const sec = entry.target;
              if (sec.id && !seenReportSections.has(sec.id)) {
                seenReportSections.add(sec.id);
                trackEvent("Reporte_seccion_vista", { id: sec.id });
              }
            }
          });
        },
        {
          threshold: 0.2,
          rootMargin: "0px 0px -50px 0px",
        }
      );

      reporteSections.forEach((sec) => sectionObserver.observe(sec));
    }

    // Tracking descargas de PDFs
    const downloadInformePrincipal = document.getElementById(
      "downloadInformePrincipal"
    );
    if (downloadInformePrincipal) {
      downloadInformePrincipal.addEventListener("click", () => {
        trackEvent("PDF_descarga", { tipo: "reporte_principal" });
      });
    }

    const downloadEstudioRegional = document.getElementById(
      "downloadEstudioRegional"
    );
    if (downloadEstudioRegional) {
      downloadEstudioRegional.addEventListener("click", () => {
        trackEvent("PDF_descarga", { tipo: "estudio_regional" });
      });
    }

    // =====================================================
    // OPTIMIZACIONES REPORTE DE IMPACTO
    // -----------------------------------------------------
    // Reading progress bar, sticky TOC, mobile TOC,
    // scenario accordions, share buttons, sticky download bar
    // =====================================================

    // 1. Reading Progress Bar
    const progressBar = document.getElementById("readingProgressBar");
    if (progressBar) {
      const updateProgressBar = () => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const progress = (scrollTop / documentHeight) * 100;
        progressBar.style.width = progress + "%";
      };

      window.addEventListener("scroll", updateProgressBar);
      updateProgressBar();
    }

    // 2. Sticky TOC (Desktop)
    const stickyToc = document.getElementById("stickyToc");
    const shareButtons = document.getElementById("shareButtons");
    if (stickyToc || shareButtons) {
      const handleStickyElements = () => {
        const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
        const showThreshold = 400; // Show after scrolling 400px

        if (stickyToc) {
          if (scrollPosition > showThreshold) {
            stickyToc.classList.add("visible");
          } else {
            stickyToc.classList.remove("visible");
          }
        }

        if (shareButtons) {
          if (scrollPosition > showThreshold) {
            shareButtons.classList.add("visible");
          } else {
            shareButtons.classList.remove("visible");
          }
        }
      };

      window.addEventListener("scroll", handleStickyElements);
      handleStickyElements();

      // Highlight active section in TOC
      if (stickyToc) {
        const tocLinks = stickyToc.querySelectorAll("a");
        const sections = document.querySelectorAll("section[id]");

        const highlightTocLink = () => {
          let current = "";
          sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop - 200) {
              current = section.getAttribute("id");
            }
          });

          tocLinks.forEach((link) => {
            link.classList.remove("active");
            if (link.getAttribute("href") === "#" + current) {
              link.classList.add("active");
            }
          });
        };

        window.addEventListener("scroll", highlightTocLink);
        highlightTocLink();
      }
    }

    // 3. Mobile TOC Toggle
    const mobileTocBtn = document.getElementById("mobileTocBtn");
    const mobileTocOverlay = document.getElementById("mobileTocOverlay");
    const closeMobileToc = document.getElementById("closeMobileToc");

    if (mobileTocBtn && mobileTocOverlay) {
      mobileTocBtn.addEventListener("click", () => {
        mobileTocOverlay.classList.add("active");
        document.body.style.overflow = "hidden";
        trackEvent("Mobile_TOC_abierto");
      });

      const closeToc = () => {
        mobileTocOverlay.classList.remove("active");
        document.body.style.overflow = "";
      };

      if (closeMobileToc) {
        closeMobileToc.addEventListener("click", closeToc);
      }

      mobileTocOverlay.addEventListener("click", (e) => {
        if (e.target === mobileTocOverlay) {
          closeToc();
        }
      });

      // Close on link click
      mobileTocOverlay.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", closeToc);
      });
    }

    // 4. Scenario Accordions
    const accordionHeaders = document.querySelectorAll(".scenario-accordion-header");
    if (accordionHeaders.length) {
      const toggleAccordion = (header) => {
        const isActive = header.classList.contains("active");
        // El button vive dentro de un <h3>; el contenido se ubica
        // por su id declarado en aria-controls
        const scenarioId = header.getAttribute("aria-controls");
        const content = document.getElementById(scenarioId);
        if (!content) return;

        // Close all other accordions (optional - remove if you want multiple open)
        // accordionHeaders.forEach(h => {
        //   if (h !== header) {
        //     h.classList.remove("active");
        //     h.setAttribute("aria-expanded", "false");
        //     h.nextElementSibling.classList.remove("active");
        //   }
        // });

        // Toggle current accordion
        if (isActive) {
          header.classList.remove("active");
          header.setAttribute("aria-expanded", "false");
          content.classList.remove("active");
        } else {
          header.classList.add("active");
          header.setAttribute("aria-expanded", "true");
          content.classList.add("active");
          trackEvent("Escenario_expandido", { id: scenarioId });
        }
      };

      accordionHeaders.forEach((header) => {
        header.addEventListener("click", () => toggleAccordion(header));

        // Keyboard support for Enter and Space
        header.addEventListener("keydown", (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleAccordion(header);
          }
        });
      });
    }

    // 5. Sticky Download Bar (Mobile)

    // 6. Share Button Tracking
    if (shareButtons) {
      shareButtons.querySelectorAll("a").forEach((btn) => {
        btn.addEventListener("click", () => {
          const label = btn.getAttribute("aria-label") || "";
          const platform = label.includes("LinkedIn")
            ? "linkedin"
            : label.includes("Twitter")
            ? "twitter"
            : "email";
          trackEvent("Compartir_reporte", { plataforma: platform });
        });
      });
    }

    // 7. Rail de cifras (scrollytelling, desktop)
    // -----------------------------------------------------
    // Extiende el patrón IntersectionObserver del reporte:
    // una cifra grande en accent bajo el sticky TOC que se
    // actualiza según la sección visible. El markup #dataRail
    // solo existe en /reporte-impacto (null-safe). Las cifras
    // son las del contenido de la página, no inventadas.
    const dataRail = document.getElementById("dataRail");
    if (dataRail && "IntersectionObserver" in window) {
      const railValue = dataRail.querySelector(".data-rail-value");
      const railLabel = dataRail.querySelector(".data-rail-label");

      const railFigures = {
        "sec-contexto": {
          value: "−55,8 %",
          label: "nacimientos en San Antonio de Areco, 2014–2024"
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
  // FILTROS DE PROYECTOS
  // -----------------------------------------------------
  // Sistema de filtrado por categorías en página de Hechos
  // =====================================================
  const filterButtons = document.querySelectorAll('.filter-btn');
  const proyectos = document.querySelectorAll('.actividad-entrada');

  if (filterButtons.length > 0 && proyectos.length > 0) {
    const applyFilter = (btn) => {
      const filter = btn.getAttribute('data-filter');

      // Update active state
      filterButtons.forEach(b => {
        b.classList.remove('filter-btn--active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('filter-btn--active');
      btn.setAttribute('aria-pressed', 'true');

      // Filter projects
      proyectos.forEach(proyecto => {
        if (filter === 'todos') {
          proyecto.classList.remove('hidden');
        } else {
          const tags = proyecto.getAttribute('data-tags') || '';
          if (tags.includes(filter)) {
            proyecto.classList.remove('hidden');
          } else {
            proyecto.classList.add('hidden');
          }
        }
      });

      // Track filter usage
      trackEvent('Filtro_proyectos', { categoria: filter });
    };

    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => applyFilter(btn));

      // Keyboard support for Enter and Space
      btn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          applyFilter(btn);
        }
      });
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

          // Track expansion
          const categoryEl = toggle.closest('.service-block')?.querySelector('.service-category');
          trackEvent('Timeline_expandido', { servicio: categoryEl ? categoryEl.textContent : 'desconocido' });
        }
      });
    });
  }

  // =====================================================
  // MINI TARJETAS DESPLEGABLES PARA TÉRMINOS CLAVE
  // -----------------------------------------------------
  // Patrón disclosure (WAI-ARIA): al tocar el término se
  // despliega una tarjeta real en el flujo del documento,
  // debajo del bloque que lo contiene. Reemplaza a los
  // tooltips flotantes (pseudo-elementos posicionados).
  // =====================================================
  const tooltipTerms = document.querySelectorAll('.tooltip-term');

  if (tooltipTerms.length) {
    const closeAllCards = (except) => {
      tooltipTerms.forEach(t => {
        if (t !== except && t.getAttribute('aria-expanded') === 'true') {
          t.setAttribute('aria-expanded', 'false');
          const card = document.getElementById(t.getAttribute('aria-controls'));
          if (card) {
            card.hidden = true;
          }
        }
      });
    };

    tooltipTerms.forEach((term, index) => {
      const cardId = `term-card-${index}`;
      const card = document.createElement('span');
      card.id = cardId;
      card.className = 'term-card';
      card.hidden = true;

      const label = document.createElement('span');
      label.className = 'term-card-label';
      label.textContent = term.textContent;

      const text = document.createElement('span');
      text.className = 'term-card-text';
      text.textContent = term.getAttribute('data-tooltip');

      card.appendChild(label);
      card.appendChild(text);

      // La tarjeta se inserta después del bloque contenedor para no
      // romper la línea a mitad de oración
      const block = term.closest('p, li, legend, h2, h3, .service-deliverable') || term.parentElement;
      block.insertAdjacentElement('afterend', card);

      term.setAttribute('tabindex', '0');
      term.setAttribute('role', 'button');
      term.setAttribute('aria-expanded', 'false');
      term.setAttribute('aria-controls', cardId);

      const toggleCard = () => {
        const isOpen = term.getAttribute('aria-expanded') === 'true';
        closeAllCards(term);
        term.setAttribute('aria-expanded', String(!isOpen));
        card.hidden = isOpen;
      };

      term.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleCard();
      });

      term.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleCard();
        }
      });
    });

    // Cerrar al hacer clic fuera (clic dentro de la tarjeta no la cierra)
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.tooltip-term') && !e.target.closest('.term-card')) {
        closeAllCards();
      }
    });

    // Cerrar con Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeAllCards();
      }
    });
  }

});
