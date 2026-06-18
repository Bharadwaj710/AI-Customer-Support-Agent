from services.embedder import generate_embedding

vector=generate_embedding(
    "How do i change my password?"
)

print(type(vector))
print(len(vector))