import AnimationBase from '@/animations/classes/AnimationBase';
import { EasingFunction } from '../types/gsap';

export default class FaqAnimation extends AnimationBase {
  constructor(sourceElementClassName: string) {
    super({
      sourceElement: `.${sourceElementClassName}`,
      subElements: {
        animateScrollbar: '[data-animate-scrollbar]',
      },
    });

    this.registerAnimations({
      scrollbar: this.animateScrollbar.bind(this),
    });

    this.init();
  }

  private animateScrollbar(element: HTMLElement): void {
    element.scrollTop = element.scrollHeight;

    // Work on the logic for this ... The scrollbar shows for a milli second then it resets to it's anmation position

    this.animationLibrary.core.to(element, {
      scrollTop: 0,
      duration: 1,
      delay: 0.5,
      ease: this.easings.DEFAULT as EasingFunction,
    });
  }
}
