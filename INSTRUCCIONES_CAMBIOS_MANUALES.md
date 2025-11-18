# Instrucciones para Aplicar Cambios Manualmente desde GitHub

**Problema:** El servidor git proxy está dando error 504 y no puede pushear automáticamente.
**Solución:** Aplicar los cambios manualmente editando los archivos desde GitHub web.

---

## 📋 RESUMEN DE CAMBIOS

**3 archivos a editar:**
1. ✏️ `index.html` - Agregar formulario de contacto y estilos
2. ✏️ `privacidad.html` - Corregir URL volver al inicio
3. ➕ `REPORTE_VERIFICACION.md` - Crear nuevo archivo (opcional)

---

## 1️⃣ CAMBIOS EN `index.html`

### **A. Agregar Estilos del Formulario (después de la línea 568)**

Buscar esta línea:
```css
        .footer-bottom a:hover {
            color: var(--color-accent-bright);
            text-decoration: underline;
        }
```

**Agregar DESPUÉS:**
```css
        /* Contact Form Section */
        .contact-form-section {
            max-width: 700px;
            margin: 0 auto;
            padding: var(--spacing-section) 2rem;
        }

        .contact-form-header {
            text-align: center;
            margin-bottom: 3rem;
        }

        .contact-form-header h2 {
            font-size: var(--font-size-h2);
            font-weight: 700;
            color: var(--color-text);
            margin-bottom: 1rem;
        }

        .contact-form-header p {
            font-size: 1.1rem;
            color: var(--color-text-secondary);
            max-width: 600px;
            margin: 0 auto;
        }

        .contact-form {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
        }

        .form-group {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }

        .form-group label {
            font-size: 1rem;
            font-weight: 600;
            color: var(--color-text);
        }

        .form-group input,
        .form-group textarea {
            padding: 1rem;
            background: var(--color-bg-light);
            border: 1px solid rgba(217, 143, 110, 0.2);
            border-radius: var(--border-radius);
            color: var(--color-text);
            font-family: 'Inter', sans-serif;
            font-size: 1rem;
            transition: all var(--transition-normal);
        }

        .form-group input:focus,
        .form-group textarea:focus {
            outline: none;
            border-color: var(--color-accent);
            box-shadow: 0 0 0 3px rgba(217, 143, 110, 0.1);
        }

        .form-group textarea {
            min-height: 150px;
            resize: vertical;
        }

        .form-submit {
            display: inline-block;
            min-height: 44px;
            padding: 1rem 2.5rem;
            border: 2px solid var(--color-accent);
            background: var(--color-accent);
            color: #0f0f0f;
            border-radius: 4px;
            font-weight: 600;
            font-size: 1rem;
            cursor: pointer;
            transition: all var(--transition-normal);
            align-self: flex-start;
        }

        .form-submit:hover {
            background: var(--color-accent-bright);
            border-color: var(--color-accent-bright);
            transform: scale(1.02);
        }

        .form-submit:active {
            transform: scale(0.98);
        }

        .form-submit:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }

        /* Form success/error messages */
        .form-message {
            padding: 1rem;
            border-radius: var(--border-radius);
            text-align: center;
            font-weight: 500;
            display: none;
        }

        .form-message.success {
            background: rgba(76, 175, 80, 0.1);
            color: #4CAF50;
            border: 1px solid rgba(76, 175, 80, 0.3);
        }

        .form-message.error {
            background: rgba(244, 67, 54, 0.1);
            color: #F44336;
            border: 1px solid rgba(244, 67, 54, 0.3);
        }

        .form-message.show {
            display: block;
        }
```

---

### **B. Agregar HTML del Formulario (antes del `<footer id="contact">`)**

Buscar esta línea:
```html
    </section>

    <!-- Footer / Contact Section -->
    <footer id="contact">
```

