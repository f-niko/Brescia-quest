import { auth, db, doc, getDoc, updateDoc, signOut, arrayUnion } from './firebase.js';
import { __t } from './translations.js';
import { applyLanguage, linguaCorrente } from './translations.js';

// ============================================
// BADGE SYSTEM
// ============================================

window.apriSchermataBadge = function() {
  if (typeof window.playClickSuono === 'function') window.playClickSuono();
  
  const popupProfilo = document.getElementById('popup-profilo');
  if (popupProfilo && !popupProfilo.classList.contains('hidden')) {
    popupProfilo.setAttribute('data-was-open', 'true');
    popupProfilo.classList.add('hidden');
  }
  
  const popupHub = document.getElementById('popup-impostazioni-hub');
  if (popupHub && !popupHub.classList.contains('hidden')) {
    popupHub.setAttribute('data-was-open', 'true');
    popupHub.classList.add('hidden');
  }
  
  const modal = document.getElementById('modal-badge');
  const griglia = document.getElementById('griglia-badge');
  if (!modal || !griglia) return;

  let badgeSbloccati = [];
  try {
    const saved = localStorage.getItem('utenteBadgeStato');
    if (saved) {
      const data = JSON.parse(saved);
      badgeSbloccati = data.badgeSbloccati || [];
    }
  } catch(e) {}

  const LISTA_BADGE = [
    { id: 'scopritore_1', nome: 'Esploratore', icona: '🧭', tipo: 'quantita', requisito: 1, desc: 'Scopri il tuo primo monumento' },
    { id: 'scopritore_3', nome: 'Curioso', icona: '🔍', tipo: 'quantita', requisito: 3, desc: 'Scopri 3 monumenti' },
    { id: 'scopritore_5', nome: 'Cacciatore Urbano', icona: '🦅', tipo: 'quantita', requisito: 5, desc: 'Scopri 5 monumenti' },
    { id: 'scopritore_10', nome: 'Veterano', icona: '⚔️', tipo: 'quantita', requisito: 10, desc: 'Scopri 10 monumenti' },
    { id: 'scopritore_15', nome: 'Leggenda', icona: '👑', tipo: 'quantita', requisito: 15, desc: 'Scopri 15 monumenti' },
    { id: 'cat_parchi', nome: 'Pollice Verde', icona: '🌳', tipo: 'categoria', requisito: 'Parco', desc: 'Scopri tutti i parchi' },
    { id: 'cat_monumenti', nome: 'Custode della Storia', icona: '🏛️', tipo: 'categoria', requisito: 'Monumento', desc: 'Scopri tutti i monumenti' },
    { id: 'cat_supermercati', nome: 'Shoppaholic', icona: '🛒', tipo: 'categoria', requisito: 'Supermercato', desc: 'Scopri tutti i supermercati' },
  ];

  griglia.innerHTML = '';

  LISTA_BADGE.forEach(badge => {
    const isSbloccato = badgeSbloccati.includes(badge.id);
    const item = document.createElement('div');
    item.className = `badge-item ${isSbloccato ? 'unlocked' : 'locked'}`;
    item.title = `${badge.nome}: ${badge.desc}`;
    
    item.innerHTML = `
      <span class="badge-icon">${badge.icona}</span>
      <span class="badge-name">${badge.nome}</span>
      <span class="badge-desc">${isSbloccato ? '✅ Sbloccato' : '🔒 Bloccato'}</span>
    `;
    
    if (isSbloccato) {
      item.addEventListener('click', function() {
        if (typeof window.playClickSuono === 'function') window.playClickSuono();
        
        const avatarBar = document.getElementById('avatar-login-bar');
        if (avatarBar) avatarBar.innerHTML = `<span class="text-2xl">${badge.icona}</span>`;
        
        const preview = document.getElementById('edit-avatar-preview');
        if (preview) preview.innerHTML = `<span class="text-3xl">${badge.icona}</span>`;
        
        try {
          const saved = localStorage.getItem('utenteBadgeStato');
          if (saved) {
            const data = JSON.parse(saved);
            data.badgeProfiloAttivo = badge.icona;
            localStorage.setItem('utenteBadgeStato', JSON.stringify(data));
          } else {
            localStorage.setItem('utenteBadgeStato', JSON.stringify({
              badgeSbloccati: badgeSbloccati,
              monumentiScoperti: [],
              badgeProfiloAttivo: badge.icona
            }));
          }
        } catch(e) {}
        
        const allItems = griglia.querySelectorAll('.badge-item.unlocked');
        allItems.forEach(el => el.style.borderColor = 'rgba(234, 179, 8, 0.3)');
        item.style.borderColor = '#4ade80';
        item.style.boxShadow = '0 0 30px rgba(74, 222, 128, 0.2)';
        setTimeout(() => {
          item.style.borderColor = 'rgba(234, 179, 8, 0.6)';
          item.style.boxShadow = '0 0 30px rgba(234, 179, 8, 0.1)';
        }, 1500);
      });
    }

    griglia.appendChild(item);
  });

  modal.classList.remove('hidden');
};

