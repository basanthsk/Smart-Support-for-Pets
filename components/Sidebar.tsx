
import React from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  Home, 
  MessageSquare, 
  LogOut, 
  X,
  ChevronLeft,
  ChevronRight,
  Stethoscope,
  Dog,
  Settings,
  Send,
  User as UserIcon,
  LayoutGrid,
  UserSearch,
  Activity
} from 'lucide-react';
import { AppRoutes } from '../types';
import { logout } from '../services/firebase';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

const NavItem: React.FC<{
  item: { label: string; path: string; icon: React.ElementType };
  isActive: boolean;
  isCollapsed: boolean;
  setIsOpen: (open: boolean) => void;
}> = ({ item, isActive, isCollapsed, setIsOpen }) => {
  return (
    <div className="relative">
      <Link
        to={item.path}
        onClick={() => setIsOpen(false)}
        className={`
          group flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 w-full
          ${isActive 
            ? 'bg-theme text-white shadow-lg shadow-theme/20' 
            : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}
          ${isCollapsed ? 'justify-center' : ''}
        `}
      >
        <div className={`
          absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-white rounded-r-full
          transition-all duration-300
          ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}
        `}></div>
        
        <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} className="shrink-0 z-10" />
        
        {!isCollapsed && (
          <span className="text-sm font-bold tracking-tight whitespace-nowrap z-10">{item.label}</span>
        )}
      </Link>
      
      {isCollapsed && (
        <div className="
          absolute left-full top-1/2 -translate-y-1/2 ml-4 px-3 py-1.5
          bg-slate-800 text-white text-xs font-bold rounded-lg shadow-lg
          opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-300
          pointer-events-none whitespace-nowrap z-50
        ">
          {item.label}
          <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-slate-800 rotate-45"></div>
        </div>
      )}
    </div>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen, isCollapsed, setIsCollapsed }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const menuGroups = [
    {
      title: "Navigation",
      items: [
        { label: 'Dashboard', path: AppRoutes.HOME, icon: Home },
        { label: 'AI Assistant', path: AppRoutes.AI_ASSISTANT, icon: MessageSquare },
        { label: 'Care Plans', path: AppRoutes.PET_CARE, icon: Activity },
      ]
    },
    {
      title: "Social",
      items: [
        { label: 'Feed', path: AppRoutes.CREATE_POST, icon: LayoutGrid },
        { label: 'Direct Messages', path: AppRoutes.CHAT, icon: Send },
        { label: 'Discover', path: AppRoutes.FIND_FRIENDS, icon: UserSearch },
      ]
    },
    {
      title: "Management",
      items: [
        { label: 'Medical History', path: AppRoutes.HEALTH_CHECKUP, icon: Stethoscope },
        { label: 'Profiles', path: AppRoutes.PET_PROFILE, icon: Dog },
      ]
    }
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const LOGO_URL = "https://res.cloudinary.com/dazlddxht/image/upload/v1768234409/SS_Paw_Pal_Logo_aceyn8.png";

  return (
    <>
      {/* Mobile Backdrop */}
      <div 
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] md:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar Main */}
      <aside className={`
        fixed inset-y-0 left-0 z-[70] bg-white border-r border-slate-100 
        transform transition-all duration-300 ease-in-out
        md:relative md:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        ${isCollapsed ? 'md:w-24' : 'md:w-64 lg:w-72'}
        flex flex-col
      `}>
        
        {/* Header/Logo */}
        <div className={`h-20 flex items-center shrink-0 ${isCollapsed ? 'justify-center' : 'px-6'}`}>
          <Link to={AppRoutes.HOME} className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl p-1.5 border border-slate-200 flex-shrink-0 shadow-sm">
              <img src={LOGO_URL} alt="Logo" className="w-full h-full object-contain" />
            </div>
            {!isCollapsed && (
              <span className="font-bold text-slate-800 text-lg tracking-tight whitespace-nowrap overflow-hidden transition-all duration-300">
                Paw Pal <span className="text-theme font-black">Pro</span>
              </span>
            )}
          </Link>
          <button onClick={() => setIsOpen(false)} className="md:hidden ml-auto p-2 text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar-hide">
          {menuGroups.map((group, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <hr className={`border-slate-100 transition-all duration-300 ${isCollapsed ? 'mx-4 my-4' : 'mx-2 my-6'}`} />}
              <div className="space-y-1">
                {!isCollapsed && (
                  <h3 className="px-4 pt-2 pb-1 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
                    {group.title}
                  </h3>
                )}
                {group.items.map((item) => (
                  <NavItem 
                    key={item.path}
                    item={item}
                    isActive={location.pathname === item.path || (item.path === AppRoutes.PET_PROFILE && location.pathname === AppRoutes.HEALTH_CHECKUP)}
                    isCollapsed={isCollapsed}
                    setIsOpen={setIsOpen}
                  />
                ))}
              </div>
            </React.Fragment>
          ))}
        </nav>

        {/* Profile/Footer Section */}
        <div className="p-4 mt-auto">
          <div className="bg-slate-50 rounded-2xl p-2 space-y-1 border border-slate-100">
            <div className="relative group">
              <Link 
                to={AppRoutes.SETTINGS}
                className={`flex items-center gap-3 p-2 rounded-xl hover:bg-white hover:shadow-sm transition-all ${isCollapsed ? 'justify-center' : ''}`}
              >
                <div className="w-9 h-9 rounded-lg overflow-hidden border-2 border-white shadow-sm shrink-0">
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt="User" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400"><UserIcon size={16} /></div>
                  )}
                </div>
                {!isCollapsed && (
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-800 truncate leading-tight">{user?.displayName || 'Parent'}</p>
                    <p className="text-[10px] text-slate-400 font-medium mt-0.5 truncate">Account Settings</p>
                  </div>
                )}
              </Link>
              {isCollapsed && (
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-4 px-3 py-1.5 bg-slate-800 text-white text-xs font-bold rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-300 pointer-events-none z-50">
                  Settings
                  <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-slate-800 rotate-45"></div>
                </div>
              )}
            </div>

            <div className="relative group">
              <button
                onClick={handleLogout}
                className={`w-full flex items-center gap-3 p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50/50 transition-all ${isCollapsed ? 'justify-center' : ''}`}
              >
                <LogOut size={18} />
                {!isCollapsed && <span className="text-xs font-bold">Sign Out</span>}
              </button>
              {isCollapsed && (
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-4 px-3 py-1.5 bg-slate-800 text-white text-xs font-bold rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-300 pointer-events-none z-50">
                  Sign Out
                  <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-slate-800 rotate-45"></div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Desktop Collapse Toggle */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex absolute -right-4 top-20 w-8 h-8 bg-white border border-slate-200 rounded-full shadow-lg items-center justify-center text-slate-400 hover:text-theme hover:scale-110 hover:shadow-xl transition-all z-[80] active:scale-95"
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </aside>
    </>
  );
};

export default Sidebar;
