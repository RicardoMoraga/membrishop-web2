# Imágenes de MembriShop

Sube aquí las fotos con el nombre de archivo EXACTO que declara
`src/content/clusters.ts`. Los placeholders de la web muestran ese nombre en
pantalla, así que puedes ir tachando la lista mirando el sitio.

## Convención de nombres

kebab-case · sin stopwords ni conectores · keyword principal primero · sin el
nombre de la marca salvo que aporte.

## Pendientes (categoría mascotas)

| Archivo | Formato |
|---|---|
| `fuente-agua-gatos-filtro-carbon.webp` | 1200×1200 |
| `collar-gps-perros-rastreo-tiempo-real.webp` | 1200×1200 |
| `cepillo-autolimpiante-perros-gatos.webp` | 1200×1200 |
| `comedero-interactivo-lento-perros.webp` | 1200×1200 |
| `productos-mascotas-pet-tech-chile.webp` | 1600×900 (hero de categoría) |

## Además

| Archivo | Formato | Para qué |
|---|---|---|
| `og-membrishop.jpg` | 1200×630 | imagen de OpenGraph y Twitter |
| `membrishop-logo.png` | 512×512 | logo del JSON-LD `OnlineStore` |

El `apple-icon.png` (180×180) va en `src/app/`, no aquí.

Cuando subas las fotos, pon `IMAGENES_DISPONIBLES = true` en `src/app/sitemap.ts`
y reemplaza `<ImagenMarcador>` por `<Image>` de `next/image` (el snippet está
comentado dentro del componente).
