import { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { gsap, EASE, prefersReducedMotion } from "./gsap-setup";
import { CATEGORIES } from "./data";
import Reveal from "./Reveal";
import SectionIndex from "./SectionIndex";

function CategoryNav() {
  const root = useRef(null);

  useLayoutEffect(() => {
    const reduced = prefersReducedMotion();
    const ctx = gsap.context(() => {
      const cards = root.current.querySelectorAll("[data-cat-card]");
      const imgs = root.current.querySelectorAll("[data-cat-img]");

      if (reduced) {
        gsap.set(cards, { clearProps: "all", opacity: 1 });
        return;
      }

      gsap.fromTo(
        root.current.querySelector("[data-cat-title]"),
        { y: 40, opacity: 0, scale: 0.96 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.9,
          ease: EASE,
          scrollTrigger: {
            trigger: root.current,
            start: "top 80%",
            once: true,
          },
        }
      );

      imgs.forEach((img) => {
        gsap.fromTo(
          img,
          { yPercent: -9, scale: 1.15 },
          {
            yPercent: 9,
            scale: 1.15,
            ease: "none",
            scrollTrigger: {
              trigger: img.closest("[data-cat-card]"),
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
    <section id="categories" ref={root} className="py-24 bg-background">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div
          data-cat-title
          className="flex items-end justify-between mb-12 gap-6"
        >
          <div>
            <SectionIndex number="01" label="Shop by Department" />
            <h2 className="display-lg text-espresso mt-4">
              Five departments.
              <br />
              One considered wardrobe.
            </h2>
          </div>
          <p className="hidden md:block text-sm text-muted max-w-xs leading-relaxed">
            Every category is filtered, sorted and priced in USD — no
            surprises at checkout.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {CATEGORIES.map((cat, i) => (
            <Reveal key={cat.id} delay={(i % 5) * 0.08}>
              <Link
                to="/shop/listing"
                data-cat-card
                className="group relative block overflow-hidden bg-surface-raised border border-border transition-colors duration-base hover:border-accent/60 cursor-pointer"
              >
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={cat.image}
                    alt={cat.label}
                    loading="lazy"
                    data-cat-img
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-espresso/75 via-espresso/10 to-transparent" />
                <div className="absolute top-0 left-0 w-full h-0.5 bg-gold origin-left scale-x-0 transition-transform duration-base ease-luxury group-hover:scale-x-100" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-2xl text-ivory font-medium">
                      {cat.label}
                    </h3>
                    <ArrowUpRight className="w-4 h-4 text-gold opacity-0 -translate-x-1 translate-y-1 transition-all duration-fast group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0" />
                  </div>
                  <p className="text-ivory/60 text-xs mt-1.5">{cat.caption}</p>
                  <p className="overline text-gold mt-3">{cat.count}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CategoryNav;
