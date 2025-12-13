import { GoogleGenAI, Type } from "@google/genai";
import { Job, UserPreferences, MarketIntelligence } from "../types";

// Initialize the Gemini client
// API Key is strictly obtained from process.env.API_KEY as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Model Selection based on Task Complexity Guidelines:
// - Basic Text Tasks (e.g., extraction, simple Q&A): 'gemini-2.5-flash'
// - Complex Text Tasks (e.g., advanced reasoning, STEM, forecasting): 'gemini-3-pro-preview'
const MODEL_FAST = "gemini-2.5-flash"; 
const MODEL_COMPLEX = "gemini-3-pro-preview";

// ------------------------------------------------------------------
// AGENT SYSTEM INSTRUCTIONS
// ------------------------------------------------------------------

const HEADHUNTER_INSTRUCTION = `
  You are the "Headhunter Agent". Your ONLY job is to find and rank job opportunities.
  - Return realistic, high-quality job postings matching the user's criteria.
  - **Crucially, ONLY find jobs posted within the last 90 days from today's date.**
  - Calculate a 'matchScore' (0-100) based on the user's profile and resume.
  - Do NOT generate market forecasts. Focus solely on the existence of the job and the fit.
  - OUTPUT: JSON Array of Job objects.
`;

const ECONOMIST_INSTRUCTION = `
  You are the "Labor Economist Agent". 
  - You receive a list of specific Job IDs and Titles.
  - Your job is to analyze the MACRO market conditions for each specific role in its location.
  - Determine 'supplyDemandRating' (e.g., "Talent Shortage", "Oversaturated") and 'competitivenessScore' (1-10).
  - OUTPUT: JSON Array mapping Job ID to economic data.
`;

const FUTURIST_INSTRUCTION = `
  You are the "Compensation Futurist Agent".
  - You receive a list of jobs with current salary ranges.
  - Your job is to forecast the financial future of these roles over the next 18 months.
  - Predict 'salaryGrowthForecast' based on inflation, industry trends, and location data.
  - OUTPUT: JSON Array mapping Job ID to forecast data.
`;

const STRATEGIST_INSTRUCTION = `
  You are the "Career Strategist Agent".
  - You receive a list of jobs.
  - Your job is to model the long-term career trajectory for a candidate accepting this role.
  - Predict 'careerTrajectory' (e.g., "Path to CTO", "Lateral move potential only") over 2-5 years.
  - OUTPUT: JSON Array mapping Job ID to trajectory data.
`;

// ------------------------------------------------------------------
// TYPES FOR AGENT INTER-COMMUNICATION
// ------------------------------------------------------------------

