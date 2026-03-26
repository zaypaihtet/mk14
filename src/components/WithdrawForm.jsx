import Header from "./Header";
import { CircleDollarSign, DollarSignIcon, NotepadText } from "lucide-react";
import WithdrawHeader from "./WithdrawHeader";

const WithdrawForm = () => {
  return (
    <div className="min-h-screen bg-gray-200 flex justify-center">
      <div className="w-full max-w-[500px] bg-blue-50 min-h-screen pb-20">
        <Header />

        <div className="m-3 bg-gray-200 p-3 rounded h-screen">
          <WithdrawHeader />

          <form className="space-y-6">
            <div>
              <label className="block text-gray-600 mb-2 text-sm">
                ငွေပမာဏ
              </label>
              <div className="flex items-center border border-gray-300 bg-gray-200 rounded-md overflow-hidden">
                <div className="px-2 text-gray-500 border-r border-gray-300">
                  <CircleDollarSign className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  className="flex-1 p-2 focus:outline-none text-sm"
                  placeholder="ငွေပမာဏဖြည့်ပါ"
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-600 mb-2 text-sm">
                ငွေထုတ်အကောင့်
              </label>
              <div className="flex items-center border border-gray-300 bg-gray-200 rounded-md overflow-hidden">
                <div className="px-2 text-gray-500 border-r border-gray-300">
                  <CircleDollarSign className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  className="flex-1 p-2 focus:outline-none text-sm"
                  placeholder="ငွေထုတ်အကောင့်ရွေးပါ။"
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-600 mb-2 text-sm">
                ငွေထုတ်အကောင့်
              </label>
              <div className="flex items-center border border-gray-300 bg-gray-200 rounded-md overflow-hidden">
                <div className="px-2 text-gray-500 border-r border-gray-300">
                  <CircleDollarSign className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  className="flex-1 p-2 focus:outline-none text-sm"
                  placeholder="ငွေထုတ်အကောင့်ရွေးပါ။"
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-600 mb-2 text-sm">
                ဘဏ်အကောင့်နံပါတ် (သို့) ဖုန်းနံပါတ်
              </label>
              <div className="flex items-center border border-gray-300 bg-gray-200 rounded-md overflow-hidden">
                <div className="px-2 text-gray-500 border-r border-gray-300">
                  <CircleDollarSign className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  className="flex-1 p-2 focus:outline-none text-sm"
                  placeholder="ဘဏ်အကောင့်နံပါတ် (သို့) ဖုန်းနံပါတ်ဖြည့်ပါ"
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-600 mb-2 text-sm">
                ဘဏ်အကောင့်အမည်
              </label>
              <div className="flex items-center border border-gray-300 bg-gray-200 rounded-md overflow-hidden">
                <div className="px-2 text-gray-500 border-r border-gray-300">
                  <CircleDollarSign className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  className="flex-1 p-2 focus:outline-none text-sm"
                  placeholder="ဘဏ်အကောင့်အမည်ထည့်ပါ"
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-600 mb-2 text-sm">
                စကားဝှက်
              </label>
              <div className="flex items-center border border-gray-300 bg-gray-200 rounded-md overflow-hidden">
                <div className="px-2 text-gray-500 border-r border-gray-300">
                  <CircleDollarSign className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  className="flex-1 p-2 focus:outline-none text-sm"
                  placeholder="စကားဝှက်ဖြည့်ပါ"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-400 text-black py-2 rounded-md hover:bg-blue-500 transition"
            >
              အတည်ပြုပါ
            </button>
          
          </form>
        </div>
      </div>
    </div>
  );
};

export default WithdrawForm;
