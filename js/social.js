import { auth, db, doc, getDoc, getDocs, updateDoc, arrayUnion, arrayRemove, onSnapshot, collection, addDoc, deleteDoc } from './firebase.js';
import { __t } from './translations.js';

const copiaCodiceAmico = function() {
  const utenteCorrenteId = window.utenteCorrenteId;
  if (!utenteCorrenteId) return;
  navigator.clipboard.writeText(utenteCorrenteId);
  alert(__t('alertCopiato'));
}

const condividiCodiceAmico = function() {
  const utenteCorrenteId = window.utenteCorrenteId;
  if (!utenteCorrenteId) return;
  const testoCondivisione = __t('condividiTesto') + utenteCorrenteId;

  if (navigator.share) {
    navigator.share({
      title: 'Venatores Brixiae',
      text: testoCondivisione
    }).catch(console.error);
  } else {
    navigator.clipboard.writeText(testoCondivisione);
    alert(__t('alertCondiviso'));
  }
}

const aggiungiAmico = async function() {
  const utenteCorrenteId = window.utenteCorrenteId;
  const codiceAmico = document.getElementById('input-codice-amico').value.trim();
  if (!codiceAmico) return;
  if (codiceAmico === utenteCorrenteId) {
    alert(__t('alertNoSelfFriend'));
    return;
  }

  try {
    const amicoSnap = await getDoc(doc(db, "utenti", codiceAmico));
    if (!amicoSnap.exists()) {
      alert(__t('alertNoPlayerFound'));
      return;
    }

    await updateDoc(doc(db, "utenti", utenteCorrenteId), { amici: arrayUnion(codiceAmico) });
    await updateDoc(doc(db, "utenti", codiceAmico), { amici: arrayUnion(utenteCorrenteId) });

    alert(__t('alertFriendAdded'));
    document.getElementById('input-codice-amico').value = "";
    window.aggiornaElencoClassificaAmici();
  } catch (e) {
    console.error(e);
  }
}

const rimuoviAmico = async function(idAmico) {
  const utenteCorrenteId = window.utenteCorrenteId;
  if (!confirm(__t('alertRemoveFriend'))) return;
  try {
    await updateDoc(doc(db, "utenti", utenteCorrenteId), { amici: arrayRemove(idAmico) });
    await updateDoc(doc(db, "utenti", idAmico), { amici: arrayRemove(utenteCorrenteId) });
    window.aggiornaElencoClassificaAmici();
  } catch (e) {
    console.error(e);
  }
}

const aggiornaElencoClassificaAmici = async function() {
  const utenteCorrenteId = window.utenteCorrenteId;
  const container = document.getElementById('lista-amici-classifica');
  const conteggioAmici = document.getElementById('conteggio-amici');
  if (!container || !utenteCorrenteId) return;
  container.innerHTML = "<p class='text-gray-400 animate-pulse text-center py-8'>" + __t('amiciSincro') + "</p>";

  try {
    const mioSnap = await getDoc(doc(db, "utenti", utenteCorrenteId));
    if (!mioSnap.exists()) return;
    const mieiDati = mioSnap.data();
    const listaIdAmici = mieiDati.amici || [];

    let partecipanti = [];
    partecipanti.push({
      id: utenteCorrenteId,
      nome: mieiDati.nome + " (Tu)",
      livello: mieiDati.livello,
      xp: mieiDati.xp,
      status: "online",
      ultimoAccesso: mieiDati.ultimoAccesso
    });

    for (let idAmico of listaIdAmici) {
      const snapAmico = await getDoc(doc(db, "utenti", idAmico));
      if (snapAmico.exists()) {
        const dAmico = snapAmico.data();
        partecipanti.push({
          id: idAmico,
          nome: dAmico.nome,
          livello: dAmico.livello,
          xp: dAmico.xp,
          status: dAmico.status || "offline",
          ultimoAccesso: dAmico.ultimoAccesso
        });
      }
    }

    if (conteggioAmici) {
      const label = partecipanti.length === 1 ? __t('conteggioSingolare') : __t('conteggioPlurale');
      conteggioAmici.innerText = `${partecipanti.length} ${label}`;
    }

    partecipanti.sort((a, b) => {
      if (b.livello !== a.livello) return b.livello - a.livello;
      return b.xp - a.xp;
    });

    container.innerHTML = "";
    partecipanti.forEach((p, index) => {
      let dataTxt = __t('amiciMai');
      if (p.ultimoAccesso) {
        const d = new Date(p.ultimoAccesso);
        dataTxt = d.toLocaleDateString() + " " + d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
      }

      const isMe = p.id === utenteCorrenteId;
      const badgePiazzamento = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `${index + 1}.`;

      const riga = document.createElement('div');
      riga.className = `card ${isMe ? 'card-gold' : 'card'} p-3 rounded-xl flex justify-between items-center`;

      riga.innerHTML = `
        <div class="flex items-center gap-3">
          <span class="font-mono font-bold text-sm text-gray-400 w-5">${badgePiazzamento}</span>
          <div>
            <div class="font-bold flex items-center gap-1.5 text-sm">
              ${p.nome}
              <span class="status-dot ${p.status === 'online' ? 'online' : 'offline'}"></span>
            </div>
            <div class="text-[10px] text-gray-400">${__t('amiciAccesso')} ${dataTxt}</div>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <div class="text-right">
            <span class="text-xs font-bold text-green-400 block">Lvl ${p.livello}</span>
            <span class="text-[10px] text-gray-400">${p.xp} XP</span>
          </div>
          ${!isMe ? `<button onclick="window.rimuoviAmico('${p.id}')" class="text-red-400 hover:text-red-500 text-sm p-1 cursor-pointer hover:bg-red-500/10 rounded-lg transition-colors">✕</button>` : ''}
        </div>
      `;
      container.appendChild(riga);
    });
  } catch (e) {
    console.error(e);
  }
}

