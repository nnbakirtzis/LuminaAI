
import { GoogleGenAI, Type } from "@google/genai";
import { Job, UserPreferences, MarketIntelligence, RealValueAnalysis } from "../types";

// Initialize the Gemini client
// Note: In production, use expo-constants to get API_KEY from app.config.js
const ai = new GoogleGenAI({ apiKey: process.env.EXPO_PUBLIC_GEMINI_API_KEY || "" });

const MODEL_FLASH = "gemini-3-flash-preview";
const MODEL_PRO = "gemini-3-pro-preview";

const PRICING = {
    [MODEL_FLASH]: { input: 0.075, output: 0.30 },
    [MODEL_PRO]: { input: 3.50, output: 10.50 }
};

// ------------------------------------------------------------------
// COST TRACKING SYSTEM
// ------------------------------------------------------------------

class CostTracker {
    private costs: { agent: string; model: string; input: number; output: number; cost: number }[] = [];

    track(agent: string, model: string, usage: { promptTokenCount?: number; candidatesTokenCount?: number } | undefined) {
        if (!usage) return;

        const input = usage.promptTokenCount || 0;
        const output = usage.candidatesTokenCount || 0;

        const rates = PRICING[model as keyof typeof PRICING] || PRICING[MODEL_FLASH];

        const cost = (input / 1_000_000 * rates.input) + (output / 1_000_000 * rates.output);

        this.costs.push({ agent, model, input, output, cost });
    }

    logSummary(onLog: (agent: string, action: string) => void) {
        let totalCost = 0;
        onLog("System", "--- 💰 RUN COST ANALYSIS ---");

        this.costs.forEach(entry => {
            totalCost += entry.cost;
            const modelShort = entry.model.includes('flash') ? 'Flash' : 'Pro';
            onLog("System", `${entry.agent} (${modelShort}): $${entry.cost.toFixed(6)} (${entry.input + entry.output} toks)`);
        });

        onLog("System", `TOTAL ESTIMATED COST: $${totalCost.toFixed(6)}`);
        onLog("System", "------------------------------");
    }
}

// ------------------------------------------------------------------
// AGENT SYSTEM INSTRUCTIONS
// ------------------------------------------------------------------

const HEADHUNTER_INSTRUCTION = `
  You are the "Headhunter Agent". Your ONLY job is to find and rank job opportunities.
  - Return realistic, high-quality job postings matching the user's criteria.
  - **Crucially, ONLY find jobs posted within the last 30 days from the provided Current Date.**
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

const RESUMATOR_INSTRUCTION = `
  You are the "Resumator Agent", an expert ATS (Applicant Tracking System) optimizer.
  - Your task is to rewrite the candidate's existing resume to specifically target the provided Job Description.
  - **CRITICAL RULE:** Do NOT invent skills, experiences, or degrees that are not in the source resume. You must only rephrase, reorder, or highlight EXISTING information.
  - Adoption of Tone: Match the keywords and professional tone of the Job Description.
  - Format: Return clean Markdown. Use H1 for Name, H2 for Sections.
