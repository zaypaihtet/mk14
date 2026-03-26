import { ArrowLeft, Eye, EyeOff, Lock, Phone } from "lucide-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import LotteryPageLayout from "../../components/LotteryPageLayout";
import { api, setToken } from "../../utils/api";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await api.login(phone, password);
      setToken(data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LotteryPageLayout>
      <div className="relative w-full max-w-[500px] mx-auto px-4 mt-5">
        <button
          onClick={() => navigate("/")}
          className="text-black hover:bg-white/50 p-2 rounded-full"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex justify-center mb-6">
          <div className="bg-blue-600 p-4 rounded-2xl shadow-lg">
            <span className="text-white text-xl font-bold">KM</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
          {error && (
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">
                ဖုန်းနံပါတ်
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="09-xxxxxxx"
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">
                လျှို့ဝှက်နံပါတ်
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10 pr-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="စကားဝှက်ဖြည့်ပါ"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white font-medium rounded-lg px-5 py-3 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 disabled:opacity-60"
            >
              {loading ? "ဝင်နေသည်..." : "အကောင့်ဝင်ပါ"}
            </button>

            <div className="text-center border-t pt-3">
              <Link to="/register" className="text-sm font-medium text-blue-600 hover:underline">
                အကောင့်အသစ်ဖွင့်မည်
              </Link>
            </div>
          </form>
        </div>
      </div>
    </LotteryPageLayout>
  );
};

export default LoginPage;
