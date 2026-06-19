import re

def section_chunker(text:str):

    sections=re.split(r"\n##",text)

    chunks=[]

    for section in sections:

        section=section.strip()

        if not section:
            continue

        lines=section.split("\n")

        title=lines[0].strip()

        content="\n".join(lines[1:]).strip()

        if title.startswith("#"):
            continue

        chunks.append(
            {
                "section":title,
                "content":content
            }
        )
    return chunks