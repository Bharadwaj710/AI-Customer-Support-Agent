from services.rag_service import generate_rag_answer

result = generate_rag_answer(
    "How do I reset my password?"
)

print("\nANSWER:")
print(result["answer"])

print("\nSOURCES:")

for source in result["sources"]:
    print(
        f"{source['source']} -> {source['section']}"
    )