import React, { useEffect, useRef, useState } from "react";

type Service = {
  id: string;
  title: string;
  text: string;
  image: string;
  color: string;
  accentColor: string;
};

const serviceData: Service[] = [
  {
    id: "bookme",
    title: "Сул цагтай уялдуулсан захиалга",
    text: "Ажилтны бодит сул цагийг хараад, өөрийн чөлөөт цагтай уялдуулан илүү оновчтой захиалга өг.",
    image:
      "https://res.cloudinary.com/dpbmpprw5/image/upload/v1751280519/flipsnack-ZeqUBBqsH0k-unsplash_lnlymm.jpg",
    color: "from-blue-600 to-indigo-600",
    accentColor: "bg-blue-500",
  },
  {
    id: "payment",
    title: "Ажилтнаа сонгоод захиалах",
    text: "Та аль ч байгууллагын дуртай ажилтнаа сонгон, яг тухайн ажилтны сул цаг дээр суурилсан захиалга өгнө.",
    image:
      "https://res.cloudinary.com/dpbmpprw5/image/upload/q_auto:best,f_auto/v1749889984/path-digital-tR0jvlsmCuQ-unsplash_1_jps41f.jpg",
    color: "from-green-600 to-teal-600",
    accentColor: "bg-blue-500",
  },
  {
    id: "analytics",
    title: "Захиалгаа хянах, цуцлах",
    text: "Хувийн самбарт захиалгын төлөв, цаг, дэлгэрэнгүйг харах, шаардлагатай бол цуцлах бүрэн боломжтой.",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    color: "from-purple-600 to-pink-600",
    accentColor: "bg-blue-500",
  },
];

interface ServicesParentProps {
  id: string;
}

