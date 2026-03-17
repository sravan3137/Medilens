
# RAG-Based Doctor–Patient Communication System

## Introduction
A Retrieval-Augmented Generation (RAG) system that enables authenticated communication between doctors and patients with AI-assisted access to medical data.

## Features
- Secure doctor–patient communication
- Retrieval-Augmented Generation (RAG) system
- Integration with IBM Granite LLM
- Semantic search using FAISS
- Document pipeline with chunking, embedding generation, and vector indexing
- Role-based authentication and access control

## Tech Stack
- MERN Stack (MongoDB, Express, React, Node.js)
- IBM Granite LLM
- FAISS
- FastAPI
- Uvicorn

## Tools & Libraries
- Sentence Transformers
- PyTorch
- Replicate API
- Python Dotenv

## Architecture

This project uses two backend services:

1. Node.js (Express) → handles authentication & doctor–patient communication
2. FastAPI (Python) → handles RAG pipeline, embeddings, and AI responses

## Installation
Clone the repository
```powershell
git clone https://github.com/sravan3137/Medilens
cd Medilens
```
Backend Node.js Setup
```powershell
cd backend/server
npm install
npm run dev
```
Backend FastApi Setup 
- Create Virtual Environment
  ```powershell
  python -m venv venv
  .\venv\Scripts\Activate.ps1
  ```
- Install Requirements and Run Uvicorn
  ```powershell
  pip install -r requirements.txt
  python api.py
  ```
Frontend Setup
```powershell
cd ../../frontend/nhetis
npm install
npm run dev
```

For this to work properly, create a .env file inside the server folder and add the following environment variables:
```env
MONGODB_URI=<your MongoDB connection string>
JWT_SECRETKEY_1=<your own secret key>
```
MONGODB_URI is the connection string used by Mongoose to connect your backend to your MongoDB database.
You can obtain this connection string by creating a cluster in MongoDB Atlas at https://www.mongodb.com/products/platform/atlas-database and then using the “Connect” → “MongoDB Drivers”->copy connection string and paste in .env

JWT_SECRETKEY_1 should be any long, random string that you use as the secret for signing your JWTs.

Also create another .env file inside the backend folder and add
```env
REPLICATE_API_TOKEN=your_replicate_api_token_here
```
get your replicate api token for free at https://replicate.com/account/api-tokens

