// Datos de referencia de GGym.
// Los promedios por rango son VALORES DE EJEMPLO para el prototipo.
// Cuando se conecte la API de Riot, se reemplazarán por promedios calculados con partidas reales.

export const RANGOS = ['Hierro', 'Bronce', 'Plata', 'Oro', 'Platino', 'Esmeralda', 'Diamante', 'Maestro'];
export const ROLES = ['Top', 'Jungla', 'Mid', 'ADC', 'Support'];

export const COLOR_RANGO = {
  Hierro: ['#B8B8B8', '#6E6E6E'],
  Bronce: ['#E3A57A', '#9A5B32'],
  Plata: ['#E6EBF2', '#9AA4B2'],
  Oro: ['#FFE29A', '#E8A33D'],
  Platino: ['#9FF0E6', '#2BA89B'],
  Esmeralda: ['#9EF0C4', '#1E9E63'],
  Diamante: ['#C7DEFF', '#5B8DEF'],
  Maestro: ['#E9C8FF', '#9B4DDB'],
};

export const DIMENSIONES = {
  mecanica: { nombre: 'Mecánica', color: '#7EE7DC', fondo: 'rgba(79,209,197,0.15)', peso: 1.3 },
  tactica: { nombre: 'Táctica', color: '#C9C2FF', fondo: 'rgba(157,146,255,0.18)', peso: 1 },
  cognitiva: { nombre: 'Cognitiva', color: '#9CCBFF', fondo: 'rgba(110,170,255,0.16)', peso: 1 },
  fisica: { nombre: 'Física', color: '#86EFAC', fondo: 'rgba(74,222,128,0.15)', peso: 1 },
  psicologica: { nombre: 'Psicológica', color: '#FF9BB8', fondo: 'rgba(255,92,138,0.16)', peso: 1 },
};

// valores = promedio por rango, en el orden de RANGOS.
// ajusteRol = multiplicador para roles que se comportan distinto (ej.: el support farmea poco y pone más guardas).
export const INDICADORES = [
  {
    id: 'farmeo', nombre: 'Farmeo', unidad: 'CS/min', dim: 'mecanica', mayorMejor: true, decimales: 1,
    valores: [4.6, 5.1, 5.6, 6.1, 6.6, 7.0, 7.5, 8.2], ajusteRol: { Support: 0.2, Jungla: 0.85 },
    consejo: 'Asegurar más súbditos te da oro sin arriesgar la vida.',
  },
  {
    id: 'habilidades', nombre: 'Habilidades acertadas', unidad: '%', dim: 'mecanica', mayorMejor: true, decimales: 0,
    valores: [38, 42, 46, 50, 54, 57, 60, 64],
    consejo: 'Practica tus combos hasta que salgan sin pensar.',
  },
  {
    id: 'oleadas', nombre: 'Control de oleadas', unidad: '% oleadas aprovechadas', dim: 'tactica', mayorMejor: true, decimales: 0,
    valores: [55, 59, 63, 67, 71, 74, 77, 81],
    consejo: 'Decide antes de cada regreso a base si vas a congelar o empujar la oleada.',
  },
  {
    id: 'vision', nombre: 'Visión', unidad: 'puntaje/min', dim: 'tactica', mayorMejor: true, decimales: 1,
    valores: [0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 1.1, 1.25], ajusteRol: { Support: 2.0, Jungla: 1.3 },
    consejo: 'Pon una guarda en el río un minuto antes de cada dragón.',
  },
  {
    id: 'muertes', nombre: 'Muertes por partida', unidad: 'muertes', dim: 'tactica', mayorMejor: false, decimales: 1,
    valores: [8.2, 7.5, 6.8, 6.0, 5.4, 5.0, 4.6, 4.1],
    consejo: 'Antes de avanzar, pregúntate dónde está el jungla enemigo.',
  },
  {
    id: 'decisiones', nombre: 'Toma de decisiones', unidad: '% muertes sin visión', dim: 'tactica', mayorMejor: false, decimales: 0,
    valores: [70, 66, 62, 58, 54, 50, 46, 42],
    consejo: 'No entres solo a zonas oscuras: usa barrido o espera a un aliado.',
  },
  {
    id: 'rotaciones', nombre: 'Rotaciones', unidad: '% participación en asesinatos', dim: 'tactica', mayorMejor: true, decimales: 0,
    valores: [42, 45, 48, 51, 54, 56, 58, 61], ajusteRol: { Support: 1.15, Jungla: 1.15 },
    consejo: 'Sal de tu línea 30 segundos antes de que aparezca el objetivo.',
  },
  {
    id: 'objetivos', nombre: 'Objetivos', unidad: '% participación en objetivos', dim: 'tactica', mayorMejor: true, decimales: 0,
    valores: [30, 36, 42, 48, 54, 58, 62, 67],
    consejo: 'Juega cada partida pensando en el próximo dragón, Heraldo o Barón.',
  },
  {
    id: 'picks', nombre: 'Picks y counterpicks', unidad: '% picks favorables', dim: 'tactica', mayorMejor: true, decimales: 0,
    valores: [48, 50, 52, 54, 57, 60, 63, 66],
    consejo: 'Juega con un grupo pequeño de campeones que domines.',
  },
];

