# Complete BlockGenix Setup Guide

## 🎯 Overview

BlockGenix is now a comprehensive loan management system with:
- ✅ User registration & authentication
- ✅ Loan application with eligibility checks
- ✅ EMI calculation and repayment tracking
- ✅ Admin dashboard for approval/rejection
- ✅ Document management
- ✅ MongoDB database integration
- ✅ Blockchain integration (optional)

---

## 📋 Prerequisites

1. **Node.js** (v16 or higher)
2. **MongoDB** (local or cloud)
3. **MetaMask** browser extension
4. **Hardhat** (for local blockchain)

---

## 🚀 Installation Steps

### Step 1: Install MongoDB

**Windows:**
- Download from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
- Install and start MongoDB service

**Or use MongoDB Atlas (Cloud):**
- Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Create a free cluster
- Get your connection string

### Step 2: Install Backend Dependencies

```powershell
cd backend
npm install
```

### Step 3: Configure Environment Variables

Create `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/blockgenix
JWT_SECRET=your-secret-key-change-this-in-production
UPLOAD_DIR=uploads
```

### Step 4: Create Uploads Directory

```powershell
cd backend
mkdir uploads
```

### Step 5: Install Frontend Dependencies

```powershell
cd frontend
npm install
```

---

## 🏃 Running the Application

### Terminal 1: MongoDB (if local)
```powershell
# MongoDB should be running
# Windows: Check Services for MongoDB
# Or start manually: mongod
```

### Terminal 2: Hardhat Node (Blockchain)
```powershell
cd contracts
$env:HTTP_PROXY=""; $env:HTTPS_PROXY=""; $env:http_proxy=""; $env:https_proxy=""
npx hardhat node
```

### Terminal 3: Backend API
```powershell
cd backend
npm start
```

### Terminal 4: Frontend
```powershell
cd frontend
npm run dev
```

---

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Loans
- `GET /api/loans` - Get all loans
- `GET /api/loans/:id` - Get loan by ID
- `POST /api/loans` - Create loan application
- `PATCH /api/loans/:id/approve` - Approve/reject loan (admin)
- `POST /api/loans/:id/repay` - Make repayment

### Documents
- `POST /api/documents/upload` - Upload document
- `GET /api/documents/loan/:loanId` - Get loan documents
- `GET /api/documents/user` - Get user documents

### Admin
- `GET /api/admin/loans/pending` - Get pending loans
- `GET /api/admin/borrowers` - Get all borrowers
- `GET /api/admin/borrowers/:id` - Get borrower profile
- `GET /api/admin/stats` - Get dashboard statistics

---

## 🔐 User Roles

1. **Borrower** - Can apply for loans, make repayments
2. **Admin** - Can approve/reject loans, view all data
3. **Lender** - Can view and fund loans (future feature)

---

## 📊 Database Schema

### Users
- id, name, age, citizenship, email
- monthlyIncome, creditScore
- role, passwordHash, walletAddress

### Loan Applications
- id, userId, loanType, amount, purpose
- employmentStatus, monthlyIncome
- collateralValue, tenure, interestRate
- status, eligibilityResults, adminRemarks

### Repayments
- id, loanId, userId, emiNumber
- dueDate, amount, principal, interest
- status, penalty, paidDate

### Documents
- id, loanId, userId, docType
- fileName, filePath, verified

---

## ✅ Eligibility Conditions

1. **Age**: 18-60 years
2. **Citizenship**: Must be Resident
3. **Income**: ≥ ₹20,000 (except education loans)
4. **Credit Score**: ≥ 700
5. **Active Loans**: ≤ 3
6. **Collateral**: Loan amount ≤ 80% of collateral value
7. **Debt-to-Income**: ≤ 40%
8. **Documents**: ID proof, address proof, income proof

---

## 💰 EMI Calculation

Formula: `EMI = P × R × (1 + R)^N / ((1 + R)^N - 1)`

Where:
- P = Principal (loan amount)
- R = Monthly interest rate
- N = Tenure in months

**Features:**
- Automatic EMI schedule generation
- Late payment penalty (2% if delayed > 10 days)
- Prepayment allowed after 6 months (2% fee)

---

## 🎨 Frontend Pages (To Be Created)

1. **Login/Register Page**
2. **Dashboard** (already exists)
3. **Loan Application Form**
4. **My Loans Page**
5. **Repayment Page**
6. **Admin Dashboard**
7. **Document Upload Page**

---

## 🔄 Next Steps

1. ✅ Backend API created
2. ✅ Database models created
3. ✅ Eligibility checks implemented
4. ✅ EMI calculator implemented
5. ⏳ Create frontend pages
6. ⏳ Integrate with smart contract
7. ⏳ Add document upload UI
8. ⏳ Create admin dashboard UI

---

## 🐛 Troubleshooting

### MongoDB Connection Error
- Check if MongoDB is running
- Verify MONGODB_URI in .env
- Check MongoDB logs

### Authentication Error
- Verify JWT_SECRET is set
- Check token in request headers
- Verify user exists in database

### File Upload Error
- Check uploads directory exists
- Verify file size limits
- Check file permissions

---

## 📝 Notes

- Backend uses JWT for authentication
- Documents are stored in `uploads/` directory
- EMI schedule is generated automatically on loan approval
- Eligibility is checked automatically on loan application
- Suspicious applications are automatically rejected

---

**Ready to build! 🚀**

