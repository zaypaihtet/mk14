import React from "react";
import {
  User,
  Settings,
  LogOut,
  HelpCircle,
  PhoneCall,
  Lock,
} from "lucide-react";
import Header from "../components/Header";
import BottomNavigation from "../components/BottomNavigation";
import { useNavigate } from "react-router";

const ProfilePage = () => {
  const navigate = useNavigate();
  // Mock user data
  const user = {
    name: "Kyaw Kyaw",
    type: "အသုံးပြုသူ",
    email: "kyawkyaw@example.com",
    phoneNumber: "0941234567",
    balance: "50000 MMK",
    loginTime: "2025-09-03 10:45 AM",
    lastActivity: "2025-09-03 11:20 AM",
  };

  return (
    <div className="min-h-screen pb-20 bg-blue-50">
      <Header />
      <main className="p-4 space-y-6 ">
        {/* Profile Header */}
        <div>
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl text-center font-semibold text-gray-800 mb-2">
            {user.name}
          </h2>
          <p className="text-gray-500 text-center underline-offset-8 underline decoration-blue-300">
            ပရိုဖိုင် အသေးစိတ်
          </p>
        </div>
        <div className="divide-y divide-gray-300">
          <div className="grid grid-cols-[auto_auto_1fr] gap-x-2 py-2">
            <p>အမည်</p>
            <p>:</p>
            <p className="text-right">{user.email}</p>
          </div>
          <div className="grid grid-cols-[auto_auto_1fr] gap-x-2 py-2">
            <p>ဖုန်းနံပါတ်</p>
            <p>:</p>
            <p className="text-right">{user.phoneNumber}</p>
          </div>
          <div className="grid grid-cols-[auto_auto_1fr] gap-x-2 py-2">
            <p>လက်ကျန်ငွေ</p>
            <p>:</p>
            <p className="text-right">{user.balance}</p>
          </div>
        </div>
        <div className=" py-3 px-4">
          <input
            type="text"
            placeholder="မိတ်ဆက်ကုတ်ဖြည့်ပါ"
            className="w-[60%] bg-white border-1 border-blue-300 p-2 rounded-md outline-0"
          />
          <button className="bg-blue-600 text-white p-2 rounded-md">
            အတည်ပြုမည်
          </button>
        </div>
        {/* Profile Actions */}
        <button
          className="w-full flex items-center p-4 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 transition"
          data-testid="button-help"
        >
          <Lock className="w-5 h-5 mr-3" />
          <span>စကား၀ှက်ပြောင်းမည်</span>
        </button>
        <div className="space-y-3">
          <button
            onClick={() => navigate("/contact")}
            className="w-full flex items-center p-4 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 transition"
            data-testid="button-settings"
          >
            <PhoneCall className="w-5 h-5 mr-3" />
            <span>ဆက်သွယ်ရန်</span>
          </button>

          <button
            className="w-full flex items-center p-4 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition"
            data-testid="button-logout"
          >
            <LogOut className="w-5 h-5 mr-3" />
            <span>အကောင့်မှ ထွက်မည်</span>
          </button>
        </div>

        {/* Account Info */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3
            className="text-lg font-semibold text-gray-800 mb-4"
            data-testid="text-account-info-title"
          >
            အကောင့်အချက်အလက်များ
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-500">အကောင့်အမျိုးအစား:</span>
              <span className="text-gray-800" data-testid="text-account-type">
                {user.type}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">ဝင်ရောက်ချိန်:</span>
              <span className="text-gray-800" data-testid="text-login-time">
                {user.loginTime}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">နောက်ဆုံးလှုပ်ရှားချိန်:</span>
              <span className="text-gray-800" data-testid="text-last-activity">
                {user.lastActivity}
              </span>
            </div>
          </div>
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
};

export default ProfilePage;