window.chiudiSchermataBadge = function() {
  if (typeof window.playClickSuono === 'function') window.playClickSuono();
  
  const modal = document.getElementById('modal-badge');
  if (modal) modal.classList.add('hidden');
  
  const popupProfilo = document.getElementById('popup-profilo');
  if (popupProfilo && popupProfilo.getAttribute('data-was-open') === 'true') {
    popupProfilo.classList.remove('hidden');
    popupProfilo.removeAttribute('data-was-open');
  }
  
  const popupHub = document.getElementById('popup-impostazioni-hub');
  if (popupHub && popupHub.getAttribute('data-was-open') === 'true') {
    popupHub.classList.remove('hidden');
    popupHub.removeAttribute('data-was-open');
  }
};

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    const modal = document.getElementById('modal-badge');
    if (modal && !modal.classList.contains('hidden')) {
      window.chiudiSchermataBadge();
    }
  }
});

// ============================================
// TUTORIAL MULTI-STEP
// ============================================

let tutorialStep = 0;

const TUTORIAL_STEPS = {
  it: [
    { icon: '🗺️', title: 'Benvenuto a Venatores Brixiae!', desc: 'Esplora la città di Brescia attraverso la mappa interattiva. Scopri monumenti, parchi e supermercati per guadagnare XP e salire di livello!' },
    { icon: '📍', title: 'Scopri i Luoghi', desc: 'Avvicinati a un luogo sulla mappa (entro 50 metri) per conquistarlo! Ogni luogo scoperto ti regala +100 XP e sblocca badge speciali.' },
    { icon: '👥', title: 'Amici e Chat Live', desc: 'Aggiungi amici con il tuo Codice Amico unico. Chatta con loro in tempo reale e confronta i punteggi nella classifica!' },
    { icon: '🛡️', title: 'Crea o Unisciti a un Clan', desc: 'Fonda il tuo clan o entra in uno esistente. Collabora con altri giocatori, chatta nel gruppo e scalate la classifica insieme!' }
  ],
  en: [
    { icon: '🗺️', title: 'Welcome to Venatores Brixiae!', desc: 'Explore the city of Brescia through the interactive map. Discover monuments, parks, and supermarkets to earn XP and level up!' },
    { icon: '📍', title: 'Discover Places', desc: 'Get within 50 meters of a place on the map to conquer it! Each discovery gives you +100 XP and unlocks special badges.' },
    { icon: '👥', title: 'Friends & Live Chat', desc: 'Add friends using your unique Friend Code. Chat with them in real time and compare scores on the leaderboard!' },
    { icon: '🛡️', title: 'Create or Join a Clan', desc: 'Found your own clan or join an existing one. Collaborate with other players, chat in the group, and climb the ranks together!' }
  ]
};

function renderTutorialStep(step) {
  const lang = window.linguaCorrente || 'it';
  const steps = TUTORIAL_STEPS[lang] || TUTORIAL_STEPS.it;
  const s = steps[step];
  if (!s) return;

  document.getElementById('tutorial-icon').textContent = s.icon;
  document.getElementById('tutorial-step-title').textContent = s.title;
  document.getElementById('tutorial-step-desc').textContent = s.desc;

  for (let i = 0; i < 4; i++) {
    const dot = document.getElementById('tutorial-dot-' + i);
    if (dot) {
      dot.className = i === step ? 'w-2.5 h-2.5 rounded-full bg-yellow-400 transition-all shadow-lg shadow-yellow-400/30' : 'w-2 h-2 rounded-full bg-gray-600 transition-all';
    }
  }

  const prevBtn = document.getElementById('tutorial-prev-btn');
  const nextBtn = document.getElementById('tutorial-next-btn');
  const skipBtn = document.getElementById('tutorial-salta');

  if (prevBtn) {
    prevBtn.classList.toggle('hidden', step === 0);
    prevBtn.textContent = '◀ ' + (lang === 'it' ? 'Indietro' : 'Back');
  }
  if (nextBtn) {
    nextBtn.textContent = step === steps.length - 1
      ? (lang === 'it' ? 'Inizia l\'avventura! 🚀' : 'Start the adventure! 🚀')
      : (lang === 'it' ? 'Avanti ▶' : 'Next ▶');
  }
  if (skipBtn) {
    skipBtn.textContent = lang === 'it' ? 'Salta ✕' : 'Skip ✕';
  }
}

