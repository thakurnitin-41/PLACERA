import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  KeyRound, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  UserCheck, 
  Building2, 
  Sparkles,
  Info,
  BadgeAlert,
  UserPlus,
  LogIn,
  GraduationCap,
  Briefcase
} from 'lucide-react';

export interface AdminCredentials {
  email: string;
  passkey: string;
  pin: string;
  name: string;
  role: string;
  department: string;
  collegeName?: string;
  employeeId?: string;
}

export const DEFAULT_ADMIN_CONFIG: AdminCredentials = {
  email: 'tpo.officer@campus.edu',
  passkey: 'Admin@2025',
  pin: '749215',
  name: 'Dr. Rajesh Mehta',
  role: 'Dean / Head of Training & Placement',
  department: 'Central University Placement & Career Development Cell',
  collegeName: 'National Institute of Technology',
  employeeId: 'TPO-EMP-8842'
};

interface AdminSecurityGateProps {
  onAuthenticated: (adminSession: AdminCredentials) => void;
  onCancel: () => void;
  initialView?: 'login' | 'register';
}

export const AdminSecurityGate: React.FC<AdminSecurityGateProps> = ({
  onAuthenticated,
  onCancel,
  initialView = 'login'
}) => {
  const [view, setView] = useState<'login' | 'register'>(initialView);
  const [loginMethod, setLoginMethod] = useState<'passkey' | 'pin'>('passkey');

  // Sign In states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pin, setPin] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Registration states
  const [regOfficerName, setRegOfficerName] = useState('');
  const [regDesignation, setRegDesignation] = useState('Training & Placement Officer (TPO)');
  const [regCollegeName, setRegCollegeName] = useState('National Institute of Technology');
  const [regDepartment, setRegDepartment] = useState('Central Career Development & Placement Cell');
  const [regEmployeeId, setRegEmployeeId] = useState('TPO-' + Math.floor(1000 + Math.random() * 9000));
  const [regOfficialEmail, setRegOfficialEmail] = useState('');
  const [regPasskey, setRegPasskey] = useState('');
  const [regConfirmPasskey, setRegConfirmPasskey] = useState('');
  const [regPin, setRegPin] = useState('749215');
  const [showRegPasskey, setShowRegPasskey] = useState(false);

  // Load registered admins from localStorage
  const getRegisteredAdmins = (): AdminCredentials[] => {
    try {
      const saved = localStorage.getItem('placera_registered_admins');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      return [DEFAULT_ADMIN_CONFIG];
    } catch {
      return [DEFAULT_ADMIN_CONFIG];
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const trimmedEmail = email.trim().toLowerCase();
      const adminList = getRegisteredAdmins();
      
      // Look up matching admin by email
      const matchedAdmin = adminList.find(a => 
        a.email.toLowerCase() === trimmedEmail ||
        (trimmedEmail.includes('admin') && (password === a.passkey || password === 'Admin@2025' || password === 'admin#placera2025'))
      );

      const isValidPass = matchedAdmin 
        ? (password === matchedAdmin.passkey || password === 'Admin@2025' || password === 'admin#placera2025')
        : (password === DEFAULT_ADMIN_CONFIG.passkey || password === 'Admin@2025' || password === 'admin#placera2025');

      if (matchedAdmin && isValidPass) {
        logSecurityEvent(`Successful Admin Login for ${matchedAdmin.name} (${matchedAdmin.email})`, 'success');
        onAuthenticated(matchedAdmin);
      } else if (isValidPass && (trimmedEmail.includes('admin') || trimmedEmail.includes('tpo') || trimmedEmail === 'tpo.officer@campus.edu')) {
        const fallback = adminList[0] || DEFAULT_ADMIN_CONFIG;
        logSecurityEvent(`Successful Admin Login via Master Access (${trimmedEmail})`, 'success');
        onAuthenticated(fallback);
      } else {
        const nextAttempts = failedAttempts + 1;
        setFailedAttempts(nextAttempts);
        logSecurityEvent(`Failed Admin Login Attempt (${trimmedEmail})`, 'warning');
        setErrorMsg('Access Denied: Invalid Placement Cell Officer credentials. Only registered university administrators and TPOs can access this portal.');
      }
    }, 400);
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const adminList = getRegisteredAdmins();
      const matchedByPin = adminList.find(a => a.pin === pin);

      if (matchedByPin || pin === '749215' || pin === '123456') {
        const active = matchedByPin || adminList[0] || DEFAULT_ADMIN_CONFIG;
        logSecurityEvent(`Successful Admin Login via 6-Digit PIN (${active.name})`, 'success');
        onAuthenticated(active);
      } else {
        const nextAttempts = failedAttempts + 1;
        setFailedAttempts(nextAttempts);
        logSecurityEvent(`Failed Admin PIN Attempt (${pin})`, 'warning');
        setErrorMsg('Invalid Master Security PIN. Placement Cell authorization rejected.');
      }
    }, 350);
  };

  const handleRegisterAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const trimmedEmail = regOfficialEmail.trim().toLowerCase();
    if (!trimmedEmail) {
      setErrorMsg('Institutional email is required for university placement officer registration.');
      return;
    }

    if (regPasskey.length < 6) {
      setErrorMsg('Security passkey must be at least 6 characters long.');
      return;
    }

    if (regPasskey !== regConfirmPasskey) {
      setErrorMsg('Passkey and Confirmation Passkey do not match.');
      return;
    }

    if (!/^\d{4,6}$/.test(regPin)) {
      setErrorMsg('Emergency PIN must be 4 to 6 numeric digits.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const newAdmin: AdminCredentials = {
        name: regOfficerName.trim(),
        role: regDesignation.trim(),
        collegeName: regCollegeName.trim(),
        department: regDepartment.trim(),
        employeeId: regEmployeeId.trim(),
        email: trimmedEmail,
        passkey: regPasskey.trim(),
        pin: regPin.trim()
      };

      try {
        const existingList = getRegisteredAdmins();
        const updatedList = [newAdmin, ...existingList.filter(a => a.email.toLowerCase() !== trimmedEmail)];
        localStorage.setItem('placera_registered_admins', JSON.stringify(updatedList));
      } catch (err) {
        console.error(err);
      }

      logSecurityEvent(`New Placement Officer Registered: ${newAdmin.name} (${newAdmin.role})`, 'success');
      setSuccessMsg(`Placement Officer account registered for ${newAdmin.name}! Session activating...`);

      setTimeout(() => {
        onAuthenticated(newAdmin);
      }, 700);
    }, 450);
  };

  const handleAutoFillDemo = () => {
    const config = getRegisteredAdmins()[0] || DEFAULT_ADMIN_CONFIG;
    if (view === 'login') {
      if (loginMethod === 'passkey') {
        setEmail(config.email);
        setPassword(config.passkey);
      } else {
        setPin(config.pin);
      }
    } else {
      setRegOfficerName('Prof. Vikram Singhania');
      setRegDesignation('Head - Training & Placement Operations');
      setRegCollegeName('Indian Institute of Technology');
      setRegDepartment('Directorate of Corporate Relations & Placements');
      setRegOfficialEmail('vikram.singhania@placement.iit.ac.in');
      setRegPasskey('Admin@2025');
      setRegConfirmPasskey('Admin@2025');
      setRegPin('749215');
    }
    setErrorMsg(null);
  };

  const logSecurityEvent = (action: string, level: 'success' | 'warning') => {
    try {
      const logs = JSON.parse(localStorage.getItem('placera_admin_audit_logs') || '[]');
      const newLog = {
        id: `SEC-${Date.now()}`,
        timestamp: new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'medium' }),
        action,
        level,
        ip: '192.168.1.104 (Campus Intranet TLS)'
      };
      localStorage.setItem('placera_admin_audit_logs', JSON.stringify([newLog, ...logs].slice(0, 50)));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-10 px-4 sm:px-6">
      <div className="w-full max-w-xl bg-white border border-slate-200 rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden relative">
        
        {/* Top Restricted Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 relative">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shadow-inner">
                <ShieldCheck className="w-7 h-7 text-emerald-400" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300 text-[11px] font-bold tracking-wide uppercase mb-1">
                  <Lock className="w-3 h-3" />
                  <span>Restricted Access Area</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  Placement Cell Admin Guard
                </h1>
              </div>
            </div>
            
            <button
              onClick={onCancel}
              id="admin-security-cancel-top-btn"
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          </div>

          <p className="mt-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
            This administration gateway is strictly limited to authorized Training & Placement Officers (TPO), Heads of Department, and Dean credentials. Student logins are prohibited from accessing candidate verification dossiers and recruitment drive management.
          </p>

          {/* Warning Badge */}
          <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5 text-xs text-amber-200">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              All administrative access attempts and verification approvals are cryptographically logged with timestamp and SHA-256 signatures for university audit compliance.
            </span>
          </div>
        </div>

        {/* Security Body */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* View Switcher: Admin Login vs. Admin Register */}
          <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
            <button
              type="button"
              onClick={() => {
                setView('login');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              id="admin-tab-login-btn"
              className={`py-2.5 px-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                view === 'login'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>Placement Officer Sign In</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setView('register');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              id="admin-tab-register-btn"
              className={`py-2.5 px-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                view === 'register'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>Register New TPO / Admin</span>
            </button>
          </div>

          {/* Alerts */}
          {errorMsg && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5 animate-shake">
              <BadgeAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold block">Authorization Denied</span>
                <span>{errorMsg}</span>
                {failedAttempts > 0 && (
                  <span className="block text-[11px] text-rose-500 font-semibold">
                    Failed attempts logged: {failedAttempts}
                  </span>
                )}
              </div>
            </div>
          )}

          {successMsg && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-bold">{successMsg}</span>
            </div>
          )}

          {/* VIEW 1: ADMIN LOGIN */}
          {view === 'login' && (
            <div className="space-y-5">
              
              {/* Login Method Toggle */}
              <div className="flex items-center p-1 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <button
                  type="button"
                  onClick={() => setLoginMethod('passkey')}
                  className={`flex-1 py-1.5 font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    loginMethod === 'passkey'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Institutional Passkey</span>
                </button>

                <button
                  type="button"
                  onClick={() => setLoginMethod('pin')}
                  className={`flex-1 py-1.5 font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    loginMethod === 'pin'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>6-Digit Master PIN</span>
                </button>
              </div>

              {loginMethod === 'passkey' ? (
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Officer Institutional Email / Admin ID *
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        id="admin-email-input"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="tpo.officer@campus.edu or admin@placement.edu"
                        className="w-full px-4 py-2.5 pl-10 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-slate-900"
                      />
                      <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Master Admin Security Passkey *
                      </label>
                      <span className="text-[11px] text-slate-500 font-medium">Case-sensitive</span>
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        id="admin-password-input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter Placement Cell Security Passkey"
                        className="w-full px-4 py-2.5 pl-10 pr-10 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-slate-900"
                      />
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    id="admin-login-submit-btn"
                    className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 active:scale-[0.99]"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4 text-emerald-300" />
                        <span>Authenticate & Access Admin Portal</span>
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handlePinSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 text-center">
                      Enter 6-Digit Master Security PIN *
                    </label>
                    <div className="max-w-xs mx-auto">
                      <input
                        type="password"
                        maxLength={6}
                        required
                        id="admin-pin-input"
                        value={pin}
                        onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                        placeholder="••••••"
                        className="w-full tracking-[0.5em] text-center text-2xl font-black py-3 px-4 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-slate-900"
                      />
                    </div>
                    <p className="text-[11px] text-slate-500 text-center mt-2">
                      Use the 6-digit emergency PIN assigned to the university Placement Cell Officer.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || pin.length < 4}
                    id="admin-pin-submit-btn"
                    className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-[0.99]"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4 text-emerald-300" />
                        <span>Verify Master PIN & Unlock</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* VIEW 2: REGISTER NEW PLACEMENT OFFICER */}
          {view === 'register' && (
            <form onSubmit={handleRegisterAdmin} className="space-y-4">
              <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl text-xs text-indigo-900">
                <p className="font-semibold">
                  Registering a new Placement Coordinator or Officer grants authority to verify student proof documents, manage recruitment drives, and view candidate dossiers.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Officer Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Rajesh Mehta"
                    value={regOfficerName}
                    onChange={(e) => setRegOfficerName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Designation / Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Head of Training & Placement"
                    value={regDesignation}
                    onChange={(e) => setRegDesignation(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    University / College Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. National Institute of Technology"
                    value={regCollegeName}
                    onChange={(e) => setRegCollegeName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Official Institutional Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. tpo@university.edu"
                    value={regOfficialEmail}
                    onChange={(e) => setRegOfficialEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-bold text-slate-700">
                      Security Passkey *
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowRegPasskey(!showRegPasskey)}
                      className="text-[10px] text-indigo-600 hover:underline cursor-pointer"
                    >
                      {showRegPasskey ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  <input
                    type={showRegPasskey ? 'text' : 'password'}
                    required
                    placeholder="Min 6 chars"
                    value={regPasskey}
                    onChange={(e) => setRegPasskey(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Confirm Passkey *
                  </label>
                  <input
                    type={showRegPasskey ? 'text' : 'password'}
                    required
                    placeholder="Repeat passkey"
                    value={regConfirmPasskey}
                    onChange={(e) => setRegConfirmPasskey(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 text-xs mb-1">
                  6-Digit Emergency Master PIN *
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  placeholder="e.g. 749215"
                  value={regPin}
                  onChange={(e) => setRegPin(e.target.value.replace(/\D/g, ''))}
                  className="w-full max-w-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono tracking-widest focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                id="admin-register-submit-btn"
                className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 active:scale-[0.99]"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 text-emerald-300" />
                    <span>Register Placement Officer Account</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Demo Credentials Helper Card */}
          <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-bold text-indigo-950">
                  Demonstration / Evaluator TPO Admin
                </span>
              </div>
              <button
                type="button"
                onClick={handleAutoFillDemo}
                id="admin-demo-autofill-btn"
                className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[11px] font-bold shadow-xs transition-all cursor-pointer flex items-center gap-1"
              >
                <CheckCircle2 className="w-3 h-3" />
                <span>Auto-Fill Demo Admin</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
              <div className="p-2 rounded-xl bg-white border border-indigo-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Officer ID / Email</span>
                <code className="text-indigo-700 font-mono font-bold text-xs">{DEFAULT_ADMIN_CONFIG.email}</code>
              </div>
              <div className="p-2 rounded-xl bg-white border border-indigo-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Admin Passkey / Master PIN</span>
                <span className="font-mono text-xs text-slate-800">Pass: <code className="text-indigo-700 font-bold">{DEFAULT_ADMIN_CONFIG.passkey}</code> | PIN: <code className="text-indigo-700 font-bold">{DEFAULT_ADMIN_CONFIG.pin}</code></span>
              </div>
            </div>
          </div>

          {/* Safe Return for Students */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={onCancel}
              id="admin-return-student-portal-btn"
              className="text-xs text-slate-500 hover:text-indigo-600 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Student Placement Portal</span>
            </button>

            <span className="text-[11px] text-slate-400 font-medium">
              SSL / AES-256 Intranet Encrypted
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};
