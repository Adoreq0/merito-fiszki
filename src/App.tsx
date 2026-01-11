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
        const formattedQuestions: Question[] = data.map((q: any) => {
          const options = q.answers.map((a: any) => a.content);
          const correctAnswerIndex = q.answers.findIndex((a: any) => a.is_correct);

          return {
            id: q.id,
            question: q.content,
            options: options,
            correctAnswer: correctAnswerIndex !== -1 ? correctAnswerIndex : 0 // Default to 0 if no correct answer marked
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