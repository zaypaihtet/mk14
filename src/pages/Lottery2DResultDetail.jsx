import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Lottery2DResultDetail = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const latest = results[0] ?? null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 to-blue-400 pb-24">
      {/* Header */}
      <div className="bg-blue-700 text-white px-4 py-4 flex items-center gap-3">
        <Link to="/" className="p-1">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <h1 className="text-lg font-bold">Myanmar 2D ရလဒ်များ</h1>
      </div>

      {loading && (
        <div className="text-white text-center py-16 text-lg animate-pulse">Loading...</div>
      )}

      {error && (
        <div className="text-white text-center py-16">{error}</div>
      )}

      {/* Latest result hero */}
      {latest && !loading && (
        <div className="text-center py-8 px-4">
          <p className="text-blue-200 text-sm mb-1">{latest.date} — နောက်ဆုံးထွက်ဂဏန်း</p>
          <div className="text-9xl font-bold text-white drop-shadow-lg tracking-widest">
            {latest.result_430 && latest.result_430 !== "--"
              ? latest.result_430
              : latest.result_300 && latest.result_300 !== "--"
              ? latest.result_300
              : latest.result_1200 && latest.result_1200 !== "--"
              ? latest.result_1200
              : latest.result_1100 ?? "--"}
          </div>
        </div>
      )}

      {/* Result list */}
      {!loading && results.length > 0 && (
        <div className="px-4 space-y-3">
          {results.map((r) => (
            <div key={r.id} className="bg-white/90 backdrop-blur rounded-2xl p-4 shadow">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{r.date}</span>
              </div>
              <div className="grid grid-cols-4 gap-2 text-center">
                <ResultCell label="11:00 AM" number={r.result_1100} set={r.set_1100} val={r.val_1100} />
                <ResultCell label="12:00 PM" number={r.result_1200} set={r.set_1200} val={r.val_1200} />
                <ResultCell label="3:00 PM" number={r.result_300} set={r.set_300} val={r.val_300} />
                <ResultCell label="4:30 PM" number={r.result_430} set={r.set_430} val={r.val_430} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const ResultCell = ({ label, number, set, val }) => {
  const active = number && number !== "--";
  return (
    <div className={`rounded-xl p-2 ${active ? "bg-blue-600" : "bg-gray-100"}`}>
      <p className={`text-xs font-medium mb-1 ${active ? "text-blue-100" : "text-gray-400"}`}>{label}</p>
      <p className={`text-xl font-bold ${active ? "text-white" : "text-gray-300"}`}>{active ? number : "--"}</p>
      {active && set && (
        <p className="text-[10px] text-blue-200 truncate">{set}</p>
      )}
    </div>
  );
};

export default Lottery2DResultDetail;
