/**
 * Reputation Score Calculator for Borrowers
 * Calculates initial reputation score based on verification factors
 * 
 * Step 4: Define weights for scoring
 */

// Define weights
const KYC_WEIGHT = 40;
const INCOME_WEIGHT = 30;
const EDUCATION_WEIGHT = 20;

/**
 * Step 5: Calculate initial reputation score for first-time borrowers
 * 
 * Inputs: kycVerified (bool), incomeVerified (bool), educationVerified (bool)
 * Output: reputation score (0-90) weighted by defined factors
 * 
 * @param {boolean} kycVerified - KYC verification status
 * @param {boolean} incomeVerified - Income verification status
 * @param {boolean} educationVerified - Education verification status
 * @returns {number} Reputation score (0-90)
 */
export const calculateInitialReputation = (
  kycVerified = false,
  incomeVerified = false,
  educationVerified = false
) => {
  let score = 0;

  // Add KYC weight if verified
  if (kycVerified === true) {
    score += KYC_WEIGHT;
  }

  // Add income weight if verified
  if (incomeVerified === true) {
    score += INCOME_WEIGHT;
  }

  // Add education weight if verified
  if (educationVerified === true) {
    score += EDUCATION_WEIGHT;
  }

  // Return score (max 90 with all verifications)
  return Math.min(90, Math.max(0, Math.round(score * 100) / 100));
};

/**
 * Get reputation level based on score
 * @param {number} score - Reputation score (0-100)
 * @returns {string} Reputation level
 */
export const getReputationLevel = (score) => {
  if (score >= 80) return 'excellent';
  if (score >= 60) return 'good';
  if (score >= 40) return 'fair';
  if (score >= 20) return 'poor';
  return 'very_poor';
};

/**
 * Check if borrower meets minimum reputation for loan approval
 * @param {number} score - Reputation score
 * @param {number} minScore - Minimum required score (default: 40)
 * @returns {boolean} True if meets minimum requirement
 */
export const meetsMinimumReputation = (score, minScore = 40) => {
  return score >= minScore;
};

