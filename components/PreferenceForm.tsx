
import React, { useState, useRef, useEffect } from 'react';
import { UserPreferences } from '../types';
import { Search, MapPin, Briefcase, ChevronDown, Check, Building2, Wallet, Upload, FileText, X, TrendingUp, Navigation, HelpCircle } from 'lucide-react';

interface PreferenceFormProps {
  onSubmit: (prefs: UserPreferences) => void;
  isLoading: boolean;
}

/**
 * Help Tooltip component for consistent hover explanations.
 */
const HelpButton: React.FC<{ title: string; desc: string; dark?: boolean }> = ({ title, desc, dark }) => (
  <div className="relative group/help inline-block ml-1">
    <HelpCircle size={12} className={`${dark ? 'text-navy-400' : 'text-slate-300'} hover:text-teal-500 cursor-help transition-colors`} />
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-navy-950 text-white text-[10px] rounded shadow-2xl opacity-0 group-hover/help:opacity-100 pointer-events-none transition-opacity z-[100] border border-navy-800 font-normal normal-case">
      <p className="font-bold border-b border-navy-800 pb-1 mb-1">{title}</p>
      {desc}
    </div>
  </div>
);

const EXPERIENCE_LEVELS = ['Entry', 'Mid', 'Senior', 'Executive'];
const EMPLOYMENT_TYPES = ['Full-time', 'Contract', 'Freelance'];
const WORK_MODES = ['Remote', 'Hybrid', 'On-site'];

/**
 * Advanced search form with file upload and agent toggles.
 */
