const BASE_URL = import.meta.env.VITE_API_URL || "/api";
const APP_KEY = import.meta.env.VITE_APP_HEADER_SECRET || "6230fb95f27b1b92aa6e3a670563e71f26f9c70c639e4aba8886deb279e32029";

const getToken = () => localStorage.getItem("token");

const headers = (isFormData = false) => {
  const h = { "x-app-key": APP_KEY };
  if (!isFormData) h["Content-Type"] = "application/json";
  const token = getToken();
  if (token) h["Authorization"] = `Bearer ${token}`;
  return h;
};

const request = async (method, path, body = null, isFormData = false) => {
  const options = { method, headers: headers(isFormData) };
  if (body) options.body = isFormData ? body : JSON.stringify(body);
  const res = await fetch(`${BASE_URL}${path}`, options);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
};

export const api = {
  // Auth
  login: (phone, password) => request("POST", "/auth/login", { phone, password }),
  register: (name, phone, password) => request("POST", "/auth/register", { name, phone, password }),
  getMe: () => request("GET", "/auth/me"),
  changePassword: (oldPassword, newPassword) => request("PUT", "/auth/change-password", { oldPassword, newPassword }),

  // Wallet
  getBalance: () => request("GET", "/wallet/balance"),
  submitDeposit: (formData) => request("POST", "/wallet/deposit", formData, true),
  submitWithdraw: (data) => request("POST", "/wallet/withdraw", data),
  getTransactions: () => request("GET", "/wallet/transactions"),

  // Lottery
  getResults2D: () => request("GET", "/lottery/results/2d"),
  getResults3D: () => request("GET", "/lottery/results/3d"),
  placeBet2D: (numbers, amount, session) => request("POST", "/lottery/bet/2d", { numbers, amount, session }),
  placeBet3D: (numbers, amount) => request("POST", "/lottery/bet/3d", { numbers, amount }),
  getBettingHistory2D: () => request("GET", "/lottery/history/2d"),
  getBettingHistory3D: () => request("GET", "/lottery/history/3d"),

  // Notifications
  getNotifications: () => request("GET", "/notifications"),
  markNotificationRead: (id) => request("PUT", `/notifications/${id}/read`),
  markAllRead: () => request("PUT", "/notifications/read-all"),
  getNotificationCount: (since) => request("GET", `/notifications/count${since ? `?since=${encodeURIComponent(since)}` : ""}`),

  // Winners
  getWinners2D: () => request("GET", "/lottery/winners/2d"),

  // Holiday check (public)
  isHoliday: (date) => request("GET", `/lottery/is-holiday${date ? `?date=${date}` : ""}`),
  getUpcomingHolidays: () => request("GET", "/lottery/upcoming-holidays"),

  // Config (public - no auth required)
  getConfig: () => request("GET", "/config"),

  // Admin
  admin: {
    getDashboard: () => request("GET", "/admin/dashboard"),
    getConfig: () => request("GET", "/admin/config"),
    updateConfig: (data) => request("PUT", "/admin/config", data),
    getUsers: () => request("GET", "/admin/users"),
    getAgents: () => request("GET", "/admin/agents"),
    createAgent: (data) => request("POST", "/admin/agents", data),
    banUser: (id) => request("PATCH", `/admin/users/${id}/ban`),
    deleteUser: (id) => request("DELETE", `/admin/users/${id}`),
    getDeposits: () => request("GET", "/admin/deposits"),
    updateDepositStatus: (id, status) => request("PATCH", `/admin/deposits/${id}/status`, { status }),
    getWithdrawals: () => request("GET", "/admin/withdrawals"),
    updateWithdrawalStatus: (id, status) => request("PATCH", `/admin/withdrawals/${id}/status`, { status }),
    getBets2D: () => request("GET", "/admin/bets/2d"),
    publishResult2D: (data) => request("POST", "/admin/results/2d", data),
    publishResult3D: (data) => request("POST", "/admin/results/3d", data),
    getNotifications: () => request("GET", "/admin/notifications"),
    sendNotification: (data) => request("POST", "/notifications", data),
    deleteNotification: (id) => request("DELETE", `/admin/notifications/${id}`),
    uploadBanner: (formData) => request("POST", "/admin/upload/banner", formData, true),
    uploadLogo: (formData) => request("POST", "/admin/upload/logo", formData, true),
    addBanner: (formData) => request("POST", "/admin/upload/banners", formData, true),
    deleteBanner: (index) => request("DELETE", `/admin/banners/${index}`),
    getHolidays: () => request("GET", "/admin/holidays"),
    addHoliday: (data) => request("POST", "/admin/holidays", data),
    deleteHoliday: (id) => request("DELETE", `/admin/holidays/${id}`),
    getNumberLimits2D: () => request("GET", "/admin/number-limits/2d"),
    updateNumberLimits2D: (updates) => request("PUT", "/admin/number-limits/2d", { updates }),
    setGlobalLimit2D: (day_limit) => request("PATCH", "/admin/number-limits/2d/global", { day_limit }),
    testTelegram: () => request("POST", "/admin/telegram/test"),
  },

  // Number status (public — no auth)
  getNumberStatus2D: () => request("GET", "/lottery/number-status/2d"),
};

// Drop-in fetch replacement that adds the security header automatically
export const apiFetch = (url, options = {}) => {
  const mergedHeaders = { "x-app-key": APP_KEY, ...(options.headers || {}) };
  return fetch(url, { ...options, headers: mergedHeaders });
};

export const setToken = (token) => localStorage.setItem("token", token);
export const removeToken = () => localStorage.removeItem("token");
export const isLoggedIn = () => !!getToken();
