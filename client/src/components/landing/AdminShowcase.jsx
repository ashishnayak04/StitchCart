import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Layers,
  Upload,
  ShoppingBag,
  BadgePercent,
  CheckCircle2,
  Image as ImageIcon,
  ArrowRight,
  TrendingUp,
  ShieldAlert,
  Clock,
  ChevronRight,
} from "lucide-react";
import SectionHeader from "./SectionHeader";
import { ADMIN_MODULES } from "./data";

function AdminShowcase() {
  const [activeTabId, setActiveTabId] = useState("catalog");

  const currentModule =
    ADMIN_MODULES.find((m) => m.id === activeTabId) || ADMIN_MODULES[0];

  return (
    <section id="admin-suite" className="py-20 sm:py-28 bg-surface border-b border-border">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 sm:gap-8 mb-10 sm:mb-14">
          <SectionHeader
            number="05"
            eyebrow="Operations & Back-Office Engine"
            title="A unified control suite for modern fashion commerce."
            description="Behind the curated storefront sits a dedicated operational back-office: catalog management with direct media asset uploads, live coupon rules, and multi-stage order fulfillment."
          />

          <Link
            to="/auth/login"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] font-semibold text-espresso hover:text-accent border-b border-espresso hover:border-accent pb-1 transition-colors self-start lg:self-end"
          >
            <span>Explore Admin Portal</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Module Navigation Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 mb-6 sm:mb-8">
          {ADMIN_MODULES.map((mod) => (
            <button
              key={mod.id}
              onClick={() => setActiveTabId(mod.id)}
              className={`p-4 sm:p-5 text-left border transition-all active:scale-98 ${
                activeTabId === mod.id
                  ? "bg-surface-raised border-accent shadow-2"
                  : "bg-surface-raised/60 border-border hover:border-accent/40 text-muted"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="overline text-accent text-[10px] sm:text-[11px]">
                  {mod.id === "catalog" && "01 · Studio"}
                  {mod.id === "fulfillment" && "02 · Logistics"}
                  {mod.id === "promotions" && "03 · Marketing"}
                </span>
                {activeTabId === mod.id && (
                  <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                )}
              </div>
              <h3 className="font-serif text-base sm:text-lg text-espresso font-medium mt-1">
                {mod.title}
              </h3>
              <p className="text-xs text-muted mt-0.5 sm:mt-1 truncate">
                {mod.subtitle}
              </p>
            </button>
          ))}
        </div>

        {/* Dynamic Interactive Module Display */}
        <div className="bg-surface-raised border border-border p-5 sm:p-8 lg:p-10 shadow-2 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left: Module Details & Feature Bullets */}
          <div className="lg:col-span-6 space-y-5 sm:space-y-6">
            <div>
              <span className="overline text-accent text-[10px] sm:text-xs">
                {currentModule.subtitle}
              </span>
              <h3 className="display-md text-espresso mt-1.5 sm:mt-2">
                {currentModule.title}
              </h3>
              <p className="text-xs sm:text-sm lg:text-base text-brown/85 font-light leading-relaxed mt-3 sm:mt-4">
                {currentModule.description}
              </p>
            </div>

            {/* Feature List */}
            <div className="space-y-2.5 sm:space-y-3 pt-1 sm:pt-2">
              {currentModule.features.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-3 text-xs sm:text-sm text-espresso">
                  <span className="w-5 h-5 rounded-full bg-sage/15 text-sage flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </span>
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            {/* Stat Counters */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-5 sm:pt-6 border-t border-border">
              {currentModule.stats.map((st, idx) => (
                <div key={idx}>
                  <p className="font-serif text-xl sm:text-2xl text-accent font-semibold">
                    {st.value}
                  </p>
                  <p className="overline text-muted text-[9px] sm:text-[10px] mt-0.5">
                    {st.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Realistic Application Admin UI Preview */}
          <div className="lg:col-span-6 bg-surface border border-border p-4 sm:p-6 shadow-1">
            {activeTabId === "catalog" && (
              <div className="space-y-3.5 sm:space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <div className="flex items-center gap-2 text-xs font-semibold text-espresso">
                    <Upload className="w-4 h-4 text-accent" />
                    <span>Admin Catalog Studio · Add New Garment</span>
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.1em] px-2 py-0.5 bg-accent/10 text-accent font-semibold">
                    Ultra-HD Media
                  </span>
                </div>

                {/* Form Elements Mock */}
                <div className="space-y-2.5 sm:space-y-3 text-xs">
                  <div>
                    <label className="text-muted block mb-1">Product Title</label>
                    <div className="p-2.5 bg-surface-raised border border-border text-espresso font-serif text-xs sm:text-sm truncate">
                      Super 130s Merino Wool Atelier Suit
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                    <div>
                      <label className="text-muted block mb-1">Department Category</label>
                      <div className="p-2.5 bg-surface-raised border border-border text-espresso">
                        Blazers &amp; Tailoring
                      </div>
                    </div>
                    <div>
                      <label className="text-muted block mb-1">Heritage Brand</label>
                      <div className="p-2.5 bg-surface-raised border border-border text-espresso">
                        Raymond Atelier
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
                    <div>
                      <label className="text-muted block mb-1">Regular Price (₹)</label>
                      <div className="p-2.5 bg-surface-raised border border-border text-espresso font-mono">
                        24,999
                      </div>
                    </div>
                    <div>
                      <label className="text-muted block mb-1">Sale Price (₹)</label>
                      <div className="p-2.5 bg-surface-raised border border-border text-accent font-mono font-semibold">
                        18,999
                      </div>
                    </div>
                    <div>
                      <label className="text-muted block mb-1">Stock Count</label>
                      <div className="p-2.5 bg-surface-raised border border-border text-espresso font-mono">
                        12 units
                      </div>
                    </div>
                  </div>

                  {/* Media Upload Box Mock */}
                  <div className="p-3.5 sm:p-4 border-2 border-dashed border-accent/40 bg-surface-raised/80 text-center flex flex-col items-center justify-center">
                    <ImageIcon className="w-5 h-5 sm:w-6 sm:h-6 text-accent mb-1" />
                    <span className="text-xs font-medium text-espresso">
                      High-Resolution Garment Media Attached
                    </span>
                    <span className="text-[10px] text-muted">
                      Optimized for Fabric Texture &amp; Color Precision
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeTabId === "fulfillment" && (
              <div className="space-y-3.5 sm:space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <div className="flex items-center gap-2 text-xs font-semibold text-espresso">
                    <ShoppingBag className="w-4 h-4 text-accent" />
                    <span>Orders Hub · Live Fulfillment Queue</span>
                  </div>
                  <span className="text-[10px] text-sage font-semibold uppercase tracking-[0.1em]">
                    Real-time
                  </span>
                </div>

                <div className="divide-y divide-border/80 text-xs">
                  {[
                    {
                      id: "#SC-84920",
                      buyer: "Vikramaditya S.",
                      city: "Mumbai, MH",
                      amount: "₹18,999",
                      status: "Delivered",
                      statusColor: "text-sage bg-sage/10",
                    },
                    {
                      id: "#SC-84921",
                      buyer: "Ananya D.",
                      city: "New Delhi, DL",
                      amount: "₹16,999",
                      status: "In Shipping",
                      statusColor: "text-accent bg-accent/10",
                    },
                    {
                      id: "#SC-84922",
                      buyer: "Rohan N.",
                      city: "Bengaluru, KA",
                      amount: "₹79,999",
                      status: "Confirmed",
                      statusColor: "text-taupe bg-beige/60",
                    },
                  ].map((row) => (
                    <div key={row.id} className="py-2.5 sm:py-3 flex items-center justify-between">
                      <div>
                        <span className="font-mono font-semibold text-espresso">
                          {row.id}
                        </span>
                        <span className="text-muted block text-[11px]">
                          {row.buyer} · {row.city}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-serif font-semibold text-espresso block">
                          {row.amount}
                        </span>
                        <span
                          className={`text-[10px] font-semibold uppercase tracking-[0.1em] px-2 py-0.5 inline-block mt-0.5 ${row.statusColor}`}
                        >
                          {row.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTabId === "promotions" && (
              <div className="space-y-3.5 sm:space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <div className="flex items-center gap-2 text-xs font-semibold text-espresso">
                    <BadgePercent className="w-4 h-4 text-accent" />
                    <span>Promotions Studio · Campaign Rule Builder</span>
                  </div>
                  <span className="text-[10px] text-accent font-semibold uppercase tracking-[0.1em]">
                    Active Engine
                  </span>
                </div>

                <div className="space-y-2.5 sm:space-y-3 text-xs">
                  <div className="p-3 bg-surface-raised border border-border flex items-center justify-between">
                    <div>
                      <span className="font-mono font-bold text-accent text-sm">
                        ATELIER20
                      </span>
                      <span className="text-muted block text-[11px]">
                        20% off all orders with minimum cart ₹5,000
                      </span>
                    </div>
                    <span className="text-sage text-[10px] font-semibold uppercase tracking-[0.1em]">
                      Active
                    </span>
                  </div>

                  <div className="p-3 bg-surface-raised border border-border flex items-center justify-between">
                    <div>
                      <span className="font-mono font-bold text-accent text-sm">
                        FESTIVE15
                      </span>
                      <span className="text-muted block text-[11px]">
                        ₹1,500 flat discount on orders above ₹8,000
                      </span>
                    </div>
                    <span className="text-sage text-[10px] font-semibold uppercase tracking-[0.1em]">
                      Active
                    </span>
                  </div>

                  <div className="p-3 bg-surface-raised border border-dashed border-border text-center text-muted">
                    <span>+ Configure New Seasonal Discount Rule</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default AdminShowcase;
