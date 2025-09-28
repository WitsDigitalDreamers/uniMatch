import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import ModelClient, { isUnexpected } from '@azure-rest/ai-inference';
import { AzureKeyCredential } from '@azure/core-auth';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5002;
const ENDPOINT = process.env.AZURE_INFERENCE_ENDPOINT;
const DEFAULT_MODEL = 'openai/gpt-4o-mini';
const MODEL = process.env.AZURE_INFERENCE_MODEL || DEFAULT_MODEL;
const TOKEN = process.env.GITHUB_TOKEN;
if (!TOKEN) {
  console.warn('Warning: GITHUB_TOKEN not set. /api/chat will return 503.');
}

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/chat', async (req, res) => {
  try {
    if (!TOKEN) {
      return res.status(503).json({ error: 'Missing server token' });
    }

    const { messages, system } = req.body || {};
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'messages array required' });
    }

    // SDK call first
    try {
      const client = ModelClient(ENDPOINT, new AzureKeyCredential(TOKEN));
      let response = await client.path('/chat/completions').post({
        body: {
          messages: [
            { role: 'system', content: system || 'You are a helpful assistant for career guidance.' },
            ...messages,
          ],
          model: MODEL,
        },
      });

      if (!isUnexpected(response)) {
        const content = response.body?.choices?.[0]?.message?.content ?? '';
        return res.json({ content, raw: response.body });
      } else {
        console.error('SDK unexpected response:', response.status, response.body);
        // Auto-fallback if model unavailable
        const code = response.body?.error?.code;
        if (code === 'unavailable_model' && MODEL !== DEFAULT_MODEL) {
          console.warn(`Model ${MODEL} unavailable. Falling back to ${DEFAULT_MODEL}.`);
          response = await client.path('/chat/completions').post({
            body: {
              messages: [
                { role: 'system', content: system || 'You are a helpful assistant for career guidance.' },
                ...messages,
              ],
              model: DEFAULT_MODEL,
            },
          });
          if (!isUnexpected(response)) {
            const content = response.body?.choices?.[0]?.message?.content ?? '';
            return res.json({ content, raw: response.body, model: DEFAULT_MODEL });
          }
        }
      }
    } catch (sdkErr) {
      console.error('SDK call failed:', sdkErr);
    }

    // Fallback: direct HTTP call
    try {
      const httpResp = await fetch(`${ENDPOINT}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [
            { role: 'system', content: system || 'You are a helpful assistant for career guidance.' },
            ...messages,
          ]
        })
      });

      const data = await httpResp.json().catch(() => ({}));
      if (!httpResp.ok) {
        console.error('HTTP fallback failed:', httpResp.status, data);
        // Propagate 429 explicitly so frontend can handle fallback gracefully
        if (httpResp.status === 429) {
          return res.status(429).json({ error: 'Rate limited', status: 429, body: data });
        }
        // If model unavailable, retry with default model once
        const code = data?.error?.code;
        if (code === 'unavailable_model' && MODEL !== DEFAULT_MODEL) {
          const httpResp2 = await fetch(`${ENDPOINT}/chat/completions`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${TOKEN}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: DEFAULT_MODEL,
              messages: [
                { role: 'system', content: system || 'You are a helpful assistant for career guidance.' },
                ...messages,
              ]
            })
          });
          const data2 = await httpResp2.json().catch(() => ({}));
          if (httpResp2.ok) {
            const content2 = data2?.choices?.[0]?.message?.content ?? '';
            return res.json({ content: content2, raw: data2, model: DEFAULT_MODEL });
          }
          return res.status(httpResp2.status || 500).json({ error: 'Model API error', status: httpResp2.status, body: data2 });
        }
        return res.status(500).json({ error: 'Model API error', status: httpResp.status, body: data });
      }
      const content = data?.choices?.[0]?.message?.content ?? '';
      return res.json({ content, raw: data });
    } catch (httpErr) {
      console.error('HTTP fallback error:', httpErr);
      return res.status(500).json({ error: 'Internal error (fallback)' });
    }
  } catch (err) {
    console.error('Chat error:', err);
    return res.status(500).json({ error: 'Internal error' });
  }
});

app.listen(PORT, () => {
  console.log(`AI proxy listening on port ${PORT}`);
});


