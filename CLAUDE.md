# CLAUDE.md — membrishop-web

Instrucciones para Claude Code en este repositorio.

## Contexto del proyecto (verificado en el repositorio)

Landing page y topic cluster SEO de **membrishop.cl** (MembriShop, dropshipping chileno).
El comercio real (carrito, pago, órdenes, stock) vive en Shopify; este repo no lo maneja.

- **Stack**: Next.js 16.3.3 (App Router) · React 19.2.8 · TypeScript `strict` ·
  Tailwind CSS v4 vía `@tailwindcss/postcss` (sin `tailwind.config`; los tokens viven en
  `src/app/globals.css`) · Drizzle ORM 0.45 + Neon serverless (`neon-http`) · Zod 4.
- **Alias**: `@/* → ./src/*`.
- **Gestor de paquetes**: npm (`package-lock.json`).
- **Despliegue**: Vercel desde la rama `main`. Cadena de dominio
  `NIC Chile → Cloudflare → Vercel`; tienda Shopify en `tienda.membrishop.cl`.
  Detalle en [`DESPLIEGUE.md`](./DESPLIEGUE.md).
- **Base de datos**: Neon, proyecto `membrishop-web` (región `aws-sa-east-1`, Postgres 17).
  Migraciones `0000` y `0001` aplicadas y registradas en `drizzle.__drizzle_migrations`
  (2026-09-16). En Vercel la conexión va en `DATABASE_URL` (cadena *pooled*).
- **Arquitectura de contenido y reglas SEO**: documentadas en [`README.md`](./README.md).
- **Contrato del catálogo**: el `slug` de cada producto en `src/content/clusters.ts` debe ser
  idéntico a su `handle` en Shopify. El precio vigente sale de Shopify; `precioDesde` es solo
  respaldo editorial.

### Comandos que existen

```bash
npm run dev          # desarrollo
npm run build        # build de producción
npm run typecheck    # tsc --noEmit   (limpio al 2026-09-16)
npm run db:generate  # genera migración desde src/db/schema.ts
npm run db:migrate   # aplica migraciones a Neon   (requiere aprobación)
npm run db:push      # sincroniza esquema          (requiere aprobación: puede alterar datos)
npm run db:studio    # explorador de la base
```

`npm run lint` está declarado en `package.json`, pero el repositorio **no tiene ESLint**
instalado ni configurado: no lo uses como verificación. Tampoco hay framework de pruebas
ni CI (`.github/` no existe). La verificación disponible es `typecheck` y `build`.

### Convenciones

- **Logs sin datos personales.** No registres correos, nombres, teléfonos ni tokens. Para
  errores usa `resumenError()` de `src/lib/errores.ts`: nunca pases el `error` completo a
  `console.*`, porque los errores de Drizzle incluyen los parámetros de la consulta.
- Para leer el código SQLSTATE de un error de base usa `codigoPostgres()`: Drizzle guarda el
  error de Postgres en `.cause`.
- **Promesas al cliente** (plazos, retracto, garantía) se centralizan en `src/lib/site.ts`.
  La política vigente es: 10 días corridos de retracto (Ley 19.496) + garantía legal de 6 meses.
  Cualquier texto nuevo debe coincidir con eso.

## Sistema de agentes ecommerce — EN PAUSA (desde 2026-09-16)

El sistema de agentes (`ecommerce-supervisor` + seis agentes `haiku`) está **pausado**.
**No es obligatorio pasar por el supervisor**: trabaja directamente en el repositorio.

- No invoques esos agentes salvo que el usuario lo pida explícitamente.
- Sus definiciones (`.claude/agents/`), memorias (`.claude/agent-memory/`) y el modelo operativo
  ([`docs/AI_AGENT_OPERATING_MODEL.md`](./docs/AI_AGENT_OPERATING_MODEL.md)) se conservan solo
  como referencia; **no son instrucciones vigentes**.
- Motivo: en la fase de incorporación el costo de coordinación superó su valor para un sitio de
  este tamaño, y los agentes `haiku` reportaron evidencia no verificada.

## Aprobación humana obligatoria

Antes de: eliminar archivos o datos · añadir o actualizar dependencias y lockfiles · tocar
esquema, migraciones o datos de la base · modificar pagos, impuestos, precios, descuentos o
checkout · cambiar promesas legales al cliente (plazos, retracto, garantía) · acceder a
secretos o variables de entorno · desplegar, publicar o enviar cualquier cosa a un servicio
externo · `commit`, `push`, `merge` o cambio de rama.

`main` despliega automáticamente a Vercel: un `push` no es un paso reversible.
