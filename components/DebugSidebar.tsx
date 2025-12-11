import React, { useEffect, useRef } from 'react';
import { AgentLog } from '../types';
import { X, Terminal, Server, Clock } from 'lucide-react';

interface DebugSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  logs: AgentLog[];
}

const DebugSidebar: React.FC<DebugSidebarProps> = ({ isOpen, onClose, logs }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [isOpen, logs]);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-navy-900/40 backdrop-blur-sm z-[60] transition-opacity animate-fade-in"
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 right-0 w-96 bg-navy-900 border-l border-navy-800 shadow-2xl z-[70] transform transition-transform duration-300 ease-in-out flex flex-col
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-navy-800 bg-navy-950">
          <div className="flex items-center gap-2 text-white">
            <Terminal size={18} className="text-teal-400" />
            <h3 className="font-mono text-sm font-bold tracking-wider uppercase">System Logs</h3>
          </div>
          <button 
            onClick={onClose}
            className="text-navy-400 hover:text-white transition-colors p-1 rounded-md hover:bg-navy-800"
          >
            <X size={20} />
          </button>
        </div>

        {/* Log Stream */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-xs"
        >
          {logs.length === 0 ? (
            <div className="text-navy-500 text-center py-10 italic">
              No active logs. <br/> System is idle.
            </div>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="border-l-2 border-navy-700 pl-3 py-1 hover:bg-navy-800/50 rounded-r transition-colors group">
                <div className="flex items-center gap-2 mb-1 text-[10px] text-navy-400">
                  <Clock size={10} />
                  {log.timestamp.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' })}
                  .{log.timestamp.getMilliseconds().toString().padStart(3, '0')}
                </div>
                <div className="flex flex-col gap-1">
                  <span className={`font-bold uppercase tracking-wider text-[10px] ${getAgentColor(log.agentName)}`}>
                    {log.agentName}
                  </span>
                  <span className="text-gray-300 leading-relaxed break-words">
                    {log.action}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Status */}
        <div className="p-3 border-t border-navy-800 bg-navy-950 text-[10px] text-navy-400 font-mono flex items-center justify-between">
            <span className="flex items-center gap-1.5">
                <Server size={10} className="text-teal-500" />
                Status: Online
            </span>
            <span>v1.1.0-navy</span>
        </div>
      </div>
    </>
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

export default DebugSidebar;