// Banco de ejercicios. Cada falencia activa un bloque de 2 ejercicios.
export const EJERCICIOS = {
  // Mecánica
  'ultimo-golpe': { nombre: 'Último golpe sin habilidades', dim: 'mecanica', min: 20, detalle: 'Herramienta de práctica: asegura el último golpe a los súbditos durante 10 minutos. 2 series.', exito: '7 de cada 10 súbditos asegurados' },
  'farmeo-presion': { nombre: 'Farmeo bajo presión', dim: 'mecanica', min: 15, detalle: 'En partida normal, prioriza no perder ningún súbdito de cañón durante la fase de líneas.', exito: 'Todos los cañones hasta el minuto 14' },
  combos: { nombre: 'Combos de tu campeón', dim: 'mecanica', min: 15, detalle: 'Herramienta de práctica: repite el combo principal contra el muñeco. 3 series de 20 repeticiones.', exito: '18 de 20 combos limpios' },
  skillshots: { nombre: 'Precisión de habilidades', dim: 'mecanica', min: 15, detalle: 'Lanza tus habilidades de largo alcance contra súbditos en movimiento durante 10 minutos.', exito: 'Más del 55 % de acierto' },
  // Táctica
  'oleadas-practica': { nombre: 'Congelar y empujar oleadas', dim: 'tactica', min: 20, detalle: 'Herramienta de práctica: congela la oleada cerca de tu torre 3 veces y luego empújala.', exito: '3 congelaciones sin perder súbditos' },
  'oleadas-revision': { nombre: 'Revisión de oleadas', dim: 'tactica', min: 15, detalle: 'Revisa los minutos 3 a 10 de tu última partida: ¿cuándo empujaste y por qué?', exito: 'Anotas 3 decisiones a mejorar' },
  'vision-ruta': { nombre: 'Ruta de guardas', dim: 'tactica', min: 15, detalle: 'Memoriza 3 puntos de guarda para controlar dragón y Barón. Practícalos en partida personalizada.', exito: 'Haces la ruta en menos de 40 segundos' },
  'vision-reloj': { nombre: 'Guardas por reloj', dim: 'tactica', min: 10, detalle: 'Cada vez que falte 1 minuto para un objetivo, coloca una guarda en el río.', exito: 'Guarda antes de cada dragón' },
  'revision-muertes': { nombre: 'Revisión guiada de 3 muertes', dim: 'tactica', min: 25, detalle: 'Pausa la repetición 10 segundos antes de cada muerte y anota qué información te faltó.', exito: '3 muertes analizadas por escrito' },
  minimapa: { nombre: 'Lectura de minimapa', dim: 'tactica', min: 10, detalle: 'Durante una partida, mira el minimapa cada vez que muera un súbdito tuyo.', exito: 'Detectas al jungla enemigo 3 veces' },
  'pausa-decision': { nombre: 'Pausa de decisión', dim: 'tactica', min: 15, detalle: 'En la repetición, detén cada pelea y decide: ¿pelear, rotar o retirarse? Compara con lo que pasó.', exito: '5 peleas analizadas' },
  barrido: { nombre: 'Avanza solo con visión', dim: 'tactica', min: 10, detalle: 'Antes de entrar a una zona oscura, usa barrido o espera a un aliado.', exito: 'Cero muertes en zonas sin visión' },
  'rotacion-objetivo': { nombre: 'Rotar antes del objetivo', dim: 'tactica', min: 15, detalle: 'Sal de tu línea 30 segundos antes de que aparezca dragón o Heraldo.', exito: 'Llegas a tiempo a 2 de 3 objetivos' },
  'revision-peleas': { nombre: 'Revisión de peleas', dim: 'tactica', min: 15, detalle: 'Revisa las 3 peleas más grandes de tu última partida: ¿dónde estabas tú?', exito: 'Identificas tu posición ideal en cada una' },
  'objetivos-plan': { nombre: 'Plan de objetivos', dim: 'tactica', min: 10, detalle: 'Antes de cada partida define qué objetivo vas a buscar primero y avísalo por chat.', exito: 'Tu equipo toma el primer objetivo' },
  'objetivos-tiempos': { nombre: 'Control de tiempos', dim: 'tactica', min: 10, detalle: 'Anota cuándo reaparece cada objetivo y llega 30 segundos antes.', exito: 'Llegas antes a todos los objetivos' },
  'pool-campeones': { nombre: 'Pool de 3 campeones', dim: 'tactica', min: 15, detalle: 'Elige 3 campeones de tu rol y juega solo con ellos esta semana.', exito: 'Solo 3 campeones en la semana' },
  'estudio-counters': { nombre: 'Estudia 2 enfrentamientos', dim: 'tactica', min: 15, detalle: 'Revisa contra qué campeones pierdes más y anota 2 claves para cada uno.', exito: '2 fichas de enfrentamiento escritas' },
  // Cognitiva
  reaccion: { nombre: 'Prueba de tiempo de reacción', dim: 'cognitiva', min: 5, detalle: 'Toca la pantalla apenas cambie de color. 5 intentos.', exito: 'Mejorar tu promedio anterior', accion: 'reaccion' },
  'memoria-tiempos': { nombre: 'Memoria de tiempos', dim: 'cognitiva', min: 5, detalle: 'Memoriza los tiempos de reaparición de dragón, Heraldo y Barón, y repásalos sin mirar.', exito: 'Los dices de memoria' },
  // Física
  calentamiento: { nombre: 'Calentamiento de muñeca y cuello', dim: 'fisica', min: 10, detalle: 'Círculos de muñeca, flexión y extensión del antebrazo, giros de cuello. 2 series de 10.', exito: 'Terminas sin molestias' },
  'pausa-activa': { nombre: 'Pausa activa', dim: 'fisica', min: 5, detalle: 'Cada 2 partidas: estira muñecas, espalda y hombros, y mira algo lejano 20 segundos.', exito: 'Una pausa cada 2 partidas' },
  movilidad: { nombre: 'Movilidad de espalda y hombros', dim: 'fisica', min: 10, detalle: 'Gato-camello, rotaciones de tronco y círculos de hombros. 2 series de 10.', exito: 'Sin rigidez al terminar' },
  aerobico: { nombre: 'Actividad aeróbica', dim: 'fisica', min: 30, detalle: 'Camina, trota o monta bicicleta a ritmo cómodo. Lejos de las pantallas.', exito: '30 minutos continuos' },
  // Psicológica
  respiracion: { nombre: 'Respiración y vuelta a la calma', dim: 'psicologica', min: 5, detalle: 'Respiración 4-6: inhala 4 segundos y exhala 6 segundos durante 3 minutos.', exito: '3 minutos completos' },
  'rutina-pre': { nombre: 'Rutina pre-partida', dim: 'psicologica', min: 5, detalle: 'Antes de la primera partida: respira, define tu objetivo del día y revisa tu pool.', exito: 'Objetivo del día escrito' },
};

