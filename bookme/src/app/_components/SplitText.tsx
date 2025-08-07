import { animate, stagger } from "motion";
import { splitText } from "motion-plus";
import { useEffect, useRef } from "react";

export default function SplitText() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.fonts.ready.then(() => {
      if (!containerRef.current) return;

      containerRef.current.style.visibility = "visible";

      const h1Elements = containerRef.current.querySelectorAll("h1");

      h1Elements.forEach((h1) => {
        const { words } = splitText(h1);

        animate(
          words,
          { opacity: [0, 1], y: [10, 0] },
          {
            type: "spring",
            duration: 4,
            bounce: 0,
            delay: stagger(0.05),
          }
        );
      });
    });
  }, []);

  return (
    <div className="container flex flex-col" ref={containerRef}>
      <h1 className="text-white text-7xl font-bold tracking-tight leading-tight">
        Цаг захиалгын
      </h1>
      <h1 className="text-white text-7xl font-bold tracking-tight leading-tight">
        Нэгдсэн платформ
      </h1>
      <Stylesheet />
    </div>
  );
}

function Stylesheet() {
  return (
    <style>{`
            .container {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 100%;
                text-align: center;
                visibility: hidden; /* Hidden initially */
            }

            .split-word {
                will-change: transform, opacity;
            }
        `}</style>
  );
}
