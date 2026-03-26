import React, { useState } from "react";
import { CircleDollarSign } from "lucide-react";
import Header from "../components/Header";
import { useNavigate } from "react-router";
import { api, isLoggedIn } from "../utils/api";

const WithdrawForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ amount: "", account_number: "", account_name: "", bank_method: "wavemoney" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isLoggedIn()) { navigate("/login"); return null; }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.submitWithdraw(form);
      alert("ငွေထုတ်မှု တင်ပြပြီးပါပြီ");
      navigate("/wallet");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 flex justify-center">
      <div className="w-full max-w-[500px] bg-blue-50 min-h-screen pb-20">
        <Header />
        <div className="m-3 bg-gray-200 p-3 rounded">
          <h2 className="text-center font-semibold text-lg mb-4">ငွေထုတ်မည်</h2>
          {error && <div className="bg-red-100 text-red-700 px-3 py-2 rounded mb-3 text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-600 mb-2 text-sm">ဘဏ်/ငွေပေးချေမှု</label>
              <select name="bank_method" value={form.bank_method} onChange={handleChange}
                className="w-full border border-gray-300 bg-gray-200 rounded-md p-2 text-sm">
                <option value="wavemoney">Wave Money</option>
                <option value="kpay">KBZ Pay</option>
                <option value="aya">AYA Pay</option>
                <option value="cb">CB Pay</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-600 mb-2 text-sm">ငွေပမာဏ (ကျပ်)</label>
              <div className="flex items-center border border-gray-300 bg-gray-200 rounded-md overflow-hidden">
                <div className="px-2 text-gray-500 border-r border-gray-300">
                  <CircleDollarSign className="w-5 h-5" />
                </div>
                <input type="number" name="amount" required min="1000" value={form.amount} onChange={handleChange}
                  className="flex-1 p-2 focus:outline-none text-sm bg-transparent" placeholder="ငွေပမာဏ ဖြည့်ပါ" />
              </div>
            </div>
            <div>
              <label className="block text-gray-600 mb-2 text-sm">ဘဏ်အကောင့်နံပါတ် / ဖုန်းနံပါတ်</label>
              <div className="flex items-center border border-gray-300 bg-gray-200 rounded-md overflow-hidden">
                <div className="px-2 text-gray-500 border-r border-gray-300">
                  <CircleDollarSign className="w-5 h-5" />
                </div>
                <input type="text" name="account_number" required value={form.account_number} onChange={handleChange}
                  className="flex-1 p-2 focus:outline-none text-sm bg-transparent" placeholder="ဘဏ်အကောင့်နံပါတ် (သို့) ဖုန်းနံပါတ်ဖြည့်ပါ" />
              </div>
            </div>
            <div>
              <label className="block text-gray-600 mb-2 text-sm">ဘဏ်အကောင့်အမည်</label>
              <div className="flex items-center border border-gray-300 bg-gray-200 rounded-md overflow-hidden">
                <div className="px-2 text-gray-500 border-r border-gray-300">
                  <CircleDollarSign className="w-5 h-5" />
                </div>
                <input type="text" name="account_name" required value={form.account_name} onChange={handleChange}
                  className="flex-1 p-2 focus:outline-none text-sm bg-transparent" placeholder="ဘဏ်အကောင့်အမည်ထည့်ပါ" />
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-blue-400 text-black py-2 rounded-md hover:bg-blue-500 transition disabled:opacity-60">
              {loading ? "တင်ပြနေသည်..." : "အတည်ပြုပါ"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WithdrawForm;
