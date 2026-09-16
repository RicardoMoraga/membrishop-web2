<#
================================================================================
  MembriShop - Despliegue de la ronda PDP + Home
================================================================================

  QUE HACE, EN ORDEN:
    1. Comprueba que estas en el repositorio correcto y que git funciona.
    2. RESPALDA la version productiva: etiqueta + rama de respaldo en GitHub,
       mas un ZIP local del arbol de trabajo y un archivo de notas.
    3. Compila el proyecto ANTES de subir nada.
    4. Te muestra el detalle y pide confirmacion antes de commit y de push.
    5. Sube a GitHub. NO toca Vercel: eso queda como paso manual tuyo.

  LO QUE NO HACE, A PROPOSITO:
    - Nunca hace force-push.
    - No toca DNS, dominios de Shopify ni la contrasena de la tienda.
    - No reanuda Vercel ni cambia variables de entorno.
    - No usa 'git add -A': sube una lista explicita de archivos.

  USO:
    .\desplegar-pdp.ps1                        flujo completo hacia main
    .\desplegar-pdp.ps1 -Simular               muestra todo, no escribe nada
    .\desplegar-pdp.ps1 -Rama preview/pdp-ui   sube a una rama de vista previa
    .\desplegar-pdp.ps1 -SaltarBuild           no compila antes de subir

  Empieza por -Simular. Al final del script tienes los comandos de reversa.
================================================================================
#>

[CmdletBinding()]
param(
  [string]$Repo = "$env:USERPROFILE\source\membrishop-web",
  [string]$Rama = "main",
  [switch]$Simular,
  [switch]$SaltarBuild
)

$ErrorActionPreference = 'Stop'
$sello = Get-Date -Format 'yyyyMMdd-HHmm'

# ------------------------------------------------------------------ salida
function Titulo($t) {
  Write-Host ""
  Write-Host ("=" * 74) -ForegroundColor DarkYellow
  Write-Host "  $t" -ForegroundColor Yellow
  Write-Host ("=" * 74) -ForegroundColor DarkYellow
}
function Paso($t)  { Write-Host "  -> $t" -ForegroundColor Cyan }
function Bien($t)  { Write-Host "  OK  $t" -ForegroundColor Green }
function Aviso($t) { Write-Host "  !   $t" -ForegroundColor Yellow }
function Malo($t)  { Write-Host "  X   $t" -ForegroundColor Red }

# Los argumentos se pasan SIEMPRE como arreglo explicito. Si se dejaran sueltos,
# PowerShell intentaria interpretar '-a' o '-m' como parametros de la funcion y
# fallaria con "A parameter cannot be found".
function Invocar-Git {
  param([string[]]$Argumentos)
  if ($Simular) {
    Write-Host "     [SIMULACION] git $($Argumentos -join ' ')" -ForegroundColor DarkGray
    return ""
  }
  $salida = & git @Argumentos 2>&1
  if ($LASTEXITCODE -ne 0) {
    Malo "git $($Argumentos -join ' ') fallo con codigo $LASTEXITCODE"
    $salida | ForEach-Object { Write-Host "     $_" -ForegroundColor DarkRed }
    throw "git fallo"
  }
  return ($salida | Out-String).TrimEnd()
}

function Leer-Git {
  param([string[]]$Argumentos)
  $salida = & git @Argumentos 2>&1
  return ($salida | Out-String).TrimEnd()
}

function Confirmar($pregunta) {
  if ($Simular) { Write-Host "     [SIMULACION] se asume SI" -ForegroundColor DarkGray; return $true }
  $r = Read-Host "  $pregunta  (escribe SI para continuar)"
  return ($r -eq 'SI')
}

# =============================================================== 0. CONTEXTO
Titulo "0. Comprobaciones previas"

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
  Malo "No encuentro git en el PATH. Instala Git para Windows y reintenta."
  exit 1
}
if (-not (Test-Path $Repo)) { Malo "No existe la carpeta: $Repo"; exit 1 }
Set-Location $Repo
Bien "Carpeta: $Repo"

$remoto = Leer-Git @('remote','get-url','origin')
if ($remoto -notmatch 'membrishop-web') {
  Malo "El remoto no parece el correcto: $remoto"
  Malo "Esperaba algo con 'membrishop-web'. Abortando por seguridad."
  exit 1
}
Bien "Remoto: $remoto"

$ramaActual = Leer-Git @('rev-parse','--abbrev-ref','HEAD')
Bien "Rama actual: $ramaActual"
if ($Simular) { Aviso "MODO SIMULACION: no se escribe nada, ni local ni remoto." }

