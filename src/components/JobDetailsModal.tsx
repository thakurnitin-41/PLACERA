import React, { useState } from 'react';
import { RecommendationResult, StudentProfileData } from '../types';
import { 
  X, 
  Building2, 
  MapPin, 
  GraduationCap, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Sparkles, 
  Award, 
  FolderGit2, 
  Layers, 
  Cpu, 
  Briefcase,
  ExternalLink,
  BookOpen,
  Compass,
  FileCode,
  Zap,
  Target,
  ArrowRight,
  HelpCircle,
  TrendingUp,
  ShieldCheck
  ,ClipboardCheck, ExternalLink as ExternalLinkIcon
} from 'lucide-react';

interface JobDetailsModalProps {
  recommendation: RecommendationResult | null;
  student: StudentProfileData | null;
  onClose: () => void;
  onGoToSkillGap: () => void;
}

export const JobDetailsModal: React.FC<JobDetailsModalProps> = ({
  recommendation,
  student: rawStudent,
  onClose,
  onGoToSkillGap,
}) => {
  const student: StudentProfileData = rawStudent || {
    student_id: 'CANDIDATE-DEFAULT',
    name: 'Candidate',
    rollNumber: '21BCE0000',
    collegeName: 'University Engineering College',
    branch: 'CSE',
    graduationYear: 2025,
    GPA: 8.5,
    tenthPercentage: 88,
    twelfthPercentage: 89,
    activeBacklogs: 0,
    historyOfBacklogs: 0,
    skills: ['Python', 'Machine Learning', 'Data Structures & Algorithms', 'SQL', 'FastAPI'],
    projects: [{ id: '1', title: 'Smart Recommendation Engine', technologies: ['Python', 'FastAPI', 'Scikit-learn'], description: 'ML placement model' }],
    certifications: [{ id: '1', name: 'Azure AI Fundamentals', issuingOrganization: 'Microsoft', issueYear: '2024' }],
    preferred_role: 'AI Engineer',
    preferred_location: 'Bangalore',
    job_type: 'Full-Time',
    experience: '6 months internship experience',
    experienceLevel: 'Entry Level (Fresher)',
  };
  const [activeTab, setActiveTab] = useState<'overview' | 'skills' | 'roadmap'>('overview');
  const [applicationMarked, setApplicationMarked] = useState(false);

  if (!recommendation) return null;

  const { job } = recommendation;
  const isEligible = recommendation.eligibility_report?.overallStatus === 'Eligible'
    || (recommendation.gpa_eligible && recommendation.branch_eligible);

  // Derive human-readable verdict
  const fitTier = recommendation.final_match_score >= 85 
    ? 'High Priority Match' 
    : recommendation.final_match_score >= 70 
    ? 'Moderate Potential Fit' 
    : 'Challenging Match';

  const gpaBuffer = Number((student.GPA - job.minimum_gpa).toFixed(2));
  const profileFields = [student.name, student.collegeName, student.branch, student.GPA, student.skills.length, student.projects.length];
  const profileCompletion = Math.round((profileFields.filter(Boolean).length / profileFields.length) * 100);
  const resumeReady = typeof student.atsResumeScore === 'number' || Boolean(student.uploadedCertificates?.length);
  const deadlineText = job.application_deadline
    ? new Date(job.application_deadline).toLocaleDateString()
    : 'Not listed';
  const markApplied = () => {
    const key = `placera_job_workspace_${student.student_id}`;
    const current = JSON.parse(localStorage.getItem(key) || '{}');
    const applications = Array.isArray(current.applications) ? current.applications : [];
    const next = [...applications.filter((item: { jobId: string }) => item.jobId !== job.job_id), {
      jobId: job.job_id, status: 'Applied', updatedAt: new Date().toISOString()
    }];
    localStorage.setItem(key, JSON.stringify({ ...current, applications: next }));
    setApplicationMarked(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-start justify-between gap-4 bg-slate-50/70">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded">
                Campus Drive Opportunity
              </span>
              {job.category && (
                <span className="text-xs font-semibold text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded">
                  {job.category}
                </span>
              )}
              {job.ctc_range && (
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                  {job.ctc_range}
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">{job.job_title}</h2>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 font-medium">
              <span className="font-bold text-indigo-900 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                {job.company}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {job.location}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                {job.experience_level}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            id="close-job-modal-btn"
            className="text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-100 bg-white text-xs font-semibold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-2.5 px-2 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'overview'
                ? 'border-indigo-600 text-indigo-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Match & Scoring Logic</span>
          </button>
          <button
            onClick={() => setActiveTab('skills')}
            className={`pb-2.5 px-2 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'skills'
                ? 'border-indigo-600 text-indigo-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>Skill Match & Gaps ({recommendation.matching_skills.length}/{job.required_skills.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('roadmap')}
            className={`pb-2.5 px-2 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'roadmap'
                ? 'border-indigo-600 text-indigo-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Interview Prep Roadmap</span>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700">
          <div className="rounded-2xl border border-indigo-200 bg-indigo-50/60 p-4 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2"><ClipboardCheck className="w-4 h-4 text-indigo-600" /> Application Readiness</h3>
              <span className={`font-bold ${isEligible ? 'text-emerald-700' : 'text-amber-700'}`}>{isEligible ? 'Eligible to apply' : 'Review requirements'}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              <span className={`rounded-lg px-2 py-2 ${resumeReady ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>Resume/ATS<br /><b>{resumeReady ? 'Available' : 'Review needed'}</b></span>
              <span className={`rounded-lg px-2 py-2 ${isEligible ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>Eligibility<br /><b>{isEligible ? 'Passed' : 'Check gaps'}</b></span>
              <span className="rounded-lg px-2 py-2 bg-white text-slate-700">Profile<br /><b>{profileCompletion}% complete</b></span>
              <span className="rounded-lg px-2 py-2 bg-white text-slate-700">Skills<br /><b>{recommendation.matching_skills.length} matched</b></span>
              <span className="rounded-lg px-2 py-2 bg-white text-slate-700">Deadline<br /><b>{deadlineText}</b></span>
            </div>
            {!isEligible && (
              <div className="bg-white rounded-xl border border-amber-200 p-3 space-y-1">
                <p className="font-bold text-slate-800">Eligibility explanation</p>
                <p>{recommendation.eligibility_report?.notes.join(' ') || `CGPA ${student.GPA} vs minimum ${job.minimum_gpa}; branch and other criteria should be reviewed.`}</p>
                <p className="text-amber-700">Missing requirements: {recommendation.missing_skills.length ? recommendation.missing_skills.join(', ') : 'See eligibility notes'}</p>
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              <button onClick={markApplied} className="px-3 py-2 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 cursor-pointer">{applicationMarked ? 'Marked Applied' : 'Mark as Applied'}</button>
              {job.application_url ? (
                <a href={job.application_url} target="_blank" rel="noreferrer" className="px-3 py-2 rounded-xl bg-white border border-indigo-200 text-indigo-700 font-bold hover:bg-indigo-100 inline-flex items-center gap-1.5">Continue to Company Application <ExternalLinkIcon className="w-3.5 h-3.5" /></a>
              ) : (
                <span className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-500">Company link not configured for this synthetic listing</span>
              )}
            </div>
            <p className="text-[11px] text-slate-500">PLACERA does not submit applications. Use the external company site, then track your status here.</p>
          </div>
          
          {/* Plain-English Easy-to-Understand Verdict Banner */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="space-y-1">
                <span className="text-[11px] font-mono text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  Plain-Language AI Evaluation
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  Fit Verdict: <span className={recommendation.final_match_score >= 80 ? 'text-emerald-400' : 'text-indigo-300'}>{fitTier}</span>
                </h3>
                <p className="text-xs text-slate-300">
                  {recommendation.final_match_score >= 80
                    ? `Strong profile alignment. Your academic GPA and core skills meet ${job.company}'s initial shortlisting cutoff.`
                    : `Partial alignment. You qualify academically, but need targeted preparation on key missing tech skills.`
                  }
                </p>
              </div>

              {/* Match Score Display */}
              <div className="text-left sm:text-right bg-slate-800/80 border border-slate-700 px-5 py-2.5 rounded-xl shrink-0">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Overall Placement Fit</span>
                <div className="flex items-baseline gap-1">
                  <span className={`text-3xl sm:text-4xl font-black ${
                    recommendation.final_match_score >= 80 ? 'text-emerald-400' : 'text-indigo-400'
                  }`}>
                    {recommendation.final_match_score}%
                  </span>
                </div>
              </div>
            </div>

            {/* Quick 3-Pillar Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-800/60 border border-slate-700/70 p-3 rounded-xl space-y-1">
                <div className="flex items-center justify-between text-slate-300 font-semibold">
                  <span>1. Skill Similarity</span>
                  <span className="font-mono text-indigo-300 font-bold">{recommendation.cosine_similarity_score}%</span>
                </div>
                <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${recommendation.cosine_similarity_score}%` }}></div>
                </div>
                <span className="text-[10px] text-slate-400 block">Resume tokens vs Job text</span>
              </div>

              <div className="bg-slate-800/60 border border-slate-700/70 p-3 rounded-xl space-y-1">
                <div className="flex items-center justify-between text-slate-300 font-semibold">
                  <span>2. Profile Readiness</span>
                  <span className="font-mono text-emerald-300 font-bold">{recommendation.multi_criteria_fit_score}%</span>
                </div>
                <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${recommendation.multi_criteria_fit_score}%` }}></div>
                </div>
                <span className="text-[10px] text-slate-400 block">GPA margin, projects & certs</span>
              </div>

              <div className="bg-slate-800/60 border border-slate-700/70 p-3 rounded-xl space-y-1">
                <div className="flex items-center justify-between text-slate-300 font-semibold">
                  <span>3. Cutoff Safety</span>
                  <span className={`font-mono font-bold ${gpaBuffer >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {gpaBuffer >= 0 ? `+${gpaBuffer} GPA` : `${gpaBuffer} GPA`}
                  </span>
                </div>
                <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${gpaBuffer >= 0 ? 'bg-emerald-500' : 'bg-red-500'}`} style={{ width: `${Math.min(100, Math.max(10, (student.GPA / 10) * 100))}%` }}></div>
                </div>
                <span className="text-[10px] text-slate-400 block">
                  {gpaBuffer >= 0 ? 'Comfortably above cutoff' : 'Below cutoff requirement'}
                </span>
              </div>
            </div>

            {/* Explanation rationale */}
            <div className="bg-indigo-950/50 border border-indigo-800/60 p-3.5 rounded-xl space-y-1">
              <span className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Plain-Language Rationale for Student:
              </span>
              <p className="text-xs text-indigo-100 leading-relaxed">
                {recommendation.recommendation_reason}
              </p>
            </div>
          </div>

          {/* TAB 1: OVERVIEW & SCORING LOGIC */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Academic Eligibility Verification Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                    Academic CGPA
                  </span>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Company Cutoff:</span>
                      <span className="font-bold text-slate-900">{job.minimum_gpa} / 10.0</span>
                    </div>

                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2 sm:col-span-3">
                      <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                        Strict campus eligibility verdict
                      </span>
                      <p className={`font-bold ${isEligible ? 'text-emerald-700' : 'text-red-600'}`}>
                        {isEligible ? 'Eligible for this configured drive' : `Not eligible: ${recommendation.eligibility_report?.notes.join(' ') || 'one or more hard criteria failed.'}`}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Your CGPA:</span>
                      <span className={`font-bold ${recommendation.gpa_eligible ? 'text-emerald-700' : 'text-red-600'}`}>
                        {student.GPA} / 10.0 {recommendation.gpa_eligible ? '✓ (Eligible)' : '✕ (Below Cutoff)'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                    Branch Eligibility
                  </span>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Allowed:</span>
                      <span className="font-bold text-slate-900">{job.eligible_branches.join(', ')}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Your Branch:</span>
                      <span className={`font-bold ${recommendation.branch_eligible ? 'text-emerald-700' : 'text-red-600'}`}>
                        {student.branch} {recommendation.branch_eligible ? '✓ (Eligible)' : '✕ (Restricted)'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                    Backlog & Profile Cleanliness
                  </span>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Active Backlogs:</span>
                      <span className={`font-bold ${(!student.activeBacklogs || student.activeBacklogs === 0) ? 'text-emerald-700' : 'text-amber-600'}`}>
                        {student.activeBacklogs || 0} {(!student.activeBacklogs || student.activeBacklogs === 0) ? '✓ (Zero Backlogs)' : '⚠️ Action Req.'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">10th / 12th Marks:</span>
                      <span className="font-bold text-slate-900">
                        {student.tenthPercentage}% / {student.twelfthPercentage}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* How PLACERA Calculated This Match (Easy Explanation) */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-indigo-600" />
                  <span>How PLACERA Calculated This Score (Transparent Math)</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-800">Part A: TF-IDF Text Cosine Similarity (60% Weight)</span>
                    <p className="text-slate-600 leading-relaxed">
                      PLACERA tokenized your profile's listed skills, project descriptions, and certifications, then computed high-dimensional cosine angle against {job.company}'s job posting requirements. Text match yielded <strong>{recommendation.cosine_similarity_score}%</strong>.
                    </p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-800">Part B: Deterministic profile fit (35% Weight)</span>
                    <p className="text-slate-600 leading-relaxed">
                      Structured features are scored with explicit weighted rules: your CGPA safety buffer (+{gpaBuffer}), backlog status, relevant projects, certifications, and branch qualification. This reproducible criteria score is <strong>{recommendation.multi_criteria_fit_score}%</strong>.
                    </p>
                  </div>
                </div>
              </div>

              {/* Job Description & Details */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Role Overview & Responsibilities
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  {job.description}
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: SKILL MATCH & GAPS */}
          {activeTab === 'skills' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Matching Skills */}
                <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-900 flex items-center gap-1.5 text-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Skills You Already Have ({recommendation.matching_skills.length})
                    </span>
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                      Verified from Profile
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-700">
                    These skills give you an immediate competitive advantage for this position:
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {recommendation.matching_skills.length > 0 ? (
                      recommendation.matching_skills.map(skill => (
                        <span key={skill} className="px-2.5 py-1 text-xs font-semibold bg-white text-emerald-800 border border-emerald-200 rounded-md shadow-2xs">
                          {skill} ✓
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-400 italic">No direct keyword overlap</span>
                    )}
                  </div>
                </div>

                {/* Missing Skills */}
                <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-900 flex items-center gap-1.5 text-xs">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      Missing / Desired Skills ({recommendation.missing_skills.length})
                    </span>
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                      Interview Focus
                    </span>
                  </div>
                  <p className="text-[11px] text-amber-700">
                    The recruiter requires these skills. Learning them increases your selection probability:
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {recommendation.missing_skills.length > 0 ? (
                      recommendation.missing_skills.map(skill => (
                        <span key={skill} className="px-2.5 py-1 text-xs font-semibold bg-white text-slate-800 border border-amber-200 rounded-md shadow-2xs flex items-center gap-1">
                          <span className="text-amber-500 font-bold">!</span>
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-emerald-700 font-semibold">100% of required skills matched!</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Student Projects & Certifications That Aided This Recommendation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                    <FolderGit2 className="w-4 h-4 text-indigo-600" />
                    Relevant Projects in Your Portfolio
                  </span>
                  <p className="text-[11px] text-slate-500">
                    Highlighted during TF-IDF vectorization as high-relevance experience:
                  </p>
                  <ul className="space-y-1.5 text-slate-700 list-disc list-inside pt-1">
                    {recommendation.relevant_projects.map((proj, idx) => (
                      <li key={idx} className="font-medium bg-slate-50 p-2 rounded-lg border border-slate-100">{proj}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                    <Award className="w-4 h-4 text-indigo-600" />
                    Certifications Boosting Your Score
                  </span>
                  <p className="text-[11px] text-slate-500">
                    Profile evidence that strengthened your criteria fit score:
                  </p>
                  <ul className="space-y-1.5 text-slate-700 list-disc list-inside pt-1">
                    {recommendation.relevant_certifications.map((cert, idx) => (
                      <li key={idx} className="font-medium bg-slate-50 p-2 rounded-lg border border-slate-100">{cert}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: INTERVIEW PREPARATION ROADMAP */}
          {activeTab === 'roadmap' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="bg-indigo-50/50 border border-indigo-200 rounded-2xl p-5 space-y-4">
                <h4 className="text-sm font-bold text-indigo-950 flex items-center gap-2">
                  <Compass className="w-4 h-4 text-indigo-600" />
                  <span>3-Step Targeted Preparation Plan for {job.company}</span>
                </h4>
                <p className="text-xs text-indigo-800 leading-relaxed">
                  Based on PLACERA's skill gap extraction, complete these high-yield actions to maximize your campus placement clearance:
                </p>

                <div className="space-y-3 pt-1">
                  <div className="bg-white p-4 rounded-xl border border-indigo-100 shadow-xs flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      1
                    </div>
                    <div className="space-y-1">
                      <h5 className="font-bold text-slate-900">Bridge Priority Skill Gaps</h5>
                      <p className="text-xs text-slate-600">
                        Spend 5–7 days reviewing <strong>{recommendation.missing_skills.slice(0, 2).join(' and ') || 'System Design & DSA'}</strong>. Focus on standard LeetCode mediums and system architecture patterns.
                      </p>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-indigo-100 shadow-xs flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      2
                    </div>
                    <div className="space-y-1">
                      <h5 className="font-bold text-slate-900">Prepare Project Deep-Dive Defense</h5>
                      <p className="text-xs text-slate-600">
                        Interviewers at {job.company} will review your project <em>"{recommendation.relevant_projects[0] || 'Machine Learning Capstone'}"</em>. Prepare 2-minute elevator pitch detailing architecture, latency, and database scaling.
                      </p>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-indigo-100 shadow-xs flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      3
                    </div>
                    <div className="space-y-1">
                      <h5 className="font-bold text-slate-900">Review Company Placement Syllabus</h5>
                      <p className="text-xs text-slate-600">
                        Check company-specific past papers for {job.company}. Role requires proficiency in {job.required_skills.slice(0, 3).join(', ')}.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={() => {
              onClose();
              onGoToSkillGap();
            }}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5 cursor-pointer"
          >
            <Layers className="w-4 h-4" />
            <span>Open Dedicated Skill Gap Explorer for this Job</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer shadow-xs"
          >
            Close Analysis
          </button>
        </div>
      </div>
    </div>
  );
};
