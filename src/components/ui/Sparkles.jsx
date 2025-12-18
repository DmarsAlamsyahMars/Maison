import { useEffect, useRef } from 'react';

export default function Sparkles({ count = 50, speed = 0.5 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    
    // Arrays to hold our two different types of particles
    let bokehParticles = [];
    let starParticles = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    // --- SYSTEM 1: BOKEH (Soft circles moving outward) ---
    const createBokeh = () => {
      bokehParticles = [];
      // We create slightly fewer bokeh than the total count to make room for stars
      const bokehCount = Math.floor(count * 0.7); 
      
      for (let i = 0; i < bokehCount; i++) {
        bokehParticles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 1,      // Soft, slightly larger
          speed: Math.random() * speed + 0.2, 
          opacity: Math.random() * 0.5 + 0.1 // Lower opacity for bokeh effect
        });
      }
    };

    // --- SYSTEM 2: STARS (Sharp, static, twinkling) ---
    const createStars = () => {
      starParticles = [];
      const starCount = Math.floor(count * 0.3); // 30% of particles are stars

      for (let i = 0; i < starCount; i++) {
        starParticles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: 0,                           // Start invisible
          maxSize: Math.random() * 4 + 2,    // Target size (Sharp & bright)
          growthRate: Math.random() * 0.1 + 0.02,
          growing: true,                     // State tracking
          lifeDelay: Math.random() * 100,    // Random start time
          opacity: 0
        });
      }
    };

    const draw = () => {
      // Clear screen
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // 1. UPDATE & DRAW BOKEH (The "Disperse" Effect)
      bokehParticles.forEach((p) => {
        // Calculate angle from center to particle
        const dx = p.x - centerX;
        const dy = p.y - centerY;
        const angle = Math.atan2(dy, dx);

        // Move particle away from center
        p.x += Math.cos(angle) * p.speed;
        p.y += Math.sin(angle) * p.speed;

        // Reset if off screen (spawn random near center to keep flow continuous)
        // We spawn them in a random radius around the center to avoid a "single point" look
        if (
            p.x < -50 || p.x > canvas.width + 50 || 
            p.y < -50 || p.y > canvas.height + 50
        ) {
           const resetAngle = Math.random() * Math.PI * 2;
           const resetDist = Math.random() * 100; // Spawn within 100px of center
           p.x = centerX + Math.cos(resetAngle) * resetDist;
           p.y = centerY + Math.sin(resetAngle) * resetDist;
        }

        // Draw Bokeh Circle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        // Soft white/gold tint
        ctx.fillStyle = `rgba(255, 250, 240, ${p.opacity})`; 
        ctx.fill();
      });


      // 2. UPDATE & DRAW STARS (The "Twinkle" Effect)
      starParticles.forEach((s) => {
        // Handle Life Cycle (Wait -> Grow -> Shrink -> Wait)
        if (s.lifeDelay > 0) {
            s.lifeDelay--;
            return;
        }

        if (s.growing) {
            s.size += s.growthRate;
            s.opacity = Math.min(1, s.size / s.maxSize); // Fade in
            if (s.size >= s.maxSize) s.growing = false;
        } else {
            s.size -= s.growthRate;
            s.opacity = Math.max(0, s.size / s.maxSize); // Fade out
            if (s.size <= 0) {
                s.growing = true;
                s.lifeDelay = Math.random() * 100 + 20; // Wait before twinkling again
                s.x = Math.random() * canvas.width;     // Move to new spot
                s.y = Math.random() * canvas.height;
            }
        }

        // Draw Sharp 4-Point Star
        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.beginPath();
        // Draw diamond shape using curves for a "sharp star" look
        ctx.moveTo(0, -s.size); // Top
        ctx.quadraticCurveTo(0, 0, s.size, 0);   // Right
        ctx.quadraticCurveTo(0, 0, 0, s.size);   // Bottom
        ctx.quadraticCurveTo(0, 0, -s.size, 0);  // Left
        ctx.quadraticCurveTo(0, 0, 0, -s.size);  // Back to Top
        
        ctx.fillStyle = `rgba(255, 255, 255, ${s.opacity})`;
        ctx.shadowBlur = 8; // Glow effect
        ctx.shadowColor = "white";
        ctx.fill();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    createBokeh();
    createStars();
    draw();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [count, speed]);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-10" />;
}