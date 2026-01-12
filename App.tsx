
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from './components/Layout';
import Home from './pages/Home';
import AIAssistant from './pages/AIAssistant';
import PetCare from './pages/PetCare';
import Login from './pages/Login';
import Settings from './pages/Settings';
import Community from './pages/Community';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import { AppRoutes, PetProfile, WeightRecord, VaccinationRecord } from './types';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { GoogleGenAI } from "@google/genai";
import { 
  Dog, Plus, PawPrint, Weight, Palette, Fingerprint, 
  AlertCircle, Camera, Check, ChevronRight, Cat, Bird, Rabbit, 
  Trash2, Edit3, ArrowLeft, Stethoscope, Search, Star, MessageCircle,
  Heart, Fish, Bug, Thermometer, Droplets, Calendar, LineChart, Syringe, TrendingUp,
  Sparkles, Info, Quote, Upload, Loader2, Wand2
} from 'lucide-react';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Layout>{children}</Layout>;
};

export const BREED_DATA: Record<string, string[]> = {
  Dog: ['Labrador Retriever', 'German Shepherd', 'Golden Retriever', 'French Bulldog', 'Poodle', 'Beagle', 'Mixed Breed'],
  Cat: ['Persian', 'Maine Coon', 'Siamese', 'Ragdoll', 'Bengal', 'Mixed Breed'],
  Rabbit: ['Holland Lop', 'Mini Rex', 'Dutch Rabbit', 'Lionhead'],
  Hamster: ['Syrian Hamster', 'Dwarf Hamster', 'Roborovski Hamster'],
  'Guinea Pig': ['Abyssinian', 'American', 'Peruvian', 'Teddy'],
  Mouse: ['Fancy Mouse', 'Spiny Mouse'],
  Rat: ['Fancy Rat', 'Dumbo Rat', 'Hairless Rat'],
  Ferret: ['Sable', 'Albino', 'Silver Mitt'],
  Horse: ['Thoroughbred', 'Quarter Horse', 'Arabian', 'Appaloosa'],
  Goat: ['Nigerian Dwarf', 'Pygmy Goat', 'Alpine'],
  Pig: ['Mini Pig', 'Pot-bellied Pig', 'Kunekune'],
  Parrot: ['African Grey', 'Amazon Parrot', 'Macaw', 'Cockatoo'],
  Parakeet: ['Budgie', 'Monk Parakeet', 'Indian Ringneck'],
  Cockatiel: ['Grey', 'Lutino', 'Pied', 'Pearl'],
  Lovebird: ['Peach-faced', 'Fischer\'s Lovebird', 'Masked Lovebird'],
  Canary: ['Yellow Canary', 'Red Factor Canary', 'Gloster Canary'],
  Finch: ['Zebra Finch', 'Society Finch', 'Gouldian Finch'],
  Pigeon: ['Homing Pigeon', 'Fantail Pigeon', 'Racing Homer'],
  Goldfish: ['Comet', 'Fantail', 'Oranda', 'Shubunkin'],
  'Betta Fish': ['Veiltail', 'Crowntail', 'Halfmoon'],
  Guppy: ['Fancy Guppy', 'Endler Guppy', 'Cobra Guppy'],
  Angelfish: ['Marble Angelfish', 'Silver Angelfish', 'Koi Angelfish'],
  Koi: ['Kohaku', 'Sanke', 'Showa'],
  Tetra: ['Neon Tetra', 'Cardinal Tetra', 'Rummy Nose Tetra'],
  Turtle: ['Red-eared Slider', 'Painted Turtle', 'Box Turtle'],
  Tortoise: ['Sulcata Tortoise', 'Russian Tortoise', 'Hermann\'s Tortoise'],
  Lizard: ['Bearded Dragon', 'Iguana', 'Blue-tongued Skink'],
  Gecko: ['Leopard Gecko', 'Crested Gecko', 'Tokay Gecko'],
  Snake: ['Ball Python', 'Corn Snake', 'King Snake', 'Garter Snake'],
  Chameleon: ['Veiled Chameleon', 'Panther Chameleon', 'Jackson\'s Chameleon'],
  Frog: ['Tree Frog', 'Bullfrog', 'Pacman Frog'],
  Toad: ['Common Toad', 'Fire-bellied Toad', 'Cane Toad'],
  Salamander: ['Axolotl', 'Tiger Salamander', 'Fire Salamander'],
  Newt: ['Fire-bellied Newt', 'Eastern Newt', 'Ribbed Newt'],
  'Ant Farm': ['Harvester Ant', 'Carpenter Ant', 'Garden Ant'],
  'Stick Insect': ['Indian Stick Insect', 'Giant Prickly Stick Insect'],
  Tarantula: ['Mexican Red Knee', 'Rose Hair', 'Pink Toe'],
  Beetle: ['Hercules Beetle', 'Stag Beetle', 'Rhino Beetle'],
  Other: ['Exotic Pet', 'Wild Animal', 'Invertebrate']
};

