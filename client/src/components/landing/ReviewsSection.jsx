import { motion } from "framer-motion";
import { Star, BadgeCheck } from "lucide-react";
import PropTypes from "prop-types";
import { REVIEWS } from "./data";
import SectionIndex from "./SectionIndex";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14 } },
};
const item = {
  hidden: { opacity: 0, y: 36 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

function ReviewStars({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className="w-4 h-4"
          fill={
            star <= rating ? "hsl(37 36% 57%)" : "transparent"
          }
          stroke={star <= rating ? "hsl(37 36% 57%)" : "hsl(28 8% 51%)"}
        />
      ))}
    </div>
  );
}

ReviewStars.propTypes = {
  rating: PropTypes.number.isRequired,
};

function ReviewsSection() {
  return (
    <section className="py-28 bg-surface-raised border-y border-border">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16"
        >
          <div>
            <motion.p variants={item}>
              <SectionIndex number="05" label="From the Community" />
            </motion.p>
            <motion.h2
              variants={item}
              className="display-lg text-espresso mt-4"
            >
              Loved by 12,000+ shoppers
            </motion.h2>
          </div>
          <motion.div variants={item} className="flex items-center gap-4">
            <span className="font-serif text-5xl text-espresso">4.8</span>
            <div>
              <ReviewStars rating={5} />
              <p className="text-xs text-muted mt-1.5">
                2,300+ verified reviews
              </p>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {REVIEWS.map((review) => (
            <motion.figure
              key={review.name}
              variants={item}
              className="flex flex-col bg-surface border border-border p-7"
            >
              <ReviewStars rating={review.rating} />
              <blockquote className="text-brown/90 leading-relaxed mt-5 flex-1">
                “{review.quote}”
              </blockquote>
              <figcaption className="flex items-center gap-3 mt-6 pt-6 border-t border-beige">
                <img
                  src={review.avatar}
                  alt={review.name}
                  loading="lazy"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-semibold text-espresso">
                    {review.name}
                  </p>
                  <p className="text-[11px] text-muted flex items-center gap-1">
                    <BadgeCheck className="w-3.5 h-3.5 text-sage" />
                    {review.role}
                  </p>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default ReviewsSection;
