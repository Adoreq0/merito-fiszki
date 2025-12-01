import React from 'react';

interface ResultScreenProps {
  score: number;
  totalQuestions: number;
  onRestart: () => void;
}

export function ResultScreen({ score, totalQuestions, onRestart }: ResultScreenProps) {
  const percentage = (score / totalQuestions) * 100;
  
  const getMessage = () => {
    if (percentage === 100) {
      return 'Brawo! Perfekcyjny wynik! 🎉';
    } else if (percentage >= 80) {
      return 'Świetna robota! 👏';
    } else if (percentage >= 60) {
      return 'Dobry wynik! 👍';
    } else {
      return 'Spróbuj jeszcze raz! 💪';
    }
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-white p-6 pb-20">
      <div className="w-full max-w-md flex-1 flex flex-col items-center justify-center">
        {/* Logo */}
        <div className="mb-12 w-full">
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 bg-blue-600 flex items-center justify-center rounded">
              <span className="text-white text-2xl">M</span>
            </div>
            <div>
              <div className="text-sm">UNIWERSYTETY</div>
              <div className="flex items-center gap-1">
                <span>WSB</span>
                <span className="text-blue-600">MERITO</span>
              </div>
            </div>
          </div>
          <div className="w-full h-1 bg-blue-600 mt-2"></div>
        </div>

        {/* Success Message */}
        <div className="text-center mb-8">
          <h1 className="mb-4">Gratulacje udało ci się ukończyć nasz quiz!</h1>
          <p className="text-gray-600 mb-2">{getMessage()}</p>
        </div>

        {/* Score Display */}
        <div className="text-center mb-12">
          <p className="text-gray-700 mb-2">Poprawne odpowiedzi:</p>
          <div className="text-5xl mb-4">
            <span className="text-blue-600">{score}</span>
            <span className="text-gray-400">/{totalQuestions}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-1000"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
          <p className="mt-2 text-gray-600">{percentage.toFixed(0)}%</p>
        </div>
      </div>

      {/* Restart Button */}
      <div className="w-full max-w-md">
        <button
          onClick={onRestart}
          className="w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white py-4 px-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95"
        >
          Rozpocznij jeszcze raz
        </button>
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
