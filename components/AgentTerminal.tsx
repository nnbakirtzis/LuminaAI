import React, { useEffect, useRef } from 'react';
import { AgentLog, AgentStatus } from '../types';
import { BrainCircuit } from 'lucide-react';

interface AgentTerminalProps {
  logs: AgentLog[];
  status: AgentStatus;
}

const AgentTerminal: React.FC<AgentTerminalProps> = ({ logs, status }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  if (status === AgentStatus.IDLE) return null;

  return (
    <div className="w-full max-w-4xl mx-auto my-8 animate-fade-in shadow-2xl rounded-lg">
      <div className="bg-navy-950 border border-navy-800 rounded-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 bg-navy-900 border-b border-navy-800">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-navy-300 uppercase tracking-widest">
             <BrainCircuit size={14} className="text-teal-400 animate-pulse" />
             Lumina Multi-Agent Swarm
          </div>
        </div>

        {/* Content */}
        <div 
          ref={scrollRef}
          className="h-48 p-4 overflow-y-auto font-mono text-sm space-y-2 scroll-smooth bg-navy-950"
        >
          {logs.map((log) => (
            <div key={log.id} className="flex gap-3 text-gray-400">
              <span className="text-navy-500 shrink-0">
                [{log.timestamp.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second:'2-digit' })}]
              </span>
              <span className={`${getAgentColor(log.agentName)} font-bold shrink-0 w-36`}>
                {log.agentName}:
              </span>
              <span className="text-gray-300">{log.action}</span>
            </div>
          ))}
          {status !== AgentStatus.COMPLETED && status !== AgentStatus.ERROR && (
            <div className="flex items-center gap-2 text-teal-400 animate-pulse mt-2">
              <span className="w-2 h-4 bg-teal-400"></span>
              Processing...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const getAgentColor = (name: string) => {
  switch (name) {
    case 'Headhunter Agent': return 'text-blue-400';
    case 'Labor Economist': return 'text-green-400';
    case 'Comp Futurist': return 'text-cyan-400';
    case 'Career Strategist': return 'text-pink-400';
    case 'Coordinator': return 'text-gold-400'; 
    case 'System': return 'text-red-400';
    default: return 'text-gray-400';
  }
};

export default AgentTerminal;