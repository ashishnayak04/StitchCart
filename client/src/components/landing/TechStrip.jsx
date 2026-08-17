import { motion } from "framer-motion";

const TECH_PIPELINE = [
  "React 18 & Vite",
  "Node.js & Express REST API",
  "MongoDB Atlas ODM",
  "Redux Toolkit State Cache",
  "Cloudinary Media Pipeline",
  "Stripe & PayPal INR Checkout",
  "Role-Based JWT Security",
  "Radix UI Primitives",
];

function TechStrip() {
  return (
    <section className="py-12 bg-surface border-t border-border">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center justify-center gap-6 flex-wrap">
        <p className="overline text-accent text-xs">
          Built on Modern MERN Architecture
        </p>

        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {TECH_PIPELINE.map((tech) => (
            <span
              key={tech}
              className="text-[11px] uppercase tracking-[0.14em] px-3.5 py-1.5 border border-border bg-surface-raised text-brown/90 hover:border-accent hover:text-espresso transition-colors font-mono"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TechStrip;