function renderizzaFeedDinamico() {
  const utenteCorrenteId = window.utenteCorrenteId;
  const cacheDatiMembri = window.cacheDatiMembri || {};
  const container = document.getElementById('lista-amici-feed');
  if (!container) return;

  let eventiBacheca = [];
  const tuttiIdMembri = Object.keys(cacheDatiMembri);

  tuttiIdMembri.forEach(idUtente => {
    const dUtente = cacheDatiMembri[idUtente];
    if (!dUtente) return;
    
    const nomeVisualizzato = idUtente === utenteCorrenteId ? "Tu" : (dUtente.nome || "Esploratore");
    const isMittente = idUtente === utenteCorrenteId;
    
    const messaggiUtente = dUtente.messaggi || [];
    let documentomodificato = false;

    const messaggiControllati = messaggiUtente.map(msg => {
      if (!msg.letteDa) msg.letteDa = [];

      if (idUtente !== utenteCorrenteId) {
        if (!msg.letteDa.includes(utenteCorrenteId)) {
          msg.letteDa.push(utenteCorrenteId);
          documentomodificato = true;
        }
      }
      return msg;
    });

    if (documentomodificato && idUtente !== utenteCorrenteId) {
      updateDoc(doc(db, "utenti", idUtente), { messaggi: messaggiControllati })
        .catch(err => console.error("Errore aggiornamento lettura:", err));
    }

    messaggiControllati.forEach(msg => {
      let spunteHtml = "";

      if (isMittente) {
        const lettoDallAmico = msg.letteDa.some(id => id !== utenteCorrenteId);
        if (lettoDallAmico) {
          spunteHtml = `<span class="text-blue-400 text-xs ml-1 font-bold select-none">✓✓</span>`;
        } else {
          spunteHtml = `<span class="text-gray-500 text-xs ml-1 select-none">✓✓</span>`;
        }
      }

      eventiBacheca.push({
        timestamp: msg.timestamp || new Date().toISOString(),
        html: `💬 <strong>${nomeVisualizzato}</strong>: <span class="text-gray-100 break-words">${msg.testo}</span>${spunteHtml}`,
        tipo: 'messaggio',
        id: msg.id || `msg_${Date.now()}_${Math.random()}`,
        mittente: idUtente,
        isMittente: isMittente
      });
    });
  });

  eventiBacheca.sort((a, b) => a.timestamp.localeCompare(b.timestamp));

  if (eventiBacheca.length > 30) {
    eventiBacheca = eventiBacheca.slice(-30);
  }

  container.innerHTML = "";
  if (eventiBacheca.length === 0) {
    container.innerHTML = "<p class='text-gray-500 text-center py-8'>" + __t('feedNessunaAttivita') + "</p>";
    return;
  }

  let dataCorrente = '';
  eventiBacheca.forEach(evento => {
    const data = new Date(evento.timestamp);
    const dataStr = data.toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' });
    
    if (dataStr !== dataCorrente) {
      dataCorrente = dataStr;
      const separatore = document.createElement('div');
      separatore.className = "text-[10px] text-gray-500 font-bold uppercase mt-3 mb-1.5 border-b border-white/5 pb-1";
      separatore.innerText = dataStr;
      container.appendChild(separatore);
    }
    
    const riga = document.createElement('div');
    let bgClass = 'card';
    if (evento.tipo === 'messaggio' && evento.isMittente) {
      bgClass = 'card-gold';
    } else if (evento.tipo === 'messaggio') {
      bgClass = 'card-blue';
    }
    
    riga.className = `${bgClass} p-3 rounded-xl text-gray-200 leading-relaxed mb-1.5 shadow-sm text-xs animate-fadeIn`;
    
    const ora = data.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
    riga.innerHTML = `<span class="text-gray-500 mr-1.5">${ora}</span> ${evento.html}`;
    container.appendChild(riga);
  });

  container.scrollTop = container.scrollHeight;
}

