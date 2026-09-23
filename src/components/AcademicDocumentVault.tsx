import React, { useState, useRef } from 'react';
import { 
  AcademicMarksheetDocument, 
  UploadedCertificateDocument, 
  StudentProfileData 
} from '../types';
import { calculateAcademicStanding } from '../utils/crypto';
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
  Award, 
  Trophy, 
  Plus, 
  Download, 
  Sparkles, 
  ExternalLink,
  Calendar,
  Building,
  Check,
  Search,
  Filter,
  Layers,
  FileBadge2
} from 'lucide-react';

interface AcademicDocumentVaultProps {
  student: StudentProfileData;
  onUpdateMarksheets: (marksheets: AcademicMarksheetDocument[]) => void;
  onUpdateCertificates: (certificates: UploadedCertificateDocument[]) => void;
  isReadOnly?: boolean;
}

// Standard Marks Sheet Semester Options
const STANDARD_SEMESTER_OPTIONS = [
  'Semester 1 (1st Year)',
  'Semester 2 (1st Year)',
  'Semester 3 (2nd Year)',
  'Semester 4 (2nd Year)',
  'Semester 5 (3rd Year)',
  'Semester 6 (3rd Year)',
  'Semester 7 (4th Year)',
  'Semester 8 (4th Year)',
  '1st Year Consolidated Marksheet',
  '2nd Year Consolidated Marksheet',
  '3rd Year Consolidated Marksheet',
  'Class 10th Board Secondary Marksheet',
  'Class 12th Board / Diploma Marksheet',
  'Official University Degree Transcript',
  'Active Backlog Clearance Certificate'
];

const CERTIFICATE_CATEGORIES = [
  'Technical Certification',
  'Hackathon & Competitions',
  'Academic Honor',
  'Research & Publication',
  'Internship Completion',
  'Leadership & Extracurricular'
] as const;

