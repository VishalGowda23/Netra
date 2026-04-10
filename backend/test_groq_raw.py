import os
from config import settings
from groq import Groq

client = Groq(api_key=settings.GROQ_API_KEY)

completion = client.chat.completions.create(
    model="llama-3.3-70b-versatile",
    messages=[
        {
            "role": "user",
            "content": "Say hello!"
        }
    ],
    temperature=0,
    max_tokens=10,
)

print(completion.choices[0].message.content)
