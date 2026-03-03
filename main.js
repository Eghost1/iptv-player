// HLS is loaded via CDN in index.html

// ============================================
// Constants & DOM Elements
// ============================================
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// ============================================
// ➕ AGREGA TUS CANALES MANUALMENTE AQUÍ
// ============================================
const CUSTOM_CHANNELS = [
  // Descomenta y edita este ejemplo para agregar tu propio canal:
  {
    name: 'TNT Sports2',
    logo: 'https://ejemplo.com/tnt-logo.png', // opcional
    group: 'Deportes', // opcional
    url: 'https://aw1wcm92zq.fubohd.com:443/tntsportschile/mono.m3u8?token=69cb908490ed4fe8f625a9506a97cb6c71ed5a6c-f4-1772495840-1772477840' // URL de tu transmisión
  },
  {
    name: 'TNT Sports Chile (El Canal Deportivo)',
    logo: '',
    group: 'Deportes',
    url: 'https://elcanaldeportivo.com/cdf.php',
    iframe: true
  },
  {
    name: 'TNT Sports Chile (Rereyano)',
    logo: '',
    group: 'Deportes',
    url: 'https://rereyano.ru/player/3/83',
    iframe: true
  },
  {
    name: 'TNT Sports Chile (We Live Sports)',
    logo: '',
    group: 'Deportes',
    url: 'https://welivesports.shop/embed/tntsportchile.php',
    iframe: true
  },
  {
    name: 'TNT Sports Chile (La14HD)',
    logo: '',
    group: 'Deportes',
    url: 'https://la14hd.com/vivo/canal.php?stream=tntsportschile',
    iframe: true
  }
];

const processedCustomChannels = CUSTOM_CHANNELS.map(ch => ({
  ...ch,
  source: 'custom',
  uid: `${ch.name}-${ch.url}`.replace(/\s+/g, '-').toLowerCase()
}));

// Added la14hd dynamic proxy (via allorigins to bypass CORS if needed, or direct)
const LA14HD_JSON_URL = 'https://api.allorigins.win/raw?url=https://www.la14hd.com/status.json';
// Added LibreFutbolTV dynamic proxy
const LIBRE_AGENDA_URL = 'https://api.allorigins.win/raw?url=https://librefutboltv.su/home1/agenda/';
// Added RojaDirectaTV dynamic proxy
const ROJADIRECTA_URL = 'https://api.allorigins.win/raw?url=https://www.rojadirectatv3.pl/';

const PLAYLISTS = {
  sports: 'https://iptv-org.github.io/iptv/categories/sports.m3u',
  chile: 'https://iptv-org.github.io/iptv/countries/cl.m3u',
  Chile2: 'https://m3u.cl/lista/CL.m3u',
  tnt_sports_chile: '', // Deprecated placeholder or empty
  c1: 'https://pastebin.com/raw/wCnH-1-d3port3s-CDX2',
  c2: 'https://pastebin.com/raw/sfym-nbaa–2SDK',
  c3: 'https://pastebin.com/raw/K-futbol211VtaQaMC',
  c4: 'http://bit.ly/futbol1onlin33-applil',
  c5: 'http://bit.ly/deportes1general33-applil',
  c6: 'http://bit.ly/Deportes1Ymasyaj12'
};

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
        group: groupMatch ? groupMatch[1].trim() : 'Sin Categoría',
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
async function fetchPlaylist(url, source) {
  if (!url) return [];
  try {
    const isCorsProblematic = url.startsWith('http://') || url.includes('pastebin.com') || url.includes('m3u.cl') || url.includes('bit.ly');
    const targetUrl = isCorsProblematic ? `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}` : url;

    const res = await fetch(targetUrl);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();
    return parseM3U(text, source);
  } catch (err) {
    console.error(`Error fetching ${source}:`, err);
    return [];
  }
}

