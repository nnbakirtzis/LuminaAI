
export interface UserPreferences {
  jobTitle: string;
  location: string;
  experienceLevel: 'Entry' | 'Mid' | 'Senior' | 'Executive';
  salaryMin: number;
  salaryMax: number;
  industry: string;
  workMode: 'Remote' | 'Hybrid' | 'On-site';
  employmentType: 'Full-time' | 'Contract' | 'Freelance';
  keySkills: string; 
  resume?: {
    base64: string;
    mimeType: string;
    fileName: string;
  };
  enableIntelligence: boolean; // New Premium Flag
  enableResumeTailoring: boolean; // New Resume Tailoring Flag
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface MarketIntelligence {
  supplyDemandRating: string;
  competitivenessScore: number; // 1-10
  salaryGrowthForecast: string;
  careerTrajectory: string;
}

export interface Source {
  title: string;
  uri: string;
}

export interface RealValueAnalysis {
  originalSalary: string;
  adjustedValue: string; // The "Real" value string (e.g. "$145,000")
  purchasingPowerScore: number; // > 100 means gain, < 100 means loss
  verdict: string; // e.g. "20% Gain in Purchasing Power"
  breakdown: {
    category: string; // e.g. "Housing", "Tax", "Groceries"
    diff: string; // e.g. "+15% cheaper"
    details: string; // e.g. "Rent in Austin is 15% lower than SF"
  }[];
  sources: Source[];
  searchSuggestionsHtml: string[]; // Google Search suggestion chips; must be displayed when grounding is used
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
  marketIntelligence?: MarketIntelligence; // Optional based on mode
  realValueAnalysis?: RealValueAnalysis; // Optional, loaded on demand
}

// Grounding metadata is per agent call, not per job, so sources are reported for the whole run.
export interface SearchResult {
  jobs: Job[];
  sources: Source[];
  searchSuggestionsHtml: string[]; // Google Search suggestion chips; must be displayed when grounding is used
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
