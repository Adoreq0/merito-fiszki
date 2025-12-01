import React from 'react';

interface StartScreenProps {
  onStart: () => void;
}

export function StartScreen({ onStart }: StartScreenProps) {
  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-white p-6 pb-20">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8">
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

        {/* Welcome Text */}
        <div className="text-center mb-8 mt-16">
          <h1 className="mb-6">Witaj na pokładzie WSB Merito!</h1>
          <p className="text-gray-700 mb-6">
            Cieszymy się, że dołączysz do naszej społeczności!
          </p>
          <p className="text-gray-700">
            Przygotuj się na ekscytującą podróż akademicką! Ten quiz pozwoli Ci poznać naszą uczelnię!
          </p>
        </div>
      </div>

      {/* Start Button */}
      <div className="w-full max-w-md">
        <button
          onClick={onStart}
          className="w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white py-4 px-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95"
        >
          Rozpocznij quiz
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
