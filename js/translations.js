const UI_TRANSLATIONS = {
  it: {
    title: 'Venatores Brixiae - Il Gioco Esplorativo',
    loginSubtitle: 'Inizia la tua avventura urbana',
    loginEmailLabel: 'Indirizzo Email',
    loginPasswordLabel: 'Password',
    forgotPassword: 'Hai dimenticato la password?',
    loginSubmit: 'ENTRA NEL GIOCO 🚀',
    registerEmailLabel: 'Indirizzo Email',
    registerPasswordLabel: 'Password',
    registerNameLabel: 'Nome del Player',
    registerGenderLabel: 'Seleziona Genere Avatar',
    registerSubmit: 'CREA ACCOUNT 🌟',
    recoveryTitle: 'RECUPERO PASSWORD',
    recoverySubtitle: 'Inserisci la tua email per ricevere il link di reimpostazione',
    recoveryEmailLabel: "Indirizzo Email dell'account",
    recoverySubmit: 'INVIA EMAIL DI RECUPERO 📨',
    recoveryBack: 'Annulla e Torna Indietro',
    hubTitle: '⚙️ Impostazioni profilo',
    hubGeneral: '🌐 Impostazioni generali',
    hubAvatar: '🧑‍🚀 Personalizzazione avatar',
    generalTitle: '🌐 Impostazioni generali',
    languageLabel: 'Lingua',
    saveSettings: 'Salva impostazioni',
    back: 'Indietro',
    profileTitle: '🧑‍🚀 Personalizzazione avatar',
    profileBack: 'Torna al menu impostazioni',
    profileName: 'Modifica Nome',
    profileGender: 'Modifica Genere Avatar',
    profilePhoto: 'Foto Profilo',
    saveProfile: 'Salva Modifiche',
    logout: '🚪 Esci dal Gioco (Logout)',
    levelLabel: 'LIVELLO',
    wishlistTitle: '⚔️ La mia Wishlist',
    wishlistClose: '✕ CHIUDI ELENCO',
    badgeTitle: 'BADGE SBLOCCATO!',
    continueHunt: 'Continua la Caccia',
    filterAll: '🌍 Tutti',
    filterMonument: '🏛️ Monumenti',
    filterPark: '🌳 Parchi',
    filterShop: '🛒 Spesa',
    playerRole: 'Esploratore',
    loginTabAccedi: 'ACCEDI',
    loginTabRegistrati: 'REGISTRATI',
    passwordPlaceholder: 'Inserisci la tua password',
    nomePlaceholder: 'Max 12 caratteri',
    generePlaceholder: 'Scegli il tuo stile...',
    textLunghezza: 'Tra 6 e 15 caratteri',
    textMaiuscola: 'Almeno una lettera maiuscola',
    textNumero: 'Almeno un numero (0-9)',
    textSpeciale: 'Almeno un carattere speciale (!, @, #, $, ?, etc.)',
    navAmici: 'Amici',
    navClan: 'Clan',
    navMappa: 'Mappa',
    navWishlist: 'Wishlist',
    wishlistCaricamento: 'Caricamento luoghi in corso...',
    wishlistNessunLuogo: 'Nessun luogo trovato in questa categoria.',
    wishlistNessunaDesc: 'Nessuna descrizione disponibile.',
    wishlistScoperto: '✅ SCOPERTO',
    wishlistDaTrovare: '📍 DA TROVARE',
    wishlistTuttiScoperti: '🎉 Hai esplorato tutti i luoghi di Brescia! Ottimo lavoro!',
    wishlistXpGain: '+100 XP',
    wishlistConquistato: '🏁 Obiettivo Conquistato',
    wishlistCalcolo: '📍 Distanza: Calcolo in corso...',
    wishlistDistPrefix: '📍 Distanza:',
    wishlistDistUnit: 'metri',
    catMonumento: 'Monumento',
    catParco: 'Parco',
    catSupermercato: 'Supermercato',
    xpGuadagnati: '+100 XP GUADAGNATI!',
    alertEmailNotVerified: '⚠️ Il tuo indirizzo email non è ancora stato verificato! Controlla la tua casella di posta elettronica.',
    alertLoginError: '❌ Errore d\'accesso: Credenziali errate o non valide. ',
    alertRegisterError: '❌ Impossibile procedere! La password inserita non rispetta tutti i requisiti indicati in basso.',
    alertEmailSent: '📧 Ti abbiamo inviato una mail di conferma! Clicca sul link ricevuto per attivare il tuo account e poi effettua l\'accesso.',
    alertRegisterGenericError: '❌ Errore durante la registrazione: ',
    alertRecoverySent: '📨 Email di ripristino inviata con successo! Segui le istruzioni ricevute via email per impostare una nuova password.',
    alertRecoveryError: '❌ Impossibile inoltrare la richiesta di ripristino: ',
    alertCopiato: '📋 Codice copiato negli appunti! Invialo ai tuoi amici.',
    alertCondiviso: '🔗 Link stile Monopoly GO generato e copiato! Incollalo dove vuoi per condividerlo.',
    alertNoSelfFriend: '❌ Non puoi aggiungere te stesso come amico!',
    alertNoPlayerFound: '❌ Nessun giocatore trovato con questo codice. Controlla e riprova.',
    amiciAccesso: 'Accesso:',
    amiciMai: 'Mai',
    amiciSincro: 'Sincronizzazione punteggi...',
    alertFriendAdded: '🤝 Compagno aggiunto con successo!',
    alertProfileSaved: '✨ Profilo aggiornato con successo!',
    alertSettingsSaved: 'Impostazioni salvate.',
    alertLogoutConfirm: 'Vuoi davvero uscire dal gioco?',
    alertRemoveFriend: 'Sei sicuro di voler rimuovere questo amico dalla tua classifica?',
    alertNoGps: 'Questo telefono o browser non supporta la geolocalizzazione.',
    lockedTitle: 'Luogo Bloccato',
    lockedBody: 'Avvicinati a meno di 50 metri con il GPS per conquistare questo obiettivo!',
    condividiTesto: 'Unisciti alla mia squadra su Venatores Brixiae! 🎮 Usa il mio Codice Squadra per scalare la classifica insieme: ',
    alertScriviMessaggio: 'Scrivi un messaggio prima di inviare!',
    alertErroreInvioMessaggio: '❌ Errore nell\'invio del messaggio.',
    alertCancellaTuttiMsg: '⚠️ ATTENZIONE: Sei sicuro di voler cancellare TUTTI i messaggi?',
    alertPiazzaPulita: '🧹 Piazza pulita completata!',
    alertErroreEliminazione: '❌ Errore durante l\'eliminazione.',
    alertEliminaMsg: 'Eliminare questo messaggio?',
    alertMsgEliminato: '✅ Messaggio eliminato!',
    alertEliminaTuttiMsg: 'Eliminare TUTTI i tuoi messaggi?',
    alertTuttiMsgEliminati: '✅ Tutti i tuoi messaggi eliminati!',
    alertMarcaturaAutomatica: 'La marcatura è automatica!',
    alertInserisciNomeClan: 'Inserisci un nome per il clan!',
    alertClanCreato: '✅ Clan "{nome}" creato con successo!',
    alertErroreCreazioneClan: '❌ Errore durante la creazione del clan.',
    alertEntratoClan: '✅ Sei entrato nel clan con successo!',
    alertErroreIngressoClan: '❌ Errore durante l\'ingresso nel clan.',
    alertClanScioltoCapo: 'Il clan è stato sciolto dal capo.',
    alertConfermaEsciClan: 'Vuoi davvero uscire da questo Clan?',
    alertComandoPassato: '👑 Hai passato il comando a un nuovo capo!',
    alertUscitoClan: '✅ Sei uscito dal clan.',
    alertErroreUscitaClan: '❌ Errore durante l\'uscita dal clan.',
    alertConfermaSciogliClan: '🚨 ATTENZIONE CAPO SQUADRA: Vuoi sciogliere definitivamente il clan? Tutti i giocatori verranno espulsi e la chat verrà eliminata per sempre.',
    alertClanSciolto: '💥 Clan sciolto con successo!',
    alertErroreScioglimentoClan: '❌ Errore durante lo scioglimento del clan.',
    alertScriviMsgClan: 'Scrivi un messaggio!',
    alertCancellaMsgClan: '⚠️ Sei sicuro di voler cancellare TUTTI i messaggi del clan?',
    alertChatSvuotata: '🧹 Chat del clan svuotata con successo!',
    alertErroreSvuotaChat: '❌ Errore durante lo svuoto della chat.',
    badgeUnlocked: '🏅 TRAGUARDO SBLOCCATO!\nHai ottenuto il badge: {badge}\n"{desc}"',
    amiciCaricamento: 'Caricamento...',
    clanCaricamento: 'Caricamento squadre...',
    clanNessunAttivo: 'Nessun clan attivo. Fondane uno tu!',
    clanErroreCaricamento: 'Errore nel caricamento.',
    clanNessunMembro: 'Nessun membro nel clan.',
    feedNessunaAttivita: 'Ancora nessuna attività o messaggio.',
    feedConnessioneLive: 'Connessione live...',
    feedImpossibileConnettere: 'Impossibile connettersi.',
    badgeTitolo: '🏅 I TUOI TRAGUARDI',
    badgeSottotitolo: 'Esplora Brixia per sbloccare tutti i trofei tematici e personalizzare il tuo profilo.',
    badgeHint: '💡 Clicca su un badge sbloccato per impostarlo come foto profilo',
    tutorialTitolo: '📖 GUIDA RAPIDA DI GIOCO',
    tutorialSalta: 'Salta ✕',
    clanFondaTitolo: '✨ FONDA UN NUOVO CLAN',
    clanInputPlaceholder: 'Nome del tuo Clan...',
    clanCreaBtn: 'Crea',
    clanAttiviTitolo: '🌐 CLAN ATTIVI (MAX 30 MEMBRI)',
    clanTabClassifica: 'Classifica',
    clanTabBacheca: 'Bacheca',
    clanChatPlaceholder: 'Scrivi al clan...',
    clanInviaBtn: 'Invia ✉️',
    clanSvuotaBtn: '🗑️ Svuota Chat Clan',
    amiciAddLabel: '🤝 AGGIUNGI UN AMICO',
    amiciInputPlaceholder: 'Incolla il Codice Amico...',
    amiciAddBtn: 'Aggiungi',
    amiciChatPlaceholder: 'Scrivi un messaggio agli amici...',
    amiciInviaBtn: 'Invia ✉️',
    amiciSegnaBtn: '👁️ Segna tutti come letti',
    amiciSoloMieiBtn: '🗑️ Solo i miei',
    amiciPuliziaBtn: '🧹 Piazza Pulita - Elimina tutti i messaggi',
    amiciCodiceLabel: 'Il tuo Codice Amico:',
    amiciCopiaBtn: '📋 Copia',
    amiciCondividiBtn: '🔗 Condividi',
    amiciClassificaTitolo: '🏆 Classifica (Tu + Amici)',
    amiciNessunAmico: 'Nessun amico. Condividi il tuo codice!',
    amiciChatTitolo: '⚡ Chat & Attività',
    amiciNessunMsg: 'Nessun messaggio o attività da mostrare.',
    wishlistFullTitle: '📋 La mia Wishlist',
    wishlistFilterAll: '🌍 Tutti',
    wishlistFilterMonumenti: '🏛️ Monumenti',
    wishlistFilterParchi: '🌳 Parchi',
    wishlistFilterSupermercati: '🛒 Supermercati',
    tabClassifica: '◀ Classifica',
    tabChat: 'Chat ▶',
    amiciTitolo: '👥 I miei Amici',
    amiciSottotitolo: 'Classifica dei punteggi',
    clanTitolo: '🛡️ Squadre & Clan',
    clanSottotitolo: 'Unisciti o crea un clan per giocare insieme!',
    clanMembriLabel: 'membri',
    clanGiocatoriLabel: 'Giocatori:',
    conteggioSingolare: 'utente',
    conteggioPlurale: 'utenti',
    clanEntraBtn: 'Entra 🚪',
    clanPieno: '🔒 PIENO',
    clanSciogliBtn: '💥 SCIOGLI',
    clanEsciBtn: '🚪 ESCI',
    clanDefaultNome: 'Clan'
  },
  en: {
    title: 'Venatores Brixiae - The Exploratory Game',
    loginSubtitle: 'Start your urban adventure',
    loginEmailLabel: 'Email Address',
    loginPasswordLabel: 'Password',
    forgotPassword: 'Forgot your password?',
    loginSubmit: 'ENTER THE GAME 🚀',
    registerEmailLabel: 'Email Address',
    registerPasswordLabel: 'Password',
    registerNameLabel: 'Player Name',
    registerGenderLabel: 'Choose Avatar Gender',
    registerSubmit: 'CREATE ACCOUNT 🌟',
    recoveryTitle: 'PASSWORD RECOVERY',
    recoverySubtitle: 'Enter your email to receive the reset link',
    recoveryEmailLabel: 'Account email address',
    recoverySubmit: 'SEND RECOVERY EMAIL 📨',
    recoveryBack: 'Cancel and Go Back',
    hubTitle: '⚙️ Profile settings',
    hubGeneral: '🌐 General settings',
    hubAvatar: '🧑‍🚀 Avatar customization',
    generalTitle: '🌐 General settings',
    languageLabel: 'Language',
    saveSettings: 'Save settings',
    back: 'Back',
    profileTitle: '🧑‍🚀 Avatar customization',
    profileBack: 'Back to settings menu',
    profileName: 'Edit Name',
    profileGender: 'Edit Avatar Gender',
    profilePhoto: 'Profile Photo',
    saveProfile: 'Save Changes',
    logout: '🚪 Log out',
    levelLabel: 'LEVEL',
    wishlistTitle: '⚔️ My Wishlist',
    wishlistClose: '✕ CLOSE LIST',
    badgeTitle: 'BADGE UNLOCKED!',
    continueHunt: 'Continue Hunt',
    filterAll: '🌍 All',
    filterMonument: '🏛️ Monuments',
    filterPark: '🌳 Parks',
    filterShop: '🛒 Shopping',
    playerRole: 'Explorer',
    loginTabAccedi: 'LOGIN',
    loginTabRegistrati: 'SIGN UP',
    passwordPlaceholder: 'Enter your password',
    nomePlaceholder: 'Max 12 characters',
    generePlaceholder: 'Choose your style...',
    textLunghezza: 'Between 6 and 15 characters',
    textMaiuscola: 'At least one uppercase letter',
    textNumero: 'At least one number (0-9)',
    textSpeciale: 'At least one special character (!, @, #, $, ?, etc.)',
    navAmici: 'Friends',
    navClan: 'Clan',
    navMappa: 'Map',
    navWishlist: 'Wishlist',
    wishlistCaricamento: 'Loading places...',
    wishlistNessunLuogo: 'No places found in this category.',
    wishlistNessunaDesc: 'No description available.',
    wishlistScoperto: '✅ DISCOVERED',
    wishlistDaTrovare: '📍 TO FIND',
    wishlistTuttiScoperti: '🎉 You\'ve explored all of Brescia\'s places! Great job!',
    wishlistXpGain: '+100 XP',
    wishlistConquistato: '🏁 Objective Conquered',
    wishlistCalcolo: '📍 Distance: Calculating...',
    wishlistDistPrefix: '📍 Distance:',
    wishlistDistUnit: 'meters',
    catMonumento: 'Monument',
    catParco: 'Park',
    catSupermercato: 'Supermarket',
    xpGuadagnati: '+100 XP EARNED!',
    alertEmailNotVerified: '⚠️ Your email address has not been verified yet! Check your inbox.',
    alertLoginError: '❌ Login error: Invalid credentials. ',
    alertRegisterError: '❌ Cannot proceed! The password does not meet all the requirements below.',
    alertEmailSent: '📧 We sent you a confirmation email! Click the link to activate your account and then log in.',
    alertRegisterGenericError: '❌ Error during registration: ',
    alertRecoverySent: '📨 Recovery email sent successfully! Follow the instructions to reset your password.',
    alertRecoveryError: '❌ Unable to send recovery request: ',
    alertCopiato: '📋 Code copied to clipboard! Share it with your friends.',
    alertCondiviso: '🔗 Share link generated and copied! Paste it anywhere to share.',
    alertNoSelfFriend: '❌ You cannot add yourself as a friend!',
    alertNoPlayerFound: '❌ No player found with this code. Check and try again.',
    amiciAccesso: 'Last access:',
    amiciMai: 'Never',
    amiciSincro: 'Syncing scores...',
    alertFriendAdded: '🤝 Companion added successfully!',
    alertProfileSaved: '✨ Profile updated successfully!',
    alertSettingsSaved: 'Settings saved.',
    alertLogoutConfirm: 'Do you really want to log out?',
    alertRemoveFriend: 'Are you sure you want to remove this friend from your leaderboard?',
    alertNoGps: 'This device or browser does not support geolocation.',
    lockedTitle: 'Location Locked',
    lockedBody: 'Get within 50 meters using GPS to conquer this objective!',
    condividiTesto: 'Join my team on Venatores Brixiae! 🎮 Use my Team Code to climb the leaderboard together: ',
    alertScriviMessaggio: 'Write a message before sending!',
    alertErroreInvioMessaggio: '❌ Error sending message.',
    alertCancellaTuttiMsg: '⚠️ WARNING: Are you sure you want to delete ALL messages?',
    alertPiazzaPulita: '🧹 Clean sweep completed!',
    alertErroreEliminazione: '❌ Error during deletion.',
    alertEliminaMsg: 'Delete this message?',
    alertMsgEliminato: '✅ Message deleted!',
    alertEliminaTuttiMsg: 'Delete ALL your messages?',
    alertTuttiMsgEliminati: '✅ All your messages deleted!',
    alertMarcaturaAutomatica: 'Marking is automatic!',
    alertInserisciNomeClan: 'Enter a name for the clan!',
    alertClanCreato: '✅ Clan "{nome}" created successfully!',
    alertErroreCreazioneClan: '❌ Error during clan creation.',
    alertEntratoClan: '✅ You joined the clan successfully!',
    alertErroreIngressoClan: '❌ Error while joining the clan.',
    alertClanScioltoCapo: 'The clan has been disbanded by the leader.',
    alertConfermaEsciClan: 'Do you really want to leave this Clan?',
    alertComandoPassato: '👑 You passed leadership to a new leader!',
    alertUscitoClan: '✅ You left the clan.',
    alertErroreUscitaClan: '❌ Error while leaving the clan.',
    alertConfermaSciogliClan: '🚨 WARNING SQUAD LEADER: Do you want to permanently disband the clan? All players will be expelled and the chat will be deleted forever.',
    alertClanSciolto: '💥 Clan disbanded successfully!',
    alertErroreScioglimentoClan: '❌ Error during clan disbandment.',
    alertScriviMsgClan: 'Write a message!',
    alertCancellaMsgClan: '⚠️ Are you sure you want to delete ALL clan messages?',
    alertChatSvuotata: '🧹 Clan chat cleared successfully!',
    alertErroreSvuotaChat: '❌ Error while clearing chat.',
    badgeUnlocked: '🏅 ACHIEVEMENT UNLOCKED!\nYou earned the badge: {badge}\n"{desc}"',
    amiciCaricamento: 'Loading...',
    clanCaricamento: 'Loading squads...',
    clanNessunAttivo: 'No active clans. Found one yourself!',
    clanErroreCaricamento: 'Error loading.',
    clanNessunMembro: 'No members in the clan.',
    feedNessunaAttivita: 'No activity or messages yet.',
    feedConnessioneLive: 'Live connection...',
    feedImpossibileConnettere: 'Unable to connect.',
    badgeTitolo: '🏅 YOUR ACHIEVEMENTS',
    badgeSottotitolo: 'Explore Brixia to unlock all themed trophies and customize your profile.',
    badgeHint: '💡 Click on an unlocked badge to set it as profile picture',
    tutorialTitolo: '📖 QUICK GAME GUIDE',
    tutorialSalta: 'Skip ✕',
    clanFondaTitolo: '✨ FOUND A NEW CLAN',
    clanInputPlaceholder: 'Your Clan name...',
    clanCreaBtn: 'Create',
    clanAttiviTitolo: '🌐 ACTIVE CLANS (MAX 30 MEMBERS)',
    clanTabClassifica: 'Leaderboard',
    clanTabBacheca: 'Notice Board',
    clanChatPlaceholder: 'Write to clan...',
    clanInviaBtn: 'Send ✉️',
    clanSvuotaBtn: '🗑️ Clear Clan Chat',
    amiciAddLabel: '🤝 ADD A FRIEND',
    amiciInputPlaceholder: 'Paste the Friend Code...',
    amiciAddBtn: 'Add',
    amiciChatPlaceholder: 'Write a message to friends...',
    amiciInviaBtn: 'Send ✉️',
    amiciSegnaBtn: '👁️ Mark all as read',
    amiciSoloMieiBtn: '🗑️ Only mine',
    amiciPuliziaBtn: '🧹 Clean Sweep - Delete all messages',
    amiciCodiceLabel: 'Your Friend Code:',
    amiciCopiaBtn: '📋 Copy',
    amiciCondividiBtn: '🔗 Share',
    amiciClassificaTitolo: '🏆 Leaderboard (You + Friends)',
    amiciNessunAmico: 'No friends. Share your code!',
    amiciChatTitolo: '⚡ Chat & Activity',
    amiciNessunMsg: 'No messages or activities to show.',
    wishlistFullTitle: '📋 My Wishlist',
    wishlistFilterAll: '🌍 All',
    wishlistFilterMonumenti: '🏛️ Monuments',
    wishlistFilterParchi: '🌳 Parks',
    wishlistFilterSupermercati: '🛒 Supermarkets',
    tabClassifica: '◀ Leaderboard',
    tabChat: 'Chat ▶',
    amiciTitolo: '👥 My Friends',
    amiciSottotitolo: 'Score leaderboard',
    clanTitolo: '🛡️ Squads & Clan',
    clanSottotitolo: 'Join or create a clan to play together!',
    clanMembriLabel: 'members',
    clanGiocatoriLabel: 'Players:',
    conteggioSingolare: 'user',
    conteggioPlurale: 'users',
    clanEntraBtn: 'Join 🚪',
    clanPieno: '🔒 FULL',
    clanSciogliBtn: '💥 DISBAND',
    clanEsciBtn: '🚪 LEAVE',
    clanDefaultNome: 'Clan'
  }
};

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = value;
}

