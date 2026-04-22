import React from 'react';
import { motion } from 'framer-motion';
import { CheckSquare, Users, Activity, Settings, LogOut, LogIn } from 'lucide-react';

export default function Sidebar({ isOpen, user, onLogin, onLogout }) {
  return (
    <motion.aside
      className={`fixed left-0 top-0 h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col items-start px-4 py-8 z-20 ${isOpen ? 'w-64' : 'w-20'} transition-all duration-300`}
    >
      <div className="flex items-center gap-3 mb-10 w-full px-2">
        <div className="bg-blue-600 text-white p-2 rounded-lg flex-shrink-0">
          <Activity size={24} />
        </div>
        {isOpen && <span className="font-bold text-xl tracking-tight whitespace-nowrap">Cloud Pulse</span>}
      </div>

      <nav className="flex-1 w-full flex flex-col gap-2">
        <SidebarItem icon={<CheckSquare size={20} />} label="Tasks" active isOpen={isOpen} />
        <SidebarItem icon={<Users size={20} />} label="Team" isOpen={isOpen} />
        <SidebarItem icon={<Activity size={20} />} label="Activity" isOpen={isOpen} />
      </nav>

      <div className="w-full flex flex-col gap-2 border-t border-slate-100 dark:border-slate-800 pt-4 mt-auto">
        <SidebarItem icon={<Settings size={20} />} label="Settings" isOpen={isOpen} />
        
        {user ? (
          <div className="mt-4 flex flex-col gap-3">
            <div className={`flex items-center gap-3 px-3 py-2 rounded-lg ${!isOpen ? 'justify-center' : ''} overflow-hidden`}>
              <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`} alt="Profile" className="w-8 h-8 rounded-full shadow-sm flex-shrink-0" />
              {isOpen && (
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">{user.displayName}</span>
                  <span className="text-xs text-slate-500 truncate">{user.email}</span>
                </div>
              )}
            </div>
            <button 
              onClick={onLogout}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 border-none outline-none bg-transparent w-full ${!isOpen ? 'justify-center' : ''}`}
            >
              <LogOut size={20} className="flex-shrink-0" />
              {isOpen && <span className="font-medium text-sm whitespace-nowrap">Sign Out</span>}
            </button>
          </div>
        ) : (
           <button 
              onClick={onLogin}
              className={`mt-4 flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 border border-blue-200 dark:border-blue-900 outline-none bg-transparent w-full ${!isOpen ? 'justify-center' : ''}`}
            >
              <LogIn size={20} className="flex-shrink-0" />
              {isOpen && <span className="font-medium text-sm whitespace-nowrap">Sign in with Google</span>}
            </button>
        )}
      </div>
    </motion.aside>
  );
}

function SidebarItem({ icon, label, active, isOpen }) {
  return (
    <div
      className={`flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer transition-all duration-200 
      ${active ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50'}
      ${!isOpen ? 'justify-center' : ''}`}
    >
      <div className="flex-shrink-0">{icon}</div>
      {isOpen && <span className="font-medium text-sm whitespace-nowrap overflow-hidden">{label}</span>}
    </div>
  );
}
