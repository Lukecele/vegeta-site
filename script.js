/**
 * VEGETA // IL PRINCIPE DEI SAIYAN - ARCHIVIO UFFICIALE
 * Core Engine & Interactive Logic
 * Features: Web Audio API Synthesizer, Ki Aura Canvas, PWA Engine,
 *           Gravity Chamber 450G Simulator, Dynamic Quotes & Search,
 *           Speech Synthesis, GDPR & Legal Modals.
 * 
 * Ideato e curato da Luca Celebrano (@Lukecele)
 */

'use strict';

/* ==========================================================================
   1. PWA SERVICE WORKER REGISTRATION
   ========================================================================== */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('./sw.js')
      .then((reg) => {
        console.log('[PWA] Service Worker attivo. Scope:', reg.scope);
      })
      .catch((err) => {
        console.warn('[PWA] Registrazione Service Worker fallita:', err);
      });
  });
}

/* ==========================================================================
   2. WEB AUDIO API SYNTHESIZER (ZERO ASSET AUDIO DEPENDENCY)
   ========================================================================== */
class SaiyanSoundSystem {
  constructor() {
    this.ctx = null;
    this.initialized = false;
  }

  init() {
    if (!this.initialized) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.initialized = true;
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  /**
   * Scouter HUD Multi-Chirp Sound (Classic DBZ Frequency Modulation)
   */
  playScouterBeep() {
    try {
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const freqs = [1760, 2240, 3120];

      freqs.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        // Bandpass filter to make it sound through a digital scouter lens
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(freq, now + idx * 0.08);
        filter.Q.setValueAtTime(8, now + idx * 0.08);

        gain.gain.setValueAtTime(0.001, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.18, now + idx * 0.08 + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.06);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.07);
      });
    } catch (e) {
      console.warn('Audio playback error:', e);
    }
  }

  /**
   * Ki Aura Energy Charge Rumble (Deep Sub-Bass Sweep)
   */
  playKiRumble() {
    try {
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(45, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.4);
      osc.frequency.exponentialRampToValueAtTime(50, now + 0.7);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.22, now + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.7);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.72);
    } catch (e) {
      console.warn('Audio playback error:', e);
    }
  }

  /**
   * Final Flash Blast Powerup Pulse
   */
  playPowerSpike() {
    try {
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.35);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.25, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.42);
    } catch (e) {
      console.warn('Audio playback error:', e);
    }
  }
}

const audio = new SaiyanSoundSystem();

/* ==========================================================================
   3. KI AURA CANVAS PARTICLE SYSTEM
   ========================================================================== */
