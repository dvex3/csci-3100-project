import os

from flask import current_app
from openai import AzureOpenAI
from dotenv import load_dotenv
from pathlib import Path

dotenv_path = Path(__file__).parent / ".env"
load_dotenv()
endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
model_name = "gpt-4.1"
deployment = "gpt-4.1"
subscription_key = os.getenv("AZURE_OPENAI_KEY")
api_version = "2025-01-01-preview"

system_prompt = """
You are a function annotation assistant.

You receive:
1) the full source code of one function, and
2) a parsed_map JSON describing structural information of the entire file.

Your task is to generate a single coherent explanation that integrates:
- what the function does based strictly on its code, and
- any relevant structural context from parsed_map (e.g., who it calls, who calls it, recursion, control flow).

Rules:
- Do NOT list parameters, calls, returns, or other structural fields separately.
- Do NOT speculate beyond what is supported by the function code or parsed_map.
- Do NOT infer data schemas, API behavior, or external side effects.
- You may describe the function's role within the file using only parsed_map-supported structure.

Output: a unified, concise explanation of the function's behavior and role.
""".strip()


def get_user_prompt(function_name, parsed_map):
    return f"Explain function: {function_name} in code map: {parsed_map} "

def get_client():
    return AzureOpenAI(
        api_version=api_version, azure_endpoint=endpoint, api_key=subscription_key
    )



def chat(function_name, parsed_map):
    user_prompt = get_user_prompt(function_name, parsed_map)
    message = [
        {
            "role": "system",
            "content": system_prompt,
        },
        {
            "role": "user",
            "content": user_prompt,
        },
    ]

    client = get_client()
    response = client.chat.completions.create(
        messages=message,
        model=deployment,
        max_completion_tokens=1000,
        temperature=0.2,
        top_p=1.0,
        frequency_penalty=0.0,
        presence_penalty=0.0,
    )
    reply = response.choices[0].message.content
    return reply
