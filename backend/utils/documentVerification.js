/**
 * Document Verification Utility
 * Verifies Aadhaar, Income Certificate, and Education Certificate numbers
 * against hardcoded lists of valid numbers
 */

// Valid Aadhaar numbers (around 10 numbers)
const VALID_AADHAAR_NUMBERS = [
  '123456789012',
  '234567890123',
  '345678901234',
  '456789012345',
  '567890123456',
  '678901234567',
  '789012345678',
  '890123456789',
  '901234567890',
  '012345678901'
];

// Valid Income Certificate Numbers
const VALID_INCOME_CERTIFICATE_NUMBERS = [
  'INC001',
  'INC002',
  'INC003',
  'INC004',
  'INC005',
  'INC006',
  'INC007',
  'INC008',
  'INC009',
  'INC010'
];

// Valid Student Registration Numbers (Education Certificate)
const VALID_STUDENT_REGISTRATION_NUMBERS = [
  'STU001',
  'STU002',
  'STU003',
  'STU004',
  'STU005',
  'STU006',
  'STU007',
  'STU008',
  'STU009',
  'STU010'
];

/**
 * Verify Aadhaar number
 * @param {string} aadhaarNumber - Aadhaar number to verify
 * @returns {object} { verified: boolean, message: string }
 */
export const verifyAadhaar = (aadhaarNumber) => {
  if (!aadhaarNumber || typeof aadhaarNumber !== 'string' || aadhaarNumber.trim() === '') {
    return { verified: false, message: 'Aadhaar number is required' };
  }

  // Remove any spaces, dashes, or other formatting characters
  const cleanedNumber = aadhaarNumber.trim().replace(/\s+/g, '').replace(/-/g, '').replace(/_/g, '');
  
  // Check if number exists in valid list (full match)
  if (VALID_AADHAAR_NUMBERS.includes(cleanedNumber)) {
    return { verified: true, message: 'Aadhaar Verified ✅' };
  }

  return { verified: false, message: 'Aadhaar Not Found ❌' };
};

/**
 * Verify Income Certificate number
 * @param {string} incomeCertificateNumber - Income certificate number to verify
 * @returns {object} { verified: boolean, message: string }
 */
export const verifyIncomeCertificate = (incomeCertificateNumber) => {
  if (!incomeCertificateNumber || typeof incomeCertificateNumber !== 'string' || incomeCertificateNumber.trim() === '') {
    return { verified: false, message: 'Income certificate number is required' };
  }

  // Remove spaces and convert to uppercase for matching
  const trimmedNumber = incomeCertificateNumber.trim().replace(/\s+/g, '').toUpperCase();
  
  // Check if number exists in valid list (full match)
  if (VALID_INCOME_CERTIFICATE_NUMBERS.includes(trimmedNumber)) {
    return { verified: true, message: 'Income Certificate Verified ✅' };
  }

  return { verified: false, message: 'Income Certificate Not Found ❌' };
};

/**
 * Verify Student Registration Number (Education Certificate)
 * @param {string} studentRegistrationNumber - Student registration number to verify
 * @returns {object} { verified: boolean, message: string }
 */
export const verifyStudentRegistration = (studentRegistrationNumber) => {
  // Student registration number is optional
  if (!studentRegistrationNumber || typeof studentRegistrationNumber !== 'string' || studentRegistrationNumber.trim() === '') {
    return { verified: true, message: 'Student Registration (Optional) - Not Provided' };
  }

  const trimmedNumber = studentRegistrationNumber.trim().toUpperCase();
  
  // Check if number exists in valid list (full match)
  if (VALID_STUDENT_REGISTRATION_NUMBERS.includes(trimmedNumber)) {
    return { verified: true, message: 'Student Registration Verified ✅' };
  }

  return { verified: false, message: 'Student Registration Not Found ❌' };
};

/**
 * Get all valid numbers (for admin reference)
 */
export const getValidNumbers = () => {
  return {
    aadhaar: VALID_AADHAAR_NUMBERS,
    incomeCertificate: VALID_INCOME_CERTIFICATE_NUMBERS,
    studentRegistration: VALID_STUDENT_REGISTRATION_NUMBERS
  };
};

/**
 * Verify all documents
 * @param {string} aadhaarNumber - Aadhaar number
 * @param {string} incomeCertificateNumber - Income certificate number
 * @param {string} studentRegistrationNumber - Student registration number (or educationCertificateNumber)
 * @returns {object} Verification results
 */
export const verifyAllDocuments = (aadhaarNumber, incomeCertificateNumber, studentRegistrationNumber) => {
  const aadhaarResult = verifyAadhaar(aadhaarNumber);
  const incomeResult = verifyIncomeCertificate(incomeCertificateNumber);
  // Student registration is optional - if not provided, it's considered verified
  const educationResult = verifyStudentRegistration(studentRegistrationNumber || '');

  // All verified if: Aadhaar verified AND Income verified AND (Education verified OR not provided)
  // Since education is optional, we only require Aadhaar and Income to be verified
  const allVerified = aadhaarResult.verified && incomeResult.verified && educationResult.verified;

  return {
    aadhaar: aadhaarResult,
    income: incomeResult,
    education: educationResult,
    allVerified,
    trusted: allVerified // If all required documents verified, borrower is trusted
  };
};

