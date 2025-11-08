# Backend Integration Guide for BlockGenix

## Overview

The backend serves as an optional API layer that can:
- Store off-chain loan data
- Provide analytics and statistics
- Cache blockchain data for faster access
- Handle user profiles and preferences
- Store historical data

**Note:** The frontend can work directly with the smart contract via Ethers.js, but the backend adds additional features and performance improvements.

---

## Architecture

```
Frontend (React) 
    ↓
Backend API (Express.js) ← Optional layer
    ↓
Smart Contract (Solidity) ← Primary data source
    ↓
Blockchain (Hardhat/Ethereum)
```

---

## Step 1: Install Backend Dependencies

```powershell
cd backend
npm install
```

---

## Step 2: Start the Backend Server

### Option 1: Start normally
```powershell
cd backend
npm start
```

### Option 2: Start with auto-reload (development)
```powershell
cd backend
npm run dev
```

The backend will start on `http://localhost:5000`

---

## Step 3: Verify Backend is Running

1. Open your browser
2. Go to: `http://localhost:5000/health`
3. You should see:
   ```json
   {
     "status": "ok",
     "message": "BlockGenix API is running",
     "timestamp": "..."
   }
   ```

---

## Step 4: Configure Frontend to Use Backend

The frontend is already configured to connect to the backend. The API service is located at:
- `frontend/src/services/api.js`

### Environment Variables (Optional)

Create `frontend/.env` (if not exists) and add:
```
VITE_API_URL=http://localhost:5000
```

If not set, it defaults to `http://localhost:5000`

---

## Step 5: Test Backend Integration

### Test from Browser Console

1. Open your DApp: `http://localhost:3000`
2. Open browser console (F12)
3. Try these commands:

```javascript
// Check backend health
fetch('http://localhost:5000/health')
  .then(r => r.json())
  .then(console.log)

// Get analytics
fetch('http://localhost:5000/api/analytics')
  .then(r => r.json())
  .then(console.log)

// Get all loans
fetch('http://localhost:5000/api/loans')
  .then(r => r.json())
  .then(console.log)
```

---

## API Endpoints

### Health Check
- **GET** `/health`
- Returns server status

### Analytics
- **GET** `/api/analytics`
- Get dashboard statistics
- **POST** `/api/analytics`
- Update analytics data

### Loans
- **GET** `/api/loans`
  - Query params: `?borrower=ADDRESS&lender=ADDRESS&status=STATUS`
- **GET** `/api/loans/:id`
- **POST** `/api/loans`
  - Body: `{ loanId, borrower, amount, term, interestRate, txHash, status }`
- **PUT** `/api/loans/:id`
- **DELETE** `/api/loans/:id`

### Activity
- **GET** `/api/activity?limit=10`
- Get recent activity

### Users
- **GET** `/api/users/:address/loans?type=borrower|lender`
- Get user's loans

---

## Integration Flow

### When a Loan is Created:

1. **Frontend** → User submits loan request
2. **Frontend** → Calls smart contract `createLoan()`
3. **Frontend** → After transaction confirms, calls backend API:
   ```javascript
   await api.loans.createLoan({
     loanId: txResult.loanId,
     borrower: userAddress,
     amount: loanAmount,
     term: loanTerm,
     interestRate: interestRate,
     txHash: txResult.hash,
     status: 'pending'
   })
   ```
4. **Backend** → Stores loan data
5. **Backend** → Updates analytics

### When Fetching Dashboard Data:

1. **Frontend** → Calls `api.analytics.getAnalytics()`
2. **Backend** → Returns cached analytics
3. **Frontend** → Displays data

---

## Next Steps: Full Integration

### 1. Integrate Contract Functions with UI

Update `frontend/src/pages/Borrowers.jsx`:

```javascript
import { createLoan } from '../utils/contract'
import api from '../services/api'

const handleSubmitLoan = async (e) => {
  e.preventDefault()
  
  try {
    // 1. Create loan on blockchain
    const tx = await createLoan(signer, loanAmount, loanTerm, interestRate)
    const receipt = await tx.wait()
    
    // 2. Get loan ID from events
    const loanId = receipt.logs[0].args[0].toString()
    
    // 3. Store in backend
    await api.loans.createLoan({
      loanId,
      borrower: account,
      amount: loanAmount,
      term: loanTerm,
      interestRate: interestRate,
      txHash: receipt.hash,
      status: 'pending'
    })
    
    // 4. Update UI
    alert('Loan created successfully!')
    setShowModal(false)
  } catch (error) {
    console.error('Error creating loan:', error)
    alert('Failed to create loan')
  }
}
```

