/**
 * VEGETA // IL PRINCIPE DEI SAIYAN - ARCHIVIO UFFICIALE
 * Core Engine & Interactive Logic
 * Features: PWA Engine, Ki Aura Canvas, Gravity Chamber 450G Simulator,
 *           Dynamic Quotes & Real-Time Search, Authentic Video Theater Modal (HD ITA),
 *           GDPR & Legal Modals.
 * Zero audio sintetico/robotico: solo scene e doppiaggio originale (Gianluca Iacono).
 * 
 * Sviluppato da @Lukecele (https://github.com/Lukecele)
 */

'use strict';

/* ==========================================================================
   1. PWA SERVICE WORKER REGISTRATION & CACHE PURGE
   ========================================================================== */
// Cancella immediatamente qualsiasi discorso sintetico residuo
if ('speechSynthesis' in window) {
  try { window.speechSynthesis.cancel(); } catch (e) {}
}

// Purga immediata delle vecchie cache dal browser
if ('caches' in window) {
  caches.keys().then((keys) => {
    keys.forEach((key) => {
      if (key !== 'vegeta-pwa-v5') {
        console.log('[Cache Purge] Rimuovo cache obsoleta:', key);
        caches.delete(key);
      }
    });
  });
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('./sw.js?v=2.0.2')
      .then((reg) => {
        console.log('[PWA] Service Worker attivo. Scope:', reg.scope);
        // Forza l'aggiornamento immediato del Service Worker
        reg.update();
      })
      .catch((err) => {
        console.warn('[PWA] Registrazione Service Worker fallita:', err);
      });
  });
}

/* ==========================================================================
   2. KI AURA CANVAS PARTICLE SYSTEM (EFFETTO VISIVO AMBIENTALE 60FPS)
   ========================================================================== */