const avviaAscoltoChatRealTime = function() {
  window.stoppaAscoltoChatRealTime();
  
  const container = document.getElementById('lista-amici-feed');
  const utenteCorrenteId = window.utenteCorrenteId;
  if (!container || !utenteCorrenteId) {
    console.log("Container feed non disponibile o utente non autenticato");
    return;
  }
  
  container.innerHTML = "<p class='text-blue-400 animate-pulse text-center py-8'>" + __t('feedConnessioneLive') + "</p>";

  const unsubIo = onSnapshot(doc(db, "utenti", utenteCorrenteId), (mioSnap) => {
    if (!mioSnap.exists()) return;
    
    const mieiDati = mioSnap.data();
    if (!window.cacheDatiMembri) window.cacheDatiMembri = {};
    window.cacheDatiMembri[utenteCorrenteId] = mieiDati;
    const listaIdAmici = mieiDati.amici || [];
    if (!window.chatUnsubscribers) window.chatUnsubscribers = [];

    while (window.chatUnsubscribers.length > 1) {
      const unsub = window.chatUnsubscribers.pop();
      if (unsub) unsub();
    }

    listaIdAmici.forEach((idAmico) => {
      const unsubAmico = onSnapshot(doc(db, "utenti", idAmico), (snapAmico) => {
        if (snapAmico.exists()) {
          if (!window.cacheDatiMembri) window.cacheDatiMembri = {};
          window.cacheDatiMembri[idAmico] = snapAmico.data();
        }
        renderizzaFeedDinamico();
      }, (err) => console.error("Errore ascolto amico:", err));
      
      window.chatUnsubscribers.push(unsubAmico);
    });

    renderizzaFeedDinamico();
  }, (err) => {
    console.error("Errore ascolto utente:", err);
    container.innerHTML = "<p class='text-red-400 text-center py-8'>" + __t('feedImpossibileConnettere') + "</p>";
  });

  if (!window.chatUnsubscribers) window.chatUnsubscribers = [];
  window.chatUnsubscribers.unshift(unsubIo);
}

const stoppaAscoltoChatRealTime = function() {
  if (window.chatUnsubscribers && window.chatUnsubscribers.length > 0) {
    window.chatUnsubscribers.forEach(unsub => {
      if (typeof unsub === 'function') unsub();
    });
    window.chatUnsubscribers = [];
  }
  window.cacheDatiMembri = {};
}

const inviaMessaggioChat = async function() {
  const utenteCorrenteId = window.utenteCorrenteId;
  const input = document.getElementById('input-messaggio-chat');
  if (!input) return;
  const testo = input.value.trim();
  if (!testo || !utenteCorrenteId) {
    alert(__t('alertScriviMessaggio'));
    return;
  }

  try {
    const idMessaggio = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const userRef = doc(db, "utenti", utenteCorrenteId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const userData = userSnap.data();
      if (!userData.messaggi) {
        await updateDoc(userRef, { messaggi: [] });
      }
    }

    await updateDoc(doc(db, "utenti", utenteCorrenteId), {
      messaggi: arrayUnion({
        id: idMessaggio,
        testo: testo,
        timestamp: new Date().toISOString(),
        letteDa: []
      })
    });
    
    input.value = "";
  } catch (e) {
    console.error("Errore invio messaggio: ", e);
    alert(__t('alertErroreInvioMessaggio'));
  }
}

const cancellaTuttiIMessaggi = async function() {
  const utenteCorrenteId = window.utenteCorrenteId;
  if (!utenteCorrenteId) return;

  const conferma = confirm(__t('alertCancellaTuttiMsg'));
  if (!conferma) return;

  try {
    await updateDoc(doc(db, "utenti", utenteCorrenteId), {
      messaggi: []
    });

    const cacheDatiMembri = window.cacheDatiMembri || {};
    const tuttiIdMembri = Object.keys(cacheDatiMembri);
    for (let idUtente of tuttiIdMembri) {
      if (idUtente !== utenteCorrenteId) {
        await updateDoc(doc(db, "utenti", idUtente), {
          messaggi: []
        });
      }
    }

    alert(__t('alertPiazzaPulita'));
  } catch (e) {
    console.error("Errore rimozione messaggi: ", e);
    alert(__t('alertErroreEliminazione'));
  }
}

const marcaMessaggioVisualizzato = async function(idMessaggio) {
  console.log("Marcatura automatica!");
}

const eliminaMessaggioChat = async function(idMessaggio) {
  const utenteCorrenteId = window.utenteCorrenteId;
  if (!utenteCorrenteId || !idMessaggio) return;
  if (!confirm(__t('alertEliminaMsg'))) return;
  
  try {
    const userRef = doc(db, "utenti", utenteCorrenteId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const userData = userSnap.data();
      const messaggi = userData.messaggi || [];
      const messaggiAggiornati = messaggi.filter(m => m.id !== idMessaggio);
      await updateDoc(userRef, { messaggi: messaggiAggiornati });
      alert(__t('alertMsgEliminato'));
    }
  } catch (e) {
    console.error("Errore eliminazione messaggio: ", e);
    alert(__t('alertErroreEliminazione'));
  }
}

