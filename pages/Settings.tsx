
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
  Mail
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { logout, db, updateUserProfile } from '../services/firebase';
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";

const THEME_PRESETS = [
  { name: 'Indigo', color: '#4f46e5' },
  { name: 'Rose', color: '#e11d48' },
  { name: 'Emerald', color: '#10b981' },
  { name: 'Amber', color: '#f59e0b' },
  { name: 'Violet', color: '#7c3aed' },
  { name: 'Sky', color: '#0ea5e9' },
  { name: 'Midnight', color: '#0f172a' },
];

const Settings: React.FC = () => {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();
  
  const [dbUser, setDbUser] = useState<any>(null);
  const [saveStatus, setSaveStatus] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(() => localStorage.getItem('ssp_theme_color') || '#4f46e5');
  
  // Form State
  const [editData, setEditData] = useState({
    displayName: '',
    username: '',
    phoneNumber: ''
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setDbUser(data);
            setEditData({
              displayName: data.displayName || user.displayName || '',
              username: data.username || '',
              phoneNumber: data.phoneNumber || ''
            });
          }
        } catch (e) {
          console.error("Error fetching user settings:", e);
        }
      }
    };
    fetchUserData();
  }, [user]);

  const changeTheme = (color: string) => {
    setCurrentTheme(color);
    localStorage.setItem('ssp_theme_color', color);
    addNotification('Theme Updated', 'Your visual preferences have been applied.', 'success');
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    
    setIsSaving(true);
    setSaveStatus(null);
    
    try {
      await updateUserProfile(user.uid, {
        displayName: editData.displayName,
        username: editData.username,
        phoneNumber: editData.phoneNumber
      });
      
      setDbUser((prev: any) => ({ 
        ...prev, 
        displayName: editData.displayName,
        username: editData.username.toLowerCase(),
        phoneNumber: editData.phoneNumber
      }));
      
      setSaveStatus({ message: 'Profile updated successfully!', type: 'success' });
      setIsEditing(false);
      addNotification('Profile Updated', 'Your identity and contact info have been saved.', 'success');
    } catch (error: any) {
      console.error("Profile update failed:", error);
      setSaveStatus({ message: error.message || 'Failed to update profile. Please try again.', type: 'error' });
    } finally {
      setIsSaving(false);
      // Success message stays a bit longer, errors stay until manual close or timeout
      if (!saveStatus || saveStatus.type === 'success') {
        setTimeout(() => setSaveStatus(null), 3000);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-32 space-y-12 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex px-4 py-1.5 bg-theme-light text-theme rounded-full text-xs font-black uppercase tracking-widest mb-2 transition-theme">Account Hub</div>
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter">Profile Settings</h2>
        </div>
        
        {saveStatus && (
          <div className={`flex items-center gap-3 px-6 py-4 rounded-2xl border animate-in slide-in-from-top-4 shadow-lg ${saveStatus.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-rose-50 border-rose-100 text-rose-700'}`}>
            {saveStatus.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span className="font-bold text-sm">{saveStatus.message}</span>
            <button onClick={() => setSaveStatus(null)} className="ml-2 opacity-50 hover:opacity-100"><X size={14} /></button>
          </div>
        )}
      </div>

      <div className="space-y-10">
        {/* Main Form Container - Centered focus as per user request */}
        <div className="bg-white rounded-[3.5rem] p-8 md:p-16 border border-slate-100 shadow-xl space-y-12 relative overflow-hidden transition-all duration-500">
          <div className="flex flex-col md:flex-row items-center justify-center md:items-start gap-12 md:gap-20">
            {/* Avatar Section */}
            <div className="flex flex-col items-center gap-6">
              <div className="w-40 h-40 rounded-[3.5rem] bg-theme-light border-4 border-white shadow-2xl flex items-center justify-center overflow-hidden shrink-0 relative transition-theme group hover:scale-[1.02] duration-500">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="Me" className="w-full h-full object-cover" />
                ) : (
                  <UserIcon size={72} className="text-theme opacity-20" />
                )}
                {isEditing && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Edit3 size={24} className="text-white" />
                  </div>
                )}
              </div>
              {!isEditing && (
                 <button 
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-slate-50 text-slate-500 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-theme-light hover:text-theme transition-all active:scale-95 shadow-sm"
                >
                  <Edit3 size={14} /> Edit Identity
                </button>
              )}
            </div>
            
            {/* Fields Section */}
            <div className="flex-1 w-full max-w-md space-y-8">
              {isEditing ? (
                <div className="space-y-6 animate-in fade-in duration-500">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                    <input 
                      value={editData.displayName}
                      onChange={(e) => setEditData({...editData, displayName: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl font-bold text-slate-800 outline-none ring-theme focus:ring-4 transition-all"
                      placeholder="Your name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Unique Handle</label>
                    <div className="relative">
                      <AtSign size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input 
                        value={editData.username}
                        onChange={(e) => setEditData({...editData, username: e.target.value.toLowerCase().replace(/\s/g, '')})}
                        className="w-full bg-slate-50 border border-slate-100 p-4 pl-12 rounded-2xl font-bold text-slate-800 outline-none ring-theme focus:ring-4 transition-all"
                        placeholder="username"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number (Public context)</label>
                    <div className="relative">
                      <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input 
                        type="tel"
                        value={editData.phoneNumber}
                        onChange={(e) => setEditData({...editData, phoneNumber: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-100 p-4 pl-12 rounded-2xl font-bold text-slate-800 outline-none ring-theme focus:ring-4 transition-all"
                        placeholder="+1 234 567 890"
                      />
                    </div>
                  </div>
                  <div className="flex gap-4 pt-6">
                    <button 
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                      className="flex-1 bg-theme text-white py-5 rounded-[2rem] font-black text-lg bg-theme-hover transition-all shadow-xl shadow-theme/20 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
                    >
                      {isSaving ? <Loader2 size={24} className="animate-spin" /> : <CheckCircle2 size={24} />}
                      Save Changes
                    </button>
                    <button 
                      onClick={() => setIsEditing(false)}
                      disabled={isSaving}
                      className="px-10 bg-slate-100 text-slate-500 py-5 rounded-[2rem] font-black text-lg hover:bg-slate-200 transition-all active:scale-95"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-8 animate-in fade-in duration-500">
                  <div className="space-y-1 text-center md:text-left">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Connected As</p>
                    <h3 className="text-4xl font-black text-slate-900 tracking-tight">@{dbUser?.username || 'user'}</h3>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="p-5 bg-slate-50 rounded-[2rem] flex items-center gap-4 border border-slate-100">
                      <div className="p-3 bg-white rounded-xl shadow-sm text-theme"><UserIcon size={20} /></div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Display Name</p>
                        <p className="font-bold text-slate-800">{dbUser?.displayName || user?.displayName || 'Set your name'}</p>
                      </div>
                    </div>

                    <div className="p-5 bg-slate-50 rounded-[2rem] flex items-center gap-4 border border-slate-100">
                      <div className="p-3 bg-white rounded-xl shadow-sm text-theme"><Mail size={20} /></div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Address</p>
                        <p className="font-bold text-slate-800">{user?.email}</p>
                      </div>
                    </div>

                    <div className="p-5 bg-slate-50 rounded-[2rem] flex items-center gap-4 border border-slate-100">
                      <div className="p-3 bg-white rounded-xl shadow-sm text-theme"><Phone size={20} /></div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact Number</p>
                        <p className={`font-bold ${dbUser?.phoneNumber ? 'text-slate-800' : 'text-slate-300 italic'}`}>{dbUser?.phoneNumber || 'No number added'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Theme Picker Section */}
        <div className="bg-white rounded-[3.5rem] p-10 md:p-14 border border-slate-100 shadow-sm space-y-10">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-theme-light text-theme rounded-[2rem] transition-theme shadow-sm">
              <Palette size={28} />
            </div>
            <div>
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">Interface Theme</h3>
              <p className="text-slate-500 font-medium">Customize the primary aesthetic color of your workspace.</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-6 justify-center md:justify-start">
            {THEME_PRESETS.map((theme) => (
              <button
                key={theme.color}
                onClick={() => changeTheme(theme.color)}
                className={`group relative flex flex-col items-center gap-3 p-3 rounded-[2.5rem] transition-all duration-300 ${
                  currentTheme === theme.color ? 'bg-slate-50 ring-2 ring-slate-100 shadow-xl scale-105' : 'hover:bg-slate-50'
                }`}
              >
                <div 
                  className={`w-16 h-16 rounded-[2rem] shadow-lg transition-all duration-500 group-hover:rotate-12 flex items-center justify-center ${
                    currentTheme === theme.color ? 'scale-110' : ''
                  }`}
                  style={{ backgroundColor: theme.color }}
                >
                  {currentTheme === theme.color && <CheckCircle2 size={32} className="text-white animate-in zoom-in" />}
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest ${
                  currentTheme === theme.color ? 'text-theme' : 'text-slate-400'
                }`}>
                  {theme.name}
                </span>
              </button>
            ))}
            
            <label className="group relative flex flex-col items-center gap-3 p-3 rounded-[2.5rem] hover:bg-slate-50 cursor-pointer transition-all">
              <div className="w-16 h-16 rounded-[2rem] shadow-lg bg-gradient-to-tr from-rose-500 via-indigo-500 to-emerald-500 flex items-center justify-center transition-all group-hover:rotate-12">
                <Plus size={32} className="text-white" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Custom</span>
              <input 
                type="color" 
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={(e) => changeTheme(e.target.value)}
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
