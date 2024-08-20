'use client';

import TargetAudienceAnimation from '@/animations/components/TargetAudience';
import Button from '@/components/button';
import { classNames } from '@/utils/classNames';
import useVisibilityInterval from '@/lib/hooks/useVisibilityInterval';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import styles from './target-audience.module.scss';

const items = [
  'Designers',
  'Founders',
  'Developers',
  'DevOps',
  'Engineers',
  'Data Analysts',
  'Product Managers',
  'Everyone',
  'Designers',
  'Founders',
  'Developers',
  'DevOps',
  'Engineers',
  'Data Analysts',
  'Product Managers',
  'Everyone',
];

interface IProps {
  setShowTicketModal: Dispatch<SetStateAction<boolean>>;
  showTicketModal: boolean;
}

const TargetAudience = (props: IProps) => {
  const isInitialized = useRef(false);
  const [active, setActive] = useState(1);

  const getClassNames = (index: number) => {
    const totalItems = items.length;
    const position = (index - active + totalItems) % totalItems;

    if (position === 0) return styles.one;
    else if (position === 1) return styles.two;
    else if (position === 2) return styles.three;
    else if (position === 3) return styles.four;
    else if (position === 4) return styles.five;
    else if (position === 5) return styles.six;
    else if (position === 6) return styles.seven;
    else if (position === totalItems - 1) return styles.hideTop;
    else return styles.hideBottom;
  };

  useVisibilityInterval(
    () => {
      setActive((active + 1) % items.length);
    },
    2000,
    [active],
  );

  useEffect(() => {
    if (!isInitialized.current) {
      new TargetAudienceAnimation(styles.targetAudience);

      isInitialized.current = true;
    }
  }, []);

  useEffect(() => {
    const bodyElement = document.body;

    if (props.showTicketModal) {
      bodyElement.style.overflow = 'hidden';
    }

    return () => {
      bodyElement.style.overflow = 'scroll';
      bodyElement.style.height = 'auto';
    };
  }, [props.showTicketModal]);

  return (
    <section className={styles.targetAudience}>
      <div className={classNames(styles.container)}>
        <div className={styles.innerContainer}>
          <div className={styles.contentContainer}>
            <h1 data-animate-sentences className={styles.heading}>
              DevFest Lagos 2024{' '}
            </h1>

            <p data-animate-sentences data-delay='0.25' className={styles.content}>
              Attend Devfest Lagos 2024 and explore the amazing opportunity to learn from tech
              leaders, share next-gen ideas, and connect with like-minded peers to shape the future
              of technology.
            </p>

            {/* <Button variant='secondary' className={styles.button} text='Get Early Bird Tickets' /> */}

            <Button
              data-animate-scale
              onClick={() => props.setShowTicketModal(true)}
              data-delay='0.583'
              data-easing='CTA.button'
              variant='secondary'
              className={styles.button}
              text={
                <span data-animate-text data-delay='0.917' data-easing='CTA.text'>
                  Get Early Bird Tickets
                </span>
              }
            />
          </div>

          <div className={styles.audienceContainer}>
            <p data-animate-y-up>DevFest is for Everyone</p>
            <ul>
              {items.map((item, index) => (
                <li key={item + index} className={getClassNames(index)}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TargetAudience;
