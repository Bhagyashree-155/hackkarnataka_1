# ✅ Document Verification & Reputation System Implementation

## Overview
This implementation follows the specified steps for document ID collection and reputation score calculation.

## Step 1: Input Official Document IDs
- **Frontend:** Registration form now collects:
  - Aadhaar Number (12 digits)
  - Income Certificate Number
  - Education Certificate Number
- **Privacy:** These IDs are collected but **NOT stored** in the database
- **Purpose:** Used only for off-chain verification

## Step 2: Off-Chain Verification
- **Process:** External APIs or manual admin checks verify document authenticity
- **Storage:** Only verification status (boolean flags) is stored:
  - `kycVerified` (boolean)
  - `incomeVerified` (boolean)
  - `educationVerified` (boolean)

## Step 3: Admin Verification Endpoint
- **Route:** `PATCH /api/admin/users/:id/verify-documents`
- **Admin only:** Requires admin authentication
- **Body:** 
  ```json
  {
    "kycVerified": true,
    "incomeVerified": true,
    "educationVerified": false
  }
  ```
- **Action:** Sets verification flags and recalculates reputation score

## Step 4: Define Weights
```javascript
kycWeight = 40
incomeWeight = 30
educationWeight = 20
Total = 90 (max score)
```

## Step 5: Calculate Initial Reputation Score
```javascript
function calculateInitialReputation(kycVerified, incomeVerified, educationVerified) {
  score = 0
  
  if kycVerified == true {
    score += 40
  }
  
  if incomeVerified == true {
    score += 30
  }
  
  if educationVerified == true {
    score += 20
  }
  
  return score  // Max: 90
}
```

## Step 6: Usage Flow

1. **User Registration:**
   - User enters document IDs in registration form
   - IDs are sent to backend but NOT stored
   - User created with all verification flags = false
   - Reputation score = 0

2. **Admin Verification:**
   - Admin verifies documents (off-chain)
   - Admin calls `/api/admin/users/:id/verify-documents`
   - Sets verification flags
   - Reputation score automatically recalculated

3. **Loan Application:**
   - System checks reputation score
   - Minimum 40 required for approval
   - Score based on verified documents only

## Example Usage

```javascript
// After admin verifies documents:
calculateInitialReputation(true, true, false)
// Returns: 70 (40 + 30 + 0)

calculateInitialReputation(true, true, true)
// Returns: 90 (40 + 30 + 20)
```

## Files Modified

1. **`backend/utils/reputation.js`**
   - Removed endorsementScore from calculation
   - Updated weights: KYC=40, Income=30, Education=20
   - Max score: 90

2. **`backend/routes/auth.js`**
   - Accepts document IDs in registration
   - Does NOT store document IDs
   - Sets verification flags to false by default

3. **`backend/routes/admin.js`**
   - Added `/verify-documents` endpoint
   - Allows admin to set verification flags
   - Auto-recalculates reputation score

4. **`frontend/src/pages/Register.jsx`**
   - Added document ID input fields
   - Clear messaging that IDs are not stored permanently

5. **`backend/routes/loans.js`**
   - Updated reputation calculation calls
   - Removed endorsementScore parameter

## Security & Privacy

✅ **Document IDs NOT stored** - Only verification status stored
✅ **Admin-only verification** - Only admins can set verification flags
✅ **Privacy-first approach** - Sensitive data not persisted

---

## 🚀 Testing

1. Register a new user with document IDs
2. Login as admin
3. Verify documents: `PATCH /api/admin/users/:id/verify-documents`
4. Check reputation score (should be 0-90)
5. Apply for loan (requires score >= 40)

**All changes implemented! 🎉**

