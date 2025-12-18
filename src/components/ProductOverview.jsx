import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { productList } from '../lib/fragranceData';
import ProductDetail from './ProductDetail';

export default function ProductOverview() {
  
  // LAZY INITIALIZATION: Check URL for ?product=[id] BEFORE first render.
  // This prevents the "flash" of the grid view.
  const [selectedProduct, setSelectedProduct] = useState(() => {
    if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const productId = params.get('product');
        if (productId) {
            return productList.find(p => p.id === productId) || null;
        }
    }
    return null;
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [selectedProduct]);

  return (
    <div className="w-full relative z-20">
      <AnimatePresence mode="wait">
        
        {/* VIEW A: PRODUCT DETAIL */}
        {selectedProduct ? (
            <motion.div
                key="detail"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full"
            >
                <ProductDetail 
                    product={selectedProduct} 
                    onBack={() => setSelectedProduct(null)} 
                />
            </motion.div>
        ) : (
            
        /* VIEW B: PRODUCT GRID */
            <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full min-h-screen lg:h-screen flex flex-col items-center justify-center pt-24 pb-10 lg:overflow-hidden relative"
            >
                {/* Header */}
                <div className="w-full max-w-6xl px-6 flex justify-between items-end mb-12 relative z-10">
                    <a 
                        href="/#discovery-hub"
                        className="group flex items-center gap-3 text-[10px] tracking-[0.25em] uppercase text-[#9E8043] hover:text-[#C5A059] transition-colors cursor-pointer"
                    >
                        <span className="text-lg font-light leading-none group-hover:-translate-x-1 transition-transform duration-300">&larr;</span>
                        <span className="border-b border-transparent group-hover:border-[#C5A059] transition-all duration-300 pb-0.5">Return to Hub</span>
                    </a>
                    <h3 className="hidden md:block text-[#C5A059] text-[10px] tracking-[0.4em] uppercase opacity-60">The Collection</h3>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-6xl px-6 relative z-10">
                    {productList.map((product, index) => (
                        <motion.div
                            key={product.id}
                            onClick={() => setSelectedProduct(product)}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
                            className="group relative aspect-[3/4] cursor-pointer flex flex-col bg-[#FDFBF7] border border-[#C5A059]/30 hover:border-[#C5A059] transition-colors duration-500"
                        >
                            {/* IMAGE SECTION */}
                            <div className="w-full aspect-square overflow-hidden border-b border-[#C5A059]/10 relative">
                                {product.image ? (
                                    <img 
                                        src={product.image} 
                                        alt={product.name}
                                        className="w-full h-full object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-[#FDFBF7] flex items-center justify-center text-[#C5A059]/30 text-[9px] tracking-widest uppercase">
                                        [ No Image ]
                                    </div>
                                )}
                                <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(197,160,89,0.1)] pointer-events-none"></div>
                            </div>

                            {/* TEXT SECTION */}
                            <div className="flex-1 flex flex-col items-center justify-start p-4 pt-14 text-center space-y-3">
                                <span className="text-[#9E8043] text-[9px] tracking-[0.2em] uppercase opacity-60 group-hover:opacity-100 transition-opacity duration-500">
                                    {product.tagline}
                                </span>
                                <span className="text-2xl font-serif text-[#C5A059] group-hover:text-[#8a6e2f] transition-colors duration-300">
                                    {product.name}
                                </span>
                                <div className="h-4 overflow-hidden mt-2">
                                    <span className="block text-[9px] scale-75 origin-top uppercase tracking-[0.3em] text-[#C5A059] border-b border-[#C5A059]/30 pb-0.5 transform translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out">
                                        View Details
                                    </span>
                                </div>
                            </div>

                        </motion.div>
                    ))}
                </div>
            </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}