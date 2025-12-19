import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function ProductDetail({ product, onBack }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
        gsap.from(".detail-anim", {
            y: 30, opacity: 0, duration: 0.8, stagger: 0.1, ease: "power2.out", delay: 0.2
        });
    }, containerRef);
    return () => ctx.revert();
  }, [product]);

  // Use gallery if available, otherwise fallback
  const displayGallery = product.gallery && product.gallery.length > 0 
    ? product.gallery.slice(0, 4) 
    : [1, 2, 3, 4];

  return (
    <div ref={containerRef} className="w-full min-h-screen flex flex-col items-center pt-24 pb-12 px-6 relative z-30">
        
      {/* HEADER / BACK NAV */}
      <div className="w-full max-w-7xl flex justify-between items-end mb-12 border-b border-[#C5A059]/20 pb-4">
         <button 
            onClick={onBack}
            className="group flex items-center gap-3 text-[10px] tracking-[0.25em] uppercase text-[#9E8043] hover:text-[#C5A059] transition-colors"
         >
            <span className="text-lg font-light leading-none group-hover:-translate-x-1 transition-transform duration-300">&larr;</span>
            <span>Back to Collection</span>
         </button>
         <span className="text-[#C5A059] text-[10px] tracking-[0.4em] uppercase opacity-60 hidden md:block">
            {product.tagline}
         </span>
      </div>

      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
        
        {/* LEFT COLUMN: 2x2 IMAGE GRID */}
        <div className="detail-anim w-full aspect-square grid grid-cols-2 gap-2 md:gap-4">
            {displayGallery.map((imgSrc, i) => {
                const isFirstItemWithHover = i === 0 && product.hoverImage;
                return (
                    <div key={i} className="relative w-full h-full bg-[#FDFBF7]/40 md:backdrop-blur-sm border border-[#C5A059]/20 overflow-hidden group">
                        {/* ^^^ FIXED: added 'md:' prefix to backdrop-blur-sm */}
                        
                        {isFirstItemWithHover ? (
                            <>
                                <img src={imgSrc} alt={`${product.name} base`} className="absolute inset-0 w-full h-full object-cover" />
                                <img src={product.hoverImage} alt={`${product.name} hover`} className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-in-out" />
                            </>
                        ) : (
                            typeof imgSrc === 'string' ? (
                                <img src={imgSrc} alt={`${product.name} detail ${i+1}`} className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110" />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-[#C5A059]/20 text-[10px] uppercase tracking-widest">Image {i + 1}</div>
                            )
                        )}
                        {!isFirstItemWithHover && (
                            <div className="absolute inset-0 bg-[#C5A059]/0 group-hover:bg-[#C5A059]/5 transition-colors duration-500"></div>
                        )}
                    </div>
                );
            })}
        </div>

        {/* RIGHT COLUMN: PRODUCT DETAILS */}
        <div className="flex flex-col justify-center">
            
            <div className="detail-anim mb-2">
                <span className="text-[#9E8043] text-[10px] tracking-[0.3em] uppercase opacity-80">Maison des Rêves</span>
            </div>
            
            <h1 className="detail-anim text-5xl md:text-7xl font-serif text-[#C5A059] mb-6 leading-tight">
                {product.name}
            </h1>

            <p className="detail-anim text-[#292524] font-serif text-xl italic opacity-80 mb-8 leading-relaxed">
                "{product.story}"
            </p>

            <div className="detail-anim w-12 h-px bg-[#C5A059] mb-8 opacity-50"></div>

            {/* DESCRIPTION */}
            <div className="detail-anim mb-10 w-full">
                <p className="text-[#57534e] text-sm leading-7 tracking-wide">
                    {product.description}
                </p>
            </div>

            {/* NOTES GRID */}
            {product.name !== "L'ANTHOLOGIE" ? (
                <div className="detail-anim grid grid-cols-3 gap-4 border-y border-[#C5A059]/20 py-6 mb-8">
                    <div>
                        <span className="block text-[#C5A059] text-[9px] tracking-[0.2em] uppercase mb-1">Top</span>
                        <span className="text-[#44403c] text-xs font-medium leading-relaxed block">
                            {product.notes.top}
                        </span>
                    </div>
                    <div>
                        <span className="block text-[#C5A059] text-[9px] tracking-[0.2em] uppercase mb-1">Heart</span>
                        <span className="text-[#44403c] text-xs font-medium leading-relaxed block">
                            {product.notes.heart}
                        </span>
                    </div>
                    <div>
                        <span className="block text-[#C5A059] text-[9px] tracking-[0.2em] uppercase mb-1">Base</span>
                        <span className="text-[#44403c] text-xs font-medium leading-relaxed block">
                            {product.notes.base}
                        </span>
                    </div>
                </div>
            ) : (
                <div className="detail-anim w-full h-px bg-[#C5A059]/20 mb-8"></div>
            )}

            {/* VOLUME */}
            <div className="detail-anim mb-4">
                 <span className="text-[#57534e] text-[10px] tracking-[0.2em] uppercase opacity-80">
                    {product.volume}
                 </span>
            </div>

            {/* RESPONSIVE ADD TO CART BUTTON */}
            <div className="detail-anim flex items-center gap-8 mt-auto">
                <span className="text-2xl font-serif text-[#292524]">{product.price}</span>
                <button 
                    className="
                        group flex-1 py-4 
                        bg-[#e5e5e5] text-[#78716c]
                        md:bg-[#1c1917] md:text-[#FDFBF7] 
                        md:hover:bg-[#e5e5e5] md:hover:text-[#78716c]
                        uppercase tracking-[0.2em] text-xs shadow-lg 
                        cursor-not-allowed relative overflow-hidden transition-colors duration-300
                    "
                    onClick={(e) => e.preventDefault()}
                >
                    <span className="hidden md:block md:opacity-100 md:group-hover:opacity-0 transition-opacity duration-300 ease-in-out">
                        Purchase
                    </span>
                    
                    <span className="
                        block relative
                        md:absolute md:inset-0 md:flex md:items-center md:justify-center 
                        md:opacity-0 md:group-hover:opacity-100 
                        transition-opacity duration-300 ease-in-out 
                        px-4 text-center leading-tight text-[9px] tracking-widest
                    ">
                        Online purchasing is not available at the moment
                    </span>
                </button>
            </div>

        </div>
      </div>
    </div>
  );
}