# Script to start backend (kills existing process first)
Write-Host "Stopping any existing backend processes..." -ForegroundColor Yellow

# Kill process on port 5000
$processes = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
if ($processes) {
    $processes | ForEach-Object { 
        Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue 
    }
    Write-Host "Killed processes on port 5000" -ForegroundColor Green
}

Start-Sleep -Seconds 2

Write-Host "Starting backend..." -ForegroundColor Green
cd backend
npm start

