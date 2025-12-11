import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bot } from 'lucide-react';

const Navbar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-navy-900 text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
          <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-white backdrop-blur-sm border border-white/10">
            <Bot size={20} />
          </div>
          <span className="font-display text-xl font-bold tracking-tight text-white">
            Lumina<span className="text-teal-400">.AI</span>
          </span>
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center gap-8">
          <NavLink to="/" label="Search" active={isActive('/')} />
          <NavLink to="/pricing" label="Pricing" active={isActive('/pricing')} />
          <NavLink to="/about" label="Mission" active={isActive('/about')} />
          <NavLink to="/faq" label="FAQ" active={isActive('/faq')} />
        </div>

        {/* CTA */}
        <div className="flex items-center gap-4">
          <Link 
            to="/" 
            className="hidden md:block px-4 py-2 bg-teal-500 hover:bg-teal-400 text-white text-sm font-bold rounded-lg transition-colors"
          >
            Launch App
          </Link>
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ to, label, active }: { to: string, label: string, active: boolean }) => (
  <Link 
    to={to} 
    className={`text-sm font-medium transition-colors ${active ? 'text-teal-400' : 'text-navy-200 hover:text-white'}`}
  >
    {label}
  </Link>
);

export default Navbar;