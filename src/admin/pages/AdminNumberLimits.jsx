import React, { useEffect, useState, useCallback } from "react";
import { api } from "../../utils/api";
import { Lock, Unlock, RefreshCw, Save, Globe } from "lucide-react";

const AdminNumberLimits = () => {
  const [numbers, setNumbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [globalLimit, setGlobalLimit] = useState("");
  const [editLimit, setEditLimit] = useState({});
  const [msg, setMsg] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.admin.getNumberLimits2D();
      setNumbers(data);
      const initEdit = {};
      data.forEach((d) => { initEdit[d.number] = d.day_limit; });
      setEditLimit(initEdit);
    } catch (e) {
      setMsg({ type: "error", text: e.message });
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const flash = (type, text) => {
    setMsg({ type, text });
    setTimeout(() => setMsg(null), 3000);
  };

  const toggleBlock = async (number, currentBlocked) => {
    try {
      await api.admin.updateNumberLimits2D([{
        number,
        is_blocked: !currentBlocked,
        day_limit: parseInt(editLimit[number]) || 0,
      }]);
      setNumbers((prev) => prev.map((n) => n.number === number ? { ...n, is_blocked: !currentBlocked } : n));
    } catch (e) { flash("error", e.message); }
  };

  const saveSingle = async (number) => {
    const item = numbers.find((n) => n.number === number);
    if (!item) return;
    try {
      await api.admin.updateNumberLimits2D([{
        number,
        is_blocked: item.is_blocked,
        day_limit: parseInt(editLimit[number]) || 0,
      }]);
      setNumbers((prev) => prev.map((n) => n.number === number ? { ...n, day_limit: parseInt(editLimit[number]) || 0 } : n));
      flash("success", `${number} သတ်မှတ်ပြီး`);
    } catch (e) { flash("error", e.message); }
  };

  const saveGlobal = async () => {
    const limit = parseInt(globalLimit);
    if (isNaN(limit) || limit < 0) return flash("error", "မှန်ကန်သောဖိုး ထည့်ပါ");
    setSaving(true);
    try {
      await api.admin.setGlobalLimit2D(limit);
      await load();
      flash("success", `နံပါတ် ၁၀၀ လုံးလုံး — limit ${limit.toLocaleString()} ကျပ် သတ်မှတ်ပြီး`);
      setGlobalLimit("");
    } catch (e) { flash("error", e.message); }
    finally { setSaving(false); }
  };

  const getColor = (n) => {
    if (n.is_blocked || (n.day_limit > 0 && n.today_total >= n.day_limit)) return "bg-red-100 border-red-400 text-red-700";
    if (n.day_limit > 0) {
      const pct = n.today_total / n.day_limit;
      if (pct >= 0.8) return "bg-orange-100 border-orange-400 text-orange-700";
      return "bg-green-50 border-green-300 text-green-800";
    }
    return "bg-white border-gray-200 text-gray-800";
  };

  const getPct = (n) => {
    if (n.day_limit <= 0) return 0;
    return Math.min(100, Math.round((n.today_total / n.day_limit) * 100));
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-1 text-gray-800">2D နံပါတ် ပိတ်ဆို့ / Limit</h1>
      <p className="text-sm text-gray-500 mb-4">ကိုယ်တိုင်ရွေးသော နံပါတ်ကို ပိတ်ဆို့ (Lock) သို့မဟုတ် တစ်ရက်ထိုးနိုင်သောပမာဏ (Limit) သတ်မှတ်နိုင်သည်</p>

      {msg && (
        <div className={`mb-4 px-4 py-2 rounded-lg text-sm font-medium ${msg.type === "error" ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>
          {msg.text}
        </div>
      )}

      {/* Global limit bar */}
      <div className="bg-white rounded-xl shadow-sm border p-4 mb-6 flex flex-wrap gap-3 items-center">
        <Globe className="w-5 h-5 text-indigo-500" />
        <span className="font-medium text-gray-700">နံပါတ် အားလုံး Global Limit သတ်မှတ်</span>
        <input
          type="number"
          min="0"
          placeholder="ဥပမာ 500000 (0 = unlimited)"
          value={globalLimit}
          onChange={(e) => setGlobalLimit(e.target.value)}
          className="border rounded-lg px-3 py-1.5 text-sm w-52 focus:outline-none focus:ring-2 focus:ring-indigo-300"
        />
        <button
          onClick={saveGlobal}
          disabled={saving}
          className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
        >
          {saving ? "သတ်မှတ်နေသည်..." : "အားလုံး သတ်မှတ်မည်"}
        </button>
        <button onClick={load} className="ml-auto text-gray-500 hover:text-gray-700">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-4 text-xs">
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-300 inline-block"/> ပိတ်ဆို့ / ပြည့်ပြီ</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-orange-300 inline-block"/> 80%+ ရောက်ပြီ</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-200 inline-block"/> Limit ရှိ / မပြည့်သေး</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-gray-100 inline-block"/> ပုံမှန် (Unlimited)</span>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading...</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
          {numbers.map((n) => {
            const pct = getPct(n);
            return (
              <div key={n.number} className={`border-2 rounded-xl p-2.5 ${getColor(n)} transition-colors`}>
                {/* Top row: number + block toggle */}
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-lg font-bold">{n.number}</span>
                  <button
                    onClick={() => toggleBlock(n.number, n.is_blocked)}
                    title={n.is_blocked ? "ဖွင့်မည်" : "ပိတ်မည်"}
                    className={`p-1 rounded-md transition-colors ${n.is_blocked ? "bg-red-500 text-white hover:bg-red-600" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
                  >
                    {n.is_blocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Progress bar (shown only if limit set) */}
                {n.day_limit > 0 && (
                  <div className="mb-1.5">
                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${pct >= 100 ? "bg-red-500" : pct >= 80 ? "bg-orange-400" : "bg-green-500"}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className="text-[10px] mt-0.5 text-gray-500">
                      {n.today_total.toLocaleString()} / {n.day_limit.toLocaleString()}
                    </p>
                  </div>
                )}

                {/* Day limit input + save */}
                <div className="flex gap-1">
                  <input
                    type="number"
                    min="0"
                    value={editLimit[n.number] ?? n.day_limit}
                    onChange={(e) => setEditLimit((prev) => ({ ...prev, [n.number]: e.target.value }))}
                    placeholder="0=∞"
                    className="w-full border rounded px-1.5 py-0.5 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-300 bg-white/80"
                  />
                  <button
                    onClick={() => saveSingle(n.number)}
                    title="သိမ်းမည်"
                    className="bg-indigo-500 text-white rounded px-1.5 py-0.5 hover:bg-indigo-600"
                  >
                    <Save className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminNumberLimits;
