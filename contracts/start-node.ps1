# PowerShell script to start Hardhat node with proxy disabled
$env:HTTP_PROXY = ""
$env:HTTPS_PROXY = ""
$env:http_proxy = ""
$env:https_proxy = ""

Write-Host "Starting Hardhat node..." -ForegroundColor Green
npx hardhat node

