import React, { useMemo } from 'react';
import { AgentLog } from '../types';
import { Globe, BrainCircuit, CheckCircle2, Loader2, TrendingUp, LineChart, Briefcase } from 'lucide-react';

interface StatusVisualizerProps {
  logs: AgentLog[];
  isPremium: boolean;
}

const StatusVisualizer: React.FC<StatusVisualizerProps> = ({ logs, isPremium }) => {
  
  const state = useMemo(() => {
    // Phase 1: Headhunter
    const scanningStarted = logs.length > 0;
    const scanningDone = logs.some(l => l.agentName === 'Headhunter Agent' && l.action.includes('Identified'));
    
    // Phase 2: Swarm
    const swarmStarted = logs.some(l => l.agentName === 'Coordinator' && l.action.includes('Spinning up'));
    const swarmDone = logs.some(l => l.agentName === 'Coordinator' && l.action.includes('Aggregating'));

    // Phase 3: Final
    const curationStarted = swarmDone || (scanningDone && !isPremium);
    const completed = logs.some(l => l.agentName === 'Coordinator' && l.action.includes('complete'));

    return { 
        scanningStarted, scanningDone, 
        swarmStarted, swarmDone, 
        curationStarted, completed 
    };
  }, [logs, isPremium]);

  return (
    <div className="w-full max-w-2xl mx-auto my-12 animate-fade-in font-sans">
       <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 relative overflow-hidden">
          {/* Background Gradient */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

          <h2 className="text-2xl font-display font-bold text-navy-900 mb-8 text-center relative z-10">
            Agent Workflow
          </h2>

          <div className="relative z-10 flex flex-col items-center">
             
             {/* STEP 1: SCANNING */}
             <div className={`
                w-full border rounded-xl p-4 flex items-center gap-4 transition-all duration-500 z-20 relative
                ${state.scanningDone ? 'border-teal-100 bg-teal-50/30' : 'border-navy-100 bg-white shadow-sm'}
             `}>
                <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 transition-all duration-300
                    ${state.scanningDone ? 'bg-teal-500 border-teal-500 text-white' : 'bg-white border-navy-900 text-navy-900'}
                `}>
                   {state.scanningDone ? <CheckCircle2 size={20} /> : <Globe size={20} className="animate-spin-slow" />}
                </div>
                <div>
                   <h3 className="font-bold text-navy-900 text-sm">Global Opportunity Scan</h3>
                   <p className="text-xs text-slate-500">Headhunter Agent: Identifying matches across platforms</p>
                </div>
             </div>

             {/* CONNECTOR LINE */}
             <div className={`h-8 w-0.5 transition-colors duration-500 ${state.scanningDone ? 'bg-teal-300' : 'bg-gray-200'}`}></div>

             {/* STEP 2: PARALLEL SWARM (Only if Premium) */}
             {isPremium && (
                 <>
                    <div className="w-full relative">
                        {/* Branching Lines */}
                        <div className="absolute left-1/2 -top-4 w-full h-8 -translate-x-1/2 flex justify-center pointer-events-none">
                            {/* Left Branch */}
                            <div className={`w-1/3 h-full border-t-2 border-l-2 rounded-tl-xl absolute left-[16%] top-0 transition-colors duration-500 ${state.swarmStarted ? 'border-teal-300' : 'border-gray-200'}`}></div>
                            {/* Middle Line */}
                            <div className={`h-full w-0.5 absolute left-1/2 -translate-x-1/2 top-0 transition-colors duration-500 ${state.swarmStarted ? 'bg-teal-300' : 'bg-gray-200'}`}></div>
                            {/* Right Branch */}
                            <div className={`w-1/3 h-full border-t-2 border-r-2 rounded-tr-xl absolute right-[16%] top-0 transition-colors duration-500 ${state.swarmStarted ? 'border-teal-300' : 'border-gray-200'}`}></div>
                        </div>

                        {/* Agents Container */}
                        <div className="grid grid-cols-3 gap-3 pt-4">
                            
                            {/* Agent 1: Economist */}
                            <AgentCard 
                                icon={Briefcase} 
                                label="Economist" 
                                active={state.swarmStarted && !state.swarmDone} 
                                done={state.swarmDone} 
                                pending={!state.swarmStarted}
                            />

                             {/* Agent 2: Futurist */}
                             <AgentCard 
                                icon={TrendingUp} 
                                label="Futurist" 
                                active={state.swarmStarted && !state.swarmDone} 
                                done={state.swarmDone}
                                pending={!state.swarmStarted} 
                            />

                             {/* Agent 3: Strategist */}
                             <AgentCard 
                                icon={LineChart} 
                                label="Strategist" 
                                active={state.swarmStarted && !state.swarmDone} 
                                done={state.swarmDone}
                                pending={!state.swarmStarted} 
                            />

                        </div>
                    </div>

                    {/* CONNECTOR LINE (Rejoining) */}
                    <div className="h-8 w-0.5 bg-gray-200 relative mt-4">
                        {/* Convergence Lines */}
                        <div className={`absolute -top-4 left-1/2 -translate-x-1/2 w-full max-w-[calc(100%-2rem)] h-4 flex justify-between pointer-events-none`}>
                           <div className={`w-1/2 border-b-2 border-l-2 rounded-bl-xl h-full transition-colors duration-500 ${state.swarmDone ? 'border-teal-300' : 'border-gray-200'}`}></div>
                           <div className={`w-1/2 border-b-2 border-r-2 rounded-br-xl h-full transition-colors duration-500 ${state.swarmDone ? 'border-teal-300' : 'border-gray-200'}`}></div>
                        </div>
                        <div className={`absolute inset-0 w-full h-full transition-colors duration-500 ${state.swarmDone ? 'bg-teal-300' : 'bg-gray-200'}`}></div>
                    </div>
                 </>
             )}

             {/* STEP 3: CURATION */}
             <div className={`
                w-full border rounded-xl p-4 flex items-center gap-4 transition-all duration-500 z-20 relative
                ${state.completed ? 'border-teal-100 bg-teal-50/30' : (state.curationStarted ? 'border-navy-200 bg-white shadow-md' : 'border-gray-100 bg-gray-50 opacity-60')}
             `}>
                <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 transition-all duration-300
                    ${state.completed ? 'bg-teal-500 border-teal-500 text-white' : (state.curationStarted ? 'bg-white border-navy-900 text-navy-900' : 'bg-gray-100 border-gray-300 text-gray-400')}
                `}>
                   {state.completed ? <CheckCircle2 size={20} /> : <BrainCircuit size={20} className={state.curationStarted ? "animate-pulse" : ""} />}
                </div>
                <div>
                   <h3 className={`font-bold text-sm ${state.curationStarted ? 'text-navy-900' : 'text-gray-400'}`}>Final Curation</h3>
                   <p className="text-xs text-slate-500">Coordinator Agent: Ranking and formatting</p>
                </div>
             </div>

          </div>
       </div>
    </div>
  );
};

const AgentCard = ({ icon: Icon, label, active, done, pending }: { icon: any, label: string, active: boolean, done: boolean, pending: boolean }) => (
    <div className={`
        flex flex-col items-center justify-center p-3 rounded-lg border transition-all duration-500 relative z-10
        ${done ? 'bg-teal-50 border-teal-200 shadow-sm' : (active ? 'bg-white border-navy-900 shadow-md scale-105' : 'bg-gray-50 border-gray-100 opacity-60')}
    `}>
        <div className={`
            w-8 h-8 rounded-full flex items-center justify-center mb-2 transition-colors duration-300
            ${done ? 'bg-teal-100 text-teal-600' : (active ? 'bg-navy-50 text-navy-900' : 'bg-gray-200 text-gray-400')}
        `}>
            {active ? <Loader2 size={16} className="animate-spin" /> : <Icon size={16} />}
        </div>
        <span className={`text-[10px] font-bold uppercase tracking-wide ${done ? 'text-teal-700' : (active ? 'text-navy-900' : 'text-gray-400')}`}>
            {label}
        </span>
    </div>
);

export default StatusVisualizer;