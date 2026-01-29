from services import RAGService

rag = RAGService()

response = rag.ask(
    question="do i have diabetes?",
    user_id="PAT101"
)

print("\n--- RAG RESPONSE ---\n")
print(response)
