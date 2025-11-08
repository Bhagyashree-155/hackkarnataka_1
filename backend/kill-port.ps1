# Kill process on port 5000
$port = 5000
$processes = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique

if ($processes) {
    Write-Host "Killing processes on port $port..."
    $processes | ForEach-Object {
        Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue
        Write-Host "Killed process: $_"
    }
    Write-Host "✅ Port $port is now free!"
} else {
    Write-Host "✅ No processes found on port $port"
}

