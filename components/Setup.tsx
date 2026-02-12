import React, { useState } from 'react';
import { PlayerProfile } from '../types';
import { ArrowRight, Fingerprint } from 'lucide-react';

interface SetupProps {
  onComplete: (profile: PlayerProfile) => void;
}

interface InputGroupProps {
  label: string;
  sub?: string;
  children: React.ReactNode;
}

const InputGroup: React.FC<InputGroupProps> = ({ label, sub, children }) => (
  <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-500">
    <label className="block text-sm font-medium text-zinc-300">
      {label} <span className="text-zinc-600 ml-2 font-light">{sub}</span>
    </label>
    {children}
  </div>
);

const Setup: React.FC<SetupProps> = ({ onComplete }) => {
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [background, setBackground] = useState('');
  const [emotionalClimate, setEmotionalClimate] = useState('');
  const [belief, setBelief] = useState('');
  const [fear, setFear] = useState('');
  const [ambition, setAmbition] = useState('');

  const isReady = name && gender && background && emotionalClimate && belief && fear && ambition;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isReady) {
      onComplete({ 
        name, 
        gender, 
        background, 
        emotionalClimate, 
        coreBelief: belief, 
        coreFear: fear, 
        secretAmbition: ambition 
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-6 md:p-12 overflow-y-auto">
      <div className="w-full max-w-2xl space-y-10 py-10">
        
        <div className="text-center space-y-4">
          <Fingerprint className="w-16 h-16 text-zinc-100 mx-auto mb-4 stroke-1" />
          <h1 className="text-5xl font-light text-zinc-100 tracking-tighter font-serif">IDENTITY_CONSTRUCTION</h1>
          <p className="text-zinc-500 font-mono text-sm tracking-widest uppercase">Initializing Soul Architecture</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 bg-zinc-900/30 p-8 border border-zinc-900 rounded-xl backdrop-blur-sm">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputGroup label="Name">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded px-4 py-3 text-zinc-100 focus:border-zinc-500 focus:outline-none transition-all placeholder-zinc-800"
                placeholder="Subject Name"
              />
            </InputGroup>
             <InputGroup label="Gender Identity">
              <input
                type="text"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded px-4 py-3 text-zinc-100 focus:border-zinc-500 focus:outline-none transition-all placeholder-zinc-800"
                placeholder="e.g. Female, Non-binary, Male"
              />
            </InputGroup>
          </div>

          <InputGroup label="Socioeconomic Background" sub="Where did you start?">
            <select 
                value={background}
                onChange={(e) => setBackground(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded px-4 py-3 text-zinc-100 focus:border-zinc-500 focus:outline-none transition-all"
            >
                <option value="">Select Origin...</option>
                <option value="Old Money Aristocracy">Old Money Aristocracy</option>
                <option value="Academic Intellectuals">Academic Intellectuals</option>
                <option value="Working Class Struggle">Working Class Struggle</option>
                <option value="Immigrant Striving">Immigrant Striving</option>
                <option value="Suburban Decay">Suburban Decay</option>
                <option value="Urban Poverty">Urban Poverty</option>
                <option value="Rural Isolation">Rural Isolation</option>
                <option value="Tech Nouveau Riche">Tech Nouveau Riche</option>
            </select>
          </InputGroup>

          <InputGroup label="Childhood Emotional Climate" sub="How did it feel?">
             <select 
                value={emotionalClimate}
                onChange={(e) => setEmotionalClimate(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded px-4 py-3 text-zinc-100 focus:border-zinc-500 focus:outline-none transition-all"
            >
                <option value="">Select Climate...</option>
                <option value="Cold & Demanding">Cold & Demanding</option>
                <option value="Chaotic & Unpredictable">Chaotic & Unpredictable</option>
                <option value="Warm but Suffocating">Warm but Suffocating</option>
                <option value="Neglectful & Silent">Neglectful & Silent</option>
                <option value="Performative & Fake">Performative & Fake</option>
                <option value="Strictly Religious">Strictly Religious</option>
                <option value="Open & Free">Open & Free</option>
            </select>
          </InputGroup>

          <div className="space-y-6 pt-4 border-t border-zinc-800">
            <InputGroup label="Core Belief (Age 12)" sub="A truth you hold about yourself.">
              <input
                type="text"
                value={belief}
                onChange={(e) => setBelief(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded px-4 py-3 text-zinc-100 focus:border-zinc-500 focus:outline-none transition-all placeholder-zinc-800"
                placeholder="e.g. 'I am only worthy if I win'"
              />
            </InputGroup>

            <InputGroup label="Deepest Fear" sub="What you never admit.">
               <input
                type="text"
                value={fear}
                onChange={(e) => setFear(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded px-4 py-3 text-zinc-100 focus:border-zinc-500 focus:outline-none transition-all placeholder-zinc-800"
                placeholder="e.g. 'That I am completely ordinary'"
              />
            </InputGroup>

            <InputGroup label="Secret Ambition" sub="What you truly want.">
               <input
                type="text"
                value={ambition}
                onChange={(e) => setAmbition(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded px-4 py-3 text-zinc-100 focus:border-zinc-500 focus:outline-none transition-all placeholder-zinc-800"
                placeholder="e.g. 'To rule, no matter the cost'"
              />
            </InputGroup>
          </div>

          <button
            type="submit"
            disabled={!isReady}
            className={`w-full flex items-center justify-center gap-2 py-5 rounded text-lg font-light tracking-widest transition-all mt-8 ${
              isReady
                ? 'bg-zinc-100 text-zinc-950 hover:bg-white hover:scale-[1.01] shadow-[0_0_30px_rgba(255,255,255,0.1)]'
                : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
            }`}
          >
            BEGIN SIMULATION <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        <div className="text-center space-y-2 pt-4 opacity-60">
            <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest">
                Made by Shiv Mehendiratta
            </p>
            <p className="text-zinc-600 font-serif text-sm italic">
                Enjoy the game.
            </p>
        </div>
      </div>
    </div>
  );
};

export default Setup;