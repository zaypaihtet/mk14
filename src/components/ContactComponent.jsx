import React from "react";
import { FacebookIcon, Phone, PhoneCallIcon } from "lucide-react";
const ContactComponent = () => {
  return (
    <section className="bg-gray-100 rounded-xl p-4 space-y-3">
      <h3
        className="text-xl font-semibold mb-4 text-center text-gray-700"
        data-testid="text-contact-title"
      >
        Contact Us
      </h3>

      <a
        className="flex items-center space-x-3 p-3 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
        data-testid="link-facebook"
      >
        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
          <FacebookIcon className="text-white size-5" />
        </div>
        <div>
          <p className="text-sm text-gray-500">Facebook :</p>
          <p className="font-medium">https://www.facebook.com/fff</p>
        </div>
      </a>

      <a
        href="viber://chat/?number=959987654343"
        className="flex items-center space-x-3 p-3 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
        data-testid="link-viber"
      >
        <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
          <PhoneCallIcon className="text-white size-5" />
        </div>
        <div>
          <p className="text-sm text-gray-500">Viber :</p>
          <p className="font-medium">959987654343</p>
        </div>
      </a>

      <a
        className="flex items-center space-x-3 p-3 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
        data-testid="link-phone"
      >
        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
          <Phone className="text-white size-5" />
        </div>
        <div>
          <p className="text-sm text-gray-500">Call :</p>
          <p className="font-medium">959987654343</p>
        </div>
      </a>
    </section>
  );
};

export default ContactComponent;
