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
