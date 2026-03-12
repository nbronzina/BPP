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

  // =====================================================
  // ARROW MICRO-INTERACTIONS
  // -----------------------------------------------------
  // Wrap arrows in CTA buttons with spans for animation
  // =====================================================
  const ctaButtons = document.querySelectorAll('.cta-button, .btn-download');
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
        btn.innerHTML = `<span class="cta-arrow cta-arrow--left">${arrow}</span> ${restText}`;
      } else {
        btn.innerHTML = `${restText} <span class="cta-arrow cta-arrow--right">${arrow}</span>`;
      }
    }
  });


  // =====================================================
  // SCROLL RESTORATION - Asegurar inicio en top
  // =====================================================
  // Prevenir que el navegador restaure la posición de scroll
  // y asegurar que la página siempre inicie en el top
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  // Forzar scroll al top cuando la página carga
  window.scrollTo(0, 0);

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
    mobileMenuBtn.addEventListener("click", () => {
      const isActive = navLinks.classList.toggle("active");
      mobileMenuBtn.setAttribute("aria-expanded", isActive ? "true" : "false");
    });

    // Cerrar menú al hacer click en un link
    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        if (navLinks.classList.contains("active")) {
          navLinks.classList.remove("active");
          mobileMenuBtn.setAttribute("aria-expanded", "false");
        }
      });
    });

    // Cerrar con Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && navLinks.classList.contains("active")) {
        navLinks.classList.remove("active");
        mobileMenuBtn.setAttribute("aria-expanded", "false");
        mobileMenuBtn.focus();
      }
    });

    // Cerrar al hacer click fuera
    document.addEventListener("click", (e) => {
      if (
        navLinks.classList.contains("active") &&
        !navLinks.contains(e.target) &&
        !mobileMenuBtn.contains(e.target)
      ) {
        navLinks.classList.remove("active");
        mobileMenuBtn.setAttribute("aria-expanded", "false");
      }
    });
  }

  // -------------------------
  // Smooth scroll para anclas internas
  // (solo para IDs en la misma página)
// -------------------------
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    const href = anchor.getAttribute("href");
    if (!href || href === "#") return;

    anchor.addEventListener("click", function (e) {
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    });
  });

  // -------------------------
  // Navbar scroll behavior
  // -------------------------
  const nav = document.querySelector("nav");
  if (nav) {
    const handleNavScroll = () => {
      if (window.scrollY > 80) {
        nav.classList.add("nav--scrolled");
      } else {
        nav.classList.remove("nav--scrolled");
      }
    };

    window.addEventListener("scroll", handleNavScroll, { passive: true });
    handleNavScroll(); // Check initial state
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
    // Mark elements as ready for animation
    animatedEls.forEach(el => el.classList.add('animate-ready'));

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

  // Año dinámico en el footer
  const yearSpan = document.getElementById("currentYear");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // =====================================================
  // BLOQUE PWA / SERVICE WORKER
  // -----------------------------------------------------
  // Registra el Service Worker y gestiona el prompt de
  // instalación en páginas que no son legales ni reporte.
  // =====================================================

  // Service Worker (PWA)
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/sw.js")
        .catch(() => {
          // Error silently ignored in production
        });
    });
  }

  // =====================================================
  // BLOQUE FORMULARIO DE CONTACTO
  // -----------------------------------------------------
  // Envía el formulario via fetch a FormSubmit, muestra
  // mensajes de éxito/error y trackea envíos válidos.
  // =====================================================

  const contactForm = document.getElementById("contactForm");
  const formMessage = document.getElementById("formMessage");

  if (contactForm && formMessage) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const submitButton = contactForm.querySelector(".form-submit");
      const formData = new FormData(contactForm);

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "Enviando...";
      }

      formMessage.classList.remove("show", "success", "error");

      try {
        const response = await fetch(contactForm.action, {
          method: "POST",
          body: formData,
          headers: {
            Accept: "application/json",
          },
        });

        if (response.ok) {
          formMessage.textContent =
            "¡Gracias por contactarnos! Te responderemos pronto.";
          formMessage.classList.add("show", "success");
          contactForm.reset();

          trackEvent("Contacto_enviado", { origen: "formulario_principal" });
        } else {
          throw new Error("Error en el envío");
        }
      } catch (error) {
        formMessage.textContent =
          "Hubo un error al enviar el mensaje. Por favor, intentá de nuevo o escribinos a bppanalyticsanddesign@gmail.com";
        formMessage.classList.add("show", "error");
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = "Enviar mensaje";
        }
      }
    });
  }

  // =====================================================
  // BLOQUE TRACKING ESPECÍFICO INDEX
  // -----------------------------------------------------
  // Eventos de clic en CTA principal y tarjetas de
  // actividades que llevan a CESBA o al reporte interno.
