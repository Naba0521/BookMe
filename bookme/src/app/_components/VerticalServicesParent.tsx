import { useEffect, useRef, useState } from "react";
import { VerticalServices } from "./VerticalServices";

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
      "https://res.cloudinary.com/dpbmpprw5/image/upload/v1751280160/justin-morgan--q_lg2uUTjk-unsplash_mrltw3.jpg",
    color: "from-cyan-400 to-blue-500",
  },
  // {
  //   id: "payment",
  //   title: "Үйлчлүүлэгчдэд",
  //   text: [
  //     "Хувийн мэдээлэл болон захиалгаа хамгаалсан, найдвартай нэвтрэлттэй систем. Захиалгаа бүртгүүлж, хянахад хялбар.",
  //     "Та аль ч байгууллагын дуртай ажилтнаа сонгон, яг тухайн ажилтны сул цаг дээр суурилсан захиалга өгнө.",
  //   ],
  //   image:
  //     "https://res.cloudinary.com/dpbmpprw5/image/upload/v1749889984/path-digital-tR0jvlsmCuQ-unsplash_1_jps41f.jpg",
  //   color: "from-cyan-400 to-blue-500",
  // },
];

const VerticalServicesParent = ({ id }: { id: string }) => {
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

  const handleNavClick = (index: number) => {
    const section =
      containerRef.current?.querySelectorAll(".service-section")[index];
    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  return (
    <section
      id={id}
      ref={containerRef}
      className="min-h-screen text-white relative overflow-hidden w-full"
      style={{
        backgroundImage:
          "radial-gradient(circle at 50% 50%, rgba(120, 113, 255, 0.1) 0%, transparent 70%)",
        backgroundSize: "100% 200%",
        backgroundPosition: "50% 0%",
      }}
    >
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl transition-transform duration-1200 ease-out"
          style={{
            transform: `translateY(${activeIndex * -100}px)`,
          }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl transition-transform duration-1500 ease-out"
          style={{
            transform: `translateY(${activeIndex * 80}px)`,
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

export default VerticalServicesParent;
