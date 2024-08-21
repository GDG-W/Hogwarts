import AnimationBase from '@/animations/classes/AnimationBase';
import gsap from 'gsap';
import { ScrollTrigger, ScrollToPlugin } from 'gsap/all';

export default class PurchaseTicketsAnimation extends AnimationBase {
  private currentIndex: number;

  constructor(
    sourceElementClassName: string,
    private readonly styles?: Record<string, string>,
  ) {
    super({
      sourceElement: `.${sourceElementClassName}`,
    });

    gsap.registerPlugin(ScrollToPlugin);
    gsap.registerPlugin(ScrollTrigger);

    this.currentIndex = 0;

    this.init();

    this.customAnimation();
  }

  private customAnimation = () => {
    if (!this.styles) return;

    const backgroundTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: `.${this.styles.purchase}`,
        start: 'top top',
        end: '+=150%',
        scrub: true,
        pin: true,
      },
    });

    backgroundTimeline.to(`.${this.styles.purchase}`, { background: '#F8D8D8' }, '+=0.001');

    const ticketImages: HTMLElement[] = gsap.utils.toArray(`.${this.styles.headImage}`);

    gsap.timeline({
      scrollTrigger: {
        trigger: `.${this.styles.purchase}`,
        start: 'top top',
        end: '+=150%',
        scrub: true,

        onUpdate: (self) => {
          const progress = self.progress;
          const index = progress >= 0.5 ? 1 : 0;

          if (index !== this.currentIndex) {
            this.currentIndex = index;
            this.updateTicketDetails(this.styles!.ticketdetails, index);

            // Animate the images based on the progress
            if (progress >= 0.5) {
              gsap.to(ticketImages, {
                opacity: 0,
                xPercent: -20,
                duration: 0.5,
                ease: 'power3.out',
              });
              gsap.to(ticketImages[index], {
                opacity: 1,
                xPercent: -100,
                duration: 0.5,
                ease: 'power3.out',
              });
              // Move the border to the second sub-ticket
              gsap.to(`.${this.styles!.border}`, {
                xPercent: 100,
                duration: 0.3,
                ease: 'power2.out',
              });
            } else {
              gsap.to(ticketImages, {
                opacity: 0,
                xPercent: -20,
                duration: 0.5,
                ease: 'power3.out',
              });
              gsap.to(ticketImages[0], {
                opacity: 1,
                xPercent: 0,
                duration: 0.5,
                ease: 'power3.out',
              });
              gsap.to(`.${this.styles!.border}`, {
                xPercent: 0,
                duration: 0.3,
                ease: 'power2.out',
              });
            }
          }
        },
      },
    });

    const ticketThumbnailImages: HTMLElement[] = gsap.utils.toArray(
      `.${this.styles.thumbnailImage}`,
    );

    ticketThumbnailImages.forEach((image, index) => {
      image.onclick = () => {
        gsap.to(window, {
          duration: 1,
          ease: 'power3.out',
          scrollTo:
            index === 0
              ? backgroundTimeline.scrollTrigger!.start
              : backgroundTimeline.scrollTrigger!.end,
        });
      };
    });

    this.updateTicketDetails(this.styles.ticketdetails, 0);
  };

  private updateTicketDetails(ticketContainerClassname: string, index: number) {
    const ticketDetails = [
      {
        title: '1 Day Access ONLY | <span> N7,000</span>',
        details: [
          'Get the one-day tickets for you or your friends',
          'Access to workshops, sessions and talks',
          'Meal ticket',
        ],
      },
      {
        title: '2 Days Access | <span> N10,000</span>',
        details: [
          'Get the two-day tickets for you or your friends',
          'Access to workshops, sessions and talks',
          'Meal ticket',
        ],
      },
    ];

    const ticketDetailsContainer = document.querySelector(`.${ticketContainerClassname}`);

    if (!ticketDetailsContainer) return;

    const heading = ticketDetailsContainer.querySelector('h2');
    const listContainer = ticketDetailsContainer.querySelector('ul');

    if (heading && listContainer) {
      // Animate the exit of the current list items and heading
      const currentItems = Array.from(listContainer.querySelectorAll('li'));

      const tl = gsap.timeline({
        onComplete: () => {
          heading.innerHTML = ticketDetails[index].title;
          gsap.fromTo(
            heading,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
            },
          );

          listContainer.innerHTML = '';

          ticketDetails[index].details.forEach((detail, idx) => {
            const li = document.createElement('li');
            li.innerText = detail;
            listContainer.appendChild(li);

            gsap.fromTo(
              li,
              { opacity: 0, y: 20 },
              {
                opacity: 1,
                y: 0,
                duration: 0.5,
                delay: idx * 0.1,
              },
            );
          });
        },
      });

      // Add exit animations to the timeline
      currentItems.forEach((item) => {
        tl.to(item, { opacity: 0, y: -20, duration: 0.3 }, 0);
      });

      tl.to(heading, { opacity: 0, y: -20, duration: 0.3 }, 0);
    }
  }
}
