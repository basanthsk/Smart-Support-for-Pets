
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  MessageSquare, 
  PlusSquare, 
  Dog, 
  LogOut, 
  X,
  ChevronLeft,
  ChevronRight,
  Stethoscope,
  Settings,
  Sparkles
} from 'lucide-react';
import { AppRoutes, NavItem } from '../types';
import { logout } from '../services/firebase';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen, isCollapsed, setIsCollapsed }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems: NavItem[] = [
    { label: 'Home', path: AppRoutes.HOME, icon: Home },
    { label: 'AI Assistant', path: AppRoutes.AI_ASSISTANT, icon: MessageSquare },
    { label: 'Pet Care & Fun', path: AppRoutes.PET_CARE, icon: Sparkles },
    { label: 'Community Feed', path: AppRoutes.CREATE_POST, icon: PlusSquare },
    { label: 'Health Checkup', path: AppRoutes.HEALTH_CHECKUP, icon: Stethoscope },
    { label: 'Pet Profile', path: AppRoutes.PET_PROFILE, icon: Dog },
    { label: 'Settings', path: AppRoutes.SETTINGS, icon: Settings },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error("Sidebar logout error:", error);
    }
  };

  const sidebarClasses = `
    fixed inset-y-0 left-0 z-50 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out
    md:relative md:translate-x-0 md:transition-[width]
    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    ${isCollapsed ? 'md:w-20' : 'md:w-64'}
    w-64 flex flex-col border-r border-slate-100
  `;

  const LOGO_URL = "https://res.cloudinary.com/dazlddxht/image/upload/v1768111415/Smart_Support_for_Pets_tpteed.png";

  return (
    <>
      <div 
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
      />

      <aside className={sidebarClasses}>
        <div className={`h-16 flex items-center justify-between px-4 flex-shrink-0 transition-colors duration-300 ${!isCollapsed || isOpen ? 'bg-indigo-600' : 'bg-white border-b border-slate-50'}`}>
          <div className={`flex items-center gap-3 overflow-hidden transition-all duration-300 ${isCollapsed ? 'md:justify-center w-full' : ''}`}>
            <div className={`w-10 h-10 rounded-xl flex-shrink-0 shadow-lg overflow-hidden flex items-center justify-center ${!isCollapsed || isOpen ? 'bg-white shadow-indigo-900/20' : 'bg-indigo-600 shadow-indigo-100'}`}>
              <img src={LOGO_URL} alt="Logo" className="w-8 h-8 object-contain" />
            </div>
            {!isCollapsed && (
              <span className="font-bold text-base text-white whitespace-nowrap tracking-tight">Smart Support for Pets</span>
            )}
          </div>
          
          <button 
            onClick={() => setIsOpen(false)}
            className="md:hidden p-2 text-white/80 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>

          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`hidden md:flex p-1.5 absolute -right-3 top-20 bg-white border border-slate-200 rounded-full shadow-sm hover:shadow-md transition-all text-slate-400 hover:text-indigo-600 z-50 active:scale-90`}
          >
            {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto overflow-x-hidden custom-scrollbar">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative
                  ${isActive 
                    ? 'bg-indigo-50 text-indigo-700 font-bold shadow-sm shadow-indigo-50/50' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
                  ${isCollapsed ? 'md:justify-center' : ''}
                `}
              >
                <item.icon size={22} className={`${isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600 group-hover:scale-110 transition-transform'}`} />
                {(!isCollapsed || !isOpen) && (
                  <span className={`md:${isCollapsed ? 'hidden' : 'block'} text-sm`}>{item.label}</span>
                )}
                
                {isCollapsed && (
                   <div className="absolute left-16 bg-slate-800 text-white px-2 py-1.5 rounded-lg text-xs opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity hidden md:block z-[60] whitespace-nowrap shadow-xl">
                    {item.label}
                   </div>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className={`
              w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-colors
              text-slate-500 hover:bg-rose-50 hover:text-rose-600 group relative
              ${isCollapsed ? 'md:justify-center' : ''}
            `}
          >
            <LogOut size={22} className="text-slate-400 group-hover:text-rose-500 transition-colors" />
            {!isCollapsed && <span className="md:block text-sm font-medium">Logout</span>}
            {isCollapsed && (
              <div className="absolute left-16 bg-rose-600 text-white px-2 py-1.5 rounded-lg text-xs opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity hidden md:block z-[60] whitespace-nowrap shadow-xl">
                Logout
              </div>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
