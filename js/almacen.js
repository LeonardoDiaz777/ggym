// Guarda los datos del jugador solo en su propio celular (localStorage).
// No se envían a ningún servidor. El jugador puede borrarlos desde su perfil.
import { fechaISO, sumarDias, planDelDia, promedioPartidas } from './motor.js';

const CLAVE = 'ggym.v1';

export function cargar() {
  try {
    const texto = localStorage.getItem(CLAVE);
    return texto ? JSON.parse(texto) : null;
  } catch (e) {
    return null;
  }
}

export function guardar(estado) {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(estado));
  } catch (e) {
    // Si el navegador no deja guardar, la app sigue funcionando mientras esté abierta.
  }
}

export function borrar() {
  try {
    localStorage.removeItem(CLAVE);
  } catch (e) {
    // nada que borrar
  }
}

export function estadoNuevo(perfil, partidas) {
  const hoy = fechaISO();
  const estado = {
    version: 1,
    perfil: { ...perfil, inicio: hoy, pro: false },
    partidas: partidas.slice(0, 5), // máximo 5 partidas por usuario
    hechos: {},
    bienestar: {},
    lp: [{ fecha: hoy, lp: 54 }],
    lineaBase: null,
    reaccion: [],
    avisarVideo: false,
  };
  estado.lineaBase = promedioPartidas(estado.partidas);
  return estado;
}

// Carga 10 días de historial de ejemplo para la presentación del proyecto.
export function cargarDemostracion(estado) {
  const hoy = fechaISO();
  estado.perfil.inicio = sumarDias(hoy, -10);
  estado.perfil.demo = true;

  // Historial de LP de los últimos 10 días.
  const lp = [22, 30, 18, 35, 41, 33, 47, 52, 44, 54];
  estado.lp = lp.map((v, i) => ({ fecha: sumarDias(hoy, i - 9), lp: v }));

  // Bienestar de los últimos 8 días.
  const registros = [
    [3, 4, 4, 2, 3.5], [4, 5, 4, 3, 4.5], [3, 3, 3, 2, 3], [2, 3, 3, 2, 2.5],
    [3, 4, 3, 2, 3], [2, 2, 2, 1, 2], [3, 3, 4, 2, 3], [3, 4, 3, 2, 2.5],
  ];
  registros.forEach((r, i) => {
    estado.bienestar[sumarDias(hoy, i - 8)] = { sueno: r[0], fatiga: r[1], estres: r[2], molestias: r[3], horas: r[4] };
  });

  // Ejercicios hechos: la mayoría completos y una racha de 4 días al final.
  for (let d = 10; d >= 1; d -= 1) {
    const fecha = sumarDias(hoy, -d);
    if (d === 5) continue; // un día sin entrenar
    const plan = planDelDia(estado, fecha, { sinAjusteCumplimiento: true });
    const ids = plan.items.map((i) => i.id);
    estado.hechos[fecha] = d % 3 === 0 ? ids.slice(0, Math.max(1, ids.length - 2)) : ids;
  }

  estado.lineaBase = calcularLineaBase(estado);

  estado.reaccion = [
    { fecha: sumarDias(hoy, -8), ms: 312 },
    { fecha: sumarDias(hoy, -6), ms: 296 },
    { fecha: sumarDias(hoy, -1), ms: 284 },
  ];
  return estado;
}

// Línea base = indicadores al empezar el plan.
// En la demostración se simula que al inicio estaban un poco peor, para mostrar la comparación antes/ahora.
export function calcularLineaBase(estado) {
  const ahora = promedioPartidas(estado.partidas);
  if (!estado.perfil.demo) return ahora;
  const peor = { vision: 0.86, muertes: 1.16, farmeo: 0.94, objetivos: 0.92, decisiones: 1.08 };
  const base = {};
  Object.keys(ahora).forEach((id) => {
    base[id] = ahora[id] * (peor[id] || 1);
  });
  return base;
}
