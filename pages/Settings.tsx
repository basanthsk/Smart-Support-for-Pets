
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
  ToggleRight,
  Syringe,
  Weight,
  Sparkles
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
  
  // Custom Task Notifications
  const [prefVaccines, setPrefVaccines] = useState(() => localStorage.getItem('ssp_pref_vaccines') !== 'false');
  const [prefWeight, setPrefWeight] = useState(() => localStorage.getItem('ssp_pref_weight') !== 'false');
  const [prefDaily, setPrefDaily] = useState(() => localStorage.getItem('ssp_pref_daily') !== 'false');

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
    if(confirm("Are you sure you want to clear history?")) {
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
          <p className="text-slate-500 font-medium text-lg">Manage your personal profile, pet information, and preferences.</p>
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

        {/* Section 2: Custom Notification Preferences */}
        <div className="bg-white rounded-[3.5rem] p-10 md:p-14 border border-slate-100 shadow-sm space-y-10">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-indigo-50 rounded-3xl text-indigo-600">
              <Bell size={28} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">Notification Channels</h3>
              <p className="text-slate-400 text-sm font-medium">Fine-tune your pet care reminders</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button 
              onClick={() => togglePreference('ssp_pref_vaccines', prefVaccines, setPrefVaccines)}
              className={`p-8 rounded-[2.5rem] border transition-all text-center space-y-4 ${prefVaccines ? 'bg-white border-indigo-600 shadow-xl' : 'bg-slate-50 border-slate-100'}`}
            >
              <div className={`p-4 rounded-2xl mx-auto w-fit ${prefVaccines ? 'bg-indigo-600 text-white' : 'bg-white text-slate-400'}`}>
                <Syringe size={24} />
              </div>
              <p className="font-black text-slate-800 text-sm uppercase tracking-widest">Vaccinations</p>
              <p className="text-xs text-slate-400 font-medium leading-relaxed">Alerts for upcoming booster shots</p>
            </button>

            <button 
              onClick={() => togglePreference('ssp_pref_weight', prefWeight, setPrefWeight)}
              className={`p-8 rounded-[2.5rem] border transition-all text-center space-y-4 ${prefWeight ? 'bg-white border-indigo-600 shadow-xl' : 'bg-slate-50 border-slate-100'}`}
            >
              <div className={`p-4 rounded-2xl mx-auto w-fit ${prefWeight ? 'bg-indigo-600 text-white' : 'bg-white text-slate-400'}`}>
                <Weight size={24} />
              </div>
              <p className="font-black text-slate-800 text-sm uppercase tracking-widest">Weight Checks</p>
              <p className="text-xs text-slate-400 font-medium leading-relaxed">Monthly growth tracking reminders</p>
            </button>

            <button 
              onClick={() => togglePreference('ssp_pref_daily', prefDaily, setPrefDaily)}
              className={`p-8 rounded-[2.5rem] border transition-all text-center space-y-4 ${prefDaily ? 'bg-white border-indigo-600 shadow-xl' : 'bg-slate-50 border-slate-100'}`}
            >
              <div className={`p-4 rounded-2xl mx-auto w-fit ${prefDaily ? 'bg-indigo-600 text-white' : 'bg-white text-slate-400'}`}>
                <Sparkles size={24} />
              </div>
              <p className="font-black text-slate-800 text-sm uppercase tracking-widest">Daily Routine</p>
              <p className="text-xs text-slate-400 font-medium leading-relaxed">Mornings and evening task alerts</p>
            </button>
          </div>
        </div>

        {/* Other Sections (Pet Profile, AI, Theme) - Keep as per existing but integrated */}
        {pet && (
          <div className="bg-white rounded-[3.5rem] p-10 md:p-14 border border-slate-100 shadow-sm space-y-10 opacity-70">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-rose-50 rounded-3xl text-rose-600">
                <Dog size={28} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">Pet Information</h3>
                <p className="text-slate-400 text-sm font-medium">Update companion details</p>
              </div>
            </div>
             <p className="text-slate-400 text-sm font-bold italic">Detailed updates available on the Pet Profile page.</p>
          </div>
        )}

        {/* Global UI Preferences */}
        <div className="bg-white rounded-[3.5rem] p-10 md:p-14 border border-slate-100 shadow-sm space-y-10">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-indigo-50 rounded-3xl text-indigo-600">
              <Shield size={28} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">Global Preferences</h3>
              <p className="text-slate-400 text-sm font-medium">System-wide display and AI settings</p>
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
                  <p className="font-black text-slate-800 text-sm">Visual Theme</p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest">{darkMode ? 'Dark' : 'Light'}</p>
                </div>
              </div>
              <div className={`w-12 h-6 rounded-full p-1 transition-colors ${darkMode ? 'bg-indigo-600' : 'bg-slate-300'}`}>
                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-0'}`} />
              </div>
            </button>

            <button 
              onClick={() => togglePreference('ssp_ai_enabled', aiEnabled, setAiEnabled)}
              className="flex items-center justify-between p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 group transition-all hover:bg-white hover:shadow-xl"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white rounded-2xl shadow-sm text-slate-400"><Bot size={24} /></div>
                <div className="text-left">
                  <p className="font-black text-slate-800 text-sm">Enhanced AI</p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest">{aiEnabled ? 'Active' : 'Disabled'}</p>
                </div>
              </div>
              <div className={`w-12 h-6 rounded-full p-1 transition-colors ${aiEnabled ? 'bg-indigo-600' : 'bg-slate-300'}`}>
                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${aiEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
