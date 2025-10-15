import google.generativeai as genai
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Any
import os
from dotenv import load_dotenv

load_dotenv()

# ======== CONFIGURE GEMINI ==========
# Make sure your API key is valid and has access to Gemini models
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

app = FastAPI()

# Allow frontend (React) to call backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ======== FIXED MASTER TAG LIST =========
TAGS = [
    "AI/ML", "art", "coding", "cultural", "cybersecurity", "dance", "design", "drama",
    "electronics", "entrepreneurship", "finance", "gaming", "literature", "marketing",
    "music", "photography", "robotics", "social service", "sports", "tech", "theatre"
]

EVENTS: List[Dict[str, Any]] = []

class EventBase(BaseModel):
    title: str
    date: str
    desc: str

def predict_tags_logic(description: str) -> List[str]:
    prompt = f"""
You are a tag classifier for college events.
Event description: "{description}"

Choose ONLY relevant tags from this fixed list:
{", ".join(TAGS)}

Rules:
- Output must be a comma-separated list of tags from the list above.
- Do NOT include any explanations, prefixes, or suffixes, only the comma-separated list.
- Use exact spellings and casing.
- If no clear tags match, default to 'cultural'.

Example Input: A hackathon on AI and robotics
Example Output: AI/ML, robotics, tech
"""

    model_name = "models/gemini-2.5-flash"
    try:
        model = genai.GenerativeModel(model_name)
        response = model.generate_content(prompt)
        text_out = response.text.strip()
        print("Gemini raw response:", repr(text_out))  # Debug log

        # Remove markdown/code formatting if present
        text_out = text_out.replace('`', '').replace('json', '').strip()
        # Only take the first line if multiple lines
        text_out = text_out.split('\n')[0]
        raw_tags = [t.strip() for t in text_out.split(",") if t.strip()]
        tags = [t for t in raw_tags if t in TAGS]

        if not tags:
            print(f"⚠️ Tag prediction failed for description. Falling back.")
            if any(k in description.lower() for k in ['ai', 'code', 'robot', 'cyber', 'tech', 'electronics']):
                tags = ["tech"]
            else:
                tags = ["cultural"]
        return tags

    except Exception as e:
        print(f"❌ Error with model {model_name}:", e)
        return ["cultural"]

@app.post("/predict_tags")
def predict_tags_endpoint(event: EventBase):
    tags = predict_tags_logic(event.desc)
    return {"tags": tags}

@app.post("/add_event")
def add_event(event: EventBase):
    tags = predict_tags_logic(event.desc)
    new_id = EVENTS[-1]["id"] + 1 if EVENTS else 1
    new_event = {
        "id": new_id,
        "title": event.title,
        "date": event.date,
        "desc": event.desc,
        "tags": tags,
    }
    EVENTS.append(new_event)
    return new_event

@app.get("/get_events")
def get_events():
    return {"events": EVENTS}

@app.delete("/delete_event/{event_id}")
def delete_event(event_id: int):
    global EVENTS
    EVENTS = [e for e in EVENTS if e["id"] != event_id]
    return {"message": f"Event {event_id} deleted"}

@app.put("/edit_event/{event_id}")
def edit_event(event_id: int, updated: EventBase):
    for e in EVENTS:
        if e["id"] == event_id:
            e["title"] = updated.title
            e["date"] = updated.date
            e["desc"] = updated.desc
            e["tags"] = predict_tags_logic(updated.desc)
            return e
    return {"error": "Event not found"}