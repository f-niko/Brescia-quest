// ============================================
// VARIABILI DI STATO DEL GIOCO
// ============================================
let playerXP = 0;
let playerLevel = 1;
const xpPerLivello = 300;
let map, userMarker;
let markersAttivi = [];
let categoriaCorrente = 'tutti';

// Variabili per l'animazione fluida del GPS ed i popup
let posizioneTarget = null;
let animazioneInCorso = null;
let primoAvvioGps = true;
let codaPopup = [];

// ============================================
// SISTEMA AUDIO RETRÒ (Generati via codice)
// ============================================
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// 1. Suono Click a 8-bit (Corto e saltellante)
window.playClickSuono = function() {
  if (audioCtx.state === 'suspended') audioCtx.resume();
  
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  
  osc.type = 'square';
  osc.frequency.setValueAtTime(150, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(600, audioCtx.currentTime + 0.08);
  
  gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
  gain.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);
  
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  
  osc.start();
  osc.stop(audioCtx.currentTime + 0.08);
};

// 2. Jingle Trionfale Monumento Sbloccato (Arpeggio in Do Maggiore a 8-bit)
window.playJingleMonumento = function() {
  if (audioCtx.state === 'suspended') audioCtx.resume();
  
  const note = [261.63, 329.63, 392.00, 523.25]; // Do, Mi, Sol, Do Alto
  const tempoInizio = audioCtx.currentTime;
  
  note.forEach((freq, indice) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, tempoInizio + (indice * 0.12));
    
    gain.gain.setValueAtTime(0.15, tempoInizio + (indice * 0.12));
    gain.gain.linearRampToValueAtTime(0.01, tempoInizio + (indice * 0.12) + 0.3);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start(tempoInizio + (indice * 0.12));
    osc.stop(tempoInizio + (indice * 0.12) + 0.3);
  });
};

// Applica il suono a 8-bit a tutti i bottoni della pagina automaticamente
document.addEventListener('click', (e) => {
  if (e.target.closest('button')) {
    window.playClickSuono();
  }
});

// ============================================
// INIZIALIZZAZIONE DEL GIOCO
// ============================================
function initGioco() {
    if (map) {
        console.log("Mappa già inizializzata. Salto la ricreazione.");
        aggiornaMappaELista();
        setTimeout(() => { 
            if (map && typeof map.invalidateSize === 'function') {
                map.invalidateSize(); 
            }
        }, 100);
        return;
    }

    map = L.map('map').setView([45.5415, 10.2012], 14);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
    }).addTo(map);

    aggiornaMappaELista();
    attivaGPS({ enableHighAccuracy: true, timeout: 5000, maximumAge: 0 });

    setTimeout(() => {
        if (map && typeof map.invalidateSize === 'function') {
            map.invalidateSize();
        }
    }, 200);
}

window.initGioco = initGioco;

// ============================================
// GESTIONE DEI FILTRI E DEI PIN
// ============================================
function aggiornaMappaELista() {
    if (!map || typeof monumenti === 'undefined') return;

    markersAttivi.forEach(m => map.removeLayer(m));
    markersAttivi = [];

    aggiornaWishlist();
    aggiornaWishlistFull();

    monumenti.forEach(m => {
        if (categoriaCorrente === 'tutti' || m.categoria === categoriaCorrente) {
            
            const marker = L.circleMarker([m.lat, m.lng], {
                radius: 10,
                fillColor: m.scoperto ? '#10b981' : '#ef4444',
                color: '#fff',
                fillOpacity: 0.9,
                weight: 2
            }).addTo(map);
            
            const lang = window.linguaCorrente || 'it';
            if (m.scoperto) {
                marker.bindPopup(`<b>${m.nome}</b><br>${(lang === 'en' && m.desc_en) ? m.desc_en : m.desc}`);
            } else {
                marker.bindPopup(`<b>${window.__t('lockedTitle')}</b><br>${window.__t('lockedBody')}`);
            }
            
            markersAttivi.push(marker);
            m.markerRef = marker;
        }
    });

    if (markersAttivi.length > 0) {
        const markerGroup = L.featureGroup(markersAttivi);
        setTimeout(() => {
            map.fitBounds(markerGroup.getBounds(), { 
                padding: [40, 40],
                maxZoom: 16
            });
        }, 250);
    }
}

