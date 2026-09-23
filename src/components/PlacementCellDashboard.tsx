import React, { useState, useMemo } from 'react';
import { JobPosting, Branch } from '../types';
import { MOCK_PLACEMENT_STUDENTS, PlacementCellStudent } from '../data/mockStudents';
import { 
  Building2, 
  Users, 
  Briefcase, 
  TrendingUp, 
  Search, 
  Plus, 
  Filter, 
  CheckCircle2, 
  Trash2, 
  Edit3, 
  GraduationCap, 
  Award, 
  SlidersHorizontal,
  Download,
  AlertCircle,
  Sparkles,
  Layers,
  X,
  ArrowLeft
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

interface PlacementCellDashboardProps {
  jobs: JobPosting[];
  onAddJob: (job: JobPosting) => void;
  onDeleteJob: (jobId: string) => void;
  onBack?: () => void;
}

export const PlacementCellDashboard: React.FC<PlacementCellDashboardProps> = ({
  jobs,
  onAddJob,
  onDeleteJob,
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState<'students' | 'jobs' | 'analytics'>('students');
  const [studentSearch, setStudentSearch] = useState('');
  const [branchFilter, setBranchFilter] = useState('all');
  const [minGpaFilter, setMinGpaFilter] = useState(0);
  const [skillFilter, setSkillFilter] = useState('');
  const [showAddJobModal, setShowAddJobModal] = useState(false);

  // New Job Form State
  const [newJob, setNewJob] = useState<Partial<JobPosting>>({
    company: '',
    job_title: '',
    description: '',
    required_skills: [],
    preferred_skills: [],
    minimum_gpa: 7.0,
    eligible_branches: ['CSE', 'AI & DS', 'IT'],
    location: 'Bangalore',
    experience_level: 'Entry Level (Fresher)',
    job_type: 'Full-Time',
    ctc_range: '₹8 - 12 LPA',
    category: 'Tier 2'
  });
  const [newReqSkillsInput, setNewReqSkillsInput] = useState('Python, SQL, Data Structures');

  // Metrics
  const totalStudents = 540; // Academic simulated batch
  const totalJobs = jobs.length + 300; // Mock database scale (320+)
  const avgCampusMatch = 78.4;
  const placementRate = 84.6; // %

  // Filtered Students
  const filteredStudents = useMemo(() => {
    return MOCK_PLACEMENT_STUDENTS.filter(s => {
      if (studentSearch) {
        const text = `${s.name} ${s.branch} ${s.topMatchRole} ${s.topMatchCompany}`.toLowerCase();
        if (!text.includes(studentSearch.toLowerCase())) return false;
      }
      if (branchFilter !== 'all' && s.branch !== branchFilter) return false;
      if (s.gpa < minGpaFilter) return false;
      if (skillFilter && !s.skills.some(sk => sk.toLowerCase().includes(skillFilter.toLowerCase()))) {
        return false;
      }
      return true;
    });
  }, [studentSearch, branchFilter, minGpaFilter, skillFilter]);

  // Skill Demand Distribution across campus jobs
  const skillDemandData = useMemo(() => {
    const counts: Record<string, number> = {};
    jobs.forEach(j => {
      j.required_skills.forEach(skill => {
        counts[skill] = (counts[skill] || 0) + 1;
      });
    });
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 7);
  }, [jobs]);

  // Branch eligibility breakdown
  const branchEligibilityData = [
    { name: 'CSE', value: 42, color: '#4f46e5' },
    { name: 'AI & DS', value: 28, color: '#06b6d4' },
    { name: 'IT', value: 18, color: '#10b981' },
    { name: 'ECE', value: 12, color: '#f59e0b' },
  ];

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJob.company || !newJob.job_title) return;

    const jobToAdd: JobPosting = {
      job_id: `JOB-${Date.now()}`,
      company: newJob.company,
      job_title: newJob.job_title,
      description: newJob.description || 'Campus recruitment opening for upcoming graduate batch.',
      required_skills: newReqSkillsInput.split(',').map(s => s.trim()).filter(Boolean),
      preferred_skills: ['Git', 'Communication Skills'],
      minimum_gpa: newJob.minimum_gpa || 7.0,
      eligible_branches: (newJob.eligible_branches as Branch[]) || ['CSE', 'AI & DS'],
      location: newJob.location || 'Bangalore',
      experience_level: newJob.experience_level || 'Entry Level (Fresher)',
      job_type: newJob.job_type || 'Full-Time',
      ctc_range: newJob.ctc_range || '₹8 - 12 LPA',
      category: newJob.category || 'Tier 2'
    };

    onAddJob(jobToAdd);
    setShowAddJobModal(false);
    // Reset form
    setNewJob({
      company: '',
      job_title: '',
      description: '',
      required_skills: [],
      minimum_gpa: 7.0,
      eligible_branches: ['CSE', 'AI & DS', 'IT'],
      location: 'Bangalore',
      experience_level: 'Entry Level (Fresher)',
      job_type: 'Full-Time',
      ctc_range: '₹8 - 12 LPA',
      category: 'Tier 2'
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16">
      {/* Top Page Navigation Bar with Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack || (() => window.history.back())}
          id="placement-cell-back-btn"
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-xs transition-all hover:border-slate-300 cursor-pointer active:scale-95"
        >
          <ArrowLeft className="w-4 h-4 text-indigo-600" />
          <span>Back to Previous Page</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>Placement & Training Cell</span>
          <span>/</span>
          <span className="font-semibold text-slate-900">Coordinator Portal</span>
        </div>
      </div>

      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full mb-2">
            <Building2 className="w-3.5 h-3.5" />
            <span>Placement & Training Cell Portal</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Coordinator & Admin Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Batch-wide recommendation analytics, recruiter job demand metrics, and candidate eligibility matching.
          </p>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddJobModal(true)}
            id="admin-add-job-btn"
            className="px-4 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Post New Campus Job</span>
          </button>
        </div>
      </div>

      {/* Mock Dataset Academic Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-start gap-3 text-xs text-amber-900">
        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p>
          <span className="font-bold">PBL Academic Dataset Label: </span>
          This dashboard displays simulated batch analytics from synthetic demo profiles and opportunities. It is not a live recruiter or institutional data feed.
        </p>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase">Total Students Registered</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900">{totalStudents}</span>
            <span className="text-[11px] font-bold text-emerald-600">80/20 Split</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">B.Tech Batch of 2025</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase">Campus Job Postings</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900">{totalJobs}</span>
            <span className="text-[11px] font-bold text-indigo-600">{jobs.length} Active in App</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Tier 1, Tier 2 & Core IT</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase">Average Match Score</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900">{avgCampusMatch}%</span>
            <span className="text-[11px] font-bold text-emerald-600">+12% vs Manual</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">TF-IDF & deterministic criteria fit</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase">Placement Rate</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900">{placementRate}%</span>
            <span className="text-[11px] font-bold text-emerald-600">On Track</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">457 Placed / Shortlisted</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-6 text-xs font-bold">
        <button
          onClick={() => setActiveTab('students')}
          className={`pb-3 border-b-2 cursor-pointer transition-colors ${
            activeTab === 'students'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Student Candidate Directory ({filteredStudents.length})
        </button>

        <button
          onClick={() => setActiveTab('jobs')}
          className={`pb-3 border-b-2 cursor-pointer transition-colors ${
            activeTab === 'jobs'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Manage Campus Job Openings ({jobs.length})
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`pb-3 border-b-2 cursor-pointer transition-colors ${
            activeTab === 'analytics'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Placement Market Demand Analytics
        </button>
      </div>

      {/* TAB 1: Student Profiles Directory */}
      {activeTab === 'students' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search student name or role..."
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                />
              </div>

              {/* Branch filter */}
              <select
                value={branchFilter}
                onChange={(e) => setBranchFilter(e.target.value)}
                className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white text-slate-700"
              >
                <option value="all">All Branches</option>
                <option value="CSE">CSE</option>
                <option value="AI & DS">AI & DS</option>
                <option value="IT">IT</option>
                <option value="ECE">ECE</option>
                <option value="EEE">EEE</option>
              </select>

              {/* Min GPA filter */}
              <select
                value={minGpaFilter}
                onChange={(e) => setMinGpaFilter(parseFloat(e.target.value))}
                className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white text-slate-700"
              >
                <option value="0">All GPAs</option>
                <option value="8.5">CGPA ≥ 8.5 (Dream Tier)</option>
                <option value="8.0">CGPA ≥ 8.0</option>
                <option value="7.5">CGPA ≥ 7.5</option>
                <option value="7.0">CGPA ≥ 7.0</option>
              </select>

              {/* Skill filter */}
              <input
                type="text"
                placeholder="Filter by skill (e.g. Python, SQL)..."
                value={skillFilter}
                onChange={(e) => setSkillFilter(e.target.value)}
                className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
              />
            </div>
          </div>

          {/* Student Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Student Name</th>
                    <th className="px-4 py-3">Branch</th>
                    <th className="px-4 py-3">CGPA</th>
                    <th className="px-4 py-3">Key Skills</th>
                    <th className="px-4 py-3">Top AI Matched Role</th>
                    <th className="px-4 py-3">Fit %</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredStudents.map((st) => (
                    <tr key={st.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3 font-bold text-slate-900">
                        <div>{st.name}</div>
                        <span className="text-[10px] text-slate-400 font-mono">{st.id}</span>
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-700">{st.branch}</td>
                      <td className="px-4 py-3 font-mono font-bold text-indigo-700">{st.gpa}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {st.skills.slice(0, 3).map((sk) => (
                            <span key={sk} className="px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px]">
                              {sk}
                            </span>
                          ))}
                          {st.skills.length > 3 && (
                            <span className="text-[10px] text-slate-400 font-medium">
                              +{st.skills.length - 3}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-semibold text-slate-800">{st.topMatchRole}</span>
                        <div className="text-[11px] text-slate-500">{st.topMatchCompany}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-extrabold text-sm text-emerald-600">{st.matchScore}%</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                          st.placementStatus === 'Placed'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : st.placementStatus === 'Shortlisted'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : st.placementStatus === 'Interviewing'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {st.placementStatus}
                          {st.ctcOffered && ` (${st.ctcOffered})`}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Manage Jobs */}
      {activeTab === 'jobs' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Listing {jobs.length} active campus recruiter postings</span>
            <button
              onClick={() => setShowAddJobModal(true)}
              className="text-indigo-600 font-bold hover:underline cursor-pointer"
            >
              + Add Another Job Opening
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Company</th>
                    <th className="px-4 py-3">Job Title</th>
                    <th className="px-4 py-3">Min GPA</th>
                    <th className="px-4 py-3">Eligible Branches</th>
                    <th className="px-4 py-3">Required Skills</th>
                    <th className="px-4 py-3">CTC</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {jobs.map((j) => (
                    <tr key={j.job_id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3 font-bold text-slate-900">{j.company}</td>
                      <td className="px-4 py-3 font-semibold text-indigo-700">{j.job_title}</td>
                      <td className="px-4 py-3 font-mono font-bold text-slate-700">{j.minimum_gpa}</td>
                      <td className="px-4 py-3">{j.eligible_branches.join(', ')}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {j.required_skills.slice(0, 3).map((sk) => (
                            <span key={sk} className="px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px]">
                              {sk}
                            </span>
                          ))}
                          {j.required_skills.length > 3 && (
                            <span className="text-[10px] text-slate-400">+{j.required_skills.length - 3}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 font-bold text-emerald-700">{j.ctc_range || 'Standard'}</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => onDeleteJob(j.job_id)}
                          className="text-slate-400 hover:text-red-600 p-1 cursor-pointer transition-colors"
                          title="Delete job posting"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Market Demand Analytics */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart: Most Demanded Skills by Recruiters */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Most Demanded Skills across Campus Recruiters</h3>
              <p className="text-xs text-slate-500">Frequency in required skills across job postings</p>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={skillDemandData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#475569' }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                    formatter={(val: any) => [`${val} Job Postings`, 'Demand Count']}
                  />
                  <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart: Students by Branch Distribution */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Student Eligibility Distribution by Department</h3>
              <p className="text-xs text-slate-500">Percentage share of registered candidates</p>
            </div>

            <div className="h-64 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={branchEligibilityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {branchEligibilityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                    formatter={(val: any) => [`${val}% of Students`, 'Share']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Add Job Modal */}
      {showAddJobModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Post New Campus Job</h3>
              <button onClick={() => setShowAddJobModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateJob} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Company Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cisco Systems, Atlassian"
                  value={newJob.company}
                  onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Job Title / Role</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Graduate SDE - Cloud & AI"
                  value={newJob.job_title}
                  onChange={(e) => setNewJob({ ...newJob, job_title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Min CGPA</label>
                  <input
                    type="number"
                    step="0.1"
                    min="5"
                    max="10"
                    value={newJob.minimum_gpa}
                    onChange={(e) => setNewJob({ ...newJob, minimum_gpa: parseFloat(e.target.value) || 7.0 })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">CTC Package</label>
                  <input
                    type="text"
                    placeholder="e.g. ₹14 - 18 LPA"
                    value={newJob.ctc_range}
                    onChange={(e) => setNewJob({ ...newJob, ctc_range: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Required Skills (comma-separated)</label>
                <input
                  type="text"
                  value={newReqSkillsInput}
                  onChange={(e) => setNewReqSkillsInput(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Location</label>
                <input
                  type="text"
                  value={newJob.location}
                  onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddJobModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm cursor-pointer"
                >
                  Save & Post Job
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
