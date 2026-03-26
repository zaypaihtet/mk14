import { ArrowLeft } from "lucide-react";
import React from "react";
import { Link } from "react-router";

const Lottery3DResultHeader = () => {
  return (
    <div>
      <Link to="/">
        <button className="p-2 rounded hover:bg-white/20 text-white">
          <ArrowLeft className="w-5 h-5" />
        </button>
      </Link>

      {/* Game Type Selector */}
      <div className="relative z-10 px-4 mb-6">
        <div className="grid grid-cols-3 gap-2 bg-blue-300 p-4 rounded shadow-lg">
          <div className="text-center">
            <div className="w-8 h-8 mx-auto mb-1 bg-black rounded-full flex items-center justify-center">
              <span className="text-white text-xs">📱</span>
            </div>
            <span className="text-xs text-white font-medium">မှတ်တမ်း</span>
          </div>
          <div className="text-center">
            <div className="w-8 h-8 mx-auto mb-1 bg-black rounded-full flex items-center justify-center">
              <span className="text-white text-xs">🏆</span>
            </div>
            <span className="text-xs text-white font-medium">ထီရလဒ်စစ်</span>
          </div>
          <div className="text-center">
            <Link
              to="/lottery-three-d-betting"
              className="w-8 h-8 mx-auto mb-1 bg-blue-500 rounded-full flex items-center justify-center"
            >
              <span className="text-white text-xs font-bold">3D</span>
            </Link>
            <span className="text-xs text-white font-medium">ထိုးမည်</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lottery3DResultHeader;
