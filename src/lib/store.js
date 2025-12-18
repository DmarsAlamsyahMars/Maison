// src/lib/store.js
import { atom } from 'nanostores';

// Controls if the particles are currently accelerating (The "Warp")
export const isZooming = atom(false);

// Controls if the particles should start at high speed (for the Quiz page)
export const startAtWarp = atom(false);