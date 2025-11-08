# How to Start BlockGenix Dashboard

## Quick Start Commands

### Step 1: Start Frontend (Dashboard)
Open a terminal and run:
```powershell
cd frontend
npm run dev
```

The dashboard will be available at:
- **http://localhost:3000** (or http://localhost:3001 if 3000 is busy)

---

## Complete Setup (All Services)

You need **3 terminals** running:

### Terminal 1: Hardhat Node (Blockchain)
```powershell
cd contracts
$env:HTTP_PROXY=""; $env:HTTPS_PROXY=""; $env:http_proxy=""; $env:https_proxy=""
npx hardhat node
```
**Keep this running!**

### Terminal 2: Backend API (Optional)
```powershell
cd backend
npm start
```
**Keep this running!**

### Terminal 3: Frontend (Dashboard) ⭐
```powershell
cd frontend
npm run dev
```
**Keep this running!**

---

## Access Dashboard

1. Open your browser
2. Go to: **http://localhost:3000** or **http://localhost:3001**
3. You should see the BlockGenix dashboard!

---

## Connect Wallet to Dashboard

1. Click **"Connect Wallet"** button (top right)
2. MetaMask popup will appear
3. Select your account
4. Click **"Connect"**
5. Make sure you're on **"Hardhat Local"** network in MetaMask

---

## If Dashboard Doesn't Load

### Check if Frontend is Running:
```powershell
# Check if port 3000 is in use
Test-NetConnection -ComputerName localhost -Port 3000 -InformationLevel Quiet
```

### Restart Frontend:
```powershell
cd frontend
npm run dev
```

### Check for Errors:
- Look at the terminal where `npm run dev` is running
- Check browser console (F12) for errors

---

## Dashboard Features

Once connected, you can:
- ✅ View dashboard statistics
- ✅ Navigate to "Borrowers" page
- ✅ Navigate to "Lenders" page
- ✅ Create loan requests
- ✅ Approve/reject loans

---

**Your dashboard is ready! 🎉**

