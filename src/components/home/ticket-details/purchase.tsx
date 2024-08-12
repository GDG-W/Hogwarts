'use client';

import React from 'react';
import styles from './purchase.module.scss';
import { classNames } from '@/utils/classNames';
import Image from 'next/image';
import Button from '@/components/button';

const PurchaseYourTicket = () => {
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

            <Button text='Get Early Bird Tickets' />
          </div>
        </div>
      </div>
    </section>
  );
};

export default PurchaseYourTicket;
