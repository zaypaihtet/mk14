import React, { useState } from "react";
import { ArrowLeft, Wallet, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TwoDQuickPickModal from "../components/lottery2d-betting/TwoDQuickPickModal";
import { api, isLoggedIn } from "../utils/api";

const LotteryTwoDBetting = () => {
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [betAmount, setBetAmount] = useState("100");
  const [manualNumber, setManualNumber] = useState("");
  const [showQuickPickModal, setShowQuickPickModal] = useState(false);
  const navigate = useNavigate();

  // Generate 2D numbers from 00 to 99
  const generate2DNumbers = () => {
    const numbers = [];
    for (let i = 0; i <= 99; i++) {
      numbers.push(i.toString().padStart(2, "0"));
    }
    return numbers;
  };

  const numbers = generate2DNumbers();

  const toggleNumber = (number) => {
    setSelectedNumbers((prev) => {
      if (prev.includes(number)) {
        return prev.filter((n) => n !== number);
      } else {
        return [...prev, number];
      }
    });
  };

  const handleManualNumberChange = (value) => {
    // Only allow digits and max 2 characters
    const cleanValue = value.replace(/[^0-9]/g, "").slice(0, 2);
    setManualNumber(cleanValue);
  };

  const addManualNumber = () => {
    if (manualNumber.length >= 1) {
      const formattedNumber = manualNumber.padStart(2, "0");
      if (!selectedNumbers.includes(formattedNumber)) {
        setSelectedNumbers((prev) => [...prev, formattedNumber]);
        setManualNumber("");
      } else {
        alert("ဤနံပါတ်ကို ရွေးချယ်ပြီးသားဖြစ်သည်");
      }
    } else {
      alert("နံပါတ် ရိုက်ထည့်ပါ");
    }
  };

  const handleRoundNumbers = () => {
    if (selectedNumbers.length === 0) {
      //   alert("နံပါတ်များ ရွေးချယ်ပါ");
      return;
    }

    const roundNumbers = [];
    selectedNumbers.forEach((number) => {
      // Reverse the digits (21 -> 12)
      const reversed = number.split("").reverse().join("");
      if (
        !selectedNumbers.includes(reversed) &&
        !roundNumbers.includes(reversed)
      ) {
        roundNumbers.push(reversed);
      }
    });

    if (roundNumbers.length > 0) {
      setSelectedNumbers([...selectedNumbers, ...roundNumbers]);
      //   alert(`R နံပါတ်များ ထပ်တိုးပြီးပါပြီ: ${roundNumbers.join(", ")} (စုစုပေါင်း ${roundNumbers.length} နံပါတ်)`);
    } else {
      alert(
        "R နံပါတ်များ မရှိပါ (ရွေးချယ်ထားသောနံပါတ်များ နံပါတ်ပြောင်းပြီးသားဖြစ်သည်)"
      );
    }
  };

  const clearSelectedNumbers = () => {
    setSelectedNumbers([]);
    alert("ရွေးချယ်ထားသောနံပါတ်များ ရှင်းလင်းပြီးပါပြီ");
  };

  const [session, setSession] = useState('morning');

  const handleBottomBet = async () => {
    if (selectedNumbers.length === 0) {
      alert("နံပါတ်များ ရွေးချယ်ပါ");
      return;
    }
    alert(
      `ရွေးချယ်ထားသောနံပါတ်များ: ${selectedNumbers.join(
        ", "
      )}\nလောင်းကြေး: ${betAmount} ကျပ်`
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-400 to-blue-600">
      {/* Header */}
      <div className="max-w-[500px] mx-auto min-h-screen">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => navigate('/lottery-2d-result-detail')}
            className="text-black hover:bg-black/10 p-2 rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowQuickPickModal(true)}
              className="bg-white text-black border border-black hover:bg-gray-100 py-1 px-3 rounded text-sm"
            >
              အမြန်ရွေး
            </button>
            <button
              onClick={handleRoundNumbers}
              className="border border-black text-white hover:bg-black/10 py-1 px-3 rounded text-sm"
            >
              R
            </button>
          </div>
          <div className="flex items-center space-x-2 text-black">
            <Wallet className="w-5 h-5" />
            <span className="text-sm font-medium">0 ကျပ်</span>
          </div>
        </div>

        {/* Game Info */}
        <div className="px-4 mb-4">
          <div className="bg-black/10 rounded-lg p-3">
            <div className="flex justify-between items-center text-black text-sm">
              <span>ထီ2Dထိုးရန်</span>
              <span>03:58 PM</span>
            </div>
          </div>
        </div>

        {/* Bet Amount Input */}
        <div className="px-4 mb-4">
          <div className="bg-white rounded-lg border-0 p-4">
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
                placeholder="ငွေပမာဏ သတ်မှတ် 100"
                className="flex-1 text-center border w-36 border-blue-400 text-xs focus:border-blue-600 py-2 px-3 rounded"
              />
              <button className="bg-blue-500 text-xs text-nowrap hover:bg-blue-600 text-black py-2 px-4 rounded">
                ထိုးမည်
              </button>
              <button
                onClick={() => navigate("/lottery-two-d-confirmation")}
                className="bg-blue-500 text-xs text-nowrap hover:bg-blue-600 text-black py-2 px-4 rounded"
              >
                ခွေထိုးမည်
              </button>
            </div>
          </div>
        </div>

        {/* Manual Number Input */}
        <div className="px-4 mb-4">
          <div className="bg-white rounded-lg border-0 p-4">
            <div className="mb-2">
              <span className="text-sm font-medium text-gray-700">
                နံပါတ်ကိုယ်တိုင် ရိုက်ထည့်ရန်
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={manualNumber}
                onChange={(e) => handleManualNumberChange(e.target.value)}
                placeholder="00"
                maxLength={2}
                className="flex-1 text-center text-sm font-bold border border-blue-400 focus:border-blue-600 py-2 px-3 rounded"
              />
              <button
                onClick={addManualNumber}
                disabled={manualNumber.length === 0}
                className="bg-blue-500 text-sm text-nowrap hover:bg-blue-600 disabled:bg-gray-400 text-white py-2 px-4 rounded"
              >
                ထည့်မည်
              </button>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              * နံပါတ် 1-2 လုံးစာ ရိုက်ထည့်ပါ (ဥပမာ: 12, 5, 99)
            </div>
          </div>
        </div>

        {/* Selected Numbers Display */}
        {selectedNumbers.length > 0 && (
          <div className="px-4 mb-4">
            <div className="bg-blue-100 rounded-lg border-0 p-3">
              <div className="flex justify-between items-center mb-2">
                <div className="text-sm text-blue-800">
                  ရွေးချယ်ထားသောနံပါတ်များ: ({selectedNumbers.length})
                </div>
                <button
                  onClick={clearSelectedNumbers}
                  className="bg-red-500 hover:bg-red-600 text-white border border-red-500 py-1 px-2 rounded text-xs"
                >
                  ရှင်းမည်
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedNumbers.map((number) => (
                  <span
                    key={number}
                    className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
                  >
                    {number}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 2D Numbers Grid */}
        <div className="px-4 pb-20">
          <div className="grid grid-cols-7 gap-2">
            {numbers.map((number) => (
              <button
                key={number}
                className={`
                aspect-square p-0 text-sm font-medium border-2 rounded
                ${
                  selectedNumbers.includes(number)
                    ? "bg-blue-500 text-white border-blue-600 hover:bg-blue-600"
                    : "bg-white text-black border-gray-300 hover:bg-gray-100"
                }
              `}
                onClick={() => toggleNumber(number)}
              >
                {number}
              </button>
            ))}
          </div>
        </div>

        {/* Fixed Bet Button */}
        <div className="fixed bottom-6 px-2 pt-2 left-4 right-4 z-20 max-w-[500px] mx-auto">
          <button
            onClick={handleBottomBet}
            disabled={selectedNumbers.length === 0}
            className=" w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white py-3 rounded-xl text-sm font-semibold shadow-lg"
          >
            လောင်းကြေးထိုးမည် ({selectedNumbers.length} နံပါတ်)
          </button>
        </div>

        {/* Quick Pick Modal */}
        {showQuickPickModal && (
          <TwoDQuickPickModal
            setSelectedNumbers={setSelectedNumbers}
            setShowQuickPickModal={setShowQuickPickModal}
          />
        )}
      </div>
    </div>
  );
};

export default LotteryTwoDBetting;
