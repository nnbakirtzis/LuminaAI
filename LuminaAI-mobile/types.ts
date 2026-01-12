
export interface UserPreferences {
    jobTitle: string;
    location: string;
    experienceLevel: 'Entry' | 'Mid' | 'Senior' | 'Executive';
    salaryMin: number;
    salaryMax: number;
    workMode: 'Remote' | 'Hybrid' | 'On-site';
    employmentType: 'Full-time' | 'Contract' | 'Freelance';
    keySkills: string;
    resume?: {
        base64?: string;
        mimeType: string;
        fileName: string;
        storagePath?: string;
    };
    enableIntelligence: boolean;
    enableResumeTailoring: boolean;
}

export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    resume?: {
        base64?: string;
        mimeType: string;
        fileName: string;
        storagePath?: string;
    };
}

export interface MarketIntelligence {
    supplyDemandRating: string;
    competitivenessScore: number;
    salaryGrowthForecast: string;
    careerTrajectory: string;
}

export interface RealValueAnalysis {
    originalSalary: string;
    adjustedValue: string;
    purchasingPowerScore: number;
    verdict: string;
    breakdown: {
        category: string;
        diff: string;
        details: string;
    }[];
    sources: { title: string; uri: string }[];
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
    marketIntelligence?: MarketIntelligence;
    realValueAnalysis?: RealValueAnalysis;
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
