import { motion } from "framer-motion";
import { Check, Lock, ShieldCheck, Activity, RotateCcw } from "lucide-react";
import SectionIndex from "./SectionIndex";

const PAYMENT_MARKS = [
  { label: "VISA", style: "font-black italic tracking-tight" },
  { label: "Mastercard", style: "font-semibold tracking-tight" },
  { label: "AMEX", style: "font-bold tracking-widest" },
  { label: "PayPal", style: "font-serif font-semibold italic tracking-tight" },
];

const ASSURANCES = [
  {
    icon: Lock,
    title: "SSL-encrypted checkout",
    copy: "Card details never touch our servers — handled by Stripe & PayPal.",
  },
  {
    icon: ShieldCheck,
    title: "httpOnly JWT sessions",
    copy: "Signed in securely; session tokens stay out of JavaScript.",
  },
  {
    icon: Activity,
    title: "Rate-limited & protected",
    copy: "Every request throttled to keep your account safe.",
  },
  {
    icon: RotateCcw,
    title: "Cancel anytime, refunded",
    copy: "Changed your mind? Refunds process automatically.",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

function TrustSection() {
  return (
    <section className="py-28 bg-background border-t border-border">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="text-center max-w-2xl mx-auto"
        >
          <motion.p
            variants={item}
            className="flex items-center justify-center"
          >
            <SectionIndex number="04" label="Trusted Checkout" />
          </motion.p>
          <motion.h2
            variants={item}
            className="display-lg text-espresso mt-4"
          >
            Pay with confidence, in your currency.
          </motion.h2>
          <motion.p variants={item} className="text-brown/80 mt-4">
            All pricing in USD. Stripe and PayPal handle every payment, so
            Visa, Mastercard, Amex and your PayPal balance all work the same —
            securely.
          </motion.p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-4 mt-12"
        >
          {PAYMENT_MARKS.map((mark) => (
            <motion.span
              key={mark.label}
              variants={item}
              className={`px-7 py-3.5 border border-gold/50 bg-accent/10 text-accent-hover text-lg ${mark.style}`}
            >
              {mark.label}
            </motion.span>
          ))}
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-16"
        >
          {ASSURANCES.map((a) => (
            <motion.div
              key={a.title}
              variants={item}
              className="bg-surface-raised border border-border p-6"
            >
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-sage/15 text-sage">
                <a.icon className="w-5 h-5" />
              </span>
              <h3 className="font-serif text-lg text-espresso font-medium mt-4">
                {a.title}
              </h3>
              <p className="text-sm text-muted leading-relaxed mt-2">{a.copy}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex items-center justify-center gap-2 text-sm text-sage mt-12"
        >
          <Check className="w-4 h-4" />
          No hidden fees. No surprise shipping. Refunds without a support
          ticket.
        </motion.p>
      </div>
    </section>
  );
}

export default TrustSection;
