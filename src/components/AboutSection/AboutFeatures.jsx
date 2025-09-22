import Image from "next/image";

export default function AboutFeatures() {
    const features = [
        {
            tag: "Delivery",
            title: "Discover possibilities with simplified FedEx Import Rates",
            desc: "EZI Drop Take advantage of this new opportunity to grow your business. With simplified Import Pricing offered by FedEx, you can now import with ease and without the worry of exchange rate risk when paying offshore.",
            img: "https://i.ibb.co/6pb5LfJ/2019-Fed-Ex-India-28.webp",
            bullets: ["Affordable Cost", "Real-Time Delivery"],
            buttons: [
                { label: "Affordable Cost", href: "/contact" },
                { label: "Shot Time Delivery", href: "/about" },
            ],
        },
        {
            tag: "Delivery",
            title: "We Connected by Large Network",
            desc: "Logistics Teams was founded in 2003 by a group of transport logistics professionals who shared a vision to improve customer service, while streamlining supply chain efficiency.",
            img: "https://i.ibb.co/Z1Lh1kqP/img-about-2-2.png", 
            bullets: ["Reliable Partner", "Fast Turnaround"],
            buttons: [
                { label: "Contact Us", href: "/contact" },
                { label: "Learn More", href: "/about" },
            ],
        },
        {
            tag: "Network",
            title: "We have established strong relationships with our partners",
            desc: "We partner with businesses in the field, providing high quality control at the lowest cost. Our relationships have enabled our 24/7 global operations to run smoothly.",
            img: "https://i.ibb.co/0y3ZXsLG/img-about-2-3.png", 
            bullets: ["Global Coverage", "24/7 Support"],
            buttons: [
                { label: "Agent Zone", href: "#" },
                { label: "Join Us", href: "#" },
            ],
        },
    ];


    return (
        <section className="w-full py-16 space-y-24">
            {features.map((f, i) => (
                <div
                    key={i}
                    className="w-full grid md:grid-cols-2 gap-10 items-center"
                >
                   
                    <div
                        className={`relative w-full h-72 md:h-80 rounded-xl overflow-hidden shadow-md ${i % 2 === 1 ? "md:order-2" : ""
                            }`}
                    >
                        <Image src={f.img} alt={f.title} fill className="object-cover" />
                    </div>

                    <div className={`${i % 2 === 1 ? "md:order-1" : ""}`}>
                        <span className="inline-block mb-3 text-sm font-medium text-[var(--color-text-soft)] dark:text-[var(--color-text-soft-dark)] uppercase">
                            {f.tag}
                        </span>
                        <h3 className="text-2xl md:text-3xl text-[var(--color-text-soft)] dark:text-[var(--color-text-soft-dark)] font-bold mb-4">{f.title}</h3>
                        <p className=" mb-5">{f.desc}</p>

                        <ul className="mb-5 space-y-2">
                            {f.bullets.map((b, j) => (
                                <li key={j} className="flex items-center gap-2">
                                    <span className="inline-block w-2 h-2 rounded-full bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)]" />
                                    <span>{b}</span>
                                </li>
                            ))}
                        </ul>

                        <div className="flex flex-wrap gap-3">
                            {f.buttons.map((btn, k) => (
                                <a
                                    key={k}
                                    href={btn.href}
                                    className={`px-5 py-2 rounded-md border text-sm font-medium hover:shadow-md transition ${k === 0 ? "bg-[var(--color-bg)] text-[var(--color-text-soft)]" : "dark:bg-[var(--color-bg-dark)] dark:text-[var(--color-text-soft-dark)]"
                                        }`}
                                >
                                    {btn.label}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </section>
    );
}
