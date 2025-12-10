import React from 'react';
import { Job } from '../types';
import { Briefcase, MapPin, DollarSign, ExternalLink, Calendar, TrendingUp, BarChart3, LineChart } from 'lucide-react';

interface JobCardProps {
  job: Job;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  return (
    <div className="group relative bg-neutral-900 border border-neutral-800 hover:border-gold-500/50 transition-all duration-500 rounded-xl p-6 flex flex-col h-full hover:shadow-[0_0_30px_rgba(201,156,90,0.1)] overflow-hidden">
      
      {/* Match Score Badge - Repositioned to Fit Properly */}
      <div className="absolute top-6 right-6 z-10">
        <div className="relative flex items-center justify-center w-14 h-14 bg-neutral-900 rounded-full shadow-xl">
          <svg className="absolute w-full h-full transform -rotate-90">
            <circle
              cx="28"
              cy="28"
              r="24"
              stroke="currentColor"
              strokeWidth="3"
              fill="transparent"
              className="text-neutral-800"
            />
            <circle
              cx="28"
              cy="28"
              r="24"
              stroke="currentColor"
              strokeWidth="3"
              fill="transparent"
              strokeDasharray={150.8} // 2 * pi * 24
              strokeDashoffset={150.8 - (150.8 * job.matchScore) / 100}
              strokeLinecap="round"
              className={`transition-all duration-1000 ease-out ${
                job.matchScore > 85 ? 'text-gold-500' : 'text-neutral-500'
              }`}
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className={`text-sm font-bold ${job.matchScore > 85 ? 'text-gold-400' : 'text-neutral-400'}`}>
              {job.matchScore}%
            </span>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="mb-6 pr-16 relative">
        <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 text-[10px] uppercase tracking-widest font-semibold text-neutral-400 bg-neutral-800 rounded">
                {job.platform}
            </span>
            <span className="flex items-center gap-1 text-xs text-neutral-500">
                <Calendar size={10} />
                {job.postedDate}
            </span>
        </div>
        <h3 className="text-xl font-serif font-medium text-neutral-100 group-hover:text-gold-200 transition-colors leading-tight">
          {job.title}
        </h3>
        <p className="text-gold-500 font-medium text-sm mt-1">{job.company}</p>
      </div>

      {/* Details */}
      <div className="space-y-3 mb-6 flex-grow">
        <div className="flex items-center gap-2 text-sm text-neutral-400">
          <MapPin size={16} className="text-neutral-600" />
          {job.location}
        </div>
        <div className="flex items-center gap-2 text-sm text-neutral-400">
          <DollarSign size={16} className="text-neutral-600" />
          {job.salary}
        </div>
        
        {/* AI Match Reason */}
        <div className="mt-4 p-3 bg-neutral-800/30 rounded-lg border border-neutral-800/50">
           <div className="flex items-start gap-2">
               <Briefcase size={14} className="text-gold-600 mt-1 shrink-0" />
               <p className="text-xs text-neutral-300 leading-relaxed italic">
                 "{job.matchReason}"
               </p>
           </div>
        </div>

        {/* Requirements Tags */}
        <div className="flex flex-wrap gap-2 mt-4">
            {job.requirements.slice(0, 3).map((req, i) => (
                <span key={i} className="text-xs px-2 py-1 bg-neutral-800 text-neutral-400 rounded-md border border-neutral-700/50">
                    {req}
                </span>
            ))}
        </div>
      </div>

      {/* PREMIUM: Market Intelligence Engine */}
      {job.marketIntelligence && (
        <div className="mb-6 rounded-lg border border-gold-900/30 bg-gradient-to-br from-neutral-900 to-obsidian-900 overflow-hidden relative group/intel">
          {/* Subtle gold accent header */}
          <div className="bg-neutral-800/50 px-3 py-2 flex items-center justify-between">
            <span className="text-[10px] font-bold text-gold-500 uppercase tracking-widest flex items-center gap-1.5">
              <TrendingUp size={10} /> Market Intelligence
            </span>
            <span className="text-[9px] text-neutral-500 font-mono">PREMIUM</span>
          </div>
          
          <div className="p-3 space-y-3">
             {/* 1. Supply vs Demand */}
             <div className="space-y-1">
               <div className="flex justify-between text-[10px] text-neutral-400">
                  <span>Supply vs Demand</span>
                  <span className="text-neutral-200">{job.marketIntelligence.supplyDemandRating}</span>
               </div>
               <div className="h-1 bg-neutral-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500" 
                    style={{ width: `${job.marketIntelligence.competitivenessScore * 10}%` }}
                  ></div>
               </div>
             </div>

             {/* 2. Comp Forecast */}
             <div className="flex items-start gap-2">
                <div className="p-1.5 bg-neutral-800 rounded text-green-400">
                   <BarChart3 size={12} />
                </div>
                <div>
                   <p className="text-[10px] text-neutral-500 uppercase tracking-wide">Comp Forecast</p>
                   <p className="text-xs text-neutral-200 font-medium">{job.marketIntelligence.salaryGrowthForecast}</p>
                </div>
             </div>

             {/* 3. Trajectory */}
             <div className="flex items-start gap-2">
                <div className="p-1.5 bg-neutral-800 rounded text-blue-400">
                   <LineChart size={12} />
                </div>
                <div>
                   <p className="text-[10px] text-neutral-500 uppercase tracking-wide">Career Trajectory (2-5y)</p>
                   <p className="text-xs text-neutral-200 font-medium">{job.marketIntelligence.careerTrajectory}</p>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* Action */}
      <a 
        href={job.url}
        target="_blank"
        rel="noopener noreferrer" 
        className="mt-auto flex items-center justify-center gap-2 w-full py-3 bg-neutral-100 text-neutral-900 font-medium text-sm hover:bg-gold-400 hover:text-neutral-900 transition-all rounded shadow-md"
      >
        Apply Now <ExternalLink size={16} />
      </a>
    </div>
  );
};

export default JobCard;