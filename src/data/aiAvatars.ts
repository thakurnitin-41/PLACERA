export interface AIAvatar {
  id: string;
  name: string;
  category: 'ai_tech' | 'professional' | 'campus' | '3d_render' | 'cyber';
  url: string;
  tags: string[];
}

export const AI_SUGGESTED_AVATARS: AIAvatar[] = [
  // 1. AI & Tech Innovators
  {
    id: 'ai-tech-1',
    name: 'AI / ML Engineer',
    category: 'ai_tech',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format&fit=crop&q=80',
    tags: ['AI', 'Neural', 'Deep Learning', 'Tech']
  },
  {
    id: 'ai-tech-2',
    name: 'Cyberpunk Developer',
    category: 'ai_tech',
    url: 'https://images.unsplash.com/photo-1633493106185-5a5078505e81?w=300&auto=format&fit=crop&q=80',
    tags: ['Cyber', 'Coding', 'Futuristic', 'Code']
  },
  {
    id: 'ai-tech-3',
    name: 'Quantum Coder',
    category: 'ai_tech',
    url: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=300&auto=format&fit=crop&q=80',
    tags: ['Quantum', 'Data', 'Algorithms']
  },
  {
    id: 'ai-tech-4',
    name: 'Neural Network Architect',
    category: 'ai_tech',
    url: 'https://images.unsplash.com/photo-1614680376593-902f749f7ffc?w=300&auto=format&fit=crop&q=80',
    tags: ['Architecture', 'Cloud', 'AI']
  },
  {
    id: 'ai-tech-5',
    name: 'Robotics & Vision Specialist',
    category: 'ai_tech',
    url: 'https://images.unsplash.com/photo-1546776310-eef45dd6d63c?w=300&auto=format&fit=crop&q=80',
    tags: ['Robotics', 'Vision', 'Hardware']
  },
  {
    id: 'ai-tech-6',
    name: 'Full Stack Cloud Dev',
    category: 'ai_tech',
    url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=300&auto=format&fit=crop&q=80',
    tags: ['Cloud', 'DevOps', 'Security']
  },

  // 2. Professional & Corporate
  {
    id: 'pro-1',
    name: 'SDE Tech Lead',
    category: 'professional',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    tags: ['Corporate', 'Formal', 'Leadership']
  },
  {
    id: 'pro-2',
    name: 'Software Engineer',
    category: 'professional',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    tags: ['Corporate', 'Engineer', 'Smart']
  },
  {
    id: 'pro-3',
    name: 'Data Science Specialist',
    category: 'professional',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
    tags: ['Data', 'Analytics', 'Executive']
  },
  {
    id: 'pro-4',
    name: 'Product Manager',
    category: 'professional',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    tags: ['Product', 'Management', 'Business']
  },
  {
    id: 'pro-5',
    name: 'Cloud Solutions Architect',
    category: 'professional',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    tags: ['Architect', 'Enterprise', 'Strategy']
  },
  {
    id: 'pro-6',
    name: 'FinTech Consultant',
    category: 'professional',
    url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80',
    tags: ['Finance', 'Consulting', 'Fintech']
  },

  // 3. Campus & Student Life
  {
    id: 'camp-1',
    name: 'Graduate Honors Scholar',
    category: 'campus',
    url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=300&auto=format&fit=crop&q=80',
    tags: ['Campus', 'Academic', 'Scholar']
  },
  {
    id: 'camp-2',
    name: 'Hackathon Winner',
    category: 'campus',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
    tags: ['Hackathon', 'Coding', 'Student']
  },
  {
    id: 'camp-3',
    name: 'Engineering Researcher',
    category: 'campus',
    url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80',
    tags: ['Research', 'Lab', 'College']
  },
  {
    id: 'camp-4',
    name: 'Open Source Contributor',
    category: 'campus',
    url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&auto=format&fit=crop&q=80',
    tags: ['Open Source', 'Developer', 'Git']
  },

  // 4. 3D Render & Stylized Personas (DiceBear & 3D illustrations)
  {
    id: '3d-1',
    name: 'Cyber Bot 3D',
    category: '3d_render',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=AIEngineerAlpha&backgroundColor=6366f1,4f46e5',
    tags: ['3D', 'Bot', 'AI', 'Avatar']
  },
  {
    id: '3d-2',
    name: 'Smart Developer 3D',
    category: '3d_render',
    url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Felix&backgroundColor=b6e3f4,c0aede,d1d4f9',
    tags: ['3D', 'Stylized', 'Friendly']
  },
  {
    id: '3d-3',
    name: 'Data Geek 3D',
    category: '3d_render',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=NitinDeveloper&accessories=eyepatch,kurt,prescription01,round&top=shortHairShortFlat,shortHairTheCaesar',
    tags: ['3D', 'Glasses', 'Developer']
  },
  {
    id: '3d-4',
    name: 'Creative Techie 3D',
    category: '3d_render',
    url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=AaravInnovator&backgroundColor=ffd5dc,ffdfbf',
    tags: ['3D', 'Design', 'Creative']
  },
  {
    id: '3d-5',
    name: 'Notionist Minimalist',
    category: '3d_render',
    url: 'https://api.dicebear.com/7.x/notionists/svg?seed=CodePro99&backgroundColor=e2e8f0',
    tags: ['Minimalist', 'Notion', 'Clean']
  },
  {
    id: '3d-6',
    name: 'Micah Vector Pro',
    category: '3d_render',
    url: 'https://api.dicebear.com/7.x/micah/svg?seed=DevStar2025&backgroundColor=b6e3f4,ffd5dc',
    tags: ['Vector', 'Modern', 'Illustration']
  },

  // 5. Cyber & Pixel Hacker
  {
    id: 'cyb-1',
    name: 'Retro Arcade Hacker',
    category: 'cyber',
    url: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=HackerElite42',
    tags: ['Pixel', 'Retro', 'Hacker', '8bit']
  },
  {
    id: 'cyb-2',
    name: 'Cybernetic Sentinel',
    category: 'cyber',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=CyberSentinel99&backgroundColor=0f172a',
    tags: ['Cyber', 'Sentinel', 'Robot']
  },
  {
    id: 'cyb-3',
    name: 'Neon Pixel Dev',
    category: 'cyber',
    url: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=CampusCoder2025',
    tags: ['Pixel', 'Neon', 'Coder']
  },
  {
    id: 'cyb-4',
    name: 'Shapes Abstract AI',
    category: 'cyber',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=NeuralCluster&backgroundColor=6366f1,0f172a',
    tags: ['Abstract', 'Geometric', 'AI']
  }
];

export const DICEBEAR_STYLES = [
  { id: 'bottts', label: '🤖 AI Robots & Bots' },
  { id: 'adventurer', label: '🎨 3D Adventurer' },
  { id: 'avataaars', label: '👓 Modern Avataaars' },
  { id: 'lorelei', label: '✨ Stylized Portrait' },
  { id: 'notionists', label: '📝 Notionist Sketch' },
  { id: 'micah', label: '🌟 Modern Vector' },
  { id: 'pixel-art', label: '👾 8-Bit Pixel Hacker' },
  { id: 'shapes', label: '🔷 Abstract Neural' },
];

export function generateCustomDicebearUrl(style: string, seed: string): string {
  const cleanSeed = encodeURIComponent(seed.trim() || 'StudentDeveloper');
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${cleanSeed}`;
}
