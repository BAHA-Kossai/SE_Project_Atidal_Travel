import React from 'react';
import { Plane, Headphones, DollarSign } from 'lucide-react';

const WhyChooseUs = () => {
  const features = [
    {
      icon: <Plane size={48} className="text-blue-600" />,
      title: 'Expert travel planners',
    },
    {
      icon: <Headphones size={48} className="text-white" />,
      title: 'Wherever you are in the world, our support team is just a message away.',
      isHighlighted: true,
    },
    {
      icon: <DollarSign size={48} className="text-blue-600" />,
      title: 'Best Price Guarantee',
    },
  ];

  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Why Choose Us</h2>
          <p className="text-gray-600">You will be always satisfied</p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`
                ${feature.isHighlighted 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-900'
                }
                rounded-2xl p-8 flex flex-col items-center text-center shadow-md
                transition-transform duration-300 hover:scale-105
              `}
            >
              {/* Icon with background */}
              <div className={`
                ${feature.isHighlighted 
                  ? 'bg-blue-500' 
                  : 'bg-gray-50'
                }
                rounded-lg p-4 mb-6
              `}>
                {feature.icon}
              </div>
              
              {/* Title */}
              <h3 className="text-lg font-bold">
                {feature.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;