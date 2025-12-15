import { useState } from 'react';
import { StartScreen } from './components/StartScreen';
import { QuizScreen } from './components/QuizScreen';
import { ResultsScreen } from './components/ResultsScreen';

export type Question = {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
};

const questions: Question[] = [
  {
    id: 1,
    question: "Gdzie znajduje się biblioteka?",
    options: ["Na parterze w budynku A", "Na drugim piętrze budynku B", "Na trzecim piętrze budynku C", "W piwnicy budynku A"],
    correctAnswer: 0
  },
  {
    id: 2,
    question: "Która z poniższych uczelni jest częścią grupy WSB Merito?",
    options: ["WSB Merito w Warszawie", "Uniwersytet Gdański", "Politechnika Gdańska", "Akademia Sztuk Pięknych"],
    correctAnswer: 0
  },
  {
    id: 3,
    question: "Jakie kierunki studiów oferuje WSB Merito Gdańsk?",
    options: ["Tylko ekonomiczne", "Tylko informatyczne", "Ekonomiczne, informatyczne i inne", "Tylko medyczne"],
    correctAnswer: 2
  },
  {
    id: 4,
    question: "WSB Merito Gdańsk oferuje studia w trybie:",
    options: ["Tylko stacjonarnym", "Tylko niestacjonarnym", "Stacjonarnym i niestacjonarnym", "Tylko online"],
    correctAnswer: 2
  },
  {
    id: 5,
    question: "Która z poniższych form studiów jest dostępna w WSB Merito Gdańsk?",
    options: ["Studia licencjackie", "Studia magisterskie", "Studia podyplomowe", "Wszystkie powyższe"],
    correctAnswer: 3
  }
];

export default function App() {
  const [gameState, setGameState] = useState<'start' | 'quiz' | 'results'>('start');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);

  const handleStart = () => {
    setGameState('quiz');
    setCurrentQuestion(0);
    setScore(0);
    setUserAnswers([]);
  };

  const handleAnswer = (answerIndex: number) => {
    const newUserAnswers = [...userAnswers, answerIndex];
    setUserAnswers(newUserAnswers);

    if (answerIndex === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setGameState('results');
    }
  };

  const handleRestart = () => {
    setGameState('start');
    setCurrentQuestion(0);
    setScore(0);
    setUserAnswers([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {gameState === 'start' && <StartScreen onStart={handleStart} />}
      {gameState === 'quiz' && (
        <QuizScreen
          question={questions[currentQuestion]}
          currentQuestion={currentQuestion}
          totalQuestions={questions.length}
          onAnswer={handleAnswer}
        />
      )}
      {gameState === 'results' && (
        <ResultsScreen
          score={score}
          totalQuestions={questions.length}
          questions={questions}
          userAnswers={userAnswers}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}