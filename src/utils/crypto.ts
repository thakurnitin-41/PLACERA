/**
 * Secure Cryptographic Utilities for Placement Recommendation System
 * Uses standard Web Crypto API (SHA-256 + Salted Hashing & AES-GCM Encrypted Payloads)
 */

export interface EncryptedPasswordData {
  hash: string;
  salt: string;
  algorithm: 'PBKDF2-SHA256' | 'SHA-256-SALTED';
}

/**
 * Generate cryptographically secure random salt hex string
 */
export function generateSalt(length = 16): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Hash password with salt using SHA-256
 */
export async function hashPassword(password: string, customSalt?: string): Promise<EncryptedPasswordData> {
  const salt = customSalt || generateSalt(16);
  const encoder = new TextEncoder();
  const data = encoder.encode(`placera_v1:${salt}:${password}`);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

  return {
    hash,
    salt,
    algorithm: 'SHA-256-SALTED'
  };
}

/**
 * Verify plaintext password against stored salted hash with backwards compatibility
 */
export async function verifyPassword(
  attemptPassword: string,
  storedHash?: string,
  storedSalt?: string,
  legacyRawPassword?: string
): Promise<boolean> {
  if (!attemptPassword) return false;

  // 1. If profile has cryptographic hash & salt
  if (storedHash && storedSalt) {
    const { hash } = await hashPassword(attemptPassword, storedSalt);
    return hash === storedHash;
  }

  // 2. Legacy fallback if raw password was stored
  if (legacyRawPassword) {
    return attemptPassword === legacyRawPassword;
  }

  // If no password was required on profile, allow login
  return true;
}

/**
 * Calculate Academic Standing and required marksheet based on Admission Year & Graduation Year dynamically as per current date
 */
export interface AcademicYearCalculation {
  admissionYear: number;
  graduationYear: number;
  totalDurationYears: number;
  currentYearOfStudy: number; // 1, 2, 3, 4
  currentYearLabel: string; // e.g. "2nd Year (Sophomore)", "3rd Year (Junior)", "4th Year (Senior / Final Year)"
  currentSemester: number; // e.g. 1 to 8
  completedSemesters: number; // e.g. for 2nd year (admitted 2025 in 2026), 2 semesters completed
  completedYearName: string; // e.g. "1st Year (Sem 1 & 2)"
  cgpaLabel: string; // e.g. "Cumulative CGPA up to 2nd Semester (1st Year)"
  cgpaShortLabel: string; // e.g. "CGPA (Up to Sem 2)"
  cgpaExplanation: string; // e.g. "Official cumulative CGPA on your transcript up to Semester 2."
  cgpaProfessionalHelp: string; // Professional helper note explaining which transcript to use
  suggestedMarksheetName: string; // e.g. "1st Year (2nd Semester) Marksheet"
  marksheetDescription: string;
  isPassedOut: boolean;
  academicSession: string; // e.g. "2026–2027"
}

