import { Download, User, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { isLoggedIn, removeToken } from "../utils/api";

const Header = () => {
  const navigate = useNavigate();
  const loggedIn = isLoggedIn();
  const user = loggedIn ? JSON.parse(localStorage.getItem("user") || "{}") : null;

  const handleLogout = () => {
    removeToken();
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40 max-w-[500px] mx-auto">
      <div className="flex items-center justify-between p-4">
        <Link to="/" className="flex items-center space-x-3">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTkTlQyP-8xxuQhHXyv0-N46Xbs6jTcD8LCfA&s"
            alt="Logo"
            className="w-10 h-10 rounded-full"
          />
          <h1 className="text-lg font-bold text-blue-600">KM Fourteen</h1>
        </Link>
        {loggedIn ? (
          <div className="flex items-center gap-2">
            <Link to="/profile" className="flex items-center gap-1 text-sm text-blue-600 font-medium">
              <User size={16} />
              {user?.name?.split(" ")[0]}
            </Link>
            <button onClick={handleLogout} className="p-1 text-gray-400 hover:text-red-500">
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <button className="bg-blue-200 text-blue-600 px-3 py-1 rounded hover:bg-white/80 flex items-center gap-2">
            App <Download size={16} />
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
