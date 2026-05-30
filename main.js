// ============================================
// ➕ CANALES EXTRA (iframe embeds, sin tokens)
// ============================================
// Canales extra con iframe (estables, sin tokens)
// ============================================
// ➕ CANALES EXTRA (iframe embeds, sin tokens)
// ============================================
const CUSTOM_CHANNELS = [
  { "name": "TNT Sports Chile (El Canal Deportivo)", "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/TNT_Sports_Chile.svg/1024px-TNT_Sports_Chile.svg.png", "group": "Deportes", "url": "https://elcanaldeportivo.com/cdf.php", "iframe": true },
  { "name": "TNT Sports Chile (We Live Sports)", "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/TNT_Sports_Chile.svg/1024px-TNT_Sports_Chile.svg.png", "group": "Deportes", "url": "https://welivesports.shop/embed/tntsportchile.php", "iframe": true },
  { "name": "TNT Sports Chile (La14HD)", "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/TNT_Sports_Chile.svg/1024px-TNT_Sports_Chile.svg.png", "group": "Deportes", "url": "https://la14hd.com/vivo/canal.php?stream=tntsportschile", "iframe": true },
  { "name": "TNT Sports Argentina (StreamTP10)", "url": "https://streamtp10.com/global1.php?stream=tntsports", "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/TNT_Sports_Chile.svg/1024px-TNT_Sports_Chile.svg.png", "group": "StreamTP10", "iframe": true },
  { "name": "ESPN Premium (StreamTP10)", "url": "https://streamtp10.com/global1.php?stream=espnpremiumarg", "logo": "https://upload.wikimedia.org/wikipedia/commons/e/e0/ESPN_Premium_logo.png", "group": "StreamTP10", "iframe": true },
  { "name": "TyC Sports (StreamTP10)", "url": "https://streamtp10.com/global1.php?stream=tyc", "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Tyc_sports_logo_%282020%29.svg/1024px-Tyc_sports_logo_%282020%29.svg.png", "group": "StreamTP10", "iframe": true },
  { "name": "DSports (StreamTP10)", "url": "https://streamtp10.com/global1.php?stream=dsports", "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/DSports.png/800px-DSports.png", "group": "StreamTP10", "iframe": true },
  { "name": "Fox Sports (StreamTP10)", "url": "https://streamtp10.com/global1.php?stream=foxsports", "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Fox_Sports_logo.svg/1024px-Fox_Sports_logo.svg.png", "group": "StreamTP10", "iframe": true },
  { "name": "Win Sports (StreamTP10)", "url": "https://streamtp10.com/global1.php?stream=winsports", "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Win_Sports_Logo.svg/1024px-Win_Sports_Logo.svg.png", "group": "StreamTP10", "iframe": true },
  { "name": "VTV Plus (StreamTP10)", "url": "https://streamtp10.com/global1.php?stream=vtvplus", "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Logotipo_de_VTV_Plus_%282021%29.svg/1024px-Logotipo_de_VTV_Plus_%282021%29.svg.png", "group": "StreamTP10", "iframe": true },
  { "name": "ESPN 5 (StreamTP10)", "url": "https://streamtp10.com/global1.php?stream=espn5", "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/ESPN_logo.svg/1024px-ESPN_logo.svg.png", "group": "StreamTP10", "iframe": true },
  { "name": "Eventos EN VIVO (StreamTP10)", "url": "https://streamtp10.com/eventos.html", "logo": "", "group": "StreamTP10", "iframe": true }
];

// ============================================
// Constants & DOM Elements
// ============================================
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const processedCustomChannels = CUSTOM_CHANNELS.map(ch => ({
  ...ch,
  source: 'custom',
  uid: `${ch.name}-${ch.url}`.replace(/\s+/g, '-').toLowerCase()
}));

// Única fuente: channels.m3u local
const LOCAL_PLAYLIST = '/channels.m3u';

// ============================================
// Cookie Helpers
// ============================================
function setCookie(name, value, days = 365) {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  document.cookie = `${name}=${value || ""}; expires=${date.toUTCString()}; path=/; SameSite=Lax`;
}

function getCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i].trim();
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

const state = {
  channels: [],
  sportsChannels: [],
  chileChannels: [],
  localChannels: [],
  customChannels: processedCustomChannels,
  currentFilter: 'all',
  categories: [],
  currentChannel: null,
  favorites: JSON.parse(getCookie('iptv-favorites') || localStorage.getItem('iptv-favorites') || '[]'),
  hls: null,
};

const els = {
  channelList: $('#channel-list'),
  categoryFilters: $('#category-filters'),
  loading: $('#loading'),
  searchInput: $('#search-input'),
  videoPlayer: $('#video-player'),
  iframePlayer: $('#iframe-player'),
  playerEmpty: $('#player-empty'),
  playerError: $('#player-error'),
  playerContainer: $('#player-container'),
  nowPlaying: $('#now-playing'),
  nowPlayingLogo: $('#now-playing-logo'),
  nowPlayingName: $('#now-playing-name'),
  nowPlayingGroup: $('#now-playing-group'),
  btnFavorite: $('#btn-favorite'),
  countSports: $('#count-sports'),
  countChile: $('#count-chile'),
};