window.aggiornaMappaELista = aggiornaMappaELista;

// ============================================
// AGGIORNAMENTO WISHLIST
// ============================================
function aggiornaWishlist() {
    const containerLista = document.getElementById('lista-monumenti');
    if (!containerLista) return;
    
    if (typeof monumenti === 'undefined') {
        containerLista.innerHTML = "<p class='text-gray-400 text-xs text-center py-4 animate-pulse'>" + window.__t('wishlistCaricamento') + "</p>";
        return;
    }

    const monumentiFiltrati = monumenti.filter(m => categoriaCorrente === 'tutti' || m.categoria === categoriaCorrente);
    
    if (monumentiFiltrati.length === 0) {
        containerLista.innerHTML = "<p class='text-gray-400 text-xs text-center py-4'>" + window.__t('wishlistNessunLuogo') + "</p>";
        return;
    }

    const daScoprireGlobali = monumenti.filter(m => !m.scoperto);
    if (daScoprireGlobali.length === 0 && categoriaCorrente === 'tutti') {
        containerLista.innerHTML = "<p class='text-yellow-400 text-xs text-center font-bold py-4'>" + window.__t('wishlistTuttiScoperti') + "</p>";
        return;
    }

    containerLista.innerHTML = "";
    const lang = window.linguaCorrente || 'it';

    monumentiFiltrati.forEach(m => {
        const safeId = m.nome.replace(/[^a-zA-Z0-9]/g, '-');
        const item = document.createElement('div');
        item.id = `monumento-${safeId}`;
        item.className = `p-3 rounded-xl flex justify-between items-center transition-all bg-gray-800 border border-gray-700 shadow-md ${
            m.scoperto ? 'bg-green-950/40 border-green-500' : 'bg-gray-700/50 border-gray-600'
        }`;
        
        item.innerHTML = `
            <div class="flex-1 pr-2">
                <p class="font-semibold text-sm ${m.scoperto ? 'text-green-400' : 'text-gray-200'}">${m.nome}</p>
                <p class="text-[10px] text-gray-400 mt-0.5">${(lang === 'en' && m.desc_en) ? m.desc_en : m.desc}</p>
                <p class="text-xs text-gray-400 font-mono label-distanza mt-1">${m.scoperto ? window.__t('wishlistConquistato') : window.__t('wishlistCalcolo')}</p>
            </div>
            <div class="text-sm font-mono text-gray-400 bg-gray-800 px-2 py-1 rounded-md badge-xp shrink-0">
                ${m.scoperto ? '✅' : window.__t('wishlistXpGain')}
            </div>
        `;
        containerLista.appendChild(item);
    });
}

// ============================================
// AGGIORNAMENTO WISHLIST FULL
// ============================================
function aggiornaWishlistFull() {
    const container = document.getElementById('lista-monumenti-full');
    if (!container) return;
    
    if (typeof monumenti === 'undefined') {
        container.innerHTML = "<p class='text-gray-400 text-xs text-center py-4 animate-pulse'>" + window.__t('wishlistCaricamento') + "</p>";
        return;
    }

    let monumentiFiltrati = monumenti;
    const dropdownFiltro = document.getElementById('filtro-wishlist');
    if (dropdownFiltro) {
        const filtroSelezionato = dropdownFiltro.value;
        if (filtroSelezionato !== 'tutti') {
            monumentiFiltrati = monumenti.filter(m => m.categoria === filtroSelezionato);
        }
    }
    
    if (monumentiFiltrati.length === 0) {
        container.innerHTML = "<p class='text-gray-400 text-xs text-center py-4'>" + window.__t('wishlistNessunLuogo') + "</p>";
        return;
    }

    const daScoprireGlobali = monumenti.filter(m => !m.scoperto);
    if (daScoprireGlobali.length === 0) {
        container.innerHTML = "<p class='text-yellow-400 text-xs text-center font-bold py-4'>" + window.__t('wishlistTuttiScoperti') + "</p>";
        return;
    }

    container.innerHTML = "";
    const lang = window.linguaCorrente || 'it';

    monumentiFiltrati.forEach(m => {
        const safeId = m.nome.replace(/[^a-zA-Z0-9]/g, '-');
        const item = document.createElement('div');
        item.id = `monumento-full-${safeId}`;
        item.className = `p-3 rounded-xl flex justify-between items-center transition-all bg-gray-800 border ${
            m.scoperto ? 'bg-green-950/40 border-green-500' : 'bg-gray-700/50 border-gray-600'
        }`;
        
        item.innerHTML = `
            <div class="flex-1 pr-2">
                <p class="font-semibold text-sm ${m.scoperto ? 'text-green-400' : 'text-gray-200'}">${m.nome}</p>
                <p class="text-[10px] text-gray-400 mt-0.5">${(lang === 'en' && m.desc_en) ? m.desc_en : m.desc}</p>
                <p class="text-xs text-gray-400 font-mono label-distanza-full mt-1">${m.scoperto ? window.__t('wishlistConquistato') : window.__t('wishlistCalcolo')}</p>
            </div>
            <div class="text-sm font-mono text-gray-400 bg-gray-800 px-2 py-1 rounded-md badge-xp shrink-0">
                ${m.scoperto ? '✅' : window.__t('wishlistXpGain')}
            </div>
        `;
        container.appendChild(item);
    });
}

