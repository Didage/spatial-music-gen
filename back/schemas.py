from pydantic import BaseModel
from uuid import UUID

class GenerationRequest(BaseModel):
    session_name: str
    title: str
    prompt: str

class GenerationBase(GenerationRequest):
    id: UUID
    audioURL: str
    creationDate: str
    
class GenerationResponse(BaseModel):
    id: UUID
    session_name: str
    title: str
    prompt: str
    audioURL:str
    creationDate:str
