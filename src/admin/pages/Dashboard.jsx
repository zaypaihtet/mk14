import React, { useEffect, useState } from "react";
import { Receipt, TicketCheck, UserCheck, Users, RadioTower, BanknoteArrowDown, BanknoteArrowUp } from "lucide-react";
import { api } from "../../utils/api";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.admin.getDashboard()
      .then((data) => setStats(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const cards = stats ? [
    { title: "Agents", icon: Users, color: "bg-orange-500", value: `Total: ${stats.agents}` },
    { title: "Users", icon: UserCheck, color: "bg-purple-500", value: `Total: ${stats.users}` },
    { title: "Deposit", icon: BanknoteArrowUp, color: "bg-fuchsia-500", value: `${Number(stats.deposits.total).toLocaleString()} MMK` },
    { title: "WithDraw", icon: BanknoteArrowDown, color: "bg-red-500", value: `${Number(stats.withdrawals.total).toLocaleString()} MMK` },
    { title: "MM 2D Today", icon: Receipt, color: "bg-yellow-500", value: `Total: ${stats.bets2d_today}` },
    { title: "MM 3D Total", icon: TicketCheck, color: "bg-gray-500", value: `Total: ${stats.bets3d_total}` },
  ] : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening.</p>
      </div>

      {loading && <p className="text-gray-500">Loading...</p>}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {stats && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 rounded-2xl bg-blue-500">
                <RadioTower className="h-6 w-6 text-white" />
              </div>
              <p className="text-3xl font-medium text-gray-600">{stats.bets2d_today}</p>
            </div>
            <p className="font-medium text-gray-600 p-3 text-xl">2D live</p>
          </div>
        )}
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-3 rounded-2xl ${card.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <p className="text-xl font-medium text-gray-600">{card.title}</p>
              </div>
              <p className="font-medium text-gray-600 p-3">{card.value}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
