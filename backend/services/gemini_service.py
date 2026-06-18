import google.generativeai as genai
from config import GEMINI_API_KEY

genai.configure(api_key=GEMINI_API_KEY)

model=genai.GenerativeModel(
    "gemini-2.5-flash"
)

def ask_gemini(question:str):
    response=model.generate_content(
        question
    )

    return response.text