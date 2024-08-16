'use client';
import FaqAnimation from '@/animations/components/FAQAnimation';
import Accordion from '@/components/accordion';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import styles from './faq.module.scss';
import data from './mock-faq.json';

// TODO: Conditionally display green circles with tab list items

const FAQs = () => {
  const [activeTab, setActiveTab] = useState(data[0].category);
  const activeCategory = data.find((item) => item.category === activeTab);

  const isInitialized = useRef(false);

  useEffect(() => {
    if (!isInitialized.current) {
      new FaqAnimation(styles.faq);

      isInitialized.current = true;
    }
  }, []);

  return (
    <section className={styles.faq}>
      <div className={styles.container}>
        <p data-animate-y-up data-delay='0.18' className={styles.qa}>
          Quick Answers
        </p>
        <h1 data-animate-y-up data-delay='0.12' className={styles.heading1}>
          DevFest Lagos Ticket FAQs
        </h1>
        <h2 data-animate-y-up data-delay='0.167' className={styles.heading2}>
          Your questions answered
        </h2>

        <div className={styles.tabs}>
          <nav className={styles.nav}>
            <div className={styles.tablist} role='tablist'>
              {data.map((item, index) => (
                <button
                  key={index}
                  className={`${styles.tab} ${activeTab === item.category ? styles.active : ''}`}
                  onClick={() => setActiveTab(item.category)}
                  role='tab'
                  id={`tab-${index}`}
                  type='button'
                >
                  <Image
                    className={styles.listDecorator}
                    src='/green-faq-circle.svg'
                    width={20}
                    height={20}
                    alt='list decorator'
                    data-animate-scale
                    data-easing='SCALE'
                    data-delay={index / 3 + 0.1}
                  />
                  <span data-animate-y-up data-delay={index / 3 + 0.1}>
                    {item.category}
                  </span>
                </button>
              ))}
            </div>
          </nav>
          <div>
            <h1
              data-animate-y-up
              data-trigger-content-change
              data-delay='0.167'
              className={styles.tabheading}
            >
              {activeTab}
            </h1>
            <div data-animate-scrollbar className={styles.accordionlist}>
              {activeCategory?.questions.map((q, idx) => (
                <div
                  data-animate-fadein
                  data-trigger-content-change
                  data-delay={idx / 10}
                  role='tabpanel'
                  aria-labelledby={`tab-${idx}`}
                  key={idx}
                >
                  <Accordion headerText={q.question} panelText={q.answer} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQs;
