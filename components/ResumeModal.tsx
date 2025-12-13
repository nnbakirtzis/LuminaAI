import React from 'react';
import { X, Copy, Download, Check, FileText } from 'lucide-react';
import { Job } from '../types';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: Job | null;
  content: string;
  isLoading: boolean;
}

const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose, job, content, isLoading }) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([content], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `Tailored_Resume_${job?.company}_${job?.title}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
       {/* Backdrop */}
       <div 
         className="absolute inset-0 bg-navy-900/60 backdrop-blur-sm animate-fade-in"
         onClick={onClose}
       ></div>

       {/* Modal */}
       <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-slide-up">
          
          {/* Header */}
          <div className="bg-navy-950 p-6 flex items-center justify-between border-b border-navy-800">
             <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gold-500/20 rounded-lg flex items-center justify-center text-gold-400">
                    <FileText size={20} />
                </div>
                <div>
                   <h3 className="text-white font-display font-bold text-lg">AI Resume Tailor</h3>
                   <p className="text-navy-300 text-xs">
                     {job ? `Optimized for ${job.title} at ${job.company}` : 'Preparing...'}
                   </p>
                </div>
             </div>
             <button onClick={onClose} className="text-navy-400 hover:text-white transition-colors">
                <X size={24} />
             </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
             {isLoading ? (
                <div className="flex flex-col items-center justify-center h-64 space-y-4">
                   <div className="relative w-16 h-16">
                      <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
                      <div className="absolute inset-0 border-4 border-gold-500 rounded-full border-t-transparent animate-spin"></div>
                   </div>
                   <p className="text-navy-900 font-bold animate-pulse">Resumator Agent is analyzing keywords...</p>
                   <p className="text-slate-500 text-sm">Aligning your experience with the job description.</p>
                </div>
             ) : (
                <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm font-mono text-sm leading-relaxed whitespace-pre-wrap text-slate-700">
                   {content}
                </div>
             )}
          </div>

          {/* Footer Actions */}
          {!isLoading && (
             <div className="p-6 bg-white border-t border-gray-200 flex justify-between items-center">
                <p className="text-xs text-slate-400 italic">
                   *Review carefully before submitting. AI generated content.
                </p>
                <div className="flex gap-3">
                   <button 
                     onClick={handleCopy}
                     className="flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 font-bold rounded-lg hover:bg-slate-50 transition-colors"
                   >
                     {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                     {copied ? 'Copied' : 'Copy Text'}
                   </button>
                   <button 
                     onClick={handleDownload}
                     className="flex items-center gap-2 px-6 py-2 bg-navy-900 text-white font-bold rounded-lg hover:bg-navy-800 transition-colors shadow-lg shadow-navy-900/20"
                   >
                     <Download size={18} /> Download .md
                   </button>
                </div>
             </div>
          )}
       </div>
    </div>
  );
};

export default ResumeModal;