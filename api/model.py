import torch
from transformers import pipeline
from api.config import Config

class Model:

    def __init__(self):
        self.config = Config()
        self.transcriber = pipeline(self.config.audio_text_pipeline,
                                    model=self.config.audio_text_model_id,
                                    torch_dtype=torch.bfloat16, 
                                    device_map="auto")
        self.chatter = pipeline(self.config.chat_pipeline,
                                model=self.config.chat_model_id,
                                torch_dtype=torch.bfloat16, 
                                device_map="auto")

    def transcribe(self, wav_file_path):
        response = self.transcriber(wav_file_path)
        return response

    def chat(self, query):
        messages = [{
                "role": "user", 
                "content": query
            }]
        response = self.chatter(messages)
        return response