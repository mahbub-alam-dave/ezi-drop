import Image from "next/image";
import { FaPlayCircle } from "react-icons/fa";

export default function AboutSection({ children }) {
    return (
        <section id="about" className="w-full py-16">
            <div className="grid md:grid-cols-2 gap-10 items-center">

                <div className="relative w-full flex justify-center">
                    <div className="relative w-72 h-72 md:w-full md:h-96 rounded-2xl overflow-hidden shadow-lg">
                        <Image
                            src="https://i.ibb.co/YF41TV2N/img-about-1-3.png"
                            alt="Main about photo"
                            fill
                            className="object-cover"
                        />
                    </div>

                    <div className="absolute bottom-0 left-0 w-40 h-40 rounded-xl overflow-hidden shadow-md border-4 border-white">
                        <Image
                            src="https://i.ibb.co/wZzP1pmV/img-about-1-1.png"
                            alt="Secondary about photo"
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>
                <div>
                    <h2 className="text-3xl md:text-4xl text-[var(--color-text-soft)] dark:text-[var(--color-text-soft-dark)]font-bold mb-3">
                        Simplifying complex shipping challenges with innovative solutions
                    </h2>

                    <div className="prose max-w-none text-justify">
                        {children ?? (
                            <p>
                                Logistics companies are essential to the smooth functioning of global supply chains.
                                They offer a range of services such as transportation, warehousing, inventory
                                management, and distribution. The role of logistics companies has become increasingly
                                important in recent years due to the growth of e-commerce and global trade.
                            </p>
                        )}
                    </div>

                    <div className="mt-6 flex flex-wrap gap-3">
                        <a
                            href="/contact"
                            className="inline-block px-5 py-2 rounded-lg border shadow-sm hover:shadow-md"
                        >
                            Calculate Package
                        </a>
                        <button
                            type="button"
                            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)] text-[var(--color-text-soft)] dark:text-[var(--color-text-soft-dark)]hover:opacity-90"
                        >
                            <FaPlayCircle className="w-5 h-5" />
                            <span>Watch Video</span>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
