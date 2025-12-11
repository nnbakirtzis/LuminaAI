import React from 'react';
import { BrainCircuit, Globe, Target, ShieldCheck } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="animate-fade-in">
       {/* Hero */}
       <div className="bg-navy-900 text-white py-20 px-6">
          <div className="container mx-auto max-w-4xl text-center">
             <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
               Deciding your future shouldn't be a guessing game.
             </h1>
             <p className="text-navy-200 text-xl leading-relaxed">
               Lumina replaces keyword matching with semantic understanding and economic forecasting, giving you the data you need to make the right move, not just the next move.
             </p>
          </div>
       </div>

       {/* Mission Grid */}
       <div className="container mx-auto px-6 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
             <div>
                <h2 className="text-3xl font-display font-bold text-navy-900 mb-4">Our Methodology</h2>
                <p className="text-slate-600 leading-relaxed mb-6">
                   Traditional job boards are "dumb" lists. They don't know if a role is a career dead-end or a rocket ship. They don't know if the salary offered will be eaten by inflation next year.
                </p>
                <p className="text-slate-600 leading-relaxed">
                   Lumina utilizes a swarm of specialized AI agents—an Economist, a Futurist, and a Strategist—to analyze every opportunity. We don't just find jobs; we underwrite your career risk.
                </p>
             </div>
             <div className="grid grid-cols-2 gap-4">
                <FeatureBox icon={BrainCircuit} title="Cognitive Search" desc="Understanding intent, not just keywords." />
                <FeatureBox icon={Globe} title="Global Reach" desc="Access to opportunities in 140+ countries." />
                <FeatureBox icon={Target} title="Precision" desc="Matching based on culture, stack, and trajectory." />
                <FeatureBox icon={ShieldCheck} title="Privacy First" desc="Your data is never sold to recruiters." />
             </div>
          </div>
       </div>
    </div>
  );
};

const FeatureBox = ({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) => (
   <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center text-teal-600 mb-4">
         <Icon size={20} />
      </div>
      <h3 className="font-bold text-navy-900 mb-2">{title}</h3>
      <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
   </div>
);

export default About;