async function loadChannels() {
  els.loading.style.display = 'flex';

  const fetchJson = async (url) => {
    try {
      const res = await fetch(url);
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      return null;
    }
  };

  const fetchText = async (url) => {
    try {
      const res = await fetch(url);
      if (!res.ok) return null;
      return await res.text();
    } catch (e) {
      return null;
    }
  };

  const [
    sports, chile, chile2, tnt_sports_chile,
    c1, c2, c3, c4, c5, c6,
    la14hdJson, libreHtml, rojaHtml
  ] = await Promise.all([
    fetchPlaylist(PLAYLISTS.sports, 'sports'),
    fetchPlaylist(PLAYLISTS.chile, 'chile'),
    fetchPlaylist(PLAYLISTS.Chile2, 'chile2'),
    fetchPlaylist(PLAYLISTS.tnt_sports_chile, 'tnt_sports_chile'),
    fetchPlaylist(PLAYLISTS.c1, 'sports'),
    fetchPlaylist(PLAYLISTS.c2, 'sports'),
    fetchPlaylist(PLAYLISTS.c3, 'sports'),
    fetchPlaylist(PLAYLISTS.c4, 'sports'),
    fetchPlaylist(PLAYLISTS.c5, 'sports'),
    fetchPlaylist(PLAYLISTS.c6, 'sports'),
    fetchJson(LA14HD_JSON_URL),
    fetchText(LIBRE_AGENDA_URL),
    fetchText(ROJADIRECTA_URL)
  ]);

  state.sportsChannels = [...sports, ...c1, ...c2, ...c3, ...c4, ...c5, ...c6];
  state.chileChannels = chile;
  state.Chile2Channels = chile2;
  state.tnt_sports_chileChannels = tnt_sports_chile;

  let la14hdChannels = [];
  if (la14hdJson) {
    for (const group in la14hdJson) {
      const items = la14hdJson[group];
      if (Array.isArray(items)) {
        items.forEach(item => {
          if (item.Estado === "Activo" && item.Link) {
            la14hdChannels.push({
              name: item.Canal + " (la14hd)",
              logo: '',
              group: group,
              url: item.Link,
              iframe: true,
              source: 'custom',
              uid: `la14hd-${item.Canal}-${item.Link}`.replace(/\s+/g, '-').toLowerCase()
            });
          }
        });
      }
    }
  }

  let libreChannels = [];
  if (libreHtml) {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(libreHtml, 'text/html');
      const events = doc.querySelectorAll('li');
      events.forEach(eventLi => {
        let eventName = "";
        Array.from(eventLi.childNodes).forEach(node => {
          if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== "") eventName += node.textContent.trim() + " ";
        });
        eventName = eventName.trim() || 'Evento LibreFutbol';

        const links = eventLi.querySelectorAll('a');
        links.forEach(link => {
          const href = link.getAttribute('href') || '';
          let channelName = link.textContent.trim().replace('Calidad 720p', '').replace('Calidad 1080p', '').trim();
          if (!channelName) channelName = eventName;
          const rMatch = href.match(/\?r=([A-Za-z0-9+/=]+)/);
          if (rMatch && rMatch[1]) {
            try {
              const decodedUrl = atob(rMatch[1]);
              if (decodedUrl.includes('http') || decodedUrl.includes('.php') || decodedUrl.includes('.html')) {
                libreChannels.push({
                  name: `${channelName} (${eventName}) [Libre]`,
                  logo: '',
                  group: 'LibreFutbolTV',
                  url: decodedUrl,
                  iframe: true,
                  source: 'custom',
                  uid: `libre-${channelName}-${decodedUrl}`.replace(/\s+/g, '-').toLowerCase()
                });
              }
            } catch (e) { }
          }
        });
      });
    } catch (e) { }
  }

  let rojaChannels = [];
  if (rojaHtml) {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(rojaHtml, 'text/html');
      const events = doc.querySelectorAll('li');

      events.forEach(eventLi => {
        let eventName = eventLi.textContent.split('\n')[0].trim() || 'Evento RojaDirecta';
        eventName = eventName.replace(/Canal.*/g, '').trim();

        const links = eventLi.querySelectorAll('a');
        links.forEach((link, idx) => {
          const href = link.getAttribute('href') || '';
          const channelName = link.textContent.trim() || `Opcion ${idx + 1}`;
          let finalUrl = href;
          if (href.startsWith('/')) finalUrl = 'https://www.rojadirectatv3.pl' + href;
          else if (!href.startsWith('http')) finalUrl = 'https://www.rojadirectatv3.pl/' + href;

          if (href && !href.includes('agenda.php') && !href.includes('legal.php')) {
            rojaChannels.push({
              name: `${channelName} (${eventName}) [Roja]`,
              logo: '',
              group: 'RojaDirectaTV',
              url: finalUrl,
              iframe: true,
              source: 'custom',
              uid: `roja-${channelName}-${finalUrl}`.replace(/\s+/g, '-').toLowerCase()
            });
          }
        });
      });
    } catch (e) { }
  }

  state.customChannels = [...processedCustomChannels, ...la14hdChannels, ...libreChannels, ...rojaChannels];

  const allMap = new Map();
  [...state.sportsChannels, ...chile, ...chile2, ...tnt_sports_chile, ...state.customChannels].forEach((ch) => {
    if (!allMap.has(ch.uid)) {
      if (!ch.group || ch.group.trim() === '') ch.group = 'Otros';
      allMap.set(ch.uid, ch);
    }
  });
  state.channels = Array.from(allMap.values());

  els.countSports.textContent = state.sportsChannels.length;
  els.countChile.textContent = chile.length;

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

  const priorityGroups = ['Deportes', 'RojaDirectaTV', 'LibreFutbolTV'];

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
    els.channelList.innerHTML = `
      <div class="no-results">
        <div class="no-results__icon">📂</div>
        <p>No se encontraron canales en esta categoría</p>
      </div>
    `;
    return;
  }

  let html = '';
  let animDelay = 0;

  for (const [group, channels] of Object.entries(grouped)) {
    if (state.currentFilter === 'all' || state.currentFilter === 'favorites' || els.searchInput.value.trim() !== '') {
      html += `<h3 class="category-group-title">${group}</h3>`;
    }

    html += `<div class="category-group-grid">`;
    channels.forEach((ch) => {
      const isFav = state.favorites.includes(ch.uid);
      const isActive = state.currentChannel?.uid === ch.uid;
      const initial = ch.name.charAt(0).toUpperCase();

      animDelay += 0.02;
      const delayStyle = `animation-delay: ${Math.min(animDelay, 0.5)}s;`;

      html += `
        <div class="channel-card ${isActive ? 'active' : ''}" data-uid="${ch.uid}" style="${delayStyle}">
          ${ch.logo
          ? `<img class="channel-card__logo" src="${ch.logo}" alt="${ch.name}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';" /><div class="channel-card__logo-placeholder" style="display:none;">${initial}</div>`
          : `<div class="channel-card__logo-placeholder">${initial}</div>`
        }
          <div class="channel-card__info">
            <div class="channel-card__name" title="${ch.name}">${ch.name}</div>
          </div>
          <button class="channel-card__fav ${isFav ? 'is-fav' : ''}" data-fav-uid="${ch.uid}" title="${isFav ? 'Quitar de favoritos' : 'Agregar a favoritos'}">
            ${isFav ? '★' : '☆'}
          </button>
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
  if (channel.logo) {
    els.nowPlayingLogo.src = channel.logo;
    els.nowPlayingLogo.style.display = 'block';
  } else {
    els.nowPlayingLogo.style.display = 'none';
  }

  updateFavoriteButton();

  if (window.innerWidth <= 1024) {
    els.playerContainer.scrollIntoView({ behavior: 'smooth' });
  }

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

  if (url.includes('.m3u8') || url.includes('m3u8')) {
    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true, lowLatencyMode: true, maxBufferLength: 30, maxMaxBufferLength: 60,
      });
      state.hls = hls;
      hls.loadSource(url);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => video.play().catch(() => { }));
      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          if (data.type === Hls.ErrorTypes.NETWORK_ERROR) hls.startLoad();
          else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) hls.recoverMediaError();
          else showPlayError();
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = url;
      video.play().catch(() => { });
    } else showPlayError();
  } else {
    video.src = url;
    video.play().catch(() => { });
    video.onerror = () => showPlayError();
  }

  renderChannels();
}

function showPlayError() {
  els.videoPlayer.classList.remove('visible');
  if (els.iframePlayer) els.iframePlayer.style.display = 'none';
  els.playerError.style.display = 'block';
}

// ============================================
// Favorites
// ============================================
function toggleFavorite(uid) {
  const idx = state.favorites.indexOf(uid);
  if (idx >= 0) state.favorites.splice(idx, 1);
  else state.favorites.push(uid);

  setCookie('iptv-favorites', JSON.stringify(state.favorites), 365);
  localStorage.setItem('iptv-favorites', JSON.stringify(state.favorites));

  updateFavoriteButton();
  renderChannels();
}

function updateFavoriteButton() {
  if (!state.currentChannel) return;
  const isFav = state.favorites.includes(state.currentChannel.uid);
  els.btnFavorite.classList.toggle('is-fav', isFav);
}

// ============================================
// Event Listeners
// ============================================
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
      const uid = card.dataset.uid;
      const channel = state.channels.find((ch) => ch.uid === uid);
      if (channel) playChannel(channel);
    }
  });

  if (els.categoryFilters) {
    els.categoryFilters.addEventListener('click', (e) => {
      const pill = e.target.closest('.category-pill');
      if (pill) {
        state.currentFilter = pill.dataset.group;
        renderCategoryPills();
        renderChannels();
        els.channelList.scrollTop = 0;
      }
    });
  }

  let searchTimeout;
  els.searchInput.addEventListener('input', () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      renderChannels();
    }, 200);
  });

  els.btnFavorite.addEventListener('click', () => {
    if (state.currentChannel) toggleFavorite(state.currentChannel.uid);
  });
}

// Keyboard shortcut: Escape to clear search
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    els.searchInput.value = '';
    renderChannels();
  }
  // Ctrl+K / Cmd+K to focus search
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    els.searchInput.focus();
  }
});
// ============================================
// Initialize
// ============================================
async function init() {
  setupListeners();
  await loadChannels();
}

init();
