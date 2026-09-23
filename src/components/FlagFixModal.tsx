import React, { useState } from 'react';
import { 
  AlertTriangle, 
  X, 
  CheckCircle2, 
  FileText, 
  Building, 
  GraduationCap, 
  Send, 
  Sparkles,
  ShieldAlert,
  Info,
  Clock,
  UserCheck
} from 'lucide-react';
import { StudentProfileData, VerificationFeedback } from '../types';

interface FlagFixModalProps {
  student: StudentProfileData;
  adminOfficerName: string;
  onClose: () => void;
  onSubmit: (feedback: VerificationFeedback) => void;
}

const COMMON_UNVERIFIED_DATA_ITEMS = [
  'Previous Year / Semester Marksheet',
  'Claimed CGPA & Academic Record',
  'College Institutional ID Card',
  'Class 10th / 12th Board Records',
  'Achievement / Hackathon Certificate',
  'Backlogs Declaration',
  'Contact / Institutional Email'
];

const COMMON_ISSUE_PRESETS = [
  'Official university seal / controller of examination stamp missing on marksheet',
  'Uploaded document photo or scan is blurry, dark, cropped, or unreadable',
  'Claimed CGPA on profile does not match cumulative grade card transcript',
  'Incomplete grade card pages (re-appear/backlog subjects missing)',
  'Candidate name or roll number on marksheet differs from registered profile',
  'Achievement or hackathon certificate credential URL is broken or invalid',
  'Wrong document uploaded (e.g. tuition fee receipt instead of grade sheet)',
  'Official semester passing date / academic session missing or illegible'
];

const QUICK_INSTRUCTION_TEMPLATES = [
  {
    label: 'Official Seal Missing',
    text: 'Please re-upload a clear scanned copy of your official previous semester grade card bearing the authorized university examination seal and signature.'
  },
  {
    label: 'CGPA Mismatch',
    text: 'Your entered profile CGPA differs from the grade point shown on your marksheet transcript. Please update your profile CGPA in Section 2 to match your official grade card.'
  },
  {
    label: 'Blurry Photo / Re-scan',
    text: 'The submitted document photograph is illegible. Please use the camera scanner in Section 3 of your profile to capture a well-lit, high-resolution scan of your mark sheet.'
  },
  {
    label: 'Certificate Proof Invalid',
    text: 'The verification credential or link for your claimed achievement could not be verified. Please update the credential ID or upload an authorized certificate copy.'
  }
];

