# How to Start BlockGenix - Complete Guide

## 🚀 Quick Start (All Services)

You need **3 terminals** running simultaneously:

---

### Terminal 1: Backend API Server

```powershell
cd backend
npm start
```

**You should see:**
```
✅ MongoDB Connected: localhost
🚀 BlockGenix API server running on http://localhost:5000
```

**Keep this terminal running!**

---

### Terminal 2: Frontend (Dashboard)

```powershell
cd frontend
npm run dev
```

**You should see:**
```
VITE v5.0.8  ready in XXX ms

➜  Local:   http://localhost:3000/
```

**Keep this terminal running!**

---

### Terminal 3: Hardhat Node (Blockchain - Optional for now)

```powershell
cd contracts
$env:HTTP_PROXY=""; $env:HTTPS_PROXY=""; $env:http_proxy=""; $env:https_proxy=""
npx hardhat node
```

**Keep this running if you want blockchain features!**

---

## 📊 Access Your Dashboard

1. **Open your browser**
2. **Go to:** `http://localhost:3000`
3. **You should see the BlockGenix dashboard!**

---

## 🔍 Verify Everything is Running

### Check Backend:
- Open: `http://localhost:5000/api/loans`
- You should see: `{"message":"Get all loans endpoint"}`

### Check Frontend:
- Open: `http://localhost:3000`
- You should see the BlockGenix dashboard

### Check MongoDB:
- Open MongoDB Compass
- You should see the `blockgenix` database (will be created automatically)

---

## 🎯 What You Can Do Now

### 1. View Dashboard
- See statistics and metrics
- Navigate between pages

### 2. Register/Login (when frontend is updated)
- Create a new account
- Login to your account

### 3. Apply for Loan (when frontend is updated)
- Fill loan application form
- Upload documents
- Check eligibility

### 4. Admin Features (when frontend is updated)
- Approve/reject loans
- View all borrowers
- See dashboard statistics

---

## 🐛 Troubleshooting

### Backend won't start
- Check if port 5000 is free
- Check MongoDB is running
- Check `.env` file exists

### Frontend won't start
- Check if port 3000 is free
- Check dependencies are installed: `npm install`

### MongoDB connection error
- Make sure MongoDB is running
- Check MongoDB Compass is connected
- Verify connection string in `.env`

---

## 📝 Next Steps

1. ✅ Start backend
2. ✅ Start frontend
3. ⏳ Create login/register pages
4. ⏳ Create loan application form
5. ⏳ Create admin dashboard

---

**Your dashboard is ready! 🎉**

