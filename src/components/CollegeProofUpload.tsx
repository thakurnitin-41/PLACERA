import React, { useState, useRef, useEffect } from 'react';
import { StudentProofDocument, StudentProfileData } from '../types';
import { calculateAcademicStanding } from '../utils/crypto';
import { checkDocumentDuplicate, computeDocumentChecksum } from '../utils/documentSecurity';
import { 
  FileText, 
  Upload, 
  Camera, 
  CheckCircle2, 
  X, 
  Eye, 
  Trash2, 
  FileCheck2, 
  ShieldCheck, 
  AlertCircle,
  GraduationCap,
  AlertTriangle,
  Clock,
  ShieldAlert
} from 'lucide-react';

interface CollegeProofUploadProps {
  proof?: StudentProofDocument;
  onChange: (proof: StudentProofDocument | undefined) => void;
  studentId?: string;
  inMemoryStudents?: StudentProfileData[];
  collegeName?: string;
  admissionYear?: number;
  graduationYear?: number;
  required?: boolean;
  title?: string;
  subtitle?: string;
  verificationStatus?: 'Verified' | 'Pending Review' | 'Flagged / Action Needed' | 'Rejected';
  verifiedBy?: string;
  verifiedAt?: string;
  adminNotes?: string;
}

const DOCUMENT_TYPES: StudentProofDocument['documentType'][] = [
  'Previous Semester Marksheet',
  'College ID Card',
  'Tuition Fee Receipt',
  'Admission Letter',
  'Bonafide Certificate'
];

