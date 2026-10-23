# Spec – App de entrenamiento personalizado para esports

Oct 22, 2026 · @Leonardo

## 1. Resumen y visión

La app analiza las partidas competitivas del jugador, detecta sus falencias frente a su rango y le asigna un plan de entrenamiento periodizado para que suba de rango. Su diferencia frente a las apps existentes es tratar al jugador como un atleta: entrena lo mecánico y lo táctico, pero también lo cognitivo, lo físico y lo psicológico.

**Nombre:** GGym (gimnasio + "GG"). Pendiente verificar que no esté registrado.

**Propuesta de valor en una frase:** "Tu entrenador de alto rendimiento para esports: analiza tus partidas y te dice qué entrenar hoy para subir de rango".

**Objetivos del producto**

- Que el usuario identifique en minutos sus 3 principales falencias por partida.
- Que reciba un plan semanal con ejercicios concretos, medibles y adecuados a su rango.
- Que pueda ver su progreso en indicadores de juego, hábitos y rango a lo largo del tiempo.
- Que la metodología tenga respaldo de las ciencias del deporte y pueda validarse como proyecto académico.

**Alcance confirmado:** MVP de un solo juego (League of Legends), primero en móvil, en español, para jugadores de Latinoamérica de todos los rangos, con mayor énfasis en rangos bajos. Las decisiones completas están en la sección 11.

## 2. Problema, oportunidad y diferenciación

La mayoría de jugadores amateur juega muchas horas sin un plan: repiten partidas pero no saben qué entrenar ni cómo, y descuidan sueño, postura, fatiga y control emocional.

**Problemas del usuario**

- No sabe por qué pierde ni qué lo separa del rango siguiente.
- Las estadísticas de los trackers no se traducen en ejercicios concretos.
- El coaching humano es caro y escaso en Latinoamérica.
- Sobrecarga de horas de juego, molestias en muñecas, cuello y espalda, y "tilt".

**Competencia de referencia**

| App | Juegos | Fuerte en | Lo que no cubre |
| --- | --- | --- | --- |
| Mobalytics | LoL, TFT, Valorant y otros | Análisis de partidas, builds, guías | Preparación física, carga, psicología |
| Leetify | CS2 | Análisis automático y prácticas sugeridas | Solo un juego; poco enfoque en bienestar |
| Blitz | Varios | Estadísticas y overlays en vivo | Plan de entrenamiento estructurado |
| FITGMR | General | Salud y bienestar del gamer | Análisis de partidas por juego |

**Diferenciación**

1. Plan de entrenamiento periodizado (microciclos, carga, recuperación), no solo consejos sueltos.
2. Cinco dimensiones integradas: mecánica, táctica, cognitiva, física y psicológica.
3. Control de carga de juego y señales de fatiga, como en el deporte tradicional.
4. Contenido en español, pensado para Latinoamérica.
5. Metodología respaldada por un estudio piloto con datos propios.

## 3. Usuarios objetivo

El usuario principal es el jugador amateur de rango medio que quiere subir y está dispuesto a seguir un plan; los demás perfiles se atienden en fases posteriores.

| Perfil | Descripción | Necesidad principal | Fase |
| --- | --- | --- | --- |
| Jugador amateur competitivo | 16–30 años, rangos bajo y medio, 10–25 h de juego por semana | Saber qué entrenar y ver progreso | MVP |
| Jugador semiprofesional | Rangos altos, compite en torneos locales | Afinar detalles, gestionar carga | Fase 2 |
| Entrenador / coach | Dirige uno o varios jugadores o equipos | Asignar planes y seguir a sus jugadores | Fase 2 |
| Equipo o club universitario | Liga universitaria o club de esports | Gestión grupal, preparación física colectiva | Fase 3 |
| Padres / tutores | Familia de jugadores menores de edad | Hábitos saludables y control de tiempo | Por definir |

**Persona de referencia (MVP):** Andrés, 20 años, estudiante en Bogotá, juega LoL de support en rango Oro unas 3 horas diarias. Lleva dos temporadas estancado, se frustra después de perder dos partidas seguidas y tiene molestias en la muñeca. Quiere subir a Platino antes de fin de temporada.

## 4. Alcance por fases

El MVP cubre un juego, análisis por API y asignación de ejercicios por reglas; la IA, el análisis de video y los multijuego llegan después.

