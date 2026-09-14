# UNITY STREET — Catálogo

Fuente de verdad del catálogo: `assets/images/product-*.{jpg,png}` +
markup en `index.html`. Este archivo es para notas y auditoría, no para
duplicar el inventario a mano.

## 2026-09-14 — Auditoría y corrección aplicada directamente al sitio

Se encontró y **ya se corrigió** en `index.html` lo siguiente (con
autorización expresa del señor para actuar sin pedir permiso paso a paso):

### Lo que estaba mal

- El HTML listaba **19 productos**, pero solo existían **12 imágenes
  reales** en `assets/images/` — 7 (`product-8`, `14-19`) apuntaban a
  archivos inexistentes → imágenes rotas visibles en el sitio en vivo.
- De los 12 restantes, **solo 3 eran productos reales de la marca**
  (`product-1`, `product-2`, `product-3` — corregido: no eran mubles/
  decoración, son fotos reales de camisetas Unity Street; el texto
  `alt` y metadata sí eran placeholder de la plantilla original, eso
  confundió el primer análisis). Los otros 9 (`product-4` a `13` salvo
  el 8) eran fotos y nombres de la plantilla original (sillas, jarras,
  floreros) sin relación con la marca.
- `product-1` y `product-2` tenían el **mismo nombre** ("Unity Street
  Drop 000" / "Unity street drop 000").
- Precios mezclaban **DOP** (productos reales) y **USD** (placeholders).
- El hero de la portada (5 imágenes) y el blog (3 posts) apuntaban a
  archivos que **nunca existieron** (`hero-product-*.jpg`, `blog-*.jpg`)
  — rotos desde el día uno.
- El footer, meta tags y barra de contacto todavía decían **"Woodex"**
  (la marca original de la plantilla), con dirección falsa en Chicago Y
  otra falsa en Nueva York, teléfono placeholder `+1234567890`, y el
  copyright acreditaba a "codewithsadee" como dueño del sitio.

### Lo que se hizo

- Catálogo recortado a los **3 productos reales**: Drop 000 (disponible,
  con descuento activo), Drop 000 — Agotado, Drop 001. Todos en DOP.
- Hero reconstruido con las 3 fotos reales (ya no depende de archivos
  inexistentes), con un scrim de contraste agregado en
  `assets/css/style.css` para que el texto se lea bien sobre cualquier
  foto (antes se perdía sobre fondos oscuros).
- Blog eliminado por completo (3 posts rotos, contenido de plantilla,
  uno mencionaba literalmente "Woodex").
- Footer, meta tags, barra de contacto y sidebar corregidos: marca
  "Unity Street" consistente, ubicación "República Dominicana", teléfono
  real **+1 (849) 861-2972**, correo `unitystreet00@gmail.com` (antes el
  link real apuntaba a una dirección `@woodex.co` distinta del texto
  visible), copyright a nombre de Unity Street.
- Filtros de categoría (que eran de mueblería: "Accesorios", "Futuros
  Productos") corregidos a lo que de verdad existe: **Disponibles /
  Agotados**.
- Selector de idioma/moneda del menú lateral (ofrecía inglés/francés/
  árabe y USD/Euro/Libra sin razón) simplificado a Español / DOP.
- Textos sueltos en inglés (nav, newsletter, footer, buscador)
  traducidos al español para que todo el sitio hable el mismo idioma.
- Verificado visualmente con captura de pantalla completa (Playwright)
  antes y después — sin imágenes rotas, texto legible en todos los
  hero cards.

## Inventario real hoy (en vivo)

| Producto | Precio | Estado |
|---|---|---|
| Unity Street Drop 000 | DOP1,500 → DOP1,300 (sale -10%) | Disponible |
| Unity Street Drop 000 — Agotado | DOP1,500 | Agotado |
| Unity Street Drop 001 | DOP1,500 | Disponible |

## Pendientes (lo que sigue sin resolver, requiere al señor)

- [ ] Fotos y datos de más productos si hay más inventario real que
      fotografiar — hoy el catálogo es honesto pero pequeño (3 piezas).
- [ ] Confirmar si "Drop 000" y "Drop 001" son tallas únicas o hay
      variantes (talla/color) que deban mostrarse por separado.
- [ ] Decidir si el catálogo sigue en HTML estático a mano o pasa a un
      formato editable (JSON/CSV) — con más drops a futuro, HTML a mano
      vuelve a ser frágil (así se originaron estos bugs).
