from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.dialects.postgresql import UUID
import uuid


Base = declarative_base()

class Generation(Base):
    __tablename__ = "generations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_name = Column(String, index=True)
    title = Column(String)
    prompt = Column(String)
    audioURL = Column(String)
    creationDate = Column(String, index=True)