// ============================================
// M3U Parser
// ============================================
function parseM3U(text, source) {
  const lines = text.split('\n');
  const channels = [];
  let currentInfo = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line.startsWith('#EXTINF:')) {
      const nameMatch = line.match(/,(.+)$/);
      const logoMatch = line.match(/tvg-logo="([^"]*)"/);
      const groupMatch = line.match(/group-title="([^"]*)"/);
      const idMatch = line.match(/tvg-id="([^"]*)"/);

      currentInfo = {
        name: nameMatch ? nameMatch[1].trim() : 'Sin nombre',
        logo: logoMatch ? logoMatch[1] : '',
        group: groupMatch ? groupMatch[1].trim() : (source === 'Mis Canales' ? 'Mis Canales' : 'Otros'),
        id: idMatch ? idMatch[1] : '',
        source,
      };
    } else if (line && !line.startsWith('#') && currentInfo) {
      channels.push({
        ...currentInfo,
        url: line,
        uid: `${currentInfo.name}-${line}`.replace(/\s+/g, '-').toLowerCase(),
      });
      currentInfo = null;
    }
  }

  return channels;
}

// ============================================
// Fetch Channels
// ============================================
const CORS_PROXIES = [
  (u) => `https://corsproxy.io/?url=${encodeURIComponent(u)}`,
  (u) => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`,
];

async function fetchWithProxyFallback(url) {
  const problematic = url.startsWith('http://') || url.includes('pastebin.com') || url.includes('m3u.cl') || url.includes('bit.ly');
  if (!problematic && !url.startsWith('/')) {
    try {
      const res = await fetch(url);
      if (res.ok) return await res.text();
    } catch (_) {}
  }
  
  if (url.startsWith('/')) {
      try {
        const res = await fetch(url);
        if (res.ok) return await res.text();
      } catch (_) { return null; }
  }

  for (const makeProxy of CORS_PROXIES) {
    try {
      const res = await fetch(makeProxy(url));
      if (res.ok) return await res.text();
    } catch (e) {}
  }
  return null;
}

async function fetchPlaylist(url, source) {
  if (!url) return [];
  try {
    const text = await fetchWithProxyFallback(url);
    if (!text) throw new Error('Falló la carga de ' + source);
    return parseM3U(text, source);
  } catch (err) {
    console.error('Error fetching ' + source + ':', err);
    return [];
  }
}

async function loadChannels() {
  els.loading.style.display = 'flex';

  // Única fuente: channels.m3u local
  const local = await fetchPlaylist(LOCAL_PLAYLIST, 'Mis Canales');

  state.localChannels = local || [];
  state.customChannels = processedCustomChannels;

  const allMap = new Map();
  [...state.localChannels, ...state.customChannels].forEach((ch) => {
    if (!allMap.has(ch.uid)) {
      if (!ch.group || ch.group.trim() === '') ch.group = 'Otros';
      allMap.set(ch.uid, ch);
    }
  });
  state.channels = Array.from(allMap.values());

  // Contadores por grupo
  const deportes = state.channels.filter(ch => ch.group === 'Deportes');
  const chile = state.channels.filter(ch => ch.group === 'Nacionales Chile' || ch.group === 'Chile');
  if (els.countSports) els.countSports.textContent = deportes.length;
  if (els.countChile) els.countChile.textContent = chile.length;

  const categories = new Set(state.channels.map(ch => ch.group));
  state.categories = Array.from(categories).sort();

  els.loading.style.display = 'none';
  renderCategoryPills();
  renderChannels();
}

// ============================================
// Render UI
// ============================================
function renderCategoryPills() {
  let html = `<button class="category-pill ${state.currentFilter === 'all' ? 'active' : ''}" data-group="all">Todo</button>`;
  html += `<button class="category-pill ${state.currentFilter === 'favorites' ? 'active' : ''}" data-group="favorites">⭐ Favoritos</button>`;

  const priorityGroups = ['Mis Canales', 'Deportes', 'RojaDirectaTV', 'LibreFutbolTV'];

  priorityGroups.forEach(g => {
    if (state.categories.includes(g)) {
      html += `<button class="category-pill ${state.currentFilter === g ? 'active' : ''}" data-group="${g}">${g}</button>`;
    }
  });

  state.categories.forEach(g => {
    if (!priorityGroups.includes(g) && g.length < 25) {
      html += `<button class="category-pill ${state.currentFilter === g ? 'active' : ''}" data-group="${g}">${g}</button>`;
    }
  });

  if (els.categoryFilters) {
    els.categoryFilters.innerHTML = html;
  }
}

function getFilteredChannelsGrouped() {
  let filtered = state.channels;
  if (state.currentFilter === 'favorites') {
    filtered = filtered.filter(ch => state.favorites.includes(ch.uid));
  } else if (state.currentFilter !== 'all') {
    filtered = filtered.filter(ch => ch.group === state.currentFilter);
  }

  const query = els.searchInput.value.toLowerCase().trim();
  if (query) {
    filtered = filtered.filter(ch =>
      ch.name.toLowerCase().includes(query) || ch.group.toLowerCase().includes(query)
    );
  }

  const grouped = {};
  filtered.forEach(ch => {
    if (!grouped[ch.group]) grouped[ch.group] = [];
    grouped[ch.group].push(ch);
  });
  return grouped;
}

function renderChannels() {
  const grouped = getFilteredChannelsGrouped();
  if (Object.keys(grouped).length === 0) {
    els.channelList.innerHTML = `<div class="no-results"><p>No se encontraron canales</p></div>`;
    return;
  }

  let html = '';
  for (const [group, channels] of Object.entries(grouped)) {
    html += `<h3 class="category-group-title">${group}</h3><div class="category-group-grid">`;
    channels.forEach((ch) => {
      const isFav = state.favorites.includes(ch.uid);
      const isActive = state.currentChannel?.uid === ch.uid;
      const initial = ch.name.charAt(0).toUpperCase();
      html += `
        <div class="channel-card ${isActive ? 'active' : ''}" data-uid="${ch.uid}" tabindex="0">
          ${ch.logo 
            ? `<img class="channel-card__logo" src="${ch.logo}" alt="" onerror="this.style.display='none'" />` 
            : `<div class="channel-card__logo-placeholder">${initial}</div>`
          }
          <div class="channel-card__info">
            <div class="channel-card__name">${ch.name}</div>
          </div>
          <button class="channel-card__fav ${isFav ? 'is-fav' : ''}" data-fav-uid="${ch.uid}">${isFav ? '★' : '☆'}</button>
        </div>
      `;
    });
    html += `</div>`;
  }
  els.channelList.innerHTML = html;
}

// ============================================
// Video Playback
// ============================================
function playChannel(channel) {
  state.currentChannel = channel;
  els.playerEmpty.style.display = 'none';
  els.playerError.style.display = 'none';
  els.nowPlaying.style.display = 'flex';

  const isIframe = channel.iframe || channel.url.endsWith('.html') || channel.url.endsWith('.php');

  if (isIframe) {
    els.videoPlayer.classList.remove('visible');
    els.videoPlayer.pause();
    els.iframePlayer.src = channel.url;
    els.iframePlayer.style.display = 'block';
    els.iframePlayer.classList.add('visible');
  } else {
    els.iframePlayer.src = 'about:blank';
    els.iframePlayer.style.display = 'none';
    els.iframePlayer.classList.remove('visible');
    els.videoPlayer.classList.add('visible');
  }

  els.nowPlayingName.textContent = channel.name;
  els.nowPlayingGroup.textContent = channel.group || channel.source;
  
  if (state.hls) {
    state.hls.destroy();
    state.hls = null;
  }

  if (isIframe) {
    renderChannels();
    return;
  }

  const url = channel.url;
  const video = els.videoPlayer;

  if (Hls.isSupported()) {
    const hls = new Hls({
      enableWorker: true,
      lowLatencyMode: true,
      xhrSetup: function (xhr, url) {
        // Fix for 403: Omitir credenciales y limpiar headers para evitar bloqueos por Origin/Referer
        xhr.withCredentials = false;
      }
    });
    state.hls = hls;
    hls.loadSource(url);
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED, () => video.play().catch(() => {}));
    hls.on(Hls.Events.ERROR, (event, data) => {
      if (data.fatal) showPlayError();
    });
  } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = url;
    video.play().catch(() => {});
  } else {
    showPlayError();
  }
  renderChannels();
}

function showPlayError() {
  els.videoPlayer.classList.remove('visible');
  els.playerError.style.display = 'block';
}

function toggleFavorite(uid) {
  const idx = state.favorites.indexOf(uid);
  if (idx >= 0) state.favorites.splice(idx, 1);
  else state.favorites.push(uid);
  localStorage.setItem('iptv-favorites', JSON.stringify(state.favorites));
  renderChannels();
}

function setupListeners() {
  els.channelList.addEventListener('click', (e) => {
    const favBtn = e.target.closest('[data-fav-uid]');
    if (favBtn) {
      e.stopPropagation();
      toggleFavorite(favBtn.dataset.favUid);
      return;
    }
    const card = e.target.closest('.channel-card');
    if (card) {
      const channel = state.channels.find(ch => ch.uid === card.dataset.uid);
      if (channel) playChannel(channel);
    }
  });

  els.categoryFilters.addEventListener('click', (e) => {
    const pill = e.target.closest('.category-pill');
    if (pill) {
      state.currentFilter = pill.dataset.group;
      renderCategoryPills();
      renderChannels();
    }
  });

  els.searchInput.addEventListener('input', () => renderChannels());
}

async function init() {
  setupListeners();
  await loadChannels();
}

init();