### 2. Fetch Real Loan Data

Update `frontend/src/pages/Borrowers.jsx`:

```javascript
import { useState, useEffect } from 'react'
import { useWallet } from '../context/WalletContext'
import { useBackend } from '../hooks/useBackend'
import { getBorrowerLoans, getLoan } from '../utils/contract'

const Borrowers = () => {
  const { account, provider } = useWallet()
  const { api, isConnected: backendConnected } = useBackend()
  const [loans, setLoans] = useState([])

  useEffect(() => {
    if (account && provider) {
      fetchLoans()
    }
  }, [account, provider])

  const fetchLoans = async () => {
    try {
      // Option 1: Get from backend (faster)
      if (backendConnected) {
        const { loans: backendLoans } = await api.user.getUserLoans(account, 'borrower')
        setLoans(backendLoans)
      } else {
        // Option 2: Get from blockchain
        const loanIds = await getBorrowerLoans(provider, account)
        const loanPromises = loanIds.map(id => getLoan(provider, id))
        const blockchainLoans = await Promise.all(loanPromises)
        setLoans(blockchainLoans)
      }
    } catch (error) {
      console.error('Error fetching loans:', error)
    }
  }
  
  // ... rest of component
}
```

### 3. Add Database Integration (Optional)

Replace in-memory storage with a database:

**Using MongoDB:**
```javascript
import mongoose from 'mongoose'

const loanSchema = new mongoose.Schema({
  loanId: Number,
  borrower: String,
  lender: String,
  amount: Number,
  term: Number,
  interestRate: Number,
  status: String,
  txHash: String,
  createdAt: Date,
  updatedAt: Date,
})

const Loan = mongoose.model('Loan', loanSchema)
```

**Using Firebase:**
```javascript
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc } from 'firebase/firestore'

const db = getFirestore(app)

// Create loan
await addDoc(collection(db, 'loans'), loanData)
```

---

## Testing the Integration

### 1. Start All Services

**Terminal 1 - Hardhat Node:**
```powershell
cd contracts
$env:HTTP_PROXY=""; $env:HTTPS_PROXY=""; $env:http_proxy=""; $env:https_proxy=""
npx hardhat node
```

**Terminal 2 - Backend:**
```powershell
cd backend
npm start
```

**Terminal 3 - Frontend:**
```powershell
cd frontend
npm run dev
```

### 2. Test Flow

1. Open `http://localhost:3000`
2. Connect MetaMask
3. Go to "Borrowers" page
4. Create a loan request
5. Check backend logs to see the API call
6. Check `http://localhost:5000/api/loans` to see stored data

---

## Production Considerations

1. **Add Authentication**: Protect API endpoints
2. **Add Rate Limiting**: Prevent abuse
3. **Add Error Handling**: Better error messages
4. **Add Logging**: Track API usage
5. **Add Database**: Replace in-memory storage
6. **Add Caching**: Cache blockchain data
7. **Add Webhooks**: Notify on events
8. **Add Monitoring**: Track API health

---

## Troubleshooting

### Backend not starting
- Check if port 5000 is available
- Check for syntax errors in `backend/index.js`
- Check Node.js version (should be v16+)

### Frontend can't connect to backend
- Check CORS settings in backend
- Verify backend is running on port 5000
- Check browser console for errors

### API calls failing
- Check network tab in browser DevTools
- Verify backend is running
- Check API endpoint URLs

---

## Summary

✅ Backend is set up and ready
✅ Frontend API service is configured
✅ Integration hooks are available
✅ Next: Integrate contract functions with UI components

**Current Status:**
- ✅ Backend API server created
- ✅ Frontend API service created
- ✅ Dashboard uses backend for analytics
- ⏳ Need to integrate contract functions with UI
- ⏳ Need to sync blockchain data with backend

**Ready to proceed with full integration!**

