import AnimationBase from '@/animations/classes/AnimationBase';
import { calculateSentences } from '../utils/text';
import gsap from 'gsap';

export default class ValueAnimation extends AnimationBase {
  constructor(sourceElementClassName: string) {
    super({
      sourceElement: `.${sourceElementClassName}`,
      subElements: {
        animateSentencesOut: '[data-animate-sentences-out]',
        animationChangeTrigger: '[data-trigger-animation-change]',
      },
    });

    this.init();
    this.observeAnimationChange();

    this.registerAnimations({
      'sentences-out': this.animateSentencesOut,
    });
  }

  private observeAnimationChange() {
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        const textNode = mutation.target as HTMLElement;

        textNode && this.triggerElementAnimation(textNode);
      }
    });

    const mutationObserverConfig = {
      attributes: true,
      attributeFilter: ['data-animate-sentences', 'data-animate-sentences-out'],
    };

    const animationChangeTrigger = this.elements.animationChangeTrigger;

    if (!animationChangeTrigger) return;

    const elements = this.normalizeToElements(animationChangeTrigger);

    elements.forEach((element) => {
      observer.observe(element, mutationObserverConfig);
    });
  }

  private animateSentencesOut(element: HTMLElement) {
    const { delay, duration, easing } = this.getAnimationValues(element);

    const words = calculateSentences(element.querySelectorAll('span span'));
    const stagger = Number(element.dataset.stagger) || 0.084;

    element.style.opacity = '1';

    words.forEach((sentence, index) => {
      gsap.fromTo(
        sentence,
        { yPercent: 0 },
        {
          yPercent: -100,
          opacity: 0,
          duration,
          ease: easing,
          delay: delay - 0.75 + stagger * index,
        },
      );
    });
  }
}