interface BaseJobResponse {
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

interface EconomistResponse {
  id: string;
  supplyDemandRating: string;
  competitivenessScore: number;
}

interface FuturistResponse {
  id: string;
  salaryGrowthForecast: string;
}

interface StrategistResponse {
  id: string;
  careerTrajectory: string;
}

// ------------------------------------------------------------------
// MAIN COORDINATOR
// ------------------------------------------------------------------

export const findAndRankJobs = async (
  prefs: UserPreferences,
  onLog: (agent: string, action: string) => void
): Promise<Job[]> => {
  
  onLog("Coordinator", "Initializing Swarm Sequence...");

  // 1. HEADHUNTER AGENT (Discovery) - Uses Fast Model
  onLog("Headhunter Agent", `Scanning all networks for ${prefs.jobTitle} roles...`);
  const baseJobs = await runHeadhunterAgent(prefs, onLog);
  onLog("Headhunter Agent", `Identified ${baseJobs.length} potential candidates.`);

  // If intelligence is disabled, return early
  if (!prefs.enableIntelligence) {
    return baseJobs.map(j => ({ ...j, marketIntelligence: undefined }));
  }

  // 2. INTELLIGENCE SWARM (Parallel Execution) - Uses Complex/Reasoning Model
  onLog("Coordinator", "Spinning up Intelligence Swarm (3 Nodes)...");
  
  // Create a context summary for the sub-agents to save tokens/time
  // We pass the simplified job list to them so they know what they are analyzing.
  const jobContext = baseJobs.map(j => ({
    id: j.id,
    title: j.title,
    company: j.company,
    location: j.location,
    salary: j.salary
  }));

  try {
    const [ecoData, futData, stratData] = await Promise.all([
      runEconomistAgent(jobContext, prefs, onLog),
      runFuturistAgent(jobContext, prefs, onLog),
      runStrategistAgent(jobContext, prefs, onLog)
    ]);

    // 3. MERGER
    onLog("Coordinator", "Aggregating intelligence streams...");
    
    const enrichedJobs: Job[] = baseJobs.map(job => {
      const eco = ecoData.find(e => e.id === job.id);
      const fut = futData.find(f => f.id === job.id);
      const strat = stratData.find(s => s.id === job.id);

      return {
        ...job,
        marketIntelligence: {
          supplyDemandRating: eco?.supplyDemandRating || "Data Unavailable",
          competitivenessScore: eco?.competitivenessScore || 5,
          salaryGrowthForecast: fut?.salaryGrowthForecast || "Steady",
          careerTrajectory: strat?.careerTrajectory || "Standard Progression"
        }
      };
    });

    onLog("Coordinator", "Swarm execution complete.");
    return enrichedJobs;

  } catch (error) {
    onLog("System", "Swarm Partial Failure. Reverting to base data.");
    console.error(error);
    return baseJobs.map(j => ({ ...j, marketIntelligence: undefined }));
  }
};

// ------------------------------------------------------------------
// AGENT IMPLEMENTATIONS
// ------------------------------------------------------------------

async function runHeadhunterAgent(prefs: UserPreferences, onLog: (agent: string, action: string) => void): Promise<BaseJobResponse[]> {
  const prompt = `
    Find 6-8 active job postings matching:
    - Role: ${prefs.jobTitle}
    - Location: ${prefs.location}
    - Pay: $${prefs.salaryMin}k - $${prefs.salaryMax}k
    - Type: ${prefs.employmentType} (${prefs.workMode})
    - **Posted: Within the last 90 days from today.**
    ${prefs.resume ? "Use the attached resume to calculate strict match scores." : ""}
  `;

  const parts: any[] = [{ text: prompt }];
  if (prefs.resume) {
    onLog("Headhunter Agent", "Cross-referencing Resume against Job Descriptions...");
    parts.push({ inlineData: { mimeType: prefs.resume.mimeType, data: prefs.resume.base64 } });
  }

  // Using MODEL_FAST (gemini-2.5-flash) for basic text/extraction tasks
  const response = await ai.models.generateContent({
    model: MODEL_FAST,
    contents: { parts },
    config: {
      systemInstruction: HEADHUNTER_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            title: { type: Type.STRING },
            company: { type: Type.STRING },
            location: { type: Type.STRING },
            salary: { type: Type.STRING },
            postedDate: { type: Type.STRING },
            platform: { type: Type.STRING, enum: ['LinkedIn', 'Glassdoor', 'Indeed', 'Company Site'] },
            matchScore: { type: Type.NUMBER },
            matchReason: { type: Type.STRING },
            description: { type: Type.STRING },
            requirements: { type: Type.ARRAY, items: { type: Type.STRING } },
            url: { type: Type.STRING }
          },
          required: ['id', 'title', 'company', 'matchScore']
        }
      }
    }
  });

  return JSON.parse(response.text || "[]");
}

async function runEconomistAgent(jobs: any[], prefs: UserPreferences, onLog: (agent: string, action: string) => void): Promise<EconomistResponse[]> {
  onLog("Labor Economist", `Analyzing supply/demand for ${jobs.length} roles in ${prefs.location}...`);
  
  // Using MODEL_COMPLEX (gemini-3-pro-preview) for advanced reasoning/economic analysis
  const response = await ai.models.generateContent({
    model: MODEL_COMPLEX,
    contents: { parts: [{ text: JSON.stringify(jobs) }] },
    config: {
      systemInstruction: ECONOMIST_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            supplyDemandRating: { type: Type.STRING },
            competitivenessScore: { type: Type.NUMBER },
          },
          required: ['id', 'supplyDemandRating', 'competitivenessScore']
        }
      }
    }
  });

  return JSON.parse(response.text || "[]");
}

async function runFuturistAgent(jobs: any[], prefs: UserPreferences, onLog: (agent: string, action: string) => void): Promise<FuturistResponse[]> {
  onLog("Comp Futurist", "Forecasting 18-month salary bands and inflation adjustments...");
  
  // Using MODEL_COMPLEX (gemini-3-pro-preview) for forecasting/trends
  const response = await ai.models.generateContent({
    model: MODEL_COMPLEX,
    contents: { parts: [{ text: JSON.stringify(jobs) }] },
    config: {
      systemInstruction: FUTURIST_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            salaryGrowthForecast: { type: Type.STRING },
          },
          required: ['id', 'salaryGrowthForecast']
        }
      }
    }
  });

  return JSON.parse(response.text || "[]");
}

async function runStrategistAgent(jobs: any[], prefs: UserPreferences, onLog: (agent: string, action: string) => void): Promise<StrategistResponse[]> {
  onLog("Career Strategist", `Modeling trajectories for '${prefs.experienceLevel}' level profiles...`);
  
  // Using MODEL_COMPLEX (gemini-3-pro-preview) for career modeling/reasoning
  const response = await ai.models.generateContent({
    model: MODEL_COMPLEX,
    contents: { parts: [{ text: JSON.stringify(jobs) }] },
    config: {
      systemInstruction: STRATEGIST_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            careerTrajectory: { type: Type.STRING },
          },
          required: ['id', 'careerTrajectory']
        }
      }
    }
  });

  return JSON.parse(response.text || "[]");
}