# Quick Start Guide - BlockGenix Full Stack

## 🚀 Start All Services

You need **3 terminals** running simultaneously:

### Terminal 1: Hardhat Node (Blockchain)
```powershell
cd contracts
$env:HTTP_PROXY=""; $env:HTTPS_PROXY=""; $env:http_proxy=""; $env:https_proxy=""
npx hardhat node
```
**Keep this running!** This is your local blockchain.

---

### Terminal 2: Backend API (Optional but Recommended)
```powershell
cd backend
npm start
```
**Keep this running!** This provides API endpoints and analytics.

---

### Terminal 3: Frontend (React DApp)
```powershell
cd frontend
npm run dev
```
**Keep this running!** This is your web interface.

---

## ✅ Verify Everything is Running

1. **Hardhat Node**: Should show account addresses and private keys
2. **Backend**: Should show `🚀 BlockGenix API server running on http://localhost:5000`
3. **Frontend**: Should open automatically at `http://localhost:3000`

---

## 🔗 Connect MetaMask

1. Open `http://localhost:3000` in your browser
2. Add "Hardhat Local" network to MetaMask:
   - Network Name: `Hardhat Local`
   - RPC URL: `http://127.0.0.1:8545`
   - Chain ID: `1337`
   - Currency: `ETH`
3. Import test account (private key from Terminal 1 or use: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`)
4. Click "Connect Wallet" on the DApp

---

## 📊 Test Backend Connection

Open in browser: `http://localhost:5000/health`

Should return:
```json
{
  "status": "ok",
  "message": "BlockGenix API is running"
}
```

---

## 🎯 Next Steps

1. ✅ All services running
2. ✅ MetaMask connected
3. ⏳ **Integrate contract functions with UI** (see BACKEND_INTEGRATION_GUIDE.md)
4. ⏳ **Test loan creation**
5. ⏳ **Test loan approval/rejection**
6. ⏳ **Test loan repayment**

---

## 🐛 Troubleshooting

### Port already in use
- **Port 8545**: Hardhat node already running
- **Port 5000**: Backend already running
- **Port 3000**: Frontend already running

### Backend not connecting
- Check if backend is running: `http://localhost:5000/health`
- Check browser console for CORS errors
- Verify backend started successfully

### Frontend not loading
- Check if frontend is running: `http://localhost:3000`
- Check terminal for errors
- Try `npm install` in frontend directory

---

**You're all set! Start building! 🎉**

