'use client';

import React, { useEffect } from 'react';
import styles from './purchase.module.scss';
import { classNames } from '@/utils/classNames';
import Image from 'next/image';
import Button from '@/components/button';
import PurchaseTicket from '@/components/purchase-ticket';
import { Modal } from '@/components/modal';

const PurchaseYourTicket = () => {
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
          <h1>Purchase your tickets</h1>
          <p>Purchase tickets for one or two-day access; for yourself, or your group of friends.</p>
        </div>

        <div className={styles.ticketcontent}>
          <div className={styles.imagewrapper}>
            <div className={styles.ticketimage}>
              <Image
                src='https://res.cloudinary.com/defsbafq2/image/upload/v1723030368/yellow-ticket_bokooz.svg'
                alt='An image of the one-day ticket'
                fill
              />
            </div>
            {/* <div>hello</div> */}
          </div>
          <div className={styles.ticketdetails}>
            <h2>
              1 day access only | <span> N20,000</span>
            </h2>
            <ul>
              <li>Attend event for just a day of your choice </li>
              <li>Meal Tickets</li>
              <li>Devfest Swags</li>
              <li>Access to workshops, sessions and talks</li>
            </ul>

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
