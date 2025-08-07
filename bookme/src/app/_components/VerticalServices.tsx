import { useEffect, useRef, useState } from "react";

const serviceData = [
  {
    id: "bookme",
    title: "Байгууллагад",
    text: [
      "Ажилтны сул цаг, туршлага, хийсэн ажлуудын динамик удирдлага",
      "Захиалгын урсгалыг хянах, ачааллаа хуваарилах, хоосон цаг арилгах",
      "Админ самбар-аар бүхнийг хянах — үйлчилгээ, ажилтан, цаг, хэрэглэгч",
      "Галерей, үнэлгээ, хэрэглэгчийн туршлагыг сайжруулах цогц систем",
    ],
    image:
      "https://res.cloudinary.com/dpbmpprw5/image/upload/v1751279612/sumup-Cy_RRgdwHxA-unsplash_ljqj13.jpg",
    color: "from-cyan-400 to-blue-500",
  },
  {
    id: "nochat",
    title: "Хэрэглэгчийн 3 түвшин",
    text: [
      "Хэрэглэгч — Захиалах, хянах, төлбөр төлөх",
      "Байгууллагын админ — Үйлчилгээ, ажилтан, захиалгыг удирдах",
      "Супер админ — Системийн хяналт, эрх олголт",
    ],
    image:
      "https://res.cloudinary.com/dpbmpprw5/image/upload/v1749889984/path-digital-tR0jvlsmCuQ-unsplash_1_jps41f.jpg",
    color: "from-cyan-400 to-blue-500",
  },
];

export const VerticalServicesParent = ({ id }: { id: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const sections =
        containerRef.current.querySelectorAll(".service-section");
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      sections.forEach((section, index) => {
        const sectionTop = (section as HTMLElement).offsetTop;
        const sectionHeight = (section as HTMLElement).offsetHeight;

        if (
          scrollPosition >= sectionTop &&
          scrollPosition < sectionTop + sectionHeight
        ) {
          setActiveIndex(index);
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      id={id}
      ref={containerRef}
      className="min-h-screen text-white relative overflow-hidden"
      style={{
        backgroundImage:
          "radial-gradient(circle at 50% 50%, rgba(120, 113, 255, 0.1) 0%, transparent 70%)",
      }}
    >
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div
          className="absolute top-1/4 left-1/4 w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 bg-blue-500 rounded-full filter blur-xl sm:blur-2xl lg:blur-3xl transition-transform duration-1200 ease-out"
          style={{
            transform: `translateY(${activeIndex * -50}px)`,
          }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 bg-purple-500 rounded-full filter blur-xl sm:blur-2xl lg:blur-3xl transition-transform duration-1500 ease-out"
          style={{
            transform: `translateY(${activeIndex * 40}px)`,
          }}
        />
      </div>

      <div className="relative z-10">
        {serviceData.map((service, index) => (
          <div key={service.id} className="service-section">
            <VerticalServices
              service={service}
              isActive={index === activeIndex}
              index={index}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export const VerticalServices = ({
  service,
  isActive,
  index,
}: {
  service: (typeof serviceData)[0];
  isActive: boolean;
  index: number;
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const sectionHeight = rect.height;

      const start = rect.top;
      const end = rect.bottom - windowHeight;
      const progress = Math.max(
        0,
        Math.min(
          1,
          (windowHeight / 2 - start) / (sectionHeight - windowHeight / 2)
        )
      );

      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      ref={sectionRef}
      className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-12 md:py-16 relative overflow-hidden"
    >
      <div
        className={`absolute inset-0 transition-all duration-1000`}
        style={{
          opacity: isActive ? 0.2 : 0.05,
          transform: `translateY(${(1 - scrollProgress) * 20}px) scale(${
            0.98 + scrollProgress * 0.02
          })`,
        }}
      />

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 lg:gap-16 items-center">
          <div
            className="space-y-4 sm:space-y-6"
            style={{
              transform: `translateY(${(1 - scrollProgress) * 40}px)`,
              opacity: 0.4 + scrollProgress * 0.6,
            }}
          >
            <div className="flex items-start space-x-3 sm:space-x-4">
              <div
                className={`w-1.5 sm:w-2 h-12 sm:h-16 bg-gradient-to-b ${service.color} rounded-full flex-shrink-0 mt-1 sm:mt-2 transition-all duration-700`}
                style={{
                  transform: `scaleY(${isActive ? 1 : 0.5})`,
                  opacity: isActive ? 1 : 0.5,
                }}
              />
              <div className="min-w-0">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-white mb-4 sm:mb-6">
                  {service.title}
                </h2>
              </div>
            </div>

            {Array.isArray(service.text) ? (
              <ul className="list-disc list-inside space-y-1 sm:space-y-2 text-white/90 text-base sm:text-lg md:text-xl">
                {service.text.map((item, i) => (
                  <li key={i} className="leading-relaxed">
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-base sm:text-lg md:text-xl leading-relaxed text-white/90">
                {service.text}
              </p>
            )}
          </div>

          <div
            className="relative group mt-8 lg:mt-0"
            style={{
              transform: `scale(${0.9 + scrollProgress * 0.1})`,
              opacity: 0.4 + scrollProgress * 0.6,
            }}
          >
            <div
              className={`absolute inset-0 bg-gradient-to-r ${
                service.color
              } rounded-2xl sm:rounded-3xl blur-xl sm:blur-2xl transition-all duration-700 ${
                isActive
                  ? "opacity-30 sm:opacity-40 scale-105"
                  : "opacity-20 scale-95"
              }`}
            />

            <img
              src={service.image}
              alt={service.title}
              className="relative w-full h-[280px] sm:h-[350px] md:h-[400px] lg:h-[500px] rounded-2xl sm:rounded-3xl object-cover shadow-lg sm:shadow-2xl border border-white/10"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
