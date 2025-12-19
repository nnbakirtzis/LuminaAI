
import React, { useMemo, useState, useEffect } from 'react';
import { AgentLog } from '../types';
import { Globe, BrainCircuit, Layout, Sparkles, Lock, Cpu, Radar, Activity } from 'lucide-react';

interface StatusVisualizerProps {
  logs: AgentLog[];
  isPremium: boolean;
}

const StatusVisualizer: React.FC<StatusVisualizerProps> = ({ logs, isPremium }) => {
  const [activeStep, setActiveStep] = useState(0);

  const state = useMemo(() => {
    const scanningDone = logs.some(l => l.agentName === 'Headhunter Agent' && l.action.includes('Identified'));
    const swarmStarted = logs.some(l => l.agentName === 'Coordinator' && l.action.includes('Spinning up'));
    const swarmDone = logs.some(l => l.agentName === 'Coordinator' && l.action.includes('Aggregating'));
    const completed = logs.some(l => l.agentName === 'Coordinator' && l.action.includes('complete'));

    return { scanningDone, swarmStarted, swarmDone, completed };
  }, [logs]);

  useEffect(() => {
    if (state.completed) setActiveStep(3);
    else if (state.swarmDone) setActiveStep(2);
    else if (state.scanningDone) setActiveStep(1);
    else setActiveStep(0);
  }, [state]);

  const latestLog = logs[logs.length - 1];

  return (
    <div className="w-full max-w-4xl mx-auto my-8 animate-fade-in font-sans flex flex-col items-center justify-center">
      
      {/* Central Holographic Core */}
      <div className="relative w-64 h-64 flex items-center justify-center mb-12">
        {/* Outer Rotating Rings */}
        <div className="absolute inset-0 border-2 border-dashed border-navy-200 rounded-full animate-[spin_10s_linear_infinite] opacity-30"></div>
        <div className="absolute inset-4 border border-teal-500/20 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
        
        {/* Scanning Radar Effect */}
        <div className="absolute inset-0 rounded-full overflow-hidden opacity-10">
           <div className="w-full h-1/2 bg-gradient-to-b from-transparent to-teal-500/50 animate-[spin_3s_linear_infinite] origin-bottom transform-gpu"></div>
        </div>

        {/* Central Pulse Node */}
        <div className="relative z-10 w-24 h-24 bg-white rounded-full shadow-[0_0_40px_rgba(20,184,166,0.3)] flex items-center justify-center ring-4 ring-navy-50">
           <div className="absolute inset-0 rounded-full bg-teal-400 animate-ping opacity-20"></div>
           <CurrentIcon step={activeStep} isPremium={isPremium} />
        </div>

        {/* Orbiting Agent Nodes */}
        <div className="absolute w-full h-full animate-[spin_8s_linear_infinite]">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-3">
               <div className="w-3 h-3 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>
            </div>
        </div>
        <div className="absolute w-full h-full animate-[spin_12s_linear_infinite_reverse]">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-3">
               <div className="w-2 h-2 bg-purple-500 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.8)]"></div>
            </div>
            <div className="absolute top-1/2 right-0 translate-x-3 -translate-y-1/2">
               <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.8)]"></div>
            </div>
        </div>
      </div>

      {/* Narrative Progress Text */}
      <div className="text-center space-y-3 max-w-lg z-10">
        <h3 className="text-2xl font-display font-bold text-navy-900 animate-pulse">
           {getPhaseTitle(activeStep, isPremium)}
        </h3>
        
        <div className="h-12 flex items-center justify-center">
          {latestLog && (
             <p className="font-mono text-sm text-teal-600 bg-teal-50 px-4 py-2 rounded-lg border border-teal-100 shadow-sm animate-slide-up inline-flex items-center gap-2">
                <Activity size={14} className="animate-bounce" />
                {latestLog.action}
             </p>
          )}
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-2 mt-12">
         <StepIndicator active={activeStep >= 0} label="Scan" />
         <div className={`w-12 h-0.5 transition-colors duration-500 ${activeStep >= 1 ? 'bg-teal-500' : 'bg-gray-200'}`}></div>
         <StepIndicator active={activeStep >= 1} label="Analyze" />
         <div className={`w-12 h-0.5 transition-colors duration-500 ${activeStep >= 2 ? 'bg-teal-500' : 'bg-gray-200'}`}></div>
         <StepIndicator active={activeStep >= 2} label="Curate" />
      </div>

    </div>
  );
};

const CurrentIcon = ({ step, isPremium }: { step: number, isPremium: boolean }) => {
  const iconClass = "text-navy-900 transition-all duration-500 transform";
  if (step === 0) return <Globe size={32} className={iconClass} />;
  if (step === 1) return isPremium ? <BrainCircuit size={32} className={iconClass} /> : <Lock size={32} className="text-gray-400" />;
  if (step >= 2) return <Layout size={32} className={iconClass} />;
  return <Sparkles size={32} className={iconClass} />;
};

const StepIndicator = ({ active, label }: { active: boolean, label: string }) => (
  <div className="flex flex-col items-center gap-2">
    <div className={`
      w-3 h-3 rounded-full transition-all duration-500 
      ${active ? 'bg-teal-500 ring-4 ring-teal-100' : 'bg-gray-200'}
    `}></div>
    <span className={`text-[10px] font-bold uppercase tracking-wider ${active ? 'text-navy-900' : 'text-gray-400'}`}>
      {label}
    </span>
  </div>
);

const getPhaseTitle = (step: number, isPremium: boolean) => {
  switch (step) {
    case 0: return "Scanning global job networks...";
    case 1: return isPremium ? "Consulting expert agents..." : "Analyzing job matches...";
    case 2: return "Building career strategy...";
    default: return "Finalizing your results...";
  }
};

export default StatusVisualizer;