class KiCanvasSystem {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.maxParticles = 45;
    this.animId = null;
    this.isVisible = true;

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize(), { passive: true });

    for (let i = 0; i < this.maxParticles; i++) {
      this.particles.push(this.createParticle(true));
    }

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

      this.ctx.beginPath();
      const grad = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 2.2);
      grad.addColorStop(0, `rgba(${p.color}, ${p.opacity})`);
      grad.addColorStop(1, `rgba(${p.color}, 0)`);
      this.ctx.fillStyle = grad;
      this.ctx.arc(p.x, p.y, p.radius * 2.2, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius * 0.7, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity * 0.9})`;
      this.ctx.fill();

      if (p.y < -30 || p.x < -30 || p.x > this.width + 30) {
        this.particles[i] = this.createParticle(false);
      }
    }

    this.animId = requestAnimationFrame(() => this.loop());
  }
}

/* ==========================================================================
   3. CURATED QUOTES DATA & DYNAMIC RENDERING (ZERO AUDIO ROBOTICO)
   ========================================================================== */
const FALLBACK_QUOTES = [
  {
    quote: "Puoi prendere il controllo della mia mente e del mio corpo, ma c'è una cosa che un Saiyan conserva sempre: il suo ORGOGLIO!",
    context: "Saga di Majin Bu (1994) – A Babidi che tenta di sottometterne la volontà durante lo scontro epico con Goku.",
    category: "Orgoglio & Dignità",
    saga: "Saga di Majin Bu",
    icon: "flame",
    powerLevel: "100.000.000+",
    videoId: "QC2nTxGf7lg",
    videoTitle: "Vegeta si ribella a Babidi – Doppiaggio ITA Gianluca Iacono"
  },
  {
    quote: "Addio Bulma, addio Trunks... e anche a te, Kakaroth. Questa volta non combatto per me stesso.",
    context: "Saga di Majin Bu (1994) – L'estremo saluto alla famiglia e al rivale di sempre prima del Sacrificio Finale.",
    category: "Il Sacrificio di Majin Bu",
    saga: "Saga di Majin Bu",
    icon: "heart",
    powerLevel: "Incalcolabile",
    videoId: "m246vcU1vl4",
    videoTitle: "Il Sacrificio di Majin Vegeta – Doppiaggio ITA Gianluca Iacono"
  },
  {
    quote: "Sei tu il numero uno, Kakaroth! Tu non combatti per vincere, ma per superare te stesso. È per questo che non sono mai riuscito a batterti.",
    context: "Saga di Majin Bu (1995) – Il monologo interiore sul pianeta dei Kaiohshin, riconoscendo con suprema nobiltà il valore di Goku.",
    category: "L'Eterna Rivalità con Kakaroth",
    saga: "Saga di Majin Bu",
    icon: "trophy",
    powerLevel: "Supremo",
    videoId: "a2JuOpsz-1c",
    videoTitle: "Vegeta riconosce che Goku è il numero uno – Doppiaggio ITA Gianluca Iacono"
  },
  {
    quote: "Io non ho mai avuto maestri che mi abbiano regalato qualcosa. Tutto ciò che possiedo l'ho strappato con il sangue, con la rabbia e con un allenamento spietato a 450 volte la gravità terrestre!",
    context: "Saga degli Androidi (1992) – La rivelazione della trasformazione in Super Saiyan tra le meteore dello spazio profondo.",
    category: "Allenamento & Determinazione",
    saga: "Saga degli Androidi",
    icon: "zap",
    powerLevel: "80.000.000",
    videoId: "KaMvJaBRAuc",
    videoTitle: "Vegeta si trasforma per la prima volta in Super Saiyan – Doppiaggio ITA HD"
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
    powerLevel: "Massima Potenza",
    videoId: "m6NwuTNxDZs",
    videoTitle: "Lampo Finale (Final Flash) contro Cell – Doppiaggio ITA Gianluca Iacono"
  },
  {
    quote: "Come osi... toccare la mia BULMAAAAA?!",
    context: "La Battaglia degli Dei (2013) – Quando la furia per la persona amata supera momentaneamente perfino il potere del Dio della Distruzione Beerus.",
    category: "La Famiglia & L'Evoluzione",
    saga: "Dragon Ball Super",
    icon: "flame",
    powerLevel: "Rabbia Divina",
    videoId: "hesiDXQuUP4",
    videoTitle: "LA MIA BULMAAA!! La furia contro Beerus – Doppiaggio ITA Gianluca Iacono"
  },
  {
    quote: "Non getterò mai via ciò che sono! Non abbandonerò il mio orgoglio per ottenere un potere a buon mercato. Io sono Vegeta, il Principe dei Saiyan, e manterrò la mia promessa con la mia forza!",
    context: "Torneo del Potere (2018) – Contro Toppo Dio della Distruzione, sbloccando il Super Saiyan Blue Evolution.",
    category: "Orgoglio & Dignità",
    saga: "Dragon Ball Super",
    icon: "crown",
    powerLevel: "Blue Evolution",
    videoId: "X3lleuQZwCA",
    videoTitle: "Vegeta vs Toppo: Super Saiyan Blue Evolution – Doppiaggio ITA Gianluca Iacono"
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
    powerLevel: "Amore di Padre",
    videoId: "m246vcU1vl4",
    videoTitle: "L'abbraccio a Trunks e il Sacrificio di Majin Vegeta – Doppiaggio ITA Gianluca Iacono"
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
    const res = await fetch('./quotes.json?v=2.0.0');
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
 * Renderizza le card delle citazioni con filtri, ricerca e scene autentiche
 */
function renderQuotes() {
  const container = document.getElementById('quote-list');
  if (!container) return;

  const filtered = allQuotes.filter((item) => {
    const matchesCategory =
      activeCategoryFilter === 'all' || item.category === activeCategoryFilter;

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
      const hasVideo = !!item.videoId;

      const videoButton = hasVideo
        ? `<button class="btn-card-action btn-watch-scene" data-video-id="${escapeAttribute(item.videoId)}" data-video-title="${escapeAttribute(item.videoTitle || item.quote)}" title="Guarda la scena originale in HD ITA con la voce di Gianluca Iacono">
             <i data-lucide="play-circle"></i>
             <span>Scena HD ITA</span>
           </button>`
        : '';

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
            ${videoButton}

            <button class="btn-card-action btn-copy-quote" data-quote="${escapeAttribute(item.quote)}" data-context="${escapeAttribute(item.context)}" title="Copia citazione">
              <i data-lucide="copy"></i>
              <span>Copia</span>
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
   4. ACTIONS: COPIA, CONDIVISIONE & THEATER MODAL PER SCENE REALI (HD ITA)
   ========================================================================== */
function setupQuoteActions() {
  const container = document.getElementById('quote-list');
  if (!container) return;

  container.addEventListener('click', (e) => {
    // 1. Guarda Scena Originale HD ITA
    const watchBtn = e.target.closest('.btn-watch-scene');
    if (watchBtn) {
      const videoId = watchBtn.getAttribute('data-video-id');
      const videoTitle = watchBtn.getAttribute('data-video-title');
      if (videoId) {
        openVideoModal(videoId, videoTitle);
      }
      return;
    }

    // 2. Copia negli appunti
    const copyBtn = e.target.closest('.btn-copy-quote');
    if (copyBtn) {
      const quote = copyBtn.getAttribute('data-quote');
      const context = copyBtn.getAttribute('data-context');
      const fullText = `«${quote}»\n– ${context}\n\n[Vegeta // Il Principe dei Saiyan: https://vegeta-site.vercel.app]`;

      navigator.clipboard.writeText(fullText).then(() => {
        showToast('Citazione copiata negli appunti!', 'check-circle');
      }).catch(() => {
        showToast('Errore durante la copia della citazione', 'alert-circle');
      });
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

function copyToClipboardDirect(text) {
  navigator.clipboard.writeText(text).then(() => {
    showToast('Testo copiato per la condivisione!', 'share-2');
  });
}

/* ==========================================================================
   5. VIDEO THEATER MODAL (DOPIAGGIO ORIGINALE ITALIANO)
   ========================================================================== */
function setupVideoModal() {
  const modal = document.getElementById('videoModalOverlay');
  const closeBtn = document.getElementById('closeVideoModal');
  if (!modal) return;

  if (closeBtn) {
    closeBtn.addEventListener('click', closeVideoModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeVideoModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeVideoModal();
    }
  });
}

