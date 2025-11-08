# MetaMask Connection Guide for BlockGenix

## Step-by-Step Guide to Connect MetaMask to Your DApp

### Prerequisites
- ✅ Hardhat node is running on `http://127.0.0.1:8545`
- ✅ Frontend is running on `http://localhost:3000`
- ✅ MetaMask is installed in your browser

---

## Step 1: Open Your DApp

1. Open your browser
2. Go to: `http://localhost:3000`
3. You should see the BlockGenix dashboard

---

## Step 2: Configure MetaMask Network

### Add Hardhat Local Network to MetaMask:

1. **Open MetaMask** (click the extension icon)
2. **Click the network dropdown** (top, shows current network)
3. **Click "Add Network"** or "Add a network manually"
4. **Enter these details:**
   - **Network Name:** `Hardhat Local`
   - **RPC URL:** `http://127.0.0.1:8545`
   - **Chain ID:** `1337`
   - **Currency Symbol:** `ETH`
   - **Block Explorer URL:** (leave empty)

5. **Click "Save"**
6. **Switch to "Hardhat Local" network** (select it from the dropdown)

---

## Step 3: Import Test Account (If Not Already Done)

If you don't have ETH in MetaMask:

1. **In MetaMask**, click the **account icon** (top right, circle with account name)
2. **Select "Import Account"**
3. **Paste this private key:**
   ```
   0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
   ```
4. **Click "Import"**
5. **Switch to "Hardhat Local" network**
6. You should see **10,000 ETH** in your account

---

## Step 4: Connect MetaMask to Your DApp

1. **On the BlockGenix website** (`http://localhost:3000`)
2. **Look for the "Connect Wallet" button** (usually in the navbar)
3. **Click "Connect Wallet"**
4. **MetaMask popup will appear:**
   - Select the account you want to connect
   - Click "Next"
   - Click "Connect"
5. **Your wallet is now connected!**

---

## Step 5: Verify Connection

After connecting, you should see:
- ✅ Your wallet address displayed in the navbar
- ✅ Your ETH balance shown
- ✅ You can now interact with the DApp

---

## Troubleshooting

### Issue: "Connect Wallet" button doesn't work

**Solution:**
- Make sure MetaMask is unlocked
- Refresh the page (F5)
- Check browser console for errors (F12)

### Issue: MetaMask shows "Wrong Network"

**Solution:**
- Make sure you're on "Hardhat Local" network in MetaMask
- The network should have Chain ID: 1337
- Refresh the page after switching networks

### Issue: MetaMask shows 0 ETH

**Solution:**
1. Make sure Hardhat node is running
2. Import the test account (see Step 3)
3. Refresh MetaMask (close and reopen)
4. Check that you're on "Hardhat Local" network

### Issue: Transaction fails

**Solution:**
- Make sure you have enough ETH for gas fees
- Check that Hardhat node is running
- Verify you're on the correct network

### Issue: Can't see the DApp

**Solution:**
- Make sure frontend is running: `npm run dev` in the `frontend` directory
- Check that it's running on `http://localhost:3000`
- Try a different browser or clear cache

---

## Quick Reference

### Test Account Details:
- **Address:** `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`
- **Private Key:** `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`
- **Balance:** 10,000 ETH (on Hardhat Local)

### Network Settings:
- **Network Name:** Hardhat Local
- **RPC URL:** http://127.0.0.1:8545
- **Chain ID:** 1337
- **Currency:** ETH

---

## Next Steps

Once connected:
1. ✅ Navigate to "Borrowers" page to request loans
2. ✅ Navigate to "Lenders" page to approve/reject loans
3. ✅ View your dashboard for loan statistics
4. ✅ Start using BlockGenix!

---

**Need Help?** Check the console (F12) for any error messages and make sure all services are running.

