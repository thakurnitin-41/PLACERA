export interface BranchOption {
  code: string;
  name: string;
  category?: string;
}

export interface CourseDefinition {
  id: string; // e.g. "B.Tech", "B.Sc", "MBA"
  displayName: string; // e.g. "B.Tech / B.E. (Bachelor of Technology / Engineering)"
  shortName: string; // e.g. "B.Tech"
  degreeLevel: 'Undergraduate' | 'Postgraduate' | 'Dual / Integrated';
  durationYears: number;
  branchSectionLabel: string; // e.g. "Branch / Engineering Discipline", "Department / Specialization", "Domain / Major"
  branches: BranchOption[];
}

export const INDIAN_HIGHER_EDUCATION_COURSES: CourseDefinition[] = [
  {
    id: 'B.Tech',
    displayName: 'B.Tech / B.E. (Bachelor of Technology / Engineering)',
    shortName: 'B.Tech',
    degreeLevel: 'Undergraduate',
    durationYears: 4,
    branchSectionLabel: 'Engineering Branch / Department',
    branches: [
      { code: 'CSE', name: 'Computer Science & Engineering (CSE)', category: 'Computing' },
      { code: 'AI & DS', name: 'Artificial Intelligence & Data Science (AI & DS)', category: 'Computing' },
      { code: 'AIML', name: 'AI & Machine Learning (AIML)', category: 'Computing' },
      { code: 'IT', name: 'Information Technology (IT)', category: 'Computing' },
      { code: 'Cyber Security', name: 'Computer Science - Cyber Security', category: 'Computing' },
      { code: 'ECE', name: 'Electronics & Communication Engineering (ECE)', category: 'Circuit' },
      { code: 'EEE', name: 'Electrical & Electronics Engineering (EEE)', category: 'Circuit' },
      { code: 'Mechanical', name: 'Mechanical Engineering (MECH)', category: 'Core Engineering' },
      { code: 'Civil', name: 'Civil Engineering (CIVIL)', category: 'Core Engineering' },
      { code: 'Chemical', name: 'Chemical Engineering', category: 'Core Engineering' },
      { code: 'Aerospace', name: 'Aerospace Engineering', category: 'Specialized' },
      { code: 'Robotics', name: 'Robotics & Automation', category: 'Interdisciplinary' },
      { code: 'Biotechnology', name: 'Biotechnology Engineering', category: 'Interdisciplinary' }
    ]
  },
  {
    id: 'B.Sc',
    displayName: 'B.Sc (Bachelor of Science)',
    shortName: 'B.Sc',
    degreeLevel: 'Undergraduate',
    durationYears: 3,
    branchSectionLabel: 'B.Sc Department / Specialization',
    branches: [
      { code: 'Computer Science', name: 'B.Sc Computer Science (CS)', category: 'Computing' },
      { code: 'Information Technology', name: 'B.Sc Information Technology (IT)', category: 'Computing' },
      { code: 'Data Science', name: 'B.Sc Data Science & Analytics', category: 'Computing' },
      { code: 'Mathematics', name: 'B.Sc Mathematics & Computing', category: 'Physical Sciences' },
      { code: 'Statistics', name: 'B.Sc Statistics & Data Modeling', category: 'Physical Sciences' },
      { code: 'Physics', name: 'B.Sc Physics', category: 'Physical Sciences' },
      { code: 'Chemistry', name: 'B.Sc Chemistry', category: 'Chemical Sciences' },
      { code: 'Biotechnology', name: 'B.Sc Biotechnology & Bioinformatics', category: 'Life Sciences' },
      { code: 'Electronics', name: 'B.Sc Electronics', category: 'Applied Sciences' },
      { code: 'Economics', name: 'B.Sc Economics & Econometrics', category: 'Quantitative Sciences' }
    ]
  },
  {
    id: 'BCA',
    displayName: 'BCA (Bachelor of Computer Applications)',
    shortName: 'BCA',
    degreeLevel: 'Undergraduate',
    durationYears: 3,
    branchSectionLabel: 'BCA Specialization / Track',
    branches: [
      { code: 'Software Engineering', name: 'Software Development & Application Engineering', category: 'Software' },
      { code: 'Cloud & DevOps', name: 'Cloud Computing & DevOps Architecture', category: 'Infrastructure' },
      { code: 'Data Analytics', name: 'Data Science & Big Data Analytics', category: 'Data' },
      { code: 'Cyber Security', name: 'Cyber Security & Ethical Hacking', category: 'Security' },
      { code: 'Artificial Intelligence', name: 'Artificial Intelligence & Machine Learning', category: 'AI' },
      { code: 'Web & Mobile Apps', name: 'Full Stack Web & Mobile App Development', category: 'Software' }
    ]
  },
  {
    id: 'MBA',
    displayName: 'MBA / PGDM (Master of Business Administration)',
    shortName: 'MBA',
    degreeLevel: 'Postgraduate',
    durationYears: 2,
    branchSectionLabel: 'MBA Domain / Functional Specialization',
    branches: [
      { code: 'Finance', name: 'Finance & Banking Services', category: 'Finance' },
      { code: 'Marketing', name: 'Marketing Management & Sales', category: 'Marketing' },
      { code: 'HRM', name: 'Human Resource Management (HRM)', category: 'Human Resources' },
      { code: 'Business Analytics', name: 'Business Analytics & Decision Sciences', category: 'Analytics' },
      { code: 'Operations & SCM', name: 'Operations & Supply Chain Management', category: 'Operations' },
      { code: 'IT & Systems', name: 'Information Technology & Systems Management', category: 'Technology' },
      { code: 'International Business', name: 'International Business (IB)', category: 'Global' },
      { code: 'Strategy & Consulting', name: 'Strategy & Management Consulting', category: 'Strategy' },
      { code: 'FinTech', name: 'Financial Technology (FinTech)', category: 'Finance' }
    ]
  },
  {
    id: 'BBA',
    displayName: 'BBA / BMS (Bachelor of Business Administration)',
    shortName: 'BBA',
    degreeLevel: 'Undergraduate',
    durationYears: 3,
    branchSectionLabel: 'BBA Management Domain / Major',
    branches: [
      { code: 'General Management', name: 'General Business Management', category: 'Management' },
      { code: 'Marketing', name: 'Marketing & Brand Strategy', category: 'Marketing' },
      { code: 'Finance & Accounting', name: 'Finance & Corporate Accounting', category: 'Finance' },
      { code: 'Human Resources', name: 'Human Resource Management', category: 'HR' },
      { code: 'Digital Marketing', name: 'Digital Marketing & E-Commerce', category: 'Marketing' },
      { code: 'International Business', name: 'International Business & Trade', category: 'Global' },
      { code: 'Business Analytics', name: 'Business Analytics & Intelligence', category: 'Analytics' },
      { code: 'Entrepreneurship', name: 'Entrepreneurship & Family Business', category: 'Venture' }
    ]
  },
  {
    id: 'B.Com',
    displayName: 'B.Com / B.Com (Hons) (Bachelor of Commerce)',
    shortName: 'B.Com',
    degreeLevel: 'Undergraduate',
    durationYears: 3,
    branchSectionLabel: 'Commerce Stream / Specialization',
    branches: [
      { code: 'Accounting & Finance', name: 'Accounting & Auditing', category: 'Accounting' },
      { code: 'Banking & Insurance', name: 'Banking, Insurance & Risk Management', category: 'Finance' },
      { code: 'Financial Markets', name: 'Financial Markets & Investment Analysis', category: 'Finance' },
      { code: 'Taxation', name: 'Direct & Indirect Taxation', category: 'Tax' },
      { code: 'Computer Applications', name: 'E-Commerce & Computer Applications', category: 'IT' },
      { code: 'Corporate Secretaryship', name: 'Corporate Secretaryship & Governance', category: 'Law' }
    ]
  },
  {
    id: 'BA',
    displayName: 'BA / BA (Hons) (Bachelor of Arts)',
    shortName: 'BA',
    degreeLevel: 'Undergraduate',
    durationYears: 3,
    branchSectionLabel: 'BA Department / Major Discipline',
    branches: [
      { code: 'Economics', name: 'Economics (Econometrics & Policy)', category: 'Economics' },
      { code: 'English Literature', name: 'English Literature & Professional Communication', category: 'Humanities' },
      { code: 'Journalism', name: 'Journalism, Media & Mass Communication', category: 'Media' },
      { code: 'Psychology', name: 'Psychology & Behavioral Sciences', category: 'Social Sciences' },
      { code: 'Political Science', name: 'Political Science & International Relations', category: 'Social Sciences' },
      { code: 'Sociology', name: 'Sociology & Public Policy', category: 'Social Sciences' },
      { code: 'Public Administration', name: 'Public Administration & Governance', category: 'Governance' }
    ]
  },
  {
    id: 'M.Tech',
    displayName: 'M.Tech / M.E. (Master of Technology / Engineering)',
    shortName: 'M.Tech',
    degreeLevel: 'Postgraduate',
    durationYears: 2,
    branchSectionLabel: 'M.Tech Engineering Specialization',
    branches: [
      { code: 'CSE', name: 'Computer Science & Engineering (CSE)', category: 'Computing' },
      { code: 'AI & ML', name: 'Artificial Intelligence & Machine Learning', category: 'Computing' },
      { code: 'Data Science', name: 'Data Engineering & Big Data Systems', category: 'Computing' },
      { code: 'VLSI Design', name: 'VLSI Design & Microelectronics', category: 'Circuit' },
      { code: 'Embedded Systems', name: 'Embedded Systems & Internet of Things (IoT)', category: 'Circuit' },
      { code: 'Power Systems', name: 'Power Electronics & Renewable Energy', category: 'Electrical' },
      { code: 'Thermal Engineering', name: 'Thermal Engineering & Fluids', category: 'Mechanical' },
      { code: 'Structural Engineering', name: 'Structural & Earthquake Engineering', category: 'Civil' },
      { code: 'Cyber Security', name: 'Cyber Security & Cryptography', category: 'Security' }
    ]
  },
  {
    id: 'MCA',
    displayName: 'MCA (Master of Computer Applications)',
    shortName: 'MCA',
    degreeLevel: 'Postgraduate',
    durationYears: 2,
    branchSectionLabel: 'MCA Advanced Track / Domain',
    branches: [
      { code: 'Software Architecture', name: 'Enterprise Software Engineering & Architecture', category: 'Software' },
      { code: 'Cloud & DevOps', name: 'Cloud Architecture, Microservices & DevOps', category: 'Cloud' },
      { code: 'AI & Data Science', name: 'Applied AI, Machine Learning & NLP', category: 'AI' },
      { code: 'Cyber Security', name: 'Cyber Security & Digital Forensics', category: 'Security' },
      { code: 'Full Stack Development', name: 'Full Stack Web & Distributed Systems', category: 'Software' },
      { code: 'Mobile Technologies', name: 'Mobile Computing & Android/iOS Engineering', category: 'Mobile' }
    ]
  },
  {
    id: 'M.Sc',
    displayName: 'M.Sc (Master of Science)',
    shortName: 'M.Sc',
    degreeLevel: 'Postgraduate',
    durationYears: 2,
    branchSectionLabel: 'M.Sc Department / Discipline',
    branches: [
      { code: 'Computer Science', name: 'M.Sc Computer Science', category: 'Computing' },
      { code: 'Data Science', name: 'M.Sc Data Science & Computing', category: 'Computing' },
      { code: 'Mathematics', name: 'M.Sc Applied Mathematics & Computing', category: 'Physical Sciences' },
      { code: 'Statistics', name: 'M.Sc Statistics & Stochastic Modeling', category: 'Physical Sciences' },
      { code: 'Physics', name: 'M.Sc Applied Physics & Materials', category: 'Physical Sciences' },
      { code: 'Chemistry', name: 'M.Sc Chemistry & Industrial Analysis', category: 'Chemical Sciences' },
      { code: 'Biotechnology', name: 'M.Sc Biotechnology & Molecular Biology', category: 'Life Sciences' },
      { code: 'Applied Economics', name: 'M.Sc Applied Economics & Financial Econometrics', category: 'Economics' }
    ]
  },
  {
    id: 'B.Des',
    displayName: 'B.Des / M.Des (Design)',
    shortName: 'B.Des',
    degreeLevel: 'Undergraduate',
    durationYears: 4,
    branchSectionLabel: 'Design Discipline / Department',
    branches: [
      { code: 'UI/UX Design', name: 'User Experience (UX) & Interaction Design', category: 'Digital Design' },
      { code: 'Product Design', name: 'Product & Industrial Design', category: 'Physical Design' },
      { code: 'Graphic Communication', name: 'Visual Communication & Graphic Design', category: 'Visual Design' },
      { code: 'Animation & Gaming', name: 'Animation, VFX & Game Art Design', category: 'Digital Media' }
    ]
  },
  {
    id: 'B.Pharm',
    displayName: 'B.Pharm / M.Pharm (Pharmacy)',
    shortName: 'B.Pharm',
    degreeLevel: 'Undergraduate',
    durationYears: 4,
    branchSectionLabel: 'Pharmaceutical Branch / Department',
    branches: [
      { code: 'Pharmaceutics', name: 'Pharmaceutics & Formulation Technology', category: 'Formulation' },
      { code: 'Pharmacology', name: 'Pharmacology & Toxicology', category: 'Clinical' },
      { code: 'Pharmaceutical Chemistry', name: 'Pharmaceutical Chemistry & Analysis', category: 'Chemistry' },
      { code: 'Clinical Research', name: 'Clinical Pharmacy & Regulatory Affairs', category: 'Regulatory' }
    ]
  },
  {
    id: 'Law',
    displayName: 'Law (B.A. LL.B / B.B.A. LL.B / LL.M)',
    shortName: 'Law / LL.B',
    degreeLevel: 'Dual / Integrated',
    durationYears: 5,
    branchSectionLabel: 'Legal Specialization / Domain',
    branches: [
      { code: 'Corporate Law', name: 'Corporate & Commercial Law', category: 'Commercial' },
      { code: 'Cyber & IPR', name: 'Cyber Law, Data Privacy & Intellectual Property (IPR)', category: 'Technology' },
      { code: 'Constitutional Law', name: 'Constitutional & Criminal Justice', category: 'Public' },
      { code: 'Dispute Resolution', name: 'International Arbitration & Dispute Resolution', category: 'Dispute' }
    ]
  }
];

