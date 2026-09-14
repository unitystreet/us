# UNITY STREET — Catálogo

Fuente de verdad del catálogo: `assets/images/product-*.{jpg,png}` +
markup en `index.html`. Este archivo es para notas y auditoría, no para
duplicar el inventario a mano.

## Auditoría hecha el 2026-09-14 (leyendo el HTML y `assets/images/` real)

`index.html` referencia **19 productos** (`product-1` a `product-19`),
pero solo existen **12 imágenes reales** en `assets/images/`:
`product-1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12, 13`.

### 🔴 Problema 1 — Imágenes rotas (bloqueante, visible al público)

`product-8` y `product-14` a `product-19` (7 productos) apuntan a
archivos que **no existen**. Cualquiera que visite el sitio ve espacios
rotos en esas 7 tarjetas. Esto se ve hoy, en producción.

### 🔴 Problema 2 — Solo 2 de 19 productos son realmente "Unity Street"

- `product-1` y `product-2` → renombrados **"Unity Street Drop 000"**
  (y "Unity street drop 000", con mayúscula inconsistente — son el mismo
  nombre duplicado en dos productos distintos).
- `product-3` a `product-19` → siguen con los nombres y fotos originales
  de la plantilla de decoración/muebles: "Helen Chair", "Dark Green Jug",
  "Wooden Box", "Vase Of Flowers", "Teapot with black tea", etc. **No
  tienen nada que ver con streetwear ni con la marca.**

Es decir: el catálogo real de UNITY STREET hoy son **2 productos**, no 13
ni 19. El resto es relleno de la plantilla `codewithsadee` sin reemplazar.

### 🟡 Problema 3 — Moneda inconsistente

- `product-1` y `product-2` (los reales) están en **DOP** (pesos
  dominicanos): `DOP1,500.00` → `DOP1,300.00`.
- `product-3` en adelante (la plantilla) están en **USD** (`$`):
  `$17.10`, `$69.50`, etc.

Un cliente ve dos monedas distintas en la misma página sin conversión ni
aviso. Si el negocio opera en RD, todo debería ir en DOP.

## Inventario real hoy

| Slot | Nombre en HTML | Precio | Estado |
|------|-----------------|--------|--------|
| product-1 | Unity Street Drop 000 | DOP1,500 → DOP1,300 (sale -10%) | ✅ real, marca propia |
| product-2 | Unity street drop 000 | DOP1,500 (agotado) | ⚠️ nombre duplicado del anterior |
| product-3 a 7, 9-13 | nombres de plantilla (sillas, jarras, vasos...) | en USD | ❌ placeholder, no es la marca |
| product-8, 14-19 | (sin imagen) | — | 🔴 rota, no existe el archivo |

## Pendientes (en orden de impacto)

- [ ] **Urgente:** quitar o arreglar los 7 slots con imagen rota
      (`product-8`, `14-19`) — hoy se ve mal en el sitio en vivo.
- [ ] Decidir: ¿se borran los 11 productos placeholder (3, 4-7, 9-13) o
      se reemplazan por productos reales de UNITY STREET? Mientras sigan
      ahí, el catálogo miente sobre qué vende la marca.
- [ ] Unificar moneda: todo en DOP (o agregar conversión real si se
      vende también fuera de RD).
- [ ] Corregir el nombre duplicado "Drop 000" en dos productos — cada
      producto necesita nombre único (talla, color o número de pieza).
- [ ] Documentar cada producto real con: nombre, precio, talla/stock,
      categoría — una vez que solo queden productos reales.
- [ ] Decidir si el catálogo sigue siendo HTML estático a mano o pasa a
      un formato editable (JSON/CSV) que alimente la página — con 19+
      productos a mano, HTML estático ya empieza a ser difícil de
      mantener sin errores como los de arriba.
