import os
from typing import List, Optional
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base, relationship
from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey, select
from sqlalchemy.orm import joinedload
from pydantic import BaseModel, ConfigDict

# --- Konfiguracja Bazy Danych ---
DATABASE_URL = "postgresql+asyncpg://adam:1234@localhost/meritoFiszki"

# Tworzenie silnika i sesji SQLAlchemy
engine = create_async_engine(DATABASE_URL, echo=True)
SessionLocal = sessionmaker(
    engine, 
    class_=AsyncSession, 
    expire_on_commit=False
)
Base = declarative_base()


# --- Modele SQLAlchemy (models.py) ---
# Definiują strukturę tabel w bazie danych

class Question(Base):
    __tablename__ = "questions"

    question_id = Column(Integer, primary_key=True, index=True)
    content = Column(Text, nullable=False)
    category = Column(Integer)
    
    # Definiuje relację "jeden do wielu"
    # 'answers' będzie listą obiektów Answer powiązanych z tym pytaniem
    answers = relationship("Answer", back_populates="question")

class Answer(Base):
    __tablename__ = "answers"

    answer_id = Column(Integer, primary_key=True, index=True)
    question_id = Column(
        Integer, 
        ForeignKey("questions.question_id", ondelete="CASCADE"), 
        nullable=False
    )
    content = Column(Text, nullable=False)
    is_correct = Column(Boolean, nullable=False, default=False)

    # Definiuje relację "wielu do jednego"
    # 'question' będzie obiektem Question, do którego należy ta odpowiedź
    question = relationship("Question", back_populates="answers")


# --- Schematy Pydantic (schemas.py) ---
# Definiują kształt danych w API (JSON)

class AnswerSchema(BaseModel):
    answer_id: int
    content: str
    is_correct: bool
    
    # Używamy from_attributes (w Pydantic v1 było 'orm_mode = True')
    # aby Pydantic mógł czytać dane z modeli SQLAlchemy
    model_config = ConfigDict(from_attributes=True)

class QuestionSchema(BaseModel):
    question_id: int
    content: str
    category: Optional[int] = None
    
    model_config = ConfigDict(from_attributes=True)

class QuestionWithAnswersSchema(QuestionSchema):
    # Ten schemat dziedziczy po QuestionSchema i dodaje listę odpowiedzi
    answers: List[AnswerSchema] = []


# --- Główna Aplikacja FastAPI (main.py) ---

app = FastAPI(
    title="Merito Fiszki API",
    description="API do pobierania pytań i odpowiedzi dla fiszek WSB Merito."
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Zależność (Dependency) do pobierania sesji bazy danych
async def get_db():
    async with SessionLocal() as session:
        yield session

@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        pass

@app.on_event("shutdown")
async def shutdown():
    await engine.dispose()

# --- Endpointy API ---

@app.get("/")
def read_root():
    return {"message": "Witaj w Merito Fiszki API!"}


@app.get(
    "/questions/", 
    response_model=List[QuestionWithAnswersSchema],
    summary="Pobierz listę wszystkich pytań",
    tags=["Pytania"]
)
async def get_all_questions(
    skip: int = 0, 
    limit: int = 100, 
    db: AsyncSession = Depends(get_db)
):
    """
    Pobiera listę wszystkich pytań z bazy danych, wraz z odpowiedziami.
    Obsługuje paginację za pomocą `skip` i `limit`.
    """
    result = await db.execute(
        select(Question)
        .options(joinedload(Question.answers))
        .offset(skip)
        .limit(limit)
    )
    questions = result.scalars().unique().all()
    return questions


@app.get(
    "/questions/{question_id}", 
    response_model=QuestionWithAnswersSchema,
    summary="Pobierz jedno pytanie wraz z odpowiedziami",
    tags=["Pytania"]
)
async def get_question_with_answers(
    question_id: int, 
    db: AsyncSession = Depends(get_db)
):
    """
    Pobiera jedno konkretne pytanie na podstawie jego `question_id`.
    Odpowiedź zawiera również listę wszystkich powiązanych z nim odpowiedzi.
    """
    result = await db.execute(
        select(Question)
        .where(Question.question_id == question_id)
        .options(joinedload(Question.answers))
    )
    
    question = result.scalars().first()
    
    if question is None:
        raise HTTPException(
            status_code=404, 
            detail=f"Pytanie o ID {question_id} nie zostało znalezione."
        )
    
    return question

@app.get(
    "/answers/", 
    response_model=List[AnswerSchema],
    summary="Pobierz listę wszystkich odpowiedzi",
    tags=["Odpowiedzi"]
)
async def get_all_answers(
    skip: int = 0, 
    limit: int = 100, 
    db: AsyncSession = Depends(get_db)
):
    """
    Pobiera listę wszystkich odpowiedzi z bazy danych.
    Obsługuje paginację za pomocą `skip` i `limit`.
    """
    result = await db.execute(
        select(Answer).offset(skip).limit(limit)
    )
    answers = result.scalars().all()
    return answers