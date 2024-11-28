from transformers import pipeline
import torch

class Model:

    def __init__(self):
        self.transcriber = pipeline("automatic-speech-recognition",
                                    model="openai/whisper-tiny",
                                    torch_dtype=torch.bfloat16, 
                                    device_map="auto")
        self.chatter = pipeline("text-generation",
                                model="TinyLlama/TinyLlama-1.1B-Chat-v1.0",
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


    