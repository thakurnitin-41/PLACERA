import React, { useState } from 'react';
import { StudentProfileData, PipelineStep, ActivePage } from '../types';
import { PipelineMathInspectionModal } from './PipelineMathInspectionModal';
import { 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Cpu, 
  ArrowRight, 
  ArrowLeft,
  Calculator
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
  const [activeStepIndex, setActiveStepIndex] = useState<number>(5); // Default to completed
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [inspectingStepIndex, setInspectingStepIndex] = useState<number | null>(null);

  const pipelineSteps: PipelineStep[] = [
    {
      id: 1,
      name: 'Data Pre-processing',
      shortDesc: 'Text normalization & tokenization',
      status: activeStepIndex >= 1 ? 'completed' : isRunning && activeStepIndex === 0 ? 'processing' : 'pending',
      details: 'Converts raw student and job profile text to lowercase, removes punctuation and standard English stop-words, and standardizes skill variants (e.g., "ReactJS" → "react.js").',
      vivaKeyPoint: 'Viva Tip: Emphasize that stop-word removal and punctuation stripping prevent arbitrary punctuation marks from bloating the vocabulary space in TF-IDF.',
      formula: 'CleanText = Tokenize(StripPunctuation(LowerCase(Text))) \\setminus StopWords'
    },
    {
      id: 2,
      name: 'TF-IDF Vectorization',
      shortDesc: 'Term Frequency - Inverse Document Frequency',
      status: activeStepIndex >= 2 ? 'completed' : isRunning && activeStepIndex === 1 ? 'processing' : 'pending',
      details: 'Transforms student competencies, projects, and job requirements into high-dimensional numerical vectors. Terms frequent in a document but rare across the entire placement corpus receive highest weights.',
      vivaKeyPoint: 'Viva Tip: Scikit-learn TfidfVectorizer calculates tf-idf(t, d, D) = tf(t, d) × idf(t, D), penalizing generic words while highlighting niche skills like "PyTorch" or "System Design".',
      formula: '\\text{tf-idf}(t, d, D) = \\text{tf}(t, d) \\times \\log\\left(\\frac{1 + |D|}{1 + |\\{d \\in D : t \\in d\\}|}\\right) + 1'
    },
    {
      id: 3,
      name: 'Cosine Similarity',
      shortDesc: 'High-dimensional angular similarity',
      status: activeStepIndex >= 3 ? 'completed' : isRunning && activeStepIndex === 2 ? 'processing' : 'pending',
      details: 'Measures the cosine of the angle between the student feature vector and the target job description vector. Produces an orientation metric between 0 and 1, independent of document length.',
      vivaKeyPoint: 'Viva Tip: Cosine similarity is preferred over Euclidean distance for text because it measures orientation rather than document length (a student with 2 projects won\'t be penalized vs someone with 10).',
      formula: 'S_c(A, B) = \\cos(\\theta) = \\frac{A \\cdot B}{\\|A\\| \\|B\\|} = \\frac{\\sum_{i=1}^n A_i B_i}{\\sqrt{\\sum A_i^2} \\sqrt{\\sum B_i^2}}'
    },
    {
      id: 4,
      name: 'Random Forest Fit Classifier',
      shortDesc: 'Multi-feature ensemble decision trees',
      status: activeStepIndex >= 4 ? 'completed' : isRunning && activeStepIndex === 3 ? 'processing' : 'pending',
      details: 'Combines the semantic Cosine score with structured academic features: GPA cutoff margin, certifications count, internship experience length, and branch qualification to output a non-linear placement fit score.',
      vivaKeyPoint: 'Viva Tip: Random Forest handles tabular structured features (GPA, branch, certifications) combined with the unstructured NLP similarity score, reducing overfitting through bagging (bootstrap aggregating).',
      formula: '\\hat{y}_{RF} = \\frac{1}{B} \\sum_{b=1}^B T_b(\\mathbf{x}) \\quad \\text{where } \\mathbf{x} = [\\text{sim}, \\text{gpa}, \\text{certs}, \\text{branch}, \\text{exp}]'
    },
    {
      id: 5,
      name: 'Ranked Recommendations',
      shortDesc: 'Top-N placement scoring & sorting',
      status: activeStepIndex >= 5 ? 'completed' : isRunning && activeStepIndex === 4 ? 'processing' : 'pending',
      details: 'Aggregates Cosine similarity and Random Forest fit scores into a unified Match % index (0–100%), sorts 300+ campus opportunities, and generates the Top-N job roster.',
      vivaKeyPoint: 'Viva Tip: Ranking allows placement officers to enforce fair eligibility cutoffs while giving students a transparent view of Dream, Core, and Service opportunities.',
      formula: '\\text{Match Score} = \\alpha \\cdot S_c + \\beta \\cdot \\text{RF}_{\\text{fit}} + \\gamma \\cdot \\text{SkillOverlap}'
    },
    {
      id: 6,
      name: 'Explainable Match Dashboard',
      shortDesc: 'Transparent rationale & skill gaps',
      status: activeStepIndex >= 5 ? 'completed' : isRunning && activeStepIndex === 5 ? 'processing' : 'pending',
      details: 'Translates raw model weights into plain-language explanations: overlapping required skills, missing prerequisites, GPA compliance, and targeted learning recommendations.',
      vivaKeyPoint: 'Viva Tip: Explainability (XAI) is critical in educational technology to build student trust and guide actionable upskilling before placement season.',
      formula: '\\text{Explainability} = \\{\\text{Overlaps}, \\text{MissingGaps}, \\text{GPADiff}, \\text{CertRelevance}\\}'
    }
  ];

  const handleRunSimulation = () => {
    setIsRunning(true);
    setActiveStepIndex(0);

    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      setActiveStepIndex(current);
      if (current >= 5) {
        clearInterval(interval);
        setIsRunning(false);
      }
    }, 700);
  };

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
            How PLACERA Generates Recommendations
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Visual breakdown of NLP text preprocessing, vectorization, similarity metrics, and ensemble classification.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setInspectingStepIndex(0)}
            id="open-full-math-inspector-btn"
            className="px-4 py-2.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl transition-all cursor-pointer flex items-center gap-2 active:scale-95"
          >
            <Calculator className="w-4 h-4 text-indigo-600" />
            <span>Inspect Math & Equations</span>
          </button>

          <button
            onClick={handleRunSimulation}
            disabled={isRunning}
            id="run-pipeline-sim-btn"
            className="px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 rounded-xl shadow-sm shadow-indigo-200 transition-all cursor-pointer flex items-center gap-2 active:scale-95"
          >
            {isRunning ? (
              <>
                <Clock className="w-4 h-4 animate-spin" />
                <span>Simulating Pipeline...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Simulate AI Pipeline</span>
              </>
            )}
          </button>
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

      {/* Step by Step Visual Pipeline Cards */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <h2 className="text-base font-bold text-slate-900">
            The 6-Stage AI/ML Recommendation Pipeline
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pipelineSteps.map((step) => {
            return (
              <div
                key={step.id}
                className="p-5 rounded-2xl border bg-white border-slate-200 shadow-xs relative group"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center bg-slate-100 text-slate-700 group-hover:bg-indigo-100 group-hover:text-indigo-800 transition-colors">
                    0{step.id}
                  </span>

                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                    step.status === 'completed'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : step.status === 'processing'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200 animate-pulse'
                      : 'bg-slate-100 text-slate-500'
                  }`}>
                    {step.status === 'completed' && <CheckCircle2 className="w-3 h-3" />}
                    {step.status === 'processing' && <Clock className="w-3 h-3" />}
                    <span className="capitalize">{step.status}</span>
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 mb-2">
                  {step.name}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  {step.details}
                </p>

                <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 font-medium">Stage {step.id} of 6</span>
                  <span className="font-semibold text-indigo-600">
                    {step.status === 'completed' ? 'Active in Pipeline' : 'Standby'}
                  </span>
                </div>
              </div>
            );
          })}
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

      {/* 6-Stage Deep Math Inspection Modal */}
      {inspectingStepIndex !== null && (
        <PipelineMathInspectionModal
          initialStageIndex={inspectingStepIndex}
          student={student}
          onClose={() => setInspectingStepIndex(null)}
        />
      )}
    </div>
  );
};
