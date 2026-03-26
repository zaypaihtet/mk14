import React, { useEffect, useRef, useState } from "react";
import { Save, Clock, Calendar, Eye, Zap, Phone, Image, AlignLeft, Trash2, Plus, MessageSquare } from "lucide-react";
import { api } from "../../utils/api";

const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
const DAY_LABELS = { MON: "တနင်္လာ", TUE: "အင်္ဂါ", WED: "ဗုဒ္ဓဟူး", THU: "ကြာသပတေး", FRI: "သောကြာ", SAT: "စနေ", SUN: "တနင်္ဂနွေ" };

const Toggle = ({ value, onChange, label, desc }) => (
  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
    <div>
      <p className="font-medium text-gray-800">{label}</p>
      {desc && <p className="text-sm text-gray-500">{desc}</p>}
    </div>
    <button
      onClick={() => onChange(value !== "true" ? "true" : "false")}
      className={`relative w-14 h-7 rounded-full transition-colors ${value === "true" ? "bg-green-500" : "bg-gray-300"}`}
    >
      <span className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${value === "true" ? "translate-x-7" : "translate-x-0.5"}`} />
    </button>
  </div>
);

const AdminSettings = () => {
  const [config, setConfig] = useState({
    "2d_morning_close": "11:58",
    "2d_evening_close": "15:58",
    "3d_enabled": "true",
    "3d_open_days": "MON,TUE,WED,THU,FRI,SAT",
    "show_dubai_2d": "true",
    "show_dubai_3d": "true",
    "show_mega_2d": "true",
    "multiplier_2d": "85",
    "multiplier_3d": "600",
    "contact_facebook": "",
    "contact_viber": "",
    "contact_phone": "",
    "site_name": "KM Fourteen",
    "marquee_text": "",
    "popup_title": "အထူးကမ်းလှမ်းချက်!",
    "popup_text": "ယနေ့ပဲ စတင်ကစားပါ!",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  // Multi-banner + logo state
  const [banners, setBanners]         = useState([]); // array of URLs
  const [logoPreview, setLogoPreview] = useState("");
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [uploadingLogo, setUploadingLogo]     = useState(false);
  const bannerRef = useRef();
  const logoRef   = useRef();

  useEffect(() => {
    api.admin.getConfig()
      .then((data) => {
        setConfig((prev) => ({ ...prev, ...data }));
        try {
          const urls = JSON.parse(data.banner_urls || "[]");
          if (Array.isArray(urls)) setBanners(urls);
        } catch {}
        if (data.logo_url) setLogoPreview(data.logo_url);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const set = (key, value) => setConfig((prev) => ({ ...prev, [key]: value }));

  const showMsg = (m) => { setMsg(m); setTimeout(() => setMsg(""), 3000); };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Exclude banner_url, banner_urls, logo_url (managed by upload endpoints)
      const { banner_url, banner_urls, logo_url, ...saveData } = config;
      await api.admin.updateConfig(saveData);
      showMsg("✓ သိမ်းဆည်းပြီးပါပြီ");
    } catch (err) {
      showMsg("Error: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const toggleDay = (day) => {
    const days = config["3d_open_days"].split(",").filter(Boolean);
    const updated = days.includes(day) ? days.filter((d) => d !== day) : [...days, day];
    set("3d_open_days", updated.join(","));
  };
  const openDays = config["3d_open_days"]?.split(",").filter(Boolean) || [];

  const handleAddBanner = async (file) => {
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    setUploadingBanner(true);
    try {
      const res = await api.admin.addBanner(fd);
      setBanners(res.banners || []);
      showMsg("✓ Banner ပုံ ထည့်ပြီးပါပြီ");
    } catch (err) { showMsg("Error: " + err.message); }
    finally { setUploadingBanner(false); bannerRef.current.value = ""; }
  };

  const handleDeleteBanner = async (index) => {
    if (!confirm("ဤ Banner ပုံကို ဖျက်မည်လား?")) return;
    try {
      const res = await api.admin.deleteBanner(index);
      setBanners(res.banners || []);
      showMsg("✓ Banner ဖျက်ပြီးပါပြီ");
    } catch (err) { showMsg("Error: " + err.message); }
  };

  const handleUploadLogo = async (file) => {
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    setUploadingLogo(true);
    try {
      const res = await api.admin.uploadLogo(fd);
      setLogoPreview(res.url);
      showMsg("✓ Logo တင်ပြီးပါပြီ");
    } catch (err) { showMsg("Error: " + err.message); }
    finally { setUploadingLogo(false); }
  };

  if (loading) return <div className="text-gray-500 p-6">Loading...</div>;

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 text-sm">Site configuration — changes သိမ်းပြီးမှ အသုံးပြုနိုင်သည်</p>
      </div>

      {/* 2D Close Times */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Clock className="h-5 w-5 text-indigo-600" />
          <h2 className="text-lg font-semibold">Myanmar 2D ပိတ်ချိန်</h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">မနက် ပိတ်ချိန်</label>
            <input type="time" value={config["2d_morning_close"]} onChange={(e) => set("2d_morning_close", e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            <p className="text-xs text-gray-400 mt-1">ၾကေညာချက် — 11:58 AM</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ညနေ ပိတ်ချိန်</label>
            <input type="time" value={config["2d_evening_close"]} onChange={(e) => set("2d_evening_close", e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            <p className="text-xs text-gray-400 mt-1">ၾကေညာချက် — 3:58 PM</p>
          </div>
        </div>
      </div>

      {/* Multiplier Settings */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Zap className="h-5 w-5 text-yellow-500" />
          <h2 className="text-lg font-semibold">Multiplier (နိုင်ကြေး)</h2>
        </div>
        <p className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2">
          ⚠️ ပြောင်းလဲမှု — ထိုးပြီးသော ထိုးကြေးများ မပြောင်း၊ ပြောင်းပြီးနောက် ထိုးသော ထိုးကြေးများမှသာ အသစ်အသုံးပြုမည်
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Myanmar 2D ဆ</label>
            <div className="flex items-center gap-2">
              <input type="number" min="1" value={config["multiplier_2d"]} onChange={(e) => set("multiplier_2d", e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" />
              <span className="text-sm text-gray-500 whitespace-nowrap">ဆ</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">မူလ: 85 ဆ</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Myanmar 3D ဆ</label>
            <div className="flex items-center gap-2">
              <input type="number" min="1" value={config["multiplier_3d"]} onChange={(e) => set("multiplier_3d", e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" />
              <span className="text-sm text-gray-500 whitespace-nowrap">ဆ</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">မူလ: 600 ဆ</p>
          </div>
        </div>
      </div>

      {/* 3D Config */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Calendar className="h-5 w-5 text-purple-600" />
          <h2 className="text-lg font-semibold">Myanmar 3D Configuration</h2>
        </div>
        <Toggle value={config["3d_enabled"]} onChange={(v) => set("3d_enabled", v)}
          label="3D ဖွင့်မည် / ပိတ်မည်" desc="3D ထိုးကြေး တင်ခွင့် toggle" />
        <div>
          <p className="font-medium text-gray-800 mb-3 text-sm">3D ဖွင့်ရက်များ</p>
          <div className="flex flex-wrap gap-2">
            {DAYS.map((day) => (
              <button key={day} onClick={() => toggleDay(day)}
                className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-colors ${openDays.includes(day) ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                {DAY_LABELS[day]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Game Visibility */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <Eye className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-semibold">ဂိမ်းပြ / ဖျောက် (Home Page)</h2>
        </div>
        <Toggle value={config["show_dubai_2d"]} onChange={(v) => set("show_dubai_2d", v)} label="Dubai 2D" desc="Home page မှာ Dubai 2D card ပြမည် / ဖျောက်မည်" />
        <Toggle value={config["show_dubai_3d"]} onChange={(v) => set("show_dubai_3d", v)} label="Dubai 3D" desc="Home page မှာ Dubai 3D card ပြမည် / ဖျောက်မည်" />
        <Toggle value={config["show_mega_2d"]} onChange={(v) => set("show_mega_2d", v)} label="Mega 2D" desc="Home page မှာ Mega 2D card ပြမည် / ဖျောက်မည်" />
      </div>

      {/* Contact Info */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Phone className="h-5 w-5 text-green-600" />
          <h2 className="text-lg font-semibold">Contact Us ပြင်ဆင်ရန်</h2>
        </div>
        {[
          { key: "contact_facebook", label: "Facebook URL", placeholder: "https://www.facebook.com/..." },
          { key: "contact_viber", label: "Viber နံပါတ်", placeholder: "09XXXXXXXXX" },
          { key: "contact_phone", label: "Phone နံပါတ်", placeholder: "09XXXXXXXXX" },
          { key: "site_name", label: "Site Name", placeholder: "KM Fourteen" },
        ].map(({ key, label, placeholder }) => (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <input type="text" value={config[key] || ""} onChange={(e) => set(key, e.target.value)} placeholder={placeholder}
              className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
          </div>
        ))}
      </div>

      {/* Marquee Text */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <AlignLeft className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-semibold">Marquee ကြော်ငြာစာသား</h2>
        </div>
        <p className="text-xs text-gray-500">Home page အောက်ပိုင်းရှိ အပြာရောင် ပိတ်ဆောင်မှာ ပြသသော ရွေ့လျားသောစာ</p>
        <textarea
          rows={3}
          value={config["marquee_text"] || ""}
          onChange={(e) => set("marquee_text", e.target.value)}
          placeholder="Myanmar2D 85ဆ၊ Myanmar3D 600ဆ — ရောင်းပိတ်ချိန် မနက် 11:58 AM"
          className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
        />
        {config["marquee_text"] && (
          <div className="bg-blue-600 rounded-lg px-4 py-2 overflow-hidden">
            <p className="text-white text-xs truncate">Preview: {config["marquee_text"]}</p>
          </div>
        )}
      </div>

      {/* Banner & Logo Upload */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
        <div className="flex items-center gap-2 mb-1">
          <Image className="h-5 w-5 text-pink-600" />
          <h2 className="text-lg font-semibold">Banner / Logo ပြင်ဆင်ရန်</h2>
        </div>

        {/* Multi-banner grid */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Banner ပုံများ <span className="text-gray-400 font-normal">({banners.length} ပုံ)</span>
          </label>
          <p className="text-xs text-gray-400 mb-3">Home page slider + Popup modal နှစ်ခုလုံးမှာ ပြသည်။ ပုံများ ဖျက်မည်ဆိုရင် ❌ နှိပ်ပါ။</p>

          {/* Image grid */}
          {banners.length > 0 && (
            <div className="grid grid-cols-2 gap-2 mb-3">
              {banners.map((url, i) => (
                <div key={i} className="relative group rounded-xl overflow-hidden border">
                  <img src={url} alt={`Banner ${i + 1}`} className="w-full h-28 object-cover" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                    <button
                      onClick={() => handleDeleteBanner(i)}
                      className="opacity-0 group-hover:opacity-100 bg-red-500 text-white rounded-full p-1.5 shadow transition-opacity"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <span className="absolute top-1 left-1 bg-black/50 text-white text-[10px] rounded px-1">{i + 1}</span>
                </div>
              ))}
            </div>
          )}

          <input
            type="file" accept="image/*" ref={bannerRef} className="hidden"
            onChange={(e) => handleAddBanner(e.target.files[0])}
          />
          <button
            onClick={() => bannerRef.current.click()}
            disabled={uploadingBanner}
            className="w-full border-2 border-dashed border-pink-300 rounded-xl py-3 text-sm text-pink-600 hover:bg-pink-50 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Plus className="h-4 w-4" />
            {uploadingBanner ? "တင်နေသည်..." : "Banner ပုံ ထည့်မည်"}
          </button>
        </div>

        {/* Popup title + text */}
        <div className="border-t pt-4 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <MessageSquare className="h-4 w-4 text-indigo-500" />
            <p className="text-sm font-semibold text-gray-700">Popup Modal စာသား</p>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">ခေါင်းစဉ်</label>
            <input
              type="text"
              value={config["popup_title"] || ""}
              onChange={(e) => set("popup_title", e.target.value)}
              placeholder="အထူးကမ်းလှမ်းချက်!"
              className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">အကြောင်းအရာ</label>
            <input
              type="text"
              value={config["popup_text"] || ""}
              onChange={(e) => set("popup_text", e.target.value)}
              placeholder="ယနေ့ပဲ စတင်ကစားပါ!"
              className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
        </div>

        {/* Logo */}
        <div className="border-t pt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Site Logo ပုံ</label>
          {logoPreview && (
            <div className="flex items-center gap-3 mb-2">
              <img src={logoPreview} alt="Logo" className="w-14 h-14 rounded-full object-cover border" />
              <span className="text-sm text-gray-500">ယခု Logo</span>
            </div>
          )}
          <input type="file" accept="image/*" ref={logoRef} className="hidden" onChange={(e) => handleUploadLogo(e.target.files[0])} />
          <button onClick={() => logoRef.current.click()} disabled={uploadingLogo}
            className="w-full border-2 border-dashed border-blue-300 rounded-xl py-3 text-sm text-blue-600 hover:bg-blue-50 transition-colors disabled:opacity-50">
            {uploadingLogo ? "တင်နေသည်..." : "🖼️ Logo ပုံ ရွေးမည်"}
          </button>
        </div>
      </div>

      {msg && (
        <div className={`text-sm text-center rounded-xl py-2 ${msg.startsWith("Error") ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}>
          {msg}
        </div>
      )}

      <button onClick={handleSave} disabled={saving}
        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors disabled:opacity-50">
        <Save className="h-5 w-5" />
        {saving ? "Saving..." : "သိမ်းဆည်းမည်"}
      </button>
    </div>
  );
};

export default AdminSettings;
