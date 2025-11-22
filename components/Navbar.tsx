import React from 'react';
import { BrainCircuit, ScanSearch, Edit3, Sparkles, Home, Sun, Moon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface NavbarProps {
  darkMode: boolean;
  toggleTheme: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ darkMode, toggleTheme }) => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

  const navLinkClass = (path: string) => `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium h-full transition-colors duration-200 ${
    isActive(path) 
      ? 'border-indigo-500 text-slate-900 dark:text-white' 
      : 'border-transparent text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-700 dark:hover:text-slate-200'
  }`;

  const mobileNavLinkClass = (path: string) => `flex justify-center items-center py-3 text-sm font-medium ${
     isActive(path) 
       ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-slate-800' 
       : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
  }`;

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <BrainCircuit className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-xl text-slate-800 dark:text-white tracking-tight">Humanize<span className="text-indigo-600 dark:text-indigo-400">AI</span></span>
            </Link>
            <div className="hidden sm:ml-10 sm:flex sm:space-x-8">
              <Link to="/" className={navLinkClass('/')}>
                <Home className="w-4 h-4 mr-2" />
                Home
              </Link>
              <Link to="/humanize" className={navLinkClass('/humanize')}>
                <Edit3 className="w-4 h-4 mr-2" />
                Humanize
              </Link>
              <Link to="/text-to-ai" className={navLinkClass('/text-to-ai')}>
                <Sparkles className="w-4 h-4 mr-2" />
                Text to AI
              </Link>
              <Link to="/analyze" className={navLinkClass('/analyze')}>
                <ScanSearch className="w-4 h-4 mr-2" />
                Analyze
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:block px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-semibold rounded-full border border-indigo-100 dark:border-indigo-800">
              Local Mode: Secure
            </div>
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Toggle Dark Mode"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Menu */}
      <div className="sm:hidden border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
         <div className="grid grid-cols-4">
             <Link to="/" className={mobileNavLinkClass('/')}>
                 <Home className="w-4 h-4" />
              </Link>
             <Link to="/humanize" className={mobileNavLinkClass('/humanize')}>
                 <Edit3 className="w-4 h-4" />
              </Link>
              <Link to="/text-to-ai" className={mobileNavLinkClass('/text-to-ai')}>
                 <Sparkles className="w-4 h-4" />
              </Link>
              <Link to="/analyze" className={mobileNavLinkClass('/analyze')}>
                 <ScanSearch className="w-4 h-4" />
              </Link>
         </div>
      </div>
    </nav>
  );
};

export default Navbar;