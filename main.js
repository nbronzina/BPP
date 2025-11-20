// main.js
// BPP Analytics & Design
// Centraliza toda la lógica JS de index, privacidad y reporte

(function () {
  'use strict';

  // ─────────────────────────────────────
  // Utilidades globales
  // ─────────────────────────────────────

  function trackEvent(name, props) {
    if (window.plausible && typeof window.plausible === 'function') {
      window.plausible(name, { props: props || {} });
    }
  }

  function setCurrentYear() {
    var yearSpan = document.getElementById('currentYear');
    if (yearSpan) {
      yearSpan.textContent = new Date().getFullYear();
    }
  }

  // ─────────────────────────────────────
  // Navegación (mobile / desktop)
  // ─────────────────────────────────────

  function initNavigation() {
    var mobileMenuBtn = document.getElementById('mobileMenuBtn');
    var navLinks = document.getElementById('navLinks');

    if (!mobileMenuBtn || !navLinks) return;

    mobileMenuBtn.addEventListener('click', function () {
      var isExpanded = navLinks.classList.toggle('active');
      mobileMenuBtn.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
      mobileMenuBtn.setAttribute(
        'aria-label',
        isExpanded ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'
      );
    });

    // Cerrar menú al hacer click en un link
    document.querySelectorAll('.nav-links a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        mobileMenuBtn.setAttribute('aria-label', 'Abrir menú de navegación');
      });
    });

    // Cerrar con Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        mobileMenuBtn.setAttribute('aria-label', 'Abrir menú de navegación');
        mobileMenuBtn.focus();
      }
    });

    // Cerrar al hacer click fuera
    document.addEventListener('click', function (e) {
      if (
        navLinks.classList.contains('active') &&
        !navLinks.contains(e.target) &&
        !mobileMenuBtn.contains(e.target)
      ) {
        navLinks.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        mobileMenuBtn.setAttribute('aria-label', 'Abrir menú de navegación');
      }
    });
  }

  // ─────────────────────────────────────
  // Smooth Scroll (sin romper la skip-link)
  // ─────────────────────────────────────

  function initSmoothScroll() {
    var anchors = document.querySelectorAll('a[href^="#"]');

    anchors.forEach(function (anchor) {
      // No interferir con la skip-link de accesibilidad
      if (anchor.classList.contains('skip-link')) return;

      anchor.addEventListener('click', function (e) {
        var href = anchor.getAttribute('href');
        if (!href || href === '#') return;

        var target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();
        var offsetTop = target.offsetTop - 80;

        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      });
    });
  }

  // ─────────────────────────────────────
  // Animaciones de aparición + tracking secciones (index)
  // ─────────────────────────────────────

  function initScrollAnimations() {
    var animatedElements = document.querySelectorAll('[data-animate]');
    if (!('IntersectionObserver' in window) || animatedElements.length === 0) {
      // Si no hay soporte, mostrar todo sin animación
      animatedElements.forEach(function (el) {
        el.classList.add('visible');
      });
      return;
    }

    var trackedSections = new Set();

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');

            // Tracking de sección vista (solo si tiene section padre con id)
            var section = entry.target.closest('section');
            if (section && section.id && !trackedSections.has(section.id)) {
              trackedSections.add(section.id);
              trackEvent('Seccion_vista', { id: section.id });
            }
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    animatedElements.forEach(function (el) {
      observer.observe(el);
    });
  }

  // ─────────────────────────────────────
  // Formulario de contacto (index)
  // ─────────────────────────────────────

  function initContactForm() {
    var contactForm = document.getElementById('contactForm');
    var formMessage = document.getElementById('formMessage');

    if (!contactForm || !formMessage) return;

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var submitButton = contactForm.querySelector('.form-submit');
      var formData = new FormData(contactForm);

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Enviando...';
      }

      formMessage.classList.remove('show', 'success', 'error');

      fetch(contactForm.action, {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json'
        }
      })
        .then(function (response) {
          if (response.ok) {
            formMessage.textContent =
              '¡Gracias por contactarnos! Te responderemos pronto.';
            formMessage.classList.add('show', 'success');
            contactForm.reset();
            trackEvent('Contacto_enviado', { origen: 'formulario_principal' });
          } else {
            throw new Error('Error en el envío');
          }
        })
        .catch(function () {
          formMessage.textContent =
            'Hubo un error al enviar el mensaje. Por favor, intentá de nuevo o escribinos a bppanalyticsanddesign@gmail.com';
          formMessage.classList.add('show', 'error');
        })
        .finally(function () {
          if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = 'Enviar mensaje';
          }
        });
    });
  }

  // ─────────────────────────────────────
  // Tracking específico de index (CTA, actividades)
  // ─────────────────────────────────────

  function initIndexTracking() {
    // CTA Hero
    var ctaHero = document.getElementById('ctaHero');
    if (ctaHero) {
      ctaHero.addEventListener('click', function () {
        trackEvent('CTA_click', { seccion: 'hero', texto: 'Hablemos' });
      });
    }

    // Links de actividades
    var linkCesba = document.getElementById('linkCesba');
    if (linkCesba) {
      linkCesba.addEventListener('click', function () {
        trackEvent('Actividad_click', { tipo: 'externo', destino: 'CESBA' });
      });
    }

    var linkReporteNatalidad = document.getElementById('linkReporteNatalidad');
    if (linkReporteNatalidad) {
      linkReporteNatalidad.addEventListener('click', function () {
        trackEvent('Actividad_click', {
          tipo: 'interno',
          destino: 'reporte_impacto_natalidad'
        });
      });
    }
  }

  // ─────────────────────────────────────
  // PWA + Service Worker (index y resto)
  // ─────────────────────────────────────

  var deferredPrompt = null;
  var installPromptEl = null;

  function createInstallPromptElement() {
    if (installPromptEl) return installPromptEl;

    var div = document.createElement('div');
    div.className = 'pwa-install-prompt';
    div.innerHTML =
      '<div class="pwa-install-content">' +
      '<p><strong>Instalá BPP</strong></p>' +
      '<p>Accedé más rápido desde tu pantalla de inicio</p>' +
      '<div class="pwa-install-buttons">' +
      '<button class="pwa-install-btn" id="installPWA">Instalar</button>' +
      '<button class="pwa-dismiss-btn" id="dismissPWA">Ahora no</button>' +
      '</div>' +
      '</div>';

    installPromptEl = div;
    return div;
  }

  function initPWA() {
    // Service worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function () {
        navigator.serviceWorker
          .register('/sw.js')
          .then(function () {
            // console.log('Service Worker registrado');
          })
          .catch(function () {
            // console.log('Error al registrar SW:', err);
          });
      });
    }

    // beforeinstallprompt
    window.addEventListener('beforeinstallprompt', function (e) {
      e.preventDefault();
      deferredPrompt = e;

      setTimeout(function () {
        if (!localStorage.getItem('pwa-dismissed') && !installPromptEl) {
          var prompt = createInstallPromptElement();
          document.body.appendChild(prompt);
          prompt.classList.add('show');
          trackEvent('PWA_prompt_mostrado');
        }
      }, 5000);
    });

    // Botones de instalar / descartar
    document.addEventListener('click', function (e) {
      if (e.target && e.target.id === 'installPWA') {
        if (deferredPrompt) {
          installPromptEl && installPromptEl.classList.remove('show');
          deferredPrompt.prompt();
          deferredPrompt.userChoice.then(function (choiceResult) {
            trackEvent('PWA_accion', { accion: choiceResult.outcome });
            deferredPrompt = null;
            if (installPromptEl && installPromptEl.parentNode) {
              installPromptEl.parentNode.removeChild(installPromptEl);
              installPromptEl = null;
            }
          });
        }
      }

      if (e.target && e.target.id === 'dismissPWA') {
        if (installPromptEl) {
          installPromptEl.classList.remove('show');
          setTimeout(function () {
            if (installPromptEl && installPromptEl.parentNode) {
              installPromptEl.parentNode.removeChild(installPromptEl);
              installPromptEl = null;
            }
          }, 300);
        }
        localStorage.setItem('pwa-dismissed', 'true');
        trackEvent('PWA_accion', { accion: 'dismissed' });
      }
    });

    // App instalada
    window.addEventListener('appinstalled', function () {
      deferredPrompt = null;
      if (installPromptEl && installPromptEl.parentNode) {
        installPromptEl.parentNode.removeChild(installPromptEl);
        installPromptEl = null;
      }
      trackEvent('PWA_instalada');
    });
  }

  // ─────────────────────────────────────
  // Página de Privacidad
  // ─────────────────────────────────────

  function initPrivacyPage() {
    var body = document.body;
    if (!body || !body.classList.contains('legal-page')) return;

    // Vista de la página de privacidad
    window.addEventListener('load', function () {
      trackEvent('Pagina_privacidad_vista');
    });

    // Click en enlace de email
    var privacyEmailLink = document.getElementById('privacyEmailLink');
    if (privacyEmailLink) {
      privacyEmailLink.addEventListener('click', function () {
        trackEvent('Privacidad_contacto_click');
      });
    }
  }

  // ─────────────────────────────────────
  // Página de Reporte de Impacto
  // ─────────────────────────────────────

  function initReportPage() {
    var body = document.body;
    if (!body || !body.classList.contains('reporte-page')) return;

    // Tracking de secciones del reporte
    var reporteSections = document.querySelectorAll('section.reporte-section');
    var seenSections = new Set();

    if (reporteSections.length > 0 && 'IntersectionObserver' in window) {
      var sectionObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              var section = entry.target;
              if (section.id && !seenSections.has(section.id)) {
                seenSections.add(section.id);
                trackEvent('Reporte_seccion_vista', { id: section.id });
              }
            }
          });
        },
        {
          threshold: 0.2,
          rootMargin: '0px 0px -50px 0px'
        }
      );

      reporteSections.forEach(function (sec) {
        sectionObserver.observe(sec);
      });
    }

    // Tracking de descargas de PDFs
    var downloadInformePrincipal = document.getElementById(
      'downloadInformePrincipal'
    );
    if (downloadInformePrincipal) {
      downloadInformePrincipal.addEventListener('click', function () {
        trackEvent('PDF_descarga', { tipo: 'reporte_principal' });
      });
    }

    var downloadEstudioRegional = document.getElementById(
      'downloadEstudioRegional'
    );
    if (downloadEstudioRegional) {
      downloadEstudioRegional.addEventListener('click', function () {
        trackEvent('PDF_descarga', { tipo: 'estudio_regional' });
      });
    }
  }

  // ─────────────────────────────────────
  // Init global
  // ─────────────────────────────────────

  document.addEventListener('DOMContentLoaded', function () {
    setCurrentYear();
    initNavigation();
    initSmoothScroll();
    initScrollAnimations();
    initContactForm();
    initIndexTracking();
    initPrivacyPage();
    initReportPage();
    initPWA();
  });
})();
