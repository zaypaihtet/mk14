import React, { useEffect, useState } from "react";
import { User, PhoneCall, LogOut, Lock } from "lucide-react";
import Header from "../components/Header";
import BottomNavigation from "../components/BottomNavigation";
import { useNavigate } from "react-router";
import { api, removeToken, isLoggedIn } from "../utils/api";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn()) { navigate("/login"); return; }
    api.getMe()
      .then((data) => setUser(data))
      .catch(() => navigate("/login"))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    removeToken();
    localStorage.removeItem("user");
    navigate("/");
  };

  if (loading) return (
    <div className="min-h-screen pb-20 bg-blue-50 flex items-center justify-center">
      <p className="text-gray-500">Loading...</p>
    </div>
  );

  return (
    <div className="min-h-screen pb-20 bg-blue-50">
      <Header />
      <main className="p-4 space-y-6">
        <div>
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl text-center font-semibold text-gray-800 mb-2">
            {user?.name}
          </h2>
          <p className="text-gray-500 text-center underline-offset-8 underline decoration-blue-300">
            ပရိုဖိုင် အသေးစိတ်
          </p>
        </div>
        <div className="divide-y divide-gray-300">
          <div className="grid grid-cols-[auto_auto_1fr] gap-x-2 py-2">
            <p>အမည်</p><p>:</p>
            <p className="text-right">{user?.name}</p>
          </div>
          <div className="grid grid-cols-[auto_auto_1fr] gap-x-2 py-2">
            <p>ဖုန်းနံပါတ်</p><p>:</p>
            <p className="text-right">{user?.phone}</p>
          </div>
          <div className="grid grid-cols-[auto_auto_1fr] gap-x-2 py-2">
            <p>လက်ကျန်ငွေ</p><p>:</p>
            <p className="text-right">{Number(user?.balance || 0).toLocaleString()} ကျပ်</p>
          </div>
          <div className="grid grid-cols-[auto_auto_1fr] gap-x-2 py-2">
            <p>မိတ်ဆက်ကုတ်</p><p>:</p>
            <p className="text-right font-mono text-blue-600">{user?.referral_code}</p>
          </div>
        </div>
        <div className="space-y-3">
          <button onClick={() => navigate("/contact")}
            className="w-full flex items-center p-4 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 transition">
            <PhoneCall className="w-5 h-5 mr-3" />
            <span>ဆက်သွယ်ရန်</span>
          </button>
          <button onClick={handleLogout}
            className="w-full flex items-center p-4 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition">
            <LogOut className="w-5 h-5 mr-3" />
            <span>အကောင့်မှ ထွက်မည်</span>
          </button>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            အကောင့်အချက်အလက်များ
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-500">အကောင့်အမျိုးအစား:</span>
              <span className="text-gray-800 capitalize">{user?.role}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">မှတ်ပုံတင်သည့်နေ့:</span>
              <span className="text-gray-800">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString() : "-"}
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
