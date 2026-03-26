import React, { useState } from "react";
import Header from "../components/Header";
import BottomNavigation from "../components/BottomNavigation";

const notificationsData = [
  {
    id: 1,
    title: "Myanmar 2D3D Live",
    date: "2025-09-04",
    description: "Check out the app here:",
    link: "https://play.google.com/store/apps/details?id=network.kalock.myanmar2d",
  },
  {
    id: 2,
    title: "Shwe 2D Live",
    date: "2025-09-04",
    description: "Download the APK from MediaFire:",
    link: "https://www.mediafire.com/file/0jm5hjqj4kqzq3k/Shwe2D_Myanmar_Live_8.0.0_APKPure.apk/file",
  },
  {
    id: 3,
    title: "Dubai 2D Live",
    date: "2025-09-04",
    description: "Check the Google Play link:",
    link: "https://www.mediafire.com/file/0jm5hjqj4kqzq3k/Shwe2D_Myanmar_Live_8.0.0_APKPure.apk/file",
  },
  {
    id: 4,
    title: "ကော်မရှင်စား Agent အကောင့်ဖွင့်ရန် ဘာတွေလိုအပ်ပါသလဲ?",
    date: "2025-09-04",
    description:
      "Agentအကောင့်ဖွင့်ရန် လိုအပ်သည်အချက်များ 1️⃣နာမည် 2️⃣ဖုန်းနံပါတ် 3️⃣စကားဝှက် 8 လုံး အထက်ပါအချက်အလက်များကို Viber 09900000000 သို့ ပို့ပေးပြီး Agent အကောင့်ဖွင့် ခိုင်းနိူင်ပါတယ်။",
    link: null,
  },
];

const NotificationsPage = () => {
  const [expandedId, setExpandedId] = useState(null);

  return (
    <div className="min-h-screen pb-20 bg-blue-50 mx-auto">
      <Header />
      <div className="space-y-3 p-4">
        {notificationsData.map((item) => {
          const isExpanded = expandedId === item.id;
          const shouldTruncate = !isExpanded;

          return (
            <div
              key={item.id}
              className="grid grid-cols-8 gap-4 items-center bg-blue-400 border border-gray-300 p-4 rounded-xl shadow"
            >
              <div className="col-span-1">
                <img src="/images/media.png" alt="" className="invert size-7" />
              </div>
              <div className="col-span-7 space-y-2">
                <h2 className="font-semibold text-gray-800 mb-1">
                  {item.title}
                </h2>
                <hr />
                {/* Description */}
                <p className="text-sm text-white">
                  {shouldTruncate
                    ? item.description.slice(0, 80) +
                      (item.description.length > 80 ? "..." : "")
                    : item.description}
                </p>

                {item.link && (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-200 underline text-sm block break-words"
                  >
                    {shouldTruncate
                      ? item.link.slice(0, 40) +
                        (item.link.length > 40 ? "..." : "")
                      : item.link}
                  </a>
                )}

                {/* Date + Show More/Less */}
                <div className="mt-2 flex justify-between items-center text-sm">
                  <p>{item.date}</p>
                  {item.description.length > 80 ||
                  (item.link && item.link.length > 60) ? (
                    <button
                      className="text-blue-200 underline"
                      onClick={() => setExpandedId(isExpanded ? null : item.id)}
                    >
                      {isExpanded ? "Show Less" : "Show More"}
                    </button>
                  ) : null}
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
