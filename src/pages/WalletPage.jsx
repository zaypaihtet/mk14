import BottomNavigation from "../components/BottomNavigation";
import Header from "../components/Header";
import { Link, useNavigate } from "react-router";

const WalletPage = () => {
  const balance = 50000;
  const navigate = useNavigate();
  return (
    <div className="w-full bg-blue-50 min-h-screen pb-20">
      <Header />
      <div className="m-3">
        <div className="flex justify-between p-3 border border-gray-300 bg-blue-400 rounded-lg">
          <Link to="/wallet/balance">လက်ကျန်ငွေ</Link>
          <div className="flex items-center space-x-2 cursor-pointer">
            <img src="/images/balance.png" alt="" className="size-6" />
            <p>{balance} ကျပ်</p>
          </div>
        </div>
        <ul className="w-[95%] max-w-[500px] mx-auto mt-6 flex items-center justify-center">
          <li className="mr-2 cursor-pointer w-[120px]">
            <div className="group p-1 pb-2 rounded-lg text-[14px] mb-2 bg-[#00b438] border-solid hover:bg-slate-500 duration-300">
              <button onClick={() => navigate("/wallet-deposit")}>
                <img
                  src="/images/deposit.png"
                  alt=""
                  className="w-full rounded-md mx-auto"
                />
                <p className="mb-0 text-center mt-2 text-white ">ငွေဖြည့်မည်</p>
              </button>
            </div>
          </li>
          <li className="mr-2 cursor-pointer w-[120px]">
            <div className="group p-1 pb-2 rounded-lg text-[14px] mb-2 bg-[#ff0098] border-solid hover:bg-slate-500 duration-300">
              <button onClick={() => navigate("/wallet-withdraw-form")}>
                <img
                  src="/images/withdraw.png"
                  alt=""
                  className="w-full rounded-md mx-auto"
                />
                <p className="mb-0 text-center mt-2 text-white ">ငွေထုတ်မည်</p>
              </button>
            </div>
          </li>
        </ul>
        <p className="mt-2 bg-blue-400 w-full text-center p-3 rounded-lg cursor-pointer hover:bg-slate-500 duration-300">
          ငွေသွင်း/ ငွေထုတ် အခြေအနေ
        </p>
        <div className="mx-auto mt-6 bg-blue-400 p-6 rounded-lg text-[13px] mb-2 text-[var(--accent-color)]">
          <h5 className="text-center text-[14px] mb-0">
            ငွေသွင်း/ ငွေထုတ် ဝန်ဆောင်မှုအချိန်
          </h5>
          <hr className="my-2 text-white" />
          <p className="mb-0 text-center">
            နေ့စဥ် 24 နာရီ ဝန်ဆောင်မှုပေးပါသည်။
          </p>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default WalletPage;
