import React, { useEffect, useState, useRef } from 'react';
import { GameState, SceneResponse } from '../types';
import { generateScene } from '../geminiService';
import StatsPanel from './StatsPanel';
import { Ghost, Clock, User, Loader2, History, Quote, MapPin } from 'lucide-react';

interface GameplayProps {
  initialState: GameState;
  onGameOver: (finalState: GameState) => void;
}

const Gameplay: React.FC<GameplayProps> = ({ initialState, onGameOver }) => {
  const [gameState, setGameState] = useState<GameState>(initialState);
  const [currentScene, setCurrentScene] = useState<SceneResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [historyOpen, setHistoryOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const processTurn = async (choiceId: string | null, choiceText: string | null) => {
    setLoading(true);
    
    // Generate next scene based on current state + user choice
    const scene = await generateScene(gameState, choiceText);

    if (scene.isDeath || gameState.age >= 90) {
        onGameOver(gameState);
        return;
    }

    setCurrentScene(scene);

    // Apply updates to state
    setGameState(prev => {
        const updateStats = <T extends object>(current: T, updates?: Partial<T>): T => {
             if (!updates) return current;
             const next = { ...current };
             (Object.keys(updates) as Array<keyof T>).forEach(key => {
                 // @ts-ignore
                 next[key] = Math.max(0, Math.min(100, (next[key] as number) + (updates[key] as number || 0)));
             });
             return next;
        };

        const newVisible = updateStats(prev.visibleStats, scene.visibleUpdates);
        const newHidden = updateStats(prev.hiddenStats, scene.hiddenUpdates);
        const newSocial = updateStats(prev.socialStats, scene.socialUpdates);
        const newPressure = updateStats(prev.pressureStats, scene.pressureUpdates);

        const newAge = prev.age + (scene.ageIncrement || 0);

        // Update history with memory preservation
        const newHistory = [...prev.history];
        if (choiceText) {
            newHistory.push({
                age: prev.age,
                text: choiceText,
                memory: scene.memoryTrigger || ""
            });
        }

        // Update relationships
        let newRelationships = [...prev.relationships];
        if (scene.relationshipUpdates) {
             scene.relationshipUpdates.forEach(update => {
                 const existingIdx = newRelationships.findIndex(r => r.name === update.name);
                 if (existingIdx >= 0) {
                     newRelationships[existingIdx] = {
                         ...newRelationships[existingIdx],
                         value: Math.max(0, Math.min(100, newRelationships[existingIdx].value + update.change)),
                         role: update.role || newRelationships[existingIdx].role,
                         status: update.status || newRelationships[existingIdx].status
                     };
                 } else {
                     newRelationships.push({ 
                         name: update.name, 
                         value: 50 + update.change, 
                         role: update.role || 'Associate',
                         status: update.status || 'Neutral'
                     });
                 }
             });
        }

        return {
            ...prev,
            age: newAge,
            season: scene.newSeason || prev.season,
            visibleStats: newVisible,
            hiddenStats: newHidden,
            socialStats: newSocial,
            pressureStats: newPressure,
            history: newHistory,
            relationships: newRelationships,
            archetype: scene.archetypeProgress || prev.archetype,
            turnCount: prev.turnCount + 1
        };
    });

    setLoading(false);
  };

  useEffect(() => {
    processTurn(null, null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
      if (scrollRef.current) {
          scrollRef.current.scrollTop = 0;
      }
  }, [currentScene]);

  // Determine visual tone classes
  const getVisualClasses = (tone?: string) => {
      switch(tone) {
          case 'Dark': return 'bg-zinc-950 text-zinc-400';
          case 'Hazy': return 'bg-[#0a0a0f] text-indigo-200/80 blur-[0.2px]';
          case 'Sharp': return 'bg-zinc-950 text-zinc-100 contrast-125';
          case 'Bright': return 'bg-zinc-900 text-zinc-200';
          default: return 'bg-zinc-950 text-zinc-200';
      }
  };

  if (!currentScene && loading) {
      return (
          <div className="h-screen flex flex-col items-center justify-center bg-zinc-950 text-zinc-500 gap-4">
              <Loader2 className="animate-spin w-8 h-8 text-zinc-700" /> 
              <span className="font-serif tracking-widest text-xs uppercase">Simulating Consciousness...</span>
          </div>
      );
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-zinc-950 overflow-hidden font-sans text-zinc-100">
      
      {/* Main Narrative Area */}
      <div className={`flex-1 flex flex-col relative transition-all duration-1000 ${getVisualClasses(currentScene?.visualTone)}`}>
        
        {/* Header */}
        <header className="h-20 border-b border-zinc-900 flex items-center justify-between px-8 bg-zinc-950/80 backdrop-blur z-10 shrink-0">
            <div className="flex flex-col">
                 <span className="text-zinc-500 text-[10px] uppercase tracking-[0.2em] mb-1">{gameState.season}</span>
                 <div className="flex items-center gap-4">
                    <span className="font-serif text-xl text-white">{currentScene?.chapterTitle || "Untitled Chapter"}</span>
                    <div className="h-4 w-px bg-zinc-800"></div>
                    <div className="flex items-center gap-2 text-zinc-400 font-mono text-sm">
                        <Clock className="w-3 h-3" /> Age {gameState.age}
                    </div>
                </div>
            </div>
            
            <button 
                onClick={() => setHistoryOpen(!historyOpen)}
                className="p-2 hover:bg-zinc-900 rounded-full text-zinc-500 hover:text-white transition-colors"
            >
                <History className="w-5 h-5" />
            </button>
        </header>

        {/* Narrative Scroll */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 md:p-16 lg:p-24 scroll-smooth">
            <div className="max-w-2xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                
                <div className="prose prose-invert prose-lg">
                    <p className="font-serif text-xl md:text-2xl leading-loose whitespace-pre-line text-zinc-200">
                        {currentScene?.narrative}
                    </p>
                </div>

                {currentScene?.innerVoice && (
                     <div className="relative pl-8 py-2">
                        <Quote className="absolute top-0 left-0 w-4 h-4 text-zinc-700 opacity-50" />
                        <p className="text-zinc-500 italic font-medium font-serif leading-relaxed">
                            {currentScene.innerVoice}
                        </p>
                    </div>
                )}

                {currentScene?.memoryTrigger && (
                    <div className="bg-indigo-950/20 border border-indigo-900/30 p-4 rounded-sm">
                         <div className="flex items-center gap-2 text-indigo-400 mb-2 text-xs uppercase tracking-widest font-bold">
                            <Ghost className="w-3 h-3" /> Memory Resurface
                        </div>
                        <p className="text-indigo-200/70 text-sm italic">{currentScene.memoryTrigger}</p>
                    </div>
                )}

                {/* Relationships Context */}
                {gameState.relationships.length > 0 && (
                    <div className="border-t border-zinc-900 pt-8 mt-12">
                        <h4 className="text-zinc-600 text-[10px] uppercase tracking-widest mb-4">Key Figures</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {gameState.relationships.slice(0, 6).map(r => (
                                <div key={r.name} className="flex flex-col p-3 bg-zinc-900/40 border border-zinc-900 rounded hover:border-zinc-800 transition-colors">
                                    <div className="flex items-center gap-2 mb-1">
                                        <User className="w-3 h-3 text-zinc-500" />
                                        <span className="text-sm font-medium text-zinc-300">{r.name}</span>
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <span className="text-xs text-zinc-500">{r.role}</span>
                                        <div className={`w-1.5 h-1.5 rounded-full ${r.value > 60 ? 'bg-emerald-500' : r.value < 30 ? 'bg-red-500' : 'bg-zinc-500'}`}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>

        {/* Action Area */}
        <div className="border-t border-zinc-900 bg-zinc-950 p-8 md:p-12 z-20 shrink-0">
            <div className="max-w-2xl mx-auto">
                {loading ? (
                     <div className="h-[140px] flex flex-col items-center justify-center text-zinc-700 gap-3">
                        <div className="w-1 h-1 bg-zinc-500 rounded-full animate-ping"></div>
                        <span className="font-mono text-xs">Processing Consequence...</span>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {currentScene?.choices.map((choice) => (
                            <button
                                key={choice.id}
                                onClick={() => processTurn(choice.id, choice.text)}
                                className="group relative w-full text-left p-5 rounded bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition-all duration-300 flex justify-between items-center"
                            >
                                <div>
                                    <span className="block text-zinc-200 font-serif text-lg mb-1 group-hover:text-white transition-colors">
                                        {choice.text}
                                    </span>
                                    {choice.tooltip && (
                                        <span className="text-xs text-zinc-500 group-hover:text-zinc-400 font-mono">
                                            {choice.tooltip}
                                        </span>
                                    )}
                                </div>
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity text-xs uppercase tracking-widest text-zinc-600 border border-zinc-800 px-2 py-1 rounded">
                                    {choice.type}
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>

        {/* History Overlay */}
        {historyOpen && (
            <div className="absolute inset-0 bg-zinc-950/98 z-50 p-12 overflow-y-auto animate-in fade-in">
                <div className="max-w-2xl mx-auto">
                    <div className="flex justify-between items-center mb-12">
                        <h2 className="text-3xl font-serif text-zinc-100">Life Record</h2>
                        <button 
                            onClick={() => setHistoryOpen(false)}
                            className="text-zinc-500 hover:text-white uppercase text-xs tracking-widest"
                        >
                            Close Record
                        </button>
                    </div>
                    <div className="space-y-8 border-l border-zinc-800 pl-8 relative">
                        {gameState.history.map((entry, i) => (
                            <div key={i} className="relative">
                                <div className="absolute -left-[37px] top-1 w-4 h-4 bg-zinc-950 border border-zinc-800 rounded-full flex items-center justify-center">
                                    <div className="w-1.5 h-1.5 bg-zinc-700 rounded-full"></div>
                                </div>
                                <div className="flex items-baseline gap-4 mb-1">
                                    <span className="font-mono text-zinc-500 text-sm">Age {entry.age}</span>
                                </div>
                                <p className="text-zinc-300 font-serif text-lg">{entry.text}</p>
                                {entry.memory && <p className="text-indigo-400/50 text-sm mt-2 italic border-l-2 border-indigo-900/50 pl-3">{entry.memory}</p>}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )}

      </div>

      {/* Side Stats Panel (Desktop) */}
      <div className="hidden md:block w-80 bg-zinc-950 h-full border-l border-zinc-900 shrink-0">
        <StatsPanel state={gameState} />
      </div>
      
    </div>
  );
};

export default Gameplay;
