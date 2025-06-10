export const SHUTTLE_AI_CONFIG = {
  apiKey: import.meta.env.VITE_SHUTTLE_AI_API_KEY,
  apiUrl: 'https://api.shuttleai.app/v1/chat/completions',
  model: 'shuttle-3', // Using the flagship model as per documentation
  temperature: 0.7,
  maxTokens: 1000,
}; 