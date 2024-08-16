import GSAP from 'gsap';

export function lerp(p1: number, p2: number, t: number): number {
  return p1 + (p2 - p1) * t;
}

export function easeInOut(t: number): number {
  return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
}

export function interpolate(start: number, end: number, value: number): number {
  return start * (1.0 - value) + end * value;
}

export function clamp(min: number, max: number, number: number): number {
  return Math.max(min, Math.min(number, max));
}

export function random(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export function delay(ms: number): Promise<void> {
  return new Promise((res) => GSAP.delayedCall(ms / 1000, res));
}

export const getRandomItem = (length: number): number => Math.floor(Math.random() * length);
