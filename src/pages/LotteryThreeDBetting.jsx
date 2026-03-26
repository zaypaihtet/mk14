import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Wallet } from "lucide-react";
import {
  generateNumbersForRange,
  toggleNumber,
  cleanManualInput,
  addManualNumber,
  roundNumbers,
  clearNumbers,
  formatBetSummary,
  HUNDRED_RANGE_OPTIONS,
} from "../utils/Lottery3DUtils";

export default function LotteryThreeDBetting() {
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [betAmount, setBetAmount] = useState("100");
  const [manualNumber, setManualNumber] = useState("");
  const [selectedHundredRange, setSelectedHundredRange] = useState(null);

  // Compute display numbers based on current range (default 000–099)
  const displayNumbers =
    selectedHundredRange !== null
      ? generateNumbersForRange(selectedHundredRange)
      : generateNumbersForRange(0);

  // UI handlers
  const onToggleNumber = (num) => setSelectedNumbers(toggleNumber(selectedNumbers, num));

  const onManualNumberChange = (value) => setManualNumber(cleanManualInput(value));

  const onAddManualNumber = () => {
    const result = addManualNumber(manualNumber, selectedNumbers);
    if (result.error) {
      alert(result.error);
      return;
    }
    setSelectedNumbers(result.numbers);
    setManualNumber("");
  };

  const onRoundNumbers = () => {
    const expanded = roundNumbers(selectedNumbers);
    if (expanded.length === 0) {
      alert("နံပါတ်များ ရွေးချယ်ပါ");
      return;
    }
    setSelectedNumbers(expanded);
  };

  const onClearSelected = () => {
    setSelectedNumbers(clearNumbers());
    alert("ရွေးချယ်ထားသောနံပါတ်များ ရှင်းလင်းပြီးပါပြီ");
  };

  const handleBet = () => {
    if (selectedNumbers.length === 0) {
      alert("နံပါတ်များ ရွေးချယ်ပါ");
      return;
    }
    alert(formatBetSummary(selectedNumbers, betAmount));
  };

  const handleBottomBet = () => {
    if (selectedNumbers.length === 0) {
      alert("နံပါတ်များ ရွေးချယ်ပါ");
      return;
    }
    alert(formatBetSummary(selectedNumbers, betAmount));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-200 to-blue-400">
      <div className="min-h-screen max-w-[500px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <Link to="/lottery-3d-result-detail">
            <button className="p-2 bg-white rounded-full hover:bg-blue-100">
              <ArrowLeft className="w-5 h-5 text-blue-600" />
            </button>
          </Link>

          <button
            className="px-2 py-1 border border-blue-600 rounded text-white bg-blue-500 hover:bg-blue-600"
            onClick={onRoundNumbers}
          >
            R
          </button>

          <div className="flex items-center space-x-2 text-black">
            <Wallet className="w-5 h-5" />
            <span className="text-sm font-medium">0 ကျပ်</span>
          </div>
        </div>

        {/* Bet Amount */}
        <div className="px-4 mb-4">
          <div className="bg-white p-4 rounded shadow flex items-center space-x-2">
            <input
              type="number"
              value={betAmount}
              onChange={(e) => setBetAmount(e.target.value)}
              className="flex-1 border border-blue-400 rounded text-center py-2"
              placeholder="ငွေပမာဏ သတ်မှတ် 100"
            />
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded"
              onClick={handleBet}
            >
              ထိုးမည်
            </button>
          </div>
        </div>

        {/* Manual Number Input */}
        <div className="px-4 mb-4">
          <div className="bg-white p-4 rounded shadow">
            <div className="mb-2 text-gray-700 font-medium text-sm">
              နံပါတ်ကိုယ်တိုင်ရိုက်ထည့်ရန်
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                value={manualNumber}
                onChange={(e) => onManualNumberChange(e.target.value)}
                maxLength={3}
                placeholder="000"
                className="flex-1 border border-blue-400 rounded text-center text-sm font-bold py-2"
              />
              <button
                onClick={onAddManualNumber}
                disabled={manualNumber.length !== 3}
                className="bg-blue-500 hover:bg-blue-600 text-sm text-nowrap disabled:bg-gray-400 text-white px-6 py-2 rounded"
              >
                ထည့်မည်
              </button>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              * နံပါတ် 3 လုံးစာ ရိုက်ထည့်ပါ (ဥပမာ: 123, 056, 789)
            </div>
          </div>
        </div>

        {/* Hundred Range Selector (ADDED BACK) */}
        <div className="px-4 mb-4">
          <div className="bg-white p-4 rounded shadow">
            <select
              className="w-full border border-blue-400 text-sm rounded py-2 px-2"
              value={selectedHundredRange ?? ""}
              onChange={(e) =>
                setSelectedHundredRange(
                  e.target.value === "" ? null : parseInt(e.target.value)
                )
              }
            >
              {HUNDRED_RANGE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} className="text-sm">
                  {opt.label}
                </option>
              ))}
            </select>
            <div className="mt-2 text-xs text-gray-500">
              * ရွေးချယ်ပါက သက်ဆိုင်ရာ နံပါတ်များ ပြသပါမည်
            </div>
          </div>
        </div>

        {/* Selected Numbers Display (ADDED BACK) */}
        {selectedNumbers.length > 0 && (
          <div className="px-4 mb-4">
            <div className="bg-blue-100 p-3 rounded">
              <div className="flex justify-between items-center">
                <div className="text-sm text-blue-800">
                  ရွေးချယ်ထားသောနံပါတ်များ: ({selectedNumbers.length})
                </div>
                <button
                  onClick={onClearSelected}
                  className="bg-red-500 hover:bg-red-600 text-white border border-red-500 py-1 px-2 rounded text-xs"
                >
                  ရှင်းမည်
                </button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {selectedNumbers.map((num) => (
                  <span
                    key={num}
                    className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
                  >
                    {num}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Numbers Grid */}
        <div className="px-4 pb-24">
          <div className="grid grid-cols-7 gap-2">
            {displayNumbers.map((num) => (
              <button
                key={num}
                onClick={() => onToggleNumber(num)}
                className={`aspect-square p-0 text-sm font-medium border-2 rounded
                  ${
                    selectedNumbers.includes(num)
                      ? "bg-blue-500 text-white border-blue-600 hover:bg-blue-600"
                      : "bg-white text-black border-gray-300 hover:bg-gray-100"
                  }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        {/* Fixed Bet Button (kept as separate handler) */}
        <div className="fixed bottom-6 px-2 pt-2 left-4 right-4 z-20 max-w-[500px] mx-auto">
          <button
            onClick={handleBottomBet}
            disabled={selectedNumbers.length === 0}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white py-3 rounded-xl text-sm font-semibold shadow-lg"
          >
            လောင်းကြေးထိုးမည် ({selectedNumbers.length} နံပါတ်)
          </button>
        </div>
      </div>
    </div>
  );
}
