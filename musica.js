// Música navideña sintetizada (villancicos tradicionales, dominio público). Sin archivos de audio.
// Uso: <script src="musica.js" data-tema="silencio|campanas|feliz" defer></script>
(function () {
  const TEMAS = {
    // Noche de paz: tranquila, para el rompecabezas
    silencio: { bpm: 72, vol: 0.10, n: "G4:1.5 A4:.5 G4:1 E4:3 G4:1.5 A4:.5 G4:1 E4:3 D5:2 D5:1 B4:3 C5:2 C5:1 G4:3 A4:2 A4:1 C5:1.5 B4:.5 A4:1 G4:1.5 A4:.5 G4:1 E4:3 A4:2 A4:1 C5:1.5 B4:.5 A4:1 G4:1.5 A4:.5 G4:1 E4:3 D5:2 D5:1 F5:1.5 D5:.5 B4:1 C5:3 E5:3 C5:1 G4:1 E4:1 G4:1.5 F4:.5 D4:1 C4:3 R:3" },
    // Campanas: alegre, para la natilla
    campanas: { bpm: 150, vol: 0.09, n: "E4:1 E4:1 E4:2 E4:1 E4:1 E4:2 E4:1 G4:1 C4:1.5 D4:.5 E4:4 F4:1 F4:1 F4:1.5 F4:.5 F4:1 E4:1 E4:1 E4:.5 E4:.5 E4:1 D4:1 D4:1 E4:1 D4:2 G4:2 R:2" },
    // Les deseamos feliz Navidad: animada, para la culebrita
    feliz: { bpm: 135, vol: 0.09, n: "D4:1 G4:1 G4:.5 A4:.5 G4:.5 F#4:.5 E4:1 E4:1 E4:1 A4:1 A4:.5 B4:.5 A4:.5 G4:.5 F#4:1 D4:1 D4:1 B4:1 B4:.5 C5:.5 B4:.5 A4:.5 G4:1 E4:1 D4:.5 D4:.5 E4:1 A4:1 F#4:1 G4:3 R:2" }
  };
  const script = document.currentScript;
  const tema = TEMAS[(script && script.dataset.tema) || "silencio"] || TEMAS.silencio;
  const SEMI = { C: 0, "C#": 1, D: 2, "D#": 3, E: 4, F: 5, "F#": 6, G: 7, "G#": 8, A: 9, "A#": 10, B: 11 };
  const notas = tema.n.split(/\s+/).map(t => {
    const [nom, dur] = t.split(":");
    if (nom === "R") return { f: 0, d: +dur };
    const m = nom.match(/^([A-G]#?)(\d)$/);
    return { f: 440 * Math.pow(2, (SEMI[m[1]] + 12 * (+m[2]) - 57) / 12), d: +dur };
  });

  let ctx = null, timer = null, encendida = false;
  let silencio = false;
  try { silencio = localStorage.getItem("novena-musica") === "off"; } catch (_) {}

  function nota(t, f, dur) {
    [[1, 0.5], [2, 0.12]].forEach(([mult, gain]) => {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = mult === 1 ? "triangle" : "sine";
      o.frequency.value = f * mult;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(tema.vol * gain, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + Math.max(dur * 0.95, 0.15));
      o.connect(g).connect(ctx.destination);
      o.start(t); o.stop(t + dur + 0.05);
    });
  }
  function ronda() {
    const beat = 60 / tema.bpm;
    let t = ctx.currentTime + 0.1;
    notas.forEach(n => { if (n.f) nota(t, n.f, n.d * beat); t += n.d * beat; });
    timer = setTimeout(ronda, Math.max(0, (t - ctx.currentTime - 0.3) * 1000));
  }
  function sonar() {
    if (encendida || silencio) return;
    try {
      ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
      if (ctx.state === "suspended") ctx.resume();
      encendida = true; ronda();
    } catch (_) {}
  }
  function parar() {
    encendida = false; clearTimeout(timer);
    if (ctx) { ctx.close().catch(() => {}); ctx = null; }
  }

  const b = document.createElement("button");
  b.type = "button"; b.className = "btn-musica";
  const pintar = () => {
    b.textContent = silencio ? "🔇" : "🔊";
    b.setAttribute("aria-label", silencio ? "Activar la música" : "Silenciar la música");
  };
  b.addEventListener("click", e => {
    e.stopPropagation();
    silencio = !silencio;
    try { localStorage.setItem("novena-musica", silencio ? "off" : "on"); } catch (_) {}
    silencio ? parar() : sonar();
    pintar();
  });
  const s = document.createElement("style");
  s.textContent = ".btn-musica{position:fixed;top:42px;right:10px;z-index:5;width:44px;height:44px;border-radius:50%;border:2px solid var(--linea,#2a6a85);background:var(--panel,#134a63);color:#fff;font-size:1.25rem;line-height:1;cursor:pointer;touch-action:manipulation;padding:0}";
  document.head.append(s); pintar();
  document.addEventListener("DOMContentLoaded", () => document.body.append(b));
  if (document.readyState !== "loading") document.body.append(b);

  // El navegador exige un toque del usuario antes de dar sonido.
  ["pointerdown", "keydown"].forEach(ev => addEventListener(ev, sonar, { once: true, passive: true }));
  document.addEventListener("visibilitychange", () => {
    if (!ctx) return;
    document.hidden ? ctx.suspend() : (!silencio && ctx.resume());
  });
})();
