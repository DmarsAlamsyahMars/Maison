import { useStore } from '@nanostores/react';
import ScentParticles from './3d/ScentParticles';
import { isZooming, startAtWarp } from '../lib/store';

export default function BackgroundManager() {
  const $isZooming = useStore(isZooming);
  const $startAtWarp = useStore(startAtWarp);

  return (
    <div className="fixed inset-0 z-0 bg-[#0c0a09] pointer-events-none">
      <ScentParticles isZooming={$isZooming} startAtWarp={$startAtWarp} />
    </div>
  );
}