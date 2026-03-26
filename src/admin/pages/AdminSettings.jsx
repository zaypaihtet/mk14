import React, { useEffect, useState } from "react";
import { Save, Clock, Calendar } from "lucide-react";
import { api } from "../../utils/api";

const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
const DAY_LABELS = { MON: "တနင်္လာ", TUE: "အင်္ဂါ", WED: "ဗုဒ္ဓဟူး", THU: "ကြာသပတေး", FRI: "သောကြာ", SAT: "စနေ", SUN: "တနင်္ဂနွေ" };

const AdminSettings = () => {
  const [config, setConfig] = useState({
    "2d_morning_close": "12:00",
    "2d_evening_close": "16:30",
    "3d_enabled": "true",
    "3d_open_days": "MON,TUE,WED,THU,FRI,SAT",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    api.admin.getConfig()
      .then((data) => setConfig(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMsg("");
    try {
      await api.admin.updateConfig(config);
      setMsg("✓ သိမ်းဆည်းပြီးပါပြီ");
    } catch (err) {
      setMsg("Error: " + err.message);
    } finally {
      setSaving(false);
      setTimeout(() => setMsg(""), 3000);
    }
  };

  const toggleDay = (day) => {
    const days = config["3d_open_days"].split(",").filter(Boolean);
    const updated = days.includes(day) ? days.filter((d) => d !== day) : [...days, day];
    setConfig({ ...config, "3d_open_days": updated.join(",") });
  };

  const openDays = config["3d_open_days"]?.split(",").filter(Boolean) || [];

  if (loading) return <div className="text-gray-500 p-6">Loading...</div>;

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 text-sm">2D ပိတ်ချိန် နှင့် 3D configuration</p>
      </div>

      {/* 2D Close Times */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="h-5 w-5 text-indigo-600" />
          <h2 className="text-lg font-semibold">Myanmar 2D ပိတ်ချိန်</h2>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">မနက် ပိတ်ချိန် (11:00 AM session)</label>
            <input
              type="time"
              value={config["2d_morning_close"]}
              onChange={(e) => setConfig({ ...config, "2d_morning_close": e.target.value })}
              className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <p className="text-xs text-gray-400 mt-1">ဒီအချိန်မှ ထိုးကြေး မတင်ရတော့ပါ</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ညနေ ပိတ်ချိန် (4:30 PM session)</label>
            <input
              type="time"
              value={config["2d_evening_close"]}
              onChange={(e) => setConfig({ ...config, "2d_evening_close": e.target.value })}
              className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <p className="text-xs text-gray-400 mt-1">ဒီအချိန်မှ ထိုးကြေး မတင်ရတော့ပါ</p>
          </div>
        </div>
      </div>

      {/* 3D Config */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="h-5 w-5 text-purple-600" />
          <h2 className="text-lg font-semibold">Myanmar 3D Configuration</h2>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
          <div>
            <p className="font-medium text-gray-800">3D ဖွင့်မည် / ပိတ်မည်</p>
            <p className="text-sm text-gray-500">3D ထိုးကြေး တင်ခွင့် toggle</p>
          </div>
          <button
            onClick={() => setConfig({ ...config, "3d_enabled": config["3d_enabled"] === "true" ? "false" : "true" })}
            className={`relative w-14 h-7 rounded-full transition-colors ${config["3d_enabled"] === "true" ? "bg-green-500" : "bg-gray-300"}`}
          >
            <span className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${config["3d_enabled"] === "true" ? "translate-x-7" : "translate-x-0.5"}`} />
          </button>
        </div>

        <div>
          <p className="font-medium text-gray-800 mb-3">3D ဖွင့်ရက်များ</p>
          <div className="flex flex-wrap gap-2">
            {DAYS.map((day) => (
              <button
                key={day}
                onClick={() => toggleDay(day)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  openDays.includes(day)
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {DAY_LABELS[day]}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-2">ဖိနှိပ်ပြီး ရက်ရွေး သို့မဟုတ် ဖယ်ရန်</p>
        </div>
      </div>

      {msg && (
        <div className={`text-sm text-center rounded-xl py-2 ${msg.startsWith("Error") ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}>
          {msg}
        </div>
      )}

      <button
        onClick={handleSave}
        disabled={saving}
        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors disabled:opacity-50"
      >
        <Save className="h-5 w-5" />
        {saving ? "Saving..." : "သိမ်းဆည်းမည်"}
      </button>
    </div>
  );
};

export default AdminSettings;
