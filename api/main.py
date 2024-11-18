from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins. Replace with specific origins for production.
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods.
    allow_headers=["*"],  # Allows all HTTP headers.
)

# Define a root endpoint
@app.get("/health")
def read_root():
    return {"result": True}


@app.post("/audio-text")
async def audio_to_text(file: UploadFile = File(...)) -> Dict[str, str]:
    """
    Endpoint to receive an audio file and simulate transcription to text.
    """
    # Simulate processing the uploaded audio
    file_name = file.filename
    content_type = file.content_type

    # Mock response for demo purposes
    # In a real application, you would process the audio with a library like SpeechRecognition
    return {
        "message": f"File '{file_name}' received successfully.",
        "content_type": content_type,
        "transcription": "This is a simulated transcription of the audio file."
    }


@app.post("/process")
async def process(file: UploadFile = File(...)) -> Dict[str, str]:
    """
    Endpoint to receive an audio file and simulate transcription to text.
    """
    # Simulate processing the uploaded audio
    file_name = file.filename
    content_type = file.content_type

    # Mock response for demo purposes
    # In a real application, you would process the audio with a library like SpeechRecognition
    return {
        "message": f"File '{file_name}' received successfully.",
        "content_type": content_type,
        "transcription": "This is a simulated transcription of the audio file."
    }


@app.post("/text-audio")
async def text_to_audio(file: UploadFile = File(...)) -> Dict[str, str]:
    """
    Endpoint to receive an audio file and simulate transcription to text.
    """
    # Simulate processing the uploaded audio
    file_name = file.filename
    content_type = file.content_type

    # Mock response for demo purposes
    # In a real application, you would process the audio with a library like SpeechRecognition
    return {
        "message": f"File '{file_name}' received successfully.",
        "content_type": content_type,
        "transcription": "This is a simulated transcription of the audio file."
    }