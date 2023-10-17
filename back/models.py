from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Generation(Base):
    __tablename__ = "generations"

    id = Column(Integer, primary_key=True, index=True)
    session_name = Column(String, unique=True, index=True)
    prompt = Column(String)
    audio1URL = Column(String)
    audio2URL = Column(String)
    audio3URL = Column(String)
    creationDate = Column(String, index=True)
