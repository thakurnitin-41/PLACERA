import React, { useState, useMemo } from 'react';
import { StudentProfileData, RecommendationResult, SkillGapItem } from '../types';
import { generateSkillGapAnalysis } from '../services/recommendationEngine';
import { 
  Layers, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Target, 
  BookOpen, 
  ArrowRight, 
  Sparkles, 
  TrendingUp, 
  Filter,
  GraduationCap,
  ArrowLeft,
  UserPlus,
  LogIn
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie
} from 'recharts';

interface SkillGapAnalysisProps {
  student: StudentProfileData | null;
  recommendations: RecommendationResult[];
  onOpenAuthModal?: (mode?: 'login' | 'register') => void;
  onBack?: () => void;
}

export const SkillGapAnalysis: React.FC<SkillGapAnalysisProps> = ({
  student,
  recommendations,
  onOpenAuthModal,
  onBack,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const gapItems: SkillGapItem[] = useMemo(() => {
    if (!student) return [];
    return generateSkillGapAnalysis(student, recommendations);
  }, [student, recommendations]);

  if (!student) {
    return (
      <div className="max-w-6xl mx-auto space-y-8 pb-16">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack || (() => window.history.back())}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-indigo-600" />
            <span>Back</span>
          </button>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center shadow-xs space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mx-auto">
            <Layers className="w-8 h-8" />
          </div>

          <div className="space-y-2 max-w-lg mx-auto">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              AI Skill Gap & Roadmap Generator
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Analyze missing high-impact technical skills against active recruiter expectations by creating or signing in to your student profile.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onOpenAuthModal ? onOpenAuthModal('register') : null}
              className="w-full sm:w-auto px-6 py-3 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <UserPlus className="w-4 h-4" />
              <span>Create My Profile (Register)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onOpenAuthModal ? onOpenAuthModal('login') : null}
              className="w-full sm:w-auto px-6 py-3 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Filtered items
  const filteredGaps = useMemo(() => {
    return gapItems.filter(item => {
      if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
      if (selectedStatus !== 'all' && item.status !== selectedStatus) return false;
      return true;
    });
  }, [gapItems, selectedCategory, selectedStatus]);

  // Statistics
  const matchingCount = gapItems.filter(g => g.status === 'matching').length;
  const partialCount = gapItems.filter(g => g.status === 'partial').length;
  const missingCount = gapItems.filter(g => g.status === 'missing').length;
  const totalCount = gapItems.length || 1;
  const matchPercentage = Math.round(((matchingCount + (partialCount * 0.5)) / totalCount) * 100);

  // Category coverage data for Recharts Bar Chart
  const categoryData = useMemo(() => {
    const cats: Record<string, { total: number; matched: number }> = {};
    gapItems.forEach(g => {
      if (!cats[g.category]) cats[g.category] = { total: 0, matched: 0 };
      cats[g.category].total++;
      if (g.status === 'matching') cats[g.category].matched += 1;
      else if (g.status === 'partial') cats[g.category].matched += 0.5;
    });

    return Object.entries(cats).map(([name, val]) => ({
      name,
      coverageRate: Math.round((val.matched / val.total) * 100),
      totalDemanded: val.total,
      matchedCount: Math.round(val.matched)
    }));
  }, [gapItems]);

  // Distribution data for Pie Chart
  const pieData = [
    { name: 'Matching', value: matchingCount, color: '#10b981' },
    { name: 'Partially Matching', value: partialCount, color: '#f59e0b' },
    { name: 'Missing', value: missingCount, color: '#ef4444' }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Top Page Navigation Bar with Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack || (() => window.history.back())}
          id="skill-gap-back-btn"
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-xs transition-all hover:border-slate-300 cursor-pointer active:scale-95"
        >
          <ArrowLeft className="w-4 h-4 text-indigo-600" />
          <span>Back to Previous Page</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>Diagnostic Engine</span>
          <span>/</span>
          <span className="font-semibold text-slate-900">Skill Gap & Upskilling Roadmap</span>
        </div>
      </div>

      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full mb-2">
            <Target className="w-3.5 h-3.5" />
            <span>Targeted Upskilling Roadmap</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Skill Gap Analysis
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Comparing <span className="font-semibold text-slate-800">Your Skills</span> vs <span className="font-semibold text-slate-800">Campus Job Market Requirements</span>
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl text-right">
          <span className="text-[11px] font-semibold text-slate-500 block">Overall Skill Coverage</span>
          <span className="text-2xl font-extrabold text-indigo-600">{matchPercentage}%</span>
        </div>
      </div>

      {/* Visual Status Indicator Legend */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            ✓
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-emerald-900">Matching</span>
              <span className="text-xs font-mono font-bold text-emerald-700">({matchingCount})</span>
            </div>
            <p className="text-[11px] text-emerald-800">Skills present on your profile meeting recruiter needs.</p>
          </div>
        </div>

        <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
            ⚠
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-amber-900">Partially Matching</span>
              <span className="text-xs font-mono font-bold text-amber-700">({partialCount})</span>
            </div>
            <p className="text-[11px] text-amber-800">Related background but needs formal demonstration.</p>
          </div>
        </div>

        <div className="bg-red-50/70 border border-red-200 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center font-bold">
            ✕
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-red-900">Missing Competencies</span>
              <span className="text-xs font-mono font-bold text-red-700">({missingCount})</span>
            </div>
            <p className="text-[11px] text-red-800">Required high-priority gaps for top recommendations.</p>
          </div>
        </div>
      </div>

      {/* Charts Section: Recharts Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart: Category Coverage */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">Skill Domain Coverage (%)</h3>
            </div>
            <span className="text-xs text-slate-400 font-medium">Domain benchmarks</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} unit="%" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: '#334155' }} width={100} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                  formatter={(val: any) => [`${val}% Coverage`, 'Match Rate']}
                />
                <Bar dataKey="coverageRate" radius={[0, 4, 4, 0]}>
                  {categoryData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.coverageRate >= 70 ? '#10b981' : entry.coverageRate >= 40 ? '#6366f1' : '#f59e0b'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart: Match Distribution */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">Skills Status Breakdown</h3>
            <p className="text-xs text-slate-400">Ratio of matched vs missing</p>
          </div>

          <div className="h-48 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
            <div className="flex justify-between items-center text-slate-600">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                Matching
              </span>
              <span className="font-bold text-slate-800">{matchingCount}</span>
            </div>
            <div className="flex justify-between items-center text-slate-600">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                Partially Matching
              </span>
              <span className="font-bold text-slate-800">{partialCount}</span>
            </div>
            <div className="flex justify-between items-center text-slate-600">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                Missing
              </span>
              <span className="font-bold text-slate-800">{missingCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Row */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-bold text-slate-700">Filter Skills:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-slate-50 text-slate-700"
          >
            <option value="all">All Statuses</option>
            <option value="missing">✕ Missing Only</option>
            <option value="partial">⚠ Partially Matching Only</option>
            <option value="matching">✓ Matching Only</option>
          </select>

          {/* Category filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-slate-50 text-slate-700"
          >
            <option value="all">All Domains</option>
            <option value="Languages">Programming Languages</option>
            <option value="AI/ML">AI / Machine Learning</option>
            <option value="Web & Backend">Web & Backend</option>
            <option value="Databases">Databases & SQL</option>
            <option value="DevOps & Tools">DevOps, Systems & Cloud</option>
          </select>
        </div>
      </div>

      {/* Detailed Skill Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">
            Competency Gap Matrix & Actionable Roadmap ({filteredGaps.length})
          </h3>
          <span className="text-xs text-slate-500">Sorted by Recruiter Demand Priority</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Technical Skill</th>
                <th className="px-4 py-3">Domain Category</th>
                <th className="px-4 py-3">Recruiter Priority</th>
                <th className="px-4 py-3">Importance Score</th>
                <th className="px-4 py-3">Recommended Academic Resource</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredGaps.map((item, idx) => {
                let statusBadge = (
                  <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Matching
                  </span>
                );

                if (item.status === 'partial') {
                  statusBadge = (
                    <span className="inline-flex items-center gap-1 font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      Partially
                    </span>
                  );
                } else if (item.status === 'missing') {
                  statusBadge = (
                    <span className="inline-flex items-center gap-1 font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                      <XCircle className="w-3.5 h-3.5 text-red-600" />
                      Missing
                    </span>
                  );
                }

                let priorityBadge = (
                  <span className="font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                    Low
                  </span>
                );
                if (item.priority === 'High') {
                  priorityBadge = (
                    <span className="font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                      High Priority
                    </span>
                  );
                } else if (item.priority === 'Medium') {
                  priorityBadge = (
                    <span className="font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      Medium
                    </span>
                  );
                }

                return (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap">{statusBadge}</td>
                    <td className="px-4 py-3 font-bold text-slate-900">{item.skill}</td>
                    <td className="px-4 py-3 text-slate-600">{item.category}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{priorityBadge}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className="bg-indigo-600 h-1.5 rounded-full" 
                            style={{ width: `${item.importance_score * 10}%` }} 
                          />
                        </div>
                        <span className="font-mono text-[11px] text-slate-500 font-semibold">{item.importance_score}/10</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600 font-medium">
                      <span className="flex items-center gap-1.5 text-indigo-700 hover:underline">
                        <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                        {item.learning_resources}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
