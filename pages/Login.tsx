

import React, { useState, useEffect } from 'react';
import { Heart, Shield, Mail, Lock, User, MapPin, PawPrint, Loader2, ArrowRight, AlertCircle, Phone, MessageSquare } from 'lucide-react';
import { 
  loginWithGoogle, 
  loginWithIdentifier, 
  signUpWithEmail, 
  auth, // Import auth
  syncUserToDb 
} from '../services/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';

// Fix: Add global type definitions for reCAPTCHA to resolve errors on the window object.
declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier;
    grecaptcha: any;
  }
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  
  // UI State
  const [authView, setAuthView] = useState<'email' | 'phone' | 'otp'>('email');
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form Data
  const [formData, setFormData] = useState({
    identifier: '', // Can be email or username
    password: '',
    fullName: '',
    username: '',
  });
  
  // Phone Auth State
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  const LOGO_URL = "https://res.cloudinary.com/dazlddxht/image/upload/v1768234409/SS_Paw_Pal_Logo_aceyn8.png";

  useEffect(() => {
    if (!loading && user) {
      navigate('/', { replace: true });
    }
  }, [user, loading, navigate]);
  
  // Setup reCAPTCHA Verifier
  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': (response: any) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
        },
        'expired-callback': () => {
          // Response expired. Ask user to solve reCAPTCHA again.
        }
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const formatFirebaseError = (err: any) => {
    const code = err.code || '';
    if (code === 'auth/popup-blocked') return "Sign-in popup was blocked. Please enable popups for this site.";
    if (code === 'auth/popup-closed-by-user') return "Sign-in was cancelled.";
    if (code === 'auth/invalid-credential' || code === 'auth/invalid-email') return "The username/email or password you entered is incorrect.";
    if (code === 'auth/email-already-in-use') return "This email is already registered. Try signing in instead.";
    if (code === 'auth/weak-password') return "Password should be at least 6 characters.";
    if (code === 'auth/network-request-failed') return "Network error. Check your internet connection.";
    if (code === 'auth/invalid-phone-number') return "That's not a valid phone number. Make sure to include the country code (e.g., +1).";
    if (code === 'auth/code-expired') return "The OTP has expired. Please send a new one.";
    if (code === 'auth/invalid-verification-code') return "The OTP you entered is incorrect. Try again!";
    return err.message || "An unexpected authentication error occurred.";
  };
  
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError('');
    try {
      await loginWithGoogle();
    } catch (err: any) {
      setError(formatFirebaseError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      if (isLogin) {
        await loginWithIdentifier(formData.identifier, formData.password);
      } else {
        await signUpWithEmail(formData.identifier, formData.password, formData.fullName, formData.username);
      }
    } catch (err: any) {
      setError(formatFirebaseError(err));
    } finally {
      setIsLoading(false);
    }
  };
  
  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      setupRecaptcha();
      const appVerifier = window.recaptchaVerifier;
      const result = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      setConfirmationResult(result);
      setAuthView('otp');
    } catch (err: any) {
      setError(formatFirebaseError(err));
      // Reset reCAPTCHA on error
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.render().then((widgetId) => {
          // FIX: The grecaptcha object is attached to the window, so it must be accessed via window.grecaptcha.
          window.grecaptcha.reset(widgetId);
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmationResult) return;
    setIsLoading(true);
    setError('');
    try {
      const userCredential = await confirmationResult.confirm(otp);
      // If it's a new user, sync them to the DB
      if (userCredential.user) {
        await syncUserToDb(userCredential.user);
      }
    } catch (err: any) {
      setError(formatFirebaseError(err));
    } finally {
      setIsLoading(false);
    }
  };

  if (loading || user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-yellow-100 flex items-center justify-center p-4">
      <div id="recaptcha-container"></div>
      <div className="sticker-card w-full max-w-md bg-white border-4 border-black p-10 space-y-8">
        <div className="text-center">
          <img src={LOGO_URL} className="w-24 h-24 mx-auto mb-4 border-2 border-black rounded-full p-2 bg-white shadow-[4px_4px_0px_0px_#000]" />
          <h2 className="text-4xl font-black text-black">
            {authView === 'email' ? (isLogin ? "HI AGAIN!" : "JOIN US!") : "PHONE FUN! 📱"}
          </h2>
          <p className="font-bold text-purple-600 mt-2">
            {authView === 'otp' ? 'Enter the magic code we sent you!' : 'The coolest pet app ever!'}
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-100 border-2 border-red-500 rounded-xl text-red-600 font-bold flex items-center gap-3 animate-in fade-in">
            <AlertCircle /> {error}
          </div>
        )}

        {authView === 'email' && (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <input required name="fullName" type="text" placeholder="Your Full Name" value={formData.fullName} onChange={handleChange} className="w-full p-4 border-4 border-black rounded-2xl font-bold" />
                <input required name="username" type="text" placeholder="Choose a Username" value={formData.username} onChange={handleChange} className="w-full p-4 border-4 border-black rounded-2xl font-bold" />
              </>
            )}
            <input required name="identifier" type="text" placeholder={isLogin ? "Username or Email" : "Your Email"} value={formData.identifier} onChange={handleChange} className="w-full p-4 border-4 border-black rounded-2xl font-bold" />
            <input required name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} className="w-full p-4 border-4 border-black rounded-2xl font-bold" />
            
            <button type="submit" disabled={isLoading} className="fun-button w-full bg-purple-600 text-white py-5 text-xl rounded-2xl">
              {isLoading ? <Loader2 className="animate-spin mx-auto"/> : (isLogin ? "Sign In! 🚀" : "Create Account! ✨")}
            </button>
            <p className="text-center text-sm font-bold">
              {isLogin ? "New here?" : "Got an account?"}
              <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-purple-600 ml-2 hover:underline">
                {isLogin ? "Sign Up!" : "Log In!"}
              </button>
            </p>
          </form>
        )}

        {authView === 'phone' && (
          <form onSubmit={handlePhoneSubmit} className="space-y-4">
            <input required type="tel" placeholder="+1 123 456 7890" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} className="w-full p-4 border-4 border-black rounded-2xl font-bold text-center text-xl tracking-widest" />
            <button type="submit" disabled={isLoading} className="fun-button w-full bg-purple-600 text-white py-5 text-xl rounded-2xl">
              {isLoading ? <Loader2 className="animate-spin mx-auto"/> : 'Send OTP! 📨'}
            </button>
          </form>
        )}
        
        {authView === 'otp' && (
          <form onSubmit={handleOtpSubmit} className="space-y-4">
            <input required type="text" placeholder="_ _ _ _ _ _" value={otp} onChange={e => setOtp(e.target.value)} maxLength={6} className="w-full p-4 border-4 border-black rounded-2xl font-black text-center text-3xl tracking-[0.5em]" />
            <button type="submit" disabled={isLoading} className="fun-button w-full bg-green-500 text-white py-5 text-xl rounded-2xl">
              {isLoading ? <Loader2 className="animate-spin mx-auto"/> : 'Verify & Go! ✅'}
            </button>
          </form>
        )}
        
        <div className="flex items-center gap-4">
          <div className="h-1 flex-1 bg-black/10 rounded-full"></div>
          <span className="font-black text-xs text-black/40">OR</span>
          <div className="h-1 flex-1 bg-black/10 rounded-full"></div>
        </div>

        {authView !== 'email' ? (
           <button onClick={() => setAuthView('email')} disabled={isLoading} className="fun-button w-full bg-white text-black py-4 flex items-center justify-center gap-3">
            <Mail size={20}/> Continue with Email
          </button>
        ) : (
          <>
            <button onClick={handleGoogleLogin} disabled={isLoading} className="fun-button w-full bg-white text-black py-4 flex items-center justify-center gap-3">
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
              Continue with Google
            </button>
            <button onClick={() => setAuthView('phone')} disabled={isLoading} className="fun-button w-full bg-white text-black py-4 flex items-center justify-center gap-3">
              <Phone size={20}/> Continue with Phone
            </button>
          </>
        )}
        
        {authView !== 'email' && (
           <button onClick={() => setAuthView('email')} className="text-center w-full text-xs font-bold text-slate-400 hover:text-black mt-4">
             &larr; Back to Email Login
           </button>
        )}
      </div>
    </div>
  );
};

export default Login;