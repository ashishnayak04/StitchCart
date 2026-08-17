import { motion } from "framer-motion";
import { Lock, ShieldCheck, Activity, RotateCcw, Check } from "lucide-react";
import SectionHeader from "./SectionHeader";

const PAYMENT_METHODS = [
  { label: "UPI", desc: "GPay, PhonePe, Paytm", style: "font-black tracking-widest" },
  { label: "RuPay", desc: "National Debit & Credit", style: "font-bold italic tracking-tight" },
  { label: "VISA", desc: "Domestic & Global", style: "font-black italic tracking-tight" },
  { label: "Mastercard", desc: "Debit & Credit", style: "font-semibold tracking-tight" },
  { label: "PayPal", desc: "Direct INR Balance", style: "font-bold tracking-normal" },
];

const SECURITY_PILLARS = [
  {
    icon: Lock,
    title: "Bank-Grade Payment Security",
    copy: "Card details and UPI IDs are processed through PCI-DSS Level 1 certified gateways with 256-bit SSL encryption.",
  },
  {
    icon: ShieldCheck,
    title: "Verified Privacy & Buyer Protection",
    copy: "Your personal data and order history are securely safeguarded with strict privacy protocols and zero third-party tracking.",
  },
  {
    icon: Activity,
    title: "Fair Access & Guaranteed Reservation",
    copy: "Our real-time allocation system guarantees that once an item is in your bag, it remains reserved exclusively for you.",
  },
  {
    icon: RotateCcw,
    title: "Instant Cancellation & Direct Refunds",
    copy: "Need to change your mind before dispatch? Cancel anytime with a single click for an immediate reversal to your original payment mode.",
  },
];

function TrustSection() {
  return (
    <section className="py-20 sm:py-28 bg-background border-t border-border">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        <SectionHeader
          number="08"
          eyebrow="Security &amp; Commerce Standards"
          title="Bank-grade encryption. Honest consumer guarantees."
          description="Every transaction on StitchCart is conducted in Indian Rupees (INR) through certified payment pipelines with transparent tax compliance."
          centered
          className="mb-10 sm:mb-14"
        />

        {/* Payment Badges Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3 max-w-4xl mx-auto mb-12 sm:mb-16">
          {PAYMENT_METHODS.map((pm) => (
            <div
              key={pm.label}
              className="bg-surface-raised border border-border p-3.5 sm:p-4 text-center shadow-1"
            >
              <p className={`text-base sm:text-lg text-accent ${pm.style}`}>{pm.label}</p>
              <p className="text-[9px] sm:text-[10px] text-muted uppercase tracking-[0.1em] mt-0.5 sm:mt-1">
                {pm.desc}
              </p>
            </div>
          ))}
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {SECURITY_PILLARS.map((pillar, idx) => (
            <div
              key={pillar.title}
              className="bg-surface-raised border border-border p-5 sm:p-6 shadow-1 flex flex-col justify-between"
            >
              <div>
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-surface flex items-center justify-center text-accent mb-3 sm:mb-4 border border-border">
                  <pillar.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <h3 className="font-serif text-sm sm:text-base text-espresso font-semibold mb-1.5 sm:mb-2">
                  {pillar.title}
                </h3>
                <p className="text-xs text-brown/80 font-light leading-relaxed">
                  {pillar.copy}
                </p>
              </div>

              <div className="pt-3.5 sm:pt-4 mt-3.5 sm:mt-4 border-t border-border flex items-center gap-1.5 text-[10px] uppercase tracking-[0.14em] text-sage font-semibold">
                <Check className="w-3 h-3" />
                <span>Verified Active</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TrustSection;
