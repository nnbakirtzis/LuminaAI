import React, { useState } from 'react';
import { UserPreferences, Job, AgentStatus, AgentLog } from './types';
import { findAndRankJobs } from './services/gemini';
import PreferenceForm from './components/PreferenceForm';
import JobCard from './components/JobCard';
import StatusVisualizer from './components/StatusVisualizer'; // New Import
import DebugSidebar from './components/DebugSidebar';
import { Bot, Bug, Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [status, setStatus] = useState<AgentStatus>(AgentStatus.IDLE);
  const [logs, setLogs] = useState<AgentLog[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isDebugOpen, setIsDebugOpen] = useState(false);
  const [currentPrefs, setCurrentPrefs] = useState<UserPreferences | null>(null);

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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative font-sans">
      <DebugSidebar isOpen={isDebugOpen} onClose={() => setIsDebugOpen(false)} logs={logs} />
      
      {/* Navbar - Navy Blue for Trust */}
      <nav className="bg-navy-900 text-white sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-white backdrop-blur-sm border border-white/10">
               <Bot size={20} />
             </div>
             <span className="font-display text-xl font-bold tracking-tight text-white">
               Lumina<span className="text-teal-400">.AI</span>
             </span>
          </div>
          <div className="flex items-center gap-4">
             <div className="text-xs text-navy-200 font-medium hidden md:block uppercase tracking-wider">
              Powered by Gemini
            </div>
            <button 
              onClick={() => setIsDebugOpen(true)}
              className="p-2 text-navy-200 hover:text-white transition-colors rounded-full hover:bg-white/10"
              title="Open Debug Logs"
            >
              <Bug size={18} />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-6 py-12">
        
        {/* Header Section */}
        {status === AgentStatus.IDLE && (
          <div className="text-center mb-16 animate-fade-in">
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
           <div className="animate-slide-up space-y-8">
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
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
              
              {/* Disclaimer */}
              <div className="mt-12 text-center">
                <p className="text-slate-500 text-xs flex items-center justify-center gap-2">
                   <Sparkles size={12} className="text-teal-600" />
                   Listings generated by Gemini AI. Links simulated for demo.
                </p>
              </div>
           </div>
        )}
      </main>
    </div>
  );
};

export default App;