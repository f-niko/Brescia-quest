// --- VARIABILI DI STATO ---
let playerXP = 0;
let playerLevel = 1;
const xpPerLivello = 300;
let map, userMarker;
let markersAttivi = []; 
let categoriaCorrente = 'tutti';
let posizioneTarget = null;
let animazioneInCorso = null;
let codaPopup = [];

// --- GESTIONE INTERFACCIA (Sidebar e Bottoni) ---
function toggleWishlist() {
    const sidebar = document.getElementById('wishlist-sidebar');
    if (sidebar) sidebar.classList.toggle('translate-x-full');
}

function toggleAmici() {
    const popup = document.getElementById('popup-amici');
    if (popup) popup.classList.toggle('hidden');
}

// --- INIZIALIZZAZIONE ---
function initGioco() {
    if (map) return aggiornaMappaELista();
    
    // Inizializzazione Leaflet
    map = L.map('map').setView([45.5415, 10.2012], 14);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
    }).addTo(map);

    aggiornaMappaELista();
    attivaGPS({ enableHighAccuracy: true, timeout: 5000, maximumAge: 0 });
}

// --- LOGICA MAPPA E WISHLIST ---
function aggiornaMappaELista() {
    if (!map || typeof monumenti === 'undefined') return;
    
    // Pulizia marker precedenti
    markersAttivi.forEach(m => map.removeLayer(m));
    markersAttivi = [];

    // Disegno marker
    monumenti.forEach(m => {
        if (categoriaCorrente === 'tutti' || m.categoria === categoriaCorrente) {
            const marker = L.circleMarker([m.lat, m.lng], {
                radius: 10,
                fillColor: m.scoperto ? '#10b981' : '#ef4444',
                color: '#fff',
                fillOpacity: 0.9,
                weight: 2
            }).addTo(map);
            
            marker.bindPopup(`<b>${m.nome}</b><br>${m.scoperto ? m.desc : "⚠️ Avvicinati!"}`);
            markersAttivi.push(marker);
        }
    });
    
    // Aggiorna sidebar wishlist
    aggiornaWishlist();
}

function aggiornaWishlist() {
    const lista = document.getElementById('lista-monumenti');
    if (!lista) return;
    
    // Controllo di sicurezza se l'array monumenti non esiste ancora al caricamento
    if (typeof monumenti === 'undefined') {
        lista.innerHTML = "<p class='text-gray-400 text-xs text-center py-4 animate-pulse'>Caricamento luoghi in corso...</p>";
        return;
    }
    
    // Filtriamo i luoghi non ancora scoperti
    const daScoprire = monumenti.filter(m => !m.scoperto);
    
    // Se la lista è vuota perché l'utente ha visitato tutto
    if (daScoprire.length === 0) {
        lista.innerHTML = "<p class='text-yellow-400 text-xs text-center font-bold py-4'>🎉 Hai esplorato tutti i luoghi di Brescia! Ottimo lavoro!</p>";
        return;
    }
    
    lista.innerHTML = ""; 
    daScoprire.forEach(m => {
        const div = document.createElement('div');
        div.className = "bg-gray-800 p-3 rounded-lg border border-gray-700 shadow-md";
        div.innerHTML = `<div class="font-bold text-yellow-400 text-sm">${m.nome}</div>
                         <div class="text-[10px] text-gray-400 mt-1">${m.desc}</div>`;
        lista.appendChild(div);
    });
}

// --- GPS E ANIMAZIONE ---
function attivaGPS(options) {
    if (!navigator.geolocation) return alert("Geolocalizzazione non supportata");
    
    navigator.geolocation.watchPosition((pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        
        if (!userMarker) {
            userMarker = L.circleMarker([lat, lng], { radius: 12, fillColor: '#3b82f6', color: '#fff', weight: 3 }).addTo(map);
            map.setView([lat, lng], 16);
        } else {
            posizioneTarget = { lat, lng };
            if (animazioneInCorso) cancelAnimationFrame(animazioneInCorso);
            animaAvatar();
        }
        controllaProssimita(lat, lng);
    }, (err) => console.error(err), options);
}

function animaAvatar() {
    if (!posizioneTarget || !userMarker) return;
    const pos = userMarker.getLatLng();
    const dLat = posizioneTarget.lat - pos.lat;
    const dLng = posizioneTarget.lng - pos.lng;
    const fattoreFluidita = 0.05;

    if (Math.abs(dLat) < 0.000001 && Math.abs(dLng) < 0.000001) {
        userMarker.setLatLng([posizioneTarget.lat, posizioneTarget.lng]);
        animazioneInCorso = null;
    } else {
        userMarker.setLatLng([pos.lat + dLat * fattoreFluidita, pos.lng + dLng * fattoreFluidita]);
        animazioneInCorso = requestAnimationFrame(animaAvatar);
    }
}

// --- LOGICA DI GIOCO ---
function assegnaXP(punti) {
    playerXP += punti;
    while (playerXP >= xpPerLivello) {
        playerLevel++;
        playerXP -= xpPerLivello;
    }
    
    const xpTxt = document.getElementById('xp-txt');
    const xpBar = document.getElementById('xp-bar');
    const lvlTxt = document.getElementById('livello-txt');
    
    if(lvlTxt) lvlTxt.innerText = playerLevel;
    if(xpTxt) xpTxt.innerText = playerXP;
    if(xpBar) xpBar.style.width = `${(playerXP / xpPerLivello) * 100}%`;
    
    if (window.salvaProgressoSuCloud) window.salvaProgressoSuCloud(playerXP, playerLevel, monumenti);
}

function controllaProssimita(lat, lng) {
    if (typeof monumenti === 'undefined') return;

    monumenti.forEach(m => {
        if (!m.scoperto && calcolaDistanza(lat, lng, m.lat, m.lng) <= 50) {
            m.scoperto = true;
            assegnaXP(100);
            codaPopup.push(m);
        }
    });
    
    aggiornaMappaELista();

    // CORRETTO: Verifica lineare se c'è un popup in coda e se l'interfaccia del popup è attualmente nascosta
    const popupElement = document.getElementById('popup-scoperta');
    if (codaPopup.length > 0 && popupElement && popupElement.classList.contains('hidden')) {
        mostraPopupScoperta(codaPopup[0]);
    }
}

function calcolaDistanza(lat1, lon1, lat2, lon2) {
    const R = 6371000;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2)**2 + Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) * Math.sin(dLon/2)**2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function mostraPopupScoperta(m) {
    const nomeEl = document.getElementById('popup-nome');
    const descEl = document.getElementById('popup-desc');
    const popupEl = document.getElementById('popup-scoperta');

    if (nomeEl) nomeEl.innerText = m.nome;
    if (descEl) descEl.innerText = m.desc;
    if (popupEl) popupEl.classList.remove('hidden');
}

function chiudiPopup() {
    const popupEl = document.getElementById('popup-scoperta');
    if (popupEl) popupEl.classList.add('hidden');
    
    codaPopup.shift();
    if (codaPopup.length > 0) {
        setTimeout(() => mostraPopupScoperta(codaPopup[0]), 200);
    }
}

// Funzione globale per gestire il cambio di filtri categoria (invocata dalla navbar)
window.filtraCategoria = function(categoria) {
    categoriaCorrente = categoria;
    aggiornaMappaELista();
}
