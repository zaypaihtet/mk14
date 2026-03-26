import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

// Pad number to 2 digits or return "--"
const fmt = (val) => {
  if (val === "--" || val === null || val === undefined || val === "") return "--";
  const n = Number(val);
  if (isNaN(n)) return "--";
  return String(n).padStart(2, "0");
};

// Format date: "2026-03-25" → "25 Mar 2026"
const fmtDate = (d = "") => {
  if (!d) return d;
  const [y, m, day] = d.split("-");
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${day} ${months[Number(m) - 1]} ${y}`;
};

const Lottery2DResultDetail = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    fetch("/api/lottery/history/2d-external")
      .then((r) => r.json())
      .then((data) => {
        if (data?.data && Array.isArray(data.data)) {
          setResults(data.data);
        } else {
          setError("ဒေတာ မရရှိနိုင်ပါ");
        }
      })
      .catch(() => setError("ဆာဗာ ချိတ်ဆက်မှု မအောင်မြင်ပါ"))
      .finally(() => setLoading(false));
  }, []);

  // Limit to 7 days
  const week = results.slice(0, 7);
  const latest = week[0] ?? null;

  // Hero number: prefer 4:30, else 12:00
  const heroNum = latest
    ? (fmt(latest.result_430) !== "--" ? fmt(latest.result_430) : fmt(latest.result_1200))
    : "--";

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-700 to-blue-500 pb-24">
      {/* Header */}
      <div className="bg-blue-800 text-white px-4 py-4 flex items-center gap-3">
        <Link to="/" className="p-1">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <h1 className="text-lg font-bold">Myanmar 2D ရလဒ်မှတ်တမ်း</h1>
      </div>

      {loading && (
        <div className="text-white text-center py-16 text-lg animate-pulse">Loading...</div>
      )}

      {error && (
        <div className="text-white text-center py-16">{error}</div>
      )}

      {/* Hero — latest result */}
      {latest && !loading && (
        <div className="text-center py-8 px-4">
          <p className="text-blue-200 text-sm mb-1">
            {fmtDate(latest.date)} — နောက်ဆုံးထွက်ဂဏန်း
          </p>
          <div className="text-8xl font-black text-white drop-shadow-lg tracking-widest leading-none">
            {heroNum}
          </div>
        </div>
      )}

      {/* Weekly result table */}
      {!loading && week.length > 0 && (
        <div className="px-4 space-y-3">

          {/* Column headers */}
          <div className="grid grid-cols-3 text-center text-xs font-bold text-blue-100 uppercase tracking-wider px-2">
            <span className="text-left">ရက်စွဲ</span>
            <span>မနက် ၁၂:၀၀</span>
            <span>ညနေ ၄:၃၀</span>
          </div>

          {week.map((r) => {
            const r12 = fmt(r.result_1200);
            const r43 = fmt(r.result_430);
            return (
              <div key={r.id} className="bg-white/95 backdrop-blur rounded-2xl p-4 shadow-lg">
                {/* Date row */}
                <p className="text-xs font-semibold text-gray-500 mb-3">{fmtDate(r.date)}</p>

                {/* Two result columns */}
                <div className="grid grid-cols-2 gap-3">
                  {/* 12:00 PM */}
                  <div className={`rounded-xl p-3 text-center ${r12 !== "--" ? "bg-blue-600" : "bg-gray-100"}`}>
                    <p className={`text-[11px] font-semibold mb-1 ${r12 !== "--" ? "text-blue-100" : "text-gray-400"}`}>
                      မနက် ၁၂:၀၀
                    </p>
                    <p className={`text-3xl font-black tracking-widest ${r12 !== "--" ? "text-white" : "text-gray-300"}`}>
                      {r12}
                    </p>
                    {r12 !== "--" && r.set_1200 && (
                      <div className="mt-1 text-[10px] text-blue-200 space-y-0.5">
                        <div>Set: {r.set_1200}</div>
                        <div>Val: {r.val_1200}</div>
                      </div>
                    )}
                  </div>

                  {/* 4:30 PM */}
                  <div className={`rounded-xl p-3 text-center ${r43 !== "--" ? "bg-orange-500" : "bg-gray-100"}`}>
                    <p className={`text-[11px] font-semibold mb-1 ${r43 !== "--" ? "text-orange-100" : "text-gray-400"}`}>
                      ညနေ ၄:၃၀
                    </p>
                    <p className={`text-3xl font-black tracking-widest ${r43 !== "--" ? "text-white" : "text-gray-300"}`}>
                      {r43}
                    </p>
                    {r43 !== "--" && r.set_430 && (
                      <div className="mt-1 text-[10px] text-orange-200 space-y-0.5">
                        <div>Set: {r.set_430}</div>
                        <div>Val: {r.val_430}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Lottery2DResultDetail;
