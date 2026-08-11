import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import Hero from "@/components/landing/Hero";
import CategoryNav from "@/components/landing/CategoryNav";
import BrandStrip from "@/components/landing/BrandStrip";
import FeaturedProducts from "@/components/landing/FeaturedProducts";
import FeatureShowcase from "@/components/landing/FeatureShowcase";
import TrustSection from "@/components/landing/TrustSection";
import ReviewsSection from "@/components/landing/ReviewsSection";
import TechStrip from "@/components/landing/TechStrip";
import Footer from "@/components/landing/Footer";
import SmoothScroll from "@/components/landing/SmoothScroll";

function LandingHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [bounce, setBounce] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onAdd = () => {
      setBounce((b) => b + 1);
      setCartCount((c) => c + 1);
    };
    window.addEventListener("landing:add-to-cart", onAdd);
    return () => window.removeEventListener("landing:add-to-cart", onAdd);
  }, []);

  return (
    <motion.header
      initial={{ y: -32, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-base ${
        scrolled
          ? "bg-ivory/90 backdrop-blur-md border-b border-beige py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 flex items-center justify-between">
        <Link to="/" className="font-serif text-xl text-espresso">
          Stitch<span className="text-accent">Cart</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          <a
            href="#categories"
            className="text-xs uppercase tracking-[0.14em] text-muted hover:text-espresso transition-colors duration-fast"
          >
            Categories
          </a>
          <a
            href="#the-edit"
            className="text-xs uppercase tracking-[0.14em] text-muted hover:text-espresso transition-colors duration-fast"
          >
            The Edit
          </a>
          <a
            href="#experience"
            className="text-xs uppercase tracking-[0.14em] text-muted hover:text-espresso transition-colors duration-fast"
          >
            Experience
          </a>
        </nav>
        <div className="flex items-center gap-4">
          <Link
            to="/shop/listing"
            aria-label="Cart"
            className="relative inline-flex items-center justify-center w-10 h-10 text-espresso hover:text-accent-hover transition-colors duration-fast"
          >
            <motion.span
              key={bounce}
              animate={
                bounce
                  ? { scale: [1, 1.4, 0.9, 1.15, 1], rotate: [0, -12, 10, -4, 0] }
                  : {}
              }
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex"
            >
              <ShoppingBag className="w-5 h-5" />
            </motion.span>
            {cartCount > 0 && (
              <motion.span
                key={cartCount}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full bg-gold text-espresso text-[10px] font-bold flex items-center justify-center"
              >
                {cartCount}
              </motion.span>
            )}
          </Link>
          <Link
            to="/auth/login"
            className="hidden sm:inline-block text-xs uppercase tracking-[0.14em] text-espresso hover:text-accent-hover transition-colors duration-fast"
          >
            Sign in
          </Link>
          <Link
            to="/shop/listing"
            className="text-xs uppercase tracking-[0.14em] font-semibold bg-espresso text-ivory px-5 py-2.5 hover:bg-gold hover:text-espresso transition-colors duration-base"
          >
            Shop
          </Link>
        </div>
      </div>
    </motion.header>
  );
}

function Landing() {
  return (
    <SmoothScroll>
      <div className="bg-ivory text-espresso">
        <LandingHeader />
        <main>
          <Hero />
          <CategoryNav />
          <BrandStrip />
          <div id="the-edit">
            <FeaturedProducts />
          </div>
          <div id="experience">
            <FeatureShowcase />
          </div>
          <TrustSection />
          <ReviewsSection />
          <TechStrip />
        </main>
        <Footer />
      </div>
    </SmoothScroll>
  );
}

export default Landing;
