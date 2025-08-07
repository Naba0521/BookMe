"use client";

import { useEffect, useState, useRef } from "react";
import gsap from "gsap";

export default function Preloader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const boxesRef = useRef<(HTMLDivElement | null)[]>([]);

  const criticalImages = [
    "https://res.cloudinary.com/dpbmpprw5/image/upload/v1750157865/earth_Large_rwbjag.png",
  ];
  useEffect(() => {
    boxesRef.current = boxesRef.current.slice(0, 9);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (wrapperRef.current) {
      boxesRef.current = Array.from(
        wrapperRef.current.querySelectorAll(".box")
      ) as HTMLDivElement[];
    }

    let loadedCount = 0;
    const totalImages = criticalImages.length;

    const preloadImages = () => {
      if (totalImages === 0) {
        startAnimation();
        return;
      }

      criticalImages.forEach((src) => {
        const img = new window.Image();
        img.src = src;
        img.onload = () => handleImageLoad();
        img.onerror = () => handleImageLoad();
      });
    };

    const handleImageLoad = () => {
      loadedCount++;
      setProgress(Math.round((loadedCount / totalImages) * 100));
      if (loadedCount === totalImages) {
        startAnimation();
      }
    };

    const startAnimation = () => {
      let tl = gsap.timeline({
        onComplete: () => {
          if (wrapperRef.current) {
            gsap.set(wrapperRef.current, { display: "none" });
          }
          onComplete();
        },
      });

      tl.to(boxesRef.current, {
        scale: 0,
        y: 60,
        rotate: 400,
        duration: 1,
        repeat: 1,
        yoyo: true,
        delay: 0.3,
        stagger: {
          amount: 1.5,
          from: "end",
          grid: [3, 3],
        },
        ease: "power2.inOut",
      });

      tl.to(containerRef.current, {
        rotate: "-405deg",
        scale: 0,
        duration: 0.5,
        ease: "back.in",
      });

      tl.to(wrapperRef.current, {
        opacity: 0,
        duration: 0.3,
        display: "none",
        ease: "sine.in",
      });
    };

    document.body.style.overflow = "hidden";
    preloadImages();

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [onComplete]);

  return (
    <div
      ref={wrapperRef}
      className="wrapper fixed inset-0 z-50 bg-black flex items-center justify-center"
    >
      <div
        ref={containerRef}
        className="container relative grid grid-cols-3 grid-rows-3  w-[210px] h-[220px] p-4 bg-black "
      >
        {[...Array(9)].map((_, i) => (
          <div
            key={i}
            className="box  w-9 h-9 bg-cyan-400/90 rounded-sm"
            style={{
              left: `${(i % 3) * 33.33}%`,
              top: `${Math.floor(i / 3) * 33.33}%`,
              transformOrigin: "center center",
              boxShadow: "0 0 15px rgba(34, 211, 238, 0.8)",
              filter: "drop-shadow(0 0 8px rgba(34, 211, 238, 0.9))",
            }}
          />
        ))}
      </div>
    </div>
  );
}
