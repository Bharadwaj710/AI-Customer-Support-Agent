from services.retriever import retrieve
from services.llm_service import generate_response
import time
from config import LLM_PROVIDER, LLM_MODEL


def generate_rag_answer(query: str):
    start_time = time.time()

    # Step 1: Retrieve relevant chunks
    retrieved_chunks = retrieve(query,k=1)

    # Step 2: Build context
    context = ""

    for chunk in retrieved_chunks:

        context += f"""
Source: {chunk['source']}
Section: {chunk['section']}

Content:
{chunk['content']}

----------------------------------------
"""

    prompt = f"""
You are an AI customer support assistant.

Use the documentation context to answer the user's question.

Rules:
1. Use only information from the provided documentation.
2. You may paraphrase and summarize.
3. Do not invent features, buttons, links, or workflows.
4. If the documentation partially answers the question, provide the available information and clearly mention any missing details.
5. If the documentation lacks the exact answer but has closely related information (e.g., asked for password recovery, but docs only have password change), state clearly that the requested action is missing, but offer the related available information.
6. If the documentation contains no relevant information at all, respond:
   "This information is not available in the documentation."
7. Structure your response professionally: use **bold headers** for categories (e.g., **For orders not yet shipped:**), and use numbered lists (1. 2. 3.) or bullet points for steps. Never write a giant wall of text.

Documentation Context:
{context}

Question:
{query}
"""

    
    answer = generate_response(prompt)

    # Step 5: Collect source citations
    sources = []

    seen = set()

    for chunk in retrieved_chunks:

        source_key = (
            chunk["source"],
            chunk["section"]
        )

        if source_key not in seen:

            seen.add(source_key)

            sources.append(
                {
                    "source": chunk["source"],
                    "section": chunk["section"],
                    "content": chunk["content"]
                }
            )

    # Step 6: Return final response
    return {
        "answer": answer,
        "sources": sources,
        "metadata": {
            "response_time": round(time.time() - start_time, 2),
            "retrieved_chunks": len(retrieved_chunks),
            "provider": LLM_PROVIDER,
            "model": LLM_MODEL
        }
    }