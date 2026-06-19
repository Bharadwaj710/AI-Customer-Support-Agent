from services.vector_store import (
    store_documents,
    collection
)

print("BEFORE:", collection.count())

store_documents()

print("AFTER:", collection.count())