export const PET_CATEGORIES = [
  { id: 'mammal', name: 'Mammals', icon: Dog, species: ['Dog', 'Cat', 'Rabbit', 'Hamster', 'Guinea Pig', 'Mouse', 'Rat', 'Ferret', 'Horse', 'Goat', 'Pig'] },
  { id: 'bird', name: 'Birds', icon: Bird, species: ['Parrot', 'Parakeet', 'Cockatiel', 'Lovebird', 'Canary', 'Finch', 'Pigeon'] },
  { id: 'fish', name: 'Fish', icon: Fish, species: ['Goldfish', 'Betta Fish', 'Guppy', 'Angelfish', 'Koi', 'Tetra'] },
  { id: 'reptile', name: 'Reptiles', icon: Thermometer, species: ['Turtle', 'Tortoise', 'Lizard', 'Gecko', 'Snake', 'Chameleon'] },
  { id: 'amphibian', name: 'Amphibians', icon: Droplets, species: ['Frog', 'Toad', 'Salamander', 'Newt'] },
  { id: 'insect', name: 'Insects', icon: Bug, species: ['Ant Farm', 'Stick Insect', 'Tarantula', 'Beetle'] },
];

const calculateAge = (birthday: string) => {
  if (!birthday) return { years: 0, months: 0 };
  const birthDate = new Date(birthday);
  const today = new Date();
  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();
  if (months < 0) {
    years--;
    months += 12;
  }
  return { years, months };
};

const HealthCheckupPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCondition, setSelectedCondition] = useState<any>(null);
  const filtered = [
    { id: 1, name: 'Itchy Skin / Allergies', treatment: 'Apoquel or Cytopoint injections' },
    { id: 2, name: 'Joint Pain / Arthritis', treatment: 'Librela injections' },
    { id: 3, name: 'Upset Stomach', treatment: 'Probiotics and plain rice diet' }
  ].filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));
  
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center md:text-left">
        <h2 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
          <Stethoscope className="text-indigo-600" /> Health Checkup
        </h2>
        <p className="text-slate-500 mt-2">Diagnose common issues and see how other pet parents treated them.</p>
      </div>
      <div className="relative">
        <Search className="absolute left-4 top-4 text-slate-400" />
        <input type="text" placeholder="Search symptoms..." className="w-full bg-white border border-slate-200 rounded-3xl py-4 pl-12 pr-6 focus:ring-4 focus:ring-indigo-100 outline-none transition-all shadow-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-bold text-slate-400 text-xs uppercase tracking-widest px-2">Conditions</h3>
          {filtered.map(c => (
            <button key={c.id} onClick={() => setSelectedCondition(c)} className={`w-full text-left p-6 rounded-[2rem] border transition-all ${selectedCondition?.id === c.id ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl' : 'bg-white border-slate-100 text-slate-800 hover:border-indigo-300'}`}>
              <div className="font-black text-lg">{c.name}</div>
            </button>
          ))}
        </div>
        <div className="bg-white rounded-[3rem] p-8 border border-slate-100 shadow-sm min-h-[300px]">
          {selectedCondition ? (
            <div className="space-y-6 animate-in fade-in duration-300">
              <h4 className="font-black text-2xl text-slate-900">{selectedCondition.name}</h4>
              <div className="p-5 bg-indigo-50 rounded-2xl border border-indigo-100">
                <div className="text-xs font-black text-indigo-700 uppercase tracking-widest mb-1">Recommended Treatment</div>
                <div className="text-indigo-900 font-bold">{selectedCondition.treatment}</div>
              </div>
            </div>
          ) : <p className="text-slate-400 flex items-center justify-center h-full">Select a condition to see details.</p>}
        </div>
      </div>
    </div>
  );
};

const PetProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [pet, setPet] = useState<PetProfile | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isGeneratingAvatar, setIsGeneratingAvatar] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [newPet, setNewPet] = useState<PetProfile>({ 
    name: '', breed: '', birthday: '', bio: '', species: 'Dog', healthNotes: '', 
    weightHistory: [], vaccinations: [] 
  });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Weight & Vaccine Forms
  const [newWeight, setNewWeight] = useState('');
  const [newVaccine, setNewVaccine] = useState({ name: '', date: '', nextDueDate: '' });

  useEffect(() => {
    const saved = localStorage.getItem(`pet_${user?.uid}`);
    if (saved) setPet(JSON.parse(saved));
  }, [user]);

  const handleAddPet = (e: React.FormEvent) => {
    e.preventDefault();
    const { years, months } = calculateAge(newPet.birthday);
    const validatedPet = { 
      ...newPet, 
      ageYears: String(years), 
      ageMonths: String(months) 
    };
    localStorage.setItem(`pet_${user?.uid}`, JSON.stringify(validatedPet));
    setPet(validatedPet);
    setSaveSuccess(true);
    setTimeout(() => { setIsAdding(false); setSaveSuccess(false); setStep(1); }, 1500);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && pet) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedPet = { ...pet, avatarUrl: reader.result as string };
        setPet(updatedPet);
        localStorage.setItem(`pet_${user?.uid}`, JSON.stringify(updatedPet));
      };
      reader.readAsDataURL(file);
    }
  };

  const generateAIAvatar = async () => {
    if (!pet) return;
    setIsGeneratingAvatar(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `A high-quality, adorable, professional 3D-styled pet avatar of a ${pet.breed} ${pet.species}. Soft lighting, clean solid pastel background, expressive eyes, cute features.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: prompt }] },
      });

      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const avatarUrl = `data:image/png;base64,${part.inlineData.data}`;
          const updatedPet = { ...pet, avatarUrl };
          setPet(updatedPet);
          localStorage.setItem(`pet_${user?.uid}`, JSON.stringify(updatedPet));
          break;
        }
      }
    } catch (err) {
      console.error("Avatar Generation Error:", err);
    } finally {
      setIsGeneratingAvatar(false);
    }
  };

  const handleAddWeight = () => {
    if (!newWeight || isNaN(Number(newWeight)) || !pet) return;
    const updatedHistory: WeightRecord[] = [...(pet.weightHistory || []), { date: new Date().toISOString(), weight: Number(newWeight) }];
    const updatedPet = { ...pet, weightHistory: updatedHistory };
    setPet(updatedPet);
    localStorage.setItem(`pet_${user?.uid}`, JSON.stringify(updatedPet));
    setNewWeight('');
  };

  const handleAddVaccine = () => {
    if (!newVaccine.name || !newVaccine.date || !pet) return;
    const updatedVaccinations: VaccinationRecord[] = [...(pet.vaccinations || []), { ...newVaccine }];
    const updatedPet = { ...pet, vaccinations: updatedVaccinations };
    setPet(updatedPet);
    localStorage.setItem(`pet_${user?.uid}`, JSON.stringify(updatedPet));
    setNewVaccine({ name: '', date: '', nextDueDate: '' });
  };

  const healthSummary = useMemo(() => {
    if (!pet) return null;
    const lastWeight = pet.weightHistory[pet.weightHistory.length - 1];
    const prevWeight = pet.weightHistory[pet.weightHistory.length - 2];
    const weightTrend = lastWeight && prevWeight ? (lastWeight.weight > prevWeight.weight ? 'up' : 'down') : 'stable';
    
    const nextVaccine = pet.vaccinations
      ?.filter(v => v.nextDueDate && new Date(v.nextDueDate) > new Date())
      .sort((a, b) => new Date(a.nextDueDate).getTime() - new Date(b.nextDueDate).getTime())[0];

    return { lastWeight, weightTrend, nextVaccine };
  }, [pet?.weightHistory, pet?.vaccinations]);

  const weightDataPoints = useMemo(() => {
    if (!pet || !pet.weightHistory || pet.weightHistory.length < 2) return null;
    const weights = pet.weightHistory.map(w => w.weight);
    const minW = Math.min(...weights) * 0.9;
    const maxW = Math.max(...weights) * 1.1;
    const range = maxW - minW;
    const width = 300;
    const height = 100;
    const step = width / (pet.weightHistory.length - 1);
    
    return pet.weightHistory.map((w, i) => ({
      x: i * step,
      y: height - ((w.weight - minW) / range) * height
    })).map(p => `${p.x},${p.y}`).join(' ');
  }, [pet?.weightHistory]);

  if (!pet && !isAdding) {
    return (
      <div className="max-w-2xl mx-auto py-24 text-center">
        <div className="bg-indigo-50 w-32 h-32 rounded-[3rem] flex items-center justify-center mx-auto mb-8 shadow-inner"><PawPrint className="w-16 h-16 text-indigo-600" /></div>
        <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Register Your Companion</h2>
        <p className="text-slate-500 mb-10 font-medium">Create a profile to unlock personalized AI support and tracking.</p>
        <button onClick={() => setIsAdding(true)} className="bg-indigo-600 text-white px-10 py-5 rounded-[2rem] font-bold hover:bg-indigo-700 shadow-2xl transition-all active:scale-95">Add Profile</button>
      </div>
    );
  }

  if (isAdding) {
    return (
      <div className="max-w-3xl mx-auto animate-fade-in">
        <div className="bg-white p-14 rounded-[3.5rem] shadow-2xl border border-slate-100 relative overflow-hidden">
          {saveSuccess && <div className="absolute inset-0 bg-indigo-600/95 flex flex-col items-center justify-center z-50 text-white"><Check size={48} className="mb-4" /><h3 className="text-2xl font-black">Saved Successfully!</h3></div>}
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-black text-slate-900">{step === 1 ? 'Choose Category' : step === 2 ? 'Select Species' : 'Complete Details'}</h2>
            {step > 1 && <button onClick={() => setStep(step - 1)} className="text-slate-400 font-bold flex items-center gap-1"><ArrowLeft size={16} /> Back</button>}
          </div>
          {step === 1 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {PET_CATEGORIES.map(cat => (
                <button key={cat.id} onClick={() => { setSelectedCategory(cat); setStep(2); }} className="p-6 rounded-[2.5rem] bg-slate-50 border border-transparent hover:border-indigo-500 hover:bg-white hover:shadow-xl transition-all flex flex-col items-center gap-4 group">
                  <cat.icon className="w-10 h-10 text-indigo-600 group-hover:scale-110 transition-transform" />
                  <span className="font-black text-xs uppercase tracking-widest text-slate-600">{cat.name}</span>
                </button>
              ))}
            </div>
          ) : step === 2 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {selectedCategory?.species.map((s: string) => (
                <button key={s} onClick={() => { setNewPet({ ...newPet, species: s, breed: BREED_DATA[s]?.[0] || 'Unknown' }); setStep(3); }} className="p-4 rounded-2xl border border-slate-100 hover:border-indigo-600 hover:bg-indigo-50 transition-all font-bold text-slate-700">{s}</button>
              ))}
            </div>
          ) : (
            <form onSubmit={handleAddPet} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Pet Name</label>
                  <input required value={newPet.name} onChange={e => setNewPet({ ...newPet, name: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-5 focus:ring-4 focus:ring-indigo-100 outline-none" placeholder="e.g. Luna" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Breed / Variety</label>
                  <select value={newPet.breed} onChange={e => setNewPet({ ...newPet, breed: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-5 outline-none focus:ring-4 focus:ring-indigo-100">
                    {BREED_DATA[newPet.species]?.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Birthday</label>
                <input type="date" required value={newPet.birthday} onChange={e => setNewPet({ ...newPet, birthday: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-5 focus:ring-4 focus:ring-indigo-100 outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">About Me / Bio</label>
                <textarea value={newPet.bio} onChange={e => setNewPet({ ...newPet, bio: e.target.value })} className="w-full h-32 bg-slate-50 border border-slate-100 rounded-2xl py-4 px-5 focus:ring-4 focus:ring-indigo-100 outline-none resize-none" placeholder="Tell us about your pet's personality..." />
              </div>
              <button type="submit" className="w-full bg-indigo-600 text-white py-5 rounded-[2.5rem] font-bold text-lg hover:bg-indigo-700 shadow-xl active:scale-95 transition-all">Create Profile</button>
            </form>
          )}
        </div>
      </div>
    );
  }

  const { years, months } = calculateAge(pet.birthday);

  return (
    <div className="max-w-5xl mx-auto pb-20 animate-fade-in space-y-10">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center gap-10">
        <div className="relative group">
          <div className="w-48 h-48 rounded-[4rem] bg-slate-100 overflow-hidden shadow-2xl border-4 border-white transition-transform group-hover:scale-105">
            <img 
              src={pet.avatarUrl || `https://picsum.photos/seed/${pet.name}/400`} 
              className={`w-full h-full object-cover ${isGeneratingAvatar ? 'opacity-30 grayscale' : ''}`} 
              alt={pet.name}
            />
            {isGeneratingAvatar && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 size={40} className="animate-spin text-indigo-600" />
              </div>
            )}
          </div>
          <div className="absolute -bottom-2 -right-2 flex gap-2">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="p-3 bg-white rounded-2xl shadow-xl text-slate-600 hover:text-indigo-600 transition-colors border border-slate-50"
              title="Upload Photo"
            >
              <Camera size={20} />
            </button>
            <button 
              onClick={generateAIAvatar}
              disabled={isGeneratingAvatar}
              className="p-3 bg-indigo-600 rounded-2xl shadow-xl text-white hover:bg-indigo-700 transition-colors disabled:opacity-50"
              title="Generate AI Avatar"
            >
              <Wand2 size={20} />
            </button>
            <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
          </div>
        </div>

        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-wrap items-center gap-4 justify-center md:justify-start mb-3">
            <h2 className="text-6xl font-black text-slate-900 tracking-tighter">{pet.name}</h2>
            <div className="px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-xs font-black uppercase tracking-widest border border-indigo-100">
              {pet.species}
            </div>
          </div>
          <p className="text-slate-500 text-xl font-medium mb-6">
            {pet.breed} • {years} Years {months} Months Old
          </p>
          
          <div className="bg-white/40 backdrop-blur-sm border border-slate-100 rounded-3xl p-6 relative max-w-xl">
            <Quote size={20} className="absolute -top-3 -left-2 text-indigo-300 fill-indigo-50" />
            <p className="text-slate-600 font-medium italic leading-relaxed">
              {pet.bio || "No biography written yet. Tell us about your pet's favorite activities!"}
            </p>
          </div>

          <div className="flex gap-4 mt-8 justify-center md:justify-start">
            <button className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 shadow-xl transition-all">Edit Profile</button>
            <button onClick={() => { if(confirm("Delete profile?")) { localStorage.removeItem(`pet_${user?.uid}`); setPet(null); } }} className="px-8 py-3 border border-rose-100 text-rose-500 font-bold rounded-2xl hover:bg-rose-50 transition-all">Delete</button>
          </div>
        </div>
      </div>

      {/* Health Quick Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-indigo-100 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <Weight size={24} className="opacity-80" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-white/20 px-3 py-1 rounded-full">Vital Summary</span>
          </div>
          <div>
            <p className="text-white/60 text-xs font-bold uppercase tracking-widest">Current Weight</p>
            <div className="flex items-end gap-2">
              <h4 className="text-4xl font-black tracking-tight">{healthSummary?.lastWeight?.weight || '--'}</h4>
              <span className="text-xl font-bold mb-1 opacity-80">kg</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4 text-emerald-600">
            <Syringe size={24} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-emerald-50 px-3 py-1 rounded-full text-emerald-600">Next Due</span>
          </div>
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Immunization</p>
            <h4 className="text-2xl font-black text-slate-800 truncate">
              {healthSummary?.nextVaccine?.name || 'No Upcoming'}
            </h4>
            <p className="text-emerald-500 font-bold text-sm">
              {healthSummary?.nextVaccine?.nextDueDate ? new Date(healthSummary.nextVaccine.nextDueDate).toLocaleDateString() : 'Up to date'}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4 text-rose-500">
            <Heart size={24} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-rose-50 px-3 py-1 rounded-full text-rose-500">Milestone</span>
          </div>
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Upcoming Birthday</p>
            <h4 className="text-2xl font-black text-slate-800">
              {new Date(pet.birthday).toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}
            </h4>
            <p className="text-slate-400 font-bold text-sm">Turn {years + 1}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Weight Tracking */}
        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-2xl text-slate-800 flex items-center gap-3"><Weight className="text-indigo-600" /> Weight Tracking</h3>
            <div className="flex gap-2">
              <input type="number" value={newWeight} onChange={e => setNewWeight(e.target.value)} placeholder="0.0 kg" className="w-24 bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-sm outline-none" />
              <button onClick={handleAddWeight} className="bg-indigo-600 text-white p-2 rounded-xl hover:bg-indigo-700 transition-all"><Plus size={20} /></button>
            </div>
          </div>
          
          {pet.weightHistory && pet.weightHistory.length > 0 ? (
            <div className="space-y-6">
              <div className="h-40 bg-indigo-50/30 rounded-3xl p-6 flex items-end justify-center">
                {weightDataPoints ? (
                  <svg viewBox="0 0 300 100" className="w-full h-full">
                    <polyline fill="none" stroke="#4f46e5" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" points={weightDataPoints} />
                  </svg>
                ) : (
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Add more data for chart</p>
                )}
              </div>
              <div className="max-h-40 overflow-y-auto pr-2 space-y-2">
                {pet.weightHistory.map((w, i) => (
                  <div key={i} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{new Date(w.date).toLocaleDateString()}</span>
                    <span className="font-black text-slate-800">{w.weight} kg</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400 font-medium">No weight data recorded.</div>
          )}
        </div>

        {/* Vaccination Log */}
        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-8">
          <h3 className="font-black text-2xl text-slate-800 flex items-center gap-3"><Syringe className="text-indigo-600" /> Vaccinations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input value={newVaccine.name} onChange={e => setNewVaccine({...newVaccine, name: e.target.value})} placeholder="Vaccine Name" className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-sm outline-none" />
            <input type="date" value={newVaccine.date} onChange={e => setNewVaccine({...newVaccine, date: e.target.value})} className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-sm outline-none" />
            <div className="flex gap-2 md:col-span-2">
              <input type="date" value={newVaccine.nextDueDate} onChange={e => setNewVaccine({...newVaccine, nextDueDate: e.target.value})} className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-sm outline-none" />
              <button onClick={handleAddVaccine} className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all flex items-center gap-2"><Plus size={16} /> Add</button>
            </div>
          </div>

          <div className="space-y-3">
            {pet.vaccinations && pet.vaccinations.length > 0 ? pet.vaccinations.map((v, i) => (
              <div key={i} className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl flex justify-between items-center">
                <div>
                  <h4 className="font-black text-indigo-900">{v.name}</h4>
                  <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Administered: {v.date}</p>
                </div>
                {v.nextDueDate && (
                  <div className="text-right">
                    <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest">Next Due</p>
                    <p className="font-black text-rose-600 text-sm">{v.nextDueDate}</p>
                  </div>
                )}
              </div>
            )) : <p className="py-12 text-center text-slate-400 font-medium">No vaccinations logged.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

const AppContent: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path={AppRoutes.HOME} element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path={AppRoutes.AI_ASSISTANT} element={<ProtectedRoute><AIAssistant /></ProtectedRoute>} />
      <Route path={AppRoutes.PET_CARE} element={<ProtectedRoute><PetCare /></ProtectedRoute>} />
      <Route path={AppRoutes.HEALTH_CHECKUP} element={<ProtectedRoute><HealthCheckupPage /></ProtectedRoute>} />
      <Route path={AppRoutes.SETTINGS} element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path={AppRoutes.PET_PROFILE} element={<ProtectedRoute><PetProfilePage /></ProtectedRoute>} />
      <Route path={AppRoutes.CREATE_POST} element={<ProtectedRoute><Community /></ProtectedRoute>} />
      <Route path={AppRoutes.TERMS} element={<ProtectedRoute><Terms /></ProtectedRoute>} />
      <Route path={AppRoutes.PRIVACY} element={<ProtectedRoute><Privacy /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App: React.FC = () => (
  <Router>
    <AuthProvider>
      <NotificationProvider>
        <AppContent />
      </NotificationProvider>
    </AuthProvider>
  </Router>
);

export default App;