class KiCanvasSystem {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.maxParticles = 48;
    this.animId = null;
    this.isVisible = true;

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize(), { passive: true });

    // Populate initial particles
    for (let i = 0; i < this.maxParticles; i++) {
      this.particles.push(this.createParticle(true));
    }

    // Pause when tab not visible to save power
    document.addEventListener('visibilitychange', () => {
      this.isVisible = !document.hidden;
      if (this.isVisible) {
        this.loop();
      }
    });

    this.loop();
  }

  resize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  }

  createParticle(randomY = false) {
    const isGold = Math.random() > 0.45;
    return {
      x: Math.random() * this.width,
      y: randomY ? Math.random() * this.height : this.height + 20,
      radius: Math.random() * 2.2 + 0.8,
      speedY: Math.random() * 1.8 + 0.6,
      speedX: (Math.random() - 0.5) * 0.8,
      opacity: Math.random() * 0.7 + 0.2,
      color: isGold ? '251, 191, 36' : '0, 240, 255',
      sparkleSpeed: Math.random() * 0.04 + 0.01,
      angle: Math.random() * Math.PI * 2
    };
  }

  loop() {
    if (!this.isVisible) return;

    this.ctx.clearRect(0, 0, this.width, this.height);

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      p.y -= p.speedY;
      p.x += Math.sin(p.angle) * 0.5 + p.speedX;
      p.angle += p.sparkleSpeed;

      // Glow circle
      this.ctx.beginPath();
      const grad = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 2.2);
      grad.addColorStop(0, `rgba(${p.color}, ${p.opacity})`);
      grad.addColorStop(1, `rgba(${p.color}, 0)`);
      this.ctx.fillStyle = grad;
      this.ctx.arc(p.x, p.y, p.radius * 2.2, 0, Math.PI * 2);
      this.ctx.fill();

      // Core spark
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius * 0.7, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity * 0.9})`;
      this.ctx.fill();

      // Respawn at bottom when out of screen
      if (p.y < -30 || p.x < -30 || p.x > this.width + 30) {
        this.particles[i] = this.createParticle(false);
      }
    }

    this.animId = requestAnimationFrame(() => this.loop());
  }
}

/* ==========================================================================
   4. CURATED QUOTES DATA & DYNAMIC RENDERING ENGINE
   ========================================================================== */
const FALLBACK_QUOTES = [
  {
    quote: "Puoi prendere il controllo della mia mente e del mio corpo, ma c'è una cosa che un Saiyan conserva sempre: il suo ORGOGLIO!",
    context: "Saga di Majin Bu (1994) – A Babidi che tenta di sottometterne la volontà durante lo scontro epico con Goku.",
    category: "Orgoglio & Dignità",
    saga: "Saga di Majin Bu",
    icon: "flame",
    powerLevel: "100.000.000+"
  },
  {
    quote: "Addio Bulma, addio Trunks... e anche a te, Kakaroth. Questa volta non combatto per me stesso.",
    context: "Saga di Majin Bu (1994) – L'estremo saluto alla famiglia e al rivale di sempre prima del Sacrificio Finale.",
    category: "Il Sacrificio di Majin Bu",
    saga: "Saga di Majin Bu",
    icon: "heart",
    powerLevel: "Incalcolabile"
  },
  {
    quote: "Sei tu il numero uno, Kakaroth! Tu non combatti per vincere, ma per superare te stesso. È per questo che non sono mai riuscito a batterti.",
    context: "Saga di Majin Bu (1995) – Il monologo interiore sul pianeta dei Kaiohshin, riconoscendo con suprema nobiltà il valore di Goku.",
    category: "L'Eterna Rivalità con Kakaroth",
    saga: "Saga di Majin Bu",
    icon: "trophy",
    powerLevel: "Supremo"
  },
  {
    quote: "Io non ho mai avuto maestri che mi abbiano regalato qualcosa. Tutto ciò che possiedo l'ho strappato con il sangue, con la rabbia e con un allenamento spietato a 450 volte la gravità terrestre!",
    context: "Saga degli Androidi (1992) – La rivelazione della trasformazione in Super Saiyan tra le meteore dello spazio profondo.",
    category: "Allenamento & Determinazione",
    saga: "Saga degli Androidi",
    icon: "zap",
    powerLevel: "80.000.000"
  },
  {
    quote: "I limiti esistono soltanto per coloro che hanno paura di superarli. Un principe guerriero abbatte le proprie barriere a mani nude!",
    context: "Allenamento nella Stanza dello Spirito e del Tempo – Prima di scendere in campo contro Cell.",
    category: "Super Saiyan & Limiti",
    saga: "Saga di Cell",
    icon: "shield",
    powerLevel: "Super Vegeta"
  },
  {
    quote: "Guarda con attenzione, Cell. Questo è il colpo che cancellerà ogni singola molecola della tua arroganza dalla faccia dell'universo: LAMPO FINALE (FINAL FLASH)!",
    context: "Saga di Cell (1992) – Il leggendario caricamento del Final Flash che scuote la crosta terrestre.",
    category: "Super Saiyan & Limiti",
    saga: "Saga di Cell",
    icon: "sparkles",
    powerLevel: "Massima Potenza"
  },
  {
    quote: "Come osi... toccare la mia BULMAAAAA?!",
    context: "La Battaglia degli Dei (2013) – Quando la furia per la persona amata supera momentaneamente perfino il potere del Dio della Distruzione Beerus.",
    category: "La Famiglia & L'Evoluzione",
    saga: "Dragon Ball Super",
    icon: "flame",
    powerLevel: "Rabbia Divina"
  },
  {
    quote: "Non getterò mai via ciò che sono! Non abbandonerò il mio orgoglio per ottenere un potere a buon mercato. Io sono Vegeta, il Principe dei Saiyan, e manterrò la mia promessa con la mia forza!",
    context: "Torneo del Potere (2018) – Contro Toppo Dio della Distruzione, sbloccando il Super Saiyan Blue Evolution.",
    category: "Orgoglio & Dignità",
    saga: "Dragon Ball Super",
    icon: "crown",
    powerLevel: "Blue Evolution"
  },
  {
    quote: "Non c'è niente di vergognoso nel cadere. La vera vergogna è rimanere a terra a leccarsi le ferite quando la battaglia non è ancora finita.",
    context: "A Trunks del Futuro – Lezione sul campo di battaglia e sulla determinazione senza compromessi.",
    category: "Allenamento & Determinazione",
    saga: "Saga degli Androidi",
    icon: "award",
    powerLevel: "350.000"
  },
  {
    quote: "Kakaroth, tu hai un cuore troppo indulgente. Ma questo universo rispetta soltanto chi sa imporre la propria volontà con la forza indomabile del proprio spirito.",
    context: "Saga di Namecc (1991) – Dialogo su Namecc prima dello scontro definitivo con Freezer.",
    category: "L'Eterna Rivalità con Kakaroth",
    saga: "Saga di Namecc",
    icon: "crosshair",
    powerLevel: "250.000"
  },
  {
    quote: "Un corpo che non conosce il dolore non conoscerà mai la vera forza. Il sudore che versi in solitudine è l'unica corazza che non si spezzerà mai.",
    context: "Capsule Corporation – Sessione di addestramento estremo nella Gravity Room con 500G.",
    category: "Allenamento & Determinazione",
    saga: "Saga di Majin Bu",
    icon: "target",
    powerLevel: "Gravity 500G"
  },
  {
    quote: "Trunks, ascoltami bene: non ti ho mai abbracciato da quando sei nato... Lascia che ti stringa adesso. Sii fiero di essere un Saiyan e abbi cura di tua madre.",
    context: "Saga di Majin Bu (1994) – L'abbraccio commovente a Trunks prima di addormentarlo per salvarlo dall'esplosione.",
    category: "La Famiglia & L'Evoluzione",
    saga: "Saga di Majin Bu",
    icon: "heart",
    powerLevel: "Amore di Padre"
  }
];

let allQuotes = [...FALLBACK_QUOTES];
let activeCategoryFilter = 'all';
let searchQuery = '';

/**
 * Caricamento asincrono con fallback garantito
 */
async function loadQuotes() {
  try {
    const res = await fetch('./quotes.json');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        allQuotes = data;
      }
    }
  } catch (e) {
    console.info('[Quotes] Utilizzo del database locale di fallback integrato:', e.message);
  }
  renderQuotes();
}

/**
 * Renderizza le card delle citazioni con filtri e ricerca
 */
function renderQuotes() {
  const container = document.getElementById('quote-list');
  if (!container) return;

  const filtered = allQuotes.filter((item) => {
    // Filtro per categoria
    const matchesCategory =
      activeCategoryFilter === 'all' || item.category === activeCategoryFilter;

    // Filtro per ricerca testuale
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      query === '' ||
      item.quote.toLowerCase().includes(query) ||
      item.context.toLowerCase().includes(query) ||
      item.saga.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query);

    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="quotes-empty-state" style="grid-column: 1 / -1; text-align: center; padding: 3rem 1.5rem; background: rgba(14,21,48,0.5); border-radius: 16px; border: 1px dashed rgba(251,191,36,0.3);">
        <i data-lucide="search-x" style="width: 48px; height: 48px; color: var(--gold-light); margin-bottom: 1rem;"></i>
        <h3 style="font-family: var(--font-royal); color: #fff; margin-bottom: 0.5rem;">Nessuna massima Saiyan trovata</h3>
        <p style="color: var(--text-muted); font-size: 0.95rem; max-width: 480px; margin: 0 auto;">Nessuna citazione corrisponde a «<strong>${escapeHtml(searchQuery)}</strong>». Prova con termini come <em>orgoglio</em>, <em>Kakaroth</em>, <em>450G</em> o <em>Cell</em>.</p>
      </div>
    `;
    if (window.lucide) lucide.createIcons();
    return;
  }

  container.innerHTML = filtered
    .map((item, index) => {
      const iconName = item.icon || 'quote';
      return `
        <article class="quote-card" data-index="${index}">
          <div class="qc-header">
            <div class="qc-badge-group">
              <span class="qc-saga-tag">${escapeHtml(item.saga)}</span>
              <span class="qc-power-tag">${escapeHtml(item.powerLevel || 'Saiyan')}</span>
            </div>
            <div class="qc-icon-wrap" aria-hidden="true">
              <i data-lucide="${iconName}"></i>
            </div>
          </div>

          <blockquote class="qc-body">
            «${escapeHtml(item.quote)}»
          </blockquote>

          <p class="qc-context">
            ${escapeHtml(item.context)}
          </p>

          <div class="qc-actions">
            <button class="btn-card-action btn-copy-quote" data-quote="${escapeAttribute(item.quote)}" data-context="${escapeAttribute(item.context)}" title="Copia citazione">
              <i data-lucide="copy"></i>
              <span>Copia</span>
            </button>

            <button class="btn-card-action btn-speak-quote" data-quote="${escapeAttribute(item.quote)}" title="Ascolta con voce sintetica">
              <i data-lucide="volume-2"></i>
              <span>Ascolta</span>
            </button>

            <button class="btn-card-action btn-share-quote" data-quote="${escapeAttribute(item.quote)}" data-context="${escapeAttribute(item.context)}" title="Condividi">
              <i data-lucide="share-2"></i>
              <span>Condividi</span>
            </button>
          </div>
        </article>
      `;
    })
    .join('');

  if (window.lucide) {
    lucide.createIcons();
  }
}

