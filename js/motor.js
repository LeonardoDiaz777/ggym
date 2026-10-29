// Motor de GGym: analiza partidas y arma el plan de entrenamiento con reglas (sin IA en el MVP).
import { RANGOS, INDICADORES, DIMENSIONES, EJERCICIOS, BLOQUES, MICROCICLOS } from './datos.js';

// ---------- Fechas ----------
export function fechaISO(d = new Date()) {
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dia = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${dia}`;
}
export function desdeISO(iso) {
  const [a, m, d] = iso.split('-').map(Number);
  return new Date(a, m - 1, d);
}
export function sumarDias(iso, n) {
  const d = desdeISO(iso);
  d.setDate(d.getDate() + n);
  return fechaISO(d);
}
export function diasEntre(desde, hasta) {
  return Math.round((desdeISO(hasta) - desdeISO(desde)) / 86400000);
}
// Lunes de la semana de una fecha.
export function lunesDe(iso) {
  const dia = desdeISO(iso).getDay(); // 0 = domingo
  return sumarDias(iso, dia === 0 ? -6 : 1 - dia);
}

// ---------- Números ----------
export function formato(valor, decimales = 0) {
  return Number(valor).toLocaleString('es-CO', { minimumFractionDigits: decimales, maximumFractionDigits: decimales });
}
export function formatoIndicador(ind, valor) {
  return formato(valor, ind.decimales);
}

// ---------- Rangos y promedios ----------
export function rangoSiguiente(rango) {
  const i = RANGOS.indexOf(rango);
  return RANGOS[Math.min(i + 1, RANGOS.length - 1)];
}
export function promedio(ind, rango, rol) {
  const base = ind.valores[RANGOS.indexOf(rango)];
  const ajuste = (ind.ajusteRol && ind.ajusteRol[rol]) || 1;
  return base * ajuste;
}
// Brecha: cuánto le falta al jugador para llegar al objetivo (0,25 = 25 % peor). Negativa = ya lo supera.
export function brecha(ind, valor, objetivo) {
  if (!objetivo) return 0;
  return ind.mayorMejor ? (objetivo - valor) / objetivo : (valor - objetivo) / objetivo;
}

export function promedioPartidas(partidas) {
  const r = {};
  INDICADORES.forEach((ind) => {
    r[ind.id] = partidas.reduce((s, p) => s + p.indicadores[ind.id], 0) / partidas.length;
  });
  return r;
}

// Regla 1: brecha de cada indicador frente al promedio del rango siguiente.
// La mecánica pesa más (peso 1,3) porque es la dimensión prioritaria del proyecto.
export function analizar(valores, perfil) {
  const siguiente = rangoSiguiente(perfil.rango);
  return INDICADORES.map((ind) => {
    const actual = promedio(ind, perfil.rango, perfil.rol);
    const objetivo = promedio(ind, siguiente, perfil.rol);
    const b = brecha(ind, valores[ind.id], objetivo);
    return {
      ind,
      valor: valores[ind.id],
      actual,
      siguiente: objetivo,
      brecha: b,
      prioridad: b * DIMENSIONES[ind.dim].peso,
      estado: brecha(ind, valores[ind.id], actual) > 0.05 ? 'bajo' : b > 0 ? 'cerca' : 'bien',
    };
  }).sort((a, b) => b.prioridad - a.prioridad);
}

// Regla 2: las 3 brechas mayores definen el foco.
export function falencias(analisis) {
  return analisis.filter((a) => a.brecha > 0).slice(0, 3);
}

export function focoSemana(estado) {
  const valores = promedioPartidas(estado.partidas);
  return falencias(analizar(valores, estado.perfil)).map((f) => f.ind.id);
}

// En cuántas de las últimas partidas el jugador quedó por debajo del promedio de su rango.
export function patrones(partidas, perfil) {
  return INDICADORES.map((ind) => {
    const actual = promedio(ind, perfil.rango, perfil.rol);
    const veces = partidas.filter((p) => brecha(ind, p.indicadores[ind.id], actual) > 0.05).length;
    return { ind, veces, total: partidas.length };
  }).filter((p) => p.veces > 0).sort((a, b) => b.veces - a.veces);
}

export function derrotasSeguidas(partidas) {
  let n = 0;
  for (const p of partidas) {
    if (p.victoria) break;
    n += 1;
  }
  return n;
}

// Explicación sencilla según el tono que eligió el jugador.
export function explicar(f, perfil) {
  const ind = f.ind;
  const pct = Math.round(f.brecha * 100);
  const sig = rangoSiguiente(perfil.rango);
  const comp = `${formatoIndicador(ind, f.valor)} frente a ${formatoIndicador(ind, f.siguiente)} ${ind.unidad}`;
  if (perfil.tono === 'exigente') {
    return `Aquí estás perdiendo partidas: estás un ${pct} % por detrás de ${sig} (${comp}). ${ind.consejo} Esta semana no se negocia.`;
  }
  if (perfil.tono === 'tecnico') {
    return `Brecha del ${pct} % frente al promedio de ${sig}: ${comp}. ${ind.consejo}`;
  }
  return `Vas por buen camino, pero aquí tienes margen: estás un ${pct} % por detrás de lo que se ve en ${sig} (${comp}). ${ind.consejo}`;
}

// ---------- Plan de entrenamiento ----------
export function semanaDelPlan(inicio, hoy) {
  return Math.min(6, Math.max(1, Math.floor(diasEntre(inicio, hoy) / 7) + 1));
}

function item(id, extra = {}) {
  const e = EJERCICIOS[id];
  return { id, ...e, ...extra };
}

function redondear5(min) {
  return Math.max(5, Math.round(min / 5) * 5);
}

// Cumplimiento de un día: { hechos, total }.
export function cumplimientoDia(estado, fecha) {
  const plan = planDelDia(estado, fecha, { sinAjusteCumplimiento: true });
  const hechos = (estado.hechos[fecha] || []).filter((id) => plan.items.some((i) => i.id === id)).length;
  return { hechos, total: plan.items.length };
}

// Regla 6: cumplimiento de los días anteriores de esta semana.
function cumplimientoPrevioSemana(estado, fecha) {
  const lunes = lunesDe(fecha);
  let hechos = 0;
  let total = 0;
  for (let f = lunes; f < fecha; f = sumarDias(f, 1)) {
    if (f < estado.perfil.inicio) continue;
    const c = cumplimientoDia(estado, f);
    hechos += c.hechos;
    total += c.total;
  }
  return total === 0 ? null : hechos / total;
}

// Arma el plan de un día con las reglas 2 a 6.
export function planDelDia(estado, fecha, opciones = {}) {
  const { perfil } = estado;
  const foco = focoSemana(estado);
  const semana = semanaDelPlan(perfil.inicio, fecha);
  const micro = MICROCICLOS[semana - 1];
  const diaSemana = desdeISO(fecha).getDay(); // 0 domingo, 6 sábado
  const indiceDia = diasEntre(lunesDe(fecha), fecha); // 0 lunes ... 6 domingo
  const avisos = [];

  // Regla 4: volumen según disponibilidad diaria y microciclo.
  let partidas = Math.max(1, Math.round((perfil.disponibilidad / 60) * micro.carga));
  let factorBloques = micro.carga;

  // Regla 5: fatiga alta o mal sueño → menos carga.
  const registro = estado.bienestar[fecha] || estado.bienestar[sumarDias(fecha, -1)];
  const fatigado = registro && (registro.fatiga >= 5 || registro.sueno >= 5);
  if (fatigado) {
    partidas = Math.max(1, partidas - 1);
    factorBloques *= 0.7;
    avisos.push({ tipo: 'alerta', texto: 'Bajamos la carga de hoy porque reportaste fatiga alta o mal sueño.' });
  }

  // Regla 6: si no cumplió el plan, se notifica y se ajusta.
  if (!opciones.sinAjusteCumplimiento) {
    const previo = cumplimientoPrevioSemana(estado, fecha);
    if (previo !== null && previo < 0.5) {
      partidas = Math.max(1, partidas - 1);
      avisos.push({ tipo: 'info', texto: `Esta semana llevas el ${Math.round(previo * 100)} % del plan. Lo ajustamos a tu ritmo para que puedas cumplirlo.` });
    }
  }

  const items = [];
  // Domingo: descanso activo, sin partidas.
  if (diaSemana === 0) {
    items.push(item('aerobico'));
    items.push(item('movilidad'));
    return { fecha, tipo: 'descanso', semana, micro, foco, items, avisos };
  }

  const ajustar = (it) => ({ ...it, min: redondear5(it.min * factorBloques) });
  const focoDelDia = foco[indiceDia % Math.max(1, foco.length)];
  const variante = Math.floor(indiceDia / Math.max(1, foco.length)) % 2;

  // Regla 3: física y psicológica siempre en dosis base.
  items.push(item('calentamiento'));

  if (diaSemana === 6) {
    // Sábado: día ligero.
    if (focoDelDia) items.push(ajustar(item(BLOQUES[focoDelDia][1])));
    partidas = Math.max(1, partidas - 1);
  } else {
    // Bloque mecánico (dimensión prioritaria): siempre presente.
    const mecanicoFoco = foco.find((id) => INDICADORES.find((i) => i.id === id).dim === 'mecanica');
    const bloqueMec = BLOQUES[mecanicoFoco || (indiceDia % 2 === 0 ? 'farmeo' : 'habilidades')];
    items.push(ajustar(item(bloqueMec[indiceDia % 2])));
    // Bloque táctico según la falencia del día.
    const tactico = foco.find((id, i) => i === indiceDia % foco.length && INDICADORES.find((x) => x.id === id).dim !== 'mecanica')
      || foco.find((id) => INDICADORES.find((x) => x.id === id).dim !== 'mecanica');
    if (tactico) items.push(ajustar(item(BLOQUES[tactico][variante])));
    // Cognitiva martes y jueves, si no hay fatiga.
    if ((diaSemana === 2 || diaSemana === 4) && !fatigado) items.push(item(diaSemana === 2 ? 'reaccion' : 'memoria-tiempos'));
  }

  // Partidas con objetivo concreto.
  const indFoco = INDICADORES.find((i) => i.id === focoDelDia) || INDICADORES[0];
  const meta = promedio(indFoco, perfil.rango, perfil.rol);
  items.push({
    id: 'partidas',
    nombre: `${partidas} ${partidas === 1 ? 'partida' : 'partidas'} con foco en ${indFoco.nombre.toLowerCase()}`,
    dim: 'tactica',
    min: partidas * 35,
    detalle: `Meta: ${indFoco.mayorMejor ? 'al menos' : 'máximo'} ${formatoIndicador(indFoco, meta)} ${indFoco.unidad}. Si pierdes 2 seguidas, haz una pausa de 15 minutos.`,
    exito: 'Cumples la meta en al menos una partida',
  });
  if (partidas >= 2) items.push(item('pausa-activa'));
  items.push(item('respiracion'));

  return { fecha, tipo: diaSemana === 6 ? 'ligero' : 'entreno', semana, micro, foco, items, avisos };
}

export function minutosTotales(items) {
  return items.reduce((s, i) => s + i.min, 0);
}

export function textoMinutos(min) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h === 0) return `${m} min`;
  return m === 0 ? `${h} h` : `${h} h ${m} min`;
}

export function textoHoras(horas) {
  const h = Math.floor(horas);
  const m = Math.round((horas - h) * 60);
  if (h === 0) return `${m} min`;
  return m === 0 ? `${h} h` : `${h} h ${m} min`;
}

// ---------- Progreso ----------
export function resumenCumplimiento(estado, hoy) {
  let hechos = 0;
  let total = 0;
  let sesiones = 0;
  let dias = 0;
  for (let f = estado.perfil.inicio; f < hoy; f = sumarDias(f, 1)) {
    const c = cumplimientoDia(estado, f);
    hechos += c.hechos;
    total += c.total;
    dias += 1;
    if (c.total > 0 && c.hechos / c.total >= 0.8) sesiones += 1;
  }
  return { porcentaje: total ? Math.round((hechos / total) * 100) : 0, sesiones, dias };
}

export function racha(estado, hoy) {
  let n = 0;
  let f = (estado.hechos[hoy] || []).length > 0 ? hoy : sumarDias(hoy, -1);
  while (f >= estado.perfil.inicio && (estado.hechos[f] || []).length > 0) {
    n += 1;
    f = sumarDias(f, -1);
  }
  return n;
}

// Los logros premian cumplir el plan y descansar, nunca jugar más horas.
export function logros(estado, hoy) {
  const r = racha(estado, hoy);
  const fechas = Object.keys(estado.hechos);
  const diaCompleto = fechas.some((f) => {
    const c = cumplimientoDia(estado, f);
    return c.total > 0 && c.hechos === c.total;
  });
  const registros = Object.keys(estado.bienestar).length;
  const dentroLimite = Object.values(estado.bienestar).filter((b) => b.horas !== undefined && b.horas <= 4).length;
  const descanso = Object.keys(estado.hechos).some((f) => desdeISO(f).getDay() === 0 && estado.hechos[f].length > 0);
  return [
    { id: 'racha', nombre: `Racha de ${Math.max(r, 3)} días`, logrado: r >= 3, icono: 'llama', detalle: 'Entrena 3 días seguidos' },
    { id: 'completo', nombre: 'Sesión completa', logrado: diaCompleto, icono: 'check', detalle: 'Completa todo el plan de un día' },
    { id: 'descanso', nombre: 'Descanso activo', logrado: descanso, icono: 'luna', detalle: 'Cumple un domingo de descanso activo' },
    { id: 'limite', nombre: 'Dentro del límite', logrado: dentroLimite >= 5, icono: 'reloj', detalle: '5 días jugando 4 h o menos' },
    { id: 'bienestar', nombre: 'Me escucho', logrado: registros >= 7, icono: 'corazon', detalle: '7 registros de bienestar' },
    { id: 'division', nombre: 'Sube de división', logrado: false, icono: 'candado', detalle: 'Se desbloquea con datos reales' },
  ];
}

// Alertas de bienestar y carga.
export function alertas(estado, hoy) {
  const lista = [];
  const derrotas = derrotasSeguidas(estado.partidas);
  if (derrotas >= 3) {
    lista.push({ tipo: 'alerta', titulo: `${derrotas} derrotas seguidas`, texto: 'Toma 15 minutos lejos de la pantalla antes de volver a jugar. Jugar con frustración suele empeorar la siguiente partida.' });
  }
  const b = estado.bienestar[hoy];
  if (b && b.horas > 4) {
    lista.push({ tipo: 'alerta', titulo: 'Superaste el límite de 4 h', texto: 'Por hoy es suficiente. El descanso también es parte del entrenamiento.' });
  } else if (b && b.horas >= 2.5) {
    lista.push({ tipo: 'info', titulo: `Llevas ${textoHoras(b.horas)} jugando`, texto: 'Haz una pausa activa de 5 minutos antes de la siguiente partida.' });
  }
  if (b && (b.fatiga >= 5 || b.sueno >= 5)) {
    lista.push({ tipo: 'info', titulo: 'Carga reducida', texto: 'Tu plan de hoy tiene menos volumen por la fatiga o el mal sueño que reportaste.' });
  }
  if (b && b.molestias >= 5) {
    lista.push({ tipo: 'alerta', titulo: 'Molestias altas', texto: 'Haz solo los ejercicios suaves. Si la molestia dura más de una semana, consulta a un profesional de la salud.' });
  }
  return lista;
}
