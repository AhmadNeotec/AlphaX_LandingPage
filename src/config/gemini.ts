export const GEMINI_API_CONFIG = {
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
  apiUrl: 'https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent',
  model: 'gemini-pro', // Or the specific Gemini model you want to use
  temperature: 0.7,
  maxOutputTokens: 1000,
}; 