/* ==========================================================================
   5. ACTIONS: COPIA, ASCOLTO (SPEECH SYNTHESIS) & CONDIVISIONE
   ========================================================================== */
function setupQuoteActions() {
  const container = document.getElementById('quote-list');
  if (!container) return;

  container.addEventListener('click', (e) => {
    // 1. Copia negli appunti
    const copyBtn = e.target.closest('.btn-copy-quote');
    if (copyBtn) {
      const quote = copyBtn.getAttribute('data-quote');
      const context = copyBtn.getAttribute('data-context');
      const fullText = `«${quote}»\n– ${context}\n\n[Vegeta // Il Principe dei Saiyan: https://vegeta.celebrano.com]`;

      navigator.clipboard.writeText(fullText).then(() => {
        audio.playScouterBeep();
        showToast('Citazione copiata con successo negli appunti!', 'check-circle');
      }).catch(() => {
        showToast('Errore durante la copia della citazione', 'alert-circle');
      });
      return;
    }

    // 2. Ascolta con Web Speech Synthesis
    const speakBtn = e.target.closest('.btn-speak-quote');
    if (speakBtn) {
      const quote = speakBtn.getAttribute('data-quote');
      speakQuote(quote);
      return;
    }

    // 3. Condividi con Web Share API o Fallback
    const shareBtn = e.target.closest('.btn-share-quote');
    if (shareBtn) {
      const quote = shareBtn.getAttribute('data-quote');
      const context = shareBtn.getAttribute('data-context');
      if (navigator.share) {
        navigator.share({
          title: 'Vegeta – Il Principe dei Saiyan',
          text: `«${quote}» – ${context}`,
          url: window.location.href
        }).catch((err) => {
          if (err.name !== 'AbortError') {
            copyToClipboardDirect(`«${quote}»\n– ${context}`);
          }
        });
      } else {
        copyToClipboardDirect(`«${quote}»\n– ${context}`);
      }
    }
  });
}

