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
    const toggleMenu = () => {
      const isActive = navLinks.classList.toggle("active");
      mobileMenuBtn.setAttribute("aria-expanded", isActive ? "true" : "false");
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
  // BLOQUE TRACKING / ANIMACIONES
  // -----------------------------------------------------
  // IntersectionObserver para animar elementos con
  // [data-animate] y registrar secciones vistas.
// =====================================================

  const animatedEls = document.querySelectorAll("[data-animate]");
  const trackedSections = new Set();
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
  // Incluye autosave con TTL de 24 horas para protección PII.
  // =====================================================

  const contactForm = document.getElementById("contactForm");
  const formMessage = document.getElementById("formMessage");

  // =====================================================
  // FORM AUTOSAVE con TTL de 24 horas
  // =====================================================
  const AUTOSAVE_KEY = 'bpp_form_autosave';
  const AUTOSAVE_TTL = 24 * 60 * 60 * 1000; // 24 horas en milisegundos
  let autosaveTimeout;

  function saveFormState() {
    if (!contactForm) return;

    const formData = {
      name: document.getElementById('name')?.value || '',
      email: document.getElementById('email')?.value || '',
      organization: document.getElementById('organization')?.value || '',
      challenge: document.getElementById('challenge')?.value || '',
      timeline: document.getElementById('timeline')?.value || '',
      message: document.getElementById('message')?.value || ''
    };

    // Solo guardar si al menos un campo tiene contenido
    const hasContent = Object.values(formData).some(val => val.trim() !== '');

    if (!hasContent) {
      // Si no hay contenido, eliminar autosave existente
      localStorage.removeItem(AUTOSAVE_KEY);
      return;
    }

    try {
      const autosaveData = {
        fields: formData,
        saved_at: Date.now()
      };
      localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(autosaveData));

      // Track autosave event
      const fieldsFilledCount = Object.values(formData).filter(val => val.trim() !== '').length;
      trackEvent('Form_autosaved', { fields_filled: fieldsFilledCount });
    } catch (e) {
      // QuotaExceededError o otros errores de localStorage
      console.warn('Form autosave failed:', e.message);
    }
  }

  function restoreFormState() {
    if (!contactForm) return;

    try {
      const savedData = localStorage.getItem(AUTOSAVE_KEY);
      if (!savedData) return;

      const autosaveData = JSON.parse(savedData);
      const age = Date.now() - autosaveData.saved_at;

      // Si el autosave tiene más de 24 horas, eliminarlo
      if (age > AUTOSAVE_TTL) {
        localStorage.removeItem(AUTOSAVE_KEY);
        trackEvent('Form_cleared', { reason: 'ttl_expired' });
        return;
      }

      // Restaurar campos
      const fields = autosaveData.fields;
      if (fields.name) document.getElementById('name').value = fields.name;
      if (fields.email) document.getElementById('email').value = fields.email;
      if (fields.organization) document.getElementById('organization').value = fields.organization;
      if (fields.challenge) document.getElementById('challenge').value = fields.challenge;
      if (fields.timeline) document.getElementById('timeline').value = fields.timeline;
      if (fields.message) document.getElementById('message').value = fields.message;

      // Mostrar toast de confirmación
      showAutosaveToast();

      // Track restore event
      const fieldsCount = Object.values(fields).filter(val => val && val.trim() !== '').length;
      trackEvent('Form_restored', { fields_count: fieldsCount });
    } catch (e) {
      // JSON parse error o datos corruptos
      console.warn('Form restore failed:', e.message);
      localStorage.removeItem(AUTOSAVE_KEY);
    }
  }

  function clearFormAutosave() {
    localStorage.removeItem(AUTOSAVE_KEY);
    trackEvent('Form_cleared', { reason: 'user_action' });
  }

  function showAutosaveToast() {
    // Crear toast si no existe
    let toast = document.getElementById('autosave-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'autosave-toast';
      toast.className = 'autosave-toast';
      toast.innerHTML = `
        <span>Restauramos tu borrador</span>
        <button type="button" class="autosave-toast-close" aria-label="Cerrar notificación">×</button>
        <button type="button" class="autosave-toast-clear">Borrar borrador</button>
      `;
      document.body.appendChild(toast);

      // Botón cerrar toast
      toast.querySelector('.autosave-toast-close').addEventListener('click', () => {
        toast.classList.remove('show');
      });

      // Botón borrar borrador
      toast.querySelector('.autosave-toast-clear').addEventListener('click', () => {
        clearFormAutosave();
        contactForm.reset();
        toast.classList.remove('show');
      });
    }

    // Mostrar toast
    toast.classList.add('show');

    // Auto-ocultar después de 10 segundos
    setTimeout(() => {
      toast.classList.remove('show');
    }, 10000);
  }

  if (contactForm && formMessage) {
    // Restaurar autosave al cargar la página
    restoreFormState();

    // Event listeners para autosave (debounced 500ms)
    const formInputs = contactForm.querySelectorAll('input:not([type="hidden"]), textarea, select');
    formInputs.forEach(input => {
      input.addEventListener('input', () => {
        clearTimeout(autosaveTimeout);
        autosaveTimeout = setTimeout(saveFormState, 500);
      });
    });

    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const submitButton = contactForm.querySelector(".form-submit");
      const formData = new FormData(contactForm);

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.classList.add("is-loading");
        submitButton.textContent = "Enviando…";
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

          // Clear autosave before resetting form
          clearFormAutosave();
          contactForm.reset();

          // Track submission with challenge and timeline data
          const challengeFilled = formData.get('challenge') ? 'yes' : 'no';
          const timelineValue = formData.get('timeline') || 'not_selected';
          trackEvent("Contacto_enviado", {
            origen: "formulario_principal",
            challenge: challengeFilled,
            timeline: timelineValue
          });
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
          submitButton.classList.remove("is-loading");
          submitButton.textContent = "Enviar mensaje";
        }
      }
    });
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
      const toggleAccordion = (header) => {
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
  // QUIZ METHODOLOGY TOGGLE
  // -----------------------------------------------------
  // Collapsible methodology section explaining framework
  // =====================================================
  const methodologyToggle = document.querySelector('.methodology-toggle');
  const methodologyContent = document.querySelector('.methodology-content');

  if (methodologyToggle && methodologyContent) {
    const toggleMethodology = () => {
      const isExpanded = methodologyToggle.getAttribute('aria-expanded') === 'true';

      methodologyToggle.setAttribute('aria-expanded', !isExpanded);

      if (isExpanded) {
        methodologyContent.style.display = 'none';
      } else {
        methodologyContent.style.display = 'block';
        trackEvent('Quiz_metodologia_expandida');
      }
    };

    methodologyToggle.addEventListener('click', toggleMethodology);

    // Keyboard support for Enter and Space
    methodologyToggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleMethodology();
      }
    });
  }

  // =====================================================
  // QUIZ DIAGNÓSTICO - CAROUSEL VERSION
  // -----------------------------------------------------
  // Interactive assessment with carousel navigation,
  // instant scoring and personalized recommendations
  // =====================================================
  const quizQuestions = document.getElementById('quiz-questions');
  const quizResults = document.getElementById('quiz-results');
  const quizSubmitBtn = document.getElementById('quiz-submit');
  const quizResetBtn = document.getElementById('quiz-reset');
  const quizPrevBtn = document.getElementById('quiz-prev');
  const quizNextBtn = document.getElementById('quiz-next');
  const quizProgressText = document.getElementById('quiz-current-question');
  const quizProgressFill = document.getElementById('quiz-progress-fill');

  if (quizQuestions && quizResults && quizSubmitBtn && quizResetBtn && quizPrevBtn && quizNextBtn) {
    const allQuestions = document.querySelectorAll('.quiz-question');
    const totalQuestions = allQuestions.length;
    let currentQuestion = 0;

    // Update progress indicator
    const updateProgress = () => {
      quizProgressText.textContent = currentQuestion + 1;
      const progressPercent = ((currentQuestion + 1) / totalQuestions) * 100;
      quizProgressFill.style.width = `${progressPercent}%`;
    };

    // Show specific question
    const showQuestion = (index) => {
      allQuestions.forEach((q, i) => {
        q.classList.toggle('active', i === index);
      });

      // Update navigation buttons - hide Anterior on first question
      if (index === 0) {
        quizPrevBtn.style.display = 'none';
      } else {
        quizPrevBtn.style.display = 'block';
      }

      // Check if current question is answered
      const currentQuestionElement = allQuestions[index];
      const questionNumber = currentQuestionElement.getAttribute('data-question');
      const isAnswered = document.querySelector(`input[name="q${questionNumber}"]:checked`);

      // If on last question and all answered, show submit button
      if (index === totalQuestions - 1 && checkAllAnswered()) {
        quizNextBtn.style.display = 'none';
        quizSubmitBtn.style.display = 'block';
        quizSubmitBtn.disabled = false;
      } else {
        quizNextBtn.style.display = 'block';
        quizSubmitBtn.style.display = 'none';
        quizNextBtn.disabled = !isAnswered; // Disable next if current not answered
      }

      updateProgress();
    };

    // Check if all questions are answered
    const checkAllAnswered = () => {
      for (let i = 1; i <= totalQuestions; i++) {
        if (!document.querySelector(`input[name="q${i}"]:checked`)) {
          return false;
        }
      }
      return true;
    };

    // Update button state when radio changes
    const updateNavigationState = () => {
      const questionNumber = allQuestions[currentQuestion].getAttribute('data-question');
      const isAnswered = document.querySelector(`input[name="q${questionNumber}"]:checked`);

      if (currentQuestion === totalQuestions - 1) {
        if (checkAllAnswered()) {
          quizNextBtn.style.display = 'none';
          quizSubmitBtn.style.display = 'block';
          quizSubmitBtn.disabled = false;
        }
      } else {
        quizNextBtn.disabled = !isAnswered;
      }
    };

    // Listen for radio button changes
    document.querySelectorAll('.quiz-question input[type="radio"]').forEach(input => {
      input.addEventListener('change', updateNavigationState);
    });

    // Previous button
    quizPrevBtn.addEventListener('click', () => {
      if (currentQuestion > 0) {
        currentQuestion--;
        showQuestion(currentQuestion);
      }
    });

    // Next button
    quizNextBtn.addEventListener('click', () => {
      if (currentQuestion < totalQuestions - 1) {
        currentQuestion++;
        showQuestion(currentQuestion);
      }
    });

    // Initialize first question
    showQuestion(0);

    // Calculate score and show results
    quizSubmitBtn.addEventListener('click', () => {
      const q1 = parseInt(document.querySelector('input[name="q1"]:checked').value);
      const q2 = parseInt(document.querySelector('input[name="q2"]:checked').value);
      const q3 = parseInt(document.querySelector('input[name="q3"]:checked').value);
      const q4 = parseInt(document.querySelector('input[name="q4"]:checked').value);
      const q5 = parseInt(document.querySelector('input[name="q5"]:checked').value);

      const totalScore = q1 + q2 + q3 + q4 + q5;

      // Determine score label and description
      let scoreLabel, scoreDescription, recommendations;

      if (totalScore <= 40) {
        scoreLabel = 'Nivel Inicial';
        scoreDescription = 'Tu organización todavía reacciona ante el cambio en lugar de anticiparlo. Las decisiones se toman con información limitada y sin marcos conceptuales claros. Empezá por construir claridad narrativa antes de agregar complejidad estratégica.';
        recommendations = [
          {
            title: 'Branding y comunicación estratégica',
            description: 'Construí un relato coherente sobre quién sos y hacia dónde vas. Cuando algo cambia, la marca que no se explica pierde. Empezá por definir tu voz antes de que otros definan tu narrativa.',
            link: '#services',
            cta: 'Ver servicio de Branding'
          },
          {
            title: 'Investigación exploratoria',
            description: 'Empezá a identificar señales tempranas de cambio antes de que se conviertan en crisis. Un mapeo inicial de escenarios futuros te permite anticipar en lugar de reaccionar.',
            link: '#services',
            cta: 'Ver servicio de Investigación'
          }
        ];
      } else if (totalScore <= 70) {
        scoreLabel = 'Nivel Intermedio';
        scoreDescription = 'Tu organización tiene algunas capacidades instaladas pero todavía hay brechas críticas. Hacés algunas cosas bien pero de forma inconsistente. El siguiente paso es destrabar la ejecución y sistematizar el monitoreo de cambios.';
        recommendations = [
          {
            title: 'Gestión estratégica de proyectos',
            description: 'El plan existe, el equipo está, pero nada avanza. No se trata de metodologías — se trata de entender las dinámicas sociales que frenan la ejecución. Diagnosticamos bloqueos y alineamos stakeholders.',
            link: '#services',
            cta: 'Ver servicio de Gestión estratégica'
          },
          {
            title: 'Investigación exploratoria',
            description: 'Convertí la identificación de señales en un proceso continuo, no un ejercicio ocasional. Un sistema de monitoreo estructurado te permite ver qué viene antes de que te obligue a reaccionar.',
            link: '#services',
            cta: 'Ver servicio de Investigación'
          },
          {
            title: 'Diseño de prototipos',
            description: 'Pasá de prototipar ocasionalmente a hacerlo de forma sistemática. Cada hipótesis debería testearse con un artefacto concreto antes de comprometer recursos completos.',
            link: '#services',
            cta: 'Ver servicio de Prototipos'
          }
        ];
      } else {
        scoreLabel = 'Nivel Avanzado';
        scoreDescription = 'Tu organización tiene capacidades maduras para decidir bajo incertidumbre. El siguiente paso no es construir capacidades nuevas, sino profundizar las que tenés: hacerlas más sofisticadas, integradas, y convertir prospectiva en operación continua.';
        recommendations = [
          {
            title: 'Investigación exploratoria avanzada',
            description: 'Convertí el monitoreo de señales en investigación estructurada. No solo qué está cambiando, sino por qué, hacia dónde, y qué estructuras sociales, económicas y culturales lo están impulsando.',
            link: '#services',
            cta: 'Ver servicio de Investigación'
          },
          {
            title: 'Diseño de prototipos y design fiction',
            description: 'Pasá de escenarios a prototipos de futuros alternativos. El design fiction te permite testear cómo sería vivir en un futuro específico antes de que llegue. Es investigación especulativa aplicada a decisiones estratégicas.',
            link: '#services',
            cta: 'Ver servicio de Prototipos'
          }
        ];
      }

      // Display results
      document.getElementById('score-label').textContent = scoreLabel;
      document.getElementById('score-value').textContent = totalScore;
      document.getElementById('results-description').textContent = scoreDescription;

      // Render recommendations
      const recommendationsList = document.getElementById('recommendations-list');
      recommendationsList.innerHTML = '';
      recommendations.forEach(rec => {
        const recItem = document.createElement('div');
        recItem.className = 'recommendation-item';
        recItem.innerHTML = `
          <h5 class="recommendation-title">${rec.title}</h5>
          <p class="recommendation-description">${rec.description}</p>
          ${rec.link ? `<a href="${rec.link}" class="recommendation-cta">${rec.cta || 'Ver más'} <span aria-hidden="true">→</span></a>` : ''}
        `;
        recommendationsList.appendChild(recItem);
      });

      // Hide questions, show results
      quizQuestions.style.display = 'none';
      quizResults.style.display = 'block';

      // Scroll to results
      quizResults.scrollIntoView({ behavior: 'smooth', block: 'start' });

      // Track quiz completion
      trackEvent('Quiz_completado', { score: totalScore, nivel: scoreLabel });
    });

    // Reset quiz
    quizResetBtn.addEventListener('click', () => {
      // Reset all radio buttons
      document.querySelectorAll('.quiz-question input[type="radio"]').forEach(input => {
        input.checked = false;
      });

      // Hide results, show questions
      quizResults.style.display = 'none';
      quizQuestions.style.display = 'flex';

      // Reset carousel to first question
      currentQuestion = 0;
      showQuestion(0);

      // Scroll to quiz start
      quizQuestions.scrollIntoView({ behavior: 'smooth', block: 'start' });

      trackEvent('Quiz_reiniciado');
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
          const serviceCategory = toggle.closest('.service-block').querySelector('.service-category').textContent;
          trackEvent('Timeline_expandido', { servicio: serviceCategory });
        }
      });
    });
  }

  // =====================================================
  // TOOLTIPS FOR KEY TERMS
  // -----------------------------------------------------
  // Mobile tap handling for tooltips
  // =====================================================
  const tooltipTerms = document.querySelectorAll('.tooltip-term');

  if (tooltipTerms.length) {
    // Make tooltip terms focusable for keyboard navigation
    tooltipTerms.forEach(term => {
      term.setAttribute('tabindex', '0');
      term.setAttribute('role', 'button');
      term.setAttribute('aria-label', `Definición: ${term.getAttribute('data-tooltip')}`);

      // Mobile tap handling
      term.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        // Close all other tooltips
        tooltipTerms.forEach(t => {
          if (t !== term) {
            t.classList.remove('tooltip-active');
          }
        });

        // Toggle current tooltip
        term.classList.toggle('tooltip-active');
      });
    });

    // Close tooltips when clicking elsewhere
    document.addEventListener('click', (e) => {
      if (!e.target.classList.contains('tooltip-term')) {
        tooltipTerms.forEach(term => {
          term.classList.remove('tooltip-active');
        });
      }
    });

    // Close tooltips on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        tooltipTerms.forEach(term => {
          term.classList.remove('tooltip-active');
        });
      }
    });
  }

  // =====================================================
  // Equipo: Foto hover
  // =====================================================
  const equipoRows = document.querySelectorAll('.equipo-row');
  if (equipoRows.length > 0) {
    equipoRows.forEach(row => {
      const foto = row.dataset.foto;
      const preview = row.querySelector('.equipo-foto-hover');
      if (foto && preview) {
        preview.style.backgroundImage = `url(${foto})`;
      }
    });
  }
});
