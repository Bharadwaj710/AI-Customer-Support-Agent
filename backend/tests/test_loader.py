from services.document_loader import load_documents

docs=load_documents()

for doc in docs:
    print(doc["filename"])