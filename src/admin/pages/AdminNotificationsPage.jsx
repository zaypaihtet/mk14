import React, { useState, useEffect } from "react";
import { Bell, Send, Users, User, CheckCircle2, XCircle, Trash2 } from "lucide-react";
import { api } from "../../utils/api";

const AdminNotificationsPage = () => {
  const [title, setTitle]     = useState("");
  const [message, setMessage] = useState("");
  const [targetType, setTargetType] = useState("all"); // "all" | "user"
  const [userId, setUserId]   = useState("");
  const [users, setUsers]     = useState([]);
  const [sending, setSending] = useState(false);
  const [toast, setToast]     = useState(null);
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    api.admin.getUsers()
      .then(setUsers)
      .catch(() => {});
    fetchHistory();
  }, []);

  const fetchHistory = () => {
    setLoadingHistory(true);
    api.admin.getNotifications()
      .then(setHistory)
      .catch(() => {})
      .finally(() => setLoadingHistory(false));
  };

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSend = async () => {
    if (!title.trim() || !message.trim()) {
      showToast("error", "Title နှင့် Message ဖြည့်ပါ");
      return;
    }
    if (targetType === "user" && !userId) {
      showToast("error", "User ရွေးချယ်ပါ");
      return;
    }
    setSending(true);
    try {
      await api.admin.sendNotification({
        title: title.trim(),
        message: message.trim(),
        user_id: targetType === "all" ? null : parseInt(userId),
      });
      showToast("success", targetType === "all" ? "အားလုံးသို့ ပို့ပြီးပါပြီ" : "User ထံ ပို့ပြီးပါပြီ");
      setTitle("");
      setMessage("");
      setUserId("");
      fetchHistory();
    } catch (err) {
      showToast("error", err.message || "ပေးပို့မရသေးပါ");
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.admin.deleteNotification(id);
      setHistory((prev) => prev.filter((n) => n.id !== id));
    } catch {
      showToast("error", "ဖျက်မရသေးပါ");
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-white text-sm ${toast.type === "success" ? "bg-green-600" : "bg-red-600"}`}>
          {toast.type === "success" ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-3">
        <Bell className="h-6 w-6 text-indigo-600" />
        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
      </div>

      {/* Compose box */}
      <div className="bg-white rounded-2xl shadow p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">အကြောင်းကြားချက် ပေးပို့ရန်</h2>

        {/* Target toggle */}
        <div className="flex rounded-xl overflow-hidden border border-gray-200">
          <button
            onClick={() => { setTargetType("all"); setUserId(""); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors ${targetType === "all" ? "bg-indigo-600 text-white" : "bg-gray-50 text-gray-600 hover:bg-gray-100"}`}
          >
            <Users className="h-4 w-4" /> အားလုံးသို့
          </button>
          <button
            onClick={() => setTargetType("user")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors ${targetType === "user" ? "bg-indigo-600 text-white" : "bg-gray-50 text-gray-600 hover:bg-gray-100"}`}
          >
            <User className="h-4 w-4" /> User တစ်ဦးသို့
          </button>
        </div>

        {/* User selector */}
        {targetType === "user" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">User ရွေးပါ</label>
            <select
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="">-- User ရွေးချယ်ပါ --</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.phone})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ခေါင်းစဉ် (Title)</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="ဥပမာ: ငွေသွင်း အောင်မြင်သည်"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">မက်ဆေ့ (Message)</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="အကြောင်းကြားချက် ရေးပါ..."
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        <button
          onClick={handleSend}
          disabled={sending}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white py-3 rounded-xl font-medium text-sm transition-colors"
        >
          <Send className="h-4 w-4" />
          {sending ? "ပေးပို့နေသည်..." : "ပေးပို့မည်"}
        </button>
      </div>

      {/* Sent history */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">ပို့ပြီးသော မှတ်တမ်းများ</h2>
        {loadingHistory && <p className="text-center text-gray-400 py-6">Loading...</p>}
        {!loadingHistory && history.length === 0 && (
          <p className="text-center text-gray-400 py-6">မှတ်တမ်း မရှိသေးပါ</p>
        )}
        <div className="space-y-3">
          {history.map((n) => (
            <div key={n.id} className="flex items-start gap-3 border border-gray-100 rounded-xl p-4">
              <Bell className="h-5 w-5 text-indigo-500 mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <p className="font-semibold text-sm text-gray-900">{n.title}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ml-2 shrink-0 ${n.user_id ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}`}>
                    {n.user_id ? `User #${n.user_id}` : "အားလုံး"}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1 break-words">{n.message}</p>
                <p className="text-xs text-gray-400 mt-1">{new Date(n.created_at).toLocaleString()}</p>
              </div>
              <button
                onClick={() => handleDelete(n.id)}
                className="text-gray-300 hover:text-red-500 transition-colors shrink-0"
                title="ဖျက်မည်"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminNotificationsPage;
