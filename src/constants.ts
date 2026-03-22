import { Skill, Project } from './types';

export const SKILLS: Skill[] = [
  { name: 'HTML/CSS', level: 90, category: 'frontend', description: 'Modern responsive layouts and animations.' },
  { name: 'C', level: 85, category: 'backend', description: 'System programming and algorithm implementation.' },
  { name: 'Java', level: 75, category: 'backend', description: 'Object-oriented application development.' },
  { name: 'Python', level: 88, category: 'backend', description: 'Data analysis with NumPy, Pandas, Matplotlib, Seaborn.' },
  { name: 'Django', level: 80, category: 'backend', description: 'Full-stack web applications with Python.' },
  { name: 'C# .NET', level: 70, category: 'backend', description: 'Building robust APIs and backend services.' },
  { name: 'n8n/Zapier', level: 85, category: 'ai', description: 'Workflow automation and AI integration.' },
  { name: 'AI/ML Basics', level: 65, category: 'ai', description: 'Exploring neural networks and predictive models.' },
];

export const PROJECTS: Project[] = [
  {
    id: 'c-algo',
    title: 'Algorithm Visualizer',
    category: 'C Projects',
    description: 'A CLI-based visualizer for common sorting and searching algorithms.',
    tech: ['C', 'Ncurses'],
  },
  {
    id: 'py-data',
    title: 'Data Insight Pro',
    category: 'Python Mini Projects',
    description: 'Automated data cleaning and visualization tool using Pandas and Seaborn.',
    tech: ['Python', 'Pandas', 'Seaborn'],
  },
  {
    id: 'ai-bot',
    title: 'Nexus AI Assistant',
    category: 'AI Based Projects',
    description: 'A custom automation bot integrated with n8n for personal task management.',
    tech: ['n8n', 'Python', 'OpenAI API'],
  },
];
