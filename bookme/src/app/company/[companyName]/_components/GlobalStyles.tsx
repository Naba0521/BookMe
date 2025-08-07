"use client";

export const GlobalStyles = () => {
  return (
    <style jsx global>{`
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes slideInUp {
        from {
          opacity: 0;
          transform: translateY(50px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes slideInRight {
        from {
          opacity: 0;
          transform: translateX(50px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }

      .animate-fadeInUp {
        animation: fadeInUp 0.8s ease-out;
      }

      .animate-slideInUp {
        animation: slideInUp 0.8s ease-out;
      }

      .animate-slideInRight {
        animation: slideInRight 0.6s ease-out;
      }
    `}</style>
  );
};
