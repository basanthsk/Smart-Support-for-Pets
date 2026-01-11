
import React, { useState, useEffect } from 'react';
import { 
  User, 
  Dog, 
  Bot, 
  Bell, 
  LogOut, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  Trash2, 
  Moon, 
  Sun, 
  Shield, 
  FileText, 
  Mail,
  Info,
  History,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { logout } from '../services/firebase';
/* Fix: Standardized named imports from react-router-dom */
import { useNavigate, Link } from "react-router-dom";
import { BREED_DATA } from '../App';
import { AppRoutes } from '../types';

const Settings: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [pet, setPet] = useState<any>(null);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  
  // App Preferences State
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('ssp_dark_mode') === 'true');
  const [notifications, setNotifications] = useState(() => localStorage.getItem('ssp_notifications') !== 'false');
  const [aiEnabled, setAiEnabled] = useState(() => localStorage.getItem('ssp_ai_enabled') !== 'false');
  
  // UI States
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(`pet_${user?.uid}`);
    if (saved) setPet(JSON.parse(saved));
  }, [user]);

  const handlePetUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (pet) {
      const years = Math.max(0, parseInt(pet.ageYears) || 0);
      const months = Math.max(0, Math.min(11, parseInt(pet.ageMonths) || 0));
      
      if (years === 0 && months === 0) {
        setSaveStatus('Error: Pet age cannot be 0.');
        setTimeout(() => setSaveStatus(null), 3000);
        return;
      }

      const validatedPet = { ...pet, ageYears: years.toString(), ageMonths: months.toString() };
      localStorage.setItem(`pet_${user?.uid}`, JSON.stringify(validatedPet));
      setPet(validatedPet);
      setSaveStatus('Settings updated successfully!');
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  const togglePreference = (key: string, current: boolean, setter: (v: boolean) => void) => {
    const newVal = !current;
    setter(newVal);
    localStorage.setItem(key, String(newVal));
  };

  const clearAiHistory = () => {
    if(confirm("Are you sure you want to clear your AI health analysis history? This action cannot be undone.")) {
      // In a real app, this would clear DB history. Here we just mock the feedback.
      setSaveStatus('AI History cleared.');
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-32 space-y-12 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-xs font-black uppercase tracking-widest mb-2">
            Control Panel
          </div>
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter">Application Settings</h2>
          <p className="text-slate-500 font-medium text-lg">Manage your personal profile, pet information, and AI preferences.</p>
        </div>
        {saveStatus && (
          <div className={`font-bold px-6 py-3 rounded-2xl flex items-center gap-2 border shadow-sm animate-in slide-in-from-top-2 ${saveStatus.includes('Error') ? 'bg-rose-50 border-rose-100 text-rose-600' : 'bg-emerald-50 border-emerald-100 text-emerald-600'}`}>
            {saveStatus.includes('Error') ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
            {saveStatus}
          </div>
        )}
      </div>

      <div className="space-y-8">
        {/* Section 1: Account Settings */}
        <div className="bg-white rounded-[3.5rem] p-10 md:p-14 border border-slate-100 shadow-sm space-y-10">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-indigo-50 rounded-3xl text-indigo-600">
              <User size={28} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">Account Settings</h3>
              <p className="text-slate-400 text-sm font-medium">Identity and security preferences</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Email Address</p>
              <p className="font-bold text-slate-800 text-lg break-all">{user?.email}</p>
            </div>
            
            <div className="flex flex-col gap-4">
              <button 
                onClick={() => { logout(); navigate('/login'); }} 
                className="w-full text-indigo-600 font-black flex items-center justify-center gap-2 px-8 py-5 bg-indigo-50 rounded-[2rem] hover:bg-indigo-100 transition-all border border-indigo-100"
              >
                <LogOut size={20} /> Sign Out Session
              </button>
              <button 
                onClick={() => setShowDeleteModal(true)}
                className="w-full text-rose-600 font-black flex items-center justify-center gap-2 px-8 py-5 bg-rose-50 rounded-[2rem] hover:bg-rose-100 transition-all border border-rose-100"
              >
                <Trash2 size={20} /> Delete Account
              </button>
            </div>
          </div>
        </div>

        {/* Section 2: Pet Profile Settings */}
        {pet && (
          <div className="bg-white rounded-[3.5rem] p-10 md:p-14 border border-slate-100 shadow-sm space-y-10">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-rose-50 rounded-3xl text-rose-600">
                <Dog size={28} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">Pet Information</h3>
                <p className="text-slate-400 text-sm font-medium">Keep your companion's data up to date</p>
              </div>
            </div>

            <form onSubmit={handlePetUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Pet Name</label>
                <input 
                  value={pet.name} 
                  onChange={e => setPet({...pet, name: e.target.value})} 
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-5 font-bold outline-none focus:ring-8 focus:ring-indigo-50 focus:bg-white transition-all" 
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Species</label>
                <select 
                  value={pet.species} 
                  onChange={e => setPet({...pet, species: e.target.value, breed: BREED_DATA[e.target.value]?.[0] || 'Mixed Breed'})}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-5 font-bold outline-none focus:ring-8 focus:ring-indigo-50 focus:bg-white transition-all"
                >
                  {Object.keys(BREED_DATA).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Age (Years)</label>
                <input 
                  type="number" min="0" 
                  value={pet.ageYears} 
                  onChange={e => setPet({...pet, ageYears: e.target.value})} 
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-5 font-bold outline-none focus:ring-8 focus:ring-indigo-50 transition-all" 
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Age (Months)</label>
                <input 
                  type="number" min="0" max="11" 
                  value={pet.ageMonths} 
                  onChange={e => setPet({...pet, ageMonths: e.target.value})} 
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-5 font-bold outline-none focus:ring-8 focus:ring-indigo-50 transition-all" 
                />
              </div>
              <div className="md:col-span-2 space-y-1">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Health & Dietary Notes</label>
                <textarea 
                  value={pet.healthNotes || ''} 
                  onChange={e => setPet({...pet, healthNotes: e.target.value})}
                  placeholder="Ex: Luna is allergic to chicken. Needs grain-free kibble."
                  className="w-full bg-slate-50 border border-slate-100 rounded-3xl py-4 px-5 font-medium min-h-[120px] outline-none focus:ring-8 focus:ring-indigo-50 transition-all"
                />
              </div>
              <div className="md:col-span-2 pt-4">
                <button type="submit" className="w-full bg-indigo-600 text-white px-10 py-5 rounded-[2.5rem] font-black text-xl flex items-center justify-center gap-3 hover:bg-indigo-700 shadow-2xl shadow-indigo-100 active:scale-95 transition-all">
                  <Save size={24} /> Update Pet Profile
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Section 3: AI Preferences */}
        <div className="bg-white rounded-[3.5rem] p-10 md:p-14 border border-slate-100 shadow-sm space-y-10">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-amber-50 rounded-3xl text-amber-600">
              <Bot size={28} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">AI & Intelligence</h3>
              <p className="text-slate-400 text-sm font-medium">Customize your automated pet support experience</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
              <div className="flex items-center gap-6">
                <div className="p-3 bg-white rounded-2xl shadow-sm text-slate-400"><Bot size={24} /></div>
                <div>
                  <p className="font-black text-slate-800">Enable AI Assistant</p>
                  <p className="text-xs text-slate-500 font-medium">Activate real-time triage and dietary advice</p>
                </div>
              </div>
              <button 
                onClick={() => togglePreference('ssp_ai_enabled', aiEnabled, setAiEnabled)}
                className={`transition-all ${aiEnabled ? 'text-indigo-600' : 'text-slate-300'}`}
              >
                {aiEnabled ? <ToggleRight size={48} /> : <ToggleLeft size={48} />}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button 
                onClick={clearAiHistory}
                className="flex items-center gap-4 p-8 bg-white border border-slate-100 rounded-[2.5rem] hover:bg-slate-50 transition-all group"
              >
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:rotate-12 transition-transform"><History size={24} /></div>
                <div className="text-left">
                  <p className="font-black text-slate-800">Clear Chat History</p>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Permanent Action</p>
                </div>
              </button>
              
              <div className="p-8 bg-amber-50 rounded-[2.5rem] border border-amber-100 flex items-start gap-4">
                <AlertCircle className="text-amber-600 shrink-0" size={24} />
                <div className="space-y-2">
                  <p className="font-black text-amber-900 text-sm">AI Usage Disclaimer</p>
                  <p className="text-[10px] leading-relaxed text-amber-800/70 font-bold italic">
                    AI provides general guidance and does not replace professional veterinary advice. Always confirm results with a licensed practitioner.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: App Preferences */}
        <div className="bg-white rounded-[3.5rem] p-10 md:p-14 border border-slate-100 shadow-sm space-y-10">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-indigo-50 rounded-3xl text-indigo-600">
              <Shield size={28} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">App Preferences</h3>
              <p className="text-slate-400 text-sm font-medium">UI and notification settings</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button 
              onClick={() => togglePreference('ssp_dark_mode', darkMode, setDarkMode)}
              className="flex items-center justify-between p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 group transition-all hover:bg-white hover:shadow-xl"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white rounded-2xl shadow-sm text-slate-400">{darkMode ? <Moon size={24} /> : <Sun size={24} />}</div>
                <div className="text-left">
                  <p className="font-black text-slate-800">Visual Theme</p>
                  <p className="text-xs text-slate-500 font-medium">{darkMode ? 'Dark Mode' : 'Light Mode'}</p>
                </div>
              </div>
              <div className={`w-12 h-6 rounded-full p-1 transition-colors ${darkMode ? 'bg-indigo-600' : 'bg-slate-300'}`}>
                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-0'}`} />
              </div>
            </button>

            <button 
              onClick={() => togglePreference('ssp_notifications', notifications, setNotifications)}
              className="flex items-center justify-between p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 group transition-all hover:bg-white hover:shadow-xl"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white rounded-2xl shadow-sm text-slate-400"><Bell size={24} /></div>
                <div className="text-left">
                  <p className="font-black text-slate-800">Push Notifications</p>
                  <p className="text-xs text-slate-500 font-medium">{notifications ? 'Enabled' : 'Disabled'}</p>
                </div>
              </div>
              <div className={`w-12 h-6 rounded-full p-1 transition-colors ${notifications ? 'bg-indigo-600' : 'bg-slate-300'}`}>
                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${notifications ? 'translate-x-6' : 'translate-x-0'}`} />
              </div>
            </button>
          </div>
        </div>

        {/* Section 5: Legal & Support */}
        <div className="bg-white rounded-[3.5rem] p-10 md:p-14 border border-slate-100 shadow-sm space-y-10">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-slate-50 rounded-3xl text-slate-600">
              <Info size={28} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">Legal & Support</h3>
              <p className="text-slate-400 text-sm font-medium">Resources and legal information</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link to={AppRoutes.TERMS} className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 hover:bg-white hover:shadow-xl transition-all group flex flex-col items-center gap-4 text-center">
              <FileText className="text-indigo-600 group-hover:scale-110 transition-transform" size={32} />
              <span className="font-black text-sm text-slate-800">Terms of Service</span>
            </Link>
            <a href="#" className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 hover:bg-white hover:shadow-xl transition-all group flex flex-col items-center gap-4 text-center">
              <Shield className="text-indigo-600 group-hover:scale-110 transition-transform" size={32} />
              <span className="font-black text-sm text-slate-800">Privacy Policy</span>
            </a>
            <a href="mailto:support@smartpetcare.ai" className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 hover:bg-white hover:shadow-xl transition-all group flex flex-col items-center gap-4 text-center">
              <Mail className="text-indigo-600 group-hover:scale-110 transition-transform" size={32} />
              <span className="font-black text-sm text-slate-800">Contact Support</span>
            </a>
          </div>
          
          <div className="pt-10 border-t border-slate-50 text-center">
             <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] mb-2">Build v1.4.2</p>
             <p className="text-xs text-slate-400 font-bold">Smart Support for Pets © 2025 • All Rights Reserved</p>
          </div>
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[3.5rem] p-12 max-w-lg w-full shadow-2xl space-y-8 animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-rose-50 rounded-[2rem] flex items-center justify-center text-rose-600 mx-auto">
              <Trash2 size={40} />
            </div>
            <div className="text-center space-y-3">
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">Are you sure?</h3>
              <p className="text-slate-500 font-medium leading-relaxed">
                Deleting your account will permanently remove your pet's data, medical history, and AI profiles. This action cannot be undone.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <button 
                onClick={() => {
                  localStorage.clear();
                  logout();
                  navigate('/login');
                }}
                className="w-full bg-rose-600 text-white py-5 rounded-[2rem] font-black text-lg hover:bg-rose-700 transition-all shadow-xl shadow-rose-100"
              >
                Yes, Delete Everything
              </button>
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="w-full bg-slate-100 text-slate-600 py-5 rounded-[2rem] font-black text-lg hover:bg-slate-200 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
