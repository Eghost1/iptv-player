
$server = 'fortv.cc:8080'
$user = 'A5aaXj'
$pass = '235081'

# Extraer canales de Chile (ID:160) y Sports (ID:22, 186)
$catIds = @(160, 22, 186, 46)
$catNames = @{160='Chile'; 22='Sports'; 186='ESPN+'; 46='Latino'}

$allChannels = @()

foreach ($catId in $catIds) {
    $url = "http://$server/player_api.php?username=$user&password=$pass&action=get_live_streams&category_id=$catId"
    $channels = (Invoke-WebRequest -Uri $url -TimeoutSec 15 -UseBasicParsing).Content | ConvertFrom-Json
    
    Write-Host "`n=== $($catNames[$catId]) ($($channels.Count) canales) ===" -ForegroundColor Cyan
    foreach ($ch in $channels) {
        $streamUrl = "http://$server/live/$user/$pass/$($ch.stream_id).m3u8"
        Write-Host "  $($ch.name) -> stream_id:$($ch.stream_id)"
        $allChannels += [PSCustomObject]@{
            Name = $ch.name
            Category = $catNames[$catId]
            StreamId = $ch.stream_id
            Url = $streamUrl
        }
    }
}

Write-Host "`n=== GENERANDO ENTRADAS M3U ===" -ForegroundColor Yellow

$m3uLines = @()
foreach ($ch in $allChannels) {
    $group = $ch.Category
    $m3uLines += "#EXTINF:0 group-title=`"$group`",$($ch.Name)"
    $m3uLines += "#EXTGRP:$group"
    $m3uLines += "#EXTVLCOPT:network-caching=1000"
    $m3uLines += $ch.Url
    $m3uLines += ""
}

$m3uLines | Out-File -FilePath "d:\CODES\iptv\fortv_channels.m3u" -Encoding UTF8
Write-Host "Guardado en fortv_channels.m3u - Total: $($allChannels.Count) canales" -ForegroundColor Green
