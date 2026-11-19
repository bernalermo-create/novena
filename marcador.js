// Envía y lee resultados de la tabla de clasificación (Google Sheets + Apps Script).
(function () {
  const cfg = window.NOVENA_CONFIG || {};
  const url = (cfg.urlScript || "").trim();
  const listo = () => /^https:\/\/script\.google\.com\/.+\/exec$/.test(url);

  function idUnico() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
  }

  async function enviar(datos) {
    if (!listo()) return { ok: false, motivo: "sin-config" };
    const body = JSON.stringify(Object.assign({ id: idUnico() }, datos));
    let r;
    try {
      r = await fetch(url, { method: "POST", body });
    } catch (e) {
      // Algunos navegadores bloquean la respuesta; se reenvía sin esperar confirmación.
      // El script ignora envíos repetidos con el mismo id.
      try { await fetch(url, { method: "POST", body, mode: "no-cors" }); return { ok: true }; }
      catch (_) { return { ok: false, motivo: "red" }; }
    }
    try {
      const j = await r.json();
      return j.ok ? { ok: true } : { ok: false, motivo: j.error || "rechazado" };
    } catch (_) { return { ok: r.ok }; }
  }

  async function leer() {
    if (!listo()) throw new Error("sin-config");
    const r = await fetch(url + "?t=" + Date.now());
    const j = await r.json();
    if (!j.ok) throw new Error(j.error || "error");
    return j;
  }

  function formatoTiempo(seg) {
    const m = Math.floor(seg / 60), s = seg - m * 60;
    return String(m).padStart(2, "0") + ":" + s.toFixed(1).padStart(4, "0");
  }

  function mostrar(el, promesa) {
    if (!el) return;
    if (!listo()) { el.textContent = ""; return; }
    el.removeAttribute("data-estado");
    el.textContent = "Enviando tu resultado a la tabla…";
    promesa.then(r => {
      el.dataset.estado = r.ok ? "ok" : "error";
      el.textContent = r.ok
        ? "✓ Tu resultado quedó en la tabla de clasificación"
        : "No se pudo enviar el resultado. Envía tu captura al grupo.";
    });
  }

  window.NovenaMarcador = { enviar, leer, mostrar, listo, formatoTiempo };
})();
