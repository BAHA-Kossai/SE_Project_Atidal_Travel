import React, { useState, useEffect } from 'react';

// --- InfoSection Component (Reusable) ---
const InfoSection = ({ title, description, buttonText, imageSrc, imageAlt, reverseLayout, onButtonClick }) => {
    return (
        <section className="py-16 px-6 bg-white">
            <div className={`max-w-7xl mx-auto flex items-center gap-12 ${reverseLayout ? 'flex-row-reverse' : 'flex-row'} flex-wrap lg:flex-nowrap`}>
                {/* Text Content */}
                <div className="flex-1 min-w-[300px]">
                    <h2 className="text-4xl font-black text-[#003d7a] mb-4 leading-tight">{title}</h2>
                    <p className="text-gray-600 text-base leading-relaxed mb-6">{description}</p>
                    <button
                        onClick={onButtonClick}
                        className="bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-semibold px-8 py-3 rounded-full transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                        {buttonText}
                    </button>
                </div>

                {/* Image */}
                <div className="flex-1 min-w-[300px]">
                    <div className="relative rounded-3xl overflow-hidden shadow-xl">
                        <img
                            src={imageSrc}
                            alt={imageAlt}
                            className="w-full h-[350px] object-cover"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

// --- NoOffers Component ---
const NoOffersSection = ({ title, message, reverseLayout }) => {
    return (
        <section className="py-16 px-6 bg-white">
            <div className={`max-w-7xl mx-auto flex items-center gap-12 ${reverseLayout ? 'flex-row-reverse' : 'flex-row'} flex-wrap lg:flex-nowrap`}>
                {/* Text Content */}
                <div className="flex-1 min-w-[300px]">
                    <h2 className="text-4xl font-black text-[#003d7a] mb-4 leading-tight">{title}</h2>
                    <p className="text-gray-600 text-base leading-relaxed mb-6">{message}</p>
                </div>

                {/* Placeholder Image */}
                <div className="flex-1 min-w-[300px]">
                    <div className="relative rounded-3xl overflow-hidden shadow-xl bg-gray-200">
                        <div className="w-full h-[350px] flex items-center justify-center">
                            <span className="text-gray-500 text-lg">No offers available</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

// --- UmrahHadjPacks Component (Uses InfoSection) ---
export const UmrahHadjPacks = () => {
    const [umrahPacket, setUmrahPacket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUmrahPacket = async () => {
            try {
                setLoading(true);
                const response = await fetch('http://localhost:3000/api/bookings/type/umrah?limit=1');

                if (!response.ok) {
                    throw new Error('Failed to fetch Umrah packet');
                }

                const result = await response.json();

                if (result.status === 'success' && result.data.length > 0) {
                    setUmrahPacket(result.data[0]);
                } else {
                    // No Umrah packets available
                    setUmrahPacket(null);
                }
            } catch (err) {
                setError(err.message);
                console.error('Error fetching Umrah packet:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchUmrahPacket();
    }, []);

    const handleExploreClick = () => {
        if (umrahPacket) {
            console.log('Exploring Umrah packet:', umrahPacket);
            // Navigate to booking details or show modal
        }
    };

    // Loading state
    if (loading) {
        return (
            <InfoSection
                title="Umrah / Hadj Packs"
                description="Loading offers..."
                buttonText="Explore Now"
                imageSrc="https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=600&h=400&fit=crop"
                imageAlt="Pilgrims at the Kaaba"
                reverseLayout={false}
                onButtonClick={handleExploreClick}
            />
        );
    }

    // Error state
    if (error) {
        return (
            <NoOffersSection
                title="Umrah / Hadj Packs"
                message="Error loading Umrah offers. Please try again later."
                reverseLayout={false}
            />
        );
    }

    // No offers available
    if (!umrahPacket) {
        return (
            <NoOffersSection
                title="Umrah / Hadj Packs"
                message="There are no Umrah offers available at the moment. Please check back later."
                reverseLayout={false}
            />
        );
    }

    // Success state - show actual data
    const description = `${umrahPacket.Guided_trips.description} - Starting from $${umrahPacket.price} - Departure: ${new Date(umrahPacket.trip_date).toLocaleDateString()} - ${umrahPacket.Guided_trips.available_seats} seats available`;

    return (
        <InfoSection
            title={umrahPacket.destination}
            description={description}
            buttonText="Explore Now"
            imageSrc="https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=600&h=400&fit=crop"
            imageAlt={umrahPacket.destination}
            reverseLayout={false}
            onButtonClick={handleExploreClick}
        />
    );
};

// --- GroupTrips Component (Uses InfoSection) ---
export const GroupTrips = () => {
    const [groupTrip, setGroupTrip] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchGroupTrip = async () => {
            try {
                setLoading(true);
                const response = await fetch('http://localhost:3000/api/bookings/type/guided_trip?limit=1');

                if (!response.ok) {
                    throw new Error('Failed to fetch Group Trip');
                }

                const result = await response.json();

                if (result.status === 'success' && result.data.length > 0) {
                    setGroupTrip(result.data[0]);
                } else {
                    // No Group Trips available
                    setGroupTrip(null);
                }
            } catch (err) {
                setError(err.message);
                console.error('Error fetching Group Trip:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchGroupTrip();
    }, []);

    const handleExploreClick = () => {
        if (groupTrip) {
            console.log('Exploring Group Trip:', groupTrip);
            // Navigate to booking details or show modal
        }
    };

    // Loading state
    if (loading) {
        return (
            <InfoSection
                title="Group Trips"
                description="Loading offers..."
                buttonText="Explore Now"
                imageSrc="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&h=400&fit=crop"
                imageAlt="Group of people on a hiking trip"
                reverseLayout={true}
                onButtonClick={handleExploreClick}
            />
        );
    }

    // Error state
    if (error) {
        return (
            <NoOffersSection
                title="Group Trips"
                message="Error loading Group Trip offers. Please try again later."
                reverseLayout={true}
            />
        );
    }

    // No offers available
    if (!groupTrip) {
        return (
            <NoOffersSection
                title="Group Trips"
                message="There are no Group Trip offers available at the moment. Please check back later."
                reverseLayout={true}
            />
        );
    }

    // Success state - show actual data
    const description = `${groupTrip.Guided_trips.description} - Starting from $${groupTrip.price} - Departure: ${new Date(groupTrip.trip_date).toLocaleDateString()} - ${groupTrip.Guided_trips.available_seats} seats available`;

    return (
        <InfoSection
            title={groupTrip.destination}
            description={description}
            buttonText="Explore Now"
            imageSrc="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&h=400&fit=crop"
            imageAlt={groupTrip.destination}
            reverseLayout={true}
            onButtonClick={handleExploreClick}
        />
    );
};

// Export InfoSection as default
export default InfoSection;