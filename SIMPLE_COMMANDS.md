# Simple Commands to Start BlockGenix

## 🚀 Start Backend (Terminal 1)

```powershell
cd backend
npm start
```

**Wait until you see:**
```
🚀 BlockGenix API server running on http://localhost:5000
```

**Keep this terminal open!**

---

## 🎨 Start Frontend (Terminal 2)

```powershell
cd frontend
npm run dev
```

**Wait until you see:**
```
➜  Local:   http://localhost:3000/
```

**Keep this terminal open!**

---

## ⛓️ Start Blockchain (Terminal 3) - Optional

```powershell
cd contracts
$env:HTTP_PROXY=""; $env:HTTPS_PROXY=""; $env:http_proxy=""; $env:https_proxy=""
npx hardhat node
```

**Keep this terminal open!**

---

## 🌐 Open Dashboard

1. Open your browser
2. Go to: **http://localhost:3000**
3. You'll see the BlockGenix dashboard!

---

## 📝 That's It!

- Backend: `http://localhost:5000`
- Frontend: `http://localhost:3000`
- Blockchain: `http://localhost:8545` (if started)

---

**Just run these 2 commands and open http://localhost:3000!**

