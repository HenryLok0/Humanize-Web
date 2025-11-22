import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Zap, Infinity, WifiOff, ArrowRight } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8 py-20 bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 transition-colors duration-300">
        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6">
          Write with <span className="text-indigo-600 dark:text-indigo-400">Privacy</span> & <span className="text-indigo-600 dark:text-indigo-400">Power</span>
        </h1>
        <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mb-10 leading-relaxed">
          The ultimate local AI writing assistant. Humanize text, polish drafts, and analyze content—all running 100% on your device.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-16">
          <Link 
            to="/humanize" 
            className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-bold rounded-xl shadow-lg hover:shadow-indigo-500/30 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
          >
            Start Humanizing <ArrowRight className="w-5 h-5" />
          </Link>
          <Link 
            to="/text-to-ai" 
            className="px-8 py-4 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500 text-lg font-bold rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center"
          >
            Polish Text
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl w-full px-4">
          <FeatureCard 
            icon={<Shield className="w-8 h-8 text-emerald-500" />}
            title="100% Local & Private"
            description="Your data never leaves your device. No servers, no cloud, no tracking."
          />
          <FeatureCard 
            icon={<WifiOff className="w-8 h-8 text-blue-500" />}
            title="No API Needed"
            description="Runs completely offline after initial model download. No API keys required."
          />
          <FeatureCard 
            icon={<Infinity className="w-8 h-8 text-purple-500" />}
            title="Unlimited Usage"
            description="Write and rewrite as much as you want. No credit limits or paywalls."
          />
          <FeatureCard 
            icon={<Zap className="w-8 h-8 text-amber-500" />}
            title="Real-time AI"
            description="Powered by advanced local LLMs (Llama 3.2) for instant, intelligent results."
          />
        </div>
      </div>
    </div>
  );
};

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all text-left">
      <div className="mb-4 bg-slate-50 dark:bg-slate-700/50 w-14 h-14 rounded-xl flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
      <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{description}</p>
    </div>
  );
};

export default HomePage;
