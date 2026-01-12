
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
import Chat from './pages/Chat';
import { AppRoutes, PetProfile, WeightRecord, VaccinationRecord } from './types';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { GoogleGenAI } from "@google/genai";
import { 
  Dog, Plus, PawPrint, Weight, Palette, Fingerprint, 
  AlertCircle, Camera, Check, ChevronRight, Cat, Bird, Rabbit, 
  Trash2, Edit3, ArrowLeft, Stethoscope, Search, Star, MessageCircle,
  Heart, Fish, Bug, Thermometer, Droplets, Calendar, LineChart, Syringe, TrendingUp,
  Sparkles, Info, Quote, Upload, Loader2, Wand2, QrCode, Scan, X, ExternalLink
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

const PetProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [pets, setPets] = useState<PetProfile[]>([]);
  const [selectedPet, setSelectedPet] = useState<PetProfile | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isGeneratingAvatar, setIsGeneratingAvatar] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [newPet, setNewPet] = useState<Partial<PetProfile>>({ 
    name: '', breed: '', birthday: '', bio: '', species: 'Dog', healthNotes: '', 
    weightHistory: [], vaccinations: [] 
  });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [newWeight, setNewWeight] = useState('');
  const [newVaccine, setNewVaccine] = useState({ name: '', date: '', nextDueDate: '' });

  useEffect(() => {
    const saved = localStorage.getItem(`ssp_pets_${user?.uid}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      setPets(parsed);
      if (parsed.length > 0 && !selectedPet) {
        setSelectedPet(parsed[0]);
      }
    }
  }, [user]);

  const savePetsToStorage = (updatedPets: PetProfile[]) => {
    localStorage.setItem(`ssp_pets_${user?.uid}`, JSON.stringify(updatedPets));
    setPets(updatedPets);
  };

  const handleAddPet = (e: React.FormEvent) => {
    e.preventDefault();
    const id = crypto.randomUUID();
    const { years, months } = calculateAge(newPet.birthday || '');
    
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=ssp_pet_${id}`;
    
    const completePet: PetProfile = {
      ...newPet as PetProfile,
      id,
      qrCodeUrl,
      ageYears: String(years),
      ageMonths: String(months),
      weightHistory: [],
      vaccinations: []
    };

    const updatedPets = [...pets, completePet];
    savePetsToStorage(updatedPets);
    setSelectedPet(completePet);
    setSaveSuccess(true);
    setTimeout(() => { setIsAdding(false); setSaveSuccess(false); setStep(1); }, 1500);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && selectedPet) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedPets = pets.map(p => p.id === selectedPet.id ? { ...p, avatarUrl: reader.result as string } : p);
        savePetsToStorage(updatedPets);
        setSelectedPet({ ...selectedPet, avatarUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const generateAIAvatar = async () => {
    if (!selectedPet) return;
    setIsGeneratingAvatar(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `A professional, high-quality 3D rendered avatar of a ${selectedPet.breed} ${selectedPet.species}. Soft studio lighting, cute and friendly expression, solid pastel blue background.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: prompt }] },
      });

      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const avatarUrl = `data:image/png;base64,${part.inlineData.data}`;
          const updatedPets = pets.map(p => p.id === selectedPet.id ? { ...p, avatarUrl } : p);
          savePetsToStorage(updatedPets);
          setSelectedPet({ ...selectedPet, avatarUrl });
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
    if (!newWeight || isNaN(Number(newWeight)) || !selectedPet) return;
    const updatedHistory: WeightRecord[] = [...(selectedPet.weightHistory || []), { date: new Date().toISOString(), weight: Number(newWeight) }];
    const updatedPets = pets.map(p => p.id === selectedPet.id ? { ...p, weightHistory: updatedHistory } : p);
    savePetsToStorage(updatedPets);
    setSelectedPet({ ...selectedPet, weightHistory: updatedHistory });
    setNewWeight('');
  };

  const handleAddVaccine = () => {
    if (!newVaccine.name || !newVaccine.date || !selectedPet) return;
    const updatedVaccinations: VaccinationRecord[] = [...(selectedPet.vaccinations || []), { ...newVaccine }];
    const updatedPets = pets.map(p => p.id === selectedPet.id ? { ...p, vaccinations: updatedVaccinations } : p);
    savePetsToStorage(updatedPets);
    setSelectedPet({ ...selectedPet, vaccinations: updatedVaccinations });
    setNewVaccine({ name: '', date: '', nextDueDate: '' });
  };

  const healthSummary = useMemo(() => {
    if (!selectedPet) return null;
    const lastWeight = selectedPet.weightHistory[selectedPet.weightHistory.length - 1];
    const nextVaccine = selectedPet.vaccinations
      ?.filter(v => v.nextDueDate && new Date(v.nextDueDate) > new Date())
      .sort((a, b) => new Date(a.nextDueDate).getTime() - new Date(b.nextDueDate).getTime())[0];
    return { lastWeight, nextVaccine };
  }, [selectedPet]);

  if (isScanning) {
    return (
      <div className="max-w-2xl mx-auto py-24 text-center animate-fade-in">
        <div className="bg-slate-900 text-white rounded-[3.5rem] p-12 shadow-2xl relative overflow-hidden">
          <button onClick={() => setIsScanning(false)} className="absolute top-8 right-8 text-white/40 hover:text-white"><X size={32} /></button>
          <div className="w-64 h-64 border-2 border-indigo-50 rounded-3xl mx-auto mb-10 flex items-center justify-center relative">
            <div className="absolute inset-0 bg-indigo-500/10 animate-pulse"></div>
            <Scan size={80} className="text-indigo-400" />
            <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500 animate-[scan_2s_infinite]"></div>
          </div>
          <h3 className="text-2xl font-black mb-4">Scanner Ready</h3>
          <p className="text-slate-400 font-medium max-w-sm mx-auto">Position your pet's SSP-ID QR code within the frame to identify them instantly.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-20 space-y-12">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        <div>
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter">My Pet Family</h2>
          <p className="text-slate-500 font-medium">Manage and identify your registered companions.</p>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => setIsScanning(true)} className="flex items-center gap-3 px-6 py-4 bg-white border border-slate-200 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">
            <Scan size={20} className="text-indigo-600" /> Scan QR
          </button>
          <button onClick={() => setIsAdding(true)} className="flex items-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100">
            <Plus size={20} /> Add New Pet
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {pets.map(p => (
          <button 
            key={p.id} 
            onClick={() => setSelectedPet(p)}
            className={`flex flex-col items-center gap-3 p-4 rounded-[2.5rem] border-2 transition-all ${selectedPet?.id === p.id ? 'bg-indigo-50 border-indigo-600 scale-105 shadow-lg' : 'bg-white border-transparent hover:border-slate-200'}`}
          >
            <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-inner bg-slate-100">
              <img src={p.avatarUrl || `https://picsum.photos/seed/${p.id}/200`} className="w-full h-full object-cover" />
            </div>
            <span className={`font-black text-xs uppercase tracking-widest ${selectedPet?.id === p.id ? 'text-indigo-700' : 'text-slate-500'}`}>{p.name}</span>
          </button>
        ))}
      </div>

      {isAdding ? (
        <div className="max-w-3xl mx-auto animate-fade-in bg-white p-14 rounded-[3.5rem] shadow-2xl border border-slate-100 relative">
          {saveSuccess && <div className="absolute inset-0 bg-indigo-600/95 flex flex-col items-center justify-center z-50 text-white rounded-[3.5rem]"><Check size={48} className="mb-4" /><h3 className="text-2xl font-black">Added to Family!</h3></div>}
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-black text-slate-900">{step === 1 ? 'Pet Category' : step === 2 ? 'Which Species?' : 'Final Details'}</h2>
            {step > 1 && <button onClick={() => setStep(step - 1)} className="text-slate-400 font-bold flex items-center gap-1"><ArrowLeft size={16} /> Back</button>}
          </div>
          {step === 1 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {PET_CATEGORIES.map(cat => (
                <button key={cat.id} onClick={() => { setSelectedCategory(cat); setStep(2); }} className="p-8 rounded-[2.5rem] bg-slate-50 border border-transparent hover:border-indigo-500 hover:bg-white hover:shadow-xl transition-all flex flex-col items-center gap-4 group">
                  <cat.icon className="w-12 h-12 text-indigo-600" />
                  <span className="font-black text-xs uppercase tracking-widest">{cat.name}</span>
                </button>
              ))}
            </div>
          ) : step === 2 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {selectedCategory?.species.map((s: string) => (
                <button key={s} onClick={() => { setNewPet({ ...newPet, species: s, breed: BREED_DATA[s]?.[0] || 'Unknown' }); setStep(3); }} className="p-4 rounded-2xl border hover:border-indigo-600 hover:bg-indigo-50 transition-all font-bold text-slate-700">{s}</button>
              ))}
            </div>
          ) : (
            <form onSubmit={handleAddPet} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input required value={newPet.name} onChange={e => setNewPet({ ...newPet, name: e.target.value })} className="w-full bg-slate-50 border p-4 rounded-2xl outline-none" placeholder="Pet Name" />
                <select value={newPet.breed} onChange={e => setNewPet({ ...newPet, breed: e.target.value })} className="w-full bg-slate-50 border p-4 rounded-2xl outline-none">
                  {BREED_DATA[newPet.species!]?.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <input type="date" required value={newPet.birthday} onChange={e => setNewPet({ ...newPet, birthday: e.target.value })} className="w-full bg-slate-50 border p-4 rounded-2xl outline-none" />
              <textarea value={newPet.bio} onChange={e => setNewPet({ ...newPet, bio: e.target.value })} className="w-full h-32 bg-slate-50 border p-4 rounded-2xl outline-none" placeholder="Short bio..." />
              <button type="submit" className="w-full bg-indigo-600 text-white py-5 rounded-[2.5rem] font-bold text-lg hover:bg-indigo-700 transition-all">Register Pet</button>
            </form>
          )}
        </div>
      ) : selectedPet ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white rounded-[3rem] p-8 border border-slate-100 shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-2 bg-indigo-600"></div>
              <div className="flex flex-col items-center text-center space-y-6">
                <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden border-4 border-indigo-50 shadow-lg">
                  <img src={selectedPet.avatarUrl || `https://picsum.photos/seed/${selectedPet.id}/300`} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="text-3xl font-black text-slate-900 leading-none">{selectedPet.name}</h3>
                  <p className="text-slate-400 font-bold text-sm uppercase tracking-widest mt-2">{selectedPet.breed} • {selectedPet.species}</p>
                </div>
                <div className="w-full p-4 bg-slate-50 rounded-2xl flex flex-col items-center gap-4">
                  <img src={selectedPet.qrCodeUrl} className="w-40 h-40 bg-white p-2 rounded-xl shadow-inner" alt="QR ID" />
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] font-mono">SSP-ID: {selectedPet.id.slice(0, 8)}</div>
                </div>
                <div className="flex gap-2 w-full">
                  <button onClick={() => fileInputRef.current?.click()} className="flex-1 p-3 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-all"><Camera size={20} className="mx-auto" /></button>
                  <button onClick={generateAIAvatar} disabled={isGeneratingAvatar} className="flex-1 p-3 bg-slate-900 text-white rounded-xl hover:bg-black transition-all disabled:opacity-50"><Sparkles size={20} className="mx-auto" /></button>
                </div>
                <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-rose-50 text-rose-600 rounded-xl"><Weight size={24} /></div>
                  <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs">Weight (kg)</h4>
                </div>
                <div className="flex items-end gap-3 mb-6">
                  <span className="text-5xl font-black">{healthSummary?.lastWeight?.weight || '--'}</span>
                  <span className="text-slate-400 font-bold mb-1">KG</span>
                </div>
                <div className="flex gap-2">
                  <input value={newWeight} onChange={e => setNewWeight(e.target.value)} type="number" className="flex-1 bg-slate-50 border rounded-xl p-3 outline-none" placeholder="Log weight..." />
                  <button onClick={handleAddWeight} className="p-3 bg-indigo-600 text-white rounded-xl shadow-lg"><Plus size={20} /></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
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
      <Route path={AppRoutes.HEALTH_CHECKUP} element={<ProtectedRoute><AIAssistant /></ProtectedRoute>} />
      <Route path={AppRoutes.SETTINGS} element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path={AppRoutes.PET_PROFILE} element={<ProtectedRoute><PetProfilePage /></ProtectedRoute>} />
      <Route path={AppRoutes.CREATE_POST} element={<ProtectedRoute><Community /></ProtectedRoute>} />
      <Route path={AppRoutes.CHAT} element={<ProtectedRoute><Chat /></ProtectedRoute>} />
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
