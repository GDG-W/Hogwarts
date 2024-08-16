import { EasingFunction } from '@/animations/types/gsap';
import gsap from 'gsap';

type GSAPAnimationBaseOptions = {
  element: gsap.TweenTarget;
  delay: number;
  duration: number;
  ease?: EasingFunction;
};

export default class GSAPAnimations {
  core: typeof gsap = gsap;

  animateFadeIn(options: GSAPAnimationBaseOptions) {
    const { element, duration, delay, ease } = options;

    gsap.fromTo(
      element,
      { opacity: 0 },
      {
        opacity: 1,
        duration,
        delay,
        ease,
      },
    );
  }

  animateScale(options: GSAPAnimationBaseOptions) {
    const { element, duration, delay, ease } = options;

    gsap.fromTo(
      element,
      { scale: 0 },
      {
        scale: 1,
        opacity: 1,
        duration,
        delay,
        ease,
      },
    );
  }

  animateYUp(options: GSAPAnimationBaseOptions) {
    const { element, duration, delay, ease } = options;

    gsap.fromTo(
      element,
      { yPercent: 100 },
      {
        yPercent: 0,
        opacity: 1,
        duration,
        ease,
        delay,
      },
    );
  }
}
