import { motion } from "framer-motion";
import {
  XCircle,
  CheckCircle2,
  SlidersHorizontal,
  BadgePercent,
  Layers,
  ArrowRight,
} from "lucide-react";
import SectionHeader from "./SectionHeader";

const COMPARISONS = [
  {
    icon: SlidersHorizontal,
    category: "Product Discovery",
    problemTitle: "Marketplace Noise & Opaque Fabrics",
    problemText:
      "Endless feeds of thousands of generic items, inconsistent sizing charts, synthetic polyester labeled as 'luxury', and sluggish search filters that crash on mobile.",
    solutionTitle: "Curated Departments & Material Honesty",
    solutionText:
      "8 structured departments with full fabric provenance (Super 130s Italian wool, 2-ply Egyptian cotton, 100% Mulberry silk) with instantaneous multi-filter discovery.",
  },
  {
    icon: BadgePercent,
    category: "Pricing & Checkout",
    problemTitle: "Surprise Fees & Broken Coupon Math",
    problemText:
      "Hidden packaging fees, mandatory convenience charges added at the final OTP screen, and coupon codes that fail silently without explaining minimum cart conditions.",
    solutionTitle: "100% Upfront INR Math & Live Coupon Engine",
    solutionText:
      "Every rupee is itemized in real time. Apply percentage or flat discounts (`ATELIER20`, `FESTIVE15`) with instant margin calculations and zero surprise delivery fees.",
  },
  {
    icon: Layers,
    category: "Store Reliability",
    problemTitle: "Oversold Stock & Delayed Dispatches",
    problemText:
      "Legacy stores that lose track of inventory, take payment for sold-out garments, and delay shipping with unreliable customer notifications.",
    solutionTitle: "Real-Time Inventory & Guaranteed Dispatch",
    solutionText:
      "Live synchronization across all 8 departments. The moment you place an order, your piece is reserved immediately and prepped for tracked express delivery.",
  },
];

function ProblemSolution() {
  return (
    <section className="py-24 sm:py-28 bg-surface border-y border-border">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <SectionHeader
          number="01"
          eyebrow="The Commerce Problem"
          title="Why modern fashion commerce needed a ground-up redesign."
          description="Traditional fashion e-commerce in India is crowded with synthetic fabrics, unpredictable checkout surcharges, and disconnected admin tools. StitchCart was engineered to solve all three."
          className="mb-16"
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {COMPARISONS.map((comp, idx) => (
            <motion.div
              key={comp.category}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className="bg-surface-raised border border-border flex flex-col justify-between overflow-hidden shadow-1 hover:border-accent/50 transition-colors"
            >
              {/* Card Header */}
              <div className="p-6 border-b border-border bg-beige/20 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 flex items-center justify-center bg-espresso text-gold">
                    <comp.icon className="w-4 h-4" />
                  </span>
                  <span className="text-xs uppercase tracking-[0.16em] font-semibold text-espresso">
                    {comp.category}
                  </span>
                </div>
                <span className="text-xs font-serif italic text-muted">
                  0{idx + 1}
                </span>
              </div>

              {/* The Problem */}
              <div className="p-6 bg-surface border-b border-dashed border-border/80 space-y-2.5">
                <div className="flex items-center gap-2 text-danger text-xs font-semibold uppercase tracking-[0.12em]">
                  <XCircle className="w-4 h-4 shrink-0" />
                  <span>The Legacy Flaw</span>
                </div>
                <h3 className="font-serif text-lg font-medium text-espresso">
                  {comp.problemTitle}
                </h3>
                <p className="text-xs sm:text-sm text-brown/75 leading-relaxed font-light">
                  {comp.problemText}
                </p>
              </div>

              {/* The StitchCart Solution */}
              <div className="p-6 bg-surface-raised space-y-2.5 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sage text-xs font-semibold uppercase tracking-[0.12em]">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>The StitchCart Standard</span>
                  </div>
                  <h3 className="font-serif text-lg font-medium text-espresso">
                    {comp.solutionTitle}
                  </h3>
                  <p className="text-xs sm:text-sm text-brown/85 leading-relaxed font-light">
                    {comp.solutionText}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-border flex items-center justify-between text-[11px] uppercase tracking-[0.14em] text-accent font-semibold">
                  <span>Production Ready</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProblemSolution;
