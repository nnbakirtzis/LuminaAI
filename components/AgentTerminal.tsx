import React, { useEffect, useRef } from 'react';
import { AgentLog, AgentStatus } from '../types';
import { Terminal, ShieldCheck, Search, BrainCircuit } from 'lucide-react';

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
    <div className="w-full max-w-4xl mx-auto my-8 animate-fade-in">
      <div className="bg-obsidian-800 border border-neutral-800 rounded-lg overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 bg-neutral-900 border-b border-neutral-800">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-500 uppercase tracking-widest">
             <BrainCircuit size={14} className="text-gold-500 animate-pulse" />
             Lumina Multi-Agent System
          </div>
        </div>

        {/* Content */}
        <div 
          ref={scrollRef}
          className="h-48 p-4 overflow-y-auto font-mono text-sm space-y-2 scroll-smooth"
        >
          {logs.map((log) => (
            <div key={log.id} className="flex gap-3 text-neutral-400">
              <span className="text-neutral-600 shrink-0">
                [{log.timestamp.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second:'2-digit' })}]
              </span>
              <span className={`${getAgentColor(log.agentName)} font-bold shrink-0 w-32`}>
                {log.agentName}:
              </span>
              <span className="text-neutral-300">{log.action}</span>
            </div>
          ))}
          {status !== AgentStatus.COMPLETED && (
            <div className="flex items-center gap-2 text-gold-500 animate-pulse mt-2">
              <span className="w-2 h-4 bg-gold-500"></span>
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
    case 'Scraper Agent': return 'text-blue-400';
    case 'Analyst Agent': return 'text-purple-400';
    case 'Coordinator': return 'text-gold-500';
    default: return 'text-gray-400';
  }
};

export default AgentTerminal;