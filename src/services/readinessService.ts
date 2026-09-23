import { StudentProfileData, JobPosting, RecommendationResult, SimulationResult, TargetRole } from '../types';
import { generateRecommendations } from './recommendationEngine';
import { getTargetRoleInfo } from '../data/targetRoles';
import { evaluateEligibility } from './eligibilityService';

export interface PlacementReadinessReport {
  overallReadinessScore: number; // 0 - 100
  tierTitle: 'Tier 1 Dream Ready' | 'Tier 2 Competitive Ready' | 'Mass IT / Foundational' | 'Needs Targeted Preparation';
  tierColor: string;
  dimensionScores: {
    academic: number;      // 0 - 100 (GPA & backlogs)
    technicalSkills: number; // 0 - 100 (Target role skill alignment)
    problemSolving: number; // 0 - 100 (LeetCode / DSA aptitude)
    projectPortfolio: number; // 0 - 100 (Hands-on implementations)
    resumeAts: number;     // 0 - 100 (ATS Score & verification)
  };
  keyStrengths: string[];
  growthOpportunities: string[];
  eligibleJobsCount: number;
  totalJobsCount: number;
}

/**
 * Computes Placement Readiness Index (PRI) deterministically across 5 dimensions.
 */
export function calculatePlacementReadiness(
  student: StudentProfileData | null,
  jobs: JobPosting[]
): PlacementReadinessReport {
  if (!student) {
    return {
      overallReadinessScore: 0,
      tierTitle: 'Needs Targeted Preparation',
      tierColor: 'text-slate-500 bg-slate-100',
      dimensionScores: { academic: 0, technicalSkills: 0, problemSolving: 0, projectPortfolio: 0, resumeAts: 0 },
      keyStrengths: [],
      growthOpportunities: ['Create or sign in to your student profile to evaluate placement readiness.'],
      eligibleJobsCount: 0,
      totalJobsCount: jobs.length
    };
  }

  // 1. Academic Dimension (Max 100)
  let academic = Math.min(100, Math.round((student.GPA / 10) * 100));
  if (student.activeBacklogs && student.activeBacklogs > 0) {
    academic = Math.max(30, academic - (student.activeBacklogs * 18));
  } else {
    academic = Math.min(100, academic + 5); // 0 active backlogs bonus
  }

  // 2. Technical Skills Dimension (Target Role Alignment)
  const roleInfo = getTargetRoleInfo(student.preferred_role || 'Software Development Engineer (SDE-1)');
  const coreSkills = roleInfo?.coreSkills || ['C++', 'Python', 'SQL', 'Data Structures & Algorithms'];
  const matchedCoreCount = coreSkills.filter(req => 
    student.skills.some(s => s.toLowerCase() === req.toLowerCase() || s.toLowerCase().includes(req.toLowerCase()))
  ).length;
  const technicalSkills = Math.min(100, Math.round((matchedCoreCount / coreSkills.length) * 100));

  // 3. Problem Solving & DSA (LeetCode count / CP rating)
  let problemSolving = 45; // baseline from coursework
  const solved = student.leetcodeSolved || 0;
  if (solved >= 350) problemSolving = 95;
  else if (solved >= 200) problemSolving = 85;
  else if (solved >= 100) problemSolving = 72;
  else if (solved >= 40) problemSolving = 60;
  else if (solved > 0) problemSolving = 50;

  // 4. Project Portfolio Dimension
  let projectPortfolio = 40;
  if (student.projects.length >= 3) projectPortfolio = 90;
  else if (student.projects.length === 2) projectPortfolio = 78;
  else if (student.projects.length === 1) projectPortfolio = 62;
  if (student.certifications.length >= 2) projectPortfolio = Math.min(100, projectPortfolio + 10);

  // 5. ATS Resume & Profile Completeness
  const resumeAts = student.atsResumeScore || 75;

  // Weighted Holistic Aggregate
  const overallReadinessScore = Math.round(
    (academic * 0.25) +
    (technicalSkills * 0.25) +
    (problemSolving * 0.20) +
    (projectPortfolio * 0.18) +
    (resumeAts * 0.12)
  );

  let tierTitle: PlacementReadinessReport['tierTitle'] = 'Needs Targeted Preparation';
  let tierColor = 'text-amber-700 bg-amber-50 border-amber-200';
  if (overallReadinessScore >= 82 && (!student.activeBacklogs || student.activeBacklogs === 0)) {
    tierTitle = 'Tier 1 Dream Ready';
    tierColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
  } else if (overallReadinessScore >= 68) {
    tierTitle = 'Tier 2 Competitive Ready';
    tierColor = 'text-blue-700 bg-blue-50 border-blue-200';
  } else if (overallReadinessScore >= 50) {
    tierTitle = 'Mass IT / Foundational';
    tierColor = 'text-indigo-700 bg-indigo-50 border-indigo-200';
  }

  // Count eligible jobs
  const eligibleJobsCount = jobs.filter(j => evaluateEligibility(student, j).overallStatus === 'Eligible').length;

  const keyStrengths: string[] = [];
  const growthOpportunities: string[] = [];

  if (student.GPA >= 8.0) keyStrengths.push(`Strong CGPA benchmark (${student.GPA}/10) clearing 90%+ campus filters.`);
  if (!student.activeBacklogs || student.activeBacklogs === 0) keyStrengths.push('Zero active backlogs � meets campus drive compliance standard.');
  if (solved >= 100) keyStrengths.push(`Consistent competitive coding aptitude (${solved} LeetCode questions solved).`);
  if (student.projects.length >= 2) keyStrengths.push(`Diverse project portfolio demonstrating practical software delivery.`);

  if (technicalSkills < 70) growthOpportunities.push(`Master missing target core skills: ${coreSkills.slice(0, 3).join(', ')}.`);
  if (solved < 100) growthOpportunities.push(`Target solving 100+ high-frequency DSA problems on LeetCode/NeetCode.`);
  if (student.projects.length < 2) growthOpportunities.push(`Deploy at least one full-stack or domain project with live URL & documentation.`);
  if (student.activeBacklogs && student.activeBacklogs > 0) growthOpportunities.push(`Prioritize clearing ${student.activeBacklogs} active backlog(s) before Tier 1 campus rounds.`);

  return {
    overallReadinessScore,
    tierTitle,
    tierColor,
    dimensionScores: {
      academic,
      technicalSkills,
      problemSolving,
      projectPortfolio,
      resumeAts
    },
    keyStrengths: keyStrengths.length > 0 ? keyStrengths : ['Solid academic foundation in core branch coursework.'],
    growthOpportunities: growthOpportunities.length > 0 ? growthOpportunities : ['Continue practicing system design and mock behavioral interviews.'],
    eligibleJobsCount,
    totalJobsCount: jobs.length
  };
}

