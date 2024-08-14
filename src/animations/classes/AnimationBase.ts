import Component from '@/animations/classes/Component';
import GSAPAnimations from '@/animations/classes/Gsap';
import '@/animations/styles/animation.scss';
import { EasingFunction } from '@/animations/types/gsap';
import CustomEase from '@/animations/utils/CustomEase';
import getEasingFunction from '@/animations/utils/getEasing';
import { calculateSentences, formatAndSplitText } from '@/animations/utils/text';

type Easings = Record<string, EasingFunction | Record<string, EasingFunction>>;

type AnimationRegistry = Record<string, (element: HTMLElement) => void>;

type AnimationBaseInputs = {
  sourceElement: string | HTMLElement;
  subElements?: { [key: string]: string | HTMLElement | NodeList };
  easings?: Easings;
};

/**
 * Abstract base class for animations.
 * @extends {Component}
 */

export default abstract class AnimationBase extends Component {
  protected readonly easings: Easings = {
    SCALE: CustomEase.create('scale', 'M0,0 C0.59,0 0,1 1,1'),
    DEFAULT: CustomEase.create('default_custom', 'M0,0 C0.15,0 0,1 1,1'),
  };

  private animationRegistry: AnimationRegistry = {
    text: this.animateText,
    'y-up': this.animateYUp,
    scale: this.animateScale,
    fadein: this.animateFadeIn,
    sentences: this.animateSentences,

    // Add More base animations here
  };

  constructor(
    input: AnimationBaseInputs,
    protected readonly animationLibrary: GSAPAnimations = new GSAPAnimations(),
  ) {
    super({
      element: input.sourceElement,
      elements: {
        animateFadeIn: '[data-animate-fadein]',
        animateScale: '[data-animate-scale]',
        animateYUp: '[data-animate-y-up]',
        animateText: '[data-animate-text]',
        animateSentences: '[data-animate-sentences]',

        // Replays animatation on Content Change
        contentChangeTrigger: '[data-trigger-content-change]',
        ...input.subElements,
      },
    });

    if (input.easings) {
      this.easings = { ...this.easings, ...input.easings };
    }
  }

  registerAnimations(animation: AnimationRegistry) {
    this.animationRegistry = { ...this.animationRegistry, ...animation };
  }

  init() {
    this.setupBaseAnimationStage();

    this.observeElementChange();

    const observer = this.observeElementInView();

    if (this.element) {
      observer.observe(this.element);
    }
  }

  private animate(element: HTMLElement, animation: string) {
    const animationFunction = this.animationRegistry[animation];

    if (animationFunction) {
      animationFunction.call(this, element);
    } else {
      console.error(`No animation function registered for "${animation}"`);
    }
  }

  protected triggerAllAnimations() {
    Object.values(this.elements).forEach((element) => {
      if (!element || Array.isArray(element)) return;

      this.triggerElementAnimation(element as HTMLElement);
    });
  }

  protected triggerElementAnimation(el: HTMLElement) {
    if (el instanceof NodeList) {
      el.forEach((el2) => this.triggerElementAnimation(el2 as HTMLElement));
    }

    const dataset = el.dataset;

    for (const key in dataset) {
      if (key.startsWith('animate') && dataset[key] === 'true') {
        const animationName = this.extractAnimationNameFromDataset(key);

        animationName && this.animate(el, animationName);
      }
    }
  }

  private observeElementInView() {
    const func = (observer: IntersectionObserver) => {
      this.triggerAllAnimations();

      if (this.element) {
        observer.unobserve(this.element);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.some((entry) => {
          if (entry.isIntersecting) {
            const section = entry.target as HTMLElement;

            // Check if 30% of the section's height is less than the screen's height
            const isShorterThanScreen = section.clientHeight * 0.3 <= window.innerHeight;

            if (isShorterThanScreen && entry.intersectionRatio >= 0.3) {
              func(observer);
            } else if (!isShorterThanScreen && entry.intersectionRatio >= 0.1) {
              func(observer);
            }
          }
        });
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: [0.1, 0.3],
      },
    );

    return observer;
  }

