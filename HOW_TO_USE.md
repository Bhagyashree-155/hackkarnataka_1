# How to Use BlockGenix - Complete Guide

## 🚀 Starting the Application

### Step 1: Start Backend
```powershell
cd backend
npm start
```

You should see:
```
✅ MongoDB Connected: localhost
🚀 BlockGenix API server running on http://localhost:5000
```

### Step 2: Start Frontend
```powershell
cd frontend
npm run dev
```

You should see:
```
VITE v5.0.8  ready in XXX ms
➜  Local:   http://localhost:3000/
```

---

## 📝 User Registration

### Step 1: Open Registration Page
1. Go to: `http://localhost:3000/register`
2. Or click "Register" from the login page

### Step 2: Fill Registration Form
- **Name**: Your full name
- **Age**: Must be between 18 and 60
- **Citizenship**: Select "Resident" (required for loans)
- **Email**: Your email address
- **Monthly Income**: Your monthly income in ₹ (optional, but recommended)
- **Credit Score**: Your credit score (0-900, optional)
- **Password**: Create a password
- **Confirm Password**: Re-enter your password
- **Wallet Address**: Your MetaMask wallet address (optional)

### Step 3: Submit Registration
- Click "Create Account"
- You'll be automatically logged in and redirected to the dashboard

---

## 🔐 User Login

### Step 1: Open Login Page
1. Go to: `http://localhost:3000/login`
2. Or if not logged in, you'll be redirected here

### Step 2: Enter Credentials
- **Email**: Your registered email
- **Password**: Your password

### Step 3: Login
- Click "Login"
- You'll be redirected to the dashboard

---

## 📊 Dashboard

After login, you'll see:
- **Welcome message** with your name
- **User information** card (Name, Email, Role)
- **Statistics cards** (Total Loans, Active Borrowers, etc.)
- **Recent Activity** section
- **Quick Actions** section

---

## 💰 Apply for a Loan

### Step 1: Navigate to Borrowers Page
- Click "Borrowers" in the navigation bar

### Step 2: Click "Request Loan"
- Fill out the loan application form
- Submit your application

### Step 3: Eligibility Check
- The system will automatically check your eligibility
- You'll see the results immediately

---

## 👨‍💼 Admin Features

### Admin Login
- Admin users can approve/reject loans
- View all borrowers
- See dashboard statistics

### Admin Dashboard
- Navigate to "Lenders" page (admin view)
- View pending loan applications
- Approve or reject loans with remarks

---

## 🔄 Logout

1. Click "Logout" button in the navbar
2. You'll be redirected to the login page
3. Your session will be cleared

---

## 🐛 Troubleshooting

### Can't Register
- Check if backend is running
- Check MongoDB connection
- Verify all required fields are filled

### Can't Login
- Verify email and password are correct
- Check if backend is running
- Check browser console for errors

### Dashboard Not Loading
- Check if you're logged in
- Verify token is stored in localStorage
- Check backend is running

---

## 📋 Next Steps

After registration, you can:
1. ✅ View your dashboard
2. ⏳ Apply for loans (when loan form is ready)
3. ⏳ View your loan applications
4. ⏳ Make repayments
5. ⏳ Upload documents

---

**Ready to use BlockGenix! 🎉**

