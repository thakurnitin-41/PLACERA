import React, { useState, useMemo } from 'react';
import { JobPosting, StudentProfileData, RecommendationResult } from '../types';
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
} from 'lucide-react';

interface JobsDirectoryProps {
  jobs: JobPosting[];
  student?: StudentProfileData | null;
  onSelectJob: (job: JobPosting) => void;
  onRunAIMatch?: () => void;
  onOpenAuthModal?: (mode?: 'login' | 'register') => void;
  onBack?: () => void;
}

export const JobsDirectory: React.FC<JobsDirectoryProps> = ({
  jobs,
  student,
  onSelectJob,
  onRunAIMatch,
  onOpenAuthModal,
  onBack,
}) => {
  const [search, setSearch] = useState('');
  const [branchFilter, setBranchFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [cityFilter, setCityFilter] = useState('all');

  const normalizeCity = (value: string) => value.trim().toLowerCase().replace(/\s+/g, ' ');
  const splitCities = (value: string) => value
    .split(/\s*\/\s*|\s*,\s*|\s*\|\s*/)
    .map(city => city.replace(/\([^)]*\)/g, '').trim())
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
      if (search) {
        const text = `${j.company} ${j.job_title} ${j.location} ${j.description} ${j.required_skills.join(' ')}`.toLowerCase();
        if (!text.includes(search.toLowerCase())) return false;
      }
      if (cityFilter !== 'all' && !splitCities(j.location).some(city => normalizeCity(city) === normalizeCity(cityFilter))) {
        return false;
      }
      if (branchFilter !== 'all' && !j.eligible_branches.includes(branchFilter as any)) {
        return false;
      }
      if (categoryFilter !== 'all' && j.category !== categoryFilter) {
        return false;
      }
      return true;
    });
  }, [jobs, search, branchFilter, categoryFilter, cityFilter]);

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
        </div>
      </div>

      {/* Grid of Job Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((job) => {
          const isGpaEligible = student ? student.GPA >= job.minimum_gpa : true;
          const isBranchEligible = student ? job.eligible_branches.includes(student.branch) : true;

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

                <button
                  onClick={() => onSelectJob(job)}
                  className="px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-600 hover:text-white rounded-xl transition-colors cursor-pointer flex items-center gap-1"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
