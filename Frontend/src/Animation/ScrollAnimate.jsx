import React, { useRef, useEffect, useState } from 'react';

/**
 * ScrollAnimate — wraps any content and reveals it with a smooth animation
 * when scrolled into view. Uses IntersectionObserver for performance.
 *
 * Props:
 *   animation: 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'zoom-in' | 'flip-up' (default: 'fade-up')
 *   delay: delay in ms before animation starts (default: 0)
 *   duration: animation duration in ms (default: 700)
 *   threshold: how much of element must be visible to trigger (default: 0.15)
 *   once: if true, only animate once (default: true)
 */
const animations = {
  'fade-up': { from: { opacity: 0, transform: 'translateY(60px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
  'fade-down': { from: { opacity: 0, transform: 'translateY(-60px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
  'fade-left': { from: { opacity: 0, transform: 'translateX(-60px)' }, to: { opacity: 1, transform: 'translateX(0)' } },
  'fade-right': { from: { opacity: 0, transform: 'translateX(60px)' }, to: { opacity: 1, transform: 'translateX(0)' } },
  'zoom-in': { from: { opacity: 0, transform: 'scale(0.85)' }, to: { opacity: 1, transform: 'scale(1)' } },
  'flip-up': { from: { opacity: 0, transform: 'perspective(800px) rotateX(30deg) translateY(40px)' }, to: { opacity: 1, transform: 'perspective(800px) rotateX(0) translateY(0)' } },
};

const ScrollAnimate = ({
  children,
  animation = 'fade-up',
  delay = 0,
  duration = 700,
  threshold = 0.15,
  once = true,
  className = '',
  style = {},
}) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.unobserve(el);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin: '0px 0px -50px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, once]);

  const anim = animations[animation] || animations['fade-up'];

  const animStyle = {
    ...style,
    ...(isVisible ? anim.to : anim.from),
    transition: `all ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
    willChange: 'opacity, transform',
  };

  return (
    <div ref={ref} className={className} style={animStyle}>
      {children}
    </div>
  );
};

export default ScrollAnimate;
