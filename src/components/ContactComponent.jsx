import React, { useEffect, useState } from "react";
import { FacebookIcon, Phone, PhoneCallIcon } from "lucide-react";
import { api } from "../utils/api";

const ContactComponent = () => {
  const [cfg, setCfg] = useState({
    contact_facebook: "",
    contact_viber: "",
    contact_phone: "",
  });

  useEffect(() => {
    api.getConfig().catch(() => {}).then((data) => {
      if (data) setCfg((prev) => ({ ...prev, ...data }));
    });
  }, []);

  const facebookUrl  = cfg.contact_facebook || "https://www.facebook.com/fff";
  const viberNumber  = cfg.contact_viber || "959987654343";
  const phoneNumber  = cfg.contact_phone || "959987654343";

  return (
    <section className="bg-gray-100 rounded-xl p-4 space-y-3">
      <h3 className="text-xl font-semibold mb-4 text-center text-gray-700">Contact Us</h3>

      <a href={facebookUrl} target="_blank" rel="noreferrer"
        className="flex items-center space-x-3 p-3 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors">
        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
          <FacebookIcon className="text-white size-5" />
        </div>
        <div>
          <p className="text-sm text-gray-500">Facebook :</p>
          <p className="font-medium truncate max-w-[220px]">{facebookUrl}</p>
        </div>
      </a>

      <a href={`viber://chat/?number=${viberNumber}`}
        className="flex items-center space-x-3 p-3 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors">
        <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
          <PhoneCallIcon className="text-white size-5" />
        </div>
        <div>
          <p className="text-sm text-gray-500">Viber :</p>
          <p className="font-medium">{viberNumber}</p>
        </div>
      </a>

      <a href={`tel:${phoneNumber}`}
        className="flex items-center space-x-3 p-3 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors">
        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
          <Phone className="text-white size-5" />
        </div>
        <div>
          <p className="text-sm text-gray-500">Call :</p>
          <p className="font-medium">{phoneNumber}</p>
        </div>
      </a>
    </section>
  );
};

export default ContactComponent;