function setHtml(id, value) {
  const element = document.getElementById(id);
  if (element) element.innerHTML = value;
}

function setPlaceholder(id, value) {
  const element = document.getElementById(id);
  if (element) element.placeholder = value;
}

function getAvatarMarkup(fotoUrl, genere) {
  if (fotoUrl) {
    return `<img src="${fotoUrl}" class="w-full h-full object-cover">`;
  }
  const emoji = genere === 'Esploratore' ? '🧑‍🚀' : '👩‍🚀';
  return `<span class="text-xl">${emoji}</span>`;
}

function aggiornaAvatarUI(fotoUrl, genere) {
  const avatarContainer = document.getElementById('avatar-login-bar');
  if (avatarContainer) {
    avatarContainer.innerHTML = getAvatarMarkup(fotoUrl, genere);
  }
  const preview = document.getElementById('edit-avatar-preview');
  if (preview) {
    preview.innerHTML = getAvatarMarkup(fotoUrl, genere);
  }
}

function getPlayerRoleLabel(lang) {
  return (UI_TRANSLATIONS[lang] || UI_TRANSLATIONS.it).playerRole;
}

function refreshLocalizedGameplay() {
  if (typeof aggiornaMappaELista === 'function' && typeof map !== 'undefined' && map) {
    aggiornaMappaELista();
  }
}

