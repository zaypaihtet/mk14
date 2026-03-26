import React, { useState } from "react";
import { FileImage, NotepadText } from "lucide-react";
import DepositHeader from "../components/DepositHeader";
import Header from "../components/Header";
import { useNavigate, useLocation } from "react-router";
import { api } from "../utils/api";

const DepositForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { method } = location.state || { method: "wavemoney" };

  const [file, setFile] = useState(null);
  const [note, setNote] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const accounts = {
    wavemoney: { img: "/images/wavemoney.jpg", number: "099000000", name: "Kyaw Kyaw" },
    kpay: { img: "/images/kpay.jpg", number: "097700000", name: "Aung Aung" },
  };
  const account = accounts[method] || accounts.wavemoney;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount) { setError("ငွေပမာဏ ဖြည့်ပါ"); return; }
    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("amount", amount);
      formData.append("method", method);
      formData.append("note", note);
      if (file) formData.append("receipt", file);
      await api.submitDeposit(formData);
      alert("ငွေဖြည့်မှု တင်ပြပြီးပါပြီ။ Admin အတည်ပြုရန် စောင့်ပါ");
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
          <DepositHeader />
          <div className="mt-2 flex items-center space-x-3 cursor-pointer">
            <img src={account.img} alt={method} className="size-12 rounded" />
            <div>
              <p className="text-sm text-gray-500">Account: <span className="font-medium text-gray-800">{account.number}</span></p>
              <p className="text-sm text-gray-500">Name: <span className="font-medium text-gray-800">{account.name}</span></p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            {error && <div className="bg-red-100 text-red-700 px-3 py-2 rounded text-sm">{error}</div>}
            <div>
              <label className="block text-gray-600 mb-1 text-sm">ငွေပမာဏ (ကျပ်)</label>
              <input
                type="number" required min="1000"
                value={amount} onChange={(e) => setAmount(e.target.value)}
                className="w-full border border-gray-300 bg-white rounded-md px-3 py-2 text-sm"
                placeholder="ငွေပမာဏ ဖြည့်ပါ"
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-1 text-sm">ငွေလွှဲဖြတ်ပိုင်းပုံ</label>
              <div className="flex items-center border border-gray-300 bg-gray-100 rounded-md overflow-hidden">
                <div className="px-2 text-gray-500 border-r border-gray-300">
                  <FileImage className="w-5 h-5" />
                </div>
                <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} className="flex-1 p-2 text-sm bg-transparent" />
              </div>
            </div>
            <div>
              <label className="block text-gray-600 mb-1 text-sm">မှတ်ချက်</label>
              <div className="flex items-center border border-gray-300 bg-gray-100 rounded-md overflow-hidden">
                <div className="px-2 text-gray-500 border-r border-gray-300">
                  <NotepadText className="w-5 h-5" />
                </div>
                <input type="text" value={note} onChange={(e) => setNote(e.target.value)} className="flex-1 p-2 text-sm bg-transparent" placeholder="မှတ်ချက် (မဖြစ်မနေမဟုတ်)" />
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition disabled:opacity-60">
              {loading ? "တင်ပြနေသည်..." : "တင်ပြမည်"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DepositForm;
