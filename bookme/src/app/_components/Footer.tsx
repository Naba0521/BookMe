import React from "react";
import { motion } from "framer-motion";
import { Copyright } from "lucide-react";
import FacebookIcon from "./assets/FacebookIcon";
import InstagramIcon from "./assets/InstagramIcon";

const carousel = [
  "Bookme",
  "Bookme",
  "Bookme",
  "Bookme",
  "Bookme",
  "Bookme",
  "Bookme",
  "Bookme",
  "Bookme",
  "Bookme",
  "Bookme",
  "Bookme",
  "Bookme",
  "Bookme",
  "Bookme",
  "Bookme",
  "Bookme",
];

export default function Footer({ id }: { id: string }) {
  const scrollVariants = {
    animate: {
      x: ["0%", "-100%"],
      transition: {
        repeat: Infinity,
        repeatType: "loop" as const,
        duration: 120,
        ease: "linear" as const,
      },
    },
  };

  return (
    <section className="min-h-[500px] w-full bg-[#000a17]" id={id}>
      {/* Animated text banner - now with controlled gap */}
      <div className="h-16 bg-blue-500 overflow-hidden relative flex items-center">
        <motion.div
          className="flex absolute whitespace-nowrap item"
          variants={scrollVariants}
          animate="animate"
          style={{ gap: "4rem" }}
        >
          {/* Double the array for seamless looping */}
          {[...carousel, ...carousel].map((item, i) => (
            <span
              key={`item-${i}`}
              className="text-3xl font-semibold text-white"
            >
              {item}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Main footer content */}
      <div className="px-4 md:px-22">
        <div className="w-full flex flex-col lg:flex-row pt-8 md:pt-[78px] gap-8 lg:gap-0 lg:justify-between">
          {/* Brand section */}
          <div className="flex flex-col text-white gap-3 items-center lg:items-start">
            <div className="text-center lg:text-left">
              <h4 className="text-2xl md:text-4xl font-bold">Bookme</h4>
              <p className="text-xs">booking platform</p>
            </div>
          </div>

          {/* Links and social section */}
          <div className="flex flex-col md:flex-row gap-8 md:gap-16 lg:gap-[112px] lg:mr-[186px]">
            {/* Navigation links */}
            <div className="flex flex-col gap-3 md:gap-4 text-white text-center md:text-left">
              <h5 className="text-gray-400 font-semibold">Bookme</h5>
              <p className="hover:text-blue-400 cursor-pointer transition-colors">
                Нүүр
              </p>
              <p className="hover:text-blue-400 cursor-pointer transition-colors">
                Байгууллагад
              </p>
              <p className="hover:text-blue-400 cursor-pointer transition-colors">
                Үйлчлүүлэгчдэд
              </p>
              <p className="hover:text-blue-400 cursor-pointer transition-colors">
                Манай баг
              </p>
            </div>

            {/* Social media section */}
            <div className="flex flex-col gap-3 md:gap-4 items-center md:items-start">
              <h5 className="text-gray-400 font-semibold">FOLLOW US</h5>
              <div className="flex gap-4">
                <FacebookIcon />
                <InstagramIcon />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer bottom - policies */}
      <div className="flex flex-col md:flex-row text-gray-400 gap-4 md:gap-[48px] mx-4 md:mx-22 py-4 md:h-21 border-t border-gray-400 items-center md:items-center mt-12 md:mt-[102px] text-center md:text-left">
        <div className="flex items-center gap-1 flex-wrap justify-center md:justify-start">
          <p>Copyright 2025</p>
          <Copyright className="h-[13px] w-5" />
          <p>Bookme LLC</p>
        </div>
        <div className="flex flex-col md:flex-row gap-2 md:gap-[48px]">
          <p className="hover:text-white cursor-pointer transition-colors">
            Privacy policy
          </p>
          <p className="hover:text-white cursor-pointer transition-colors">
            Terms and condition
          </p>
          <p className="hover:text-white cursor-pointer transition-colors">
            Cookie policy
          </p>
        </div>
      </div>
    </section>
  );
}
