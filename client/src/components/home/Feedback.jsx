import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useRating } from "../../../hooks/useRating";

const FeedbackSection = () => {
  const [activeIndex, setActiveIndex] = useState(2);
  const { fetchApprovedRatings, loading, error } = useRating();
  const [reviews, setReviews] = useState([]);

  // Fetch approved ratings with user details
  useEffect(() => {
    const loadReviews = async () => {
      try {
        const ratings = await fetchApprovedRatings({ 
          limit: 10, 
          withUserDetails: true 
        });
        
        console.log('Raw ratings data from API:', ratings); // Debug log
        
        if (ratings && ratings.length > 0) {
          // Transform API data to match component format
          const transformedReviews = ratings.map(rating => {
            // Debug: Log each rating structure
            console.log('Rating object:', rating);
            console.log('User object:', rating.Users || rating.user);
            
            // The user data is likely under "Users" (plural) from your Supabase query
            const user = rating.Users || rating.user || null;
            
            let userName = 'Traveler'; // Default name
            
            if (user) {
              const firstName = user.first_name || '';
              const lastName = user.last_name || '';
              const fullName = `${firstName} ${lastName}`.trim();
              
              if (fullName) {
                userName = fullName;
              } else if (user.email) {
                // Use email username if no name
                userName = user.email.split('@')[0];
              }
            }
            
            return {
              id: rating.rating_id,
              name: userName,
              rating: rating.rating,
              text: rating.comment || '',
              userDetails: user
            };
          });
          
          console.log('Transformed reviews:', transformedReviews); // Debug log
          setReviews(transformedReviews);
          
          // Set active index to middle if we have reviews
          if (transformedReviews.length > 0) {
            const middleIndex = Math.floor(transformedReviews.length / 2);
            setActiveIndex(Math.min(middleIndex, transformedReviews.length - 1));
          }
        }
      } catch (err) {
        console.error('Failed to load reviews:', err);
        // Fallback to empty array - component will show loading/error states
      }
    };

    loadReviews();
  }, [fetchApprovedRatings]);

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
    if (reviews.length > 0) {
      setActiveIndex((prev) => (prev + 1) % reviews.length);
    }
  };

  const scrollPrev = () => {
    if (reviews.length > 0) {
      setActiveIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
    }
  };

  // Calculate position and style for each card
  const getCardStyle = (index) => {
    if (reviews.length === 0) return { display: 'none' };
    
    const diff = index - activeIndex;
    const absDistance = Math.abs(diff);
    
    // Only show 2 cards on each side
    if (absDistance > 2) {
      return { display: 'none' };
    }

    let zIndex = 5 - absDistance;
    let scale = 1 - (absDistance * 0.15);
    let translateX = diff * 30;
    let translateY = absDistance * 30;
    let opacity = 1 - (absDistance * 0.3);

    return {
      transform: `translateX(${translateX}%) translateY(${translateY}px) scale(${scale})`,
      zIndex: zIndex,
      opacity: opacity,
      position: 'absolute',
      left: '50%',
      marginLeft: '-160px',
    };
  };

  // Loading state
  if (loading) {
    return (
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-16 text-center">
            What Our Travelers Say
          </h2>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-16 text-center">
            What Our Travelers Say
          </h2>
          <div className="text-center text-gray-600">
            <p>Unable to load reviews at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  // No reviews state
  if (reviews.length === 0) {
    return (
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-16 text-center">
            What Our Travelers Say
          </h2>
          <div className="text-center text-gray-600">
            <p>Be the first to share your travel experience!</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <h2 className="text-3xl font-bold text-gray-900 mb-16 text-center">
          What Our Travelers Say
        </h2>

        {/* Card Stack Container */}
        <div className="relative h-[450px] flex items-center justify-center">
          {/* Scroll Buttons - Only show if we have reviews */}
          {reviews.length > 1 && (
            <>
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
            </>
          )}

          {/* Overlapping Cards */}
          <div className="relative w-full h-full">
            {reviews.map((review, index) => {
              const isActive = index === activeIndex;
              const cardStyle = getCardStyle(index);

              return (
                <div
                  key={review.id}
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

          {/* Dots Indicator - Only show if we have reviews */}
          {reviews.length > 1 && (
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
          )}
        </div>
      </div>
    </section>
  );
};

export default FeedbackSection;