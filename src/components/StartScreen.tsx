import logo from "figma:asset/d77e1684de9e2525429043e73c136bc79c7f51ae.png";

interface StartScreenProps {
  onStart: () => void;
}

export function StartScreen({ onStart }: StartScreenProps) {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        {/* Logo WSB Merito */}
        <div className="mb-8 flex flex-col items-center">
          <div className="flex flex-col items-center">
            <img src={logo} alt="WSB Merito" className="h-40" />
            <div className="w-4/5 h-1.5 -mt-8 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-500 rounded-full"></div>
          </div>
        </div>

        {/* Content Box */}
        <div className="bg-[#F6F6F6] rounded-3xl p-8 text-center">
          <h2 className="text-gray-800 mb-8 text-2xl">
            Witaj na pokładzie WSB Merito!
          </h2>
          <p className="text-gray-600 mb-4 text-lg leading-relaxed">
            Cieszymy się, że dołączyłeś do naszej społeczności!
          </p>
          <p className="text-gray-600 mb-4 text-lg leading-relaxed">
            Przygotuj się na ekscytującą podróż akademicką!
          </p>
          <p className="text-gray-600 mb-10 text-lg leading-relaxed">
            Ten quiz pozwoli ci poznać naszą uczelnię!
          </p>

          <button
            onClick={onStart}
            className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white py-4 px-8 rounded-[15px] transition-all shadow-lg text-lg"
          >
            Rozpocznij quiz
          </button>
        </div>
      </div>
    </div>
  );
}