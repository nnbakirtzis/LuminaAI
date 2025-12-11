import React from 'react';
import { Bot, Twitter, Linkedin, Github } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-navy-950 text-navy-200 py-12 border-t border-navy-900">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-1">
             <div className="flex items-center gap-2 mb-4 text-white">
                <Bot size={24} className="text-teal-500"/>
                <span className="font-display font-bold text-lg">Lumina.AI</span>
             </div>
             <p className="text-xs text-navy-400 leading-relaxed">
               Democratizing executive search with multi-agent artificial intelligence. We help you find your masterpiece.
             </p>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-wider">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-teal-400 transition-colors">Job Finder</Link></li>
              <li><Link to="/pricing" className="hover:text-teal-400 transition-colors">Pricing</Link></li>
              <li><span className="text-navy-500 cursor-not-allowed">API (Coming Soon)</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-wider">Company</h4>
             <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-teal-400 transition-colors">About Us</Link></li>
              <li><Link to="/faq" className="hover:text-teal-400 transition-colors">FAQ</Link></li>
              <li><span className="text-navy-500 cursor-not-allowed">Careers</span></li>
            </ul>
          </div>

          <div>
             <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-wider">Connect</h4>
             <div className="flex gap-4">
                <a href="#" className="hover:text-white transition-colors"><Twitter size={20} /></a>
                <a href="#" className="hover:text-white transition-colors"><Linkedin size={20} /></a>
                <a href="#" className="hover:text-white transition-colors"><Github size={20} /></a>
             </div>
          </div>
        </div>
        
        <div className="border-t border-navy-900 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-navy-500">
          <p>&copy; {new Date().getFullYear()} Lumina AI Inc. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
             <a href="#" className="hover:text-navy-300">Privacy Policy</a>
             <a href="#" className="hover:text-navy-300">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;