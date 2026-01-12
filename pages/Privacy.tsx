
import React from 'react';
import { ArrowLeft, Shield, Lock, Eye, Database, Users, AlertCircle, Bot } from 'lucide-react';
import { useNavigate } from "react-router-dom";

const Privacy: React.FC = () => {
  const navigate = useNavigate();
  const lastUpdated = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div className="max-w-4xl mx-auto pb-32 space-y-10 animate-fade-in">
      <button 
        onClick={() => navigate(-1)}
        className="group flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-bold transition-all"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
        Back
      </button>

      <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-emerald-600 p-12 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl border border-white/20">
                <Lock size={32} />
              </div>
              <h1 className="text-4xl font-black tracking-tight leading-none">Privacy Policy</h1>
            </div>
            <p className="text-emerald-50 font-medium">SS Paw Pal</p>
            <p className="text-xs font-black uppercase tracking-widest opacity-60">Last Updated: {lastUpdated}</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-12 md:p-16 space-y-12">
          <section className="space-y-4">
            <p className="text-slate-600 font-medium leading-relaxed">
              SS Paw Pal (“SS Paw Pal”, “we”, “our”, “us”) values your privacy. This Privacy Policy explains how we collect, use, store, and protect your information when you use our website. By using SS Paw Pal, you agree to the practices described in this policy.
            </p>
          </section>

          <div className="space-y-10">
            <section className="space-y-6">
              <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><Database size={20} /></div>
                1. Information We Collect
              </h2>
              <div className="pl-11 space-y-6">
                <div className="space-y-2">
                  <h4 className="font-black text-slate-700 text-sm uppercase tracking-widest">a) Personal Information</h4>
                  <p className="text-slate-600 font-medium">When you create an account, we may collect: Email address and Authentication details (managed securely by Firebase).</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-black text-slate-700 text-sm uppercase tracking-widest">b) Pet Information</h4>
                  <p className="text-slate-600 font-medium">To personalize your experience and AI responses, we may collect: Pet name, Pet type, Pet age, Breed (optional), and Health notes (optional).</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-black text-slate-700 text-sm uppercase tracking-widest">c) Usage Data</h4>
                  <p className="text-slate-600 font-medium">Pages visited, Features used (community posts, AI assistant), and AI interactions (not used to identify you personally).</p>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><Eye size={20} /></div>
                2. How We Use Your Information
              </h2>
              <ul className="pl-11 text-slate-600 space-y-3 font-medium list-disc ml-5">
                <li>Provide secure login and account management</li>
                <li>Enable community interaction</li>
                <li>Personalize AI-powered pet guidance</li>
                <li>Improve website functionality and user experience</li>
                <li>Ensure platform safety and reliability</li>
              </ul>
            </section>

            <section className="p-8 bg-indigo-50 rounded-[2.5rem] border border-indigo-100 space-y-4">
              <h2 className="text-2xl font-black text-indigo-900 flex items-center gap-3">
                <Bot className="text-indigo-600" />
                3. AI Data Usage
              </h2>
              <div className="text-indigo-800/80 space-y-3 font-medium">
                <ul className="list-disc pl-5 space-y-2">
                  <li>AI responses are generated using Google Gemini via Google AI Studio</li>
                  <li>Pet profile details may be used as context for better responses</li>
                  <li>AI does not store or remember personal conversations outside the session</li>
                  <li>AI does not provide medical diagnoses</li>
                </ul>
                <p className="font-black text-indigo-900 uppercase tracking-tight flex items-center gap-2 pt-2">
                  <AlertCircle size={16} /> ⚠️ AI guidance is for general information only and does not replace professional veterinary advice.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><Shield size={20} /></div>
                4. Data Storage & Security
              </h2>
              <ul className="pl-11 text-slate-600 space-y-3 font-medium list-disc ml-5">
                <li>User data is stored securely using Firebase Authentication and Firestore</li>
                <li>We use industry-standard security practices</li>
                <li>We do not sell, rent, or misuse your personal information</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><Users size={20} /></div>
                5. Data Sharing
              </h2>
              <p className="pl-11 text-slate-600 font-medium leading-relaxed">
                We do not share your personal data with third parties except when required by law or to provide core services (Firebase, Google AI services).
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 text-sm">6</span>
                User Rights
              </h2>
              <ul className="pl-11 text-slate-600 space-y-3 font-medium list-disc ml-5">
                <li>Access your personal information</li>
                <li>Update your pet profile and account details</li>
                <li>Delete your account (via Settings)</li>
                <li>Stop using the platform at any time</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 text-sm">7</span>
                Cookies & Tracking
              </h2>
              <ul className="pl-11 text-slate-600 space-y-3 font-medium list-disc ml-5">
                <li>SS Paw Pal may use minimal cookies for authentication and session management</li>
                <li>No third-party advertising cookies are used</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 text-sm">8</span>
                Children’s Privacy
              </h2>
              <p className="pl-11 text-slate-600 font-medium leading-relaxed">
                SS Paw Pal is intended for general use. If users are under the age of 13, parental guidance is recommended.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 text-sm">9</span>
                Changes to This Privacy Policy
              </h2>
              <p className="pl-11 text-slate-600 font-medium leading-relaxed">
                We may update this Privacy Policy occasionally. Any changes will be posted on this page with an updated date. Continued use of SS Paw Pal indicates acceptance of the updated policy.
              </p>
            </section>
          </div>
        </div>

        {/* Footer */}
        <div className="p-12 border-t border-slate-50 bg-slate-50/50 text-center">
          <p className="text-slate-400 font-bold text-sm">SS Paw Pal © 2025</p>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
