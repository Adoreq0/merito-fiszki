import { Question } from "../App";
import logo from "figma:asset/d77e1684de9e2525429043e73c136bc79c7f51ae.png";

interface ResultsScreenProps {
  score: number;
  totalQuestions: number;
  questions: Question[];
  userAnswers: number[];
  onRestart: () => void;
}

export function ResultsScreen({
  score,
  totalQuestions,
  onRestart,
}: ResultsScreenProps) {
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
          <h2 className="text-gray-800 mb-8 text-2xl leading-relaxed">
            Gratulacje udało ci się ukończyć nasz quiz!
          </h2>

          <div className="mb-10">
            <p className="text-gray-700 mb-4 text-lg">
              Poprawne odpowiedzi:
            </p>
            <div className="text-6xl text-blue-600 mb-2">
              {score}/{totalQuestions}
            </div>
          </div>

          <button
            onClick={onRestart}
            className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white py-4 px-8 rounded-[15px] transition-all shadow-lg text-lg"
          >
            Rozpocznij jeszcze raz
          </button>
        </div>
      </div>
    </div>
  );
}