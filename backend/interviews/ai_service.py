import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def generate_question(role="software developer"):
    prompt = f"Generate a challenging interview question for a {role} position."
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are an AI interview coach."},
            {"role": "user", "content": prompt},
        ],
    )
    return response.choices[0].message.content.strip()

def evaluate_answer(question, answer):
    prompt = f"Question: {question}\nAnswer: {answer}\n\nProvide constructive feedback and a score (1–10)."
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are an AI interviewer evaluating answers."},
            {"role": "user", "content": prompt},
        ],
    )
    return response.choices[0].message.content.strip()
