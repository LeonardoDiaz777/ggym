# GGym · Entrena como atleta

App web para celular que analiza partidas de League of Legends y asigna un plan de entrenamiento semanal (mecánica, táctica, cognitiva, física y psicológica) según el rango y las falencias del jugador. Proyecto académico de entrenamiento deportivo.

**Abrir la app:** https://leonardodiaz777.github.io/ggym/

## Instalar en el celular

- **Android (Chrome):** abre el enlace → menú ⋮ → **Instalar app** o **Agregar a pantalla principal**.
- **iPhone (Safari):** abre el enlace → botón **Compartir** → **Agregar a inicio**.

## Qué incluye

- **MVP (funciona):** 6 pantallas, análisis de una partida o de las últimas 5, plan semanal por reglas con periodización de 6 semanas, bienestar con alertas, prueba de reacción, progreso y logros, GGym Pro en modo demostración.
- **Fase 2 y 3 (demostración):** selector de juegos, modo entrenador, análisis de video y hoja de ruta.

Los datos de las partidas son **de ejemplo** hasta conectar la API de Riot (`js/riot-api.js`). Todo se guarda solo en el celular del usuario.

## Archivos

| Archivo | Qué hace |
| --- | --- |
| `index.html` | Página principal |
| `css/estilos.css` | Diseño visual |
| `js/app.js` | Pantallas y navegación |
| `js/motor.js` | Análisis y reglas del plan de entrenamiento |
| `js/datos.js` | Indicadores, promedios por rango y banco de ejercicios |
| `js/riot-api.js` | Conexión con Riot (hoy: partidas de ejemplo) |
| `js/almacen.js` | Guardado en el celular |
| `js/graficos.js` | Íconos, gráficas e ilustraciones |
| `sw.js`, `manifest.webmanifest` | Permiten instalar la app y usarla sin conexión |

Más detalles en `CLAUDE.md` y `docs/spec.md`.
