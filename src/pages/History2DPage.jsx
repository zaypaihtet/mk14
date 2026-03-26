import React, { useState } from "react";

import History2D from "../components/history/History2D";
import LotteryHistory2D from "../components/history/LotteryHistory2D";
import { Link } from "react-router";

const History2DPage = () => {
  const [activeTab, setActiveTab] = useState("history");

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-[500px] mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <nav className="flex items-center justify-between bg-blue-400 p-3 mb-4">
          <Link to="/lottery-2d-result-detail" className="mr-2 p-1 rounded-full hover:bg-gray-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
          <p className="font-medium">မှတ်တမ်းများ</p>
        </nav>

        {/* Tabs */}
        <div className="flex m-2 ">
          <button
            className={`flex-1 py-3 text-center text-sm ${
              activeTab === "history"
                ? "bg-blue-500 text-white font-semibold"
                : "bg-gray-100 text-gray-700"
            }`}
            onClick={() => setActiveTab("history")}
          >
            မှတ်တမ်း
          </button>
          <button
            className={`flex-1 py-3 text-center text-sm ${
              activeTab === "lottery_history"
                ? "bg-blue-500 text-white font-semibold"
                : "bg-gray-100 text-gray-700"
            }`}
            onClick={() => setActiveTab("lottery_history")}
          >
            ထီမှတ်တမ်း
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {activeTab === "history" && <History2D />}

          {/* Results Section */}
          {activeTab === "lottery_history" && <LotteryHistory2D />}
        </div>
      </div>
    </div>
  );
};

export default History2DPage;
