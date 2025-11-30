import React from 'react';
import Layout from '../components/layout/Layout.jsx';
import WhyChooseUs from '../components/home/WhyChooseUs.jsx';
import FeedbackSection from '../components/home/Feedback.jsx';
import PopularDestinations from '../components/home/PopularDestinations.jsx';
import { UmrahHadjPacks, GroupTrips } from '../components/home/InfoSection.jsx';
import TravelHeroSection from '../components/home/Search.jsx';

function HomePage() {
  return (
    <Layout>
      <TravelHeroSection/>
      <PopularDestinations />
      <UmrahHadjPacks />
      <GroupTrips />
      <WhyChooseUs />
      <FeedbackSection />
    </Layout>
  );
}

export default HomePage;
