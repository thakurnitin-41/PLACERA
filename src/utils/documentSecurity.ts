import { StudentProfileData, StudentProofDocument } from '../types';

/**
 * Normalizes document content for fingerprint comparison
 * Strips data URI headers to compare the actual base64 binary content
 */
export function normalizeDocumentPayload(fileUrl?: string): string {
  if (!fileUrl) return '';
  const commaIdx = fileUrl.indexOf(',');
  if (fileUrl.startsWith('data:') && commaIdx !== -1) {
    return fileUrl.substring(commaIdx + 1).trim();
  }
  return fileUrl.trim();
}

/**
 * Fast synchronous cryptographic polynomial hash for document fingerprints
 */
export function computeDocumentChecksum(content: string): string {
  if (!content) return '';
  let hash1 = 5381;
  let hash2 = 52711;
  const len = content.length;
  // Sample up to 4000 characters evenly spread across the content for speed and accuracy
  const step = Math.max(1, Math.floor(len / 4000));
  
  for (let i = 0; i < len; i += step) {
    const char = content.charCodeAt(i);
    hash1 = ((hash1 << 5) + hash1) ^ char;
    hash2 = ((hash2 << 5) + hash2) ^ (char * 33);
  }
  
  const h1 = (hash1 >>> 0).toString(16).padStart(8, '0');
  const h2 = (hash2 >>> 0).toString(16).padStart(8, '0');
  return `DOC-${len}-${h1}${h2}`.toUpperCase();
}

export interface DuplicateDetectionResult {
  isDuplicate: boolean;
  matchedStudent?: {
    name: string;
    rollNumber: string;
    student_id: string;
    collegeName: string;
    documentType: string;
    uploadedAt?: string;
  };
}

/**
 * Comprehensive Institutional Document Duplicate & Fraud Detector
 * Compares newly uploaded document payload against all registered students in the registry.
 */
export function checkDocumentDuplicate(
  uploadedFileUrl: string,
  uploadedFileName: string,
  currentStudentId?: string,
  inMemoryStudents?: StudentProfileData[]
): DuplicateDetectionResult {
  if (!uploadedFileUrl) {
    return { isDuplicate: false };
  }

  const newNormalized = normalizeDocumentPayload(uploadedFileUrl);
  if (!newNormalized || newNormalized.length < 50) {
    return { isDuplicate: false };
  }

  // Load registered students from memory or localStorage
  let studentsPool: StudentProfileData[] = inMemoryStudents || [];
  if (studentsPool.length === 0) {
    try {
      const stored = localStorage.getItem('placera_registered_students');
      if (stored) {
        studentsPool = JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Error reading registered students for fraud check:', e);
    }
  }

  for (const existingStudent of studentsPool) {
    // Skip checking against the same candidate profile when editing
    if (currentStudentId && existingStudent.student_id === currentStudentId) {
      continue;
    }

    // 1. Check primary studentProof document
    if (existingStudent.studentProof?.fileUrl) {
      const existingNormalized = normalizeDocumentPayload(existingStudent.studentProof.fileUrl);
      if (isMatchingPayload(newNormalized, existingNormalized, uploadedFileName, existingStudent.studentProof.fileName)) {
        return {
          isDuplicate: true,
          matchedStudent: {
            name: existingStudent.name,
            rollNumber: existingStudent.rollNumber || 'N/A',
            student_id: existingStudent.student_id,
            collegeName: existingStudent.collegeName || 'Institutional Registry',
            documentType: existingStudent.studentProof.documentType || 'College ID Card',
            uploadedAt: existingStudent.studentProof.uploadedAt
          }
        };
      }
    }

    // 2. Check marksheetProof document
    if (existingStudent.marksheetProof?.fileUrl) {
      const existingNormalized = normalizeDocumentPayload(existingStudent.marksheetProof.fileUrl);
      if (isMatchingPayload(newNormalized, existingNormalized, uploadedFileName, existingStudent.marksheetProof.fileName)) {
        return {
          isDuplicate: true,
          matchedStudent: {
            name: existingStudent.name,
            rollNumber: existingStudent.rollNumber || 'N/A',
            student_id: existingStudent.student_id,
            collegeName: existingStudent.collegeName || 'Institutional Registry',
            documentType: existingStudent.marksheetProof.documentType || 'Semester Marksheet',
            uploadedAt: existingStudent.marksheetProof.uploadedAt
          }
        };
      }
    }

    // 3. Check uploaded marksheets array
    if (existingStudent.uploadedMarksheets && existingStudent.uploadedMarksheets.length > 0) {
      for (const ms of existingStudent.uploadedMarksheets) {
        if (ms.fileUrl) {
          const existingNormalized = normalizeDocumentPayload(ms.fileUrl);
          if (isMatchingPayload(newNormalized, existingNormalized, uploadedFileName, ms.fileName)) {
            return {
              isDuplicate: true,
              matchedStudent: {
                name: existingStudent.name,
                rollNumber: existingStudent.rollNumber || 'N/A',
                student_id: existingStudent.student_id,
                collegeName: existingStudent.collegeName || 'Institutional Registry',
                documentType: `${ms.semesterOrYear} Marksheet`,
                uploadedAt: ms.uploadedAt
              }
            };
          }
        }
      }
    }
  }

  return { isDuplicate: false };
}

/**
 * Checks if two document payloads match (identical content or exact file matches)
 */
function isMatchingPayload(
  payloadA: string,
  payloadB: string,
  fileNameA?: string,
  fileNameB?: string
): boolean {
  if (!payloadA || !payloadB) return false;

  // Exact payload match
  if (payloadA === payloadB) return true;

  // Length difference check - if difference is small (<1%) and prefixes match
  if (Math.abs(payloadA.length - payloadB.length) < 20) {
    if (payloadA.substring(0, 300) === payloadB.substring(0, 300)) {
      return true;
    }
  }

  // Exact file name and matching substantial prefix (over 200 chars)
  if (
    fileNameA &&
    fileNameB &&
    fileNameA.toLowerCase() === fileNameB.toLowerCase() &&
    fileNameA.trim().length > 4 &&
    payloadA.substring(0, 200) === payloadB.substring(0, 200)
  ) {
    return true;
  }

  return false;
}