Paso "Trayendo referencias del remoto"
if (-not $Simular) { & git fetch origin --tags 2>&1 | Out-Null }

$commitProduccion = Leer-Git @('rev-parse','origin/main')
$descProduccion   = Leer-Git @('log','-1','--pretty=format:%h  %ad  %s','--date=short','origin/main')
Bien "Produccion actual (origin/main): $descProduccion"

# ========================================================= 1. QUE SE SUBE
Titulo "1. Cambios detectados"

$archivosRonda = @(
  'src/lib/shopify.ts',
  'src/lib/formato.ts',
  'src/app/actions/comprar.ts',
  'src/app/api/revalidate/route.ts',
  'src/app/page.tsx',
  'src/app/mascotas/fuente-agua/page.tsx',
  'src/content/clusters.ts',
  'src/components/ui/Badge.tsx',
  'src/components/seo/FaqSection.tsx',
  'src/components/marketing/ProductCard.tsx',
  'src/components/marketing/CategoryCard.tsx',
  'src/components/marketing/Pasos.tsx',
  'src/components/marketing/StickyCta.tsx',
  'src/components/marketing/ComprarButton.tsx',
  'src/components/templates/PdpTemplate.tsx',
  'src/components/templates/CategoriaTemplate.tsx',
  'src/components/producto/TrustBadges.tsx',
  'src/components/producto/EstadoStock.tsx',
  'src/components/producto/ProductGallery.tsx',
  'src/components/producto/StickyBuyBar.tsx',
  'src/components/producto/CajaCompra.tsx',
  'src/components/producto/RelatedProducts.tsx',
  '.env.example'
)

$faltantes = @()
foreach ($a in $archivosRonda) {
  if (-not (Test-Path (Join-Path $Repo $a))) { $faltantes += $a }
}
if ($faltantes.Count -gt 0) {
  Malo "FALTAN estos archivos. Algo no se escribio bien; no continues:"
  $faltantes | ForEach-Object { Write-Host "     $_" -ForegroundColor Red }
  exit 1
}
Bien "Los $($archivosRonda.Count) archivos de la ronda estan presentes"

$trustBar = 'src/components/marketing/TrustBar.tsx'
$borrarTrustBar = Test-Path (Join-Path $Repo $trustBar)
if ($borrarTrustBar) { Aviso "TrustBar.tsx quedo huerfano: se eliminara del repositorio." }

$llms = 'src/app/llms.txt/route.ts'
$hayLlms = -not [string]::IsNullOrWhiteSpace((Leer-Git @('status','--porcelain','--',$llms)))
if ($hayLlms) { Aviso "Cambio pendiente en llms.txt, anterior a esta ronda. Ira en commit aparte." }

Write-Host ""
Write-Host "  Diferencias contra origin/main:" -ForegroundColor White
$resumen = Leer-Git (@('diff','--stat','origin/main','--') + $archivosRonda)
if ([string]::IsNullOrWhiteSpace($resumen)) {
  Write-Host "     (sin diferencias: puede que ya esten subidos)" -ForegroundColor DarkGray
} else {
  $resumen -split "`n" | ForEach-Object { Write-Host "     $_" }
}

Write-Host ""
Write-Host "  Otros cambios del arbol que NO se incluiran:" -ForegroundColor White
$listaOtros = @()
foreach ($linea in ((Leer-Git @('status','--porcelain')) -split "`n")) {
  if ([string]::IsNullOrWhiteSpace($linea)) { continue }
  $ruta = $linea.Substring(3).Trim().Trim('"')
  if ($archivosRonda -contains $ruta) { continue }
  if ($ruta -eq $trustBar -or $ruta -eq $llms) { continue }
  $listaOtros += $linea
}
if ($listaOtros.Count -eq 0) { Write-Host "     (ninguno)" -ForegroundColor DarkGray }
else { $listaOtros | ForEach-Object { Write-Host "     $_" -ForegroundColor DarkGray } }

# ============================================================ 2. RESPALDO
Titulo "2. Respaldo de la version productiva"

$tagRespaldo  = "respaldo-produccion-$sello"
$ramaRespaldo = "respaldo/pre-pdp-$sello"
$commitCorto  = $commitProduccion.Substring(0, 8)

Paso "Etiqueta $tagRespaldo sobre $commitCorto"
Invocar-Git @('tag','-a',$tagRespaldo,$commitProduccion,'-m',"Respaldo de produccion previo a la ronda PDP+Home ($sello)") | Out-Null