export const DEFAULT_COURSE = 'B.Tech';

/**
 * Returns all available degrees/courses in India
 */
export function getAllCourses(): CourseDefinition[] {
  return INDIAN_HIGHER_EDUCATION_COURSES;
}

/**
 * Finds a course definition by its ID or shortName
 */
export function getCourseById(courseId?: string): CourseDefinition {
  if (!courseId) {
    return INDIAN_HIGHER_EDUCATION_COURSES[0];
  }
  const match = INDIAN_HIGHER_EDUCATION_COURSES.find(
    c => c.id.toLowerCase() === courseId.toLowerCase() || 
         c.shortName.toLowerCase() === courseId.toLowerCase()
  );
  return match || INDIAN_HIGHER_EDUCATION_COURSES[0];
}

/**
 * Returns the branch list available for a specific course
 */
export function getBranchesForCourse(courseId?: string): BranchOption[] {
  const course = getCourseById(courseId);
  return course.branches;
}

/**
 * Returns the default branch code for a specific course
 */
export function getDefaultBranchForCourse(courseId?: string): string {
  const branches = getBranchesForCourse(courseId);
  return branches[0]?.code || 'CSE';
}

/**
 * Normalizes branch display with course prefix if available
 */
export function formatCourseAndBranch(course?: string, branch?: string): string {
  if (!course && !branch) return 'Engineering';
  if (!course) return branch || '';
  if (!branch) return course;
  return `${course} • ${branch}`;
}
