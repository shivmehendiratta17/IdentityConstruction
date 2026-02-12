export enum GamePhase {
  SETUP = 'SETUP',
  PLAYING = 'PLAYING',
  ENDING = 'ENDING'
}

export enum LifeSeason {
  BECOMING = 'Season 1: Becoming (12-20)',
  DESIRE = 'Season 2: Desire (21-35)',
  POWER = 'Season 3: Power (36-50)',
  SACRIFICE = 'Season 4: Sacrifice (51-65)',
  RECKONING = 'Season 5: Reckoning (66+)',
}

export interface PlayerProfile {
  name: string;
  gender: string;
  background: string; // Socioeconomic/Cultural
  emotionalClimate: string; // Childhood atmosphere
  coreBelief: string;
  coreFear: string;
  secretAmbition: string;
}

export interface VisibleStats {
  confidence: number;
  empathy: number;
  ambition: number;
  stability: number;
  riskTolerance: number;
  charisma: number;
}

export interface HiddenStats {
  shame: number;
  narcissism: number;
  authenticity: number;
  trauma: number;
  regret: number;
}

export interface SocialStats {
  reputation: number;
  influence: number;
  wealth: number;
}

export interface PressureStats {
  burnout: number;
  loneliness: number;
  cognitiveDissonance: number;
}

export interface GameState {
  age: number;
  season: LifeSeason;
  profile: PlayerProfile;
  visibleStats: VisibleStats;
  hiddenStats: HiddenStats;
  socialStats: SocialStats;
  pressureStats: PressureStats;
  relationships: { name: string; value: number; role: string; status: string }[];
  history: { age: number; text: string; memory: string }[]; 
  turnCount: number;
  archetype?: string; // The developing archetype (e.g. "The Strategist")
}

export interface Choice {
  id: string;
  text: string;
  type: 'Risky' | 'Safe' | 'Moral' | 'Selfish' | 'Neutral';
  tooltip?: string; 
}

export interface SceneResponse {
  chapterTitle: string;
  narrative: string;
  innerVoice: string; // The critic, child, or shadow
  memoryTrigger?: string; // A reconstructed memory based on current psyche
  choices: Choice[];
  visibleUpdates?: Partial<VisibleStats>;
  hiddenUpdates?: Partial<HiddenStats>;
  socialUpdates?: Partial<SocialStats>;
  pressureUpdates?: Partial<PressureStats>;
  relationshipUpdates?: { name: string; change: number; role?: string; status?: string }[];
  visualTone?: 'Dark' | 'Bright' | 'Hazy' | 'Sharp'; 
  isDeath?: boolean;
  ageIncrement?: number;
  newSeason?: LifeSeason;
  archetypeProgress?: string;
}
