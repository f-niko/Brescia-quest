import { __t } from './translations.js';

window.apriSchermata = function(tipo) {
  document.getElementById('schermata-amici').classList.add('hidden');
  document.getElementById('schermata-wishlist').classList.add('hidden');
  document.getElementById('schermata-clan').classList.add('hidden');
  
  const loginBar = document.getElementById('login-bar');
  const mapContainer = document.getElementById('map-container');
  
  if (tipo === 'mappa') {
    loginBar.classList.add('visible');
    mapContainer.classList.add('with-login-bar');
    document.getElementById('filtri-nav').classList.remove('hidden');
    if (typeof map !== 'undefined' && map && typeof map.invalidateSize === 'function') {
      setTimeout(() => { map.invalidateSize(); }, 100);
    }
  } else {
    loginBar.classList.remove('visible');
    mapContainer.classList.remove('with-login-bar');
    document.getElementById('filtri-nav').classList.add('hidden');
  }
  
  const bottoniNav = document.querySelectorAll("#bottom-nav button");
  bottoniNav.forEach(btn => {
    btn.className = '';
    btn.classList.add('flex', 'flex-col', 'items-center', 'justify-center', 'p-2', 'rounded-xl', 'transition-all', 'bg-transparent', 'border-none', 'cursor-pointer', 'relative', 'min-w-[56px]');
  });

  if (tipo === 'mappa') {
    document.getElementById('nav-mappa').classList.add('active-mappa');
  } else if (tipo === 'amici') {
    document.getElementById('nav-amici').classList.add('active-amici');
    document.getElementById('schermata-amici').classList.remove('hidden');
    if (typeof window.aggiornaElencoClassificaAmici === 'function') {
      window.aggiornaElencoClassificaAmici();
    }
    const feedPanel = document.getElementById('pannello-feed');
    if (feedPanel && !feedPanel.classList.contains('hidden')) {
      if (typeof window.avviaAscoltoChatRealTime === 'function') {
        window.avviaAscoltoChatRealTime();
      }
    }
  } else if (tipo === 'clan') {
    document.getElementById('nav-clan').classList.add('active-clan');
    document.getElementById('schermata-clan').classList.remove('hidden');
    if (typeof window.inizializzaSchermataClan === 'function') {
      window.inizializzaSchermataClan();
    }
  } else if (tipo === 'wishlist') {
    document.getElementById('nav-wishlist').classList.add('active-wishlist');
    document.getElementById('schermata-wishlist').classList.remove('hidden');
    document.getElementById('filtro-wishlist').value = 'tutti';
    if (typeof window.aggiornaWishlistFull === 'function') {
      window.aggiornaWishlistFull('tutti');
    }
  }
}

window.filtraCategoria = function(categoria) {
  if (typeof window.aggiornaMappaELista === 'function') {
    window.aggiornaMappaELista(categoria);
  }
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.remove('active', 'bg-yellow-400/20', 'border-yellow-400/30');
    btn.classList.add('bg-white/5', 'border-transparent');
  });
  const btnMap = {
    'tutti': 'btn-filtro-tutti',
    'monumento': 'btn-filtro-monumento',
    'parco': 'btn-filtro-parco',
    'supermercato': 'btn-filtro-supermercato'
  };
  const activeBtn = document.getElementById(btnMap[categoria]);
  if (activeBtn) {
    activeBtn.classList.add('active', 'bg-yellow-400/20', 'border-yellow-400/30');
    activeBtn.classList.remove('bg-white/5', 'border-transparent');
  }
}

window.chiudiPopupScoperta = function() {
  document.getElementById('popup-scoperta').classList.add('hidden');
  if (typeof window.chiudiPopup === 'function') {
    window.chiudiPopup();
  }
}

window.toggleWishlist = function() {
  const sidebar = document.getElementById('wishlist-sidebar');
  if (sidebar) sidebar.classList.toggle('translate-x-full');
}

window.filtraWishlist = function(categoria) {
  if (typeof window.aggiornaWishlistFull === 'function') {
    window.aggiornaWishlistFull(categoria);
  }
}

window.aggiornaWishlistFull = function(categoriaFiltro = 'tutti') {
  const container = document.getElementById('lista-monumenti-full');
  if (!container) return;
  
  if (typeof monumenti === 'undefined') {
    container.innerHTML = "<p class='text-gray-400 text-xs text-center py-8 animate-pulse'>" + __t('wishlistCaricamento') + "</p>";
    return;
  }

  let monumentiFiltrati = monumenti;
  if (categoriaFiltro !== 'tutti') {
    monumentiFiltrati = monumenti.filter(m => m.categoria === categoriaFiltro);
  }
  
  if (monumentiFiltrati.length === 0) {
    container.innerHTML = "<p class='text-gray-400 text-xs text-center py-8'>" + __t('wishlistNessunLuogo') + "</p>";
    return;
  }

  container.innerHTML = "";
  monumentiFiltrati.forEach(m => {
    const item = document.createElement('div');
    const safeId = m.nome.replace(/[^a-zA-Z0-9]/g, '-');
    item.id = `monumento-full-${safeId}`;
    const isScoperto = m.scoperto || false;
    item.className = `card ${isScoperto ? 'card-green' : 'card'} flex justify-between items-center p-4 rounded-xl transition-all`;
    
    item.innerHTML = `
      <div class="flex-1 pr-2">
        <p class="font-bold text-sm ${isScoperto ? 'text-green-400' : 'text-gray-200'}">${m.nome}</p>
        <p class="text-[10px] text-gray-400 mt-0.5">${m.desc}</p>
        <p class="text-xs text-gray-400 font-mono label-distanza-full mt-1">${isScoperto ? __t('wishlistConquistato') : __t('wishlistCalcolo')}</p>
      </div>
      <div class="badge-xp shrink-0">
        ${isScoperto ? '✅' : __t('wishlistXpGain')}
      </div>
    `;
    container.appendChild(item);
  });
}

