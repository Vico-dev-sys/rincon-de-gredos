/* ============================================================
   EL RINCÓN DE GREDOS · Lógica de la web
   Renderiza el contenido desde /js/data/*.js y gestiona la
   interactividad (nav, lightbox, acordeón, formulario, WhatsApp).
   ============================================================ */
(function () {
  "use strict";

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const S  = window.SITIO || {};

  /* ---------- Iconos del Entorno (SVG inline) ---------- */
  const ICONOS = {
    ruta:   '<path d="M4 20s2-6 6-6 4-8 8-8M6 20l2-3M18 6l-2 3" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
    agua:   '<path d="M12 3c4 5 6 8 6 11a6 6 0 0 1-12 0c0-3 2-6 6-11z" fill="none" stroke="currentColor" stroke-width="1.6"/>',
    puente: '<path d="M2 16h20M4 16v-3a8 8 0 0 1 16 0v3M9 16v-2M15 16v-2M12 16v-3" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
    plato:  '<path d="M12 13a5 5 0 1 0 0-2M12 3v10M20 3c-2 0-3 2-3 4s1 4 3 4V3z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>'
  };

  /* ---------- Redes (SVG inline) ---------- */
  const REDES_SVG = {
    instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>',
    facebook:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M15 3h-3a4 4 0 0 0-4 4v3H5v4h3v7h4v-7h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>',
    youtube:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="2" y="5" width="20" height="14" rx="4"/><path d="M10 9l5 3-5 3z" fill="currentColor" stroke="none"/></svg>'
  };

  /* ============================================================
     1. RENDER · HABITACIONES
     ============================================================ */
  function renderHabitaciones() {
    const grid = $("#habs-grid");
    const habs = window.HABITACIONES || [];
    if (!grid) return;

    grid.innerHTML = habs.map(h => {
      const media = h.img
        ? `<div class="hab__media"><img src="${h.img}" alt="${h.alt}" loading="lazy" width="1200" height="800"></div>`
        : `<div class="hab__media"><div class="hab__placeholder" role="img" aria-label="${h.nombre}: fotografía en preparación">
             <svg class="hab__ph-montana" viewBox="0 0 120 48" aria-hidden="true">
               <path d="M2 45 L28 15 L44 31 L66 6 L88 33 L104 20 L118 45"/>
             </svg>
             <span class="hab__ph-nombre">${h.nombre}</span>
             <span class="hab__ph-tipo">${h.tipo}</span>
             <span class="hab__ph-sello">Fotografía en preparación</span>
           </div></div>`;

      const servicios = h.servicios.map(s => `<li>${s}</li>`).join("");

      return `
        <article class="hab reveal">
          ${media}
          <div class="hab__cuerpo">
            <h3 class="hab__nombre">${h.nombre}</h3>
            <p class="hab__tipo">${h.tipo}</p>
            <ul class="hab__servicios">${servicios}</ul>
            <div class="hab__pie">
              <div class="hab__precio">
                <small>Desde</small>
                <strong>${h.precioBaja} €</strong>
              </div>
              <span class="hab__capacidad">${h.capacidad} ${h.capacidad === 1 ? "plaza" : "plazas"}</span>
            </div>
            <button class="btn btn--secundario btn--bloque" style="margin-top:1.1rem" data-hab="${h.id}">Consultar</button>
          </div>
        </article>`;
    }).join("");

    // Nota común
    const nota = $("#habs-nota");
    if (nota && window.HABITACIONES_COMUNES) nota.textContent = window.HABITACIONES_COMUNES;

    // Botón "Consultar" → precarga la habitación en el formulario
    $$('[data-hab]', grid).forEach(btn => {
      btn.addEventListener("click", () => {
        const sel = $("#habitacion");
        if (sel) sel.value = btn.dataset.hab;
        document.getElementById("contacto").scrollIntoView({ behavior: "smooth" });
        // resalta un instante el select
        if (sel) { sel.focus({ preventScroll: true }); }
      });
    });
  }

  /* Rellena el <select> de habitación de interés */
  function renderSelectHabitaciones() {
    const sel = $("#habitacion");
    if (!sel) return;
    const habs = window.HABITACIONES || [];
    sel.innerHTML =
      `<option value="">No lo sé aún</option>` +
      habs.map(h => `<option value="${h.id}">${h.nombre} · ${h.tipo}</option>`).join("");
  }

  /* ============================================================
     2. RENDER · ENTORNO
     ============================================================ */
  function renderEntorno() {
    const grid = $("#entorno-grid");
    const items = window.ENTORNO || [];
    if (!grid) return;
    grid.innerHTML = items.map(e => `
      <article class="exp reveal">
        <svg class="exp__icono" viewBox="0 0 24 24">${ICONOS[e.icono] || ""}</svg>
        <h3>${e.titulo}</h3>
        <p>${e.texto}</p>
      </article>`).join("");
  }

  /* ============================================================
     3. RENDER · GALERÍA + LIGHTBOX
     ============================================================ */
  let galeriaImgs = [];
  let lbIndex = 0;

  function renderGaleria() {
    const grid = $("#galeria-grid");
    galeriaImgs = window.GALERIA || [];
    if (!grid) return;

    // Patrón de mosaico: 1º ancho, 3º alto (si hay suficientes)
    grid.innerHTML = galeriaImgs.map((g, i) => {
      let extra = "";
      if (i === 0) extra = " galeria__item--ancho";
      else if (i === 2) extra = " galeria__item--alto";
      return `
        <button class="galeria__item${extra} reveal" data-idx="${i}" aria-label="Ampliar: ${g.alt}">
          <img src="${g.src}" alt="${g.alt}" loading="lazy">
        </button>`;
    }).join("");

    $$('[data-idx]', grid).forEach(btn => {
      btn.addEventListener("click", () => abrirLightbox(parseInt(btn.dataset.idx, 10)));
    });
  }

  function abrirLightbox(idx) {
    lbIndex = idx;
    const lb = $("#lightbox"), img = $("#lb-img");
    const g = galeriaImgs[idx];
    if (!lb || !g) return;
    img.src = g.src; img.alt = g.alt;
    lb.classList.add("abierto");
    document.body.style.overflow = "hidden";
  }
  function cerrarLightbox() {
    $("#lightbox").classList.remove("abierto");
    document.body.style.overflow = "";
  }
  function moverLightbox(dir) {
    lbIndex = (lbIndex + dir + galeriaImgs.length) % galeriaImgs.length;
    abrirLightbox(lbIndex);
  }

  function initLightbox() {
    $("#lb-cerrar").addEventListener("click", cerrarLightbox);
    $("#lb-prev").addEventListener("click", () => moverLightbox(-1));
    $("#lb-next").addEventListener("click", () => moverLightbox(1));
    $("#lightbox").addEventListener("click", e => { if (e.target.id === "lightbox") cerrarLightbox(); });
    document.addEventListener("keydown", e => {
      if (!$("#lightbox").classList.contains("abierto")) return;
      if (e.key === "Escape") cerrarLightbox();
      if (e.key === "ArrowLeft") moverLightbox(-1);
      if (e.key === "ArrowRight") moverLightbox(1);
    });
  }

  /* ============================================================
     4. RENDER · FAQ (acordeón)
     ============================================================ */
  function renderFaq() {
    const lista = $("#faq-lista");
    const faqs = window.FAQS || [];
    if (!lista) return;
    lista.innerHTML = faqs.map((f, i) => `
      <div class="faq__item reveal" aria-expanded="false">
        <button class="faq__pregunta" aria-controls="faq-r-${i}">
          <span>${f.pregunta}</span>
          <span class="faq__signo" aria-hidden="true">+</span>
        </button>
        <div class="faq__respuesta" id="faq-r-${i}" role="region">
          <p>${f.respuesta}</p>
        </div>
      </div>`).join("");

    $$(".faq__item", lista).forEach(item => {
      const btn = $(".faq__pregunta", item);
      const resp = $(".faq__respuesta", item);
      btn.addEventListener("click", () => {
        const abierto = item.getAttribute("aria-expanded") === "true";
        item.setAttribute("aria-expanded", String(!abierto));
        resp.style.maxHeight = abierto ? null : resp.scrollHeight + "px";
      });
    });
  }

  /* ============================================================
     5. DATOS DE CONTACTO + REDES + MAPA + WHATSAPP
     ============================================================ */
  function renderContacto() {
    // Teléfono
    const telHref = "tel:+" + (S.whatsapp || "").replace(/\D/g, "");
    ["#dato-tel", "#footer-tel"].forEach(id => {
      const el = $(id); if (el) { el.textContent = S.telefonoDisplay || S.telefono; el.href = telHref; }
    });
    // Email
    ["#dato-email", "#footer-email"].forEach(id => {
      const el = $(id); if (el) { el.textContent = S.email; el.href = "mailto:" + S.email; }
    });
    // Dirección
    const dir = `${S.direccion} · ${S.provincia}`;
    const dd = $("#dato-direccion"); if (dd) dd.textContent = dir;
    const fd = $("#footer-direccion"); if (fd) fd.textContent = dir;

    // Mapa (OpenStreetMap embed, sin claves)
    const mapa = $("#mapa-iframe");
    if (mapa) {
      const q = encodeURIComponent(S.mapaConsulta || "Navaluenga, Ávila");
      mapa.src = `https://www.openstreetmap.org/export/embed.html?bbox=-4.75,40.38,-4.55,40.48&marker=40.412,-4.63&layer=mapnik`;
      mapa.title = "Mapa de " + (S.mapaConsulta || "Navaluenga, Ávila");
    }

    // Redes en el footer
    const cont = $("#footer-redes");
    if (cont && S.redes) {
      cont.innerHTML = Object.keys(S.redes).map(k =>
        REDES_SVG[k] ? `<a href="${S.redes[k]}" target="_blank" rel="noopener" aria-label="${k}">${REDES_SVG[k]}</a>` : ""
      ).join("");
    }

    // WhatsApp flotante
    const wa = $("#wa-flotante");
    if (wa) {
      const msg = encodeURIComponent(`Hola Laura, me interesa una habitación en El Rincón de Gredos. ¿Tienes disponibilidad?`);
      wa.href = `https://wa.me/${(S.whatsapp || "").replace(/\D/g, "")}?text=${msg}`;
    }

    // Año del footer
    const anio = $("#anio");
    if (anio) anio.textContent = new Date().getFullYear();
  }

  /* ============================================================
     6. NAVBAR (burger + sombra al scroll)
     ============================================================ */
  function initNavbar() {
    const burger = $("#burger"), menu = $("#menu"), navbar = $(".navbar");
    if (burger && menu) {
      burger.addEventListener("click", () => {
        const abierto = menu.classList.toggle("abierto");
        burger.setAttribute("aria-expanded", String(abierto));
        burger.setAttribute("aria-label", abierto ? "Cerrar menú" : "Abrir menú");
      });
      $$("a", menu).forEach(a => a.addEventListener("click", () => {
        menu.classList.remove("abierto");
        burger.setAttribute("aria-expanded", "false");
      }));
    }
    if (navbar) {
      const onScroll = () => navbar.classList.toggle("scrolled", window.scrollY > 20);
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
    }
  }

  /* ============================================================
     7. FADE-IN AL SCROLL
     ============================================================ */
  function initReveal() {
    const els = $$(".reveal");
    if (!("IntersectionObserver" in window)) { els.forEach(e => e.classList.add("visible")); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    els.forEach(e => io.observe(e));
  }

  /* ============================================================
     8. FORMULARIO (validación + envío)
     ============================================================ */
  function initFormulario() {
    const form = $("#form-contacto");
    if (!form) return;

    const setError = (campo, on) => campo.closest(".campo").classList.toggle("campo--error", on);

    function validar() {
      let ok = true;
      const req = ["nombre", "telefono", "email", "entrada", "salida", "adultos"];
      req.forEach(id => {
        const el = $("#" + id);
        const vacio = !el.value.trim();
        setError(el, vacio);
        if (vacio) ok = false;
      });
      // email
      const email = $("#email");
      if (email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) { setError(email, true); ok = false; }
      // fechas
      const ent = $("#entrada"), sal = $("#salida");
      if (ent.value && sal.value && sal.value <= ent.value) { setError(sal, true); ok = false; }
      // consentimiento
      const consent = $("#consent");
      setError(consent, !consent.checked);
      if (!consent.checked) ok = false;
      return ok;
    }

    // Limpia el error de un campo al corregirlo
    $$("#form-campos input, #form-campos select").forEach(el => {
      el.addEventListener("input", () => el.closest(".campo").classList.remove("campo--error"));
      el.addEventListener("change", () => el.closest(".campo").classList.remove("campo--error"));
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!validar()) {
        $(".campo--error input, .campo--error select")?.focus();
        return;
      }

      const datos = Object.fromEntries(new FormData(form).entries());
      const habNombre = (window.HABITACIONES || []).find(h => h.id === datos.habitacion);
      datos.habitacion = habNombre ? habNombre.nombre : "No lo sé aún";

      const enviado = await enviar(datos);
      if (enviado) mostrarOk();
    });

    async function enviar(datos) {
      // Opción A: Web3Forms (si hay clave configurada) — envío sin abrir el correo
      if (S.web3formsKey) {
        try {
          const r = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Accept": "application/json" },
            body: JSON.stringify({
              access_key: S.web3formsKey,
              subject: `Nueva consulta web · ${datos.nombre} (${datos.entrada} → ${datos.salida})`,
              from_name: "Web El Rincón de Gredos",
              ...datos
            })
          });
          const j = await r.json();
          return j.success;
        } catch (err) { /* cae al mailto */ }
      }

      // Opción B (por defecto hoy): mailto con la consulta cualificada
      const cuerpo =
`Hola Laura, quiero consultar disponibilidad:

Nombre: ${datos.nombre}
Teléfono/WhatsApp: ${datos.telefono}
Email: ${datos.email}
Entrada: ${datos.entrada}
Salida: ${datos.salida}
Adultos: ${datos.adultos}
Niños: ${datos.ninos || 0}
Habitación de interés: ${datos.habitacion}

${datos.mensaje || ""}`;
      const asunto = `Consulta de disponibilidad · ${datos.nombre}`;
      window.location.href =
        `mailto:${S.email}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`;
      return true;
    }

    function mostrarOk() {
      $("#form-campos").style.display = "none";
      $("#form-ok").classList.add("visible");
      $("#form-ok").scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  /* ============================================================
     ARRANQUE
     ============================================================ */
  document.addEventListener("DOMContentLoaded", () => {
    renderHabitaciones();
    renderSelectHabitaciones();
    renderEntorno();
    renderGaleria();
    renderFaq();
    renderContacto();
    initNavbar();
    initLightbox();
    initFormulario();
    initReveal();
  });
})();
