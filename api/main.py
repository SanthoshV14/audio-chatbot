from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Union
from model import Model
from config import Config
import uvicorn
import tempfile
import os
import ffmpeg
import json

app = FastAPI()
model = Model()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods.
    allow_headers=["*"],  # Allows all HTTP headers.
)

# Define a root endpoint
@app.get("/health")
def read_root():
    return {"result": True}

@app.post("/audio-text")
async def audio_to_text(file: UploadFile = File(...)) -> Dict[str, Union[str, bool]]:
    """
    Endpoint to receive an audio file and transcribe it using Hugging Face Whisper model.
    """
    # Save the uploaded file temporarily
    with tempfile.NamedTemporaryFile(delete=False, suffix=".webm") as temp_file:
        temp_file.write(await file.read())
        temp_file_path = temp_file.name

    try:
        # Convert the audio to a supported format (e.g., wav) using ffmpeg
        wav_file_path = temp_file_path.replace(".webm", ".wav")
        ffmpeg.input(temp_file_path).output(wav_file_path).run()
        result = model.transcribe(wav_file_path)
        os.remove(temp_file_path)
        os.remove(wav_file_path)
        return {
            "success": True,
            "result": result["text"]
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }

class ChatRequest(BaseModel):
    query: str

@app.post("/chat")
async def chat(request: ChatRequest) -> Dict[str, Union[str, bool]]:
    """
    Endpoint to handle chat input and generate a response using the Model class.
    """
    try:
        result = model.chat(request.query)
        result = result[0]["generated_text"]
        result = json.dumps(result)
        return {
            "success": True,
            "result": result
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }


@app.post("/text-audio")
async def text_to_audio(file: UploadFile = File(...)) -> Dict[str, str]:
    """
    Endpoint to receive an audio file and simulate transcription to text.
    """
    # Simulate processing the uploaded audio
    file_name = file.filename
    content_type = file.content_type

    return {
        "message": f"File '{file_name}' received successfully.",
        "content_type": content_type,
        "transcription": "This is a simulated transcription of the audio file."
    }

if __name__ == "__main__":
    config = Config
    uvicorn.run(
        app,
        host=config.host,
        port=config.port,
        log_level=config.log_level
    )