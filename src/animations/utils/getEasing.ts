import { EasingFunction } from '../types/gsap';

type EasingTree = {
  [key: string]: EasingFunction | EasingTree;
};

const getEasingFunction = (path: string, easings: EasingTree): EasingFunction | undefined => {
  const keys = path?.split('.');

  let current: EasingTree | EasingFunction = easings;

  for (const key of keys) {
    if (typeof current === 'object' && current !== null && key in current) {
      current = current[key] as EasingTree | EasingFunction;
    } else {
      return undefined;
    }
  }

  return typeof current === 'function' ? (current as EasingFunction) : undefined;
};

export default getEasingFunction;