// =====================================================

  const ctaHero = document.getElementById("ctaHero");
  if (ctaHero) {
    ctaHero.addEventListener("click", () => {
      trackEvent("CTA_click", {
        seccion: "hero",
        texto: ctaHero.textContent.trim(),
      });
    });
  }

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

  // =====================================================
  // BLOQUE PWA INSTALL PROMPT
  // -----------------------------------------------------
  // Muestra un pequeño aviso para instalar la PWA en
  // páginas regulares. Respeta el “no ahora” con localStorage.
// =====================================================

  if (
    !body.classList.contains("legal-page") &&
    !body.classList.contains("reporte-page")
  ) {
    let deferredPrompt;
    const installPrompt = document.createElement("div");
    installPrompt.className = "pwa-install-prompt";
    installPrompt.innerHTML = `
      <div class="pwa-install-content">
        <p><strong>Instalá BPP</strong></p>
        <p>Accedé más rápido desde tu pantalla de inicio</p>
        <div class="pwa-install-buttons">
          <button type="button" class="pwa-install-btn" id="installPWA">Instalar</button>
          <button type="button" class="pwa-dismiss-btn" id="dismissPWA">Ahora no</button>
        </div>
      </div>
    `;

    // Función helper para mostrar el prompt
    const showInstallPrompt = () => {
      if (deferredPrompt && !document.querySelector('.pwa-install-prompt.show')) {
        document.body.appendChild(installPrompt);
        installPrompt.classList.add("show");
        trackEvent("PWA_prompt_mostrado");
      }
    };

    // Función helper para checkear si pasaron 30 días
    const shouldShowPrompt = () => {
      const dismissed = localStorage.getItem("pwa-dismissed");
      if (!dismissed) return true;

      // Migración automática: convertir formato antiguo "true" a timestamp
      if (dismissed === "true") {
        localStorage.removeItem("pwa-dismissed");
        return true;
      }

      const daysSinceDismiss = (Date.now() - parseInt(dismissed)) / (1000 * 60 * 60 * 24);
      return daysSinceDismiss > 30;
    };

    // Flag para mostrar solo una vez por sesión
    let promptShownThisSession = sessionStorage.getItem("pwa-prompt-shown-session");

    // Detectar iOS para mostrar instrucciones específicas
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isStandalone = window.navigator.standalone === true || window.matchMedia('(display-mode: standalone)').matches;

    // Si es iOS y no está instalada, mostrar instrucciones después de scroll
    if (isIOS && !isStandalone) {
      const showIOSInstructions = () => {
        const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;

        if (scrollPercent > 50 && !promptShownThisSession && shouldShowPrompt()) {
          const iosPrompt = document.createElement("div");
          iosPrompt.className = "pwa-install-prompt";
          iosPrompt.innerHTML = `
            <div class="pwa-install-content">
              <p><strong>Instalá BPP en tu iPhone</strong></p>
              <p style="font-size: 0.9rem; line-height: 1.5;">
                1. Tocá el ícono <strong style="font-size: 1.2rem;">⎙</strong> (Compartir)<br>
                2. Seleccioná <strong>"Agregar a pantalla de inicio"</strong><br>
                3. Confirmá con <strong>"Agregar"</strong>
              </p>
              <div class="pwa-install-buttons">
                <button type="button" class="pwa-dismiss-btn" id="dismissIOSPrompt">Entendido</button>
              </div>
            </div>
          `;
          document.body.appendChild(iosPrompt);
          setTimeout(() => iosPrompt.classList.add("show"), 100);
          sessionStorage.setItem("pwa-prompt-shown-session", "true");
          promptShownThisSession = true;
          trackEvent("PWA_prompt_iOS_mostrado");

          document.getElementById("dismissIOSPrompt")?.addEventListener("click", () => {
            iosPrompt.classList.remove("show");
            setTimeout(() => iosPrompt.remove(), 300);
            localStorage.setItem("pwa-dismissed", Date.now().toString());
            trackEvent("PWA_accion", { accion: "dismissed", platform: "iOS" });
          });

          window.removeEventListener("scroll", showIOSInstructions);
        }
      };

      window.addEventListener("scroll", showIOSInstructions, { passive: true });
    }

    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      deferredPrompt = e;

      // Mostrar botón manual en footer
      const manualInstallBtn = document.getElementById("manual-install-pwa");
      const pwaSeparator = document.getElementById("pwa-separator");
      if (manualInstallBtn) {
        manualInstallBtn.style.display = "inline-flex";
      }
      if (pwaSeparator) {
        pwaSeparator.style.display = "inline";
      }

      // Mostrar prompt automático al hacer scroll (50% de la página)
      const handleScroll = () => {
        const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;

        if (scrollPercent > 50 && !promptShownThisSession && shouldShowPrompt()) {
          showInstallPrompt();
          sessionStorage.setItem("pwa-prompt-shown-session", "true");
          promptShownThisSession = true;
          window.removeEventListener("scroll", handleScroll);
        }
      };

      window.addEventListener("scroll", handleScroll, { passive: true });
    });

    document.addEventListener("click", async (e) => {
      // Botón "Instalar" del prompt automático
      if (e.target && e.target.id === "installPWA") {
        if (deferredPrompt) {
          installPrompt.classList.remove("show");
          deferredPrompt.prompt();
          const { outcome } = await deferredPrompt.userChoice;
          trackEvent("PWA_accion", { accion: outcome });
          deferredPrompt = null;
          installPrompt.remove();
        }
      }

      // Botón "Ahora no" - guardar timestamp
      if (e.target && e.target.id === "dismissPWA") {
        installPrompt.classList.remove("show");
        setTimeout(() => installPrompt.remove(), 300);
        localStorage.setItem("pwa-dismissed", Date.now().toString());
        trackEvent("PWA_accion", { accion: "dismissed" });
      }

      // Botón manual en footer
      if (e.target && e.target.id === "manual-install-pwa") {
        if (deferredPrompt) {
          deferredPrompt.prompt();
          const { outcome } = await deferredPrompt.userChoice;
          trackEvent("PWA_accion", { accion: outcome, source: "manual_button" });

          if (outcome === "accepted") {
            e.target.style.display = "none";
          }
        }
      }
    });

    window.addEventListener("appinstalled", () => {
      deferredPrompt = null;
      if (installPrompt.parentNode) {
        installPrompt.remove();
      }

      // Ocultar botón manual
      const manualInstallBtn = document.getElementById("manual-install-pwa");
      const pwaSeparator = document.getElementById("pwa-separator");
      if (manualInstallBtn) {
        manualInstallBtn.style.display = "none";
      }
      if (pwaSeparator) {
        pwaSeparator.style.display = "none";
      }

      trackEvent("PWA_instalada");
    });
  }

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
      accordionHeaders.forEach((header) => {
        header.addEventListener("click", () => {
          const isActive = header.classList.contains("active");
          const content = header.nextElementSibling;
          const scenarioId = content.getAttribute("id");

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
        });
      });
    }

    // 5. Sticky Download Bar (Mobile)
    const stickyDownloadBar = document.getElementById("stickyDownloadBar");
    if (stickyDownloadBar) {
      const handleDownloadBar = () => {
        const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
        const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercentage = (scrollPosition / documentHeight) * 100;

        // Show after 30% scroll, hide when near bottom (95%)
        if (scrollPercentage > 30 && scrollPercentage < 95) {
          stickyDownloadBar.classList.add("visible");
        } else {
          stickyDownloadBar.classList.remove("visible");
        }
      };

      window.addEventListener("scroll", handleDownloadBar);
      handleDownloadBar();

      // Track download bar clicks
      stickyDownloadBar.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
          trackEvent("Descarga_sticky_bar", {
            archivo: link.textContent.trim()
          });
        });
      });
    }

    // 6. Share Button Tracking
    if (shareButtons) {
      shareButtons.querySelectorAll("a").forEach((btn) => {
        btn.addEventListener("click", () => {
          const platform = btn.getAttribute("aria-label").includes("LinkedIn")
            ? "linkedin"
            : btn.getAttribute("aria-label").includes("Twitter")
            ? "twitter"
            : "email";
          trackEvent("Compartir_reporte", { plataforma: platform });
        });
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
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
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
      });
    });
  }
});
