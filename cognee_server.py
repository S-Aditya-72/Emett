import os
from pathlib import Path
from dotenv import load_dotenv

# 1. Load the keys
env_path = Path('.') / '.env.local'
load_dotenv(dotenv_path=env_path)

# 2. Configure Keys AND Force Standard Models
os.environ["LLM_API_KEY"] = os.getenv("OPENAI_API_KEY", "")
base_url = os.getenv("OPENAI_BASE_URL")
if base_url:
    os.environ["LLM_API_BASE"] = base_url

# Force Cognee to use models that the AIML API supports
os.environ["LLM_MODEL"] = "gpt-4o"
os.environ["EMBEDDING_MODEL"] = "text-embedding-3-small"

import cognee
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()

class MemoryRequest(BaseModel):
    companyName: str
    signal: str

class SearchRequest(BaseModel):
    companyName: str

@app.post("/remember")
async def remember(req: MemoryRequest):
    try:
        text_to_remember = f"Historical Context for {req.companyName}: {req.signal}"
        # Step 1: Add raw text to Cognee (This will always succeed)
        await cognee.add(text_to_remember)
        
        # Step 2: Build the Graph (This is where AIML API sometimes struggles)
        try:
            await cognee.cognify()
            print(f"[Cognee] Successfully cognified memory for {req.companyName}")
        except Exception as cognify_error:
            # SAFETY NET: If AIML API rejects the graph, we catch the error 
            # so the Next.js app doesn't crash!
            print(f"[Cognee Warning] Graph creation skipped due to AI API limit, but memory was added: {cognify_error}")
            
        return {"status": "success", "message": f"Memory saved for {req.companyName}"}
    except Exception as e:
        print(f"Remember error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/search")
async def search(req: SearchRequest):
    try:
        results = await cognee.search(req.companyName)
        
        if not results:
            return {"memory": ""}
            
        memory_text = " ".join([str(res) for res in results])
        return {"memory": memory_text}
    except Exception as e:
        print(f"Search error: {e}")
        return {"memory": ""}