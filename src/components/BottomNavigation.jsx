import { Link, useLocation } from "react-router-dom";
import { Home, Wallet, Bell, User } from "lucide-react";
import { useEffect, useState } from "react";
import { api, isLoggedIn } from "../utils/api";

const BottomNavigation = () => {
  const location  = useLocation();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (!isLoggedIn()) return;
    const fetchCount = () => {
      api.getNotificationCount()
        .then((d) => setUnread(d.count || 0))
        .catch(() => {});
    };
    fetchCount();
    const interval = setInterval(fetchCount, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, []);

  // Reset count when navigating to notifications
  useEffect(() => {
    if (location.pathname === "/notifications") setUnread(0);
  }, [location.pathname]);

  const navItems = [
    { path: "/", icon: Home, label: "ပင်မ", testId: "nav-home" },
    { path: "/wallet", icon: Wallet, label: "ပိုက်ဆံအိတ်", testId: "nav-wallet" },
    { path: "/notifications", icon: Bell, label: "အသိပေးချက်", testId: "nav-notifications", badge: unread },
    { path: "/profile", icon: User, label: "ကျွန်ုပ်", testId: "nav-profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30 max-w-[500px] mx-auto">
      <div className="grid grid-cols-4 h-14">
        {navItems.map(({ path, icon: Icon, label, testId, badge }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center justify-center py-1 transition-colors ${
                isActive ? "text-blue-600" : "text-gray-400 hover:text-gray-700"
              }`}
              data-testid={testId}
            >
              <div className="relative">
                <Icon className="w-6 h-6 mb-1" />
                {badge > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-0.5 leading-none">
                    {badge > 99 ? "99+" : badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;
