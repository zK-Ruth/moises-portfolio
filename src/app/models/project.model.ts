export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  category: 'fullstack' | 'devsecops' | 'opensource';
  accentColor: string;
  url?: string;
}
