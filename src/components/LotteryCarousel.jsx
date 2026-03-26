import { useState, useEffect } from "react";

const LotteryCarousel = () => {
  const banners = [
    { id: 1, title: "Banner 1", imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBsQMAMnsDczxsn3mMh_XUmVxeS4WoN4KMF8jRjmK_UhrLop2z2qkfGypYiMz70ostbYA&usqp=CAU" },
    { id: 2, title: "Banner 2", imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT23tDe4RtOjNkB6F5P8PfgKEUT1cVKEOFa9QFJtQB1LkKfMlmnsP5sTa09HWiU8Npr72M&usqp=CAU" },
    { id: 3, title: "Banner 3", imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFWCUskvmqtK0HVmeNBOpU3hnXEIWBSTH8pgoWVHW_RcvyBflxBvTQThk-CkXX__Dh128&usqp=CAU" },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = banners.length;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 5000);

    return () => clearInterval(interval);
  }, [totalSlides]);
  return (
    <div className="relative overflow-hidden bg-gray-100">
      <div className="relative h-48 md:h-64">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className="absolute inset-0 transition-transform duration-500"
            style={{
              transform: `translateX(${(index - currentSlide) * 100}%)`,
            }}
          >
            <img
              src={banner.imageUrl}
              alt={banner.title}
              className="w-full h-full object-cover"
              data-testid={`img-carousel-${index}`}
            />
          </div>
        ))}

       
      </div>
    </div>
  );
};

export default LotteryCarousel;
