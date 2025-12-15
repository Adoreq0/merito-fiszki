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

  if (!currentQuestion) {
    return <div>Loading...</div>;
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

  return (
    <div className="flex flex-col items-center min-h-screen relative font-sans overflow-hidden">
      {/* Background Rectangle (textView in XML) */}
      <div className="absolute inset-0 bg-[#BCE4FA] -z-10" />

      {/* Progress Bar (progressBar in XML) */}
      {/* Width: 73dp, Height: 73dp */}
      {/* Top Left, margins? XML says horizontal bias 0.047, vertical 0.047 */}
      <div className="absolute top-[4%] left-[5%] w-[73px] h-[73px] flex items-center justify-center">
        {/* Custom Ring SVG to match pbar.xml */}
        <svg width="73" height="73" viewBox="0 0 73 73">
          {/* Background ring (white) */}
          <circle cx="36.5" cy="36.5" r="30" stroke="white" strokeWidth="6" fill="none" />
          {/* Progress ring (dark blue) - static or dynamic? XML has progress=0 but max=100. Let's make it dynamic. */}
          <circle
            cx="36.5"
            cy="36.5"
            r="30"
            stroke="#22284F"
            strokeWidth="6"
            fill="none"
            strokeDasharray={188.5}
            strokeDashoffset={188.5 - (188.5 * (currentQuestionIndex / totalQuestions))}
            transform="rotate(-90 36.5 36.5)"
          />
        </svg>
      </div>

      {/* Question Title (questionTitle) */}
      {/* Width: 138dp, Height: 34dp */}
      {/* Top centered-ish. Vertical bias 0.1 */}
      <div className="absolute top-[10%] w-[138px] h-[34px] flex items-center justify-center">
        <h2 className="text-[20px] font-bold text-black">Pytanie {questionNumber}</h2>
      </div>

      {/* Question Content Box (question) */}
      {/* Width: 239dp, Height: 75dp */}
      {/* Vertical bias 0.199 */}
      <div className="absolute top-[20%] w-[239px] min-h-[75px] bg-white rounded-[12px] flex items-center justify-center text-center p-2 shadow-sm">
        <p className="text-[20px] font-bold text-black leading-tight">{currentQuestion.question}</p>
      </div>

      {/* Question Status Counter (textView9) */}
      {/* Width: 54dp, Height: 43dp */}
      {/* Top Right. Horizontal bias 0.955, Vertical 0.062 relative to background? */}
      {/* XML says relative to textView (bg). */}
      <div className="absolute top-[6%] right-[5%] w-[54px] h-[43px] bg-[#22284F] rounded-[15px] flex items-center justify-center shadow-md">
        <span className="text-white font-bold text-[20px]">{questionNumber}/{totalQuestions}</span>
      </div>

      {/* Answers RadioGroup (radioGroup) */}
      {/* Width: 341dp, Height: 332dp */}
      {/* Vertical bias 0.594 */}
      <div className="absolute top-[35%] w-[341px] flex flex-col items-center space-y-[15px]">
        {currentQuestion.answers.map((answer, index) => {
          const isSelected = selectedAnswer === index;

          // Default: #006EFA (merito-blue)
          // Checked: #22284F (merito-blue-dark)
          // Text: White, 18sp, Bold

          let bgClass = "bg-[#006EFA]";
          if (isSelected) {
            bgClass = "bg-[#22284F]";
          }

          // Feedback colors
          if (isAnswered) {
            if (index === currentQuestion.correctAnswer) bgClass = "bg-green-500";
            else if (isSelected && index !== currentQuestion.correctAnswer) bgClass = "bg-red-500";
            else bgClass = "bg-[#006EFA] opacity-50";
          }

          return (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              disabled={isAnswered}
              className={`w-[290px] h-[57px] rounded-[12px] text-white font-bold text-[18px] shadow-md transition-colors flex items-center justify-center ${bgClass}`}
            >
              {answer}
            </button>
          );
        })}
      </div>

      {/* Submit/Next Button (submit) */}
      {/* Width: 255dp, Height: 48dp */}
      {/* Vertical bias 0.888 */}
      <div className="absolute bottom-[11%] w-full flex justify-center">
        {!isAnswered ? (
          <button
            onClick={handleConfirm}
            disabled={selectedAnswer === null}
            className={`w-[255px] h-[48px] rounded-[12px] text-white font-bold text-[20px] shadow-lg transition-colors flex items-center justify-center ${selectedAnswer !== null ? 'bg-[#EF537B] hover:bg-[#FF4081]' : 'bg-gray-400 cursor-not-allowed'
              }`}
          >
            Zatwierdź
          </button>
        ) : (
          <button
            onClick={handleNextQuestion}
            className="w-[255px] h-[48px] bg-[#EF537B] hover:bg-[#FF4081] text-white font-bold text-[20px] rounded-[12px] shadow-lg transition-colors flex items-center justify-center"
          >
            {currentQuestionIndex < totalQuestions - 1 ? 'Następne pytanie' : 'Zakończ quiz'}
          </button>
        )}
      </div>
    </div>
  );
}