function speakQuote(text) {
  if (!('speechSynthesis' in window)) {
    showToast('Sintesi vocale non supportata dal tuo browser', 'volume-x');
    return;
  }

  window.speechSynthesis.cancel(); // Arresta eventuale discorso in corso
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'it-IT';
  utterance.rate = 0.92; // Tono fiero e misurato
  utterance.pitch = 0.88; // Timbro più profondo e autoritario

  // Prova a selezionare una voce italiana naturale se disponibile
  const voices = window.speechSynthesis.getVoices();
  const italianVoice = voices.find((v) => v.lang.startsWith('it'));
  if (italianVoice) {
    utterance.voice = italianVoice;
  }

  audio.playKiRumble();
  showToast('Riproduzione vocale in corso...', 'volume-2');
  window.speechSynthesis.speak(utterance);
}

function copyToClipboardDirect(text) {
  navigator.clipboard.writeText(text).then(() => {
    audio.playScouterBeep();
    showToast('Testo copiato per la condivisione!', 'share-2');
  });
}

/* ==========================================================================
   6. GRAVITY CHAMBER 450G & SCOUTER SIMULATOR ENGINE
   ========================================================================== */
function setupGravityChamber() {
  const gravButtons = document.querySelectorAll('.gravity-buttons .grav-btn');
  const hoursInput = document.getElementById('hoursInput');
  const gritInput = document.getElementById('gritInput');
  const scanPowerBtn = document.getElementById('scanPowerBtn');

  const gravityDisplay = document.getElementById('gravityDisplay');
  const hoursDisplay = document.getElementById('hoursDisplay');
  const gritDisplay = document.getElementById('gritDisplay');

  const hudStatus = document.getElementById('hudStatus');
  const scouterPowerNumber = document.getElementById('scouterPowerNumber');
  const vegetaVerdict = document.getElementById('vegetaVerdict');
  const hudBarFill = document.getElementById('hudBarFill');

  let currentG = 450;

  // Selezione bottoni gravità
  gravButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      gravButtons.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-checked', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-checked', 'true');

      currentG = parseInt(btn.getAttribute('data-g'), 10) || 450;
      updateGravityLabel();
      audio.playScouterBeep();
    });
  });

  function updateGravityLabel() {
    if (!gravityDisplay) return;
    if (currentG >= 500) {
      gravityDisplay.textContent = `${currentG}G+ (Limite Estremo Capsule Corp)`;
    } else if (currentG === 450) {
      gravityDisplay.textContent = '450G (Capsule Corp Super - Standard Vegeta)';
    } else if (currentG === 300) {
      gravityDisplay.textContent = '300G (Addestramento Androidi)';
    } else {
      gravityDisplay.textContent = '100G (Viaggio verso Namecc)';
    }
  }

  // Sliders input
  if (hoursInput && hoursDisplay) {
    hoursInput.addEventListener('input', () => {
      hoursDisplay.textContent = `${hoursInput.value} Ore`;
    });
  }

  if (gritInput && gritDisplay) {
    gritInput.addEventListener('input', () => {
      const val = parseInt(gritInput.value, 10);
      let tag = 'Resistenza Base';
      if (val >= 90) tag = 'Orgoglio Reale Infrangibile';
      else if (val >= 75) tag = 'Furia Super Saiyan';
      else if (val >= 50) tag = 'Disciplina Rigorosa';
      gritDisplay.textContent = `${val}% (${tag})`;
    });
  }

  // Bottone Scansione Scouter
  if (scanPowerBtn) {
    scanPowerBtn.addEventListener('click', () => {
      audio.playKiRumble();
      audio.playScouterBeep();

      if (hudStatus) {
        hudStatus.textContent = 'CALCOLO KI IN CORSO...';
        hudStatus.style.color = 'var(--gold-primary)';
      }

      // Disabilita temporaneamente il bottone durante l'animazione
      scanPowerBtn.disabled = true;

      const hours = parseInt(hoursInput.value, 10) || 8;
      const grit = parseInt(gritInput.value, 10) || 90;

      // Formula dinamica Potenza di Combattimento Saiyan
      // Base: 18.000 (Vegeta Saga Saiyan)
      const gFactor = currentG / 100;
      const hoursFactor = Math.pow(hours / 8, 1.4);
      const gritFactor = Math.pow(grit / 50, 1.8);

      const targetPower = Math.round(18000 * gFactor * hoursFactor * gritFactor * 12.5);

      // Animazione del contatore digitale numerico
      let currentVal = Math.round(targetPower * 0.15);
      const step = Math.max(1, Math.round(targetPower / 25));
      const interval = setInterval(() => {
        currentVal += step;
        if (currentVal >= targetPower) {
          currentVal = targetPower;
          clearInterval(interval);
          finishScan(targetPower, hours, grit, currentG);
        }
        if (scouterPowerNumber) {
          scouterPowerNumber.textContent = currentVal.toLocaleString('it-IT');
        }
      }, 35);
    });
  }

  function finishScan(power, hours, grit, g) {
    scanPowerBtn.disabled = false;
    audio.playPowerSpike();

    if (hudStatus) {
      hudStatus.textContent = 'ANALISI COMPLETATA // RISULTATO';
      hudStatus.style.color = 'var(--ki-blue)';
    }

    // Calcolo barra percentuale HUD (max 3.500.000)
    const percentage = Math.min(100, Math.max(15, Math.round((power / 2500000) * 100)));
    if (hudBarFill) {
      hudBarFill.style.width = `${percentage}%`;
    }

    // Giudizio personalizzato di Vegeta
    let verdict = '';
    if (g < 300 || hours < 4 || grit < 50) {
      verdict = `«Patetico! Solo <strong>${power.toLocaleString('it-IT')}</strong> punti combattimento?! Con questo ritmo persino Radish ti riderebbe in faccia! Un vero Saiyan non si accontenta di mezze misure: aumenta la gravità ed elimina ogni debolezza dalla tua mente!»`;
    } else if (power < 800000) {
      verdict = `«Livello di combattimento: <strong>${power.toLocaleString('it-IT')}</strong>. Non sei più un guerriero di infimo livello, ma siamo ancora lontani dall'élite dell'universo. Continua a spingere il corpo a 450G finché le tue ossa non si abituano al peso del tuo stesso orgoglio!»`;
    } else if (power < 1800000) {
      verdict = `«Notevole... <strong>${power.toLocaleString('it-IT')}</strong> punti! La rabbia comincia a scorrere come pura energia dorata nelle tue vene. Il Super Saiyan non è più un'illusione, ma non osare rilassarti: Kakaroth non dorme mai!»`;
    } else {
      verdict = `«IMPRESSIONANTE! Livello calcolato: <strong>${power.toLocaleString('it-IT')}</strong>! Hai raggiunto lo status di <em>Super Vegeta</em> con il <em>Blue Evolution</em>! Il tuo spirito è degno del sangue reale di noi Saiyan. Ora fai tremare l'universo!»`;
    }

    if (vegetaVerdict) {
      vegetaVerdict.innerHTML = verdict;
    }
  }
}

