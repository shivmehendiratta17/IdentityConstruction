import React, { useState } from 'react';
import { GamePhase, GameState, LifeSeason, PlayerProfile } from './types';
import Setup from './components/Setup';
import Gameplay from './components/Gameplay';
import EndScreen from './components/EndScreen';
import { AmbientBackground } from './components/AmbientBackground';

const App: React.FC = () => {
  const [phase, setPhase] = useState<GamePhase>(GamePhase.SETUP);
  const [finalState, setFinalState] = useState<GameState | null>(null);
  
  // Default initial state
  const [initialState, setInitialState] = useState<GameState>({
    age: 12,
    season: LifeSeason.BECOMING,
    profile: { name: '', gender: '', background: '', emotionalClimate: '', coreBelief: '', coreFear: '', secretAmbition: '' },
    visibleStats: {
      confidence: 40,
      empathy: 50,
      ambition: 30,
      stability: 50,
      riskTolerance: 40,
      charisma: 30
    },
    hiddenStats: {
      shame: 10,
      narcissism: 10,
      authenticity: 80,
      trauma: 0,
      regret: 0
    },
    socialStats: {
      reputation: 50,
      influence: 10,
      wealth: 20
    },
    pressureStats: {
      burnout: 0,
      loneliness: 20,
      cognitiveDissonance: 0
    },
    relationships: [],
    history: [],
    turnCount: 0
  });

  const handleSetupComplete = (profile: PlayerProfile) => {
    setInitialState(prev => ({ ...prev, profile }));
    setPhase(GamePhase.PLAYING);
  };

  const handleGameOver = (final: GameState) => {
    setFinalState(final);
    setPhase(GamePhase.ENDING);
  };

  const handleRestart = () => {
    setPhase(GamePhase.SETUP);
    setFinalState(null);
  };

  return (
    <div className="bg-zinc-950 min-h-screen text-zinc-100 font-sans selection:bg-zinc-700 selection:text-white relative">
      <AmbientBackground />
      
      {phase === GamePhase.SETUP && <Setup onComplete={handleSetupComplete} />}
      
      {phase === GamePhase.PLAYING && (
        <Gameplay 
          initialState={initialState} 
          onGameOver={handleGameOver} 
        />
      )}
      
      {phase === GamePhase.ENDING && finalState && (
        <EndScreen 
          finalState={finalState} 
          onRestart={handleRestart} 
        />
      )}
    </div>
  );
};

export default App;