/**
 * �Improve My Match� Simulation Engine
 * Computes the exact before-and-after match score gains if a student acquires new skills,
 * increases their DSA solved count, or adds certifications.
 */
export function simulateImproveMyMatch(
  currentStudent: StudentProfileData,
  jobs: JobPosting[],
  additions: {
    skillsToAdd: string[];
    extraLeetCodeCount: number;
    certificationsToAdd: string[];
  }
): SimulationResult {
  // 1. Calculate original recommendations
  const originalRecs = generateRecommendations(currentStudent, jobs);
  const originalAverageMatch = originalRecs.length > 0
    ? Math.round(originalRecs.reduce((acc, r) => acc + r.final_match_score, 0) / originalRecs.length)
    : 0;

  // 2. Synthesize virtual simulated student profile
  const virtualStudent: StudentProfileData = {
    ...currentStudent,
    skills: Array.from(new Set([...currentStudent.skills, ...additions.skillsToAdd])),
    leetcodeSolved: (currentStudent.leetcodeSolved || 0) + additions.extraLeetCodeCount,
    certifications: [
      ...currentStudent.certifications,
      ...additions.certificationsToAdd.map((name, i) => ({
        id: `sim-cert-${i}`,
        name,
        issuingOrganization: 'Certified Learning Partner',
        issueYear: '2025'
      }))
    ],
    // ATS score boost from added keywords
    atsResumeScore: Math.min(98, (currentStudent.atsResumeScore || 75) + (additions.skillsToAdd.length * 2))
  };

  // 3. Calculate simulated recommendations
  const simulatedRecs = generateRecommendations(virtualStudent, jobs);
  const simulatedAverageMatch = simulatedRecs.length > 0
    ? Math.round(simulatedRecs.reduce((acc, r) => acc + r.final_match_score, 0) / simulatedRecs.length)
    : 0;

  const averageDelta = Math.max(0, simulatedAverageMatch - originalAverageMatch);

  // 4. Calculate newly eligible count
  const origEligible = originalRecs.filter(r => r.eligibility_report?.overallStatus === 'Eligible').length;
  const simEligible = simulatedRecs.filter(r => r.eligibility_report?.overallStatus === 'Eligible').length;
  const newlyEligibleJobCount = Math.max(0, simEligible - origEligible);

  // 5. Compute top gaining jobs
  const gains = simulatedRecs.map(sim => {
    const orig = originalRecs.find(o => o.job.job_id === sim.job.job_id);
    const beforeMatch = orig ? orig.final_match_score : 50;
    const afterMatch = sim.final_match_score;
    const delta = Math.max(0, afterMatch - beforeMatch);
    return {
      jobTitle: sim.job.job_title,
      company: sim.job.company,
      beforeMatch,
      afterMatch,
      delta
    };
  }).sort((a, b) => b.delta - a.delta).slice(0, 5);

  return {
    addedSkills: additions.skillsToAdd,
    addedLeetCodeCount: additions.extraLeetCodeCount,
    addedCertifications: additions.certificationsToAdd,
    originalAverageMatch,
    simulatedAverageMatch,
    averageDelta,
    newlyEligibleJobCount,
    topGains: gains
  };
}
