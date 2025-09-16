import Image from "next/image";

export default function AboutFeatures() {
  const features = [
    {
      tag: "Delivery",
      title: "Globally Connected by Large Network",
      desc: "At Logistics, we leverage our far-reaching network with multiple transport modes to provide fast, efficient and cost-effective logistics solutions across the industry.",
      img: "https://i.ibb.co.com/S4h5JHtN/img-about-2-1.png",
      bullets: ["Affordable Cost", "Real-Time Delivery"],
      buttons: [
        { label: "Affordable Cost", href: "/contact" },
        { label: "Shot Time Delivery", href: "/about" },
      ],
    },
    {
      tag: "Delivery",
      title: "Globally Connected by Large Network",
      desc: "Logistics Teams was founded in 2003 by a group of transport logistics professionals who shared a vision to improve customer service, while streamlining supply chain efficiency.",
      img: "https://i.ibb.co.com/Z1Lh1kqP/img-about-2-2.png",
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
      img: "https://i.ibb.co.com/0y3ZXsLG/img-about-2-3.png",
      bullets: ["Global Coverage", "24/7 Support"],
      buttons: [
        { label: "Agent Zone", href: "#" },
        { label: "Join Us", href: "#" },
      ],
    },
  ];

  return (
    <section className="px-6 py-16 space-y-24">
      {features.map((f, i) => (
        <div
          key={i}
          className="grid md:grid-cols-2 gap-10 items-center"
        >
          {/* Image */}
          <div
            className={`relative w-full h-72 md:h-80 rounded-xl overflow-hidden shadow-md ${
              i % 2 === 1 ? "md:order-2" : ""
            }`}
          >
            <Image src={f.img} alt={f.title} fill className="object-cover" />
          </div>

          {/* Content */}
          <div className={`${i % 2 === 1 ? "md:order-1" : ""}`}>
            <span className="inline-block mb-3 text-sm font-medium text-yellow-600 uppercase">
              {f.tag}
            </span>
            <h3 className="text-2xl md:text-3xl font-bold mb-4">{f.title}</h3>
            <p className="text-gray-600 mb-5">{f.desc}</p>

            <ul className="mb-5 space-y-2">
              {f.bullets.map((b, j) => (
                <li key={j} className="flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-yellow-500" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-3">
              {f.buttons.map((btn, k) => (
                <a
                  key={k}
                  href={btn.href}
                  className={`px-5 py-2 rounded-md border text-sm font-medium hover:shadow-md transition ${
                    k === 0 ? "bg-slate-900 text-white" : "bg-white text-slate-900"
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
