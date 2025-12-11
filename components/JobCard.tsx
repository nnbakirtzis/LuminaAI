import React from 'react';
import { Job } from '../types';
import { Briefcase, MapPin, DollarSign, ExternalLink, Calendar, TrendingUp, BarChart3, LineChart } from 'lucide-react';

interface JobCardProps {
  job: Job;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  return (
    <div className="group relative bg-white border border-gray-100 hover:border-navy-100 transition-all duration-300 rounded-xl p-6 flex flex-col h-full hover:shadow-2xl hover:shadow-navy-900/5 overflow-hidden">
      
      {/* Match Score Badge - Teal for Success */}
      <div className="absolute top-6 right-6 z-10">
        <div className="relative flex items-center justify-center w-14 h-14 bg-white rounded-full shadow-lg border border-gray-50">
          <svg className="absolute w-full h-full transform -rotate-90">
            <circle
              cx="28"
              cy="28"
              r="24"
              stroke="currentColor"
              strokeWidth="3"
              fill="transparent"
              className="text-gray-100"
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
                job.matchScore > 85 ? 'text-teal-500' : 'text-gray-400'
              }`}
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className={`text-sm font-bold ${job.matchScore > 85 ? 'text-teal-600' : 'text-gray-500'}`}>
              {job.matchScore}%
            </span>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="mb-6 pr-16 relative">
        <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 text-[10px] uppercase tracking-widest font-bold text-navy-600 bg-navy-50 rounded">
                {job.platform}
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-400 font-medium">
                <Calendar size={10} />
                {job.postedDate}
            </span>
        </div>
        <h3 className="text-xl font-display font-bold text-navy-900 group-hover:text-teal-600 transition-colors leading-tight">
          {job.title}
        </h3>
        <p className="text-gray-500 font-semibold text-sm mt-1">{job.company}</p>
      </div>

      {/* Details */}
      <div className="space-y-3 mb-6 flex-grow">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <MapPin size={16} className="text-gray-400" />
          {job.location}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <DollarSign size={16} className="text-gray-400" />
          {job.salary}
        </div>
        
        {/* AI Match Reason - Soft background */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
           <div className="flex items-start gap-2">
               <Briefcase size={14} className="text-teal-600 mt-1 shrink-0" />
               <p className="text-xs text-gray-600 leading-relaxed italic font-medium">
                 "{job.matchReason}"
               </p>
           </div>
        </div>

        {/* Requirements Tags */}
        <div className="flex flex-wrap gap-2 mt-4">
            {job.requirements.slice(0, 3).map((req, i) => (
                <span key={i} className="text-xs px-2 py-1 bg-white text-gray-500 rounded-md border border-gray-200 font-medium">
                    {req}
                </span>
            ))}
        </div>
      </div>

      {/* PREMIUM: Market Intelligence Engine - Dark Navy Card for Contrast */}
      {job.marketIntelligence && (
        <div className="mb-6 rounded-lg bg-navy-900 overflow-hidden relative group/intel shadow-md">
          {/* Subtle gold accent header */}
          <div className="bg-navy-800 px-3 py-2 flex items-center justify-between">
            <span className="text-[10px] font-bold text-gold-500 uppercase tracking-widest flex items-center gap-1.5">
              <TrendingUp size={10} /> Market Intelligence
            </span>
            <span className="text-[9px] text-navy-300 font-mono bg-navy-950/50 px-1.5 py-0.5 rounded">PREMIUM</span>
          </div>
          
          <div className="p-3 space-y-3">
             {/* 1. Supply vs Demand */}
             <div className="space-y-1">
               <div className="flex justify-between text-[10px] text-navy-200">
                  <span>Supply vs Demand</span>
                  <span className="text-white font-medium">{job.marketIntelligence.supplyDemandRating}</span>
               </div>
               <div className="h-1 bg-navy-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-teal-500 to-blue-500" 
                    style={{ width: `${job.marketIntelligence.competitivenessScore * 10}%` }}
                  ></div>
               </div>
             </div>

             {/* 2. Comp Forecast */}
             <div className="flex items-start gap-2">
                <div className="p-1.5 bg-navy-800 rounded text-teal-400">
                   <BarChart3 size={12} />
                </div>
                <div>
                   <p className="text-[10px] text-navy-400 uppercase tracking-wide">Comp Forecast</p>
                   <p className="text-xs text-white font-medium">{job.marketIntelligence.salaryGrowthForecast}</p>
                </div>
             </div>

             {/* 3. Trajectory */}
             <div className="flex items-start gap-2">
                <div className="p-1.5 bg-navy-800 rounded text-blue-400">
                   <LineChart size={12} />
                </div>
                <div>
                   <p className="text-[10px] text-navy-400 uppercase tracking-wide">Career Trajectory (2-5y)</p>
                   <p className="text-xs text-white font-medium">{job.marketIntelligence.careerTrajectory}</p>
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
        className="mt-auto flex items-center justify-center gap-2 w-full py-3 bg-gray-50 text-navy-900 font-bold text-sm hover:bg-navy-900 hover:text-white transition-all rounded-lg border border-gray-200 hover:border-navy-900 hover:shadow-lg"
      >
        Apply Now <ExternalLink size={16} />
      </a>
    </div>
  );
};

export default JobCard;