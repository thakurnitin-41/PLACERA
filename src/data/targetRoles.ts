import { TargetRoleInfo } from '../types';

export const CANONICAL_TARGET_ROLES: TargetRoleInfo[] = [
  {
    id: 'role-sde',
    title: 'Software Development Engineer (SDE-1)',
    category: 'Software Engineering',
    description: 'Build robust, scalable software, distributed systems, and core algorithms in C++, Java, or Python.',
    coreSkills: ['Data Structures & Algorithms', 'C++', 'Java', 'Python', 'SQL', 'System Design', 'Operating Systems', 'Computer Networks'],
    secondarySkills: ['Git', 'Docker', 'Linux', 'RESTful APIs', 'Redis'],
    commonCoursework: ['Data Structures & Algorithms', 'Object-Oriented Programming', 'Database Management', 'Computer Networks', 'Operating Systems'],
    avgPackageRange: '?12 - 35+ LPA',
    typicalInterviewRounds: ['Online Coding Assessment (DSA)', 'Technical Round 1: DSA & Problem Solving', 'Technical Round 2: Core CS & System Basics', 'HR / Managerial Round']
  },
  {
    id: 'role-frontend',
    title: 'Frontend Engineer',
    category: 'Software Engineering',
    description: 'Design and architect modern, high-performance web applications, responsive user interfaces, and state management.',
    coreSkills: ['JavaScript', 'TypeScript', 'React.js', 'HTML', 'CSS', 'Tailwind CSS', 'Redux / State Management', 'RESTful APIs'],
    secondarySkills: ['Next.js', 'Web Performance', 'GraphQL', 'Testing / Jest', 'UI/UX Fundamentals'],
    commonCoursework: ['Web Technologies', 'Software Engineering', 'Human-Computer Interaction', 'Database Management'],
    avgPackageRange: '?8 - 22 LPA',
    typicalInterviewRounds: ['Frontend Machine Coding / UI Challenge', 'JavaScript & React Architecture Deep Dive', 'CS Fundamentals & API Design', 'Cultural Fit / Portfolio Review']
  },
  {
    id: 'role-backend',
    title: 'Backend Systems Engineer',
    category: 'Software Engineering',
    description: 'Develop high-throughput REST/gRPC APIs, database schemas, microservices, and asynchronous event streams.',
    coreSkills: ['Python', 'Java', 'Node.js', 'SQL', 'Database Management', 'FastAPI', 'Spring Boot', 'System Design'],
    secondarySkills: ['Kafka', 'Redis', 'Docker', 'PostgreSQL', 'Microservices', 'Linux'],
    commonCoursework: ['Database Management', 'Operating Systems', 'Distributed Computing', 'Software Architecture'],
    avgPackageRange: '?10 - 28 LPA',
    typicalInterviewRounds: ['DSA & Algorithmic Problem Solving', 'API & Database Schema Design Round', 'Low-Level Design (LLD) & Concurrency', 'Leadership & Behavioral']
  },
  {
    id: 'role-ai-ml',
    title: 'AI / Machine Learning Engineer',
    category: 'Data & AI',
    description: 'Train, evaluate, and deploy machine learning models, NLP pipelines, and generative AI agents into production.',
    coreSkills: ['Python', 'Machine Learning', 'Scikit-learn', 'PyTorch', 'TensorFlow', 'Data Preprocessing', 'NLP', 'SQL'],
    secondarySkills: ['Pandas', 'NumPy', 'Docker', 'FastAPI', 'MLOps', 'Vector Databases'],
    commonCoursework: ['Artificial Intelligence', 'Machine Learning', 'Linear Algebra & Probability', 'Data Mining', 'Deep Learning'],
    avgPackageRange: '?12 - 32 LPA',
    typicalInterviewRounds: ['Coding & Mathematical Foundations', 'ML Modeling & Algorithms Defense', 'Practical ML Pipeline / Case Study', 'Managerial / Research Viva']
  },
  {
    id: 'role-data-science',
    title: 'Data Scientist / Analytics',
    category: 'Data & AI',
    description: 'Extract statistical insights, build predictive business dashboards, and formulate data-driven decision engines.',
    coreSkills: ['Python', 'SQL', 'Pandas', 'NumPy', 'Data Visualization', 'Statistical Analysis', 'Machine Learning', 'Tableau'],
    secondarySkills: ['PowerBI', 'BigQuery', 'A/B Testing', 'R', 'Excel Modeling'],
    commonCoursework: ['Applied Statistics', 'Database Management Systems', 'Business Analytics', 'Data Warehousing'],
    avgPackageRange: '?9 - 24 LPA',
    typicalInterviewRounds: ['SQL Querying & Data Wrangling Test', 'Exploratory Data Analysis & Business Case', 'Statistics & ML Inference', 'Stakeholder Communication']
  },
  {
    id: 'role-cloud-devops',
    title: 'Cloud & DevOps Engineer',
    category: 'Cloud & Systems',
    description: 'Automate CI/CD delivery pipelines, container orchestrations, cloud infrastructure, and site reliability.',
    coreSkills: ['Linux', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'CI/CD Pipelines', 'Computer Networks', 'Python / Bash Scripting'],
    secondarySkills: ['Terraform', 'Prometheus', 'Grafana', 'Git', 'Security Best Practices'],
    commonCoursework: ['Cloud Computing', 'Computer Networks', 'Operating Systems', 'Information Security'],
    avgPackageRange: '?9 - 26 LPA',
    typicalInterviewRounds: ['Linux & Networking Deep-Dive', 'Infrastructure as Code & CI/CD Case Study', 'Troubleshooting & Disaster Recovery', 'Director / Managerial Round']
  },
  {
    id: 'role-cybersecurity',
    title: 'Cybersecurity Analyst',
    category: 'Security & Analytics',
    description: 'Protect enterprise infrastructure, analyze network traffic, manage vulnerability assessments, and enforce compliance.',
    coreSkills: ['Computer Networks', 'Network Security', 'Linux', 'Cryptography', 'Vulnerability Assessment', 'Ethical Hacking', 'Python'],
    secondarySkills: ['Wireshark', 'SIEM Tools', 'OWASP Top 10', 'Penetration Testing', 'Firewalls'],
    commonCoursework: ['Cryptography & Network Security', 'Cyber Laws & Ethics', 'Operating Systems', 'Computer Networks'],
    avgPackageRange: '?8 - 22 LPA',
    typicalInterviewRounds: ['Network Security & Cryptography Fundamentals', 'Scenario-Based Threat Defense / CTF', 'System Auditing & Compliance Round', 'HR & Ethics Interview']
  },
  {
    id: 'role-product-analyst',
    title: 'Product & Business Analyst',
    category: 'Security & Analytics',
    description: 'Bridge technology and business metrics, define user product requirements, and conduct telemetry cohort analyses.',
    coreSkills: ['SQL', 'Data Analysis', 'Product Thinking', 'Agile Methodologies', 'User Story Mapping', 'Excel Modeling', 'Python'],
    secondarySkills: ['Tableau', 'Figma Basics', 'Jira', 'Market Research', 'A/B Testing'],
    commonCoursework: ['Software Project Management', 'Management Information Systems', 'Data Analytics', 'Principles of Economics'],
    avgPackageRange: '?8 - 20 LPA',
    typicalInterviewRounds: ['Product Estimation & Problem Solving', 'SQL & Telemetry Challenge', 'Product Design & GTM Strategy', 'Executive Culture Fit']
  }
];

export function getTargetRoleInfo(roleTitle: string): TargetRoleInfo | undefined {
  return CANONICAL_TARGET_ROLES.find(r => 
    r.title.toLowerCase() === roleTitle.toLowerCase() ||
    roleTitle.toLowerCase().includes(r.title.toLowerCase()) ||
    r.title.toLowerCase().includes(roleTitle.toLowerCase())
  ) || CANONICAL_TARGET_ROLES[0];
}
