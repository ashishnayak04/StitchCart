import { motion } from "framer-motion";
import {
  Compass,
  ShoppingBag,
  CreditCard,
  Truck,
  CheckCircle2,
  Package,
  MapPin,
} from "lucide-react";
import SectionHeader from "./SectionHeader";
import { WORKFLOW_STAGES } from "./data";

const STAGE_ICONS = [Compass, ShoppingBag, CreditCard, Truck];

const ORDER_LIFECYCLE_MOCK = [
  {
    status: "Order Confirmed",
    timestamp: "Feb 14, 10:30 AM",
    description: "Payment captured via Stripe INR · Inventory allocated",
    done: true,
  },
  {
    status: "Quality Inspection & Atelier Pack",
    timestamp: "Feb 14, 03:15 PM",
    description: "Hand-pressed, lint-rolled, and sealed in breathable garment bag",
    done: true,
  },
  {
    status: "Dispatched with Delhivery Express",
    timestamp: "Feb 15, 09:40 AM",
    description: "AWB #DEL-8829419 · In transit to Mumbai Hub",
    done: true,
  },
  {
    status: "Delivered to Doorstep",
    timestamp: "Feb 16, 01:20 PM",
    description: "Signed and archived to customer account history",
    done: true,
  },
];

function WorkflowTimeline() {
  return (
    <section id="experience" className="py-20 sm:py-28 bg-background">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        <SectionHeader
          number="04"
          eyebrow="The Commerce Lifecycle"
          title="Engineered for an effortless journey from discovery to delivery."
          description="How StitchCart unifies product search, real-time inventory allocation, secure INR payments, and pan-India express logistics."
          className="mb-10 sm:mb-16"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left: 4 Workflow Steps */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6">
            {WORKFLOW_STAGES.map((stage, idx) => {
              const Icon = STAGE_ICONS[idx];
              return (
                <motion.div
                  key={stage.step}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.45, delay: idx * 0.1 }}
                  className="bg-surface-raised border border-border p-4 sm:p-6 shadow-1 hover:border-accent/60 transition-colors flex items-start gap-4 sm:gap-5"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-espresso text-gold shrink-0 border border-gold/30">
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>

                  <div className="space-y-1 sm:space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-1">
                      <span className="overline text-accent text-[10px] sm:text-xs">
                        Stage {stage.step} · {stage.tag}
                      </span>
                      <span className="text-[10px] sm:text-[11px] font-medium text-sage uppercase tracking-[0.1em]">
                        {stage.metrics}
                      </span>
                    </div>

                    <h3 className="font-serif text-base sm:text-lg lg:text-xl text-espresso font-medium">
                      {stage.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-brown/80 font-light leading-relaxed">
                      {stage.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Right: Live Order Lifecycle Tracking Simulation Card */}
          <div className="lg:col-span-5 bg-surface-raised border border-border p-5 sm:p-7 shadow-2">
            <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-border">
              <div>
                <span className="overline text-accent text-[10px] sm:text-xs">
                  Order Tracking
                </span>
                <h3 className="font-serif text-base sm:text-lg text-espresso font-medium mt-0.5">
                  #SC-MUM-84920
                </h3>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 bg-sage/10 text-sage text-[10px] sm:text-xs font-semibold uppercase tracking-[0.1em] border border-sage/30">
                <span className="w-1.5 h-1.5 rounded-full bg-sage animate-pulse" />
                Delivered
              </span>
            </div>

            {/* Order Items Info */}
            <div className="py-3 sm:py-4 border-b border-border/80 text-xs flex items-center justify-between text-muted">
              <span>Item: Italian Wool Atelier Suit (40R)</span>
              <span className="font-serif text-xs sm:text-sm text-espresso font-medium">
                ₹18,999
              </span>
            </div>

            {/* Steps Visual List */}
            <div className="py-5 sm:py-6 relative pl-5 sm:pl-6 space-y-5 sm:space-y-6">
              {/* Vertical connector line */}
              <div className="absolute left-[5px] sm:left-[7px] top-3 bottom-3 w-px bg-gold/50" />

              {ORDER_LIFECYCLE_MOCK.map((step, idx) => (
                <div key={idx} className="relative">
                  <span className="absolute -left-5 sm:-left-6 top-1 w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-accent border-2 border-surface-raised flex items-center justify-center text-ivory text-[8px]" />
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-semibold text-espresso">
                        {step.status}
                      </p>
                      <span className="text-[9px] sm:text-[10px] text-muted font-mono shrink-0">
                        {step.timestamp}
                      </span>
                    </div>
                    <p className="text-[11px] text-brown/75 mt-0.5 font-light leading-snug">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Delivery Confirmation Footer */}
            <div className="pt-3.5 sm:pt-4 border-t border-border flex items-center justify-between text-xs text-muted">
              <span className="flex items-center gap-1.5 text-sage font-medium">
                <CheckCircle2 className="w-4 h-4 text-sage" />
                Proof of Delivery Recorded
              </span>
              <span className="font-mono text-[11px]">OTP Verified</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default WorkflowTimeline;
