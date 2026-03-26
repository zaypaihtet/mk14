import { ArrowLeft, Eye, EyeOff, Lock, Phone, User } from "lucide-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import LotteryPageLayout from "../../components/LotteryPageLayout";

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  return (
    <LotteryPageLayout>
      <div className="relative w-full max-w-[500px] mx-auto px-4">
        <button
          onClick={() => navigate("/")}
          className="text-black hover:bg-white/50 p-2 rounded-full"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="bg-blue-600 p-4 rounded-2xl shadow-lg">
            <span className="text-white text-xl font-bold">KM</span>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
          <form className="space-y-6 " action={'/'}>
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                အကောင့်အမည်
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  name="name"
                  type="text"
                  required
                  className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="အကောင့်အမည်ထည့်ပါ"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="phone"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                ဖုန်းနံပါတ်
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  name="phone"
                  type="number"
                  required
                  className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="09-xxxxxxx"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                လျှို့ဝှက်နံပါတ်
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="pl-10 pr-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="လျှို့ဝှက်နံပါတ် ၆ လုံးထည့်ပါ"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                လျှို့ဝှက်နံပါတ်အတည်ပြုရန်
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  className="pl-10 pr-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="လျှို့ဝှက်နံပါတ်ထပ်မံထည့်ပါ"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-medium rounded-lg px-5 py-3 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300"
            >
              အကောင့်အသစ်ဖွင့်မည်
            </button>

            {/* Divider + Link */}
            <div className="text-center border-t pt-3">
              <Link
                to="/login"
                className="text-sm font-medium text-blue-600 hover:underline"
              >
                အကောင့်ရှိပြီးသားလား? အကောင့်ဝင်မည်။
              </Link>
            </div>
          </form>
        </div>
      </div>
    </LotteryPageLayout>
  );
};

export default RegisterPage;
