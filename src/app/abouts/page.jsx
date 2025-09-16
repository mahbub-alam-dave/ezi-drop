import AboutFeatures from "@/components/AboutSection/AboutFeatures";
import AboutSection from "@/components/AboutSection/AboutSection";


export default function AboutsPage() {
    return (
        <main >
            <div className="space-y-4 p-6">
                <h1 className="text-3xl text-[#51aca4] dark:text-[#25524e] font-bold text-center">About Us</h1>
                <p className="text-center font-semibold">
                    We have been pioneering the industry in Europe for 20 years, <br /> and delivering value
                    products within given timeframe, every single time.
                </p>
            </div>

            <AboutSection />
            <AboutFeatures />
        </main>
    );
}
