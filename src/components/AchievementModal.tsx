import React, { useState, useRef } from 'react';
import { Achievement, AchievementCategory } from '../types';
import { 
  Trophy, 
  X, 
  Check, 
  Sparkles, 
  Calendar, 
  Building2, 
  Award, 
  Link as LinkIcon,
  Upload,
  FileCheck2,
  Trash2,
  Eye,
  ShieldCheck
} from 'lucide-react';

interface AchievementModalProps {
  onClose: () => void;
  onSave: (achievement: Achievement) => void;
  initialData?: Achievement | null;
}

const CATEGORIES: { id: AchievementCategory; label: string; desc: string }[] = [
  { id: 'Hackathon', label: 'Hackathon & Competitions', desc: 'Smart India Hackathon, MLH, College Hackathons' },
  { id: 'Competitive Programming', label: 'Coding Contests', desc: 'Codeforces, LeetCode, CodeChef, Google Kickstart' },
  { id: 'Academic Honor', label: 'Academic & Institute Honors', desc: 'Department topper, Dean\'s Merit list, Merit scholarship' },
  { id: 'Research & Publication', label: 'Research & Publications', desc: 'IEEE, Springer, Conference paper presentations' },
  { id: 'Open Source', label: 'Open Source Contributions', desc: 'GSoC, GitHub public libraries, community contributions' },
  { id: 'Leadership & Club', label: 'Leadership & Extracurricular', desc: 'Technical head, student council, placement cell lead' },
];

export const AchievementModal: React.FC<AchievementModalProps> = ({
  onClose,
  onSave,
  initialData,
}) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [category, setCategory] = useState<AchievementCategory>(initialData?.category || 'Hackathon');
  const [organization, setOrganization] = useState(initialData?.organization || '');
  const [issueDate, setIssueDate] = useState(initialData?.issueDate || '');
  const [badgeLevel, setBadgeLevel] = useState(initialData?.badgeLevel || 'Winner / 1st Place');
  const [description, setDescription] = useState(initialData?.description || '');
  const [link, setLink] = useState(initialData?.link || initialData?.proofUrl || '');
  const [uploadedProofFile, setUploadedProofFile] = useState<{ name: string; url: string; size: string } | null>(
    initialData?.proofUrl && initialData.proofUrl.startsWith('data:')
      ? { name: `${initialData.title || 'Certificate'}.png`, url: initialData.proofUrl, size: '420 KB' }
      : null
  );
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const sizeStr = file.size > 1024 * 1024 
        ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` 
        : `${(file.size / 1024).toFixed(1)} KB`;
      setUploadedProofFile({
        name: file.name,
        url: dataUrl,
        size: sizeStr
      });
      setLink(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide an achievement title.');
      return;
    }
    if (!organization.trim()) {
      setError('Please provide the organizing body, institution, or platform.');
      return;
    }

    const proof = uploadedProofFile?.url || (link.trim() ? link.trim() : undefined);

    const newAchievement: Achievement = {
      id: initialData?.id || `ach-${Date.now()}`,
      title: title.trim(),
      category,
      organization: organization.trim(),
      issueDate: issueDate.trim() || new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      badgeLevel: badgeLevel.trim(),
      description: description.trim() || 'Demonstrated technical excellence, problem solving, and leadership.',
      link: link.trim() || undefined,
      proofUrl: proof
    };

    onSave(newAchievement);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 border border-amber-500/20 flex items-center justify-center">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {initialData ? 'Edit Achievement' : 'Add New Student Achievement'}
              </h3>
              <p className="text-[11px] text-slate-500">
                Showcase your hackathon wins, honors, and upload proof documents
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs text-slate-700">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 font-semibold">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Achievement / Award Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Smart India Hackathon 2024 Winner or LeetCode Top 2% Global"
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-xs"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Achievement Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as AchievementCategory)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-xs bg-white"
            >
              {CATEGORIES.map(c => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* Organization & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Organizing Body / Host *
              </label>
              <div className="relative">
                <Building2 className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder="e.g. AICTE / IEEE / Google"
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-xs"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Date / Month & Year
              </label>
              <div className="relative">
                <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  placeholder="e.g. Oct 2024"
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Badge Level & Link */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Rank / Honor Level
              </label>
              <div className="relative">
                <Award className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={badgeLevel}
                  onChange={(e) => setBadgeLevel(e.target.value)}
                  placeholder="e.g. Winner / 1st Place, Finalist"
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Verification Link (Optional)
              </label>
              <div className="relative">
                <LinkIcon className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="url"
                  value={link.startsWith('data:') ? '' : link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="https://credential..."
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Certificate Documentation / Image Upload */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Certificate Document or Image (Proof)
            </label>
            {uploadedProofFile ? (
              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <div className="w-10 h-10 rounded-lg bg-white border border-amber-200 overflow-hidden flex items-center justify-center shrink-0">
                    {uploadedProofFile.url.startsWith('data:image') ? (
                      <img src={uploadedProofFile.url} alt="Proof" className="w-full h-full object-cover" />
                    ) : (
                      <Award className="w-5 h-5 text-amber-600" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 text-xs truncate">{uploadedProofFile.name}</p>
                    <p className="text-[10px] text-slate-500">{uploadedProofFile.size} • Attached</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setUploadedProofFile(null);
                    setLink('');
                  }}
                  className="p-1 text-slate-400 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="border border-dashed border-slate-300 hover:border-amber-400 bg-slate-50/70 rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Upload className="w-4 h-4 text-amber-600" />
                  <span className="text-[11px] text-slate-600">Attach certificate PDF or image</span>
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1 bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Choose File
                </button>
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*,application/pdf"
              className="hidden"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Brief Impact / Work Summary
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what problem you solved, technology tools used, and results..."
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-xs"
            />
          </div>

          <div className="p-3 bg-indigo-50/60 border border-indigo-100 rounded-xl flex items-start gap-2 text-[11px] text-indigo-900">
            <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <span>
              Verified achievements give a +2.0 boost to your AI Placement Fit Score and are highlighted in recruiter shortlist summaries.
            </span>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="save-achievement-btn"
              className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{initialData ? 'Update Achievement' : 'Add to Profile'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

