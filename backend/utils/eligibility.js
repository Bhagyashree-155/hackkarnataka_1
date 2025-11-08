/**
 * Eligibility checking utilities for loan applications
 */

/**
 * Check if user meets age requirement (18-60)
 */
export const checkAge = (age) => {
  return age >= 18 && age <= 60;
};

/**
 * Check if user is a resident
 */
export const checkCitizenship = (citizenship) => {
  return citizenship === 'Resident';
};

/**
 * Check if monthly income meets requirement (≥ ₹20,000, except for education loans)
 */
export const checkIncome = (monthlyIncome, loanType) => {
  if (loanType === 'education') {
    return true; // No income requirement for education loans
  }
  return monthlyIncome >= 20000;
};

/**
 * Check if credit score meets requirement (≥ 700)
 */
export const checkCreditScore = (creditScore) => {
  return creditScore >= 700;
};

/**
 * Check if user has less than 3 active loans
 */
export const checkActiveLoans = (activeLoanCount) => {
  return activeLoanCount < 3;
};

/**
 * Check if loan amount is within collateral value (≤ 80% of collateral for secured loans)
 */
export const checkCollateral = (loanAmount, collateralValue, isSecured) => {
  if (!isSecured) {
    return true; // No collateral requirement for unsecured loans
  }
  return loanAmount <= (collateralValue * 0.8);
};

/**
 * Check debt-to-income ratio (≤ 40%)
 */
export const checkDebtToIncome = (totalDebt, monthlyIncome) => {
  if (monthlyIncome === 0) {
    return false;
  }
  const ratio = (totalDebt / monthlyIncome) * 100;
  return ratio <= 40;
};

/**
 * Check if required documents are uploaded
 */
export const checkDocuments = (documents) => {
  const requiredDocs = ['id_proof', 'address_proof', 'income_proof'];
  const uploadedTypes = documents.map(doc => doc.docType);
  
  return requiredDocs.every(docType => uploadedTypes.includes(docType));
};

/**
 * Comprehensive eligibility check
 */
export const checkEligibility = async (user, loanApplication, activeLoanCount, totalDebt, documents) => {
  const results = {
    ageCheck: checkAge(user.age),
    citizenshipCheck: checkCitizenship(user.citizenship),
    incomeCheck: checkIncome(user.monthlyIncome || loanApplication.monthlyIncome, loanApplication.loanType),
    creditScoreCheck: checkCreditScore(user.creditScore),
    activeLoansCheck: checkActiveLoans(activeLoanCount),
    collateralCheck: checkCollateral(
      loanApplication.amount,
      loanApplication.collateralValue || 0,
      loanApplication.collateralValue > 0
    ),
    debtToIncomeCheck: checkDebtToIncome(totalDebt, user.monthlyIncome || loanApplication.monthlyIncome),
    documentsCheck: checkDocuments(documents || [])
  };

  const isEligible = Object.values(results).every(check => check === true);

  return {
    isEligible,
    results
  };
};

/**
 * Check for suspicious applications (basic fraud detection)
 */
export const checkSuspiciousActivity = (loanApplication, user) => {
  const suspiciousFlags = [];

  // Check for unusually high loan amount compared to income
  if (loanApplication.monthlyIncome > 0) {
    const loanToIncomeRatio = loanApplication.amount / (loanApplication.monthlyIncome * 12);
    if (loanToIncomeRatio > 10) {
      suspiciousFlags.push('Loan amount is unusually high compared to income');
    }
  }

  // Check for zero income on non-education loans
  if (loanApplication.loanType !== 'education' && loanApplication.monthlyIncome === 0) {
    suspiciousFlags.push('Zero income for non-education loan');
  }

  // Check for very high collateral value without income
  if (loanApplication.collateralValue > loanApplication.amount * 2 && loanApplication.monthlyIncome < 50000) {
    suspiciousFlags.push('High collateral value with low income');
  }

  return {
    isSuspicious: suspiciousFlags.length > 0,
    flags: suspiciousFlags
  };
};

