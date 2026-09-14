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

## Paleta y tipografía — ya implementado (2026-09-14)

Con la autorización de plena libertad, esto dejó de ser propuesta y se
aplicó directamente en `assets/css/style.css` e `index.html`:

- **Tipografía:** se reemplazó la fuente script `Mr De Haviland`
  (típica de plantillas de decoración, no encajaba con streetwear) por
  **Bebas Neue** — condensada, bold, urbana. Se aplicó al logo
  (header/footer), a todos los títulos de sección (`.h2.section-title`:
  "Nuestros Drops", "Únete a la lista") y al título "Unity Street" del
  Sobre Nosotros. El texto de cuerpo se mantuvo en Roboto.
- **Paleta:** el sitio ya tenía un rojo de acento consistente
  (`--tan-crayola`, usado en hovers y estados activos) — se aprovechó
  en vez de inventar uno nuevo. Se unificaron los badges "Sale" (antes
  naranja genérico → ahora el rojo de marca) y "-10%" (antes cian
  genérico → ahora negro), quedando negro/blanco + rojo como paleta
  completa y consistente en todo el sitio.

Verificado visualmente con Playwright antes de subir — la fuente carga
bien (Google Fonts es alcanzable) y se ve claramente distinta al
fallback anterior.

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
  `catalogo.md` para el detalle completo.
- **2026-09-14 (continuación, "sigue")** — Se implementa la propuesta
  de tipografía (Bebas Neue) y se unifica la paleta de badges al rojo
  de marca ya existente. Ya no queda ninguna decisión de diseño visual
  pendiente de ejecución técnica — lo que resta (ver `estrategia.md` y
  `tareas/inbox.md`) es de negocio, no de diseño: modelo de drops,
  propuesta de valor final, más inventario, y el tema legal del nombre.
