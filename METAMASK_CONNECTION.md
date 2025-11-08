# MetaMask Connection Guide

## 🔗 Connect MetaMask to BlockGenix

### Step 1: Add Hardhat Local Network to MetaMask

1. **Open MetaMask** (click the extension icon)
2. **Click the network dropdown** (top, shows current network like "Ethereum Mainnet")
3. **Click "Add Network"** or "Add a network manually"
4. **Enter these details:**
   - **Network Name:** `Hardhat Local`
   - **RPC URL:** `http://127.0.0.1:8545`
   - **Chain ID:** `1337`
   - **Currency Symbol:** `ETH`
   - **Block Explorer URL:** (leave empty)
5. **Click "Save"**
6. **Switch to "Hardhat Local" network** (select it from dropdown)

---

### Step 2: Import Test Account (Get Free ETH)

1. **In MetaMask**, click the **account icon** (top right, circle with account name)
2. **Select "Import Account"**
3. **Paste this private key:**
   ```
   0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
   ```
4. **Click "Import"**
5. **You should see 10,000 ETH** in your account!

**Account Details:**
- Address: `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`
- Balance: 10,000 ETH (on Hardhat Local network)

---

### Step 3: Connect Wallet in BlockGenix

1. **Open BlockGenix:** `http://localhost:3000`
2. **Make sure you're logged in** (register/login first)
3. **Click "Connect Wallet"** button (top right in navbar)
4. **MetaMask popup will appear:**
   - Select the account you want to connect
   - Click "Next"
   - Click "Connect"
5. **Your wallet is now connected!**

---

### Step 4: Verify Connection

After connecting, you should see:
- ✅ Your wallet address in the navbar (e.g., `0xf39f...2266`)
- ✅ Your ETH balance displayed
- ✅ You can now interact with smart contracts

---

## 🎯 Quick Test

### Test 1: Check Backend
Open: `http://localhost:5000/health`
Should show: `{"status":"ok","message":"BlockGenix API is running"}`

### Test 2: Check Frontend
Open: `http://localhost:3000`
Should show: BlockGenix dashboard

### Test 3: Connect Wallet
1. Click "Connect Wallet"
2. MetaMask should open
3. Approve connection
4. See your address in navbar

---

## 🐛 Troubleshooting

### MetaMask Not Showing
- Make sure MetaMask extension is installed
- Refresh the page (F5)
- Check browser console for errors (F12)

### Wrong Network
- Make sure you're on "Hardhat Local" network
- Check Chain ID is 1337
- Verify RPC URL is `http://127.0.0.1:8545`

### No ETH Balance
- Make sure Hardhat node is running
- Import the test account (private key above)
- Check you're on Hardhat Local network
- Refresh MetaMask

### Can't Connect Wallet
- Make sure MetaMask is unlocked
- Check you're on the correct network
- Try disconnecting and reconnecting
- Clear browser cache and try again

---

## 📝 Summary

1. ✅ Add Hardhat Local network to MetaMask
2. ✅ Import test account (get free ETH)
3. ✅ Connect wallet in BlockGenix
4. ✅ Start using the DApp!

---

**Your wallet is ready! 🎉**

