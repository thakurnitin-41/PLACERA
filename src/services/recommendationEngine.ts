import { JobPosting, RecommendationResult, StudentProfileData, SkillGapItem } from '../types';
import { evaluateEligibility } from './eligibilityService';

// Academic Stopwords list for NLP preprocessing
const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and',
  'any', 'are', 'aren\'t', 'as', 'at', 'be', 'because', 'been', 'before', 'being',
  'below', 'between', 'both', 'but', 'by', 'can', 'can\'t', 'cannot', 'could',
  'did', 'do', 'does', 'doing', 'don\'t', 'down', 'during', 'each', 'few', 'for',
  'from', 'further', 'had', 'has', 'have', 'having', 'he', 'her', 'here', 'hers',
  'herself', 'him', 'himself', 'his', 'how', 'i', 'if', 'in', 'into', 'is', 'isn\'t',
  'it', 'its', 'itself', 'let\'s', 'me', 'more', 'most', 'my', 'myself', 'no',
  'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our',
  'ours', 'ourselves', 'out', 'over', 'own', 'same', 'she', 'should', 'so', 'some',
  'such', 'than', 'that', 'the', 'their', 'theirs', 'them', 'themselves', 'then',
  'there', 'these', 'they', 'this', 'those', 'through', 'to', 'too', 'under',
  'until', 'up', 'very', 'was', 'we', 'were', 'what', 'when', 'where', 'which',
  'while', 'who', 'whom', 'why', 'with', 'would', 'you', 'your', 'yours', 'yourself'
]);

/**
 * Normalizes skill strings for robust string/token matching
 * Handles synonyms (e.g. React.js <-> React, ML <-> Machine Learning)
 */
export function normalizeSkill(raw: string): string {
  const clean = raw.trim().toLowerCase();
  if (clean === 'react' || clean === 'react.js' || clean === 'reactjs') return 'react.js';
  if (clean === 'ml' || clean === 'machine learning') return 'machine learning';
  if (clean === 'dsa' || clean === 'data structures' || clean === 'algorithms') return 'data structures & algorithms';
  if (clean === 'ai' || clean === 'artificial intelligence') return 'artificial intelligence';
  if (clean === 'js' || clean === 'javascript') return 'javascript';
  if (clean === 'ts' || clean === 'typescript') return 'typescript';
  if (clean === 'py' || clean === 'python') return 'python';
  if (clean === 'cpp' || clean === 'c++') return 'c++';
  if (clean === 'dbms' || clean === 'databases') return 'database management';
  return clean;
}

/**
 * Text Preprocessing Pipeline:
 * 1. Lowercase conversion
 * 2. Punctuation removal
 * 3. Tokenization
 * 4. Stop-word filtering
 */
