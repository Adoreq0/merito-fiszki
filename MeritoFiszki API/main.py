import os
from typing import List, Optional

from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base, relationship
from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey, select
from sqlalchemy.orm import joinedload
from pydantic import BaseModel, ConfigDict
import os

# --- Konfiguracja Bazy Danych ---
# Wczytanie zmiennej środowiskowej DATABASE_URL, lub użycie domyślnej wartości
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+asyncpg://adam:1234@localhost/meritoFiszki")

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
    answers = relationship("Answer", back_populates="question", cascade="all, delete-orphan")

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

# Zależność (Dependency) do pobierania sesji bazy danych
async def get_db():
    async with SessionLocal() as session:
        yield session

@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        # Create tables if they don't exist
        await conn.run_sync(Base.metadata.create_all)
        
        # Check if questions exist, if not, populate with sample data
        result = await conn.execute(select(Question))
        if result.scalars().first() is None:
            await populate_sample_data(conn)


async def populate_sample_data(conn):
    questions_data = [
        {"content": "Gdzie znajduje się biblioteka?", "category": 1, "answers": [
            {"content": "Na parterze w budynku A", "is_correct": True},
            {"content": "Na drugim piętrze budynku B", "is_correct": False},
            {"content": "Na trzecim piętrze budynku C", "is_correct": False},
            {"content": "W piwnicy budynku A", "is_correct": False}
        ]},
        {"content": "W którym roku powstała uczelnia WSB Merito w Gdańsku?", "category": 1, "answers": [
            {"content": "1998", "is_correct": True},
            {"content": "2001", "is_correct": False},
            {"content": "2005", "is_correct": False},
            {"content": "2010", "is_correct": False}
        ]},
        {"content": "Jaki kolor dominuje w logo WSB Merito?", "category": 1, "answers": [
            {"content": "Czerwony", "is_correct": False},
            {"content": "Zielony", "is_correct": False},
            {"content": "Niebieski", "is_correct": True},
            {"content": "Żółty", "is_correct": False}
        ]},
        {"content": "Ile wydziałów posiada uczelnia WSB Merito?", "category": 1, "answers": [
            {"content": "2 wydziały", "is_correct": False},
            {"content": "3 wydziały", "is_correct": False},
            {"content": "4 wydziały", "is_correct": True},
            {"content": "5 wydziałów", "is_correct": False}
        ]},
        {"content": "Gdzie znajduje się główny kampus WSB Merito w Gdańsku?", "category": 1, "answers": [
            {"content": "Przy ul. Grunwaldzkiej", "is_correct": False},
            {"content": "Przy ul. Długiej", "is_correct": False},
            {"content": "Przy ul. Traugutta", "is_correct": False},
            {"content": "Przy ul. Wały Piastowskie", "is_correct": True}
        ]}
    ]

    for q_data in questions_data:
        question = Question(content=q_data["content"], category=q_data["category"])
        conn.add(question)
        await conn.flush() # Ensure question_id is generated

        for a_data in q_data["answers"]:
            answer = Answer(
                question_id=question.question_id,
                content=a_data["content"],
                is_correct=a_data["is_correct"]
            )
            conn.add(answer)
    await conn.commit()
    print("Sample data populated!")


@app.on_event("shutdown")
async def shutdown():
    await engine.dispose()

# --- Endpointy API ---

@app.get("/")
def read_root():
    return {"message": "Witaj w Merito Fiszki API!"}


@app.get(
    "/questions/", 
    response_model=List[QuestionSchema],
    summary="Pobierz listę wszystkich pytań",
    tags=["Pytania"]
)
async def get_all_questions(
    skip: int = 0, 
    limit: int = 100, 
    db: AsyncSession = Depends(get_db)
):
    """
    Pobiera listę wszystkich pytań z bazy danych, bez odpowiedzi.
    Obsługuje paginację za pomocą `skip` i `limit`.
    """
    result = await db.execute(
        select(Question).offset(skip).limit(limit)
    )
    questions = result.scalars().all()
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

@app.get(
    "/questions_with_answers/",
    response_model=List[QuestionWithAnswersSchema],
    summary="Pobierz listę wszystkich pytań wraz z odpowiedziami",
    tags=["Pytania"]
)
async def get_all_questions_with_answers(
    db: AsyncSession = Depends(get_db)
):
    """
    Pobiera listę wszystkich pytań z bazy danych wraz z ich odpowiedziami.
    """
    result = await db.execute(
        select(Question).options(joinedload(Question.answers))
    )
    questions = result.scalars().unique().all()
    return questions

@app.get(
    "/questions_with_answers/",
    response_model=List[QuestionWithAnswersSchema],
    summary="Pobierz listę wszystkich pytań wraz z odpowiedziami",
    tags=["Pytania"]
)
async def get_all_questions_with_answers(
    db: AsyncSession = Depends(get_db)
):
    """
    Pobiera listę wszystkich pytań z bazy danych wraz z ich odpowiedziami.
    """
    result = await db.execute(
        select(Question).options(joinedload(Question.answers))
    )
    questions = result.scalars().unique().all()
    return questions