function openVideoModal(videoId, title) {
  const modal = document.getElementById('videoModalOverlay');
  const iframe = document.getElementById('videoModalIframe');
  const titleEl = document.getElementById('videoModalTitleText');

  if (!modal || !iframe) return;

  if (titleEl && title) {
    titleEl.textContent = title;
  }

  // Carica il video originale con autoplay
  iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeVideoModal() {
  const modal = document.getElementById('videoModalOverlay');
  const iframe = document.getElementById('videoModalIframe');

  if (!modal) return;

  // Scarica l'iframe per arrestare immediatamente l'audio del video
  if (iframe) {
    iframe.src = '';
  }

  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

/* ==========================================================================
   6. GRAVITY CHAMBER 450G & SCOUTER SIMULATOR (ZERO ROBOTIC NOISE)
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

  // Bottoni gravità
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

  // Bottone Scansione Scouter (puro calcolo visivo e fluido)
  if (scanPowerBtn) {
    scanPowerBtn.addEventListener('click', () => {
      if (hudStatus) {
        hudStatus.textContent = 'CALCOLO KI IN CORSO...';
        hudStatus.style.color = 'var(--gold-primary)';
      }

      scanPowerBtn.disabled = true;

      const hours = parseInt(hoursInput.value, 10) || 8;
      const grit = parseInt(gritInput.value, 10) || 90;

      const gFactor = currentG / 100;
      const hoursFactor = Math.pow(hours / 8, 1.4);
      const gritFactor = Math.pow(grit / 50, 1.8);

      const targetPower = Math.round(18000 * gFactor * hoursFactor * gritFactor * 12.5);

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

const POWER_TIERS = [
  {
    min: 0,
    max: 15000,
    rank: "Guerriero di Infimo Livello",
    icon: "skull",
    badgeClass: "rank-tier-1",
    borderColor: "#ef4444",
    barGradient: "linear-gradient(90deg, #b91c1c, #ef4444)",
    verdict: (p) =>
      `«Patetico! Solo <strong>${p.toLocaleString('it-IT')}</strong> punti combattimento?! Con questo ritmo persino un Saibaiman o Radish ti riderebbero in faccia! Un vero guerriero non si accontenta di mezze misure: aumenta la gravità, elimina le scuse e impara cosa significa sputare sangue!»`
  },
  {
    min: 15000,
    max: 45000,
    rank: "Élite della Dinastia Saiyan (Saga dei Saiyan)",
    icon: "crosshair",
    badgeClass: "rank-tier-2",
    borderColor: "#f59e0b",
    barGradient: "linear-gradient(90deg, #d97706, #fbbf24)",
    verdict: (p) =>
      `«Livello registrato: <strong>${p.toLocaleString('it-IT')}</strong> punti. Non sei più un insetto qualunque: hai raggiunto la forza con cui atterrai sulla Terra al fianco di Nappa (18.000 punti col Cannone Galick)! Ma non montarti la testa: nell'universo profondo questo potere è solo l'antipasto. Continua a spingere!»`
  },
  {
    min: 45000,
    max: 200000,
    rank: "Veterano di Namecc (Squadra Ginyu Tier)",
    icon: "target",
    badgeClass: "rank-tier-3",
    borderColor: "#10b981",
    barGradient: "linear-gradient(90deg, #059669, #34d399)",
    verdict: (p) =>
      `«Punti combattimento: <strong>${p.toLocaleString('it-IT')}</strong>. Notevole! Hai cancellato guerrieri come Dodoria e Zarbon e stai rivaleggiando contro l'intera Squadra Ginyu (Capitano Ginyu a 120.000)! Lo Scouter trema sotto la tua pressione, ma resta vigile: Freezer è ancora in agguato e non perdonerà nessuna esitazione!»`
  },
  {
    min: 200000,
    max: 850000,
    rank: "Risveglio Zenkai (Sfida all'Imperatore)",
    icon: "shield",
    badgeClass: "rank-tier-4",
    borderColor: "#06b6d4",
    barGradient: "linear-gradient(90deg, #0284c7, #22d3ee)",
    verdict: (p) =>
      `«Livello calcolato: <strong>${p.toLocaleString('it-IT')}</strong>! La tua determinazione fa tremare i tiranni: hai oltrepassato i 530.000 punti della prima forma di Freezer! Il tuo corpo ha imparato a rinascere dal dolore attraverso lo Zenkai. La leggenda dorata non è più una favola: è a portata di mano!»`
  },
  {
    min: 850000,
    max: 2200000,
    rank: "Super Saiyan Risvegliato a 450G (Saga Androidi)",
    icon: "zap",
    badgeClass: "rank-tier-5",
    borderColor: "#eab308",
    barGradient: "linear-gradient(90deg, #ca8a04, #fde047)",
    verdict: (p) =>
      `«INCREDIBILE... <strong>${p.toLocaleString('it-IT')}</strong> punti Ki! La barriera dorata è crollata! L'addestramento spietato a 450 volte la gravità tra le meteore dello spazio profondo ha finalmente acceso la fiamma del Super Saiyan nelle tue vene. Gli Androidi impareranno a temere il Principe, ma guai ad adagiarsi: il bio-androide Cell si sta evolvendo!»`
  },
  {
    min: 2200000,
    max: 4800000,
    rank: "Super Vegeta // Dai Ni Dankai & Final Flash",
    icon: "sparkles",
    badgeClass: "rank-tier-6",
    borderColor: "#3b82f6",
    barGradient: "linear-gradient(90deg, #1d4ed8, #60a5fa, #fbbf24)",
    verdict: (p) =>
      `«GUARDATE CON ATTENZIONE! Livello combattimento: <strong>${p.toLocaleString('it-IT')}</strong>! Tu non sei un semplice combattente: SEI SUPER VEGETA! Il tempo trascorso nella Stanza dello Spirito e del Tempo ha scolpito ogni tuo muscolo nella roccia. Carica il Lampo Finale (Final Flash) e polverizza ogni ostacolo che osa sfidarti!»`
  },
  {
    min: 4800000,
    max: 8200000,
    rank: "Majin Pride // L'Orgoglio Inviolabile",
    icon: "flame",
    badgeClass: "rank-tier-7",
    borderColor: "#a855f7",
    barGradient: "linear-gradient(90deg, #7e22ce, #c084fc, #f59e0b)",
    verdict: (p) =>
      `«ENERGIA DEVASTANTE: <strong>${p.toLocaleString('it-IT')}</strong> punti! Nessun despota, mago o condizione esterna potrà mai spezzare la tua dignità: la sovranità della tua mente è inviolabile! Sei al livello del mio scontro leggendario tra Majin Vegeta e Goku. Combatti per ciò che ami e dimostra che il vero orgoglio non conosce padroni!»`
  },
  {
    min: 8200000,
    max: Infinity,
    rank: "Blue Evolution & Ultra Ego (Trascendenza Divina)",
    icon: "crown",
    badgeClass: "rank-tier-8",
    borderColor: "#00f0ff",
    barGradient: "linear-gradient(90deg, #1e40af, #00f0ff, #a855f7, #fbbf24)",
    verdict: (p) =>
      `«APOTEOSI TOTALE! Livello calcolato dallo Scouter: <strong>${p.toLocaleString('it-IT')}</strong>! LO SCOUTER È ANDATO IN OVERLOAD ED È ESPLOSO IN MILLE PEZZI! Hai infranto ogni barriera umana e divina, sbloccando il Super Saiyan Blue Evolution e la fiamma inarrestabile dell'Ultra Ego! Trascendi gli dei con il tuo sangue reale Saiyan!»`
  }
];

  function finishScan(power, hours, grit, g) {
    scanPowerBtn.disabled = false;

    if (hudStatus) {
      hudStatus.textContent = 'ANALISI COMPLETATA // RISULTATO';
      hudStatus.style.color = 'var(--ki-blue)';
    }

    // Scala logaritmica fluida per calibrare la barra su ordini di grandezza reali (2.000 -> 12.000.000)
    const logMin = Math.log10(2000);
    const logMax = Math.log10(12500000);
    const currentLog = Math.log10(Math.max(2000, power));
    const percentage = Math.min(100, Math.max(12, Math.round(((currentLog - logMin) / (logMax - logMin)) * 100)));

    // Trova il tier esatto
    const tier = POWER_TIERS.find(t => power >= t.min && power < t.max) || POWER_TIERS[POWER_TIERS.length - 1];

    if (hudBarFill) {
      hudBarFill.style.width = `${percentage}%`;
      hudBarFill.style.background = tier.barGradient;
      hudBarFill.style.boxShadow = `0 0 14px ${tier.borderColor}`;
    }

    const hudBox = document.querySelector('.hud-feedback-box');
    if (hudBox) {
      hudBox.style.borderLeftColor = tier.borderColor;
    }

    if (scouterPowerNumber) {
      if (power >= 8200000) {
        scouterPowerNumber.classList.add('scouter-overload');
      } else {
        scouterPowerNumber.classList.remove('scouter-overload');
      }
    }

    if (vegetaVerdict) {
      vegetaVerdict.innerHTML = `
        <div class="hud-rank-tag ${tier.badgeClass}">
          <i data-lucide="${tier.icon}"></i>
          <span>${tier.rank}</span>
        </div>
        <p style="margin: 0;">${tier.verdict(power)}</p>
      `;
      if (window.lucide) {
        lucide.createIcons();
      }
    }
  }

  // Inizializza verdetto e barra di progressione con i valori di default (450G, 8h, 90%)
  const initialPower = Math.round(18000 * (currentG / 100) * Math.pow(8 / 8, 1.4) * Math.pow(90 / 50, 1.8) * 12.5);
  finishScan(initialPower, 8, 90, currentG);
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
   8. FILTRI CATEGORIA & RICERCA IN TEMPO REALE
   ========================================================================== */
function setupSearchAndFilters() {
  const searchInput = document.getElementById('quoteSearch');
  const clearBtn = document.getElementById('clearSearchBtn');
  const filterBtns = document.querySelectorAll('#categoryFilters .filter-btn');

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      if (clearBtn) {
        clearBtn.style.opacity = searchQuery.length > 0 ? '1' : '0.4';
      }
      renderQuotes();
    });
  }

  if (clearBtn && searchInput) {
    clearBtn.addEventListener('click', () => {
      searchInput.value = '';
      searchQuery = '';
      clearBtn.style.opacity = '0.4';
      searchInput.focus();
      renderQuotes();
    });
  }

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      activeCategoryFilter = btn.getAttribute('data-filter') || 'all';
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
    setTimeout(() => {
      banner.classList.add('visible');
    }, 700);
  }

  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => {
      localStorage.setItem(CONSENT_KEY, JSON.stringify({ status: 'accepted', timestamp: Date.now() }));
      banner.classList.remove('visible');
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
  const cookieBannerLink = document.getElementById('cookieBannerLink');

  if (!modalOverlay) return;

  function openModal(targetId) {
    modalOverlay.classList.add('open');
    modalOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (typeof targetId === 'string') {
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        setTimeout(() => targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60);
      }
    }
  }

  function closeModal() {
    modalOverlay.classList.remove('open');
    modalOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (openPrivacyBtn) openPrivacyBtn.addEventListener('click', () => openModal('legal-privacy'));
  if (openCookieBtn) openCookieBtn.addEventListener('click', () => openModal('legal-cookies'));
  if (openCopyrightBtn) openCopyrightBtn.addEventListener('click', () => openModal('legal-copyright'));
  if (cookieBannerLink) cookieBannerLink.addEventListener('click', () => openModal('legal-cookies'));

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
   14. UTILITIES: SANITIZZAZIONE HTML & ATTRIBUTI
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
   15. BOOTSTRAP APPLICATIVO
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  new KiCanvasSystem('kiCanvas');

  setupMobileDrawer();
  setupVideoModal();
  setupGravityChamber();
  setupDailyQuote();
  setupSearchAndFilters();
  setupQuoteActions();
  setupCookieBanner();
  setupLegalModal();
  setupBackToTop();

  loadQuotes();

  if (window.lucide) {
    lucide.createIcons();
  }
});
