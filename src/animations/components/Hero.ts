import AnimationBase from '@/animations/classes/AnimationBase';
import CustomEase from '@/animations/utils/CustomEase';

const easings = {
  NAVIGATION: {
    header: CustomEase.create('navigation_header', 'M0,0 C0.56,0 0,1 1,1'),
    button: CustomEase.create('navigation_button', 'M0,0 C0.43,0 0,1 1,1'),
  },

  CTA: {
    text: CustomEase.create('custom', 'M0,0 C0.22,0 0,1 1,1'),
    button: CustomEase.create('custom', 'M0,0 C0.59,0 0,1 1,1'),
    header: CustomEase.create('custom', 'M0,0 C0.15,0 0,1 1,1'),
  },

  CAREERCURSORS: {
    productManagerPosition: CustomEase.create('custom', 'M0,0 C0.15,0 0,1 1,1'),
    productDesignerPosition: CustomEase.create('custom', 'M0,0 C0.26,0 0,1 1,1'),
    softwareEnginnerPosition: CustomEase.create('custom', 'M0,0 C0.23,0 0,1 1,1'),
    dataAnalystPosition: CustomEase.create('custom', 'M0,0 C0.23,0 0,1 1,1'),

    arrowRotation: CustomEase.create('custom', 'M0,0 C0.33,0 0.67,1 1,1'),
  },

  TICKETS: {
    ticketOnePosition: CustomEase.create('custom', 'M0,0 C0,0 0,1 1,1'),
    ticketOneRotation: CustomEase.create('custom', 'M0,0 C0.46,0 0,1 1,1'),

    ticketTwoPosition: CustomEase.create('custom', 'M0,0 C0,0 0,1 1,1'),

    ticketThreePosition: CustomEase.create('custom', 'M0,0 C0,0 0,1 1,1'),
    ticketThreeRotation: CustomEase.create('custom', 'M0,0 C0.41,0 0,1 1,1'),
  },
};

export default class HeroAnimation extends AnimationBase {
  constructor(sourceElementClassName: string) {
    super({
      easings,
      sourceElement: `.${sourceElementClassName}`,
      subElements: {
        animateFadeInLeft: '[data-animate-fadein-left]',
        animateFadeInRight: '[data-animate-fadein-right]',
        animateCareerCursor: '[data-animate-career-cursor]',
        animateTicketOne: '[data-animate-ticket-one]',
        animateTicketMiddle: '[data-animate-ticket-middle]',
        animateTicketTwo: '[data-animate-ticket-two]',
      },
    });

    this.registerAnimations({
      'fadein-left': this.animateFadeInLeft.bind(this),
      'fadein-right': this.animateFadeInRight.bind(this),
      'career-cursor': this.animateCareerCursor.bind(this),
      'ticket-one': this.animateTicketOne.bind(this),
      'ticket-middle': this.animateTicketMiddle.bind(this),
      'ticket-two': this.animateTicketTwo.bind(this),
    });

    this.init();
  }

  private animateFadeInLeft(element: HTMLElement): void {
    const { delay, duration, easing } = this.getAnimationValues(element);

    this.animationLibrary.core.fromTo(
      element,
      { transform: 'translateX(-100vw)' },
      {
        transform: 'translateX(0)',
        opacity: 1,
        duration,
        delay,
        ease: easing,
      },
    );
  }

  private animateFadeInRight(element: HTMLElement): void {
    const { delay, duration, easing } = this.getAnimationValues(element);

    this.animationLibrary.core.fromTo(
      element,
      { transform: 'translateX(100vw)' },
      {
        transform: 'translateX(0)',
        opacity: 1,
        duration,
        delay,
        ease: easing,
      },
    );
  }

  private animateCareerCursor(element: HTMLElement): void {
    const { delay, duration } = this.getAnimationValues(element);

    this.animationLibrary.core.to(element, {
      rotate: '0deg',
      duration,
      delay,
      ease: easings.CAREERCURSORS.arrowRotation,
    });
  }

  private animateTicketOne(element: HTMLElement): void {
    this.animationLibrary.core.to(element, {
      bottom: '-45%',
      duration: 0.6,
      delay: 0.4,
      ease: easings.TICKETS.ticketOnePosition,
    });

    this.animationLibrary.core.to(element, {
      bottom: '-50%',
      duration: 1,
      delay: 1,
    });

    this.animationLibrary.core.to(element, {
      right: '45%',
      rotate: '60deg',
      duration: 1,
      delay: 0.667,
      ease: easings.TICKETS.ticketOneRotation,
    });
  }

  private animateTicketMiddle(element: HTMLElement): void {
    this.animationLibrary.core.to(element, {
      bottom: '-45%',
      duration: 0.82,
      delay: 0.18,
      ease: easings.TICKETS.ticketTwoPosition,
    });
  }

  private animateTicketTwo(element: HTMLElement): void {
    this.animationLibrary.core.to(element, {
      bottom: '-45%',
      duration: 0.7,
      delay: 0.3,
      ease: easings.TICKETS.ticketThreePosition,
    });

    this.animationLibrary.core.to(element, {
      bottom: '-50%',
      duration: 1,
      delay: 1,
    });

    this.animationLibrary.core.to(element, {
      left: '45%',
      rotate: '120deg',
      duration: 1,
      delay: 0.667,
      ease: easings.TICKETS.ticketThreeRotation,
    });
  }
}
