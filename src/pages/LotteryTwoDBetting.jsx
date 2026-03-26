import React, { useState, useEffect } from "react";
import { ArrowLeft, Wallet, History, CheckCircle2, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TwoDQuickPickModal from "../components/lottery2d-betting/TwoDQuickPickModal";
import { api, isLoggedIn } from "../utils/api";

const LotteryTwoDBetting = () => {
  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/login", { replace: true });
    }
  }, []);

  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [betAmount, setBetAmount]   = useState("100");
  const [manualNumber, setManualNumber] = useState("");
  const [session, setSession]       = useState("morning");
  const [showQuickPickModal, setShowQuickPickModal] = useState(false);
  const [balance, setBalance]       = useState(null);
  const [placing, setPlacing]       = useState(false);
  const [toast, setToast]           = useState(null); // {type:'success'|'error', msg}

  // Fetch real wallet balance
  useEffect(() => {
    if (!isLoggedIn()) return;
    api.getBalance()
      .then((d) => setBalance(d.balance ?? d))
      .catch(() => {});
  }, []);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  // Generate 00–99
  const numbers = Array.from({ length: 100 }, (_, i) => i.toString().padStart(2, "0"));

  const toggleNumber = (n) =>
    setSelectedNumbers((prev) =>
      prev.includes(n) ? prev.filter((x) => x !== n) : [...prev, n]
    );

  const handleManualNumberChange = (value) => {
    setManualNumber(value.replace(/[^0-9]/g, "").slice(0, 2));
  };

  const addManualNumber = () => {
    if (!manualNumber) { showToast("error", "နံပါတ် ရိုက်ထည့်ပါ"); return; }
    const formatted = manualNumber.padStart(2, "0");
    if (selectedNumbers.includes(formatted)) {
      showToast("error", "ဤနံပါတ် ရွေးထားပြီးပြီ");
    } else {
      setSelectedNumbers((prev) => [...prev, formatted]);
      setManualNumber("");
    }
  };

  const handleRoundNumbers = () => {
    const extra = [];
    selectedNumbers.forEach((n) => {
      const rev = n.split("").reverse().join("");
      if (!selectedNumbers.includes(rev) && !extra.includes(rev)) extra.push(rev);
    });
    if (extra.length) setSelectedNumbers((prev) => [...prev, ...extra]);
    else showToast("error", "R နံပါတ်များ မရှိပါ");
  };

  const clearSelected = () => setSelectedNumbers([]);

  // ──── Main bet handler ────
  const handlePlaceBet = async () => {
    if (!isLoggedIn()) { navigate("/login"); return; }
    if (selectedNumbers.length === 0) { showToast("error", "နံပါတ်များ ရွေးချယ်ပါ"); return; }
    const amount = parseInt(betAmount);
    if (!amount || amount < 100) { showToast("error", "အနည်းဆုံး 100 ကျပ် ထိုးရပါမည်"); return; }
    const total = amount * selectedNumbers.length;
    if (balance !== null && total > balance) {
      showToast("error", `လက်ကျန်ငွေ မလုံလောက်ပါ (${Number(balance).toLocaleString()} ကျပ်)`);
      return;
    }

    setPlacing(true);
    try {
      const res = await api.placeBet2D(selectedNumbers, amount, session);
      setBalance((prev) => (prev !== null ? prev - total : prev));
      setSelectedNumbers([]);
      showToast("success", `ထိုးကောင်းပြီ! (${selectedNumbers.length} နံပါတ် × ${amount.toLocaleString()} = ${total.toLocaleString()} ကျပ်)`);
    } catch (err) {
      showToast("error", err.message || "ထိုးမရသေးပါ၊ ထပ်ကြိုးစားပါ");
    } finally {
      setPlacing(false);
    }
  };

  const totalBet = parseInt(betAmount || 0) * selectedNumbers.length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-400 to-blue-600">
      <div className="max-w-[500px] mx-auto min-h-screen pb-28">

        {/* Toast */}
        {toast && (
          <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-white text-sm max-w-xs w-full ${toast.type === "success" ? "bg-green-600" : "bg-red-600"}`}>
            {toast.type === "success" ? <CheckCircle2 className="h-5 w-5 shrink-0" /> : <XCircle className="h-5 w-5 shrink-0" />}
            <span>{toast.msg}</span>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <button onClick={() => navigate(-1)} className="text-black hover:bg-black/10 p-2 rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowQuickPickModal(true)} className="bg-white text-black border border-black hover:bg-gray-100 py-1 px-3 rounded text-sm">
              အမြန်ရွေး
            </button>
            <button onClick={handleRoundNumbers} className="border border-black text-white hover:bg-black/10 py-1 px-3 rounded text-sm">
              R
            </button>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/lottery-2d-history")} className="text-black p-1">
              <History className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-1 text-black">
              <Wallet className="w-5 h-5" />
              <span className="text-sm font-semibold">
                {balance !== null ? Number(balance).toLocaleString() : "..."} ကျပ်
              </span>
            </div>
          </div>
        </div>

        {/* Session selector */}
        <div className="px-4 mb-3">
          <div className="flex rounded-xl overflow-hidden border border-white/30">
            <button
              onClick={() => setSession("morning")}
              className={`flex-1 py-2 text-sm font-medium transition-colors ${session === "morning" ? "bg-white text-blue-700" : "bg-white/20 text-white"}`}
            >
              မနက် (12:00 PM)
            </button>
            <button
              onClick={() => setSession("evening")}
              className={`flex-1 py-2 text-sm font-medium transition-colors ${session === "evening" ? "bg-white text-blue-700" : "bg-white/20 text-white"}`}
            >
              ညနေ (4:30 PM)
            </button>
          </div>
        </div>

        {/* Bet amount */}
        <div className="px-4 mb-3">
          <div className="bg-white rounded-xl p-4">
            <label className="block text-xs text-gray-500 mb-1">တစ်နံပါတ်လျှင် ကျပ်</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
                min="100"
                step="100"
                className="flex-1 border border-blue-300 rounded-lg px-3 py-2 text-sm text-center font-bold focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {[100, 200, 500, 1000].map((v) => (
                <button
                  key={v}
                  onClick={() => setBetAmount(String(v))}
                  className={`px-2 py-2 rounded-lg text-xs font-semibold border ${betAmount === String(v) ? "bg-blue-600 text-white border-blue-600" : "border-gray-300 text-gray-600 hover:bg-gray-50"}`}
                >
                  {v >= 1000 ? v / 1000 + "K" : v}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Manual number */}
        <div className="px-4 mb-3">
          <div className="bg-white rounded-xl p-4">
            <label className="block text-xs text-gray-500 mb-2">နံပါတ် ကိုယ်တိုင်ရိုက်</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={manualNumber}
                onChange={(e) => handleManualNumberChange(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addManualNumber()}
                placeholder="00 – 99"
                maxLength={2}
                className="flex-1 border border-blue-300 rounded-lg px-3 py-2 text-sm text-center font-bold focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                onClick={addManualNumber}
                disabled={!manualNumber}
                className="bg-blue-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                ထည့်
              </button>
            </div>
          </div>
        </div>

        {/* Selected numbers */}
        {selectedNumbers.length > 0 && (
          <div className="px-4 mb-3">
            <div className="bg-white/90 rounded-xl p-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-blue-800">ရွေးထားသောနံပါတ် ({selectedNumbers.length})</span>
                <button onClick={clearSelected} className="text-xs text-red-500 hover:underline">ရှင်းမည်</button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {selectedNumbers.map((n) => (
                  <button key={n} onClick={() => toggleNumber(n)} className="bg-blue-600 text-white px-2.5 py-1 rounded-lg text-sm font-bold hover:bg-red-500 transition-colors">
                    {n}
                  </button>
                ))}
              </div>
              {totalBet > 0 && (
                <p className="text-xs text-gray-600 mt-2">
                  စုစုပေါင်း: {selectedNumbers.length} × {Number(betAmount || 0).toLocaleString()} = <b>{totalBet.toLocaleString()} ကျပ်</b>
                </p>
              )}
            </div>
          </div>
        )}

        {/* 2D Grid */}
        <div className="px-4">
          <div className="grid grid-cols-7 gap-1.5">
            {numbers.map((n) => (
              <button
                key={n}
                onClick={() => toggleNumber(n)}
                className={`aspect-square text-sm font-bold rounded-lg border-2 transition-colors ${
                  selectedNumbers.includes(n)
                    ? "bg-blue-600 text-white border-blue-700"
                    : "bg-white text-gray-800 border-gray-200 hover:border-blue-400"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Fixed bottom bet button */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[500px] mx-auto p-4 bg-gradient-to-t from-blue-700 to-transparent pt-6">
        <button
          onClick={handlePlaceBet}
          disabled={selectedNumbers.length === 0 || placing}
          className="w-full bg-white text-blue-700 font-bold py-4 rounded-2xl shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-base hover:bg-blue-50 transition-colors"
        >
          {placing
            ? "ထိုးနေသည်..."
            : selectedNumbers.length === 0
            ? "နံပါတ် ရွေးပါ"
            : `ထိုးမည် — ${selectedNumbers.length} နံပါတ် (${totalBet.toLocaleString()} ကျပ်)`}
        </button>
      </div>

      {showQuickPickModal && (
        <TwoDQuickPickModal
          setSelectedNumbers={setSelectedNumbers}
          setShowQuickPickModal={setShowQuickPickModal}
        />
      )}
    </div>
  );
};

export default LotteryTwoDBetting;
