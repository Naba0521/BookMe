"use client";

import { useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Particles from "./_components/Particles";
import Header from "./_components/Header";
import ServicesParent from "./_components/Organization";
import VerticalServicesParent from "./_components/VerticalServicesParent";
import OurTeam from "./_components/OurTeam";
import Footer from "./_components/Footer";
import Image from "next/image";
import { Hero } from "./_components/Hero";
import Preloader from "./_components/Preloader";
import { motion } from "framer-motion";
import { useCompanyAuth } from "./_providers/CompanyAuthProvider";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function HomePage() {
  const { company } = useCompanyAuth();
  const [isLoading, setIsLoading] = useState(true);
  const handleLoadComplete = () => {
    setIsLoading(false);
    document.body.style.overflow = "auto";
  };

  return (
    <>
      {isLoading && <Preloader onComplete={handleLoadComplete} />}

      <main
        className={`relative w-screen overflow-hidden ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
        style={{
          transition: "opacity 1s ease-in-out",
        }}
      >
        <div className="absolute inset-0 -z-10">
          <Particles
            className="absolute inset-0 z-10"
            particleColors={["#ffffff", "#ffffff"]}
            particleCount={300}
          />

          {!isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="absolute top-96 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] z-30"
            >
              <div className="absolute inset-0 rounded-full bg-gradient-radial from-blue-400/20 via-cyan-400/10 to-transparent blur-3xl scale-150 animate-pulse"></div>

              <Image
                src="https://res.cloudinary.com/dpbmpprw5/image/upload/q_auto,f_auto/v1750157865/earth_Large_rwbjag.png"
                alt="Earth"
                width={1000}
                height={1000}
                priority
                className="object-contain opacity-100 pointer-events-none rotating-earth"
                style={{
                  filter: "drop-shadow(0 0 50px rgba(59, 130, 246, 0.8))",
                }}
                quality={80}
                unoptimized={false}
              />
            </motion.div>
          )}
        </div>

        <Header company={company?.companyName} />
        {!isLoading && <Hero id="hero" />}
        <VerticalServicesParent id="vertical-services" />
        <ServicesParent id="services" />
        <OurTeam id="team" />
        <Footer id="footer" />
      </main>
    </>
  );
}
