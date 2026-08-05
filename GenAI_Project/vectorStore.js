let store = []; // [{ chunk: "...", embedding: [...] }]

async function embed(text) {
  const apiKey = process.env.GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${apiKey}`;


  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      content: {
        parts: [{ text: text }]
      }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API Error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  // Gemini returns the embedding array inside embedding.values
  return data.embedding.values;
}


// testing embedding function -

// generateEmbedding('Hello World')
//   .then(embedding => console.log('Successfully generated embedding:', embedding))
//   .catch(err => console.error(err));


function cosineSimilarity(a, b) {
  let dot = 0, magA = 0, magB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }
  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

async function indexChunks(chunks) {
  store = [];
  for (const chunk of chunks) {
    const embedding = await embed(chunk);
    store.push({ chunk, embedding });
  }
}

async function search(query, topK = 3) {
  const queryEmbedding = await embed(query);
  const scored = store.map(item => ({
    chunk: item.chunk,
    score: cosineSimilarity(queryEmbedding, item.embedding)
  }));
  scored.sort((a, b) => b.score - a.score); // highest similarity first
  return scored.slice(0, topK);
}
module.exports = { indexChunks, search };