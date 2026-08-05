// RAG Endpoint
require('dotenv').config();
const express = require('express');
const extractText = require('./extractText');
const chunkText = require('./chunkText');
const { indexChunks, search } = require('./vectorStore');
const { requireApiKey } = require('./middleware/auth');
const { indexRateLimiter, askRateLimiter } = require('./middleware/rateLimiter');

const app = express();
app.use(express.json());

// one-time indexing endpoint
app.post('/api/index', indexRateLimiter, requireApiKey, async (req, res) => {
  try {
    const text = await extractText('./course-syllabus.pdf');
    const chunks = chunkText(text);
    await indexChunks(chunks);
    res.json({ message: `Indexed ${chunks.length} chunks` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// the actual RAG query endpoint
app.post('/api/ask', askRateLimiter, requireApiKey, async (req, res) => {
  try {
    const { question } = req.body;
    const topChunks = await search(question, 3);
    const context = topChunks.map(c => c.chunk).join('\n\n---\n\n');

    const apiKey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{
            text: "Answer the user's question using ONLY the provided context. If the context doesn't contain the answer, say so honestly — do not make up information."
          }]
        },
        contents: [{
          role: "user",
          parts: [{
            text: `Context:\n${context}\n\nQuestion: ${question}`
          }]
        }],
        generationConfig: {
          maxOutputTokens: 500
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API Error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
   
    // Gemini returns the generated text inside candidates array
    const answer = data.candidates[0].content.parts[0].text;

    res.json({
      answer: answer,
      sources: topChunks.map(c => c.chunk.slice(0, 100) + '...')
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.listen(4000, () => console.log('RAG bot running on http://localhost:4000'));