/* ==========================================================================
   7. DAILY QUOTE GENERATOR (PILLOLA D'ORGOGLIO)
   ========================================================================== */
function setupDailyQuote() {
  const dailyText = document.getElementById('dailyQuoteText');
  const dailyContext = document.getElementById('dailyQuoteContext');
  const newBtn = document.getElementById('newQuoteBtn');

  if (!dailyText || !newBtn) return;

  newBtn.addEventListener('click', () => {
    audio.playScouterBeep();

    dailyText.style.opacity = '0';
    dailyText.style.transform = 'translateY(8px)';
    if (dailyContext) {
      dailyContext.style.opacity = '0';
      dailyContext.style.transform = 'translateY(8px)';
    }

    setTimeout(() => {
      const randomItem = allQuotes[Math.floor(Math.random() * allQuotes.length)];
      dailyText.textContent = `«${randomItem.quote}»`;
      if (dailyContext) {
        dailyContext.textContent = `– ${randomItem.context}`;
      }

      dailyText.style.transition = 'all 0.35s ease';
      dailyText.style.opacity = '1';
      dailyText.style.transform = 'translateY(0)';
      if (dailyContext) {
        dailyContext.style.transition = 'all 0.35s ease 0.1s';
        dailyContext.style.opacity = '1';
        dailyContext.style.transform = 'translateY(0)';
      }
    }, 200);
  });
}

