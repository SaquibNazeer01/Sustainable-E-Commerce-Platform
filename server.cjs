// Simple development proxy server to safely call the Google Generative AI API
// Keeps the API key on the server-side instead of exposing it in the browser.
const express = require('express');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });

const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(express.json());

// Allow CORS for local development only — lock this down for production.
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

const apiKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error('No API key found in .env.local (VITE_GEMINI_API_KEY or GEMINI_API_KEY)');
}

const ai = apiKey ? new GoogleGenerativeAI(apiKey) : null;

app.post('/api/chat', async (req, res) => {
  if (!ai) return res.status(500).json({ error: 'API key not configured' });
  const { message, history } = req.body || {};
  if (!message) return res.status(400).json({ error: 'message is required' });

  try {
    const model = ai.getGenerativeModel({ model: 'gemini-pro' });
    const chat = await model.startChat({ history: history || [] });
    const result = await chat.sendMessage({ text: message });
    const response = await result.response;
    const text = response?.text ? response.text() : '';
    return res.json({ text });
  } catch (err) {
    console.error('Chat error:', err);
    return res.status(500).json({ error: err.message || 'chat error' });
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Dev proxy server listening on http://localhost:${port}`);
});
