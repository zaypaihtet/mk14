import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { apiFetch } from "../utils/api";

const useLive2D = () => {
  const [liveData, setLiveData] = useState(null);
  useEffect(() => {
    const fetchLive = async () => {
      try {
        const res = await apiFetch("/api/lottery/live/2d");
        if (res.ok) setLiveData(await res.json());
      } catch {}
    };
    fetchLive();
    const id = setInterval(fetchLive, 30000); // refresh every 30s
    return () => clearInterval(id);
  }, []);
  return liveData;
};

const useAppConfig = () => {
  const [config, setConfig] = useState({});
  useEffect(() => {
    apiFetch("/api/config")
      .then((r) => r.json())
      .then(setConfig)
      .catch(() => {});
  }, []);
  return config;
};

// Format result number: pad to 2 digits or show "--"
const fmt = (val) => {
  if (val === "--" || val === null || val === undefined) return "--";
  const n = Number(val);
  if (isNaN(n)) return "--";
  return String(n).padStart(2, "0");
};

/* Myanmar 2D card showing both morning (12:00) and evening (4:30) sessions */
const MM2DCard = ({ data }) => {
  const r1200 = fmt(data?.result_1200);
  const r430  = fmt(data?.result_430);
  const s1200 = data?.set_1200 ?? null;
  const v1200 = data?.val_1200 ?? null;
  const s430  = data?.set_430  ?? null;
  const v430  = data?.val_430  ?? null;
  const date  = data?.date ?? null;

  return (
    <div className="bg-blue-300 rounded-xl p-4 mb-4 shadow-lg col-span-2">
      <div className="flex justify-center mb-2">
        <img
          src="https://happy2d.com/static/media/mm_2d.47467f4e22ac93c09d7e.png"
          alt="Myanmar 2D"
          className="h-10 w-auto"
        />
      </div>
      <h3 className="text-sm font-semibold text-center mb-3">Myanmar 2D</h3>

      {date && (
        <p className="text-center text-[11px] text-gray-600 mb-2">{date}</p>
      )}

      {/* Two session columns */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        {/* Morning 12:00 */}
        <div className="bg-white/60 rounded-xl p-3 text-center">
          <p className="text-[11px] font-semibold text-gray-600 mb-1">မနက် ၁၂:၀၀</p>
          <div className={`text-3xl font-black tracking-widest ${r1200 === "--" ? "text-gray-400" : "text-blue-900"}`}>
            {r1200}
          </div>
          {s1200 && v1200 && r1200 !== "--" && (
            <div className="mt-1 text-[10px] text-gray-600 space-y-0.5">
              <div>Set: <b>{s1200}</b></div>
              <div>Val: <b>{v1200}</b></div>
            </div>
          )}
        </div>

        {/* Evening 4:30 */}
        {(() => {
          const liveNum = data?.live ? fmt(data.live) : "--";
          // Only show live on 4:30 card after 12:00 result is finalised
          const isLive  = r430 === "--" && liveNum !== "--" && r1200 !== "--";
          const display = r430 !== "--" ? r430 : liveNum;
          return (
            <div className={`rounded-xl p-3 text-center ${r430 !== "--" ? "bg-white/60" : isLive ? "bg-orange-100" : "bg-white/60"}`}>
              <div className="flex items-center justify-center gap-1 mb-1">
                {isLive && (
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500" />
                  </span>
                )}
                <p className={`text-[11px] font-semibold ${isLive ? "text-orange-600" : "text-gray-600"}`}>
                  {isLive ? "LIVE · ၄:၃၀" : "ညနေ ၄:၃၀"}
                </p>
              </div>
              <div className={`text-3xl font-black tracking-widest ${
                r430 !== "--" ? "text-blue-900" : isLive ? "text-orange-500" : "text-gray-400"
              } ${isLive ? "animate-pulse" : ""}`}>
                {display}
              </div>
              {r430 !== "--" && s430 && (
                <div className="mt-1 text-[10px] text-gray-600 space-y-0.5">
                  <div>Set: <b>{s430}</b></div>
                  <div>Val: <b>{v430}</b></div>
                </div>
              )}
              {isLive && data?.live_set && (
                <div className="mt-1 text-[10px] text-orange-500 space-y-0.5">
                  <div>Set: <b>{data.live_set}</b></div>
                  <div>Val: <b>{data.live_val}</b></div>
                </div>
              )}
            </div>
          );
        })()}
      </div>

      <div className="flex gap-2">
        <Link
          to="/lottery-2d-result-detail"
          className="flex-1 text-center text-xs py-2 rounded-lg bg-white/60 text-blue-900 font-medium hover:bg-white/80 transition-colors"
        >
          ရလဒ်
        </Link>
        <Link
          to="/lottery-two-d-betting"
          className="flex-1 text-center text-xs py-2 rounded-lg bg-blue-700 text-white font-bold hover:bg-blue-800 transition-colors"
        >
          ထိုးရန်
        </Link>
      </div>
    </div>
  );
};

/* Myanmar 3D — simple card */
const BettingCard = ({ title, logoUrl, resultPath, betPath }) => (
  <div className="bg-blue-300 rounded-xl p-4 mb-4 shadow-lg">
    <div className="text-center">
      <div className="flex justify-center mb-2">
        <img src={logoUrl} alt={`${title} Logo`} className="h-10 w-auto" />
      </div>
      <h3 className="text-sm font-semibold mb-3">{title}</h3>
    </div>
    <div className="flex gap-2 mt-2">
      {resultPath && (
        <Link
          to={resultPath}
          className="flex-1 text-center text-xs py-1.5 rounded-lg bg-white/60 text-blue-900 font-medium hover:bg-white/80 transition-colors"
        >
          ရလဒ်
        </Link>
      )}
      {betPath && (
        <Link
          to={betPath}
          className="flex-1 text-center text-xs py-1.5 rounded-lg bg-blue-700 text-white font-bold hover:bg-blue-800 transition-colors"
        >
          ထိုးရန်
        </Link>
      )}
    </div>
  </div>
);

/* Result-only card (Dubai, Mega — no betting) */
const ResultCard = ({ title, logoUrl, resultPath }) => (
  <Link to={resultPath}>
    <div className="bg-blue-300 rounded-xl p-4 mb-4 shadow-lg text-center">
      <div className="flex justify-center mb-2">
        <img src={logoUrl} alt={`${title} Logo`} className="h-10 w-auto" />
      </div>
      <h3 className="text-sm font-semibold">{title}</h3>
    </div>
  </Link>
);

const LotteryResults = () => {
  const live   = useLive2D();
  const config = useAppConfig();

  const apiData = live?.data ?? null;

  const showDubai2D = config.show_dubai_2d !== "false";
  const showDubai3D = config.show_dubai_3d !== "false";
  const showMega2D  = config.show_mega_2d  !== "false";

  return (
    <section className="px-4 py-6">
      <h2 className="text-xl font-bold text-center mb-6 text-gray-800">
        နောက်ဆုံးထွက် နှစ်လုံးထီဂဏန်းများ
      </h2>

      {/* Myanmar 2D — full-width with both sessions */}
      <div className="grid grid-cols-2 gap-4">
        <MM2DCard data={apiData} />
      </div>

      {/* Myanmar 3D */}
      <div className="grid grid-cols-2 gap-4">
        <BettingCard
          title="Myanmar 3D"
          logoUrl="https://happy2d.com/static/media/mm_3d.3e7a8086638b55524ad4.png"
          resultPath="/lottery-3d-result-detail"
          betPath="/lottery-three-d-betting"
        />
        <div />
      </div>

      {/* Dubai 2D + Dubai 3D */}
      {(showDubai2D || showDubai3D) && (
        <div className="grid grid-cols-2 gap-4">
          {showDubai2D && (
            <ResultCard
              title="Dubai 2D"
              logoUrl="https://happy2d.com/static/media/dubai_2d.0190127030ca34a17e7e.png"
              resultPath="/dubai-2d-result"
            />
          )}
          {showDubai3D && (
            <ResultCard
              title="Dubai 3D"
              logoUrl="https://happy2d.com/static/media/shwe_2d.9a41783662c55d81c7b5.png"
              resultPath="/dubai-3d-result"
            />
          )}
        </div>
      )}

      {/* Mega 2D */}
      {showMega2D && (
        <div className="grid grid-cols-2 gap-4">
          <ResultCard
            title="Mega 2D"
            logoUrl="https://happy2d.com/static/media/dubai_2d.0190127030ca34a17e7e.png"
            resultPath="/lottery-2d-result-detail"
          />
          <div />
        </div>
      )}
    </section>
  );
};

export default LotteryResults;