| Fase | Incluye | Excluye |
| --- | --- | --- |
| MVP (piloto académico) | 1 juego (LoL), conexión de cuenta por API, 6–10 indicadores, comparación con promedios del rango, banco de \~60 ejercicios en 5 dimensiones, plan semanal por reglas, registro de sueño/fatiga/ánimo, seguimiento de progreso | Video, IA generativa, coaches, pagos, otros juegos |
| Fase 2 | Segundo juego (Valorant o CS2), recomendaciones con IA, perfil de coach, recordatorios, gamificación | Análisis de video, equipos |
| Fase 3 | Análisis de video / VOD con visión por computador, equipos y clubes, integración con wearables, marketplace de coaches | — |

**Fuera de alcance en todas las fases:** trampas, automatización dentro del juego, overlays que den ventaja en partida en vivo, o cualquier función que incumpla las políticas de los desarrolladores de los juegos.

## 5. Requisitos funcionales

La app tiene siete módulos; los marcados "MVP" son obligatorios para el piloto.

**M1. Registro y onboarding (MVP)**

- RF-01 Registro con correo o cuenta de Google; verificación de edad.
- RF-02 Selección de juego, rol/posición principal y rango actual.
- RF-03 Vinculación de la cuenta del juego (Riot ID) para importar partidas.
- RF-04 Cuestionario inicial: horas de juego, sueño, actividad física, molestias, objetivos, disponibilidad semanal.
- RF-05 Pruebas base opcionales: tiempo de reacción, atención, movilidad de muñeca.

**M2. Importación y análisis de partidas (MVP)**

- RF-06 Importar automáticamente las últimas partidas clasificatorias.
- RF-07 Permitir al usuario elegir qué partida analizar.
- RF-08 Calcular indicadores clave por rol (farmeo, control de oleadas, visión, rotaciones en el mapa, toma de decisiones, objetivos, picks y counterpicks, entre otros).
- RF-09 Comparar cada indicador con el promedio de su rango y del rango siguiente.
- RF-10 Mostrar las 3 falencias principales con explicación redactada por IA y gráficas.

**M3. Diagnóstico del jugador (MVP)**

- RF-11 Analizar una partida individual o la tendencia de las últimas 5 partidas, según elija el usuario.
- RF-12 Generar un perfil por dimensión (mecánica, táctica, cognitiva, física, psicológica).

**M4. Plan de entrenamiento (MVP)**

- RF-13 Generar un microciclo semanal según falencias, rango y disponibilidad.
- RF-14 Cada ejercicio con objetivo, instrucciones, duración, series, criterio de éxito y video o imagen.
- RF-15 Marcar ejercicios como hechos y registrar percepción de esfuerzo.
- RF-16 Reajustar el plan cada semana según cumplimiento y resultados.

**M5. Bienestar y carga (MVP)**

- RF-17 Registro diario breve de sueño, fatiga, ánimo y molestias.
- RF-18 Alertas de sobrecarga (exceso de horas, derrotas seguidas, mal descanso).
- RF-19 Rutinas de pausas activas, calentamiento pre-partida y vuelta a la calma.

**M6. Progreso (MVP)**

- RF-20 Gráficas de evolución de indicadores, rango y cumplimiento del plan.
- RF-21 Resumen semanal con logros y foco de la siguiente semana.

**M7. Comunidad y coach (Fase 2)**

- RF-22 Perfil de entrenador que asigna y revisa planes.
- RF-23 Retos, logros y rachas.
- RF-24 Biblioteca de contenidos y guías por juego.

## 6. Modelo de entrenamiento y lógica de asignación

El plan se construye con principios de entrenamiento deportivo: diagnóstico, periodización en microciclos, control de carga y reajuste semanal según resultados.

Ciclo: importar partida → medir indicadores → comparar con el rango → top 3 falencias → asignar ejercicios → entrenar la semana → reajustar el plan (y se repite con la siguiente partida).

El ciclo se repite con cada partida importada; el plan se reajusta una vez por semana para no cambiarlo tras cada resultado aislado.

**Las cinco dimensiones**

