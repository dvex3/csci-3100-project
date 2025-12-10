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
client = AzureOpenAI(
    api_version=api_version, azure_endpoint=endpoint, api_key=subscription_key
)

system_prompt = (
    "You are a code annotator. "
    "You will receive a specific function (function_name) and a code map (parsed_map). "
    "Your job is to describe what the function does in the code map. "
)


def get_user_prompt(function_name, parsed_map, code):
    return (
        f"Explain function: {function_name} in code map: {parsed_map} and code: {code}"
    )


def chat(function_name, parsed_map, code):
    print(function_name, parsed_map, code)
    # todo: improve message prompts
    user_prompt = get_user_prompt(function_name, parsed_map, code)
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
