import React, { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

const FeedbackSection = () => {
  const [activeIndex, setActiveIndex] = useState(2); // Start with middle card active

  const reviews = [
    {
      name: "Abdelaali Habbeche",
      rating: 4,
      text: "Our family vacation was unforgettable thanks to this amazing team. They listened to our preferences and designed a trip that suited everyone, from the kids to the adults.",
    },
    {
      name: "Sarah Benali",
      rating: 5,
      text: "Absolutely wonderful! Everything was seamless from start to finish. Highly recommended for stress-free travel.",
    },
    {
      name: "Riad K.",
      rating: 5,
      text: "Good experience overall. Could improve response times, but the destinations were incredible.",
    },
    {
      name: "Meriem T.",
      rating: 5,
      text: "Loved every part of the trip. The attention to detail made it extra special. Will book again!",
    },
    {
      name: "Nassim L.",
      rating: 4,
      text: "Excellent service and great communication. They made sure we had everything we needed!",
    },
  ];

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={20}
        className={index < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
      />
    ));
  };

  const scrollNext = () => {
    setActiveIndex((prev) => (prev + 1) % reviews.length);
  };

  const scrollPrev = () => {
    setActiveIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  // Calculate position and style for each card
  const getCardStyle = (index) => {
    const diff = index - activeIndex;
    const absDistance = Math.abs(diff);
    
    // Only show 2 cards on each side
    if (absDistance > 2) {
      return { display: 'none' };
    }

    let zIndex = 5 - absDistance;
    let scale = 1 - (absDistance * 0.15);
    let translateX = diff * 30; // Horizontal offset
    let translateY = absDistance * 30; // Move down based on distance
    let opacity = 1 - (absDistance * 0.3);

    return {
      transform: `translateX(${translateX}%) translateY(${translateY}px) scale(${scale})`,
      zIndex: zIndex,
      opacity: opacity,
      position: 'absolute',
      left: '50%',
      marginLeft: '-160px', // Half of card width (320px / 2)
    };
  };

  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <h2 className="text-3xl font-bold text-gray-900 mb-16 text-center">
          What Our Travelers Say
        </h2>

        {/* Card Stack Container */}
        <div className="relative h-[450px] flex items-center justify-center">
          {/* Scroll Buttons */}
          <button
            onClick={scrollPrev}
            className="absolute left-4 z-20 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition"
            aria-label="Previous review"
          >
            <ChevronLeft size={28} className="text-gray-700" />
          </button>

          <button
            onClick={scrollNext}
            className="absolute right-4 z-20 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition"
            aria-label="Next review"
          >
            <ChevronRight size={28} className="text-gray-700" />
          </button>

          {/* Overlapping Cards */}
          <div className="relative w-full h-full">
            {reviews.map((review, index) => {
              const isActive = index === activeIndex;
              const cardStyle = getCardStyle(index);

              return (
                <div
                  key={index}
                  className="rounded-3xl p-6 w-[320px] transition-all duration-500 ease-out shadow-xl"
                  style={{
                    ...cardStyle,
                    backgroundColor: isActive ? "#4EB6EA" : "white",
                  }}
                >
                  <h3
                    className={`font-bold text-lg mb-3 ${
                      isActive ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {review.name}
                  </h3>

                  <div className="flex gap-1 mb-3">{renderStars(review.rating)}</div>

                  <p
                    className={`text-sm leading-relaxed ${
                      isActive ? "text-white" : "text-gray-700"
                    }`}
                  >
                    {review.text}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Dots Indicator */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex gap-2">
            {reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === activeIndex
                    ? "bg-blue-500 w-8"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to review ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeedbackSection;