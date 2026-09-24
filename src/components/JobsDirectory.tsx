import React, { useState, useMemo } from 'react';
import { JobPosting, StudentProfileData, RecommendationResult, ApplicationRecord, ApplicationStatus } from '../types';
import { 
  Building2, 
  Search, 
  MapPin, 
  Filter, 
  Briefcase, 
  GraduationCap, 
  Sparkles,
  ArrowRight,
  ArrowLeft
  ,Bookmark, BookmarkCheck, GitCompareArrows, Clock3, ExternalLink, ClipboardList
} from 'lucide-react';

interface JobsDirectoryProps {
  jobs: JobPosting[];
  student?: StudentProfileData | null;
  recommendations?: RecommendationResult[];
  onSelectJob: (job: JobPosting) => void;
  onRunAIMatch?: () => void;
  onOpenAuthModal?: (mode?: 'login' | 'register') => void;
  onBack?: () => void;
}

export const JobsDirectory: React.FC<JobsDirectoryProps> = ({
  jobs,
  student,
  recommendations = [],
  onSelectJob,
  onRunAIMatch,
  onOpenAuthModal,
  onBack,
}) => {
  const [search, setSearch] = useState('');
  const [branchFilter, setBranchFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [cityFilter, setCityFilter] = useState('all');
  const [deadlineSort, setDeadlineSort] = useState<'none' | 'soonest'>('none');
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [showApplications, setShowApplications] = useState(false);
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);
  const [applications, setApplications] = useState<ApplicationRecord[]>([]);

  const storageKey = student ? `placera_job_workspace_${student.student_id}` : '';
  React.useEffect(() => {
    if (!storageKey) {
      setSavedJobIds([]);
      setApplications([]);
      return;
    }
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
      setSavedJobIds(Array.isArray(saved.savedJobIds) ? saved.savedJobIds : []);
      setApplications(Array.isArray(saved.applications) ? saved.applications : []);
    } catch {
      setSavedJobIds([]);
      setApplications([]);
    }
  }, [storageKey]);

  const persistWorkspace = (nextSaved: string[], nextApplications: ApplicationRecord[]) => {
    if (!storageKey) return;
    localStorage.setItem(storageKey, JSON.stringify({ savedJobIds: nextSaved, applications: nextApplications }));
  };

  const updateApplication = (jobId: string, status: ApplicationStatus) => {
    const next = [...applications.filter(app => app.jobId !== jobId), { jobId, status, updatedAt: new Date().toISOString() }];
    setApplications(next);
    persistWorkspace(savedJobIds, next);
  };

  const normalizeCity = (value: string) => value
    .replace(/\([^)]*\)/g, ' ')
    .replace(/[.&'-]/g, ' ')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
  const splitCities = (value: string) => value
    .split(/\s*\/\s*|\s*,\s*|\s*\|\s*|\s*;\s*/)
    .map(normalizeCity)
    .filter(Boolean);

  const cityOptions = useMemo(() => {
    const values = jobs.flatMap(job => splitCities(job.location));
    if (student?.preferred_location) {
      values.push(...splitCities(student.preferred_location));
    }
    return Array.from(new Map(values.map(city => [normalizeCity(city), city])).values())
      .sort((a, b) => a.localeCompare(b));
  }, [jobs, student?.preferred_location]);

  const filtered = useMemo(() => {
    return jobs.filter(j => {
      if (showSavedOnly && !savedJobIds.includes(j.job_id)) return false;
      if (search) {
        const text = `${j.company} ${j.job_title} ${j.location} ${j.description} ${j.required_skills.join(' ')}`.toLowerCase();
        if (!text.includes(search.toLowerCase())) return false;
      }
      if (branchFilter !== 'all' && !j.eligible_branches.includes(branchFilter as any)) {
        return false;
      }
      if (categoryFilter !== 'all' && j.category !== categoryFilter) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (deadlineSort === 'soonest') {
        return new Date(a.application_deadline || '2999-12-31').getTime() - new Date(b.application_deadline || '2999-12-31').getTime();
      }
      if (cityFilter === 'all') return 0;
      const preferred = normalizeCity(cityFilter);
      const aMatches = splitCities(a.location).some(city => city === preferred || city.includes(preferred) || preferred.includes(city));
      const bMatches = splitCities(b.location).some(city => city === preferred || city.includes(preferred) || preferred.includes(city));
      return Number(bMatches) - Number(aMatches);
    });
  }, [jobs, search, branchFilter, categoryFilter, cityFilter, deadlineSort, showSavedOnly, savedJobIds]);

  const comparisonJobs = jobs.filter(job => selectedForCompare.includes(job.job_id));
  const recommendedJobs = recommendations.slice(0, 3);
  const getDaysLeft = (deadline?: string) => {
    if (!deadline) return null;
    return Math.ceil((new Date(deadline).getTime() - Date.now()) / 86400000);
  };
  const toggleSaved = (jobId: string) => {
    const next = savedJobIds.includes(jobId)
      ? savedJobIds.filter(id => id !== jobId)
      : [...savedJobIds, jobId];
    setSavedJobIds(next);
    persistWorkspace(next, applications);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Top Page Navigation Bar with Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack || (() => window.history.back())}
          id="jobs-back-btn"
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-xs transition-all hover:border-slate-300 cursor-pointer active:scale-95"
        >
          <ArrowLeft className="w-4 h-4 text-indigo-600" />
          <span>Back to Previous Page</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>Campus Drives</span>
          <span>/</span>
          <span className="font-semibold text-slate-900">Active Placement Opportunities</span>
        </div>
      </div>

      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full mb-2">
            <Building2 className="w-3.5 h-3.5" />
            <span>Synthetic Campus Recruitment Pool</span>
          </div>

          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Campus Placement Opportunities <span className="text-[10px] font-semibold text-amber-700">(demo data)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Browse synthetic recruiter postings from Tier 1 Dream, Tier 2, and Core engineering companies. Verify any real-world opening independently.
          </p>
        </div>

        <div className="text-xs text-slate-600 bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl">
          <span className="font-bold text-indigo-600">{jobs.length} Recruiter Openings</span>
        </div>
      </div>

      {student && (
        <div className="flex flex-wrap gap-2">
          <button onClick={() => { setShowSavedOnly(false); setShowApplications(false); }} className={`px-3 py-2 rounded-xl text-xs font-semibold border ${!showSavedOnly && !showApplications ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-700 border-slate-200'}`}>All Opportunities ({jobs.length})</button>
          <button onClick={() => { setShowSavedOnly(true); setShowApplications(false); }} className={`px-3 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 ${showSavedOnly ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-700 border-slate-200'}`}><BookmarkCheck className="w-3.5 h-3.5" /> Saved Jobs ({savedJobIds.length})</button>
          <button onClick={() => { setShowApplications(true); setShowSavedOnly(false); }} className={`px-3 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 ${showApplications ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-700 border-slate-200'}`}><ClipboardList className="w-3.5 h-3.5" /> My Applications ({applications.length})</button>
        </div>
      )}

      {student && !showSavedOnly && !showApplications && recommendedJobs.length > 0 && (
        <section className="bg-indigo-50/70 border border-indigo-200 rounded-2xl p-4 space-y-3">
          <div><h2 className="text-base font-bold text-slate-900">Recommended for You</h2><p className="text-xs text-slate-600 mt-0.5">Personalized using your profile, target role, skills, eligibility, and existing AI Match Score.</p></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {recommendedJobs.map(rec => <button key={rec.job.job_id} onClick={() => onSelectJob(rec.job)} className="text-left bg-white border border-indigo-100 rounded-xl p-3 hover:border-indigo-400 transition-colors cursor-pointer"><p className="text-xs font-bold text-slate-900">{rec.job.job_title}</p><p className="text-[11px] text-slate-600">{rec.job.company} · {rec.job.location}</p><span className="inline-block mt-2 text-[11px] font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded">AI Match {rec.final_match_score}%</span></button>)}
          </div>
        </section>
      )}

      {comparisonJobs.length > 0 && (
        <div className="bg-slate-900 text-white rounded-2xl p-4 overflow-x-auto">
          <div className="flex items-center justify-between gap-3 mb-3"><h2 className="text-sm font-bold flex items-center gap-2"><GitCompareArrows className="w-4 h-4 text-indigo-300" /> Compare Selected ({comparisonJobs.length}/3)</h2><button onClick={() => setSelectedForCompare([])} className="text-xs text-slate-300 hover:text-white">Clear</button></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 min-w-[680px]">
            {comparisonJobs.map(job => { const rec = recommendations.find(item => item.job.job_id === job.job_id); const missing = rec?.missing_skills || job.required_skills; return <div key={job.job_id} className="bg-slate-800 rounded-xl p-3 text-xs space-y-1.5"><p className="font-bold text-white">{job.job_title}</p><p className="text-indigo-200">{job.company}</p><p>Location: {job.location}</p><p>Mode: {job.work_mode || 'On-site'}</p><p>Salary: {job.ctc_range || 'Not listed'}</p><p>Eligibility: {rec?.eligibility_report?.overallStatus || 'Review profile'}</p><p>Match: {rec ? `${rec.final_match_score}%` : '—'}</p><p className="text-amber-300">Missing: {missing.length ? missing.slice(0, 3).join(', ') : 'None'}</p><p>Deadline: {job.application_deadline || 'Not listed'}</p></div>; })}
          </div>
        </div>
      )}

      {/* AI Match Search Call-to-Action */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-2xl p-5 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-300 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Intelligent Job Matching</span>
          </div>
          <h2 className="text-base sm:text-lg font-extrabold text-white">
            {student ? `Match ${jobs.length} Openings Against ${student.name}'s Profile` : `Search & Rank All ${jobs.length} Opportunities with AI`}
          </h2>
          <p className="text-xs text-indigo-200 max-w-2xl">
            {student 
              ? `Evaluate your ${student.skills.length} listed skills, ${student.GPA} CGPA, and branch eligibility using TF-IDF cosine similarity and deterministic criteria.`
              : 'Sign in or create your student profile to automatically compute personalized match scores, identify missing skills, and rank jobs.'}
          </p>
        </div>

        <div className="shrink-0">
          {student ? (
            <button
              onClick={onRunAIMatch}
              id="job-directory-run-ai-btn"
              className="w-full sm:w-auto px-5 py-3 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>⚡ Run AI Match for My Profile</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => onOpenAuthModal ? onOpenAuthModal('register') : null}
              id="job-directory-create-and-match-btn"
              className="w-full sm:w-auto px-5 py-3 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>⚡ Create Profile & Run AI Match</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search company, skills (e.g., Python, AWS, React, C++)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white text-slate-700"
          >
            <option value="all">All Job Cities</option>
            {cityOptions.map(city => (
              <option key={normalizeCity(city)} value={city}>{city}</option>
            ))}
          </select>

          <select
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
            className="px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white text-slate-700"
          >
            <option value="all">All Eligible Branches</option>
            <option value="CSE">CSE</option>
            <option value="AI & DS">AI & DS</option>
            <option value="IT">IT</option>
            <option value="ECE">ECE</option>
            <option value="EEE">EEE</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white text-slate-700"
          >
            <option value="all">All Placement Tiers</option>
            <option value="Tier 1 (Dream)">Tier 1 (Dream)</option>
            <option value="Tier 2">Tier 2</option>
            <option value="Core IT">Core IT</option>
          </select>
          <select
            value={deadlineSort}
            onChange={(e) => setDeadlineSort(e.target.value as 'none' | 'soonest')}
            className="px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white text-slate-700"
          >
            <option value="none">Default Job Order</option>
            <option value="soonest">Deadline: Soonest First</option>
          </select>
        </div>
      </div>

      {/* Grid of Job Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(showApplications ? jobs.filter(job => applications.some(app => app.jobId === job.job_id)) : filtered).map((job) => {
          const isGpaEligible = student ? student.GPA >= job.minimum_gpa : true;
          const isBranchEligible = student ? job.eligible_branches.includes(student.branch) : true;
          const rec = recommendations.find(item => item.job.job_id === job.job_id);
          const application = applications.find(app => app.jobId === job.job_id);
          const isSaved = savedJobIds.includes(job.job_id);
          const daysLeft = getDaysLeft(job.application_deadline);

          return (
            <div
              key={job.job_id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-indigo-300 transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {job.job_title}
                    </h3>
                    <p className="text-xs font-semibold text-slate-700 flex items-center gap-1 mt-0.5">
                      <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                      {job.company}
                    </p>
                  </div>
                  {job.ctc_range && (
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 whitespace-nowrap">
                      {job.ctc_range}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2 text-[11px]">
                  {rec && <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">AI Match {rec.final_match_score}%</span>}
                  <span className={`${daysLeft !== null && daysLeft <= 3 ? 'text-red-600 font-bold' : 'text-slate-500'} flex items-center gap-1`}><Clock3 className="w-3 h-3" /> {daysLeft !== null ? (daysLeft <= 0 ? 'Closing soon' : `${daysLeft} days left`) : 'Deadline not listed'}</span>
                  {application && <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">{application.status}</span>}
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {job.description}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {job.required_skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-0.5 text-[11px] font-medium bg-slate-100 text-slate-700 rounded"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                  <span>Min GPA: <strong className="text-slate-800">{job.minimum_gpa}</strong></span>
                  <span>•</span>
                  <span>{job.location}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {student && application && <select
                    value={application.status}
                    onChange={(e) => updateApplication(job.job_id, e.target.value as ApplicationStatus)}
                    className="px-2 py-1.5 text-[11px] border border-slate-200 rounded-lg bg-white text-slate-700"
                    aria-label={`Update application status for ${job.job_title}`}
                  >
                    {(['Saved', 'Applied', 'Assessment', 'Interview', 'Offer', 'Rejected'] as ApplicationStatus[]).map(status => <option key={status} value={status}>{status}</option>)}
                  </select>}
                  {student && <button onClick={() => toggleSaved(job.job_id)} title={isSaved ? 'Remove from saved jobs' : 'Save job'} className="p-1.5 rounded-lg text-indigo-600 hover:bg-indigo-50 cursor-pointer">{isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}</button>}
                  {student && <button
                    onClick={() => setSelectedForCompare(current => current.includes(job.job_id) ? current.filter(id => id !== job.job_id) : current.length < 3 ? [...current, job.job_id] : current)}
                    title="Select for comparison"
                    className={`p-1.5 rounded-lg cursor-pointer ${selectedForCompare.includes(job.job_id) ? 'text-white bg-indigo-600' : 'text-indigo-600 hover:bg-indigo-50'}`}
                  ><GitCompareArrows className="w-4 h-4" /></button>}
                  <button onClick={() => onSelectJob(job)} className="px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-600 hover:text-white rounded-xl transition-colors cursor-pointer flex items-center gap-1">
                    <span>View Details</span><ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