// Qué bloque de ejercicios activa cada falencia.
export const BLOQUES = {
  farmeo: ['ultimo-golpe', 'farmeo-presion'],
  habilidades: ['combos', 'skillshots'],
  oleadas: ['oleadas-practica', 'oleadas-revision'],
  vision: ['vision-ruta', 'vision-reloj'],
  muertes: ['revision-muertes', 'minimapa'],
  decisiones: ['pausa-decision', 'barrido'],
  rotaciones: ['rotacion-objetivo', 'revision-peleas'],
  objetivos: ['objetivos-plan', 'objetivos-tiempos'],
  picks: ['pool-campeones', 'estudio-counters'],
};

// Periodización: plan de 6 semanas (microciclos) con un multiplicador de carga.
export const MICROCICLOS = [
  { semana: 1, nombre: 'Adaptación', carga: 0.8, descripcion: 'Aprendes la rutina con carga moderada.' },
  { semana: 2, nombre: 'Carga', carga: 1.0, descripcion: 'Volumen completo sobre tus 3 falencias.' },
  { semana: 3, nombre: 'Carga alta', carga: 1.15, descripcion: 'Más partidas con objetivo y ejercicios más exigentes.' },
  { semana: 4, nombre: 'Descarga', carga: 0.7, descripcion: 'Bajas la carga para recuperarte y consolidar.' },
  { semana: 5, nombre: 'Carga alta', carga: 1.15, descripcion: 'Segundo bloque fuerte con nuevas metas.' },
  { semana: 6, nombre: 'Evaluación', carga: 0.8, descripcion: 'Comparas tus indicadores con la línea base.' },
];

export const CAMPEONES = {
  Top: ['Garen', 'Darius', 'Malphite', 'Sett', 'Ornn'],
  Jungla: ['Warwick', 'Amumu', 'Vi', 'Lee Sin', 'Graves'],
  Mid: ['Annie', 'Ahri', 'Lux', 'Malzahar', 'Veigar'],
  ADC: ['Miss Fortune', 'Jinx', 'Ashe', 'Caitlyn', 'Ezreal'],
  Support: ['Thresh', 'Leona', 'Lulu', 'Nami', 'Morgana'],
};

// Jugadores de ejemplo para la demostración del modo entrenador (Fase 2).
export const JUGADORES_COACH = [
  { nombre: 'Valeria', rol: 'Mid', rango: 'Plata', cumplimiento: 86, foco: 'Farmeo', alerta: null },
  { nombre: 'Camilo', rol: 'Jungla', rango: 'Oro', cumplimiento: 54, foco: 'Objetivos', alerta: 'No completó el plan 3 días' },
  { nombre: 'Sofía', rol: 'ADC', rango: 'Bronce', cumplimiento: 72, foco: 'Muertes', alerta: 'Fatiga alta reportada' },
];
