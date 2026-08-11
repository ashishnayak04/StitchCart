import { motion } from "framer-motion";
import PropTypes from "prop-types";

function Reveal({ children, delay = 0, amount = 0.25, className }) {
  return (
    <motion.div
      initial={{
        clipPath: "inset(16% 10% 16% 10% round 6px)",
        opacity: 0,
        y: 32,
      }}
      whileInView={{
        clipPath: "inset(0% 0% 0% 0% round 0px)",
        opacity: 1,
        y: 0,
      }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

Reveal.propTypes = {
  children: PropTypes.node.isRequired,
  delay: PropTypes.number,
  amount: PropTypes.number,
  className: PropTypes.string,
};

export default Reveal;
