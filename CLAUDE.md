# GGym

App web adaptada a celular que analiza partidas de League of Legends y le asigna al jugador un plan de entrenamiento semanal según su rango y sus falencias. Proyecto académico de una materia de entrenamiento deportivo.

## Cómo trabajar conmigo

- Soy estudiante de entrenamiento deportivo y **no sé programar**. Explica todo en **español** y en lenguaje sencillo, sin jerga técnica innecesaria.
- Antes de programar algo grande, propón un plan en pasos cortos y **espera mi visto bueno**.
- Al terminar cada paso, dime en una o dos frases qué cambió y **cómo ver la app funcionando**.
- Si algo requiere instalar programas, crear cuentas o pagar, avísame antes y explícame por qué.
- Prefiere soluciones simples y gratuitas. No tengo presupuesto.
- Trabajo desde dos computadores (PC de casa y portátil de la universidad): todo debe quedar guardado en este repositorio de GitHub.

## Alcance del MVP

- Un solo juego: **League of Legends**. Todos los roles (Top, Jungla, Mid, ADC, Support) y todos los rangos, con más énfasis en rangos bajos.
- Público: Latinoamérica primero, todo el texto de la app en español.
- Modelo freemium:
  - **Gratis:** análisis de la última partida, 3 falencias y plan básico.
  - **Pro:** tendencia de las últimas 5 partidas, plan completo periodizado, bienestar avanzado, sin anuncios. El precio aún no está definido: usa `[PRECIO]`.
- **Por ahora usa datos de ejemplo.** No conectes la API de Riot todavía; deja preparado un módulo aparte donde se conectará después.
- Fuera de alcance: análisis de video, chat o comunidad, pagos reales, otros juegos.

## Pantallas

1. **Bienvenida:** Riot ID, rol, rango actual y tono del entrenador (amigable, exigente, técnico). Aviso de datos personales y de autorización de tutor para menores de 18.
2. **Inicio:** saludo, rango actual con barra de LP y meta, sesión del día (ejercicios con duración), última partida y alertas de pausa.
3. **Análisis:** selector "esta partida" o "últimas 5". Las 3 falencias principales comparadas con el promedio del rango actual y del siguiente, con explicación sencilla, gráficas y minimapa.
4. **Plan semanal:** días de la semana, foco de la semana y ejercicios del día que se pueden marcar como hechos, con progreso.
5. **Bienestar:** registro diario de 1 a 7 (sueño, fatiga, estrés, molestias), horas de juego con límite sugerido de 4 h, alertas (por ejemplo, 3 derrotas seguidas) y recomendaciones de hidratación, sueño y nutrición.
6. **Progreso:** gráfica de LP, indicadores foco antes y después, cumplimiento del plan, logros y oferta de GGym Pro.

## Modelo de entrenamiento

- Cinco dimensiones: **mecánica** (la de mayor peso), **táctica**, **cognitiva**, **física** y **psicológica**.
- Indicadores clave: farmeo, control de oleadas, visión, rotaciones, toma de decisiones, objetivos, picks y counterpicks.
- Lógica de asignación por reglas (sin IA en el MVP):
  1. Calcular la brecha de cada indicador frente al promedio del rango siguiente.
  2. Las 3 brechas mayores definen el foco de la semana; cada una activa un bloque de ejercicios.
  3. Los bloques físico y psicológico siempre van en dosis base.
  4. El volumen se ajusta a la disponibilidad del usuario (alrededor de 2–3 h diarias) y a sus horas de juego.
  5. Si el registro de bienestar muestra fatiga alta o mal sueño, se reduce la carga.
  6. Si el usuario no cumple el plan, se le notifica y el plan se ajusta.
- Periodización en microciclos semanales (plan de 6 semanas). Carga medida en horas de juego.
- Sesión tipo: calentamiento físico, bloque mecánico, bloque táctico, partidas con objetivo concreto, vuelta a la calma.

## Diseño visual

- Fondo índigo oscuro con degradado vertical: `#241D55` → `#16122F` → `#0F0C22`.
- Tarjetas translúcidas: fondo `rgba(255,255,255,0.06)`, borde `rgba(255,255,255,0.08)`, radio 24–28 px.
- Acento principal violeta `#6A5AF9` (botones, estado activo). Acento secundario rosa `#E8508C`. Tarjetas destacadas con degradado `#5B4BEB → #9B5CF6 → #E8508C`.
- Chips en forma de píldora: fondo `#3A3480`, texto `#E4E1FF`; activo en `#6A5AF9`.
- Texto principal `#FFFFFF`, secundario `#A9A6C9`.
- Colores por dimensión: mecánica `#7EE7DC`, táctica `#C9C2FF`, física `#86EFAC`, psicológica `#FF9BB8`, alerta `#F5C451`.
- Tipografía **Poppins** (Google Fonts).
- Barra de navegación inferior flotante con íconos: Inicio, Partidas, Plan, Bienestar, Progreso.
- Ilustraciones propias en SVG. **No usar arte, personajes ni logos de League of Legends ni de otros juegos** (tienen derechos de autor).
- Accesibilidad: botones de al menos 44 px, buen contraste, `aria-label` en botones que solo tienen ícono.

## Reglas técnicas

- La clave de la API de Riot **nunca** va en el código de la app ni en el repositorio: solo en un servidor o en variables de entorno.
- Guardar como máximo las últimas 5 partidas por usuario.
- Datos de bienestar = datos sensibles. Cumplir la Ley 1581 de 2012 (Colombia): autorización expresa y opción de borrar los datos.
- La app no diagnostica lesiones ni problemas de salud mental. Ante molestias persistentes, recomienda consultar a un profesional.
- No promover jugar más horas: los logros premian cumplir el plan y descansar, no el tiempo de juego.
- Cumplir las políticas para desarrolladores de Riot Games.

## Tecnología

- App web con **Vite + React** y CSS propio. Gráficas y minimapa en SVG propio.
- **GitHub:** repositorio privado `ggym`.
- **Netlify:** se publica sola con cada cambio en GitHub. Las llaves van como variables de entorno.
- **Supabase:**
  - inicio de sesión por correo con enlace mágico
  - tablas `perfil`, `partidas` (máx. 5), `bienestar`, `ejercicios_hechos` y `consentimientos`
  - seguridad por usuario (RLS)
  - botón "Borrar mis datos"
- **Tokens:**
  - Se crean con `gh auth login`, `netlify login` y `supabase login`; el usuario solo hace clic en "Autorizar".
  - Nunca se escriben en el código, en GitHub ni en el chat. Los valores locales van en `.env.local`.
  - La llave secreta de Supabase nunca va en la app.
- Plan por fases en `docs/PLAN.md`. Al cerrar cada fase, actualizar `docs/PROGRESO.md` y darle al usuario el mensaje para la siguiente fase.

## Pendientes

- Verificar que el nombre "GGym" no esté registrado como marca ni usado por otra app.
- Definir el precio de GGym Pro.
- Solicitar la clave de desarrollador de Riot cuando se pase de datos de ejemplo a datos reales.
