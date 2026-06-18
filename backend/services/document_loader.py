from pathlib import Path

def load_documents():
    docs=[]

    data_path=Path("data")

    for file in data_path.glob(".*md"):
        with open(file,"r",encoding="utf-8") as f:
            docs.append({
                "filename":file.name,
                "content":f.read()
            })
    return docs