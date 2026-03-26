import React, { useState } from "react";
import Header from "../components/Header";
import { CircleDollarSign, CheckCircle2 } from "lucide-react";
import DepositHeader from "../components/DepositHeader";
import BottomNavigation from "../components/BottomNavigation";
import { useNavigate } from "react-router";

const DepositPage = () => {
  const [selected, setSelected] = useState(null);
  const [amount, setAmount] = useState("");
  const navigate = useNavigate();

  const handleSelect = (option) => {
    setSelected(option);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selected) {
      alert("ကျေးဇူးပြု၍ ငွေလွှဲနည်းရွေးပါ");
      return;
    }

    if (!amount) {
      alert("ကျေးဇူးပြု၍ ငွေပမာဏ ထည့်ပါ");
      return;
    }

    navigate("/wallet-deposit-form", {
      state: { method: selected, amount },
    });
  };

  return (
    <div className="min-h-screen bg-gray-200 flex justify-center">
      <div className="w-full bg-blue-50 min-h-screen pb-20">
        <Header />
        <DepositHeader />

        {/* Payment Options */}
        <ul className="w-[95%] max-w-[500px] mx-auto mt-6 flex items-center justify-center">
          {/* Wave Money */}
          <li
            className="mr-2 cursor-pointer w-[100px] relative"
            onClick={() => handleSelect("wavemoney")}
          >
            <div
              className={`group p-1 pb-2 mb-2 rounded-md border-2 ${
                selected === "wavemoney"
                  ? "border-blue-500"
                  : "border-transparent"
              }`}
            >
              <img
                src="/images/wavemoney.jpg"
                alt="Wave Money"
                className="w-full rounded-md mx-auto"
              />
            </div>
            {selected === "wavemoney" && (
              <CheckCircle2 className="absolute top-1 right-1 text-blue-600 bg-white rounded-full" />
            )}
          </li>

          {/* KPay */}
          <li
            className="mr-2 cursor-pointer w-[100px] relative"
            onClick={() => handleSelect("kpay")}
          >
            <div
              className={`group p-1 pb-2 mb-2 rounded-md border-2 ${
                selected === "kpay" ? "border-blue-500" : "border-transparent"
              }`}
            >
              <img
                src="/images/kpay.jpg"
                alt="KPay"
                className="w-full rounded-md mx-auto"
              />
            </div>
            {selected === "kpay" && (
              <CheckCircle2 className="absolute top-1 right-1 text-blue-600 bg-white rounded-full" />
            )}
          </li>
        </ul>

        {/* Deposit Form */}
        <div className="m-2">
          <form onSubmit={handleSubmit}>
            <label className="block mb-2 text-sm font-medium text-gray-900">
              ငွေပမာဏ
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 top-0 flex items-center ps-3.5 pointer-events-none">
                <CircleDollarSign className="size-5 text-gray-700" />
              </div>
              <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="ငွေပမာဏ"
                required
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                  focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5"
              />
            </div>
            <button
              type="submit"
              className="w-full mt-2 text-white bg-blue-700 hover:bg-blue-800 
                focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg 
                text-sm px-5 py-2.5 text-center"
            >
              ရှေ့ဆက်ရန်
            </button>
          </form>
        </div>

        <BottomNavigation />
      </div>
    </div>
  );
};

export default DepositPage;
