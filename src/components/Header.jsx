import { Download } from "lucide-react";
import { Link } from "react-router";

const Header = () => {
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
        <button className="bg-blue-200 text-blue-600 px-3 py-1 rounded hover:bg-white/80 flex items-center gap-2">
          App <Download size={16} />
        </button>
      </div>
    </header>
  );
};

export default Header;
