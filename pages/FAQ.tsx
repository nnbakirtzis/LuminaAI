import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQ: React.FC = () => {
  return (
    <div className="animate-fade-in container mx-auto px-6 py-16 max-w-3xl">
       <div className="text-center mb-12">
          <h1 className="text-3xl font-display font-bold text-navy-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-slate-600">Everything you need to know about the platform.</p>
       </div>

       <div className="space-y-4">
          <Accordion 
             q="How does the AI Market Intelligence work?" 
             a="Our system deploys three parallel agents: An Economist to check supply/demand, a Futurist to forecast inflation-adjusted salary growth, and a Strategist to predict career exit opportunities. This data is synthesized from real-time market signals."
          />
          <Accordion 
             q="Is my resume data kept private?" 
             a="Absolutely. Your resume is processed in-memory for the duration of the session to generate match scores and is never stored on our servers or shared with third parties."
          />
          <Accordion 
             q="Can I use Lumina for free?" 
             a="Yes! The 'Seeker' plan is free forever and includes unlimited searches and basic match scoring. The 'Strategist' features (forecasting and intelligence) require a premium subscription."
          />
          <Accordion 
             q="Which job platforms do you aggregate?" 
             a="We currently scan public listings from LinkedIn, Glassdoor, Indeed, and direct company career pages. We prioritize direct company listings to ensure freshness."
          />
           <Accordion 
             q="How accurate are the salary forecasts?" 
             a="Our 'Comp Futurist' agent uses historical inflation data and industry-specific growth trends to model potential outcomes. While no prediction is 100% guaranteed, it provides a statistical baseline for negotiation."
          />
       </div>
    </div>
  );
};

const Accordion = ({ q, a }: { q: string, a: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white transition-all duration-300">
       <button 
         onClick={() => setIsOpen(!isOpen)}
         className="w-full flex items-center justify-between p-5 text-left bg-white hover:bg-gray-50 transition-colors"
       >
         <span className={`font-bold text-navy-900 ${isOpen ? 'text-teal-600' : ''}`}>{q}</span>
         {isOpen ? <ChevronUp size={20} className="text-teal-600" /> : <ChevronDown size={20} className="text-gray-400" />}
       </button>
       <div 
         className={`
            overflow-hidden transition-all duration-300 ease-in-out
            ${isOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}
         `}
       >
         <div className="p-5 pt-0 text-slate-600 text-sm leading-relaxed border-t border-dashed border-gray-100 mt-2">
            {a}
         </div>
       </div>
    </div>
  );
};

export default FAQ;