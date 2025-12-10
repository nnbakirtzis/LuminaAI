import React from 'react';
import { Job } from '../types';
import { Briefcase, MapPin, DollarSign, ExternalLink, Calendar, CheckCircle2 } from 'lucide-react';

interface JobCardProps {
  job: Job;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  return (
    <div className="group relative bg-neutral-900 border border-neutral-800 hover:border-gold-500/50 transition-all duration-500 rounded-xl p-6 flex flex-col h-full hover:shadow-[0_0_30px_rgba(201,156,90,0.1)]">
      
      {/* Match Score Badge */}
      <div className="absolute -top-3 -right-3">
        <div className="relative flex items-center justify-center w-16 h-16">
          <svg className="absolute w-full h-full transform -rotate-90">
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke="currentColor"
              strokeWidth="4"
              fill="transparent"
              className="text-neutral-800"
            />
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke="currentColor"
              strokeWidth="4"
              fill="transparent"
              strokeDasharray={175.9}
              strokeDashoffset={175.9 - (175.9 * job.matchScore) / 100}
              className={`transition-all duration-1000 ease-out ${
                job.matchScore > 85 ? 'text-gold-500' : 'text-neutral-500'
              }`}
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className={`text-sm font-bold ${job.matchScore > 85 ? 'text-gold-400' : 'text-neutral-400'}`}>
              {job.matchScore}%
            </span>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="mb-6 pr-12">
        <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 text-[10px] uppercase tracking-widest font-semibold text-neutral-400 bg-neutral-800 rounded">
                {job.platform}
            </span>
            <span className="flex items-center gap-1 text-xs text-neutral-500">
                <Calendar size={10} />
                {job.postedDate}
            </span>
        </div>
        <h3 className="text-xl font-serif font-medium text-neutral-100 group-hover:text-gold-200 transition-colors">
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

      {/* Action */}
      <a 
        href={job.url}
        target="_blank"
        rel="noopener noreferrer" 
        className="mt-auto flex items-center justify-center gap-2 w-full py-3 bg-neutral-100 text-neutral-900 font-medium text-sm hover:bg-gold-400 hover:text-neutral-900 transition-all rounded"
      >
        Apply Now <ExternalLink size={16} />
      </a>
    </div>
  );
};

export default JobCard;