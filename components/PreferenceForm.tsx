
import React, { useState, useRef, useEffect } from 'react';
import { UserPreferences } from '../types';
import { Search, MapPin, Briefcase, ChevronDown, Check, Building2, Wallet, Upload, FileText, X, TrendingUp, Navigation } from 'lucide-react';

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
    enableIntelligence: false,
    enableResumeTailoring: false
  });

  const [isExpDropdownOpen, setIsExpDropdownOpen] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
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

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    
    // Increased timeout to 10s and disabled high accuracy for better reliability on mobile
    const options = {
      enableHighAccuracy: false, 
      timeout: 10000, 
      maximumAge: 0 
    };

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // Simple reverse geocoding using a public API (no key needed for basic usage)
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
          const data = await response.json();
          const city = data.address.city || data.address.town || data.address.village || data.address.suburb;
          const country = data.address.country;
          
          if (city) {
            setPrefs(prev => ({ ...prev, location: `${city}, ${country}` }));
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
        setIsLocating(false);
        // Safe logging for error object
        const errorMessage = error.message || 'Unknown error';
        console.error("Error getting location:", errorMessage);
        
        if (error.code === error.TIMEOUT) {
          alert("Location request timed out. Please enter your location manually.");
        } else if (error.code === error.PERMISSION_DENIED) {
          alert("Location permission denied. Please enable it in your browser settings or enter manually.");
        } else {
          alert("Unable to retrieve location. Please enter it manually.");
        }
      },
      options
    );
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
        alert("Please upload a PDF or Text file.");
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
          },
          enableResumeTailoring: true // Automatically enable tailoring when file exists
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFile = () => {
    setPrefs(prev => ({ 
      ...prev, 
      resume: undefined,
      enableResumeTailoring: false // Disable tailoring when file is removed
    }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-5xl mx-auto bg-white border border-gray-100 p-6 md:p-10 rounded-2xl shadow-xl animate-slide-up relative overflow-hidden">
      
      <style>{`
        .thumb-input::-webkit-slider-thumb {
          pointer-events: auto;
          width: 28px;
          height: 28px;
          border-radius: 50%; 
          -webkit-appearance: none;
          cursor: pointer; 
          background: #001F3F;
          border: 3px solid white;
          box-shadow: 0 4px 10px rgba(0,0,0,0.15);
        }

        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        input:-webkit-autofill:active {
          -webkit-text-fill-color: #001F3F !important;
          box-shadow: 0 0 0px 1000px #F9FAFB inset !important;
          -webkit-box-shadow: 0 0 0px 1000px #F9FAFB inset !important;
          transition: background-color 5000s ease-in-out 0s;
        }

        /* Prevent zooming on focus in iOS */
        @media screen and (max-width: 768px) {
          input, select, textarea {
            font-size: 16px !important;
          }
        }
      `}</style>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 mb-10">
        
        {/* Left Column */}
        <div className="space-y-8">
          <div className="space-y-3">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Briefcase size={14} className="text-teal-600" /> Desired Role
            </label>
            <input
              type="text"
              name="jobTitle"
              value={prefs.jobTitle}
              onChange={handleChange}
              placeholder="e.g. Senior Product Designer"
              className="w-full bg-gray-50 border border-gray-200 text-lg text-navy-900 font-medium px-4 py-4 rounded-xl focus:outline-none focus:border-navy-500 focus:bg-white focus:ring-4 focus:ring-navy-50 transition-all placeholder:text-gray-400"
              required
            />
          </div>

           <div className="space-y-3 relative">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <MapPin size={14} className="text-teal-600" /> Location
            </label>
            <div className="relative group">
              <input
                type="text"
                name="location"
                value={prefs.location}
                onChange={handleChange}
                placeholder="e.g. New York, London"
                className="w-full bg-gray-50 border border-gray-200 text-lg text-navy-900 font-medium pl-4 pr-12 py-4 rounded-xl focus:outline-none focus:border-navy-500 focus:bg-white focus:ring-4 focus:ring-navy-50 transition-all placeholder:text-gray-400"
                required
              />
              <button
                type="button"
                onClick={handleLocateMe}
                disabled={isLocating}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-navy-400 hover:text-teal-600 transition-colors disabled:opacity-50"
                title="Use Current Location"
              >
                <Navigation size={20} className={isLocating ? "animate-pulse" : ""} />
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
               <Building2 size={14} className="text-teal-600" /> Key Skills / Keywords
            </label>
            <input
              type="text"
              name="keySkills"
              value={prefs.keySkills}
              onChange={handleChange}
              placeholder="e.g. React, Python, Leadership, AI"
              className="w-full bg-gray-50 border border-gray-200 text-base text-navy-900 px-4 py-3 rounded-xl focus:outline-none focus:border-navy-500 focus:bg-white focus:ring-4 focus:ring-navy-50 transition-all placeholder:text-gray-400"
            />
          </div>

          <div className="space-y-3">
             <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
               <Upload size={14} className="text-teal-600" /> Resume / CV (Optional)
            </label>
            <div 
              className={`
                relative w-full border border-dashed rounded-xl p-4 transition-all group
                ${prefs.resume 
                  ? 'bg-teal-50 border-teal-200' 
                  : 'bg-gray-50 border-gray-300 hover:border-navy-400 hover:bg-white'}
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
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-teal-600 shadow-sm border border-teal-100">
                      <FileText size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-navy-900 truncate max-w-[150px]">{prefs.resume.fileName}</p>
                      <p className="text-[10px] text-teal-600 uppercase tracking-wider font-bold">Ready to analyze</p>
                    </div>
                  </div>
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation(); 
                      removeFile();
                    }}
                    className="p-2 hover:bg-white rounded-full text-gray-400 hover:text-red-500 z-20 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-2 text-center">
                  <span className="text-navy-600 group-hover:text-navy-800 transition-colors text-sm font-semibold">Click to upload PDF</span>
                  <span className="text-slate-400 text-[10px] mt-1">Enables AI resume tailoring</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          
          <div className="space-y-3 relative" ref={dropdownRef}>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Experience Level</label>
            <div 
              onClick={() => setIsExpDropdownOpen(!isExpDropdownOpen)}
              className={`
                w-full bg-gray-50 border text-lg px-4 py-4 rounded-xl cursor-pointer flex items-center justify-between transition-all
                ${isExpDropdownOpen ? 'border-navy-500 ring-4 ring-navy-50 bg-white' : 'border-gray-200 hover:border-gray-300'}
              `}
            >
              <span className="text-navy-900 font-medium">{prefs.experienceLevel} Level</span>
              <ChevronDown size={20} className={`text-gray-400 transition-transform ${isExpDropdownOpen ? 'rotate-180' : ''}`} />
            </div>

            <div className={`
              absolute z-20 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-2xl overflow-hidden origin-top transition-all duration-200
              ${isExpDropdownOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}
            `}>
              {EXPERIENCE_LEVELS.map((level) => (
                <div
                  key={level}
                  onClick={() => {
                    setPrefs(prev => ({ ...prev, experienceLevel: level as any }));
                    setIsExpDropdownOpen(false);
                  }}
                  className="px-4 py-4 hover:bg-gray-50 cursor-pointer flex items-center justify-between group transition-colors"
                >
                  <span className={`${prefs.experienceLevel === level ? 'text-navy-900 font-bold text-lg' : 'text-slate-600 text-lg group-hover:text-navy-700'}`}>
                    {level}
                  </span>
                  {prefs.experienceLevel === level && <Check size={20} className="text-teal-500" />}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6 pt-2">
            <div className="flex justify-between items-end">
               <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                 <Wallet size={14} className="text-teal-600" /> Salary Range
               </label>
               <span className="text-navy-900 font-display text-2xl font-bold tracking-tight">
                 ${prefs.salaryMin}k — ${prefs.salaryMax}k+
               </span>
            </div>
            
            <div className="relative h-8 w-full mt-2 flex items-center">
              <div className="absolute top-1/2 left-0 w-full h-2 bg-gray-200 rounded-full -translate-y-1/2"></div>
              
              <div 
                className="absolute top-1/2 h-2 bg-navy-600 rounded-full -translate-y-1/2"
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
            </div>
            <div className="flex justify-between text-[10px] text-gray-400 font-mono uppercase mt-1">
              <span>$0k</span>
              <span>$300k+</span>
            </div>
          </div>
          
           <div className="pt-2">
             <div 
              onClick={() => setPrefs(prev => ({...prev, enableIntelligence: !prev.enableIntelligence}))}
              className={`
                group cursor-pointer border rounded-xl p-4 flex flex-col justify-between transition-all duration-300 relative overflow-hidden active:scale-95
                ${prefs.enableIntelligence 
                  ? 'bg-navy-900 border-navy-900 shadow-lg ring-1 ring-teal-400/30' 
                  : 'bg-white border-gray-200 hover:border-gray-300'}
              `}
            >
              <div className="flex justify-between items-start mb-3">
                <div className={`
                    w-8 h-8 rounded-lg flex items-center justify-center transition-colors
                    ${prefs.enableIntelligence ? 'bg-teal-500 text-white' : 'bg-gray-100 text-gray-400'}
                  `}>
                    <TrendingUp size={16} />
                  </div>
                  <div className={`
                    w-8 h-4 rounded-full p-0.5 transition-colors duration-300 relative
                    ${prefs.enableIntelligence ? 'bg-teal-500' : 'bg-gray-200'}
                  `}>
                    <div className={`
                      w-3 h-3 rounded-full bg-white shadow-sm transition-transform duration-300
                      ${prefs.enableIntelligence ? 'translate-x-4' : 'translate-x-0'}
                    `}></div>
                  </div>
              </div>
              <div>
                <h4 className={`text-xs font-bold ${prefs.enableIntelligence ? 'text-white' : 'text-navy-900'}`}>
                  Market Intelligence
                </h4>
                <p className={`text-[10px] mt-1 ${prefs.enableIntelligence ? 'text-navy-200' : 'text-slate-400'}`}>
                   Activates Economist, Futurist & Strategist agents.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-8 border-t border-gray-100 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 block">Work Mode</label>
          <div className="flex bg-gray-100 p-1.5 rounded-xl w-full md:w-fit">
            {WORK_MODES.map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setPrefs(prev => ({ ...prev, workMode: mode as any }))}
                className={`
                  flex-1 md:flex-none px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-300 active:scale-95
                  ${prefs.workMode === mode 
                    ? 'bg-white text-navy-900 shadow-md' 
                    : 'text-gray-500 hover:text-gray-700'}
                `}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 block">Employment Type</label>
          <div className="flex flex-wrap gap-2">
            {EMPLOYMENT_TYPES.map((type) => (
               <button
                 key={type}
                 type="button"
                 onClick={() => setPrefs(prev => ({ ...prev, employmentType: type as any }))}
                 className={`
                   px-5 py-2.5 rounded-full border text-xs font-bold transition-all active:scale-95
                   ${prefs.employmentType === type
                     ? 'bg-navy-50 border-navy-200 text-navy-800' 
                     : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'}
                 `}
               >
                 {type}
               </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-12 flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className={`
            group relative flex items-center justify-center gap-3 px-12 py-5 bg-navy-900 text-white font-bold text-lg rounded-xl overflow-hidden transition-all
            disabled:opacity-50 disabled:cursor-not-allowed hover:bg-navy-800 shadow-xl shadow-navy-900/20 active:scale-95 w-full md:w-auto
          `}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1s_infinite]"></div>
          
          {isLoading ? (
            <span className="flex items-center gap-2 relative z-10">
               <span className="animate-spin text-xl">⟳</span> Initiating Agents...
            </span>
          ) : (
            <span className="flex items-center gap-2 relative z-10 uppercase tracking-wider">
              Find My Role <Search size={20} className="group-hover:translate-x-1 transition-transform" />
            </span>
          )}
        </button>
      </div>
    </form>
  );
};

export default PreferenceForm;
