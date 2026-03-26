import React from "react";
import Header from "./Header";
import { HistoryIcon, LucideHome } from "lucide-react";

const DepositHeader = () => {
  return (
    <div className="m-2 grid grid-flow-row grid-cols-2 my-2">
      <div className="flex justify-center items-center gap-2 pb-3 cursor-pointer border-r border-b-[3px] border-blue-400">
        <LucideHome className="size-6" />
        <p className="text-sm">ငွေဖြည့်မည်</p>
      </div>
      <div className="flex justify-center items-center gap-2 pb-3 cursor-pointer border-b-0 text-slate-600">
        <HistoryIcon className="size-6" />
        <p className=" text-sm">မှတ်တမ်း</p>
      </div>
    </div>
  );
};

export default DepositHeader;
