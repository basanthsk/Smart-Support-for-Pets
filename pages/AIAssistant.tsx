
import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Bot, 
  MessageSquareText, 
  Send, 
  Loader2, 
  History, 
  PlusCircle, 
  ChevronRight,
  MessageSquare,
  User as UserIcon
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { useAuth } from '../context/AuthContext';
import { db, createAIChatSession, saveAIChatMessage, getAIChatMessages } from '../services/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { AIChatSession, AIChatMessage } from '../types';

const AIAssistant: React.FC = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<AIChatSession[]>([]);
  const [activeSession, setActiveSession] = useState<AIChatSession | null>(null);
  const [messages, setMessages] = useState<AIChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const LOGO_URL = "https://res.cloudinary.com/dazlddxht/image/upload/v1768234409/SS_Paw_Pal_Logo_aceyn8.png";

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "users", user.uid, "ai_chats"), orderBy("lastTimestamp", "desc"));
    return onSnapshot(q, (snapshot) => {
      setSessions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AIChatSession)));
    });
  }, [user]);

  useEffect(() => {
    if (activeSession && user) {
      getAIChatMessages(user.uid, activeSession.id).then(setMessages);
    } else {
      setMessages([]);
    }
  }, [activeSession, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleStartNewSession = async () => {
    if (!user) return;
    const title = `Consultation ${new Date().toLocaleDateString()}`;
    const id = await createAIChatSession(user.uid, title);
    setActiveSession({ id, userId: user.uid, title, lastTimestamp: new Date() });
    setIsSidebarOpen(false);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !user || isTyping) return;

    let sessionId = activeSession?.id;
    if (!sessionId) {
      const title = input.slice(0, 30) + '...';
      sessionId = await createAIChatSession(user.uid, title);
      setActiveSession({ id: sessionId, userId: user.uid, title, lastTimestamp: new Date() });
    }

    // Fix: Added missing timestamp to satisfy AIChatMessage type (Line 74)
    const userMsg: AIChatMessage = { role: 'user', parts: [{ text: input }], timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      await saveAIChatMessage(user.uid, sessionId, userMsg);
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Load history for context
      const chatHistory = messages.map(m => ({
        role: m.role,
        parts: m.parts,
      }));

      const chat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
          systemInstruction: 'You are SS Paw Pal, a highly knowledgeable AI pet care specialist. Provide safe, supportive, and evidence-based advice on health, nutrition, behavior, and wellness for all kinds of pets. Always recommend a veterinarian for emergencies.',
        },
        history: chatHistory,
      });

      // Simple implementation for streaming if needed, but for history we'll just use sendMessage
      const response = await chat.sendMessage({ message: userMsg.parts[0].text });
      // Fix: Added missing timestamp to satisfy AIChatMessage type (Line 98)
      const modelMsg: AIChatMessage = { role: 'model', parts: [{ text: response.text || '' }], timestamp: new Date() };
      
      await saveAIChatMessage(user.uid, sessionId, modelMsg);
      setMessages(prev => [...prev, modelMsg]);
    } catch (err) {
      console.error(err);
      // Fix: Added missing timestamp for catch block error message (Line 104)
      setMessages(prev => [...prev, { role: 'model', parts: [{ text: "I encountered a synchronization error. Please try again." }], timestamp: new Date() }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] animate-fade-in gap-4">
      {/* Branded Header Section */}
      <div className="flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-3 bg-white border border-slate-100 rounded-xl shadow-sm hover:bg-slate-50 transition-all"
          >
            <History size={20} className="text-slate-500" />
          </button>
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tighter">AI Specialist</h2>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Active Consultation Session</p>
            </div>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-3 px-5 py-2.5 bg-slate-900 text-white rounded-2xl shadow-xl">
          <Sparkles size={14} className="text-theme" />
          <span className="text-[10px] font-black uppercase tracking-widest">Gemini 3 Pro Engine</span>
        </div>
      </div>

      <div className="flex flex-1 min-h-0 relative gap-6 overflow-hidden">
        {/* Sidebar for Sessions */}
        {isSidebarOpen && (
          <div className="absolute inset-0 md:relative md:w-80 bg-white/80 backdrop-blur-xl border border-slate-100 rounded-[2.5rem] shadow-2xl z-20 flex flex-col overflow-hidden animate-in slide-in-from-left duration-300">
            <div className="p-6 border-b border-slate-50">
              <button 
                onClick={handleStartNewSession}
                className="w-full py-4 bg-theme text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-theme-hover transition-all shadow-lg shadow-theme/20"
              >
                <PlusCircle size={18} /> New Session
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 mb-2">Past Consultations</h4>
              {sessions.map(s => (
                <button 
                  key={s.id}
                  onClick={() => { setActiveSession(s); setIsSidebarOpen(false); }}
                  className={`w-full text-left p-4 rounded-2xl transition-all border ${activeSession?.id === s.id ? 'bg-theme-light border-theme text-theme' : 'bg-slate-50/50 border-transparent hover:bg-slate-50 text-slate-600'}`}
                >
                  <p className="font-bold text-sm truncate">{s.title}</p>
                  <p className="text-[9px] font-black uppercase tracking-widest opacity-50 mt-1">
                    {s.lastTimestamp?.toDate ? s.lastTimestamp.toDate().toLocaleDateString() : 'Just now'}
                  </p>
                </button>
              ))}
              {sessions.length === 0 && (
                <div className="py-20 text-center opacity-20">
                  <MessageSquare size={48} className="mx-auto mb-4" />
                  <p className="text-xs font-black uppercase tracking-widest">No history yet</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Chat Area */}
        <div className="flex-1 bg-white border border-slate-100 rounded-[3rem] shadow-sm flex flex-col relative overflow-hidden group">
          <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 custom-scrollbar">
            {messages.length === 0 && !isTyping && (
              <div className="h-full flex flex-col items-center justify-center text-center max-w-sm mx-auto space-y-6">
                <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center animate-bounce-slow">
                  <Bot size={40} className="text-theme" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-800 tracking-tight">How can I help today?</h3>
                  <p className="text-sm text-slate-400 font-medium leading-relaxed">Ask about nutrition, behavior, or wellness for any pet species.</p>
                </div>
                <div className="grid grid-cols-1 gap-2 w-full">
                  {['"What should I feed a 4-month puppy?"', '"Why is my cat scratching the sofa?"', '"Healthy treats for hamsters?"'].map(q => (
                    <button 
                      key={q} 
                      onClick={() => setInput(q.replace(/"/g, ''))}
                      className="p-3 bg-slate-50 rounded-xl text-[11px] font-bold text-slate-500 hover:bg-theme-light hover:text-theme transition-all"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                <div className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center shadow-sm ${msg.role === 'user' ? 'bg-slate-900 text-white' : 'bg-theme text-white'}`}>
                    {msg.role === 'user' ? <UserIcon size={14} /> : <Bot size={14} />}
                  </div>
                  <div className={`p-5 rounded-[2rem] text-sm font-medium leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-slate-900 text-white rounded-tr-none' : 'bg-slate-50 text-slate-800 rounded-tl-none border border-slate-100'}`}>
                    {msg.parts[0].text}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start animate-in fade-in">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg shrink-0 bg-theme text-white flex items-center justify-center shadow-sm">
                    <Loader2 size={14} className="animate-spin" />
                  </div>
                  <div className="p-5 bg-slate-50 rounded-[2rem] rounded-tl-none border border-slate-100 flex gap-1">
                    <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="p-6 md:p-8 bg-slate-50/50 border-t border-slate-100">
            <div className="max-w-4xl mx-auto relative flex items-center gap-4">
              <input 
                type="text" 
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask about pet care..."
                className="flex-1 bg-white border border-slate-200 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-theme/5 outline-none font-medium text-sm transition-all"
              />
              <button 
                type="submit" 
                disabled={isTyping || !input.trim()}
                className="p-4 bg-theme text-white rounded-2xl shadow-xl hover:bg-theme-hover transition-all active:scale-95 disabled:opacity-50"
              >
                <Send size={24} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
