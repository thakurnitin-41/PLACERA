export interface RoadmapPhase {
  phaseNumber: number;
  title: string;
  timeframe: string;
  focus: string;
  milestoneGoal: string;
  tasks: {
    id: string;
    topic: string;
    description: string;
    estimatedHours: number;
    resourceName: string;
    resourceUrl: string;
    type: 'Practice' | 'Study' | 'Project' | 'Assessment';
  }[];
}

export interface RoleRoadmap {
  roleId: string;
  roleTitle: string;
  phases: RoadmapPhase[];
}

export const ROLE_ROADMAPS: Record<string, RoadmapPhase[]> = {
  default: [
    {
      phaseNumber: 1,
      title: 'Phase 1: Core Fundamentals & Primary Language',
      timeframe: 'Weeks 1 – 2',
      focus: 'Language fluency, Object-Oriented Principles, and foundational CS concepts',
      milestoneGoal: 'Write idiomatic code, master OOP constructs, and pass basic technical screening questions.',
      tasks: [
        {
          id: 'p1-1',
          topic: 'Primary Language Mastery (C++ / Java / Python)',
          description: 'Deep dive into memory management, STL/Collections, pointers/references, and time/space complexity analysis.',
          estimatedHours: 14,
          resourceName: 'CS50 / FreeCodeCamp Comprehensive Guide',
          resourceUrl: 'https://cs50.harvard.edu/',
          type: 'Study'
        },
        {
          id: 'p1-2',
          topic: 'Object-Oriented Design (OOP)',
          description: 'Implement Encapsulation, Polymorphism, Abstraction, and Inheritance with real-world design examples.',
          estimatedHours: 8,
          resourceName: 'Refactoring Guru: OOP Design Patterns',
          resourceUrl: 'https://refactoring.guru/design-patterns',
          type: 'Practice'
        },
        {
          id: 'p1-3',
          topic: 'Core Database Systems & SQL Querying',
          description: 'Write complex JOINs, aggregate queries, indexing concepts, and transactions (ACID properties).',
          estimatedHours: 10,
          resourceName: 'SQLZoo & LeetCode Database Problems',
          resourceUrl: 'https://sqlzoo.net/',
          type: 'Assessment'
        }
      ]
    },
    {
      phaseNumber: 2,
      title: 'Phase 2: Algorithmic Problem Solving & DSA',
      timeframe: 'Weeks 3 – 4',
      focus: 'High-frequency campus placement DSA patterns (Arrays, Two Pointers, Trees, Graphs, DP)',
      milestoneGoal: 'Solve Medium-level DSA questions in under 30 minutes without editorial lookups.',
      tasks: [
        {
          id: 'p2-1',
          topic: 'Arrays, Strings & Two Pointers / Sliding Window',
          description: 'Solve top 25 high-frequency array problems including 3Sum, Kadane Algorithm, Trapping Rain Water.',
          estimatedHours: 16,
          resourceName: 'Striver A2Z DSA Sheet / NeetCode 150',
          resourceUrl: 'https://neetcode.io/practice',
          type: 'Practice'
        },
        {
          id: 'p2-2',
          topic: 'Binary Trees, BST & Graph Traversals (BFS / DFS)',
          description: 'Master tree traversals, topological sort, Dijkstra shortest path, and connected components.',
          estimatedHours: 16,
          resourceName: 'LeetCode Tree & Graph Exploration Card',
          resourceUrl: 'https://leetcode.com/explore/',
          type: 'Practice'
        },
        {
          id: 'p2-3',
          topic: 'Dynamic Programming Foundations',
          description: 'Understand 1D & 2D Memoization vs Tabulation on 0/1 Knapsack, LCS, and Coin Change.',
          estimatedHours: 14,
          resourceName: 'MIT 6.006 Algorithmic Lectures',
          resourceUrl: 'https://ocw.mit.edu/',
          type: 'Study'
        }
      ]
    },
    {
      phaseNumber: 3,
      title: 'Phase 3: High-Impact Portfolio Project & System Basics',
      timeframe: 'Weeks 5 – 6',
      focus: 'Full-stack or domain-specific architectural implementation with verifiable proof-of-work',
      milestoneGoal: 'Deploy a complete, documented GitHub project with live URL, tests, and architectural diagram.',
      tasks: [
        {
          id: 'p3-1',
          topic: 'Architectural Implementation with Database & API',
          description: 'Build a production-grade full-stack project or machine learning pipeline with clear API contracts.',
          estimatedHours: 20,
          resourceName: 'GitHub Student Developer Pack & Vercel/Render Deployments',
          resourceUrl: 'https://education.github.com/pack',
          type: 'Project'
        },
        {
          id: 'p3-2',
          topic: 'Low-Level Design (LLD) & Clean Architecture',
          description: 'Model real-world systems: Parking Lot, Rate Limiter, Splitwise, or URL Shortener in code.',
          estimatedHours: 12,
          resourceName: 'System Design Primer (Donna Dong / Shichao)',
          resourceUrl: 'https://github.com/donnemartin/system-design-primer',
          type: 'Practice'
        },
        {
          id: 'p3-3',
          topic: 'Operating Systems & Networking Placement Viva Prep',
          description: 'Review Processes vs Threads, Deadlocks, Virtual Memory, TCP vs UDP handshake, and DNS resolution.',
          estimatedHours: 10,
          resourceName: 'Gate Smashers CS Core Playlist',
          resourceUrl: 'https://www.youtube.com/@GateSmashers',
          type: 'Study'
        }
      ]
    },
    {
      phaseNumber: 4,
      title: 'Phase 4: ATS Resume Polish, Mock Drives & Technical Viva',
      timeframe: 'Weeks 7 – 8',
      focus: 'Campus placement drive simulations, ATS keyword alignment, and behavioral defense',
      milestoneGoal: 'Attain ATS score >= 85%, clear 3 consecutive timed mock coding tests, and ace technical viva.',
      tasks: [
        {
          id: 'p4-1',
          topic: 'Resume Quantification & ATS Optimization',
          description: 'Refactor bullet points using Google XYZ formula: "Accomplished [X] as measured by [Y], by doing [Z]".',
          estimatedHours: 6,
          resourceName: 'Placera ATS Resume Analyzer',
          resourceUrl: '#resume-analyzer',
          type: 'Assessment'
        },
        {
          id: 'p4-2',
          topic: 'Timed Online Assessment (OA) Simulation',
          description: 'Complete 3 full-length 90-minute assessments simulating campus test environments.',
          estimatedHours: 8,
          resourceName: 'HackerRank & Codeforces Contest Archive',
          resourceUrl: 'https://www.hackerrank.com/domains/tutorials/10-days-of-javascript',
          type: 'Practice'
        },
        {
          id: 'p4-3',
          topic: 'HR & Managerial Behavioral Interview (STAR Method)',
          description: 'Prepare answers for Situation, Task, Action, Result on team conflict, leadership, and project roadblocks.',
          estimatedHours: 6,
          resourceName: 'Harvard Office of Career Services Interview Guide',
          resourceUrl: 'https://careerservices.fas.harvard.edu/',
          type: 'Study'
        }
      ]
    }
  ]
};

export function getRoadmapForRole(roleTitle?: string): RoadmapPhase[] {
  return ROLE_ROADMAPS.default;
}