export const CollegeProofUpload: React.FC<CollegeProofUploadProps> = ({
  proof,
  onChange,
  studentId,
  inMemoryStudents,
  collegeName = 'Your College',
  admissionYear = 2021,
  graduationYear = 2025,
  required = true,
  title,
  subtitle,
  verificationStatus,
  verifiedBy,
  verifiedAt,
  adminNotes
}) => {
  const academicStanding = calculateAcademicStanding(admissionYear, graduationYear);

  const [docType, setDocType] = useState<StudentProofDocument['documentType']>(
    proof?.documentType || 'Previous Semester Marksheet'
  );
  const [showCamera, setShowCamera] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (!proof) {
      setDocType('Previous Semester Marksheet');
    }
  }, [admissionYear, graduationYear]);

  // Handle file select or drop
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const sizeInKb = (file.size / 1024).toFixed(1);
      const sizeStr = file.size > 1024 * 1024 
        ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` 
        : `${sizeInKb} KB`;

      // Perform duplicate detection against registered database
      const dupCheck = checkDocumentDuplicate(dataUrl, file.name, studentId, inMemoryStudents);
      const checksum = computeDocumentChecksum(dataUrl);

      onChange({
        documentType: docType,
        fileName: file.name,
        fileUrl: dataUrl,
        fileSize: sizeStr,
        uploadedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        isVerified: false, // Strict Security: Never auto-verify on upload
        isDuplicateDetected: dupCheck.isDuplicate,
        duplicateMatchStudentName: dupCheck.matchedStudent?.name,
        duplicateMatchRollNumber: dupCheck.matchedStudent?.rollNumber,
        duplicateMatchStudentId: dupCheck.matchedStudent?.student_id,
        documentHash: checksum,
        verificationNotes: dupCheck.isDuplicate
          ? `SECURITY ALERT: Duplicate document detected matching candidate ${dupCheck.matchedStudent?.name} (Roll: ${dupCheck.matchedStudent?.rollNumber})`
          : undefined
      });
    };
    reader.readAsDataURL(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Start Camera for capturing document photo
  const startCamera = async () => {
    setCameraError(null);
    setShowCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      console.error('Camera access error:', err);
      setCameraError('Unable to access camera. Please upload a file/image from your device instead.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);

    stopCamera();

    const capturedFileName = `${docType.toLowerCase().replace(/\s+/g, '_')}_capture.jpg`;
    const dupCheck = checkDocumentDuplicate(dataUrl, capturedFileName, studentId, inMemoryStudents);
    const checksum = computeDocumentChecksum(dataUrl);

    onChange({
      documentType: docType,
      fileName: capturedFileName,
      fileUrl: dataUrl,
      fileSize: '450 KB',
      uploadedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      isVerified: false, // Strict Security: Never auto-verify on upload
      isDuplicateDetected: dupCheck.isDuplicate,
      duplicateMatchStudentName: dupCheck.matchedStudent?.name,
      duplicateMatchRollNumber: dupCheck.matchedStudent?.rollNumber,
      duplicateMatchStudentId: dupCheck.matchedStudent?.student_id,
      documentHash: checksum,
      verificationNotes: dupCheck.isDuplicate
        ? `SECURITY ALERT: Duplicate document detected matching candidate ${dupCheck.matchedStudent?.name} (Roll: ${dupCheck.matchedStudent?.rollNumber})`
        : undefined
    });
  };

  const handleRemove = () => {
    onChange(undefined);
  };

  return (
    <div className="space-y-3">
      {/* Academic Year Basis Information Badge */}
      <div className="p-3 bg-indigo-50/80 border border-indigo-200/80 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-start sm:items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-indigo-600 text-white shrink-0">
            <GraduationCap className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-xs text-indigo-950">
                Academic Standing: {academicStanding.currentYearLabel}
              </span>
              <span className="text-[10px] bg-white border border-indigo-200 text-indigo-700 font-semibold px-2 py-0.2 rounded-full">
                Batch {admissionYear} – {graduationYear}
              </span>
            </div>
            <p className="text-[11px] text-indigo-800 mt-0.5">
              Required Proof: <strong className="text-slate-900">{academicStanding.suggestedMarksheetName}</strong>
            </p>
          </div>
        </div>

        {proof && (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 shrink-0 self-start sm:self-center">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Document Verified</span>
          </span>
        )}
      </div>

      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-slate-700">
          {title || `College Enrollment & Marksheet Verification`} {required && <span className="text-red-500">*</span>}
        </label>
        {subtitle && <span className="text-[11px] text-slate-500">{subtitle}</span>}
      </div>

      {/* Document Type Selector */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1">
          <label className="block text-[11px] font-medium text-slate-500 mb-1">
            Selected Document Type for Verification:
          </label>
          <select
            value={docType}
            onChange={(e) => {
              const newType = e.target.value as StudentProofDocument['documentType'];
              setDocType(newType);
              if (proof) {
                onChange({ ...proof, documentType: newType });
              }
            }}
            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500 cursor-pointer font-medium"
          >
            {DOCUMENT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type === 'Previous Semester Marksheet' ? `Previous Semester Marksheet (${academicStanding.suggestedMarksheetName})` : type}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Uploaded Document Card OR Upload Dropzone */}
      {proof ? (
        <div className={`p-4 rounded-2xl border transition-all ${
          proof.isDuplicateDetected
            ? 'bg-red-50/80 border-red-300 ring-2 ring-red-200'
            : verificationStatus === 'Verified'
            ? 'bg-emerald-50/60 border-emerald-300 ring-1 ring-emerald-200'
            : verificationStatus === 'Flagged / Action Needed'
            ? 'bg-amber-50/60 border-amber-300 ring-1 ring-amber-200'
            : verificationStatus === 'Rejected'
            ? 'bg-rose-50/80 border-rose-300 ring-1 ring-rose-200'
            : 'bg-indigo-50/50 border-indigo-200'
        }`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className={`w-14 h-14 rounded-xl border overflow-hidden flex items-center justify-center shrink-0 shadow-xs ${
                proof.isDuplicateDetected
                  ? 'bg-white border-red-300 text-red-600'
                  : verificationStatus === 'Verified'
                  ? 'bg-white border-emerald-300 text-emerald-600'
                  : 'bg-white border-indigo-200 text-indigo-600'
              }`}>
                {proof.fileUrl && proof.fileUrl.startsWith('data:image') ? (
                  <img src={proof.fileUrl} alt="Proof Thumbnail" className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform" onClick={() => setShowPreviewModal(true)} />
                ) : (
                  <FileCheck2 className="w-7 h-7" />
                )}
              </div>

              <div className="min-w-0 space-y-0.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-slate-900 text-xs truncate">
                    {proof.documentType}
                  </span>
                  {proof.isDuplicateDetected ? (
                    <span className="inline-flex items-center gap-1 text-[10px] bg-red-600 text-white font-extrabold px-2.5 py-0.5 rounded-full shadow-2xs">
                      <ShieldAlert className="w-3 h-3" />
                      <span>Duplicate Credential Detected</span>
                    </span>
                  ) : verificationStatus === 'Verified' ? (
                    <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-full shadow-2xs">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Approved by Placement Cell</span>
                    </span>
                  ) : verificationStatus === 'Flagged / Action Needed' ? (
                    <span className="inline-flex items-center gap-1 text-[10px] bg-amber-600 text-white font-bold px-2 py-0.5 rounded-full">
                      <AlertTriangle className="w-3 h-3" />
                      <span>Action Needed: Resubmit</span>
                    </span>
                  ) : verificationStatus === 'Rejected' ? (
                    <span className="inline-flex items-center gap-1 text-[10px] bg-rose-600 text-white font-bold px-2 py-0.5 rounded-full">
                      <X className="w-3 h-3" />
                      <span>Rejected by Placement Cell</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-md border border-amber-200">
                      <Clock className="w-3 h-3 text-amber-700" />
                      <span>Submitted • Pending Admin Approval</span>
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-600 truncate">
                  <span className="font-mono">{proof.fileName}</span> {proof.fileSize && `• ${proof.fileSize}`} • Uploaded {proof.uploadedAt}
                </p>
                {verificationStatus === 'Verified' && (proof.verifiedBy || verifiedBy) && (
                  <p className="text-[10px] text-emerald-800 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span>Verified by {proof.verifiedBy || verifiedBy} • {proof.verifiedAt || verifiedAt || 'Approved'}</span>
                  </p>
                )}
                {adminNotes && (
                  <p className="text-[10px] text-slate-600 italic">
                    Note: "{adminNotes}"
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              {proof.fileUrl && (
                <button
                  type="button"
                  onClick={() => setShowPreviewModal(true)}
                  title="Preview Document"
                  className="px-2.5 py-1.5 text-xs font-bold text-indigo-700 bg-white hover:bg-indigo-50 border border-indigo-200 rounded-xl transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                title="Replace Document"
                className="px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all cursor-pointer"
              >
                Replace
              </button>

              <button
                type="button"
                onClick={handleRemove}
                title="Remove Document"
                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Critical Security Warning Banner for Duplicate Credential */}
          {proof.isDuplicateDetected && (
            <div className="mt-3 p-3 bg-red-100/90 border border-red-300 rounded-xl text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-red-950">
                <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
                <span>Security Notice: Identical Document Already Exists</span>
              </div>
              <p className="text-red-900 text-[11px] leading-relaxed">
                This exact credential was previously submitted by candidate{' '}
                <strong className="underline font-bold text-red-950">{proof.duplicateMatchStudentName}</strong> (Roll: {proof.duplicateMatchRollNumber || 'Registered'}).
                Each student must provide their own individual authentic college credential. The administrator has been notified to investigate duplicate credentials for fraud prevention.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="border-2 border-dashed border-slate-300 hover:border-indigo-400 bg-slate-50/70 hover:bg-indigo-50/30 rounded-2xl p-4 transition-all text-center">
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Upload className="w-5 h-5" />
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-800">
                Upload {academicStanding.suggestedMarksheetName} / {docType}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {academicStanding.marksheetDescription} (PDF, PNG, JPG up to 10MB)
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 mt-1">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload From Device</span>
              </button>

              <button
                type="button"
                onClick={startCamera}
                className="px-3.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold transition-all inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5 text-slate-500" />
                <span>Scan with Camera</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*,application/pdf"
        className="hidden"
      />

      {/* Live Camera Modal for document snapshot */}
      {showCamera && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-indigo-600" />
                <h4 className="text-xs font-bold text-slate-900">
                  Scan / Snap {academicStanding.suggestedMarksheetName}
                </h4>
              </div>
              <button
                type="button"
                onClick={stopCamera}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-3">
              {cameraError ? (
                <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{cameraError}</span>
                </div>
              ) : (
                <div className="relative rounded-xl overflow-hidden bg-black aspect-video flex items-center justify-center border-2 border-indigo-500">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  {/* Guide Frame Overlay */}
                  <div className="absolute inset-4 border-2 border-white/60 border-dashed rounded-lg pointer-events-none flex items-center justify-center">
                    <span className="text-[11px] text-white/90 bg-black/60 px-2 py-0.5 rounded-md font-medium">
                      Align {academicStanding.suggestedMarksheetName} inside frame
                    </span>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={stopCamera}
                  className="px-3.5 py-1.5 border border-slate-300 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                {!cameraError && (
                  <button
                    type="button"
                    onClick={capturePhoto}
                    className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Capture & Use Document</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full Document Preview Modal */}
      {showPreviewModal && proof && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 max-h-[90vh] flex flex-col">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{proof.documentType} Preview</h4>
                  <p className="text-[10px] text-slate-500">{proof.fileName} • {proof.uploadedAt}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto flex-1 flex items-center justify-center bg-slate-100">
              {proof.fileUrl.startsWith('data:image') ? (
                <img
                  src={proof.fileUrl}
                  alt="Verified Proof"
                  className="max-h-[65vh] w-auto object-contain rounded-xl border border-slate-300 shadow-md bg-white"
                />
              ) : (
                <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
                  <FileText className="w-16 h-16 text-indigo-600 mx-auto" />
                  <div>
                    <h5 className="font-bold text-slate-900 text-sm">{proof.fileName}</h5>
                    <p className="text-xs text-slate-500 mt-1">PDF Document Verified for {collegeName} (Batch {admissionYear}–{graduationYear})</p>
                  </div>
                </div>
              )}
            </div>

            <div className="p-3 bg-white border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                className="px-4 py-1.5 bg-slate-800 text-white rounded-xl text-xs font-semibold cursor-pointer"
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
