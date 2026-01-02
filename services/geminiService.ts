import { functions } from '../firebase';
import { httpsCallable } from 'firebase/functions';
import { Theme } from "../types";

interface BioDetails {
    name: string;
    relationship: string;
    personalityTraits: string;
    keyMemories: string;
}

export const generateBiography = async (details: BioDetails): Promise<string> => {
    try {
        console.log("Calling generateBiography Cloud Function...");
        const generateBiographyFn = httpsCallable(functions, 'generateBiography');
        const result = await generateBiographyFn({ details });
        const data = result.data as { text: string };

        if (data && data.text) {
            console.log("Biography generated successfully via Cloud Function");
            return data.text;
        } else {
            console.warn("Empty response from Cloud Function");
            return "The AI could not generate a biography from the provided points. Please try adding more details.";
        }
    } catch (error: any) {
        console.error("Error generating biography via Cloud Function:", error);

        const errorCode = error.code || 'unknown';
        const errorMessage = error.message || 'Unknown error';

        if (errorCode === 'failed-precondition') {
            return "The AI service is not properly configured on the server.";
        }
        if (errorCode === 'resource-exhausted') {
            return "The AI service has reached its usage limit. Please try again later.";
        }
        if (errorCode === 'unavailable') {
            return "The AI service is temporarily unavailable. Please check your internet connection and try again.";
        }

        return `There was an error generating the biography. ${errorMessage} (Code: ${errorCode})`;
    }
};

export const generateThemeSuggestions = async (biography: string): Promise<Theme[]> => {
    try {
        console.log("Calling generateThemeSuggestions Cloud Function...");
        const generateThemeSuggestionsFn = httpsCallable(functions, 'generateThemeSuggestions');
        const result = await generateThemeSuggestionsFn({ biography });

        return result.data as Theme[];
    } catch (error) {
        console.error("Error generating themes via Cloud Function:", error);
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
        console.log("Calling generateTributeSuggestions Cloud Function...");
        const generateTributeSuggestionsFn = httpsCallable(functions, 'generateTributeSuggestions');
        const result = await generateTributeSuggestionsFn({ name, relationship, sentiment });

        return result.data as string[];
    } catch (error) {
        console.error("Error generating tribute suggestions via Cloud Function:", error);
        return ["There was an error generating suggestions. Please check your internet connection or try again later."];
    }
};

export const generateTributeHighlights = async (tributes: string[]): Promise<string[]> => {
    try {
        console.log("Calling generateTributeHighlights Cloud Function...");
        const fn = httpsCallable(functions, 'generateTributeHighlights');
        const result = await fn({ tributes });

        return result.data as string[];
    } catch (error) {
        console.error("Error generating highlights via Cloud Function:", error);
        return [];
    }
};