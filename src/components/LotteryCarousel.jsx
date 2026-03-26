import { useState, useEffect } from "react";

const FALLBACK_BANNERS = [
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBsQMAMnsDczxsn3mMh_XUmVxeS4WoN4KMF8jRjmK_UhrLop2z2qkfGypYiMz70ostbYA&usqp=CAU",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT23tDe4RtOjNkB6F5P8PfgKEUT1cVKEOFa9QFJtQB1LkKfMlmnsP5sTa09HWiU8Npr72M&usqp=CAU",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFWCUskvmqtK0HVmeNBOpU3hnXEIWBSTH8pgoWVHW_RcvyBflxBvTQThk-CkXX__Dh128&usqp=CAU",
];

const LotteryCarousel = () => {
  const [slides, setSlides] = useState(FALLBACK_BANNERS);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    fetch("/api/config")
      .then((r) => r.json())
      .then((data) => {
        if (data?.banner_url) {
          // Admin banner first, then fallbacks
          setSlides([data.banner_url, ...FALLBACK_BANNERS]);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="relative overflow-hidden bg-gray-100">
      <div className="relative h-48 md:h-64">
        {slides.map((url, index) => (
          <div
            key={index}
            className="absolute inset-0 transition-transform duration-500"
            style={{ transform: `translateX(${(index - currentSlide) * 100}%)` }}
          >
            <img
              src={url}
              alt={`Banner ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Dots */}
      <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            className={`w-2 h-2 rounded-full transition-colors ${i === currentSlide ? "bg-white" : "bg-white/40"}`}
          />
        ))}
      </div>
    </div>
  );
};

export default LotteryCarousel;
