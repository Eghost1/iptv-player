import Hls from 'hls.js';

// ============================================
// Constants & State
// ============================================
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
  Chile2: 'https://m3u.cl/lista/CL.m3u'
};

const state = {
  channels: [],
  sportsChannels: [],
  chileChannels: [],
  customChannels: processedCustomChannels,
  currentFilter: 'sports',
  currentChannel: null,
  favorites: JSON.parse(localStorage.getItem('iptv-favorites') || '[]'),
  hls: null,
};

// ============================================
// DOM Elements
// ============================================
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const els = {
  channelList: $('#channel-list'),
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
        group: groupMatch ? groupMatch[1] : '',
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
  try {
    const res = await fetch(url);
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

  // Helper to fetch json
  const fetchJson = async (url) => {
    try {
      const res = await fetch(url);
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      console.warn("Failed to fetch JSON:", url);
      return null;
    }
  };

  // Helper to fetch HTML text
  const fetchText = async (url) => {
    try {
      const res = await fetch(url);
      if (!res.ok) return null;
      return await res.text();
    } catch (e) {
      console.warn("Failed to fetch text:", url);
      return null;
    }
  };

  const [sports, chile, chile2, tnt_sports_chile, la14hdJson, libreHtml, rojaHtml] = await Promise.all([
    fetchPlaylist(PLAYLISTS.sports, 'sports'),
    fetchPlaylist(PLAYLISTS.chile, 'chile'),
    fetchPlaylist(PLAYLISTS.Chile2, 'chile2'),
    fetchPlaylist(PLAYLISTS.tnt_sports_chile, 'tnt_sports_chile'),
    fetchJson(LA14HD_JSON_URL),
    fetchText(LIBRE_AGENDA_URL),
    fetchText(ROJADIRECTA_URL)
  ]);

  state.sportsChannels = sports;
  state.chileChannels = chile;
  state.Chile2Channels = chile2;
  state.tnt_sports_chileChannels = tnt_sports_chile;

  // Process la14hd dynamic channels
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

  // Process LibreFutbolTV channels
  let libreChannels = [];
  if (libreHtml) {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(libreHtml, 'text/html');
      
      // Each match in librefutboltv agenda usually under li elements
      // The parent typically contains the match name text, then nested <ul> for links
      const events = doc.querySelectorAll('li'); 
      events.forEach(eventLi => {
        // Obtenemos el texto directo que podría ser el nombre del partido
        let eventName = "";
        Array.from(eventLi.childNodes).forEach(node => {
            if(node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== "") {
                eventName += node.textContent.trim() + " ";
            }
        });
        eventName = eventName.trim() || 'Evento LibreFutbol';

        const links = eventLi.querySelectorAll('a');
        links.forEach(link => {
            const href = link.getAttribute('href') || '';
            let channelName = link.textContent.trim().replace('Calidad 720p', '').replace('Calidad 1080p', '').trim();
            if(!channelName) channelName = eventName; // Fallback
            
            // Extract base64 part of '?r=' parameter
            const rMatch = href.match(/\?r=([A-Za-z0-9+/=]+)/);
            if (rMatch && rMatch[1]) {
                try {
                    const decodedUrl = atob(rMatch[1]);
                    // Only add if it looks like a valid URL or iframe path
                    if(decodedUrl.includes('http') || decodedUrl.includes('.php') || decodedUrl.includes('.html')) {
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
                } catch (e) {
                    console.warn("Failed to decode Libre URL:", rMatch[1]);
                }
            }
        });
      });
    } catch (e) {
      console.error("Error parsing Libre HTML", e);
    }
  }

  // Process RojaDirectaTV channels
  let rojaChannels = [];
  if(rojaHtml) {
      try {
          const parser = new DOMParser();
          const doc = parser.parseFromString(rojaHtml, 'text/html');
          
          // En RojaDirectaTV, los eventos suelen estar en listas o etiquetas <li> directas con enlaces dentro
          // Ajustaremos un selector general para atrapar listas de links similares a LibreFutbol
          const events = doc.querySelectorAll('li');
          
          events.forEach(eventLi => {
             // El nombre del partido a menudo viene precedido en texto, o en un tag strong/span
             let eventName = eventLi.textContent.split('\n')[0].trim() || 'Evento RojaDirecta';
             // Limpiar texto para no incluir todo el bloque
             eventName = eventName.replace(/Canal.*/g, '').trim();

             const links = eventLi.querySelectorAll('a');
             links.forEach((link, idx) => {
                 const href = link.getAttribute('href') || '';
                 const channelName = link.textContent.trim() || `Opcion ${idx+1}`;
                 
                 // RojaDirecta suele usar urls directas a sus players locales, pero vamos a intentar resolver si es absoluta o no
                 let finalUrl = href;
                 if(href.startsWith('/')) {
                     finalUrl = 'https://www.rojadirectatv3.pl' + href;
                 } else if(!href.startsWith('http')) {
                      finalUrl = 'https://www.rojadirectatv3.pl/' + href;
                 }
                 
                 // Evitar anchors vacíos o a otras paginas no utiles
                 if(href && !href.includes('agenda.php') && !href.includes('legal.php')) {
                    rojaChannels.push({
                        name: `${channelName} (${eventName}) [Roja]`,
                        logo: '',
                        group: 'RojaDirectaTV',
                        url: finalUrl,
                        iframe: true, // Asumimos que podemos i-framear la subpagina de player directo de roja
                        source: 'custom',
                        uid: `roja-${channelName}-${finalUrl}`.replace(/\s+/g, '-').toLowerCase()
                    });
                 }
             });
          });

      } catch (e) {
          console.error("Error parsing RojaDirecta HTML", e);
      }
  }

  // Merge the dynamically loaded custom channels explicitly into state
  state.customChannels = [...processedCustomChannels, ...la14hdChannels, ...libreChannels, ...rojaChannels];

  // Merge & deduplicate
  const allMap = new Map();
  [...sports, ...chile, ...chile2, ...tnt_sports_chile, ...state.customChannels].forEach((ch) => {
    if (!allMap.has(ch.uid)) {
      allMap.set(ch.uid, ch);
    }
  });
  state.channels = Array.from(allMap.values());

  // Update stats
  els.countSports.textContent = sports.length;
  els.countChile.textContent = chile.length;

  els.loading.style.display = 'none';
  renderChannels();
}

// ============================================
// Render Channels
// ============================================
function getFilteredChannels() {
  let channels;
  switch (state.currentFilter) {
    case 'sports':
      channels = state.sportsChannels;
      break;
    case 'chile':
      channels = state.chileChannels;
      break;
    case 'custom':
      channels = state.customChannels;
      break;
    case 'favorites':
      channels = state.channels.filter((ch) => state.favorites.includes(ch.uid));
      break;
    default:
      channels = state.channels;
  }

  const query = els.searchInput.value.toLowerCase().trim();
  if (query) {
    channels = channels.filter(
      (ch) =>
        ch.name.toLowerCase().includes(query) ||
        ch.group.toLowerCase().includes(query)
    );
  }

  return channels;
}

function renderChannels() {
  const channels = getFilteredChannels();

  if (channels.length === 0) {
    els.channelList.innerHTML = `
      <div class="no-results">
        <div class="no-results__icon">🔍</div>
        <p>No se encontraron canales</p>
      </div>
    `;
    return;
  }

  const html = channels
    .map((ch) => {
      const isFav = state.favorites.includes(ch.uid);
      const isActive = state.currentChannel?.uid === ch.uid;
      const initial = ch.name.charAt(0).toUpperCase();
      const isChile = ch.source === 'chile';

      return `
        <div class="channel-card ${isActive ? 'active' : ''}" data-uid="${ch.uid}">
          ${ch.logo
          ? `<img class="channel-card__logo" src="${ch.logo}" alt="${ch.name}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';" /><div class="channel-card__logo-placeholder" style="display:none;">${initial}</div>`
          : `<div class="channel-card__logo-placeholder">${initial}</div>`
        }
          <div class="channel-card__info">
            <div class="channel-card__name" title="${ch.name}">${ch.name}</div>
            <div class="channel-card__group">${ch.group || ch.source}</div>
          </div>
          ${isChile ? '<span class="channel-card__tag channel-card__tag--chile">CL</span>' : ''}
          <button class="channel-card__fav ${isFav ? 'is-fav' : ''}" data-fav-uid="${ch.uid}" title="${isFav ? 'Quitar de favoritos' : 'Agregar a favoritos'}">
            ${isFav ? '★' : '☆'}
          </button>
        </div>
      `;
    })
    .join('');

  els.channelList.innerHTML = html;
}

// ============================================
// Video Playback
// ============================================
function playChannel(channel) {
  state.currentChannel = channel;

  // Reset UI
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

  // Update now playing
  els.nowPlayingName.textContent = channel.name;
  els.nowPlayingGroup.textContent = channel.group || channel.source;
  if (channel.logo) {
    els.nowPlayingLogo.src = channel.logo;
    els.nowPlayingLogo.style.display = 'block';
  } else {
    els.nowPlayingLogo.style.display = 'none';
  }

  // Update favorite button
  updateFavoriteButton();

  // Destroy previous HLS instance
  if (state.hls) {
    state.hls.destroy();
    state.hls = null;
  }

  const url = channel.url;
  const video = els.videoPlayer;

  // Skip video player setup if using iframe
  if (isIframe) {
    // Update active card
    renderChannels();
    return;
  }

  // Determine how to play
  if (url.includes('.m3u8') || url.includes('m3u8')) {
    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        maxBufferLength: 30,
        maxMaxBufferLength: 60,
      });
      state.hls = hls;

      hls.loadSource(url);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(() => { });
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.error('Network error, trying to recover...');
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.error('Media error, trying to recover...');
              hls.recoverMediaError();
              break;
            default:
              showPlayError();
              break;
          }
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Safari native HLS
      video.src = url;
      video.play().catch(() => { });
    } else {
      showPlayError();
    }
  } else {
    // Direct stream (MP4, etc.)
    video.src = url;
    video.play().catch(() => { });

    video.onerror = () => {
      showPlayError();
    };
  }

  // Update active card
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
  if (idx >= 0) {
    state.favorites.splice(idx, 1);
  } else {
    state.favorites.push(uid);
  }
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
  // Channel list click delegation
  els.channelList.addEventListener('click', (e) => {
    // Check favorite button
    const favBtn = e.target.closest('[data-fav-uid]');
    if (favBtn) {
      e.stopPropagation();
      toggleFavorite(favBtn.dataset.favUid);
      return;
    }

    // Check channel card
    const card = e.target.closest('.channel-card');
    if (card) {
      const uid = card.dataset.uid;
      const channel = state.channels.find((ch) => ch.uid === uid);
      if (channel) playChannel(channel);
    }
  });

  // Filter tabs
  $$('.filter-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      $$('.filter-tab').forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      state.currentFilter = tab.dataset.filter;
      renderChannels();
    });
  });

  // Search
  let searchTimeout;
  els.searchInput.addEventListener('input', () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      renderChannels();
    }, 200);
  });

  // Now playing favorite button
  els.btnFavorite.addEventListener('click', () => {
    if (state.currentChannel) {
      toggleFavorite(state.currentChannel.uid);
    }
  });

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
}

// ============================================
// Initialize
// ============================================
async function init() {
  setupListeners();
  await loadChannels();
}

init();
