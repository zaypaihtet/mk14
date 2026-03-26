import { Link, useLocation } from "react-router-dom";
import { Home, Wallet, Bell, User } from "lucide-react";

const BottomNavigation = () => {
  const location = useLocation();

  const navItems = [
    { path: "/", icon: Home, label: "ပင်မ", testId: "nav-home" },
    { path: "/wallet", icon: Wallet, label: "ပိုက်ဆံအိတ်", testId: "nav-wallet" },
    { path: "/notifications", icon: Bell, label: "အသိပေးချက်", testId: "nav-notifications" },
    { path: "/profile", icon: User, label: "ကျွန်ုပ်", testId: "nav-profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30 max-w-[500px] mx-auto">
      <div className="grid grid-cols-4 h-14">
        {navItems.map(({ path, icon: Icon, label, testId }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center justify-center py-1 transition-colors ${
                isActive
                  ? "text-blue-600"
                  : "text-gray-400 hover:text-gray-700"
              }`}
              data-testid={testId}
            >
              <Icon className="w-6 h-6 mb-1" />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;
