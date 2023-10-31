from fastapi import Depends, FastAPI, HTTPException
import services, models, schemas
from fastapi.middleware.cors import CORSMiddleware
from typing import List

from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from sqlalchemy.orm import sessionmaker


SQLALCHEMY_DATABASE_URL = "postgresql://postgres:1234@localhost/spatial_music_gen_db"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


models.Base.metadata.create_all(engine)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permite todas las origines (no usar en producción)
    allow_credentials=True,
    allow_methods=["*"],  # Permite todos los métodos o puedes especificar: ["GET", "POST"]
    allow_headers=["*"],  # Permite todos los headers o puedes especificar los que necesitas
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/generations/", response_model=List[schemas.GenerationResponse])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = services.get_generations(db, skip=skip, limit=limit)
    return users

@app.post("/generations/", response_model=schemas.GenerationRequest)
def create_generation(generation: schemas.GenerationRequest, db: Session = Depends(get_db)):
    return services.create_generation(db=db, generation=generation)