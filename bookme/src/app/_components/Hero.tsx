import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

import Particles from "./Particles";
import ShinyText from "./ShinyText";
import Link from "next/link";
import VariableProximity from "./VariableProximity";
import { Company } from "../company/[companyName]/_components/CompanyTypes";
import { useCompanyAuth } from "../_providers/CompanyAuthProvider";

type CompanyNavBarProps = {
  id: string;
  company?: Company | undefined;
};
export const Hero = ({ id }: CompanyNavBarProps) => {
  const { company: loggedInCompany } = useCompanyAuth();
  useEffect(() => {
    document.documentElement.classList.add("js-loaded");

    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,wght@8..144,100..1000&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section
      className="relative min-h-screen w-full overflow-hidden flex items-center justify-center px-4 sm:px-6"
      id={id}
    >
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 -z-10" />
        <Particles
          className="w-full absolute inset-0 z-10"
          particleColors={["#ffffff", "#ffffff"]}
          particleCount={
            typeof window !== "undefined" && window.innerWidth < 768 ? 100 : 300
          }
          particleSpread={10}
          speed={0.1}
          particleBaseSize={
            typeof window !== "undefined" && window.innerWidth < 768 ? 5 : 10
          }
          moveParticlesOnHover={true}
          alphaParticles={false}
          disableRotation={false}
        />
      </div>

      <div
        ref={containerRef}
        className="relative text-center space-y-4 md:space-y-8 max-w-4xl mx-auto px-4 sm:px-6 z-10"
        style={{ position: "relative" }}
      >
        <motion.div
          className="space-y-2 md:space-y-4 tracking-tight leading-tight"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="mb-4">
            <VariableProximity
              label="Цаг захиалгын"
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight block"
              fromFontVariationSettings="'wght' 400, 'opsz' 14"
              toFontVariationSettings="'wght' 900, 'opsz' 40"
              containerRef={containerRef as React.RefObject<HTMLDivElement>}
              radius={150}
              falloff="exponential"
              style={{
                background:
                  "linear-gradient(to top, #FFFFFF 0%, #E6F3FF 52%, #B3D9FF 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                color: "transparent",
                lineHeight: 1.2,
                fontFamily: '"Roboto Flex", sans-serif',
                fontFeatureSettings: '"cv02", "cv03", "cv04", "cv11"',
              }}
            />
          </div>
          <div className="mb-4">
            <VariableProximity
              label="Нэгдсэн платформ"
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight block"
              fromFontVariationSettings="'wght' 400, 'opsz' 14"
              toFontVariationSettings="'wght' 900, 'opsz' 40"
              containerRef={containerRef as React.RefObject<HTMLDivElement>}
              radius={150}
              falloff="exponential"
              style={{
                background:
                  "linear-gradient(to top, #FFFFFF 0%, #E6F3FF 52%, #B3D9FF 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                color: "transparent",
                lineHeight: 1.2,
                fontFamily: '"Roboto Flex", sans-serif',
                fontFeatureSettings: '"cv02", "cv03", "cv04", "cv11"',
              }}
            />
          </div>
        </motion.div>

        <motion.div
          className="px-2 sm:px-0"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <ShinyText
            text="Монгол дахь шилдэг үйлчилгээ үзүүлэгчидтэй холбогдоод цаг захиалаарай."
            disabled={false}
            speed={3}
            className="text-base sm:text-lg lg:text-xl leading-relaxed max-w-2xl mx-auto"
          />
        </motion.div>

        <motion.div
          className="flex justify-center items-center pt-6 md:pt-12 gap-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          {!loggedInCompany && (
            <Link href={"/signup"}>
              <button
                className="group px-6 py-3 cursor-pointer sm:px-8 sm:py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25"
                style={{
                  background:
                    "linear-gradient(to right, #FFFFFF 0%, #E6F3FF 52%, #B3D9FF 100%)",
                  color: "#000A17",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "1.5rem",
                  textDecoration: "none",
                  transition: "all 0.3s ease",
                }}
              >
                <span className="flex items-center gap-2">
                  Бүртгүүлэх
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </span>
              </button>
            </Link>
          )}{" "}
          <Link href={"/company"}>
            <button
              className="group px-6 py-3 sm:px-8 cursor-pointer sm:py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25"
              style={{
                background:
                  "linear-gradient(to right, #FFFFFF 0%, #E6F3FF 52%, #B3D9FF 100%)",
                color: "#000A17",
                fontSize: "0.875rem",
                fontWeight: "600",
                padding: "0.75rem 1.5rem",
                borderRadius: "1.5rem",
                textDecoration: "none",
                transition: "all 0.3s ease",
              }}
            >
              <span className="flex items-center gap-2">
                Бүртгэлтэй компаниуд
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </span>
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
