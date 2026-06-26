import { auth, db, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail, signOut, doc, setDoc, getDoc, updateDoc } from './firebase.js';
import { applyLanguage, __t, aggiornaAvatarUI, getPlayerRoleLabel, linguaCorrente, mostraSoloPopup } from './translations.js';

let utenteCorrenteId = null;
let datiUtenteLocale = null;
let isAuthProcessing = false;
let fotoProfiloLocale = null;

let chatUnsubscribers = [];
let cacheDatiMembri = {};
let clanUnsubscriber = null;
let datiClanCorrente = null;
let idClanAttivoCorrente = "";

export { utenteCorrenteId, datiUtenteLocale, isAuthProcessing, fotoProfiloLocale, chatUnsubscribers, cacheDatiMembri, clanUnsubscriber, datiClanCorrente, idClanAttivoCorrente };

function syncAuthState() {
  window.utenteCorrenteId = utenteCorrenteId;
  window.datiUtenteLocale = datiUtenteLocale;
  window.isAuthProcessing = isAuthProcessing;
  window.fotoProfiloLocale = fotoProfiloLocale;
  window.chatUnsubscribers = chatUnsubscribers;
  window.cacheDatiMembri = cacheDatiMembri;
  window.clanUnsubscriber = clanUnsubscriber;
  window.datiClanCorrente = datiClanCorrente;
  window.idClanAttivoCorrente = idClanAttivoCorrente;
}
syncAuthState();

const apriPopupHubImpostazioni = function() {
  mostraSoloPopup('popup-impostazioni-hub');
}

const chiudiPopupHubImpostazioni = function() {
  const popup = document.getElementById('popup-impostazioni-hub');
  if (popup) popup.classList.add('hidden');
}

const apriPopupImpostazioniGenerali = function() {
  const select = document.getElementById('general-language-select');
  if (select) select.value = window.linguaCorrente || linguaCorrente;
  mostraSoloPopup('popup-impostazioni-generali');
}

const apriPopupAvatarCustomization = function() {
  if (datiUtenteLocale) {
    const nome = document.getElementById('edit-nome');
    const genere = document.getElementById('edit-genere');
    if (nome) nome.value = datiUtenteLocale.nome || '';
    if (genere) genere.value = datiUtenteLocale.genere || 'Esploratore';
    fotoProfiloLocale = datiUtenteLocale.fotoProfilo || null;
    aggiornaAvatarUI(fotoProfiloLocale, datiUtenteLocale.genere || 'Esploratore');
  }
  mostraSoloPopup('popup-profilo');
}

const apriPopupProfilo = apriPopupAvatarCustomization;

const ritornaAlMenuImpostazioni = function() {
  mostraSoloPopup('popup-impostazioni-hub');
}

const chiudiPopupProfilo = function() {
  const popup = document.getElementById('popup-profilo');
  if (popup) popup.classList.add('hidden');
}

const salvaImpostazioniGenerali = function() {
  const select = document.getElementById('general-language-select');
  const linguaSelezionata = select ? select.value : (window.linguaCorrente || linguaCorrente);
  applyLanguage(linguaSelezionata);
  alert(__t('alertSettingsSaved'));
}

const inputFotoProfilo = document.getElementById('edit-foto-file');
if (inputFotoProfilo) {
  inputFotoProfilo.addEventListener('change', async (event) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      fotoProfiloLocale = reader.result;
      aggiornaAvatarUI(fotoProfiloLocale, document.getElementById('edit-genere')?.value || 'Esploratore');
    };
    reader.readAsDataURL(file);
  });
}

const gestisciAccedi = async function(event) {
  event.preventDefault();
  if (isAuthProcessing) return;
  isAuthProcessing = true;

  const email = document.getElementById('accedi-email').value.trim();
  const password = document.getElementById('accedi-password').value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    alert(__t('alertLoginError') + error.message);
  }
  isAuthProcessing = false;
}

