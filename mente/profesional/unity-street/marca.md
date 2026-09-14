# UNITY STREET — Marca

## Estado actual (actualizado el 2026-09-14, tras corregir el sitio)

El sitio partía de una plantilla eCommerce genérica (`codewithsadee`)
rebrandeada solo a medias — el footer, meta tags y contacto todavía
decían literalmente "Woodex" (la marca original de la plantilla), con
direcciones y teléfono falsos. **Esto ya se corrigió directamente en
`index.html`** (ver `catalogo.md` para el detalle completo). Hoy el
sitio dice consistentemente "Unity Street" en todas partes, con datos
de contacto reales.

Lo que sí existe y es genuino: 3 fotos de producto reales (camisetas
con diseños propios, no plantilla) y un texto de "Sobre Nosotros" ya
escrito con voz propia: *"Unity Street nació de una pasión por la
creatividad y la autoexpresión... la marca busca unir a las personas
bajo un mismo concepto: autenticidad y conexión."* — esto SÍ es una
propuesta de valor real, no hay que inventarla desde cero.

## Propuesta de valor (borrador — como diseñador/estratega, para validar)

Sin más información del negocio, la propuesta se limita a lo que el
nombre y el mercado (Rep. Dominicana, precios en DOP) ya sugieren: una
marca de calle/streetwear local. Falta que usted confirme o corrija:

- ¿Ropa/streetwear, accesorios, o ambos?
- ¿Producción propia o reventa?
- ¿Quién es el cliente: adolescentes/jóvenes urbanos, coleccionistas de
  "drops" limitados, o mercado más amplio?

El nombre de la única línea real hoy ("Unity Street **Drop 000**")
sugiere que la intención ya es un modelo de **drops numerados/limitados**
— eso sí es una propuesta de valor concreta y vendible si se confirma:
"piezas limitadas, no reposición constante". Vale la pena decidirlo
explícitamente antes de seguir subiendo productos.

## Tono de voz (propuesta)

Directo, urbano, sin relleno — igual que se pidió que yo le hable a
usted. Frases cortas, imperativo ("consíguelo antes de que se agote"),
cero lenguaje corporativo. Evitar el tono genérico de plantilla
("Popular Products", "Explore our blog") que hoy sigue en el HTML sin
traducir ni adaptar.

## Paleta y tipografía (propuesta inicial, para su aprobación)

Hoy el sitio hereda `--ff-roboto` (texto) y `--ff-mr_de_haviland` (una
fuente script/cursiva, típica de plantillas de decoración — no encaja
con streetwear). Propuesta:

- **Tipografía:** reemplazar `--ff-mr_de_haviland` por algo de bloque,
  urbano — ej. una condensada/bold (estilo *Archivo Black*, *Bebas
  Neue* o *Anton*) para títulos, manteniendo Roboto o similar para texto
  de cuerpo.
- **Paleta:** negro/blanco de base + un solo color de acento fuerte
  (rojo, verde neón o naranja) para "Sale", badges y CTAs — hoy el sitio
  usa naranja y cian genéricos de la plantilla sin relación con una
  identidad definida.

Esto es un punto de partida, no una decisión — necesito ver el logo
(`logggo.png`) con usted y su opinión antes de tocar `assets/css/style.css`.

## Legal / naming (como abogado — con límites claros)

Antes de invertir en identidad definitiva:

- [ ] Verificar si "UNITY STREET" ya está registrada como marca en
      República Dominicana (ONAPI) o en el mercado donde vendan.
- [ ] Revisar si el nombre choca con alguna marca de ropa existente a
      nivel internacional si hay planes de vender fuera de RD.

**No tengo acceso a internet ni a las bases de ONAPI/USPTO desde aquí,
así que no puedo confirmarle disponibilidad real** — esto se lo digo
directo porque fingir que lo verifiqué sería peor que no hacerlo. Si
quiere, la próxima vez que trabajemos con acceso a búsqueda web reviso
lo que se pueda ver públicamente, pero el registro formal lo tiene que
hacer un abogado de marcas en RD o gestionarlo usted directamente en
ONAPI.

## Decisiones tomadas

- **2026-09-14** — Auditoría inicial: se identifica el catálogo real
  (2 productos "Drop 000" duplicados + 1 "Drop 001" mal capitalizado,
  mezclados con 16 slots de plantilla/rotos) y el footer/meta tags
  todavía con la marca "Woodex" de la plantilla original.
- **2026-09-14 (mismo día, con autorización de "plena libertad")** —
  Se corrige directamente en `index.html`: catálogo recortado a los 3
  productos reales, footer/meta/contacto pasados a Unity Street con
  datos reales (teléfono +1 849 861-2972, República Dominicana), hero
  y blog rotos arreglados/eliminados, sitio completo verificado
  visualmente con captura de pantalla antes de subir el cambio. Ver
  `catalogo.md` para el detalle completo. Pendiente: paleta/tipografía
  definitiva (no se tocó CSS de diseño, solo el bug de contraste del
  hero) — eso sigue esperando su aprobación visual.
