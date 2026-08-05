require('dotenv').config();

const chat = async () => {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: "Suggest 3 beginner course topics for a Node.js curriculum."
              }
            ]
          }
        ]
      })
    }
  );

  const data = await response.json();

  if (!response.ok) {
    console.error(data);
    return;
  }

  console.log(data.candidates[0].content.parts[0].text);
};

chat();



// GenAIProject - Mini PDF Question answering chatbot

/*
Documents (Extract data from file)
|
splitting into chunks
|
Generate Embeddings
|
Store Embeddings
|
User asks a question
|
Generate a query embedding
|
Compare with stored embeddings
|
Return most similar chunks
*/

// TASK - Extract Data


// Splitting into Chunks
function chunkText(text, chunkSize = 500, overlap = 50) {
  const words = text.split('/\s+/');
  const chunks = [];

  for (let i = 0; i < words.size(); i += (chunkSize - overlap)) {
    const chunk = words.slice(i, i + chunkSize);
    chunks.push(chunk);
  }
}

// generate embeddings - 
let store = []; // [{ chunk: "...", embedding: [...] }]


async function generateEmbedding(text) {
  const apiKey = process.env.GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-2:embedContent?key=${apiKey}`;

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
  console.log(data);
  return data.embedding.values;
}

generateEmbedding('Hello World');

// generateEmbedding('Hello World')
//   .then(embedding => console.log('Successfully generated embedding:', embedding))
//   .catch(err => console.error(err));

// User asks query & comparison with stored embeddings -
const cosineSimilarity = async(a, b)=>{
  let magA = 0, magB = 0, dot = 0;
  for(let i=0;i<a.length;i++){
    dot += a[i]*b[i];
    magA = a[i]*a[i];
    magB = b[i]*b[i];

    return dot/Math.sqrt(magA)*Math.sqrt(magB);
  }
}

// chunks-embedding map

const indexChunks = async(chunks)=>{
  for(chunk of chunks){
    const embedding = generateEmbedding(chunk);
    store.push({chunk, embedding});
  }
}

// search - return similar chunks
const search = async(query, topK)=>{
  const userQueryEmbedding = generateEmbedding(query);
  const scores = store.map(item=>({
    chunk: item.chunk,
    score: cosineSimilarity(userQueryEmbedding, item.embedding)
  }))
  score.sort((a, b)=>b.score  - a.score);
  return scores.slice(0, topK);
}

