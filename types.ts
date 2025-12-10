export interface UserPreferences {
  jobTitle: string;
  location: string;
  experienceLevel: 'Entry' | 'Mid' | 'Senior' | 'Executive';
  salaryMin: number;
  salaryMax: number;
  industry: string;
  workMode: 'Remote' | 'Hybrid' | 'On-site';
  employmentType: 'Full-time' | 'Contract' | 'Freelance';
  keySkills: string; // Comma separated string for simplicity in form, processed later
  resume?: {
    base64: string;
    mimeType: string;
    fileName: string;
  };
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  postedDate: string;
  platform: 'LinkedIn' | 'Glassdoor' | 'Indeed' | 'Company Site';
  matchScore: number;
  matchReason: string;
  description: string;
  requirements: string[];
  url: string;
}

export enum AgentStatus {
  IDLE = 'IDLE',
  PLANNING = 'PLANNING',
  SCRAPING = 'SCRAPING',
  ANALYZING = 'ANALYZING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}

export interface AgentLog {
  id: string;
  agentName: string;
  action: string;
  timestamp: Date;
}