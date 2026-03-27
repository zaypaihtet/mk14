import React, { useEffect, useState } from "react";
import { FacebookIcon, Phone, PhoneCallIcon } from "lucide-react";
import { api } from "../utils/api";

const ContactComponent = () => {
  const [cfg, setCfg] = useState({
    contact_facebook: "",
    contact_viber: "",
    contact_phone: "",
  });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    api.getConfig()
      .then((data) => { if (data) setCfg((prev) => ({ ...prev, ...data })); })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  const hasFacebook = loaded && !!cfg.contact_facebook;
  const hasViber    = loaded && !!cfg.contact_viber;
  const hasPhone    = loaded && !!cfg.contact_phone;

  if (loaded && !hasFacebook && !hasViber && !hasPhone) return null;

  return (
    <section className="bg-gray-100 rounded-xl p-4 space-y-3">
      <h3 className="text-xl font-semibold mb-4 text-center text-gray-700">Contact Us</h3>

      {hasFacebook && (
        <a href={cfg.contact_facebook} target="_blank" rel="noreferrer"
          className="flex items-center space-x-3 p-3 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <FacebookIcon className="text-white size-5" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Facebook :</p>
            <p className="font-medium truncate max-w-[220px]">{cfg.contact_facebook}</p>
          </div>
        </a>
      )}

      {hasViber && (
        <a href={`viber://chat/?number=${cfg.contact_viber}`}
          className="flex items-center space-x-3 p-3 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors">
          <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
            <PhoneCallIcon className="text-white size-5" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Viber :</p>
            <p className="font-medium">{cfg.contact_viber}</p>
          </div>
        </a>
      )}

      {hasPhone && (
        <a href={`tel:${cfg.contact_phone}`}
          className="flex items-center space-x-3 p-3 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
            <Phone className="text-white size-5" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Call :</p>
            <p className="font-medium">{cfg.contact_phone}</p>
          </div>
        </a>
      )}
    </section>
  );
};

export default ContactComponent;
