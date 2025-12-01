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

  const handleStart = () => {
    setCurrentScreen('quiz');
    setCurrentQuestionIndex(0);
    setScore(0);
  };

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < QUESTIONS.length - 1) {
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
      {currentScreen === 'start' && <StartScreen onStart={handleStart} />}
      {currentScreen === 'quiz' && (
        <QuizScreen
          questions={QUESTIONS}
          currentQuestionIndex={currentQuestionIndex}
          onAnswer={handleAnswer}
          onNext={handleNext}
        />
      )}
      {currentScreen === 'result' && (
        <ResultScreen
          score={score}
          totalQuestions={QUESTIONS.length}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}