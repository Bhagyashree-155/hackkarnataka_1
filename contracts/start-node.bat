@echo off
REM Batch script to start Hardhat node with proxy disabled
set HTTP_PROXY=
set HTTPS_PROXY=
set http_proxy=
set https_proxy=

echo Starting Hardhat node...
npx hardhat node

