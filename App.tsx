import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import HumanizePage from './pages/HumanizePage';
import AnalyzePage from './pages/AnalyzePage';
import TextToAIPage from './pages/TextToAIPage';

const App: React.FC = () => {
  // Initialize theme based on system preference
  const [darkMode, setDarkMode] = useState(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return true;
    }
    return false;
  });

  // Apply theme class to html element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(!darkMode);

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300">
        <Navbar darkMode={darkMode} toggleTheme={toggleTheme} />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/humanize" element={<HumanizePage />} />
            <Route path="/analyze" element={<AnalyzePage />} />
            <Route path="/text-to-ai" element={<TextToAIPage />} />
          </Routes>
        </main>
        <footer className="py-6 text-center text-slate-400 dark:text-slate-600 text-sm">
          <p>© {new Date().getFullYear()} HumanizeAI. Local Processing. No Data Sent.</p>
        </footer>
      </div>
    </Router>
  );
};

export default App;