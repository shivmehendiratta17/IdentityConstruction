import React, { useEffect, useState } from 'react';
import { GameState } from '../types';
import { generateEndGame } from '../geminiService';
import { RefreshCw, Download } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface EndScreenProps {
  finalState: GameState;
  onRestart: () => void;
}

const EndScreen: React.FC<EndScreenProps> = ({ finalState, onRestart }) => {
  const [reflection, setReflection] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReflection = async () => {
      const text = await generateEndGame(finalState);
      setReflection(text);
      setLoading(false);
    };
    fetchReflection();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-8 md:p-16 overflow-y-auto">
      <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-1000">
        
        <div className="text-center space-y-4">
          <h1 className="text-5xl md:text-6xl font-serif font-light tracking-tight text-white">
            Life Complete
          </h1>
          <p className="text-zinc-500 font-mono">
            {finalState.profile.name} • {finalState.age} Years Lived
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-b border-zinc-900 py-8">
          <div className="text-center">
             <div className="text-zinc-500 uppercase text-xs tracking-widest mb-2">Final Fulfillment</div>
             <div className="text-4xl font-light text-teal-400">{finalState.visibleStats.stability}%</div>
          </div>
          <div className="text-center">
             <div className="text-zinc-500 uppercase text-xs tracking-widest mb-2">Dominant Trait</div>
             <div className="text-4xl font-light text-indigo-400">
                {Object.entries(finalState.visibleStats).reduce((a, b) => a[1] > b[1] ? a : b)[0]}
             </div>
          </div>
          <div className="text-center">
             <div className="text-zinc-500 uppercase text-xs tracking-widest mb-2">Regret Level</div>
             <div className="text-4xl font-light text-rose-400">{finalState.hiddenStats.regret > 50 ? 'High' : 'Low'}</div>
          </div>
        </div>

        <div className="prose prose-invert prose-lg max-w-none">
          {loading ? (
             <div className="space-y-4 animate-pulse">
                <div className="h-4 bg-zinc-900 rounded w-3/4"></div>
                <div className="h-4 bg-zinc-900 rounded w-full"></div>
                <div className="h-4 bg-zinc-900 rounded w-5/6"></div>
                <p className="text-zinc-600 text-center text-sm pt-4">Reflecting on your journey...</p>
             </div>
          ) : (
            <ReactMarkdown className="font-serif leading-loose text-zinc-300">
              {reflection}
            </ReactMarkdown>
          )}
        </div>

        <div className="flex justify-center pt-12 flex-col items-center gap-8">
          <button
            onClick={onRestart}
            className="flex items-center gap-2 bg-zinc-100 text-zinc-900 px-8 py-3 rounded hover:bg-white transition-all font-medium"
          >
            <RefreshCw className="w-4 h-4" /> Reincarnate
          </button>

          <p className="text-zinc-600 font-mono text-xs uppercase tracking-widest opacity-70">
            Made by Shiv Mehendiratta
          </p>
        </div>
      </div>
    </div>
  );
};

export default EndScreen;