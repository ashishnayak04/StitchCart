import { useLayoutEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Search,
  SlidersHorizontal,
  ArrowDownWideNarrow,
  Heart,
  ShoppingBag,
  BadgePercent,
  MapPin,
  History,
  RotateCcw,
  Check,
} from "lucide-react";
import { gsap, EASE, prefersReducedMotion } from "./gsap-setup";
import { ORDER_STEPS } from "./data";
import SectionIndex from "./SectionIndex";

const blockInView = (index) => ({
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
  transition: { duration: 0.7, ease: "easeOut", delay: index * 0.12 },
});

function SearchMock() {
  return (
    <motion.div
      {...blockInView(0)}
      className="bg-surface-raised border border-border shadow-2 p-6 space-y-5"
    >
      <div className="flex items-center gap-3 border-b border-beige pb-4">
        <Search className="w-4 h-4 text-accent" />
        <span className="text-sm text-espresso">summer blazer</span>
        <span className="ml-auto text-[10px] text-muted">0.4s</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {["Men", "Zara", "Under $200", "In stock"].map((pill) => (
          <span
            key={pill}
            className="text-[11px] uppercase tracking-[0.1em] px-3 py-1.5 border border-border bg-surface-hover text-espresso"
          >
            {pill}
          </span>
        ))}
      </div>
      <div className="flex items-center gap-4 pt-2">
        <div className="w-16 aspect-[4/5] bg-beige/50 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=200&q=80"
            alt="Blazer result"
            loading="lazy"
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <p className="overline text-muted mb-1">Zara · Men</p>
          <p className="font-serif text-espresso font-medium">
            Tailored Wool Blazer
          </p>
          <p className="text-accent font-serif text-lg mt-1">$189</p>
        </div>
        <div className="ml-auto flex gap-1.5">
          <span className="w-8 h-8 flex items-center justify-center border border-border text-taupe">
            <Heart className="w-3.5 h-3.5" />
          </span>
          <span className="w-8 h-8 flex items-center justify-center bg-espresso text-ivory">
            <ShoppingBag className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
      <div className="flex items-center gap-3 text-[11px] text-muted pt-3 border-t border-beige">
        <SlidersHorizontal className="w-3.5 h-3.5" />
        <span>Filter by category, brand, price</span>
        <ArrowDownWideNarrow className="w-3.5 h-3.5 ml-auto" />
        <span>Sort by price · rating · newest</span>
      </div>
    </motion.div>
  );
}