const gestisciRegistrazione = async function(event) {
  event.preventDefault();
  if (isAuthProcessing) return;

  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  const nome = document.getElementById('login-nome').value.trim();
  const genere = document.getElementById('login-genere').value;

  const regexPassword = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{6,15}$/;

  if (!regexPassword.test(password)) {
    alert(__t('alertRegisterError'));
    return;
  }

  isAuthProcessing = true;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await sendEmailVerification(user);

    const statoMonumenti = (typeof monumenti !== 'undefined') ? monumenti.map(m => ({ nome: m.nome, scoperto: false })) : [];
    await setDoc(doc(db, "utenti", user.uid), {
      nome: nome,
      genere: genere,
      xp: 0,
      livello: 1,
      monumenti: statoMonumenti,
      fotoProfilo: null,
      amici: [],
      messaggi: [],
      idClan: "",
      tutorialVisto: false,
      status: "online",
      ultimoAccesso: new Date().toISOString()
    });

    alert(__t('alertEmailSent'));
    await auth.signOut();
    window.location.reload();
  } catch (error) {
    alert(__t('alertRegisterGenericError') + error.message);
    isAuthProcessing = false;
  }
}

const gestisciRecupero = async function(event) {
  event.preventDefault();
  const email = document.getElementById('recupero-email').value.trim();

  try {
    await sendPasswordResetEmail(auth, email);
    alert(__t('alertRecoverySent'));
    window.tornaAlLogin();
  } catch (error) {
    alert(__t('alertRecoveryError') + error.message);
  }
}

let caricamentoInCorso = false;

async function caricaEAvviaGioco(user) {
  if (caricamentoInCorso) return;
  caricamentoInCorso = true;

  try {
    utenteCorrenteId = user.uid;
    localStorage.setItem('giocatoreEmail', user.email);
    document.getElementById('mio-codice-txt').innerText = user.uid;

    const timestampCorrente = new Date().toISOString();
    const userRef = doc(db, "utenti", user.uid);
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      await updateDoc(userRef, {
        status: "online",
        ultimoAccesso: timestampCorrente
      });
      datiUtenteLocale = docSnap.data();
      datiUtenteLocale.amici = datiUtenteLocale.amici || [];
      datiUtenteLocale.messaggi = datiUtenteLocale.messaggi || [];
      datiUtenteLocale.idClan = datiUtenteLocale.idClan || "";
      datiUtenteLocale.tutorialVisto = datiUtenteLocale.tutorialVisto || false;
      fotoProfiloLocale = datiUtenteLocale.fotoProfilo || null;
      syncAuthState();
      window.entraNelGioco(datiUtenteLocale.nome, datiUtenteLocale.genere, datiUtenteLocale.xp, datiUtenteLocale.livello, datiUtenteLocale.monumenti);
      window.controllaMostraTutorial();
    } else {
      const statoMonumenti = (typeof monumenti !== 'undefined') ? monumenti.map(m => ({ nome: m.nome, scoperto: false })) : [];
      datiUtenteLocale = {
        nome: "Esploratore",
        genere: "Esploratore",
        xp: 0,
        livello: 1,
        monumenti: statoMonumenti,
        fotoProfilo: null,
        amici: [],
        messaggi: [],
        idClan: "",
        tutorialVisto: false,
        status: "online",
        ultimoAccesso: timestampCorrente
      };
      await setDoc(userRef, datiUtenteLocale);
      fotoProfiloLocale = null;
      syncAuthState();
      window.entraNelGioco("Esploratore", "Esploratore", 0, 1, statoMonumenti);
      window.controllaMostraTutorial();
    }
  } finally {
    caricamentoInCorso = false;
    isAuthProcessing = false;
  }
}

const eseguiLogout = async function() {
  if (!confirm(__t('alertLogoutConfirm'))) return;
  try {
    window.stoppaAscoltoChatRealTime();
    if (clanUnsubscriber) {
      clanUnsubscriber();
      clanUnsubscriber = null;
    }
    syncAuthState();
    if (utenteCorrenteId) {
      await updateDoc(doc(db, "utenti", utenteCorrenteId), { status: "offline" });
    }
    await signOut(auth);
    window.location.reload();
  } catch (e) {
    console.error(e);
  }
}

