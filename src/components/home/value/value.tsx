'use client';

import { Fragment, useEffect, useRef, useState } from 'react';
import styles from './value.module.scss';
import { default as ValueAnimation } from '@/animations/components/Value';
import useVisibilityInterval from '@/lib/hooks/useVisibilityInterval';

const Value = () => {
  const items = [
    {
      id: 1,
      src: 'https://i.ibb.co/bgVmFMh/DEV-FESTIVAL1-584-fhyj3g.jpg',
      title: 'Amazing Speakers',
      content:
        'Seasoned speakers who are industry experts and thought leaders as they will share their insights on shaping the future of the world at DevFest Lagos 2024.',
    },
    {
      id: 2,
      src: 'https://i.ibb.co/vqWJBM2/activities-1723722207851.png',
      title: 'Recreational Activities',
      content:
        'Recharge and refocus by participating in recreational activities, including games, fun exercises, and many more focused on helping you make new friends and create unforgettable memories.',
    },
    {
      id: 3,
      src: 'https://i.ibb.co/BqRLLXM/networking-1723722207852.png',
      title: 'Networking Opportunities',
      content:
        'DevFest Lagos is more than just an event; it is a platform for networking, growth, and opportunities that can elevate your career to the next level.',
    },
    {
      id: 4,
      src: 'https://i.ibb.co/V9rM5jL/swags-1723722207830.png',
      title: 'Exclusive Freebies',
      content: 'At DevFest Lagos 2024, lots of swags would be up for grabs courtesy our sponsors.',
    },
    {
      id: 5,
      src: 'https://i.ibb.co/MkC6yx4/aniedi-1723722207853.png',
      title: 'Amazing Speakers',
      content:
        'Seasoned speakers who are industry experts and thought leaders as they will share their insights on shaping the future of the world at DevFest Lagos 2024.',
    },
    {
      id: 6,
      src: 'https://i.ibb.co/BqRLLXM/networking-1723722207852.png',
      title: 'Networking Opportunities',
      content:
        'DevFest Lagos is more than just an event; it is a platform for networking, growth, and opportunities that can elevate your career to the next level.',
    },
    {
      id: 7,
      src: 'https://i.ibb.co/fd1Vwsf/meals-1723722207854.png',
      title: 'Complimentary Meals',
      content:
        'You have nothing to worry about! Devfest Lagos has got you covered with tasty and healthy meals, to keep you energised throughout the entire event.',
    },
  ];

  const [active, setActive] = useState(4);
  const moveToSelected = (element: 'next' | 'prev' | number) => {
    let newIndex: number;
    if (element === 'next') {
      newIndex = (active + 1) % items.length;
    } else if (element === 'prev') {
      newIndex = (active - 1 + items.length) % items.length;
    } else {
      newIndex = element;
    }
    setActive(newIndex);
  };

  const getClassNames = (index: number) => {
    if (index === active) {
      return styles.selected;
    } else if (index === (active - 1 + items.length) % items.length) {
      return styles.prev;
    } else if (index === (active + 1) % items.length) {
      return styles.next;
    } else if (index === (active - 2 + items.length) % items.length) {
      return styles.prevLeftSecond;
    } else if (index === (active + 2) % items.length) {
      return styles.nextRightSecond;
    } else if (index < active) {
      return styles.hideLeft;
    } else {
      return styles.hideRight;
    }
  };

  useVisibilityInterval(
    () => {
      moveToSelected('next');
    },
    4000,
    [active],
  );

  const isInitialized = useRef(false);

  useEffect(() => {
    if (!isInitialized.current) {
      new ValueAnimation(styles.values);

      isInitialized.current = true;
    }
  }, []);

  return (
    <section className={styles.values}>
      <div className={styles.container}>
        <div className={styles.topContent}>
          <p className={styles.paragraph}>DevFest 2024</p>
          <h1 className={styles.heading}>What to look forward to?</h1>
        </div>

        <div id={styles.carousel} data-animate-driftin-right>
          {items.map((item, index) => (
            <Fragment key={index}>
              <div
                key={index}
                className={getClassNames(index)}
                onClick={() => moveToSelected(index)}
              >
                <img src={item.src} alt='carousel item' />
              </div>
            </Fragment>
          ))}
        </div>

        <div className={styles.text}>
          {items.map((item, index) => {
            const props = {
              'data-delay': '1.25',
              'data-trigger-animation-change': true,
              'data-animate-sentences': index === active,
              'data-animate-sentences-out': index === (active - 1 + items.length) % items.length,
              style: {
                display:
                  active === index || index === (active - 1 + items.length) % items.length
                    ? 'block'
                    : 'none',
              },
            };
            return (
              <div key={item.id} className={styles.details}>
                <h2 {...props}>{item.title}</h2>
                <p {...props}>{item.content}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Value;