function OrderTimeline() {
  const root = useRef(null);

  useLayoutEffect(() => {
    const reduced = prefersReducedMotion();
    const ctx = gsap.context(() => {
      const line = root.current.querySelector("[data-tl-line]");
      const steps = root.current.querySelectorAll("[data-tl-step]");
      const dots = root.current.querySelectorAll("[data-tl-dot]");

      if (reduced) {
        gsap.set([line, steps, dots], { clearProps: "all", opacity: 1 });
        return;
      }

      const tl = gsap.timeline({
        defaults: { ease: EASE },
        scrollTrigger: {
          trigger: root.current,
          start: "top 72%",
          once: true,
        },
      });

      tl.fromTo(line, { scaleY: 0 }, { scaleY: 1, duration: 1.1 })
        .fromTo(
          steps,
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.25, duration: 0.6 },
          "-=0.4"
        )
        .to(
          dots,
          {
            backgroundColor: "hsl(37 36% 57%)",
            boxShadow: "0 0 0 6px hsl(37 36% 57% / 0.18)",
            duration: 0.3,
            stagger: 0.25,
          },
          "-=0.6"
        );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <motion.div
      {...blockInView(1)}
      ref={root}
      className="bg-surface-raised border border-border shadow-2 p-8"
    >
      <div className="flex items-center justify-between mb-6">
        <p className="overline text-muted">Order #4821</p>
        <span className="flex items-center gap-1.5 text-[11px] text-sage uppercase tracking-[0.1em]">
          <span className="w-1.5 h-1.5 rounded-full bg-sage" /> Live
        </span>
      </div>

      <div className="relative pl-6">
        <div
          data-tl-line
          className="absolute left-[5px] top-1 bottom-1 w-px origin-top bg-beige"
        />
        <div className="space-y-7">
          {ORDER_STEPS.map((step, i) => (
            <div key={step.label} data-tl-step className="relative">
              <span
                data-tl-dot
                className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-beige border border-surface-raised"
              />
              <p className="overline text-espresso">{step.label}</p>
              <p className="text-xs text-muted mt-1">{step.note}</p>
              <p className="text-[11px] text-taupe mt-0.5">{step.status}</p>
              {i === ORDER_STEPS.length - 1 && (
                <span className="inline-flex items-center gap-1.5 mt-2 text-[11px] text-sage uppercase tracking-[0.1em]">
                  <Check className="w-3 h-3" /> Delivered — no surprises
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function ReceiptMock() {
  return (
    <motion.div
      {...blockInView(2)}
      className="bg-surface-raised border border-border shadow-2 p-8 max-w-sm"
    >
      <div className="text-center border-b border-dashed border-beige pb-4">
        <p className="font-serif text-xl text-espresso">StitchCart</p>
        <p className="text-[10px] uppercase tracking-[0.2em] text-muted mt-1">
          Order #4821 · Jan 14
        </p>
      </div>

      <div className="py-5 space-y-3 border-b border-dashed border-beige text-sm">
        <div className="flex justify-between">
          <span className="text-muted">Subtotal</span>
          <span className="text-espresso">$214.00</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted flex items-center gap-1.5">
            <BadgePercent className="w-3.5 h-3.5 text-accent" />
            Coupon STITCH20
          </span>
          <span className="text-sage">−$42.80</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted">Shipping</span>
          <span className="text-sage">Free</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted">Tax (USD)</span>
          <span className="text-espresso">$10.70</span>
        </div>
      </div>

      <div className="flex justify-between items-center pt-5">
        <span className="overline text-espresso">Total</span>
        <span className="font-serif text-2xl text-accent">$181.90</span>
      </div>
      <p className="text-[10px] uppercase tracking-[0.16em] text-muted mt-4">
        Paid securely via Stripe · Refundable
      </p>
    </motion.div>
  );
}

const FEATURES = [
  {
    index: "01",
    kicker: "Search & Filter",
    title: "Find exactly what you're after.",
    copy: "Smart search, layered filters and honest sorting across 900+ pieces. Filter by category, brand, price or size — then sort by rating, price or freshness.",
    bullets: [
      { icon: Search, label: "Smart search across products & brands" },
      { icon: SlidersHorizontal, label: "Multi-filter: category, brand, price, size" },
      { icon: ArrowDownWideNarrow, label: "Sort by price, rating, newest" },
    ],
    visual: <SearchMock />,
  },
  {
    index: "02",
    kicker: "Orders You Can Follow",
    title: "An order you can track, always.",
    copy: "Your cart persists with live totals, and every order walks a transparent path — confirmed, shipped, delivered. Change your mind? Cancel anytime and get refunded automatically.",
    bullets: [
      { icon: ShoppingBag, label: "Persistent cart with live totals" },
      { icon: Heart, label: "Wishlist across every device" },
      { icon: MapPin, label: "Saved address book & order history" },
      { icon: RotateCcw, label: "Cancel anytime — automatic refunds" },
    ],
    visual: <OrderTimeline />,
  },
  {
    index: "03",
    kicker: "Transparent Checkout",
    title: "What you see is what you pay.",
    copy: "Coupon codes apply instantly and your full breakdown — subtotal, discount, shipping, tax, total — is laid out before you commit. USD pricing, always.",
    bullets: [
      { icon: BadgePercent, label: "Coupon codes applied in real time" },
      { icon: History, label: "Full price breakdown, always visible" },
      { icon: Check, label: "One clear USD total — no surprises" },
    ],
    visual: <ReceiptMock />,
  },
];

function FeatureShowcase() {
  const root = useRef(null);

  useLayoutEffect(() => {
    const reduced = prefersReducedMotion();
    const ctx = gsap.context(() => {
      const heads = root.current.querySelectorAll("[data-fs-head]");
      const visuals = root.current.querySelectorAll("[data-fs-visual]");
      if (reduced) {
        gsap.set([...heads, ...visuals], { clearProps: "all", opacity: 1 });
        return;
      }
      gsap.fromTo(
        heads,
        { y: 40, opacity: 0, scale: 0.96 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.9,
          stagger: 0.12,
          ease: EASE,
          scrollTrigger: {
            trigger: root.current,
            start: "top 78%",
            once: true,
          },
        }
      );
      visuals.forEach((visual) => {
        gsap.fromTo(
          visual,
          { y: 36 },
          {
            y: -36,
            ease: "none",
            scrollTrigger: {
              trigger: visual,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.4,
            },
          }
        );
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="py-28 bg-surface">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="max-w-2xl mb-20" data-fs-head>
          <SectionIndex number="03" label="The StitchCart Experience" />
          <h2 className="display-lg text-espresso mt-4">
            Built for how people actually shop.
          </h2>
        </div>

        <div className="space-y-28">
          {FEATURES.map((feat, i) => {
            const reversed = i % 2 === 1;
            return (
              <div
                key={feat.index}
                className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center"
              >
                <div
                  className={`lg:col-span-6 ${reversed ? "lg:order-2" : ""}`}
                  data-fs-head
                >
                  <p className="font-serif text-accent text-lg italic">
                    {feat.index}
                  </p>
                  <p className="overline text-muted mt-3">{feat.kicker}</p>
                  <h3 className="display-md text-espresso mt-3">{feat.title}</h3>
                  <p className="text-brown/80 leading-relaxed mt-4 max-w-lg">
                    {feat.copy}
                  </p>
                  <ul className="mt-7 space-y-3.5">
                    {feat.bullets.map((b) => (
                      <li
                        key={b.label}
                        className="flex items-center gap-3 text-sm text-espresso"
                      >
                        <span className="w-8 h-8 flex items-center justify-center border border-accent/40 bg-accent/10 text-accent-hover">
                          <b.icon className="w-4 h-4" />
                        </span>
                        {b.label}
                      </li>
                    ))}
                  </ul>
                </div>

                <div
                  data-fs-visual
                  className={`lg:col-span-6 ${reversed ? "lg:order-1" : ""} flex justify-center`}
                >
                  {feat.visual}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default FeatureShowcase;
