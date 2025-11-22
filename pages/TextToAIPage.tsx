import React, { useState } from 'react';
import { getStats } from '../services/textProcessingService';
import { initLLM, generateAIText, LLMStatus } from '../services/llmService';
import { Bot, Copy, Check, Trash2, RefreshCw, ArrowRight, Sparkles } from 'lucide-react';
import { diffWords } from 'diff';

const TextToAIPage: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [llmStatus, setLlmStatus] = useState<LLMStatus>({ status: 'idle', progress: '', progressValue: 0 });

  const stats = getStats(inputText);

  const handleRewrite = async () => {
    if (!inputText.trim()) return;
    setIsProcessing(true);

    try {
      // Initialize LLM if needed
      if (llmStatus.status !== 'ready') {
          await initLLM((status) => setLlmStatus(status));
      }
      const result = await generateAIText(inputText);
      setOutputText(result);
    } catch (error) {
      console.error("Rewrite failed:", error);
      alert("Failed to process text. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearText = () => {
    setInputText('');
    setOutputText('');
  };

  const renderDiff = () => {
    if (!outputText) return null;
    if (!inputText) return <span className="text-slate-800 dark:text-slate-200">{outputText}</span>;

    const diff = diffWords(inputText, outputText);

    return (
      <div className="text-slate-800 dark:text-slate-200 text-lg leading-relaxed whitespace-pre-wrap">
        {diff.map((part, index) => {
          if (part.removed) {
            return null; 
          }
          if (part.added) {
            return (
              <span key={index} className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-1 rounded border-b-2 border-blue-200 dark:border-blue-800 font-medium" title="Changed/Added">
                {part.value}
              </span>
            );
          }
          return <span key={index}>{part.value}</span>;
        })}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="mb-8 text-center sm:text-left">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Text to AI Polish</h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">Transform casual text into professional, structured, and polished content.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
        
        {/* Left Column: Input */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Settings Card */}
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 space-y-6 transition-colors">
             
             {/* Model Loading Progress */}
             {llmStatus.status === 'loading' && (
                 <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-100 dark:border-blue-800">
                     <div className="flex justify-between text-xs font-medium text-blue-700 dark:text-blue-300 mb-1">
                         <span>{llmStatus.progress}</span>
                         <span>{Math.round(llmStatus.progressValue * 100)}%</span>
                     </div>
                     <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2">
                         <div 
                            className="bg-blue-600 dark:bg-blue-400 h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${llmStatus.progressValue * 100}%` }}
                         ></div>
                     </div>
                     <p className="text-[10px] text-blue-500 dark:text-blue-400 mt-1">First time load may take a few minutes (~1GB download).</p>
                 </div>
             )}

             <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                <Bot className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <span className="text-sm font-medium">AI Enhancement Mode Active</span>
             </div>
          </div>

          {/* Input Area */}
          <div className="flex-1 relative group">
            <div className="absolute top-0 right-0 p-2 z-10">
                 <button 
                    onClick={clearText}
                    className="p-2 text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                    title="Clear text"
                 >
                    <Trash2 className="w-4 h-4" />
                 </button>
            </div>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste your draft text here..."
              className="w-full h-64 lg:h-96 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-slate-700 dark:text-slate-200 text-lg leading-relaxed shadow-sm bg-white dark:bg-slate-800 placeholder:text-slate-300 dark:placeholder:text-slate-600 transition-colors"
            />
             <div className="absolute bottom-4 right-6 text-xs text-slate-400 dark:text-slate-500 font-medium pointer-events-none">
                {stats.words} words | {stats.chars} chars
             </div>
          </div>

          <button
            onClick={handleRewrite}
            disabled={isProcessing || !inputText}
            className={`w-full py-4 px-6 rounded-xl flex items-center justify-center gap-2 text-lg font-bold text-white shadow-lg transition-all transform active:scale-[0.98] ${
               isProcessing || !inputText 
               ? 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed'
               : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 hover:shadow-indigo-200 dark:hover:shadow-none'
            }`}
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Polish with AI
              </>
            )}
          </button>
        </div>

        {/* Right Column: Output */}
        <div className="lg:col-span-5 flex flex-col h-full">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl flex-1 flex flex-col overflow-hidden relative h-64 lg:h-auto transition-colors">
            <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex justify-between items-center">
              <span className="text-sm font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wide">Polished Result</span>
              <button
                onClick={handleCopy}
                disabled={!outputText}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  copied 
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' 
                    : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600'
                }`}
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <div className="flex-1 p-6 overflow-y-auto bg-slate-50/50 dark:bg-slate-900/30">
               {outputText ? (
                 renderDiff()
               ) : (
                 <div className="h-full flex flex-col items-center justify-center text-slate-300 dark:text-slate-600">
                    <ArrowRight className="w-12 h-12 mb-4 opacity-20" />
                    <p className="text-sm font-medium">Your polished text will appear here</p>
                 </div>
               )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TextToAIPage;