const PreferenceForm: React.FC<PreferenceFormProps> = ({ onSubmit, isLoading }) => {
  const [prefs, setPrefs] = useState<UserPreferences>({
    jobTitle: '',
    location: '',
    experienceLevel: 'Mid',
    salaryMin: 80,
    salaryMax: 180,
    industry: 'Technology',
    workMode: 'Remote',
    employmentType: 'Full-time',
    keySkills: '',
    resume: undefined,
    enableIntelligence: false,
    enableResumeTailoring: false
  });

  const [isExpDropdownOpen, setIsExpDropdownOpen] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle clicking outside the experience dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsExpDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(prefs);
  };

  /**
   * Browser geolocation helper with improved reverse geocoding via OpenStreetMap.
   * Maps latitude/longitude to a human-readable "City, State, Country" string.
   */
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`);
          const data = await response.json();
          
          if (data && data.address) {
            const addr = data.address;
            const locality = addr.city || addr.town || addr.village || addr.suburb || addr.hamlet || addr.municipality || addr.county;
            const state = addr.state;
            const country = addr.country;

            const addressParts = [];
            if (locality) addressParts.push(locality);
            if (state) addressParts.push(state);
            if (country) addressParts.push(country);

            if (addressParts.length > 0) {
              setPrefs(prev => ({ ...prev, location: addressParts.join(', ') }));
            } else {
              setPrefs(prev => ({ ...prev, location: `${latitude.toFixed(2)}, ${longitude.toFixed(2)}` }));
            }
          } else {
            setPrefs(prev => ({ ...prev, location: `${latitude.toFixed(2)}, ${longitude.toFixed(2)}` }));
          }
        } catch (err) {
          console.error("Geocoding failed", err);
          setPrefs(prev => ({ ...prev, location: `${latitude.toFixed(2)}, ${longitude.toFixed(2)}` }));
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        console.error("Geolocation error", error);
        setIsLocating(false);
      },
      { timeout: 10000, enableHighAccuracy: false }
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPrefs(prev => ({ ...prev, [name]: value }));
  };

  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'min' | 'max') => {
    const val = parseInt(e.target.value);
    setPrefs(prev => {
      if (type === 'min') return { ...prev, salaryMin: Math.min(val, prev.salaryMax - 10) };
      return { ...prev, salaryMax: Math.max(val, prev.salaryMin + 10) };
    });
  };

  /**
   * Processes uploaded resume files into Base64 for Gemini ingestion.
   */
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        const base64Data = (loadEvent.target?.result as string).split(',')[1];
        setPrefs(prev => ({
          ...prev,
          resume: { fileName: file.name, mimeType: file.type, base64: base64Data },
          enableResumeTailoring: true 
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFile = () => {
    setPrefs(prev => ({ ...prev, resume: undefined, enableResumeTailoring: false }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-5xl mx-auto bg-white border border-gray-100 p-6 md:p-10 rounded-2xl shadow-xl animate-slide-up relative overflow-hidden">
      
      <style>{`
        /* Thumbs need to be interactive even if the input track is not */
        .thumb-input::-webkit-slider-thumb { 
          width: 28px; 
          height: 28px; 
          border-radius: 50%; 
          background: #001F3F; 
          border: 3px solid white; 
          cursor: pointer; 
          pointer-events: auto; /* CRITICAL: Enables interaction on invisible input */
          -webkit-appearance: none;
        }
        .thumb-input::-moz-range-thumb { 
          width: 28px; 
          height: 28px; 
          border-radius: 50%; 
          background: #001F3F; 
          border: 3px solid white; 
          cursor: pointer; 
          pointer-events: auto;
        }
      `}</style>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 mb-10">
        
        {/* Left: Basics */}
        <div className="space-y-8">
          <div className="space-y-3">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Briefcase size={14} className="text-teal-600" /> Desired Role
            </label>
            <input type="text" name="jobTitle" value={prefs.jobTitle} onChange={handleChange} placeholder="e.g. Senior Product Designer" className="w-full bg-gray-50 border border-gray-200 text-lg text-navy-900 font-medium px-4 py-4 rounded-xl focus:border-navy-500 transition-all" required />
          </div>

          <div className="space-y-3 relative">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <MapPin size={14} className="text-teal-600" /> Location
            </label>
            <div className="relative group">
              <input type="text" name="location" value={prefs.location} onChange={handleChange} placeholder="e.g. New York, London" className="w-full bg-gray-50 border border-gray-200 text-lg text-navy-900 font-medium pl-4 pr-12 py-4 rounded-xl focus:border-navy-500 transition-all" required />
              <button type="button" onClick={handleLocateMe} disabled={isLocating} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-navy-400 hover:text-teal-600 disabled:opacity-50 transition-colors">
                <Navigation size={20} className={isLocating ? "animate-pulse" : ""} />
              </button>
            </div>
          </div>

          <div className="space-y-3">
             <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
               <Upload size={14} className="text-teal-600" /> Resume / CV <HelpButton title="Resume Ingestion" desc="Allows the Headhunter agent to calculate match scores and the Resumator to rewrite your CV." />
            </label>
            <div className={`relative w-full border border-dashed rounded-xl p-4 transition-all ${prefs.resume ? 'bg-teal-50 border-teal-200' : 'bg-gray-50 border-gray-300 hover:bg-white'}`}>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".pdf,.txt" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
              {prefs.resume ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-teal-600 shadow-sm border border-teal-100"><FileText size={20} /></div>
                    <div><p className="text-sm font-bold text-navy-900 truncate max-w-[150px]">{prefs.resume.fileName}</p><p className="text-[10px] text-teal-600 font-bold">READY TO ANALYZE</p></div>
                  </div>
                  <button type="button" onClick={(e) => { e.stopPropagation(); removeFile(); }} className="p-2 hover:bg-white rounded-full text-gray-400 hover:text-red-500 z-20 transition-colors"><X size={18} /></button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-2 text-center">
                  <span className="text-navy-600 text-sm font-semibold underline">Upload PDF / TXT</span>
                  <span className="text-slate-400 text-[10px] mt-1 italic">Personalizes matching & tailoring</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Premium Toggles & Details */}
        <div className="space-y-8">
          <div className="space-y-3 relative" ref={dropdownRef}>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Experience Level</label>
            <div onClick={() => setIsExpDropdownOpen(!isExpDropdownOpen)} className="w-full bg-gray-50 border text-lg px-4 py-4 rounded-xl cursor-pointer flex items-center justify-between">
              <span className="text-navy-900 font-medium">{prefs.experienceLevel} Level</span>
              <ChevronDown size={20} className={`text-gray-400 transition-transform ${isExpDropdownOpen ? 'rotate-180' : ''}`} />
            </div>
            {isExpDropdownOpen && (
              <div className="absolute z-20 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-2xl overflow-hidden">
                {EXPERIENCE_LEVELS.map((level) => (
                  <div key={level} onClick={() => { setPrefs(prev => ({ ...prev, experienceLevel: level as any })); setIsExpDropdownOpen(false); }} className="px-4 py-4 hover:bg-gray-50 cursor-pointer flex items-center justify-between border-b border-gray-50 last:border-0 transition-colors">
                    <span className="text-navy-900 font-medium">{level}</span>
                    {prefs.experienceLevel === level && <Check size={18} className="text-teal-500" />}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6 pt-2">
            <div className="flex justify-between items-end">
               <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                 <Wallet size={14} className="text-teal-600" /> Salary Range
               </label>
               <span className="text-navy-900 font-display text-2xl font-bold tracking-tight">${prefs.salaryMin}k — ${prefs.salaryMax}k+</span>
            </div>
            <div className="relative h-8 w-full mt-2 flex items-center">
              {/* Slider Track Background */}
              <div className="absolute top-1/2 left-0 w-full h-2 bg-gray-200 rounded-full -translate-y-1/2"></div>
              
              {/* Active Selection Bar */}
              <div 
                className="absolute top-1/2 h-2 bg-navy-600 rounded-full -translate-y-1/2" 
                style={{ 
                  left: `${(prefs.salaryMin / 300) * 100}%`, 
                  right: `${100 - (prefs.salaryMax / 300) * 100}%` 
                }}
              ></div>
              
              {/* Overlapping Input Fields */}
              <input 
                type="range" min="0" max="300" step="10" 
                value={prefs.salaryMin} 
                onChange={(e) => handleSalaryChange(e, 'min')} 
                className="absolute inset-0 w-full h-full opacity-0 thumb-input pointer-events-none appearance-none" 
                style={{ zIndex: prefs.salaryMin > 150 ? 21 : 20 }}
              />
              <input 
                type="range" min="0" max="300" step="10" 
                value={prefs.salaryMax} 
                onChange={(e) => handleSalaryChange(e, 'max')} 
                className="absolute inset-0 w-full h-full opacity-0 thumb-input pointer-events-none appearance-none" 
                style={{ zIndex: prefs.salaryMax <= 150 ? 21 : 20 }}
              />
            </div>
          </div>
          
           <div className="pt-2">
             <div onClick={() => setPrefs(prev => ({...prev, enableIntelligence: !prev.enableIntelligence}))} className={`group cursor-pointer border rounded-xl p-4 transition-all duration-300 relative active:scale-95 ${prefs.enableIntelligence ? 'bg-navy-900 border-navy-900 shadow-lg' : 'bg-white border-gray-200 hover:border-gray-300'}`}>
              <div className="flex justify-between items-start mb-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${prefs.enableIntelligence ? 'bg-teal-500 text-white' : 'bg-gray-100 text-gray-400'}`}><TrendingUp size={16} /></div>
                  <div className={`w-8 h-4 rounded-full p-0.5 transition-colors ${prefs.enableIntelligence ? 'bg-teal-500' : 'bg-gray-200'}`}><div className={`w-3 h-3 rounded-full bg-white transition-transform ${prefs.enableIntelligence ? 'translate-x-4' : 'translate-x-0'}`}></div></div>
              </div>
              <h4 className={`text-xs font-bold ${prefs.enableIntelligence ? 'text-white' : 'text-navy-900'}`}>Market Intelligence <HelpButton title="Agent Swarm" desc="Enables deep analysis of macro trends, salary growth, and supply/demand metrics." dark={prefs.enableIntelligence} /></h4>
              <p className={`text-[10px] mt-1 ${prefs.enableIntelligence ? 'text-navy-200' : 'text-slate-400'}`}>Activates Economist, Futurist & Strategist agents.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 flex justify-end">
        <button type="submit" disabled={isLoading} className="group relative px-12 py-5 bg-navy-900 text-white font-bold text-lg rounded-xl transition-all shadow-xl hover:bg-navy-800 disabled:opacity-50 active:scale-95 w-full md:w-auto uppercase tracking-widest">
          {isLoading ? <span className="flex items-center gap-2"><span className="animate-spin">⟳</span> Deploying agents...</span> : "Find My Role"}
        </button>
      </div>
    </form>
  );
};

export default PreferenceForm;
