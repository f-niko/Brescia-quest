// --- VARIABILI DI STATO DEL GIOCO ---
let playerXP = 0;
let playerLevel = 1;
const xpPerLivello = 300;
let map, userMarker;
let markersAttivi = []; // Tiene traccia dei PIN visualizzati sulla mappa
let categoriaCorrente = 'tutti';

// Variabili per l'animazione fluida del GPS
let posizioneTarget = null;
let animazioneInCorso = null;

// --- INIZIALIZZAZIONE DEL GIOCO ---
function initGioco() {
    // Inizializza la mappa globale centrata inizialmente su Via Milano a Brescia
    map = L.map('map').setView([45.5415, 10.2012], 14);

    // Carica la grafica della mappa gratuita da OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
    }).addTo(map);

    // Mostra i punti e la lista obiettivi
    aggiornaMappaELista();

    // Attiva il tracciamento del GPS del telefono
    attivaGPS({ enableHighAccuracy: true, timeout: 5000, maximumAge: 0 });
}

// --- GESTIONE DEI FILTRI E DEI PIN ---
function aggiornaMappaELista() {
    // 1. Pulisce i vecchi PIN dalla mappa per evitare doppioni
    markersAttivi.forEach(m => map.removeLayer(m));
    markersAttivi = [];

    // 2. Svuota il contenitore del Registro Missioni (Wishlist) nell'HTML
    const containerLista = document.getElementById('lista-monumenti');
    containerLista.innerHTML = "";

    // 3. Cicla sui monumenti di Brescia per inserire solo quelli filtrati
    monumenti.forEach(m => {
        if (categoriaCorrente === 'tutti' || m.categoria === categoriaCorrente) {
            
            // --- AGGIUNGI PIN ALLA MAPPA ---
            const marker = L.marker([m.lat, m.lng]).addTo(map);
            
            if (m.scoperto) {
                marker.bindPopup(`<b>✅ ${m.nome}</b><br>${m.desc}`);
            } else {
                marker.bindPopup(`<b>🔒 Luogo Bloccato</b><br>Avvicinati a meno di 50 metri con il GPS per conquistare questo obiettivo!`);
            }
            
            markersAttivi.push(marker);
            m.markerRef = marker;

            // --- AGGIUNGI RIGA AL REGISTRO DELLE MISSIONI ---
            const item = document.createElement('div');
            item.className = `p-3 rounded-xl flex justify-between items-center transition-all ${
                m.scoperto ? 'bg-green-950/40 border border-green-500' : 'bg-gray-700/50 border border-gray-600'
            }`;
            
            item.innerHTML = `
                <div>
                    <p class="font-semibold text-sm ${m.scoperto ? 'text-green-400' : 'text-gray-200'}">${m.nome}</p>
                    <p class="text-xs text-gray-400 font-mono">${m.scoperto ? '🟢 Obiettivo Conquistato' : '🔒 Distanza: Calcolo in corso...'}</p>
                </div>
                <div class="text-sm font-mono text-gray-400 bg-gray-800 px-2 py-1 rounded-md">
                    ${m.scoperto ? '🏆' : '+100 XP'}
                </div>
            `;
            containerLista.appendChild(item);
        }
    });
}

function filtraCategoria(categoria) {
    categoriaCorrente = categoria;
    aggiornaMappaELista();
}

// --- SISTEMA GPS CON MOVIMENTO FLUIDO INIETTATO ---
function attivaGPS(options) {
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(
            (position) => {
                const uLat = position.coords.latitude;
                const uLng = position.coords.longitude;

                if (!userMarker) {
                    // Primo avvio: crea l'avatar sul punto esatto
                    userMarker = L.circleMarker([uLat, uLng], { 
                        radius: 12, 
                        color: '#ffffff', 
                        fillColor: '#3b82f6', 
                        fillOpacity: 0.9,
                        weight: 3
                    }).addTo(map);
                    
                    map.setView([uLat, uLng], 16); 
                } else {
                    // Spostamenti successivi: attiva l'animazione fluida verso le nuove coordinate
                    posizioneTarget = { lat: uLat, lng: uLng };
                    if (!animazioneInCorso) {
                        animaAvatar();
                    }
                }

                // Controlla la prossimità basandosi sulla posizione reale rilevata
                controllaProssimita(uLat, uLng);
            },
            (error) => { console.warn("Errore ricezione GPS: ", error.message); },
            { enableHighAccuracy: true }
        );
    } else {
        alert("Questo telefono o browser non supporta la geolocalizzazione.");
    }
}

// Funzione di interpolazione lineare (Lerp) per muovere il pallino millimetro per millimetro
function animaAvatar() {
    if (!posizioneTarget || !userMarker) return;

    const posAttuale = userMarker.getLatLng();
    
    // Calcoliamo la differenza tra dove si trova ora e dove deve arrivare
    const diffLat = posizioneTarget.lat - posAttuale.lat;
    const diffLng = posizioneTarget.lng - posAttuale.lng;

    // Velocità di scivolamento (0.05 significa che copre il 5% della distanza rimanente ad ogni fotogramma)
    const fattoreFlidita = 0.05; 

    // Se la distanza è minuscola, saltiamo direttamente al punto d'arrivo e fermiamo l'animazione
    if (Math.abs(diffLat) < 0.00001 && Math.abs(diffLng) < 0.00001) {
        userMarker.setLatLng([posizioneTarget.lat, posizioneTarget.lng]);
        animazioneInCorso = null; // Animazione completata
    } else {
        // Altrimenti calcola lo step intermedio
        const nuovaLat = posAttuale.lat + (diffLat * fattoreFlidita);
        const nuovaLng = posAttuale.lng + (diffLng * fattoreFlidita);
        
        userMarker.setLatLng([nuovaLat, nuovaLng]);
        
        // Richiede al browser di eseguire il prossimo fotogramma dell'animazione (circa 60 fps)
        animazioneInCorso = requestAnimationFrame(animaAvatar);
    }
}

// --- FORMULA HA VERSINE ---
function calcolaDistanza(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Raggio terrestre in metri
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

// --- MECCANICA DI GIOCO: GEOFENCING E SBLOCCO BADGE ---
function controllaProssimita(userLat, userLng) {
    monumenti.forEach(m => {
        if (!m.scoperto) {
            const distanza = calcolaDistanza(userLat, userLng, m.lat, m.lng);
            
            if (distanza <= 50) { 
                m.scoperto = true;
                assegnaXP(100);
                mostraPopupScoperta(m);
                aggiornaMappaELista();
            }
        }
    });
}

// --- ASSEGNAZIONE PUNTEGGIO E LIVELLI ---
function assegnaXP(punti) {
    playerXP += punti;
    
    if (playerXP >= xpPerLivello) {
        playerLevel++;
        playerXP -= xpPerLivello;
        document.getElementById('livello-txt').innerText = playerLevel;
    }
    
    document.getElementById('xp-txt').innerText = playerXP;
    const percentuale = (playerXP / xpPerLivello) * 100;
    document.getElementById('xp-bar').style.width = `${percentuale}%`;
}

// --- VISUALIZZAZIONE DEL POP-UP DI SUCCESSO ---
function mostraPopupScoperta(m) {
    document.getElementById('popup-nome').innerText = m.nome;
    document.getElementById('popup-desc').innerText = m.desc;
    document.getElementById('popup-scoperta').classList.remove('hidden');
}

function chiudiPopup() {
    document.getElementById('popup-scoperta').classList.add('hidden');
}
