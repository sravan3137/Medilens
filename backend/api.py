# api.py

from fastapi import FastAPI
from pydantic import BaseModel
from services import RAGService
import uvicorn

# Initialize the RAG service once
rag = RAGService()

app = FastAPI(title="RAG Medical Chatbot")

class QuestionRequest(BaseModel):
    user_id: str
    question: str
    role:str

@app.post("/ask")
def ask_question(req: QuestionRequest):
    # print("Request:",req)
    answer = rag.ask(
        question=req.question,
        user_id=req.user_id,
       role=req.role)
    return {"answer": answer}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)
