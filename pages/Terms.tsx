
import React from 'react';
import { ArrowLeft, Shield, AlertCircle, FileText, Info, Gavel } from 'lucide-react';
import { useNavigate } from "react-router-dom";

const Terms: React.FC = () => {
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
        <div className="bg-indigo-600 p-12 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl border border-white/20">
                <Gavel size={32} />
              </div>
              <h1 className="text-4xl font-black tracking-tight leading-none">Terms & Conditions</h1>
            </div>
            <p className="text-indigo-100 font-medium">SS Paw Pal</p>
            <p className="text-xs font-black uppercase tracking-widest opacity-60">Last Updated: {lastUpdated}</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-12 md:p-16 space-y-12">
          <section className="space-y-4">
            <p className="text-slate-600 font-medium leading-relaxed">
              Welcome to SS Paw Pal (“SS Paw Pal”, “we”, “our”, “us”). By accessing or using this website, you agree to comply with and be bound by the following Terms and Conditions. If you do not agree, please do not use the website.
            </p>
          </section>

          <div className="space-y-10">
            <section className="space-y-4">
              <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 text-sm">1</span>
                Purpose of the Platform
              </h2>
              <div className="pl-11 text-slate-600 space-y-3 font-medium">
                <p>SS Paw Pal is a web-based community platform designed to:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Allow pet owners to connect and share experiences</li>
                  <li>Provide general, AI-powered pet care guidance</li>
                  <li>Foster a supportive and educational environment for pet owners</li>
                </ul>
                <p className="font-bold text-indigo-600">SS Paw Pal does not replace professional veterinary services.</p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 text-sm">2</span>
                User Eligibility
              </h2>
              <ul className="pl-11 text-slate-600 space-y-3 font-medium list-disc ml-5">
                <li>Users must provide accurate and truthful information during registration.</li>
                <li>Users are responsible for maintaining the confidentiality of their login credentials.</li>
                <li>You agree not to misuse the platform or engage in harmful activities.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 text-sm">3</span>
                User Accounts
              </h2>
              <ul className="pl-11 text-slate-600 space-y-3 font-medium list-disc ml-5">
                <li>Account creation requires a valid email address.</li>
                <li>You are responsible for all activity under your account.</li>
                <li>SS Paw Pal reserves the right to suspend or terminate accounts that violate these terms.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 text-sm">4</span>
                Community Content
              </h2>
              <div className="pl-11 text-slate-600 space-y-3 font-medium">
                <p>Users may post questions, experiences, and comments related to pet care. You agree that:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Content must be respectful and appropriate</li>
                  <li>No abusive, harmful, or misleading content is allowed</li>
                  <li>You will not post false medical claims or dangerous advice</li>
                </ul>
                <p>SS Paw Pal reserves the right to remove any content that violates these rules.</p>
              </div>
            </section>

            <section className="p-8 bg-amber-50 rounded-[2.5rem] border border-amber-100 space-y-4">
              <h2 className="text-2xl font-black text-amber-900 flex items-center gap-3">
                <AlertCircle className="text-amber-600" />
                AI-Powered Assistance Disclaimer
              </h2>
              <div className="text-amber-800/80 space-y-3 font-medium italic">
                <p>The AI assistant provided by SS Paw Pal:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Offers general pet care, nutrition, and training guidance</li>
                  <li>Does NOT provide medical diagnoses</li>
                  <li>Should NOT be treated as professional veterinary advice</li>
                </ul>
                <p className="font-black text-amber-900 uppercase tracking-tight">⚠️ Always consult a licensed veterinarian for serious health concerns.</p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 text-sm">6</span>
                Data Usage & Privacy
              </h2>
              <ul className="pl-11 text-slate-600 space-y-3 font-medium list-disc ml-5">
                <li>User data is stored securely using Firebase services.</li>
                <li>Pet profile data is used only to personalize user experience and AI responses.</li>
                <li>SS Paw Pal does not sell or misuse user data.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 text-sm">7</span>
                Limitation of Liability
              </h2>
              <p className="pl-11 text-slate-600 font-medium leading-relaxed">
                SS Paw Pal is not responsible for actions taken based on AI responses, user-generated content accuracy, or any loss or damage resulting from use of the platform. Use the platform at your own discretion.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 text-sm">8</span>
                Intellectual Property
              </h2>
              <ul className="pl-11 text-slate-600 space-y-3 font-medium list-disc ml-5">
                <li>All platform content, branding, and design belong to SS Paw Pal.</li>
                <li>Users retain ownership of the content they create but grant SS Paw Pal permission to display it on the platform.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 text-sm">9</span>
                Account Termination
              </h2>
              <ul className="pl-11 text-slate-600 space-y-3 font-medium list-disc ml-5">
                <li>SS Paw Pal reserves the right to suspend or terminate accounts that violate these terms.</li>
                <li>SS Paw Pal reserves the right to remove content without prior notice if necessary.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 text-sm">10</span>
                Changes to Terms
              </h2>
              <p className="pl-11 text-slate-600 font-medium leading-relaxed">
                SS Paw Pal may update these Terms and Conditions at any time. Continued use of the platform indicates acceptance of updated terms.
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

export default Terms;
