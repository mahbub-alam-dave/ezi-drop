import BannerSection from '@/components/homePageComponents/BannerSection';
import DiscountSection from '@/components/homePageComponents/DiscountSection';
import Faq from '@/components/homePageComponents/faqSection/Faq';
import HowItWorks from '@/components/homePageComponents/feature/HowItWorks';
import NewsLetter from '@/components/homePageComponents/newsletter/NewsLetter';
import Overview from '@/components/homePageComponents/Overview';
import Review from '@/components/homePageComponents/reviewSection/Review';
import React from 'react';
export const metadata = {
  title: 'Ezi Drop | Home',
  description: 'Learn more about Ezi Drop - Our mission, values, and delivery services',
}
const Home = () => {
    return (
        <div className="min-h-screen">
        <BannerSection />
        <HowItWorks />
        <DiscountSection/>
        <Overview />
      <Faq></Faq>
        <Review />
      <NewsLetter /> 
    </div>
    );
};

export default Home;