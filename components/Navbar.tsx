
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bot, User as UserIcon, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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

        {/* CTA / User Profile */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="relative">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-3 px-2 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
              >
                 <img 
                   src={user.avatar} 
                   alt={user.name} 
                   className="w-8 h-8 rounded-full border border-teal-500"
                 />
                 <span className="text-sm font-medium hidden md:block">{user.name}</span>
                 <ChevronDown size={14} className="text-navy-300" />
              </button>

              {/* Dropdown */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden text-navy-900 animate-fade-in origin-top-right">
                   <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-xs text-slate-500">Signed in as</p>
                      <p className="text-sm font-bold truncate">{user.email}</p>
                   </div>
                   <button 
                     onClick={() => {
                       logout();
                       setIsDropdownOpen(false);
                     }}
                     className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-red-600 flex items-center gap-2"
                   >
                     <LogOut size={14} /> Sign Out
                   </button>
                </div>
              )}
              {/* Overlay to close dropdown */}
              {isDropdownOpen && (
                <div 
                  className="fixed inset-0 z-[-1]" 
                  onClick={() => setIsDropdownOpen(false)}
                />
              )}
            </div>
          ) : (
            <Link 
              to="/login" 
              className="hidden md:block px-4 py-2 bg-teal-500 hover:bg-teal-400 text-white text-sm font-bold rounded-lg transition-colors shadow-lg shadow-teal-500/20"
            >
              Sign In
            </Link>
          )}
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
