
import React, { useState } from 'react';
import { Heart, Shield, Mail, Lock, User, MapPin, PawPrint, Loader2, ArrowRight, AlertCircle } from 'lucide-react';
import { loginWithGoogle, loginWithEmail, signUpWithEmail } from '../services/firebase';
/* Fix: Standardized named imports from react-router-dom */
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const LOGO_URL = "https://res.cloudinary.com/dazlddxht/image/upload/v1768111415/Smart_Support_for_Pets_tpteed.png";

  // Form State
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    username: '',
    petName: '',
    address: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const formatFirebaseError = (err: any) => {
    const code = err.code || '';
    if (code === 'auth/configuration-not-found') {
      return "Authentication not configured. Please enable 'Email/Password' and 'Google' providers in your Firebase Console (Authentication > Sign-in method). Also ensure the new project config is used.";
    }
    if (code === 'auth/invalid-credential') return "Invalid email or password.";
    if (code === 'auth/email-already-in-use') return "This email is already registered.";
    if (code === 'auth/weak-password') return "Password should be at least 6 characters.";
    return err.message || "An unexpected error occurred.";
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError('');
    try {
      await loginWithGoogle();
      navigate('/');
    } catch (err: any) {
      setError(formatFirebaseError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (isLogin) {
        await loginWithEmail(formData.email, formData.password);
      } else {
        // Sign up with Name
        // Note: Pet Name, Address, and Username would typically be stored in Firestore after this call.
        await signUpWithEmail(formData.email, formData.password, formData.fullName);
      }
      navigate('/');
    } catch (err: any) {
      setError(formatFirebaseError(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-5xl w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row transition-all duration-500 min-h-[600px]">
        
        {/* Left Section: Branding & Info */}
        <div className="md:w-5/12 bg-indigo-600 p-8 md:p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-10">
              <div className="bg-white p-2 rounded-2xl shadow-lg w-12 h-12 flex items-center justify-center overflow-hidden">
                <img src={LOGO_URL} alt="Logo" className="w-10 h-10 object-contain" />
              </div>
              <h1 className="text-xl font-bold tracking-tight">Smart Support for Pets</h1>
            </div>
            
            <h2 className="text-4xl font-extrabold leading-tight mb-6">
              {isLogin ? "Your pet's best life starts here." : "Join our community of pet lovers."}
            </h2>
            <p className="text-indigo-100 text-lg mb-8 max-w-xs">
              AI-powered support and a loving space for every pet parent.
            </p>
          </div>

          <div className="space-y-6 relative z-10">
            <div className="flex items-center gap-4 group">
              <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center">
                <Heart className="w-6 h-6" />
              </div>
              <div>
                <p className="font-semibold text-sm">Health First</p>
                <p className="text-indigo-200 text-xs">AI insights for your pet's wellness</p>
              </div>
            </div>
            <div className="flex items-center gap-4 group">
              <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <p className="font-semibold text-sm">Safety Verified</p>
                <p className="text-indigo-200 text-xs">Trusted profiles and data security</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section: Forms */}
        <div className="md:w-7/12 p-8 md:p-12 bg-white flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <div className="mb-8">
              <h3 className="text-3xl font-bold text-slate-800 mb-2">
                {isLogin ? "Welcome Back!" : "Get Started"}
              </h3>
              <p className="text-slate-500 text-sm">
                {isLogin ? "Sign in to keep track of your companions." : "Create an account to unlock smart pet support."}
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-700 rounded-xl text-xs leading-relaxed flex items-start gap-3 animate-shake">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-3 text-slate-400 w-4 h-4" />
                      <input 
                        required name="fullName" type="text" placeholder="John Doe"
                        value={formData.fullName} onChange={handleChange}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Username</label>
                    <div className="relative">
                      <span className="absolute left-4 top-2.5 text-slate-400 text-sm font-bold">@</span>
                      <input 
                        required name="username" type="text" placeholder="johndoe"
                        value={formData.username} onChange={handleChange}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 pl-9 pr-4 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>
              )}

              {!isLogin && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Pet's Name</label>
                    <div className="relative">
                      <PawPrint className="absolute left-4 top-3 text-slate-400 w-4 h-4" />
                      <input 
                        required name="petName" type="text" placeholder="Buddy"
                        value={formData.petName} onChange={handleChange}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Address</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-3 text-slate-400 w-4 h-4" />
                      <input 
                        required name="address" type="text" placeholder="New York, NY"
                        value={formData.address} onChange={handleChange}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3 text-slate-400 w-4 h-4" />
                  <input 
                    required name="email" type="email" placeholder="email@example.com"
                    value={formData.email} onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3 text-slate-400 w-4 h-4" />
                  <input 
                    required name="password" type="password" placeholder="••••••••"
                    value={formData.password} onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-indigo-600 text-white py-3.5 rounded-2xl font-bold text-base hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2 mt-4"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isLogin ? "Sign In" : "Create Account")}
                {!isLoading && <ArrowRight size={18} />}
              </button>
            </form>

            <div className="my-6 flex items-center gap-4 text-slate-300">
              <div className="h-px flex-1 bg-slate-100"></div>
              <span className="text-[10px] font-bold">OR</span>
              <div className="h-px flex-1 bg-slate-100"></div>
            </div>

            <button 
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 py-3 rounded-2xl font-bold text-slate-700 hover:bg-slate-50 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
              Continue with Google
            </button>

            <div className="mt-8 text-center">
              <p className="text-slate-500 text-sm font-medium">
                {isLogin ? "New to Smart Support for Pets?" : "Already have an account?"}
                <button 
                  onClick={() => { setIsLogin(!isLogin); setError(''); }}
                  className="ml-2 text-indigo-600 font-bold hover:underline"
                >
                  {isLogin ? "Join Now" : "Sign In"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Login;
