import HowItWorks from "@/components/feature/HowItWorks";
import BannerSection from "@/components/homePageComponents/BannerSection";
import NewsLetter from "@/components/homePageComponents/newsletter/NewsLetter";
import Overview from "@/components/homePageComponents/newsletter/Overview";
import Review from "@/components/homePageComponents/reviewSection/Review";

export default function Home() {
  return (
    <div className="min-h-screen">
      <main>
        <BannerSection />
        <Overview />
        <HowItWorks />
        <Review />
      </main>
      <NewsLetter />
      
    </div>
  );
}
