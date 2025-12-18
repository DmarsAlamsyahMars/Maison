import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Sparkles from './ui/Sparkles'; 


gsap.registerPlugin(ScrollTrigger);

// --- CONFIGURATION ---
const cherubConfig = [
  { 
    id: 1, src: '/cherub1.webp', width: 'w-24', 
    top: '55%', left: '35%', 
    mobileTop: '43%', mobileLeft: '60%', 
    floatY: -10, floatX: 5, rotate: 2, duration: 4, delay: 0 
  },
  { 
    id: 2, src: '/cherub2.webp', width: 'w-25', 
    top: '52%', left: '20%', 
    mobileTop: '50%', mobileLeft: '21%',
    floatY: 2, floatX: -3, rotate: -3, duration: 5, delay: 0.5 
  },
  { 
    id: 3, src: '/cherub3.webp', width: 'w-20', 
    top: '60%', left: '30%', 
    mobileTop: '58%', mobileLeft: '40%',
    floatY: -10, floatX: 10, rotate: 1, duration: 3.5, delay: 1 
  },
  { 
    id: 4, src: '/cherub4.webp', width: 'w-24', 
    top: '35%', left: '25%', 
    mobileTop: '30%', mobileLeft: '38%',
    floatY: 15, floatX: -10, rotate: -2, duration: 4.5, delay: 1.5 
  },
  { 
    id: 5, src: '/cherub5.webp', width: 'w-26', 
    top: '30%', left: '65%', 
    mobileTop: '28%', mobileLeft: '52%',
    floatY: -20, floatX: 8, rotate: 3, duration: 5.5, delay: 0.2 
  },
  { 
    id: 6, src: '/cherub6.webp', width: 'w-24', 
    top: '55%', left: '65%', 
    mobileTop: '55%', mobileLeft: '52%',
    floatY: 12, floatX: -8, rotate: -1, duration: 4.2, delay: 0.8 
  },
  { 
    id: 7, src: '/cherub7.webp', width: 'w-16', 
    top: '45%', left: '72%', 
    mobileTop: '40%', mobileLeft: '70%',
    floatY: -8, floatX: 6, rotate: 2, duration: 3, delay: 1.2 
  }, 
];

