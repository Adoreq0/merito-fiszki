import { useState } from 'react';
import { Question } from '../App';

interface QuizScreenProps {
  question: Question;
  currentQuestion: number;
  totalQuestions: number;
  onAnswer: (answerIndex: number) => void;
}

export function QuizScreen({
  question,
  currentQuestion,
  totalQuestions,
  onAnswer,
}: QuizScreenProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const handleAnswerClick = (index: number) => {
    if (confirmed) return;
    setSelectedAnswer(index);
  };

  const handleConfirm = () => {
    if (selectedAnswer === null) return;
    setConfirmed(true);
  };

  const handleNext = () => {
    if (selectedAnswer === null) return;
    onAnswer(selectedAnswer);
    setSelectedAnswer(null);
    setConfirmed(false);
  };

  const isCorrect = selectedAnswer !== null && question.correctAnswers.includes(selectedAnswer);

  // Calculate circular progress
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 flex flex-col">
      {/* Header with Circular Progress */}
      <div className="p-4">
        <div className="max-w-md mx-auto flex justify-between items-center">
          {/* Circular Progress Bar - Left */}
          <div className="relative">
            <svg className="transform -rotate-90" width="60" height="60">
              {/* Background circle */}
              <circle
                cx="30"
                cy="30"
                r={radius}
                stroke="rgba(255, 255, 255, 1)"
                strokeWidth="4"
                fill="none"
              />
              {/* Progress circle */}
              <circle
                cx="30"
                cy="30"
                r={radius}
                stroke="url(#gradient)"
                strokeWidth="4"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                className="transition-all duration-500 ease-out"
              />
              {/* Gradient definition */}
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2563eb" />
                  <stop offset="100%" stopColor="#1d4ed8" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Question Counter - Right */}
          <div className="bg-gray-800 text-white px-4 py-2 rounded-full text-sm">
            {currentQuestion + 1}/{totalQuestions}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-start justify-center p-6 pt-8">
        <div className="max-w-md w-full">
          <h2 className="text-gray-900 text-center mb-6 text-xl">
            Pytanie {currentQuestion + 1}
          </h2>

          {/* Question Card */}
          <div className="bg-white rounded-3xl p-6 mb-6">
            <p className="text-gray-800 text-center text-lg">
              {question.question}
            </p>
          </div>

          {/* Answer Buttons */}
          <div className="space-y-3">
            {question.options.map((option, index) => {
              let buttonClasses = "w-full py-3 px-6 rounded-[15px] transition-all text-white shadow-lg ";

              if (confirmed) {
                // Po zatwierdzeniu
                if (question.correctAnswers.includes(index)) {
                  // Poprawna odpowiedź - zawsze zielona
                  buttonClasses += "bg-gradient-to-r from-green-400 to-green-500";
                } else if (index === selectedAnswer) {
                  // Wybrana błędna odpowiedź - czerwona
                  buttonClasses += "bg-gradient-to-r from-red-500 to-red-600";
                } else {
                  // Pozostałe - szare
                  buttonClasses += "bg-gradient-to-r from-gray-400 to-gray-500 opacity-60";
                }
              } else {
                // Przed zatwierdzeniem - wszystkie niebieskie
                if (index === selectedAnswer) {
                  // Zaznaczona - ciemnoniebieski
                  buttonClasses += "bg-gradient-to-r from-blue-800 to-blue-900 scale-105";
                } else {
                  // Niezaznaczone - jasnoniebieski
                  buttonClasses += "bg-gradient-to-r from-blue-500 to-blue-600 hover:scale-105";
                }
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerClick(index)}
                  disabled={confirmed}
                  className={buttonClasses}
                >
                  {option}
                </button>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="mt-6 space-y-3">
            {!confirmed ? (
              <button
                onClick={handleConfirm}
                disabled={selectedAnswer === null}
                className={`w-full py-3 px-6 rounded-[15px] transition-all text-white shadow-lg ${selectedAnswer === null
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700'
                  }`}
              >
                Zatwierdź
              </button>
            ) : (
              <>
                <button
                  onClick={handleNext}
                  className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white py-3 px-6 rounded-[15px] transition-all shadow-lg"
                >
                  Następne pytanie
                </button>
                {!isCorrect && (
                  <div className="bg-gradient-to-r from-red-400 to-red-500 text-white py-3 px-6 rounded-[15px] text-center shadow-lg">
                    Nie poprawna odpowiedź!
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}