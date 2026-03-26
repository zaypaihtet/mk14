import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import BottomNavigation from "../components/BottomNavigation";
import { api, isLoggedIn } from "../utils/api";

const NotificationsPage = () => {
  const [expandedId, setExpandedId] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoggedIn()) {
      api.getNotifications()
        .then((data) => setNotifications(data))
        .catch(() => setNotifications([]))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen pb-20 bg-blue-50 mx-auto">
      <Header />
      <div className="space-y-3 p-4">
        {loading && <p className="text-center text-gray-500">Loading...</p>}
        {!loading && notifications.length === 0 && (
          <p className="text-center text-gray-500 mt-10">အကြောင်းကြားချက် မရှိသေးပါ</p>
        )}
        {notifications.map((item) => {
          const isExpanded = expandedId === item.id;
          return (
            <div
              key={item.id}
              className="grid grid-cols-8 gap-4 items-center bg-blue-400 border border-gray-300 p-4 rounded-xl shadow"
            >
              <div className="col-span-1">
                <img src="/images/media.png" alt="" className="invert size-7" />
              </div>
              <div className="col-span-7 space-y-2">
                <h2 className="font-semibold text-gray-800 mb-1">{item.title}</h2>
                <hr />
                <p className="text-sm text-white">
                  {!isExpanded ? item.message.slice(0, 80) + (item.message.length > 80 ? "..." : "") : item.message}
                </p>
                <div className="mt-2 flex justify-between items-center text-sm">
                  <p>{new Date(item.created_at).toLocaleDateString()}</p>
                  {item.message.length > 80 && (
                    <button className="text-blue-200 underline" onClick={() => setExpandedId(isExpanded ? null : item.id)}>
                      {isExpanded ? "Show Less" : "Show More"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <BottomNavigation />
    </div>
  );
};

export default NotificationsPage;