const ServicesParent: React.FC<ServicesParentProps> = ({ id }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const textContainerRef = useRef<HTMLDivElement | null>(null);
  const imagesContainerRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [hasScrolled, setHasScrolled] = useState<boolean>(false);
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [entered, setEntered] = useState<boolean>(false);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    setEntered(false);

    if (animationTimeoutRef.current !== null) {
      clearTimeout(animationTimeoutRef.current);
    }

    animationTimeoutRef.current = setTimeout(() => setEntered(true), 50);

    return () => {
      if (animationTimeoutRef.current !== null) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, [activeIndex]);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const containerHeight = containerRect.height;
      const scrollY = window.scrollY;
      const containerTop = containerRect.top + scrollY;

      if (scrollY > 10) {
        setHasScrolled(true);
      }

      const progress = Math.max(
        0,
        Math.min(
          1,
          (scrollY - containerTop + windowHeight * 0.8) /
            (containerHeight - windowHeight * 0.8)
        )
      );

      if (progress > 0.1 || isInitialLoad) {
        const sectionCount = serviceData.length;
        const newActiveIndex = Math.min(
          Math.max(0, Math.floor(progress * (sectionCount - 1))),
          sectionCount - 1
        );

        if (newActiveIndex !== activeIndex) {
          setActiveIndex(newActiveIndex);
          if (isInitialLoad) setIsInitialLoad(false);
        }
      }

      if (!isMobile && textContainerRef.current) {
        const containerTopInView = containerRect.top <= 0;
        const containerBottomInView = containerRect.bottom > windowHeight;

        if (containerTopInView && containerBottomInView) {
          textContainerRef.current.style.position = "fixed";
          textContainerRef.current.style.top = "0";
        } else if (containerRect.top > 0) {
          textContainerRef.current.style.position = "absolute";
          textContainerRef.current.style.top = "0";
        } else {
          textContainerRef.current.style.position = "absolute";
          textContainerRef.current.style.top = `${
            containerHeight - windowHeight
          }px`;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobile, activeIndex, isInitialLoad]);

  if (isMobile) {
    return (
      <section
        id={id}
        ref={containerRef}
        className="relative h-screen w-full overflow-y-auto snap-y snap-mandatory text-white"
        style={{
          scrollBehavior: "smooth",
          scrollSnapType: "y mandatory",
        }}
      >
        {serviceData.map((service, index) => (
          <div
            key={service.id}
            ref={(el) => {
              textRefs.current[index] = el;
            }}
            className="h-screen w-full flex flex-col items-center justify-center snap-start relative p-4"
          >
            <div className="absolute inset-0 overflow-hidden">
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/60" />
              <div
                className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-20`}
              />
            </div>

            <div className="relative z-10 max-w-md mx-auto text-center px-4">
              <h2
                className="text-3xl font-bold mb-4 animate-text"
                style={{
                  opacity: entered ? 1 : 0,
                  transform: entered ? "translateY(0)" : "translateY(20px)",
                  transition: entered
                    ? "opacity 0.5s ease 0s, transform 0.7s ease 0s"
                    : "none",
                }}
              >
                {service.title}
              </h2>
              <p
                className="text-lg mb-8 animate-text"
                style={{
                  opacity: entered ? 1 : 0,
                  transform: entered ? "translateY(0)" : "translateY(20px)",
                  transition: entered
                    ? "opacity 0.5s ease 0.2s, transform 0.7s ease 0.2s"
                    : "none",
                }}
              >
                {service.text}
              </p>
              <div
                className="flex justify-center space-x-2 animate-text"
                style={{
                  opacity: entered ? 1 : 0,
                  transform: entered ? "translateY(0)" : "translateY(20px)",
                  transition: entered
                    ? "opacity 0.5s ease 0.4s, transform 0.7s ease 0.4s"
                    : "none",
                }}
              >
                {serviceData.map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-all ${
                      i === index ? "bg-white w-4" : "bg-white/40"
                    }`}
                  />
                ))}
              </div>
              {index === 0 && (
                <div
                  className="mt-8 animate-bounce animate-text"
                  style={{
                    opacity: entered ? 1 : 0,
                    transform: entered ? "translateY(0)" : "translateY(20px)",
                    transition: entered
                      ? "opacity 0.5s ease 0.6s, transform 0.7s ease 0.6s"
                      : "none",
                  }}
                >
                  <p className="text-sm text-white/80">Scroll down</p>
                  <svg
                    className="w-6 h-6 mx-auto mt-2 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                </div>
              )}
            </div>
          </div>
        ))}
      </section>
    );
  }

  return (
    <section
      id={id}
      ref={containerRef}
      className="relative text-white min-h-screen w-full"
      style={{ height: `${serviceData.length * 100}vh` }}
    >
      <div
        ref={textContainerRef}
        className="absolute left-0 top-0 w-full lg:w-1/2 h-screen flex items-center justify-center z-20"
        style={{
          opacity: hasScrolled ? 1 : 0,
          transition: "opacity 0.5s ease-out",
        }}
      >
        <div className="px-8 lg:px-16 max-w-lg">
          {serviceData.map((service, index) => (
            <div
              key={service.id}
              className={`absolute inset-0 flex flex-col justify-center transition-all duration-700 ease-out p-40 ${
                index === activeIndex
                  ? "opacity-100 translate-y-0"
                  : index < activeIndex
                  ? "opacity-0 -translate-y-8"
                  : "opacity-0 translate-y-8"
              }`}
              style={{
                transitionDelay: index === activeIndex ? "0.2s" : "0s",
              }}
            >
              <h2 className="text-5xl lg:text-6xl font-bold leading-tight mb-6 text-white">
                {service.title}
              </h2>
              <p className="text-lg lg:text-xl leading-relaxed text-white/80 mb-8">
                {service.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div
        ref={imagesContainerRef}
        className="lg:ml-[50%] w-full lg:w-1/2 relative"
      >
        {serviceData.map((service, index) => (
          <div
            key={service.id}
            className="h-screen flex items-center justify-center p-8 lg:p-16 relative"
          >
            <div className="relative w-full max-w-lg">
              <div
                className={`absolute -inset-4 bg-gradient-to-r ${
                  service.color
                } rounded-3xl blur-2xl transition-all duration-700 ${
                  index === activeIndex
                    ? "opacity-30 scale-105"
                    : "opacity-10 scale-95"
                }`}
                style={{
                  transitionDelay: index === activeIndex ? "0s" : "0.1s",
                }}
              />
              <div className="relative">
                <img
                  src={service.image}
                  alt={service.title}
                  className={`w-full h-[500px] lg:h-[600px] object-cover rounded-3xl shadow-2xl transition-all duration-700 ${
                    index === activeIndex
                      ? "scale-100 opacity-100"
                      : "scale-95 opacity-70"
                  }`}
                  style={{
                    transitionDelay: index === activeIndex ? "0s" : "0.1s",
                  }}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/20 rounded-3xl" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute top-3/4 left-1/3 w-64 h-64 bg-green-500/5 rounded-full blur-3xl" />
      </div>
    </section>
  );
};

export default ServicesParent;
