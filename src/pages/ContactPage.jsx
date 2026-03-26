import React from "react";
import Header from "../components/Header";

import BottomNavigation from "../components/BottomNavigation";
import ContactComponent from "../components/ContactComponent";

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-gray-200 flex justify-center">
      <section className="w-full max-w-[500px] bg-blue-50 pb-20">
        <Header />
        <ContactComponent />
        <BottomNavigation />
      </section>
    </div>
  );
};

export default ContactPage;
