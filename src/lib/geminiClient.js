import { GoogleGenAI } from "@google/genai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenAI({ apiKey });

export const getGeminiResponse = async (prompt) => {
    const models = ["gemini-2.5-flash", "gemini-3-flash-preview", "gemini-1.5-flash"];

    for (const modelName of models) {
        try {
            const result = await genAI.models.generateContent({
                model: modelName,
                contents: prompt,
            });
            return result.text;
        } catch (error) {
            console.error(`Gemini AI Error with ${modelName}:`, error);
            // If it's a 503 or 429, try the next model
            if (error.message?.includes("503") || error.message?.includes("429") || error.message?.includes("high demand")) {
                continue;
            }
            break;
        }
    }
    return "I'm sorry, I'm having trouble connecting to my medical database. High demand detected. Please try again in a few moments.";
};