`;

const FINANCIAL_ANALYST_INSTRUCTION = `
  You are the "Financial Analyst Agent", acting as a high-end financial lifestyle consultant.
  - Your goal is to calculate the "Real Value" of a salary offer and explain it in human-friendly terms.
  
  MANDATORY PROCESS:
  1. Use Google Search to find CURRENT 2024/2025 Cost of Living (COL) indices and Tax Rates for [User Location] vs [Job Location].
  2. Formula: RealValue = OfferSalary * (UserLocation_COL_Index / JobLocation_COL_Index).
  
  VERDICT & EXPLANATION LOGIC (Be conversational, NOT robotic):
  - IF Locations are identical (e.g., Austin vs Austin):
      - Verdict: "Local Opportunity"
      - Explanation: "Since this role is in your current city, this salary goes straight to your wallet with no relocation costs or cost-of-living shocks. It's a direct reflection of your local buying power."
  - IF Real Value >> Offer:
      - Verdict: "Lifestyle Upgrade"
      - Explanation: "Your money goes much further here. Lower living costs mean this salary feels significantly higher than it looks on paper."
  - IF Real Value << Offer:
      - Verdict: "Cost of Living Squeeze"
      - Explanation: "Be careful. Higher living costs in this city mean this salary might feel tighter than you expect."

  OUTPUT: JSON object. Ensure 'verdict' is short (2-4 words) and 'details' in breakdown are friendly.
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

    const costTracker = new CostTracker();

    onLog("Coordinator", "Initializing Swarm Sequence...");

    onLog("Headhunter Agent", `Scanning all networks for ${prefs.jobTitle} roles...`);
    const baseJobs = await runHeadhunterAgent(prefs, onLog, costTracker);
    onLog("Headhunter Agent", `Identified ${baseJobs.length} potential candidates.`);

    if (!prefs.enableIntelligence) {
        costTracker.logSummary(onLog);
        return baseJobs.map(j => ({ ...j, marketIntelligence: undefined }));
    }

    onLog("Coordinator", "Activating Intelligence Swarm (3 Nodes)...");

    const jobContext = baseJobs.map(j => ({
        id: j.id,
        title: j.title,
        company: j.company,
        location: j.location,
        salary: j.salary
    }));

    try {
        const [ecoData, futData, stratData] = await Promise.all([
            runEconomistAgent(jobContext, prefs, onLog, costTracker),
            runFuturistAgent(jobContext, prefs, onLog, costTracker),
            runStrategistAgent(jobContext, prefs, onLog, costTracker)
        ]);

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

        costTracker.logSummary(onLog);

        return enrichedJobs;

    } catch (error) {
        onLog("System", "Swarm Partial Failure. Reverting to base data.");
        console.error(error);
        costTracker.logSummary(onLog);
        return baseJobs.map(j => ({ ...j, marketIntelligence: undefined }));
    }
};

export const generateTailoredResume = async (
    job: Job,
    resume: { mimeType: string; base64: string }
): Promise<string> => {

    const prompt = `
    TARGET JOB DESCRIPTION:
    Title: ${job.title}
    Company: ${job.company}
    Keywords/Requirements: ${job.requirements.join(", ")}
    Description: ${job.description}

    Task: Rewrite the attached resume to maximize ATS match score for this specific job. 
    Output the full resume in clean Markdown format.
  `;

    const response = await ai.models.generateContent({
        model: MODEL_FLASH,
        contents: {
            parts: [
                { text: prompt },
                { inlineData: { mimeType: resume.mimeType, data: resume.base64 } }
            ]
        },
        config: {
            systemInstruction: RESUMATOR_INSTRUCTION,
        }
    });

    return response.text || "Failed to generate resume.";
};

export const calculateRealValue = async (
    job: Job,
    userLocation: string,
    onLog: (agent: string, action: string) => void
): Promise<RealValueAnalysis> => {

    const costTracker = new CostTracker();

    onLog("Financial Analyst", `Initiating Real-Value audit: ${job.salary} in ${job.location} vs ${userLocation}...`);

    const response = await ai.models.generateContent({
        model: MODEL_PRO,
        contents: {
            parts: [{
                text: `
          User Location (Current): ${userLocation}
          Job Location (Target): ${job.location}
          Offered Salary: ${job.salary}

          Task: Perform a deep Purchasing Power Parity analysis.
          1. Search for current 2024/2025 Cost of Living indices for both cities.
          2. Search for State and City income tax rates for both.
          3. Calculate the "Real Value" of the offered salary if the user lived in their current location.
             (e.g., If SF is 50% more expensive than Austin, $150k in SF = $100k in Austin).
          4. Return a verdict.
        `
            }]
        },
        config: {
            systemInstruction: FINANCIAL_ANALYST_INSTRUCTION,
            tools: [{ googleSearch: {} }],
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    originalSalary: { type: Type.STRING },
                    adjustedValue: { type: Type.STRING },
                    purchasingPowerScore: { type: Type.NUMBER, description: "100 is neutral. 110 is 10% gain. 90 is 10% loss." },
                    verdict: { type: Type.STRING },
                    breakdown: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                category: { type: Type.STRING },
                                diff: { type: Type.STRING },
                                details: { type: Type.STRING }
                            }
                        }
                    }
                },
                required: ["originalSalary", "adjustedValue", "purchasingPowerScore", "verdict", "breakdown"]
            }
        }
    });

    costTracker.track("Financial Analyst", MODEL_PRO, response.usageMetadata);
    costTracker.logSummary(onLog);

    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
        ?.map((chunk: any) => ({
            title: chunk.web?.title || "Source",
            uri: chunk.web?.uri || ""
        }))
        .filter((s: any) => s.uri) || [];

    const analysis = JSON.parse(response.text || "{}");
    return { ...analysis, sources };
};

