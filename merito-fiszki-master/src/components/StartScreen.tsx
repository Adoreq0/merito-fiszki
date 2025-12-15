import React from 'react';

interface StartScreenProps {
  onStart: () => void;
}

export function StartScreen({ onStart }: StartScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white relative overflow-hidden font-sans">
      {/* Logo (imageView3) */}
      {/* Layout: top of parent, vertical bias 0.0 -> Top aligned */}
      <div className="absolute top-0 mt-8 z-10">
        <img src="/logo.png" alt="WSB Merito Logo" className="h-[154px] object-contain" />
      </div>

      {/* Decorative Rectangle (textView5) */}
      {/* Layout: top to top of imageView3, bottom to bottom of imageView3, vertical bias 0.831 */}
      {/* 154px * 0.831 ~= 128px from top of logo */}
      <div className="absolute top-[136px] w-[297px] h-[6px] bg-[#006EFA] z-20"></div>

      {/* Main Content Box (textView4) */}
      {/* Layout: top to top of parent, bottom to bottom of parent, vertical bias 0.803 */}
      {/* This positions the box lower in the screen. */}
      {/* Width: 345dp, Height: 502dp */}
      <div className="relative w-[345px] h-[502px] bg-[#f6f6f6] rounded-[16px] shadow-lg flex flex-col items-center mt-[100px]">

        {/* Text 1 (textView2) */}
        {/* Layout: top to bottom of imageView3 (which is at top), vertical bias 0.109 relative to box? No, relative to constraints. */}
        {/* It's constrained to the box (textView4). */}
        <div className="w-[243px] h-[72px] mt-[50px] text-center flex items-center justify-center">
          <p className="text-[14px] font-bold text-black leading-tight">
            Witaj na pokładzie WSB Merito! <br />
            Cieszymy się że dołączyłeś do naszej społecznosści
          </p>
        </div>

        {/* Text 2 (textView3) */}
        <div className="mt-[40px] text-center">
          <p className="text-[14px] font-bold text-black leading-tight">
            Przygotuj się na ekscytujacą podróż <br />
            akademicką <br />
            Ten quiz pozwoli ci poznać naszą <br />
            uczelnię!
          </p>
        </div>

        {/* Start Button (buttonStart) */}
        {/* Width: 240dp, Height: 43dp */}
        <button
          onClick={onStart}
          className="absolute bottom-[80px] w-[240px] h-[43px] bg-[#EF537B] hover:bg-[#FF4081] text-white font-bold text-[14px] rounded-[12px] shadow-lg transition-colors flex items-center justify-center uppercase tracking-wide"
        >
          Rozpocznij quiz
        </button>
      </div>
    </div>
  );
}
