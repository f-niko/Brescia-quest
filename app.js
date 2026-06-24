// --- VARIABILI DI STATO DEL GIOCO ---
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

// --- INIZIALIZZAZIONE DEL GIOCO ---
function initGioco() {
    // CONTROLLO DI SICUREZZA: Se la mappa è già stata creata, si ferma ed evita l'errore!
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

    // Forza Leaflet a ridisegnare i tasselli grafici evitando quadrati grigi
    setTimeout(() => {
        if (map && typeof map.invalidateSize === 'function') {
            map.invalidateSize();
        }
    }, 200);
}

function aggiornaMappaELista() {
    if (!map || typeof monumenti === 'undefined') return;

    // Svuota i marker precedenti
    markersAttivi.forEach(m => map.removeLayer(m));
    markersAttivi = [];

    // Aggiorna sia la mappa che la lista grafica laterale
    aggiornaWishlist();
    aggiornaWishlistFull();

    // Disegno dei marker sulla mappa
    monumenti.forEach(m => {
        if (categoriaCorrente === 'tutti' || m.categoria === categoriaCorrente) {
            
            // Creiamo un CircleMarker stilizzato per uniformità visiva del gioco
            const marker = L.circleMarker([m.lat, m.lng], {
              radius: 10, // 10 pixels on screen
              fillColor: m.scoperto ? '#10b981' : '#ef4444',
              color: '#fff',
              fillOpacity: 0.9,
              weight: 2
            }).addTo(map);
            
            if (m.scoperto) {
                marker.bindPopup(`<b>${m.nome}</b><br>${m.desc}`);
            } else {
                marker.bindPopup(`<b>Luogo Bloccato</b><br>Avvicinati a meno di 50 metri con il GPS per conquistare questo obiettivo!`);
            }
            
            markersAttivi.push(marker);
            m.markerRef = marker; // Salviamo il riferimento per aprirlo dinamicamente allo sblocco
        }
    });

    // FIX DEFINITIVO: Raggruppa i marker e aspetta che il CSS della mappa sia caricato
    if (markersAttivi.length > 0) {
        const markerGroup = L.featureGroup(markersAttivi);
        
        // Aspettiamo 250ms per far calcolare al browser l'altezza del div #map
        setTimeout(() => {
            map.fitBounds(markerGroup.getBounds(), { 
                padding: [40, 40], // Margine per non attaccare i pin ai bordi
                maxZoom: 16 // Previene zoom eccessivi se filtri una categoria con 1 solo pin
            });
        }, 250);
    }
}

function aggiornaWishlist() {
    const containerLista = document.getElementById('lista-monumenti');
    if (!containerLista) return;
    
    if (typeof monumenti === 'undefined') {
        containerLista.innerHTML = "<p class='text-gray-400 text-xs text-center py-4 animate-pulse'>Caricamento luoghi in corso...</p>";
        return;
    }

    // Filtriamo i luoghi in base alla categoria corrente
    const monumentiFiltrati = monumenti.filter(m => categoriaCorrente === 'tutti' || m.categoria === categoriaCorrente);
    
    if (monumentiFiltrati.length === 0) {
        containerLista.innerHTML = "<p class='text-gray-400 text-xs text-center py-4'>Nessun luogo trovato in questa categoria.</p>";
        return;
    }

    // Se controlliamo globalmente i non scoperti e l'utente ha esplorato tutto il database
    const daScoprireGlobali = monumenti.filter(m => !m.scoperto);
    if (daScoprireGlobali.length === 0 && categoriaCorrente === 'tutti') {
        containerLista.innerHTML = "<p class='text-yellow-400 text-xs text-center font-bold py-4'>🎉 Hai esplorato tutti i luoghi di Brescia! Ottimo lavoro!</p>";
        return;
    }

    containerLista.innerHTML = ""; 
    monumentiFiltrati.forEach(m => {
        const item = document.createElement('div');
        // Creiamo un ID univoco pulito per aggiornare i metri in real-time senza ricaricare l'intera lista dom
        const safeId = m.nome.replace(/[^a-zA-Z0-9]/g, '-');
        item.id = `monumento-${safeId}`;
        item.className = `p-3 rounded-xl flex justify-between items-center transition-all bg-gray-800 border border-gray-700 shadow-md ${
            m.scoperto ? 'bg-green-950/40 border-green-500' : 'bg-gray-700/50 border-gray-600'
        }`;
        
        item.innerHTML = `
            <div class="flex-1 pr-2">
                <p class="font-semibold text-sm ${m.scoperto ? 'text-green-400' : 'text-gray-200'}">${m.nome}</p>
                <p class="text-[10px] text-gray-400 mt-0.5">${m.desc}</p>
                <p class="text-xs text-gray-400 font-mono label-distanza mt-1">${m.scoperto ? '🏁 Obiettivo Conquistato' : '📍 Distanza: Calcolo in corso...'}</p>
            </div>
            <div class="text-sm font-mono text-gray-400 bg-gray-800 px-2 py-1 rounded-md badge-xp shrink-0">
                ${m.scoperto ? '✅' : '+100 XP'}
            </div>
        `;
        containerLista.appendChild(item);
    });
}

