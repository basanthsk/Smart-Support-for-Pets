
import React, { useState, useEffect } from 'react';
import { 
  User as UserIcon, 
  CheckCircle2, 
  AlertCircle, 
  Edit3, 
  X, 
  Save, 
  Loader2, 
  AtSign, 
  Phone, 
  Palette,
  Plus,
  Dog,
  Shield,
  Bot,
  Bell,
  FileText,
  Lock,
  LogOut,
  Trash2,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { db, updateUserProfile, logout } from '../services/firebase';
import { doc, getDoc } from "firebase/firestore";
import { PetProfile } from '../types';
import { useNavigate, Link } from "react-router-dom";
import { AppRoutes } from '../types';

const THEME_PRESETS = [
  { name: 'Indigo', color: '#4f46e5' },
  { name: 'Rose', color: '#e11d48' },
  { name: 'Emerald', color: '#10b981' },
  { name: 'Amber', color: '#f59e0b' },
  { name: 'Violet', color: '#7c3aed' },
];

const Settings: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  
  // State for different settings sections
  const [accountData, setAccountData] = useState({ displayName: '', username: '', phoneNumber: '' });
  const [petData, setPetData] = useState<Partial<PetProfile>>({ name: '', species: 'Dog', birthday: '', bio: '' });
  const [appPrefs, setAppPrefs] = useState({ notifications: true });
  const [aiPrefs, setAiPrefs] = useState({ enabled: true });

  // UI State
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  
  // Load all settings from various sources on mount
  useEffect(() => {
    const loadSettings = async () => {
      if (user) {
        // Load user profile from Firestore
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setAccountData({
            displayName: data.displayName || user.displayName || '',
            username: data.username || '',
            phoneNumber: data.phoneNumber || ''
          });
        }

        // Load pet profile from localStorage
        const savedPets = localStorage.getItem(`ssp_pets_${user.uid}`);
        if (savedPets) {
          const pets: PetProfile[] = JSON.parse(savedPets);
          if (pets.length > 0) setPetData(pets[0]);
        }

        // Load app/AI prefs from localStorage
        const savedAppPrefs = localStorage.getItem(`ssp_app_prefs_${user.uid}`);
        if (savedAppPrefs) setAppPrefs(JSON.parse(savedAppPrefs));
        
        const savedAiPrefs = localStorage.getItem(`ssp_ai_prefs_${user.uid}`);
        if (savedAiPrefs) setAiPrefs(JSON.parse(savedAiPrefs));
      }
    };
    loadSettings();
  }, [user]);

  const handleSaveAccount = async () => {
    if (!user) return;
    setIsSaving(true);
    setSaveStatus(null);
    try {
      await updateUserProfile(user.uid, accountData);
      setSaveStatus({ message: 'Account saved! 🎉', type: 'success' });
      addNotification('Profile Updated', 'Your account details are fresh!', 'success');
    } catch (error: any) {
      const msg = error.message?.includes("taken") ? "That username is already taken." : "Update failed.";
      setSaveStatus({ message: msg, type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSavePet = () => {
    if (!user) return;
    setIsSaving(true);
    // In a real app, you'd find the specific pet and update it. Here we assume one pet.
    const savedPets = localStorage.getItem(`ssp_pets_${user.uid}`);
    let pets: PetProfile[] = savedPets ? JSON.parse(savedPets) : [];
    if (pets.length > 0) {
      pets[0] = { ...pets[0], ...petData };
    } else {
      // This case should ideally not happen from settings, but as a fallback:
      pets.push({ id: crypto.randomUUID(), ...petData } as PetProfile);
    }
    localStorage.setItem(`ssp_pets_${user.uid}`, JSON.stringify(pets));
    addNotification('Pet Profile Saved!', `${petData.name}'s info is updated.`, 'success');
    setTimeout(() => setIsSaving(false), 1000);
  };

  const handleToggle = (pref: 'notifications' | 'ai') => {
    if(!user) return;
    if (pref === 'notifications') {
        const newPrefs = { ...appPrefs, notifications: !appPrefs.notifications };
        setAppPrefs(newPrefs);
        localStorage.setItem(`ssp_app_prefs_${user.uid}`, JSON.stringify(newPrefs));
    } else {
        const newPrefs = { ...aiPrefs, enabled: !aiPrefs.enabled };
        setAiPrefs(newPrefs);
        localStorage.setItem(`ssp_ai_prefs_${user.uid}`, JSON.stringify(newPrefs));
    }
  };

  const handleLogout = async () => {
    if(confirm("Are you SURE you want to logout?! 😭")) {
        await logout();
        navigate('/login', { replace: true });
    }
  };

  const inputStyles = "w-full p-4 border-4 border-black rounded-2xl text-lg font-bold bg-slate-50 focus:bg-white transition-all";

  return (
    <div className="max-w-4xl mx-auto pb-32 space-y-12 animate-in fade-in">
      <div className="rotate-[-1deg] sticker-card bg-white p-6 border-4 border-black inline-block">
        <h2 className="text-5xl font-black text-black tracking-tight">⚙️ MY SETTINGS</h2>
        <p className="text-xl font-bold text-purple-600">All my important stuff in one place!</p>
      </div>

      <div className="space-y-10">
        
        {/* 1. Account Settings */}
        <div className="sticker-card bg-white p-10 border-4 border-black space-y-6">
          <h3 className="text-2xl font-black flex items-center gap-3"><UserIcon className="text-blue-500" /> My Super Account</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="font-black uppercase text-sm">Full Name:</label>
              <input value={accountData.displayName} onChange={e => setAccountData({...accountData, displayName: e.target.value})} className={inputStyles} />
            </div>
            <div className="space-y-2">
              <label className="font-black uppercase text-sm">Username:</label>
              <input value={accountData.username} onChange={e => setAccountData({...accountData, username: e.target.value})} className={inputStyles} />
            </div>
          </div>
          <button onClick={handleSaveAccount} disabled={isSaving} className="fun-button bg-blue-500 text-white w-full py-4 text-xl rounded-2xl">
            {isSaving ? <Loader2 className="animate-spin mx-auto"/> : 'Save My Account Info'}
          </button>
          <div className="grid md:grid-cols-3 gap-4 pt-4">
             <button className="fun-button bg-white text-black py-3 rounded-xl text-sm">🔐 Change Password</button>
             <button onClick={handleLogout} className="fun-button bg-white text-orange-500 py-3 rounded-xl text-sm">🚪 Logout</button>
             <button className="fun-button bg-red-100 text-red-500 py-3 rounded-xl text-sm">❌ Delete Account</button>
          </div>
        </div>
        
        {/* 2. Pet Profile Settings */}
        <div className="sticker-card bg-white p-10 border-4 border-black space-y-6">
          <h3 className="text-2xl font-black flex items-center gap-3"><Dog className="text-orange-500" /> My Pet's Deets!</h3>
           <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="font-black uppercase text-sm">Pet's Name:</label>
              <input value={petData.name} onChange={e => setPetData({...petData, name: e.target.value})} className={inputStyles} />
            </div>
             <div className="space-y-2">
              <label className="font-black uppercase text-sm">Species:</label>
              <select value={petData.species} onChange={e => setPetData({...petData, species: e.target.value})} className={inputStyles}>
                <option>Dog 🐕</option><option>Cat 🐈</option><option>Rabbit 🐰</option>
              </select>
            </div>
             <div className="space-y-2">
              <label className="font-black uppercase text-sm">Birthday:</label>
              <input type="date" value={petData.birthday} onChange={e => setPetData({...petData, birthday: e.target.value})} className={inputStyles} />
            </div>
            <div className="space-y-2">
              <label className="font-black uppercase text-sm">Breed:</label>
              <input value={petData.breed} onChange={e => setPetData({...petData, breed: e.target.value})} className={inputStyles} />
            </div>
          </div>
          <div className="space-y-2">
            <label className="font-black uppercase text-sm">Health Notes / Bio:</label>
            <textarea value={petData.bio} onChange={e => setPetData({...petData, bio: e.target.value})} className={`${inputStyles} h-24`}></textarea>
          </div>
          <button onClick={handleSavePet} disabled={isSaving} className="fun-button bg-orange-500 text-white w-full py-4 text-xl rounded-2xl">
            {isSaving ? 'Saving...' : 'Save Pet Deets'}
          </button>
        </div>
        
        {/* 3. AI Preferences */}
        <div className="sticker-card bg-white p-10 border-4 border-black space-y-6">
          <h3 className="text-2xl font-black flex items-center gap-3"><Bot className="text-purple-500" /> Magic AI Brain</h3>
          <div className="flex justify-between items-center bg-slate-50 p-4 border-2 border-black rounded-2xl">
            <span className="font-bold">Enable AI Assistant</span>
            <button onClick={() => handleToggle('ai')} className={`w-16 h-8 rounded-full border-2 border-black flex items-center p-1 transition-colors ${aiPrefs.enabled ? 'bg-green-400' : 'bg-slate-200'}`}>
                <div className={`w-6 h-6 bg-white rounded-full border-2 border-black shadow-md transform transition-transform ${aiPrefs.enabled ? 'translate-x-8' : 'translate-x-0'}`}></div>
            </button>
          </div>
          <button className="fun-button bg-white text-black w-full py-4 text-lg rounded-2xl">🗑️ Clear AI Chat History</button>
          <p className="text-center text-xs font-bold text-slate-400 p-4 bg-slate-50 rounded-lg italic">
            AI provides general guidance only and does not replace professional veterinary advice.
          </p>
        </div>

        {/* 4. App Preferences */}
        <div className="sticker-card bg-white p-10 border-4 border-black space-y-6">
          <h3 className="text-2xl font-black flex items-center gap-3"><Sparkles className="text-yellow-500" /> App Style & Stuff</h3>
          <div className="flex justify-between items-center bg-slate-50 p-4 border-2 border-black rounded-2xl">
            <span className="font-bold">Enable Notifications</span>
            <button onClick={() => handleToggle('notifications')} className={`w-16 h-8 rounded-full border-2 border-black flex items-center p-1 transition-colors ${appPrefs.notifications ? 'bg-green-400' : 'bg-slate-200'}`}>
                <div className={`w-6 h-6 bg-white rounded-full border-2 border-black shadow-md transform transition-transform ${appPrefs.notifications ? 'translate-x-8' : 'translate-x-0'}`}></div>
            </button>
          </div>
          <div className="flex flex-wrap gap-4 justify-center pt-4">
             {THEME_PRESETS.map((theme) => (
              <button key={theme.color} className="flex flex-col items-center gap-2">
                <div style={{ backgroundColor: theme.color }} className="w-12 h-12 rounded-full border-2 border-black"></div>
                <span className="text-xs font-black">{theme.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 5. Legal & Info */}
        <div className="sticker-card bg-white p-10 border-4 border-black space-y-4">
          <h3 className="text-2xl font-black flex items-center gap-3"><FileText className="text-slate-500" /> Boring Legal Info</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link to={AppRoutes.TERMS} className="fun-button bg-white text-black py-4 text-center rounded-xl">Terms & Conditions</Link>
              <Link to={AppRoutes.PRIVACY} className="fun-button bg-white text-black py-4 text-center rounded-xl">Privacy Policy</Link>
              <div className="fun-button bg-slate-100 text-black py-4 text-center rounded-xl col-span-1 md:col-span-2">ℹ️ About SS Paw Pal</div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Settings;