export const AcademicDocumentVault: React.FC<AcademicDocumentVaultProps> = ({
  student,
  onUpdateMarksheets,
  onUpdateCertificates,
  isReadOnly = false
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'marksheets' | 'certificates'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showUploadMarksheetModal, setShowUploadMarksheetModal] = useState(false);
  const [showUploadCertificateModal, setShowUploadCertificateModal] = useState(false);
  
  // Preview Modal
  const [previewDoc, setPreviewDoc] = useState<{
    type: 'marksheet' | 'certificate';
    title: string;
    subtitle?: string;
    fileUrl: string;
    fileName: string;
    uploadedAt: string;
    isVerified?: boolean;
    meta?: string;
  } | null>(null);

  // Marksheet Form States
  const [msSemester, setMsSemester] = useState(STANDARD_SEMESTER_OPTIONS[0]);
  const [msAcademicYear, setMsAcademicYear] = useState('2024–2025');
  const [msScore, setMsScore] = useState('');
  const [msIssuingBody, setMsIssuingBody] = useState(student.collegeName || 'Autonomous Examination Cell');
  const [msNotes, setMsNotes] = useState('');
  const [msFile, setMsFile] = useState<{ name: string; url: string; size: string } | null>(null);
  const [msError, setMsError] = useState<string | null>(null);

  // Certificate Form States
  const [certTitle, setCertTitle] = useState('');
  const [certCategory, setCertCategory] = useState<UploadedCertificateDocument['category']>('Technical Certification');
  const [certOrg, setCertOrg] = useState('');
  const [certIssueDate, setCertIssueDate] = useState('Oct 2024');
  const [certIdNumber, setCertIdNumber] = useState('');
  const [certVerifyUrl, setCertVerifyUrl] = useState('');
  const [certFile, setCertFile] = useState<{ name: string; url: string; size: string } | null>(null);
  const [certError, setCertError] = useState<string | null>(null);

  // Camera States
  const [showCamera, setShowCamera] = useState(false);
  const [cameraTarget, setCameraTarget] = useState<'marksheet' | 'certificate'>('marksheet');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const marksheetFileInputRef = useRef<HTMLInputElement>(null);
  const certificateFileInputRef = useRef<HTMLInputElement>(null);

  const academicStanding = calculateAcademicStanding(student.admissionYear || 2021, student.graduationYear || 2025);

  const marksheets = student.uploadedMarksheets || [];
  const certificates = student.uploadedCertificates || [];

  // File Upload Handlers
  const handleMarksheetFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const sizeStr = file.size > 1024 * 1024 
        ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` 
        : `${(file.size / 1024).toFixed(1)} KB`;
      setMsFile({
        name: file.name,
        url: dataUrl,
        size: sizeStr
      });
      setMsError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleCertificateFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const sizeStr = file.size > 1024 * 1024 
        ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` 
        : `${(file.size / 1024).toFixed(1)} KB`;
      setCertFile({
        name: file.name,
        url: dataUrl,
        size: sizeStr
      });
      setCertError(null);
    };
    reader.readAsDataURL(file);
  };

  // Camera Handlers
  const startCamera = async (target: 'marksheet' | 'certificate') => {
    setCameraTarget(target);
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
    } catch (err) {
      console.error('Camera error:', err);
      setCameraError('Unable to access camera. Please upload an image/document file from your device.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
  };

  const captureCameraSnapshot = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    stopCamera();

    const timestamp = Date.now();
    if (cameraTarget === 'marksheet') {
      setMsFile({
        name: `marksheet_scan_${timestamp}.jpg`,
        url: dataUrl,
        size: '520 KB'
      });
    } else {
      setCertFile({
        name: `certificate_scan_${timestamp}.jpg`,
        url: dataUrl,
        size: '520 KB'
      });
    }
  };

  // Save Marksheet
  const handleSaveMarksheet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msFile) {
      setMsError('Please upload a mark sheet document or capture an image.');
      return;
    }

    const newDoc: AcademicMarksheetDocument = {
      id: `ms-${Date.now()}`,
      semesterOrYear: msSemester,
      academicYear: msAcademicYear || '2024–2025',
      scoreOrGpa: msScore ? msScore.trim() : undefined,
      issuingAuthority: msIssuingBody.trim() || student.collegeName,
      fileName: msFile.name,
      fileType: msFile.url.startsWith('data:image') ? 'image' : 'pdf',
      fileUrl: msFile.url,
      fileSize: msFile.size,
      uploadedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      isVerified: true,
      verifiedBy: 'Central Placement Verification Cell (TPO)',
      verifiedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      notes: msNotes.trim() || undefined
    };

    onUpdateMarksheets([newDoc, ...marksheets]);
    setShowUploadMarksheetModal(false);
    setMsFile(null);
    setMsScore('');
    setMsNotes('');
    setMsError(null);
  };

  // Save Certificate
  const handleSaveCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certTitle.trim()) {
      setCertError('Please specify the certification or award title.');
      return;
    }
    if (!certOrg.trim()) {
      setCertError('Please specify the issuing organization or institute.');
      return;
    }
    if (!certFile) {
      setCertError('Please upload the certificate document or capture an image.');
      return;
    }

    const newCert: UploadedCertificateDocument = {
      id: `cert-${Date.now()}`,
      title: certTitle.trim(),
      category: certCategory,
      issuingOrganization: certOrg.trim(),
      issueDate: certIssueDate.trim() || '2024',
      credentialId: certIdNumber.trim() || undefined,
      verificationUrl: certVerifyUrl.trim() || undefined,
      fileName: certFile.name,
      fileType: certFile.url.startsWith('data:image') ? 'image' : 'pdf',
      fileUrl: certFile.url,
      fileSize: certFile.size,
      uploadedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      isVerified: true,
      verifiedBy: 'Central Placement Verification Cell (TPO)',
      verifiedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };

    onUpdateCertificates([newCert, ...certificates]);
    setShowUploadCertificateModal(false);
    setCertFile(null);
    setCertTitle('');
    setCertOrg('');
    setCertIdNumber('');
    setCertVerifyUrl('');
    setCertError(null);
  };

  // Delete Handlers
  const handleDeleteMarksheet = (id: string) => {
    onUpdateMarksheets(marksheets.filter(m => m.id !== id));
  };

  const handleDeleteCertificate = (id: string) => {
    onUpdateCertificates(certificates.filter(c => c.id !== id));
  };

  // Filtered lists
  const filteredMarksheets = marksheets.filter(m => 
    !searchQuery || 
    m.semesterOrYear.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (m.scoreOrGpa && m.scoreOrGpa.toLowerCase().includes(searchQuery.toLowerCase())) ||
    m.fileName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCertificates = certificates.filter(c => 
    !searchQuery || 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.issuingOrganization.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalDocsCount = marksheets.length + certificates.length;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center shrink-0 shadow-2xs">
            <FileBadge2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-bold text-slate-900">
                Academic Mark Sheets & Achievement Certificates Vault
              </h2>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>TPO Document Clearance Vault</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Upload previous year grade cards, semester marksheets, hackathon prizes, and technical credentials in image or documentation format.
            </p>
          </div>
        </div>

        {/* Action Upload Buttons */}
        {!isReadOnly && (
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setShowUploadMarksheetModal(true)}
              id="upload-marksheet-btn"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl transition-all cursor-pointer shadow-2xs active:scale-95"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Mark Sheet</span>
            </button>

            <button
              type="button"
              onClick={() => setShowUploadCertificateModal(true)}
              id="upload-certificate-btn"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl transition-all cursor-pointer shadow-2xs active:scale-95"
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Upload Certificate</span>
            </button>
          </div>
        )}
      </div>

      {/* Academic Standing & Placement Guidance Banner */}
      <div className="p-4 bg-gradient-to-r from-indigo-50/90 via-sky-50/60 to-purple-50/70 border border-indigo-100 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-indigo-600 text-white shrink-0 shadow-2xs">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-xs text-indigo-950">
                Academic Standing: {academicStanding.currentYearLabel}
              </span>
              <span className="text-[10px] bg-white border border-indigo-200 text-indigo-700 font-semibold px-2 py-0.5 rounded-full">
                Batch {student.admissionYear || 2021} – {student.graduationYear || 2025}
              </span>
            </div>
            <p className="text-xs text-indigo-900 mt-1">
              Recruiter Requirement: Upload <strong className="text-slate-900">{academicStanding.suggestedMarksheetName}</strong> or preceding semester marksheets for automatic eligibility verification.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-center">
          <div className="text-right">
            <div className="text-xs font-bold text-slate-800">{totalDocsCount} Uploaded</div>
            <div className="text-[10px] text-slate-500">{marksheets.length} Marksheets • {certificates.length} Certs</div>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl max-w-fit">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'all'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>All Documents</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700">{totalDocsCount}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('marksheets')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'marksheets'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Mark Sheets</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-indigo-100 text-indigo-800">{marksheets.length}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('certificates')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'certificates'
                ? 'bg-white text-amber-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Certificates & Honors</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800">{certificates.length}</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search uploaded documents..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Documents Grid Display */}
      <div className="space-y-6">
        {/* Section 1: Mark Sheets */}
        {(activeTab === 'all' || activeTab === 'marksheets') && (
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-600" />
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Academic Mark Sheets ({filteredMarksheets.length})
                </h3>
              </div>
              <span className="text-[11px] text-slate-500">
                10th, 12th / Diploma, Semester Grade Sheets & Transcripts
              </span>
            </div>

            {filteredMarksheets.length === 0 ? (
              <div className="p-6 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/40 space-y-2">
                <FileText className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs font-semibold text-slate-700">No mark sheets uploaded yet</p>
                <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                  Upload your previous semester grade cards or 10th/12th marksheets in PDF or image format to verify your academic credentials.
                </p>
                {!isReadOnly && (
                  <button
                    type="button"
                    onClick={() => setShowUploadMarksheetModal(true)}
                    className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-white border border-indigo-200 rounded-lg hover:bg-indigo-50 cursor-pointer shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Upload First Mark Sheet</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredMarksheets.map((ms) => (
                  <div
                    key={ms.id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-indigo-300 transition-all space-y-3 group shadow-2xs relative"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <div 
                          onClick={() => setPreviewDoc({
                            type: 'marksheet',
                            title: ms.semesterOrYear,
                            subtitle: `${ms.issuingAuthority || student.collegeName} • ${ms.academicYear}`,
                            fileUrl: ms.fileUrl,
                            fileName: ms.fileName,
                            uploadedAt: ms.uploadedAt,
                            isVerified: ms.isVerified,
                            meta: ms.scoreOrGpa ? `Score / SGPA: ${ms.scoreOrGpa}` : undefined
                          })}
                          className="w-12 h-12 rounded-xl bg-white border border-slate-200 overflow-hidden flex items-center justify-center shrink-0 shadow-2xs cursor-pointer hover:scale-105 transition-transform"
                        >
                          {ms.fileUrl.startsWith('data:image') ? (
                            <img src={ms.fileUrl} alt={ms.semesterOrYear} className="w-full h-full object-cover" />
                          ) : (
                            <FileCheck2 className="w-6 h-6 text-indigo-600" />
                          )}
                        </div>

                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-slate-900 truncate">
                            {ms.semesterOrYear}
                          </h4>
                          <p className="text-[11px] text-slate-500 truncate">
                            {ms.issuingAuthority || student.collegeName}
                          </p>
                        </div>
                      </div>

                      {ms.scoreOrGpa && (
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 shrink-0">
                          {ms.scoreOrGpa}
                        </span>
                      )}
                    </div>

                    <div className="text-[10px] text-slate-500 space-y-0.5 border-t border-slate-100 pt-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] text-slate-600 truncate max-w-[150px]">{ms.fileName}</span>
                        <span>{ms.fileSize || '380 KB'}</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-400">
                        <span>Year: {ms.academicYear}</span>
                        <span>{ms.uploadedAt}</span>
                      </div>
                    </div>

                    {/* Verification Status & Actions */}
                    <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        <span>TPO Verified</span>
                      </span>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setPreviewDoc({
                            type: 'marksheet',
                            title: ms.semesterOrYear,
                            subtitle: `${ms.issuingAuthority || student.collegeName} • ${ms.academicYear}`,
                            fileUrl: ms.fileUrl,
                            fileName: ms.fileName,
                            uploadedAt: ms.uploadedAt,
                            isVerified: ms.isVerified,
                            meta: ms.scoreOrGpa ? `Score / SGPA: ${ms.scoreOrGpa}` : undefined
                          })}
                          className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                          title="Preview document"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {!isReadOnly && (
                          <button
                            type="button"
                            onClick={() => handleDeleteMarksheet(ms.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Remove marksheet"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Section 2: Achievement & Skill Certificates */}
        {(activeTab === 'all' || activeTab === 'certificates') && (
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" />
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Achievement & Technical Certificates ({filteredCertificates.length})
                </h3>
              </div>
              <span className="text-[11px] text-slate-500">
                Hackathons, Cloud Specializations, Honors & Internships
              </span>
            </div>

            {filteredCertificates.length === 0 ? (
              <div className="p-6 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/40 space-y-2">
                <Award className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs font-semibold text-slate-700">No certificates uploaded yet</p>
                <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                  Upload your certificates of completion, hackathon awards, coding ranks, and course credentials to boost your profile score.
                </p>
                {!isReadOnly && (
                  <button
                    type="button"
                    onClick={() => setShowUploadCertificateModal(true)}
                    className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 cursor-pointer shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Upload First Certificate</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredCertificates.map((cert) => (
                  <div
                    key={cert.id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-amber-300 transition-all space-y-3 group shadow-2xs relative"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <div 
                          onClick={() => setPreviewDoc({
                            type: 'certificate',
                            title: cert.title,
                            subtitle: `${cert.issuingOrganization} • ${cert.issueDate}`,
                            fileUrl: cert.fileUrl,
                            fileName: cert.fileName,
                            uploadedAt: cert.uploadedAt,
                            isVerified: cert.isVerified,
                            meta: cert.credentialId ? `Credential ID: ${cert.credentialId}` : undefined
                          })}
                          className="w-12 h-12 rounded-xl bg-white border border-slate-200 overflow-hidden flex items-center justify-center shrink-0 shadow-2xs cursor-pointer hover:scale-105 transition-transform"
                        >
                          {cert.fileUrl.startsWith('data:image') ? (
                            <img src={cert.fileUrl} alt={cert.title} className="w-full h-full object-cover" />
                          ) : (
                            <Award className="w-6 h-6 text-amber-500" />
                          )}
                        </div>

                        <div className="min-w-0">
                          <span className="text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200 inline-block mb-0.5">
                            {cert.category}
                          </span>
                          <h4 className="text-xs font-bold text-slate-900 truncate">
                            {cert.title}
                          </h4>
                          <p className="text-[11px] text-slate-500 truncate">
                            {cert.issuingOrganization}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="text-[10px] text-slate-500 space-y-0.5 border-t border-slate-100 pt-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] text-slate-600 truncate max-w-[150px]">{cert.fileName}</span>
                        <span>{cert.fileSize || '420 KB'}</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-400">
                        <span>Issued: {cert.issueDate}</span>
                        <span>{cert.uploadedAt}</span>
                      </div>
                    </div>

                    {/* Verification Status & Actions */}
                    <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        <span>Verified Credential</span>
                      </span>

                      <div className="flex items-center gap-1">
                        {cert.verificationUrl && (
                          <a
                            href={cert.verificationUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="Open external verification link"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}

                        <button
                          type="button"
                          onClick={() => setPreviewDoc({
                            type: 'certificate',
                            title: cert.title,
                            subtitle: `${cert.issuingOrganization} • ${cert.issueDate}`,
                            fileUrl: cert.fileUrl,
                            fileName: cert.fileName,
                            uploadedAt: cert.uploadedAt,
                            isVerified: cert.isVerified,
                            meta: cert.credentialId ? `Credential ID: ${cert.credentialId}` : undefined
                          })}
                          className="p-1.5 text-slate-500 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                          title="Preview certificate"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {!isReadOnly && (
                          <button
                            type="button"
                            onClick={() => handleDeleteCertificate(cert.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Remove certificate"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ================= MODALS ================= */}

      {/* 1. Upload Mark Sheet Modal */}
      {showUploadMarksheetModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-indigo-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-2xs">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Upload Academic Mark Sheet</h3>
                  <p className="text-[11px] text-slate-500">Add semester grade card or previous year transcript</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowUploadMarksheetModal(false);
                  setMsFile(null);
                  setMsError(null);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMarksheet} className="p-6 space-y-4 text-xs text-slate-700">
              {msError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{msError}</span>
                </div>
              )}

              {/* Semester / Year selector */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Marksheet / Grade Card Term *
                </label>
                <select
                  value={msSemester}
                  onChange={(e) => setMsSemester(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-xs bg-white font-medium"
                >
                  {STANDARD_SEMESTER_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Academic Session / Year
                  </label>
                  <input
                    type="text"
                    value={msAcademicYear}
                    onChange={(e) => setMsAcademicYear(e.target.value)}
                    placeholder="e.g. 2024–2025"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    SGPA / Percentage / Grade
                  </label>
                  <input
                    type="text"
                    value={msScore}
                    onChange={(e) => setMsScore(e.target.value)}
                    placeholder="e.g. 9.15 SGPA or 91.2%"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Issuing Institute / Examination Cell
                </label>
                <input
                  type="text"
                  value={msIssuingBody}
                  onChange={(e) => setMsIssuingBody(e.target.value)}
                  placeholder="e.g. National Institute of Technology / Autonomous Board"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-xs"
                />
              </div>

              {/* Upload Dropzone / Camera Action */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Upload Document or Image *
                </label>
                
                {msFile ? (
                  <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <div className="w-10 h-10 rounded-lg bg-white border border-indigo-200 overflow-hidden flex items-center justify-center shrink-0">
                        {msFile.url.startsWith('data:image') ? (
                          <img src={msFile.url} alt="Attached" className="w-full h-full object-cover" />
                        ) : (
                          <FileText className="w-5 h-5 text-indigo-600" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 text-xs truncate">{msFile.name}</p>
                        <p className="text-[10px] text-slate-500">{msFile.size} • Ready for verification</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setMsFile(null)}
                      className="p-1 text-slate-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-slate-300 hover:border-indigo-400 bg-slate-50/50 rounded-2xl p-4 text-center space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center">
                      <Upload className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-semibold text-slate-700">Choose a Marksheet Document or Image</p>
                    <p className="text-[11px] text-slate-400">PDF, PNG, JPG or WEBP up to 10MB</p>
                    <div className="flex items-center justify-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => marksheetFileInputRef.current?.click()}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Browse File</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => startCamera('marksheet')}
                        className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <Camera className="w-3.5 h-3.5 text-slate-500" />
                        <span>Scan Camera</span>
                      </button>
                    </div>
                  </div>
                )}

                <input
                  type="file"
                  ref={marksheetFileInputRef}
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleMarksheetFile(f);
                  }}
                  accept="image/*,application/pdf"
                  className="hidden"
                />
              </div>

              {/* Actions */}
              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowUploadMarksheetModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Mark Sheet</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Upload Certificate Modal */}
      {showUploadCertificateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-amber-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-2xs">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Upload Achievement Certificate</h3>
                  <p className="text-[11px] text-slate-500">Attach hackathon, course, or technical honor document</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowUploadCertificateModal(false);
                  setCertFile(null);
                  setCertError(null);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCertificate} className="p-6 space-y-4 text-xs text-slate-700">
              {certError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{certError}</span>
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Certificate / Award Title *
                </label>
                <input
                  type="text"
                  value={certTitle}
                  onChange={(e) => setCertTitle(e.target.value)}
                  placeholder="e.g. AWS Certified Solutions Architect or Smart India Hackathon Winner"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-xs"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Category *
                </label>
                <select
                  value={certCategory}
                  onChange={(e) => setCertCategory(e.target.value as UploadedCertificateDocument['category'])}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-xs bg-white font-medium"
                >
                  {CERTIFICATE_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Issuing Body / Organization *
                  </label>
                  <input
                    type="text"
                    value={certOrg}
                    onChange={(e) => setCertOrg(e.target.value)}
                    placeholder="e.g. Amazon Web Services / Google / AICTE"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Issue Date / Month & Year
                  </label>
                  <input
                    type="text"
                    value={certIssueDate}
                    onChange={(e) => setCertIssueDate(e.target.value)}
                    placeholder="e.g. Oct 2024"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Credential ID / License Number
                  </label>
                  <input
                    type="text"
                    value={certIdNumber}
                    onChange={(e) => setCertIdNumber(e.target.value)}
                    placeholder="e.g. AWS-CERT-84920"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Verification URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={certVerifyUrl}
                    onChange={(e) => setCertVerifyUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-xs"
                  />
                </div>
              </div>

              {/* Upload Dropzone / Camera Action */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Upload Certificate Document or Photo *
                </label>
                
                {certFile ? (
                  <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <div className="w-10 h-10 rounded-lg bg-white border border-amber-200 overflow-hidden flex items-center justify-center shrink-0">
                        {certFile.url.startsWith('data:image') ? (
                          <img src={certFile.url} alt="Attached" className="w-full h-full object-cover" />
                        ) : (
                          <Award className="w-5 h-5 text-amber-500" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 text-xs truncate">{certFile.name}</p>
                        <p className="text-[10px] text-slate-500">{certFile.size} • Ready for verification</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCertFile(null)}
                      className="p-1 text-slate-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-slate-300 hover:border-amber-400 bg-slate-50/50 rounded-2xl p-4 text-center space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 mx-auto flex items-center justify-center">
                      <Upload className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-semibold text-slate-700">Choose Certificate Document or Image</p>
                    <p className="text-[11px] text-slate-400">PDF, PNG, JPG or WEBP up to 10MB</p>
                    <div className="flex items-center justify-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => certificateFileInputRef.current?.click()}
                        className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Browse File</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => startCamera('certificate')}
                        className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <Camera className="w-3.5 h-3.5 text-slate-500" />
                        <span>Scan Camera</span>
                      </button>
                    </div>
                  </div>
                )}

                <input
                  type="file"
                  ref={certificateFileInputRef}
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleCertificateFile(f);
                  }}
                  accept="image/*,application/pdf"
                  className="hidden"
                />
              </div>

              {/* Actions */}
              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowUploadCertificateModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Certificate</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Live Camera Scan Modal */}
      {showCamera && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-indigo-600" />
                <h4 className="text-xs font-bold text-slate-900">
                  Scan {cameraTarget === 'marksheet' ? 'Academic Mark Sheet' : 'Certificate'} Document
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
                <div className="relative rounded-2xl overflow-hidden bg-black aspect-video flex items-center justify-center border-2 border-indigo-500 shadow-inner">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  {/* Overlay Frame */}
                  <div className="absolute inset-4 border-2 border-white/70 border-dashed rounded-xl pointer-events-none flex items-center justify-center">
                    <span className="text-[11px] text-white bg-black/70 px-2.5 py-1 rounded-lg font-medium shadow-md">
                      Align document edges within guide frame
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
                    onClick={captureCameraSnapshot}
                    className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Capture Snapshot</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Full Document HD Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 max-h-[90vh] flex flex-col">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{previewDoc.title}</h4>
                  <p className="text-[10px] text-slate-500">
                    {previewDoc.subtitle} • {previewDoc.fileName} • Uploaded {previewDoc.uploadedAt}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto flex-1 flex items-center justify-center bg-slate-100">
              {previewDoc.fileUrl.startsWith('data:image') ? (
                <div className="relative group max-w-full">
                  <img
                    src={previewDoc.fileUrl}
                    alt={previewDoc.title}
                    className="max-h-[65vh] w-auto object-contain rounded-2xl border border-slate-300 shadow-lg bg-white"
                  />
                  {/* Verified Watermark */}
                  <div className="absolute top-3 right-3 bg-emerald-600/90 backdrop-blur-xs text-white px-2.5 py-1 rounded-full text-[10px] font-bold shadow-md flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>TPO Clearance Stamp</span>
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3 shadow-xs">
                  <FileText className="w-16 h-16 text-indigo-600 mx-auto" />
                  <div>
                    <h5 className="font-bold text-slate-900 text-sm">{previewDoc.fileName}</h5>
                    <p className="text-xs text-slate-500 mt-1">Official Document File for {student.name}</p>
                    {previewDoc.meta && (
                      <p className="text-xs font-semibold text-indigo-700 mt-1">{previewDoc.meta}</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="p-3 bg-white border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                ✓ Verified for Campus Placements ({student.collegeName})
              </span>

              <div className="flex items-center gap-2">
                <a
                  href={previewDoc.fileUrl}
                  download={previewDoc.fileName}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </a>
                <button
                  type="button"
                  onClick={() => setPreviewDoc(null)}
                  className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
