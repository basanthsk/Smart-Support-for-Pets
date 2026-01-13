
import React from 'react';
import { Stethoscope, Heart, Shield, FlaskConical, ClipboardList } from 'lucide-react';

const HealthCheckup: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto pb-32 space-y-12 animate-in fade-in">
      <div className="rotate-[-1deg] sticker-card bg-white p-6 border-4 border-black inline-block">
        <h2 className="text-5xl font-black text-black tracking-tight">🏥 VET HELP & CHECKUPS</h2>
        <p className="text-xl font-bold text-red-500">Your pet's health is #1!</p>
      </div>

      <div className="sticker-card bg-red-500 p-12 text-center text-white border-4 border-black space-y-8 rotate-[1deg]">
        <div className="inline-block p-6 bg-white border-4 border-black rounded-full shadow-[6px_6px_0px_0px_#000]">
            <Stethoscope size={64} className="text-black" />
        </div>
        <h2 className="text-4xl font-black">THIS COOL PAGE IS COMING SOON!</h2>
        <p className="text-xl font-bold">
          We're working with super smart vets to build something amazing for you and your pet!
        </p>
        <div className="fun-button bg-white text-black px-8 py-4 rounded-full text-lg inline-block">
          STAY TUNED! 📡
        </div>
      </div>
      
      <div className="sticker-card bg-white p-10 border-4 border-black space-y-6">
        <h3 className="text-2xl font-black text-center">WHAT TO EXPECT:</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-red-100 border-2 border-black rounded-2xl flex items-center justify-center mx-auto shadow-[3px_3px_0px_0px_#000]">
                <ClipboardList className="text-red-500" size={32} />
            </div>
            <p className="font-black">Symptom Checker</p>
          </div>
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-blue-100 border-2 border-black rounded-2xl flex items-center justify-center mx-auto shadow-[3px_3px_0px_0px_#000]">
                <Shield className="text-blue-500" size={32} />
            </div>
            <p className="font-black">Vaccine Tracker</p>
          </div>
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-green-100 border-2 border-black rounded-2xl flex items-center justify-center mx-auto shadow-[3px_3px_0px_0px_#000]">
                <Heart className="text-green-500" size={32} />
            </div>
            <p className="font-black">Local Vet Finder</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthCheckup;