const eliminaTuttiMessaggiChat = async function() {
  const utenteCorrenteId = window.utenteCorrenteId;
  if (!utenteCorrenteId) return;
  if (!confirm(__t('alertEliminaTuttiMsg'))) return;
  
  try {
    await updateDoc(doc(db, "utenti", utenteCorrenteId), {
      messaggi: []
    });
    alert(__t('alertTuttiMsgEliminati'));
  } catch (e) {
    console.error("Errore eliminazione messaggi: ", e);
    alert(__t('alertErroreEliminazione'));
  }
}

const marcatstantaneaTuttiMessaggi = async function() {
  alert(__t('alertMarcaturaAutomatica'));
}

const switchAmiciTab = function(tab) {
  const btnClassifica = document.getElementById('btn-tab-classifica');
  const btnFeed = document.getElementById('btn-tab-feed');
  const listaClassifica = document.getElementById('lista-amici-classifica');
  const listaFeed = document.getElementById('lista-amici-feed');
  const titoloSezione = document.getElementById('titolo-sezione-amici');
  const sottotitoloSezione = document.getElementById('sottotitolo-sezione-amici');
  
  const sezAggiungiAmico = document.getElementById('sezione-aggiungi-amico');
  const sezInviaMessaggio = document.getElementById('sezione-invia-messaggio');
  const boxCodice = document.getElementById('box-codice');
  const pannelloClassifica = document.getElementById('pannello-classifica');
  const pannelloFeed = document.getElementById('pannello-feed');

  if (!btnClassifica || !btnFeed || !listaClassifica || !listaFeed) return;

  if (tab === 'classifica') {
    btnClassifica.className = "tab-btn active text-[11px] px-3 py-2";
    btnFeed.className = "tab-btn inactive text-[11px] px-3 py-2";
    listaClassifica.classList.remove('hidden');
    listaFeed.classList.add('hidden');
    if (pannelloClassifica) pannelloClassifica.classList.remove('hidden');
    if (pannelloFeed) pannelloFeed.classList.add('hidden');
    
    if (sezAggiungiAmico) sezAggiungiAmico.classList.remove('hidden');
    if (sezInviaMessaggio) sezInviaMessaggio.classList.add('hidden');
    if (boxCodice) boxCodice.style.display = 'flex';
    
    if (titoloSezione) titoloSezione.innerText = "👥 I miei Amici";
    if (sottotitoloSezione) sottotitoloSezione.innerText = "Classifica dei punteggi";
    
    window.stoppaAscoltoChatRealTime();
    
  } else {
    btnClassifica.className = "tab-btn inactive text-[11px] px-3 py-2";
    btnFeed.className = "tab-btn active text-[11px] px-3 py-2";
    listaClassifica.classList.add('hidden');
    listaFeed.classList.remove('hidden');
    if (pannelloClassifica) pannelloClassifica.classList.add('hidden');
    if (pannelloFeed) pannelloFeed.classList.remove('hidden');
    
    if (sezAggiungiAmico) sezAggiungiAmico.classList.add('hidden');
    if (sezInviaMessaggio) sezInviaMessaggio.classList.remove('hidden');
    if (boxCodice) boxCodice.style.display = 'none';
    
    if (titoloSezione) titoloSezione.innerText = "⚡ Chat & Attività";
    if (sottotitoloSezione) sottotitoloSezione.innerText = "Messaggi e conquiste";
    
    window.avviaAscoltoChatRealTime();
  }
}

// ============================================
// CLAN FUNCTIONS
// ============================================

const switchClanTab = function(tab) {
  const btnClassifica = document.getElementById('btn-clan-tab-classifica');
  const btnFeed = document.getElementById('btn-clan-tab-feed');
  const listaClassifica = document.getElementById('lista-clan-classifica');
  const listaFeed = document.getElementById('lista-clan-feed');
  const sezioneChat = document.getElementById('sezione-invia-messaggio-clan');

  if (tab === 'classifica') {
    btnClassifica.className = "tab-btn active text-xs py-1.5 px-3.5";
    btnFeed.className = "tab-btn inactive text-xs py-1.5 px-3.5";
    listaClassifica.classList.remove('hidden');
    listaFeed.classList.add('hidden');
    sezioneChat.classList.add('hidden');
  } else {
    btnClassifica.className = "tab-btn inactive text-xs py-1.5 px-3.5";
    btnFeed.className = "tab-btn active text-xs py-1.5 px-3.5";
    listaClassifica.classList.add('hidden');
    listaFeed.classList.remove('hidden');
    sezioneChat.classList.remove('hidden');
  }
}

