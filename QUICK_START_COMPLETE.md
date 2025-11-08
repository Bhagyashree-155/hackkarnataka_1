# 🚀 Complete Quick Start Guide

## Start Everything in Order

### Terminal 1: Hardhat Node (Blockchain)
```powershell
cd contracts
$env:HTTP_PROXY=""; $env:HTTPS_PROXY=""; $env:http_proxy=""; $env:https_proxy=""
npx hardhat node
```
**Keep this running!** This provides the blockchain.

---

### Terminal 2: Backend API
```powershell
cd backend
npm start
```
**You should see:**
```
✅ MongoDB Connected: localhost (or warning if not connected)
🚀 BlockGenix API server running on http://localhost:5000
```

**Keep this running!**

---

### Terminal 3: Frontend (Dashboard)
```powershell
cd frontend
npm run dev
```
**You should see:**
```
VITE v5.0.8  ready in XXX ms
➜  Local:   http://localhost:3000/
```

**Keep this running!**

---

## 📱 Access Your Application

### Step 1: Open Dashboard
Go to: **http://localhost:3000**

### Step 2: Register/Login
- If not logged in, you'll see the login page
- Click "Register here" to create an account
- Fill in your details (name, age, email, etc.)
- Click "Create Account"

### Step 3: Connect MetaMask
1. **Add Hardhat Local Network:**
   - Network Name: `Hardhat Local`
   - RPC URL: `http://127.0.0.1:8545`
   - Chain ID: `1337`
   - Currency: `ETH`

2. **Import Test Account:**
   - Private Key: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`
   - You'll get 10,000 ETH!

3. **Connect in BlockGenix:**
   - Click "Connect Wallet" button
   - Approve in MetaMask
   - Done!

---

## ✅ Verify Everything Works

1. **Backend:** `http://localhost:5000/health` → Should show "ok"
2. **Frontend:** `http://localhost:3000` → Should show dashboard
3. **MetaMask:** Should show 10,000 ETH on Hardhat Local
4. **Connection:** Wallet address should appear in navbar

---

## 🎯 What You Can Do Now

1. ✅ **Register/Login** - Create your account
2. ✅ **View Dashboard** - See your profile and stats
3. ✅ **Connect Wallet** - Link MetaMask
4. ⏳ **Apply for Loans** - (when loan form is ready)
5. ⏳ **View/Approve Loans** - (admin features)

---

**Everything is ready! Start using BlockGenix! 🎉**

