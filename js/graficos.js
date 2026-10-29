// Íconos e ilustraciones propias de GGym (SVG). No usan arte de ningún juego.
import { COLOR_RANGO } from './datos.js';
import { desdeISO } from './motor.js';

const TRAZOS = {
  inicio: '<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
  partidas: '<path d="M4 20V11M10 20V5M16 20v-6M2 20h20"/>',
  plan: '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  bienestar: '<path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"/>',
  progreso: '<path d="M3 17l6-6 4 4 8-8M15 7h6v6"/>',
  atras: '<path d="M15 6l-6 6 6 6"/>',
  derecha: '<path d="M9 6l6 6-6 6"/>',
  check: '<path d="M5 12l5 5 9-10"/>',
  candado: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  llama: '<path d="M12 3c1 4 5 5 5 10a5 5 0 0 1-10 0c0-3 2-4 2-7 1 1 2 2 3 2 0-2-1-3 0-5z"/>',
  luna: '<path d="M20 14A8 8 0 1 1 10 4a6 6 0 0 0 10 10z"/>',
  reloj: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  corazon: '<path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"/>',
  agua: '<path d="M12 3s6 7 6 11a6 6 0 0 1-12 0c0-4 6-11 6-11z"/>',
  comida: '<path d="M12 7c-3-3-8-1-8 4s4 9 8 9 8-4 8-9-5-7-8-4z"/><path d="M12 7c0-2 1-3 3-4"/>',
  alerta: '<path d="M12 3l9 16H3z"/><path d="M12 10v4M12 17h.01"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
  pesa: '<path d="M6 7v10M3 9v6M18 7v10M21 9v6M6 12h12"/>',
  mira: '<circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="2"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/>',
  ojo: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  viento: '<path d="M3 8h11a3 3 0 1 0-3-3"/><path d="M3 16h15a3 3 0 1 1-3 3"/><path d="M3 12h7"/>',
  cerebro: '<path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 2 5 3 3 0 0 0 3 3h1V4z"/><path d="M15 4a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-2 5 3 3 0 0 1-3 3h-1V4z"/>',
  usuario: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/>',
  video: '<rect x="3" y="6" width="13" height="12" rx="2"/><path d="M16 10l5-3v10l-5-3z"/>',
  ruta: '<circle cx="6" cy="18" r="2"/><circle cx="18" cy="6" r="2"/><path d="M8 18h6a3 3 0 0 0 0-6h-4a3 3 0 0 1 0-6h6"/>',
  estrella: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',
  juego: '<rect x="2" y="7" width="20" height="11" rx="5"/><path d="M7 11v3M5.5 12.5h3M15 12h.01M18 13h.01"/>',
  papelera: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
  grupo: '<circle cx="9" cy="8" r="3.5"/><path d="M2 20c.8-3.5 3.5-5 7-5s6.2 1.5 7 5"/><circle cx="17" cy="9" r="2.5"/><path d="M17 14c2.5 0 4.3 1.3 5 4"/>',
  mas: '<path d="M12 5v14M5 12h14"/>',
  menos: '<path d="M5 12h14"/>',
  escudo: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
  rayo: '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
  subir: '<path d="M12 16V4M7 9l5-5 5 5M4 20h16"/>',
};

export function icono(nombre, tam = 22, color = 'currentColor', grosor = 2) {
  return `<svg width="${tam}" height="${tam}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="${grosor}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${TRAZOS[nombre] || ''}</svg>`;
}

export const ICONO_DIM = { mecanica: 'mira', tactica: 'ojo', cognitiva: 'cerebro', fisica: 'pesa', psicologica: 'viento' };