function aggiornaWishlistFull() {
    const container = document.getElementById('lista-monumenti-full');
    if (!container) return;
    
    if (typeof monumenti === 'undefined') {
        container.innerHTML = "<p class='text-gray-400 text-xs text-center py-4 animate-pulse'>Caricamento luoghi in corso...</p>";
        return;
    }

    let monumentiFiltrati = monumenti;
    
    // Recupera il filtro selezionato nel dropdown della wishlist full
    const dropdownFiltro = document.getElementById('filtro-wishlist');
    if (dropdownFiltro) {
        const filtroSelezionato = dropdownFiltro.value;
        if (filtroSelezionato !== 'tutti') {
            monumentiFiltrati = monumenti.filter(m => m.categoria === filtroSelezionato);
        }
    }
    
    if (monumentiFiltrati.length === 0) {
        container.innerHTML = "<p class='text-gray-400 text-xs text-center py-4'>Nessun luogo trovato in questa categoria.</p>";
        return;
    }

    const daScoprireGlobali = monumenti.filter(m => !m.scoperto);
    if (daScoprireGlobali.length === 0) {
        container.innerHTML = "<p class='text-yellow-400 text-xs text-center font-bold py-4'>🎉 Hai esplorato tutti i luoghi di Brescia! Ottimo lavoro!</p>";
        return;
    }

    container.innerHTML = "";
    monumentiFiltrati.forEach(m => {
        const item = document.createElement('div');
        const safeId = m.nome.replace(/[^a-zA-Z0-9]/g, '-');
        item.id = `monumento-full-${safeId}`;
        item.className = `p-3 rounded-xl flex justify-between items-center transition-all bg-gray-800 border ${
            m.scoperto ? 'bg-green-950/40 border-green-500' : 'bg-gray-700/50 border-gray-600'
        }`;
        
        item.innerHTML = `
            <div class="flex-1 pr-2">
                <p class="font-semibold text-sm ${m.scoperto ? 'text-green-400' : 'text-gray-200'}">${m.nome}</p>
                <p class="text-[10px] text-gray-400 mt-0.5">${m.desc}</p>
                <p class="text-xs text-gray-400 font-mono label-distanza-full mt-1">${m.scoperto ? '🏁 Obiettivo Conquistato' : '📍 Distanza: Calcolo in corso...'}</p>
            </div>
            <div class="text-sm font-mono text-gray-400 bg-gray-800 px-2 py-1 rounded-md badge-xp shrink-0">
                ${m.scoperto ? '✅' : '+100 XP'}
            </div>
        `;
        container.appendChild(item);
    });
}

// --- FUNZIONE FILTRA CATEGORIA VIA NAVBAR ---
function filtraCategoria(categoria) {
    categoriaCorrente = categoria;
    
    const classiContorno = ['outline-3', 'outline-yellow-400'];
    const pulsanti = document.querySelectorAll('#filtri-nav button');
    
    // Rimuove il contorno da tutti i pulsanti della navbar per resettarli
    pulsanti.forEach(btn => btn.classList.remove(...classiContorno));

    // CORREZIONE INTELLIGENTE: Se i bottoni non hanno un ID esatto, trova quello col comando associato
    const pulsanteAttivo = document.getElementById(`btn-filtro-${categoria}`) || 
                           Array.from(pulsanti).find(btn => btn.getAttribute('onclick')?.includes(`'${categoria}'`));
                           
    if (pulsanteAttivo) {
        pulsanteAttivo.classList.add(...classiContorno);
    }

    aggiornaMappaELista(categoria);
}
window.filtraCategoria = filtraCategoria;

// --- SISTEMA GPS CON MOVIMENTO FLUIDO ---
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
        alert("Questo telefono o browser non supporta la geolocalizzazione.");
    }
}

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

// --- FORMULA HAVERSINE MATEMATICA PRECISA ---
function calcolaDistanza(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Raggio della terra in metri
    const phi1 = lat1 * Math.PI / 180;
    const phi2 = lat2 * Math.PI / 180;
    const deltaPhi = (lat2 - lat1) * Math.PI / 180;
    const deltaLambda = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
              Math.cos(phi1) * Math.cos(phi2) *
              Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distanza finale espressa in metri
}

