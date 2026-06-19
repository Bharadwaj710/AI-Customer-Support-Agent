from services.embedding_pipeline import (
    process_documents
)

chunks = process_documents()

print(
    f"Total Chunks: {len(chunks)}"
)

print()

print(chunks[0]["source"])

print(chunks[0]["section"])

print(
    len(chunks[0]["embedding"])
)