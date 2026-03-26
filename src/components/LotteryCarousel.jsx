import { useState, useEffect } from "react";
import { apiFetch } from "../utils/api";

const LotteryCarousel = () => {
  const [slides, setSlides] = useState([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    apiFetch("/api/config")
      .then((r) => r.json())
      .then((data) => {
        try {
          const urls = JSON.parse(data?.banner_urls || "[]");
          if (Array.isArray(urls) && urls.length > 0) setSlides(urls);
        } catch {}
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const id = setInterval(() => setCurrent((p) => (p + 1) % slides.length), 5000);
    return () => clearInterval(id);
  }, [slides.length]);

  if (slides.length === 0) return null;

  return (
    <div className="relative overflow-hidden bg-gray-100">
      <div className="relative h-48 md:h-64">
        {slides.map((url, i) => (
          <div
            key={i}
            className="absolute inset-0 transition-transform duration-500"
            style={{ transform: `translateX(${(i - current) * 100}%)` }}
          >
            <img src={url} alt={`Banner ${i + 1}`} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>

      {/* Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2 h-2 rounded-full transition-colors ${i === current ? "bg-white" : "bg-white/40"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default LotteryCarousel;
