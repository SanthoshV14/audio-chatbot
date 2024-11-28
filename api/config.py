from dataclasses import dataclass

@dataclass
class Config:
    host: str = "localhost"
    port: int = 8000
    log_level: str = "info"
    audio_text_pipeline: str = "automatic-speech-recognition"
    audio_text_model_id: str = "openai/whisper-tiny"
    chat_pipeline: str = "text-generation"
    chat_model_id: str = "TinyLlama/TinyLlama-1.1B-Chat-v1.0"
