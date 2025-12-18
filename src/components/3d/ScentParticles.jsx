import { useMemo, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { gsap } from 'gsap';

// 1. VERTEX SHADER
const vertexShader = `
  uniform float uTime;
  // CHANGED: We now use uOffset for movement instead of uTime * uSpeed
  uniform float uOffset; 
  uniform float uPixelRatio;
  
  attribute float aScale;
  attribute vec3 aRandomness;
  
  varying vec3 vColor;
  varying float vAlpha;
  varying float vScale;
  
  void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    
    // MOVEMENT FIX: Use the accumulated offset
    // This ensures smooth transitions even when speed changes drastically
    float moveZ = mod(modelPosition.z + uOffset + aRandomness.z * 10.0, 20.0) - 10.0;
    modelPosition.z = moveZ;
    
    // VORTEX (Spin logic)
    float angle = atan(modelPosition.x, modelPosition.y);
    float distanceToCenter = length(modelPosition.xy);
    // Spin faster when moving fast
    float angleOffset = (1.0 / distanceToCenter) * uOffset * 0.1; 
    angle += angleOffset;
    
    modelPosition.x = cos(angle) * distanceToCenter;
    modelPosition.y = sin(angle) * distanceToCenter;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    
    gl_Position = projectedPosition;
    
    // SIZE 
    gl_PointSize = aScale * uPixelRatio * 50.0;
    gl_PointSize *= (1.0 / max(-viewPosition.z, 0.1)); 
    
    // FADE
    float alpha = smoothstep(-10.0, -6.0, modelPosition.z) * (1.0 - smoothstep(-1.0, 1.0, modelPosition.z));
    
    vec3 mistColor = vec3(0.95, 0.90, 0.85); 
    vec3 dustColor = vec3(1.0, 0.8, 0.4); 
    
    vColor = mix(dustColor, mistColor, aScale); 
    vAlpha = alpha;
    vScale = aScale;
  }
`;

// 2. FRAGMENT SHADER (Unchanged)
const fragmentShader = `
  varying vec3 vColor;
  varying float vAlpha;
  varying float vScale;
  
  void main() {
    float dist = distance(gl_PointCoord, vec2(0.5));
    float strength = 1.0;
    
    if (vScale < 0.3) {
        strength = 1.0 - step(0.5, dist); 
    } else {
        strength = 1.0 - (dist * 2.0);
        strength = pow(strength, 2.0); 
    }
    
    vec3 finalColor = vColor;
    float finalAlpha = strength * vAlpha;
    
    if (vScale < 0.3) finalAlpha *= 0.9;
    else finalAlpha *= 0.2;
    
    gl_FragColor = vec4(finalColor, finalAlpha);
    if (gl_FragColor.a < 0.01) discard;
  }
`;

const Particles = ({ isZooming }) => {
  const points = useRef();
  const { camera } = useThree();
  const count = 3000; 
  
  const { positions, scales, randomness } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const randomness = new Float32Array(count * 3);
    
    for(let i = 0; i < count; i++) {
      const i3 = i * 3;
      const radius = Math.random() * 8 + 1.5; 
      const spinAngle = Math.random() * Math.PI * 2;
      
      positions[i3] = Math.cos(spinAngle) * radius;     
      positions[i3 + 1] = Math.sin(spinAngle) * radius; 
      positions[i3 + 2] = (Math.random() - 0.5) * 20;   
      
      if (Math.random() < 0.7) scales[i] = Math.random() * 0.15 + 0.05; 
      else scales[i] = Math.random() * 0.5 + 0.5;   
      
      randomness[i3] = Math.random();
      randomness[i3+1] = Math.random();
      randomness[i3+2] = Math.random();
    }
    return { positions, scales, randomness };
  }, []);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    // NEW: Offset tracks total distance traveled
    uOffset: { value: 0 }, 
    // uSpeed controls RATE of change, not absolute position
    uSpeed: { value: 0.1 }, 
    uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) }
  }), []);

  // ANIMATION LOGIC (Smoother Curve)
  useEffect(() => {
    gsap.killTweensOf(uniforms.uSpeed);
    gsap.killTweensOf(camera);

    if (isZooming) {
        // WARP SPEED
        gsap.to(uniforms.uSpeed, { value: 6.0, duration: 2.0, ease: "power2.inOut" });
        gsap.to(camera, { fov: 110, duration: 2.0, ease: "power2.inOut", onUpdate: () => camera.updateProjectionMatrix() });
    } else {
        // SLOW DOWN
        // We use a longer duration to make the "landing" feel softer
        gsap.to(uniforms.uSpeed, { value: 0.2, duration: 3.0, ease: "power2.out" });
        gsap.to(camera, { fov: 75, duration: 3.0, ease: "power2.out", onUpdate: () => camera.updateProjectionMatrix() });
    }
  }, [isZooming, camera, uniforms]);

  // RENDER LOOP
  useFrame((state, delta) => {
    // PHYSICS FIX:
    // Instead of time * speed, we add (speed * delta) to the offset.
    // This ensures movement is continuous and never jumps backwards.
    uniforms.uOffset.value += uniforms.uSpeed.value * delta;
    
    uniforms.uTime.value = state.clock.getElapsedTime();
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-aScale" count={scales.length} array={scales} itemSize={1} />
        <bufferAttribute attach="attributes-aRandomness" count={randomness.length / 3} array={randomness} itemSize={3} />
      </bufferGeometry>
      <shaderMaterial
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexColors={false}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent={true}
      />
    </points>
  );
};

export default function ScentParticles({ isZooming }) {
  return (
    <div className="absolute inset-0 z-0 bg-[#0c0a09]"> 
      <Canvas camera={{ position: [0, 0, 4], fov: 75 }} dpr={[1, 2]}> 
        <Particles isZooming={isZooming} />
      </Canvas>
    </div>
  );
}