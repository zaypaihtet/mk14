import { useState, useEffect } from "react";
import { X } from "lucide-react";

const AdsModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsOpen(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => setIsOpen(false);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 max-w-[500px] mx-auto"
      onClick={handleClose}
      data-testid="modal-ads-overlay"
    >
      <div
        className="bg-white rounded-2xl p-6 m-4 max-w-sm w-full relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl p-1 bg-transparent border-0"
          data-testid="button-close-ads"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Content */}
        <div className="text-center">
          <img
            src="https://happy2d.com/static/media/ads02.1546a184d54b2ea209ff.jpg"
            alt="Ads Popup"
            className="w-full h-48 object-cover rounded-xl mb-4"
            data-testid="img-ads-banner"
          />

          <h3
            className="text-xl font-bold mb-2 text-blue-600"
            data-testid="text-ads-title"
          >
            အထူးကမ်းလှမ်းချက်!
          </h3>
          <p
            className="text-gray-500 mb-4"
            data-testid="text-ads-description"
          >
            ယနေ့ပဲ စတင်ကစားပါ!
          </p>

          <button
            onClick={handleClose}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold w-full hover:scale-105 transition-transform"
            data-testid="button-close-ads-action"
          >
            ပိတ်မည်
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdsModal;
