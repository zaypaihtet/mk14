import { useState } from "react";
import LotteryCarousel from "../components/LotteryCarousel";
import Header from "../components/Header";
import LotteryResults from "../components/LotteryResults";
import BottomNavigation from "../components/BottomNavigation";
import AdsModal from "../components/AdsModal";
import NotificationModal from "../components/NotificationModal";
import { Link } from "react-router";
import ContactComponent from "../components/ContactComponent";
import { isLoggedIn } from "../utils/api";

const Home = () => {
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const loggedIn = isLoggedIn();

  return (
    <div className="min-h-screen bg-gray-200 flex justify-center">
      <div className="w-full max-w-[500px] mx-auto bg-white min-h-screen pb-20">
        <Header />

        {!loggedIn && (
          <div className="flex items-center justify-center gap-4 p-2">
            <Link
              to="/login"
              className="flex items-center space-x-3 px-4 py-2 bg-blue-400 rounded-lg hover:bg-blue-300 transition-colors"
            >
              အကောင့်ဝင်မည်။
            </Link>
            <Link
              to="/register"
              className="flex items-center space-x-3 px-4 py-2 bg-blue-400 rounded-lg hover:bg-blue-300 transition-colors"
            >
              အကောင့်ဖွင့်မည်။
            </Link>
          </div>
        )}

        <LotteryCarousel />

        <div className="bg-blue-600 text-white p-4">
          <div className="overflow-hidden whitespace-nowrap">
            <div className="inline-flex animate-marquee">
              <p className="text-sm font-medium px-8">
                Myanmar2D 85ဆ၊ Myanmar3D 600ဆ၊ တွတ်ပတ်လည် 10ဆ၊ Dubai2D 85ဆ၊
                Myanmar2D ရောင်းပိတ်ချိန် - နံနက် 11:58 AM၊ ညနေ အရောင်းပိတ်ချိန်
                3:58 PM
              </p>
              <p className="text-sm font-medium px-8" aria-hidden="true">
                Myanmar2D 85ဆ၊ Myanmar3D 600ဆ၊ တွတ်ပတ်လည် 10ဆ၊ Dubai2D 85ဆ၊
                Myanmar2D ရောင်းပိတ်ချိန် - နံနက် 11:58 AM၊ ညနေ အရောင်းပိတ်ချိန်
                3:58 PM
              </p>
            </div>
          </div>
        </div>

        <main className="p-4 space-y-6">
          <LotteryResults />
          <section className="bg-gray-100 rounded-xl">
            <ContactComponent />
          </section>
        </main>

        <BottomNavigation />
        <AdsModal />
        <NotificationModal
          isOpen={showNotificationModal}
          onClose={() => setShowNotificationModal(false)}
          onSubscribe={() => setShowNotificationModal(false)}
        />
      </div>
    </div>
  );
};

export default Home;
