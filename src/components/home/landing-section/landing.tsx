'use client';
import HeroAnimation from '@/animations/components/Hero';
import Button from '@/components/button';
import Header from '@/components/header';
import { classNames } from '@/utils/classNames';
import Image from 'next/image';
import { Dispatch, SetStateAction, useEffect, useRef } from 'react';
// import ArrowRight from '../../../../public/icons/arrow-right.svg';
import DataAnalystCursor from '../../../../public/icons/data-analyst-cursor-icon.svg';
import ProductDesignerCursor from '../../../../public/icons/product-designer-cursor-icon.svg';
import ProductManagerCursor from '../../../../public/icons/product-manager-cursor-icon.svg';
import SoftwareEngineerCursor from '../../../../public/icons/software-engineer-cursor-icon.svg';
import styles from './landing.module.scss';

interface ILandingProps {
  setShowTicketModal: Dispatch<SetStateAction<boolean>>;
  showTicketModal: boolean;
}

const Landing = (props: ILandingProps) => {
  const isInitialized = useRef(false);

  useEffect(() => {
    if (!isInitialized.current) {
      new HeroAnimation(styles.landing);

      isInitialized.current = true;
    }
  }, []);

  useEffect(() => {
    const bodyElement = document.body;

    if (props.showTicketModal) {
      bodyElement.style.overflow = 'hidden';
      bodyElement.style.height = '100vh';
    }

    return () => {
      bodyElement.style.overflow = 'scroll';
      bodyElement.style.height = 'auto';
    };
  }, [props.showTicketModal]);

  return (
    <div className={styles.landing}>
      <div className={styles.container}>
        <div
          data-animate-fadein
          data-delay='0.167'
          data-easing='NAVIGATION.header'
          className={styles.headernav}
        >
          <Header
            handleClick={() => props.setShowTicketModal(true)}
            // navContent={
            //   <div
            //     className={styles.headernavButtonContainer}
            //     data-animate-y-up
            //     data-delay='0.417'
            //     data-easing='NAVIGATION.button'
            //   >
            //     <span>Upgrade Tickets</span>
            //     <ArrowRight />
            //   </div>
            // }
          />
        </div>

        <div>
          <div
            data-animate-fadein-left
            data-easing='CAREERCURSORS.productManagerPosition'
            className={classNames(styles.careercursor, styles['careercursor--productmanager'])}
          >
            <p className={styles.careercursortext}>Product Manager</p>
            <ProductManagerCursor data-animate-career-cursor data-delay='1.3' />
          </div>

          <div
            data-animate-fadein-right
            data-delay='0.3'
            data-easing='CAREERCURSORS.productDesignerPosition'
            className={classNames(styles.careercursor, styles['careercursor--productdesigner'])}
          >
            <ProductDesignerCursor
              data-animate-career-cursor
              data-delay='1.3'
              data-duration='0.7'
            />
            <p className={styles.careercursortext}>Product Designer</p>
          </div>
        </div>

        <div className={styles.herocontent}>
          <p data-animate-y-up data-delay='0.45' data-easing='CTA.header'>
            Don’t miss out!
          </p>
          <h1 data-animate-y-up data-delay='0.5' data-easing='CTA.header'>
            Get your ticket now
          </h1>

          <Button
            onClick={() => props.setShowTicketModal(true)}
            data-animate-scale
            data-delay='0.167'
            data-easing='CTA.button'
            text={
              <span data-animate-text data-delay='0.5' data-easing='CTA.text'>
                Get Early Bird Tickets
              </span>
            }
          />
        </div>

        <div>
          <div
            data-animate-fadein-left
            data-delay='0.4'
            data-easing='CAREERCURSORS.softwareEnginnerPosition'
            className={classNames(styles.careercursor, styles['careercursor--softwareengineer'])}
          >
            <p className={styles.careercursortext}>Software Engineer</p>
            <SoftwareEngineerCursor
              data-animate-career-cursor
              data-delay='1.3'
              dara-duration='0.7'
            />
          </div>

          <div
            data-animate-fadein-right
            data-delay='0.2'
            data-easing='CAREERCURSORS.dataAnalystPosition'
            className={classNames(styles.careercursor, styles['careercursor--dataanalyst'])}
          >
            <DataAnalystCursor data-animate-career-cursor data-delay='1.3' dara-duration='0.7' />
            <p className={styles.careercursortext}>Data Analyst</p>
          </div>
        </div>

        <div className={styles.ticketWrapper}>
          <div className={classNames(styles.ticket, styles.one)} data-animate-ticket-one>
            <Image
              src='https://res.cloudinary.com/defsbafq2/image/upload/v1723030306/green-ticket_d973oo.svg'
              alt='An image of the one-day ticket'
              fill
              priority={true}
            />
          </div>

          <div className={classNames(styles.ticket, styles.middle)} data-animate-ticket-middle>
            <Image
              src='https://res.cloudinary.com/defsbafq2/image/upload/v1723030366/blue-ticket_zqy1z2.svg'
              alt='An image of the one-day ticket'
              fill
              priority={true}
            />
          </div>

          <div className={classNames(styles.ticket, styles.two)} data-animate-ticket-two>
            <Image
              src='https://res.cloudinary.com/defsbafq2/image/upload/v1723030368/yellow-ticket_bokooz.svg'
              alt='An image of the one-day ticket'
              fill
              priority={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
