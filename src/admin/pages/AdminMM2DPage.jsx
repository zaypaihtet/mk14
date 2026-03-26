import React, { useEffect, useState } from "react";
import { api } from "../../utils/api";

const AdminMM2DPage = () => {
  const [bets, setBets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resultForm, setResultForm] = useState({ result_number: "", session: "morning", result_date: new Date().toISOString().split("T")[0] });
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    api.admin.getBets2D()
      .then((data) => setBets(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handlePublish = async (e) => {
    e.preventDefault();
    setPublishing(true);
    try {
      await api.admin.publishResult2D(resultForm);
      alert("ရလဒ် ထုတ်ပြန်ပြီးပါပြီ");
    } catch (err) {
      alert(err.message);
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Myanmar 2D</h1>
        <p className="text-gray-600">View bets and publish results</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold mb-4">ရလဒ် ထုတ်ပြန်ရန်</h2>
        <form onSubmit={handlePublish} className="flex gap-3 flex-wrap">
          <input
            type="text" maxLength={2} required
            placeholder="ရလဒ် (00-99)"
            value={resultForm.result_number}
            onChange={(e) => setResultForm({ ...resultForm, result_number: e.target.value })}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-28"
          />
          <select
            value={resultForm.session}
            onChange={(e) => setResultForm({ ...resultForm, session: e.target.value })}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="morning">Morning (11:00 AM)</option>
            <option value="evening">Evening (3:00 PM)</option>
          </select>
          <input
            type="date" required
            value={resultForm.result_date}
            onChange={(e) => setResultForm({ ...resultForm, result_date: e.target.value })}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
          <button type="submit" disabled={publishing}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-60">
            {publishing ? "Publishing..." : "ထုတ်ပြန်မည်"}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">ထိုးကြေး မှတ်တမ်း</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Numbers</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Session</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading && <tr><td colSpan="6" className="text-center py-6">Loading...</td></tr>}
              {!loading && bets.length === 0 && <tr><td colSpan="6" className="text-center py-6 text-gray-500">No records found.</td></tr>}
              {bets.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{b.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{b.phone}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{Array.isArray(b.numbers) ? b.numbers.join(", ") : JSON.stringify(b.numbers)}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{Number(b.total_amount).toLocaleString()} MMK</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{b.session}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      b.status === "won" ? "bg-green-100 text-green-700" :
                      b.status === "lost" ? "bg-red-100 text-red-700" :
                      "bg-yellow-100 text-yellow-700"
                    }`}>{b.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminMM2DPage;
