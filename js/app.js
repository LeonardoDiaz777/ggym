// GGym: pantallas y navegación.
import { RANGOS, ROLES, DIMENSIONES, INDICADORES, MICROCICLOS, JUGADORES_COACH } from './datos.js';
import {
  fechaISO, sumarDias, lunesDe, desdeISO, formato, formatoIndicador, rangoSiguiente, promedio,
  analizar, falencias, focoSemana, promedioPartidas, patrones, explicar,
  planDelDia, cumplimientoDia, minutosTotales, textoMinutos, textoHoras,
  resumenCumplimiento, racha, logros, alertas,
} from './motor.js';
import { cargar, guardar, borrar, estadoNuevo, cargarDemostracion, calcularLineaBase } from './almacen.js';
import { obtenerPartidas, generarPartidasEjemplo, MODO_DEMO } from './riot-api.js';
import {
  icono, ICONO_DIM, emblema, minimapa, graficaLP, minilinea, medidor, graficaBienestar, ILUSTRACION_BIENVENIDA,
} from './graficos.js';

const app = document.getElementById('app');
let estado = cargar();
let rutaAnterior = null;

const ui = {
  vistaAnalisis: 'una',
  partidaSel: 0,
  diaSel: null,
  pausaAbierta: false,
  cargando: false,
  toast: null,
  form: {
    riotId: '', rol: 'Support', rango: 'Oro', disponibilidad: 120, tono: 'amigable',
    menor: false, tutor: false, consentimiento: false, demo: true, error: '',
  },
};

// ---------- Utilidades ----------
const hoy = () => fechaISO();