Paso "Rama $ramaRespaldo sobre el mismo commit"
Invocar-Git @('branch',$ramaRespaldo,$commitProduccion) | Out-Null

Paso "Subiendo el respaldo a GitHub (aditivo: no pisa nada)"
Invocar-Git @('push','origin',$tagRespaldo) | Out-Null
Invocar-Git @('push','origin',$ramaRespaldo) | Out-Null
Bien "Respaldo remoto: tag $tagRespaldo y rama $ramaRespaldo"

$zip = Join-Path ([Environment]::GetFolderPath('Desktop')) "membrishop-respaldo-$sello.zip"
Paso "ZIP del arbol de trabajo (sin node_modules ni .next)"
if (-not $Simular) {
  $tmp = Join-Path $env:TEMP "membrishop-zip-$sello"
  if (Test-Path $tmp) { Remove-Item $tmp -Recurse -Force }
  New-Item -ItemType Directory -Path $tmp | Out-Null
  Get-ChildItem -Path $Repo -Force |
    Where-Object { $_.Name -notin @('node_modules', '.next', '.git', 'out') } |
    ForEach-Object { Copy-Item $_.FullName -Destination $tmp -Recurse -Force }
  Compress-Archive -Path (Join-Path $tmp '*') -DestinationPath $zip -Force
  Remove-Item $tmp -Recurse -Force
  Bien "ZIP: $zip"
} else {
  Write-Host "     [SIMULACION] ZIP en $zip" -ForegroundColor DarkGray
}

$notas = Join-Path ([Environment]::GetFolderPath('Desktop')) "membrishop-respaldo-$sello.txt"
$textoNotas = @"
MembriShop - respaldo previo a la ronda PDP + Home
Fecha: $(Get-Date -Format 'yyyy-MM-dd HH:mm')

Commit de produccion respaldado : $commitProduccion
                                  $descProduccion
Etiqueta en GitHub              : $tagRespaldo
Rama en GitHub                  : $ramaRespaldo
ZIP del arbol de trabajo        : $zip

PARA VOLVER ATRAS:
  cd "$Repo"
  git checkout main
  git revert --no-commit $commitCorto..HEAD
  git commit -m "Revertir ronda PDP+Home"
  git push origin main

Alternativa sin tocar el historial: en Vercel, Deployments -> el despliegue
anterior -> Promote to Production.
"@
if (-not $Simular) { $textoNotas | Out-File -FilePath $notas -Encoding UTF8 }
Bien "Notas de respaldo: $notas"

# =========================================================== 3. COMPILAR
if (-not $SaltarBuild) {
  Titulo "3. Compilacion previa"
  if (-not (Test-Path (Join-Path $Repo 'node_modules'))) {
    Paso "Instalando dependencias (npm ci). Puede tardar varios minutos."
    if (-not $Simular) {
      & npm ci
      if ($LASTEXITCODE -ne 0) { Malo "npm ci fallo. No se sube nada."; exit 1 }
    }
  }
  Paso "npm run build"
  if (-not $Simular) {
    & npm run build
    if ($LASTEXITCODE -ne 0) {
      Malo "El build fallo. NO se sube nada. Revisa el error de arriba."
      Aviso "El respaldo ya quedo hecho: tag $tagRespaldo y rama $ramaRespaldo."
      exit 1
    }
  }
  Bien "Build correcto"
} else {
  Titulo "3. Compilacion previa - SALTADA"
  Aviso "Subiras sin compilar. Un error de tipos lo descubrirías en Vercel."
}

# ============================================================= 4. COMMIT
Titulo "4. Commit"

Write-Host "  Se subiran $($archivosRonda.Count) archivos a la rama '$Rama'." -ForegroundColor White
if ($borrarTrustBar) { Write-Host "  Se eliminara $trustBar" -ForegroundColor White }
Write-Host ""
if (-not (Confirmar "Confirmas el commit?")) {
  Aviso "Cancelado por ti. No hubo commit ni push. El respaldo si quedo hecho."
  exit 0
}

if ($hayLlms) {
  Paso "Commit 1 de 2: cambio previo de llms.txt"
  Invocar-Git @('add','--',$llms) | Out-Null
  Invocar-Git @('commit','-m','MembriShop: actualiza llms.txt con las paginas legales') | Out-Null
  Bien "llms.txt commiteado aparte"
}

Paso "Preparando los archivos de la ronda"
Invocar-Git (@('add','--') + $archivosRonda) | Out-Null
if ($borrarTrustBar) { Invocar-Git @('rm','-q','--',$trustBar) | Out-Null }

