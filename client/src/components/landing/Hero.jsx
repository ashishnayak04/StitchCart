import { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, CreditCard, RotateCcw } from "lucide-react";
import { gsap, EASE, prefersReducedMotion } from "./gsap-setup";
import { HERO_STACK } from "./data";
import Magnetic from "./Magnetic";

const GRAIN_URI =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E\")";

const CARD_TILTS = [4, -5, 3];
const CARD_SHIFTS = [
  { x: 0, y: 0 },
  { x: 60, y: 44 },
  { x: -48, y: 96 },
];

const TICKER_ITEMS = [
  "Free Shipping Over $75",
  "New Drops Every Friday",
  "Secure USD Checkout",
  "Coupons & Early Access",
  "Cancel Anytime — Auto Refunds",
  "Stripe + PayPal",
];

function TickerStrip() {
  const trackRef = useRef(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const tween = gsap.to(trackRef.current, {
      xPercent: -50,
      ease: "none",
      duration: 26,
      repeat: -1,
    });
    return () => tween.kill();
  }, []);

  return (
    <div className="relative z-20 bg-espresso border-t border-gold/30 overflow-hidden py-3.5">
      <div className="flex overflow-hidden">
        <div
          ref={trackRef}
          className="flex shrink-0 items-center gap-10 pr-10 whitespace-nowrap"
        >
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span
              key={i}
              className="flex items-center gap-10 font-serif text-sm italic text-gold"
            >
              {item}
              <span className="not-italic text-gold/40">✦</span>
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
  const stackRef = useRef(null);

  useLayoutEffect(() => {
    const reduced = prefersReducedMotion();
    const ctx = gsap.context(() => {
      const copyEls = copyRef.current.querySelectorAll("[data-hero-copy]");
      const cards = stackRef.current.querySelectorAll("[data-hero-card]");

      if (reduced) {
        gsap.set([...copyEls, ...cards], { clearProps: "all", opacity: 1 });
        return;
      }

      const tl = gsap.timeline({
        defaults: { ease: EASE, duration: 0.9 },
        delay: 0.15,
      });

      tl.fromTo(
        copyEls,
        { y: 44, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.12 }
      ).fromTo(
        cards,
        {
          clipPath: "inset(14% 10% 14% 10% round 8px)",
          y: 60,
          opacity: 0,
          rotate: (i) => CARD_TILTS[i],
        },
        {
          clipPath: "inset(0% 0% 0% 0% round 0px)",
          y: 0,
          opacity: 1,
          rotate: 0,
          stagger: 0.14,
          duration: 1.1,
        },
        "-=0.45"
      );

      gsap.fromTo(
        stackRef.current,
        { y: 0 },
        {
          yPercent: 9,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        }
      );

      cards.forEach((card, i) => {
        gsap.to(card, {
          y: i % 2 === 0 ? -12 : 14,
          rotate: CARD_TILTS[i] / 2,
          duration: 3.2 + i * 0.4,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          delay: 1.4 + i * 0.25,
        });
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="relative bg-ivory overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.05] mix-blend-overlay"
        style={{ backgroundImage: GRAIN_URI }}
      />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 hidden lg:block bg-gradient-to-l from-beige/50 to-transparent" />

      <div className="relative max-w-[1440px] mx-auto px-6 lg:px-12 pt-32 lg:pt-28 pb-16 grid lg:grid-cols-12 gap-14 items-center min-h-[92vh]">
        <div ref={copyRef} className="lg:col-span-6 relative z-10">
          <p
            data-hero-copy
            className="overline text-accent flex items-center gap-3 mb-8"
          >
            <span className="w-10 h-px bg-accent" />
            StitchCart — The Considered Wardrobe
          </p>

          <h1 data-hero-copy className="display-xl text-espresso">
            Timeless fashion,
            <br />
            <em className="text-accent italic font-medium">curated</em> for
            the way you live.
          </h1>

          <p
            data-hero-copy
            className="text-brown/80 leading-relaxed max-w-lg mt-6 text-base sm:text-lg"
          >
            Shop Men, Women, Kids, Footwear and Accessories from the brands
            you already trust — Nike, Adidas, Levi&apos;s, Zara and more —
            with secure, transparent USD checkout and a cart that never
            forgets.
          </p>

          <div data-hero-copy className="flex flex-col sm:flex-row gap-4 mt-10">
            <Magnetic>
              <Link
                to="/shop/listing"
                className="group inline-flex items-center justify-center h-14 px-10 text-xs font-semibold uppercase tracking-[0.12em] bg-espresso text-ivory hover:bg-gold hover:text-espresso transition-colors duration-base relative overflow-hidden"
              >
                <span className="relative z-10">Shop the Collection</span>
                <ArrowRight className="w-4 h-4 ml-3 relative z-10 transition-transform duration-fast group-hover:translate-x-1" />
                <span className="absolute inset-0 bg-gold translate-y-full group-hover:translate-y-0 transition-transform duration-slow ease-luxury" />
              </Link>
            </Magnetic>
            <Magnetic>
              <Link
                to="#categories"
                className="inline-flex items-center justify-center h-14 px-10 text-xs font-semibold uppercase tracking-[0.12em] border border-border text-espresso hover:border-accent hover:text-accent-hover transition-colors duration-base"
              >
                Browse Categories
              </Link>
            </Magnetic>
          </div>

          <div
            data-hero-copy
            className="flex flex-wrap gap-x-8 gap-y-3 mt-12 text-xs text-muted"
          >
            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-sage" /> SSL-secured
              checkout
            </span>
            <span className="inline-flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-accent" /> Stripe &amp;
              PayPal
            </span>
            <span className="inline-flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-clay" /> Cancel anytime,
              auto-refund
            </span>
          </div>
        </div>

        <div
          ref={stackRef}
          className="lg:col-span-6 relative h-[440px] sm:h-[520px] lg:h-[560px]"
        >
          {HERO_STACK.map((item, i) => (
            <div
              key={item.name}
              data-hero-card
              className="absolute w-[210px] sm:w-[250px] lg:w-[270px] bg-surface-raised border border-border shadow-3 cursor-pointer group"
              style={{
                left: "50%",
                top: `${8 + i * 7}%`,
                transform: `translateX(calc(-50% + ${CARD_SHIFTS[i].x}px)) translateY(${CARD_SHIFTS[i].y}px) rotate(${CARD_TILTS[i]}deg)`,
                zIndex: 3 - i,
              }}
            >
              <motion.div
                whileHover={{ scale: 1.04, rotate: CARD_TILTS[i] / 4 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="eager"
                    className="w-full h-full object-cover transition-transform duration-slow ease-luxury group-hover:scale-105"
                  />
                  <span className="absolute top-3 left-3 bg-espresso text-ivory text-[10px] uppercase tracking-[0.14em] px-2.5 py-1">
                    {item.tag}
                  </span>
                </div>
                <div className="p-4 bg-surface-raised">
                  <p className="overline text-muted mb-1">{item.brand}</p>
                  <h3 className="heading text-espresso text-base">
                    {item.name}
                  </h3>
                  <p className="text-accent font-serif text-lg mt-1.5">
                    {item.price}
                  </p>
                </div>
              </motion.div>
            </div>
          ))}

          <p className="absolute -bottom-2 right-0 hidden lg:block text-[11px] uppercase tracking-[0.28em] text-taupe [writing-mode:vertical-rl]">
            The Edit — Spring Collection
          </p>
        </div>
      </div>

      <TickerStrip />
    </section>
  );
}

export default Hero;
