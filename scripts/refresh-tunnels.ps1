Param(
  [string]$ComposeFile = "docker-compose.prod.yml",
  [string]$Realm = "book-social-network",
  [string]$ClientId = "book-network-ui",
  [string]$AdminUser = "admin",
  [string]$AdminPassword = "change-me-strong",
  [string]$KeycloakServicePath = "frontEnd/Book-network-ui/src/app/services/keycloak/keycloak.service.ts"
)

$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

function Invoke-Cmd([string]$Cmd, [switch]$Capture) {
  Write-Host "→ $Cmd" -ForegroundColor Cyan
  if ($Capture) { return (Invoke-Expression $Cmd) }
  else { Invoke-Expression $Cmd | Out-Null }
}

function Get-TunnelUrl([string]$Container) {
  $regex = 'https://[a-z0-9-]+\.trycloudflare\.com'
  for ($i=0; $i -lt 45; $i++) {
    try {
      $url = Invoke-Cmd "docker logs -n 800 $Container | Select-String -Pattern '$regex' -AllMatches | ForEach-Object { $_.Matches.Value } | Select-Object -First 1" -Capture
    } catch { $url = $null }
    if ($url) { return ($url | Select-Object -First 1) }
    Start-Sleep -Seconds 2
  }
  throw "No trycloudflare URL found for $Container"
}

function Replace-InFile([string]$Path, [string]$Pattern, [string]$Replacement) {
  $full = Resolve-Path $Path
  $text = Get-Content -Raw -Path $full
  $new = [regex]::Replace($text, $Pattern, $Replacement)
  if ($new -ne $text) { Set-Content -Path $full -Value $new -NoNewline; Write-Host "Updated $Path" -ForegroundColor Green }
  else { Write-Host "No change needed in $Path" -ForegroundColor DarkYellow }
}

# 1) Restart tunnels to ensure fresh URLs
Invoke-Cmd "docker compose -f `"$ComposeFile`" rm -sf cloudflared-app cloudflared-api cloudflared-auth"
Invoke-Cmd "docker compose -f `"$ComposeFile`" up -d cloudflared-app cloudflared-api cloudflared-auth"

# 2) Capture new URLs
$FrontendUrl = Get-TunnelUrl "cloudflared-app"
$AuthUrl = Get-TunnelUrl "cloudflared-auth"
Write-Host "Frontend URL: $FrontendUrl" -ForegroundColor Green
Write-Host "Auth URL:     $AuthUrl" -ForegroundColor Green

# 3) Update backend issuer (http for issuer to avoid TLS in-container)
$issuer = "http://$([uri]$AuthUrl).Host/realms/$Realm"
$patternIssuer = 'SPRING_SECURITY_OAUTH2_RESOURCESERVER_JWT_ISSUER_URI:\s*[^\r\n]+'
$replacementIssuer = "SPRING_SECURITY_OAUTH2_RESOURCESERVER_JWT_ISSUER_URI: $issuer"
Replace-InFile -Path $ComposeFile -Pattern $patternIssuer -Replacement $replacementIssuer

# 4) Update frontend Keycloak base URL
$authHost = ([uri]$AuthUrl).GetLeftPart([System.UriPartial]::Authority)
$patternKcUrl = "url:\s*'https?://[^']+'"
$replacementKcUrl = "url: '$authHost'"
Replace-InFile -Path $KeycloakServicePath -Pattern $patternKcUrl -Replacement $replacementKcUrl

# 5) Rebuild/restart frontend and API
Invoke-Cmd "docker compose -f `"$ComposeFile`" build bsn-frontend"
Invoke-Cmd "docker compose -f `"$ComposeFile`" up -d bsn-frontend bsn-api"

# 6) Update Keycloak client redirect URIs
#    Login to kcadm
Invoke-Cmd "docker exec keycloak-bsn /opt/keycloak/bin/kcadm.sh config credentials --server http://localhost:8080 --realm master --user $AdminUser --password $AdminPassword"
#    Get client id
$clientsJson = Invoke-Cmd "docker exec keycloak-bsn /opt/keycloak/bin/kcadm.sh get clients -r $Realm -q clientId=$ClientId" -Capture
$clientIdParsed = ($clientsJson | ConvertFrom-Json)[0].id
if (-not $clientIdParsed) { throw "Cannot find client id for $ClientId" }

#    Prepare redirects JSON and apply
$tmp = Join-Path $env:TEMP "kc_redirects_$(Get-Random).json"
@{
  redirectUris = @("http://localhost:8080/*", "$FrontendUrl/*")
  webOrigins   = @("*")
} | ConvertTo-Json -Depth 10 | Set-Content -Path $tmp -Encoding UTF8

Invoke-Cmd "docker cp `"$tmp`" keycloak-bsn:/tmp/redirects.json"
Invoke-Cmd "docker exec keycloak-bsn /opt/keycloak/bin/kcadm.sh update clients/$clientIdParsed -r $Realm -f /tmp/redirects.json"
Remove-Item $tmp -Force -ErrorAction SilentlyContinue

Write-Host "Done. Frontend: $FrontendUrl  |  Auth: $AuthUrl" -ForegroundColor Green
