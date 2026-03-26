import React, { useEffect, useState } from "react";
import { Trophy } from "lucide-react";
import { api } from "../utils/api";

const maskName = (name = "") => {
  if (name.length <= 2) return name;
  return name[0] + "*".repeat(name.length - 2) + name[name.length - 1];
};

const Winners2DSection = () => {
  const [winners, setWinners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getWinners2D()
      .then(setWinners)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;
  if (winners.length === 0) return null;

  return (
    <div className="bg-gradient-to-br from-yellow-400 to-orange-400 rounded-2xl p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <Trophy className="h-5 w-5 text-white" />
        <h2 className="text-white font-bold text-base">2D Winner များ</h2>
      </div>

      <div className="space-y-2">
        {winners.slice(0, 8).map((w) => {
          const nums = Array.isArray(w.numbers) ? w.numbers : JSON.parse(w.numbers || "[]");
          const sessionLabel = w.session === "morning" ? "မနက်" : "ညနေ";
          return (
            <div key={w.id} className="bg-white/20 backdrop-blur-sm rounded-xl px-3 py-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="bg-white text-orange-500 font-black text-sm rounded-lg w-8 h-8 flex items-center justify-center shadow">
                  {w.result_number || nums[0]}
                </span>
                <div>
                  <p className="text-white font-semibold text-sm">{maskName(w.name)}</p>
                  <p className="text-yellow-100 text-xs">{w.bet_date} · {sessionLabel}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white font-bold text-sm">{Number(w.win_amount).toLocaleString()}</p>
                <p className="text-yellow-100 text-xs">ကျပ်</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Winners2DSection;