// --- LOGICA DI GIOCO: CONTROLLO VICINANZA E SBLOCCO ---
function controllaProssimita(uLat, uLng) {
    if (typeof monumenti === 'undefined') return;

    document.title = "Brescia Quest - Il Gioco Esplorativo"; // Assicura stabilità titolo

    monumenti.forEach(m => {
        const distanza = calcolaDistanza(uLat, uLng, m.lat, m.lng);
        const safeId = m.nome.replace(/[^a-zA-Z0-9]/g, '-');
        const rigaElemento = document.getElementById(`monumento-${safeId}`);
        const rigaElementoFull = document.getElementById(`monumento-full-${safeId}`);

        if (!m.scoperto) {
            // Se l'elemento è renderizzato nella wishlist laterale, aggiorna dinamicamente i metri in tempo reale
            if (rigaElemento) {
                const labelDistanza = rigaElemento.querySelector('.label-distanza');
                if (labelDistanza) labelDistanza.innerText = `📍 Distanza: ${Math.round(distanza)} metri`;
            }
            if (rigaElementoFull) {
                const labelDistanzaFull = rigaElementoFull.querySelector('.label-distanza-full');
                if (labelDistanzaFull) labelDistanzaFull.innerText = `📍 Distanza: ${Math.round(distanza)} metri`;
            }

            // Sblocco effettivo se l'utente scende sotto i 50 metri dal target
            if (distanza <= 50) {
                m.scoperto = true;
                
                // 🎵 RIPRODUCI JINGLE TRIONFALE!
                if (typeof window.playJingleMonumento === 'function') {
                    window.playJingleMonumento();
                }
                
                // Aggiorna marker sulla mappa in tempo reale
                if (m.markerRef) {
                    m.markerRef.setStyle({ fillColor: '#10b981' }); // Diventa verde istantaneamente
                    m.markerRef.bindPopup(`<b>${m.nome}</b><br>${m.desc}`).openPopup();
                }

                // Gestione punti esperienza e passaggio livello
                assegnaXP(100);

                // Carica il luogo scoperto nella coda dei popup gestiti in sequenza asincrona
                codaPopup.push(m);
                
                // Ricarica la grafica della lista
                aggiornaMappaELista(categoriaCorrente);
            }
        }
    });

    // Controllo se è possibile consumare e mostrare subito il primo popup in coda
    const popupElement = document.getElementById('popup-scoperta');
    if (codaPopup.length > 0 && popupElement && popupElement.classList.contains('hidden')) {
        mostraPopupScoperta(codaPopup[0]);
    }
}

function assegnaXP(punti) {
    playerXP += punti;
    while (playerXP >= xpPerLivello) {
        playerLevel += 1;
        playerXP -= xpPerLivello;
    }

    // Sincronizzazione immediata dei nodi DOM dell'interfaccia utente (Header/Profilo)
    const xpTxt = document.getElementById('xp-txt');
    const lvlTxt = document.getElementById('livello-txt');
    const xpBar = document.getElementById('xp-bar');

    if (xpTxt) xpTxt.innerText = playerXP;
    if (lvlTxt) lvlTxt.innerText = playerLevel;
    if (xpBar) xpBar.style.width = `${(playerXP / xpPerLivello) * 100}%`;

    // Richiesta di salvataggio remoto asincrono su cloud database Firebase
    if (typeof window.salvaProgressoSuCloud === 'function') {
        window.salvaProgressoSuCloud(playerXP, playerLevel, monumenti);
    }
}

function mostraPopupScoperta(m) {
    const nomeEl = document.getElementById('popup-nome');
    const descEl = document.getElementById('popup-desc');
    const popupEl = document.getElementById('popup-scoperta');

    if (nomeEl) nomeEl.innerText = m.nome;
    if (descEl) descEl.innerText = m.desc;
    if (popupEl) popupEl.classList.remove('hidden');
}

// --- FUNZIONE PER CHIUDERE IL POPUP DI SBLOCCO (GESTIONE IN CODA) ---
window.chiudiPopup = function() {
    const popupEl = document.getElementById('popup-scoperta');
    if (popupEl) popupEl.classList.add('hidden');
    
    // Rimuove l'elemento appena visto dalla testa dell'array
    codaPopup.shift();
    
    // Se ci sono altri elementi bloccati nello stesso ciclo GPS, mostra il successivo dopo un leggero delay
    if (codaPopup.length > 0) {
        setTimeout(() => {
            const prossimoPopup = document.getElementById('popup-scoperta');
            if (prossimoPopup && prossimoPopup.classList.contains('hidden')) {
                mostraPopupScoperta(codaPopup[0]);
            }
        }, 250);
    }
};
