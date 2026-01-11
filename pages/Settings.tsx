import React, { useState, useEffect } from 'react';
import { User, Dog, Bot, Bell, LogOut, Save, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { logout } from '../services/firebase';
import { useNavigate } from 'react-router-dom';
import { BREED_DATA } from '../App';

const Settings: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [pet, setPet] = useState<any>(null);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(`pet_${user?.uid}`);
    if (saved) setPet(JSON.parse(saved));
  }, [user]);

  const handlePetUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (pet) {
      // Final sanitation before save to ensure no impossible values crept in
      const years = Math.max(0, parseInt(pet.ageYears) || 0);
      const months = Math.max(0, Math.min(11, parseInt(pet.ageMonths) || 0));
      
      const validatedPet = { ...pet, ageYears: years.toString(), ageMonths: months.toString() };
      localStorage.setItem(`pet_${user?.uid}`, JSON.stringify(validatedPet));
      setPet(validatedPet);
      setSaveStatus('Profile updated!');
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 space-y-10 animate-fade-in">
      <div className="flex justify-between items-end">
        <div><h2 className="text-4xl font-black text-slate-900 tracking-tight">Settings</h2><p className="text-slate-500 font-medium">Manage preferences.</p></div>
        {saveStatus && <div className="text-emerald-600 font-bold bg-emerald-50 px-4 py-2 rounded-full flex items-center gap-2"><CheckCircle2 size={18} />{saveStatus}</div>}
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm space-y-8">
          <div className="flex items-center gap-3"><div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600"><User size={24} /></div><h3 className="text-xl font-black text-slate-800">Account</h3></div>
          <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100">
            <p className="font-bold text-slate-800">{user?.email}</p>
            <button onClick={() => { logout(); navigate('/login'); }} className="text-rose-600 font-bold flex items-center gap-2 px-6 py-2 bg-white rounded-xl shadow-sm hover:bg-rose-50 transition-colors"><LogOut size={18} /> Logout</button>
          </div>
        </div>

        {pet && (
          <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm space-y-8">
            <div className="flex items-center gap-3"><div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600"><Dog size={24} /></div><h3 className="text-xl font-black text-slate-800">Pet Profile</h3></div>
            <form onSubmit={handlePetUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Name</label>
                <input value={pet.name} onChange={e => setPet({...pet, name: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-5 font-bold outline-none focus:ring-4 focus:ring-indigo-100" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Age (Years)</label>
                <input 
                  type="number" 
                  min="0" 
                  value={pet.ageYears} 
                  onChange={e => {
                    const val = Math.max(0, parseInt(e.target.value) || 0);
                    setPet({...pet, ageYears: val.toString()})
                  }} 
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-5 font-bold outline-none focus:ring-4 focus:ring-indigo-100" 
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Age (Months 0-11)</label>
                <input 
                  type="number" 
                  min="0" 
                  max="11" 
                  value={pet.ageMonths} 
                  onChange={e => {
                    const val = Math.max(0, Math.min(11, parseInt(e.target.value) || 0));
                    setPet({...pet, ageMonths: val.toString()})
                  }} 
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-5 font-bold outline-none focus:ring-4 focus:ring-indigo-100" 
                />
              </div>
              <div className="md:col-span-2">
                <button type="submit" className="bg-indigo-600 text-white px-8 py-4 rounded-[2rem] font-bold flex items-center gap-2 hover:bg-indigo-700 shadow-xl active:scale-95 transition-all">
                  <Save size={20} /> Save Changes
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;