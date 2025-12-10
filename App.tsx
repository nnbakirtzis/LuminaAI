import React, { useState } from 'react';
import { UserPreferences, Job, AgentStatus, AgentLog } from './types';
import { findAndRankJobs } from './services/gemini';
import PreferenceForm from './components/PreferenceForm';
import JobCard from './components/JobCard';
import AgentTerminal from './components/AgentTerminal';
import DebugSidebar from './components/DebugSidebar';
import { Sparkles, Bot, Bug } from 'lucide-react';

const App: React.FC = () => {
  const [status, setStatus] = useState<AgentStatus>(AgentStatus.IDLE);
  const [logs, setLogs] = useState<AgentLog[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isDebugOpen, setIsDebugOpen] = useState(false);

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
    <div className="min-h-screen bg-obsidian-900 flex flex-col relative">
      <DebugSidebar isOpen={isDebugOpen} onClose={() => setIsDebugOpen(false)} logs={logs} />
      
      {/* Navbar */}
      <nav className="border-b border-neutral-800 bg-obsidian-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-gradient-to-tr from-gold-600 to-gold-300 rounded-lg flex items-center justify-center text-obsidian-900">
               <Bot size={20} />
             </div>
             <span className="font-serif text-xl font-semibold tracking-tight text-neutral-100">
               Lumina<span className="text-gold-500">.AI</span>
             </span>
          </div>
          <div className="flex items-center gap-4">
             <div className="text-xs text-neutral-500 font-mono hidden md:block">
              POWERED BY GOOGLE GEMINI 2.5 FLASH
            </div>
            <button 
              onClick={() => setIsDebugOpen(true)}
              className="p-2 text-neutral-500 hover:text-gold-500 transition-colors rounded-full hover:bg-neutral-800/50"
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
            <h1 className="text-5xl md:text-6xl font-serif text-white mb-6 leading-tight">
              Discover your next <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 to-gold-600">
                career masterpiece
              </span>
            </h1>
            <p className="text-lg text-neutral-400 max-w-2xl mx-auto font-light leading-relaxed">
              Deploy our multi-agent AI system to scrape, analyze, and rank the premium job market 
              according to your unique professional DNA.
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

        {/* Processing State: Terminal */}
        {(status === AgentStatus.PLANNING || status === AgentStatus.SCRAPING || status === AgentStatus.ANALYZING) && (
          <div className="min-h-[60vh] flex flex-col items-center justify-center">
             <h2 className="text-2xl font-serif text-neutral-200 mb-4 animate-pulse">Agents Deployed</h2>
             <AgentTerminal logs={logs} status={status} />
          </div>
        )}

        {/* Results */}
        {status === AgentStatus.COMPLETED && (
           <div className="animate-slide-up space-y-8">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-6">
                <div>
                   <h2 className="text-3xl font-serif text-white mb-2">Curated Opportunities</h2>
                   <p className="text-neutral-500 text-sm">Sorted by AI Match Score™</p>
                </div>
                <button 
                  onClick={() => setStatus(AgentStatus.IDLE)}
                  className="px-6 py-2 border border-neutral-700 rounded-lg text-neutral-400 hover:text-white hover:border-gold-500 transition-all text-sm"
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
                <p className="text-neutral-600 text-xs flex items-center justify-center gap-2">
                   <Sparkles size={12} className="text-gold-600" />
                   Listings are generated by Gemini AI based on real-time market knowledge patterns. 
                   Links may be simulated for demonstration.
                </p>
              </div>
           </div>
        )}
      </main>
    </div>
  );
};

export default App;