/**
 * EMI Calculator for frontend
 * Simple EMI Formula: EMI = P × R × (1 + R)^N / ((1 + R)^N - 1)
 * Where:
 * P = Principal (loan amount)
 * R = Monthly interest rate (annual rate / 12 / 100)
 * N = Number of monthly installments
 */

export const calculateEMI = (principal, annualRate, tenureDays) => {
  if (principal <= 0 || tenureDays <= 0 || annualRate <= 0) {
    return { monthlyEMI: 0, totalInterest: 0, totalAmount: principal };
  }

  // Convert days to months (exact conversion)
  const tenureMonths = Math.ceil(tenureDays / 30);
  const monthlyRate = annualRate / 12 / 100;

  // If no interest, simple division
  if (monthlyRate === 0) {
    const monthlyEMI = principal / tenureMonths;
    return {
      monthlyEMI: Math.round(monthlyEMI * 100) / 100,
      totalInterest: 0,
      totalAmount: principal
    };
  }

  // Standard EMI formula
  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) / 
              (Math.pow(1 + monthlyRate, tenureMonths) - 1);

  const monthlyEMI = Math.round(emi * 100) / 100;
  const totalAmount = Math.round(monthlyEMI * tenureMonths * 100) / 100;
  const totalInterest = Math.max(0, Math.round((totalAmount - principal) * 100) / 100);

  return {
    monthlyEMI,
    totalInterest,
    totalAmount
  };
};