export function preprocessText(text: string): string[] {
  if (!text) return [];
  // Lowercase & replace punctuation with space, preserving alphanumeric
  const clean = text.toLowerCase().replace(/[^a-z0-9+#.\s]/g, ' ');
  const tokens = clean.split(/\s+/).filter(token => token.length > 1);
  return tokens.filter(token => !STOP_WORDS.has(token));
}

/**
 * Computes TF-IDF Vectors & Cosine Similarity
 * Cosine Similarity: Sc(A, B) = (A · B) / (||A|| * ||B||)
 */
export function calculateCosineSimilarity(textA: string, textB: string): number {
  const tokensA = preprocessText(textA);
  const tokensB = preprocessText(textB);

  if (tokensA.length === 0 || tokensB.length === 0) return 0;

  // Build vocabulary
  const vocab = Array.from(new Set([...tokensA, ...tokensB]));

  // Calculate Term Frequencies (TF)
  const tfA: Record<string, number> = {};
  const tfB: Record<string, number> = {};

  tokensA.forEach(t => { tfA[t] = (tfA[t] || 0) + 1; });
  tokensB.forEach(t => { tfB[t] = (tfB[t] || 0) + 1; });

  // Calculate Dot Product and Vector Magnitudes
  let dotProduct = 0;
  let magA = 0;
  let magB = 0;

  vocab.forEach(term => {
    // Basic IDF weighting heuristic across document pair
    const df = (tfA[term] ? 1 : 0) + (tfB[term] ? 1 : 0);
    const idf = Math.log(1 + (2 / df));

    const weightA = ((tfA[term] || 0) / tokensA.length) * idf;
    const weightB = ((tfB[term] || 0) / tokensB.length) * idf;

    dotProduct += weightA * weightB;
    magA += weightA * weightA;
    magB += weightB * weightB;
  });

  if (magA === 0 || magB === 0) return 0;
  const similarity = dotProduct / (Math.sqrt(magA) * Math.sqrt(magB));
  return Math.min(1, Math.max(0, similarity));
}

/**
 * Deterministic multi-criteria fit score.
 * This is intentionally not presented as a trained classifier: no model or
 * labelled training dataset ships with the client application.
 */
export function calculateMultiCriteriaFit(
  student: StudentProfileData,
  job: JobPosting,
  cosineScore: number
): number {
  // Feature 1: GPA fit factor (max 25 pts)
  const gpaDiff = student.GPA - job.minimum_gpa;
  let gpaScore = 0;
  if (gpaDiff >= 0) {
    // Eligible! Bonus for higher GPA
    gpaScore = 18 + Math.min(7, gpaDiff * 5);
  } else if (gpaDiff >= -0.5) {
    // Borderline (within 0.5 of cutoff)
    gpaScore = 10;
  } else {
    // Ineligible
    gpaScore = 4;
  }

  // Backlogs penalty (campus drive criteria)
  if (student.activeBacklogs && student.activeBacklogs > 0) {
    gpaScore = Math.max(2, gpaScore - (student.activeBacklogs * 4));
  }

  // Feature 2: Cosine Similarity feature impact (max 30 pts)
  const simFeatureScore = cosineScore * 0.30;

  // Feature 3: Branch Eligibility compatibility (max 15 pts)
  const isBranchEligible = job.eligible_branches.includes(student.branch);
  const branchScore = isBranchEligible ? 15 : 4;

  // Feature 4: Practical Projects Relevance (max 15 pts)
  let projectMatchCount = 0;
  const normalizedJobSkills = job.required_skills.map(normalizeSkill);
  student.projects.forEach(p => {
    const projectTechs = p.technologies.map(normalizeSkill);
    const hasOverlap = projectTechs.some(tech => normalizedJobSkills.includes(tech));
    if (hasOverlap) projectMatchCount++;
  });
  const projectScore = Math.min(15, projectMatchCount * 7.5);

  // Feature 5: Competitive Programming & LeetCode Practice (max 8 pts)
  let cpScore = 3;
  if (student.leetcodeSolved && student.leetcodeSolved > 0) {
    if (student.leetcodeSolved >= 300) cpScore = 8;
    else if (student.leetcodeSolved >= 150) cpScore = 6;
    else if (student.leetcodeSolved >= 50) cpScore = 5;
  }

  // Feature 6: Core Subjects & ATS Score (max 7 pts)
  let academicCoreScore = 3;
  if (student.coreSubjects && student.coreSubjects.length >= 4) {
    academicCoreScore += 2;
  }
  if (student.atsResumeScore && student.atsResumeScore >= 80) {
    academicCoreScore += 2;
  }

  // Feature 7: Verified Student Achievements & Honors (max 6 pts bonus)
  let achievementScore = 0;
  if (student.achievements && student.achievements.length > 0) {
    achievementScore = Math.min(6, student.achievements.length * 2);
  }

  // Ensemble Aggregate (0 - 100)
  const rawFit = gpaScore + simFeatureScore + branchScore + projectScore + cpScore + academicCoreScore + achievementScore;
  return Math.round(Math.min(99, Math.max(25, rawFit)));
}

/**
 * Analyzes matching and missing skills between student and job
 */
export function analyzeSkillsOverlap(studentSkills: string[], jobSkills: string[]) {
  const normStudent = studentSkills.map(s => ({ original: s, norm: normalizeSkill(s) }));
  const matching: string[] = [];
  const missing: string[] = [];

  jobSkills.forEach(req => {
    const normReq = normalizeSkill(req);
    const match = normStudent.find(s => s.norm === normReq || normReq.includes(s.norm) || s.norm.includes(normReq));
    if (match) {
      matching.push(req);
    } else {
      missing.push(req);
    }
  });

  return { matching, missing };
}

/**
 * Complete Placement Recommendation Engine:
 * Student Profile + Job Data -> TF-IDF -> cosine similarity -> deterministic
 * multi-criteria fit -> direct skill coverage -> ranked recommendations.
 */
export function generateRecommendations(
  student: StudentProfileData | null,
  jobs: JobPosting[]
): RecommendationResult[] {
  if (!student) return [];
  // Construct student profile textual representation
  const studentSkillsText = student.skills.join(' ');
  const studentProjectsText = student.projects.map(p => `${p.title} ${p.description} ${p.technologies.join(' ')}`).join(' ');
  const coreSubjectsText = (student.coreSubjects || []).join(' ');
  const extracurricularsText = student.leadershipAndExtracurriculars || '';
  const cpText = student.leetcodeSolved && student.leetcodeSolved > 0 ? `problem-solving DSA leetcode algorithmic-thinking` : '';
  const studentProfileCorpus = `${student.preferred_role} ${studentSkillsText} ${studentProjectsText} ${student.branch} ${student.experience} ${coreSubjectsText} ${extracurricularsText} ${cpText}`;

  const results: RecommendationResult[] = jobs.map((job, idx) => {
    // Construct job profile textual representation
    const jobSkillsText = [...job.required_skills, ...job.preferred_skills].join(' ');
    const jobCorpus = `${job.job_title} ${jobSkillsText} ${job.description} ${job.eligible_branches.join(' ')}`;

    // Stage 1 & 2: TF-IDF & Cosine Similarity
    const cosineRaw = calculateCosineSimilarity(studentProfileCorpus, jobCorpus);
    const cosineScore = Math.round(cosineRaw * 100);

    // Stage 3: transparent deterministic structured-profile score
    const multiCriteriaFitScore = calculateMultiCriteriaFit(student, job, cosineScore);

    // Stage 4: weighted, explainable blend
    const { matching, missing } = analyzeSkillsOverlap(student.skills, job.required_skills);
    const skillOverlapRatio = job.required_skills.length > 0
      ? matching.length / job.required_skills.length
      : 0.5;

    const skillOverlapPercent = Math.round(skillOverlapRatio * 100);

    // Final blended match percentage
    const roleInfo = student.preferred_role
      ? `${student.preferred_role} ${job.job_title}`.toLowerCase()
      : '';
    const targetRoleBonus = roleInfo.includes(job.job_title.toLowerCase().split(' ')[0]) ? 5 : 0;
    let finalMatch = Math.round(
      (cosineScore * 0.35) +
      (multiCriteriaFitScore * 0.35) +
      (skillOverlapPercent * 0.30) +
      targetRoleBonus
    );

    // Cap boundaries
    finalMatch = Math.min(98, Math.max(30, finalMatch));

    // Academic Explainability Generator
    const eligibilityReport = evaluateEligibility(student, job);
    const gpaEligible = eligibilityReport.cgpaPassed;
    const branchEligible = eligibilityReport.branchPassed;

    // Relevant projects finding
    const normReqs = job.required_skills.map(normalizeSkill);
    const relevantProjects = student.projects
      .filter(p => p.technologies.some(t => normReqs.includes(normalizeSkill(t))))
      .map(p => p.title);

    // Relevant certs finding
    const relevantCerts = student.certifications
      .filter(c => {
        const text = `${c.name} ${c.issuingOrganization}`.toLowerCase();
        return normReqs.some(req => text.includes(req.toLowerCase()));
      })
      .map(c => c.name);

    // Human-readable explainable reason
    let reason = '';
    if (matching.length >= 3) {
      reason = `Strong skill overlap in ${matching.slice(0, 3).join(', ')}. `;
    } else if (matching.length > 0) {
      reason = `Direct match on core required skills (${matching.join(', ')}). `;
    } else {
      reason = `Academic profile and foundational branch competencies align with entry-level training pathways. `;
    }

    if (gpaEligible && branchEligible) {
      reason += `Fully meets CGPA benchmark (${student.GPA} vs ${job.minimum_gpa} min) and branch qualification (${student.branch}).`;
      if (student.leetcodeSolved && student.leetcodeSolved >= 150) {
        reason += ` High coding aptitude with ${student.leetcodeSolved} DSA problems solved.`;
      }
    } else if (!gpaEligible) {
      reason += `CGPA (${student.GPA}) is slightly below cutoff (${job.minimum_gpa}); recommend highlighting projects and skill tests.`;
    } else if (!branchEligible) {
      reason += `Branch ${student.branch} requires off-campus recruitment or coordinator approval.`;
    }

    if (student.activeBacklogs && student.activeBacklogs > 0) {
      reason += ` Note: ${student.activeBacklogs} active backlog(s) flagged for recruiter review.`;
    }

    if (student.achievements && student.achievements.length > 0) {
      const topAch = student.achievements[0];
      reason += ` Profile strengthened by verified achievement: "${topAch.title}".`;
    }

    return {
      recommendation_id: `REC-${Date.now()}-${idx + 1}`,
      student_id: student.student_id,
      job,
      cosine_similarity_score: cosineScore,
      multi_criteria_fit_score: multiCriteriaFitScore,
      // Kept as a read-only compatibility alias for older consumers.
      rf_fit_score: multiCriteriaFitScore,
      final_match_score: finalMatch,
      matching_skills: matching,
      missing_skills: missing,
      gpa_eligible: gpaEligible,
      branch_eligible: branchEligible,
      relevant_projects: relevantProjects.length > 0 ? relevantProjects : ['Relevant Coursework & Lab Assignments'],
      relevant_certifications: relevantCerts.length > 0 ? relevantCerts : ['Degree Program Core Curriculum'],
      recommendation_reason: reason,
      score_breakdown: {
        semantic_nlp_score: cosineScore,
        multi_criteria_fit_score: multiCriteriaFitScore,
        skill_overlap_score: skillOverlapPercent,
        target_role_bonus: targetRoleBonus,
        reasons: [
          {
            type: matching.length > 0 ? 'positive' : 'warning',
            title: 'Required-skill coverage',
            detail: `${matching.length} of ${job.required_skills.length} required skills are present.`,
            weightImpact: '30% of match score'
          },
          {
            type: eligibilityReport.overallStatus === 'Eligible' ? 'positive' : 'warning',
            title: 'Campus eligibility',
            detail: eligibilityReport.notes.join(' '),
            weightImpact: 'Shown separately; never hidden by match score'
          },
          {
            type: targetRoleBonus > 0 ? 'positive' : 'info',
            title: 'Target-role alignment',
            detail: targetRoleBonus > 0 ? 'Target role aligns with this opportunity.' : 'No direct title alignment bonus applied.',
            weightImpact: `${targetRoleBonus} points`
          }
        ]
      },
      eligibility_report: eligibilityReport,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  });

  // Stage 5: Sort by Final Match Score descending
  return results.sort((a, b) => b.final_match_score - a.final_match_score);
}

/**
 * Compiles comprehensive Skill Gap analysis across all recommended jobs
 */
export function generateSkillGapAnalysis(
  student: StudentProfileData | null,
  topRecommendations: RecommendationResult[]
): SkillGapItem[] {
  if (!student) return [];
  const studentSkillsNorm = new Set(student.skills.map(normalizeSkill));
  const skillFrequency: Record<string, { count: number; category: SkillGapItem['category'] }> = {};

  // Skill categorization dictionary
  const getCategory = (skill: string): SkillGapItem['category'] => {
    const s = skill.toLowerCase();
    if (['python', 'c++', 'java', 'c', 'javascript', 'typescript', 'go', 'rust'].some(k => s.includes(k))) return 'Languages';
    if (['machine learning', 'ai', 'nlp', 'scikit-learn', 'deep learning', 'pandas', 'numpy', 'tensorflow', 'pytorch'].some(k => s.includes(k))) return 'AI/ML';
    if (['sql', 'database management', 'nosql', 'mongodb', 'postgresql', 'redis'].some(k => s.includes(k))) return 'Databases';
    if (['html', 'css', 'react.js', 'node.js', 'fastapi', 'spring boot', 'restful apis', 'system design'].some(k => s.includes(k))) return 'Web & Backend';
    return 'DevOps & Tools';
  };

  // Inspect top 10 recommended jobs
  const targetJobs = topRecommendations.slice(0, 10);
  targetJobs.forEach(rec => {
    rec.job.required_skills.forEach(skill => {
      if (!skillFrequency[skill]) {
        skillFrequency[skill] = { count: 0, category: getCategory(skill) };
      }
      skillFrequency[skill].count++;
    });
  });

  const gapItems: SkillGapItem[] = Object.entries(skillFrequency).map(([skill, data]) => {
    const norm = normalizeSkill(skill);
    const isExact = studentSkillsNorm.has(norm);
    const isPartial = !isExact && Array.from(studentSkillsNorm).some(s => s.includes(norm) || norm.includes(s));

    let status: SkillGapItem['status'] = 'missing';
    if (isExact) status = 'matching';
    else if (isPartial) status = 'partial';

    // Priority based on frequency in campus recruiters requirements
    let priority: SkillGapItem['priority'] = 'Medium';
    if (data.count >= 4 && status !== 'matching') priority = 'High';
    else if (data.count <= 2) priority = 'Low';

    const resourcesMap: Record<string, string> = {
      'Docker': 'Coursera: Containers with Docker & Kubernetes',
      'System Design': 'Grokking the System Design Interview & Campus Notes',
      'Data Structures & Algorithms': 'LeetCode 75 & Striver SDE Sheet',
      'Kafka': 'Apache Kafka Quickstart & Distributed Streaming Labs',
      'Computer Networks': 'Kurose & Ross: Top-Down Approach / Gate Smashers',
      'Operating Systems': 'Silberschatz OS Concepts & Unix IPC Labs'
    };

    return {
      skill,
      status,
      priority,
      category: data.category,
      importance_score: Math.min(10, Math.round((data.count / targetJobs.length) * 10)),
      learning_resources: resourcesMap[skill] || `NPTEL / Coursera Certification Module on ${skill}`
    };
  });

  // Sort by priority and importance
  const priorityWeight = { High: 3, Medium: 2, Low: 1 };
  return gapItems.sort((a, b) => {
    if (a.status !== b.status) {
      if (a.status === 'missing') return -1;
      if (b.status === 'missing') return 1;
    }
    return (priorityWeight[b.priority] * b.importance_score) - (priorityWeight[a.priority] * a.importance_score);
  });
}
