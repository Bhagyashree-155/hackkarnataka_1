# Quick Fix: MetaMask Showing 0 ETH on Hardhat Local

## Problem
- MetaMask shows 0 ETH
- Error: "Received invalid block tag 1. Latest block number is 0"
- The Hardhat node hasn't mined any blocks yet

## Solution 1: Import a Test Account (Easiest) ⭐ RECOMMENDED

1. **Open MetaMask**
2. **Click the account icon** (top right, circle with account name)
3. **Select "Import Account"**
4. **Paste one of these private keys:**

   **Account 1 (10,000 ETH):**
   ```
   0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
   ```
   Address: `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`

   **Account 2 (10,000 ETH):**
   ```
   0x59c6995e998f97a5a0044966f0945389ac9f411256d1da3d4c38496cfb5c71230
   ```
   Address: `0x70997970C51812dc3A010C7d01b50e0d17dc79C8`

5. **Switch to Hardhat Local network** in MetaMask
6. You should now see **10,000 ETH** in your account!

## Solution 2: Fund Your Current MetaMask Account

If you want to keep using your current MetaMask account:

1. **Get your MetaMask address:**
   - Open MetaMask
   - Click on your account name (top)
   - Copy your address (it starts with `0x...`)

2. **Fund your account using the script:**
   ```powershell
   cd contracts
   $env:HTTP_PROXY=""; $env:HTTPS_PROXY=""; $env:http_proxy=""; $env:https_proxy=""
   npx hardhat run scripts/fundAccount.js --network localhost YOUR_METAMASK_ADDRESS
   ```

   Example:
   ```powershell
   npx hardhat run scripts/fundAccount.js --network localhost 0x1234567890123456789012345678901234567890
   ```

   This will send 100 ETH to your account.

## Solution 3: Restart Hardhat Node with Auto-Mining

If the node is at block 0, restart it:

1. **Stop the current Hardhat node** (Ctrl+C in the terminal where it's running)

2. **Restart it:**
   ```powershell
   cd contracts
   $env:HTTP_PROXY=""; $env:HTTPS_PROXY=""; $env:http_proxy=""; $env:https_proxy=""
   npx hardhat node
   ```

3. **Wait for it to start** - you should see account addresses and private keys printed

4. **Import one of those accounts** into MetaMask (see Solution 1)

## Verify It's Working

1. Open MetaMask
2. Make sure you're on **Hardhat Local** network
3. You should see your ETH balance (10,000 ETH if you imported a test account)
4. Try refreshing the page if it still shows 0

## Still Having Issues?

- Make sure Hardhat node is running on `http://127.0.0.1:8545`
- Check that MetaMask is connected to "Hardhat Local" network
- Verify the network settings in MetaMask:
  - Network Name: `Hardhat Local`
  - RPC URL: `http://127.0.0.1:8545`
  - Chain ID: `1337`
  - Currency Symbol: `ETH`