// Emblema de rango (diseño propio, no es el emblema oficial del juego).
export function emblema(rango, tam = 88) {
  const [claro, oscuro] = COLOR_RANGO[rango] || COLOR_RANGO.Oro;
  const id = `em-${rango}`;
  return `<svg width="${tam}" height="${tam}" viewBox="0 0 96 96" role="img" aria-label="Emblema de rango ${rango}">
    <defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${claro}"/><stop offset="1" stop-color="${oscuro}"/></linearGradient></defs>
    <path d="M20 42 L4 30 L20 33 L10 18 L28 30 Z" fill="#FFFFFF" fill-opacity="0.55"/>
    <path d="M76 42 L92 30 L76 33 L86 18 L68 30 Z" fill="#FFFFFF" fill-opacity="0.55"/>
    <path d="M48 8 L76 20 V46 C76 66 62 80 48 88 C34 80 20 66 20 46 V20 Z" fill="url(#${id})" stroke="#FFFFFF" stroke-width="2"/>
    <path d="M48 22 L64 30 V46 C64 58 56 67 48 72 C40 67 32 58 32 46 V30 Z" fill="#000000" fill-opacity="0.15"/>
    <path d="M36 48 L48 40 L60 48 M36 58 L48 50 L60 58" stroke="#FFFFFF" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
}

// Minimapa genérico (diseño propio) con muertes y guardas de la partida.
export function minimapa(partida, tam = 150) {
  const muertes = partida.posMuertes.map((p) => `<path d="M${p.x - 5} ${p.y - 5} l10 10 m0 -10 l-10 10"/>`).join('');
  const guardas = partida.posGuardas.map((p) => `<circle cx="${p.x}" cy="${p.y}" r="5" fill="#F5C451"/>`).join('');
  return `<svg width="${tam}" height="${tam}" viewBox="0 0 200 200" role="img" aria-label="Mapa de la partida: ${partida.posMuertes.length} muertes y ${partida.posGuardas.length} guardas" style="display:block">
    <rect width="200" height="200" fill="#1D2350"/>
    <path d="M0 0 L200 200" stroke="#3B6FD8" stroke-opacity="0.45" stroke-width="30"/>
    <path d="M30 170 L30 30 L170 30 M30 170 L170 170 L170 30 M30 170 L170 30" stroke="#8B84C9" stroke-opacity="0.6" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="140" cy="142" r="12" fill="none" stroke="#F5C451" stroke-width="3" stroke-dasharray="4 3"/>
    <circle cx="60" cy="58" r="12" fill="none" stroke="#9D92FF" stroke-width="3" stroke-dasharray="4 3"/>
    <circle cx="30" cy="170" r="14" fill="#6A5AF9"/>
    <circle cx="170" cy="30" r="14" fill="#E8508C"/>
    ${guardas}
    <g stroke="#FF5C8A" stroke-width="4" stroke-linecap="round">${muertes}</g>
  </svg>`;
}

function fechaCorta(iso) {
  return desdeISO(iso).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' }).replace('.', '');
}

// Gráfica de puntos de liga (LP).
export function graficaLP(lp) {
  if (lp.length < 2) {
    return '<p class="suave">Tu gráfica aparecerá cuando tengas más días registrados.</p>';
  }
  const valores = lp.map((p) => p.lp);
  const min = Math.min(...valores);
  const max = Math.max(...valores);
  const x = (i) => 10 + (i * 290) / (lp.length - 1);
  const y = (v) => (max === min ? 60 : 110 - ((v - min) / (max - min)) * 90);
  const puntos = lp.map((p, i) => `${x(i).toFixed(1)},${y(p.lp).toFixed(1)}`).join(' ');
  const ultimo = lp[lp.length - 1];
  return `<svg viewBox="0 0 310 122" role="img" aria-label="Puntos de liga: de ${lp[0].lp} a ${ultimo.lp}" class="grafica">
    <defs><linearGradient id="lp-area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9D92FF" stop-opacity="0.45"/><stop offset="1" stop-color="#9D92FF" stop-opacity="0"/></linearGradient></defs>
    <line x1="0" y1="114" x2="310" y2="114" stroke="rgba(255,255,255,0.15)"/>
    <line x1="0" y1="20" x2="310" y2="20" stroke="rgba(255,255,255,0.08)" stroke-dasharray="3 4"/>
    <polygon points="10,114 ${puntos} 300,114" fill="url(#lp-area)"/>
    <polyline points="${puntos}" fill="none" stroke="#9D92FF" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
    <circle cx="300" cy="${y(ultimo.lp).toFixed(1)}" r="6" fill="#E8508C" stroke="#FFFFFF" stroke-width="2"/>
  </svg>
  <div class="fila-entre mini"><span>${fechaCorta(lp[0].fecha)}</span><span>Hoy · ${ultimo.lp} LP</span></div>`;
}

// Línea pequeña de tendencia con la referencia del rango actual.
export function minilinea(valores, referencia, color = '#9D92FF') {
  const todos = [...valores, referencia];
  const min = Math.min(...todos) * 0.9;
  const max = Math.max(...todos) * 1.1;
  const x = (i) => 4 + (i * 112) / (valores.length - 1);
  const y = (v) => 34 - ((v - min) / (max - min)) * 30;
  const pts = valores.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
  return `<svg width="120" height="38" viewBox="0 0 120 38" aria-hidden="true">
    <line x1="0" x2="120" y1="${y(referencia).toFixed(1)}" y2="${y(referencia).toFixed(1)}" stroke="rgba(255,255,255,0.35)" stroke-dasharray="3 3"/>
    <polyline points="${pts}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
    <circle cx="${x(valores.length - 1).toFixed(1)}" cy="${y(valores[valores.length - 1]).toFixed(1)}" r="3.5" fill="${color}"/>
  </svg>`;
}

// Medidor circular de horas de juego frente al límite.
export function medidor(horas, limite = 4) {
  const pct = Math.min(1, horas / limite);
  const largo = 2 * Math.PI * 34;
  const color = horas > limite ? '#F5C451' : '#FFFFFF';
  return `<svg width="84" height="84" viewBox="0 0 84 84" role="img" aria-label="${Math.round(pct * 100)} % del límite diario">
    <circle cx="42" cy="42" r="34" fill="none" stroke="#FFFFFF" stroke-opacity="0.28" stroke-width="9"/>
    <circle cx="42" cy="42" r="34" fill="none" stroke="${color}" stroke-width="9" stroke-linecap="round" stroke-dasharray="${(largo * pct).toFixed(1)} ${largo.toFixed(1)}" transform="rotate(-90 42 42)"/>
    <text x="42" y="47" text-anchor="middle" font-family="Poppins, sans-serif" font-size="15" font-weight="700" fill="#FFFFFF">${Math.round((horas / limite) * 100)}%</text>
  </svg>`;
}

// Tendencia de bienestar de 7 días (Pro).
export function graficaBienestar(dias) {
  const x = (i) => 14 + (i * 282) / Math.max(1, dias.length - 1);
  const y = (v) => 100 - ((v - 1) / 6) * 84;
  const linea = (campo, color) => {
    const pts = dias.filter((d) => d[campo] !== undefined).map((d) => `${x(d.i).toFixed(1)},${y(d[campo]).toFixed(1)}`).join(' ');
    return `<polyline points="${pts}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>`;
  };
  return `<svg viewBox="0 0 310 110" class="grafica" role="img" aria-label="Tendencia de fatiga y sueño en 7 días">
    <line x1="0" x2="310" y1="${y(5)}" y2="${y(5)}" stroke="rgba(245,196,81,0.5)" stroke-dasharray="3 4"/>
    ${linea('fatiga', '#FF9BB8')}${linea('sueno', '#9CCBFF')}
  </svg>`;
}

