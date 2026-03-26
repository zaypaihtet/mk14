import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import LotteryPageLayout from "../components/LotteryPageLayout";
import Lottery3DResultHeader from "../components/Lottery3DResultHeader";

const Lottery3DResultDetail = () => {
  return (
    <LotteryPageLayout>
      <Lottery3DResultHeader/>
      
          {/* Main Winning Number */}
          <div className="relative z-10 text-center mb-6">
            <div className="text-8xl font-bold text-blue-100 drop-shadow-lg mb-2">
              865
            </div>
            <div className="text-white text-sm">
              16-08-2025, 3:25:41 PM (၁၆ ရက်နေ့)
            </div>
          </div>

          {/* Recent Results */}
          <div className="relative z-10 px-4 space-y-3">
            {/* Today's Result */}
            <div className="flex items-center justify-between bg-blue-300 p-4 rounded shadow-lg">
              <div>
                <div className="text-2xl font-bold text-white mb-2">865</div>
                <div className="text-sm text-white">16-08-2025</div>
                <div className="text-xs text-white/80">
                  လက်ရုံ - 568, 586, 658, 685, 856, 864, 866
                </div>
              </div>
              <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                ၁၆ ရက်နေ့
              </div>
            </div>

            {/* Yesterday's Result */}
            <div className="flex items-center justify-between bg-blue-300 p-4 rounded shadow-lg">
              <div>
                <div className="text-2xl font-bold text-white mb-2">852</div>
                <div className="text-sm text-white">01-08-2025</div>
                <div className="text-xs text-white/80">
                  လက်ရုံ - 258, 285, 528, 582, 825, 851, 853
                </div>
              </div>
              <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                ၁ ရက်နေ့
              </div>
            </div>

            {/* Another Previous Result */}
            <div className="flex items-center justify-between bg-blue-300 p-4 rounded shadow-lg">
              <div>
                <div className="text-2xl font-bold text-white mb-2">324</div>
                <div className="text-sm text-white">16-07-2025</div>
              </div>
              <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                ၁၆ ရက်နေ့
              </div>
            </div>
          </div>
    </LotteryPageLayout>
  );
};

export default Lottery3DResultDetail;
