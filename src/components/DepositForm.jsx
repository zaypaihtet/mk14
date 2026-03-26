import React, { useState } from "react";
import { FileImage, NotepadText } from "lucide-react";
import DepositHeader from "../components/DepositHeader";
import Header from "../components/Header";
import { useNavigate, useLocation } from "react-router";

const DepositForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { method } = location.state || { method: "wavemoney" };

  const [file, setFile] = useState(null);
  const [note, setNote] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ method, file, note });
  };

  const accounts = {
    wavemoney: {
      img: "/images/wavemoney.jpg",
      number: "099000000",
      name: "Kyaw Kyaw",
    },
    kpay: {
      img: "/images/kpay.jpg",
      number: "097700000",
      name: "Aung Aung",
    },
  };

  const account = accounts[method];

  return (
    <div className="min-h-screen bg-gray-200 flex justify-center">
      <div className="w-full max-w-[500px] bg-blue-50 min-h-screen pb-20">
        <Header />

        <div className="m-3 bg-gray-200 p-3 rounded h-screen">
          <DepositHeader />

          {/* Account Info */}
          <div className="mt-2 flex items-center space-x-3 cursor-pointer">
            <img src={account.img} alt={method} className="size-12 rounded" />
            <div>
              <p className="text-xl text-gray-700">{account.number}</p>
              <span className="text-sm text-gray-500">{account.name}</span>
            </div>
          </div>

          {/* Note */}
          <div className="flex text-sm text-black my-4">
            <p className="mr-1">မှတ်ချက် :</p>
            <span>ကျေးဇူးပြု၍ ဖော်ပြပါအကောင့်ကိုသာ ငွေလွှဲပါ။</span>
          </div>
          <hr className="text-white" />

          {/* Amount */}
          <div className="flex justify-between items-center mb-4 mt-5">
            <span className="font-semibold">ငွေပမာဏ :</span>
            <span className="font-bold">10,000</span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* File Upload */}
            <div>
              <label className="block text-gray-600 mb-2 text-sm">
                Slip image
              </label>
              <div className="flex items-center border border-gray-300 bg-gray-200 rounded-md overflow-hidden">
                <div className="px-2 text-gray-500 border-r border-gray-300">
                  <FileImage className="w-5 h-5" />
                </div>
                <input
                  type="file"
                  id="file-upload"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="hidden"
                />
                <label
                  htmlFor="file-upload"
                  className="px-3 py-2 bg-gray-100 border-x border-gray-300 cursor-pointer text-sm text-gray-700 hover:bg-gray-200"
                >
                  Choose File
                </label>
                <span className="flex-1 px-3 text-sm text-gray-500 truncate">
                  {file ? file.name : "No file chosen"}
                </span>
              </div>
            </div>

            {/* Transaction Note */}
            <div>
              <label className="block text-gray-600 mb-2 text-sm">
                လုပ်ဆောင်မှုအမှတ် နောက်ဆုံးဂဏန်း ၆လုံး
              </label>
              <div className="flex items-center border border-gray-300 bg-gray-200 rounded-md overflow-hidden">
                <div className="px-2 text-gray-500 border-r border-gray-300">
                  <NotepadText className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d{0,6}$/.test(value)) {
                      setNote(value);
                    }
                  }}
                  maxLength={6}
                  className="flex-1 p-2 focus:outline-none"
                  placeholder="နောက်ဆုံးဂဏန်း ၆ လုံး"
                  required
                />
              </div>
            </div>

            {/* Buttons */}
            <button
              type="submit"
              className="w-full bg-blue-400 text-black py-2 rounded-md hover:bg-blue-500 transition"
            >
              အတည်ပြုပါ
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-full bg-gray-400 text-black py-2 rounded-md hover:bg-blue-500 transition"
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DepositForm;