const inizializzaSchermataClan = async function() {
  const utenteCorrenteId = window.utenteCorrenteId;
  if (!utenteCorrenteId) return;

  try {
    const snapUtente = await getDoc(doc(db, "utenti", utenteCorrenteId));
    if (!snapUtente.exists()) return;
    
    const datiUtente = snapUtente.data();
    const idClan = datiUtente.idClan || "";
    const conteggioClan = document.getElementById('conteggio-clan');

    if (idClan === "") {
      window.idClanAttivoCorrente = "";
      document.getElementById('clan-no-clan').classList.remove('hidden');
      document.getElementById('clan-si-clan').classList.add('hidden');
      if (conteggioClan) conteggioClan.innerText = "0 utenti";
      window.caricaListaClanDisponibili();
    } else {
      window.idClanAttivoCorrente = idClan;
      document.getElementById('clan-no-clan').classList.add('hidden');
      document.getElementById('clan-si-clan').classList.remove('hidden');
      window.avviaAscoltoClanRealTime(idClan);
    }
  } catch (e) {
    console.error("Errore inizializzazione clan:", e);
  }
}

const creaNuovoClan = async function() {
  const utenteCorrenteId = window.utenteCorrenteId;
  const input = document.getElementById('input-nome-clan');
  const nome = input.value.trim();
  if (!nome || !utenteCorrenteId) {
    alert(__t('alertInserisciNomeClan'));
    return;
  }

  try {
    const nuovoClanRef = await addDoc(collection(db, "clan"), {
      nome: nome,
      creatore: utenteCorrenteId,
      membri: [utenteCorrenteId],
      messaggi: []
    });

    await updateDoc(doc(db, "utenti", utenteCorrenteId), { idClan: nuovoClanRef.id });
    input.value = "";
    alert(__t('alertClanCreato').replace('{nome}', nome));
    window.inizializzaSchermataClan();
  } catch (e) {
    console.error("Errore creazione clan:", e);
    alert(__t('alertErroreCreazioneClan'));
  }
}

const caricaListaClanDisponibili = async function() {
  const container = document.getElementById('lista-clan-disponibili');
  if (!container) return;
  container.innerHTML = "<p class='text-gray-500 text-center text-xs py-8'>" + __t('clanCaricamento') + "</p>";

  try {
    const querySnapshot = await getDocs(collection(db, "clan"));
    container.innerHTML = "";

    if (querySnapshot.empty) {
      container.innerHTML = "<p class='text-gray-500 text-center text-xs py-8'>" + __t('clanNessunAttivo') + "</p>";
      return;
    }

    querySnapshot.forEach((docClan) => {
      const clan = docClan.data();
      const idDelClan = docClan.id;
      
      const listaMembri = clan.membri || [];
      const numMembri = listaMembri.length;
      const nomeClan = clan.nome || "Clan senza nome";

      const riga = document.createElement('div');
      riga.className = "card-purple p-3 rounded-xl mb-1 flex justify-between items-center";
      
      const infoDiv = document.createElement('div');
      infoDiv.className = "flex flex-col";
      infoDiv.innerHTML = `
        <p class="text-xs font-bold text-white">${nomeClan}</p>
        <p class="text-[10px] text-gray-400">${__t('clanGiocatoriLabel')} ${numMembri}/30</p>
      `;
      riga.appendChild(infoDiv);

      const azioneDiv = document.createElement('div');
      if (numMembri < 30) {
        const btnEntra = document.createElement('button');
        btnEntra.className = "btn-purple text-[11px] px-3 py-1.5";
        btnEntra.innerText = __t('clanEntraBtn');
        
        btnEntra.addEventListener('click', () => {
          window.entraNelClan(idDelClan);
        });
        
        azioneDiv.appendChild(btnEntra);
      } else {
        azioneDiv.innerHTML = `<span class="text-red-400 text-[10px] font-bold">${__t('clanPieno')}</span>`;
      }
      riga.appendChild(azioneDiv);

      container.appendChild(riga);
    });
  } catch (e) {
    console.error("Errore nel caricamento dei clan:", e);
    container.innerHTML = "<p class='text-red-400 text-center text-xs py-8'>" + __t('clanErroreCaricamento') + "</p>";
  }
}

const entraNelClan = async function(idClan) {
  const utenteCorrenteId = window.utenteCorrenteId;
  if (!utenteCorrenteId) return;
  
  try {
    const clanRef = doc(db, "clan", idClan);
    
    await updateDoc(clanRef, {
      membri: arrayUnion(utenteCorrenteId)
    });
    
    await updateDoc(doc(db, "utenti", utenteCorrenteId), { idClan: idClan });

    alert(__t('alertEntratoClan'));
    window.inizializzaSchermataClan();
  } catch (e) {
    console.error("Errore entrata nel clan:", e);
    alert(__t('alertErroreIngressoClan'));
  }
}

