import AnimationBase from '@/animations/classes/AnimationBase';

export default class TargetAudienceAnimation extends AnimationBase {
  constructor(sourceElementClassName: string) {
    super({
      sourceElement: `.${sourceElementClassName}`,
      subElements: {},
    });

    this.init();
  }
}
