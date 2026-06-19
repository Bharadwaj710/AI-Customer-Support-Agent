from chromadb.utils import embedding_functions

onnx_ef = embedding_functions.DefaultEmbeddingFunction()

def generate_embedding(text:str):
    embeddings = onnx_ef([text])
    return embeddings[0]