import { useEffect, useLayoutEffect, useRef } from "react";
import Lenis from "lenis";
import PropTypes from "prop-types";
import { gsap, ScrollTrigger, prefersReducedMotion } from "./gsap-setup";

function SmoothScroll({ children }) {
  const progressRef = useRef(null);

  useLayoutEffect(() => {
    const bar = progressRef.current;
    const reduced = prefersReducedMotion();
    if (reduced) {
      gsap.set(bar, { scaleX: 1 });
      return;
    }
    gsap.fromTo(
      bar,
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          start: 0,
          end: "max",
          scrub: 0.3,
        },
      }
    );
  }, []);

  useEffect(() => {
    const reduced = prefersReducedMotion();
    if (reduced) return;

    const html = document.documentElement;
    const prevScrollBehavior = html.style.scrollBehavior;
    html.style.scrollBehavior = "auto";

    const lenis = new Lenis({
      duration: 1.15,
      smoothWheel: true,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const onClick = (e) => {
      const anchor = e.target.closest?.('a[href^="#"]');
      if (!anchor) return;
      const id = anchor.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        lenis.scrollTo(target, { offset: -76, duration: 1.2 });
      }
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      gsap.ticker.remove(tick);
      lenis.destroy();
      html.style.scrollBehavior = prevScrollBehavior;
    };
  }, []);

  return (
    <>
      <div
        ref={progressRef}
        className="fixed top-0 inset-x-0 z-[70] h-[3px] bg-gold origin-left scale-x-0 pointer-events-none"
      />
      {children}
    </>
  );
}

SmoothScroll.propTypes = {
  children: PropTypes.node.isRequired,
};

export default SmoothScroll;
