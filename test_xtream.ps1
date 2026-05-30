
$accounts = @(
    [PSCustomObject]@{id=145; server='xxip25.top:8080'; user='p6A3N7'; pass='990168'; exp='15/08/2026'},
    [PSCustomObject]@{id=152; server='fortv.cc:8080'; user='A5aaXj'; pass='235081'; exp='19/07/2026'},
    [PSCustomObject]@{id=160; server='fortv.cc:8080'; user='17015084'; pass='13150664'; exp='12/06/2026'},
    [PSCustomObject]@{id=161; server='xxip25.top:8080'; user='R9jSdT'; pass='354921'; exp='14/01/2027'},
    [PSCustomObject]@{id=165; server='xxip25.top:8080'; user='dpittma1@hotmail.com'; pass='77536@63577'; exp='17/10/2026'}
)

Write-Host "=== PROBANDO CONECTIVIDAD XTREAM CODES ===" -ForegroundColor Yellow
foreach ($a in $accounts) {
    $apiUrl = "http://$($a.server)/player_api.php?username=$($a.user)&password=$($a.pass)"
    try {
        $result = Invoke-WebRequest -Uri $apiUrl -TimeoutSec 10 -UseBasicParsing -ErrorAction Stop
        $json = $result.Content | ConvertFrom-Json -ErrorAction SilentlyContinue
        $status = if ($json.user_info) { "ACTIVO - MaxConn:$($json.user_info.max_connections) Activos:$($json.user_info.active_cons)" } else { "RESPONDE pero sin JSON valido" }
        Write-Host "[#$($a.id)] $status | Exp: $($a.exp)" -ForegroundColor Green
    } catch {
        $msg = $_.Exception.Message
        if ($msg.Length -gt 80) { $msg = $msg.Substring(0,80) }
        Write-Host "[#$($a.id)] FALLO - $msg" -ForegroundColor Red
    }
}
