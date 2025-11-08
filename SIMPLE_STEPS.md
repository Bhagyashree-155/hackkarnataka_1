# 🚀 Simple Steps to Start BlockGenix

## Step 1: Start Backend

**Option A: Use the script**
```powershell
.\start-backend.ps1
```

**Option B: Manual command**
```powershell
cd backend
npm start
```

**Wait for:** `🚀 BlockGenix API server running on http://localhost:5000`

---

## Step 2: Start Frontend (New Terminal)

**Option A: Use the script**
```powershell
.\start-frontend.ps1
```

**Option B: Manual command**
```powershell
cd frontend
npm run dev
```

**Wait for:** `Local: http://localhost:3000/`

---

## Step 3: Open Dashboard

1. Open browser
2. Go to: **http://localhost:3000**

---

## Step 4: Connect MetaMask

1. **Add Network in MetaMask:**
   - Network Name: `Hardhat Local`
   - RPC URL: `http://127.0.0.1:8545`
   - Chain ID: `1337`
   - Currency: `ETH`

2. **Import Test Account:**
   - Click account icon → Import Account
   - Paste: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`
   - You'll get 10,000 ETH!

3. **Connect in BlockGenix:**
   - Click "Connect Wallet" button
   - Approve in MetaMask

---

## ✅ That's It!

- Backend: http://localhost:5000
- Frontend: http://localhost:3000
- Dashboard: Open http://localhost:3000 in browser

---

## 🐛 If Port 5000 is Busy

Run this command first:
```powershell
Get-NetTCPConnection -LocalPort 5000 | Select-Object -ExpandProperty OwningProcess | ForEach-Object { Stop-Process -Id $_ -Force }
```

Then start backend again.

---

**Ready to go! 🎉**

