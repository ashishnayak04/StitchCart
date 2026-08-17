import { useLayoutEffect, useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Truck,
  ChevronLeft,
  ChevronRight,
  Star,
  ShoppingBag,
  Sparkles,
  Check,
} from "lucide-react";
import { gsap, EASE, prefersReducedMotion } from "./gsap-setup";
import { HERO_SLIDES } from "./data";
import Magnetic from "./Magnetic";

const TICKER_STATEMENTS = [
  "Bespoke Blazers & Super 130s Italian Wool Tailoring",
  "Mulberry Silk Crepe Dresses & Sculpted Silhouettes",
  "Pinpoint Egyptian Oxford Cotton Formals",
  "Grade-A Mongolian Cashmere Knitwear",
  "Swiss Automatic Chronographs & Sapphire Horology",
  "Transparent INR Checkout with Instant Coupon Verification",
  "Stripe Card & PayPal Direct Payments with Automated Returns",
  "Pan-India Tracked Express Logistics Across 24,000+ PIN Codes",
];

function MarqueeTicker() {
  const trackRef = useRef(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const tween = gsap.to(trackRef.current, {
      xPercent: -50,
      ease: "none",
      duration: 32,
      repeat: -1,
    });
    return () => tween.kill();
  }, []);

  return (
    <div className="relative z-20 bg-espresso border-y border-gold/30 overflow-hidden py-3 select-none">
      <div className="flex overflow-hidden">
        <div
          ref={trackRef}
          className="flex shrink-0 items-center gap-8 sm:gap-12 pr-8 sm:pr-12 whitespace-nowrap"
        >
          {[...TICKER_STATEMENTS, ...TICKER_STATEMENTS].map((statement, idx) => (
            <span
              key={idx}
              className="flex items-center gap-8 sm:gap-12 font-serif text-xs sm:text-sm italic text-gold tracking-wide"
            >
              <span>{statement}</span>
              <span className="not-italic text-gold/40 text-[10px]">✦</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function Hero() {
  const root = useRef(null);
  const copyRef = useRef(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [addedItem, setAddedItem] = useState(false);

  const activeSlide = HERO_SLIDES[activeSlideIndex];

  // Auto-advance slides every 7 seconds when not actively hovered/focused
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [isPaused]);

  useLayoutEffect(() => {
    const reduced = prefersReducedMotion();
    const ctx = gsap.context(() => {
      const copyEls = copyRef.current?.querySelectorAll("[data-hero-el]");
      if (!copyEls || reduced) {
        if (copyEls) gsap.set(copyEls, { clearProps: "all", opacity: 1 });
        return;
      }
      gsap.fromTo(
        copyEls,
        { y: 28, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.08,
          duration: 0.75,
          ease: EASE,
          delay: 0.05,
        }
      );
    }, root);
    return () => ctx.revert();
  }, []);

  const handleNext = () => {
    setActiveSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const handlePrev = () => {
    setActiveSlideIndex(
      (prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length
    );
  };

  const handleQuickAdd = () => {
    setAddedItem(true);
    window.dispatchEvent(new CustomEvent("landing:add-to-cart"));
    setTimeout(() => setAddedItem(false), 1800);
  };

  return (
    <section
      ref={root}
      className="relative bg-ivory text-espresso overflow-hidden pt-20 sm:pt-24 lg:pt-28 flex flex-col justify-between"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute top-4 left-10 w-[320px] sm:w-[420px] h-[320px] sm:h-[420px] bg-gold/10 rounded-full blur-3xl -z-0" />
      <div className="pointer-events-none absolute bottom-20 right-10 w-[360px] sm:w-[500px] h-[360px] sm:h-[500px] bg-beige/60 rounded-full blur-3xl -z-0" />

      {/* Main Grid Content */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-4 sm:py-6 lg:py-8 grid lg:grid-cols-12 gap-8 lg:gap-14 items-center flex-1 w-full">
        {/* Left Column: Product Positioning & Value Copy */}
        <div ref={copyRef} className="lg:col-span-6 space-y-4 sm:space-y-5">
          <div
            data-hero-el
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent text-[11px] sm:text-xs font-semibold uppercase tracking-[0.18em]"
          >
            <Sparkles className="w-3.5 h-3.5 text-accent shrink-0" />
            <span>StitchCart Atelier · Contemporary Fashion</span>
          </div>

          <h1
            data-hero-el
            className="font-serif text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-normal leading-[1.08] tracking-tight text-espresso"
          >
            Contemporary Fashion,
            <br />
            <em className="text-accent italic font-light">
              Engineered for Clarity.
            </em>
          </h1>

          <p
            data-hero-el
            className="text-brown/85 leading-relaxed max-w-xl text-sm sm:text-base lg:text-lg font-light"
          >
            Discover bespoke tailoring, Egyptian cotton formals, pure silk
            crepes, and automatic horology. Built with real-time transparent INR
            pricing, instant coupon math, and rapid pan-India fulfillment.
          </p>

          <div
            data-hero-el
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-1"
          >
            <Magnetic>
              <Link
                to="/shop/listing"
                className="group inline-flex items-center justify-center min-h-[48px] h-12 sm:h-14 px-7 sm:px-8 text-xs font-semibold uppercase tracking-[0.18em] bg-espresso text-ivory hover:bg-gold hover:text-espresso transition-all duration-base relative overflow-hidden shadow-2 active:scale-98"
              >
                <span className="relative z-10 flex items-center gap-2.5">
                  <span>Explore Collection</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-fast group-hover:translate-x-1" />
                </span>
                <span className="absolute inset-0 bg-gold translate-y-full group-hover:translate-y-0 transition-transform duration-slow ease-luxury" />
              </Link>
            </Magnetic>

            <Magnetic>
              <a
                href="#collection"
                className="inline-flex items-center justify-center min-h-[48px] h-12 sm:h-14 px-7 sm:px-8 text-xs font-semibold uppercase tracking-[0.18em] border border-espresso/30 text-espresso hover:border-accent hover:text-accent bg-surface-raised/80 backdrop-blur-sm transition-colors duration-base active:bg-surface-hover"
              >
                Live Catalog Demo
              </a>
            </Magnetic>
          </div>

          {/* Value Prop Badges */}
          <div
            data-hero-el
            className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 pt-3 sm:pt-4 border-t border-border text-xs text-brown/90"
          >
            <div className="flex items-center gap-2.5 bg-surface-raised/80 p-2.5 border border-border shadow-xs">
              <ShieldCheck className="w-4 h-4 text-sage shrink-0" />
              <span className="leading-tight font-medium">
                SSL-Secured Checkout
              </span>
            </div>
            <div className="flex items-center gap-2.5 bg-surface-raised/80 p-2.5 border border-border shadow-xs">
              <CreditCard className="w-4 h-4 text-accent shrink-0" />
              <span className="leading-tight font-medium">
                Stripe &amp; PayPal INR
              </span>
            </div>
            <div className="flex items-center gap-2.5 bg-surface-raised/80 p-2.5 border border-border shadow-xs">
              <Truck className="w-4 h-4 text-taupe shrink-0" />
              <span className="leading-tight font-medium">
                Pan-India Tracking
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Realistic Application UI Showcase */}
        <div className="lg:col-span-6 relative z-10 w-full">
          <div className="relative w-full aspect-[4/5] sm:aspect-[16/12] lg:aspect-[4/5] min-h-[420px] sm:min-h-[460px] max-h-[580px] rounded-none overflow-hidden bg-surface-raised border border-border shadow-3 group">
            {/* Animated Outfit Showcase */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide.id}
                initial={{ opacity: 0, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="absolute inset-0 w-full h-full"
              >
                <img
                  src={activeSlide.image}
                  alt={activeSlide.title}
                  className="w-full h-full object-cover transition-transform duration-slow ease-luxury group-hover:scale-104"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-espresso/85 via-espresso/20 to-transparent" />
              </motion.div>
            </AnimatePresence>

            {/* Top Badges */}
            <div className="absolute top-3 sm:top-4 left-3 sm:left-4 z-20 flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="bg-espresso text-ivory text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.16em] px-2.5 sm:px-3 py-1 shadow-1 border border-ivory/20">
                {activeSlide.badge}
              </span>
              <span className="bg-gold text-espresso text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.14em] px-2.5 sm:px-3 py-1 shadow-1">
                {activeSlide.brand}
              </span>
            </div>

            {/* Stock status indicator */}
            <div className="absolute top-3 sm:top-4 right-3 sm:right-4 z-20">
              <span className="bg-surface-raised/90 backdrop-blur-sm text-espresso text-[9px] sm:text-[10px] font-medium uppercase tracking-[0.12em] px-2.5 sm:px-3 py-1 border border-border flex items-center gap-1.5 shadow-1">
                <span className="w-1.5 h-1.5 rounded-full bg-sage" />
                In Stock
              </span>
            </div>

            {/* Floating Product Glassmorphism Panel */}
            <div className="absolute inset-x-3 sm:inset-x-4 bottom-3 sm:bottom-4 z-20 p-3.5 sm:p-5 bg-surface-raised/95 backdrop-blur-md border border-border shadow-3">
              <div className="flex items-start justify-between gap-3 sm:gap-4">
                <div className="min-w-0 flex-1">
                  <p className="overline text-accent text-[9px] sm:text-[10px] font-semibold mb-0.5 truncate">
                    {activeSlide.category} · {activeSlide.sku}
                  </p>
                  <h3 className="font-serif text-base sm:text-xl lg:text-2xl text-espresso font-medium leading-snug truncate">
                    {activeSlide.title}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-muted mt-0.5 font-serif italic truncate">
                    ✦ {activeSlide.tagline}
                  </p>
                  <div className="hidden sm:flex items-center gap-2 text-[10px] sm:text-[11px] text-taupe mt-1.5 font-medium">
                    <span>{activeSlide.fabric}</span>
                    <span>·</span>
                    <span>{activeSlide.fit}</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="flex items-center gap-1 text-gold text-[11px] sm:text-xs font-semibold justify-end mb-0.5">
                    <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-gold stroke-gold" />
                    <span>{activeSlide.rating}</span>
                    <span className="text-muted text-[10px] hidden sm:inline">
                      ({activeSlide.reviews})
                    </span>
                  </div>
                  <p className="font-serif text-lg sm:text-2xl text-accent font-semibold">
                    ₹{activeSlide.price.toLocaleString("en-IN")}
                  </p>
                  <p className="text-[10px] sm:text-xs text-muted line-through">
                    ₹{activeSlide.originalPrice.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>

              {/* Action bar */}
              <div className="flex items-center justify-between mt-3 sm:mt-4 pt-2.5 sm:pt-3.5 border-t border-beige">
                <button
                  onClick={handleQuickAdd}
                  className={`inline-flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs uppercase tracking-[0.14em] font-semibold px-3 sm:px-4 py-2 transition-all min-h-[36px] ${
                    addedItem
                      ? "bg-sage text-white"
                      : "bg-espresso text-ivory hover:bg-gold hover:text-espresso"
                  }`}
                >
                  {addedItem ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Added to Bag</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-3.5 h-3.5 text-gold" />
                      <span>Quick Add</span>
                    </>
                  )}
                </button>

                {/* Slider Controls with 36px touch area */}
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <button
                    onClick={handlePrev}
                    aria-label="Previous Garment Slide"
                    className="w-9 h-9 border border-border bg-surface-raised hover:bg-espresso hover:text-ivory text-espresso transition-colors flex items-center justify-center shadow-1 active:scale-95"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNext}
                    aria-label="Next Garment Slide"
                    className="w-9 h-9 border border-border bg-surface-raised hover:bg-espresso hover:text-ivory text-espresso transition-colors flex items-center justify-center shadow-1 active:scale-95"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Slide Tabs */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 pb-4 sm:pb-6 w-full">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-border">
          {HERO_SLIDES.map((slide, idx) => (
            <button
              key={slide.id}
              onClick={() => setActiveSlideIndex(idx)}
              className={`text-left p-2.5 sm:p-3.5 border transition-all duration-base bg-surface-raised ${
                idx === activeSlideIndex
                  ? "border-accent bg-accent/10 text-espresso font-semibold shadow-1"
                  : "border-border hover:border-accent/40 text-muted hover:text-espresso"
              }`}
            >
              <div className="flex items-center justify-between">
                <p className="overline text-accent text-[9px] sm:text-[10px]">
                  0{idx + 1} · {slide.brand}
                </p>
                <span className="text-[10px] sm:text-[11px] font-semibold text-espresso font-serif">
                  ₹{slide.price.toLocaleString("en-IN")}
                </span>
              </div>
              <p className="font-serif text-[11px] sm:text-xs truncate mt-0.5 sm:mt-1 text-espresso font-medium">
                {slide.title}
              </p>
            </button>
          ))}
        </div>

        {/* Slide Progress Timer Line */}
        <div className="w-full h-0.5 bg-beige mt-3 sm:mt-4 overflow-hidden rounded-full">
          <motion.div
            key={activeSlideIndex}
            initial={{ width: "0%" }}
            animate={{ width: isPaused ? "100%" : "100%" }}
            transition={{ duration: isPaused ? 0 : 7.0, ease: "linear" }}
            className="h-full bg-accent"
          />
        </div>
      </div>

      <MarqueeTicker />
    </section>
  );
}

export default Hero;