export const FlagFixModal: React.FC<FlagFixModalProps> = ({
  student,
  adminOfficerName,
  onClose,
  onSubmit
}) => {
  const [selectedDataItems, setSelectedDataItems] = useState<string[]>([
    'Previous Year / Semester Marksheet'
  ]);
  const [selectedIssues, setSelectedIssues] = useState<string[]>([
    'Official university seal / controller of examination stamp missing on marksheet'
  ]);
  const [requiredChanges, setRequiredChanges] = useState<string>(
    'Please re-upload a clear scanned copy of your official previous semester grade card bearing the authorized university examination seal and signature.'
  );
  const [actionDeadline, setActionDeadline] = useState<string>('Within 48 hours for placement drive clearance');
  const [customIssueInput, setCustomIssueInput] = useState('');

  const toggleDataItem = (item: string) => {
    setSelectedDataItems(prev => 
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  const toggleIssue = (issue: string) => {
    setSelectedIssues(prev => 
      prev.includes(issue) ? prev.filter(i => i !== issue) : [...prev, issue]
    );
  };

  const handleAddCustomIssue = () => {
    if (customIssueInput.trim() && !selectedIssues.includes(customIssueInput.trim())) {
      setSelectedIssues(prev => [...prev, customIssueInput.trim()]);
      setCustomIssueInput('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDataItems.length === 0) {
      alert('Please select at least one unverified data item.');
      return;
    }
    if (selectedIssues.length === 0) {
      alert('Please specify at least one issue found.');
      return;
    }
    if (!requiredChanges.trim()) {
      alert('Please describe what changes the student needs to make.');
      return;
    }

    const feedback: VerificationFeedback = {
      flaggedAt: new Date().toISOString(),
      flaggedBy: adminOfficerName || 'Central Placement Officer',
      status: 'Flagged / Action Needed',
      unverifiedDataItems: selectedDataItems,
      issues: selectedIssues,
      requiredChanges: requiredChanges.trim(),
      actionDeadline,
      resolved: false
    };

    onSubmit(feedback);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-amber-50/60 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 border border-amber-200">
              <AlertTriangle className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Flag Student Dossier for Fix & Resubmission
              </h3>
              <p className="text-xs text-slate-600">
                Specify issues and required changes. This notification will be delivered directly to the candidate's portal.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-xs">
          
          {/* Candidate Card Summary */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm shrink-0 border border-indigo-200">
                {student.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-900">{student.name}</h4>
                  <span className="font-mono text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-bold">
                    {student.rollNumber}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  {student.branch} • Batch {student.admissionYear || 2021}–{student.graduationYear || 2025} • CGPA: {student.GPA} / 10.0
                </p>
              </div>
            </div>

            <div className="text-right sm:text-right">
              <span className="inline-block text-[11px] font-semibold text-amber-800 bg-amber-100 border border-amber-200 px-2.5 py-1 rounded-lg">
                Current: Action Needed
              </span>
            </div>
          </div>

          {/* Section 1: What Data Has Not Been Verified? */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>1. Which Candidate Data has NOT Been Verified? *</span>
            </label>
            <p className="text-[11px] text-slate-500">
              Select all records where issues were detected during administrative review:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {COMMON_UNVERIFIED_DATA_ITEMS.map((item) => {
                const isSelected = selectedDataItems.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleDataItem(item)}
                    className={`px-3 py-2 rounded-xl text-left font-medium border text-xs flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-50/90 border-amber-300 text-amber-950 font-semibold shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <span>{item}</span>
                    <span className={`w-4 h-4 rounded-md flex items-center justify-center text-[10px] ${
                      isSelected ? 'bg-amber-600 text-white font-bold' : 'border border-slate-300'
                    }`}>
                      {isSelected ? '✓' : ''}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: What Were the Issues? */}
          <div className="space-y-2 pt-1">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>2. What Were the Issues Detected? *</span>
            </label>
            <p className="text-[11px] text-slate-500">
              Select identified discrepancies to inform the student clearly:
            </p>
            
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {COMMON_ISSUE_PRESETS.map((issue) => {
                const isChecked = selectedIssues.includes(issue);
                return (
                  <div
                    key={issue}
                    onClick={() => toggleIssue(issue)}
                    className={`p-2.5 rounded-xl border text-xs flex items-start gap-2.5 cursor-pointer transition-all ${
                      isChecked
                        ? 'bg-rose-50/80 border-rose-300 text-rose-950 font-medium'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}} // Controlled by div click
                      className="mt-0.5 rounded text-rose-600 focus:ring-rose-500"
                    />
                    <span className="leading-snug">{issue}</span>
                  </div>
                );
              })}
            </div>

            {/* Custom issue adder */}
            <div className="flex gap-2 pt-1">
              <input
                type="text"
                value={customIssueInput}
                onChange={(e) => setCustomIssueInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCustomIssue();
                  }
                }}
                placeholder="Add other custom verification issue..."
                className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
              />
              <button
                type="button"
                onClick={handleAddCustomIssue}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
              >
                Add Issue
              </button>
            </div>
          </div>

          {/* Section 3: What Changes Does the Student Need to Make? */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-indigo-600" />
                <span>3. What Changes Does the Student Need to Make? *</span>
              </label>
              <span className="text-[11px] text-slate-400">Reaches student's portal</span>
            </div>

            {/* Quick Templates */}
            <div className="flex flex-wrap gap-1.5">
              <span className="text-[10px] text-slate-400 self-center font-medium">Quick Insert:</span>
              {QUICK_INSTRUCTION_TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.label}
                  type="button"
                  onClick={() => setRequiredChanges(tmpl.text)}
                  className="px-2 py-0.5 text-[10px] font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-md transition-colors cursor-pointer"
                >
                  + {tmpl.label}
                </button>
              ))}
            </div>

            <textarea
              rows={3}
              required
              value={requiredChanges}
              onChange={(e) => setRequiredChanges(e.target.value)}
              placeholder="Explain clearly what document or profile value the student must update (e.g. 'Please upload your official 4th semester marksheet with university seal in Section 3...')"
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 leading-relaxed font-sans"
            />
          </div>

          {/* Section 4: Resolution Deadline & Officer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>Action Expected By</span>
              </label>
              <input
                type="text"
                value={actionDeadline}
                onChange={(e) => setActionDeadline(e.target.value)}
                placeholder="e.g. Within 48 hours for Google campus drive"
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5 text-slate-500" />
                <span>Signing Officer</span>
              </label>
              <input
                type="text"
                disabled
                value={adminOfficerName || 'Central Placement Officer'}
                className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-slate-100 text-slate-700 font-medium"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-xl cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              id="submit-flag-fix-btn"
              className="px-5 py-2.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-2 active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Notice to Student Portal</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
