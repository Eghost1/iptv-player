import fs from 'fs';
let code = fs.readFileSync('main.js', 'utf8');

const target = ` onerror="this.style.display='none';this.nextElementSibling.style.display='flex';" /><div class="channel-card__logo-placeholder" style="display:none;">\${initial}</div>`;
const replacement = ` onerror="this.outerHTML='<div class=\\'channel-card__logo-placeholder\\'>\${initial}</div>'" />`;

code = code.replace(target, replacement);

fs.writeFileSync('main.js', code, 'utf8');
console.log('Fixed CSS fallback.');
