'use client';

import PurchaseTicketsAnimation from '@/animations/components/PurchaseTickets';
import Button from '@/components/button';
import React, { useEffect, useRef } from 'react';
import styles from './purchase.module.scss';
import { classNames } from '@/utils/classNames';
import Image from 'next/image';
import PurchaseTicket from '@/components/purchase-ticket';
import { Modal } from '@/components/modal';

const PurchaseYourTicket = () => {
  const isInitialized = useRef(false);

  useEffect(() => {
    if (!isInitialized.current) {
      new PurchaseTicketsAnimation(styles.purchase, styles);

      isInitialized.current = true;
    }
  }, []);

  const [openTicket, setOpenTicket] = React.useState<boolean>(false);

  useEffect(() => {
    const bodyElement = document.body;

    if (openTicket) {
      bodyElement.style.overflow = 'hidden';
      bodyElement.style.height = '100vh';
    }

    return () => {
      bodyElement.style.overflow = 'scroll';
      bodyElement.style.height = 'auto';
    };
  }, [openTicket]);

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
                src='https://res.cloudinary.com/defsbafq2/image/upload/v1723030368/yellow-ticket_bokooz.svg'
                alt='An image of the one-day ticket'
                width={650}
                height={350}
                className={styles.headImage}
              />

              <Image
                src='https://res.cloudinary.com/defsbafq2/image/upload/v1723722423/devfest_2024/red-ticket_1723722419669.svg'
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
                src='https://res.cloudinary.com/defsbafq2/image/upload/v1723030368/yellow-ticket_bokooz.svg'
                alt='An image of the one-day ticket'
                width={83}
                height={43}
              />

              <Image
                src='https://res.cloudinary.com/defsbafq2/image/upload/v1723722423/devfest_2024/red-ticket_1723722419669.svg'
                alt='An image of the Two-day ticket'
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
                Attend event for just a day of your choice{' '}
              </li>
              <li data-animate-y-up data-delay='0.250'>
                Access to workshops, sessions and talks
              </li>
              <li data-animate-y-up data-delay='0.333'>
                Meal Tickets
              </li>
              <li data-animate-y-up data-delay='0.417'>
                Devfest Swags
              </li>
            </ul>

            <Button
              data-animate-scale
              data-delay='0.5'
              data-easing='SCALE'
              text={
                <span data-animate-y-up data-delay='0.7'>
                  Get Early Bird Tickets
                </span>
              }
            />
            <Button onClick={() => setOpenTicket(true)} text='Get Early Bird Tickets' />
          </div>
        </div>
      </div>
      {/* Modals */}
      <Modal showHeader open={openTicket} onClose={() => setOpenTicket(false)}>
        <PurchaseTicket />
      </Modal>
    </section>
  );
};

export default PurchaseYourTicket;