window.tutorialNext = function() {
  const lang = window.linguaCorrente || 'it';
  const steps = TUTORIAL_STEPS[lang] || TUTORIAL_STEPS.it;
  if (tutorialStep < steps.length - 1) {
    tutorialStep++;
    renderTutorialStep(tutorialStep);
  } else {
    window.chiudiESaltaTutorial();
  }
};

window.tutorialPrevious = function() {
  if (tutorialStep > 0) {
    tutorialStep--;
    renderTutorialStep(tutorialStep);
  }
};

const controllaMostraTutorial = async function() {
  const utenteCorrenteId = window.utenteCorrenteId;
  if (!utenteCorrenteId) return;

  try {
    const snapUtente = await getDoc(doc(db, "utenti", utenteCorrenteId));
    const dati = snapUtente.data();

    if (!dati || !dati.tutorialVisto) {
      tutorialStep = 0;
      renderTutorialStep(0);
      document.getElementById('popup-tutorial').classList.remove('hidden');
    }
  } catch (e) {
    console.error("Errore nel controllo del tutorial:", e);
  }
};

const chiudiESaltaTutorial = async function() {
  document.getElementById('popup-tutorial').classList.add('hidden');
  const utenteCorrenteId = window.utenteCorrenteId;

  if (utenteCorrenteId) {
    try {
      await updateDoc(doc(db, "utenti", utenteCorrenteId), {
        tutorialVisto: true
      });
      console.log("Stato tutorial salvato: l'utente non lo vedrà più.");
    } catch (e) {
      console.error("Errore durante il salvataggio dello stato del tutorial:", e);
    }
  }
};

window.controllaMostraTutorial = controllaMostraTutorial;
window.chiudiESaltaTutorial = chiudiESaltaTutorial;

// ============================================
// AUTH STATE LISTENER
// ============================================
window.addEventListener('DOMContentLoaded', () => {
  let avvioGestito = false;
  auth.onAuthStateChanged(async (user) => {
    if (user) {
      if (user.emailVerified) {
        if (!avvioGestito) {
          avvioGestito = true;
          await window.caricaEAvviaGioco(user);
        }
      } else {
        alert(__t('alertEmailNotVerified'));
        await signOut(auth);
        document.getElementById('schermata-login').classList.remove('hidden');
      }
    } else {
      document.getElementById('schermata-login').classList.remove('hidden');
    }
  });
});

// ============================================
// ENTER KEY LISTENERS FOR CHAT
// ============================================
document.getElementById('input-messaggio-chat')?.addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); window.inviaMessaggioChat?.(); }
});
document.getElementById('input-messaggio-clan')?.addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); window.inviaMessaggioClan?.(); }
});

// ============================================
// WRAP chiudiPopupScoperta FOR ACHIEVEMENT MESSAGES
// ============================================
const _originalChiudiScoperta = window.chiudiPopupScoperta || function(){};
window.chiudiPopupScoperta = function() {
  _originalChiudiScoperta();

  const nomeLuogo = document.getElementById('popup-nome')?.textContent;
  const utenteCorrenteId = window.utenteCorrenteId;
  const idClanAttivoCorrente = window.idClanAttivoCorrente;
  if (utenteCorrenteId && nomeLuogo && nomeLuogo !== 'Nome Posto') {
    const now = new Date().toISOString();
    const msg = {
      id: `scop_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      testo: `🎉 Ho scoperto ${nomeLuogo}!`,
      timestamp: now,
      letteDa: []
    };
    updateDoc(doc(db, "utenti", utenteCorrenteId), { messaggi: arrayUnion(msg) }).catch(() => {});

    if (idClanAttivoCorrente) {
      getDoc(doc(db, "utenti", utenteCorrenteId)).then(snap => {
        if (snap.exists()) {
          updateDoc(doc(db, "clan", idClanAttivoCorrente), {
            messaggi: arrayUnion({
              id: `scop_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
              mittenteId: utenteCorrenteId,
              mittenteNome: snap.data().nome || "Esploratore",
              testo: `🎉 Ho scoperto ${nomeLuogo}!`,
              timestamp: now,
              letteDa: []
            })
          }).catch(() => {});
        }
      });
    }
  }
};

// ============================================
// CONSOLE LOGS
// ============================================
console.log("✅ Venatores Brixiae - Sistema Badge + Amici + Clan + Tutorial + Musica attivo!");
console.log("🎵 Musica: guantanamo.mp3 in riproduzione!");
console.log("🏅 Badge: schermata intera nativa con sfondo scuro e griglia 3 colonne!");
console.log("👥 Amici: chat privata e classifica");
console.log("🛡️ Clan: ora è una schermata fullscreen come Amici e Wishlist!");
console.log("📖 Tutorial: si mostra solo al primo accesso!");
