from sqlalchemy.orm import Session
import models, schemas

def get_generations(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Generation).offset(skip).limit(limit).all()

def get_generation(db: Session, generation_id: int):
    return db.query(models.Generation).filter(models.Generation.id == generation_id).first()

def get_generation_by_prompt(db: Session, prompt: str):
    return db.query(models.Generation).filter(models.Generation.promt == prompt).first()

def create_generation(db: Session, generation: schemas.GenerationBase):
    db_generation = models.Generation(
        session_name = generation.session_name,
        prompt = generation.prompt,
        audio1URL = generation.audio1URL,
        audio2URL = generation.audio2URL,
        audio3URL = generation.audio3URL,
        creationDate = generation.creationDate)
    db.add(db_generation)
    db.commit()
    db.refresh(db_generation)
    return db_generation