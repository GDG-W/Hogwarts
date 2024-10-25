'use client';

import PurchaseTicketsAnimation from '@/animations/components/PurchaseTickets';
import Button from '@/components/button';
import { classNames } from '@/utils/classNames';
import Image from 'next/image';
import { Dispatch, SetStateAction, useEffect, useRef } from 'react';
import styles from './purchase.module.scss';

interface IPurchaseYourTicketProps {
  setShowTicketModal: Dispatch<SetStateAction<boolean>>;
}
const PurchaseYourTicket = (props: IPurchaseYourTicketProps) => {
  const isInitialized = useRef(false);

  useEffect(() => {
    if (!isInitialized.current) {
      new PurchaseTicketsAnimation(styles.purchase, styles);

      isInitialized.current = true;
    }
  }, []);

  return (
    <section className={styles.purchase}>
      <div className={classNames(styles.container)}>
        <div className={styles.heading}>
          <h1 data-animate-y-up className={styles.headingH}>
            Purchase your tickets
          </h1>
          <p data-animate-y-up data-delay='0.083'>
            Purchase tickets for one or two-day access; for yourself, or your group of friends.
          </p>
        </div>

        <div className={styles.ticketcontent}>
          <div className={styles.imagewrapper}>
            <div className={styles.headContainerWrapper}>
              <Image
                src='https://svgshare.com/i/1Bqp.svg'
                alt='An image of the one-day ticket'
                width={650}
                height={350}
                className={styles.headImage}
              />

              <Image
                src='https://svgshare.com/i/1Bqt.svg'
                alt='An image of the two-day ticket'
                width={650}
                height={350}
                className={styles.headImage}
                style={{ opacity: 0 }}
              />
            </div>

            <div className={styles.subTicketImageContainer}>
              <div className={styles.border}></div>

              <Image
                src='https://svgshare.com/i/1Bqp.svg'
                alt='An image of the one-day ticket'
                className={styles.thumbnailImage}
                width={83}
                height={43}
              />

              <Image
                src='https://svgshare.com/i/1Bqt.svg'
                alt='An image of the Two-day ticket'
                className={styles.thumbnailImage}
                width={83}
                height={43}
              />
            </div>
          </div>
          <div className={styles.ticketdetails}>
            <h2 data-animate-y-up data-delay='0.083'>
              1 day access only | <span> N20,000</span>
            </h2>
            <ul>
              <li data-animate-y-up data-delay='0.167'>
                Get the one-day tickets for you or your friends{' '}
              </li>
              <li data-animate-y-up data-delay='0.250'>
                Access to workshops, sessions and talks
              </li>
              <li data-animate-y-up data-delay='0.333'>
                Meal Ticket
              </li>
            </ul>

            <Button
              onClick={() => props.setShowTicketModal(true)}
              data-animate-scale
              data-delay='0.5'
              data-easing='SCALE'
              text={
                <span data-animate-y-up data-delay='0.7'>
                  Get Tickets
                </span>
              }
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default PurchaseYourTicket;
