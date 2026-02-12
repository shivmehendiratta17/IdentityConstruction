import React, { useRef, useState, useEffect } from 'react';
import { Volume2, VolumeX, Waves } from 'lucide-react';

export const AmbientBackground: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);

  const initAudio = () => {
    if (audioCtxRef.current) return;

    // Initialize Audio Context
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioContext();
    audioCtxRef.current = ctx;

    // Master Gain (Volume Control)
    const masterGain = ctx.createGain();
    masterGain.gain.value = 0; // Start silent
    masterGain.connect(ctx.destination);
    masterGainRef.current = masterGain;

    // ------------------------------------------------------------
    // Layer 1: The Foundation (Deep Drone)
    // ------------------------------------------------------------
    const osc1 = ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.value = 55; // A1 (Low)
    const osc1Gain = ctx.createGain();
    osc1Gain.gain.value = 0.4;
    osc1.connect(osc1Gain);
    osc1Gain.connect(masterGain);
    osc1.start();

    // ------------------------------------------------------------
    // Layer 2: The Dissonance (Binaural Beat)
    // ------------------------------------------------------------
    // Slightly detuned to create a 0.5Hz "breathing" beat
    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.value = 55.5; 
    const osc2Gain = ctx.createGain();
    osc2Gain.gain.value = 0.3;
    osc2.connect(osc2Gain);
    osc2Gain.connect(masterGain);
    osc2.start();

    // ------------------------------------------------------------
    // Layer 3: The Texture (Ethereal Highs)
    // ------------------------------------------------------------
    const osc3 = ctx.createOscillator();
    osc3.type = 'triangle';
    osc3.frequency.value = 110; // A2
    const osc3Gain = ctx.createGain();
    osc3Gain.gain.value = 0.02; // Very subtle
    osc3.connect(osc3Gain);
    osc3Gain.connect(masterGain);
    osc3.start();
    
    // ------------------------------------------------------------
    // Modulation (LFO) - Makes it feel "alive"
    // ------------------------------------------------------------
    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.1; // Slow cycle (10 seconds)
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.1; // Modulate volume gently
    lfo.connect(lfoGain);
    lfoGain.connect(masterGain.gain);
    lfo.start();
  };

  const toggleAudio = async () => {
    if (!audioCtxRef.current) {
      initAudio();
    }

    if (audioCtxRef.current?.state === 'suspended') {
      await audioCtxRef.current.resume();
    }

    const ctx = audioCtxRef.current;
    const master = masterGainRef.current;

    if (!ctx || !master) return;

    const now = ctx.currentTime;

    if (isPlaying) {
      // Fade Out
      master.gain.cancelScheduledValues(now);
      master.gain.setValueAtTime(master.gain.value, now);
      master.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
      setIsPlaying(false);
    } else {
      // Fade In
      master.gain.cancelScheduledValues(now);
      master.gain.setValueAtTime(0.001, now);
      master.gain.exponentialRampToValueAtTime(0.15, now + 3); // Target volume 0.15
      setIsPlaying(true);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  return (
    <button 
      onClick={toggleAudio}
      className={`fixed bottom-6 right-6 z-50 p-4 rounded-full border backdrop-blur-md transition-all duration-500 group ${
        isPlaying 
          ? 'bg-zinc-900/50 border-zinc-700 text-teal-400 shadow-[0_0_20px_rgba(45,212,191,0.1)]' 
          : 'bg-zinc-950/50 border-zinc-800 text-zinc-500 hover:text-zinc-300'
      }`}
      aria-label={isPlaying ? "Mute Ambient Audio" : "Play Ambient Audio"}
    >
      <div className="relative">
        {isPlaying ? <Waves className="w-5 h-5 animate-pulse" /> : <VolumeX className="w-5 h-5" />}
        {!isPlaying && (
           <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 text-xs font-mono tracking-widest text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
             INITIALIZE_AUDIO
           </span>
        )}
      </div>
    </button>
  );
};
