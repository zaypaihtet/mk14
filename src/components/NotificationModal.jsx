
const NotificationModal = ({ isOpen, onClose, onSubscribe }) => {
  if (!isOpen) return null;

  const handleSubscribe = () => {
    alert("အသိပေးချက်များအတွက် စာရင်းသွင်းပြီးပါပြီ!");
    onSubscribe();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
      onClick={onClose}
      data-testid="modal-notification-overlay"
    >
      <div
        className="bg-white rounded-2xl p-6 m-4 max-w-sm w-full relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center">
          {/* Icon */}
          <div className="w-16 h-16 mx-auto mb-4 bg-blue-600 rounded-full flex items-center justify-center">
            <img
              src="https://img.onesignal.com/permanent/4ad99df0-fc53-4cd3-a89b-30c8326af5c8/M60L0mqYRduy0kDitpnn_logo.png"
              alt="notification icon"
              className="w-8 h-8"
              data-testid="img-notification-icon"
            />
          </div>

          {/* Title */}
          <h3
            className="text-lg font-semibold mb-2 text-gray-800"
            data-testid="text-notification-title"
          >
            သတင်းအချက်အလက်များ
          </h3>

          {/* Description */}
          <p
            className="text-gray-500 mb-6 text-sm"
            data-testid="text-notification-description"
          >
            Subscribe to our notifications for the latest news and updates. You
            can disable anytime.
          </p>

          {/* Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={handleSubscribe}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold flex-1 hover:scale-105 transition-transform"
              data-testid="button-subscribe-notifications"
            >
              Subscribe
            </button>
            <button
              onClick={onClose}
              className="border border-gray-300 text-gray-500 px-6 py-3 rounded-xl font-semibold flex-1 hover:bg-gray-100 transition-colors"
              data-testid="button-notification-later"
            >
              Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
