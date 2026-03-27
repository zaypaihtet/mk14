import React, { useEffect, useState, useCallback } from "react";
import { api } from "../../utils/api";
import { Lock, Unlock, RefreshCw, Save, Globe, ChevronLeft, ChevronRight } from "lucide-react";

const RANGE_OPTIONS = [
  "000-099","100-199","200-299","300-399","400-499",
  "500-599","600-699","700-799","800-899","900-999",
];

const AdminNumberLimits3D = () => {
  const [numbers, setNumbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [range, setRange] = useState(0);
  const [globalLimit, setGlobalLimit] = useState("");
  const [editLimit, setEditLimit] = useState({});
  const [msg, setMsg] = useState(null);

  const load = useCallback(async (r) => {
    setLoading(true);
    try {
      const data = await api.admin.getNumberLimits3D(r ?? range);
      setNumbers(data);
      const initEdit = {};
      data.forEach((d) => { initEdit[d.number] = d.day_limit; });
      setEditLimit(initEdit);
    } catch (e) {
      setMsg({ type: "error", text: e.message });
    } finally { setLoading(false); }
  }, [range]);

  useEffect(() => { load(); }, [load]);

  const flash = (type, text) => {
    setMsg({ type, text });
    setTimeout(() => setMsg(null), 3000);
  };

  const changeRange = (newRange) => {
    setRange(newRange);
    load(newRange);
  };

  const toggleBlock = async (number, currentBlocked) => {
    try {
      await api.admin.updateNumberLimits3D([{
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
      await api.admin.updateNumberLimits3D([{
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
    if (!confirm(`နံပါတ် ၁၀၀၀ လုံးလုံး limit ${limit.toLocaleString()} ကျပ် သတ်မှတ်မည်လား?`)) return;
    setSaving(true);
    try {
      await api.admin.setGlobalLimit3D(limit);
      await load();
      flash("success", `နံပါတ် ၁၀၀၀ လုံးလုံး — limit ${limit.toLocaleString()} ကျပ် သတ်မှတ်ပြီး`);
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
      <h1 className="text-2xl font-bold mb-1 text-gray-800">3D နံပါတ် ပိတ်ဆို့ / Limit</h1>
      <p className="text-sm text-gray-500 mb-4">ကိုယ်တိုင်ရွေးသော နံပါတ်ကို ပိတ်ဆို့ (Lock) သို့မဟုတ် တစ်ရက်ထိုးနိုင်သောပမာဏ (Limit) သတ်မှတ်နိုင်သည်</p>

      {msg && (
        <div className={`mb-4 p-3 rounded-lg text-sm font-medium ${msg.type === "error" ? "bg-red-50 text-red-700 border border-red-200" : "bg-green-50 text-green-700 border border-green-200"}`}>
          {msg.text}
        </div>
      )}

      {/* Color legend */}
      <div className="flex flex-wrap gap-3 mb-4 text-xs text-gray-600">
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-white border border-gray-300 inline-block" /> ပုံမှန်</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-100 border border-green-400 inline-block" /> Limit ရှိ (နည်းသေး)</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-orange-100 border border-orange-400 inline-block" /> 80% ကျော်</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-100 border border-red-400 inline-block" /> ပိတ် / ပြည့်</span>
      </div>

      {/* Global limit bar */}
      <div className="bg-white rounded-xl border p-4 mb-4 flex flex-wrap items-center gap-3">
        <Globe className="text-indigo-500 w-5 h-5 shrink-0" />
        <span className="text-sm font-medium text-gray-700">Global Limit (နံပါတ် ၁၀၀၀ လုံးလုံး)</span>
        <div className="flex gap-2 ml-auto">
          <input
            type="number" min="0" value={globalLimit}
            onChange={(e) => setGlobalLimit(e.target.value)}
            placeholder="0 = မကန့်သတ်"
            className="border rounded-lg px-3 py-1.5 text-sm w-36 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
          <button
            onClick={saveGlobal} disabled={saving}
            className="flex items-center gap-1.5 bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-indigo-700 disabled:opacity-60"
          >
            <Globe className="w-4 h-4" />{saving ? "သိမ်းနေသည်..." : "သတ်မှတ်မည်"}
          </button>
        </div>
      </div>

      {/* Range selector */}
      <div className="bg-white rounded-xl border p-3 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-700">ရွေးချယ်မည့် ရာများ</span>
          <div className="flex gap-1">
            <button onClick={() => changeRange(Math.max(0, range - 1))} disabled={range === 0}
              className="p-1 rounded hover:bg-gray-100 disabled:opacity-40">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 text-sm font-bold text-indigo-700">{RANGE_OPTIONS[range]}</span>
            <button onClick={() => changeRange(Math.min(9, range + 1))} disabled={range === 9}
              className="p-1 rounded hover:bg-gray-100 disabled:opacity-40">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <button onClick={() => load()} className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 border rounded px-2 py-1">
            <RefreshCw className="w-3.5 h-3.5" />ပြန်ဖတ်မည်
          </button>
        </div>
        <div className="flex flex-wrap gap-1">
          {RANGE_OPTIONS.map((label, i) => (
            <button key={i} onClick={() => changeRange(i)}
              className={`px-2 py-0.5 rounded text-xs border font-medium transition-colors ${i === range ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-gray-600 hover:bg-gray-50"}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading...</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
          {numbers.map((n) => {
            const pct = getPct(n);
            return (
              <div key={n.number} className={`border-2 rounded-xl p-2 transition-colors ${getColor(n)}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm">{n.number}</span>
                  <button
                    onClick={() => toggleBlock(n.number, n.is_blocked)}
                    title={n.is_blocked ? "ဖွင့်မည်" : "ပိတ်မည်"}
                    className={`p-1 rounded-md transition-colors ${n.is_blocked ? "bg-red-500 text-white hover:bg-red-600" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
                  >
                    {n.is_blocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                  </button>
                </div>

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

                <div className="flex gap-1">
                  <input
                    type="number" min="0"
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

export default AdminNumberLimits3D;
