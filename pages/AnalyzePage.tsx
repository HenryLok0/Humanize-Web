import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { analyzeText, getStats } from '../services/textProcessingService';
import { AnalysisResult } from '../types';
import { AlertTriangle, Search, ShieldCheck, BarChart3, Zap } from 'lucide-react';

const AnalyzePage: React.FC = () => {
  const [text, setText] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    // Simple debounce or effect if we wanted real-time, but button press is better for heavy logic
  }, [text]);

  const handleAnalyze = () => {
    if (!text.trim()) return;
    setIsAnalyzing(true);
    setTimeout(() => {
        const res = analyzeText(text);
        setResult(res);
        setIsAnalyzing(false);
    }, 600);
  };

  // Chart Data Preparation
  const aiData = result ? [
    { name: 'AI Probability', value: result.aiScore, color: '#ef4444' }, // Red
    { name: 'Human Probability', value: 100 - result.aiScore, color: '#22c55e' }, // Green
  ] : [];

  const readabilityData = result ? [
      { name: 'Score', value: result.readabilityScore }
  ] : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Content Analysis</h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">Detect AI patterns and get actionable suggestions to improve quality.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Column */}
        <div className="flex flex-col gap-4">
           <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 h-full flex flex-col transition-colors">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Content to Analyze</label>
              <textarea
                className="flex-1 w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-900/50 min-h-[300px] placeholder:text-slate-400 dark:placeholder:text-slate-600"
                placeholder="Paste text here to analyze for AI patterns..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <div className="mt-4 flex justify-end">
                 <button 
                    onClick={handleAnalyze}
                    disabled={isAnalyzing || !text}
                    className={`px-6 py-2.5 rounded-lg font-bold text-white flex items-center gap-2 transition-all ${
                        isAnalyzing || !text 
                        ? 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed' 
                        : 'bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg'
                    }`}
                 >
                    {isAnalyzing ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Search className="w-5 h-5" />}
                    Analyze Content
                 </button>
              </div>
           </div>
        </div>

        {/* Results Column */}
        <div className="flex flex-col gap-6">
           {!result ? (
               <div className="bg-slate-50 dark:bg-slate-800/50 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl h-full min-h-[400px] flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 transition-colors">
                   <BarChart3 className="w-16 h-16 mb-4 opacity-30" />
                   <p className="font-medium">Analysis results will appear here</p>
               </div>
           ) : (
             <>
                {/* Key Metrics Cards */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors">
                        <div className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-1">AI Detection Score</div>
                        <div className={`text-3xl font-bold ${result.aiScore > 50 ? 'text-red-500 dark:text-red-400' : 'text-green-500 dark:text-green-400'}`}>
                           {result.aiScore}%
                        </div>
                        <div className="text-xs text-slate-400 dark:text-slate-500 mt-1">Probability of AI generation</div>
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors">
                        <div className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-1">Readability</div>
                        <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                           {result.readabilityScore}/100
                        </div>
                        <div className="text-xs text-slate-400 dark:text-slate-500 mt-1">Flesch-Kincaid heuristic</div>
                    </div>
                </div>

                {/* Charts Row */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row gap-8 items-center justify-center transition-colors">
                    <div className="w-40 h-40 relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={aiData}
                                    innerRadius={40}
                                    outerRadius={60}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {aiData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                             <span className="text-xs font-bold text-slate-400 dark:text-slate-500">AI / Human</span>
                        </div>
                    </div>
                    
                    <div className="flex-1 w-full">
                       <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-3 flex items-center gap-2">
                           <ShieldCheck className="w-4 h-4 text-indigo-500" />
                           Detected Patterns
                       </h3>
                       <div className="space-y-3">
                          {result.flaggedPhrases.length > 0 ? (
                              result.flaggedPhrases.slice(0, 3).map((item, idx) => (
                                  <div key={idx} className="flex items-start gap-3 bg-red-50 dark:bg-red-900/20 p-2 rounded-lg border border-red-100 dark:border-red-900/30">
                                      <AlertTriangle className="w-4 h-4 text-red-500 dark:text-red-400 mt-0.5 shrink-0" />
                                      <div>
                                          <span className="text-sm font-bold text-red-700 dark:text-red-300 block">"{item.phrase}"</span>
                                          <span className="text-xs text-red-600 dark:text-red-400">{item.reason}</span>
                                      </div>
                                  </div>
                              ))
                          ) : (
                              <div className="p-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-sm rounded-lg border border-green-100 dark:border-green-900/30">
                                  No common AI trigger words detected.
                              </div>
                          )}
                       </div>
                    </div>
                </div>

                {/* Suggestions */}
                <div className="bg-indigo-900 dark:bg-indigo-950 text-white p-6 rounded-xl shadow-lg">
                    <h3 className="font-bold flex items-center gap-2 mb-4">
                        <Zap className="w-5 h-5 text-yellow-400" />
                        Improvement Suggestions
                    </h3>
                    <ul className="space-y-2">
                        {result.suggestions.length > 0 ? (
                            result.suggestions.map((s, i) => (
                                <li key={i} className="flex items-start gap-2 text-indigo-100 text-sm">
                                    <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-1.5 shrink-0"></span>
                                    {s}
                                </li>
                            ))
                        ) : (
                            <li className="text-indigo-200 text-sm">Great job! The text looks natural and well-balanced.</li>
                        )}
                    </ul>
                </div>
             </>
           )}
        </div>
      </div>
    </div>
  );
};

export default AnalyzePage;