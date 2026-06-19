from services.embedder import generate_embedding
from services.vector_store import collection


def retrieve(query: str, k: int = 3):

    query_embedding = generate_embedding(query)

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=k
    )
    print("\nDISTANCES:")
    print(results["distances"])

    formatted_results = []

    docs = results["documents"][0]
    metas = results["metadatas"][0]
    distances = results["distances"][0]

    for doc, meta, distance in zip(
        docs,
        metas,
        distances
    ):

        formatted_results.append(
            {
                "source": meta["source"],
                "section": meta["section"],
                "content": doc
            }
        )

    return formatted_results