import { motion } from "framer-motion";

function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-full bg-background gap-8">
      <div className="relative flex items-center justify-center">
        {/* Needle */}
        <motion.svg
          width="48"
          height="80"
          viewBox="0 0 48 80"
          fill="none"
          className="relative z-10"
          animate={{ rotate: [0, -20, 0, 20, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Needle body */}
          <rect x="21" y="0" width="6" height="60" rx="3" fill="hsl(27, 11%, 16%)" />
          {/* Needle eye */}
          <ellipse cx="24" cy="65" rx="4" ry="3" stroke="hsl(27, 11%, 16%)" strokeWidth="2" fill="none" />
          {/* Needle point */}
          <path d="M24 80 L21 60 L27 60 Z" fill="hsl(27, 11%, 16%)" />
        </motion.svg>

        {/* Thread trail */}
        <svg
          className="absolute top-0 left-0 w-[200px] h-[160px] pointer-events-none"
          viewBox="0 0 200 160"
        >
          <motion.path
            d="M 100,65 C 80,40 60,80 40,50 C 20,20 0,60 -20,30"
            stroke="hsl(37, 36%, 57%)"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            strokeDasharray="200"
            initial={{ strokeDashoffset: 200 }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.path
            d="M 100,65 C 120,90 140,50 160,80 C 180,110 200,70 220,100"
            stroke="hsl(13, 51%, 47%)"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            strokeDasharray="200"
            initial={{ strokeDashoffset: 200 }}
            animate={{ strokeDashoffset: 0 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
          />
        </svg>
      </div>

      {/* Brand text */}
      <div className="flex flex-col items-center gap-2">
        <motion.span
          className="text-2xl font-semibold tracking-wide text-foreground"
          style={{ fontFamily: '"Fraunces", Georgia, serif' }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          StitchCart
        </motion.span>
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-gold"
              animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.3,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Loading;
