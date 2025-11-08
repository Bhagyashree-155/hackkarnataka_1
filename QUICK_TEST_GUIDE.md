# 🚀 Quick Test Guide - Loan Features

## ✅ What's Working Now

1. **Borrowers Page:**
   - ✅ Create loan requests
   - ✅ View your loans
   - ✅ See loan status (pending/approved/rejected)

2. **Lenders Page:**
   - ✅ View pending loan requests
   - ✅ Approve loans (admin only)
   - ✅ Reject loans (admin only)
   - ✅ View loan details

---

## 🎯 Quick Test Steps

### 1. Start Backend
```powershell
cd backend
npm start
```

### 2. Start Frontend
```powershell
cd frontend
npm run dev
```

### 3. Make Yourself Admin (Required for Approve/Reject)

**In MongoDB Compass:**
1. Open `blockgenix` database
2. Open `users` collection
3. Find your user
4. Change `role: "borrower"` to `role: "admin"`
5. Save

**OR use script:**
```powershell
cd backend
node scripts/makeAdmin.js your-email@example.com
```

### 4. Test Flow

1. **Login** to the app
2. **Go to Borrowers page**
3. **Click "Request Loan"**
4. **Fill form:**
   - Amount: `2.5`
   - Term: `30`
   - Interest: `5`
5. **Submit** → Loan appears!
6. **Go to Lenders page**
7. **See your loan** in pending list
8. **Click "Approve"** → Loan approved! ✅

---

## 📋 What You'll See

### Borrowers Page:
- Your loan requests
- Status badges (PENDING, APPROVED, REJECTED)
- Loan details (amount, term, interest rate)

### Lenders Page:
- All pending loan requests
- Borrower information
- Approve/Reject buttons
- Loan details modal

---

## ⚠️ Important

- **Admin role required** for Approve/Reject
- **Must be logged in** to see/create loans
- **Backend must be running** on port 5000
- **MongoDB must be running**

---

**Everything is integrated and working! 🎉**

