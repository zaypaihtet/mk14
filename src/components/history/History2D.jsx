import React, { useEffect, useState } from "react";
import { api } from "../../utils/api";

const History2D = () => {
  const [bets, setBets]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState("all"); // all | morning | evening

  useEffect(() => {
    api.getBettingHistory2D()
      .then(setBets)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === "all" ? bets : bets.filter((b) => b.session === filter);

  return (
    <div className="space-y-3">
      {/* Filter */}
      <div className="flex gap-2">
        {[["all", "အားလုံး"], ["morning", "မနက်"], ["evening", "ညနေ"]].map(([v, label]) => (
          <button
            key={v}
            onClick={() => setFilter(v)}
            className={`flex-1 py-1.5 rounded-lg text-xs font-medium ${filter === v ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-600"}`}
          >
            {label}
          </button>
        ))}
      </div>

      {loading && <p className="text-center text-gray-400 py-6">Loading...</p>}
      {!loading && filtered.length === 0 && (
        <p className="text-center text-gray-400 py-8">မှတ်တမ်း မရှိသေးပါ</p>
      )}

      {filtered.map((bet) => {
        const nums  = Array.isArray(bet.numbers) ? bet.numbers : JSON.parse(bet.numbers || "[]");
        const isWon = bet.status === "won";
        const isLost = bet.status === "lost";
        return (
          <div key={bet.id} className="border border-gray-200 rounded-xl p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                  isWon ? "bg-green-100 text-green-700" :
                  isLost ? "bg-red-100 text-red-700" :
                  "bg-yellow-100 text-yellow-700"
                }`}>
                  {isWon ? "နိုင်" : isLost ? "ရှုံး" : "စောင့်ဆိုင်း"}
                </span>
                <span className="ml-2 text-xs text-gray-500">
                  {bet.session === "morning" ? "မနက်" : "ညနေ"} · {bet.bet_date}
                </span>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-gray-800">{Number(bet.total_amount).toLocaleString()} ကျပ်</p>
                <p className="text-xs text-gray-400">{nums.length} နံပါတ် × {Number(bet.amount).toLocaleString()}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {nums.map((n) => (
                <span key={n} className={`px-2 py-0.5 rounded text-xs font-bold ${isWon ? "bg-green-500 text-white" : "bg-blue-100 text-blue-800"}`}>
                  {n}
                </span>
              ))}
            </div>
            {isWon && bet.win_amount && (
              <p className="mt-2 text-sm font-bold text-green-600">
                🏆 ရငွေ: {Number(bet.win_amount).toLocaleString()} ကျပ်
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default History2D;
