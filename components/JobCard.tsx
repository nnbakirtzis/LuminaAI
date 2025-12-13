import React from 'react';
import { Job } from '../types';
import { Briefcase, MapPin, DollarSign, ExternalLink, Calendar, TrendingUp, BarChart3, LineChart, Sparkles } from 'lucide-react';

interface JobCardProps {
  job: Job;
  enableResumeTailoring: boolean;
  onGenerateResume: (job: Job) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, enableResumeTailoring, onGenerateResume }) => {
  return (
    <div className="group relative bg-white border border-slate-200 hover:border-navy-200 transition-all duration-300 rounded-xl p-6 flex flex-col h-full hover:shadow-2xl hover:shadow-navy-900/10 overflow-hidden">
      
      {/* Match Score Badge - Teal for Success */}
      <div className="absolute top-6 right-6 z-10">
        <div className="relative flex items-center justify-center w-14 h-14 bg-white rounded-full shadow-lg border border-slate-100">
          <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 56 56">
            <circle
              cx="28"
              cy="28"
              r="24"
              stroke="currentColor"
              strokeWidth="3"
              fill="transparent"
              className="text-slate-100"
            />
            <circle
              cx="28"
              cy="28"
              r="24"
              stroke="currentColor"
              strokeWidth="3"
              fill="transparent"
              strokeDasharray={150.8}
              strokeDashoffset={150.8 - (150.8 * job.matchScore) / 100}
              strokeLinecap="round"
              className={`transition-all duration-1000 ease-out ${
                job.matchScore > 85 ? 'text-teal-500' : 'text-slate-300'
              }`}
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className={`text-sm font-bold ${job.matchScore > 85 ? 'text-teal-600' : 'text-slate-500'}`}>
              {job.matchScore}%
            </span>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="mb-6 pr-16 relative">
        <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 text-[10px] uppercase tracking-widest font-bold text-navy-700 bg-navy-50 rounded border border-navy-100">
                {job.platform}
            </span>
            <span className="flex items-center gap-1 text-xs text-slate-500 font-semibold">
                <Calendar size={10} className="text-slate-400" />
                {job.postedDate}
            </span>
        </div>
        <h3 className="text-xl font-display font-bold text-navy-950 group-hover:text-teal-600 transition-colors leading-tight">
          {job.title}
        </h3>
        <p className="text-slate-600 font-semibold text-sm mt-1">{job.company}</p>
      </div>

      {/* Details */}
      <div className="space-y-3 mb-6 flex-grow">
        <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
          <MapPin size={16} className="text-slate-400 shrink-0" />
          {job.location}
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
          <DollarSign size={16} className="text-slate-400 shrink-0" />
          {job.salary}
        </div>
        
        {/* AI Match Reason - Better Contrast */}
        <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-100">
           <div className="flex items-start gap-2">
               <Briefcase size={14} className="text-teal-600 mt-0.5 shrink-0" />
               <p className="text-xs text-slate-700 leading-relaxed italic font-medium">
                 "{job.matchReason}"
               </p>
           </div>
        </div>

        {/* Requirements Tags */}
        <div className="flex flex-wrap gap-2 mt-4">
            {job.requirements.slice(0, 3).map((req, i) => (
                <span key={i} className="text-xs px-2.5 py-1 bg-white text-slate-600 rounded-md border border-slate-200 font-semibold shadow-sm">
                    {req}
                </span>
            ))}
        </div>
      </div>

      {/* PREMIUM: Market Intelligence Engine - Dark Navy Card for Contrast */}
      {job.marketIntelligence && (
        <div className="mb-6 rounded-lg bg-navy-900 overflow-hidden relative group/intel shadow-md ring-1 ring-navy-800">
          {/* Header - Switched to Teal for consistency with new Palette */}
          <div className="bg-navy-800/80 px-3 py-2 flex items-center justify-between border-b border-navy-700">
            <span className="text-[10px] font-bold text-teal-400 uppercase tracking-widest flex items-center gap-1.5">
              <TrendingUp size={12} /> Market Intelligence
            </span>
            <span className="text-[9px] text-navy-200 font-mono bg-navy-950/80 px-1.5 py-0.5 rounded border border-navy-700">PREMIUM</span>
          </div>
          
          <div className="p-3 space-y-3">
             {/* 1. Supply vs Demand */}
             <div className="space-y-1.5">
               <div className="flex justify-between text-[10px] text-navy-100 font-medium">
                  <span className="text-navy-300">Supply vs Demand</span>
                  <span className="text-white">{job.marketIntelligence.supplyDemandRating}</span>
               </div>
               <div className="h-1.5 bg-navy-950 rounded-full overflow-hidden border border-navy-800/50">
                  <div 
                    className="h-full bg-gradient-to-r from-teal-500 to-blue-500" 
                    style={{ width: `${job.marketIntelligence.competitivenessScore * 10}%` }}
                  ></div>
               </div>
             </div>

             {/* 2. Comp Forecast */}
             <div className="flex items-start gap-2.5">
                <div className="p-1.5 bg-navy-800 rounded text-teal-400 shrink-0 border border-navy-700">
                   <BarChart3 size={12} />
                </div>
                <div>
                   <p className="text-[10px] text-navy-300 uppercase tracking-wide font-bold">Comp Forecast</p>
                   <p className="text-xs text-white font-medium mt-0.5">{job.marketIntelligence.salaryGrowthForecast}</p>
                </div>
             </div>

             {/* 3. Trajectory */}
             <div className="flex items-start gap-2.5">
                <div className="p-1.5 bg-navy-800 rounded text-blue-400 shrink-0 border border-navy-700">
                   <LineChart size={12} />
                </div>
                <div>
                   <p className="text-[10px] text-navy-300 uppercase tracking-wide font-bold">Career Trajectory (2-5y)</p>
                   <p className="text-xs text-white font-medium mt-0.5">{job.marketIntelligence.careerTrajectory}</p>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-auto space-y-3">
        {enableResumeTailoring && (
            <button 
              onClick={(e) => {
                e.preventDefault();
                onGenerateResume(job);
              }}
              className="w-full flex items-center justify-center gap-2 py-3 bg-gold-50 text-gold-700 font-bold text-sm rounded-lg border border-gold-200 hover:bg-gold-100 hover:border-gold-300 transition-all shadow-sm"
            >
              <Sparkles size={16} /> Tailor Resume for Role
            </button>
        )}
        
        <a 
          href={job.url}
          target="_blank"
          rel="noopener noreferrer" 
          className="flex items-center justify-center gap-2 w-full py-3.5 bg-slate-50 text-navy-900 font-bold text-sm hover:bg-navy-900 hover:text-white transition-all rounded-lg border border-slate-200 hover:border-navy-900 hover:shadow-lg hover:-translate-y-0.5"
        >
          Apply Now <ExternalLink size={16} />
        </a>
      </div>
    </div>
  );
};

export default JobCard;