window.mostraListaWishlistInSchermata = function() {
  const contenitore = document.getElementById("lista-monumenti");
  if (!contenitore || typeof monumenti === 'undefined') return;

  contenitore.innerHTML = "";

  monumenti.forEach(m => {
    const giaScoperto = m.scoperto || false;
    const item = document.createElement("div");
    item.className = `card ${giaScoperto ? 'card-green' : 'card'} p-4 rounded-xl flex flex-col gap-3 transition-all`;
    
    let iconaCat = m.categoria === 'monumento' ? '🏛️' : (m.categoria === 'parco' ? '🌳' : '🛒');
    let descrizioneLuogo = m.desc ? m.desc : __t('wishlistNessunaDesc');
    let categoriaLabel = m.categoria === 'monumento' ? __t('catMonumento') : (m.categoria === 'parco' ? __t('catParco') : __t('catSupermercato'));

    item.innerHTML = `
      <div class="flex justify-between items-start">
        <div class="flex items-start gap-3 flex-1">
          <span class="text-xl">${iconaCat}</span>
          <div class="flex-1">
            <p class="font-bold text-sm ${giaScoperto ? 'text-green-400' : 'text-gray-200'}">${m.nome}</p>
            <p class="text-[10px] text-gray-500">${categoriaLabel}</p>
          </div>
        </div>
      </div>
      <div class="text-[10px] text-gray-300 px-3 py-2 bg-white/5 rounded-xl border border-white/5">
        ${descrizioneLuogo}
      </div>
      <div class="flex justify-between items-center pt-1">
        <p class="text-[10px] text-gray-500 font-mono">
          ${giaScoperto ? __t('wishlistScoperto') : __t('wishlistDaTrovare')}
        </p>
        <span class="badge-xp">
          ${giaScoperto ? '✓' : __t('wishlistXpGain')}
        </span>
      </div>
    `;
    contenitore.appendChild(item);
  });
}

function validaPasswordInTempoReale() {
  const password = document.getElementById('login-password').value;
  const reqLunghezza = document.getElementById('req-lunghezza');
  const iconLunghezza = document.getElementById('icon-lunghezza');
  const reqMaiuscola = document.getElementById('req-maiuscola');
  const iconMaiuscola = document.getElementById('icon-maiuscola');
  const reqNumero = document.getElementById('req-numero');
  const iconNumero = document.getElementById('icon-numero');
  const reqSpeciale = document.getElementById('req-speciale');
  const iconSpeciale = document.getElementById('icon-speciale');

  const vLunghezza = password.length >= 6 && password.length <= 15;
  const vMaiuscola = /[A-Z]/.test(password);
  const vNumero = /\d/.test(password);
  const vSpeciale = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  const updateReq = (el, icon, valid) => {
    el.className = `${valid ? 'text-green-400' : 'text-red-400'} flex items-center gap-2 transition-colors duration-200`;
    icon.innerText = valid ? '✓' : '✕';
  };

  updateReq(reqLunghezza, iconLunghezza, vLunghezza);
  updateReq(reqMaiuscola, iconMaiuscola, vMaiuscola);
  updateReq(reqNumero, iconNumero, vNumero);
  updateReq(reqSpeciale, iconSpeciale, vSpeciale);
}

function switchAuthTab(tab) {
  const formAccedi = document.getElementById('form-accedi');
  const formRegistrati = document.getElementById('form-registrati');
  const btnAccedi = document.getElementById('tab-accedi');
  const btnRegistrati = document.getElementById('tab-registrati');

  if (tab === 'accedi') {
    formAccedi.className = "text-left space-y-4";
    formRegistrati.className = "text-left space-y-4 hidden";
    btnAccedi.className = "tab-btn active flex-1";
    btnRegistrati.className = "tab-btn inactive flex-1";
  } else {
    formAccedi.className = "text-left space-y-4 hidden";
    formRegistrati.className = "text-left space-y-4";
    btnAccedi.className = "tab-btn inactive flex-1";
    btnRegistrati.className = "tab-btn active flex-1";
  }
}

function mostraRecuperoPassword() {
  document.getElementById('schermata-login').classList.add('hidden');
  document.getElementById('schermata-recupero').classList.remove('hidden');
}

function tornaAlLogin() {
  document.getElementById('schermata-recupero').classList.add('hidden');
  document.getElementById('schermata-login').classList.remove('hidden');
}

window.validaPasswordInTempoReale = validaPasswordInTempoReale;
window.switchAuthTab = switchAuthTab;
window.mostraRecuperoPassword = mostraRecuperoPassword;
window.tornaAlLogin = tornaAlLogin;
