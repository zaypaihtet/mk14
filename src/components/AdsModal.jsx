import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { apiFetch } from "../utils/api";

const TODAY_KEY = "ads_shown_date";

const AdsModal = () => {
  const [isOpen, setIsOpen]       = useState(false);
  const [bannerUrl, setBannerUrl] = useState("");
  const [title, setTitle]         = useState("အထူးကမ်းလှမ်းချက်!");
  const [text, setText]           = useState("ယနေ့ပဲ စတင်ကစားပါ!");

  useEffect(() => {
    apiFetch("/api/config")
      .then((r) => r.json())
      .then((data) => {
        // Pick first banner from banner_urls array, fallback to banner_url
        try {
          const urls = JSON.parse(data?.banner_urls || "[]");
          if (urls.length > 0) setBannerUrl(urls[0]);
          else if (data?.banner_url) setBannerUrl(data.banner_url);
        } catch {
          if (data?.banner_url) setBannerUrl(data.banner_url);
        }
        if (data?.popup_title) setTitle(data.popup_title);
        if (data?.popup_text)  setText(data.popup_text);
      })
      .catch(() => {});

    const today     = new Date().toISOString().slice(0, 10);
    const lastShown = localStorage.getItem(TODAY_KEY);
    if (lastShown !== today) {
      const timer = setTimeout(() => setIsOpen(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem(TODAY_KEY, new Date().toISOString().slice(0, 10));
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 max-w-[500px] mx-auto"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-2xl p-6 m-4 max-w-sm w-full relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={handleClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 p-1">
          <X className="w-6 h-6" />
        </button>
        <div className="text-center">
          {bannerUrl && (
            <img src={bannerUrl} alt="Popup Banner" className="w-full h-48 object-cover rounded-xl mb-4" />
          )}
          {title && <h3 className="text-xl font-bold mb-2 text-blue-600">{title}</h3>}
          {text  && <p className="text-gray-500 mb-4">{text}</p>}
          <button
            onClick={handleClose}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold w-full hover:scale-105 transition-transform"
          >
            ပိတ်မည်
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdsModal;
