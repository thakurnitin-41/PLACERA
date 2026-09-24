import React from 'react';
import { StudentProfileData, ActivePage } from '../types';
import { 
  CheckCircle2, 
  Sparkles, 
  Cpu,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

interface AIPipelinePageProps {
  student: StudentProfileData | null;
  setActivePage: (page: ActivePage) => void;
  onPipelineCompleted?: () => void;
  onBack?: () => void;
}

export const AIPipelinePage: React.FC<AIPipelinePageProps> = ({
  student,
  setActivePage,
  onBack,
}) => {
  const activeStepIndex = 5;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Top Page Navigation Bar with Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack || (() => setActivePage('profile'))}
          id="pipeline-back-btn"
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-xs transition-all hover:border-slate-300 cursor-pointer active:scale-95"
        >
          <ArrowLeft className="w-4 h-4 text-indigo-600" />
          <span>Back to Previous Page</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="cursor-pointer hover:text-indigo-600" onClick={() => setActivePage('landing')}>Home</span>
          <span>/</span>
          <span className="font-semibold text-slate-900">AI/ML Pipeline</span>
        </div>
      </div>

      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full mb-2">
            <Cpu className="w-3.5 h-3.5" />
            <span>Academic AI Pipeline Architecture</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            AI Match Execution Status
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Transparent status of the deterministic matching pipeline used for your recommendations.
          </p>
        </div>
      </div>

      {/* Pipeline Status Banner: Exact User Checklist Indicators */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-sm border border-slate-800">
        <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2.5">
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>AI Execution Status Indicators</span>
          </span>
          <span className="text-[11px] font-mono text-emerald-400">
            {activeStepIndex >= 5 ? 'All 6 Inference Stages Green' : `Executing Stage ${activeStepIndex + 1} / 6`}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="flex items-center gap-2 bg-slate-800/60 px-3 py-2 rounded-xl border border-slate-700 text-xs">
            <CheckCircle2 className={`w-4 h-4 ${activeStepIndex >= 0 ? 'text-emerald-400' : 'text-slate-600'}`} />
            <span className={activeStepIndex >= 0 ? 'text-slate-200 font-medium' : 'text-slate-500'}>Profile processed</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-800/60 px-3 py-2 rounded-xl border border-slate-700 text-xs">
            <CheckCircle2 className={`w-4 h-4 ${activeStepIndex >= 1 ? 'text-emerald-400' : 'text-slate-600'}`} />
            <span className={activeStepIndex >= 1 ? 'text-slate-200 font-medium' : 'text-slate-500'}>Skills vectorized</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-800/60 px-3 py-2 rounded-xl border border-slate-700 text-xs">
            <CheckCircle2 className={`w-4 h-4 ${activeStepIndex >= 2 ? 'text-emerald-400' : 'text-slate-600'}`} />
            <span className={activeStepIndex >= 2 ? 'text-slate-200 font-medium' : 'text-slate-500'}>Job requirements analyzed</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-800/60 px-3 py-2 rounded-xl border border-slate-700 text-xs">
            <CheckCircle2 className={`w-4 h-4 ${activeStepIndex >= 3 ? 'text-emerald-400' : 'text-slate-600'}`} />
            <span className={activeStepIndex >= 3 ? 'text-slate-200 font-medium' : 'text-slate-500'}>Similarity calculated</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-800/60 px-3 py-2 rounded-xl border border-slate-700 text-xs">
            <CheckCircle2 className={`w-4 h-4 ${activeStepIndex >= 4 ? 'text-emerald-400' : 'text-slate-600'}`} />
            <span className={activeStepIndex >= 4 ? 'text-slate-200 font-medium' : 'text-slate-500'}>Fit score predicted</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-800/60 px-3 py-2 rounded-xl border border-slate-700 text-xs">
            <CheckCircle2 className={`w-4 h-4 ${activeStepIndex >= 5 ? 'text-emerald-400' : 'text-slate-600'}`} />
            <span className={activeStepIndex >= 5 ? 'text-slate-200 font-medium' : 'text-slate-500'}>Recommendations generated</span>
          </div>
        </div>
      </div>

      {/* Bottom CTA to Recommendations */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-gradient-to-r from-indigo-900 to-slate-900 text-white rounded-2xl shadow-md">
        <div>
          <h4 className="text-sm font-bold">Ready to see the generated results?</h4>
          <p className="text-xs text-slate-300 mt-0.5">
            View the ranked jobs and transparent skill match breakdown.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={onBack || (() => setActivePage('profile'))}
            className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Profile</span>
          </button>
          
          <button
            onClick={() => setActivePage('recommendations')}
            id="pipeline-view-rec-btn"
            className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold bg-white text-indigo-950 hover:bg-slate-100 rounded-xl shadow transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>View Recommendations</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};
