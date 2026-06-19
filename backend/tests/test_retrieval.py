from services.retriever import retrieve

results = retrieve(
      "Dashboard is not loading"
)

for result in results:

    print("\n")
    print(result["source"])
    print(result["section"])
    print(result["content"])