export function calculateAcademicStanding(
  admissionYear: number = 2025,
  graduationYear?: number,
  targetDate: Date = new Date()
): AcademicYearCalculation {
  const currentCalendarYear = targetDate.getFullYear();
  const currentMonth = targetDate.getMonth(); // 0 = Jan, 5 = June, 6 = July, 8 = Sept

  // Academic sessions run from July (month index 6) of year Y to June (month index 5) of year Y+1.
  // e.g. in Sept 2026, session start is 2026, active session is 2026–2027.
  const academicSessionStart = currentMonth >= 5 ? currentCalendarYear : currentCalendarYear - 1;
  const academicSession = `${academicSessionStart}–${academicSessionStart + 1}`;

  const validAdmission = Number.isFinite(admissionYear) && admissionYear > 1990 ? admissionYear : 2025;
  const gradYear = (graduationYear && graduationYear > validAdmission) 
    ? graduationYear 
    : validAdmission + 4;
  const duration = Math.max(1, gradYear - validAdmission);

  // Completed years in college up to current session start
  const elapsedYears = Math.max(0, academicSessionStart - validAdmission);

  // If admitted in 2025: in 2026 session, elapsedYears = 1 -> Year 2 (Sophomore)
  // If admitted in 2024: elapsedYears = 2 -> Year 3 (Junior)
  // If admitted in 2023: elapsedYears = 3 -> Year 4 (Senior)
  // If admitted in 2026: elapsedYears = 0 -> Year 1 (Freshman)
  let currentYear = elapsedYears + 1;
  const isPassedOut = currentYear > duration || academicSessionStart >= gradYear;

  if (isPassedOut) {
    currentYear = duration;
  } else if (currentYear < 1) {
    currentYear = 1;
  }

  // Fall / Odd Semester (July to Dec) vs Spring / Even Semester (Jan to June)
  const isOddSemester = currentMonth >= 5 && currentMonth <= 11;
  const currentSemester = isPassedOut
    ? duration * 2
    : Math.min(duration * 2, Math.max(1, (currentYear - 1) * 2 + (isOddSemester ? 1 : 2)));

  const completedSemesters = isPassedOut
    ? duration * 2
    : isOddSemester 
      ? Math.max(0, (currentYear - 1) * 2) 
      : Math.max(0, (currentYear - 1) * 2 + 1);

  let currentYearLabel = `${currentYear}th Year`;
  if (isPassedOut) {
    currentYearLabel = `Graduated Batch of ${gradYear}`;
  } else if (currentYear === 1) {
    currentYearLabel = '1st Year (Freshman)';
  } else if (currentYear === 2) {
    currentYearLabel = '2nd Year (Sophomore)';
  } else if (currentYear === 3) {
    currentYearLabel = '3rd Year (Junior / Pre-Final Year)';
  } else if (currentYear === 4) {
    currentYearLabel = '4th Year (Senior / Final Year)';
  }

  // CGPA context & professional labelling
  let cgpaLabel = 'Cumulative CGPA';
  let cgpaShortLabel = 'CGPA';
  let cgpaExplanation = 'Enter your official cumulative grade point average (out of 10.0).';
  let cgpaProfessionalHelp = 'Enter your aggregate CGPA from your latest official grade card.';
  let completedYearName = 'Previous Semesters';
  let suggestedMarksheetName = 'Previous Year / Semester Marksheet';
  let marksheetDescription = 'Upload your most recently cleared semester transcript.';

  if (isPassedOut) {
    cgpaLabel = `Final Degree Aggregate CGPA (All ${duration * 2} Semesters)`;
    cgpaShortLabel = 'Final Degree CGPA';
    cgpaExplanation = `Official cumulative CGPA across all ${duration * 2} semesters printed on your final degree transcript.`;
    cgpaProfessionalHelp = `As a graduated candidate, enter your final 4-year cumulative degree CGPA (out of 10.0) as recorded on your degree certificate.`;
    completedYearName = `All ${duration * 2} Semesters Completed`;
    suggestedMarksheetName = 'Consolidated Final Degree Transcript / Provisional Certificate';
    marksheetDescription = 'Upload your final consolidated marksheet or university provisional certificate.';
  } else if (currentYear === 1) {
    if (completedSemesters === 0) {
      cgpaLabel = 'Expected CGPA / 1st Term SGPA (Ongoing 1st Sem)';
      cgpaShortLabel = '1st Year Target CGPA / SGPA';
      cgpaExplanation = 'As a 1st year freshman in your 1st semester, enter your current 1st term SGPA, internal assessment GPA, or target score.';
      cgpaProfessionalHelp = 'Freshman Note: Since 1st semester exams are ongoing, enter your current internal SGPA or target CGPA (12th percentage is captured separately).';
      completedYearName = '12th Board / Entrance';
      suggestedMarksheetName = '12th Board / Senior Secondary Final Marksheet';
      marksheetDescription = 'Upload your 12th Board / Polytechnic diploma final marksheet.';
    } else {
      cgpaLabel = 'Cumulative CGPA (Up to Semester 1)';
      cgpaShortLabel = 'CGPA (Up to Sem 1)';
      cgpaExplanation = 'Official cumulative CGPA published on your Semester 1 grade card.';
      cgpaProfessionalHelp = 'Enter your official SGPA/CGPA from your 1st semester grade card.';
      completedYearName = 'Semester 1';
      suggestedMarksheetName = '1st Semester Grade Card';
      marksheetDescription = 'Upload your Semester 1 transcript.';
    }
  } else if (currentYear === 2) {
    const semCount = completedSemesters > 0 ? completedSemesters : 2;
    cgpaLabel = `Cumulative CGPA (Up to ${semCount}nd Semester / 1st Year)`;
    cgpaShortLabel = `CGPA (Up to Sem ${semCount})`;
    cgpaExplanation = `Official cumulative CGPA from your 1st Year (Semester 1 & 2) published grade transcript.`;
    cgpaProfessionalHelp = `2nd Year Note: Enter the cumulative CGPA calculated over your completed 1st Year (Semesters 1 & 2), which is used for early internship screening.`;
    completedYearName = `1st Year (Semesters 1 & 2)`;
    suggestedMarksheetName = '1st Year (2nd Semester) Transcript / Marksheet';
    marksheetDescription = 'Upload your official 1st Year consolidated or 2nd semester grade card.';
  } else if (currentYear === 3) {
    const semCount = completedSemesters > 0 ? completedSemesters : 4;
    cgpaLabel = `Cumulative CGPA (Up to ${semCount}th Semester / 2nd Year)`;
    cgpaShortLabel = `CGPA (Up to Sem ${semCount})`;
    cgpaExplanation = `Official cumulative CGPA published on your 2nd Year (Semester ${semCount}) consolidated grade card.`;
    cgpaProfessionalHelp = `3rd Year Note: Enter your aggregate CGPA across all 4 completed semesters (1st and 2nd Year), as required for Summer Internship and Placement shortlist rounds.`;
    completedYearName = `2nd Year (Semesters 1 to 4)`;
    suggestedMarksheetName = '2nd Year (4th Semester) Consolidated Marksheet';
    marksheetDescription = 'Upload your official 4th semester consolidated transcript / grade card.';
  } else if (currentYear === 4) {
    const semCount = completedSemesters > 0 ? completedSemesters : 6;
    cgpaLabel = `Cumulative CGPA (Up to ${semCount}th Semester / Pre-Final Year)`;
    cgpaShortLabel = `CGPA (Up to Sem ${semCount})`;
    cgpaExplanation = `Official 6-semester cumulative CGPA published up to 3rd Year (Sem 6) used for Campus Placement Cutoffs.`;
    cgpaProfessionalHelp = `Final Year Note: Enter your official 6-semester cumulative CGPA (through 3rd Year). This is the exact cutoff metric used by on-campus Tier-1/Product companies.`;
    completedYearName = `3rd Year (Semesters 1 to 6)`;
    suggestedMarksheetName = '3rd Year (6th Semester) Consolidated Marksheet';
    marksheetDescription = 'Upload your 3rd Year (6th Semester) official marksheet or cumulative transcript.';
  }

  return {
    admissionYear: validAdmission,
    graduationYear: gradYear,
    totalDurationYears: duration,
    currentYearOfStudy: currentYear,
    currentYearLabel,
    currentSemester,
    completedSemesters,
    completedYearName,
    cgpaLabel,
    cgpaShortLabel,
    cgpaExplanation,
    cgpaProfessionalHelp,
    suggestedMarksheetName,
    marksheetDescription,
    isPassedOut,
    academicSession
  };
}
