import { useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Star, ArrowRight, ShoppingBag, Check } from "lucide-react";
import PropTypes from "prop-types";
import { gsap, EASE, prefersReducedMotion } from "./gsap-setup";
import { PRODUCTS } from "./data";
import SectionIndex from "./SectionIndex";

function Stars({ rating }) {
  return (
    <motion.div
      className="flex items-center gap-0.5"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.6 }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.07 } },
      }}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= Math.round(rating);
        return (
          <motion.span
            key={star}
            variants={{
              hidden: { opacity: 0, scale: 0.4 },
              show: { opacity: 1, scale: 1 },
            }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <Star
              className="w-3.5 h-3.5"
              fill={filled ? "hsl(37 36% 57%)" : "transparent"}
              stroke={filled ? "hsl(37 36% 57%)" : "hsl(28 8% 51%)"}
            />
          </motion.span>
        );
      })}
    </motion.div>
  );
}

Stars.propTypes = {
  rating: PropTypes.number.isRequired,
};

function WishlistButton({ active, onClick }) {
  return (
    <motion.button
      whileHover={{ scale: 1.12 }}
      whileTap={{ scale: 0.82 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      onClick={onClick}
      aria-label="Add to wishlist"
      className="absolute top-3 right-3 z-10 w-9 h-9 flex items-center justify-center bg-surface-raised/95 border border-border rounded-full shadow-1"
    >
      <motion.span
        key={active ? "on" : "off"}
        initial={{ scale: 0.6 }}
        animate={{ scale: [1, 1.35, 1] }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="flex"
      >
        <Heart
          className="w-4 h-4"
          fill={active ? "hsl(13 51% 47%)" : "transparent"}
          stroke={active ? "hsl(13 51% 47%)" : "hsl(27 11% 16%)"}
        />
      </motion.span>
    </motion.button>
  );
}

WishlistButton.propTypes = {
  active: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

function ProductCard({ product }) {
  const [wished, setWished] = useState(false);
  const [added, setAdded] = useState(false);
  const addTimer = useRef(null);

  const handleAdd = () => {
    if (added) return;
    setAdded(true);
    window.dispatchEvent(new CustomEvent("landing:add-to-cart"));
    if (addTimer.current) clearTimeout(addTimer.current);
    addTimer.current = setTimeout(() => setAdded(false), 1500);
  };

  return (
    <motion.article
      data-prod-card
      whileHover={{ y: -6 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="group relative flex flex-col bg-surface-raised border border-border hover:border-accent/50 transition-colors duration-base"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-beige/40">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-slow ease-luxury group-hover:scale-110"
        />
        <span className="pointer-events-none absolute inset-0 overflow-hidden">
          <span className="absolute top-0 left-0 h-full w-1/3 -translate-x-[250%] bg-gradient-to-r from-transparent via-ivory/50 to-transparent skew-x-12 transition-transform duration-slow ease-luxury group-hover:translate-x-[500%]" />
        </span>
        {product.badge ? (
          <span className="absolute top-3 left-3 bg-espresso text-ivory text-[10px] uppercase tracking-[0.14em] font-semibold px-2.5 py-1 shadow-1 border border-ivory/20">
            {product.badge}
          </span>
        ) : product.onSale ? (
          <span className="absolute top-3 left-3 bg-clay text-clay-foreground text-[10px] uppercase tracking-[0.14em] font-semibold px-2.5 py-1">
            Sale
          </span>
        ) : null}
        <WishlistButton
          active={wished}
          onClick={() => setWished((w) => !w)}
        />
      </div>

      <div className="flex flex-col flex-1 p-5">
        <p className="overline text-muted mb-1.5">{product.brand}</p>
        <h3 className="relative inline-block font-serif text-lg text-espresso font-medium leading-snug">
          {product.name}
          <span className="absolute left-0 -bottom-0.5 w-full h-px bg-gold origin-left scale-x-0 transition-transform duration-base ease-luxury group-hover:scale-x-100" />
        </h3>

        <div className="flex items-center gap-2 mt-2.5">
          <Stars rating={product.rating} />
          <span className="text-[11px] text-muted">({product.reviews})</span>
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-beige">
          <div className="flex items-baseline gap-2.5">
            <span className="font-serif text-xl text-accent">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-muted line-through">
                ₹{product.originalPrice.toLocaleString("en-IN")}
              </span>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={handleAdd}
            aria-label={`Add ${product.name} to cart`}
            className={`w-9 h-9 flex items-center justify-center border transition-colors duration-fast ${
              added
                ? "bg-sage border-sage text-sage-foreground"
                : "bg-espresso border-espresso text-ivory hover:bg-gold hover:border-gold hover:text-espresso"
            }`}
          >
            {added ? (
              <Check className="w-4 h-4" />
            ) : (
              <motion.span
                key={added ? "added" : "idle"}
                animate={
                  added
                    ? { rotate: [0, -14, 0], scale: [1, 1.25, 1] }
                    : { rotate: 0, scale: 1 }
                }
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="flex"
              >
                <ShoppingBag className="w-4 h-4" />
              </motion.span>
            )}
          </motion.button>
        </div>

        <Link
          to="/shop/listing"
          className="mt-4 inline-flex items-center text-[11px] uppercase tracking-[0.16em] text-muted group-hover:text-espresso transition-colors duration-fast"
        >
          View Details <ArrowRight className="w-3.5 h-3.5 ml-2" />
        </Link>
      </div>
    </motion.article>
  );
}

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    brand: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    originalPrice: PropTypes.number,
    onSale: PropTypes.bool.isRequired,
    rating: PropTypes.number.isRequired,
    reviews: PropTypes.number.isRequired,
    badge: PropTypes.string,
    image: PropTypes.string.isRequired,
  }).isRequired,
};

function FeaturedProducts() {
  const root = useRef(null);

  useLayoutEffect(() => {
    const reduced = prefersReducedMotion();
    const ctx = gsap.context(() => {
      const cards = root.current.querySelectorAll("[data-prod-card]");
      if (reduced) {
        gsap.set(cards, { clearProps: "all", opacity: 1 });
        return;
      }
      gsap.fromTo(
        cards,
        { y: 56, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.1,
          ease: EASE,
          scrollTrigger: {
            trigger: root.current,
            start: "top 75%",
            once: true,
          },
        }
      );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="py-24 bg-background">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div
          className="flex items-end justify-between mb-12 gap-6"
          data-fp-head
        >
          <div>
            <SectionIndex number="02" label="The Edit" />
            <h2 className="display-lg text-espresso mt-4">
              Featured this season
            </h2>
          </div>
          <Link
            to="/shop/listing"
            className="hidden md:inline-flex items-center text-xs uppercase tracking-[0.16em] text-muted hover:text-espresso transition-colors duration-fast"
          >
            View all 1,200+ styles <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center mt-12 md:hidden">
          <Link
            to="/shop/listing"
            className="inline-flex items-center text-xs uppercase tracking-[0.16em] text-espresso border-b border-espresso pb-1"
          >
            View all products <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default FeaturedProducts;
