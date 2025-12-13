import React, { useState } from 'react';
import { UserPreferences, Job, AgentStatus, AgentLog } from '../types';
import { findAndRankJobs, generateTailoredResume } from '../services/gemini';
import PreferenceForm from '../components/PreferenceForm';
import JobCard from '../components/JobCard';
import StatusVisualizer from '../components/StatusVisualizer';
import DebugSidebar from '../components/DebugSidebar';
import ResumeModal from '../components/ResumeModal';
import { Sparkles, Terminal } from 'lucide-react';

const Home: React.FC = () => {
  const [status, setStatus] = useState<AgentStatus>(AgentStatus.IDLE);
  const [logs, setLogs] = useState<AgentLog[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isDebugOpen, setIsDebugOpen] = useState(false);
  const [currentPrefs, setCurrentPrefs] = useState<UserPreferences | null>(null);

  // Resume Tailoring State
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [resumeJob, setResumeJob] = useState<Job | null>(null);
  const [resumeContent, setResumeContent] = useState<string>('');
  const [isResumeLoading, setIsResumeLoading] = useState(false);

  const addLog = (agentName: string, action: string) => {
    setLogs(prev => [...prev, {
      id: Math.random().toString(36).substr(2, 9),
      agentName,
      action,
      timestamp: new Date()
    }]);
  };

  const handleSearch = async (prefs: UserPreferences) => {
    setStatus(AgentStatus.PLANNING);
    setLogs([]); // Clear previous logs
    setJobs([]);
    setCurrentPrefs(prefs);

    try {
      addLog("Coordinator", "Received user preferences. Waking agents...");
      
      // Artificial delay for UX "feeling" of initialization
      await new Promise(r => setTimeout(r, 800));
      setStatus(AgentStatus.SCRAPING);
      
      const results = await findAndRankJobs(prefs, addLog);
      
      setJobs(results);
      setStatus(AgentStatus.COMPLETED);
      addLog("Coordinator", `Successfully retrieved ${results.length} high-match opportunities.`);
      
    } catch (error) {
      console.error(error);
      setStatus(AgentStatus.ERROR);
      addLog("System", "Critical failure in agent workflow. Please check configuration.");
    }
  };

  const handleGenerateResume = async (job: Job) => {
    if (!currentPrefs?.resume) {
      alert("Please upload a resume in the search preferences to use this feature.");
      return;
    }

    setResumeJob(job);
    setIsResumeModalOpen(true);
    setIsResumeLoading(true);
    setResumeContent('');
    
    // Add log to sidebar even though it's post-search
    addLog("Resumator Agent", `Tailoring CV for ${job.title} @ ${job.company}...`);

    try {
      const tailoredText = await generateTailoredResume(job, currentPrefs.resume);
      setResumeContent(tailoredText);
      addLog("Resumator Agent", `Resume generation complete for ${job.id}.`);
    } catch (error) {
      console.error(error);
      setResumeContent("Error generating resume. Please try again.");
      addLog("Resumator Agent", `Error generating resume for ${job.id}.`);
    } finally {
      setIsResumeLoading(false);
    }
  };

  return (
    <div className="relative">
      <DebugSidebar isOpen={isDebugOpen} onClose={() => setIsDebugOpen(false)} logs={logs} />
      
      <ResumeModal 
        isOpen={isResumeModalOpen} 
        onClose={() => setIsResumeModalOpen(false)}
        job={resumeJob}
        content={resumeContent}
        isLoading={isResumeLoading}
      />
      
      {/* Floating Debug Button for this page only */}
      <button 
         onClick={() => setIsDebugOpen(true)}
         className="fixed bottom-6 right-6 z-40 bg-navy-900 text-white p-3 rounded-full shadow-lg hover:bg-teal-500 transition-colors border border-navy-800"
         title="View Agent Terminal"
      >
        <Terminal size={20} />
      </button>

      {/* Header Section */}
        {status === AgentStatus.IDLE && (
          <div className="text-center mb-16 animate-fade-in pt-12">
            <div className="inline-block px-3 py-1 bg-navy-50 border border-navy-100 rounded-full text-navy-800 text-[10px] font-bold uppercase tracking-widest mb-4">
              Next-Gen Career Intelligence
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-extrabold text-navy-900 mb-6 leading-[1.1] tracking-tight">
              Discover your next <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-navy-600 to-teal-500">
                career masterpiece
              </span>
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
              Deploy our multi-agent AI system to analyze the market and find premium opportunities customized to your professional DNA.
            </p>
          </div>
        )}

        {/* Input Form */}
        {status === AgentStatus.IDLE && (
          <PreferenceForm 
            onSubmit={handleSearch} 
            isLoading={status !== AgentStatus.IDLE && status !== AgentStatus.ERROR && status !== AgentStatus.COMPLETED} 
          />
        )}

        {/* Processing State: User Friendly Visualizer */}
        {(status === AgentStatus.PLANNING || status === AgentStatus.SCRAPING || status === AgentStatus.ANALYZING) && (
          <div className="min-h-[60vh] flex flex-col items-center justify-center">
             <StatusVisualizer logs={logs} isPremium={currentPrefs?.enableIntelligence || false} />
          </div>
        )}

        {/* Results */}
        {status === AgentStatus.COMPLETED && (
           <div className="animate-slide-up space-y-8 pt-8">
              <div className="flex items-center justify-between border-b border-gray-200 pb-6">
                <div>
                   <h2 className="text-3xl font-display font-bold text-navy-900 mb-2">Curated Opportunities</h2>
                   <p className="text-slate-500 text-sm">Sorted by AI Match Score™</p>
                </div>
                <button 
                  onClick={() => setStatus(AgentStatus.IDLE)}
                  className="px-6 py-2 border border-slate-300 rounded-lg text-slate-700 hover:text-navy-900 hover:border-navy-900 transition-all text-sm font-medium bg-white shadow-sm"
                >
                  New Search
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.map(job => (
                  <JobCard 
                    key={job.id} 
                    job={job} 
                    enableResumeTailoring={currentPrefs?.enableResumeTailoring || false}
                    onGenerateResume={handleGenerateResume}
                  />
                ))}
              </div>
              
              {/* Disclaimer */}
              <div className="mt-12 text-center pb-8">
                <p className="text-slate-500 text-xs flex items-center justify-center gap-2">
                   <Sparkles size={12} className="text-teal-600" />
                   Listings generated by Gemini AI. Links simulated for demo.
                </p>
              </div>
           </div>
        )}
    </div>
  );
};

export default Home;