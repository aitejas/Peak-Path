import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getCacheKey = (language: string) => `translations_${language}`;

export const translationService = {
  getTranslations: async (
    language: string,
    englishStrings: Record<string, string>
  ): Promise<Record<string, string>> => {
    if (language === 'English' || Object.keys(englishStrings).length === 0) {
      return englishStrings;
    }

    const cacheKey = getCacheKey(language);
    try {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (error) {
      console.error('Error reading from sessionStorage', error);
    }

    try {
      const prompt = `Translate the JSON values into ${language}. Do not translate the keys. Return only the translated JSON object as a single, valid JSON string, without any markdown formatting or explanatory text.
Input:
${JSON.stringify(englishStrings, null, 2)}

Output:`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      let jsonString = response.text.trim();
      
      // A more robust way to extract JSON from the AI's response
      // Step 1: Remove markdown code fences if they exist.
      if (jsonString.startsWith('```json')) {
          jsonString = jsonString.substring(7);
      }
      if (jsonString.startsWith('```')) {
          jsonString = jsonString.substring(3);
      }
      if (jsonString.endsWith('```')) {
          jsonString = jsonString.slice(0, -3);
      }
      jsonString = jsonString.trim(); // Trim again after removing fences.


      const jsonMatch = jsonString.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
          throw new Error("AI response did not contain a valid JSON object.");
      }
      jsonString = jsonMatch[0];
      
      const translatedStrings = JSON.parse(jsonString);

      // Validate that the keys match the original keys
      const originalKeys = Object.keys(englishStrings);
      const translatedKeys = Object.keys(translatedStrings);
      if (originalKeys.length !== translatedKeys.length || !originalKeys.every(key => translatedKeys.includes(key))) {
          console.warn("Translated keys do not match original keys. Falling back to English.");
          return englishStrings;
      }


      try {
        sessionStorage.setItem(cacheKey, JSON.stringify(translatedStrings));
      } catch (error) {
        console.error('Error writing to sessionStorage', error);
      }

      return translatedStrings;

    } catch (error) {
      console.error(`Error translating to ${language}:`, error);
      // Fallback to English on error
      return englishStrings;
    }
  },
};