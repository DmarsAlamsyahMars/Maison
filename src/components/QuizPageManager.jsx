import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { navigate } from 'astro:transitions/client';
import MiniQuiz from './MiniQuiz';
import { isZooming, startAtWarp } from '../lib/store';

export default function QuizPageManager() {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // --- 1. AGGRESSIVE CURTAIN REMOVAL ---
    const killCurtain = () => {
        const curtain = document.getElementById('static-curtain');
        if (curtain) {
            curtain.style.transition = 'opacity 0.8s ease';
            curtain.style.opacity = '0';
            setTimeout(() => {
                if (curtain && curtain.parentNode) {
                    curtain.parentNode.removeChild(curtain);
                }
            }, 800);
            return true;
        }
        return false;
    };

    if (!killCurtain()) {
        setTimeout(killCurtain, 100);
        setTimeout(killCurtain, 500);
    }

    // --- 2. PARTICLE SAFETY ---
    if (!startAtWarp.get()) {
        isZooming.set(false);
    } else {
        isZooming.set(true);
    }

    // --- 3. DECELERATION SEQUENCE ---
    const timer = setTimeout(() => {
        isZooming.set(false);
        startAtWarp.set(false); 
    }, 200);
    
    return () => clearTimeout(timer);
  }, []);

  const handleReturnHome = () => {
    setIsExiting(true);
    isZooming.set(true);
    setTimeout(() => {
      navigate('/#discovery-hub');
      setTimeout(() => isZooming.set(false), 500); 
    }, 2000);
  };

  return (
    <>
      {/* FIXED: Reverted to relative flow so FragranceShowcase can scroll. 
          MiniQuiz will still lock itself to h-screen internally. */}
      <main className="relative z-10 w-full min-h-screen overflow-x-hidden">
        <AnimatePresence>
          {!isExiting && (
            <motion.div
              initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)", transition: { delay: 0.5, duration: 1.2 } }} 
              exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)", transition: { duration: 0.5 } }}
              className="w-full"
            >
              <MiniQuiz onBack={handleReturnHome} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </>
  );
}