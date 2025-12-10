import React, { useState, useRef, useEffect } from 'react';
import { UserPreferences } from '../types';
import { Search, MapPin, Briefcase, ChevronDown, Check, Building2, Wallet, Upload, FileText, X, Sparkles, TrendingUp } from 'lucide-react';

interface PreferenceFormProps {
  onSubmit: (prefs: UserPreferences) => void;
  isLoading: boolean;
}

const EXPERIENCE_LEVELS = ['Entry', 'Mid', 'Senior', 'Executive'];
const EMPLOYMENT_TYPES = ['Full-time', 'Contract', 'Freelance'];
const WORK_MODES = ['Remote', 'Hybrid', 'On-site'];

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
    enableIntelligence: false
  });

  const [isExpDropdownOpen, setIsExpDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPrefs(prev => ({ ...prev, [name]: value }));
  };

  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'min' | 'max') => {
    const val = parseInt(e.target.value);
    setPrefs(prev => {
      if (type === 'min') {
        const newMin = Math.min(val, prev.salaryMax - 10);
        return { ...prev, salaryMin: newMin };
      } else {
        const newMax = Math.max(val, prev.salaryMin + 10);
        return { ...prev, salaryMax: newMax };
      }
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isPdf = file.type === 'application/pdf';
      const isTxt = file.type === 'text/plain';
      
      if (!isPdf && !isTxt) {
        alert("Please upload a PDF or Text file for best analysis results.");
        return;
      }

      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        const result = loadEvent.target?.result as string;
        const base64Data = result.split(',')[1];
        
        setPrefs(prev => ({
          ...prev,
          resume: {
            fileName: file.name,
            mimeType: file.type,
            base64: base64Data
          }
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFile = () => {
    setPrefs(prev => ({ ...prev, resume: undefined }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-5xl mx-auto bg-neutral-900/60 backdrop-blur-xl border border-neutral-800 p-8 md:p-10 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-slide-up relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold-500/50 to-transparent"></div>
      
      <style>{`
        .thumb-input::-webkit-slider-thumb {
          pointer-events: auto;
          width: 28px;
          height: 28px;
          border-radius: 50%; 
          -webkit-appearance: none;
          cursor: pointer; 
        }
        .thumb-input::-moz-range-thumb {
          pointer-events: auto;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: none;
          cursor: pointer;
        }
      `}</style>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 mb-10">
        
        {/* Left Column */}
        <div className="space-y-8">
          <div className="space-y-3">
            <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-2">
              <Briefcase size={12} className="text-gold-500" /> Desired Role
            </label>
            <input
              type="text"
              name="jobTitle"
              value={prefs.jobTitle}
              onChange={handleChange}
              placeholder="e.g. Senior Product Designer"
              className="w-full bg-neutral-950/50 border border-neutral-800 text-lg text-neutral-100 px-4 py-4 rounded-xl focus:outline-none focus:border-gold-500/50 focus:bg-neutral-900 transition-all placeholder:text-neutral-700"
              required
            />
          </div>

           <div className="space-y-3">
            <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-2">
              <MapPin size={12} className="text-gold-500" /> Location
            </label>
            <input
              type="text"
              name="location"
              value={prefs.location}
              onChange={handleChange}
              placeholder="e.g. New York, London, Berlin"
              className="w-full bg-neutral-950/50 border border-neutral-800 text-lg text-neutral-100 px-4 py-4 rounded-xl focus:outline-none focus:border-gold-500/50 focus:bg-neutral-900 transition-all placeholder:text-neutral-700"
              required
            />
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-2">
               <Building2 size={12} className="text-gold-500" /> Key Skills / Keywords
            </label>
            <input
              type="text"
              name="keySkills"
              value={prefs.keySkills}
              onChange={handleChange}
              placeholder="e.g. React, Python, Leadership, AI"
              className="w-full bg-neutral-950/50 border border-neutral-800 text-base text-neutral-100 px-4 py-3 rounded-xl focus:outline-none focus:border-gold-500/50 focus:bg-neutral-900 transition-all placeholder:text-neutral-700"
            />
          </div>

          <div className="space-y-3">
             <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-2">
               <Upload size={12} className="text-gold-500" /> Resume / CV (Optional)
            </label>
            <div 
              className={`
                relative w-full border border-dashed rounded-xl p-4 transition-all group
                ${prefs.resume 
                  ? 'bg-gold-500/5 border-gold-500/50' 
                  : 'bg-neutral-950/30 border-neutral-700 hover:border-gold-500/30 hover:bg-neutral-900'}
              `}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf,.txt"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              
              {prefs.resume ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gold-500/10 rounded-lg flex items-center justify-center text-gold-500">
                      <FileText size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-neutral-200 truncate max-w-[200px]">{prefs.resume.fileName}</p>
                      <p className="text-[10px] text-gold-500 uppercase tracking-wider">Ready to analyze</p>
                    </div>
                  </div>
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation(); 
                      removeFile();
                    }}
                    className="p-2 hover:bg-neutral-800 rounded-full text-neutral-500 hover:text-red-400 z-20 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-2 text-center">
                  <span className="text-neutral-400 group-hover:text-gold-200 transition-colors text-sm font-medium">Click to upload PDF</span>
                  <span className="text-neutral-600 text-xs mt-1">Enhances AI matching accuracy</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          
          <div className="space-y-3 relative" ref={dropdownRef}>
            <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Experience Level</label>
            <div 
              onClick={() => setIsExpDropdownOpen(!isExpDropdownOpen)}
              className={`
                w-full bg-neutral-950/50 border text-lg px-4 py-4 rounded-xl cursor-pointer flex items-center justify-between transition-all
                ${isExpDropdownOpen ? 'border-gold-500' : 'border-neutral-800 hover:border-neutral-700'}
              `}
            >
              <span className="text-neutral-100">{prefs.experienceLevel} Level</span>
              <ChevronDown size={20} className={`text-neutral-500 transition-transform ${isExpDropdownOpen ? 'rotate-180' : ''}`} />
            </div>

            <div className={`
              absolute z-20 w-full mt-2 bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl overflow-hidden origin-top transition-all duration-200
              ${isExpDropdownOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}
            `}>
              {EXPERIENCE_LEVELS.map((level) => (
                <div
                  key={level}
                  onClick={() => {
                    setPrefs(prev => ({ ...prev, experienceLevel: level as any }));
                    setIsExpDropdownOpen(false);
                  }}
                  className="px-4 py-3 hover:bg-neutral-800 cursor-pointer flex items-center justify-between group transition-colors"
                >
                  <span className={`${prefs.experienceLevel === level ? 'text-gold-500' : 'text-neutral-400 group-hover:text-neutral-200'}`}>
                    {level}
                  </span>
                  {prefs.experienceLevel === level && <Check size={16} className="text-gold-500" />}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-5 pt-2">
            <div className="flex justify-between items-end">
               <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-2">
                 <Wallet size={12} className="text-gold-500" /> Salary Range
               </label>
               <span className="text-gold-400 font-mono text-lg font-medium tracking-tight">
                 ${prefs.salaryMin}k — ${prefs.salaryMax}k+
               </span>
            </div>
            
            <div className="relative h-6 w-full mt-2 flex items-center">
              <div className="absolute top-1/2 left-0 w-full h-1.5 bg-neutral-800 rounded-full -translate-y-1/2"></div>
              
              <div 
                className="absolute top-1/2 h-1.5 bg-gold-600 rounded-full opacity-80 -translate-y-1/2"
                style={{
                  left: `${(prefs.salaryMin / 300) * 100}%`,
                  right: `${100 - (prefs.salaryMax / 300) * 100}%`
                }}
              ></div>

              <input 
                type="range" min="0" max="300" step="10"
                value={prefs.salaryMin}
                onChange={(e) => handleSalaryChange(e, 'min')}
                className="absolute inset-0 w-full h-full opacity-0 z-20 thumb-input pointer-events-none appearance-none"
              />
              <input 
                type="range" min="0" max="300" step="10"
                value={prefs.salaryMax}
                onChange={(e) => handleSalaryChange(e, 'max')}
                className="absolute inset-0 w-full h-full opacity-0 z-20 thumb-input pointer-events-none appearance-none"
              />

              <div 
                className="absolute w-5 h-5 bg-neutral-900 border-2 border-gold-500 rounded-full shadow pointer-events-none transition-transform hover:scale-110 -translate-x-1/2"
                style={{ left: `${(prefs.salaryMin / 300) * 100}%` }}
              ></div>
              <div 
                className="absolute w-5 h-5 bg-neutral-900 border-2 border-gold-500 rounded-full shadow pointer-events-none transition-transform hover:scale-110 -translate-x-1/2"
                style={{ left: `${(prefs.salaryMax / 300) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-[10px] text-neutral-600 font-mono uppercase mt-1">
              <span>$0k</span>
              <span>$300k+</span>
            </div>
          </div>
          
           {/* PREMIUM MODE TOGGLE */}
           <div className="pt-2">
            <div 
              onClick={() => setPrefs(prev => ({...prev, enableIntelligence: !prev.enableIntelligence}))}
              className={`
                group cursor-pointer border rounded-xl p-4 flex items-center justify-between transition-all duration-300
                ${prefs.enableIntelligence 
                  ? 'bg-neutral-900 border-gold-500/50 shadow-[0_0_15px_rgba(201,156,90,0.1)]' 
                  : 'bg-neutral-950/30 border-neutral-800 hover:bg-neutral-900 hover:border-neutral-700'}
              `}
            >
              <div className="flex items-center gap-3">
                <div className={`
                  w-10 h-10 rounded-lg flex items-center justify-center transition-colors
                  ${prefs.enableIntelligence ? 'bg-gold-500 text-obsidian-900' : 'bg-neutral-800 text-neutral-500'}
                `}>
                  <TrendingUp size={20} />
                </div>
                <div>
                  <h4 className={`text-sm font-bold ${prefs.enableIntelligence ? 'text-gold-400' : 'text-neutral-300'}`}>
                    Market Intelligence Engine
                  </h4>
                  <p className="text-[10px] text-neutral-500 uppercase tracking-wide">
                    {prefs.enableIntelligence ? 'Premium Enabled' : 'Enable Premium Forecasts'}
                  </p>
                </div>
              </div>
              
              <div className={`
                w-12 h-6 rounded-full p-1 transition-colors duration-300 relative
                ${prefs.enableIntelligence ? 'bg-gold-600' : 'bg-neutral-700'}
              `}>
                <div className={`
                  w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-300
                  ${prefs.enableIntelligence ? 'translate-x-6' : 'translate-x-0'}
                `}></div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <div className="pt-8 border-t border-neutral-800 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-2 block">Work Mode</label>
          <div className="flex bg-neutral-950 p-1 rounded-lg border border-neutral-800 w-fit">
            {WORK_MODES.map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setPrefs(prev => ({ ...prev, workMode: mode as any }))}
                className={`
                  px-5 py-2 rounded-md text-sm font-medium transition-all duration-300
                  ${prefs.workMode === mode 
                    ? 'bg-neutral-800 text-gold-400 shadow-sm' 
                    : 'text-neutral-500 hover:text-neutral-300'}
                `}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-2 block">Type</label>
          <div className="flex flex-wrap gap-2">
            {EMPLOYMENT_TYPES.map((type) => (
               <button
                 key={type}
                 type="button"
                 onClick={() => setPrefs(prev => ({ ...prev, employmentType: type as any }))}
                 className={`
                   px-4 py-2 rounded-full border text-xs font-medium transition-all
                   ${prefs.employmentType === type
                     ? 'bg-gold-500/10 border-gold-500/50 text-gold-500' 
                     : 'bg-transparent border-neutral-800 text-neutral-500 hover:border-neutral-600'}
                 `}
               >
                 {type}
               </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-10 flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className={`
            group relative flex items-center justify-center gap-3 px-10 py-5 bg-gold-600 text-obsidian-900 font-bold text-lg rounded-xl overflow-hidden transition-all
            disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gold-500 shadow-lg hover:shadow-gold-500/20 active:scale-95 w-full md:w-auto
          `}
        >
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
          
          {isLoading ? (
            <span className="flex items-center gap-2 relative z-10">
               <span className="animate-spin text-xl">⟳</span> Initiating Agents...
            </span>
          ) : (
            <span className="flex items-center gap-2 relative z-10">
              {prefs.enableIntelligence ? 'Find Jobs + Forecast' : 'Find Matching Jobs'} 
              <Search size={20} className="group-hover:translate-x-1 transition-transform" />
            </span>
          )}
        </button>
      </div>
    </form>
  );
};

export default PreferenceForm;