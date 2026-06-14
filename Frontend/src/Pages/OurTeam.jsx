import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PawPrint, Sparkles, Heart } from 'lucide-react';

// Floating paw particles
const FloatingPaw = ({ delay, angle, distance }) => {
  const startX = typeof window !== 'undefined' ? window.innerWidth / 2 : 500;
  const startY = typeof window !== 'undefined' ? window.innerHeight / 2 : 400;
  const rad = (angle * Math.PI) / 180;
  
  return (
    <motion.div
      className="fixed pointer-events-none z-50"
      style={{ left: startX, top: startY }}
      initial={{ opacity: 1, scale: 0.4, rotate: 0 }}
      animate={{
        opacity: [1, 1, 0],
        scale: [0.4, 1.2, 0],
        x: Math.cos(rad) * distance,
        y: Math.sin(rad) * distance,
        rotate: [0, angle * 2],
      }}
      transition={{ duration: 1, ease: "easeOut", delay }}
    >
      <PawPrint size={36} className="text-orange-500 drop-shadow-lg" />
    </motion.div>
  );
};

export default function OurTeam() {
  const [isClicked, setIsClicked] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [showMessage, setShowMessage] = useState(false);

  const handleClick = useCallback(() => {
    setIsClicked(true);
    setClickCount(prev => {
      const next = prev + 1;
      if (next % 3 === 0) setShowMessage(true);
      else setShowMessage(false);
      return next;
    });
    setTimeout(() => setIsClicked(false), 800);
    setTimeout(() => setShowMessage(false), 2000);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-200 via-amber-50 to-amber-200 relative overflow-hidden flex items-center justify-center px-4">
      {/* Animated Background Blobs */}
      <div className="blob-orb-1 -top-40 -left-40 opacity-30"></div>
      <div className="blob-orb-2 -bottom-40 -right-40 opacity-30"></div>
      <div className="blob-orb-3 top-1/3 right-10 opacity-20"></div>

      {/* Floating Particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-orange-300/20 rounded-full"
          animate={{ y: [0, -20, 0], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 3 + i * 0.3, repeat: Infinity, ease: "easeInOut" }}
          style={{ left: `${10 + (i * 12) % 85}%`, top: `${15 + (i * 15) % 70}%` }}
        />
      ))}

      {/* Click Particle Effects */}
      <AnimatePresence>
        {isClicked && (
          <>
            {[...Array(10)].map((_, i) => (
              <FloatingPaw
                key={`paw-${i}`}
                delay={i * 0.04}
                angle={i * 36}
                distance={150 + Math.random() * 100}
              />
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <motion.div
        onClick={handleClick}
        className="relative z-10 max-w-xl w-full cursor-pointer select-none"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        {/* Glass Card */}
        <motion.div
          className="relative overflow-hidden rounded-3xl"
          style={{
            background: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(24px) saturate(200%)",
            WebkitBackdropFilter: "blur(24px) saturate(200%)",
            border: "1px solid rgba(255, 255, 255, 0.6)",
            boxShadow: `
              0 20px 60px rgba(0, 0, 0, 0.08),
              0 4px 20px rgba(0, 0, 0, 0.04),
              inset 0 1px 0 rgba(255, 255, 255, 0.8)
            `,
          }}
          animate={isClicked ? {
            boxShadow: [
              "0 20px 60px rgba(0, 0, 0, 0.08), 0 0 0 3px rgba(251, 146, 60, 0.3)",
              "0 20px 60px rgba(0, 0, 0, 0.08), 0 0 0 8px rgba(251, 146, 60, 0.5), 0 0 60px rgba(251, 146, 60, 0.2)",
              "0 20px 60px rgba(0, 0, 0, 0.08), 0 0 0 3px rgba(251, 146, 60, 0.3)",
            ]
          } : {}}
          transition={{ duration: 0.6 }}
        >
          {/* Shimmer Overlay */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "linear-gradient(135deg, transparent 30%, rgba(251, 146, 60, 0.08) 50%, transparent 70%)",
            }}
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "loop", ease: "linear" }}
          />

          {/* Content */}
          <div className="relative z-10 p-10 md:p-14 text-center">
            
            {/* Icon */}
            <motion.div
              className="mb-6"
              animate={isClicked ? { rotate: [0, -15, 15, -15, 0], scale: [1, 1.3, 1] } : {}}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            >
              <motion.div
                className="w-20 h-20 mx-auto rounded-full flex items-center justify-center shadow-lg"
                style={{
                  background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
                }}
                animate={{
                  boxShadow: [
                    "0 0 0 0 rgba(249, 115, 22, 0.4)",
                    "0 0 0 12px rgba(249, 115, 22, 0)",
                    "0 0 0 0 rgba(249, 115, 22, 0)",
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Heart size={40} className="text-white" />
              </motion.div>
            </motion.div>

            {/* Title - Always Dark & Readable */}
            <motion.h1
              className="text-3xl md:text-4xl font-extrabold mb-3 tracking-tight"
              style={{ color: "#1f2937" }}
              animate={isClicked ? { y: [0, -3, 0] } : {}}
              transition={{ duration: 0.4 }}
            >
              Our Team
            </motion.h1>

            {/* Animated Divider */}
            <motion.div
              className="h-1.5 rounded-full mx-auto mb-6"
              style={{
                background: "linear-gradient(90deg, #f97316, #f59e0b, #f97316)",
              }}
              animate={isClicked ? { width: [64, 120, 64] } : { width: 64 }}
              transition={{ duration: 0.5 }}
            />

            {/* Main Message - Always Dark & Readable */}
            <motion.p
              className="text-xl md:text-2xl font-semibold mb-3"
              style={{ color: "#374151" }}
              animate={isClicked ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 0.4 }}
            >
              <AnimatePresence mode="wait">
                {isClicked ? (
                  <motion.span
                    key="clicked"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                  >
                    🎉 We're Working On Something Amazing!
                  </motion.span>
                ) : (
                  <motion.span key="default" initial={{ opacity: 1 }} animate={{ opacity: 1 }}>
                    To Be Updated Soon
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.p>

            {/* Description */}
            <p className="text-gray-500 text-sm md:text-base leading-relaxed mb-4">
              Our dedicated team of volunteers and staff is preparing this section.
              <br className="hidden md:block" />
              Check back soon to meet the amazing people behind our mission!
            </p>

            {/* Click Counter Message */}
            <AnimatePresence>
              {showMessage && clickCount > 0 && (
                <motion.div
                  className="inline-block px-4 py-2 rounded-full text-sm font-semibold"
                  style={{
                    background: "rgba(249, 115, 22, 0.1)",
                    border: "1px solid rgba(249, 115, 22, 0.2)",
                    color: "#ea580c",
                  }}
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  🔥 That's {clickCount} clicks — our team loves the enthusiasm!
                </motion.div>
              )}
            </AnimatePresence>

            {/* Hint */}
            {!isClicked && (
              <motion.p
                className="text-xs mt-5 font-medium"
                style={{ color: "#9ca3af" }}
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              >
                ✨ Tap to see what's coming
              </motion.p>
            )}
          </div>
        </motion.div>

        {/* Bottom Decorative Icons */}
        <motion.div className="mt-6 flex justify-center gap-5">
          {[PawPrint, Heart, Sparkles].map((Icon, i) => (
            <motion.div
              key={i}
              style={{ color: "rgba(251, 146, 60, 0.4)" }}
              animate={{ y: [0, -6, 0], rotate: [0, 8, -8, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.25 }}
            >
              <Icon size={22} />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
