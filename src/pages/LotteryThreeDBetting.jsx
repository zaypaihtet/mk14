import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Wallet, CalendarOff, CheckCircle2, XCircle } from "lucide-react";
import {
  generateNumbersForRange,
  toggleNumber,
  cleanManualInput,
  addManualNumber,
  roundNumbers,
  clearNumbers,
  HUNDRED_RANGE_OPTIONS,
} from "../utils/Lottery3DUtils";
import { api, isLoggedIn } from "../utils/api";

export default function LotteryThreeDBetting() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn()) navigate("/login", { replace: true });
  }, []);

  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [betAmount, setBetAmount] = useState("100");
  const [manualNumber, setManualNumber] = useState("");
  const [selectedHundredRange, setSelectedHundredRange] = useState(null);
  const [balance, setBalance] = useState(null);
  const [placing, setPlacing] = useState(false);
  const [toast, setToast] = useState(null);

  const [isHoliday, setIsHoliday] = useState(false);
  const [holidayDescription, setHolidayDesc] = useState("");
  const [numberStatus, setNumberStatus] = useState({}); // { "123": { is_blocked, day_limit, today_total } }

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    if (!isLoggedIn()) return;
    api.getBalance()
      .then((d) => setBalance(d.balance ?? d))
      .catch(() => {});
    api.isHoliday()
      .then((d) => {
        if (d.isHoliday) { setIsHoliday(true); setHolidayDesc(d.description || "ပိတ်ရက်"); }
      })
      .catch(() => {});
    api.getNumberStatus3D()
      .then((data) => {
        const map = {};
        data.forEach((n) => { map[n.number] = n; });
        setNumberStatus(map);
      })
      .catch(() => {});
  }, []);

  const displayNumbers =
    selectedHundredRange !== null
      ? generateNumbersForRange(selectedHundredRange)
      : generateNumbersForRange(0);

  const onToggleNumber = (num) => {
    const status = numberStatus[num];
    if (status?.is_blocked) { showToast(`${num} နံပါတ်ကို ပိတ်ထားသည်`, "error"); return; }
    setSelectedNumbers(toggleNumber(selectedNumbers, num));
  };
  const onManualNumberChange = (value) => setManualNumber(cleanManualInput(value));

  const onAddManualNumber = () => {
    const result = addManualNumber(manualNumber, selectedNumbers);
    if (result.error) { showToast(result.error, "error"); return; }
    setSelectedNumbers(result.numbers);
    setManualNumber("");
  };

  const onRoundNumbers = () => {
    const expanded = roundNumbers(selectedNumbers);
    if (expanded.length === 0) { showToast("နံပါတ်များ ရွေးချယ်ပါ", "error"); return; }
    setSelectedNumbers(expanded);
  };

  const onClearSelected = () => setSelectedNumbers(clearNumbers());

  const handlePlaceBet = async () => {
    if (selectedNumbers.length === 0) { showToast("နံပါတ်များ ရွေးချယ်ပါ", "error"); return; }
    const amount = parseInt(betAmount);
    if (!amount || amount < 100) { showToast("အနည်းဆုံး 100 ကျပ် ထိုးရပါမည်", "error"); return; }
    setPlacing(true);
    try {
      await api.placeBet3D(selectedNumbers, amount);
      showToast("3D ထိုးခြင်း အောင်မြင်ပါသည်", "success");
      setSelectedNumbers([]);
      const d = await api.getBalance();
      setBalance(d.balance ?? d);
    } catch (err) {
      showToast(err?.message || "ထိုးခြင်း မအောင်မြင်ပါ", "error");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-200 to-blue-400">
      <div className="min-h-screen max-w-[500px] mx-auto pb-28">

        {/* Toast */}
        {toast && (
          <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-white text-sm max-w-xs w-full ${toast.type === "success" ? "bg-green-600" : "bg-red-600"}`}>
            {toast.type === "success" ? <CheckCircle2 className="h-5 w-5 shrink-0" /> : <XCircle className="h-5 w-5 shrink-0" />}
            <span>{toast.msg}</span>
          </div>
        )}

        {isHoliday ? (
          <div className="flex flex-col items-center justify-center min-h-screen gap-6 px-8 text-center">
            <div className="bg-white/20 backdrop-blur rounded-3xl p-8 w-full max-w-xs">
              <CalendarOff className="w-16 h-16 mx-auto mb-4 text-white" />
              <h2 className="text-2xl font-bold text-white mb-2">ပိတ်ရက်</h2>
              <p className="text-white/90 text-lg font-semibold mb-1">{holidayDescription}</p>
              <p className="text-white/70 text-sm mb-6">ဤနေ့တွင် 3D ထိုးခွင့် မပေးပါ</p>
              <Link to="/">
                <button className="w-full bg-white text-blue-600 font-semibold py-3 rounded-2xl hover:bg-blue-50 transition-colors">
                  ပင်မစာမျက်နှာ ပြန်သွားမည်
                </button>
              </Link>
            </div>
          </div>
        ) : (
          <>
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
                <span className="text-sm font-medium">
                  {balance !== null ? Number(balance).toLocaleString() : "..."} ကျပ်
                </span>
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
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded disabled:opacity-50"
                  onClick={handlePlaceBet}
                  disabled={selectedNumbers.length === 0 || placing}
                >
                  {placing ? "ထိုးနေသည်..." : "ထိုးမည်"}
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

            {/* Hundred Range Selector */}
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

            {/* Selected Numbers Display */}
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
            <div className="px-4">
              {/* Legend */}
              <div className="flex gap-3 text-[10px] text-gray-600 mb-2 flex-wrap">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-white border border-gray-300 inline-block" /> ပုံမှန်</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-orange-200 border border-orange-400 inline-block" /> Limit နီးပြီ</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-red-200 border border-red-400 inline-block" /> ပိတ် / ပြည့်</span>
              </div>
              <div className="grid grid-cols-7 gap-1.5">
                {displayNumbers.map((num) => {
                  const status = numberStatus[num];
                  const isBlocked = status?.is_blocked;
                  const pct = status?.day_limit > 0 ? status.today_total / status.day_limit : 0;
                  const isNearFull = !isBlocked && pct >= 0.8 && pct < 1;
                  const isSelected = selectedNumbers.includes(num);

                  let cls = "bg-white text-black border-gray-300 hover:bg-gray-100";
                  if (isSelected) cls = "bg-blue-500 text-white border-blue-600 hover:bg-blue-600";
                  else if (isBlocked) cls = "bg-red-200 text-red-700 border-red-400 cursor-not-allowed opacity-80";
                  else if (isNearFull) cls = "bg-orange-100 text-orange-700 border-orange-400 hover:bg-orange-200";

                  return (
                    <button
                      key={num}
                      onClick={() => onToggleNumber(num)}
                      disabled={isBlocked}
                      className={`aspect-square p-0 text-sm font-medium border-2 rounded ${cls}`}
                    >
                      {num}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Fixed Bet Button (only when not holiday) */}
      {!isHoliday && (
        <div className="fixed bottom-6 px-2 pt-2 left-0 right-0 z-20 max-w-[500px] mx-auto">
          <button
            onClick={handlePlaceBet}
            disabled={selectedNumbers.length === 0 || placing}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white py-3 rounded-xl text-sm font-semibold shadow-lg"
          >
            {placing
              ? "ထိုးနေသည်..."
              : selectedNumbers.length === 0
              ? "နံပါတ် ရွေးပါ"
              : `လောင်းကြေးထိုးမည် (${selectedNumbers.length} နံပါတ်)`}
          </button>
        </div>
      )}
    </div>
  );
}