let linguaCorrente = localStorage.getItem('preferredLanguage') || 'it';

function applyLanguage(lang) {
  const translations = UI_TRANSLATIONS[lang] || UI_TRANSLATIONS.it;
  linguaCorrente = lang;
  window.linguaCorrente = lang;
  localStorage.setItem('preferredLanguage', lang);
  document.documentElement.lang = lang;
  document.title = translations.title;

  setText('login-subtitle', translations.loginSubtitle);
  setText('login-accedi-email-label', translations.loginEmailLabel);
  setText('login-accedi-password-label', translations.loginPasswordLabel);
  setText('login-forgot-password', translations.forgotPassword);
  setText('login-submit-btn', translations.loginSubmit);
  setText('tab-accedi', translations.loginTabAccedi);
  setText('tab-registrati', translations.loginTabRegistrati);
  setText('register-email-label', translations.registerEmailLabel);
  setText('register-password-label', translations.registerPasswordLabel);
  setText('register-name-label', translations.registerNameLabel);
  setText('register-gender-label', translations.registerGenderLabel);
  setText('register-submit-btn', translations.registerSubmit);
  setPlaceholder('login-password', translations.passwordPlaceholder);
  setPlaceholder('login-nome', translations.nomePlaceholder);
  const generePlaceholder = document.getElementById('genere-placeholder') || document.querySelector('#login-genere option[value=""]');
  if (generePlaceholder) generePlaceholder.textContent = translations.generePlaceholder;
  setText('recovery-title', translations.recoveryTitle);
  setText('recovery-subtitle', translations.recoverySubtitle);
  setText('recovery-email-label', translations.recoveryEmailLabel);
  setText('recovery-submit-btn', translations.recoverySubmit);
  setText('recovery-back-btn', translations.recoveryBack);
  setText('hub-title', translations.hubTitle);
  setHtml('hub-general-btn', translations.hubGeneral);
  setHtml('hub-avatar-btn', translations.hubAvatar);
  setText('general-title', translations.generalTitle);
  setText('general-language-label', translations.languageLabel);
  setText('btn-salva-impostazioni-generali', translations.saveSettings);
  setText('general-back-btn', translations.back);
  setText('profile-title', translations.profileTitle);
  setText('profile-back-btn', translations.profileBack);
  setText('profile-name-label', translations.profileName);
  setText('profile-gender-label', translations.profileGender);
  setText('profile-photo-label', translations.profilePhoto);
  setText('btn-salva-profilo', translations.saveProfile);
  setText('level-label', translations.levelLabel);
  setText('wishlist-title', translations.wishlistTitle);
  setText('wishlist-close-btn', translations.wishlistClose);
  setText('popup-badge-title', translations.badgeTitle);
  setText('popup-continue-btn', translations.continueHunt);
  setText('popup-xp-gained', translations.xpGuadagnati);
  setHtml('btn-filtro-tutti', translations.filterAll);
  setHtml('btn-filtro-monumento', translations.filterMonument);
  setHtml('btn-filtro-parco', translations.filterPark);
  setHtml('btn-filtro-supermercato', translations.filterShop);

  const navLabels = document.querySelectorAll('#bottom-nav .nav-label');
  const navTexts = [translations.navAmici, translations.navClan, translations.navMappa, translations.navWishlist];
  navLabels.forEach((el, i) => { if (navTexts[i]) el.textContent = navTexts[i]; });

  if (document.getElementById('login-bar-role')) {
    setText('login-bar-role', getPlayerRoleLabel(lang));
  }

  setText('badge-titolo', translations.badgeTitolo);
  setText('badge-sottotitolo', translations.badgeSottotitolo);
  setText('badge-hint', translations.badgeHint);

  setText('tutorial-titolo', translations.tutorialTitolo);
  setText('tutorial-salta', translations.tutorialSalta);

  setText('titolo-sezione-clan', translations.clanTitolo);
  setText('sottotitolo-sezione-clan', translations.clanSottotitolo);
  setText('clan-fonda-titolo', translations.clanFondaTitolo);
  setPlaceholder('input-nome-clan', translations.clanInputPlaceholder);
  setText('clan-crea-btn', translations.clanCreaBtn);
  setText('clan-attivi-titolo', translations.clanAttiviTitolo);
  setText('btn-clan-tab-classifica', translations.clanTabClassifica);
  setText('btn-clan-tab-feed', translations.clanTabBacheca);
  setPlaceholder('input-messaggio-clan', translations.clanChatPlaceholder);
  setText('clan-invia-btn', translations.clanInviaBtn);
  setText('clan-svuota-btn', translations.clanSvuotaBtn);

  setText('titolo-sezione-amici', translations.amiciTitolo);
  setText('sottotitolo-sezione-amici', translations.amiciSottotitolo);
  setText('btn-tab-classifica', translations.tabClassifica);
  setText('btn-tab-feed', translations.tabChat);
  setText('amici-add-label', translations.amiciAddLabel);
  setPlaceholder('input-codice-amico', translations.amiciInputPlaceholder);
  setText('amici-add-btn', translations.amiciAddBtn);
  setPlaceholder('input-messaggio-chat', translations.amiciChatPlaceholder);
  setText('amici-invia-btn', translations.amiciInviaBtn);
  setText('amici-segna-btn', translations.amiciSegnaBtn);
  setText('amici-solo-miei-btn', translations.amiciSoloMieiBtn);
  setText('amici-pulizia-btn', translations.amiciPuliziaBtn);
  setText('amici-codice-label', translations.amiciCodiceLabel);
  setText('amici-copia-btn', translations.amiciCopiaBtn);
  setText('amici-condividi-btn', translations.amiciCondividiBtn);
  setText('amici-classifica-titolo', translations.amiciClassificaTitolo);
  setText('amici-nessun-amico', translations.amiciNessunAmico);
  setText('amici-chat-titolo', translations.amiciChatTitolo);
  setText('amici-nessun-msg', translations.amiciNessunMsg);
  setText('mio-codice-txt', translations.amiciCaricamento);

  setText('wishlist-full-title', translations.wishlistFullTitle);
  setText('wishlist-filter-all', translations.wishlistFilterAll);
  setText('wishlist-filter-monumenti', translations.wishlistFilterMonumenti);
  setText('wishlist-filter-parchi', translations.wishlistFilterParchi);
  setText('wishlist-filter-supermercati', translations.wishlistFilterSupermercati);

  refreshLocalizedGameplay();
}

function mostraSoloPopup(apriId) {
  ['popup-impostazioni-hub', 'popup-impostazioni-generali', 'popup-profilo', 'modal-badge'].forEach((id) => {
    const elemento = document.getElementById(id);
    if (elemento) elemento.classList.add('hidden');
  });
  const target = document.getElementById(apriId);
  if (target) target.classList.remove('hidden');
}

function __t(key) {
  const lang = window.linguaCorrente || 'it';
  const tr = (UI_TRANSLATIONS[lang] || UI_TRANSLATIONS.it);
  return tr[key] !== undefined ? tr[key] : key;
}

window.__t = __t;

export { UI_TRANSLATIONS, setText, setHtml, setPlaceholder, getAvatarMarkup, aggiornaAvatarUI, getPlayerRoleLabel, refreshLocalizedGameplay, linguaCorrente, applyLanguage, mostraSoloPopup, __t };
