from typing import Union
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from fastapi import UploadFile, File
from transformers import AutoTokenizer, AutoModel
import torch
import faiss
import numpy as np
import pickle

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

tokenizer = AutoTokenizer.from_pretrained("BAAI/bge-base-en-v1.5")
embed_model = AutoModel.from_pretrained("BAAI/bge-base-en-v1.5")

# Simple FAISS index
embedding_dimension = 768
faiss_index = faiss.IndexFlatIP(embedding_dimension)
chunks_data = []  # Store text chunks with IDs

@app.get("/")
def startup():
    return {"Hello": "World"}

def get_embedding(text):
    inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True)
    with torch.no_grad():
        embeddings = embed_model(**inputs).last_hidden_state.mean(dim=1)
    return embeddings[0].numpy().reshape(1, -1).astype('float32')

@app.post("/upload/{user_id}")
async def read_item(user_id: int, file: UploadFile = File(...)):
    text = await file.read()
    text = text.decode("utf-8")
    lines = text.splitlines()
    chunk_size = 20
    chunks=[]
    for i in range(0, len(lines), chunk_size):
        chunks.append(lines[i:i+chunk_size])



    for idx, chunk in enumerate(chunks):
        print(chunk[0])
        chunk_text = '\n'.join(chunk)  # Join lines into single text
        embeddings = get_embedding(chunk_text)
        print(embeddings)
        
        # Add to FAISS index
        faiss_index.add(embeddings)
        
        # Store chunk data with ID
        chunk_id = len(chunks_data)
        chunks_data.append({
            'id': chunk_id,
            'text': chunk_text,
            'user_id': user_id
        })
        
        print("\n\n")
    print("Achha jiiiiii hello ji")

    print(user_id)
    print(f"Total vectors in FAISS: {faiss_index.ntotal}")
    
    # Save FAISS index and chunks data to files
    faiss.write_index(faiss_index, "faiss_index.bin")
    with open("chunks_data.pkl", "wb") as f:
        pickle.dump(chunks_data, f)
    
    return {"item_id": user_id}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)