const avviaAscoltoClanRealTime = function(idClan) {
  const utenteCorrenteId = window.utenteCorrenteId;
  if (window.clanUnsubscriber) {
    window.clanUnsubscriber();
    window.clanUnsubscriber = null;
  }

  window.clanUnsubscriber = onSnapshot(doc(db, "clan", idClan), async (clanSnap) => {
    if (!clanSnap.exists()) {
      await updateDoc(doc(db, "utenti", utenteCorrenteId), { idClan: "" });
      alert(__t('alertClanScioltoCapo'));
      window.inizializzaSchermataClan();
      return;
    }

    window.datiClanCorrente = clanSnap.data();
    
    const nomeDisplay = document.getElementById('clan-nome-display');
    const membriCount = document.getElementById('clan-membri-count');
    const conteggioClan = document.getElementById('conteggio-clan');
    
    if (nomeDisplay) nomeDisplay.textContent = window.datiClanCorrente.nome || __t('clanDefaultNome');
    if (membriCount) {
      const numMembri = window.datiClanCorrente.membri ? window.datiClanCorrente.membri.length : 0;
      membriCount.textContent = `${numMembri}/30 ${__t('clanMembriLabel')}`;
    }
    if (conteggioClan) {
      const numMembri = window.datiClanCorrente.membri ? window.datiClanCorrente.membri.length : 0;
      const label = numMembri === 1 ? __t('conteggioSingolare') : __t('conteggioPlurale');
      conteggioClan.innerText = `${numMembri} ${label}`;
    }

    const containerOpzioni = document.getElementById('opzioni-gestione-clan');
    if (window.datiClanCorrente.creatore === utenteCorrenteId) {
      containerOpzioni.innerHTML = `
        <button onclick="window.disciogliClan()" class="text-red-400 hover:text-red-300 font-bold text-[10px] cursor-pointer bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-md transition-colors mr-1">${__t('clanSciogliBtn')}</button>
        <button onclick="window.esciDalClan()" class="text-orange-400 hover:text-orange-300 font-bold text-[10px] cursor-pointer bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded-md transition-colors">${__t('clanEsciBtn')}</button>
      `;
    } else {
      containerOpzioni.innerHTML = `
        <button onclick="window.esciDalClan()" class="text-orange-400 hover:text-orange-300 font-bold text-[10px] cursor-pointer bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded-md transition-colors">${__t('clanEsciBtn')}</button>
      `;
    }

    let dettagliMembri = [];
    if (window.datiClanCorrente.membri) {
      for (let idMembro of window.datiClanCorrente.membri) {
        const snapM = await getDoc(doc(db, "utenti", idMembro));
        if (snapM.exists()) {
          dettagliMembri.push({ id: idMembro, ...snapM.data() });
        }
      }
    }

    renderizzaClassificaClan(dettagliMembri);
    renderizzaFeedClan(dettagliMembri);
    
    document.getElementById('sezione-invia-messaggio-clan').classList.remove('hidden');
    
  }, (error) => {
    console.error("Errore ascolto clan:", error);
  });
}

const esciDalClan = async function() {
  const utenteCorrenteId = window.utenteCorrenteId;
  const idClanAttivoCorrente = window.idClanAttivoCorrente;
  if (!utenteCorrenteId || !idClanAttivoCorrente) return;
  
  if (!confirm(__t('alertConfermaEsciClan'))) return;
  
  try {
    if (window.clanUnsubscriber) {
      window.clanUnsubscriber();
      window.clanUnsubscriber = null;
    }

    const clanRef = doc(db, "clan", idClanAttivoCorrente);
    const clanSnap = await getDoc(clanRef);
    
    if (clanSnap.exists()) {
      const datiClan = clanSnap.data();
      let membriAggiornati = datiClan.membri.filter(id => id !== utenteCorrenteId);
      
      if (datiClan.creatore === utenteCorrenteId && membriAggiornati.length > 0) {
        const nuovoCapo = membriAggiornati[0];
        await updateDoc(clanRef, {
          creatore: nuovoCapo,
          membri: membriAggiornati
        });
        alert(__t('alertComandoPassato'));
      } else {
        await updateDoc(clanRef, { membri: membriAggiornati });
      }
    }
    
    await updateDoc(doc(db, "utenti", utenteCorrenteId), { idClan: "" });
    window.idClanAttivoCorrente = "";
    
    alert(__t('alertUscitoClan'));
    window.inizializzaSchermataClan();
  } catch (e) {
    console.error("Errore uscita dal clan:", e);
    alert(__t('alertErroreUscitaClan'));
  }
}

