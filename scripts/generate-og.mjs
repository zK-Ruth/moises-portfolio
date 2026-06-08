// Generates the social-share banner (Open Graph / Twitter) as a 1200x630 PNG.
// Brand palette mirrors the favicon: navy field, gold "</>" + blue slash.
// Run: node scripts/generate-og.mjs   (requires `npm i sharp` or `npm i -D sharp`)
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, '../src/assets/images/og-banner.png');

const W = 1200;
const H = 630;
const FONT = "'Segoe UI', 'DejaVu Sans', Arial, sans-serif";

// Fine technical grid
let grid = '';
for (let x = 0; x <= W; x += 48) grid += `<line x1="${x}" y1="0" x2="${x}" y2="${H}"/>`;
for (let y = 0; y <= H; y += 48) grid += `<line x1="0" y1="${y}" x2="${W}" y2="${y}"/>`;

const svg = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0b1220"/>
      <stop offset="1" stop-color="#0f172a"/>
    </linearGradient>
    <radialGradient id="glowY" cx="50%" cy="50%" r="50%">
      <stop offset="0" stop-color="#f5c400" stop-opacity="0.38"/>
      <stop offset="1" stop-color="#f5c400" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glowB" cx="50%" cy="50%" r="50%">
      <stop offset="0" stop-color="#38bdf8" stop-opacity="0.34"/>
      <stop offset="1" stop-color="#38bdf8" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#bg)"/>

  <!-- grid, faded -->
  <g stroke="#ffffff" stroke-opacity="0.045" stroke-width="1">${grid}</g>

  <!-- ambient glows -->
  <circle cx="1060" cy="120" r="340" fill="url(#glowY)"/>
  <circle cx="120" cy="560" r="320" fill="url(#glowB)"/>

  <!-- top accent bar -->
  <rect x="0" y="0" width="${W}" height="8" fill="#f5c400"/>

  <!-- ===== Left: identity ===== -->
  <g font-family="${FONT}">
    <!-- eyebrow -->
    <circle cx="86" cy="143" r="7" fill="#22c55e"/>
    <text x="106" y="150" font-size="26" fill="#f5c400" font-weight="700" letter-spacing="2">moisescruz.dev</text>

    <!-- name -->
    <text x="78" y="258" font-size="84" fill="#ffffff" font-weight="800" letter-spacing="-2">Moises D. Cruz</text>

    <!-- title -->
    <text x="82" y="338" font-size="42" fill="#cbd5e1" font-weight="600">Full Stack Developer &amp;</text>
    <text x="82" y="396" font-size="42" fill="#f5c400" font-weight="800">DevSecOps Engineer</text>
    <rect x="82" y="412" width="470" height="6" rx="3" fill="#38bdf8"/>

    <!-- tech chips -->
    <g font-size="22" font-weight="600">
      <rect x="82"  y="470" width="118" height="46" rx="10" fill="#ffffff" fill-opacity="0.06" stroke="#ffffff" stroke-opacity="0.12"/>
      <text x="141" y="500" fill="#e2e8f0" text-anchor="middle">Angular</text>
      <rect x="212" y="470" width="120" height="46" rx="10" fill="#ffffff" fill-opacity="0.06" stroke="#ffffff" stroke-opacity="0.12"/>
      <text x="272" y="500" fill="#e2e8f0" text-anchor="middle">Cloud</text>
      <rect x="344" y="470" width="170" height="46" rx="10" fill="#ffffff" fill-opacity="0.06" stroke="#ffffff" stroke-opacity="0.12"/>
      <text x="429" y="500" fill="#e2e8f0" text-anchor="middle">Security</text>
    </g>
  </g>

  <!-- ===== Right: code mark ===== -->
  <g>
    <rect x="812" y="155" width="318" height="318" rx="32" fill="#131c30" stroke="#243049" stroke-width="2"/>
    <!-- < -->
    <polyline points="908,252 858,314 908,376" fill="none" stroke="#f5c400" stroke-width="15" stroke-linecap="round" stroke-linejoin="round"/>
    <!-- / -->
    <line x1="948" y1="388" x2="992" y2="240" stroke="#38bdf8" stroke-width="15" stroke-linecap="round"/>
    <!-- > -->
    <polyline points="1034,252 1084,314 1034,376" fill="none" stroke="#f5c400" stroke-width="15" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile(OUT);
console.log('Wrote', OUT);
