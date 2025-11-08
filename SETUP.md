# BlockGenix Setup Guide

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MetaMask browser extension
- Git

## Installation Steps

### 1. Install Dependencies

Install dependencies for all workspaces:

```bash
npm install
```

Or install individually:

```bash
# Frontend
cd frontend
npm install

# Contracts
cd ../contracts
npm install

# Backend (optional)
cd ../backend
npm install
```

### 2. Set Up Hardhat Local Network

Start a local Hardhat node:

**Windows (PowerShell):**
```powershell
cd contracts
$env:HTTP_PROXY=""; $env:HTTPS_PROXY=""; $env:http_proxy=""; $env:https_proxy=""; npx hardhat node
```

**Windows (Command Prompt/Batch):**
```batch
cd contracts
set HTTP_PROXY=
set HTTPS_PROXY=
set http_proxy=
set https_proxy=
npx hardhat node
```

**Or use the provided script:**
```powershell
cd contracts
.\start-node.ps1
```

**Linux/Mac:**
```bash
cd contracts
HTTP_PROXY= HTTPS_PROXY= http_proxy= https_proxy= npx hardhat node
```

This will start a local blockchain on `http://127.0.0.1:8545`

Keep this terminal running.

**Note:** If you encounter proxy errors, the scripts above disable proxy settings temporarily.

### 3. Deploy Smart Contracts

In a new terminal:

```bash
cd contracts
npx hardhat compile
npx hardhat run scripts/deploy.js --network localhost
```

**Important:** Copy the deployed contract address from the output. You'll need it for the frontend.

### 4. Configure Frontend

1. Create a `.env` file in the `frontend` directory:

```bash
cd frontend
touch .env
```

2. Add the contract address to `.env`:

```
VITE_CONTRACT_ADDRESS=YOUR_DEPLOYED_CONTRACT_ADDRESS_HERE
VITE_NETWORK=localhost
```

Replace `YOUR_DEPLOYED_CONTRACT_ADDRESS_HERE` with the address from step 3.

### 5. Configure MetaMask

1. Open MetaMask
2. Add a new network:
   - Network Name: `Hardhat Local`
   - RPC URL: `http://127.0.0.1:8545`
   - Chain ID: `1337`
   - Currency Symbol: `ETH`

3. Import test accounts:
   - When you run `npx hardhat node`, it will display test accounts with private keys
   - Import these accounts into MetaMask for testing

### 6. Start Frontend Development Server

```bash
cd frontend
npm run dev
```

The app will be available at `http://localhost:3000`

### 7. Start Backend (Optional)

```bash
cd backend
npm start
```

Backend will run on `http://localhost:5000`

## Usage

1. Open the app in your browser
2. Connect your MetaMask wallet
3. Switch to the Hardhat Local network in MetaMask
4. Start using BlockGenix!

## Testing

Run contract tests:

```bash
cd contracts
npx hardhat test
```

## Deployment to Testnet

### Mumbai (Polygon Testnet)

1. Get testnet tokens from [Polygon Faucet](https://faucet.polygon.technology/)
2. Update `contracts/hardhat.config.js` with your RPC URL and private key
3. Deploy:

```bash
cd contracts
npx hardhat run scripts/deploy.js --network mumbai
```

### Sepolia (Ethereum Testnet)

1. Get testnet tokens from [Sepolia Faucet](https://sepoliafaucet.com/)
2. Update `contracts/hardhat.config.js` with your RPC URL and private key
3. Deploy:

```bash
cd contracts
npx hardhat run scripts/deploy.js --network sepolia
```

## Troubleshooting

### MetaMask Connection Issues

- Make sure MetaMask is unlocked
- Check that you're on the correct network
- Refresh the page and try again

### Contract Not Found

- Verify the contract address in `.env` is correct
- Make sure the contract is deployed
- Check that you're on the correct network

### Transaction Failures

- Ensure you have enough ETH for gas fees
- Check that the contract has enough balance (for approvals)
- Verify all parameters are correct

### Proxy/Network Errors (ERR_INVALID_URL)

If you encounter `ERR_INVALID_URL` with proxy errors when running `npx hardhat node`:

**Solution 1: Use the provided scripts**
```powershell
cd contracts
.\start-node.ps1
```

**Solution 2: Manually disable proxy (PowerShell)**
```powershell
$env:HTTP_PROXY=""
$env:HTTPS_PROXY=""
$env:http_proxy=""
$env:https_proxy=""
npx hardhat node
```

**Solution 3: Check npm proxy settings**
```bash
npm config get proxy
npm config get https-proxy
# If they show invalid values, delete them:
npm config delete proxy
npm config delete https-proxy
```

## Project Structure

```
blockgenix/
├── frontend/          # React + Vite DApp UI
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── utils/
│   └── package.json
├── contracts/         # Solidity smart contracts
│   ├── contracts/
│   ├── scripts/
│   ├── test/
│   └── hardhat.config.js
├── backend/           # Node.js backend (optional)
│   └── index.js
└── package.json
```

## Next Steps

- Integrate the contract functions with the UI
- Add more features (loan history, analytics, etc.)
- Deploy to a testnet
- Add database integration for off-chain data
- Implement user authentication
- Add more comprehensive error handling

