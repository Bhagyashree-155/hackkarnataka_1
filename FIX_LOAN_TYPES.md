# Fix: Loan Types Not Showing

## Problem
Loan types dropdown is empty - showing only "Choose a loan type..."

## Solution Steps:

### 1. Restart Backend
The backend needs to be restarted to load the new loan-types route:

```powershell
# Stop current backend (Ctrl+C)
# Then restart:
cd backend
npm start
```

### 2. Check Browser Console
Open browser DevTools (F12) and check:
- Console tab for errors
- Network tab to see if `/api/loan-types` request is failing

### 3. Verify Loan Types in Database
```powershell
cd backend
node scripts/seedLoanTypes.js
```

### 4. Test API Directly
Open in browser: `http://localhost:5000/api/loan-types`

Should return JSON with loan types.

---

## Quick Fix:

1. **Restart Backend** (most likely fix)
2. **Hard refresh browser** (Ctrl+F5)
3. **Check console** for errors

The route is registered, just needs backend restart!

