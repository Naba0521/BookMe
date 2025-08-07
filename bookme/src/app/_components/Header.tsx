import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import Link from "next/link";
import { useCompanyAuth } from "../_providers/CompanyAuthProvider";

type CompanyNavBarProps = {
  company?: string | undefined;
};
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
}

const Header = ({ company }: CompanyNavBarProps) => {
  const navRef = useRef<HTMLElement>(null);
  const animationRef = useRef<gsap.core.Tween | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const { company: loggedInCompany, signOutCompany } = useCompanyAuth();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);

    const nav = navRef.current;
    if (!nav) return;

    gsap.set(nav, {
      marginLeft: isMobile ? "5%" : "10%",
      marginRight: isMobile ? "5%" : "10%",
      backdropFilter: "blur(0px)",
      background: "rgba(0,0,0,0)",
    });

    let scrollTrigger: ScrollTrigger | null = null;
    if (!isMobile) {
      scrollTrigger = ScrollTrigger.create({
        trigger: document.body,
        start: "top top",
        end: "max",
        onUpdate: (self) => {
          const shouldShrink = self.progress > 0.05;

          if (animationRef.current) {
            animationRef.current.kill();
          }

          animationRef.current = gsap.to(nav, {
            duration: 0.5,
            ease: "power2.out",

            marginLeft: shouldShrink ? "15%" : "10%",
            marginRight: shouldShrink ? "15%" : "10%",
            backdropFilter: shouldShrink ? "blur(8px)" : "blur(0px)",
            background: shouldShrink ? "rgba(0,0,0,0.8)" : "rgba(0,0,0,0)",
            overwrite: "auto",
          });
        },
      });
    }

    const links = gsap.utils.toArray<HTMLAnchorElement>("nav a[href^='#']");
    const sections = gsap.utils.toArray<HTMLElement>("section[id]");
    const triggers: ScrollTrigger[] = [];

    sections.forEach((section) => {
      const trigger = ScrollTrigger.create({
        trigger: section,
        start: "top 30%",
        end: "bottom 30%",
        onEnter: () => updateActiveLink(section.id),
        onEnterBack: () => updateActiveLink(section.id),
      });
      triggers.push(trigger);
    });

    function updateActiveLink(sectionId: string) {
      const correspondingLink = document.querySelector(
        `nav a[href="#${sectionId}"]`
      );
      if (correspondingLink) {
        links.forEach((link) => link.classList.remove("active"));
        correspondingLink.classList.add("active");
      }
    }

    const handleClick = (e: MouseEvent, link: HTMLAnchorElement) => {
      e.preventDefault();
      const target = link.getAttribute("href");
      if (target) {
        gsap.to(window, {
          duration: 1,
          scrollTo: {
            y: target,
            offsetY: 80,
          },
          ease: "power2.inOut",
        });
      }
    };

    links.forEach((link) => {
      link.addEventListener("click", (e) => handleClick(e, link));
    });

    return () => {
      scrollTrigger?.kill();
      triggers.forEach((trigger) => trigger.kill());
      links.forEach((link) => {
        link.removeEventListener("click", (e) => handleClick(e, link));
      });
      if (animationRef.current) {
        animationRef.current.kill();
      }
      window.removeEventListener("resize", checkMobile);
    };
  }, [isMobile]);

  return (
    <nav
      ref={navRef}
      className={`fixed top-4 left-0 right-0 z-50 h-14 px-4 rounded-full transition-all duration-300
        ${
          isMobile
            ? "flex justify-between items-center"
            : "grid grid-cols-12 items-center gap-2"
        }`}
      style={{
        marginLeft: isMobile ? "5%" : "10%",
        marginRight: isMobile ? "5%" : "10%",
        backdropFilter: "blur(0px)",
        background: "rgba(0,0,0,0)",
        boxShadow:
          "inset 0 1px 0px rgba(255,255,255,0.2), 0 2px 8px rgba(0,0,0,0.16)",
      }}
    >
      <div className="text-white text-lg font-bold col-span-2 min-w-0">
        Bookme
      </div>

      <ul
        className={`${
          isMobile
            ? "hidden"
            : "flex items-center justify-center gap-2 list-none col-span-8 min-w-0"
        }`}
      >
        <li className="flex-shrink-1 opacity-0">
          <a
            href="#hero"
            className="text-white/90 text-sm font-medium px-3 py-2 rounded-full transition hover:bg-white/10 hover:text-white whitespace-nowrap"
          >
            Нүүр
          </a>
        </li>
        <li className="flex-shrink-1">
          <a
            href="#vertical-services"
            className="text-white/90 text-sm font-medium px-3 py-2 rounded-full transition hover:bg-white/10 hover:text-white whitespace-nowrap"
          >
            Байгууллага
          </a>
        </li>
        <li className="flex-shrink-1">
          <a
            href="#services"
            className="text-white/90 text-sm font-medium px-3 py-2 rounded-full transition hover:bg-white/10 hover:text-white whitespace-nowrap"
          >
            Үйлчлүүлэгч
          </a>
        </li>
        <li className="flex-shrink-1">
          <a
            href="#team"
            className="text-white/90 text-sm font-medium px-3 py-2 rounded-full transition hover:bg-white/10 hover:text-white whitespace-nowrap"
          >
            Манай баг
          </a>
        </li>
        <li className="flex-shrink-1">
          <a
            href="#footer"
            className="text-white/90 text-sm font-medium px-3 py-2 rounded-full transition hover:bg-white/10 hover:text-white whitespace-nowrap"
          >
            Холбоо барих
          </a>
        </li>
      </ul>
      <div
        className={`${
          isMobile ? "ml-auto" : "col-span-2 flex justify-end min-w-0"
        }`}
      >
        {!loggedInCompany ? (
          <Link href={"/signin"}>
            <button
              className="group px-3 py-2 cursor-pointer rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 whitespace-nowrap text-xs"
              style={{
                background:
                  "linear-gradient(to right, #FFFFFF 0%, #E6F3FF 52%, #B3D9FF 100%)",
                color: "#000A17",
                fontSize: "0.75rem",
                fontWeight: "600",
              }}
            >
              <span className="flex items-center gap-1">
                Нэвтрэх
                <svg
                  className="w-3 h-3 transition-transform group-hover:translate-x-1"
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
        ) : (
          <>
            <Link href={`/company/${company}/dashboard`}>
              <button
                className="group px-3 py-2 cursor-pointer rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 whitespace-nowrap text-xs"
                style={{
                  background:
                    "linear-gradient(to right, #FFFFFF 0%, #E6F3FF 52%, #B3D9FF 100%)",
                  color: "#000A17",
                  fontSize: "0.75rem",
                  fontWeight: "600",
                }}
              >
                <span className="flex items-center gap-1">
                  Хяналтын самбар
                  <svg
                    className="w-3 h-3 transition-transform group-hover:translate-x-1"
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
            <button
              onClick={signOutCompany}
              className="ml-5 group px-3 py-2 cursor-pointer rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 whitespace-nowrap text-xs"
              style={{
                background:
                  "linear-gradient(to right, #FFFFFF 0%, #E6F3FF 52%, #B3D9FF 100%)",
                color: "#000A17",
                fontSize: "0.75rem",
                fontWeight: "600",
              }}
            >
              <span className="flex items-center gap-1">
                Гарах
                <svg
                  className="w-3 h-3 transition-transform group-hover:translate-x-1"
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
          </>
        )}
      </div>
    </nav>
  );
};

export default Header;
