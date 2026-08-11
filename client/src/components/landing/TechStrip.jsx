import { motion } from "framer-motion";

const TECH = ["MERN Stack", "Cloudinary CDN", "Redux Toolkit", "Role-based Auth", "Node + Express", "React 18"];

function TechStrip() {
  return (
    <section className="py-14 bg-background">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center justify-center gap-6 flex-wrap">
        <p className="overline text-taupe">Built on</p>
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.6 }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          {TECH.map((t) => (
            <motion.span
              key={t}
              variants={{
                hidden: { opacity: 0, y: 14 },
                show: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="text-[11px] uppercase tracking-[0.14em] px-4 py-2 border border-border text-taupe hover:text-espresso hover:border-accent/50 transition-colors duration-fast"
            >
              {t}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default TechStrip;
