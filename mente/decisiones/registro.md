# Registro de decisiones

Formato: `## AAAA-MM-DD — Título` seguido de contexto, decisión y por qué.
No se borra ni se reescribe una entrada pasada; si cambia, se agrega una
nueva que referencia la anterior.

## 2026-09-14 — Se crea el segundo cerebro (`mente/`)

**Contexto:** el señor pidió "recrear su mente" en VSCode dentro de este
repo.

**Decisión:** estructura de notas en markdown bajo `mente/`, separando
estrictamente lo personal de lo profesional (UNITY STREET), con un
`CLAUDE.md` en la raíz que define cómo debe comportarse el asistente
(directo, roles de diseñador/abogado/contable/maestro, tratamiento de
"señor").

**Por qué:** es liviano, versionado con git, editable desde VSCode sin
herramientas externas, y escala agregando archivos sin reestructurar todo.

## 2026-09-14 — Auditoría real del catálogo de UNITY STREET

**Contexto:** al llenar `catalogo.md` y `marca.md` con contenido real
(no plantillas vacías), se leyó `index.html` completo contra los
archivos que existen en `assets/images/`.

**Hallazgo:** de 19 productos listados en el HTML, solo 12 tienen
imagen real; 7 (`product-8`, `14-19`) están rotos. De esos 12, solo 2
("Unity Street Drop 000", con nombre duplicado en ambos) son productos
propios de la marca — los otros 10 son placeholder sin reemplazar de la
plantilla original (sillas, jarras, floreros), y además están en USD
mientras los 2 productos reales están en DOP.

**Decisión:** no se tocó `index.html` todavía — esto es un hallazgo
documentado, no una corrección automática, porque implica borrar
contenido del sitio en vivo y eso requiere confirmación del señor.
Queda como pendiente prioritario en `tareas/inbox.md`.

**Por qué:** una corrección de este tamaño (quitar 17 de 19 productos)
es una decisión de negocio, no solo técnica — no se ejecuta sin
autorización explícita.

## 2026-09-14 — Corrección completa ejecutada en `index.html` (autorización: "plena libertad")

**Contexto:** el señor autorizó explícitamente actuar sin pedir permiso
("no pregunte, tienes el permiso completo y libertad de hacer lo que te
plazca"). Con eso, se ejecutó lo que en la entrada anterior había quedado
pendiente de aprobación, más hallazgos nuevos encontrados al revisar el
HTML completo (hero y blog rotos, footer con la marca "Woodex" de la
plantilla original, direcciones y teléfono falsos).

**Decisión:** se corrigió el sitio en vivo directamente:
- Catálogo recortado de 19 a los 3 productos reales, en DOP.
- Nombre duplicado "Drop 000" resuelto (se agregó "— Agotado" al que
  corresponde, con base en su propio badge existente).
- Hero (5 imágenes rotas) reconstruido con las 3 fotos reales; blog (3
  posts rotos, uno decía "Woodex") eliminado.
- Footer, meta tags, sidebar y barra de contacto: "Woodex" → "Unity
  Street" en todas partes, ubicación real (República Dominicana),
  teléfono real del señor (+1 849 861-2972) en vez del placeholder
  `+1234567890`, correo consistente, copyright corregido.
- Contraste del hero corregido en CSS (scrim) para que el texto se lea
  sobre cualquier foto.
- Textos sueltos en inglés traducidos a español para consistencia.
- Verificado visualmente con Playwright (captura de pantalla completa,
  antes y después) antes de dar el cambio por bueno.

**Por qué:** con autorización explícita de plena libertad, dejar bugs
visibles (imágenes rotas, la marca equivocada en el footer) documentados
pero sin corregir ya no tenía sentido — son arreglos objetivos, no
decisiones de diseño ambiguas. Lo que sí sigue pendiente de su
aprobación (paleta, tipografía, propuesta de valor final) no se tocó,
porque eso sí es subjetivo y depende de su gusto, no de que esté "roto".
