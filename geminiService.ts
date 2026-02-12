import { GoogleGenAI, Schema, Type } from "@google/genai";
import { GameState, SceneResponse, LifeSeason } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const RESPONSE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    chapterTitle: { type: Type.STRING, description: "Short cinematic title." },
    narrative: { type: Type.STRING, description: "Concise, immersive 2nd person narrative (max 80 words)." },
    innerVoice: { type: Type.STRING, description: "Brief internal thought." },
    memoryTrigger: { type: Type.STRING, description: "Optional short memory fragment." },
    choices: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          text: { type: Type.STRING },
          type: { type: Type.STRING, enum: ['Risky', 'Safe', 'Moral', 'Selfish', 'Neutral'] },
          tooltip: { type: Type.STRING }
        },
        required: ["id", "text", "type"]
      }
    },
    visibleUpdates: {
      type: Type.OBJECT,
      properties: {
        confidence: { type: Type.INTEGER },
        empathy: { type: Type.INTEGER },
        ambition: { type: Type.INTEGER },
        stability: { type: Type.INTEGER },
        riskTolerance: { type: Type.INTEGER },
        charisma: { type: Type.INTEGER }
      }
    },
    hiddenUpdates: {
      type: Type.OBJECT,
      properties: {
        shame: { type: Type.INTEGER },
        narcissism: { type: Type.INTEGER },
        authenticity: { type: Type.INTEGER },
        trauma: { type: Type.INTEGER },
        regret: { type: Type.INTEGER }
      }
    },
    socialUpdates: {
      type: Type.OBJECT,
      properties: {
        reputation: { type: Type.INTEGER },
        influence: { type: Type.INTEGER },
        wealth: { type: Type.INTEGER }
      }
    },
    pressureUpdates: {
      type: Type.OBJECT,
      properties: {
        burnout: { type: Type.INTEGER },
        loneliness: { type: Type.INTEGER },
        cognitiveDissonance: { type: Type.INTEGER }
      }
    },
    relationshipUpdates: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          role: { type: Type.STRING },
          status: { type: Type.STRING },
          change: { type: Type.INTEGER }
        },
        required: ["name", "change"]
      }
    },
    visualTone: { type: Type.STRING, enum: ['Dark', 'Bright', 'Hazy', 'Sharp'] },
    isDeath: { type: Type.BOOLEAN },
    ageIncrement: { type: Type.INTEGER },
    newSeason: { type: Type.STRING },
    archetypeProgress: { type: Type.STRING }
  },
  required: ["chapterTitle", "narrative", "innerVoice", "choices"]
};

export const generateScene = async (
  gameState: GameState, 
  lastChoice: string | null
): Promise<SceneResponse> => {
  
  const systemPrompt = `
    You are 'The Architect', a high-performance psychological simulation engine.
    You are directing the life of ${gameState.profile.name}.
    
    Current State (Age ${gameState.age}, ${gameState.season}):
    - Visible: ${JSON.stringify(gameState.visibleStats)}
    - Hidden: ${JSON.stringify(gameState.hiddenStats)}
    - Pressure: ${JSON.stringify(gameState.pressureStats)}
    
    Context:
    Player chose: "${lastChoice || "Begin Life"}".
    
    Task:
    Generate the next scene immediately.
    1. Narrative: Concise, impactful, literary (Max 80 words).
    2. Choices: EXACTLY 3 distinct options (1 Risky, 1 Safe/Neutral, 1 Moral/Selfish).
    3. Stats: Apply logical consequences.
    
    Rules:
    - If Age > 80, set isDeath = true.
    - If Burnout > 90, force a collapse.
    - Keep response JSON valid and fast.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: systemPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
        temperature: 0.7, // Optimized for speed and structure
      }
    });

    const jsonText = response.text || "{}";
    const data = JSON.parse(jsonText) as SceneResponse;
    
    // Safety check to ensure exactly 3 choices if model drifts (rare with schema)
    if (data.choices && data.choices.length > 3) {
        data.choices = data.choices.slice(0, 3);
    }

    return data;

  } catch (error) {
    console.error("Gemini GenAI Error:", error);
    // Robust fallback
    return {
      chapterTitle: "The Void",
      narrative: "The simulation pauses to recalibrate your timeline...",
      innerVoice: "Focus...",
      choices: [
        { id: "retry", text: "Regain Clarity", type: "Safe", tooltip: "Restores stability" },
        { id: "push", text: "Force a Path", type: "Risky", tooltip: "Increases stress" },
        { id: "accept", text: "Accept the Fog", type: "Neutral", tooltip: "No change" }
      ],
      ageIncrement: 0
    };
  }
};

export const generateEndGame = async (gameState: GameState): Promise<string> => {
    const systemPrompt = `
    Perform a concise "Psychological Autopsy" for ${gameState.profile.name}.
    
    Data:
    - Age at Death: ${gameState.age}
    - Archetype: ${gameState.archetype || "Undefined"}
    - Visible Traits: ${JSON.stringify(gameState.visibleStats)}
    - Hidden Drift: ${JSON.stringify(gameState.hiddenStats)}
    - Life Regrets: ${JSON.stringify(gameState.history.slice(-3))}
    
    Output: Markdown. Max 300 words.
    Sections:
    1. **Archetype**: Who did they become?
    2. **Shadow**: What drove them?
    3. **Legacy**: How are they remembered?
    4. **Final Thought**: Last internal monologue.
  `;

  try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: systemPrompt,
      });
      return response.text || "The end.";
  } catch (e) {
      return "A quiet end to a complex life.";
  }
}