// Personaje de bienvenida (ilustración original).
export const ILUSTRACION_BIENVENIDA = `<svg viewBox="0 0 300 170" aria-hidden="true" class="ilustracion">
  <circle cx="150" cy="92" r="74" fill="#FFFFFF" fill-opacity="0.14"/>
  <circle cx="150" cy="92" r="54" fill="#FFFFFF" fill-opacity="0.1"/>
  <path d="M86 170 C88 132 112 118 150 118 C188 118 212 132 214 170 Z" fill="#1B1640"/>
  <path d="M140 126 L138 148 M160 126 L162 148" stroke="#9D92FF" stroke-width="3" stroke-linecap="round"/>
  <rect x="140" y="102" width="20" height="20" rx="6" fill="#C98B63"/>
  <circle cx="150" cy="80" r="30" fill="#D9A07A"/>
  <path d="M120 78 C118 52 136 44 152 44 C172 44 184 56 181 76 C172 66 160 62 146 64 C136 66 128 70 120 78 Z" fill="#1B1640"/>
  <circle cx="139" cy="84" r="3" fill="#1B1640"/><circle cx="161" cy="84" r="3" fill="#1B1640"/>
  <path d="M141 95 Q150 101 159 95" stroke="#1B1640" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <path d="M116 82 A34 34 0 0 1 184 82" stroke="#FFFFFF" stroke-width="6" fill="none" stroke-linecap="round"/>
  <rect x="108" y="74" width="14" height="24" rx="7" fill="#6A5AF9" stroke="#FFFFFF" stroke-width="2"/>
  <rect x="178" y="74" width="14" height="24" rx="7" fill="#6A5AF9" stroke="#FFFFFF" stroke-width="2"/>
  <path d="M115 98 Q118 112 134 110" stroke="#FFFFFF" stroke-width="3" fill="none" stroke-linecap="round"/>
  <circle cx="136" cy="110" r="4" fill="#FFFFFF"/>
  <g transform="translate(30 30)" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" fill="none"><path d="M6 7v18M1 11v10M26 7v18M31 11v10M6 16h20"/></g>
  <g transform="translate(236 24)" stroke="#FFFFFF" stroke-width="3" fill="none" stroke-linecap="round"><circle cx="16" cy="16" r="11"/><path d="M16 0v8M16 24v8M0 16h8M24 16h8"/></g>
  <g transform="translate(240 112)"><path d="M16 30s-14-9-14-20a8 8 0 0 1 14-5.2A8 8 0 0 1 30 10c0 11-14 20-14 20z" fill="#FF9BB8"/></g>
  <g transform="translate(26 110)" stroke="#FFFFFF" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M2 28l10-10 7 7 12-13"/><path d="M23 12h8v8"/></g>
</svg>`;
