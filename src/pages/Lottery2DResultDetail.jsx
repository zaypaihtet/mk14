import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import LotteryResultHeader from "../components/Lottery2DResultHeader";
import LotteryPageLayout from "../components/LotteryPageLayout";

const Lottery2DResultDetail = () => {
  return (
    <LotteryPageLayout>
      <LotteryResultHeader />

      {/* Main Winning Number */}
      <div className="relative z-10 text-center mb-6">
        <div className="text-8xl font-bold text-blue-100 drop-shadow-lg mb-2">
          86
        </div>
        <div className="text-white text-sm">
          1-09-2025, 3:25:41 PM (၁ ရက်နေ့)
        </div>
      </div>

      {/* Recent Results */}
      <div className="relative z-10 px-4 space-y-3">
        {/* Today's Result */}
        <div className="flex items-center justify-between bg-blue-300 p-4 rounded shadow-lg">
          <div>
            <div className="text-2xl font-bold text-white mb-2">86</div>
            <div className="text-sm text-white">28-08-2025</div>
            <div className="text-xs text-white/80">
              လက်ရှိ - 56, 58, 68, 65, 86, 86, 66
            </div>
          </div>
          <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            ၂၈ ရက်နေ့
          </div>
        </div>

        {/* Yesterday's Result */}
        <div className="flex items-center justify-between bg-blue-300 p-4 rounded shadow-lg">
          <div>
            <div className="text-2xl font-bold text-white mb-2">52</div>
            <div className="text-sm text-white">27-08-2025</div>
            <div className="text-xs text-white/80">
              လက်ရှိ - 56, 58, 68, 65, 86, 86, 66
            </div>
          </div>
          <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            ၂၇ ရက်နေ့
          </div>
        </div>

        {/* Another Previous Result */}
        <div className="flex items-center justify-between bg-blue-300 p-4 rounded shadow-lg">
          <div>
            <div className="text-2xl font-bold text-white mb-2">34</div>
            <div className="text-sm text-white">26-07-2025</div>
            <div className="text-xs text-white/80">
              လက်ရှိ - 56, 58, 68, 65, 86, 86, 66
            </div>
          </div>
          <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            ၂၆ ရက်နေ့
          </div>
        </div>
      </div>
    </LotteryPageLayout>
  );
};

export default Lottery2DResultDetail;