function esc(texto) {
  return String(texto).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function nombreJugador() {
  return estado.perfil.riotId.split('#')[0];
}

function divisionTexto(rango) {
  return rango === 'Maestro' ? 'Maestro' : `${rango} II`;
}

function lpActual() {
  return estado.lp[estado.lp.length - 1].lp;
}

function mayus(t) {
  return t.charAt(0).toUpperCase() + t.slice(1);
}

function nombreDia(iso) {
  if (iso === hoy()) return 'Hoy';
  return mayus(desdeISO(iso).toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' }));
}

function etiquetaDim(dim) {
  const d = DIMENSIONES[dim];
  return `<span class="etiqueta" style="background:${d.fondo};color:${d.color}">${d.nombre}</span>`;
}

function chipsFoco() {
  return focoSemana(estado).map((id, i) => {
    const ind = INDICADORES.find((x) => x.id === id);
    return `<span class="chip ${i === 0 ? 'activo' : ''}">${ind.nombre}</span>`;
  }).join('');
}

function aviso(a) {
  const alerta = a.tipo === 'alerta';
  return `<div class="aviso ${alerta ? 'aviso-alerta' : 'aviso-info'}">
    ${icono(alerta ? 'alerta' : 'info', 22, alerta ? '#F5C451' : '#B8AFFF')}
    <div>${a.titulo ? `<strong>${a.titulo}</strong>` : ''}<p>${a.texto}</p></div>
  </div>`;
}

function encabezado(titulo, subtitulo, volver) {
  return `<header class="encabezado">
    ${volver ? `<a href="#/${volver}" class="boton-icono" aria-label="Volver">${icono('atras', 20)}</a>` : ''}
    <div>${subtitulo ? `<div class="subtitulo">${subtitulo}</div>` : ''}<h1>${titulo}</h1></div>
  </header>`;
}

function bloqueadoPro(titulo, texto) {
  return `<div class="tarjeta bloqueado">
    <div class="icono-redondo">${icono('candado', 22, '#C9C2FF')}</div>
    <div class="col">
      <strong>${titulo}</strong>
      <p class="suave">${texto}</p>
      <button type="button" class="boton boton-chico" data-accion="pro">Probar GGym Pro (demo)</button>
    </div>
  </div>`;
}

function toast(texto) {
  ui.toast = texto;
  render();
  setTimeout(() => {
    ui.toast = null;
    const el = document.querySelector('.toast');
    if (el) el.remove();
  }, 2400);
}

// ---------- Navegación ----------
function ruta() {
  return location.hash.replace(/^#\/?/, '') || 'inicio';
}

function navegacion(actual) {
  const items = [['inicio', 'Inicio'], ['analisis', 'Partidas'], ['plan', 'Plan'], ['bienestar', 'Bienestar'], ['progreso', 'Progreso']];
  return `<nav class="nav" aria-label="Navegación principal">
    ${items.map(([r, nombre]) => `<a href="#/${r}" aria-label="${nombre}" ${actual === r ? 'aria-current="page" class="activo"' : ''}>${icono(r === 'analisis' ? 'partidas' : r)}<span>${nombre}</span></a>`).join('')}
  </nav>`;
}

// ---------- Pantalla 1: Bienvenida ----------
function vistaBienvenida() {
  const f = ui.form;
  const chips = (lista, campo, actual, fmt = (x) => x) => lista.map((v) => `<button type="button" class="chip ${actual === v ? 'activo' : ''}" aria-pressed="${actual === v}" data-accion="form" data-campo="${campo}" data-valor="${v}">${fmt(v)}</button>`).join('');
  return `<section class="pantalla">
    <div class="marca">${logo()}<span>GGym</span></div>
    <div class="tarjeta destacada">
      ${ILUSTRACION_BIENVENIDA}
      <h1 class="titular">Entrena como atleta. Sube de rango.</h1>
      <p>Analizamos tus partidas y te damos un plan semanal de mecánica, táctica, mente y cuerpo.</p>
    </div>
    <form id="form-bienvenida" class="col gap" novalidate>
      <div class="campo">
        <label for="riot-id">Riot ID</label>
        <input id="riot-id" name="riotId" type="text" autocomplete="off" placeholder="NombreDeJugador#LAN" value="${esc(f.riotId)}">
      </div>
      <div class="campo"><span class="etiqueta-campo">Juego</span>
        <div class="chips">
          <span class="chip activo">League of Legends</span>
          <span class="chip deshabilitado">Valorant · pronto</span>
          <span class="chip deshabilitado">CS2 · pronto</span>
        </div>
      </div>
      <div class="campo"><span class="etiqueta-campo">Tu rol principal</span><div class="chips">${chips(ROLES, 'rol', f.rol)}</div></div>
      <div class="campo">
        <label for="rango">Rango actual</label>
        <select id="rango" name="rango">${RANGOS.map((r) => `<option ${r === f.rango ? 'selected' : ''}>${r}</option>`).join('')}</select>
      </div>
      <div class="campo"><span class="etiqueta-campo">Tiempo diario para entrenar</span><div class="chips">${chips([60, 120, 180], 'disponibilidad', f.disponibilidad, (v) => `${v / 60} h`)}</div></div>
      <div class="campo"><span class="etiqueta-campo">Tono de tu entrenador</span>
        <div class="chips">${chips(['amigable', 'exigente', 'tecnico'], 'tono', f.tono, (v) => ({ amigable: 'Amigable', exigente: 'Exigente', tecnico: 'Técnico' }[v]))}</div>
      </div>
      <label class="casilla"><input type="checkbox" name="menor" ${f.menor ? 'checked' : ''}><span>Soy menor de 18 años</span></label>
      ${f.menor ? `<label class="casilla"><input type="checkbox" name="tutor" ${f.tutor ? 'checked' : ''}><span>Mi padre, madre o tutor autorizó que use GGym</span></label>` : ''}
      <label class="casilla"><input type="checkbox" name="consentimiento" ${f.consentimiento ? 'checked' : ''}><span>Autorizo el tratamiento de mis datos según la Ley 1581 de 2012. Mis datos de bienestar se guardan solo en este celular y puedo borrarlos cuando quiera.</span></label>
      <label class="casilla"><input type="checkbox" name="demo" ${f.demo ? 'checked' : ''}><span>Cargar 10 días de ejemplo (para presentar el proyecto)</span></label>
      ${f.error ? `<div class="aviso aviso-alerta" role="alert">${icono('alerta', 22, '#F5C451')}<p>${f.error}</p></div>` : ''}
      <button type="submit" class="boton boton-grande">Conectar cuenta y analizar</button>
      <p class="nota">Modo demostración: mientras Riot aprueba la conexión, GGym usa partidas de ejemplo para tu rol y rango.</p>
    </form>
    ${ui.cargando ? `<div class="cargando" role="status"><div class="giro"></div><strong>Analizando tus últimas 5 partidas…</strong><span>Comparando con el promedio de ${f.rango} y ${rangoSiguiente(f.rango)}</span></div>` : ''}
  </section>`;
}

function logo() {
  return `<div class="logo">${icono('pesa', 22, '#FFFFFF', 2.2)}</div>`;
}

async function conectar() {
  const f = ui.form;
  const riotId = f.riotId.trim();
  if (!/^[^#]{3,16}#[A-Za-z0-9]{2,5}$/.test(riotId)) {
    f.error = 'Escribe tu Riot ID completo, con el #. Por ejemplo: Andres#LAN';
  } else if (f.menor && !f.tutor) {
    f.error = 'Si eres menor de 18 años, necesitas la autorización de tu padre, madre o tutor.';
  } else if (!f.consentimiento) {
    f.error = 'Para continuar debes autorizar el tratamiento de tus datos.';
  } else {
    f.error = '';
  }
  if (f.error) {
    render();
    return;
  }
  ui.cargando = true;
  render();
  const perfil = {
    riotId, rol: f.rol, rango: f.rango, disponibilidad: f.disponibilidad, tono: f.tono,
    menor: f.menor, juego: 'lol', demo: f.demo,
  };
  const partidas = await obtenerPartidas(perfil);
  estado = estadoNuevo(perfil, partidas);
  if (f.demo) cargarDemostracion(estado);
  guardar(estado);
  ui.cargando = false;
  location.hash = '#/inicio';
  render();
}

// ---------- Pantalla 2: Inicio ----------
function vistaInicio() {
  const { perfil } = estado;
  const plan = planDelDia(estado, hoy());
  const hechos = estado.hechos[hoy()] || [];
  const sig = rangoSiguiente(perfil.rango);
  const lp = lpActual();
  const ultima = estado.partidas[0];
  const lista = alertas(estado, hoy()).slice(0, 2);
  const r = racha(estado, hoy());
  const coloresDim = plan.items.map((i) => DIMENSIONES[i.dim].color);
  return `<section class="pantalla">
    <header class="fila gap">
      <a href="#/perfil" class="avatar" aria-label="Tu perfil">${esc(nombreJugador().charAt(0).toUpperCase())}</a>
      <div class="crece"><div class="subtitulo">Bienvenido de vuelta</div><div class="nombre">@${esc(nombreJugador())}</div></div>
      ${MODO_DEMO ? '<span class="chip chip-demo">Demo</span>' : ''}
    </header>

    <div class="col gap-chico">
      <h2>Foco de la semana</h2>
      <div class="chips">${chipsFoco()}</div>
    </div>

    <div class="tarjeta destacada">
      <div class="fila-entre"><span class="peso-medio">Rango actual · ${perfil.rol}</span>${r > 0 ? `<span class="pildora">${icono('llama', 14)} Racha ${r} ${r === 1 ? 'día' : 'días'}</span>` : ''}</div>
      <div class="fila-entre">
        <div><div class="numero-grande">${divisionTexto(perfil.rango)}</div><div class="peso-medio">${lp} LP</div></div>
        ${emblema(perfil.rango)}
      </div>
      <div class="barra barra-blanca"><span style="width:${Math.min(100, lp)}%"></span></div>
      <div class="fila-entre mini peso-medio"><span>${100 - lp} LP para la siguiente división</span><span>Meta: ${sig}</span></div>
    </div>

    ${lista.map(aviso).join('')}

    <div class="col gap-chico">
      <div class="fila-entre"><h2>${plan.tipo === 'descanso' ? 'Hoy: descanso activo' : 'Sesión de hoy'}</h2><span class="acento">${textoMinutos(minutosTotales(plan.items))}</span></div>
      <div class="tarjeta col gap-chico">
        ${plan.items.map((it, i) => `<div class="fila gap"><span class="punto" style="background:${coloresDim[i]}"></span><span class="crece texto-item ${hechos.includes(it.id) ? 'tachado' : ''}">${it.nombre}</span><span class="suave mini">${it.min} min</span></div>`).join('')}
        <a href="#/plan" class="boton">${hechos.length ? `Seguir (${hechos.filter((h) => plan.items.some((i) => i.id === h)).length} de ${plan.items.length})` : 'Empezar sesión'}</a>
      </div>
    </div>

    <div class="col gap-chico">
      <div class="fila-entre"><h2>Última partida</h2><a href="#/analisis" class="mini">Ver análisis</a></div>
      <a href="#/analisis" class="tarjeta fila gap tarjeta-enlace">
        <div class="mini-mapa">${minimapa(ultima, 64)}</div>
        <div class="crece col">
          <strong>${ultima.campeon} · ${ultima.victoria ? 'Victoria' : 'Derrota'}</strong>
          <span class="suave mini">${ultima.duracion} min · ${ultima.kda.join(' / ')}</span>
          <span class="pildora pildora-rosa">${falencias(analizar(ultima.indicadores, perfil)).length} falencias</span>
        </div>
        ${icono('derecha', 20, '#A9A6C9')}
      </a>
    </div>
  </section>`;
}

// ---------- Pantalla 3: Análisis ----------
function barrasComparacion(f, perfil) {
  const max = Math.max(f.valor, f.actual, f.siguiente) * 1.1;
  const fila = (etiqueta, valor, color, fuerte) => `<span class="${fuerte ? 'peso-fuerte' : 'suave'}">${etiqueta}</span>
    <div class="barra"><span style="width:${(valor / max) * 100}%;background:${color}"></span></div>
    <span class="derecha ${fuerte ? 'peso-fuerte' : 'suave'}">${formatoIndicador(f.ind, valor)}</span>`;
  return `<div class="comparacion">
    ${fila('Tú', f.valor, '#E8508C', true)}
    ${fila(perfil.rango, f.actual, '#6E6A99')}
    ${fila(rangoSiguiente(perfil.rango), f.siguiente, '#9D92FF')}
  </div>`;
}

function tarjetaFalencia(f, n) {
  const { perfil } = estado;
  return `<div class="tarjeta col gap-chico">
    <div class="fila-entre"><strong>${n}. ${f.ind.nombre}</strong>${etiquetaDim(f.ind.dim)}</div>
    <span class="suave mini">${mayus(f.ind.unidad)}${f.ind.mayorMejor ? '' : ' · menos es mejor'}</span>
    ${barrasComparacion(f, perfil)}
    <p class="texto">${explicar(f, perfil)}</p>
  </div>`;
}

function vistaAnalisis() {
  const { perfil } = estado;
  const una = ui.vistaAnalisis === 'una';
  const seg = `<div class="segmentado" role="group" aria-label="Tipo de análisis">
    <button type="button" class="${una ? 'activo' : ''}" aria-pressed="${una}" data-accion="vista-analisis" data-valor="una">Esta partida</button>
    <button type="button" class="${!una ? 'activo' : ''}" aria-pressed="${!una}" data-accion="vista-analisis" data-valor="cinco">Últimas 5 ${perfil.pro ? '' : icono('candado', 14)}</button>
  </div>`;
  return `<section class="pantalla">
    ${encabezado('Análisis de partida', `${perfil.rol} · ${divisionTexto(perfil.rango)}`)}
    ${seg}
    ${una ? analisisUna() : analisisCinco()}
    <a href="#/plan" class="boton boton-grande">Ver mi plan para esta semana</a>
  </section>`;
}

function analisisUna() {
  const { perfil } = estado;
  const p = estado.partidas[ui.partidaSel];
  const an = analizar(p.indicadores, perfil);
  const top = falencias(an);
  const selector = `<div class="chips desliza" role="group" aria-label="Elige la partida">
    ${estado.partidas.map((x, i) => `<button type="button" class="chip ${i === ui.partidaSel ? 'activo' : ''}" aria-pressed="${i === ui.partidaSel}" data-accion="partida" data-valor="${i}">${x.victoria ? 'V' : 'D'} · ${x.campeon}</button>`).join('')}
  </div>`;
  return `${selector}
    <div class="tarjeta ${p.victoria ? 'destacada-verde' : 'destacada-rosa'} col gap">
      <div class="fila gap-chico"><span class="pildora ${p.victoria ? 'pildora-verde' : 'pildora-rosa'}">${p.victoria ? 'Victoria' : 'Derrota'}</span><span class="pildora">Clasificatoria</span></div>
      <div class="numero-grande">${p.campeon}</div>
      <div class="grid3">
        <div class="caja"><span class="mini">KDA</span><strong>${p.kda.join(' / ')}</strong></div>
        <div class="caja"><span class="mini">Duración</span><strong>${p.duracion} min</strong></div>
        <div class="caja"><span class="mini">Rol</span><strong>${perfil.rol}</strong></div>
      </div>
    </div>
    <div class="tarjeta fila gap">
      <div class="mapa">${minimapa(p, 140)}</div>
      <div class="col gap-chico">
        <strong>Mapa de la partida</strong>
        <span class="leyenda"><svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M2 2l8 8M10 2l-8 8" stroke="#FF5C8A" stroke-width="2.5" stroke-linecap="round"/></svg>${p.posMuertes.length} muertes (${p.sinVision} sin visión)</span>
        <span class="leyenda"><svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><circle cx="6" cy="6" r="4" fill="#F5C451"/></svg>${p.posGuardas.length} guardas colocadas</span>
        <span class="leyenda"><svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><circle cx="6" cy="6" r="4.5" fill="none" stroke="#F5C451" stroke-width="1.5" stroke-dasharray="2 1.5"/></svg>Dragón</span>
      </div>
    </div>
    <h2>Tus 3 falencias principales</h2>
    ${top.length ? top.map((f, i) => tarjetaFalencia(f, i + 1)).join('') : '<div class="tarjeta"><p>¡Superaste el promedio del rango siguiente en todo! Mantén tu plan.</p></div>'}
    <h2>Todos tus indicadores</h2>
    <div class="tarjeta lista">
      ${an.map((a) => `<div class="fila-lista">
        <div class="crece col"><span class="peso-medio">${a.ind.nombre}</span><span class="suave mini">${formatoIndicador(a.ind, a.valor)} ${a.ind.unidad}</span></div>
        <span class="pildora ${a.estado === 'bajo' ? 'pildora-rosa' : a.estado === 'cerca' ? 'pildora-amarilla' : 'pildora-verde'}">${a.estado === 'bajo' ? 'Por debajo' : a.estado === 'cerca' ? 'En tu rango' : 'Nivel siguiente'}</span>
      </div>`).join('')}
    </div>`;
}

function analisisCinco() {
  const { perfil } = estado;
  if (!perfil.pro) {
    return bloqueadoPro('Tendencia de tus últimas 5 partidas', 'Descubre qué errores se repiten en tus partidas. Disponible en GGym Pro.');
  }
  const ps = estado.partidas;
  const victorias = ps.filter((p) => p.victoria).length;
  const kda = ps.reduce((s, p) => s + (p.kda[0] + p.kda[2]) / Math.max(1, p.kda[1]), 0) / ps.length;
  const pats = patrones(ps, perfil);
  const foco = focoSemana(estado);
  const cronologico = [...ps].reverse();
  return `<div class="grid2">
      <div class="tarjeta stat"><span class="suave mini">Victorias</span><strong>${victorias} de ${ps.length}</strong></div>
      <div class="tarjeta stat"><span class="suave mini">KDA promedio</span><strong>${formato(kda, 1)}</strong></div>
    </div>
    <h2>Patrones en tus últimas 5 partidas</h2>
    <div class="tarjeta lista">
      ${pats.map((p) => `<div class="fila-lista">
        <div class="crece col"><span class="peso-medio">${p.ind.nombre}</span><span class="suave mini">Por debajo de ${perfil.rango} en ${p.veces} de ${p.total} partidas</span></div>
        <span class="pildora ${p.veces >= 4 ? 'pildora-rosa' : p.veces >= 3 ? 'pildora-amarilla' : ''}">${p.veces >= 4 ? 'Alta' : p.veces >= 3 ? 'Media' : 'Baja'}</span>
      </div>`).join('') || '<p>Sin patrones negativos. ¡Buen trabajo!</p>'}
    </div>
    <h2>Evolución de tu foco</h2>
    ${foco.map((id) => {
      const ind = INDICADORES.find((x) => x.id === id);
      const valores = cronologico.map((p) => p.indicadores[id]);
      return `<div class="tarjeta fila gap">
        <div class="crece col"><span class="peso-medio">${ind.nombre}</span><span class="suave mini">Línea punteada: promedio ${perfil.rango}</span></div>
        ${minilinea(valores, promedio(ind, perfil.rango, perfil.rol), DIMENSIONES[ind.dim].color)}
      </div>`;
    }).join('')}`;
}

// ---------- Pantalla 4: Plan semanal ----------
function colorDia(f) {
  if (f < estado.perfil.inicio || f > hoy()) return '#4A4478';
  const c = cumplimientoDia(estado, f);
  if (c.total === 0) return '#4A4478';
  const pct = c.hechos / c.total;
  if (pct >= 0.8) return '#86EFAC';
  if (pct > 0) return '#F5C451';
  return f === hoy() ? '#FFFFFF' : '#FF9BB8';
}

function vistaPlan() {
  const { perfil } = estado;
  const fecha = ui.diaSel || hoy();
  const plan = planDelDia(estado, fecha);
  const hechos = estado.hechos[fecha] || [];
  const hechosPlan = plan.items.filter((i) => hechos.includes(i.id)).length;
  const lunes = lunesDe(hoy());
  const dias = Array.from({ length: 7 }, (_, i) => sumarDias(lunes, i));
  const letras = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
  const futuro = fecha > hoy();
  const antesInicio = fecha < perfil.inicio;
  return `<section class="pantalla">
    ${encabezado('Tu plan semanal', `Semana ${plan.semana} de 6 · Microciclo de ${plan.micro.nombre.toLowerCase()}`)}
    <div class="chips">${chipsFoco()}</div>
    <div class="semana" role="group" aria-label="Días de la semana">
      ${dias.map((d, i) => `<button type="button" class="dia ${d === fecha ? 'activo' : ''}" aria-pressed="${d === fecha}" aria-label="${nombreDia(d)}" data-accion="dia" data-valor="${d}">
        <span>${letras[i]}</span><span class="punto" style="background:${d === fecha ? '#FFFFFF' : colorDia(d)}"></span>
      </button>`).join('')}
    </div>
    ${plan.avisos.map(aviso).join('')}
    <div class="col gap-chico">
      <div class="fila-entre"><h2>${nombreDia(fecha)} · ${textoMinutos(minutosTotales(plan.items))}</h2><span class="acento mini">${hechosPlan} de ${plan.items.length} hechos</span></div>
      <div class="barra"><span style="width:${(hechosPlan / Math.max(1, plan.items.length)) * 100}%;background:linear-gradient(90deg,#6A5AF9,#E8508C)"></span></div>
    </div>
    ${antesInicio ? '<div class="tarjeta"><p class="suave">Este día fue antes de empezar tu plan.</p></div>' : `<div class="col gap-chico">${plan.items.map((it) => itemPlan(it, fecha, hechos.includes(it.id), futuro)).join('')}</div>`}
    ${perfil.pro ? planSeisSemanas(plan.semana) : bloqueadoPro('Plan completo de 6 semanas', 'Ve tu periodización completa: adaptación, carga, descarga y evaluación.')}
    <div class="aviso aviso-info">${icono('info', 22, '#B8AFFF')}<p>Cada domingo revisamos tu semana. Si no completas el plan, te avisamos y lo ajustamos a tu ritmo.</p></div>
  </section>`;
}

function itemPlan(it, fecha, hecho, futuro) {
  const d = DIMENSIONES[it.dim];
  const esHoy = fecha === hoy();
  return `<div class="tarjeta item ${hecho ? 'hecho' : ''}">
    <div class="icono-dim" style="background:${d.fondo}">${icono(ICONO_DIM[it.dim], 26, d.color)}</div>
    <div class="crece col gap-mini">
      <strong class="titulo-item">${it.nombre}</strong>
      <span class="suave mini">${it.detalle}</span>
      <span class="mini exito">${icono('estrella', 12, '#F5C451')} ${it.exito}</span>
      <div class="fila gap-chico">${etiquetaDim(it.dim)}<span class="suave mini">${it.min} min</span></div>
      ${it.accion === 'reaccion' && esHoy ? '<a href="#/reaccion" class="boton boton-chico">Hacer la prueba</a>' : ''}
    </div>
    <button type="button" class="check ${hecho ? 'marcado' : ''}" ${futuro ? 'disabled' : ''} aria-pressed="${hecho}" aria-label="${futuro ? 'Disponible ese día' : hecho ? `Desmarcar: ${esc(it.nombre)}` : `Marcar como hecho: ${esc(it.nombre)}`}" data-accion="hecho" data-valor="${it.id}" data-fecha="${fecha}">${icono('check', 16, 'currentColor', 3)}</button>
  </div>`;
}

function planSeisSemanas(actual) {
  const max = Math.max(...MICROCICLOS.map((m) => m.carga));
  return `<div class="tarjeta col gap">
    <div class="fila-entre"><h2>Plan de 6 semanas</h2><span class="pildora">Pro</span></div>
    <div class="periodizacion">
      ${MICROCICLOS.map((m) => `<div class="col-barra ${m.semana === actual ? 'actual' : ''}">
        <div class="barra-vertical"><span style="height:${(m.carga / max) * 100}%"></span></div>
        <span class="mini">S${m.semana}</span>
      </div>`).join('')}
    </div>
    <p class="mini suave"><strong class="blanco">Semana ${actual}: ${MICROCICLOS[actual - 1].nombre}.</strong> ${MICROCICLOS[actual - 1].descripcion}</p>
  </div>`;
}

// ---------- Prueba de reacción (dimensión cognitiva) ----------
let rx = null;

function vistaReaccion() {
  return `<section class="pantalla">
    ${encabezado('Prueba de reacción', 'Dimensión cognitiva', 'plan')}
    <p class="texto">Toca el recuadro apenas se ponga violeta. Son 5 intentos; usamos tu promedio.</p>
    <button type="button" id="zona-reaccion" class="zona-reaccion"><strong id="rx-titulo">Toca para empezar</strong><span id="rx-sub">Ponte cómodo, como si fueras a jugar</span></button>
    <div id="rx-intentos" class="chips"></div>
    <div id="rx-final"></div>
  </section>`;
}

function iniciarReaccion() {
  if (rx && rx.timer) clearTimeout(rx.timer);
  rx = { intentos: [], fase: 'listo', t0: 0, timer: null };
}

function pintarReaccion(titulo, sub, clase) {
  const zona = document.getElementById('zona-reaccion');
  if (!zona) return;
  zona.className = `zona-reaccion ${clase || ''}`;
  document.getElementById('rx-titulo').textContent = titulo;
  document.getElementById('rx-sub').textContent = sub;
  document.getElementById('rx-intentos').innerHTML = rx.intentos.map((ms, i) => `<span class="chip">${i + 1}: ${ms} ms</span>`).join('');
}

function esperarVioleta() {
  rx.fase = 'espera';
  pintarReaccion('Espera el violeta…', 'No toques todavía', 'espera');
  rx.timer = setTimeout(() => {
    rx.fase = 'ya';
    rx.t0 = performance.now();
    pintarReaccion('¡Toca!', '', 'ya');
  }, 1200 + Math.random() * 2300);
}

function toqueReaccion() {
  if (!rx) iniciarReaccion();
  if (rx.fase === 'listo' || rx.fase === 'pronto' || rx.fase === 'resultado') {
    esperarVioleta();
  } else if (rx.fase === 'espera') {
    clearTimeout(rx.timer);
    rx.fase = 'pronto';
    pintarReaccion('Muy pronto', 'Toca para repetir el intento', 'pronto');
  } else if (rx.fase === 'ya') {
    const ms = Math.round(performance.now() - rx.t0);
    rx.intentos.push(ms);
    if (rx.intentos.length >= 5) {
      terminarReaccion();
    } else {
      rx.fase = 'resultado';
      pintarReaccion(`${ms} ms`, `Intento ${rx.intentos.length} de 5 · toca para seguir`, '');
    }
  } else if (rx.fase === 'fin') {
    iniciarReaccion();
    pintarReaccion('Toca para empezar', 'Ponte cómodo, como si fueras a jugar', '');
    document.getElementById('rx-final').innerHTML = '';
  }
}

function terminarReaccion() {
  const prom = Math.round(rx.intentos.reduce((s, x) => s + x, 0) / rx.intentos.length);
  const anterior = estado.reaccion.length ? estado.reaccion[estado.reaccion.length - 1].ms : null;
  estado.reaccion.push({ fecha: hoy(), ms: prom });
  const h = estado.hechos[hoy()] || [];
  if (!h.includes('reaccion')) estado.hechos[hoy()] = [...h, 'reaccion'];
  guardar(estado);
  rx.fase = 'fin';
  pintarReaccion(`Promedio: ${prom} ms`, 'Toca para repetir la prueba', 'fin');
  const comparacion = anterior === null ? 'Es tu primera medición: será tu línea base.'
    : prom <= anterior ? `Mejoraste ${anterior - prom} ms frente a tu prueba anterior (${anterior} ms).`
      : `Tu prueba anterior fue ${anterior} ms. El cansancio y el sueño influyen: revisa tu registro de bienestar.`;
  document.getElementById('rx-final').innerHTML = `<div class="tarjeta col gap-chico"><strong>Prueba guardada</strong><p class="texto">${comparacion}</p><a href="#/plan" class="boton">Volver al plan</a></div>`;
}

// ---------- Pantalla 5: Bienestar ----------
const METRICAS = [
  ['sueno', 'Calidad del sueño'],
  ['fatiga', 'Fatiga'],
  ['estres', 'Estrés'],
  ['molestias', 'Molestias en muñeca, cuello o espalda'],
];

function vistaBienestar() {
  const { perfil } = estado;
  const reg = estado.bienestar[hoy()] || {};
  const horas = reg.horas || 0;
  const lista = alertas(estado, hoy());
  const recomendaciones = [
    ['agua', '#7EE7DC', 'rgba(79,209,197,0.15)', 'Hidratación', 'Ten agua cerca y bebe entre partidas.'],
    ['luna', '#C9C2FF', 'rgba(157,146,255,0.18)', 'Sueño', 'Deja la última partida 1 h antes de dormir.'],
    ['comida', '#86EFAC', 'rgba(74,222,128,0.15)', 'Nutrición', 'Come algo real antes de sesiones largas.'],
  ];
  return `<section class="pantalla">
    ${encabezado('Bienestar', 'Cuerpo y mente')}
    ${lista.map(aviso).join('')}
    <div class="tarjeta destacada col gap-chico">
      <div class="fila-entre"><span class="peso-medio">Horas de juego hoy</span><span class="pildora">Límite: 4 h</span></div>
      <div class="fila-entre">
        <div class="col"><span class="numero-grande">${textoHoras(horas)}</span><span class="peso-medio mini">${horas <= 4 ? `Te queda ${textoHoras(4 - horas)}` : 'Superaste el límite sugerido'}</span></div>
        ${medidor(horas)}
      </div>
      <div class="fila gap-chico">
        <button type="button" class="boton-icono claro" aria-label="Restar media hora" data-accion="horas" data-valor="-0.5">${icono('menos', 20)}</button>
        <span class="crece centro mini peso-medio">Registra tus horas de juego</span>
        <button type="button" class="boton-icono claro" aria-label="Sumar media hora" data-accion="horas" data-valor="0.5">${icono('mas', 20)}</button>
      </div>
    </div>
    <div class="tarjeta col gap">
      <div class="col"><strong>Registro de hoy</strong><span class="suave mini">1 = muy bien · 7 = muy mal</span></div>
      ${METRICAS.map(([campo, nombre]) => `<div class="col gap-mini" role="group" aria-label="${nombre}">
        <span class="mini">${nombre}</span>
        <div class="escala">${[1, 2, 3, 4, 5, 6, 7].map((n) => `<button type="button" class="${reg[campo] === n ? 'activo' : ''}" aria-pressed="${reg[campo] === n}" data-accion="bien" data-campo="${campo}" data-valor="${n}">${n}</button>`).join('')}</div>
      </div>`).join('')}
    </div>
    <h2>Recomendaciones</h2>
    <div class="grid3">
      ${recomendaciones.map(([ic, color, fondo, titulo, texto]) => `<div class="tarjeta col gap-chico reco">
        <div class="icono-chico" style="background:${fondo}">${icono(ic, 18, color)}</div>
        <strong class="mini">${titulo}</strong><span class="suave diminuto">${texto}</span>
      </div>`).join('')}
    </div>
    <button type="button" class="tarjeta fila gap tarjeta-enlace" aria-expanded="${ui.pausaAbierta}" data-accion="pausa">
      <div class="icono-grande">${icono('pesa', 30, '#FFFFFF', 2.2)}</div>
      <div class="crece col izquierda"><strong>Pausa activa de 5 minutos</strong><span class="suave mini">Muñecas, cuello, espalda y ojos</span></div>
      ${icono(ui.pausaAbierta ? 'menos' : 'mas', 20, '#A9A6C9')}
    </button>
    ${ui.pausaAbierta ? `<ol class="tarjeta pasos">
      <li><strong>Muñecas:</strong> 10 círculos hacia cada lado y estira los dedos hacia atrás 15 s.</li>
      <li><strong>Antebrazos:</strong> brazo estirado, palma hacia abajo, lleva la mano hacia ti 15 s por lado.</li>
      <li><strong>Cuello:</strong> lleva la oreja al hombro 15 s por lado, sin forzar.</li>
      <li><strong>Espalda:</strong> ponte de pie, entrelaza las manos arriba y estira 20 s.</li>
      <li><strong>Ojos:</strong> mira algo a más de 6 metros durante 20 s.</li>
    </ol>` : ''}
    ${perfil.pro ? tendenciaBienestar() : bloqueadoPro('Bienestar avanzado', 'Ve cómo cambian tu fatiga y tu sueño en los últimos 7 días.')}
    <p class="nota">Tus datos de bienestar se guardan solo en este celular. Si una molestia dura más de una semana o te sientes mal con frecuencia, consulta a un profesional de la salud. GGym no hace diagnósticos.</p>
  </section>`;
}

function tendenciaBienestar() {
  const dias = Array.from({ length: 7 }, (_, i) => {
    const f = sumarDias(hoy(), i - 6);
    return { i, ...(estado.bienestar[f] || {}) };
  });
  const conDatos = dias.filter((d) => d.fatiga !== undefined).length;
  return `<div class="tarjeta col gap-chico">
    <div class="fila-entre"><strong>Últimos 7 días</strong><span class="pildora">Pro</span></div>
    ${conDatos >= 2 ? graficaBienestar(dias) : '<p class="suave mini">Registra al menos 2 días para ver tu tendencia.</p>'}
    <div class="fila gap mini"><span class="leyenda"><span class="punto" style="background:#FF9BB8"></span>Fatiga</span><span class="leyenda"><span class="punto" style="background:#9CCBFF"></span>Sueño</span><span class="leyenda suave">Línea amarilla: nivel de alerta (5)</span></div>
  </div>`;
}

// ---------- Pantalla 6: Progreso ----------
function vistaProgreso() {
  const { perfil } = estado;
  const res = resumenCumplimiento(estado, hoy());
  const lpGanados = lpActual() - estado.lp[0].lp;
  const ahora = promedioPartidas(estado.partidas);
  const foco = focoSemana(estado);
  const lista = logros(estado, hoy());
  const ultimaRx = estado.reaccion[estado.reaccion.length - 1];
  const mejorRx = estado.reaccion.length ? Math.min(...estado.reaccion.map((r) => r.ms)) : null;
  const iconoLogro = { llama: ['#FFE29A', '#E8A33D'], check: ['#6A5AF9', '#9B5CF6'], luna: ['#9CCBFF', '#5B8DEF'], reloj: ['#86EFAC', '#1E9E63'], corazon: ['#FF9BB8', '#E8508C'] };
  return `<section class="pantalla">
    <header class="fila gap">
      <a href="#/perfil" class="avatar" aria-label="Tu perfil">${esc(nombreJugador().charAt(0).toUpperCase())}</a>
      <div class="crece"><div class="subtitulo">Desde que empezaste · ${res.dias} ${res.dias === 1 ? 'día' : 'días'}</div><h1>Tu progreso</h1></div>
    </header>
    <div class="grid3">
      <div class="tarjeta stat centro"><span class="suave mini">LP ganados</span><strong class="${lpGanados >= 0 ? 'verde' : 'rosa'}">${lpGanados >= 0 ? '+' : ''}${lpGanados}</strong></div>
      <div class="tarjeta stat centro"><span class="suave mini">Plan cumplido</span><strong>${res.porcentaje} %</strong></div>
      <div class="tarjeta stat centro"><span class="suave mini">Sesiones</span><strong>${res.sesiones} de ${res.dias}</strong></div>
    </div>
    <div class="tarjeta col gap-chico">
      <div class="fila-entre"><strong>Puntos de liga (LP)</strong><span class="suave mini">${divisionTexto(perfil.rango)} · ${lpActual()} LP</span></div>
      ${graficaLP(estado.lp)}
    </div>
    <h2>Tus indicadores foco</h2>
    <div class="tarjeta lista">
      ${foco.map((id) => {
        const ind = INDICADORES.find((x) => x.id === id);
        const antes = estado.lineaBase[id];
        const mejora = ind.mayorMejor ? ahora[id] > antes * 1.01 : ahora[id] < antes * 0.99;
        const igual = Math.abs(ahora[id] - antes) / antes < 0.01;
        return `<div class="fila-lista">
          <div class="crece col"><span class="peso-medio">${ind.nombre}</span><span class="suave mini">Meta de ${perfil.rango}: ${formatoIndicador(ind, promedio(ind, perfil.rango, perfil.rol))}</span></div>
          <span class="suave mini">${formatoIndicador(ind, antes)}</span>${icono('derecha', 14, '#A9A6C9')}
          <span class="pildora ${igual ? '' : mejora ? 'pildora-verde' : 'pildora-rosa'}">${formatoIndicador(ind, ahora[id])}</span>
        </div>`;
      }).join('')}
    </div>
    <div class="tarjeta fila gap">
      <div class="icono-dim" style="background:${DIMENSIONES.cognitiva.fondo}">${icono('cerebro', 26, DIMENSIONES.cognitiva.color)}</div>
      <div class="crece col"><strong>Tiempo de reacción</strong><span class="suave mini">${ultimaRx ? `Último: ${ultimaRx.ms} ms · Mejor: ${mejorRx} ms` : 'Aún no has hecho la prueba'}</span></div>
      <a href="#/reaccion" class="boton boton-chico">Medir</a>
    </div>
    <h2>Logros</h2>
    <div class="grid3">
      ${lista.map((l) => {
        const [c1, c2] = iconoLogro[l.icono] || ['#6A5AF9', '#9B5CF6'];
        return `<div class="tarjeta logro ${l.logrado ? '' : 'pendiente'}" title="${l.detalle}">
          <div class="medalla" style="${l.logrado ? `background:linear-gradient(135deg,${c1},${c2})` : ''}">${icono(l.logrado ? l.icono : 'candado', 24, l.logrado ? '#1B1640' : '#A9A6C9')}</div>
          <span class="mini peso-medio centro">${l.nombre}</span>
          <span class="diminuto suave centro">${l.detalle}</span>
        </div>`;
      }).join('')}
    </div>
    ${tarjetaPro()}
  </section>`;
}

function tarjetaPro() {
  const { perfil } = estado;
  return `<div class="tarjeta destacada col gap-chico">
    <div class="fila-entre"><strong class="titulo-pro">GGym Pro</strong>${perfil.pro ? '<span class="pildora">Activo (demo)</span>' : ''}</div>
    <ul class="lista-pro">
      <li>${icono('check', 14)} Tendencia de tus últimas 5 partidas</li>
      <li>${icono('check', 14)} Plan completo periodizado de 6 semanas</li>
      <li>${icono('check', 14)} Bienestar avanzado y sin anuncios</li>
    </ul>
    <button type="button" class="boton boton-blanco" data-accion="pro">${perfil.pro ? 'Volver a la versión gratis' : 'Probar Pro · [PRECIO]/mes'}</button>
    <span class="mini">Demostración: no se hace ningún cobro.</span>
  </div>`;
}

// ---------- Perfil y fases futuras ----------
function vistaPerfil() {
  const { perfil } = estado;
  const chips = (lista, campo, actual, fmt = (x) => x) => lista.map((v) => `<button type="button" class="chip ${actual === v ? 'activo' : ''}" aria-pressed="${actual === v}" data-accion="perfil" data-campo="${campo}" data-valor="${v}">${fmt(v)}</button>`).join('');
  const enlace = (ruta, ic, titulo, fase, texto) => `<a href="#/${ruta}" class="fila-lista enlace">
    <div class="icono-chico" style="background:rgba(157,146,255,0.18)">${icono(ic, 18, '#C9C2FF')}</div>
    <div class="crece col"><span class="peso-medio">${titulo}</span><span class="suave mini">${texto}</span></div>
    ${fase ? `<span class="pildora">${fase}</span>` : ''}${icono('derecha', 16, '#A9A6C9')}
  </a>`;
  return `<section class="pantalla">
    ${encabezado('Tu perfil', 'Ajustes', 'inicio')}
    <div class="tarjeta fila gap">
      <div class="avatar avatar-grande">${esc(nombreJugador().charAt(0).toUpperCase())}</div>
      <div class="crece col"><strong>${esc(perfil.riotId)}</strong><span class="suave mini">${perfil.rol} · ${divisionTexto(perfil.rango)}${perfil.menor ? ' · Menor con autorización' : ''}</span></div>
    </div>
    <div class="tarjeta col gap">
      <h2>Tu entrenamiento</h2>
      <div class="campo"><span class="etiqueta-campo">Rol</span><div class="chips">${chips(ROLES, 'rol', perfil.rol)}</div></div>
      <div class="campo"><label for="perfil-rango">Rango</label>
        <select id="perfil-rango" data-cambio="rango">${RANGOS.map((r) => `<option ${r === perfil.rango ? 'selected' : ''}>${r}</option>`).join('')}</select>
      </div>
      <div class="campo"><span class="etiqueta-campo">Tiempo diario</span><div class="chips">${chips([60, 120, 180], 'disponibilidad', perfil.disponibilidad, (v) => `${v / 60} h`)}</div></div>
      <div class="campo"><span class="etiqueta-campo">Tono del entrenador</span><div class="chips">${chips(['amigable', 'exigente', 'tecnico'], 'tono', perfil.tono, (v) => ({ amigable: 'Amigable', exigente: 'Exigente', tecnico: 'Técnico' }[v]))}</div></div>
      <div class="campo"><span class="etiqueta-campo">Juego</span>
        <div class="chips"><span class="chip activo">League of Legends</span><span class="chip deshabilitado">Valorant · Fase 2</span><span class="chip deshabilitado">CS2 · Fase 2</span></div>
      </div>
    </div>
    <div class="tarjeta fila gap">
      <div class="crece col"><strong>GGym Pro</strong><span class="suave mini">Activa las funciones Pro para probarlas (sin cobro).</span></div>
      <button type="button" class="interruptor ${perfil.pro ? 'encendido' : ''}" role="switch" aria-checked="${!!perfil.pro}" aria-label="GGym Pro" data-accion="pro"><span></span></button>
    </div>
    <h2>Próximas fases</h2>
    <div class="tarjeta lista">
      ${enlace('coach', 'grupo', 'Modo entrenador', 'Fase 2', 'Asigna y sigue planes de varios jugadores')}
      ${enlace('video', 'video', 'Análisis de video', 'Fase 3', 'Sube tus partidas en video')}
      ${enlace('ruta', 'ruta', 'Hoja de ruta', '', 'Qué incluye cada fase de GGym')}
    </div>
    <h2>Tus datos</h2>
    <div class="tarjeta col gap-chico">
      <p class="mini suave">Según la Ley 1581 de 2012, autorizaste el tratamiento de tus datos. Tus partidas, plan y bienestar se guardan solo en este celular. Guardamos como máximo tus últimas 5 partidas.</p>
      <button type="button" class="boton boton-peligro" data-accion="borrar">${icono('papelera', 18)} Borrar mis datos</button>
    </div>
    <p class="nota centro">GGym · Prototipo académico · ${MODO_DEMO ? 'Modo demostración con datos de ejemplo' : ''}</p>
  </section>`;
}

function vistaCoach() {
  return `<section class="pantalla">
    ${encabezado('Modo entrenador', 'Fase 2 · Demostración', 'perfil')}
    <div class="aviso aviso-info">${icono('info', 22, '#B8AFFF')}<p>Así se verá el panel para entrenadores y equipos: varios jugadores, su cumplimiento y sus alertas. Los jugadores son de ejemplo.</p></div>
    ${JUGADORES_COACH.map((j) => `<div class="tarjeta col gap-chico">
      <div class="fila gap">
        <div class="avatar">${j.nombre.charAt(0)}</div>
        <div class="crece col"><strong>${j.nombre}</strong><span class="suave mini">${j.rol} · ${j.rango}</span></div>
        <span class="chip activo">${j.foco}</span>
      </div>
      <div class="fila-entre mini"><span class="suave">Cumplimiento del plan</span><strong>${j.cumplimiento} %</strong></div>
      <div class="barra"><span style="width:${j.cumplimiento}%;background:${j.cumplimiento >= 70 ? '#86EFAC' : '#F5C451'}"></span></div>
      ${j.alerta ? `<span class="mini amarillo">${icono('alerta', 14, '#F5C451')} ${j.alerta}</span>` : ''}
      <button type="button" class="boton boton-secundario boton-chico" data-accion="fase2">Asignar plan</button>
    </div>`).join('')}
  </section>`;
}

function vistaVideo() {
  return `<section class="pantalla">
    ${encabezado('Análisis de video', 'Fase 3 · Próximamente', 'perfil')}
    <div class="subida">
      ${icono('video', 40, '#C9C2FF')}
      <strong>Sube el video de tu partida</strong>
      <span class="suave mini">MP4 · máximo 30 minutos</span>
      <button type="button" class="boton boton-chico" disabled>Disponible en la Fase 3</button>
    </div>
    <div class="tarjeta col gap-chico">
      <strong>Qué analizará</strong>
      <ul class="lista-pro">
        <li>${icono('mira', 14)} Mecánica: precisión y velocidad de tus combos</li>
        <li>${icono('ojo', 14)} Posicionamiento en peleas y en el mapa</li>
        <li>${icono('rayo', 14)} Momentos clave: dónde se ganó o perdió la partida</li>
      </ul>
      <p class="mini suave">Usará visión por computador. Requiere servidores con costo, por eso llega en una fase posterior.</p>
    </div>
    <div class="tarjeta fila gap">
      <div class="crece col"><strong>Avísame cuando esté listo</strong><span class="suave mini">Te mostraremos un aviso en la app.</span></div>
      <button type="button" class="interruptor ${estado.avisarVideo ? 'encendido' : ''}" role="switch" aria-checked="${!!estado.avisarVideo}" aria-label="Avísame cuando esté listo" data-accion="avisar-video"><span></span></button>
    </div>
  </section>`;
}

function vistaRuta() {
  const fases = [
    { nombre: 'MVP', estado: 'Disponible', clase: 'pildora-verde', items: ['League of Legends, todos los roles y rangos', 'Análisis de partida y de las últimas 5', 'Plan semanal por reglas y periodización de 6 semanas', 'Bienestar, alertas y prueba de reacción', 'Progreso, logros y GGym Pro (demo)'] },
    { nombre: 'Fase 2', estado: 'En diseño', clase: 'pildora-amarilla', items: ['Conexión real con la API de Riot', 'Segundo juego: Valorant o CS2', 'Explicaciones redactadas con IA', 'Modo entrenador y recordatorios'] },
    { nombre: 'Fase 3', estado: 'Futuro', clase: '', items: ['Análisis de video con visión por computador', 'Equipos y clubes universitarios', 'Relojes y pulseras inteligentes', 'Marketplace de entrenadores'] },
  ];
  return `<section class="pantalla">
    ${encabezado('Hoja de ruta', 'Fases de GGym', 'perfil')}
    <div class="linea-tiempo">
      ${fases.map((f) => `<div class="fase">
        <div class="tarjeta col gap-chico">
          <div class="fila-entre"><strong>${f.nombre}</strong><span class="pildora ${f.clase}">${f.estado}</span></div>
          <ul class="lista-pro">${f.items.map((i) => `<li>${icono(f.estado === 'Disponible' ? 'check' : 'reloj', 14)} ${i}</li>`).join('')}</ul>
        </div>
      </div>`).join('')}
    </div>
  </section>`;
}

// ---------- Render ----------
const VISTAS = {
  bienvenida: vistaBienvenida, inicio: vistaInicio, analisis: vistaAnalisis, plan: vistaPlan,
  bienestar: vistaBienestar, progreso: vistaProgreso, perfil: vistaPerfil, coach: vistaCoach,
  video: vistaVideo, ruta: vistaRuta, reaccion: vistaReaccion,
};

function render() {
  let r = ruta();
  if (!estado) r = 'bienvenida';
  else if (r === 'bienvenida' || !VISTAS[r]) r = 'inicio';
  const sinNav = r === 'bienvenida' || r === 'reaccion';
  if (r !== 'reaccion' && rx && rx.timer) clearTimeout(rx.timer);
  app.innerHTML = VISTAS[r]() + (sinNav ? '' : navegacion(r)) + (ui.toast ? `<div class="toast" role="status">${ui.toast}</div>` : '');
  if (r !== rutaAnterior) {
    window.scrollTo(0, 0);
    if (r === 'reaccion') iniciarReaccion();
    if (r !== 'plan') ui.diaSel = null;
    rutaAnterior = r;
  }
}

// ---------- Acciones ----------
const ACCIONES = {
  form(d) {
    const valor = d.campo === 'disponibilidad' ? Number(d.valor) : d.valor;
    ui.form[d.campo] = valor;
    render();
  },
  'vista-analisis'(d) {
    ui.vistaAnalisis = d.valor;
    render();
  },
  partida(d) {
    ui.partidaSel = Number(d.valor);
    render();
  },
  dia(d) {
    ui.diaSel = d.valor;
    render();
  },
  hecho(d) {
    const lista = estado.hechos[d.fecha] || [];
    estado.hechos[d.fecha] = lista.includes(d.valor) ? lista.filter((x) => x !== d.valor) : [...lista, d.valor];
    guardar(estado);
    const plan = planDelDia(estado, d.fecha);
    const c = plan.items.filter((i) => estado.hechos[d.fecha].includes(i.id)).length;
    if (c === plan.items.length && !lista.includes(d.valor)) toast('¡Sesión completa! Buen trabajo.');
    else render();
  },
  bien(d) {
    const reg = estado.bienestar[hoy()] || {};
    reg[d.campo] = Number(d.valor);
    estado.bienestar[hoy()] = reg;
    guardar(estado);
    render();
  },
  horas(d) {
    const reg = estado.bienestar[hoy()] || {};
    reg.horas = Math.max(0, Math.min(16, (reg.horas || 0) + Number(d.valor)));
    estado.bienestar[hoy()] = reg;
    guardar(estado);
    render();
  },
  pausa() {
    ui.pausaAbierta = !ui.pausaAbierta;
    render();
  },
  pro() {
    estado.perfil.pro = !estado.perfil.pro;
    guardar(estado);
    toast(estado.perfil.pro ? 'GGym Pro activado (demostración, sin cobro)' : 'Volviste a la versión gratis');
  },
  perfil(d) {
    const valor = d.campo === 'disponibilidad' ? Number(d.valor) : d.valor;
    actualizarPerfil(d.campo, valor);
  },
  borrar() {
    if (!window.confirm('¿Seguro que quieres borrar todos tus datos de GGym en este celular? No se puede deshacer.')) return;
    borrar();
    estado = null;
    ui.form = { ...ui.form, riotId: '', consentimiento: false, error: '' };
    location.hash = '#/bienvenida';
    render();
  },
  'avisar-video'() {
    estado.avisarVideo = !estado.avisarVideo;
    guardar(estado);
    toast(estado.avisarVideo ? 'Te avisaremos cuando llegue el análisis de video' : 'Aviso desactivado');
  },
  fase2() {
    toast('Disponible en la Fase 2 de GGym');
  },
};

function actualizarPerfil(campo, valor) {
  estado.perfil[campo] = valor;
  if (campo === 'rol' || campo === 'rango') {
    // Nuevo rol o rango: se vuelven a generar las partidas de ejemplo (en Fase 2 vendrán de Riot).
    estado.partidas = generarPartidasEjemplo(estado.perfil).slice(0, 5);
    estado.lineaBase = calcularLineaBase(estado);
    ui.partidaSel = 0;
  }
  guardar(estado);
  render();
}

app.addEventListener('click', (e) => {
  const zona = e.target.closest('#zona-reaccion');
  if (zona) {
    // Con teclado (Enter/Espacio) llega solo el click; con dedo o mouse usamos pointerdown, que es más preciso.
    if (e.detail === 0) toqueReaccion();
    return;
  }
  const b = e.target.closest('[data-accion]');
  if (!b || b.disabled) return;
  const accion = ACCIONES[b.dataset.accion];
  if (accion) accion(b.dataset);
});

app.addEventListener('pointerdown', (e) => {
  if (e.target.closest('#zona-reaccion')) {
    e.preventDefault();
    toqueReaccion();
  }
});

app.addEventListener('input', (e) => {
  if (e.target.name === 'riotId') ui.form.riotId = e.target.value;
});

app.addEventListener('change', (e) => {
  const t = e.target;
  if (t.closest('#form-bienvenida')) {
    if (t.type === 'checkbox') ui.form[t.name] = t.checked;
    else if (t.name === 'rango') ui.form.rango = t.value;
    if (t.type === 'checkbox') render();
  } else if (t.dataset.cambio === 'rango') {
    actualizarPerfil('rango', t.value);
  }
});

app.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!ui.cargando) conectar();
});

window.addEventListener('hashchange', render);
render();

// Permite instalar la app y usarla sin conexión.
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  });
}
