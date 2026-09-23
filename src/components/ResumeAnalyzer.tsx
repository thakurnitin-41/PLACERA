import React, { useState } from 'react';
import { FileSearch, CheckCircle2, AlertCircle } from 'lucide-react';
import { ATSResumeAnalysis, StudentProfileData } from '../types';
import { analyzeResumeText } from '../services/resumeAnalysisService';

interface ResumeAnalyzerProps {
  student: StudentProfileData;
  onScoreSaved?: (score: number) => void;
}

export const ResumeAnalyzer: React.FC<ResumeAnalyzerProps> = ({ student, onScoreSaved }) => {
  const [resumeText, setResumeText] = useState('');
  const [analysis, setAnalysis] = useState<ATSResumeAnalysis | null>(null);

  const handleAnalyze = () => {
    const result = analyzeResumeText(resumeText, student.preferred_role);
    setAnalysis(result);
    if (resumeText.trim()) onScoreSaved?.(result.atsScore);
  };

  return (
    <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-indigo-600 font-bold">ATS Resume Analyzer</p>
          <h2 className="text-lg font-black text-slate-900 mt-1">Check keyword coverage for {student.preferred_role}</h2>
          <p className="text-xs text-slate-500 mt-1">Analysis runs locally in your browser. Resume text is not uploaded.</p>
        </div>
        <FileSearch className="w-6 h-6 text-indigo-600" />
      </div>
      <textarea
        value={resumeText}
        onChange={event => setResumeText(event.target.value)}
        placeholder="Paste resume text here..."
        className="w-full min-h-32 mt-4 p-3 rounded-xl border border-slate-200 text-xs text-slate-700 outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
        aria-label="Resume text"
      />
      <button type="button" onClick={handleAnalyze} className="mt-3 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700">
        Analyze resume
      </button>
      {analysis && (
        <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="rounded-xl bg-indigo-50 border border-indigo-100 p-4">
            <span className="text-slate-500 block">ATS score</span>
            <strong className="text-3xl text-indigo-700">{analysis.atsScore}</strong><span className="text-slate-500">/100</span>
            <span className="block mt-1 font-bold text-indigo-800">{analysis.readinessGrade}</span>
          </div>
          <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-4">
            <span className="font-bold text-emerald-800 block">Found skills ({analysis.foundSkills.length})</span>
            <p className="text-emerald-900 mt-2">{analysis.foundSkills.slice(0, 6).join(', ') || 'No recognized skills yet.'}</p>
          </div>
          <div className="rounded-xl bg-amber-50 border border-amber-100 p-4">
            <span className="font-bold text-amber-800 block">Next improvements</span>
            <p className="text-amber-900 mt-2">{analysis.suggestions[0]}</p>
          </div>
        </div>
      )}
      {analysis && (
        <p className="mt-3 text-[11px] text-slate-500 flex items-center gap-1.5">
          {analysis.missingKeySkills.length ? <AlertCircle className="w-3.5 h-3.5 text-amber-500" /> : <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
          Missing target keywords: {analysis.missingKeySkills.slice(0, 5).join(', ') || 'none detected'}
        </p>
      )}
    </section>
  );
};
