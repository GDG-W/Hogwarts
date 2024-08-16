import AnimationBase from '@/animations/classes/AnimationBase';

export default class FooterAnimation extends AnimationBase {
  constructor(sourceElementClassName: string) {
    super({
      sourceElement: `.${sourceElementClassName}`,
      subElements: {},
    });

    this.init();
  }
}
