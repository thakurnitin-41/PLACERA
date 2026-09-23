import React, { useState, useMemo, useEffect } from 'react';
import { ActivePage, StudentProfileData, JobPosting, RecommendationResult } from './types';
import { MOCK_JOBS } from './data/mockJobs';
import { DEFAULT_REGISTERED_STUDENTS } from './data/mockStudents';
import { generateRecommendations } from './services/recommendationEngine';

// Components
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { StudentProfile } from './components/StudentProfile';
import { AIPipelinePage } from './components/AIPipelinePage';
import { RecommendationDashboard } from './components/RecommendationDashboard';
import { SkillGapAnalysis } from './components/SkillGapAnalysis';
import { StudentDashboard } from './components/StudentDashboard';
import { PlacementCellDashboard } from './components/PlacementCellDashboard';
import { AIInsightsModelPage } from './components/AIInsightsModelPage';
import { JobsDirectory } from './components/JobsDirectory';
import { JobDetailsModal } from './components/JobDetailsModal';
import { DatabaseSchemaModal } from './components/DatabaseSchemaModal';
import { AuthModal } from './components/AuthModal';
import { PhotoCaptureModal } from './components/PhotoCaptureModal';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminSecurityGate, AdminCredentials } from './components/AdminSecurityGate';
import { VerificationWaitingGate } from './components/VerificationWaitingGate';

