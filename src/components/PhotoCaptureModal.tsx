import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  Upload, 
  X, 
  RefreshCw, 
  Check, 
  AlertCircle, 
  User, 
  Sparkles,
  Trash2,
  Dice5,
  Wand2,
  Search,
  Filter
} from 'lucide-react';
import { AI_SUGGESTED_AVATARS, DICEBEAR_STYLES, generateCustomDicebearUrl, AIAvatar } from '../data/aiAvatars';

interface PhotoCaptureModalProps {
  currentPhoto?: string;
  onSavePhoto: (dataUrl: string) => void;
  onRemovePhoto?: () => void;
  onClose: () => void;
  title?: string;
}

export const PhotoCaptureModal: React.FC<PhotoCaptureModalProps> = ({
  currentPhoto,
  onSavePhoto,
  onRemovePhoto,
  onClose,
  title = 'Student Profile Avatar & Picture',
}) => {
  const [mode, setMode] = useState<'ai_avatars' | 'upload' | 'camera'>('ai_avatars');
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentPhoto || null);
  const [selectedAvatarId, setSelectedAvatarId] = useState<string | null>(null);
  
  // AI Avatar Filter & Generator State
  const [avatarCategory, setAvatarCategory] = useState<string>('all');
  const [avatarSearch, setAvatarSearch] = useState<string>('');
  
  // Custom AI Avatar Generator state
  const [genSeed, setGenSeed] = useState<string>('NitinDeveloper');
  const [genStyle, setGenStyle] = useState<string>('bottts');
  const [generatedAvatarUrl, setGeneratedAvatarUrl] = useState<string>(
    generateCustomDicebearUrl('bottts', 'NitinDeveloper')
  );

  // Camera State
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Stop camera media stream
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  // Start camera
  const startCamera = async () => {
    setCameraError(null);
    stopCamera();
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera not supported in this browser environment.');
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 640 },
          facingMode: 'user'
        },
        audio: false
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }
      setCameraActive(true);
    } catch (err: any) {
      console.warn('Camera access error:', err);
      setCameraError(err?.message || 'Could not access camera. Please check camera permissions or select an AI Avatar or upload an image.');
      setCameraActive(false);
    }
  };

  // Snap photo from live video feed
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    setIsCapturing(true);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const size = Math.min(video.videoWidth || 480, video.videoHeight || 480);
    
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Center crop square
    const startX = ((video.videoWidth || size) - size) / 2;
    const startY = ((video.videoHeight || size) - size) / 2;

    ctx.drawImage(video, startX, startY, size, size, 0, 0, size, size);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
    setPreviewUrl(dataUrl);
    setSelectedAvatarId(null);
    stopCamera();
    setIsCapturing(false);
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setPreviewUrl(result);
      setSelectedAvatarId(null);
    };
    reader.readAsDataURL(file);
  };

  // Generate new dynamic AI avatar
  const handleRegenerateAIAvatar = (style?: string, seedVal?: string) => {
    const activeStyle = style || genStyle;
    const activeSeed = seedVal !== undefined ? seedVal : genSeed;
    const newUrl = generateCustomDicebearUrl(activeStyle, activeSeed);
    setGeneratedAvatarUrl(newUrl);
    setPreviewUrl(newUrl);
    setSelectedAvatarId(`custom-${activeStyle}-${activeSeed}`);
  };

  const handleRandomizeSeed = () => {
    const randomKeywords = [
      'TechMaster', 'AIPioneer', 'CodeNinja', 'DeepLearner', 'CloudArchitect', 
      'FullStackGenius', 'CyberPhantom', 'CampusDev', 'AlgorithmAce', 'ByteHero',
      'QuantumPilot', 'NeuralCoder', 'DataSorcerer', 'RoboticsPro', 'VisionCraft'
    ];
    const randomWord = randomKeywords[Math.floor(Math.random() * randomKeywords.length)] + Math.floor(Math.random() * 999);
    setGenSeed(randomWord);
    handleRegenerateAIAvatar(genStyle, randomWord);
  };

  // Cleanup camera stream on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Switch modes
  const handleSwitchMode = (newMode: 'ai_avatars' | 'upload' | 'camera') => {
    setMode(newMode);
    if (newMode === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }
  };

  const handleSelectPredefinedAvatar = (avatar: AIAvatar) => {
    setPreviewUrl(avatar.url);
    setSelectedAvatarId(avatar.id);
  };

  const handleSave = () => {
    if (previewUrl) {
      onSavePhoto(previewUrl);
    }
    stopCamera();
    onClose();
  };

  // Filter avatars based on search & category
  const filteredAvatars = AI_SUGGESTED_AVATARS.filter(av => {
    const matchCategory = avatarCategory === 'all' || av.category === avatarCategory;
    const matchSearch = avatarSearch.trim() === '' || 
      av.name.toLowerCase().includes(avatarSearch.toLowerCase()) ||
      av.tags.some(t => t.toLowerCase().includes(avatarSearch.toLowerCase()));
    return matchCategory && matchSearch;
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">{title}</h3>
              <p className="text-[11px] text-slate-500">
                Choose AI Suggested Avatars, Instant Persona Generator, Upload, or Live Webcam
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            id="close-photo-modal-btn"
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 bg-slate-50/50 p-1.5 text-xs font-semibold gap-1.5">
          <button
            type="button"
            onClick={() => handleSwitchMode('ai_avatars')}
            className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              mode === 'ai_avatars'
                ? 'bg-white text-indigo-700 shadow-xs border border-slate-200 font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>AI Suggested Avatars</span>
          </button>

          <button
            type="button"
            onClick={() => handleSwitchMode('upload')}
            className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              mode === 'upload'
                ? 'bg-white text-indigo-700 shadow-xs border border-slate-200 font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Upload Device File</span>
          </button>

          <button
            type="button"
            onClick={() => handleSwitchMode('camera')}
            className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              mode === 'camera'
                ? 'bg-white text-indigo-700 shadow-xs border border-slate-200 font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Take Live Photo (Webcam)</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          
          {/* TAB 1: AI SUGGESTED AVATARS & DYNAMIC GENERATOR */}
          {mode === 'ai_avatars' && (
            <div className="space-y-5">
              
              {/* Active Selected Avatar Highlight */}
              <div className="p-3.5 bg-gradient-to-r from-indigo-50/80 via-blue-50/50 to-slate-50 border border-indigo-100 rounded-2xl flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-indigo-600 shadow-md bg-white flex items-center justify-center shrink-0">
                    {previewUrl ? (
                      <img src={previewUrl} alt="Selected Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-8 h-8 text-indigo-300" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-900">Current Selected Profile Avatar</span>
                      <span className="text-[10px] bg-indigo-100 text-indigo-700 font-bold px-2 py-0.5 rounded-full">
                        Ready
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      Click any AI avatar below or generate a custom seed avatar instantly.
                    </p>
                  </div>
                </div>

                {previewUrl && (
                  <button
                    type="button"
                    onClick={handleSave}
                    className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-all cursor-pointer shrink-0 flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Apply This Avatar</span>
                  </button>
                )}
              </div>

              {/* 🪄 Instant AI Avatar Generator from Name / Seed */}
              <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-3.5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-indigo-500/30 border border-indigo-400/40 flex items-center justify-center text-indigo-300">
                      <Wand2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">AI Persona & Avatar Generator</h4>
                      <p className="text-[10px] text-slate-400">Generate unique 3D/AI avatars dynamically</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleRandomizeSeed}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-indigo-300 hover:text-white border border-slate-700 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                  >
                    <Dice5 className="w-3.5 h-3.5" />
                    <span>Randomize Prompt</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div className="sm:col-span-2 flex gap-2">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={genSeed}
                        onChange={(e) => {
                          setGenSeed(e.target.value);
                          handleRegenerateAIAvatar(genStyle, e.target.value);
                        }}
                        placeholder="Enter name or persona prompt..."
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <select
                      value={genStyle}
                      onChange={(e) => {
                        setGenStyle(e.target.value);
                        handleRegenerateAIAvatar(e.target.value, genSeed);
                      }}
                      className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                    >
                      {DICEBEAR_STYLES.map(style => (
                        <option key={style.id} value={style.id}>{style.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleRegenerateAIAvatar(genStyle, genSeed)}
                      className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Generate & Preview</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Filter & Category Pills */}
              <div className="space-y-2.5">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                    {[
                      { id: 'all', label: 'All AI Avatars' },
                      { id: 'ai_tech', label: '🤖 Tech & AI' },
                      { id: 'professional', label: '👔 Corporate' },
                      { id: 'campus', label: '🎓 Student' },
                      { id: '3d_render', label: '🎨 3D Stylized' },
                      { id: 'cyber', label: '👾 Cyber & Pixel' },
                    ].map(cat => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setAvatarCategory(cat.id)}
                        className={`px-3 py-1.5 rounded-xl font-semibold transition-all whitespace-nowrap cursor-pointer ${
                          avatarCategory === cat.id
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>

                  <div className="relative min-w-[160px]">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                    <input
                      type="text"
                      value={avatarSearch}
                      onChange={(e) => setAvatarSearch(e.target.value)}
                      placeholder="Search styles..."
                      className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {/* Avatars Grid */}
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 pt-2">
                  {filteredAvatars.map((av) => {
                    const isSelected = previewUrl === av.url || selectedAvatarId === av.id;
                    return (
                      <button
                        key={av.id}
                        type="button"
                        onClick={() => handleSelectPredefinedAvatar(av)}
                        className={`group relative flex flex-col items-center p-2 rounded-2xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50/70 shadow-md ring-2 ring-indigo-500 scale-105'
                            : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50 hover:scale-105'
                        }`}
                      >
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 group-hover:shadow-sm">
                          <img 
                            src={av.url} 
                            alt={av.name} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200" 
                          />
                        </div>
                        <span className="text-[10px] font-bold text-slate-700 mt-1.5 text-center truncate w-full">
                          {av.name}
                        </span>
                        {isSelected && (
                          <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-xs">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: UPLOAD FROM DEVICE */}
          {mode === 'upload' && (
            <div className="space-y-4 text-center py-4">
              <div className="relative mx-auto w-36 h-36 rounded-full overflow-hidden border-4 border-indigo-100 shadow-md bg-slate-100 flex items-center justify-center group">
                {previewUrl ? (
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <User className="w-16 h-16 text-slate-300" />
                )}
              </div>

              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                  id="profile-file-input"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  id="choose-image-file-btn"
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl transition-all cursor-pointer shadow-2xs active:scale-95"
                >
                  <Upload className="w-4 h-4" />
                  <span>Choose Image File from Computer / Phone</span>
                </button>
                <p className="text-[11px] text-slate-400 mt-2">
                  Supports JPG, PNG, WebP or SVG format up to 5MB.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: LIVE CAMERA WEBCAM SNAPSHOT */}
          {mode === 'camera' && (
            <div className="space-y-4 text-center py-2">
              {cameraError ? (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 space-y-2 text-left">
                  <div className="flex items-center gap-1.5 font-bold">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Camera Permission or Device Notice</span>
                  </div>
                  <p className="text-[11px] text-amber-700">{cameraError}</p>
                  <button
                    type="button"
                    onClick={startCamera}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-amber-300 rounded-lg text-amber-900 font-semibold text-[11px] hover:bg-amber-100"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Try Again</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Camera Video Viewfinder */}
                  <div className="relative mx-auto w-52 h-52 sm:w-60 sm:h-60 rounded-2xl overflow-hidden border-2 border-indigo-500 shadow-md bg-black flex items-center justify-center">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className={`w-full h-full object-cover scale-x-[-1] ${!cameraActive ? 'hidden' : ''}`}
                    />
                    {!cameraActive && (
                      <div className="text-slate-400 text-xs flex flex-col items-center gap-2">
                        <RefreshCw className="w-6 h-6 animate-spin text-indigo-400" />
                        <span>Starting webcam video feed...</span>
                      </div>
                    )}
                    {/* Viewfinder crosshairs */}
                    <div className="absolute inset-4 border border-white/40 rounded-full pointer-events-none"></div>
                  </div>

                  {/* Hidden Canvas for capture rendering */}
                  <canvas ref={canvasRef} className="hidden" />

                  {/* Capture Button */}
                  <div className="flex items-center justify-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={capturePhoto}
                      disabled={!cameraActive || isCapturing}
                      id="snap-photo-btn"
                      className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-xl shadow-md transition-all cursor-pointer active:scale-95"
                    >
                      <Camera className="w-4 h-4" />
                      <span>{isCapturing ? 'Snapping...' : 'Snap Snapshot'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={startCamera}
                      title="Restart Video Feed"
                      className="p-2.5 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {previewUrl && (
                <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-3">
                  <span className="text-xs text-slate-500">Captured Snapshot:</span>
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-emerald-500">
                    <img src={previewUrl} alt="Captured" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-600">✓ Ready to Apply</span>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
          {onRemovePhoto && previewUrl && (
            <button
              type="button"
              onClick={() => {
                setPreviewUrl(null);
                setSelectedAvatarId(null);
                onRemovePhoto();
                onClose();
              }}
              className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1 font-semibold"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Remove Photo</span>
            </button>
          )}
          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={() => {
                stopCamera();
                onClose();
              }}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!previewUrl}
              id="apply-photo-btn"
              className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <Check className="w-4 h-4" />
              <span>Apply Selected Avatar</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
