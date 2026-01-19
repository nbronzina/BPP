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
        .catch((err) => {
          console.log("Error al registrar SW:", err);
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

    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      deferredPrompt = e;

      setTimeout(() => {
        if (!localStorage.getItem("pwa-dismissed")) {
          document.body.appendChild(installPrompt);
          installPrompt.classList.add("show");
          trackEvent("PWA_prompt_mostrado");
        }
      }, 5000);
    });

    document.addEventListener("click", async (e) => {
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

      if (e.target && e.target.id === "dismissPWA") {
        installPrompt.classList.remove("show");
        setTimeout(() => installPrompt.remove(), 300);
        localStorage.setItem("pwa-dismissed", "true");
        trackEvent("PWA_accion", { accion: "dismissed" });
      }
    });

    window.addEventListener("appinstalled", () => {
      deferredPrompt = null;
      if (installPrompt.parentNode) {
        installPrompt.remove();
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
  }
});
