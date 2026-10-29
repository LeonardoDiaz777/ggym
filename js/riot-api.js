// Conexión con Riot Games.
//
// ESTADO ACTUAL: modo demostración. Las partidas se generan con datos de ejemplo.
//
// CÓMO SE CONECTARÁ DESPUÉS (cuando Riot apruebe la clave):
// 1. Un servidor propio guardará la clave de Riot en una variable de entorno.
//    La clave NUNCA va en esta app ni en el repositorio.
// 2. Esta función llamará a ese servidor, por ejemplo: fetch(`${SERVIDOR}/partidas?riotId=...`).
// 3. El servidor pedirá a Riot las últimas 5 partidas clasificatorias (API Match-V5)
//    y devolverá los indicadores ya calculados con el mismo formato que usa generarPartidasEjemplo().

import { INDICADORES, CAMPEONES } from './datos.js';
import { promedio } from './motor.js';

export const MODO_DEMO = true;

export async function obtenerPartidas(perfil) {
  await new Promise((r) => setTimeout(r, 1400));
  return generarPartidasEjemplo(perfil);
}

// Generador aleatorio con semilla: el mismo Riot ID siempre produce las mismas partidas.
function generadorAleatorio(texto) {
  let h = 1779033703 ^ texto.length;
  for (let i = 0; i < texto.length; i += 1) {
    h = Math.imul(h ^ texto.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  };
}

// Perfil de ejemplo: un jugador con buena base pero con fallas en visión, muertes y farmeo.
const PERFIL_EJEMPLO = {
  farmeo: 0.85, habilidades: 0.97, oleadas: 0.95, vision: 0.72, muertes: 1.22,
  decisiones: 1.15, rotaciones: 0.97, objetivos: 0.82, picks: 1.0,
};

export function generarPartidasEjemplo(perfil) {
  const rnd = generadorAleatorio(`${perfil.riotId}|${perfil.rol}|${perfil.rango}`);
  const campeones = CAMPEONES[perfil.rol];
  const resultados = [false, false, false, true, true]; // de la más reciente a la más antigua
  const ahora = Date.now();

  return resultados.map((victoria, n) => {
    const indicadores = {};
    INDICADORES.forEach((ind) => {
      let factor = PERFIL_EJEMPLO[ind.id] * (1 + (rnd() - 0.5) * 0.24);
      if (victoria) factor = ind.mayorMejor ? factor * 1.08 : factor * 0.88;
      const v = promedio(ind, perfil.rango, perfil.rol) * factor;
      const pot = 10 ** ind.decimales;
      indicadores[ind.id] = Math.round(v * pot) / pot;
    });
    const muertes = Math.max(1, Math.round(indicadores.muertes));
    const asesinatos = perfil.rol === 'Support' ? 1 + Math.floor(rnd() * 3) : 3 + Math.floor(rnd() * 6);
    const asistencias = perfil.rol === 'Support' ? 10 + Math.floor(rnd() * 8) : 4 + Math.floor(rnd() * 8);
    const sinVision = Math.round(muertes * (indicadores.decisiones / 100));

    // Posiciones en el minimapa (0 a 200). Las muertes sin visión se concentran cerca del dragón.
    const posMuertes = Array.from({ length: muertes }, (_, i) => (i < sinVision
      ? { x: 112 + Math.round(rnd() * 50), y: 112 + Math.round(rnd() * 50) }
      : { x: 30 + Math.round(rnd() * 140), y: 30 + Math.round(rnd() * 140) }));
    const guardas = Math.max(1, Math.round(indicadores.vision * 3));
    const posGuardas = Array.from({ length: guardas }, () => ({ x: 50 + Math.round(rnd() * 100), y: 50 + Math.round(rnd() * 100) }));

    return {
      id: `LA1_${Math.floor(rnd() * 1e9)}`,
      fecha: new Date(ahora - n * 9 * 3600000).toISOString(),
      campeon: campeones[n % campeones.length],
      victoria,
      duracion: 24 + Math.floor(rnd() * 11),
      kda: [asesinatos, muertes, asistencias],
      indicadores,
      posMuertes,
      sinVision,
      posGuardas,
    };
  });
}
