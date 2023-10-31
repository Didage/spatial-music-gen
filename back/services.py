from sqlalchemy.orm import Session
import models, schemas
from musicgen import MusicGen
from datetime import datetime

model = MusicGen()

def get_generations(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Generation).offset(skip).limit(limit).all()

def get_generation(db: Session, generation_id: int):
    return db.query(models.Generation).filter(models.Generation.id == generation_id).first()

def get_generation_by_prompt(db: Session, prompt: str):
    return db.query(models.Generation).filter(models.Generation.promt == prompt).first()

def create_generation(db: Session, generation: schemas.GenerationBase):

    data = str(generation.prompt)
    title = str(generation.title)

    file = model.generate_music(data, title)
    current_date = datetime.now()
    formatted_datetime = current_date.strftime("%A, %B %d, %Y %H:%M:%S")

    db_generation = models.Generation(
        session_name = generation.session_name,
        title = generation.title,
        prompt = generation.prompt,
        audioURL = file,
        creationDate = formatted_datetime)
    db.add(db_generation)
    db.commit()
    db.refresh(db_generation)
    return db_generation