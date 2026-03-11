import fs from 'fs';
let code = fs.readFileSync('main.js', 'utf8');

// Replace the image tag
code = code.replace(
  /loading="lazy" onerror="this\.outerHTML='<div class=\\'channel-card__logo-placeholder\\'>\$\{initial\}<\/div>'" \/>/g,
  `loading="lazy" referrerpolicy="no-referrer" onerror="this.outerHTML='<div class=\\'channel-card__logo-placeholder\\'>\${initial}</div>'" />`
);

// Replace the star button
const starTarget = `<button class="channel-card__fav \${isFav ? 'is-fav' : ''}" data-fav-uid="\${ch.uid}" title="\${isFav ? 'Quitar de favoritos' : 'Agregar a favoritos'}">
            \${isFav ? '★' : '☆'}
          </button>`;
const svgReplacement = `<button class="channel-card__fav \${isFav ? 'is-fav' : ''}" data-fav-uid="\${ch.uid}" title="\${isFav ? 'Quitar de favoritos' : 'Agregar a favoritos'}">
            <svg viewBox="0 0 24 24" fill="\${isFav ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
          </button>`;

code = code.replace(starTarget, svgReplacement);

fs.writeFileSync('main.js', code, 'utf8');
console.log('Fixed SVG and CORS in main.js');
