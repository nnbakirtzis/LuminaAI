import React from 'react';
import { Check, Star, Zap, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const Pricing: React.FC = () => {
  return (
    <div className="animate-fade-in py-12">
       <div className="text-center mb-16 px-6">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-navy-900 mb-4">
             Invest in your <span className="text-teal-600">Trajectory</span>
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">
             Choose the intelligence level that matches your career ambitions.
          </p>
       </div>

       <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
             
             {/* Free Tier */}
             <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300">
                <div className="mb-6">
                   <h3 className="font-display font-bold text-xl text-navy-900">The Seeker</h3>
                   <div className="mt-4 flex items-baseline">
                      <span className="text-4xl font-bold text-navy-900">$0</span>
                      <span className="ml-1 text-slate-500">/mo</span>
                   </div>
                   <p className="text-sm text-slate-500 mt-2">Perfect for active job hunting.</p>
                </div>
                <ul className="space-y-4 mb-8">
                   <ListItem text="Unlimited Job Searches" />
                   <ListItem text="Basic Match Scoring" />
                   <ListItem text="Resume Parsing" />
                   <ListItem text="Platform Aggregation (4 Sources)" />
                   <ListItem disabled text="Labor Market Analysis" />
                   <ListItem disabled text="Salary Forecasting" />
                   <ListItem disabled text="Career Strategist Agent" />
                </ul>
                <Link to="/" className="block w-full py-3 text-center border-2 border-navy-100 text-navy-900 font-bold rounded-xl hover:border-navy-900 transition-colors">
                   Get Started
                </Link>
             </div>

             {/* Pro Tier (Highlighted) */}
             <div className="bg-navy-900 rounded-2xl p-8 border border-navy-800 shadow-2xl relative transform md:-translate-y-4">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-teal-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                   Most Popular
                </div>
                <div className="mb-6">
                   <h3 className="font-display font-bold text-xl text-white flex items-center gap-2">
                      The Strategist <Zap size={18} className="text-teal-400" />
                   </h3>
                   <div className="mt-4 flex items-baseline text-white">
                      <span className="text-4xl font-bold">$19</span>
                      <span className="ml-1 text-navy-300">/mo</span>
                   </div>
                   <p className="text-sm text-navy-200 mt-2">For data-driven career moves.</p>
                </div>
                <ul className="space-y-4 mb-8">
                   <ListItem dark text="Everything in Seeker" />
                   <ListItem dark text="Deep Market Intelligence" highlight />
                   <ListItem dark text="Salary Growth Forecasts" highlight />
                   <ListItem dark text="Career Trajectory Modeling" highlight />
                   <ListItem dark text="Supply/Demand Analysis" />
                   <ListItem dark text="Priority Agent Processing" />
                </ul>
                <Link to="/" className="block w-full py-3 text-center bg-teal-500 text-white font-bold rounded-xl hover:bg-teal-400 transition-colors shadow-lg shadow-teal-500/20">
                   Start Free Trial
                </Link>
             </div>

             {/* Enterprise Tier */}
             <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300">
                <div className="mb-6">
                   <h3 className="font-display font-bold text-xl text-navy-900">The Executive</h3>
                   <div className="mt-4 flex items-baseline">
                      <span className="text-4xl font-bold text-navy-900">Custom</span>
                   </div>
                   <p className="text-sm text-slate-500 mt-2">White-glove placement service.</p>
                </div>
                <ul className="space-y-4 mb-8">
                   <ListItem text="All Strategist Features" />
                   <ListItem text="Dedicated Human Headhunter" />
                   <ListItem text="Resume Rewrite Service" />
                   <ListItem text="Interview Coaching" />
                   <ListItem text="Contract Negotiation Support" />
                </ul>
                <button className="block w-full py-3 text-center border-2 border-navy-100 text-navy-900 font-bold rounded-xl hover:border-navy-900 transition-colors">
                   Contact Sales
                </button>
             </div>

          </div>
       </div>
    </div>
  );
};

const ListItem = ({ text, disabled, dark, highlight }: { text: string, disabled?: boolean, dark?: boolean, highlight?: boolean }) => (
  <li className={`flex items-start gap-3 text-sm ${disabled ? 'opacity-50' : ''}`}>
    <div className={`mt-0.5 shrink-0 ${dark ? 'text-teal-400' : (disabled ? 'text-gray-300' : 'text-teal-600')}`}>
       {disabled ? <div className="w-4 h-4 rounded-full border-2 border-current" /> : <Check size={16} />}
    </div>
    <span className={`
       ${dark ? 'text-navy-100' : 'text-slate-600'}
       ${highlight ? 'font-bold' : 'font-medium'}
    `}>
       {text}
    </span>
  </li>
);

export default Pricing;