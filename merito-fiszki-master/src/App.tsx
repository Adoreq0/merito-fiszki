import React, { useState, useEffect } from 'react';
import { StartScreen } from './components/StartScreen';
import { QuizScreen } from './components/QuizScreen';
import { ResultScreen } from './components/ResultScreen';

type Screen = 'start' | 'quiz' | 'result';

interface Question {
  id: number;
  question: string;
  answers: string[];
  correctAnswer: number;
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    question: "Gdzie znajduje się biblioteka?",
    answers: [
      "Na parterze w budynku A",
      "Na drugim piętrze budynku B",
      "Na trzecim piętrze budynku C",
      "W piwnicy budynku A"
    ],
    correctAnswer: 0
  },
  {
    id: 2,
    question: "W którym roku powstała uczelnia WSB Merito w Gdańsku?",
    answers: [
      "1998",
      "2001",
      "2005",
      "2010"
    ],
    correctAnswer: 0
  },
  {
    id: 3,
    question: "Jaki kolor dominuje w logo WSB Merito?",
    answers: [
      "Czerwony",
      "Zielony",
      "Niebieski",
      "Żółty"
    ],
    correctAnswer: 2
  },
  {
    id: 4,
    question: "Ile wydziałów posiada uczelnia WSB Merito?",
    answers: [
      "2 wydziały",
      "3 wydziały",
      "4 wydziały",
      "5 wydziałów"
    ],
    correctAnswer: 2
  },
  {
    id: 5,
    question: "Gdzie znajduje się główny kampus WSB Merito w Gdańsku?",
    answers: [
      "Przy ul. Grunwaldzkiej",
      "Przy ul. Długiej",
      "Przy ul. Traugutta",
      "Przy ul. Wały Piastowskie"
    ],
    correctAnswer: 3
  }
];

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('start');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://127.0.0.1:8000/questions/');
      if (!response.ok) {
        throw new Error('Failed to fetch questions');
      }
      const data = await response.json();
      // Transform API data to match Question interface if needed
      // Assuming API returns data in compatible format based on task description
      // The API returns: { id: 1, content: "...", answers: [...] }
      // Our interface: { id: number, question: string, answers: string[], correctAnswer: number }

      // Let's verify API structure by looking at main.py or just assuming standard mapping
      // Based on typical FastAPI, it might return list of objects.
      // I will map it safely.
      const mappedQuestions = data.map((q: any) => ({
        id: q.question_id,
        question: q.content,
        answers: q.answers.map((a: any) => a.content),
        correctAnswer: q.answers.findIndex((a: any) => a.is_correct)
      }));

      setQuestions(mappedQuestions);
      setCurrentScreen('quiz');
      setCurrentQuestionIndex(0);
      setScore(0);
    } catch (err) {
      setError('Nie udało się pobrać pytań. Sprawdź czy API działa.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStart = () => {
    fetchQuestions();
  };

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setCurrentScreen('result');
    }
  };

  const handleRestart = () => {
    setCurrentScreen('start');
    setCurrentQuestionIndex(0);
    setScore(0);
  };

  return (
    <div className="min-h-screen">
      {currentScreen === 'start' && (
        <StartScreen onStart={handleStart} />
      )}
      {loading && (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-xl font-bold text-merito-blue">Ładowanie pytań...</div>
        </div>
      )}
      {error && (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
          <div className="text-xl font-bold text-red-500">{error}</div>
          <button onClick={handleStart} className="bg-merito-blue text-white px-6 py-2 rounded-lg">Spróbuj ponownie</button>
        </div>
      )}
      {currentScreen === 'quiz' && !loading && !error && questions.length === 0 && (
        <div className="flex items-center justify-center min-h-screen text-xl font-bold text-merito-blue-dark">
          Brak pytań w bazie danych.
        </div>
      )}

      {currentScreen === 'quiz' && !loading && !error && questions.length > 0 && (
        <QuizScreen
          questions={questions}
          currentQuestionIndex={currentQuestionIndex}
          onAnswer={handleAnswer}
          onNext={handleNext}
        />
      )}
      {currentScreen === 'result' && (
        <ResultScreen
          score={score}
          totalQuestions={questions.length}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}