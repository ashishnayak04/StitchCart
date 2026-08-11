import { motion } from "framer-motion";
import PropTypes from "prop-types";

function SectionIndex({ number, label }) {
  return (
    <motion.p
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="overline text-accent flex items-center gap-3"
    >
      <span className="font-serif text-base not-italic tracking-normal">
        {number}
      </span>
      <span className="w-10 h-px bg-accent" />
      {label}
    </motion.p>
  );
}

SectionIndex.propTypes = {
  number: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};

export default SectionIndex;