| Dimensión | Qué se entrena | Ejemplos de ejercicios | Cómo se mide |
| --- | --- | --- | --- |
| Mecánica | Ejecución, precisión, farmeo, combos | Herramienta de práctica: último golpe 10 min, combos por campeón | CS/min, precisión, errores en práctica |
| Táctica | Decisiones, mapa, objetivos, posicionamiento | Revisión guiada de 3 momentos clave de la partida, ejercicios de lectura de minimapa | Visión, muertes evitables, control de objetivos |
| Cognitiva | Atención, reacción, memoria de trabajo, toma de decisiones bajo presión | Tareas de tiempo de reacción, atención dividida, Stroop | Tiempo de reacción, aciertos |
| Física | Movilidad, postura, prevención de lesiones, condición general | Movilidad de muñeca y antebrazo, cuello y espalda, pausas activas, actividad aeróbica | Molestias reportadas, adherencia |
| Psicológica | Manejo del tilt, rutinas, autorregulación, motivación | Respiración pre-partida, regla de parada tras derrotas, diario de partida | Ánimo, derrotas seguidas, autoevaluación |

**Reglas de asignación (MVP)**

1. Para cada indicador se calcula la brecha frente al promedio del rango siguiente.
2. Las 3 brechas mayores definen el foco de la semana; cada una activa un bloque de ejercicios.
3. Los bloques físico y psicológico se incluyen siempre en dosis base (prevención y rutina).
4. El volumen total se ajusta a la disponibilidad declarada y a la carga de juego de la semana.
5. Si el registro de bienestar muestra fatiga alta o mal sueño, se reduce la carga y se prioriza recuperación.
6. Al final de la semana, si el indicador mejora, el bloque baja de prioridad; si no, se mantiene o se cambia el ejercicio.

**Estructura de un microciclo tipo (5 días)**

- Cada sesión: calentamiento (5–10 min), bloque técnico-táctico (20–30 min), bloque cognitivo o físico (10–15 min), partidas con objetivo concreto, vuelta a la calma y registro.
- 1–2 días de descanso o carga baja por semana.

## 7. Datos, integraciones y arquitectura

El MVP obtiene las partidas por la API oficial de Riot, no por video, porque es más preciso, más barato y cumple las políticas del juego.

**Fuentes de datos**

| Fuente | Qué aporta | Fase | Condición |
| --- | --- | --- | --- |
| Riot Games API (LoL) | Historial y detalle de partidas, rango, cuenta | MVP | Clave de desarrollador; aprobación de clave de producción para usuarios reales |
| Riot API (Valorant / TFT) | Partidas y rango | Fase 2 | Aprobación específica de Riot |
| Archivos demo de CS2 | Detalle tick a tick de la partida | Fase 2 | El usuario sube el archivo; requiere parser |
| Video / VOD | Posicionamiento, mecánica visual | Fase 3 | Visión por computador; alto costo |
| Registros del usuario | Sueño, fatiga, ánimo, molestias, esfuerzo | MVP | Consentimiento informado |
| Pruebas cognitivas en la app | Reacción, atención | MVP | Diseñadas y validadas por el equipo |

**Arquitectura propuesta (MVP)**

- **Cliente:** app móvil y web con un mismo código (por ejemplo React Native/Expo o Flutter).
- **Backend:** API propia (por ejemplo Node.js o Python) que guarda la clave de Riot; la clave nunca va en la app.
- **Base de datos:** usuarios, partidas, indicadores, ejercicios, planes y registros (por ejemplo PostgreSQL o un servicio administrado tipo Supabase/Firebase).
- **Motor de análisis:** procesos que calculan indicadores y promedios por rango a partir de una muestra de partidas.
- **Motor de reglas:** convierte brechas en bloques de ejercicios (sección 6).
- **Panel de administración:** para cargar y editar el banco de ejercicios sin programar.

**Datos de referencia por rango:** se construyen recolectando una muestra de partidas por rango y rol, respetando los límites de uso de la API.

## 8. Requisitos no funcionales, legales y éticos

Como la app maneja datos personales y de bienestar, y puede tener usuarios menores de edad, la privacidad y el consentimiento son requisitos del MVP, no de fases futuras.

**No funcionales**

