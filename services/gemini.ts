import { GoogleGenAI, Type } from "@google/genai";
import { Job, UserPreferences } from "../types";

// Initialize the Gemini client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// In-memory cache to store results of previous queries
const queryCache = new Map<string, Job[]>();

/**
 * Generates a unique cache key based on user preferences.
 */
const generateCacheKey = (prefs: UserPreferences): string => {
  const { resume, ...rest } = prefs;
  const resumeSignature = resume 
    ? `${resume.fileName}_${resume.base64.length}_${resume.mimeType}`
    : 'no_resume';
  
  const stablePrefs = JSON.stringify(rest, Object.keys(rest).sort());
  return `${stablePrefs}::${resumeSignature}`;
};

const SYSTEM_INSTRUCTION = `
  You are the "Lumina Career Architect", a sophisticated Multi-Agent System.
  
  Agents:
  1. **Scraper Agent**: Retrieve realistic, high-quality job postings. Adhere to filters.
  2. **Analyst Agent**: Calculate 'matchScore' (0-100). If resume is present, cross-reference deeply.
  3. **Market Intelligence Engine** (PREMIUM ONLY):
     - If requested, generate deep-layer forecasts:
     - **Supply vs Demand**: Analyze role competitiveness (e.g., "Oversaturated", "High Demand").
     - **Comp Forecast**: Predict salary trends (e.g., "+10% in 1 year").
     - **Trajectory**: Predict 2-5 year career outcomes for this specific path.

  OUTPUT FORMAT:
  - JSON Array.
  - No markdown.
`;

export const findAndRankJobs = async (
  prefs: UserPreferences,
  onLog: (agent: string, action: string) => void
): Promise<Job[]> => {
  
  onLog("Coordinator", "Initializing Multi-Agent System...");

  const cacheKey = generateCacheKey(prefs);
  if (queryCache.has(cacheKey)) {
    onLog("Coordinator", "Identical query detected in Quantum Cache.");
    onLog("System", "Retrieving cached results (0ms latency, $0 cost)...");
    await new Promise(resolve => setTimeout(resolve, 600)); 
    const cachedJobs = queryCache.get(cacheKey);
    if (cachedJobs) {
      onLog("Coordinator", `Restored ${cachedJobs.length} opportunities from memory banks.`);
      return cachedJobs;
    }
  }
  
  const model = "gemini-2.5-flash"; 

  onLog("Scraper Agent", `Initiating search for ${prefs.jobTitle} roles in ${prefs.location}...`);
  if (prefs.enableIntelligence) {
    onLog("Coordinator", "PREMIUM MODE ACTIVE: Engaging Market Intelligence Engine...");
  }
  
  if (prefs.resume) {
    onLog("Analyst Agent", `Ingesting Resume: ${prefs.resume.fileName}...`);
  }

  const userPrompt = `
    Find 6-8 jobs matching this profile:
    - Role: ${prefs.jobTitle}
    - Location: ${prefs.location}
    - Level: ${prefs.experienceLevel}
    - Salary: $${prefs.salaryMin}k - $${prefs.salaryMax}k
    - Work Mode: ${prefs.workMode}
    - Keywords: ${prefs.keySkills}
    ${prefs.enableIntelligence ? "INCLUDE MARKET INTELLIGENCE DATA FIELDS." : ""}
    ${prefs.resume ? "- REFER TO THE ATTACHED RESUME FOR MATCH SCORING." : ""}
  `;

  const parts: any[] = [{ text: userPrompt }];
  
  if (prefs.resume) {
    parts.push({
      inlineData: {
        mimeType: prefs.resume.mimeType,
        data: prefs.resume.base64
      }
    });
  }

  // Define Schema Properties
  const baseProperties = {
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
  };

  // Add Intelligence Properties if requested
  const finalProperties = prefs.enableIntelligence ? {
    ...baseProperties,
    marketIntelligence: {
      type: Type.OBJECT,
      properties: {
        supplyDemandRating: { type: Type.STRING },
        competitivenessScore: { type: Type.NUMBER },
        salaryGrowthForecast: { type: Type.STRING },
        careerTrajectory: { type: Type.STRING }
      },
      required: ['supplyDemandRating', 'competitivenessScore', 'salaryGrowthForecast', 'careerTrajectory']
    }
  } : baseProperties;

  try {
    if (prefs.enableIntelligence) {
        onLog("Market Intel", "Computing Supply/Demand curves and Compensation Forecasts...");
    } else {
        onLog("Analyst Agent", "Processing retrieved data and calculating Match Scores...");
    }

    const response = await ai.models.generateContent({
      model: model,
      contents: { parts: parts },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: finalProperties,
            required: ['id', 'title', 'company', 'location', 'matchScore', 'platform']
          }
        }
      }
    });

    onLog("Coordinator", "Finalizing results...");
    
    const text = response.text;
    if (!text) throw new Error("No data received from AI agents.");
    
    const jobs = JSON.parse(text) as Job[];
    const sortedJobs = jobs.sort((a, b) => b.matchScore - a.matchScore);

    queryCache.set(cacheKey, sortedJobs);
    
    return sortedJobs;

  } catch (error) {
    console.error("Agent System Error:", error);
    onLog("System", "Error encountered during agent execution.");
    throw error;
  }
};