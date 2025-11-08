/**
 * EMI (Equated Monthly Installment) Calculator
 * 
 * Formula: EMI = P × R × (1 + R)^N / ((1 + R)^N - 1)
 * where:
 * P = Principal (loan amount)
 * R = Monthly interest rate (annual rate / 12 / 100)
 * N = Tenure in months
 */

/**
 * Calculate EMI amount
 * @param {number} principal - Loan amount
 * @param {number} annualRate - Annual interest rate (percentage)
 * @param {number} tenureMonths - Loan tenure in months
 * @returns {number} EMI amount
 */
export const calculateEMI = (principal, annualRate, tenureMonths) => {
  if (principal <= 0 || tenureMonths <= 0) {
    return 0;
  }

  const monthlyRate = annualRate / 12 / 100;
  
  if (monthlyRate === 0) {
    return principal / tenureMonths;
  }

  const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths) / 
              (Math.pow(1 + monthlyRate, tenureMonths) - 1);

  return Math.round(emi * 100) / 100; // Round to 2 decimal places
};

/**
 * Generate EMI schedule
 * @param {number} principal - Loan amount
 * @param {number} annualRate - Annual interest rate (percentage)
 * @param {number} tenureMonths - Loan tenure in months
 * @param {Date} startDate - Loan start date
 * @returns {Array} Array of EMI schedule objects
 */
export const generateEMISchedule = (principal, annualRate, tenureMonths, startDate = new Date()) => {
  const schedule = [];
  let remainingPrincipal = principal;
  const monthlyRate = annualRate / 12 / 100;
  const emi = calculateEMI(principal, annualRate, tenureMonths);

  for (let i = 1; i <= tenureMonths; i++) {
    const interest = remainingPrincipal * monthlyRate;
    const principalComponent = emi - interest;
    remainingPrincipal -= principalComponent;

    // Calculate due date (same day each month)
    const dueDate = new Date(startDate);
    dueDate.setMonth(dueDate.getMonth() + i);

    schedule.push({
      emiNumber: i,
      dueDate: new Date(dueDate),
      amount: Math.round(emi * 100) / 100,
      principal: Math.round(principalComponent * 100) / 100,
      interest: Math.round(interest * 100) / 100,
      remainingPrincipal: Math.max(0, Math.round(remainingPrincipal * 100) / 100)
    });
  }

  return schedule;
};

/**
 * Calculate late payment penalty
 * @param {number} emiAmount - EMI amount
 * @param {number} daysDelayed - Number of days delayed
 * @returns {number} Penalty amount
 */
export const calculatePenalty = (emiAmount, daysDelayed) => {
  if (daysDelayed <= 10) {
    return 0;
  }
  return Math.round((emiAmount * 0.02) * 100) / 100; // 2% of EMI
};

/**
 * Calculate prepayment fee
 * @param {number} principalAmount - Remaining principal amount
 * @returns {number} Prepayment fee (2% of principal)
 */
export const calculatePrepaymentFee = (principalAmount) => {
  return Math.round((principalAmount * 0.02) * 100) / 100; // 2% of principal
};

/**
 * Calculate total interest payable
 * @param {number} principal - Loan amount
 * @param {number} annualRate - Annual interest rate (percentage)
 * @param {number} tenureMonths - Loan tenure in months
 * @returns {number} Total interest amount
 */
export const calculateTotalInterest = (principal, annualRate, tenureMonths) => {
  const emi = calculateEMI(principal, annualRate, tenureMonths);
  const totalAmount = emi * tenureMonths;
  return Math.round((totalAmount - principal) * 100) / 100;
};

/**
 * Check if prepayment is allowed (after 6 months)
 * @param {Date} loanStartDate - Loan start date
 * @param {Date} currentDate - Current date
 * @returns {boolean} True if prepayment is allowed
 */
export const isPrepaymentAllowed = (loanStartDate, currentDate = new Date()) => {
  const monthsElapsed = (currentDate.getFullYear() - loanStartDate.getFullYear()) * 12 +
                        (currentDate.getMonth() - loanStartDate.getMonth());
  return monthsElapsed >= 6;
};

