import AboutFeatures from "@/components/AboutSection/AboutFeatures";
import AboutSection from "@/components/AboutSection/AboutSection";


export default function AboutsPage() {
    return (
        <main className=" px-6 md:px-8 py-18">
            <div className="max-w-[1440px] mx-auto">
            <div className="space-y-4">
                <h1 className="text-3xl text-[var(--color-text-soft)] dark:text-[var(--color-text-soft-dark)] font-bold text-center">About Us</h1>
                <p className="text-center font-semibold">
                    We have been pioneering the industry in Europe for 20 years, <br /> and delivering value
                    products within given timeframe, every single time.
                </p>
            </div>
            <AboutSection />
            <AboutFeatures />
            </div>
        </main>
    );
}
