import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Instagram, Twitter, Facebook, Sparkles, ShieldCheck } from "lucide-react";
import { CATEGORIES } from "./data";

function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 4000);
  };

  return (
    <footer className="bg-espresso text-ivory border-t border-gold/30">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 pt-16 sm:pt-20 pb-10 sm:pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Col 1: Brand & Philosophy */}
          <div className="lg:col-span-4 space-y-5 sm:space-y-6">
            <Link
              to="/"
              className="font-serif text-2xl sm:text-3xl font-semibold text-ivory tracking-tight inline-flex items-center gap-1"
            >
              <span>Stitch</span>
              <span className="text-gold font-serif font-light italic">
                Cart
              </span>
            </Link>

            <p className="text-xs sm:text-sm text-ivory/65 leading-relaxed font-light max-w-sm">
              An editorial fashion commerce platform engineered for Indian
              contemporary tailoring, fine fabrics, transparent INR pricing,
              and seamless multi-stage order fulfillment.
            </p>

            <div className="flex items-center gap-3 pt-1">
              {[
                { name: "Instagram", icon: Instagram, href: "#" },
                { name: "Twitter", icon: Twitter, href: "#" },
                { name: "Facebook", icon: Facebook, href: "#" },
              ].map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  aria-label={item.name}
                  className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center border border-ivory/20 text-ivory/60 hover:border-gold hover:text-gold active:scale-95 transition-colors"
                >
                  <item.icon className="w-4 h-4" />
                </a>
              ))}
            </div>

            <div className="pt-1">
              <span className="inline-flex items-center gap-2 text-xs text-gold font-medium bg-gold/10 px-3 py-1.5 border border-gold/20">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>100% Secure Domestic INR Commerce</span>
              </span>
            </div>
          </div>

          {/* Col 2: Curated Departments */}
          <div className="lg:col-span-3">
            <p className="overline text-gold text-xs">Curated Departments</p>
            <ul className="mt-4 sm:mt-5 space-y-2.5 sm:space-y-3">
              {CATEGORIES.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <Link
                    to="/shop/listing"
                    className="text-xs sm:text-sm text-ivory/65 hover:text-gold transition-colors flex items-center justify-between"
                  >
                    <span>{cat.label}</span>
                    <span className="text-[10px] text-ivory/40 font-mono">
                      {cat.count}
                    </span>
                  </Link>
                </li>
              ))}
              <li className="pt-1 sm:pt-2">
                <Link
                  to="/shop/listing"
                  className="text-xs uppercase tracking-[0.14em] text-gold hover:underline font-semibold"
                >
                  View All 8 Departments →
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Care & Back-Office */}
          <div className="lg:col-span-2">
            <p className="overline text-gold text-xs">Platform Links</p>
            <ul className="mt-4 sm:mt-5 space-y-2.5 sm:space-y-3 text-xs sm:text-sm text-ivory/65">
              <li>
                <Link
                  to="/shop/listing"
                  className="hover:text-gold transition-colors"
                >
                  Storefront Catalog
                </Link>
              </li>
              <li>
                <Link
                  to="/shop/search"
                  className="hover:text-gold transition-colors"
                >
                  Search &amp; Filters
                </Link>
              </li>
              <li>
                <Link
                  to="/auth/login"
                  className="hover:text-gold transition-colors"
                >
                  Shopper Sign In
                </Link>
              </li>
              <li>
                <Link
                  to="/auth/register"
                  className="hover:text-gold transition-colors"
                >
                  Create Account
                </Link>
              </li>
              <li>
                <Link
                  to="/auth/login"
                  className="text-gold font-medium hover:underline block pt-1 sm:pt-2"
                >
                  Admin Operations Suite →
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter Subscription */}
          <div className="lg:col-span-3 space-y-3.5 sm:space-y-4">
            <p className="overline text-gold text-xs">Atelier Drop Access</p>
            <p className="text-xs sm:text-sm text-ivory/65 leading-relaxed font-light">
              Receive notifications when new seasonal tailoring drops and
              limited promotions are published.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="flex">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  aria-label="Email address"
                  className="flex-1 h-11 bg-transparent border border-ivory/30 px-3.5 text-xs text-ivory placeholder:text-ivory/40 focus:outline-none focus:border-gold transition-colors"
                />
                <button
                  type="submit"
                  aria-label="Subscribe to drops"
                  className="h-11 px-4 bg-gold text-espresso text-xs font-semibold uppercase tracking-[0.12em] hover:bg-gold/90 transition-colors flex items-center justify-center active:scale-95"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {subscribed && (
                <p className="text-xs text-sage font-medium">
                  ✓ You have been added to the StitchCart Drop list.
                </p>
              )}
            </form>

            <div className="flex items-center gap-2 pt-1 text-[10px] text-ivory/40">
              <span>All major cards</span>
              <span>·</span>
              <span>UPI &amp; NetBanking</span>
              <span>·</span>
              <span>PayPal INR</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 sm:pt-10 mt-10 sm:mt-14 border-t border-ivory/15 text-xs text-ivory/40">
          <p>© 2026 StitchCart Platform. All rights reserved. Billed in INR (₹).</p>
          <div className="flex gap-4 sm:gap-6">
            <Link to="/shop/listing" className="hover:text-ivory transition-colors">
              Terms of Service
            </Link>
            <Link to="/shop/listing" className="hover:text-ivory transition-colors">
              Privacy Policy
            </Link>
            <Link to="/shop/listing" className="hover:text-ivory transition-colors">
              GST Invoicing
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
