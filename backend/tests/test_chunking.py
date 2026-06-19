from services.document_loader import load_documents
from services.chunker import section_chunker

documents = load_documents()

doc = documents[0]

chunks = section_chunker(
    doc["content"]
)

print(chunks)