$mensaje = @"
MembriShop: PDP como landing de conversion, home reordenada y Shopify como fuente de verdad

Integracion
- Storefront API: variantes con SKU, precio, disponibilidad, opciones y media
- quantityAvailable con degradacion automatica si falta el scope de inventario
- /api/revalidate acepta products/update e inventory_levels/update
- Cinco estados de integracion: agotado y caido dejan de ser indistinguibles

Datos comerciales
- Eliminados del MODELO precioAntes, stock y shopifyVariantId de clusters.ts
- Badge pierde el tono "oferta": sin precio anterior realmente cobrado no hay descuento

Interfaz
- PdpTemplate con galeria, caja de compra, variantes, cantidad y barra fija mobile
- Home reordenada; fuera Instagram con marcadores vacios y carruseles recortados
- Pasos: el numero pasa al JSX; las variantes before:* pisaban el counter CSS
- FaqSection dividido en FaqList + FaqSection: se emitian dos H2 seguidos
- StickyCta se oculta en fichas para no chocar con la barra de compra

Verificado: next build limpio con 17 rutas, cero desborde horizontal en
375/390/430/768/1280 px, un H1 por pagina y todas las imagenes con alt.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01QZZ58pXLbYP2q8bhjKNMNn
"@

$archivoMensaje = Join-Path $env:TEMP "membrishop-commit-$sello.txt"
if (-not $Simular) { $mensaje | Out-File -FilePath $archivoMensaje -Encoding UTF8 }
Invocar-Git @('commit','-F',$archivoMensaje) | Out-Null
Bien "Commit creado"

# =============================================================== 5. PUSH
Titulo "5. Subida a GitHub"

if ($Rama -ne $ramaActual) {
  Paso "Creando y cambiando a la rama $Rama"
  Invocar-Git @('checkout','-b',$Rama) | Out-Null
}

Write-Host "  Destino: origin/$Rama" -ForegroundColor White
if (-not (Confirmar "Confirmas el push?")) {
  Aviso "Cancelado. El commit quedo en local. Para subirlo: git push origin $Rama"
  exit 0
}

Paso "git push origin $Rama"
Invocar-Git @('push','-u','origin',$Rama) | Out-Null
Bien "Subido a origin/$Rama"

# ============================================================== 6. VERCEL
Titulo "6. Ahora te toca a ti, en Vercel"

Write-Host @"
  El push NO despliega por si solo: el proyecto esta PAUSADO. En orden:

  1) Reanudar el proyecto
     Vercel -> membrishop-web -> Settings -> General -> Resume

  2) Variables de entorno (Settings -> Environment Variables, Production)
       NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN = fyvfjt-vm.myshopify.com
       SHOPIFY_STOREFRONT_TOKEN         = token del canal Headless
       SHOPIFY_WEBHOOK_SECRET           = clave de firma del webhook
       NEXT_PUBLIC_SITE_URL             = https://membrishop.cl
     Borra NEXT_PUBLIC_SHOPIFY_CHECKOUT_HOST si sigue ahi.

     Las NEXT_PUBLIC_* se incrustan durante el build: guardarlas no basta,
     hay que volver a desplegar para que tomen efecto.

  3) Redesplegar
     Deployments -> el ultimo -> Redeploy, sin cache

  4) Comprobar en este orden:
       - https://membrishop.cl/  responde 200
       - /mascotas/fuente-agua muestra "Comprar ahora".
         Si dice "No pudimos confirmar la disponibilidad", las variables no
         entraron al build: repite el paso 3.
       - Pulsa "Comprar ahora" y MIRA EL HOST de la URL, sin pagar. Eso te
         dice en que dominio vive el checkout hoy.

"@ -ForegroundColor Gray

Titulo "Listo"
Write-Host "  Respaldo:  tag $tagRespaldo  |  rama $ramaRespaldo" -ForegroundColor Green
Write-Host "  Notas:     $notas" -ForegroundColor Green
Write-Host ""
Write-Host "  PARA VOLVER ATRAS:" -ForegroundColor Yellow
Write-Host "    git revert --no-commit $commitCorto..HEAD" -ForegroundColor Yellow
Write-Host "    git commit -m 'Revertir ronda PDP+Home'" -ForegroundColor Yellow
Write-Host "    git push origin $Rama" -ForegroundColor Yellow
Write-Host "  O en Vercel: Deployments -> el anterior -> Promote to Production" -ForegroundColor Yellow
Write-Host ""
