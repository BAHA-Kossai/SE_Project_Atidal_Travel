import React, { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';

// --- DestinationCard Component ---
const DestinationCard = ({ name, location, imageSrc }) => {
    return (
        <div className="flex-1 min-w-[280px] max-w-[340px] mx-2">
            <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
                <div className="relative h-48 overflow-hidden">
                    <img
                        src={imageSrc}
                        alt={name}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    />
                </div>
                <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-800 mb-1">{name}</h3>
                    <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{location}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- PopularDestinations Component ---
const PopularDestinations = () => {
    const [destinations, setDestinations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFeaturedDestinations = async () => {
            try {
                setLoading(true);
                const response = await fetch('http://localhost:3000/api/destinations/featured?limit=3');

                if (!response.ok) {
                    throw new Error('Failed to fetch destinations');
                }

                const result = await response.json();

                if (result.status === 'success') {
                    // Transform the API data to match your component structure
                    const transformedDestinations = result.data.map(dest => ({
                        name: dest.destination_city,
                        location: `${dest.destination_city}, ${dest.destination_country}`,
                        imageSrc: dest.destination_pic || 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&h=300&fit=crop' // fallback image
                    }));

                    setDestinations(transformedDestinations);
                } else {
                    throw new Error(result.message || 'Failed to fetch destinations');
                }
            } catch (err) {
                setError(err.message);
                console.error('Error fetching destinations:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchFeaturedDestinations();
    }, []);

    // Loading state
    if (loading) {
        return (
            <section className="py-12 px-6 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">Popular Destinations</h2>
                    <p className="text-gray-500 mb-8">Explore the world with us</p>
                    <div className="flex justify-center">
                        <div className="text-gray-500">Loading destinations...</div>
                    </div>
                </div>
            </section>
        );
    }

    // Error state
    if (error) {
        return (
            <section className="py-12 px-6 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">Popular Destinations</h2>
                    <p className="text-gray-500 mb-8">Explore the world with us</p>
                    <div className="flex justify-center">
                        <div className="text-red-500">Error: {error}</div>
                    </div>
                </div>
            </section>
        );
    }

    // Empty state
    if (destinations.length === 0) {
        return (
            <section className="py-12 px-6 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">Popular Destinations</h2>
                    <p className="text-gray-500 mb-8">Explore the world with us</p>
                    <div className="flex justify-center">
                        <div className="text-gray-500">No destinations available at the moment.</div>
                    </div>
                </div>
            </section>
        );
    }

    // Success state
    return (
        <section className="py-12 px-6 bg-gray-50">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">Popular Destinations</h2>
                <p className="text-gray-500 mb-8">Explore the world with us</p>
                <div className="flex flex-wrap justify-center gap-4">
                    {destinations.map((dest, index) => (
                        <DestinationCard
                            key={index}
                            name={dest.name}
                            location={dest.location}
                            imageSrc={dest.imageSrc}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PopularDestinations;