/* ==========================================================================
   8. FILTRI CATEGORIA & RICERCA TEMPESTIVA
   ========================================================================== */
function setupSearchAndFilters() {
  const searchInput = document.getElementById('quoteSearch');
  const clearBtn = document.getElementById('clearSearchBtn');
  const filterBtns = document.querySelectorAll('#categoryFilters .filter-btn');

  // Input di ricerca in tempo reale
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      if (clearBtn) {
        clearBtn.style.opacity = searchQuery.length > 0 ? '1' : '0.4';
      }
      renderQuotes();
    });
  }

  // Tasto per cancellare la ricerca
  if (clearBtn && searchInput) {
    clearBtn.addEventListener('click', () => {
      searchInput.value = '';
      searchQuery = '';
      clearBtn.style.opacity = '0.4';
      searchInput.focus();
      renderQuotes();
    });
  }

  // Bottoni di filtro categoria
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      activeCategoryFilter = btn.getAttribute('data-filter') || 'all';
      audio.playScouterBeep();
      renderQuotes();
    });
  });
}

/* ==========================================================================
   9. MOBILE DRAWER & KEYBOARD NAVIGATION
   ========================================================================== */
function setupMobileDrawer() {
  const toggleBtn = document.getElementById('mobileToggle');
  const drawer = document.getElementById('mobileDrawer');
  const overlay = document.getElementById('drawerOverlay');
  const closeBtn = document.getElementById('drawerClose');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  if (!toggleBtn || !drawer || !overlay) return;

  function openDrawer() {
    drawer.classList.add('open');
    overlay.classList.add('open');
    toggleBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    audio.playScouterBeep();
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    overlay.classList.remove('open');
    toggleBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', () => {
    if (drawer.classList.contains('open')) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  overlay.addEventListener('click', closeDrawer);

  drawerLinks.forEach((link) => {
    link.addEventListener('click', closeDrawer);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeDrawer();
    }
  });
}

