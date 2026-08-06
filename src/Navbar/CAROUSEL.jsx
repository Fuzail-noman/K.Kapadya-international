import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight, Circle } from "lucide-react";
 
import logo5 from "../assets/img 9.png";
import logo6 from "../assets/img 11.png";
import logo7 from "../assets/img 10.png";
 
const slides = [
  {
    id: 1,
    title: "Clothes",
    img: logo5,
  },
  {
    id: 2,
    title: "Shalwar Kameez",
    img: logo6,
  },
  {
    id: 3,
    title: "Packed clothes",
    img: logo7,
  },
];
 
export default function Carousel() {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState("next");
  const [isPaused, setIsPaused] = useState(false);
  const timeoutRef = useRef(null);
 
  const goTo = useCallback((index, dir = "next") => {
    setDirection(dir);
    setActive((index + slides.length) % slides.length);
  }, []);
 
  const next = useCallback(() => goTo(active + 1, "next"), [active, goTo]);
  const prev = useCallback(() => goTo(active - 1, "prev"), [active, goTo]);
 
  useEffect(() => {
    if (isPaused) return;
    timeoutRef.current = setTimeout(next, 4000);
    return () => clearTimeout(timeoutRef.current);
  }, [active, isPaused, next]);
 
  return (
    // min-h-screen hata diya — ab ye sirf apne content jitni jagah leta hai,
    // isliye mobile pe carousel poori screen jitna lamba nahi hoga.
    <div className="w-full flex flex-col items-center justify-center py-6 px-4 sm:p-6">
      {/* Carousel */}
      <div
        className="relative w-full max-w-4xl aspect-[1/3] sm:aspect-video max-h-[80vh] sm:max-h-none rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-white/10 group"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {slides.map((slide, i) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-700 ease-out ${
              i === active
                ? "opacity-100 scale-100 z-10"
                : "opacity-0 scale-105 z-0 pointer-events-none"
            }`}
          >
            <img
              src={slide.img}
              alt={slide.title}
              className="w-full h-full object-cover"
              draggable={false}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
 
            <div
              className={`absolute bottom-0 left-0 right-0 p-4 sm:p-8 transition-all duration-700 delay-150 ${
                i === active
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6"
              }`}
            >
              <p className="text-emerald-300 text-[10px] sm:text-xs font-semibold tracking-[0.2em] uppercase mb-1 sm:mb-2">
                {String(i + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
              </p>
              <h2 className="text-white text-xl sm:text-3xl md:text-4xl font-bold mb-1">
                {slide.title}
              </h2>
              <p className="text-slate-200 text-xs sm:text-sm md:text-base">
                {slide.subtitle}
              </p>
            </div>
          </div>
        ))}
 
        {/* Prev / Next controls */}
        <button
          onClick={prev}
          aria-label="Previous slide"
          className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 hover:bg-white/25 hover:scale-110"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          onClick={next}
          aria-label="Next slide"
          className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 hover:bg-white/25 hover:scale-110"
        >
          <ChevronRight size={18} />
        </button>
 
        {/* Autoplay progress bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-white/10 z-20">
          <div
            key={active + String(isPaused)}
            className={`h-full bg-emerald-400 ${
              isPaused ? "" : "animate-[progress_4s_linear_forwards]"
            }`}
          />
        </div>
      </div>
 
      {/* Dot indicators */}
      <div className="flex items-center gap-2 mt-4 sm:mt-5">
        {slides.map((s, i) => (
          <button
            key={s.id}
            onClick={() => goTo(i, i > active ? "next" : "prev")}
            aria-label={`Go to slide ${i + 1}`}
            className="group/dot"
          >
            <Circle
              size={9}
              className={`transition-all duration-300 ${
                i === active
                  ? "fill-emerald-400 text-emerald-400 scale-125"
                  : "fill-white/20 text-white/20 group-hover/dot:fill-white/50 group-hover/dot:text-white/50"
              }`}
            />
          </button>
        ))}
      </div>
 
      <style>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
}