// ------------------------------------------------------------------
// AGENT IMPLEMENTATIONS
// ------------------------------------------------------------------

async function runHeadhunterAgent(
    prefs: UserPreferences,
    onLog: (agent: string, action: string) => void,
    costTracker: CostTracker
): Promise<BaseJobResponse[]> {
    const prompt = `
    Current Date: ${new Date().toLocaleDateString()}
    Find 6-8 active job postings matching:
    - Role: ${prefs.jobTitle}
    - Location: ${prefs.location}
    - Pay: $${prefs.salaryMin}k - $${prefs.salaryMax}k
    - Type: ${prefs.employmentType} (${prefs.workMode})
    - **Posted: Within the last 30 days.**
    ${prefs.resume ? "Use the attached resume to calculate strict match scores." : ""}
  `;

    const parts: any[] = [{ text: prompt }];
    if (prefs.resume) {
        onLog("Headhunter Agent", "Cross-referencing user's resume against job descriptions...");
        parts.push({ inlineData: { mimeType: prefs.resume.mimeType, data: prefs.resume.base64 } });
    }

    const response = await ai.models.generateContent({
        model: MODEL_FLASH,
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

    costTracker.track("Headhunter Agent", MODEL_FLASH, response.usageMetadata);

    return JSON.parse(response.text || "[]");
}

async function runEconomistAgent(
    jobs: any[],
    prefs: UserPreferences,
    onLog: (agent: string, action: string) => void,
    costTracker: CostTracker
): Promise<EconomistResponse[]> {
    onLog("Labor Economist", `Analyzing supply/demand for ${jobs.length} roles in ${prefs.location}...`);

    const response = await ai.models.generateContent({
        model: MODEL_FLASH,
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

    costTracker.track("Labor Economist", MODEL_FLASH, response.usageMetadata);

    return JSON.parse(response.text || "[]");
}

async function runFuturistAgent(
    jobs: any[],
    prefs: UserPreferences,
    onLog: (agent: string, action: string) => void,
    costTracker: CostTracker
): Promise<FuturistResponse[]> {
    onLog("Comp Futurist", "Forecasting 18-month salary bands and inflation adjustments...");

    const response = await ai.models.generateContent({
        model: MODEL_PRO,
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

    costTracker.track("Comp Futurist", MODEL_PRO, response.usageMetadata);

    return JSON.parse(response.text || "[]");
}

async function runStrategistAgent(
    jobs: any[],
    prefs: UserPreferences,
    onLog: (agent: string, action: string) => void,
    costTracker: CostTracker
): Promise<StrategistResponse[]> {
    onLog("Career Strategist", `Modeling trajectories for '${prefs.experienceLevel}' level profiles...`);

    const response = await ai.models.generateContent({
        model: MODEL_FLASH,
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

    costTracker.track("Career Strategist", MODEL_FLASH, response.usageMetadata);

    return JSON.parse(response.text || "[]");
}