/* ==========================================================================
   10. GDPR COOKIE BANNER & LOCAL STORAGE CONSENT
   ========================================================================== */
function setupCookieBanner() {
  const banner = document.getElementById('cookieBanner');
  const acceptBtn = document.getElementById('acceptCookiesBtn');
  const rejectBtn = document.getElementById('rejectCookiesBtn');
  const CONSENT_KEY = 'vegeta_cookie_consent_v1';

  if (!banner) return;

  const currentConsent = localStorage.getItem(CONSENT_KEY);

  if (!currentConsent) {
    // Mostra il banner con un leggero delay per fluidità di caricamento
    setTimeout(() => {
      banner.classList.add('visible');
    }, 700);
  }

  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => {
      localStorage.setItem(CONSENT_KEY, JSON.stringify({ status: 'accepted', timestamp: Date.now() }));
      banner.classList.remove('visible');
      audio.playScouterBeep();
      showToast('Preferenze privacy salvate: Consenso completo', 'check-circle');
    });
  }

  if (rejectBtn) {
    rejectBtn.addEventListener('click', () => {
      localStorage.setItem(CONSENT_KEY, JSON.stringify({ status: 'necessary_only', timestamp: Date.now() }));
      banner.classList.remove('visible');
      showToast('Preferenze privacy salvate: Solo cookie tecnici', 'shield');
    });
  }
}

