import React, { useEffect, useState, useRef } from "react";
import { Receipt, TicketCheck, UserCheck, Users, RadioTower, BanknoteArrowDown, BanknoteArrowUp } from "lucide-react";
import { api, apiFetch } from "../../utils/api";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liveData, setLiveData] = useState(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    api.admin.getDashboard()
      .then((data) => setStats(data))
      .catch(() => {})
      .finally(() => setLoading(false));

    const fetchLive = async () => {
      try {
        const res = await apiFetch("/api/lottery/live/2d");
        if (res.ok) setLiveData(await res.json());
      } catch {}
    };
    fetchLive();
    intervalRef.current = setInterval(fetchLive, 1000);
    return () => clearInterval(intervalRef.current);
  }, []);

  const liveNumber = liveData?.data?.live ?? "--";
  const liveSet    = liveData?.data?.live_set ?? "";
  const liveVal    = liveData?.data?.live_val ?? "";

  const cards = stats ? [
    { title: "Agents", icon: Users, color: "bg-orange-500", value: `Total: ${stats.agents}` },
    { title: "Users", icon: UserCheck, color: "bg-purple-500", value: `Total: ${stats.users}` },
    { title: "Deposit", icon: BanknoteArrowUp, color: "bg-fuchsia-500", value: `${Number(stats.deposits?.total || 0).toLocaleString()} MMK` },
    { title: "WithDraw", icon: BanknoteArrowDown, color: "bg-red-500", value: `${Number(stats.withdrawals?.total || 0).toLocaleString()} MMK` },
    { title: "MM 2D Today", icon: Receipt, color: "bg-yellow-500", value: `Total: ${stats.bets2d_today}` },
    { title: "MM 3D Total", icon: TicketCheck, color: "bg-gray-500", value: `Total: ${stats.bets3d_total}` },
  ] : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Welcome back! Here's what's happening.</p>
      </div>

      {loading && <p className="text-gray-400">Loading...</p>}

      {/* Live 2D Hero */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-2 mb-2">
          <RadioTower className="h-5 w-5 animate-pulse" />
          <span className="text-sm font-medium text-blue-100">Myanmar 2D — Live</span>
        </div>
        <div className="text-7xl font-bold tracking-widest">{liveNumber}</div>
        {liveSet && <div className="mt-2 text-sm text-blue-200">Set: {liveSet} &nbsp;|&nbsp; Val: {liveVal}</div>}
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2.5 rounded-xl ${card.color}`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
              </div>
              <p className="text-lg font-semibold text-gray-800">{card.value}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
