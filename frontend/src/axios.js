// src/api.js
import axios from 'axios';

export async function getEnhancedPrompt(prompt, outputType) {
  try {
    const response = await axios.post('http://localhost:5001/api/enhance-prompt', {
      prompt,
      outputType
    });
    return response.data;
  } catch (error) {
    console.error('Error calling AI backend:', error);
    throw error;
  }
}
