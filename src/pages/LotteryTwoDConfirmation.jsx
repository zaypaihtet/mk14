import { ArrowLeft } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LotteryTwoDConfirmation = () => {
  const navigate = useNavigate();
  const [customNumbers, setCustomNumbers] = useState("");
  const [customAmount, setCustomAmount] = useState("100");
  const [generatedNumbers, setGeneratedNumbers] = useState([]);
  const [includeDoubles, setIncludeDoubles] = useState(true);

  // Generate 2-digit combinations
  const generate2DigitCombinations = (digits, includeDoubles = true) => {
    const combinations = new Set();
    for (let i = 0; i < digits.length; i++) {
      for (let j = 0; j < digits.length; j++) {
        const combo = digits[i] + digits[j];
        if (includeDoubles || digits[i] !== digits[j]) {
          combinations.add(combo);
        }
      }
    }
    return Array.from(combinations).sort();
  };

  // Update generated numbers when input or doubles option changes
  useEffect(() => {
    if (customNumbers.length >= 3) {
      const combos = generate2DigitCombinations(customNumbers, includeDoubles);
      setGeneratedNumbers(combos);
    } else {
      setGeneratedNumbers([]);
    }
  }, [customNumbers, includeDoubles]);

  const handleConfirmBet = () => {
    if (generatedNumbers.length === 0) {
      alert("နံပါတ်များ ရိုက်ထည့်ပါ");
      return;
    }
    alert(
      `ထီထိုးပြီးပါပြီ!\nစုစုပေါင်း: ${
        generatedNumbers.length
      } ထွေး\nစုစုပေါင်းငွေ: ${
        generatedNumbers.length * parseInt(customAmount)
      } ကျပ်`
    );
    navigate("/lottery-two-d-betting");
  };

  const handleAddCustomNumbers = (value) => {
    const cleaned = value.replace(/[^0-9]/g, "").slice(0, 7);
    setCustomNumbers(cleaned);
  };

  const handleIncludeDoubles = (include) => setIncludeDoubles(include);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-400 to-blue-600 p-4 mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigate("/lottery-two-d-betting")}
          className="text-black hover:bg-white/50 p-2 rounded-full"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="text-white font-bold text-lg">MM 2D ခွေထိုး</div>
        <div className="text-white">လက်ကျန်ငွေ: 0 ကျပ်</div>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-white rounded p-3">
          <div className="text-sm text-gray-600 mb-2">
            ဂဏန်း 3 လုံးမှ 7 လုံးထိ
          </div>
          <input
            type="text"
            value={customNumbers}
            onChange={(e) => handleAddCustomNumbers(e.target.value)}
            placeholder="3456789"
            maxLength={7}
            className="w-full text-center text-lg font-bold border border-blue-400 rounded py-1"
          />
        </div>
        <div className="bg-white rounded p-3">
          <div className="text-sm text-gray-600 mb-2">အနည်းဆုံး 100</div>
          <input
            type="number"
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
            placeholder="100"
            className="w-full text-center text-lg font-bold border border-blue-400 rounded py-1"
          />
        </div>
      </div>

      {/* Include/Exclude doubles */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <button
          onClick={() => handleIncludeDoubles(true)}
          className={`py-3 font-medium rounded ${
            includeDoubles ? "bg-blue-800 text-white" : "bg-blue-300 text-black"
          }`}
        >
          အပူးပါ
        </button>
        <button
          onClick={() => handleIncludeDoubles(false)}
          className={`py-3 font-medium rounded ${
            !includeDoubles
              ? "bg-blue-800 text-white"
              : "bg-blue-300 text-black"
          }`}
        >
          အပူးမပါ
        </button>
      </div>

      {/* Generated numbers */}
      <div className="bg-white rounded p-3 mb-20">
        <div className="grid grid-cols-3 gap-4 text-center font-medium text-gray-700 mb-2 border-b pb-1">
          <div>စဉ်</div>
          <div>ထိုးဂဏန်း</div>
          <div>ငွေပမာဏ</div>
        </div>

        {generatedNumbers.length > 0 ? (
          <>
            {generatedNumbers.map((num, idx) => (
              <div
                key={idx}
                className="grid grid-cols-3 gap-4 text-center py-1 border-b border-gray-100"
              >
                <div>{idx + 1}</div>
                <div className="text-gray-700">{num}</div>
                <div className="text-gray-700">{customAmount}</div>
              </div>
            ))}
            <div className="grid grid-cols-3 gap-4 text-center py-2 border-t-2 border-gray-300 font-bold">
              <div>စုစုပေါင်းထိုးငွေ</div>
              <div>-</div>
              <div>{generatedNumbers.length * parseInt(customAmount)}</div>
            </div>
          </>
        ) : (
          <div className="text-center text-gray-500 py-4">
            နံပါတ်များ ရိုက်ထည့်ပါ
          </div>
        )}
      </div>

      {/* Confirm Button */}
      <div className="fixed bottom-6 px-2 pt-2 left-4 right-4 max-w-[500px] mx-auto">
        <button
          onClick={handleConfirmBet}
          disabled={generatedNumbers.length === 0}
          className="w-full py-4 text-sm font-semibold rounded-xl shadow-lg bg-blue-700 hover:bg-blue-800 disabled:bg-gray-400 text-white"
        >
          ထီထိုးမည် ({generatedNumbers.length})
        </button>
      </div>
    </div>
  );
};

export default LotteryTwoDConfirmation;
