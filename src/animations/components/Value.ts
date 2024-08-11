import AnimationBase from '@/animations/classes/AnimationBase';

export default class ValueAnimation extends AnimationBase {
  constructor(sourceElementClassName: string) {
    super({
      sourceElement: `.${sourceElementClassName}`,
      subElements: {
        styleChangeTrigger: '[data-trigger-style-change]',
      },
    });

    this.init();
    this.observeStyleChange();
  }

  private observeStyleChange() {
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        const textNode = mutation.target as HTMLElement;

        textNode && this.triggerElementAnimation(textNode);
      }
    });

    const mutationObserverConfig = {
      attributes: true,
      attributeFilter: ['style'],
    };

    const styleChangeTrigger = this.elements.styleChangeTrigger;

    if (!styleChangeTrigger) return;

    const elements = this.normalizeToElements(styleChangeTrigger);

    elements.forEach((element) => {
      observer.observe(element, mutationObserverConfig);
    });
  }
}