- RNF-01 El análisis de una partida tarda menos de 30 segundos.
- RNF-02 Interfaz en español, clara y legible, usable en celulares de gama media.
- RNF-03 Funciona con conexiones lentas; los ejercicios del día se pueden ver sin conexión.
- RNF-04 Datos cifrados en tránsito y en reposo; claves de API solo en el servidor.
- RNF-05 Accesibilidad básica: contraste, tamaño de texto ajustable, videos con subtítulos.

**Legales**

- Cumplir la Ley 1581 de 2012 de protección de datos personales en Colombia: política de tratamiento, autorización expresa y derecho a eliminar datos.
- Datos de bienestar (sueño, ánimo, molestias) tratados como sensibles.
- Menores de edad (la app no tendrá edad mínima): autorización de padres o tutores, límites de tiempo de juego y protección reforzada de sus datos.
- Cumplir los términos y políticas de desarrollador de Riot y de cada juego.

**Éticos y de salud**

- La app no diagnostica lesiones ni problemas de salud mental; ante molestias persistentes o señales de riesgo recomienda consultar a un profesional.
- Promueve límites de tiempo de juego saludables y no premia jugar más horas.
- Ejercicios físicos revisados por profesionales de ciencias del deporte o fisioterapia.
- Para el piloto académico: consentimiento informado y aval del comité de ética de la universidad.

## 9. Métricas de éxito y validación

El MVP se considera exitoso si los usuarios siguen el plan y mejoran sus indicadores frente a un grupo que no lo usa; las cifras meta de esta tabla son propuestas a confirmar.

| Tipo | Métrica | Meta propuesta |
| --- | --- | --- |
| Rendimiento | Mejora de los indicadores foco tras 6–8 semanas | Mejora significativa frente a línea base |
| Rendimiento | Usuarios que suben al menos una división | Mayor proporción que el grupo control |
| Adherencia | Sesiones completadas del plan semanal | ≥ 60 % |
| Retención | Usuarios activos a las 4 semanas | ≥ 40 % |
| Bienestar | Molestias físicas y sueño reportados | Igual o mejor que la línea base |
| Satisfacción | Utilidad percibida (escala 1–5) | ≥ 4 |

**Diseño del piloto sugerido**

1. Muestra de 20–40 jugadores de un mismo juego y rangos similares.
2. Evaluación inicial: indicadores de juego, pruebas cognitivas, cuestionarios de bienestar.
3. Intervención de 6–8 semanas con el plan de la app (grupo control sin plan, si es posible).
4. Evaluación final con las mismas pruebas y análisis estadístico pre/post.

## 10. Riesgos y supuestos

El mayor riesgo es depender del acceso a la API del juego; el segundo, que los usuarios no sigan el plan.

| Riesgo | Impacto | Mitigación |
| --- | --- | --- |
| Riot niega o limita la clave de producción | Alto: sin datos no hay análisis | Empezar con clave personal en el piloto; plan B con carga manual de estadísticas |
| Cambios en la API o en el juego (parches) | Medio | Revisar indicadores y promedios cada parche |
| Baja adherencia al plan | Alto | Sesiones cortas, recordatorios, rachas, plan ajustado a disponibilidad |
| Mejorar indicadores no garantiza subir de rango | Medio | Comunicar expectativas realistas; medir rango y también indicadores |
| Ejercicios físicos mal ejecutados | Medio | Videos claros, progresiones, revisión profesional |
| Falta de equipo técnico para programar | Alto | Prototipo sin código o alianza con estudiantes de ingeniería de sistemas |
| Manejo inadecuado de datos de menores | Alto | Autorización de tutores y datos mínimos para menores |

**Supuestos principales:** el usuario juega en PC, tiene smartphone, quiere subir de rango y dedicaría alrededor de 2–3 horas diarias al entrenamiento.

## 11. Decisiones tomadas

Con las respuestas del 22 de octubre el MVP queda definido: League of Legends, móvil primero, modelo freemium, todos los rangos con énfasis en los bajos, y el diseño se entrega hoy.

