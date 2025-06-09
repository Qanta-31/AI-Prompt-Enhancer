import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

const models = [
  'mistralai/devstral-small:free',
  'google/gemma-3n-e4b-it:free',
  'nousresearch/deephermes-3-mistral-24b-preview:free',
  'meta-llama/llama-3.3-8b-instruct:free'
];

const referer = 'http://localhost:5173'; // Change to your frontend domain in production
const title = 'AI Prompt Enhancer';

async function requestCompletion(model, messages) {
  return axios.post(
    OPENROUTER_URL,
    {
      model,
      messages,
      max_tokens: 700,
    },
    {
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': referer,
        'X-Title': title,
      },
    }
  );
}

app.post('/api/enhance-prompt', async (req, res) => {
  const { prompt, outputType } = req.body;

  if (!prompt || !outputType) {
    return res.status(400).json({ error: 'Both prompt and outputType are required.' });
  }

  // Clear and explicit system instructions emphasizing:
  // - You rewrite/improve the prompt
  // - You DO NOT answer the prompt
  // - Output format instructions according to outputType
  const systemInstruction = `
You are an expert prompt designer AI. Your sole task is to rewrite and improve the users' raw prompt to make it a high-quality, detailed, and optimized meta-prompt for AI models (like ChatGPT, Claude, etc.).

**Do NOT answer or generate content based on the prompt.** Only enhance and restructure the prompt itself.

Structure the improved meta-prompt using these bold section headings (use ** for bold formatting):

**Role Description**  
**Task & Purpose**  
**Content Structure**  
**Required Elements**  
**Style & Approach**  
**Quality Standards**  
**Output Format**

In the **Output Format** section, explicitly instruct the AI model to respond in the "${outputType}" format (e.g., code, table, essay, bullet points) as specified by the user.

Ensure the enhanced prompt is clear, concise, logically structured, and optimized for the best AI response.
`;

  const userMessage = `Raw user prompt: "${prompt}".

Please generate a well-structured meta-prompt using the above sections, with each section title bolded.`;

  let response;

  for (const model of models) {
    try {
      response = await requestCompletion(model, [
        { role: 'system', content: systemInstruction },
        { role: 'user', content: userMessage },
      ]);

      if (response?.data?.choices?.[0]?.message?.content) {
        break;
      }
    } catch (err) {
      console.error(`Model ${model} failed:`, err.response?.data || err.message);
    }
  }

  if (!response?.data?.choices?.[0]?.message?.content) {
    return res.status(500).json({ error: 'All models failed to generate a response.' });
  }

  // Return the improved prompt only
  res.json({ improvedPrompt: response.data.choices[0].message.content });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
