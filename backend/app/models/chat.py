import uuid
from datetime import datetime
from sqlalchemy import Column, String, ForeignKey, DateTime, Text, JSON
from sqlalchemy.orm import relationship
from app.database import Base

class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    project_id = Column(String, ForeignKey("projects.id"), nullable=False)
    role = Column(String(50), nullable=False) # user, assistant, system
    content = Column(Text, nullable=False)
    simulation_params = Column(JSON, nullable=True) # If this message triggered a financial recalculation
    simulation_result = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    project = relationship("Project", back_populates="chat_messages")
