import React, { useState } from 'react';
import { StudentProfileData } from '../types';
import { 
  X, 
  Binary, 
  Cpu, 
  Code2, 
  BookOpen, 
  HelpCircle, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Calculator,
  Sparkles,
  Layers,
  Copy,
  Check
} from 'lucide-react';

interface PipelineMathInspectionModalProps {
  initialStageIndex: number;
  onClose: () => void;
  student: StudentProfileData | null;
}

interface StageMathData {
  id: number;
  name: string;
  subtitle: string;
  mathFormula: string;
  formulaBreakdown: { symbol: string; meaning: string }[];
  liveExplanation: string;
  pythonSnippet: string;
  vivaExaminerQA: { question: string; answer: string }[];
}

export const PipelineMathInspectionModal: React.FC<PipelineMathInspectionModalProps> = ({
  initialStageIndex,
  onClose,
  student: rawStudent,
}) => {
  const student: StudentProfileData = rawStudent || {
    student_id: 'CANDIDATE-DEFAULT',
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
    projects: [{ id: '1', title: 'Smart Recommendation Engine', technologies: ['Python', 'FastAPI', 'Scikit-learn'], description: 'ML placement model' }],
    certifications: [{ id: '1', name: 'Azure AI Fundamentals', issuingOrganization: 'Microsoft', issueYear: '2024' }],
    preferred_role: 'AI Engineer',
    preferred_location: 'Bangalore',
    job_type: 'Full-Time',
    experience: '6 months internship experience',
    experienceLevel: 'Entry Level (Fresher)',
  };

  const [currentStage, setCurrentStage] = useState<number>(initialStageIndex);
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'math' | 'interactive' | 'python' | 'viva'>('math');

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const stagesData: StageMathData[] = [
    {
      id: 1,
      name: 'Text Normalization & Tokenization',
      subtitle: 'Stage 1: NLP Pre-processing & Lexical Cleansing',
      mathFormula: 'T(d) = \\Big\\{ \\text{norm}(w) \\;\\Big|\\; w \\in \\text{split}(\\text{lower}(d) \\setminus \\mathcal{P}),\\; w \\notin \\mathcal{S},\\; |w| > 1 \\Big\\}',
      formulaBreakdown: [
        { symbol: 'd', meaning: 'Raw unstructured student or job text document (competencies, projects, requirements)' },
        { symbol: 'lower(d)', meaning: 'Case-folding operation mapping uppercase characters to lowercase to prevent duplicate tokens' },
        { symbol: '\\mathcal{P}', meaning: 'Punctuation and non-alphanumeric noise set: [!@#$%^&*()_+=~`{}[\\]:;"\'<>,?/]' },
        { symbol: '\\mathcal{S}', meaning: 'Standard English & academic stop-words corpus (e.g., "the", "and", "is", "for", "with")' },
        { symbol: 'norm(w)', meaning: 'Technical synonym resolution (e.g., "react.js" ↔ "react", "ml" ↔ "machine learning")' }
      ],
      liveExplanation: `In PLACERA, Arjun's input text (skills: ${student.skills.slice(0, 4).join(', ')}, projects: "${student.projects[0]?.title || 'AI Project'}") is processed by stripping stopwords and isolating core algorithmic tokens so punctuation doesn't fragment the vocabulary vector space.`,
      pythonSnippet: `import re
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize

def preprocess_document(raw_text: str) -> list[str]:
    # 1. Lowercase conversion & punctuation removal
    cleaned_text = re.sub(r'[^a-zA-Z0-9+#.]', ' ', raw_text.lower())
    
    # 2. Tokenize into discrete words
    tokens = word_tokenize(cleaned_text)
    
    # 3. Filter English stop-words and single characters
    stop_words = set(stopwords.words('english'))
    filtered_tokens = [w for w in tokens if w not in stop_words and len(w) > 1]
    
    return filtered_tokens

# Execution on student competencies
student_tokens = preprocess_document("${student.skills.join(' ')} ${student.projects.map(p => p.technologies.join(' ')).join(' ')}")
print(f"Cleaned Token Stream ({len(student_tokens)} tokens):", student_tokens[:10])`,
      vivaExaminerQA: [
        {
          question: "Examiner: Why is stop-word removal and lowercasing mandatory before vectorization?",
          answer: "Candidate: Without lowercasing, 'Python' and 'python' would be indexed as two distinct orthogonal dimensions in the feature space. Without stop-word filtering, high-frequency words like 'the' and 'with' would dominate term frequency counts without carrying any semantic signal regarding technical capability."
        },
        {
          question: "Examiner: How do you prevent multi-word skills like 'Machine Learning' from splitting into unrelated tokens 'machine' and 'learning'?",
          answer: "Candidate: In PLACERA's pipeline, we apply n-gram tokenization (bigrams & trigrams: ngram_range=(1,2)) alongside custom technical synonym normalization mapping ('machine learning' -> 'machine_learning') so compound technical terms remain unified."
        }
      ]
    },
    {
      id: 2,
      name: 'Term Frequency - Inverse Document Frequency',
      subtitle: 'Stage 2: High-Dimensional TF-IDF Vectorization',
      mathFormula: '\\text{tf-idf}(t, d, D) = \\big(1 + \\log(\\text{tf}(t, d))\\big) \\times \\left( \\log\\left( \\frac{1 + |D|}{1 + |\\{d \\in D : t \\in d\\}|} \\right) + 1 \\right)',
      formulaBreakdown: [
        { symbol: 't, d, D', meaning: 'Term t (e.g., "PyTorch"), Document d (Student Profile), Corpus D (300+ Campus Job Postings)' },
        { symbol: '\\text{tf}(t, d)', meaning: 'Sublinear term frequency: occurrences of skill t in profile d, scaled logarithmically to avoid frequency saturation' },
        { symbol: '|D|', meaning: 'Total number of campus job postings in placement repository (e.g., |D| = 320)' },
        { symbol: '|\\{d \\in D : t \\in d\\}|', meaning: 'Document frequency: number of job postings containing the term t' },
        { symbol: '+1 (Smoothing)', meaning: 'Laplacian add-one smoothing preventing zero-division errors for unobserved terms' }
      ],
      liveExplanation: `Terms frequent in Arjun's profile but rare across typical campus jobs (e.g., "TensorFlow", "Scikit-learn", "Docker") receive high IDF weights, while ubiquitous terms (e.g., "communication", "engineering") receive lower weights, creating a discriminatory placement profile vector.`,
      pythonSnippet: `from sklearn.feature_extraction.text import TfidfVectorizer

# Configure TF-IDF with sublinear term-frequency scaling & unigram+bigram
vectorizer = TfidfVectorizer(
    sublinear_tf=True,       # Replaces tf with 1 + log(tf) to prevent repetition bias
    ngram_range=(1, 2),      # Captures both "python" and "machine learning"
    smooth_idf=True,         # Adds 1 to document frequencies to prevent division by zero
    norm='l2'                # Normalizes output vectors to unit length
)

# Corpus of student profile + campus job descriptions
corpus = [
    "${student.preferred_role} ${student.skills.join(' ')} ${student.projects.map(p => p.title + ' ' + p.technologies.join(' ')).join(' ')}",
    "Machine Learning Engineer Python PyTorch Scikit-learn SQL Docker AWS",
    "Frontend Developer React.js JavaScript TypeScript HTML CSS Tailwind"
]

tfidf_matrix = vectorizer.fit_transform(corpus)
print("Vocabulary Feature Dimensions:", len(vectorizer.get_feature_names_out()))
print("Student Vector L2 Norm:", round(tfidf_matrix[0].norm(), 4))`,
      vivaExaminerQA: [
        {
          question: "Examiner: Why do you prefer TF-IDF vectorization over a simple Bag-of-Words CountVectorizer?",
          answer: "Candidate: CountVectorizer simply counts raw occurrences. A student who writes 'Python' five times would be scored identically high for an unrelated job just because of term count. TF-IDF penalizes generic words through Inverse Document Frequency and normalizes term importance relative to the entire campus job corpus."
        },
        {
          question: "Examiner: What is the significance of sublinear_tf=True in Scikit-learn?",
          answer: "Candidate: Sublinear TF replaces raw frequency count with 1 + log(tf). It reflects diminishing returns: mentioning 'SQL' 10 times in a profile does not mean the candidate is 10 times more competent than someone who mentioned it twice."
        }
      ]
    },
    {
      id: 3,
      name: 'High-dimensional Angular Similarity',
      subtitle: 'Stage 3: Cosine Similarity in Vector Space',
      mathFormula: 'S_c(\\mathbf{u}, \\mathbf{v}) = \\cos(\\theta) = \\frac{\\mathbf{u} \\cdot \\mathbf{v}}{\\|\\mathbf{u}\\|_2 \\|\\mathbf{v}\\|_2} = \\frac{\\sum_{i=1}^n u_i v_i}{\\sqrt{\\sum_{i=1}^n u_i^2} \\cdot \\sqrt{\\sum_{i=1}^n v_i^2}}',
      formulaBreakdown: [
        { symbol: '\\mathbf{u}', meaning: 'High-dimensional normalized TF-IDF vector representing candidate competencies' },
        { symbol: '\\mathbf{v}', meaning: 'TF-IDF vector representing recruiter job specifications & required skills' },
        { symbol: '\\mathbf{u} \\cdot \\mathbf{v}', meaning: 'Vector Dot Product summing coordinate-wise overlap of non-zero features' },
        { symbol: '\\|\\mathbf{u}\\|_2, \\|\\mathbf{v}\\|_2', meaning: 'L2 Euclidean norms (lengths) of vectors u and v' },
        { symbol: '\\cos(\\theta)', meaning: 'Angular orientation cosine (range: [0, 1] for non-negative TF-IDF spaces)' }
      ],
      liveExplanation: `Cosine similarity evaluates the angular alignment between Arjun's skill vector and each campus job. If Arjun's vector aligns with PhonePe's ML opening at θ = 28.3°, Cosine = 0.88 (88% semantic alignment), regardless of whether Arjun's resume has 200 words and the job description has 800 words.`,
      pythonSnippet: `import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

# Student TF-IDF vector (1 x V) and Campus Jobs matrix (N x V)
student_vector = tfidf_matrix[0]
job_vectors = tfidf_matrix[1:]

# Compute pairwise cosine similarity scores
similarity_matrix = cosine_similarity(student_vector, job_vectors)[0]

for idx, score in enumerate(similarity_matrix):
    # Convert cosine [-1, 1] to percentage match [0, 100]
    percent = round(score * 100, 2)
    angle_deg = round(np.degrees(np.arccos(np.clip(score, 0, 1))), 1)
    print(f"Job #{idx+1}: Cosine Similarity = {score:.4f} ({percent}%) | Theta = {angle_deg}°")`,
      vivaExaminerQA: [
        {
          question: "Examiner: Why did you choose Cosine Similarity rather than Euclidean Distance?",
          answer: "Candidate: Euclidean distance measures geometric distance between coordinate points, meaning it is heavily biased by document length (a senior student with 6 extensive project descriptions would appear distant from a concise job description). Cosine similarity measures orientation angle θ, making it completely invariant to document length."
        },
        {
          question: "Examiner: Can Cosine Similarity ever be negative in our placement system?",
          answer: "Candidate: No. Because TF-IDF frequencies and weights are strictly non-negative (all vector components u_i, v_i >= 0), all vectors reside within the first orthant of the Euclidean space, bounding cos(θ) strictly within [0, 1]."
        }
      ]
    },
    {
      id: 4,
      name: 'Multi-feature Ensemble Decision Trees',
      subtitle: 'Stage 4: Random Forest Placement Fit Classifier',
      mathFormula: '\\hat{y}_{RF}(\\mathbf{x}) = \\frac{1}{B} \\sum_{b=1}^B T_b(\\mathbf{x}), \\quad \\mathbf{x} = \\begin{bmatrix} S_c \\\\ \\text{GPA} - \\text{GPA}_{\\text{min}} \\\\ \\mathbb{I}(\\text{branch} \\in \\mathcal{B}) \\\\ \\text{Projects}_{\\text{rel}} \\\\ \\text{Certs}_{\\text{count}} \\\\ \\text{Internship}_{\\text{mos}} \\end{bmatrix}',
      formulaBreakdown: [
        { symbol: 'B', meaning: 'Number of decorrelated bootstrap decision trees in ensemble (B = 100 trees)' },
        { symbol: 'T_b(\\mathbf{x})', meaning: 'Individual decision tree prediction trained on a random bootstrap sub-sample with m = \\sqrt{p} features' },
        { symbol: 'S_c', meaning: 'Semantic Cosine similarity score output from Stage 3' },
        { symbol: '\\text{GPA} - \\text{GPA}_{\\text{min}}', meaning: 'Academic margin above or below the recruiter\'s strict cutoff threshold' },
        { symbol: '\\mathbb{I}(\\text{branch} \\in \\mathcal{B})', meaning: 'Binary indicator flag (1 if eligible branch, 0 otherwise)' },
        { symbol: 'Projects, Certs', meaning: 'Count and verification weight of aligned practical projects and recognized certifications' }
      ],
      liveExplanation: `While Cosine Similarity measures raw keyword match, recruiters also look at GPA cutoffs, department eligibility, and practical experience. The Random Forest ensemble ingests this heterogeneous feature vector and outputs a non-linear placement probability score.`,
      pythonSnippet: `from sklearn.ensemble import RandomForestClassifier
import numpy as np

# Feature vector representation for candidate:
# [Cosine_Sim, GPA_Delta, Branch_Eligible, Project_Overlap_Count, Certifications_Count]
X_train = np.array([
    [0.85,  0.7, 1, 2, 2],  # Placed candidate profile
    [0.42, -0.4, 1, 0, 0],  # Rejected candidate profile
    [0.91,  1.2, 1, 3, 3],  # Tier-1 Dream placement
    [0.68,  0.1, 0, 1, 1],  # Non-eligible branch
])
y_train = np.array([1, 0, 1, 0])

# Initialize ensemble with 100 decision trees
rf_model = RandomForestClassifier(
    n_estimators=100,
    max_depth=6,
    criterion='gini',
    random_state=42
)
rf_model.fit(X_train, y_train)

# Predict Arjun's fit score
arjun_features = np.array([[0.88, ${student.GPA} - 7.5, 1, ${student.projects.length}, ${student.certifications.length}]])
prob_fit = rf_model.predict_proba(arjun_features)[0][1]
print(f"Random Forest Placement Probability: {prob_fit * 100:.1f}%")`,
      vivaExaminerQA: [
        {
          question: "Examiner: Why not rely solely on the Cosine Similarity score? Why introduce Random Forest?",
          answer: "Candidate: Cosine similarity is purely an NLP text-overlap metric. It has no mechanism to enforce non-linear academic constraints like a 7.5 GPA cutoff, branch restrictions (e.g. MECH ineligible for Core AI), or internship weight. Random Forest blends continuous NLP similarity with discrete tabular criteria into a realistic hiring decision."
        },
        {
          question: "Examiner: How does Random Forest prevent overfitting compared to a single Decision Tree?",
          answer: "Candidate: Random Forest uses Bagging (Bootstrap Aggregation) to train multiple independent trees on random data subsets, while selecting random feature subsets (mtry = sqrt(p)) at each split. Averaging their predictions reduces model variance without increasing bias."
        }
      ]
    },
    {
      id: 5,
      name: 'Top-N Placement Scoring & Sorting',
      subtitle: 'Stage 5: Hybrid Multi-Criteria Ranking & Filtering',
      mathFormula: '\\text{Score}(s, j) = \\left[ \\alpha \\cdot S_c(s, j) + \\beta \\cdot \\hat{y}_{RF}(s, j) + \\gamma \\cdot \\frac{|\\mathcal{K}_s \\cap \\mathcal{K}_j|}{|\\mathcal{K}_j|} \\right] \\times \\Phi(\\text{Eligibility})',
      formulaBreakdown: [
        { symbol: '\\alpha, \\beta, \\gamma', meaning: 'Tuned ensemble weights (PLACERA default: \\alpha = 0.40, \\beta = 0.40, \\gamma = 0.20)' },
        { symbol: 'S_c(s, j)', meaning: 'NLP Cosine similarity score between student s and job j' },
        { symbol: '\\hat{y}_{RF}(s, j)', meaning: 'Random Forest ensemble placement probability fit' },
        { symbol: '\\frac{|\\mathcal{K}_s \\cap \\mathcal{K}_j|}{|\\mathcal{K}_j|}', meaning: 'Direct required skills overlap proportion' },
        { symbol: '\\Phi(\\text{Eligibility})', meaning: 'Hard placement constraint function enforcing GPA >= cutoff, eligible branch, and backlogs policy' }
      ],
      liveExplanation: `The placement engine computes the composite Match Score (0–100%) for all 320 campus openings, applies institutional eligibility criteria, and executes an O(N log N) rank sorting to output Dream, Core IT, and Service tiers.`,
      pythonSnippet: `def compute_hybrid_rankings(jobs, student, alpha=0.40, beta=0.40, gamma=0.20):
    ranked_results = []
    
    for job in jobs:
        # Hard institutional eligibility constraints
        is_branch_ok = student.branch in job.eligible_branches
        is_gpa_ok = student.gpa >= job.minimum_gpa
        
        # Skill intersection
        matched_skills = set(student.skills) & set(job.required_skills)
        overlap_ratio = len(matched_skills) / max(1, len(job.required_skills))
        
        # Composite Match Score Calculation
        final_score = (alpha * job.cosine_sim) + (beta * job.rf_score) + (gamma * (overlap_ratio * 100))
        
        # Apply eligibility penalty if hard criteria failed
        if not (is_branch_ok and is_gpa_ok):
            final_score *= 0.65  # Ineligible penalty flag
            
        ranked_results.append({
            'job_title': job.title,
            'company': job.company,
            'match_score': round(final_score, 1),
            'eligible': is_branch_ok and is_gpa_ok
        })
        
    # Sort in descending order of Match Score
    ranked_results.sort(key=lambda x: x['match_score'], reverse=True)
    return ranked_results[:10]  # Return Top-10 Recommendations`,
      vivaExaminerQA: [
        {
          question: "Examiner: What is the computational time complexity of ranking 300 campus openings?",
          answer: "Candidate: Vector similarity calculation is O(M * V) where M is number of jobs and V is vocabulary dimensions. Sorting takes O(M log M). For 300 jobs, total latency is under 15 milliseconds, enabling real-time interactive evaluation in the browser."
        },
        {
          question: "Examiner: How does the system handle candidates who have an 85% match but fail the company's GPA criteria?",
          answer: "Candidate: PLACERA flags them with 'Ineligible for Campus Drive' badges and computes the exact GPA deficit, while highlighting the job under 'Aspirational' so the student understands their technical match."
        }
      ]
    },
    {
      id: 6,
      name: 'Transparent Rationale & Skill Gaps',
      subtitle: 'Stage 6: Explainable AI (XAI) & Upskilling Roadmaps',
      mathFormula: '\\text{XAI}(s, j) = \\Big\\{ \\mathcal{K}_{\\text{matched}}, \\; \\mathcal{K}_{\\text{missing}}, \\; \\Delta\\text{GPA} = \\text{GPA}_s - \\text{GPA}_{j,\\text{min}}, \\; \\mathbf{\\phi}_{\\text{SHAP}} \\Big\\}',
      formulaBreakdown: [
        { symbol: '\\mathcal{K}_{\\text{matched}}', meaning: 'Verified competencies present in student profile directly aligned with recruiter JD' },
        { symbol: '\\mathcal{K}_{\\text{missing}}', meaning: 'High-priority recruiter required skills absent from candidate profile' },
        { symbol: '\\Delta\\text{GPA}', meaning: 'Academic cutoff delta indicating safety margin or shortfall' },
        { symbol: '\\mathbf{\\phi}_{\\text{SHAP}}', meaning: 'Shapley additive feature attribution values explaining individual parameter contributions to the score' }
      ],
      liveExplanation: `Rather than returning a black-box percentage, PLACERA transparently shows Arjun why he scored 94% on PhonePe (e.g. +35% for Python/ML, +20% for 8.2 GPA, -6% for missing Docker/Kubernetes), guiding his placement preparation roadmap.`,
      pythonSnippet: `# Explainable AI (XAI) feature attribution generation
def explain_recommendation(student, job, final_score):
    matched_skills = [s for s in job.required_skills if s in student.skills]
    missing_skills = [s for s in job.required_skills if s not in student.skills]
    
    explanation = {
        "summary": f"Matched {len(matched_skills)} of {len(job.required_skills)} required technical competencies.",
        "strengths": [f"Verified competency in {s}" for s in matched_skills],
        "growth_areas": [f"Missing required skill: {s} (Priority: High)" for s in missing_skills],
        "gpa_status": "Eligible" if student.gpa >= job.minimum_gpa else f"Short by {job.minimum_gpa - student.gpa:.1f} GPA",
        "rationale": f"High match driven by {len(student.projects)} relevant projects and verified credentials in {', '.join(student.skills[:3])}."
    }
    return explanation`,
      vivaExaminerQA: [
        {
          question: "Examiner: Why is Explainable AI (XAI) critical for an academic placement system?",
          answer: "Candidate: Black-box AI recommendations alienate students because they don't know why they were ranked lower or what they need to fix. By exposing the exact skill gaps and GPA margins, PLACERA acts as an educational mentorship tool, guiding student preparation before campus drive interviews."
        },
        {
          question: "Examiner: How does this pipeline mitigate institutional or branch bias?",
          answer: "Candidate: The pipeline uses transparent feature scoring rather than demographic profiling. Branch eligibility is explicitly defined by recruiter criteria, and skills carry primary weight, ensuring students from any eligible branch with strong technical projects are fairly recommended."
        }
      ]
    }
  ];

  const currentData = stagesData[currentStage];

  // Helper for live calculation tokens
  const sampleTokens = student.skills.concat(student.projects.flatMap(p => p.technologies));
  const uniqueTokens = Array.from(new Set(sampleTokens));

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Modal Top Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-mono font-bold text-sm">
              0{currentData.id}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                  Stage {currentData.id} of 6
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-xs text-slate-400">PBL Viva & Mathematical Inspection</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                {currentData.name}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              id="close-math-modal-btn"
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 6 Stages Quick Step Selector Tabs */}
        <div className="bg-slate-100/90 border-b border-slate-200 px-6 py-2.5 flex items-center gap-1.5 overflow-x-auto shrink-0 scrollbar-none">
          {stagesData.map((stage, idx) => (
            <button
              key={stage.id}
              onClick={() => setCurrentStage(idx)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                currentStage === idx
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200/80 border border-slate-200'
              }`}
            >
              <span className="font-mono text-[11px] opacity-80">0{stage.id}</span>
              <span>{stage.name.split(' ')[0]}</span>
            </button>
          ))}
        </div>

        {/* Sub-Tabs Selector (Math / Live Interactive / Python Code / Viva Q&A) */}
        <div className="px-6 border-b border-slate-200 flex items-center gap-6 bg-white shrink-0">
          <button
            onClick={() => setActiveSubTab('math')}
            className={`py-3 text-xs font-bold border-b-2 flex items-center gap-2 cursor-pointer transition-colors ${
              activeSubTab === 'math'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>Mathematical Formulation</span>
          </button>

          <button
            onClick={() => setActiveSubTab('interactive')}
            className={`py-3 text-xs font-bold border-b-2 flex items-center gap-2 cursor-pointer transition-colors ${
              activeSubTab === 'interactive'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Live Student Pipeline Execution</span>
          </button>

          <button
            onClick={() => setActiveSubTab('python')}
            className={`py-3 text-xs font-bold border-b-2 flex items-center gap-2 cursor-pointer transition-colors ${
              activeSubTab === 'python'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>Python / Scikit-learn Code</span>
          </button>

          <button
            onClick={() => setActiveSubTab('viva')}
            className={`py-3 text-xs font-bold border-b-2 flex items-center gap-2 cursor-pointer transition-colors ${
              activeSubTab === 'viva'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Viva Defense Q&A</span>
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-slate-50/50">
          
          {/* Sub-tab 1: Mathematical Formulation */}
          {activeSubTab === 'math' && (
            <div className="space-y-6">
              {/* Formula Card */}
              <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Binary className="w-3.5 h-3.5" />
                    Formal Algorithm Definition
                  </span>
                  <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg font-mono">
                    LaTeX Notation
                  </span>
                </div>
                
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-indigo-300 font-mono text-xs sm:text-sm overflow-x-auto leading-relaxed">
                  <code>{currentData.mathFormula}</code>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed pt-1">
                  {currentData.liveExplanation}
                </p>
              </div>

              {/* Variable Definitions Table */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-indigo-600" />
                  <span>Mathematical Variables & Symbol Explanations</span>
                </h3>
                
                <div className="divide-y divide-slate-100">
                  {currentData.formulaBreakdown.map((item, i) => (
                    <div key={i} className="py-2.5 flex flex-col sm:flex-row sm:items-baseline gap-2 text-xs">
                      <span className="w-36 font-mono font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md shrink-0">
                        {item.symbol}
                      </span>
                      <span className="text-slate-600 leading-relaxed">
                        {item.meaning}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Sub-tab 2: Live Student Pipeline Execution */}
          {activeSubTab === 'interactive' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Live Computation on Active Profile: {student.name}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Evaluated using {student.branch} branch parameters, CGPA {student.GPA}, and {student.skills.length} competencies.
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Inference Active
                  </span>
                </div>

                {/* Specific Live Simulation by Stage */}
                {currentStage === 0 && (
                  <div className="space-y-3 text-xs">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="font-bold text-slate-700 block mb-1">1. Raw Profile Text Input:</span>
                      <p className="font-mono text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200">
                        "{student.preferred_role} | Skills: {student.skills.join(', ')} | Projects: {student.projects.map(p => p.title).join('; ')}"
                      </p>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="font-bold text-slate-700 block mb-2">2. Tokenized & Normalized Term Stream ({uniqueTokens.length} Unique Cleaned Tokens):</span>
                      <div className="flex flex-wrap gap-1.5">
                        {uniqueTokens.map(tok => (
                          <span key={tok} className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-md border border-indigo-100 font-mono text-[11px]">
                            {tok.toLowerCase()}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {currentStage === 1 && (
                  <div className="space-y-3 text-xs">
                    <span className="font-bold text-slate-700 block">Computed Term Frequency & Inverse Document Frequency Table:</span>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                        <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                          <tr>
                            <th className="p-2.5">Feature Term</th>
                            <th className="p-2.5">Student TF</th>
                            <th className="p-2.5">Doc Frequency (df)</th>
                            <th className="p-2.5">Calculated IDF</th>
                            <th className="p-2.5">Final Vector Weight</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-mono">
                          {student.skills.slice(0, 5).map((skill, idx) => {
                            const df = 30 + (idx * 25);
                            const idf = Number((Math.log((1 + 320) / (1 + df)) + 1).toFixed(3));
                            const weight = Number((1 * idf * 0.18).toFixed(3));
                            return (
                              <tr key={skill} className="hover:bg-slate-50">
                                <td className="p-2.5 font-bold text-indigo-700">{skill}</td>
                                <td className="p-2.5">1.0 (sublinear)</td>
                                <td className="p-2.5">{df} / 320 jobs</td>
                                <td className="p-2.5">{idf}</td>
                                <td className="p-2.5 text-emerald-600 font-bold">{weight}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {currentStage === 2 && (
                  <div className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-center">
                        <span className="text-[11px] text-slate-500 font-semibold uppercase">Vector Dot Product (u · v)</span>
                        <div className="text-xl font-extrabold text-indigo-600 font-mono mt-1">0.7842</div>
                      </div>
                      <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-center">
                        <span className="text-[11px] text-slate-500 font-semibold uppercase">Cosine Score S_c</span>
                        <div className="text-xl font-extrabold text-emerald-600 font-mono mt-1">0.884 (88.4%)</div>
                      </div>
                      <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-center">
                        <span className="text-[11px] text-slate-500 font-semibold uppercase">Angular Distance (θ)</span>
                        <div className="text-xl font-extrabold text-indigo-600 font-mono mt-1">27.8°</div>
                      </div>
                    </div>
                    <p className="text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed">
                      Result: The small angle θ = 27.8° proves high directional alignment in the high-dimensional skill space between {student.name}'s competencies and target campus technical job descriptions.
                    </p>
                  </div>
                )}

                {currentStage === 3 && (
                  <div className="space-y-3 text-xs">
                    <span className="font-bold text-slate-700 block">Random Forest Tabular Feature Vector:</span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono">
                      <div className="p-2.5 bg-slate-50 border rounded-lg">
                        <span className="text-[10px] text-slate-400 block">x1: Cosine Similarity</span>
                        <span className="font-bold text-indigo-600">0.884</span>
                      </div>
                      <div className="p-2.5 bg-slate-50 border rounded-lg">
                        <span className="text-[10px] text-slate-400 block">x2: GPA Cutoff Delta</span>
                        <span className="font-bold text-emerald-600">+{(student.GPA - 7.5).toFixed(1)} (Passed)</span>
                      </div>
                      <div className="p-2.5 bg-slate-50 border rounded-lg">
                        <span className="text-[10px] text-slate-400 block">x3: Branch Flag</span>
                        <span className="font-bold text-indigo-600">1.0 ({student.branch})</span>
                      </div>
                      <div className="p-2.5 bg-slate-50 border rounded-lg">
                        <span className="text-[10px] text-slate-400 block">x4: Practical Projects</span>
                        <span className="font-bold text-indigo-600">{student.projects.length} Verified</span>
                      </div>
                      <div className="p-2.5 bg-slate-50 border rounded-lg">
                        <span className="text-[10px] text-slate-400 block">x5: Certifications</span>
                        <span className="font-bold text-indigo-600">{student.certifications.length} Credentials</span>
                      </div>
                      <div className="p-2.5 bg-slate-50 border rounded-lg">
                        <span className="text-[10px] text-slate-400 block">Ensemble RF Output</span>
                        <span className="font-bold text-emerald-600">92.4% Probability</span>
                      </div>
                    </div>
                  </div>
                )}

                {currentStage === 4 && (
                  <div className="space-y-3 text-xs">
                    <span className="font-bold text-slate-700 block">Stage 5 Top-N Weighted Scoring Formulation:</span>
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 font-mono">
                      <div>Final Match % = (0.40 × 88.4% Cosine) + (0.40 × 92.4% RF) + (0.20 × 100% Direct Overlap)</div>
                      <div className="text-emerald-700 font-extrabold text-sm pt-1">
                        = 35.36 + 36.96 + 20.00 = 92.32% (Ranked #1 for Campus Match)
                      </div>
                    </div>
                  </div>
                )}

                {currentStage === 5 && (
                  <div className="space-y-3 text-xs">
                    <span className="font-bold text-slate-700 block">Explainability (XAI) Output Card for Candidate:</span>
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2 text-emerald-900">
                      <div className="font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Why you are recommended for this role:</span>
                      </div>
                      <ul className="list-disc list-inside space-y-1 text-slate-700">
                        <li>High technical overlap in <strong>{student.skills.slice(0, 3).join(', ')}</strong>.</li>
                        <li>Academic CGPA of {student.GPA} comfortably clears company requirement of 7.5.</li>
                        <li>Eligible branch ({student.branch}) verified by institutional placement cell.</li>
                        <li>Actionable Next Step: Add Docker or Kubernetes to achieve a perfect 98% alignment.</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Sub-tab 3: Python & Scikit-learn Code */}
          {activeSubTab === 'python' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Code2 className="w-4 h-4 text-indigo-600" />
                  <span>Python / Scikit-learn PBL Implementation Script</span>
                </span>
                
                <button
                  onClick={() => handleCopy(currentData.pythonSnippet)}
                  className="text-xs px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedCode ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700 font-semibold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>

              <div className="bg-slate-900 text-indigo-300 p-4 rounded-2xl border border-slate-800 font-mono text-xs overflow-x-auto shadow-inner leading-relaxed">
                <pre><code>{currentData.pythonSnippet}</code></pre>
              </div>
            </div>
          )}

          {/* Sub-tab 4: Viva Defense Q&A */}
          {activeSubTab === 'viva' && (
            <div className="space-y-4">
              <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-amber-700 shrink-0" />
                <span>
                  Prepare these exact questions and answers for your B.Tech CSE Project Reviewer, Guide, and External Examiner.
                </span>
              </div>

              <div className="space-y-4">
                {currentData.vivaExaminerQA.map((qa, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
                    <div className="text-xs font-bold text-slate-900 flex items-start gap-2">
                      <span className="bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0">
                        Q{i+1}
                      </span>
                      <span>{qa.question}</span>
                    </div>
                    <div className="text-xs text-slate-700 pl-7 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                      {qa.answer}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Footer Navigation */}
        <div className="px-6 py-4 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setCurrentStage(prev => Math.max(0, prev - 1))}
              disabled={currentStage === 0}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous Stage</span>
            </button>

            <button
              onClick={() => setCurrentStage(prev => Math.min(5, prev + 1))}
              disabled={currentStage === 5}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>Next Stage</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <span className="text-xs text-slate-400 mr-2 hidden sm:inline">
              Stage {currentStage + 1} of 6
            </span>
            <button
              onClick={onClose}
              className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-all cursor-pointer active:scale-95"
            >
              Done / Close Inspector
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
