import { EligibilityReport, JobPosting, StudentProfileData } from '../types';

/**
 * Eligibility is intentionally kept separate from match scoring.
 * A strong skill match must never override a campus drive's hard filters.
 */
export function evaluateEligibility(
  student: StudentProfileData,
  job: JobPosting
): EligibilityReport {
  const cgpaDiff = Number((student.GPA - job.minimum_gpa).toFixed(2));
  const cgpaPassed = student.GPA >= job.minimum_gpa;
  const maxBacklogsAllowed = job.max_allowed_backlogs ?? 0;
  const backlogsPassed = student.activeBacklogs <= maxBacklogsAllowed;
  const branchPassed = job.eligible_branches.includes(student.branch);
  const graduationYearPassed = job.eligible_graduation_years
    ? job.eligible_graduation_years.includes(student.graduationYear)
    : true;

  const notes: string[] = [];
  if (!cgpaPassed) notes.push(`CGPA is ${Math.abs(cgpaDiff).toFixed(2)} below the ${job.minimum_gpa.toFixed(1)} cutoff.`);
  if (!branchPassed) notes.push(`${student.branch} is not listed among eligible branches.`);
  if (!backlogsPassed) notes.push(`This drive allows at most ${maxBacklogsAllowed} active backlog(s).`);
  if (!graduationYearPassed) notes.push(`Graduation year ${student.graduationYear} is outside this drive's configured intake years.`);
  if (notes.length === 0) notes.push('All configured campus eligibility criteria are satisfied.');

  const failedCriteria = [cgpaPassed, branchPassed, backlogsPassed, graduationYearPassed].filter(Boolean).length;
  const overallStatus: EligibilityReport['overallStatus'] =
    failedCriteria === 4 ? 'Eligible' : failedCriteria >= 3 ? 'Borderline' : 'Ineligible';

  return {
    overallStatus,
    cgpaPassed,
    cgpaDiff,
    backlogsPassed,
    activeBacklogs: student.activeBacklogs,
    maxBacklogsAllowed,
    branchPassed,
    graduationYearPassed,
    notes,
  };
}
