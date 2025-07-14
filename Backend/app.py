from typing import Union
from fastapi import FastAPI, UploadFile, File, Query
from fastapi.middleware.cors import CORSMiddleware
from transformers import AutoTokenizer, AutoModel
import torch
import faiss
import numpy as np
import pickle
import os
import sys
from pypdf import PdfReader
import google.generativeai as genai
from dotenv import load_dotenv
from pydantic import BaseModel

class AskRequest(BaseModel):
    text: str

load_dotenv()

app = FastAPI()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
genai.configure(api_key=GOOGLE_API_KEY)
model = genai.GenerativeModel("gemini-2.0-flash")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load tokenizer and model
tokenizer = AutoTokenizer.from_pretrained("BAAI/bge-base-en-v1.5")
embed_model = AutoModel.from_pretrained("BAAI/bge-base-en-v1.5")

# Simple FAISS index
embedding_dimension = 768
faiss_index = faiss.IndexFlatIP(embedding_dimension)
chunks_data = []  # Store text chunks with IDs

# Try to load existing index and data
if os.path.exists("faiss_index.bin"):
    faiss_index = faiss.read_index("faiss_index.bin")
    print("Loaded existing FAISS index")

if os.path.exists("chunks_data.pkl"):
    with open("chunks_data.pkl", "rb") as f:
        chunks_data = pickle.load(f)
    print(f"Loaded {len(chunks_data)} text chunks")

def load_user_index(user_id: int):
    index_path = f"faiss_index_user_{user_id}.bin"
    data_path = f"chunks_data_user_{user_id}.pkl"

    # Load or create index
    if os.path.exists(index_path):
        index = faiss.read_index(index_path)
    else:
        index = faiss.IndexFlatIP(embedding_dimension)

    # Load or create data
    if os.path.exists(data_path):
        with open(data_path, "rb") as f:
            chunks = pickle.load(f)
    else:
        chunks = []

    return index, chunks

def save_user_index(user_id: int, index, chunks):
    index_path = f"faiss_index_user_{user_id}.bin"
    data_path = f"chunks_data_user_{user_id}.pkl"

    faiss.write_index(index, index_path)
    with open(data_path, "wb") as f:
        pickle.dump(chunks, f)


@app.get("/")
def startup():
    return {"Hello": "World"}


def get_embedding(text):
    inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True)
    with torch.no_grad():
        embeddings = embed_model(**inputs).last_hidden_state[:, 0, :]  # CLS token
    vec = embeddings[0].numpy()
    # Normalize for cosine similarity
    vec /= np.linalg.norm(vec)
    return vec.reshape(1, -1).astype('float32')


@app.post("/upload/{user_id}")
async def upload_file(user_id: int, file: UploadFile = File(...)):
    # Load user's index and chunks
    index, chunks_data = load_user_index(user_id)

    if file.filename.endswith(".pdf"):
        reader = PdfReader(file.file)
        text = ""
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
    print("START")
    if(file.filename.endswith('.txt')):
        text = await file.read()
        text = text.decode("utf-8")
    
    lines = text.splitlines()
    chunk_size = 20
    chunks = []

    for i in range(0, len(lines), chunk_size):
        chunks.append(lines[i:i + chunk_size])

    print(chunks)
    for idx, chunk in enumerate(chunks):
        chunk_text = '\n'.join(chunk)
        embedding = get_embedding(chunk_text)
        index.add(embedding)
        chunk_id = len(chunks_data)
        chunks_data.append({
            'id': chunk_id,
            'text': chunk_text,
        })

    # Save back
    save_user_index(user_id, index, chunks_data)

    return {
        "message": f"Indexed {len(chunks)} chunks for user {user_id}",
        "total_vectors": index.ntotal
    }

@app.get("/search/{user_id}")
async def search(user_id: int, query: str = Query(...), k: int = 5):
    index, chunks_data = load_user_index(user_id)

    if index.ntotal == 0:
        return {"error": "No data for this user. Upload files first."}

    query_emb = get_embedding(query)
    D, I = index.search(query_emb, k)

    results = []
    for rank, (score, idx) in enumerate(zip(D[0], I[0])):
        chunk = chunks_data[idx]
        results.append({
            "rank": rank + 1,
            "text": chunk['text'],
            "similarity_score": float(score)
        })

    return {
        "query": query,
        "results": results
    }

def format_context(results: list) -> str:
    return "\n\n".join([res.get("text", "") for res in results])

@app.post("/ask/{user_id}")
async def ask(user_id: int,  body: AskRequest):
    search_results = await search(user_id, body.text, 5)

    query = search_results["query"]
    context = format_context(search_results["results"])

    prompt = f"""You are a helpful assistant. Based on the following context, answer the user's question.

    Context:
    {context}

    User Query:
    {query}
    """

    try:
        response = model.generate_content(prompt)
        return {
            "query": query,
            "answer": response.text,
            "chunks_used": search_results["results"],
        }
    except Exception as e:
        return {"error": str(e)}


