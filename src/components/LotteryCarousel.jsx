import { useState, useEffect } from "react";

const LotteryCarousel = () => {
  const [bannerUrl, setBannerUrl] = useState(null);

  useEffect(() => {
    fetch("/api/config")
      .then((r) => r.json())
      .then((data) => {
        if (data?.banner_url) setBannerUrl(data.banner_url);
      })
      .catch(() => {});
  }, []);

  if (!bannerUrl) return null;

  return (
    <div className="relative overflow-hidden bg-gray-100">
      <div className="h-48 md:h-64">
        <img
          src={bannerUrl}
          alt="Banner"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default LotteryCarousel;