| Tema | Decisión |
| --- | --- |
| Tipo de proyecto | Trabajo de una materia; asesor: profesor de entrenamiento deportivo |
| Entregable | Diseño hoy; prototipo navegable; app funcional si es posible |
| Equipo y recursos | Leo solo, sin experiencia en programación, sin presupuesto |
| Modelo de negocio | Freemium: versión gratuita y versión de pago por suscripción; patrocinios deseables |
| Juego | League of Legends; Leo lo juega ocasionalmente y conoce jugadores |
| Contenido | Repertorio amplio de la escena competitiva; todos los roles |
| Rangos | Todos, con mayor enfoque en rangos bajos |
| Edad | Sin edad mínima; menores con autorización de tutores |
| Región | Latinoamérica primero; global a futuro |
| Tipos de usuario | Jugador, semiprofesional, coach, equipos y clubes |
| Tiempo de entrenamiento | Alrededor de 2–3 horas diarias |
| Usuarios del piloto | Hay comunidad de jugadores para reclutar |
| Carga de partidas | Conectar la cuenta y leer el historial (MVP); subir video en una fase futura |
| Tipo de análisis | Partida individual o tendencia, a elección del usuario; máximo las últimas 5 partidas |
| Indicadores | Farmeo, control de oleadas, visión, rotaciones, toma de decisiones, objetivos, picks y counterpicks, entre otros |
| Comparación | Promedio del rango actual y del rango siguiente |
| Presentación | Texto y gráficas; IA para redactar las explicaciones |
| Peso por dimensión | Mayor énfasis en mecánica |
| Periodización | Microciclos semanales o bloques |
| Medida de carga | Horas de juego |
| Si no cumple el plan | Se notifica y el plan se ajusta |
| Bienestar | Apartado propio; notifica y recomienda; incluye sueño, nutrición e hidratación y límites de horas |
| Plataformas | Varias, empezando por móvil |
| Gamificación | Sí: herramientas que motiven a usar la app cuando se juega |
| Comunidad / chat | No por ahora |
| Notificaciones | Pocas |
| Tono | Lo elige el usuario |
| Piloto académico | Grupo control: interesante incluirlo |

## 12. Recomendaciones para lo que quedó abierto

Donde no había respuesta, propongo lo siguiente; todo se puede cambiar.

- **Validar ejercicios:** usar artículos científicos de esports y ciencias del deporte (Google Scholar, PubMed) y la revisión de tu profesor; las páginas web generales no bastan como respaldo académico.
- **Ejercicios cognitivos:** dentro de la app, en versión simple (tiempo de reacción, atención, memoria de trabajo).
- **Ejercicios mecánicos:** la Herramienta de práctica del propio LoL (último golpe, combos), con objetivos medibles.
- **Instrumentos de bienestar:** escala de esfuerzo percibido Borg CR-10 después de cada sesión; cuestionario diario breve tipo Hooper (sueño, fatiga, estrés, dolor muscular, escala 1–7); índice de calidad de sueño de Pittsburgh al inicio y al final del piloto.
- **Wearables:** dejarlos para una fase futura.
- **Nombre (ideas):** elegido GGym. Falta verificar que no esté registrado como marca ni usado por otra app.
- **Identidad visual:** fondo índigo profundo, tarjetas translúcidas con bordes muy redondeados, chips en forma de píldora, acento violeta y rosa, tipografía Poppins y barra de navegación flotante.
- **Clave de API:** es el permiso gratuito que da Riot para leer datos de partidas; se solicita en el portal de desarrolladores de Riot. Para el prototipo basta la clave de desarrollo temporal.
- **Cómo construirlo sin programar:** el diseño y el prototipo navegable los puedo hacer yo aquí; para la app funcional, seguir la sugerencia del profesor y usar Claude Code, empezando por una app web adaptada a celular.
- **Alojamiento:** planes gratuitos de servicios como Vercel y Supabase; el mantenimiento queda a tu cargo.
- **Gratis vs. pago:** gratis = análisis de la última partida, 3 falencias y plan básico; pago = tendencia de 5 partidas, plan completo periodizado, apartado de bienestar avanzado y sin anuncios. El precio se valida con una encuesta a jugadores.
- **Patrocinio:** empezar por clubes y ligas universitarias, tiendas gamer y marcas de periféricos locales, usando los resultados del piloto como argumento.

## 13. Preguntas pendientes

- [ ] ¿El nombre GGym está libre como marca y en las tiendas de apps?
- [ ] ¿Estás de acuerdo con la división entre versión gratuita y de pago?
- [ ] ¿Cuántos jugadores puedes reclutar para el piloto?
- [ ] ¿El profesor pide un formato específico para entregar el diseño (pantallas, PDF, presentación)?