import { Database, GraduationCap, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [activePage, setActivePage] = useState<ActivePage>('landing');
  const [pageHistory, setPageHistory] = useState<ActivePage[]>([]);
  const [jobs, setJobs] = useState<JobPosting[]>(MOCK_JOBS);
  const [selectedJobRec, setSelectedJobRec] = useState<RecommendationResult | null>(null);
  const [showDbSchemaModal, setShowDbSchemaModal] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Admin session state
  const [adminSession, setAdminSession] = useState<AdminCredentials | null>(() => {
    try {
      const saved = localStorage.getItem('placera_active_admin_session');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (adminSession) {
        localStorage.setItem('placera_active_admin_session', JSON.stringify(adminSession));
      } else {
        localStorage.removeItem('placera_active_admin_session');
      }
    } catch (e) {
      console.warn('Failed to sync admin session:', e);
    }
  }, [adminSession]);

  // User registered demo profiles in localStorage
  const [registeredStudents, setRegisteredStudents] = useState<StudentProfileData[]>(() => {
    try {
      const saved = localStorage.getItem('placera_registered_students');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      return DEFAULT_REGISTERED_STUDENTS;
    } catch {
      return DEFAULT_REGISTERED_STUDENTS;
    }
  });

  const [student, setStudent] = useState<StudentProfileData | null>(() => {
    try {
      const savedActive = localStorage.getItem('placera_active_student_id');
      const saved = localStorage.getItem('placera_registered_students');
      const pool = saved ? JSON.parse(saved) : DEFAULT_REGISTERED_STUDENTS;
      if (Array.isArray(pool) && pool.length > 0) {
        if (savedActive) {
          const match = pool.find(s => s.student_id === savedActive);
          if (match) return match;
        }
        return pool[0];
      }
      return DEFAULT_REGISTERED_STUDENTS[0] || null;
    } catch {
      return DEFAULT_REGISTERED_STUDENTS[0] || null;
    }
  });

  // Save registered students whenever updated
  useEffect(() => {
    try {
      localStorage.setItem('placera_registered_students', JSON.stringify(registeredStudents));
    } catch (e) {
      console.warn('Could not save profiles to localStorage:', e);
    }
  }, [registeredStudents]);

  // Authentication and photo modals state
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authModalRole, setAuthModalRole] = useState<'student' | 'admin'>('student');
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('register');
  const [showGlobalPhotoModal, setShowGlobalPhotoModal] = useState<boolean>(false);

  // Navigate with history tracking and security approval guard
  const navigateTo = (nextPage: ActivePage) => {
    // If student is registered/logged in but verificationStatus !== 'Verified', protect access to recruitment features
    const protectedPages: ActivePage[] = ['pipeline', 'recommendations', 'jobs', 'skill-gap', 'dashboard'];
    if (student && student.verificationStatus !== 'Verified' && protectedPages.includes(nextPage)) {
      triggerToast("Access Locked: Verification request pending College Administrator approval.");
      if (activePage !== 'waiting-approval') {
        setPageHistory(prev => [...prev, activePage]);
        setActivePage('waiting-approval');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    if (nextPage === activePage) return;
    setPageHistory(prev => [...prev, activePage]);
    setActivePage(nextPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Back button handler
  const goBack = () => {
    if (pageHistory.length > 0) {
      const prevPage = pageHistory[pageHistory.length - 1];
      setPageHistory(prev => prev.slice(0, -1));
      setActivePage(prevPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (activePage !== 'landing') {
      setActivePage('landing');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleOpenAuthModal = (role: 'student' | 'admin' = 'student', mode: 'login' | 'register' = 'register') => {
    setAuthModalRole(role);
    setAuthModalMode(mode);
    setShowAuthModal(true);
  };

  const handleAdminLogout = () => {
    setAdminSession(null);
    triggerToast("Placement Officer logged out.");
    if (activePage === 'admin') {
      navigateTo('landing');
    }
  };

  // Compute recommendations reactively whenever student or jobs change
  const recommendations: RecommendationResult[] = useMemo(() => {
    return generateRecommendations(student, jobs);
  }, [student, jobs]);

  // Show auto-dismiss notification toast
  const triggerToast = (message: string) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // User Authentication & Profile Handlers
  const handleRegisterSuccess = (newProfile: StudentProfileData) => {
    setStudent(newProfile);
    setRegisteredStudents(prev => {
      const exists = prev.some(s => s.student_id === newProfile.student_id);
      if (exists) {
        return prev.map(s => s.student_id === newProfile.student_id ? newProfile : s);
      }
      return [newProfile, ...prev];
    });
    setShowAuthModal(false);
    triggerToast(`Application submitted! Request sent to College Admin for approval.`);
    navigateTo('waiting-approval');
  };

  const handleLoginSuccess = (loggedInProfile: StudentProfileData) => {
    setStudent(loggedInProfile);
    setShowAuthModal(false);
    triggerToast(`Welcome back, ${loggedInProfile.name}!`);
    if (loggedInProfile.verificationStatus !== 'Verified') {
      navigateTo('waiting-approval');
    } else {
      navigateTo('profile');
    }
  };

  const handleLogout = () => {
    setStudent(null);
    triggerToast("Logged out. Profile reset.");
    navigateTo('landing');
  };

  const handleDeleteStudent = (studentId: string) => {
    setRegisteredStudents(prev => prev.filter(s => s.student_id !== studentId));
    if (student?.student_id === studentId) {
      setStudent(null);
      triggerToast("Profile deleted. Switched to guest mode.");
    } else {
      triggerToast("Candidate profile removed successfully.");
    }
  };

  const handleUpdateStudent = (updatedStudent: StudentProfileData) => {
    setStudent(prev => {
      if (!prev) return updatedStudent;
      if (prev.student_id === updatedStudent.student_id) return updatedStudent;
      return prev;
    });
    setRegisteredStudents(prev => 
      prev.map(s => s.student_id === updatedStudent.student_id ? updatedStudent : s)
    );
  };

  const handleRefreshVerificationStatus = () => {
    if (!student) return;
    const current = registeredStudents.find(s => s.student_id === student.student_id);
    if (current) {
      setStudent(current);
      if (current.verificationStatus === 'Verified') {
        triggerToast("🎉 Congratulations! Your profile has been approved by the Admin. Platform access granted!");
        navigateTo('recommendations');
        return;
      }
    }
    triggerToast("Verification status: Under review by Central Placement Officer.");
  };

  const handleUpdateGlobalPhoto = (photoUrl: string) => {
    if (student) {
      const updated = { ...student, avatarUrl: photoUrl };
      handleUpdateStudent(updated);
    }
    setShowGlobalPhotoModal(false);
    triggerToast("Profile photo updated successfully!");
  };

  // Select Job for Explainable Match Modal
  const handleSelectJob = (rec: RecommendationResult) => {
    setSelectedJobRec(rec);
  };

  // Select raw job from JobsDirectory
  const handleSelectRawJob = (job: JobPosting) => {
    const found = recommendations.find(r => r.job.job_id === job.job_id);
    if (found) {
      setSelectedJobRec(found);
    } else if (student) {
      const single = generateRecommendations(student, [job])[0];
      setSelectedJobRec(single);
    } else {
      const single = generateRecommendations({
        student_id: 'CANDIDATE-TEMP',
        name: 'Candidate',
        rollNumber: '21BCE0000',
        collegeName: 'University Engineering College',
        branch: 'CSE',
        graduationYear: 2025,
        GPA: 8.5,
        tenthPercentage: 88,
        twelfthPercentage: 89,
        activeBacklogs: 0,
        historyOfBacklogs: 0,
        skills: ['Python', 'Machine Learning', 'Data Structures & Algorithms', 'SQL', 'FastAPI'],
        projects: [{ id: '1', title: 'Placement Analytics', technologies: ['Python', 'FastAPI'], description: 'ML engine' }],
        certifications: [],
        preferred_role: 'Software Engineer',
        preferred_location: 'Bangalore',
        job_type: 'Full-Time',
        experience: 'Fresher',
        experienceLevel: 'Entry Level (Fresher)'
      }, [job])[0];
      setSelectedJobRec(single);
    }
  };

  // Admin add job
  const handleAddJob = (newJob: JobPosting) => {
    setJobs(prev => [newJob, ...prev]);
    triggerToast(`New campus recruiter opening posted: ${newJob.company} - ${newJob.job_title}`);
  };

  // Admin delete job
  const handleDeleteJob = (jobId: string) => {
    setJobs(prev => prev.filter(j => j.job_id !== jobId));
    triggerToast("Job posting removed from campus database.");
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs px-4 py-3 rounded-2xl shadow-xl border border-slate-700 flex items-center gap-2.5 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Navigation Bar */}
      <Navbar
        activePage={activePage}
        setActivePage={navigateTo}
        canGoBack={pageHistory.length > 0 || activePage !== 'landing'}
        onBack={goBack}
        onOpenSchema={() => setShowDbSchemaModal(true)}
        recommendationsCount={recommendations.length}
        student={student}
        adminSession={adminSession}
        onOpenAuthModal={(role, mode) => {
          handleOpenAuthModal(role, mode);
        }}
        onOpenPhotoModal={() => setShowGlobalPhotoModal(true)}
        onLogout={handleLogout}
        onAdminLogout={handleAdminLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activePage === 'landing' && (
          <LandingPage
            setActivePage={navigateTo}
            onLoadDemoAndRun={() => {
              if (student) {
                navigateTo('recommendations');
              } else {
                handleOpenAuthModal('student', 'register');
              }
            }}
            student={student}
            topRecommendation={recommendations[0]}
            onGetStarted={() => {
              handleOpenAuthModal('student', 'register');
            }}
            onOpenAuthModal={(mode) => {
              handleOpenAuthModal('student', mode || 'login');
            }}
          />
        )}

        {activePage === 'profile' && (
          <StudentProfile
            student={student}
            setStudent={(updated) => {
              handleUpdateStudent(updated);
              triggerToast("Profile updated successfully.");
            }}
            onGenerateRecommendations={() => {
              navigateTo('pipeline');
            }}
            onBack={goBack}
            onOpenAuthModal={(mode) => {
              handleOpenAuthModal('student', mode || 'register');
            }}
            onDeleteStudent={handleDeleteStudent}
          />
        )}

        {activePage === 'pipeline' && (
          <AIPipelinePage
            student={student}
            setActivePage={navigateTo}
            onPipelineCompleted={() => {
              navigateTo('recommendations');
              triggerToast("AI inference complete! Displaying ranked placement matches.");
            }}
            onBack={goBack}
          />
        )}

        {activePage === 'recommendations' && (
          <RecommendationDashboard
            recommendations={recommendations}
            onSelectJob={handleSelectJob}
            setActivePage={navigateTo}
            onBack={goBack}
          />
        )}

        {activePage === 'skill-gap' && (
          <SkillGapAnalysis
            student={student}
            recommendations={recommendations}
            onOpenAuthModal={(mode) => {
              handleOpenAuthModal('student', mode || 'login');
            }}
            onBack={goBack}
          />
        )}

        {activePage === 'dashboard' && (
          <StudentDashboard
            student={student}
            recommendations={recommendations}
            setActivePage={navigateTo}
            onSelectJob={handleSelectJob}
            onOpenAuthModal={(mode) => {
              handleOpenAuthModal('student', mode || 'login');
            }}
            onBack={goBack}
          />
        )}

        {activePage === 'placement-cell' && (
          <PlacementCellDashboard
            jobs={jobs}
            onAddJob={handleAddJob}
            onDeleteJob={handleDeleteJob}
            onBack={goBack}
          />
        )}

        {activePage === 'ai-insights' && (
          <AIInsightsModelPage 
            onBack={goBack}
          />
        )}

        {activePage === 'jobs' && (
          <JobsDirectory
            jobs={jobs}
            student={student}
            onSelectJob={handleSelectRawJob}
            onRunAIMatch={() => {
              if (student) {
                navigateTo('pipeline');
              } else {
                handleOpenAuthModal('student', 'register');
              }
            }}
            onOpenAuthModal={(mode) => {
              handleOpenAuthModal('student', mode || 'register');
            }}
            onBack={goBack}
          />
        )}

        {activePage === 'waiting-approval' && (
          student ? (
            <VerificationWaitingGate
              student={student}
              onRefreshStatus={handleRefreshVerificationStatus}
              onOpenProfile={() => navigateTo('profile')}
              onOpenAdminPortal={() => navigateTo('admin')}
              onLogout={handleLogout}
            />
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-600 mb-4">No active student profile selected.</p>
              <button
                onClick={() => handleOpenAuthModal('student', 'login')}
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold"
              >
                Sign In / Register
              </button>
            </div>
          )
        )}

        {activePage === 'admin' && (
          !adminSession ? (
            <AdminSecurityGate
              onAuthenticated={(session) => {
                setAdminSession(session);
                triggerToast(`Placement Officer Authenticated: ${session.name}`);
              }}
              onCancel={goBack}
            />
          ) : (
            <AdminDashboard
              students={registeredStudents}
              onUpdateStudent={handleUpdateStudent}
              onDeleteStudent={handleDeleteStudent}
              activeStudent={student}
              onSelectActiveStudent={(stu) => {
                setStudent(stu);
                triggerToast(`Loaded candidate profile for ${stu.name}.`);
              }}
              jobs={jobs}
              onAddJob={handleAddJob}
              onDeleteJob={handleDeleteJob}
              onBack={goBack}
              setActivePage={navigateTo}
            />
          )
        )}
      </main>

      {/* Explainable Job Match Modal */}
      {selectedJobRec && (
        <JobDetailsModal
          recommendation={selectedJobRec}
          student={student}
          onClose={() => setSelectedJobRec(null)}
          onGoToSkillGap={() => {
            setSelectedJobRec(null);
            navigateTo('skill-gap');
          }}
        />
      )}

      {/* Database Schema Modal (MySQL & Firebase) */}
      {showDbSchemaModal && (
        <DatabaseSchemaModal
          onClose={() => setShowDbSchemaModal(false)}
        />
      )}

      {/* Authentication Modal (Dual Role: Students & Admins) */}
      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          initialRole={authModalRole}
          initialMode={authModalMode}
          onClose={() => setShowAuthModal(false)}
          onLoginSuccess={handleLoginSuccess}
          registeredStudents={registeredStudents}
          onRegisterSuccess={handleRegisterSuccess}
          onDeleteStudent={handleDeleteStudent}
          onAdminAuthSuccess={(session) => {
            setAdminSession(session);
            setShowAuthModal(false);
            navigateTo('admin');
            triggerToast(`Welcome Placement Officer ${session.name}!`);
          }}
        />
      )}

      {/* Global Photo Capture Modal (Camera Snapshot / Device Upload) */}
      {showGlobalPhotoModal && (
        <PhotoCaptureModal
          currentPhoto={student?.avatarUrl}
          onSavePhoto={handleUpdateGlobalPhoto}
          onClose={() => setShowGlobalPhotoModal(false)}
        />
      )}

      {/* Global Academic PBL Footer */}
      <footer className="mt-16 border-t border-slate-200 bg-white py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
            <span className="font-extrabold text-indigo-700 tracking-tight text-sm">PLACERA</span>
            <span className="hidden sm:inline text-slate-300">|</span>
            <span>Find Where You Fit.</span>
            <span className="hidden sm:inline text-slate-300">•</span>
            <span className="text-slate-600 font-medium">B.Tech CSE Artificial Intelligence PBL Project</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-slate-600 font-medium">
            <button
              onClick={() => setShowDbSchemaModal(true)}
              className="hover:text-indigo-600 flex items-center gap-1 cursor-pointer"
            >
              <Database className="w-3.5 h-3.5 text-indigo-500" />
              <span>MySQL Schema</span>
            </button>
            <span>•</span>
            <button
              onClick={() => navigateTo('ai-insights')}
              className="hover:text-indigo-600 flex items-center gap-1 cursor-pointer"
            >
              <GraduationCap className="w-3.5 h-3.5 text-indigo-500" />
              <span>ML Architecture & Viva Defense</span>
            </button>
            <span>•</span>
            <button
              onClick={() => navigateTo('placement-cell')}
              className="hover:text-indigo-600 cursor-pointer"
            >
              Placement Cell Portal
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
