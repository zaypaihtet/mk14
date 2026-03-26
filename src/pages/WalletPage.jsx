import { useEffect, useState } from "react";
import BottomNavigation from "../components/BottomNavigation";
import Header from "../components/Header";
import { Link, useNavigate } from "react-router";
import { api, isLoggedIn } from "../utils/api";

const WalletPage = () => {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    if (!isLoggedIn()) { navigate("/login"); return; }
    api.getBalance().then((d) => setBalance(d.balance)).catch(() => {});
    api.getTransactions().then((d) => setTransactions(d)).catch(() => {});
  }, []);

  return (
    <div className="w-full bg-blue-50 min-h-screen pb-20">
      <Header />
      <div className="m-3">
        <div className="flex justify-between p-3 border border-gray-300 bg-blue-400 rounded-lg">
          <span>လက်ကျန်ငွေ</span>
          <div className="flex items-center space-x-2 cursor-pointer">
            <img src="/images/balance.png" alt="" className="size-6" />
            <p>{Number(balance).toLocaleString()} ကျပ်</p>
          </div>
        </div>
        <ul className="w-[95%] max-w-[500px] mx-auto mt-6 flex items-center justify-center">
          <li className="mr-2 cursor-pointer w-[120px]">
            <div className="group p-1 pb-2 rounded-lg text-[14px] mb-2 bg-[#00b438] border-solid hover:bg-slate-500 duration-300">
              <button onClick={() => navigate("/wallet-deposit")}>
                <img src="/images/deposit.png" alt="" className="w-full rounded-md mx-auto" />
                <p className="mb-0 text-center mt-2 text-white">ငွေဖြည့်မည်</p>
              </button>
            </div>
          </li>
          <li className="mr-2 cursor-pointer w-[120px]">
            <div className="group p-1 pb-2 rounded-lg text-[14px] mb-2 bg-[#ff0098] border-solid hover:bg-slate-500 duration-300">
              <button onClick={() => navigate("/wallet-withdraw-form")}>
                <img src="/images/withdraw.png" alt="" className="w-full rounded-md mx-auto" />
                <p className="mb-0 text-center mt-2 text-white">ငွေထုတ်မည်</p>
              </button>
            </div>
          </li>
        </ul>

        <div className="mx-auto mt-4 bg-white rounded-lg shadow overflow-hidden">
          <p className="bg-blue-400 text-center p-3 font-medium">ငွေသွင်း/ ငွေထုတ် မှတ်တမ်း</p>
          {transactions.length === 0 ? (
            <p className="text-center text-gray-500 p-6">မှတ်တမ်း မရှိသေးပါ</p>
          ) : (
            <div className="divide-y">
              {transactions.slice(0, 10).map((tx) => (
                <div key={`${tx.type}-${tx.id}`} className="flex justify-between items-center px-4 py-3 text-sm">
                  <div>
                    <p className="font-medium">{tx.type === "deposit" ? "ငွေဖြည့်" : "ငွေထုတ်"} - {tx.method}</p>
                    <p className="text-gray-500">{new Date(tx.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className={tx.type === "deposit" ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                      {tx.type === "deposit" ? "+" : "-"}{Number(tx.amount).toLocaleString()} ကျပ်
                    </p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      tx.status === "approved" ? "bg-green-100 text-green-700" :
                      tx.status === "rejected" ? "bg-red-100 text-red-700" :
                      "bg-yellow-100 text-yellow-700"
                    }`}>{tx.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mx-auto mt-6 bg-blue-400 p-6 rounded-lg text-[13px] mb-2 text-[var(--accent-color)]">
          <h5 className="text-center text-[14px] mb-0">ငွေသွင်း/ ငွေထုတ် ဝန်ဆောင်မှုအချိန်</h5>
          <hr className="my-2 text-white" />
          <p className="mb-0 text-center">နေ့စဥ် 24 နာရီ ဝန်ဆောင်မှုပေးပါသည်။</p>
        </div>
      </div>
      <BottomNavigation />
    </div>
  );
};

export default WalletPage;
