import { useEffect, useState } from "react";
import { ArrowLeft, Calendar, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import LotteryPageLayout from "../components/LotteryPageLayout";
import { api } from "../utils/api";

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const day   = d.getUTCDate();
  const month = d.toLocaleString("en-US", { month: "short", timeZone: "UTC" });
  const year  = d.getUTCFullYear();
  return `${String(day).padStart(2, "0")}-${month}-${year}`;
};

const dayBadge = (dateStr) => {
  if (!dateStr) return "";
  const day = new Date(dateStr).getUTCDate();
  return day <= 1 ? "၁ ရက်နေ့" : "၁၆ ရက်နေ့";
};

const badgeColor = (dateStr) => {
  const day = new Date(dateStr).getUTCDate();
  return day <= 1 ? "bg-orange-500" : "bg-blue-500";
};

const Lottery3DResultDetail = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getResults3D()
      .then((data) => setResults(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const latest = results[0];

  return (
    <LotteryPageLayout>
      {/* Back button */}
      <div className="px-4 pt-2">
        <Link to="/">
          <button className="p-2 rounded hover:bg-white/20 text-white">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </Link>
      </div>

      {loading ? (
        <div className="text-center text-white/70 py-16">Loading...</div>
      ) : results.length === 0 ? (
        <div className="text-center text-white/70 py-16">
          <Trophy className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p>မြန်မာ ၃D ရလဒ် မရှိသေးပါ</p>
        </div>
      ) : (
        <>
          {/* Hero — latest result */}
          <div className="relative z-10 text-center mb-6 px-4">
            <div className="text-[88px] font-extrabold text-white drop-shadow-lg leading-none mb-1 tracking-widest">
              {latest.result_number}
            </div>
            <div className="flex items-center justify-center gap-2 text-white/80 text-sm">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(latest.result_date)}</span>
              <span className={`${badgeColor(latest.result_date)} text-white text-xs px-2 py-0.5 rounded-full`}>
                {dayBadge(latest.result_date)}
              </span>
            </div>
          </div>

          {/* Result list */}
          <div className="relative z-10 px-4 space-y-3 pb-4">
            <p className="text-white/60 text-xs font-medium uppercase tracking-wider mb-2">လွန်ခဲ့သော ရလဒ်များ</p>
            {results.map((item, i) => (
              <div
                key={item.id}
                className={`flex items-center justify-between p-4 rounded-xl shadow-lg ${
                  i === 0 ? "bg-white/25 border border-white/30" : "bg-blue-400/60"
                }`}
              >
                <div>
                  <div className="text-3xl font-bold text-white tracking-widest mb-1">
                    {item.result_number}
                  </div>
                  <div className="text-sm text-white/80 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(item.result_date)}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`${badgeColor(item.result_date)} text-white text-xs px-3 py-1 rounded-full font-medium`}>
                    {dayBadge(item.result_date)}
                  </span>
                  {i === 0 && (
                    <span className="bg-yellow-400 text-yellow-900 text-[10px] px-2 py-0.5 rounded-full font-bold">
                      နောက်ဆုံး
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </LotteryPageLayout>
  );
};

export default Lottery3DResultDetail;
