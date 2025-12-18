import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { navigate } from 'astro:transitions/client';

gsap.registerPlugin(ScrollTrigger);

export default function FragranceShowcase({ data, onRetake, onBack }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
        gsap.from(".hero-text", {
            y: 50, opacity: 0, duration: 1.5, stagger: 0.2, ease: "power3.out", delay: 0.2
        });

        const tl = gsap.timeline({ delay: 0.2 });
        tl.fromTo(".hero-aura", { scale: 0, opacity: 0 }, { scale: 1.5, opacity: 0.6, duration: 2, ease: "power2.out" }, 0);
        tl.fromTo(".hero-bottle", { y: 100, opacity: 0, scale: 0.9, filter: "blur(10px)" }, { y: 0, opacity: 1, scale: 1, filter: "blur(0px)", duration: 2, ease: "power2.out" }, 0.2);

        gsap.to(".hero-bottle", { y: -15, duration: 3, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 2.2 });
        gsap.to(".hero-aura", { rotation: 360, duration: 20, ease: "none", repeat: -1 });

        const sections = gsap.utils.toArray('.magazine-section');
        sections.forEach((section) => {
            gsap.from(section.children, {
                y: 50, opacity: 0, duration: 1.2, stagger: 0.2,
                scrollTrigger: {
                    trigger: section,
                    start: "top 80%",
                    toggleActions: "play none none reverse"
                }
            });
        });

    }, containerRef);
    return () => ctx.revert();
  }, [data]);

  const ImagePlaceholder = ({ label }) => (
    <div className="w-full h-full border border-[#C5A059]/30 bg-[#C5A059]/5 backdrop-blur-sm flex items-center justify-center relative overflow-hidden group">
        <div className="absolute inset-3 border border-[#C5A059]/10 group-hover:inset-5 transition-all duration-700"></div>
        <span className="text-[#C5A059] text-[10px] tracking-[0.3em] uppercase opacity-50 group-hover:opacity-100 transition-opacity">
            [{label}]
        </span>
        <div className="absolute inset-0 bg-gradient-to-tr from-[#C5A059]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
    </div>
  );

  return (
    <div ref={containerRef} className="w-full min-h-screen text-[#FDFBF7] pb-32 relative z-50">
      
      <div className="absolute top-10 left-6 z-50">
          <button onClick={onBack} className="group flex items-center gap-4 text-[10px] font-medium tracking-[0.4em] uppercase text-[#9E8043] hover:text-[#FCF6BA] transition-colors duration-500">
              <span className="text-lg font-light group-hover:-translate-x-2 transition-transform duration-500">←</span>
              Maison
          </button>
      </div>

      {/* --- 1. HERO SECTION --- */}
      <div className="w-full min-h-screen md:h-screen flex flex-col items-center justify-center px-6 pt-20 md:pt-0">
         <div className="hero-text mb-4 md:mb-1 text-center relative z-20">
            <span className="block text-[#C5A059] text-[9px] tracking-[0.4em] uppercase mb-4 opacity-80">
                Your Olfactory Signature
            </span>
            <div className="w-px h-8 bg-gradient-to-b from-[#C5A059] to-transparent mx-auto opacity-50"></div>
         </div>

         <div className="relative w-80 h-[500px] md:w-[300px] md:h-[400px] mb-8 md:mb-0 md:-mt-6 flex items-center justify-center perspective-1000">
             {/* --- CHANGE: Reduced scale on mobile (scale-110) to prevent edge cutting --- */}
             <div className="hero-aura absolute inset-0 bg-gradient-radial from-[#C5A059]/40 via-transparent to-transparent opacity-0 blur-3xl scale-110 md:scale-150 z-0"></div>
             
             <div className="hero-bottle relative z-10 w-full h-full flex items-center justify-center">
                 {data.resultImage ? (
                     <img src={data.resultImage} alt={data.name} className="w-full h-full object-contain drop-shadow-[0_0_40px_rgba(197,160,89,0.4)]" />
                 ) : (
                     <ImagePlaceholder label="Campaign Portrait" />
                 )}
             </div>
         </div>

         <div className="hero-text text-center max-w-xl relative z-20">
            <h1 className="text-5xl md:text-6xl font-serif text-[#C5A059] mb-6 md:mb-3 drop-shadow-[0_0_30px_rgba(197,160,89,0.4)]">
                {data.name}
            </h1>
            <p className="text-[#C5A059] text-xs md:text-sm tracking-[0.15em] opacity-80 px-4 leading-relaxed">
                {data.description}
            </p>
         </div>
      </div>

      <div className="w-full max-w-5xl mx-auto px-8 flex flex-col gap-32 mt-12">
         
         <div className="magazine-section grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1 text-center md:text-left">
                <span className="block text-[#C5A059] text-[9px] tracking-[0.3em] uppercase mb-4">The Narrative</span>
                <h2 className="text-2xl md:text-3xl font-serif text-[#FCF6BA] mb-6 italic leading-relaxed">"{data.story}"</h2>
                <div className="w-12 h-px bg-[#C5A059] opacity-50 mx-auto md:mx-0"></div>
            </div>
            
            <div className="order-1 md:order-2 w-full aspect-video relative overflow-hidden border border-[#C5A059]/20 shadow-2xl">
                {data.video ? (
                    <video 
                        src={data.video}
                        autoPlay 
                        loop 
                        muted 
                        playsInline 
                        className="w-full h-full object-cover pointer-events-none" 
                    />
                ) : (
                    <ImagePlaceholder label="Moodboard Video" />
                )}
                <div className="absolute inset-0 bg-[#C5A059]/5 pointer-events-none mix-blend-overlay"></div>
            </div>
         </div>

         <div className="magazine-section grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="h-[300px] md:h-[350px] w-full">
                 {data.noteImage ? (
                    <div className="w-full h-full overflow-hidden relative border border-[#C5A059]/20">
                        <img 
                            src={data.noteImage} 
                            alt={`${data.name} ingredients`} 
                            className="w-full h-full object-cover"
                        />
                    </div>
                 ) : (
                    <ImagePlaceholder label="Ingredients" />
                 )}
            </div>
            
            <div className="flex flex-col gap-8 pl-0 md:pl-8 text-center md:text-left">
                 {Object.entries(data.notes).map(([key, value]) => (
                    <div key={key} className="group">
                        <span className="block text-[#C5A059] text-[9px] tracking-[0.2em] uppercase mb-1 group-hover:text-[#FCF6BA] transition-colors">{key}</span>
                        <p className="text-xl md:text-2xl font-serif text-[#FDFBF7] opacity-90 group-hover:translate-x-2 transition-transform duration-500">{value}</p>
                    </div>
                 ))}
            </div>
         </div>

      </div>

      <div className="w-full flex flex-col items-center justify-center mt-32 gap-6">
            <button 
                onClick={() => navigate(`/collection?product=${data.id}`)}
                className="group relative px-12 py-4 bg-transparent overflow-hidden cursor-pointer"
            >
                <span className="relative z-10 text-[10px] tracking-[0.3em] uppercase text-[#FCF6BA] font-bold group-hover:text-[#0c0a09] transition-colors duration-500">
                    Acquire {data.name}
                </span>
                <div className="absolute inset-0 border border-[#C5A059] opacity-50 group-hover:scale-95 transition-transform duration-500"></div>
                <div className="absolute inset-0 bg-[#C5A059] transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-out"></div>
            </button>

            <button onClick={onRetake} className="text-[9px] tracking-[0.3em] uppercase text-[#C5A059]/60 hover:text-[#C5A059] transition-colors border-b border-transparent hover:border-[#C5A059] pb-1">
                Restart Analysis
            </button>
      </div>

    </div>
  );
}