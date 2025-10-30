import AboutFeatures from "@/components/aboutPageComponents/AboutFeatures";
import AboutSection from "@/components/aboutPageComponents/AboutSection";

// app/about/page.js
export const metadata = {
  title: 'Ezi Drop | About Us',
  description: 'Learn more about Ezi Drop - Our mission, values, and delivery services',
}

export default function AboutPage() {
    return (
        <main className="px-6 md:px-8 py-18">
            <div className="max-w-[1440px] mx-auto">
                <div className="space-y-4">
                    <h1 className="text-3xl lg:text-4xl text-color font-bold text-center">About Us</h1>
                    <p className="text-center text-color-soft text-lg">
                        We have been pioneering the industry in Europe for 20 years, and delivering value
                        products within given timeframe, every single time.
                    </p>
                </div>
                <AboutSection />
                <AboutFeatures />
            </div>
        </main>
    );
}