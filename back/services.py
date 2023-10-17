from sqlalchemy.orm import Session
import models, schemas
from musicgen import MusicGen

model = MusicGen()

def get_generations(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Generation).offset(skip).limit(limit).all()

def get_generation(db: Session, generation_id: int):
    return db.query(models.Generation).filter(models.Generation.id == generation_id).first()

def get_generation_by_prompt(db: Session, prompt: str):
    return db.query(models.Generation).filter(models.Generation.promt == prompt).first()

def create_generation(db: Session, generation: schemas.GenerationBase):

    data = str(generation.prompt)

    files = model.generate_music(data)

    db_generation = models.Generation(
        session_name = generation.session_name,
        prompt = generation.prompt,
        audio1URL = files[0],
        audio2URL = files[1],
        audio3URL = files[2],
        creationDate = generation.creationDate)
    db.add(db_generation)
    db.commit()
    db.refresh(db_generation)
    return db_generation