/* ==========================================================================
   11. LEGAL MODAL & FAIR USE ACCORDION
   ========================================================================== */
function setupLegalModal() {
  const modalOverlay = document.getElementById('legalModalOverlay');
  const closeBtn = document.getElementById('closeLegalModal');
  const dismissBtn = document.getElementById('modalDismissBtn');

  const openPrivacyBtn = document.getElementById('openPrivacyBtn');
  const openCookieBtn = document.getElementById('openCookieBtn');
  const openCopyrightBtn = document.getElementById('openCopyrightBtn');

  if (!modalOverlay) return;

  function openModal() {
    modalOverlay.classList.add('open');
    modalOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    audio.playScouterBeep();
  }

  function closeModal() {
    modalOverlay.classList.remove('open');
    modalOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (openPrivacyBtn) openPrivacyBtn.addEventListener('click', openModal);
  if (openCookieBtn) openCookieBtn.addEventListener('click', openModal);
  if (openCopyrightBtn) openCopyrightBtn.addEventListener('click', openModal);

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (dismissBtn) dismissBtn.addEventListener('click', closeModal);

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('open')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   12. BACK TO TOP BUTTON
   ========================================================================== */
function setupBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  btn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    audio.playScouterBeep();
  });
}

/* ==========================================================================
   13. TOAST NOTIFICATION UTILITY
   ========================================================================== */
let toastTimeout = null;

function showToast(message, iconName = 'check-circle') {
  const toast = document.getElementById('toastNotification');
  const toastMsg = document.getElementById('toastMessage');
  if (!toast || !toastMsg) return;

  toastMsg.textContent = message;

  // Sostituisce l'icona interna del toast se presente
  const oldIcon = toast.querySelector('.toast-icon');
  if (oldIcon) {
    const newIcon = document.createElement('i');
    newIcon.setAttribute('data-lucide', iconName);
    newIcon.className = 'toast-icon';
    toast.replaceChild(newIcon, oldIcon);
    if (window.lucide) lucide.createIcons();
  }

  toast.classList.add('show');

  if (toastTimeout) {
    clearTimeout(toastTimeout);
  }

  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

/* ==========================================================================
   14. NAVBAR SCOUTER SOUND BUTTON
   ========================================================================== */
function setupNavbarAudioButton() {
  const soundBtn = document.getElementById('scouterSoundBtn');
  if (!soundBtn) return;

  soundBtn.addEventListener('click', () => {
    audio.playKiRumble();
    audio.playScouterBeep();
    showToast('Scouter attivo: Scansione Ki nell\'area!', 'radio');
  });
}

/* ==========================================================================
   15. UTILITIES: SANITIZZAZIONE HTML & ATTRIBUTI
   ========================================================================== */
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeAttribute(str) {
  if (!str) return '';
  return String(str)
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/\n/g, ' ');
}

/* ==========================================================================
   16. BOOTSTRAP APPLICATIVO
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  // 1. Inizializzazione Canvas Ki Aura
  new KiCanvasSystem('kiCanvas');

  // 2. Setup Moduli Interattivi
  setupNavbarAudioButton();
  setupMobileDrawer();
  setupGravityChamber();
  setupDailyQuote();
  setupSearchAndFilters();
  setupQuoteActions();
  setupCookieBanner();
  setupLegalModal();
  setupBackToTop();

  // 3. Caricamento Citazioni
  loadQuotes();

  // 4. Inizializzazione Icone Lucide nel DOM
  if (window.lucide) {
    lucide.createIcons();
  }
});
