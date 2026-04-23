import { useRef, useState, useEffect, useCallback } from "react";

const ParallaxBanner = ({ image, title }: { image: string; title: string }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [scale, setScale] = useState(1);

  const handleScroll = useCallback(() => {
    const section = sectionRef.current;
    if (!section) return;

    const rect = section.getBoundingClientRect();
    const sectionHeight = rect.height;
    const progress = Math.min(Math.max(-rect.top / sectionHeight, 0), 1);

    setScale(1 + progress * 0.45);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-[65vh] overflow-hidden [clip-path:inset(0)]"
    >
      <img
        src={image}
        alt={title}
        className="fixed inset-0 w-full h-[65vh] object-cover object-center brightness-85 -z-10 will-change-transform"
        style={{ transform: `scale(${scale})` }}
      />
      <div className="absolute inset-0 backdrop-blur-2xl mask-[linear-gradient(to_bottom,transparent_45%,black_100%)]" />
      <div className="absolute bottom-0 left-0 pl-16 pb-16 z-10">
        <h1 className="text-7xl font-extrabold text-white">{title}</h1>
      </div>
    </section>
  );
};

export default ParallaxBanner;