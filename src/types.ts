export type Page = 
  | 'landing' 
  | 'command-center' 
  | 'about' 
  | 'skills' 
  | 'projects' 
  | 'ai-lab' 
  | 'timeline' 
  | 'vault' 
  | 'contact';

export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  tech: string[];
  github?: string;
  demo?: string;
}

export interface Skill {
  name: string;
  level: number;
  category: 'frontend' | 'backend' | 'ai' | 'tools';
  description: string;
}
