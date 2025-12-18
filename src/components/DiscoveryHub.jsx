import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// 1. Import navigate for soft transitions
import { navigate } from 'astro:transitions/client';
// 2. Import the Nano Stores to control the global background
import { isZooming, startAtWarp } from '../lib/store';

export default function DiscoveryHub() {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const handleBeginJourney = () => {
    // Start local UI exit animation
    setIsTransitioning(true);
    
    // 3. Trigger the GLOBAL background to zoom (warp speed)
    isZooming.set(true);
    
    // Wait for the acceleration (2.5s) before swapping pages
    setTimeout(() => {
        // 4. Set the "Entry State" for the next page so particles stay fast
        startAtWarp.set(true); 
        
        // 5. Navigate without reloading
        navigate('/quiz?entry=true');
    }, 2500);
  };

  // LUXURY STYLES
  const bevelTextStyle = {
    color: '#C5A059',
    textShadow: '0 -1px 0 rgba(255,255,255,0.4), 0 2px 4px rgba(0,0,0,0.15)'
  };
  const goldText = '#C5A059';
  const darkGold = '#9E8043';

  return (
    <section 
        id="discovery-hub" 
        className="relative min-h-[80vh] flex items-center justify-center py-24 px-6 overflow-hidden"
    >
      {/* NOTE: We removed the local <ScentParticles /> here. 
          The 3D background is now handled by BaseLayout -> BackgroundManager 
          so it persists across page loads. */}

      <AnimatePresence mode="wait">
        {!isTransitioning ? (
          <motion.div 
            key="intro"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }} 
            
            // CLEAN LUXURY EXIT
            // Simple fade out + slight scale up to feel like we are moving forward
            exit={{ 
                opacity: 0, 
                scale: 1.1, 
                filter: "blur(10px)",
                transition: { duration: 1.5, ease: "easeInOut" } 
            }}
            
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-4xl mx-auto z-10 flex flex-col items-center text-center"
          >
            <div className="w-px h-16 bg-gradient-to-b from-transparent via-[#C5A059] to-transparent mb-8 opacity-60"></div>

            <span className="block text-[10px] tracking-[0.4em] uppercase mb-8 font-medium" style={{ color: darkGold }}>
                Maison des Rêves
            </span>
            
            <h2 
                className="text-5xl md:text-7xl font-serif font-medium mb-8 leading-tight"
                style={bevelTextStyle}
            >
                Discover your <br/>
                <span className="italic font-light opacity-80 block mt-2 text-4xl md:text-6xl">
                    olfactory signature
                </span>
            </h2>
            
            <p className="mb-16 max-w-md mx-auto font-light leading-relaxed text-sm md:text-base tracking-wide" style={{ color: darkGold }}>
                Allow us to curate a selection based on your unique preferences. <br />
            </p>

            <div className="relative group">
                <button 
                    onClick={handleBeginJourney}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    className="relative z-20 px-12 py-5 bg-transparent cursor-pointer overflow-hidden transition-all duration-500"
                >
                    <span 
                        className="relative z-10 text-xs tracking-[0.3em] uppercase font-semibold transition-colors duration-500 group-hover:text-[#FDFBF7]"
                        style={{ color: goldText }}
                    >
                        Begin Journey
                    </span>
                    <div className="absolute inset-0 border border-[#C5A059] transition-all duration-500 ease-out group-hover:scale-[0.95] opacity-100"></div>
                    <div className="absolute inset-0 border border-[#C5A059] opacity-0 scale-110 transition-all duration-700 ease-out group-hover:opacity-40 group-hover:scale-100 group-hover:rotate-1"></div>
                    <div className="absolute inset-0 bg-[#C5A059] transform scale-x-0 origin-left transition-transform duration-500 ease-out group-hover:scale-x-100 opacity-90"></div>
                </button>
            </div>
            
            <div className="mt-12">
                <a 
                    href="/collection"
                    className="group flex items-center gap-3 text-[10px] tracking-[0.25em] uppercase transition-all duration-500 hover:opacity-100 opacity-60 cursor-pointer" 
                    style={{ color: darkGold }}
                >
                    <span className="border-b border-transparent group-hover:border-[#C5A059] pb-1 transition-all">
                        Or browse full collection
                    </span>
                    <span className="transform group-hover:translate-x-1 transition-transform duration-500 text-lg font-light leading-none pb-1">
                        &rarr;
                    </span>
                </a>
            </div>

          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}