window.aggiornaWishlistFull = aggiornaWishlistFull;

// ============================================
// FUNZIONE FILTRA CATEGORIA
// ============================================
function filtraCategoria(categoria) {
    categoriaCorrente = categoria;
    
    const classiContorno = ['outline-3', 'outline-yellow-400'];
    const pulsanti = document.querySelectorAll('#filtri-nav button');
    pulsanti.forEach(btn => btn.classList.remove(...classiContorno));

    const pulsanteAttivo = document.getElementById(`btn-filtro-${categoria}`) || 
                           Array.from(pulsanti).find(btn => btn.getAttribute('onclick')?.includes(`'${categoria}'`));
                           
    if (pulsanteAttivo) {
        pulsanteAttivo.classList.add(...classiContorno);
    }

    aggiornaMappaELista();
}
window.filtraCategoria = filtraCategoria;

// ============================================
// SISTEMA GPS CON MOVIMENTO FLUIDO
// ============================================
function attivaGPS(options) {
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(
            (position) => {
                const uLat = position.coords.latitude;
                const uLng = position.coords.longitude;

                if (!userMarker) {
                    userMarker = L.circleMarker([uLat, uLng], {
                        radius: 12,
                        color: '#ffffff',
                        fillColor: '#3b82f6',
                        fillOpacity: 0.9,
                        weight: 3
                    }).addTo(map);
                    map.setView([uLat, uLng], 16);
                } else {
                    posizioneTarget = { lat: uLat, lng: uLng };
                    if (!animazioneInCorso) {
                        animaAvatar();
                    }
                }

                controllaProssimita(uLat, uLng);
                primoAvvioGps = false;
            },
            (error) => { console.warn("Errore ricezione GPS: ", error.message); },
            options || { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
    } else {
        alert(window.__t('alertNoGps'));
    }
}
window.attivaGPS = attivaGPS;

// ============================================
// ANIMAZIONE AVATAR
// ============================================
function animaAvatar() {
    if (!posizioneTarget || !userMarker) return;

    const posAttuale = userMarker.getLatLng();
    const diffLat = posizioneTarget.lat - posAttuale.lat;
    const diffLng = posizioneTarget.lng - posAttuale.lng;
    const fattoreFluidita = 0.05;

    if (Math.abs(diffLat) < 0.000001 && Math.abs(diffLng) < 0.000001) {
        userMarker.setLatLng([posizioneTarget.lat, posizioneTarget.lng]);
        animazioneInCorso = null;
    } else {
        const nuovaLat = posAttuale.lat + (diffLat * fattoreFluidita);
        const nuovaLng = posAttuale.lng + (diffLng * fattoreFluidita);
        userMarker.setLatLng([nuovaLat, nuovaLng]);
        animazioneInCorso = requestAnimationFrame(animaAvatar);
    }
}

// ============================================
// FORMULA HAVERSINE
// ============================================
function calcolaDistanza(lat1, lon1, lat2, lon2) {
    const R = 6371e3;
    const phi1 = lat1 * Math.PI / 180;
    const phi2 = lat2 * Math.PI / 180;
    const deltaPhi = (lat2 - lat1) * Math.PI / 180;
    const deltaLambda = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
              Math.cos(phi1) * Math.cos(phi2) *
              Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}

// ============================================
// CONTROLLO PROSSIMITÀ E SBLOCCO
// ============================================
function controllaProssimita(uLat, uLng) {
    if (typeof monumenti === 'undefined') return;

    const lang = window.linguaCorrente || 'it';

    monumenti.forEach(m => {
        const distanza = calcolaDistanza(uLat, uLng, m.lat, m.lng);
        const safeId = m.nome.replace(/[^a-zA-Z0-9]/g, '-');
        const rigaElemento = document.getElementById(`monumento-${safeId}`);
        const rigaElementoFull = document.getElementById(`monumento-full-${safeId}`);

        if (!m.scoperto) {
            if (rigaElemento) {
                const labelDistanza = rigaElemento.querySelector('.label-distanza');
                if (labelDistanza) labelDistanza.innerText = `${window.__t('wishlistDistPrefix')} ${Math.round(distanza)} ${window.__t('wishlistDistUnit')}`;
            }
            if (rigaElementoFull) {
                const labelDistanzaFull = rigaElementoFull.querySelector('.label-distanza-full');
                if (labelDistanzaFull) labelDistanzaFull.innerText = `${window.__t('wishlistDistPrefix')} ${Math.round(distanza)} ${window.__t('wishlistDistUnit')}`;
            }

            if (distanza <= 50) {
                m.scoperto = true;
                
                if (typeof window.playJingleMonumento === 'function') {
                    window.playJingleMonumento();
                }
                
                if (m.markerRef) {
                    m.markerRef.setStyle({ fillColor: '#10b981' });
                    m.markerRef.bindPopup(`<b>${m.nome}</b><br>${(lang === 'en' && m.desc_en) ? m.desc_en : m.desc}`).openPopup();
                }

                assegnaXP(100);
                
                // 🔥 CONTROLLO BADGE
                if (typeof window.controllaESbloccaBadge === 'function') {
                    window.controllaESbloccaBadge(m, monumenti);
                }

                codaPopup.push(m);
                aggiornaMappaELista();
            }
        }
    });

    const popupElement = document.getElementById('popup-scoperta');
    if (codaPopup.length > 0 && popupElement && popupElement.classList.contains('hidden')) {
        mostraPopupScoperta(codaPopup[0]);
    }
}

// ============================================
// ASSEGNAZIONE XP
// ============================================
function assegnaXP(punti) {
    playerXP += punti;
    while (playerXP >= xpPerLivello) {
        playerLevel += 1;
        playerXP -= xpPerLivello;
    }

    const xpTxt = document.getElementById('xp-txt');
    const lvlTxt = document.getElementById('livello-txt');
    const xpBar = document.getElementById('xp-bar');

    if (xpTxt) xpTxt.innerText = playerXP;
    if (lvlTxt) lvlTxt.innerText = playerLevel;
    if (xpBar) xpBar.style.width = `${(playerXP / xpPerLivello) * 100}%`;

    if (typeof window.salvaProgressoSuCloud === 'function') {
        window.salvaProgressoSuCloud(playerXP, playerLevel, monumenti);
    }
}

// ============================================
// MOSTRA POPUP SCOPERTA
// ============================================
function mostraPopupScoperta(m) {
    const nomeEl = document.getElementById('popup-nome');
    const descEl = document.getElementById('popup-desc');
    const popupEl = document.getElementById('popup-scoperta');

    const lang = window.linguaCorrente || 'it';

    if (nomeEl) nomeEl.innerText = m.nome;
    if (descEl) descEl.innerText = (lang === 'en' && m.desc_en) ? m.desc_en : m.desc;
    if (popupEl) popupEl.classList.remove('hidden');
}

// ============================================
// CHIUDI POPUP (GESTIONE IN CODA)
// ============================================
window.chiudiPopup = function() {
    const popupEl = document.getElementById('popup-scoperta');
    if (popupEl) popupEl.classList.add('hidden');
    codaPopup.shift();
    if (codaPopup.length > 0) {
        setTimeout(() => {
            const prossimoPopup = document.getElementById('popup-scoperta');
            if (prossimoPopup && prossimoPopup.classList.contains('hidden')) {
                mostraPopupScoperta(codaPopup[0]);
            }
        }, 250);
    }
};

// ============================================
// 🏅 SISTEMA BADGE COMPLETO
// ============================================

// 1. Definizione della lista dei badge nel gioco
const LISTA_BADGE_GIOCO = [
    // Badge basati sul numero totale di posti scoperti
    { id: 'scopritore_1', nome: 'Esploratore', icona: '🧭', tipo: 'quantita', requisito: 1, desc: 'Scopri 1 monumento' },
    { id: 'scopritore_3', nome: 'Curioso', icona: '🔍', tipo: 'quantita', requisito: 3, desc: 'Scopri 3 monumenti' },
    { id: 'scopritore_5', nome: 'Cacciatore Urbano', icona: '🦅', tipo: 'quantita', requisito: 5, desc: 'Scopri 5 monumenti' },
    { id: 'scopritore_10', nome: 'Veterano', icona: '⚔️', tipo: 'quantita', requisito: 10, desc: 'Scopri 10 monumenti' },
    { id: 'scopritore_15', nome: 'Leggenda', icona: '👑', tipo: 'quantita', requisito: 15, desc: 'Scopri 15 monumenti' },
    
    // Badge basati sul completamento di intere categorie
    { id: 'cat_parchi', nome: 'Pollice Verde', icona: '🌳', tipo: 'categoria', requisito: 'Parco', desc: 'Scopri tutti i parchi' },
    { id: 'cat_monumenti', nome: 'Custode', icona: '🏛️', tipo: 'categoria', requisito: 'Monumento', desc: 'Scopri tutti i monumenti' },
    { id: 'cat_supermercati', nome: 'Shoppaholic', icona: '🛒', tipo: 'categoria', requisito: 'Supermercato', desc: 'Scopri tutti i supermercati' }
];

/**
 * Genera graficamente i badge nella schermata profilo
 */
window.aggiornaGrigliaBadgeProfilo = function() {
    const griglia = document.getElementById('griglia-badge-profilo');
    if (!griglia) return;

    // Carica lo stato attuale salvato
    let badgeSbloccati = [];
    try {
        const saved = localStorage.getItem('utenteBadgeStato');
        if (saved) {
            const data = JSON.parse(saved);
            badgeSbloccati = data.badgeSbloccati || [];
        }
    } catch(e) {}

    griglia.innerHTML = '';

    LISTA_BADGE_GIOCO.forEach(badge => {
        const isSbloccato = badgeSbloccati.includes(badge.id);
        const item = document.createElement('div');
        
        // Classi CSS condizionali: se sbloccato è colorato e cliccabile, altrimenti opaco e grigio
        item.className = `p-2 rounded-xl border flex flex-col items-center justify-center text-center transition-all duration-200 ${
            isSbloccato 
                ? 'bg-yellow-500/10 border-yellow-500/40 cursor-pointer hover:scale-105 hover:bg-yellow-500/20 shadow-sm shadow-yellow-500/5' 
                : 'bg-black/20 border-white/5 opacity-25 filter grayscale cursor-not-allowed'
        }`;
        
        item.title = `${badge.nome}: ${badge.desc} (${isSbloccato ? 'Sbloccato' : 'Bloccato'})`;
        
        item.innerHTML = `
            <span class="text-2xl mb-1">${badge.icona}</span>
            <span class="text-[9px] font-bold text-gray-300 block truncate w-full uppercase">${badge.nome}</span>
        `;

        // Se sbloccato, aggiungi l'evento click per impostarlo come foto profilo
        if (isSbloccato) {
            item.addEventListener('click', function() {
                if (typeof window.playClickSuono === 'function') window.playClickSuono();
                
                // 1. Aggiorna l'avatar nella barra di login superiore
                const avatarBar = document.getElementById('avatar-login-bar');
                if (avatarBar) avatarBar.innerHTML = `<span class="text-2xl">${badge.icona}</span>`;
                
                // 2. Aggiorna la preview dell'avatar nel popup profilo principale
                const preview = document.getElementById('edit-avatar-preview');
                if (preview) preview.innerHTML = `<span class="text-3xl">${badge.icona}</span>`;
                
                // 3. Salva la scelta dell'avatar nel localStorage senza perdere gli altri dati
                try {
                    const saved = localStorage.getItem('utenteBadgeStato');
                    let data = saved ? JSON.parse(saved) : { badgeSbloccati: badgeSbloccati, monumentiScoperti: [] };
                    data.badgeProfiloAttivo = badge.icona;
                    localStorage.setItem('utenteBadgeStato', JSON.stringify(data));
                } catch(e) {}

                // Animazione temporanea di successo (bordo verde) sul badge cliccato
                item.style.borderColor = '#4ade80';
                setTimeout(() => { item.style.borderColor = 'rgba(234, 179, 8, 0.4)'; }, 1000);
            });
        }

        griglia.appendChild(item);
    });
};

/**
 * Controlla se i requisiti dei badge sono soddisfatti e salva lo stato.
 * Chiamala subito dopo che l'utente sblocca con successo un monumento sulla mappa.
 */
window.controllaESbloccaBadge = function(ultimoMonumentoScoperto, tuttiIMonumenti) {
    if (!ultimoMonumentoScoperto) return;
    
    let badgeSbloccati = [];
    let monumentiScoperti = [];
    let badgeProfiloAttivo = '🧭';

    try {
        const saved = localStorage.getItem('utenteBadgeStato');
        if (saved) {
            const data = JSON.parse(saved);
            badgeSbloccati = data.badgeSbloccati || [];
            monumentiScoperti = data.monumentiScoperti || [];
            badgeProfiloAttivo = data.badgeProfiloAttivo || '🧭';
        }
    } catch(e) {}
    
    // Aggiungi il nuovo monumento salvando il suo ID se non c'era già
    if (!monumentiScoperti.includes(ultimoMonumentoScoperto.id)) {
        monumentiScoperti.push(ultimoMonumentoScoperto.id);
    }

    const totaleScoperti = monumentiScoperti.length;
    let nuoviBadgeSbloccatiAdesso = [];

    // Verifica i requisiti per ogni badge esistente
    LISTA_BADGE_GIOCO.forEach(badge => {
        if (badgeSbloccati.includes(badge.id)) return; // Salta se già sbloccato
        
        let sbloccato = false;
        if (badge.tipo === 'quantita') {
            if (totaleScoperti >= badge.requisito) sbloccato = true;
        } else if (badge.tipo === 'categoria') {
            const inCat = tuttiIMonumenti.filter(m => m.categoria === badge.requisito);
            const scopertiInCat = inCat.every(m => monumentiScoperti.includes(m.id));
            if (scopertiInCat && inCat.length > 0) sbloccato = true;
        }

        if (sbloccato) {
            badgeSbloccati.push(badge.id);
            nuoviBadgeSbloccatiAdesso.push(badge);
        }
    });

    // Salva i dati aggiornati
    localStorage.setItem('utenteBadgeStato', JSON.stringify({
        badgeSbloccati: badgeSbloccati,
        monumentiScoperti: monumentiScoperti,
        badgeProfiloAttivo: badgeProfiloAttivo
    }));

    // Notifica a schermo e aggiornamento immediato della griglia
    window.aggiornaGrigliaBadgeProfilo();

    nuoviBadgeSbloccatiAdesso.forEach(badge => {
        if (typeof window.playJingleMonumento === 'function') window.playJingleMonumento();
        setTimeout(() => {
            alert(window.__t('badgeUnlocked').replace('{badge}', `${badge.icona} ${badge.nome}`).replace('{desc}', badge.desc));
        }, 500);
    });
};

// Esegui il disegno iniziale della griglia non appena la pagina finisce di caricare
document.addEventListener('DOMContentLoaded', () => {
    window.aggiornaGrigliaBadgeProfilo();
});

console.log("✅ app.js caricato correttamente!");
console.log("🎮 Brescia Quest - Sistema audio + Badge attivo!");
