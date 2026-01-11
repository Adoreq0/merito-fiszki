import { useState, useEffect } from 'react';
import { StartScreen } from './components/StartScreen';
import { QuizScreen } from './components/QuizScreen';
import { ResultsScreen } from './components/ResultsScreen';
import { supabase } from './supabase';

export type Question = {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
};

export default function App() {
  const [gameState, setGameState] = useState<'start' | 'quiz' | 'results'>('start');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuestions();
  }, []);

  // Fisher-Yates shuffle algorithm
  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('questions')
        .select(`
          *,
          answers (*)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching questions:', error);
        return;
      }

      if (data) {
        // Shuffle questions
        const shuffledData = shuffleArray(data);

        const formattedQuestions: Question[] = shuffledData.map((q: any) => {
          // Prepare options with their original correct status
          const originalOptions = q.answers.map((a: any) => ({
            content: a.content,
            isCorrect: a.is_correct
          }));

          // Shuffle options
          const shuffledOptions = shuffleArray(originalOptions);

          // Find new correct answer index
          const correctAnswerIndex = shuffledOptions.findIndex((o: any) => o.isCorrect);

          return {
            id: q.id,
            question: q.content,
            options: shuffledOptions.map((o: any) => o.content),
            correctAnswer: correctAnswerIndex !== -1 ? correctAnswerIndex : 0
          };
        });
        setQuestions(formattedQuestions);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-xl text-blue-600 font-semibold">Ładowanie pytań...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {gameState === 'start' && <StartScreen onStart={handleStart} />}
      {gameState === 'quiz' && questions.length > 0 && (
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