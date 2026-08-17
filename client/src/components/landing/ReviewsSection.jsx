import { motion } from "framer-motion";
import { Star, BadgeCheck, Sparkles, Quote } from "lucide-react";
import SectionHeader from "./SectionHeader";
import { REVIEWS, PLATFORM_METRICS } from "./data";

function ReviewsSection() {
  return (
    <section id="reviews" className="py-20 sm:py-28 bg-surface border-t border-border">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 sm:gap-8 mb-12 sm:mb-16">
          <SectionHeader
            number="07"
            eyebrow="Verified Community"
            title="Loved by style-conscious buyers across India."
            description="Read verified feedback on fabric weight, tailoring precision, and pan-India express fulfillment."
          />

          {/* Rating Summary Metric */}
          <div className="flex items-center gap-4 sm:gap-5 bg-surface-raised border border-border p-4 sm:p-5 shadow-1 self-start lg:self-end">
            <span className="font-serif text-4xl sm:text-5xl text-espresso font-semibold">
              4.9
            </span>
            <div className="space-y-1">
              <div className="flex text-gold">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-gold stroke-gold" />
                ))}
              </div>
              <p className="text-xs text-muted font-medium">
                3,100+ verified garment reviews
              </p>
            </div>
          </div>
        </div>

        {/* Reviews Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 mb-12 sm:mb-16">
          {REVIEWS.map((rev, idx) => (
            <motion.figure
              key={rev.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: idx * 0.1 }}
              className="flex flex-col justify-between bg-surface-raised border border-border p-5 sm:p-7 shadow-1 relative group hover:border-accent/60 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-3.5">
                  <div className="flex text-gold">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-gold stroke-gold"
                      />
                    ))}
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.14em] text-muted">
                    {rev.date}
                  </span>
                </div>

                <p className="overline text-accent text-[9px] sm:text-[10px] mb-1.5 truncate">
                  Purchased: {rev.garment}
                </p>

                <blockquote className="text-xs sm:text-sm text-brown/90 leading-relaxed font-light mt-2">
                  “{rev.quote}”
                </blockquote>
              </div>

              <figcaption className="flex items-center gap-3 mt-5 sm:mt-6 pt-4 sm:pt-5 border-t border-border">
                <img
                  src={rev.avatar}
                  alt={rev.name}
                  loading="lazy"
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border border-border shrink-0"
                />
                <div className="text-xs min-w-0">
                  <p className="font-semibold text-espresso truncate">{rev.name}</p>
                  <p className="text-muted text-[11px] flex items-center gap-1 mt-0.5 truncate">
                    <BadgeCheck className="w-3.5 h-3.5 text-sage shrink-0" />
                    <span className="truncate">{rev.role}</span>
                  </p>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>

        {/* Platform Metrics Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pt-8 sm:pt-10 border-t border-border">
          {PLATFORM_METRICS.map((metric, idx) => (
            <div
              key={idx}
              className="bg-surface-raised border border-border p-4 sm:p-5 text-center shadow-1"
            >
              <p className="font-serif text-xl sm:text-2xl lg:text-3xl text-espresso font-semibold">
                {metric.value}
              </p>
              <p className="overline text-accent text-[10px] sm:text-xs mt-1">
                {metric.label}
              </p>
              <p className="text-[10px] sm:text-[11px] text-muted mt-0.5 sm:mt-1 font-light truncate">
                {metric.note}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ReviewsSection;
