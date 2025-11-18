import google.generativeai as genai
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import os
from dotenv import load_dotenv

load_dotenv()

# ======== CONFIGURE GEMINI ==========
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
print("Gemini Key starts with:", os.getenv("GEMINI_API_KEY")[:8])


# ======== CONFIGURE SUPABASE =========
from supabase import create_client

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

# 🔥 DEBUG PRINT — THIS MUST SHOW IN RENDER LOGS
print("Connected to Supabase:", SUPABASE_URL)
print("Supabase Key Starts With:", SUPABASE_KEY[:10] if SUPABASE_KEY else "NO KEY LOADED")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise RuntimeError("Missing SUPABASE_URL or SUPABASE_KEY in .env")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

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

class EventBase(BaseModel):
    title: str
    date: str
    desc: str

# ======== TAG PREDICTION LOGIC =========
def predict_tags_logic(description: str) -> List[str]:
    prompt = f"""
You are a tag classifier for college events.
Event description: "{description}"

Choose ONLY relevant tags from this fixed list:
{", ".join(TAGS)}

Rules:
- Output must be a comma-separated list of tags.
- Use exact spellings.
- If unsure, return 'cultural'.
"""

    model_name = "models/gemini-2.0-flash"   # UPDATED MODEL NAME

    try:
        model = genai.GenerativeModel(model_name)
        response = model.generate_content(prompt)

        print("=== GEMINI RAW RESPONSE ===")
        print(response)
        print("=== GEMINI TEXT ===")
        print(response.text if response else "NO RESPONSE")

        if not response or not response.text:
            print("⚠️ Empty response from Gemini.")
            return ["cultural"]

        text_out = response.text.strip()
        text_out = text_out.replace("`", "")
        text_out = text_out.split("\n")[0]

        raw_tags = [t.strip() for t in text_out.split(",") if t.strip()]
        tags = [t for t in raw_tags if t in TAGS]

        if not tags:
            print("⚠️ Gemini returned no valid tags.")
            return ["cultural"]

        return tags

    except Exception as e:
        print("❌ GEMINI ERROR:", e)
        return ["cultural"]

# ======== API ENDPOINTS ==========

@app.post("/predict_tags")
def predict_tags(event: EventBase):
    return {"tags": predict_tags_logic(event.desc)}

@app.post("/add_event")
def add_event(event: EventBase):
    tags = predict_tags_logic(event.desc)

    data = {
        "title": event.title,
        "description": event.desc,
        "event_date": event.date,
        "tags": tags
    }

    # Insert into Supabase (NEW V2 SYNTAX)
    res = supabase.table("events").insert(data).execute()

    if not res.data:
        raise HTTPException(status_code=500, detail="Supabase insertion failed")

    row = res.data[0]

    return {
        "id": row["id"],
        "title": row["title"],
        "date": row["event_date"],
        "desc": row["description"],
        "tags": row["tags"]
    }

@app.get("/get_events")
def get_events():
    res = supabase.table("events").select("*").order("id").execute()

    events = []
    for r in res.data:
        events.append({
            "id": r["id"],
            "title": r["title"],
            "date": r["event_date"],
            "desc": r["description"],
            "tags": r["tags"]
        })

    return {"events": events}

@app.delete("/delete_event/{event_id}")
def delete_event(event_id: int):
    supabase.table("events").delete().eq("id", event_id).execute()
    return {"message": f"Event {event_id} deleted"}

@app.put("/edit_event/{event_id}")
def edit_event(event_id: int, updated: EventBase):
    tags = predict_tags_logic(updated.desc)

    res = supabase.table("events").update({
        "title": updated.title,
        "description": updated.desc,
        "event_date": updated.date,
        "tags": tags
    }).eq("id", event_id).select("*").execute()

    if not res.data:
        raise HTTPException(status_code=404, detail="Event not found")

    r = res.data[0]

    return {
        "id": r["id"],
        "title": r["title"],
        "date": r["event_date"],
        "desc": r["description"],
        "tags": r["tags"]
    }