const disciogliClan = async function() {
  const utenteCorrenteId = window.utenteCorrenteId;
  const idClanAttivoCorrente = window.idClanAttivoCorrente;
  if (!utenteCorrenteId || !idClanAttivoCorrente) return;
  
  if (!confirm(__t('alertConfermaSciogliClan'))) return;
  
  try {
    if (window.clanUnsubscriber) {
      window.clanUnsubscriber();
      window.clanUnsubscriber = null;
    }

    const clanRef = doc(db, "clan", idClanAttivoCorrente);
    const clanSnap = await getDoc(clanRef);
    
    if (clanSnap.exists()) {
      const membri = clanSnap.data().membri || [];
      for (let idMembro of membri) {
        await updateDoc(doc(db, "utenti", idMembro), { idClan: "" });
      }
    }

    await deleteDoc(clanRef);
    window.idClanAttivoCorrente = "";
    
    alert(__t('alertClanSciolto'));
    window.inizializzaSchermataClan();
  } catch (e) {
    console.error("Errore scioglimento clan:", e);
    alert(__t('alertErroreScioglimentoClan'));
  }
}

const inviaMessaggioClan = async function() {
  const utenteCorrenteId = window.utenteCorrenteId;
  const idClanAttivoCorrente = window.idClanAttivoCorrente;
  const input = document.getElementById('input-messaggio-clan');
  if (!input || !idClanAttivoCorrente || !utenteCorrenteId) return;
  
  const testo = input.value.trim();
  if (!testo) {
    alert(__t('alertScriviMsgClan'));
    return;
  }

  try {
    const snapUtente = await getDoc(doc(db, "utenti", utenteCorrenteId));
    const nomeMittente = snapUtente.data().nome || "Esploratore";
    const idMessaggio = "msg_" + Date.now() + "_" + Math.random().toString(36).substr(2, 5);

    await updateDoc(doc(db, "clan", idClanAttivoCorrente), {
      messaggi: arrayUnion({
        id: idMessaggio,
        mittenteId: utenteCorrenteId,
        mittenteNome: nomeMittente,
        testo: testo,
        timestamp: new Date().toISOString(),
        letteDa: []
      })
    });
    input.value = "";
  } catch (e) {
    console.error("Errore invio messaggio clan:", e);
    alert(__t('alertErroreInvioMessaggio'));
  }
}

const cancellaMessaggiClan = async function() {
  const idClanAttivoCorrente = window.idClanAttivoCorrente;
  if (!idClanAttivoCorrente) return;
  
  if (!confirm(__t('alertCancellaMsgClan'))) return;
  
  try {
    await updateDoc(doc(db, "clan", idClanAttivoCorrente), { messaggi: [] });
    alert(__t('alertChatSvuotata'));
  } catch (e) {
    console.error("Errore svuoto chat clan:", e);
    alert(__t('alertErroreSvuotaChat'));
  }
}

function renderizzaClassificaClan(membri) {
  const container = document.getElementById('lista-clan-classifica');
  if (!container) return;
  
  if (membri.length === 0) {
    container.innerHTML = "<p class='text-gray-500 text-center py-8 text-xs'>" + __t('clanNessunMembro') + "</p>";
    return;
  }
  
  membri.sort((a, b) => {
    const aScoperti = a.monumenti?.filter(m => m.scoperto).length || 0;
    const bScoperti = b.monumenti?.filter(m => m.scoperto).length || 0;
    return bScoperti - aScoperti;
  });

  container.innerHTML = "";
  membri.forEach((membro, index) => {
    const nScoperti = membro.monumenti?.filter(m => m.scoperto).length || 0;
    const utenteCorrenteId = window.utenteCorrenteId;
    const isMe = membro.id === utenteCorrenteId;
    const medaglia = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `${index + 1}.`;
    
    const riga = document.createElement('div');
    riga.className = `card ${isMe ? 'card-purple' : 'card'} p-2.5 rounded-lg flex justify-between items-center text-xs transition-colors`;
    
    const datiClanCorrente = window.datiClanCorrente;
    const isCapo = membro.id === datiClanCorrente?.creatore;
    
    riga.innerHTML = `
      <div class="flex items-center gap-2">
        <span class="text-gray-400 font-mono w-6">${medaglia}</span>
        <span class="${isMe ? 'text-purple-400 font-bold' : 'text-gray-200'}">
          ${isMe ? "Tu" : membro.nome || "Esploratore"}
          ${isCapo ? ' 👑' : ''}
        </span>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-green-400 font-bold">${nScoperti} 🏛️</span>
        <span class="text-xs text-gray-400">Lv.${membro.livello || 1}</span>
      </div>
    `;
    container.appendChild(riga);
  });
}

