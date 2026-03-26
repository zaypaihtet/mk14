import React, { useEffect, useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router";
import {
  Home, FileText, Users, LogOut, Menu, X,
  BanknoteArrowUp, BanknoteArrowDown, RadioTower, Settings, UserCog,
} from "lucide-react";
import { removeToken } from "../utils/api";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Auth guard — redirect to admin login if not logged in or not admin
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const token = localStorage.getItem("token");
    if (!token || !user || user.role !== "admin") {
      navigate("/admin/login", { replace: true });
    }
  }, []);

  const handleLogout = () => {
    removeToken();
    localStorage.removeItem("user");
    navigate("/admin/login", { replace: true });
  };

  const menuItems = [
    { path: "/admin/dashboard", icon: Home, label: "Dashboard" },
    { path: "/admin/mm2d", icon: RadioTower, label: "MM 2D" },
    { path: "/admin/agents", icon: UserCog, label: "Agents" },
    { path: "/admin/users", icon: Users, label: "Users" },
    { path: "/admin/deposit", icon: BanknoteArrowUp, label: "Deposit" },
    { path: "/admin/withdraw", icon: BanknoteArrowDown, label: "Withdraw" },
    { path: "/admin/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="flex items-center justify-between p-4 border-b">
          <Link to="/admin/dashboard" className="text-xl font-bold text-indigo-600">KM Fourteen</Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2 rounded-md hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center px-4 py-3 text-sm font-medium transition-colors ${
                  isActive ? "bg-indigo-50 text-indigo-700 border-r-2 border-indigo-700" : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-full border-t p-4">
          <button
            onClick={() => setShowConfirm(true)}
            className="flex items-center w-full px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 lg:ml-0 min-w-0">
        <header className="bg-white shadow-sm border-b px-4 py-4">
          <div className="flex items-center justify-between">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-md hover:bg-gray-100">
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-bold">A</div>
              <span className="text-sm font-medium text-gray-700">Admin</span>
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>

      {/* Logout confirm modal */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-2xl p-6 shadow-xl w-72 text-center">
            <h2 className="text-lg font-semibold mb-2">Sign Out?</h2>
            <p className="text-gray-500 text-sm mb-6">Admin panel မှ ထွက်မှာ သေချာပါသလား?</p>
            <div className="flex gap-3">
              <button onClick={() => setShowConfirm(false)} className="flex-1 py-2 bg-gray-100 rounded-xl text-sm hover:bg-gray-200">မထွက်ပါ</button>
              <button onClick={() => { setShowConfirm(false); handleLogout(); }} className="flex-1 py-2 bg-red-500 text-white rounded-xl text-sm hover:bg-red-600">ထွက်မည်</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLayout;
