import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const useLive2D = () => {
  const [liveData, setLiveData] = useState(null);

  useEffect(() => {
    const fetchLive = async () => {
      try {
        const res = await fetch("/api/lottery/live/2d");
        if (res.ok) {
          const data = await res.json();
          setLiveData(data);
        }
      } catch {
        // silent — keep showing last value
      }
    };

    fetchLive();
    const interval = setInterval(fetchLive, 1000);
    return () => clearInterval(interval);
  }, []);

  return liveData;
};

const LotteryGameCard = ({ title, logoUrl, liveNumber, liveSet, liveValue }) => {
  return (
    <div className="bg-blue-300 rounded-xl p-4 mb-4 shadow-lg">
      <div className="text-center">
        <div className="flex justify-center mb-2">
          <img src={logoUrl} alt={`${title} Logo`} className="h-10 w-auto" />
        </div>
        <h3 className="text-sm font-semibold mb-1">{title}</h3>
        {liveNumber !== undefined && (
          <div className="mt-1">
            <div className="text-2xl font-bold text-blue-900 tracking-widest">
              {liveNumber !== null ? liveNumber : "--"}
            </div>
            {(liveSet || liveValue) && (
              <div className="flex justify-center gap-3 mt-1 text-xs text-gray-700">
                {liveSet && <span>Set: <b>{liveSet}</b></span>}
                {liveValue && <span>Val: <b>{liveValue}</b></span>}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const LotteryResults = () => {
  const live = useLive2D();

  const twodNumber = live?.data?.live     ?? null;
  const twodSet    = live?.data?.live_set ?? null;
  const twodValue  = live?.data?.live_val ?? null;

  return (
    <section className="px-4 py-6">
      <h2 className="text-xl font-bold text-center mb-6 text-gray-800">
        နောက်ဆုံးထွက် နှစ်လုံးထီဂဏန်းများ
      </h2>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Link to="/lottery-2d-result-detail">
            <LotteryGameCard
              title="Myanmar 2D"
              logoUrl="https://happy2d.com/static/media/mm_2d.47467f4e22ac93c09d7e.png"
              liveNumber={twodNumber}
              liveSet={twodSet}
              liveValue={twodValue}
            />
          </Link>
        </div>
        <div>
          <Link to="/lottery-3d-result-detail">
            <LotteryGameCard
              title="Myanmar 3D"
              logoUrl="https://happy2d.com/static/media/mm_3d.3e7a8086638b55524ad4.png"
            />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Link to="/dubai-2d-result">
          <LotteryGameCard
            title="Dubai 2D"
            logoUrl="https://happy2d.com/static/media/dubai_2d.0190127030ca34a17e7e.png"
          />
        </Link>
        <Link to="/dubai-3d-result">
          <LotteryGameCard
            title="Dubai 3D"
            logoUrl="https://happy2d.com/static/media/shwe_2d.9a41783662c55d81c7b5.png"
          />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Link to="/lottery-2d-result-detail">
          <LotteryGameCard
            title="Mega 2D"
            logoUrl="https://happy2d.com/static/media/dubai_2d.0190127030ca34a17e7e.png"
          />
        </Link>
        <div></div>
      </div>
    </section>
  );
};

export default LotteryResults;