async function renderizzaFeedClan(membri) {
  const container = document.getElementById('lista-clan-feed');
  const datiClanCorrente = window.datiClanCorrente;
  const utenteCorrenteId = window.utenteCorrenteId;
  const idClanAttivoCorrente = window.idClanAttivoCorrente;
  if (!container || !datiClanCorrente) return;

  let eventiBacheca = [];

  let messaggiModificati = false;
  const messaggiControllati = (datiClanCorrente.messaggi || []).map(msg => {
    if (!msg.letteDa) msg.letteDa = [];
    if (msg.mittenteId !== utenteCorrenteId && !msg.letteDa.includes(utenteCorrenteId)) {
      msg.letteDa.push(utenteCorrenteId);
      messaggiModificati = true;
    }
    return msg;
  });

  if (messaggiModificati && idClanAttivoCorrente) {
    try {
      await updateDoc(doc(db, "clan", idClanAttivoCorrente), { messaggi: messaggiControllati });
    } catch (e) {
      console.error("Errore aggiornamento letture:", e);
    }
  }

  messaggiControllati.forEach(msg => {
    let spunteHtml = "";
    if (msg.mittenteId === utenteCorrenteId) {
      const lettoDaAltri = msg.letteDa.some(id => id !== utenteCorrenteId);
      spunteHtml = lettoDaAltri 
        ? `<span class="text-blue-400 font-bold text-[10px] ml-1 select-none">✓✓</span>` 
        : `<span class="text-gray-500 text-[10px] ml-1 select-none">✓✓</span>`;
    }

    const nomeMittente = msg.mittenteId === utenteCorrenteId ? "Tu" : (msg.mittenteNome || "Esploratore");
    eventiBacheca.push({
      timestamp: msg.timestamp || new Date().toISOString(),
      html: `💬 <strong class="${msg.mittenteId === utenteCorrenteId ? 'text-purple-400' : 'text-blue-300'}">${nomeMittente}</strong>: <span class="text-gray-100 break-words">${msg.testo}</span>${spunteHtml}`,
      tipo: 'messaggio',
      isMittente: msg.mittenteId === utenteCorrenteId
    });
  });

  eventiBacheca.sort((a, b) => a.timestamp.localeCompare(b.timestamp));

  if (eventiBacheca.length > 50) {
    eventiBacheca = eventiBacheca.slice(-50);
  }

  container.innerHTML = "";
  if (eventiBacheca.length === 0) {
    container.innerHTML = "<p class='text-gray-500 text-center py-8 text-xs'>Nessun messaggio nel Clan.</p>";
    return;
  }

  let dataCorrente = '';
  eventiBacheca.forEach(ev => {
    const data = new Date(ev.timestamp);
    const dataStr = data.toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' });
    
    if (dataStr !== dataCorrente) {
      dataCorrente = dataStr;
      const separatore = document.createElement('div');
      separatore.className = "text-[10px] text-gray-500 font-bold uppercase mt-3 mb-1.5 border-b border-white/5 pb-1";
      separatore.innerText = dataStr;
      container.appendChild(separatore);
    }
    
    const riga = document.createElement('div');
    let bgClass = 'card';
    if (ev.tipo === 'messaggio' && ev.isMittente) {
      bgClass = 'card-purple';
    } else if (ev.tipo === 'messaggio') {
      bgClass = 'card-blue';
    }
    
    riga.className = `${bgClass} p-2.5 rounded-xl text-gray-200 leading-relaxed mb-1.5 shadow-sm text-xs animate-fadeIn`;
    
    const ora = data.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
    riga.innerHTML = `<span class="text-gray-500 mr-1.5">${ora}</span> ${ev.html}`;
    container.appendChild(riga);
  });

  container.scrollTop = container.scrollHeight;
}

window.copiaCodiceAmico = copiaCodiceAmico;
window.condividiCodiceAmico = condividiCodiceAmico;
window.aggiungiAmico = aggiungiAmico;
window.rimuoviAmico = rimuoviAmico;
window.aggiornaElencoClassificaAmici = aggiornaElencoClassificaAmici;
window.avviaAscoltoChatRealTime = avviaAscoltoChatRealTime;
window.stoppaAscoltoChatRealTime = stoppaAscoltoChatRealTime;
window.inviaMessaggioChat = inviaMessaggioChat;
window.cancellaTuttiIMessaggi = cancellaTuttiIMessaggi;
window.eliminaTuttiMessaggiChat = eliminaTuttiMessaggiChat;
window.marcaIstantaneaTuttiMessaggi = marcatstantaneaTuttiMessaggi;
window.switchAmiciTab = switchAmiciTab;
window.switchClanTab = switchClanTab;
window.inizializzaSchermataClan = inizializzaSchermataClan;
window.creaNuovoClan = creaNuovoClan;
window.entraNelClan = entraNelClan;
window.esciDalClan = esciDalClan;
window.disciogliClan = disciogliClan;
window.inviaMessaggioClan = inviaMessaggioClan;
window.cancellaMessaggiClan = cancellaMessaggiClan;
window.caricaListaClanDisponibili = caricaListaClanDisponibili;
window.avviaAscoltoClanRealTime = avviaAscoltoClanRealTime;
