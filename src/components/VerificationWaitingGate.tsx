import React, { useState } from 'react';
import { StudentProfileData, ActivePage } from '../types';
import { 
  Clock, 
  ShieldCheck, 
  FileText, 
  Eye, 
  AlertTriangle, 
  CheckCircle2, 
  Lock, 
  RefreshCw, 
  UserCheck, 
  ArrowRight, 
  GraduationCap, 
  Building2, 
  ShieldAlert, 
  ExternalLink,
  LogOut,
  Sparkles
} from 'lucide-react';

interface VerificationWaitingGateProps {
  student: StudentProfileData;
  onRefreshStatus?: () => void;
  onOpenProfile?: () => void;
  onLogout?: () => void;
}

export const VerificationWaitingGate: React.FC<VerificationWaitingGateProps> = ({
  student,
  onRefreshStatus,
  onOpenProfile,
  onLogout,
}) => {
  const [showDocModal, setShowDocModal] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    if (onRefreshStatus) {
      onRefreshStatus();
    }
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  const isDuplicate = !!student.studentProof?.isDuplicateDetected;

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 border-2 border-white/30 backdrop-blur text-white flex items-center justify-center shrink-0 shadow-lg">
              <Clock className="w-9 h-9 animate-pulse" />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 text-white px-2.5 py-0.5 rounded-full border border-white/30">
                  Verification Pending
                </span>
                <span className="text-xs text-amber-100 font-mono">
                  Submitted {student.studentProof?.uploadedAt || 'Recently'}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                Request Sent to College Admin: Please Wait for Approval
              </h2>

              <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed max-w-2xl">
                Hello <strong className="text-white underline">{student.name}</strong>, your student profile and institutional document have been safely submitted. To ensure institutional security, an authorized Placement Officer must review and approve your credentials before platform access is granted.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0 w-full md:w-auto">
            <button
              type="button"
              onClick={handleRefresh}
              className="px-4 py-2.5 text-xs font-bold text-amber-950 bg-white hover:bg-amber-50 rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Check Approval Status</span>
            </button>
          </div>
        </div>
      </div>

      {/* Security Fraud Alert if Duplicate Document was Detected */}
      {isDuplicate && (
        <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-red-950 font-bold text-sm">
            <ShieldAlert className="w-5 h-5 text-red-600 shrink-0" />
            <span>Security Notice: Identical Document Detected in System</span>
          </div>
          <p className="text-xs text-red-800 leading-relaxed">
            Our automated document registry detected that this identical document file was previously submitted by candidate{' '}
            <strong className="underline font-bold text-red-950">{student.studentProof?.duplicateMatchStudentName}</strong> (Roll: {student.studentProof?.duplicateMatchRollNumber || 'Registered'}).
            The Placement Officer will manually inspect both documents during the verification review. Submitting authentic personal credentials is mandatory under university placement regulations.
          </p>
        </div>
      )}

      {/* 3-Step Lifecycle Visualizer */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Verification & Access Lifecycle
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Step 1: Registration */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-600 text-white">
                Step 1: Done
              </span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <h4 className="text-sm font-bold text-emerald-950">Profile & Document Submitted</h4>
            <p className="text-xs text-emerald-800 leading-relaxed">
              Academic details, course, branch, and college credential document uploaded and encrypted.
            </p>
          </div>

          {/* Step 2: Admin Approval */}
          <div className="p-4 rounded-2xl bg-amber-50/80 border-2 border-amber-300 space-y-2 ring-1 ring-amber-200">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-500 text-white animate-pulse">
                Step 2: In Progress
              </span>
              <Clock className="w-4 h-4 text-amber-600 animate-spin" />
            </div>
            <h4 className="text-sm font-bold text-amber-950">Placement Officer Review</h4>
            <p className="text-xs text-amber-900 leading-relaxed">
              Admin reviews your submitted document, verifies your enrollment against the college database, and ensures no duplicate credentials exist.
            </p>
          </div>

          {/* Step 3: Platform Access */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 opacity-80">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-300 text-slate-700">
                Step 3: Locked
              </span>
              <Lock className="w-4 h-4 text-slate-400" />
            </div>
            <h4 className="text-sm font-bold text-slate-700">Placement Engine Access</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Campus placement drives, AI match recommendations, and company applications unlock automatically once the admin approves.
            </p>
          </div>
        </div>
      </div>

      {/* Submitted Dossier Details Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-indigo-600" />
              <span>Submitted Candidate Information</span>
            </h3>
            <p className="text-xs text-slate-500">
              Details currently under administrative evaluation.
            </p>
          </div>

          {onOpenProfile && (
            <button
              type="button"
              onClick={onOpenProfile}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer self-start sm:self-auto"
            >
              <span>Edit Profile or Re-upload Document</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Candidate Information Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-[10px] text-slate-400 block font-semibold">Degree & Branch</span>
            <span className="font-bold text-slate-900 block truncate">
              {student.course ? `${student.course} • ` : ''}{student.branch}
            </span>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-[10px] text-slate-400 block font-semibold">College / Institute</span>
            <span className="font-bold text-slate-900 block truncate" title={student.collegeName}>
              {student.collegeName || 'National Institute'}
            </span>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-[10px] text-slate-400 block font-semibold">Roll Number / Enrollment</span>
            <span className="font-bold text-slate-900 font-mono">
              {student.rollNumber || 'N/A'}
            </span>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-[10px] text-slate-400 block font-semibold">Academic Session</span>
            <span className="font-bold text-slate-900">
              Batch {student.admissionYear || 2021}–{student.graduationYear || 2025}
            </span>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-[10px] text-slate-400 block font-semibold">Claimed CGPA</span>
            <span className="font-bold text-indigo-700 font-mono">
              {student.GPA} / 10.0
            </span>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-[10px] text-slate-400 block font-semibold">10th / 12th Board %</span>
            <span className="font-bold text-slate-800">
              {student.tenthPercentage}% / {student.twelfthPercentage}%
            </span>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-[10px] text-slate-400 block font-semibold">Active Backlogs</span>
            <span className={`font-bold ${student.activeBacklogs > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
              {student.activeBacklogs} Active
            </span>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-[10px] text-slate-400 block font-semibold">College Email</span>
            <span className="font-medium text-slate-800 font-mono truncate block" title={student.collegeEmail}>
              {student.collegeEmail || student.email}
            </span>
          </div>
        </div>

        {/* Uploaded Document Card */}
        <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-indigo-600 shrink-0 shadow-2xs">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900">
                  {student.studentProof?.documentType || 'College ID Card / Marksheet'}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                  Awaiting Admin Review
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                {student.studentProof?.fileName || 'document_upload.pdf'} {student.studentProof?.fileSize && `• ${student.studentProof.fileSize}`}
              </p>
              {student.studentProof?.documentHash && (
                <p className="text-[10px] text-slate-400 font-mono">
                  SHA Checksum: {student.studentProof.documentHash}
                </p>
              )}
            </div>
          </div>

          {student.studentProof?.fileUrl && (
            <button
              type="button"
              onClick={() => setShowDocModal(true)}
              className="px-3 py-1.5 text-xs font-bold text-indigo-700 bg-white hover:bg-indigo-50 border border-indigo-200 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview Document</span>
            </button>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs border-t border-slate-100">
          <p className="text-slate-500 text-[11px]">
            Placement Office Contact: <span className="font-mono text-slate-700">placements@campus.edu.in</span>
          </p>

          <div className="flex items-center gap-3">
            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                className="text-xs font-semibold text-slate-500 hover:text-red-600 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Document Preview Modal */}
      {showDocModal && student.studentProof?.fileUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  {student.studentProof.documentType} Preview
                </h4>
                <p className="text-[11px] text-slate-500 font-mono">
                  {student.studentProof.fileName}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowDocModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-2 flex items-center justify-center">
              {student.studentProof.fileUrl.startsWith('data:image') ? (
                <img
                  src={student.studentProof.fileUrl}
                  alt="Student ID Preview"
                  className="max-h-80 object-contain rounded-lg shadow-xs"
                />
              ) : (
                <div className="py-12 text-center text-xs text-slate-500 space-y-2">
                  <FileText className="w-10 h-10 text-indigo-500 mx-auto" />
                  <p className="font-semibold">{student.studentProof.fileName}</p>
                  <p className="text-slate-400">PDF / Document file submitted for placement cell review.</p>
                </div>
              )}
            </div>

            <div className="text-right">
              <button
                type="button"
                onClick={() => setShowDocModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
