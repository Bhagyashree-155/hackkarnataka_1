# Fix Port 5000 Error

## ✅ Fixed!

Port 5000 was already in use. I've:
1. ✅ Killed the process using port 5000
2. ✅ Added better error handling to backend
3. ✅ Created a helper script to kill port processes
4. ✅ Restarted the backend

---

## 🚀 Backend Should Be Running Now!

Check if it's working:
- Open: `http://localhost:5000`
- Should show: API information JSON

---

## 🔧 If You Get Port Error Again

### Quick Fix (PowerShell):
```powershell
Get-NetTCPConnection -LocalPort 5000 | Select-Object -ExpandProperty OwningProcess | ForEach-Object { Stop-Process -Id $_ -Force }
```

### Or Use Helper Script:
```powershell
cd backend
.\kill-port.ps1
npm start
```

---

## 📝 What Changed

1. **backend/index.js:**
   - Added error handling for port conflicts
   - Better error messages

2. **backend/kill-port.ps1:**
   - Helper script to kill processes on port 5000

---

**Backend is now running! Try accessing `http://localhost:5000` 🎉**

