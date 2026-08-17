import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, ArrowRight, Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Collection", href: "#collection" },
  { label: "Departments", href: "#departments" },
  { label: "Experience", href: "#experience" },
  { label: "Checkout", href: "#checkout-demo" },
  { label: "Admin Suite", href: "#admin-suite" },
  { label: "Reviews", href: "#reviews" },
];

function LandingHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [bounce, setBounce] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 15);
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

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-200 ${
          scrolled
            ? "bg-ivory/95 backdrop-blur-md border-b border-border/80 shadow-1 py-3"
            : "bg-ivory/90 backdrop-blur-sm border-b border-border/40 py-4"
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 flex items-center justify-between">
          {/* Brand Logo */}
          <Link
            to="/"
            className="font-serif text-2xl sm:text-3xl font-semibold text-espresso tracking-tight flex items-center gap-0.5 shrink-0"
          >
            <span>Stitch</span>
            <span className="text-accent font-serif font-normal italic">
              Cart
            </span>
          </Link>

          {/* Clean Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8 xl:gap-10">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-xs uppercase tracking-[0.18em] font-medium text-espresso/75 hover:text-accent transition-colors duration-fast whitespace-nowrap"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-5 sm:gap-6 shrink-0">
            {/* Bag Icon */}
            <Link
              to="/shop/listing"
              aria-label={`Shopping Bag (${cartCount} items)`}
              className="relative flex items-center justify-center text-espresso hover:text-accent transition-colors p-1"
            >
              <motion.span
                key={bounce}
                animate={
                  bounce
                    ? {
                        scale: [1, 1.35, 0.9, 1.15, 1],
                        rotate: [0, -10, 8, -4, 0],
                      }
                    : {}
                }
                transition={{ duration: 0.45 }}
              >
                <ShoppingBag className="w-5 h-5 stroke-[1.75]" />
              </motion.span>

              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 min-w-[18px] h-[18px] px-1 rounded-full bg-accent text-espresso text-[10px] font-bold flex items-center justify-center shadow-1">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Sign in */}
            <Link
              to="/auth/login"
              className="hidden sm:inline-block text-xs uppercase tracking-[0.16em] font-semibold text-espresso/80 hover:text-accent transition-colors whitespace-nowrap"
            >
              Sign In
            </Link>

            {/* Primary CTA */}
            <Link
              to="/shop/listing"
              className="hidden sm:inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] font-semibold bg-espresso text-ivory px-5 py-2.5 hover:bg-gold hover:text-espresso transition-all duration-base shadow-1 whitespace-nowrap active:scale-98"
            >
              <span>Shop Collection</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              className="lg:hidden p-1.5 text-espresso hover:text-accent"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-espresso/50 backdrop-blur-xs lg:hidden"
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="fixed top-[60px] inset-x-0 z-50 bg-ivory border-b border-border shadow-3 lg:hidden"
            >
              <div className="px-6 py-6 space-y-4">
                <nav className="flex flex-col space-y-3 divide-y divide-border/50">
                  {NAV_LINKS.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-xs uppercase tracking-[0.16em] font-semibold text-espresso py-2 hover:text-accent flex items-center justify-between"
                    >
                      <span>{link.label}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-muted" />
                    </a>
                  ))}
                </nav>

                <div className="pt-2 flex flex-col gap-2.5">
                  <Link
                    to="/shop/listing"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-3 bg-espresso text-ivory text-xs uppercase tracking-[0.16em] font-semibold shadow-1"
                  >
                    Explore Full Collection
                  </Link>
                  <div className="grid grid-cols-2 gap-2 text-center text-xs uppercase tracking-[0.14em] font-semibold pt-1">
                    <Link
                      to="/auth/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="py-2.5 border border-border bg-surface text-espresso"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/auth/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="py-2.5 border border-accent bg-accent/10 text-espresso"
                    >
                      Register
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default LandingHeader;
