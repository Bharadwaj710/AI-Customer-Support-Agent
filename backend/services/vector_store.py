import chromadb

from services.embedding_pipeline import process_documents

import os
import chromadb

BASE_DIR = os.path.dirname(
    os.path.dirname(
        os.path.abspath(__file__)
    )
)

CHROMA_PATH = os.path.join(
    BASE_DIR,
    "chroma_db"
)

print("CHROMA PATH:", CHROMA_PATH)

client = chromadb.PersistentClient(
    path=CHROMA_PATH
)

collection = client.get_or_create_collection(
    name="support_docs"
)

print("CHROMA COUNT:", collection.count())

collection = client.get_or_create_collection(
    name="support_docs"
)
print("CHROMA COUNT:", collection.count())

def store_documents():

    chunks = process_documents()

    existing_ids = set(
        collection.get()["ids"]
    )

    for chunk in chunks:

        if chunk["id"] in existing_ids:
            continue

        collection.add(
            ids=[chunk["id"]],
            documents=[chunk["content"]],
            
            embeddings=[chunk["embedding"]],
            metadatas=[
                {
                    "source": chunk["source"],
                    "section": chunk["section"]
                }
            ]
        )

    print("Documents stored successfully")