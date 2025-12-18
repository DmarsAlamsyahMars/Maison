import { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { fragranceData } from '../lib/fragranceData';
import FragranceShowcase from './FragranceShowcase';

const steps = [
  { 
    id: 'projection', title: 'Scent Projection', subtitle: 'How noticeable should your presence be?', 
    min: 1, max: 3, defaultValue: 2, 
    leftLabel: 'Intimate', rightLabel: 'Bold' 
  },
  { 
    id: 'occasion', title: 'Ideal Occasion', subtitle: 'Where does your story take place?', 
    min: 1, max: 3, defaultValue: 2, 
    leftLabel: 'Daylight', rightLabel: 'Midnight' 
  },
  { 
    id: 'character', title: 'Dominant Note', subtitle: 'The soul of the fragrance', 
    min: 1, max: 3, defaultValue: 2, 
    leftLabel: 'Clean', rightLabel: 'Spicy' 
  }
];

// 1. Beveled Gold Circle Handle
const BeveledHandle = () => (
  <div className="w-6 h-6 rounded-full bg-[#C5A059] relative shadow-[0_4px_10px_rgba(0,0,0,0.3)]">
    <div className="absolute inset-0 rounded-full shadow-[inset_1px_1px_3px_rgba(255,255,255,0.7)]"></div>
    <div className="absolute inset-0 rounded-full shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.2)]"></div>
  </div>
);

export default function MiniQuiz({ onBack }) {
  const [step, setStep] = useState(0); 
  const [answers, setAnswers] = useState({ projection: 2, occasion: 2, character: 2 });
  const [recommendation, setRecommendation] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  
  const [isDragging, setIsDragging] = useState(false);

  const wrapperRef = useRef(null);
  const panelsRef = useRef([]);
  panelsRef.current = [];

  // Styles
  const bevelTextStyle = {
    color: '#FCF6BA', 
    textShadow: '0 0 20px rgba(197,160,89,0.3), 0 0 5px rgba(252,246,186,0.5)'
  };
  
  const labelBaseClass = "transition-all duration-500 cursor-pointer uppercase tracking-[0.25em] text-[10px] origin-center";
  
  // Active State: Scale + Glow (No Bold to prevent jitter)
  const labelActiveClass = "text-[#FCF6BA] drop-shadow-[0_0_15px_rgba(252,246,186,0.9)] scale-125";
  const labelInactiveClass = "text-[#C5A059]/40 hover:text-[#C5A059] hover:drop-shadow-[0_0_5px_rgba(197,160,89,0.5)]";

  const calculateResult = () => {
    const total = Math.round(answers.projection) + Math.round(answers.occasion) + Math.round(answers.character);
    if (total <= 4) return "Perfume A"; 
    if (total <= 7) return "Perfume B"; 
    return "Perfume C"; 
  };

  const retakeQuiz = () => {
    setStep(0);
    setAnswers({ projection: 2, occasion: 2, character: 2 });
    setRecommendation(null);
    setIsCalculating(false);
  };

  useLayoutEffect(() => {
    if (step === 3 || isCalculating) return;

    const ctx = gsap.context(() => {
        const currentPanel = panelsRef.current[step];
        if (currentPanel) {
            // FIX: Explicitly reset 'filter' and 'y' on the parent container.
            gsap.set(currentPanel, { display: 'flex', autoAlpha: 1, y: 0, filter: "blur(0px)" });
            
            const childElements = currentPanel.querySelectorAll('.animate-float');
            gsap.fromTo(childElements, 
                { y: 30, opacity: 0, filter: "blur(10px)" }, 
                { y: 0, opacity: 1, filter: "blur(0px)", duration: 1.2, stagger: 0.15, ease: 'power3.out' }
            );
        }
        panelsRef.current.forEach((panel, index) => {
            if (index !== step && panel) {
                gsap.set(panel, { display: 'none', autoAlpha: 0 });
            }
        });
    }, wrapperRef);
    return () => ctx.revert();
  }, [step, isCalculating]);

  // HANDLE SLIDER LOGIC
  const handleSliderChange = (id, value) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
  };

  const handleDragStart = () => setIsDragging(true);

  const handleDragEnd = (id) => {
    setIsDragging(false);
    const snappedValue = Math.round(answers[id]);
    setAnswers(prev => ({ ...prev, [id]: snappedValue }));
  };

  const goNext = () => {
    const current = panelsRef.current[step];
    if (current) {
        gsap.to(current, {
            autoAlpha: 0, y: -40, filter: "blur(10px)", duration: 0.6, ease: 'power2.in',
            onComplete: () => {
                const nextStep = step + 1;
                if (nextStep === 3) {
                    setIsCalculating(true);
                    const result = calculateResult();
                    setTimeout(() => {
                        setRecommendation(result);
                        setIsCalculating(false);
                        setStep(3);
                    }, 2500);
                } else {
                    setStep(nextStep);
                }
            }
        });
    }
  };

  const goBack = () => {
    const current = panelsRef.current[step];
    if (current) {
        gsap.to(current, {
            autoAlpha: 0, y: 40, filter: "blur(10px)", duration: 0.6, ease: 'power2.in',
            onComplete: () => setStep((s) => Math.max(s - 1, 0))
        });
    }
  };

  const addToRefs = (el, index) => {
    if (el && !panelsRef.current.includes(el)) panelsRef.current[index] = el;
  };

  if (step === 3 && recommendation && !isCalculating) {
    const data = fragranceData[recommendation];
    // CHANGE: Passed 'onBack' down to the showcase
    return <FragranceShowcase data={data} onRetake={retakeQuiz} onBack={onBack} />;
  }

  return (
    // FIX APPLIED HERE: 
    // Changed 'w-full' to 'w-screen' to force centering relative to the Viewport (Glass), 
    // ignoring the scrollbar width. This stops the text from jumping relative to the 
    // absolute positioned Back Button.
    <div className="w-screen h-screen flex flex-col items-center justify-center relative overflow-hidden">
        
        {/* LOADING SCREEN */}
        {isCalculating && (
            <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-transparent backdrop-blur-sm">
                <div className="flex flex-col items-center animate-pulse">
                    <div className="w-20 h-20 border-t-2 border-b-2 border-[#FCF6BA] rounded-full animate-spin mb-8 shadow-[0_0_30px_rgba(252,246,186,0.2)]"></div>
                </div>
            </div>
        )}

        {/* BACK BUTTON */}
        {!isCalculating && step < 3 && (
            <div className="absolute top-10 left-6 z-20">
                <button 
                    onClick={onBack} 
                    className="group flex items-center gap-4 text-[10px] font-medium tracking-[0.4em] uppercase text-[#9E8043] hover:text-[#FCF6BA] transition-colors duration-500"
                >
                    <span className="text-lg font-light group-hover:-translate-x-2 transition-transform duration-500">←</span>
                    Maison des Rêves
                </button>
            </div>
        )}

        {/* QUESTIONS */}
        {!isCalculating && (
            <div ref={wrapperRef} className="relative w-full max-w-5xl min-h-[600px] flex items-center justify-center pointer-events-none">
                {steps.map((q, i) => {
                    const currentValue = answers[q.id] || 2;
                    
                    const percent = ((currentValue - 1) / 2) * 100;
                    const transitionStyle = isDragging 
                        ? 'none' 
                        : 'all 0.5s cubic-bezier(0.22, 1, 0.36, 1)';

                    return (
                        <div 
                            key={q.id} 
                            ref={(el) => addToRefs(el, i)} 
                            className={`absolute inset-0 flex-col items-center justify-center text-center pointer-events-auto ${i === step ? 'flex' : 'hidden'}`}
                        >
                            <div className="animate-float mb-8">
                                <span className="block text-xl font-serif text-[#C5A059]/40 tracking-[0.2em]">0{i + 1}</span>
                            </div>

                            <h3 className="animate-float text-4xl md:text-6xl font-serif font-medium mb-6 leading-tight px-4 tracking-wide" style={bevelTextStyle}>
                                {q.title}
                            </h3>
                            <p className="animate-float text-[#C5A059] text-xs md:text-sm font-light tracking-[0.2em] uppercase mb-24 opacity-80">
                                {q.subtitle}
                            </p>
                            
                            {/* --- SLIDER CONTAINER --- */}
                            <div className="animate-float w-full max-w-xl px-8 relative">
                                <div className="relative w-full h-16 flex items-center justify-center">
                                    
                                    {/* 1. Base Track */}
                                    <div className="absolute w-full h-px bg-[#C5A059]/20"></div>

                                    {/* 2. Active Beam (Light) */}
                                    <div 
                                        className="absolute h-[2px] shadow-[0_0_15px_rgba(252,246,186,0.6)]"
                                        style={{ 
                                            width: `${percent}%`, 
                                            left: 0,
                                            background: 'linear-gradient(90deg, transparent, #FCF6BA)', 
                                            transition: transitionStyle 
                                        }}
                                    ></div>

                                    {/* 3. Beveled Circle Handle */}
                                    <div 
                                        className="absolute z-20 flex items-center justify-center" 
                                        style={{ 
                                            left: `${percent}%`, 
                                            transform: 'translateX(-50%)',
                                            transition: transitionStyle 
                                        }}
                                    >
                                        <BeveledHandle />
                                    </div>

                                    {/* 4. Invisible Range Input */}
                                    <input 
                                        type="range" 
                                        min={q.min} max={q.max} step="0.01" 
                                        value={currentValue} 
                                        onPointerDown={handleDragStart} 
                                        onPointerUp={() => handleDragEnd(q.id)} 
                                        onChange={(e) => handleSliderChange(q.id, Number(e.target.value))} 
                                        className="absolute w-full h-full opacity-0 cursor-pointer z-30" 
                                    />

                                    {/* 5. Markers */}
                                    {[0, 50, 100].map((pos) => (
                                        <div 
                                            key={pos} 
                                            className="absolute w-1 h-1 bg-[#C5A059] rounded-full" 
                                            style={{ left: `${pos}%`, transform: 'translateX(-50%)' }} 
                                        />
                                    ))}
                                </div>

                                {/* Labels */}
                                <div className="flex justify-between mt-6">
                                    <span 
                                        className={`${labelBaseClass} ${Math.round(currentValue) === 1 ? labelActiveClass : labelInactiveClass}`} 
                                        onClick={() => handleSliderChange(q.id, 1)}
                                    >
                                        {q.leftLabel}
                                    </span>
                                    <span 
                                        className={`${labelBaseClass} ${Math.round(currentValue) === 2 ? labelActiveClass : labelInactiveClass}`} 
                                        onClick={() => handleSliderChange(q.id, 2)}
                                    >
                                        Balanced
                                    </span>
                                    <span 
                                        className={`${labelBaseClass} ${Math.round(currentValue) === 3 ? labelActiveClass : labelInactiveClass}`} 
                                        onClick={() => handleSliderChange(q.id, 3)}
                                    >
                                        {q.rightLabel}
                                    </span>
                                </div>
                            </div>

                            {/* Nav Buttons */}
                            <div className="flex items-center justify-between mt-24 w-full max-w-2xl px-8">
                                <div className="w-20">
                                    {step > 0 && (
                                        <button 
                                            onClick={goBack} 
                                            className="text-[#C5A059]/50 hover:text-[#FCF6BA] hover:drop-shadow-[0_0_10px_rgba(252,246,186,0.6)] transition-all duration-300 text-sm tracking-widest uppercase"
                                        >
                                            Previous
                                        </button>
                                    )}
                                </div>
                                <div className="w-20 flex justify-end">
                                    <button 
                                        onClick={goNext} 
                                        className="text-[#FCF6BA] drop-shadow-[0_0_10px_rgba(252,246,186,0.4)] hover:scale-110 transition-all duration-300 text-sm tracking-widest uppercase border-b border-[#FCF6BA]/30 pb-1"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>

                        </div>
                    );
                })}
            </div>
        )}
    </div>
  );
}