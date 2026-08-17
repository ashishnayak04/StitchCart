import { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { gsap, EASE, prefersReducedMotion } from "./gsap-setup";
import { CATEGORIES } from "./data";
import SectionHeader from "./SectionHeader";

function CategoryNav() {
  const root = useRef(null);

  useLayoutEffect(() => {
    const reduced = prefersReducedMotion();
    const ctx = gsap.context(() => {
      const cards = root.current.querySelectorAll("[data-cat-card]");
      if (reduced) {
        gsap.set(cards, { clearProps: "all", opacity: 1 });
        return;
      }

      gsap.fromTo(
        cards,
        { y: 36, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.08,
          duration: 0.75,
          ease: EASE,
          scrollTrigger: {
            trigger: root.current,
            start: "top 78%",
            once: true,
          },
        }
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section id="departments" ref={root} className="py-20 sm:py-28 bg-background">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 sm:gap-8 mb-10 sm:mb-14">
          <SectionHeader
            number="06"
            eyebrow="Department Directory"
            title="Eight curated departments. One considered wardrobe."
            description="Explore our core sartorial pillars — structured tailoring, Egyptian cotton shirts, pure silk dresses, cashmere knitwear, and Swiss horology."
          />

          <Link
            to="/shop/listing"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] font-semibold text-espresso hover:text-accent border-b border-espresso hover:border-accent pb-1 transition-colors self-start lg:self-end"
          >
            <span>View All Departments</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {CATEGORIES.map((cat, idx) => (
            <Link
              key={cat.id}
              to="/shop/listing"
              data-cat-card
              className="group relative block overflow-hidden bg-surface-raised border border-border hover:border-accent/60 transition-all duration-base shadow-1 cursor-pointer"
            >
              {/* Image with subtle zoom on hover */}
              <div className="aspect-[3/4] overflow-hidden bg-beige/40">
                <img
                  src={cat.image}
                  alt={cat.label}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-slow ease-luxury group-hover:scale-108"
                />
              </div>

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-espresso/90 via-espresso/25 to-transparent" />

              {/* Top Accent Line */}
              <div className="absolute top-0 left-0 w-full h-0.5 bg-gold origin-left scale-x-0 transition-transform duration-base ease-luxury group-hover:scale-x-100" />

              {/* Content text */}
              <div className="absolute inset-x-0 bottom-0 p-3 sm:p-5 lg:p-6 text-ivory">
                <div className="flex items-center justify-between">
                  <span className="overline text-gold text-[8px] sm:text-[10px]">
                    {cat.department}
                  </span>
                  <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.12em] text-ivory/70 font-mono">
                    {cat.count}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-0.5 sm:mt-1">
                  <h3 className="font-serif text-base sm:text-xl lg:text-2xl text-ivory font-medium truncate">
                    {cat.label}
                  </h3>
                  <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold opacity-0 -translate-x-1 translate-y-1 transition-all duration-fast group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 shrink-0" />
                </div>

                <p className="text-ivory/70 text-[11px] sm:text-xs mt-1 font-light line-clamp-2 hidden sm:block">
                  {cat.caption}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CategoryNav;
