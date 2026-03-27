import React, { useEffect, useState } from "react";
import { Trash2, Plus, CalendarOff, AlertCircle, Info, Sparkles } from "lucide-react";
import { api } from "../../utils/api";

const fmt = (d) => {
  if (!d) return "";
  const dt = new Date(d + "T00:00:00Z");
  return dt.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" });
};

const dayName = (d) => {
  if (!d) return "";
  const days = ["တနင်္ဂနွေ", "တနင်္လာ", "အင်္ဂါ", "ဗုဒ္ဓဟူး", "ကြာသပတေး", "သောကြာ", "စနေ"];
  return days[new Date(d + "T00:00:00Z").getUTCDay()];
};

const isWeekend = (d) => {
  const day = new Date(d + "T00:00:00Z").getUTCDay();
  return day === 0 || day === 6; // Sun or Sat
};

const AdminHolidayPage = () => {
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ holiday_date: "", description: "" });
  const [adding, setAdding] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [seedYear, setSeedYear] = useState(new Date().getFullYear());
  const [msg, setMsg] = useState("");

  const load = () => {
    api.admin.getHolidays()
      .then(setHolidays)
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const showMsg = (m) => { setMsg(m); setTimeout(() => setMsg(""), 4000); };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.holiday_date || !form.description) return;
    if (isWeekend(form.holiday_date)) {
      showMsg("စနေ / တနင်္ဂနွေ နေ့ကို ထည့်မည်မဟုတ်ပါ (Auto-detect ဖြင့် ပိတ်ထားသည်)");
      return;
    }
    setAdding(true);
    try {
      await api.admin.addHoliday(form);
      setForm({ holiday_date: "", description: "" });
      load();
      showMsg("✓ ပိတ်ရက် ထည့်ပြီးပါပြီ");
    } catch (err) { showMsg("Error: " + err.message); }
    finally { setAdding(false); }
  };

  const handleSeedDefaults = async () => {
    if (!confirm(`${seedYear} ခုနှစ် မြန်မာ့နိုင်ငံတော် ပိတ်ရက်များ (၁၂ ရက်) ထည့်မည်လား?\n(ရှိပြီးသား ပိတ်ရက်များ ထပ်မထည့်ပါ)`)) return;
    setSeeding(true);
    try {
      const r = await api.admin.seedDefaultHolidays(seedYear);
      load();
      showMsg("✓ " + r.message);
    } catch (err) { showMsg("Error: " + err.message); }
    finally { setSeeding(false); }
  };

  const handleDelete = async (id, desc) => {
    if (!confirm(`"${desc}" ကို ဖျက်မည်လား?`)) return;
    try {
      await api.admin.deleteHoliday(id);
      load();
      showMsg("✓ ဖျက်ပြီးပါပြီ");
    } catch (err) { showMsg("Error: " + err.message); }
  };

  const upcoming = holidays.filter(h => new Date(h.holiday_date) >= new Date(new Date().toISOString().slice(0, 10)));
  const past     = holidays.filter(h => new Date(h.holiday_date) <  new Date(new Date().toISOString().slice(0, 10)));

  return (
    <div className="p-4 space-y-5 max-w-2xl mx-auto">
      <div className="flex items-center gap-2 mb-2">
        <CalendarOff className="h-5 w-5 text-red-500" />
        <h1 className="text-xl font-bold text-gray-800">ပိတ်ရက် စီမံခန့်ခွဲမှု</h1>
      </div>

      {/* Info banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex gap-2 text-sm text-blue-700">
        <Info className="h-4 w-4 mt-0.5 shrink-0" />
        <div>
          <b>Auto-detect</b> — <b>စနေ</b> နှင့် <b>တနင်္ဂနွေ</b> နေ့များကို အလိုအလျောက် ပိတ်ရက်အဖြစ် သတ်မှတ်သည်။
          အောက်ပါ ဇယားတွင် မြန်မာ့အများပြည်သူ ပိတ်ရက်များ ထည့်သွင်းပါ။
          ပိတ်ရက်တွင် 2D နှင့် 3D ထိုးခွင့် ပိတ်သွားမည်ဖြစ်သည်။
        </div>
      </div>

      {/* Success/Error message */}
      {msg && (
        <div className={`text-center text-sm py-2 px-3 rounded-lg ${msg.startsWith("Error") || msg.startsWith("စနေ") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
          {msg}
        </div>
      )}

      {/* Seed defaults */}
      <div className="bg-white rounded-2xl shadow-sm border p-4 space-y-3">
        <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-yellow-500" /> မြန်မာ့နိုင်ငံတော် ပိတ်ရက် Default ထည့်မည်
        </h2>
        <p className="text-xs text-gray-500">
          လွတ်လပ်ရေးနေ့, ပြည်ထောင်စုနေ့, တပ်မတော်နေ့, သင်္ကြန်, နှစ်သစ်ကူး, အလုပ်သမားနေ့, အာဇာနည်နေ့, ခရစ်မတ် — ၁၂ ရက် ပါ၀င်သည်
        </p>
        <div className="flex gap-2 items-center">
          <select
            value={seedYear}
            onChange={e => setSeedYear(parseInt(e.target.value))}
            className="border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            {[new Date().getFullYear() - 1, new Date().getFullYear(), new Date().getFullYear() + 1].map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <button
            onClick={handleSeedDefaults}
            disabled={seeding}
            className="flex-1 bg-yellow-500 text-white rounded-xl py-2 text-sm font-semibold hover:bg-yellow-600 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
          >
            <Sparkles className="h-4 w-4" />
            {seeding ? "ထည့်နေသည်..." : `${seedYear} ပိတ်ရက်များ Default ထည့်မည်`}
          </button>
        </div>

        {/* Default holiday list preview */}
        <div className="bg-yellow-50 rounded-xl p-3">
          <p className="text-xs font-medium text-yellow-800 mb-2">ပါ၀င်မည့် ပိတ်ရက်များ ({seedYear}):</p>
          <div className="grid grid-cols-2 gap-1">
            {[
              `${seedYear}-01-04 — လွတ်လပ်ရေးနေ့`,
              `${seedYear}-02-12 — ပြည်ထောင်စုနေ့`,
              `${seedYear}-03-02 — တောင်သူလယ်သမားနေ့`,
              `${seedYear}-03-27 — တပ်မတော်နေ့`,
              `${seedYear}-04-13 — သင်္ကြန် ပထမနေ့`,
              `${seedYear}-04-14 — သင်္ကြန် ဒုတိယနေ့`,
              `${seedYear}-04-15 — သင်္ကြန် တတိယနေ့`,
              `${seedYear}-04-16 — သင်္ကြန် စတုတ္ထနေ့`,
              `${seedYear}-04-17 — နှစ်သစ်ကူးနေ့`,
              `${seedYear}-05-01 — အလုပ်သမားနေ့`,
              `${seedYear}-07-19 — အာဇာနည်နေ့`,
              `${seedYear}-12-25 — ခရစ်မတ်နေ့`,
            ].map((item, i) => (
              <p key={i} className="text-xs text-yellow-700">{item}</p>
            ))}
          </div>
        </div>
      </div>

      {/* Add holiday form */}
      <form onSubmit={handleAdd} className="bg-white rounded-2xl shadow-sm border p-4 space-y-3">
        <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <Plus className="h-4 w-4 text-green-600" /> ပိတ်ရက် ကိုယ်တိုင် ထည့်မည်
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">ရက်စွဲ</label>
            <input
              type="date"
              value={form.holiday_date}
              onChange={e => setForm(p => ({ ...p, holiday_date: e.target.value }))}
              required
              className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">ပိတ်ရက်အမည်</label>
            <input
              type="text"
              value={form.description}
              onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              placeholder="ဥပမာ — ဗုဒ္ဓနေ့"
              required
              className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={adding}
          className="w-full bg-red-500 text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-red-600 disabled:opacity-50 transition-colors"
        >
          {adding ? "ထည့်နေသည်..." : "ပိတ်ရက် ထည့်မည်"}
        </button>
      </form>

      {/* Upcoming holidays */}
      <div className="bg-white rounded-2xl shadow-sm border p-4">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">
          လာမည့် ပိတ်ရက်များ <span className="text-gray-400 font-normal">({upcoming.length})</span>
        </h2>
        {loading && <p className="text-gray-400 text-sm">Loading...</p>}
        {!loading && upcoming.length === 0 && (
          <p className="text-gray-400 text-sm text-center py-4">ပိတ်ရက် မရှိသေးပါ — အထက်မှ "Default ထည့်မည်" နှိပ်ပါ</p>
        )}
        <div className="space-y-2">
          {upcoming.map(h => (
            <div key={h.id} className="flex items-center justify-between bg-red-50 border border-red-100 rounded-xl px-3 py-2.5">
              <div>
                <div className="font-semibold text-sm text-gray-800">{h.description}</div>
                <div className="text-xs text-gray-500 mt-0.5">
                  {fmt(h.holiday_date)} · <span className="text-red-500">{dayName(h.holiday_date)}</span>
                </div>
              </div>
              <button
                onClick={() => handleDelete(h.id, h.description)}
                className="text-red-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-100 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Past holidays */}
      {past.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border p-4">
          <h2 className="text-sm font-semibold text-gray-500 mb-3">
            ကန်တော့ ပိတ်ရက်များ <span className="text-gray-400 font-normal">({past.length})</span>
          </h2>
          <div className="space-y-2">
            {past.map(h => (
              <div key={h.id} className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5">
                <div>
                  <div className="font-medium text-sm text-gray-500">{h.description}</div>
                  <div className="text-xs text-gray-400">{fmt(h.holiday_date)} · {dayName(h.holiday_date)}</div>
                </div>
                <button
                  onClick={() => handleDelete(h.id, h.description)}
                  className="text-gray-300 hover:text-red-400 p-1.5 rounded-lg transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Weekend auto-detect note */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 flex gap-2 text-sm text-yellow-800">
        <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
        <span><b>စနေ</b> နှင့် <b>တနင်္ဂနွေ</b> ပိတ်ရက်ကို ဤနေရာတွင် ထည့်ရန်မလိုပါ — System မှ အလိုအလျောက် စစ်ဆေးသည်။</span>
      </div>
    </div>
  );
};

export default AdminHolidayPage;
