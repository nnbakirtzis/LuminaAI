import React, { useMemo } from 'react';
import { AgentLog } from '../types';
import { Globe, BrainCircuit, CheckCircle2, CircleDashed, Loader2 } from 'lucide-react';

interface StatusVisualizerProps {
  logs: AgentLog[];
  isPremium: boolean;
}

const StatusVisualizer: React.FC<StatusVisualizerProps> = ({ logs, isPremium }) => {
  
  // Derive state from logs
  const state = useMemo(() => {
    const hasHeadhunterDone = logs.some(l => l.agentName === 'Headhunter Agent' && l.action.includes('Identified'));
    const hasStartedIntelligence = logs.some(l => ['Labor Economist', 'Comp Futurist', 'Career Strategist'].includes(l.agentName));
    const hasAggregated = logs.some(l => l.agentName === 'Coordinator' && l.action.includes('Aggregating'));
    
    let currentStep = 1;
    if (hasHeadhunterDone) currentStep = 2;
    if (hasStartedIntelligence && isPremium) currentStep = 2;
    if (hasHeadhunterDone && !isPremium) currentStep = 3; // Skip step 2 if not premium
    if (hasAggregated) currentStep = 3;
    
    return { currentStep };
  }, [logs, isPremium]);

  const steps = [
    {
      id: 1,
      title: 'Global Opportunity Scan',
      description: 'Scouring professional networks for matches...',
      icon: Globe
    },
    {
      id: 2,
      title: 'Market Intelligence Analysis',
      description: 'Deploying Economist, Futurist, and Strategist agents...',
      icon: BrainCircuit,
      skip: !isPremium
    },
    {
      id: 3,
      title: 'Final Curation',
      description: 'Ranking and finalizing your opportunities...',
      icon: CheckCircle2
    }
  ];

  const activeSteps = steps.filter(s => !s.skip);

  return (
    <div className="w-full max-w-lg mx-auto my-12 animate-fade-in">
       <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 relative overflow-hidden">
          {/* Background Decorative Blob */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-teal-50 rounded-full blur-3xl opacity-50"></div>
          
          <h2 className="text-2xl font-display font-bold text-navy-900 mb-8 text-center">
            Orchestrating Agents
          </h2>

          <div className="space-y-8 relative">
             {/* Connector Line */}
             <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-gray-100 -z-10"></div>

             {activeSteps.map((step, index) => {
                const stepNum = index + 1;
                const isCompleted = state.currentStep > step.id; // Logic simplified for visual flow
                const isActive = state.currentStep === step.id;
                const isPending = state.currentStep < step.id;

                // Adjust logic for non-premium skipping Step 2 visually
                let visualState = 'pending';
                if (isActive) visualState = 'active';
                if (isCompleted || (step.id === 1 && state.currentStep === 3)) visualState = 'completed';

                // Specific override for non-premium flow where step 2 is skipped
                if (!isPremium && step.id === 2) return null;

                return (
                  <div key={step.id} className="flex gap-5 relative">
                     {/* Icon Bubble */}
                     <div className={`
                        w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-[3px] transition-all duration-500 z-10
                        ${visualState === 'completed' ? 'bg-teal-500 border-teal-500 text-white' : ''}
                        ${visualState === 'active' ? 'bg-white border-navy-900 text-navy-900 shadow-[0_0_0_4px_rgba(0,31,63,0.1)]' : ''}
                        ${visualState === 'pending' ? 'bg-white border-gray-200 text-gray-300' : ''}
                     `}>
                        {visualState === 'completed' ? (
                          <CheckCircle2 size={18} />
                        ) : visualState === 'active' ? (
                           step.id === 2 ? <BrainCircuit size={18} className="animate-pulse" /> : <Loader2 size={18} className="animate-spin" />
                        ) : (
                          <step.icon size={18} />
                        )}
                     </div>

                     {/* Text */}
                     <div className={`transition-opacity duration-500 ${visualState === 'pending' ? 'opacity-40' : 'opacity-100'}`}>
                        <h3 className={`font-bold text-base mb-1 ${visualState === 'active' ? 'text-navy-900' : 'text-slate-700'}`}>
                          {step.title}
                        </h3>
                        <p className="text-sm text-slate-500 leading-snug">
                          {step.description}
                        </p>
                     </div>
                  </div>
                );
             })}
          </div>
       </div>
       
       <div className="text-center mt-6">
          <p className="text-xs text-navy-400 font-medium uppercase tracking-widest animate-pulse">
            AI Processing in Progress
          </p>
       </div>
    </div>
  );
};

export default StatusVisualizer;