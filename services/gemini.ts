import { GoogleGenAI, Type } from "@google/genai";
import { Job, UserPreferences } from "../types";

// Initialize the Gemini client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// In-memory cache to store results of previous queries
// Key: Serialized UserPreferences, Value: Job[]
const queryCache = new Map<string, Job[]>();

/**
 * Generates a unique cache key based on user preferences.
 * Optimizes by using resume metadata instead of the full base64 string.
 */
const generateCacheKey = (prefs: UserPreferences): string => {
  const { resume, ...rest } = prefs;
  const resumeSignature = resume 
    ? `${resume.fileName}_${resume.base64.length}_${resume.mimeType}`
    : 'no_resume';
  
  // Sort keys to ensure {a:1, b:2} equals {b:2, a:1}
  const stablePrefs = JSON.stringify(rest, Object.keys(rest).sort());
  return `${stablePrefs}::${resumeSignature}`;
};

// Static System Instruction: Defines the "Brain" of the Multi-Agent System.
// Separating this from the user prompt allows for potential future Context Caching 
// and cleaner separation of concerns.
const SYSTEM_INSTRUCTION = `
  You are the "Lumina Career Architect", a sophisticated Multi-Agent System designed to find and analyze job opportunities.
  
  Your architecture consists of two virtual agents:
  
  1. **Scraper Agent**: 
     - Responsible for retrieving realistic, high-quality job postings.
     - Simulates browsing "LinkedIn", "Glassdoor", "Indeed", and "Company Sites".
     - STRICTLY adheres to filters: Location, Salary Range, Work Mode, Employment Type.
     - Ensures jobs are "Active" (posted recently).

  2. **Analyst Agent**:
     - Calculates a 'matchScore' (0-100) for each job.
     - CRITICAL: If a RESUME is provided, you must cross-reference the resume's implied skills and experience level against the job description.
     - Generates a 'matchReason' that is personalized, punchy, and professional.
     - Extracts key technical and soft skill requirements.

  OUTPUT FORMAT:
  - You must return a valid JSON array.
  - No markdown formatting (no \`\`\`json blocks).
  - Ensure all fields in the schema are populated.
`;

/**
 * Simulates a multi-agent workflow with Caching and System Instructions.
 */
export const findAndRankJobs = async (
  prefs: UserPreferences,
  onLog: (agent: string, action: string) => void
): Promise<Job[]> => {
  
  onLog("Coordinator", "Initializing Multi-Agent System...");

  // 1. Check Cache
  const cacheKey = generateCacheKey(prefs);
  if (queryCache.has(cacheKey)) {
    onLog("Coordinator", "Identical query detected in Quantum Cache.");
    onLog("System", "Retrieving cached results (0ms latency, $0 cost)...");
    
    // Simulate a brief "read" time for UX consistency, but much faster than API
    await new Promise(resolve => setTimeout(resolve, 600)); 
    
    const cachedJobs = queryCache.get(cacheKey);
    if (cachedJobs) {
      onLog("Coordinator", `Restored ${cachedJobs.length} opportunities from memory banks.`);
      return cachedJobs;
    }
  }
  
  const model = "gemini-2.5-flash"; 

  // Phase 1: Search & Retrieval
  onLog("Scraper Agent", `Initiating search for ${prefs.jobTitle} roles in ${prefs.location}...`);
  onLog("Scraper Agent", `Filters: ${prefs.workMode} | ${prefs.employmentType} | $${prefs.salaryMin}k-$${prefs.salaryMax}k`);
  
  if (prefs.resume) {
    onLog("Analyst Agent", `Ingesting Resume: ${prefs.resume.fileName} (${(prefs.resume.base64.length / 1024).toFixed(1)}KB)...`);
  }

  // Construct Dynamic User Prompt (Minimal tokens, referencing System Instruction)
  const userPrompt = `
    Find 6-8 jobs matching this profile:
    
    - Role: ${prefs.jobTitle}
    - Location: ${prefs.location}
    - Level: ${prefs.experienceLevel}
    - Salary: $${prefs.salaryMin}k - $${prefs.salaryMax}k
    - Industry: ${prefs.industry}
    - Work Mode: ${prefs.workMode}
    - Type: ${prefs.employmentType}
    - Keywords: ${prefs.keySkills}
    ${prefs.resume ? "- REFER TO THE ATTACHED RESUME FOR MATCH SCORING." : ""}
  `;

  // Construct Request Parts
  const parts: any[] = [{ text: userPrompt }];
  
  if (prefs.resume) {
    parts.push({
      inlineData: {
        mimeType: prefs.resume.mimeType,
        data: prefs.resume.base64
      }
    });
  }

  try {
    onLog("Analyst Agent", "Processing retrieved data and calculating Match Scores...");

    const response = await ai.models.generateContent({
      model: model,
      contents: { parts: parts },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION, // Optimizes token usage by separating instruction
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
              requirements: { 
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              url: { type: Type.STRING }
            },
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

    // Cache the successful result
    queryCache.set(cacheKey, sortedJobs);
    
    return sortedJobs;

  } catch (error) {
    console.error("Agent System Error:", error);
    onLog("System", "Error encountered during agent execution.");
    throw error;
  }
};