import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Instagram, Twitter, Facebook } from "lucide-react";
import { CATEGORIES } from "./data";

function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setEmail("");
    alert("Thank you for subscribing — watch your inbox for the next drop.");
  };

  return (
    <footer className="bg-espresso text-ivory">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 pt-20 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14">
          <div className="lg:col-span-5">
            <p className="font-serif text-2xl">
              Stitch<span className="text-gold">Cart</span>
            </p>
            <p className="text-sm text-ivory/50 leading-relaxed max-w-sm mt-5">
              A curated fashion marketplace — Men, Women, Kids, Footwear and
              Accessories from the brands you trust, with checkout that&apos;s as
              considered as the clothes.
            </p>
            <div className="flex gap-3 mt-8">
              {[Instagram, Twitter, Facebook].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="Social link"
                  className="w-10 h-10 flex items-center justify-center border border-ivory/20 text-ivory/60 hover:border-gold hover:text-gold transition-colors duration-fast"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <p className="overline text-gold">Shop</p>
            <ul className="mt-5 space-y-3">
              {CATEGORIES.map((cat) => (
                <li key={cat.id}>
                  <Link
                    to="/shop/listing"
                    className="text-sm text-ivory/60 hover:text-ivory transition-colors duration-fast"
                  >
                    {cat.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/shop/listing"
                  className="text-sm text-ivory/60 hover:text-ivory transition-colors duration-fast"
                >
                  All Products
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <p className="overline text-gold">Support</p>
            <ul className="mt-5 space-y-3">
              {[
                "Track Order",
                "Returns & Refunds",
                "Shipping Info",
                "Coupons & Offers",
                "Contact Us",
              ].map((label) => (
                <li key={label}>
                  <a
                    href="#"
                    className="text-sm text-ivory/60 hover:text-ivory transition-colors duration-fast"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <p className="overline text-gold">Join the Edit</p>
            <p className="text-sm text-ivory/50 leading-relaxed mt-5">
              New drops, coupon codes and early access. Once a week, never
              spam.
            </p>
            <form onSubmit={handleSubscribe} className="mt-5 flex">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                aria-label="Email address"
                className="flex-1 h-12 bg-transparent border border-ivory/25 px-4 text-sm text-ivory placeholder:text-ivory/35 focus:outline-none focus:border-gold transition-colors duration-fast"
              />
              <button
                type="submit"
                className="h-12 px-6 bg-gold text-espresso text-xs font-semibold uppercase tracking-[0.1em] hover:bg-accent-hover transition-colors duration-fast inline-flex items-center"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
            <div className="flex gap-2 mt-6">
              {["VISA", "Mastercard", "AMEX", "PayPal"].map((m) => (
                <span
                  key={m}
                  className="text-[9px] uppercase tracking-[0.1em] px-2.5 py-1.5 border border-ivory/15 text-ivory/40"
                >
                  {m}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-10 mt-14 border-t border-ivory/10">
          <p className="text-xs text-ivory/35">
            © 2026 StitchCart. Crafted with care. All prices in USD.
          </p>
          <div className="flex gap-6 text-xs text-ivory/35">
            <a href="#" className="hover:text-ivory transition-colors">Privacy</a>
            <a href="#" className="hover:text-ivory transition-colors">Terms</a>
            <a href="#" className="hover:text-ivory transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