const salvaModificheProfilo = async function() {
  const nuovoNome = document.getElementById('edit-nome').value.trim();
  const nuovoGenere = document.getElementById('edit-genere').value;
  if (!nuovoNome) return;

  const fotoProfiloDaSalvare = fotoProfiloLocale !== null ? fotoProfiloLocale : (datiUtenteLocale && datiUtenteLocale.fotoProfilo) ? datiUtenteLocale.fotoProfilo : null;

  try {
    await updateDoc(doc(db, "utenti", utenteCorrenteId), {
      nome: nuovoNome,
      genere: nuovoGenere,
      fotoProfilo: fotoProfiloDaSalvare
    });
    datiUtenteLocale = {
      ...(datiUtenteLocale || {}),
      nome: nuovoNome,
      genere: nuovoGenere,
      fotoProfilo: fotoProfiloDaSalvare
    };
    syncAuthState();
    aggiornaAvatarUI(fotoProfiloDaSalvare, nuovoGenere);
    document.getElementById('login-bar-name').innerText = nuovoNome;
    document.getElementById('login-bar-role').innerText = getPlayerRoleLabel(window.linguaCorrente || linguaCorrente);
    alert(__t('alertProfileSaved'));
    window.chiudiPopupProfilo();
  } catch (e) {
    console.error(e);
  }
}

const salvaProgressoSuCloud = async function(xp, livello, listaMonumenti) {
  if (!utenteCorrenteId) return;
  try {
    const statoMonumenti = listaMonumenti.map(m => ({ nome: m.nome, scoperto: m.scoperto || false }));
    await updateDoc(doc(db, "utenti", utenteCorrenteId), {
      xp: xp,
      livello: livello,
      monumenti: statoMonumenti
    });
  } catch (e) {
    console.error("Errore salvataggio cloud: ", e);
  }
}

const entraNelGioco = function(nome, genere, xp, livello, datiMonumenti) {
  document.getElementById('schermata-login').classList.add('hidden');
  document.getElementById('schermata-recupero').classList.add('hidden');

  document.getElementById('login-bar').classList.add('visible');
  document.getElementById('login-bar-name').innerText = nome;
  document.getElementById('login-bar-role').innerText = getPlayerRoleLabel(window.linguaCorrente || linguaCorrente);
  document.getElementById('login-bar-level').innerText = `Lv.${livello}`;
  document.getElementById('login-bar-xp').innerText = `${xp} XP`;
  
  aggiornaAvatarUI(fotoProfiloLocale || (datiUtenteLocale && datiUtenteLocale.fotoProfilo) || null, genere);

  if (typeof monumenti !== 'undefined' && datiMonumenti) {
    monumenti.forEach(m => {
      const salvato = datiMonumenti.find(s => s.nome === m.nome);
      if (salvato) m.scoperto = salvato.scoperto;
    });
  }

  if (typeof initGioco === 'function') {
    initGioco();
  }

  if (datiUtenteLocale) {
    aggiornaAvatarUI(datiUtenteLocale.fotoProfilo || fotoProfiloLocale || null, datiUtenteLocale.genere || genere);
  }
  
  document.getElementById('bottom-nav').classList.remove('hidden');
  
  window.apriSchermata('mappa');
}

window.apriPopupHubImpostazioni = apriPopupHubImpostazioni;
window.chiudiPopupHubImpostazioni = chiudiPopupHubImpostazioni;
window.apriPopupImpostazioniGenerali = apriPopupImpostazioniGenerali;
window.apriPopupAvatarCustomization = apriPopupAvatarCustomization;
window.apriPopupProfilo = apriPopupProfilo;
window.ritornaAlMenuImpostazioni = ritornaAlMenuImpostazioni;
window.chiudiPopupProfilo = chiudiPopupProfilo;
window.salvaImpostazioniGenerali = salvaImpostazioniGenerali;
window.gestisciAccedi = gestisciAccedi;
window.gestisciRegistrazione = gestisciRegistrazione;
window.gestisciRecupero = gestisciRecupero;
window.caricaEAvviaGioco = caricaEAvviaGioco;
window.eseguiLogout = eseguiLogout;
window.salvaModificheProfilo = salvaModificheProfilo;
window.salvaProgressoSuCloud = salvaProgressoSuCloud;
window.entraNelGioco = entraNelGioco;

