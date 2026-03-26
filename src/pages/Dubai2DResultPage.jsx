import React from "react";
import Header from "../components/Header";
import LotteryResultHeader from "../components/Lottery2DResultHeader";
import { Clock, HistoryIcon } from "lucide-react";
import { Link } from "react-router";
import LotteryPageLayout from "../components/LotteryPageLayout";

const Dubai2DResultPage = () => {
  const times = [
    "11:00 AM",
    "1:00 PM",
    "3:00 PM",
    "5:00 PM",
    "7:00 PM",
    "9:00 PM",
  ];
  return (
    <LotteryPageLayout>
      <LotteryResultHeader />
      <div>
        <h3 className=" text-white flex items-center justify-center gap-1">
          <Clock size={22} />
          ထီထိုးမည့်အချိန်ကိုရွေးပါ
        </h3>
        <div className=" flex flex-col gap-3 m-3">
          {times.map((time, index) => (
            <Link
              key={index}
              to={`/lottery-two-d-betting`}
              className=" bg-white text-black flex items-center justify-center p-3 rounded-md font-semibold"
            >
              {time}
            </Link>
          ))}
        </div>
      </div>
    </LotteryPageLayout>
  );
};

export default Dubai2DResultPage;
