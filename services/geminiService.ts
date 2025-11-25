import { GoogleGenAI, Type } from "@google/genai";
import { Theme } from "../types";

// FIX: Per coding guidelines, initialize GoogleGenAI with process.env.API_KEY directly and assume it's available.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

interface BioDetails {
  name: string;
  relationship: string;
  personalityTraits: string;
  keyMemories: string;
}

export const generateBiography = async (details: BioDetails): Promise<string> => {
  // FIX: Removed API_KEY check as per guidelines, which state to assume the key is available.
  try {
    const prompt = `Write a heartfelt and respectful biography for a memorial website for ${details.name || 'the deceased'}.
The biography is being written from the perspective of their ${details.relationship || 'loved one'}. The tone should be warm, personal, celebratory of their life, and comforting.
Incorporate the following details into a flowing narrative, not just a list.

Personality Traits to highlight:
---
${details.personalityTraits}
---

Key memories, life events, and highlights:
---
${details.keyMemories}
---

Combine these elements into a beautiful life story that captures the essence of who they were.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const text = response.text;
    if (text) {
      return text;
    } else {
      // FIX: Changed from throwing error to returning a user-friendly message for empty responses.
      return "The AI could not generate a biography from the provided points. Please try adding more details.";
    }
  } catch (error) {
    console.error("Error generating biography:", error);
    return "There was an error generating the biography. Please try again later.";
  }
};

export const generateThemeSuggestions = async (biography: string): Promise<Theme[]> => {
    try {
        const prompt = `Based on the tone and content of the following biography, suggest 2-3 suitable visual themes for a memorial website.

Biography:
---
${biography}
---

For each theme, provide the following fields:
- 'name': A unique identifier combining the color palette and layout style (e.g., 'classic-rose-classic').
- 'title': A user-friendly title (e.g., 'Classic Rose (Classic)').
- 'description': A short description of the theme.
- 'colorTheme': The name of the color palette (e.g., 'classic-rose').
- 'layout': The layout style, either 'classic' or 'story'.
- 'colors': An object with 'bg', 'primary', and 'text' hex color codes.

Available Color Palettes:
- 'classic-rose': Soft, warm pinks and creams. Colors: { bg: '#FFF5F5', primary: '#D68C8C', text: '#5E3737' }
- 'modern-blue': Clean, crisp blues and grays. Colors: { bg: '#F0F4F8', primary: '#3B82F6', text: '#1F2937' }
- 'elegant-gold': Luxurious creams and golds. Colors: { bg: '#FCFBF8', primary: '#D4AF37', text: '#4A443A' }
- 'peaceful-green': Natural, calming greens and earthy tones. Colors: { bg: '#F1F5F2', primary: '#6A994E', text: '#386641' }

Available Layout Styles:
- 'classic': A timeless, centered design. Respectful and traditional.
- 'story': An editorial, side-by-side layout that presents the biography and photo like a feature story. More personal and narrative-focused.

Analyze the biography and choose combinations that best fit its feeling. For example, a biography about a gentle, romantic person might suit a 'classic-rose-classic' theme, while a story about a strong, professional individual might fit a 'modern-blue-story' theme.

Return a JSON array of theme objects.
`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            name: { type: Type.STRING },
                            title: { type: Type.STRING },
                            description: { type: Type.STRING },
                            colorTheme: { type: Type.STRING },
                            layout: { type: Type.STRING },
                            colors: {
                                type: Type.OBJECT,
                                properties: {
                                    bg: { type: Type.STRING },
                                    primary: { type: Type.STRING },
                                    text: { type: Type.STRING },
                                }
                            }
                        }
                    }
                }
            }
        });

        const text = response.text;
        if (text) {
            return JSON.parse(text);
        } else {
            return [];
        }
    } catch (error) {
        console.error("Error generating themes:", error);
        // Return a default suggestion on error
        return [
            {
                name: 'classic-rose-classic',
                title: 'Classic Rose (Classic)',
                description: 'A gentle and warm design with soft pinks, perfect for a heartfelt tribute in a timeless, centered layout.',
                colorTheme: 'classic-rose',
                layout: 'classic',
                colors: { bg: '#FFF5F5', primary: '#D68C8C', text: '#5E3737' }
            }
        ];
    }
};

export const generateTributeSuggestions = async (name: string, relationship: string, sentiment: string): Promise<string[]> => {
    try {
        const prompt = `Generate 3 distinct, heartfelt tribute messages for a memorial website for a person named ${name}. 
The person writing the tribute is their ${relationship}.
The desired sentiment for the tribute is "${sentiment}".
The tributes should be short (1-2 sentences), respectful, and personal, matching the sentiment.
Vary the content for each suggestion: one can be about a shared memory, one about the person's character, and one a simple, heartfelt message.
Return a JSON array of 3 strings.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                }
            }
        });

        const text = response.text;
        if (text) {
            return JSON.parse(text);
        }
        return [];
    } catch (error) {
        console.error("Error generating tribute suggestions:", error);
        return ["There was an error generating suggestions. Please write your own message."];
    }
};