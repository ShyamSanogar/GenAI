# Generative AI Basics

# 1. Introduction to AI

## What is Artificial Intelligence (AI)?

Artificial Intelligence (AI) is a branch of computer science that focuses on building machines capable of performing tasks that typically require human intelligence.

Examples of AI tasks:

* Decision making
* Problem solving
* Speech recognition
* Image understanding
* Natural language understanding
* Recommendation systems

AI systems learn from data and use algorithms to make predictions or decisions.

---

# 2. AI Hierarchy (AI Roadmap)

Artificial Intelligence is a broad field containing multiple subfields.

```
Artificial Intelligence (AI)
            |
            |
     Machine Learning (ML)
            |
            |
     Deep Learning (DL)
            |
            |
     Neural Networks
            |
            |
     Generative AI
            |
            |
     Large Language Models (LLMs)
```

---

# 3. Machine Learning (ML)

Machine Learning is a subset of AI where machines learn patterns from data without being explicitly programmed.

Instead of writing rules manually:

```
Input → Rules → Output
```

ML learns:

```
Input + Data → Learning Algorithm → Model → Prediction
```

Examples:

* Spam detection
* Fraud detection
* Movie recommendations
* House price prediction

---

## Types of Machine Learning

### 1. Supervised Learning

The model learns from labeled data.

Example:

```
Input:
Image of cat

Label:
Cat
```

Algorithms:

* Linear Regression
* Decision Trees
* Neural Networks

---

### 2. Unsupervised Learning

The model learns patterns from unlabeled data.

Examples:

* Customer segmentation
* Clustering

Algorithm:

* K-Means clustering

---

### 3. Reinforcement Learning

The model learns through rewards and penalties.

Example:

* Game-playing AI
* Robotics

---

# 4. Deep Learning (DL)

Deep Learning is a subset of Machine Learning that uses artificial neural networks.

It is inspired by the structure of the human brain.

Deep learning is effective for:

* Images
* Audio
* Text
* Video

Examples:

* Face recognition
* Speech assistants
* Self-driving cars

---

# 5. Natural Language Processing (NLP)

NLP is a field of AI that enables computers to understand, process, and generate human language.

Examples:

* Translation
* Sentiment analysis
* Chatbots
* Text summarization
* Speech recognition

Traditional NLP techniques:

* Tokenization
* Stemming
* Lemmatization
* TF-IDF

Modern NLP uses:

* Transformers
* Large Language Models (LLMs)

---

# 6. Traditional AI vs Generative AI

## Traditional AI

Traditional AI focuses on:

* Classification
* Prediction
* Decision making

Example:

```
Input → AI Model → Output Label
```

Examples:

* Spam classifier
* Fraud detection
* Recommendation system

---

## Generative AI

Generative AI creates new content based on learned patterns.

It can generate:

* Text
* Images
* Audio
* Video
* Code

Example:

```
Prompt → GenAI Model → New Content
```

Examples:

* Chatbots
* Image generators
* Code assistants

---

## Comparison

| Traditional AI          | Generative AI                |
| ----------------------- | ---------------------------- |
| Predicts results        | Creates new content          |
| Uses structured outputs | Generates human-like content |
| Mostly classification   | Content generation           |
| Example: Spam detector  | Example: ChatGPT             |

---

# 7. Generative AI Roadmap

```
AI
 |
Machine Learning
 |
Deep Learning
 |
Neural Networks
 |
Transformers
 |
Large Language Models
 |
Generative AI Applications
```

---

## Important Technologies

### Neural Networks

Computational models inspired by biological neurons.

Used for:

* Pattern recognition
* Learning complex relationships

---

### Transformers

A deep learning architecture introduced for understanding sequences.

Transformers power modern LLMs.

Important concept:

```
Attention Mechanism
```

It helps models understand relationships between words.

Transformer Architecture -
https://framerusercontent.com/images/Gi6IybLpxFg1hAU2TIJnoSQ.jpeg

---

### Large Language Models (LLMs)

LLMs are AI models trained on massive amounts of text data.

Examples:

* GPT models
* Llama models
* Claude models
* Gemini models

They can perform:

* Text generation
* Question answering
* Summarization
* Translation
* Code generation

---

# 8. Multimodal LLMs

A multimodal model can understand and generate multiple types of data.

Modalities include:

* Text
* Images
* Audio
* Video

Traditional LLM:

```
Text → Model → Text
```

Multimodal LLM:

```
Text + Image + Audio → Model → Response
```

Examples:

Applications:

* Image understanding
* Document analysis
* Voice assistants

---

# 9. Tokens

LLMs do not process text directly.

They process **tokens**.

A token is a small unit of text.

Example:

Sentence:

```
I love artificial intelligence
```

Possible tokenization:

```
"I"
"love"
"artificial"
"intelligence"
```

Tokens can be:

* Complete words
* Parts of words
* Characters

LLMs generate output token by token.

---

## Token Example

Input:

```
Explain AI
```

The model converts it:

```
Text
 ↓
Tokens
 ↓
Numbers
 ↓
LLM Processing
 ↓
Tokens
 ↓
Text Output
```

---

# 10. Context Window

The context window is the maximum number of tokens an LLM can process at one time.

It includes:

* User input
* Previous conversation
* System instructions
* Generated response

Example:

If a model has:

```
Context window = 100,000 tokens
```

It can remember and process up to that amount of information.

---

# 11. Parameters

Parameters are the internal values learned by a model during training.

They store patterns and relationships learned from data.

More parameters generally mean:

* Higher capability
* Better understanding

Example:

```
Small Model:
1 billion parameters

Large Model:
100+ billion parameters
```

Parameters are adjusted during training using optimization techniques.

---

# 12. Prompting

Prompting means providing instructions or input to an AI model to get desired output.

A prompt can include:

* Instructions
* Context
* Examples
* Constraints

Example:

```
Write a Python program to reverse a string.
```

---

# 13. Types of Prompts

## System Prompt

Defines the behavior and role of the AI.

Example:

```
You are a helpful programming assistant.
Explain concepts with examples.
```

System prompts usually have the highest priority.

---

## User Prompt

The actual request given by the user.

Example:

```
Explain binary search.
```

---

## Assistant Response

The response generated by the AI model.

Example:

```
Binary search is an algorithm...
```

---

# 14. Prompting Techniques

## Zero-Shot Prompting

The model receives a task without any examples.

Example:

```
Translate this sentence into French:

Hello, how are you?
```

No example is provided.

---

## One-Shot Prompting

One example is provided.

Example:

```
Example:

English:
Hello

French:
Bonjour


Now translate:

Good morning
```

---

## Few-Shot Prompting

Multiple examples are provided.

Example:

```
Input:
Happy
Output:
Positive

Input:
Sad
Output:
Negative

Input:
Amazing
Output:
?
```

The model learns the pattern from examples.

---

# 15. Building a Chatbot Using LLM API




# 17. Applications of Generative AI

## Text Generation

* Content writing
* Emails
* Documentation

## Coding Assistance

* Code generation
* Debugging
* Explanation

## Image Generation

* Design
* Marketing content

## Education

* Personalized learning
* AI tutors

## Customer Support

* Chatbots
* Automated responses