const HeroSection = () => {
  const containerRef = useRef(null);
  const sceneWrapperRef = useRef(null);
  const fadeLayerRef = useRef(null);   
  const cherubLayerRef = useRef(null); 
  const leftTextRef = useRef(null);
  const rightTextRef = useRef(null);

  useLayoutEffect(() => {
    const setViewportHeightVar = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    setViewportHeightVar();
    window.addEventListener('resize', setViewportHeightVar);

    let mm = gsap.matchMedia();

    mm.add({
      isMobile: "(max-width: 768px)",
      isDesktop: "(min-width: 769px)",
    }, (context) => {
      let { isMobile } = context.conditions;

      const startScale = isMobile ? 2.9 : 2.5;
      const endScale = isMobile ? 0.4 : 0.7;

      gsap.set(sceneWrapperRef.current, { scale: startScale, transformOrigin: "center center" });
      
      // --- ROBUST POSITIONING FIX ---
      gsap.set([leftTextRef.current, rightTextRef.current], { autoAlpha: 0 });

      if (isMobile) {
          // MOBILE
          gsap.set(leftTextRef.current, { xPercent: -50, y: -30 });  
          gsap.set(rightTextRef.current, { xPercent: -50, y: 30 });  
      } else {
          // DESKTOP
          gsap.set(leftTextRef.current, { x: -50, yPercent: -50 });
          gsap.set(rightTextRef.current, { x: 50, yPercent: -50 });
      }

      const cherubs = cherubLayerRef.current.children;
      gsap.set(cherubs, { '--intensity': 1, '--rotate': 0, '--floatX': 0, '--floatY': 0 });

      Array.from(cherubs).forEach((cherub, i) => {
        const config = cherubConfig[i];
        gsap.to(cherub, {
            '--floatY': config.floatY,
            '--floatX': config.floatX,
            '--rotate': config.rotate,
            duration: config.duration,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
            delay: config.delay
        });
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=300%", 
          scrub: 1, 
          pin: true,
          anticipatePin: 1
        }
      });

      tl.addLabel("start");
      tl.to(sceneWrapperRef.current, { scale: endScale, duration: 2, ease: "power1.inOut" }, "start");
      tl.to(fadeLayerRef.current, { opacity: 0, duration: 1.5, ease: "power1.in" }, "start");
      tl.to(cherubs, { '--intensity': 0, duration: 2, ease: "power1.inOut" }, "start");
      
      // ANIMATE TEXT IN
      tl.to([leftTextRef.current, rightTextRef.current], { 
          autoAlpha: 1, 
          x: 0, 
          y: 0, 
          stagger: 0.2, 
          duration: 1 
      }, "-=0.5");

      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('hero-ready'));
      }, 100);

    }, containerRef);

    return () => mm.revert();
  }, []);

  return (
    <section 
      ref={containerRef}
      className="relative min-h-[100dvh] bg-transparent overflow-hidden"
      style={{ height: 'calc(var(--vh, 1vh) * 100)' }}
    >
      <style>{`
        .living-cherub {
            --floatX: 0px;
            --floatY: 0px;
            --rotate: 0deg;
            --intensity: 1; 
            top: var(--mob-top);
            left: var(--mob-left);
            transform: translate3d(calc(var(--floatX) * var(--intensity)), calc(var(--floatY) * var(--intensity)), 0) rotate(calc(var(--rotate) * var(--intensity)));
            will-change: transform; 
        }
        @media (min-width: 768px) {
            .living-cherub {
                top: var(--desk-top);
                left: var(--desk-left);
            }
        }
      `}</style>

      <div className="absolute inset-0 bg-transparent">
        <div className="absolute inset-0 opacity-5">
           <div className="w-full h-full bg-gradient-to-br from-transparent via-stone-300/10 to-transparent"></div>
        </div>
      </div>

      {/* --- TEXT 1: HERITAGE --- */}
      <div 
        ref={leftTextRef} 
        className="
            absolute z-30 pointer-events-none 
            /* MOBILE: Top + Centered horizontally */
            top-[15%] left-1/2 text-center w-64
            
            /* DESKTOP: Centered Vertically + Left positioned */
            md:top-1/2 md:translate-x-0 md:left-[5%] md:right-auto md:w-80 md:text-left
        "
      >
        <h3 className="text-xl font-serif text-stone-800 mb-2">Heritage</h3>
        <p className="text-xs text-stone-600 leading-relaxed font-light tracking-wide">
           Inspired by rococo art and celestial <br className="hidden md:block"/> mythology, each scent is a modern <br className="hidden md:block"/> relic, preserved emotion, and bottled <br className="hidden md:block"/> opulence.
        </p>
      </div>

      {/* --- TEXT 2: CURATED --- */}
      <div 
        ref={rightTextRef} 
        className="
            absolute z-30 pointer-events-none 
            /* MOBILE: Bottom + Centered horizontally */
            bottom-[15%] left-1/2 text-center w-64
            
            /* DESKTOP: Centered Vertically + Right positioned */
            md:bottom-auto md:top-1/2 md:translate-x-0 md:left-auto md:right-[5%] md:w-80 md:text-right
        "
      >
        <h3 className="text-xl font-serif text-stone-800 mb-2">Curated for you</h3>
        <p className="text-xs text-stone-600 leading-relaxed font-light tracking-wide">
           A collection made for those who <br className="hidden md:block"/> feel deeply, love softly, and move <br className="hidden md:block"/> through life with quiet grace.
        </p>
      </div>

      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div ref={sceneWrapperRef} className="relative w-[900px] h-[600px] will-change-transform">
            
            <div className="absolute inset-0 z-0">
                <div 
                    className="absolute inset-0 z-20 pointer-events-none"
                    style={{ backgroundImage: 'url(/framewebp.webp)', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', backgroundSize: 'contain' }}
                />
                <div 
                    className="absolute inset-24 rounded-md overflow-hidden"
                    style={{ backgroundImage: 'url(/rococowebp.webp)', backgroundSize: 'cover', backgroundPosition: 'center' }}
                />
            </div>

            <div ref={cherubLayerRef} className="absolute inset-0 z-30 pointer-events-none">
                {cherubConfig.map((cherub) => (
                    <img 
                        key={cherub.id}
                        src={cherub.src}
                        alt="Cherub"
                        className={`living-cherub absolute opacity-90 drop-shadow-lg ${cherub.width}`}
                        style={{ 
                            '--mob-top': cherub.mobileTop,
                            '--mob-left': cherub.mobileLeft,
                            '--desk-top': cherub.top, 
                            '--desk-left': cherub.left,
                            filter: 'contrast(0.9) sepia(0.2)',
                        }}
                    />
                ))}
            </div>

            <div ref={fadeLayerRef} className="absolute inset-0 z-40 pointer-events-none will-change-opacity">
                
                <Sparkles count={60} speed={0.3} />
                
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center w-full px-6 pointer-events-auto">
                    <img 
                        src="/maisondesreves.webp" 
                        alt="Maison des Rêves" 
                        className="w-32 md:w-full md:max-w-xs mx-auto drop-shadow-2xl"
                    />
                </div>

            </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;