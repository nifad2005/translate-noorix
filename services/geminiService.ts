
import { GoogleGenAI } from "@google/genai";
import { LANGUAGES } from '../constants';
import type { Language } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getLanguageName = (code: string): string => {
  const language = LANGUAGES.find((lang) => lang.code === code);
  return language ? language.name : code;
};

export const translateText = async (
  text: string,
  sourceLangCode: string,
  targetLangCode: string
): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API key not found. Please set the API_KEY environment variable.");
  }
  
  if (!text.trim()) {
    return '';
  }

  const sourceLangName = getLanguageName(sourceLangCode);
  const targetLangName = getLanguageName(targetLangCode);

  const prompt = `You are an expert translator. Translate the following text from ${sourceLangName} to ${targetLangName}. Do not add any commentary, explanations, or quotes around the translation. Respond ONLY with the translated text.

Text to translate:
"${text}"
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text.trim();
  } catch (error) {
    console.error("Gemini API call failed:", error);
    throw new Error("Failed to translate text. The API call returned an error.");
  }
};
