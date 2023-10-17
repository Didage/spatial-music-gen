from pydantic import BaseModel

class GenerationBase(BaseModel):
    id: int
    session_name: str
    prompt: str
    audio1URL: str
    audio2URL: str
    audio3URL: str
    creationDate: str
