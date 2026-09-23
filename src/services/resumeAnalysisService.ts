import { ATSResumeAnalysis, TargetRole } from '../types';
import { normalizeSkill } from './recommendationEngine';
import { getTargetRoleInfo } from '../data/targetRoles';

const ACTION_VERBS = new Set([
  'architected', 'accelerated', 'built', 'configured', 'constructed', 'created',
  'debugged', 'deployed', 'designed', 'developed', 'engineered', 'enhanced',
  'established', 'executed', 'implemented', 'improved', 'increased', 'integrated',
  'launched', 'led', 'maximized', 'mentored', 'modeled', 'optimized', 'orchestrated',
  'refactored', 'reduced', 'resolved', 'scaled', 'spearheaded', 'streamlined', 'trained'
]);

const HIGH_DEMAND_TECHNICAL_SKILLS = [
  'Python', 'C++', 'Java', 'JavaScript', 'TypeScript', 'Go', 'Rust', 'SQL',
  'Data Structures & Algorithms', 'System Design', 'Operating Systems', 'Computer Networks',
  'React.js', 'Node.js', 'Next.js', 'FastAPI', 'Spring Boot', 'Express', 'Django',
  'Machine Learning', 'Deep Learning', 'PyTorch', 'TensorFlow', 'NLP', 'Computer Vision',
  'Scikit-learn', 'Pandas', 'NumPy', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP',
  'Kafka', 'Redis', 'PostgreSQL', 'MongoDB', 'Git', 'Linux', 'CI/CD Pipelines'
];

/**
 * Analyzes resume text against standard ATS guidelines and target role expectations.
 * Runs completely client-side with zero external API calls or secret exposures.
 */
