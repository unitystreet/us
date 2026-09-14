# Afina — copiloto Affinity

Sistema que traduce tutoriales de **Adobe Photoshop / Illustrator** al flujo de trabajo
equivalente en **Affinity Photo / Designer / Publisher**, actuando como un experto en
diseño, composición y retoque que conoce ambos ecosistemas.

Este proyecto vive en su propia carpeta dentro del repositorio `us` (catálogo de
Unity Street) porque es un producto independiente, no una función del catálogo.

## Investigación y análisis previo (resumen)

Antes de construir el sistema se investigó qué es realmente factible:

1. **Traducción de conocimiento** (Photoshop/Illustrator → Affinity): totalmente viable.
   La mayoría de herramientas tienen equivalente directo o casi directo (capas de
   ajuste, máscaras, pluma, pathfinder, RAW). Un grupo menor son *brechas reales* sin
   solución 1:1 (Symbols vinculados, Live Paint, Blend Tool, Gradient Mesh): para esos
   casos el sistema no inventa una respuesta, marca el hueco y ofrece el mejor
   workaround conocido.
2. **"Ver" el tutorial en video y flotar sobre la pantalla en tiempo real**: esto
   requiere una app nativa de escritorio con permisos de superposición de ventana y,
   opcionalmente, transcripción de audio — no es algo que se pueda ejecutar ni probar
   visualmente desde un entorno remoto sin pantalla. Por eso el sistema se entrega en
   dos piezas honestas sobre sus propios límites:
   - Un **prototipo web** (Artifact) que se puede abrir y probar ahora mismo.
   - El **código fuente completo de una app de escritorio (Electron)** con ventana
     flotante *always-on-top* real, que el usuario compila e instala en su propia
     máquina.

## Estructura

```
affinity-ai/
├── core/                    # Motor compartido (sin dependencias)
│   ├── knowledge-base.js    # Mapeo experto PS/AI -> Affinity (herramientas, atajos, notas)
│   └── engine.js            # Búsqueda local + construcción del prompt experto para IA
├── web-prototype/
│   └── index.html           # Publicado como Artifact — pruébalo ya
└── desktop-app/              # App Electron "Afina" (ventana flotante real)
    ├── package.json
    ├── main.js               # Proceso principal: ventana always-on-top, IPC, llamadas a API
    ├── preload.js
    └── src/                  # Interfaz (Rápido / Tutorial / Ajustes)
```

## Cómo funciona el motor de traducción

`core/knowledge-base.js` contiene entradas con este formato:

```js
{
  id, source_app, category, aliases,
  affinity_app, equivalent, location, shortcut, notes,
  confidence: "estable" | "similar" | "workaround" | "verificar"
}
```

`confidence` es la parte honesta del sistema:

| Nivel | Significa |
|---|---|
| `estable` | Equivalencia directa, nombre/ubicación estable entre versiones |
| `similar` | El concepto existe pero el flujo difiere |
| `workaround` | Affinity no tiene el feature 1:1; se describe cómo lograr el mismo resultado |
| `verificar` | La ubicación exacta puede haber cambiado según la versión de Affinity instalada |

`core/engine.js` expone:
- `search(query)` — coincidencias instantáneas para una herramienta puntual.
- `translateText(tutorialText)` — recorre una transcripción/lista de pasos y marca qué
  líneas coinciden con la base de conocimiento local.
- `buildExpertPrompt(tutorialText, localMatches)` — arma el prompt para pedirle a un
  modelo de IA (Claude) una traducción completa y razonada del tutorial, con las
  coincidencias locales como contexto para que no tenga que adivinar terminología.

## Prototipo web

Publicado como Artifact: ábrelo, arrastra el panel flotante, prueba el traductor
rápido o pega un tutorial completo en la pestaña "Analizar tutorial". El análisis
experto usa la capacidad `sample` de Claude directamente desde el navegador — no
requiere backend ni clave de API propia.

## App de escritorio (Electron)

Ventana flotante real, *siempre visible* sobre cualquier programa (Photoshop
incluido), con atajo global `Ctrl/Cmd+Alt+A` para mostrarla u ocultarla.

### Instalar y ejecutar

```bash
cd affinity-ai/desktop-app
npm install
npm start
```

### Configurar las claves de API (Ajustes, dentro de la app)

- **Anthropic (Claude)** — para el análisis experto de tutoriales. Se guarda solo en
  tu computadora (`userData/afina-config.json`), nunca en este repositorio.
- **OpenAI (Whisper)** — opcional, solo si quieres transcribir un archivo de
  audio/video directamente dentro de la app en vez de pegar el texto a mano.

### Empaquetar como instalador

```bash
npm run dist
```

Genera el instalador (`.dmg` / `.exe` / `.AppImage`) con `electron-builder` según tu
sistema operativo.

## Limitaciones conocidas (por diseño, no por descuido)

- La app de escritorio **no fue ejecutada ni probada visualmente** en este entorno de
  desarrollo remoto (no tiene pantalla). El código sigue las prácticas estándar de
  Electron (contextIsolation, sandbox, CSP, sin nodeIntegration en el renderer) pero
  debe probarse en una máquina real antes de confiar en ella para trabajo productivo.
- No hay lectura automática de video/pantalla en tiempo real. La ruta de entrada es
  texto (pegado) o transcripción de un archivo de audio/video vía Whisper — no captura
  de pantalla en vivo ni reconocimiento de lo que se ve en el video.
- La base de conocimiento es un punto de partida experto, no exhaustivo. Las entradas
  marcadas `verificar` señalan honestamente dónde la ubicación exacta puede haber
  cambiado entre versiones de Affinity.

## Roadmap sugerido

1. Ampliar `knowledge-base.js` con más entradas (Affinity Publisher, maquetación).
2. Captura de pantalla + reconocimiento de la app activa para sugerir el equivalente
   sin que el usuario tenga que pegar texto.
3. Modo "overlay" real en macOS/Windows con nivel de ventana por encima de apps a
   pantalla completa (`screen-saver` en lugar de `floating`).
