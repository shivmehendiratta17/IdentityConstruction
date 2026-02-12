import React from 'react';
import { GameState } from '../types';
import { Activity, Eye, EyeOff, Globe, Zap, Heart, Shield, TrendingUp, Anchor, AlertCircle, Crown, DollarSign } from 'lucide-react';

interface StatsPanelProps {
  state: GameState;
  className?: string;
}

const ProgressBar = ({ value, color, height = 'h-1.5' }: { value: number, color: string, height?: string }) => (
  <div className={`w-full bg-zinc-900 rounded-full ${height} overflow-hidden`}>
    <div
      className={`h-full rounded-full transition-all duration-1000 ease-out ${color}`}
      style={{ width: `${value}%` }}
    />
  </div>
);

const StatItem = ({ label, value, icon, color = 'bg-zinc-500' }: { label: string, value: number, icon: React.ReactNode, color?: string }) => (
  <div className="mb-3">
    <div className="flex justify-between items-end mb-1">
      <span className="text-[10px] uppercase tracking-widest text-zinc-500 flex items-center gap-1.5 font-semibold">
        {icon} {label}
      </span>
    </div>
    <ProgressBar value={value} color={color} />
  </div>
);

const StatsPanel: React.FC<StatsPanelProps> = ({ state, className = '' }) => {
  return (
    <div className={`flex flex-col h-full bg-zinc-950 border-l border-zinc-900 overflow-y-auto ${className}`}>
      
      {/* Profile Header */}
      <div className="p-6 border-b border-zinc-900">
        <h2 className="text-zinc-100 font-serif text-xl tracking-tight">{state.profile.name}</h2>
        <div className="text-zinc-500 text-xs mt-1 font-mono uppercase tracking-wider">{state.archetype || "Archetype: Forming..."}</div>
      </div>

      <div className="flex-1 p-6 space-y-8">
        
        {/* Visible Traits */}
        <section>
            <h3 className="text-zinc-600 text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                <Eye className="w-3 h-3" /> Visible Persona
            </h3>
            <div className="grid grid-cols-1 gap-1">
                <StatItem label="Confidence" value={state.visibleStats.confidence} icon={<Zap className="w-3 h-3" />} color="bg-amber-500" />
                <StatItem label="Empathy" value={state.visibleStats.empathy} icon={<Heart className="w-3 h-3" />} color="bg-emerald-500" />
                <StatItem label="Ambition" value={state.visibleStats.ambition} icon={<Crown className="w-3 h-3" />} color="bg-purple-500" />
                <StatItem label="Stability" value={state.visibleStats.stability} icon={<Anchor className="w-3 h-3" />} color="bg-blue-500" />
                <StatItem label="Risk Tol." value={state.visibleStats.riskTolerance} icon={<TrendingUp className="w-3 h-3" />} color="bg-orange-500" />
                <StatItem label="Charisma" value={state.visibleStats.charisma} icon={<Activity className="w-3 h-3" />} color="bg-pink-500" />
            </div>
        </section>

        {/* Hidden Drift */}
        <section>
             <h3 className="text-zinc-600 text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                <EyeOff className="w-3 h-3" /> Subconscious Drift
            </h3>
            <div className="grid grid-cols-1 gap-1 opacity-80">
                 <StatItem label="Shame" value={state.hiddenStats.shame} icon={<div className="w-1 h-1 rounded-full bg-zinc-500"/>} color="bg-red-900" />
                 <StatItem label="Narcissism" value={state.hiddenStats.narcissism} icon={<div className="w-1 h-1 rounded-full bg-zinc-500"/>} color="bg-yellow-900" />
                 <StatItem label="Authenticity" value={state.hiddenStats.authenticity} icon={<div className="w-1 h-1 rounded-full bg-zinc-500"/>} color="bg-teal-900" />
            </div>
        </section>

        {/* Social & Power */}
        <section>
            <h3 className="text-zinc-600 text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                <Globe className="w-3 h-3" /> Social Capital
            </h3>
            <div className="bg-zinc-900/50 p-3 rounded border border-zinc-900 space-y-3">
                 <div className="flex justify-between text-xs">
                     <span className="text-zinc-400">Reputation</span>
                     <span className="text-zinc-200 font-mono">{state.socialStats.reputation}</span>
                 </div>
                  <div className="flex justify-between text-xs">
                     <span className="text-zinc-400">Influence</span>
                     <span className="text-zinc-200 font-mono">{state.socialStats.influence}</span>
                 </div>
                 <div className="flex justify-between text-xs">
                     <span className="text-zinc-400">Wealth</span>
                     <span className="text-zinc-200 font-mono">{state.socialStats.wealth}</span>
                 </div>
            </div>
        </section>

         {/* Pressure */}
        <section>
            <h3 className="text-zinc-600 text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                <AlertCircle className="w-3 h-3" /> Internal Pressure
            </h3>
            <div className="space-y-3">
                <div>
                    <div className="flex justify-between text-[10px] uppercase text-zinc-500 mb-1">Burnout</div>
                    <ProgressBar value={state.pressureStats.burnout} color={state.pressureStats.burnout > 80 ? 'bg-red-500' : 'bg-zinc-600'} />
                </div>
                <div>
                    <div className="flex justify-between text-[10px] uppercase text-zinc-500 mb-1">Dissonance</div>
                    <ProgressBar value={state.pressureStats.cognitiveDissonance} color="bg-zinc-700" />
                </div>
            </div>
        </section>

      </div>
    </div>
  );
};

export default StatsPanel;