  private observeElementChange() {
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        const textNode = mutation.target as Text;

        let parentSection = textNode.parentElement;

        if (!parentSection) return;

        if (parentSection.dataset.triggerContentChange === undefined)
          parentSection = parentSection.closest('[data-trigger-content-change]');

        parentSection && this.triggerElementAnimation(parentSection);
      }
    });

    const mutationObserverConfig = {
      subtree: true,
      characterData: true,
    };

    const contentChangeTrigger = this.elements.contentChangeTrigger;

    if (!contentChangeTrigger) return;

    const elements = this.normalizeToElements(contentChangeTrigger);

    elements.forEach((element) => {
      observer.observe(element, mutationObserverConfig);
    });
  }

  protected setupBaseAnimationStage() {
    const { animateYUp, animateText, animateSentences } = this.elements;

    if (animateYUp) {
      const elements = this.normalizeToElements(animateYUp);

      elements.forEach((element) => {
        const wrapper = document.createElement('span');

        // Get computed styles for margin and padding
        const computedStyle = window.getComputedStyle(element);
        const margin = `${computedStyle.marginTop} ${computedStyle.marginRight} ${computedStyle.marginBottom} ${computedStyle.marginLeft}`;
        const padding = `${computedStyle.paddingTop} ${computedStyle.paddingRight} ${computedStyle.paddingBottom} ${computedStyle.paddingLeft}`;

        // Apply margin and padding to the wrapper
        wrapper.style.display = 'flex';
        wrapper.style.overflow = 'hidden';
        wrapper.style.height = `${element.offsetHeight}px`;
        wrapper.style.margin = margin;
        wrapper.style.padding = padding;

        // Remove margin and padding from the element
        element.style.margin = '0';
        element.style.padding = '0';

        if (element.parentNode) {
          element.parentNode.insertBefore(wrapper, element);
        }

        wrapper.appendChild(element);
      });
    }

    if (animateText) {
      const elements = this.normalizeToElements(animateText);

      elements.forEach((element) => {
        formatAndSplitText(element);

        formatAndSplitText(element);
      });
    }

    if (animateSentences) {
      const elements = this.normalizeToElements(animateSentences);

      elements.forEach((element) => {
        formatAndSplitText(element);

        formatAndSplitText(element);
      });
    }
  }

  // Animate Methods
  private animateFadeIn(element: HTMLElement) {
    const { delay, duration, easing } = this.getAnimationValues(element);

    this.animationLibrary.animateFadeIn({
      delay,
      duration,
      element,
      ease: easing,
    });
  }

  private animateScale(element: HTMLElement) {
    const { delay, duration, easing } = this.getAnimationValues(element);

    this.animationLibrary.animateScale({
      delay,
      duration,
      element,
      ease: easing,
    });
  }

  private animateYUp(element: HTMLElement) {
    const { delay, duration, easing } = this.getAnimationValues(element);

    this.animationLibrary.animateYUp({
      delay,
      duration,
      element,
      ease: easing,
    });
  }

  private animateText(element: HTMLElement) {
    const { delay, duration, easing } = this.getAnimationValues(element);

    const words = element.querySelectorAll('span');
    const stagger = Number(element.dataset.stagger) || 0.084;

    element.style.opacity = '1';

    words.forEach((sentence, index) => {
      this.animationLibrary.animateYUp({
        element: sentence,
        duration,
        ease: easing,
        delay: delay + stagger * index,
      });
    });
  }

  private animateSentences(element: HTMLElement) {
    const { delay, duration, easing } = this.getAnimationValues(element);

    const words = calculateSentences(element.querySelectorAll('span span'));
    const stagger = Number(element.dataset.stagger) || 0.084;

    element.style.opacity = '1';

    words.forEach((sentence, index) => {
      this.animationLibrary.animateYUp({
        element: sentence,
        duration,
        ease: easing,
        delay: delay + stagger * index,
      });
    });
  }

  // Utils
  getAnimationValues(element: HTMLElement) {
    const delay = Number(element.dataset.delay) || 0;

    const duration = Number(element.dataset.duration) || 1;

    const datasetEasing = element.dataset.easing as keyof typeof this.easings;

    let easing: EasingFunction = this.easings?.DEFAULT as EasingFunction;

    if (datasetEasing) {
      easing =
        (getEasingFunction(datasetEasing, this.easings) as EasingFunction) || this.easings?.DEFAULT;
    }

    return {
      delay,
      easing,
      duration,
    };
  }

  normalizeToElements(input: HTMLElement | Element | NodeList | string[]): HTMLElement[] {
    if (input instanceof NodeList) {
      return Array.from(input) as HTMLElement[];
    }

    return [input] as HTMLElement[];
  }

  extractAnimationNameFromDataset(word: string) {
    if (!word.startsWith('animate')) return;

    const animationName = word
      .replace(/([A-Z])/g, '-$1') // Convert camelCase to kebab-case
      .replace(/^animate-/, '') // Remove 'animate-' prefix
      .toLowerCase(); // Convert to lowercase

    return animationName;
  }
}