export function analyzeResumeText(
  resumeText: string,
  targetRoleTitle?: TargetRole | string
): ATSResumeAnalysis {
  if (!resumeText || resumeText.trim().length === 0) {
    return {
      atsScore: 35,
      readinessGrade: 'Critical Gaps',
      foundSkills: [],
      missingKeySkills: ['Python', 'SQL', 'Data Structures & Algorithms', 'Git'],
      metricsDetectedCount: 0,
      actionVerbsCount: 0,
      wordCount: 0,
      sectionScores: {
        skillsMatch: 20,
        experienceImpact: 15,
        projectRelevance: 20,
        formattingStructure: 40
      },
      suggestions: [
        'Paste or upload your complete resume text to run comprehensive ATS evaluation.',
        'Include a dedicated Skills section with programming languages, frameworks, and tools.',
        'List 2-3 technical projects with links, technologies used, and outcomes.'
      ]
    };
  }

  const cleanText = resumeText.toLowerCase();
  const words = cleanText.split(/[\s,./;:()]+/).filter(w => w.length > 1);
  const wordCount = words.length;

  // 1. Technical Skills Extraction
  const foundSkillsSet = new Set<string>();
  HIGH_DEMAND_TECHNICAL_SKILLS.forEach(skill => {
    const norm = normalizeSkill(skill);
    // Check if skill exists in text
    if (cleanText.includes(skill.toLowerCase()) || cleanText.includes(norm)) {
      foundSkillsSet.add(skill);
    }
  });

  const foundSkills = Array.from(foundSkillsSet);

  // Target role comparison
  const roleInfo = getTargetRoleInfo(targetRoleTitle || 'Software Development Engineer (SDE-1)');
  const roleCoreSkills = roleInfo?.coreSkills || ['Data Structures & Algorithms', 'Python', 'SQL', 'System Design'];
  
  const missingKeySkills = roleCoreSkills.filter(req => {
    const reqNorm = normalizeSkill(req);
    return !foundSkills.some(f => normalizeSkill(f) === reqNorm || reqNorm.includes(normalizeSkill(f)));
  });

  // 2. Action Verbs Count
  let actionVerbsCount = 0;
  words.forEach(w => {
    if (ACTION_VERBS.has(w)) actionVerbsCount++;
  });

  // 3. Quantifiable Impact & Metrics Detection
  // Matches patterns like "40%", "$10k", "500ms", "10,000 users", "3x", "99.9%"
  const metricsRegex = /\b(\d+([.,]\d+)?\s*(%|x|ms|s|k|users|requests|tps|lpa|stars)?)\b/gi;
  const metricsMatches = resumeText.match(metricsRegex) || [];
  const metricsDetectedCount = Math.min(20, metricsMatches.filter(m => /\d/.test(m) && m.length < 15).length);

  // 4. Section Structure Checks
  const hasSkillsHeader = /skills|technical proficiencies|technologies/i.test(resumeText);
  const hasProjectsHeader = /projects|academic projects|capstone/i.test(resumeText);
  const hasEducationHeader = /education|academics|degree|b\.tech|university|cgpa/i.test(resumeText);
  const hasExperienceHeader = /experience|internship|work history|employment/i.test(resumeText);

  // 5. Component Scores Calculation
  // A. Skills Match (0-30 pts)
  const skillsRatio = Math.min(1, foundSkills.length / Math.max(5, roleCoreSkills.length));
  const skillsScore = Math.round(skillsRatio * 30);

  // B. Experience & Quantifiable Impact (0-25 pts)
  let impactScore = 10;
  impactScore += Math.min(8, actionVerbsCount * 1.5);
  impactScore += Math.min(7, metricsDetectedCount * 1.5);
  impactScore = Math.min(25, Math.round(impactScore));

  // C. Project Relevance (0-25 pts)
  let projScore = hasProjectsHeader ? 15 : 6;
  if (foundSkills.length >= 6) projScore += 5;
  if (wordCount >= 250) projScore += 5;
  projScore = Math.min(25, projScore);

  // D. Formatting & Structure (0-20 pts)
  let formatScore = 8;
  if (hasSkillsHeader) formatScore += 3;
  if (hasProjectsHeader) formatScore += 3;
  if (hasEducationHeader) formatScore += 3;
  if (hasExperienceHeader) formatScore += 3;
  formatScore = Math.min(20, formatScore);

  // Total ATS Score (0 - 100)
  const rawTotal = skillsScore + impactScore + projScore + formatScore;
  const atsScore = Math.min(98, Math.max(30, rawTotal));

  let readinessGrade: ATSResumeAnalysis['readinessGrade'] = 'Needs Improvement';
  if (atsScore >= 85) readinessGrade = 'Elite';
  else if (atsScore >= 70) readinessGrade = 'Competitive';
  else if (atsScore <= 45) readinessGrade = 'Critical Gaps';

  // 6. Actionable Suggestions Generation
  const suggestions: string[] = [];
  if (metricsDetectedCount < 3) {
    suggestions.push('Add quantifiable business metrics to project bullets (e.g., "Reduced response latency by 35% on 5,000 daily requests").');
  }
  if (missingKeySkills.length > 0) {
    suggestions.push(`Integrate high-frequency target keywords for ${roleInfo?.title || 'your role'}: ${missingKeySkills.slice(0, 4).join(', ')}.`);
  }
  if (actionVerbsCount < 4) {
    suggestions.push('Begin project bullet points with strong technical action verbs (e.g. "Architected", "Engineered", "Optimized", "Refactored").');
  }
  if (!hasProjectsHeader) {
    suggestions.push('Include a clearly labeled "Projects" section highlighting tech stacks, problem statements, and outcomes.');
  }
  if (wordCount < 200) {
    suggestions.push('Resume length is too brief for ATS parsers; provide more context on project architectures and responsibilities.');
  }
  if (suggestions.length === 0) {
    suggestions.push('Excellent ATS resume profile! Ensure links to GitHub repositories and live deployments are active.');
  }

  return {
    atsScore,
    readinessGrade,
    foundSkills,
    missingKeySkills,
    metricsDetectedCount,
    actionVerbsCount,
    wordCount,
    sectionScores: {
      skillsMatch: Math.round((skillsScore / 30) * 100),
      experienceImpact: Math.round((impactScore / 25) * 100),
      projectRelevance: Math.round((projScore / 25) * 100),
      formattingStructure: Math.round((formatScore / 20) * 100)
    },
    suggestions
  };
}
