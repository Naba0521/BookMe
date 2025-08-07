import React, { useRef, useEffect, ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface AnimatedContentProps {
  children: ReactNode;
  distance?: number;
  direction?: "vertical" | "horizontal";
  reverse?: boolean;
  duration?: number;
  ease?: string;
  initialOpacity?: number;
  animateOpacity?: boolean;
  scale?: number;
  threshold?: number;
  delay?: number;
  onComplete?: () => void;
  smoothScroll?: boolean;
  scrub?: boolean | number;
  anticipatePin?: number;
  refreshPriority?: number;
  stagger?: number;
  className?: string;
}

const AnimatedContent: React.FC<AnimatedContentProps> = ({
  children,
  distance = 60,
  direction = "vertical",
  reverse = false,
  duration = 1.2,
  ease = "power2.out",
  initialOpacity = 0,
  animateOpacity = true,
  scale = 0.95,
  threshold = 0.15,
  delay = 0,
  onComplete,
  smoothScroll = true,
  scrub = false,
  anticipatePin = 1,
  refreshPriority = 0,
  stagger = 0,
  className = "",
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Enhanced ScrollTrigger configuration
    if (smoothScroll) {
      ScrollTrigger.config({
        autoRefreshEvents: "visibilitychange,DOMContentLoaded,load,resize",
        ignoreMobileResize: true,
      });
    }

    const axis = direction === "horizontal" ? "x" : "y";
    const offset = reverse ? -distance : distance;
    const startPct = Math.max(0, Math.min(100, (1 - threshold) * 100));

    // Initial state with better performance
    gsap.set(el, {
      [axis]: offset,
      scale,
      opacity: animateOpacity ? initialOpacity : 1,
      force3D: true,
      transformOrigin: "center center",
      visibility: "visible",
      willChange: "transform, opacity",
    });

    // Check if element has children for stagger animation
    const children = el.children;
    const hasChildren = children.length > 0 && stagger > 0;

    if (hasChildren) {
      // Stagger animation for children
      gsap.set(children, {
        [axis]: offset,
        scale,
        opacity: animateOpacity ? initialOpacity : 1,
        force3D: true,
      });
    }

    const animationProps = {
      [axis]: 0,
      scale: 1,
      opacity: 1,
      duration: scrub ? 1 : duration,
      ease: scrub ? "none" : ease,
      delay: scrub ? 0 : delay,
      force3D: true,
      onComplete: () => {
        if (el) {
          el.style.willChange = "auto";
        }
        onComplete?.();
      },
    };

    let animation;

    if (hasChildren) {
      // Animate children with stagger
      animation = gsap.to(children, {
        ...animationProps,
        stagger: stagger,
        scrollTrigger: {
          trigger: el,
          start: `top ${startPct}%`,
          end: scrub ? "bottom 20%" : undefined,
          toggleActions: scrub ? undefined : "play none none reverse",
          scrub,
          once: !scrub,
          anticipatePin,
          refreshPriority,
          onUpdate: (self) => {
            if (self.progress === 1 && el) {
              el.style.willChange = "auto";
            }
          },
          onToggle: (self) => {
            if (self.isActive && el) {
              el.style.willChange = "transform, opacity";
            }
          },
        },
      });
    } else {
      // Animate the container
      animation = gsap.to(el, {
        ...animationProps,
        scrollTrigger: {
          trigger: el,
          start: `top ${startPct}%`,
          end: scrub ? "bottom 20%" : undefined,
          toggleActions: scrub ? undefined : "play none none reverse",
          scrub,
          once: !scrub,
          anticipatePin,
          refreshPriority,
          onUpdate: (self) => {
            if (self.progress === 1 && el) {
              el.style.willChange = "auto";
            }
          },
          onToggle: (self) => {
            if (self.isActive && el) {
              el.style.willChange = "transform, opacity";
            }
          },
        },
      });
    }

    // Cleanup function
    return () => {
      if (el) {
        el.style.willChange = "auto";
        el.style.visibility = "visible";
      }

      // Kill specific ScrollTriggers
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.trigger === el) {
          trigger.kill();
        }
      });

      // Kill GSAP tweens
      if (hasChildren) {
        gsap.killTweensOf(children);
      }
      gsap.killTweensOf(el);
    };
  }, [
    distance,
    direction,
    reverse,
    duration,
    ease,
    initialOpacity,
    animateOpacity,
    scale,
    threshold,
    delay,
    onComplete,
    smoothScroll,
    scrub,
    anticipatePin,
    refreshPriority,
    stagger,
  ]);

  return (
    <div
      ref={ref}
      className={`animated-content ${className}`}
      style={{
        visibility: "hidden",
        backfaceVisibility: "hidden",
        perspective: "1000px",
      }}
    >
      {children}
    </div>
  );
};

export default AnimatedContent;
