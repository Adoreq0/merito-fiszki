import React, { useState } from 'react';

interface Question {
  id: number;
  question: string;
  answers: string[];
  correctAnswer: number;
}

interface QuizScreenProps {
  questions: Question[];
  currentQuestionIndex: number;
  onAnswer: (isCorrect: boolean) => void;
  onNext: () => void;
}

export function QuizScreen({ questions, currentQuestionIndex, onAnswer, onNext }: QuizScreenProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const questionNumber = currentQuestionIndex + 1;

  // Guard against undefined currentQuestion
  if (!currentQuestion) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">Ładowanie pytania...</p>
        </div>
      </div>
    );
  }

  const handleAnswerSelect = (index: number) => {
    if (!isAnswered) {
      setSelectedAnswer(index);
    }
  };

  const handleConfirm = () => {
    if (selectedAnswer === null) return;
    
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    setIsAnswered(true);
    setShowFeedback(true);
    onAnswer(isCorrect);
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setIsAnswered(false);
    setShowFeedback(false);
    onNext();
  };

  const getButtonStyle = (index: number) => {
    if (!isAnswered) {
      return selectedAnswer === index
        ? 'bg-blue-500 text-white border-blue-500'
        : 'bg-white text-gray-800 border-gray-300 hover:border-blue-400';
    }

    if (index === currentQuestion.correctAnswer) {
      return 'bg-green-500 text-white border-green-500';
    }

    if (index === selectedAnswer && selectedAnswer !== currentQuestion.correctAnswer) {
      return 'bg-red-500 text-white border-red-500';
    }

    return 'bg-gray-100 text-gray-500 border-gray-300';
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-200 via-blue-100 to-blue-200 p-6 pb-24">
      <div className="w-full max-w-md mx-auto flex-1 flex flex-col">
        {/* Progress Indicator */}
        <div className="flex justify-end mb-6">
          <div className="bg-white px-4 py-2 rounded-full shadow">
            <span>{questionNumber}/{totalQuestions}</span>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <h2 className="text-center mb-6">Pytanie {questionNumber}</h2>
          <p className="text-center text-gray-800">{currentQuestion.question}</p>
        </div>

        {/* Answer Buttons */}
        <div className="space-y-3 flex-1">
          {currentQuestion.answers.map((answer, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              disabled={isAnswered}
              className={`w-full py-4 px-6 rounded-full border-2 transition-all duration-200 shadow-md ${getButtonStyle(index)} ${!isAnswered ? 'active:scale-95' : ''}`}
            >
              {answer}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 mt-6">
          {!isAnswered ? (
            <button
              onClick={handleConfirm}
              disabled={selectedAnswer === null}
              className={`w-full py-4 px-6 rounded-full shadow-lg transition-all duration-200 ${
                selectedAnswer !== null
                  ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white hover:shadow-xl active:scale-95'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Zatwierdź
            </button>
          ) : (
            <>
              {showFeedback && (
                <div className={`w-full py-3 px-6 rounded-full text-center ${
                  selectedAnswer === currentQuestion.correctAnswer
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {selectedAnswer === currentQuestion.correctAnswer
                    ? '✓ Poprawna odpowiedź!'
                    : '✗ Niepoprawna odpowiedź!'}
                </div>
              )}
              <button
                onClick={handleNextQuestion}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 px-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95"
              >
                Następne pytanie
              </button>
            </>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2">
        <div className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
        </div>
      </div>
    </div>
  );
}