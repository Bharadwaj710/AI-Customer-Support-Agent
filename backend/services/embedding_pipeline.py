from services.document_loader import load_documents
from services.chunker import section_chunker
from services.embedder import generate_embedding


def process_documents():

    processed_chunks = []

    documents = load_documents()

    for doc in documents:

        sections = section_chunker(
            doc["content"]
        )

        for idx, section in enumerate(sections):

            text_for_embedding = f"""
            {section['section']}

            {section['content']}
            """

            embedding = generate_embedding(
                text_for_embedding
            )

            processed_chunks.append(
                {
                    "id": f"{doc['filename']}_{idx}",

                    "source": doc["filename"],

                    "section": section["section"],

                    "content": section["content"],

                    "embedding": embedding
                }
            )

    return processed_chunks