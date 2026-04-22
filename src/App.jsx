import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun, Menu, Search, Bell } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Board from './components/Board';
import FAB from './components/FAB';
import TaskModal from './components/TaskModal';
import { auth, signInWithGoogle, logoutUser } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalDefaultStatus, setModalDefaultStatus] = useState('todo');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem('cloudpulse_theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    const handleResize = () => {
      if (window.innerWidth < 1024) setIsSidebarOpen(false);
      else setIsSidebarOpen(true);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    if (newTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('cloudpulse_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('cloudpulse_theme', 'light');
    }
  };

  const openModal = (status = 'todo') => {
    setModalDefaultStatus(status);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans transition-colors duration-300 flex">
      <Sidebar 
        isOpen={isSidebarOpen} 
        user={user} 
        onLogin={signInWithGoogle} 
        onLogout={logoutUser} 
      />
      
      <main className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64 ml-20' : 'ml-20'}`}>
        
        {/* Header */}
        <header className="sticky top-0 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors bg-transparent border-none outline-none cursor-pointer"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100 hidden sm:block tracking-tight">Dashboard</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search tasks..." 
                className="pl-9 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-full text-sm focus:ring-2 focus:ring-blue-500 outline-none w-64 text-slate-700 dark:text-slate-200 placeholder-slate-500 transition-shadow"
              />
            </div>
            
            <button className="relative text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer border-none bg-transparent">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
            </button>

            <button 
              onClick={toggleTheme} 
              className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors focus:outline-none cursor-pointer border-none bg-transparent"
              aria-label="Toggle Theme"
            >
              <motion.div animate={{ rotate: isDarkMode ? 360 : 0 }} transition={{ duration: 0.5, ease: "easeInOut" }}>
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </motion.div>
            </button>

            {user ? (
              <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`} alt="Profile" className="w-8 h-8 rounded-full shadow-sm border-2 border-white dark:border-slate-800 flex-shrink-0" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 cursor-pointer shadow-sm border-2 border-white dark:border-slate-800 flex-shrink-0"></div>
            )}
          </div>
        </header>

        {/* Board Content */}
        <div className="flex-1 p-6 flex flex-col h-[calc(100vh-73px)] overflow-hidden">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-1 tracking-tight">Active Sprint</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Keep track of your team's progress and upcoming tasks.</p>
          </div>
          
          <Board openModal={openModal} />
        </div>
      </main>

      <FAB onClick={() => openModal('todo')} />

      <TaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        defaultStatus={modalDefaultStatus}
        user={user}
      />
    </div>
  );
}

export default App;
