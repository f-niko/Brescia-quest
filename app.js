// --- VARIABILI DI STATO DEL GIOCO ---
let playerXP = 0;
let playerLevel = 1;
const xpPerLivello = 300;
let map, userMarker;
let markersAttivi = []; // Tiene traccia dei PIN visualizzati sulla mappa
let categoriaCorrente = 'tutti';

// --- INIZIALIZZAZIONE DEL GIOCO ---
// Questa funzione viene chiamata in automatico appena superi la schermata di Login
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
        // Seleziona in base al filtro (o mostra tutto se 'tutti')
        if (categoriaCorrente === 'tutti' || m.categoria === categoriaCorrente) {
            
            // --- AGGIUNGI PIN ALLA MAPPA ---
            const marker = L.marker([m.lat, m.lng]).addTo(map);
            
            // Se il luogo è scoperto mostra i dettagli, altrimenti lascialo bloccato
            if (m.scoperto) {
                marker.bindPopup(`<b>✅ ${m.nome}</b><br>${m.desc}`);
            } else {
                marker.bindPopup(`<b>🔒 Luogo Bloccato</b><br>Avvicinati a meno di 50 metri con il GPS per conquistare questo obiettivo!`);
            }
            
            markersAttivi.push(marker); // Salva il riferimento per poterlo cancellare al prossimo cambio filtro
            m.markerRef = marker; // Collega il marker ai dati

            // --- AGGIUNGI RIGA AL REGISTRO DELLE MISSIONI (HTML) ---
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

// Funzione attivata quando clicchi sui pulsanti dei Filtri (Parchi, Spesa, Monumenti)
function filtraCategoria(categoria) {
    categoriaCorrente = categoria;
    aggiornaMappaELista();
}

// --- SISTEMA GPS (GEOLOCALIZZAZIONE) ---
function attivaGPS(options) {
    if (navigator.geolocation) {
        // watchPosition tiene il GPS attivo e rileva se l'utente cammina per Brescia
        navigator.geolocation.watchPosition(
            (position) => {
                const uLat = position.coords.latitude;
                const uLng = position.coords.longitude;

                // Crea l'avatar (cerchietto blu) o aggiorna la sua posizione sulla mappa globale
                if (!userMarker) {
                    userMarker = L.circleMarker([uLat, uLng], { 
                        radius: 12, 
                        color: '#ffffff', 
                        fillColor: '#3b82f6', 
                        fillOpacity: 0.9,
                        weight: 3
                    }).addTo(map);
                    
                    // Centra la visuale sul giocatore appena si connette
                    map.setView([uLat, uLng], 16); 
                } else {
                    userMarker.setLatLng([uLat, uLng]);
                }

                // Controlla se l'avatar si è avvicinato ai punti di Brescia
                controllaProssimita(uLat, uLng);
            },
            (error) => { console.warn("Errore ricezione GPS: ", error.message); },
            { enableHighAccuracy: true } // Forza l'uso del GPS preciso dello smartphone
        );
    } else {
        alert("Questo telefono o browser non supporta la geolocalizzazione.");
    }
}

// --- FORMULA HA VERSINE (Calcolo metrico della distanza globale) ---
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

    return R * c; // Distanza precisa in metri
}

// --- MECCANICA DI GIOCO: GEOFENCING E SBLOCCO BADGE ---
function controllaProssimita(userLat, userLng) {
    monumenti.forEach(m => {
        if (!m.scoperto) {
            const distanza = calcolaDistanza(userLat, userLng, m.lat, m.lng);
            
            // Sblocca il Badge se l'utente si trova a meno di 50 metri dal posto
            // TIP DI TEST: Cambialo in 50000 se vuoi sbloccarli tutti subito mentre testi da PC a casa!
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
    
    // Sistema di Level Up (Ogni 300 punti si sale di livello)
    if (playerXP >= xpPerLivello) {
        playerLevel++;
        playerXP -= xpPerLivello;
        document.getElementById('livello-txt').innerText = playerLevel;
    }
    
    // Aggiorna la grafica della barra XP nell'interfaccia
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