**REEMPLAZAR con:**
```html
    </section>

    <!-- Contact Form Section -->
    <section class="contact-form-section" data-animate>
        <div class="contact-form-header">
            <h2>Hablemos</h2>
            <p>¿Tenés un proyecto en mente? Contanos sobre tu desafío y exploremos juntos cómo podemos ayudarte.</p>
        </div>

        <form class="contact-form" id="contactForm" action="https://formspree.io/f/xovavone" method="POST">
            <div id="formMessage" class="form-message"></div>

            <div class="form-group">
                <label for="name">Nombre *</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    placeholder="Tu nombre"
                    autocomplete="name"
                >
            </div>

            <div class="form-group">
                <label for="email">Email *</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    placeholder="tu@email.com"
                    autocomplete="email"
                >
            </div>

            <div class="form-group">
                <label for="organization">Organización</label>
                <input
                    type="text"
                    id="organization"
                    name="organization"
                    placeholder="Empresa u organización (opcional)"
                    autocomplete="organization"
                >
            </div>

            <div class="form-group">
                <label for="message">Mensaje *</label>
                <textarea
                    id="message"
                    name="message"
                    required
                    placeholder="Contanos sobre tu proyecto o consulta..."
                ></textarea>
            </div>

            <button type="submit" class="form-submit">Enviar mensaje</button>
        </form>
    </section>

    <!-- Footer / Contact Section -->
    <footer id="contact">
```

---

### **C. Agregar JavaScript del Formulario (antes del cierre `</script>`)**

Buscar esta sección (casi al final del archivo):
```javascript
        // Register service worker for PWA
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then(reg => console.log('Service Worker registrado'))
                    .catch(err => console.log('Error al registrar SW:', err));
            });
        }
    </script>
```

**REEMPLAZAR con:**
```javascript
        // Register service worker for PWA
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then(reg => console.log('Service Worker registrado'))
                    .catch(err => console.log('Error al registrar SW:', err));
            });
        }

        // Contact form handling
        const contactForm = document.getElementById('contactForm');
        const formMessage = document.getElementById('formMessage');

        if (contactForm) {
            contactForm.addEventListener('submit', async (e) => {
                e.preventDefault();

                const submitButton = contactForm.querySelector('.form-submit');
                const formData = new FormData(contactForm);

                // Disable submit button
                submitButton.disabled = true;
                submitButton.textContent = 'Enviando...';

                // Hide previous messages
                formMessage.classList.remove('show', 'success', 'error');

                try {
                    const response = await fetch(contactForm.action, {
                        method: 'POST',
                        body: formData,
                        headers: {
                            'Accept': 'application/json'
                        }
                    });

                    if (response.ok) {
                        // Success
                        formMessage.textContent = '¡Gracias por contactarnos! Te responderemos pronto.';
                        formMessage.classList.add('show', 'success');
                        contactForm.reset();
                    } else {
                        // Error
                        throw new Error('Error en el envío');
                    }
                } catch (error) {
                    formMessage.textContent = 'Hubo un error al enviar el mensaje. Por favor, intentá de nuevo o escribinos a bppanalyticsanddesign@gmail.com';
                    formMessage.classList.add('show', 'error');
                } finally {
                    // Re-enable submit button
                    submitButton.disabled = false;
                    submitButton.textContent = 'Enviar mensaje';
                }
            });
        }
    </script>
```

---

## 2️⃣ CAMBIOS EN `privacidad.html`

**Buscar (línea 97):**
```html
        <a href="/" class="back-link">← Volver al inicio</a>
```

**REEMPLAZAR con:**
```html
        <a href="/BPP/" class="back-link">← Volver al inicio</a>
```

---

## 3️⃣ ARCHIVO NUEVO: `REPORTE_VERIFICACION.md` (OPCIONAL)

Este archivo es solo documentación. Si querés agregarlo, está en el repositorio local como:
`/home/user/BPP/REPORTE_VERIFICACION.md`

Pero **NO es necesario** para que el sitio funcione.

---

## ✅ VERIFICACIÓN

Después de aplicar los cambios:

1. **Formulario de contacto** debería aparecer antes del footer
2. **Link "Volver al inicio"** en privacidad.html debería funcionar
3. **Link "Política de Privacidad"** en footer debería verse en color #D98F6E

---

## 🚀 CÓMO EDITAR EN GITHUB WEB

1. Ir a: `https://github.com/nbronzina/BPP/tree/claude/bpp-analytics-website-01Qg8KmqzsnS33vifronWpqF`
2. Click en el archivo (ej: `index.html`)
3. Click en el ícono de lápiz (Edit this file)
4. Hacer los cambios según las instrucciones arriba
5. Scroll al fondo, agregar mensaje de commit
6. Click "Commit changes"
7. Repetir para cada archivo

---

**Creado:** 18 de noviembre de 2025
