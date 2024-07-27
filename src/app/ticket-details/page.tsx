'use client';

import React from 'react';
import Header from '@/components/header';
import ArrowRight from '../../../public/icons/arrow-right.svg';
import Calendar from '../../../public/icons/calendar-black.svg';
import Button from '@/components/button';

const TicketDetails = () => {
  return (
    <div className='ticket__details'>
      <div className='ticket__container'>
        <Header
          handleClick={() => {}}
          navContent={
            <>
              <span>Get Tickets For Your Friends</span>
              <ArrowRight />
            </>
          }
        />

        <div className='ticket__heading'>
          <h1 className='ticket__title'>Ticket Details</h1>
          <h2 className='ticket__subtitle'>View all details of your ticket here.</h2>
        </div>

        <div className='ticket__info'>
          <div className='ticket__image'></div>
          <div className='ticket__content'>
            <div className='content__title'>Two-Day Access</div>
            <div className='detailed__content'>
              <div className='detail'>
                <p className='property'>Full Name</p>
                <span className='value'>Odeh Evergreen</span>
              </div>
              <div className='detail'>
                <p className='property'>Location</p>
                <span className='value'>Landmark Event Centre, Lagos</span>
              </div>
              <div className='detail'>
                <p className='property'>Date</p>
                <span className='value'>15th & 16th November, 2024</span>
              </div>
              <div className='detail'>
                <p className='property'>Time</p>
                <span className='value'>10:00 am WAT</span>
              </div>
              <div className='detail'>
                <p className='property'>Quantity</p>
                <span className='value'>1</span>
              </div>
              <div className='detail'>
                <p className='property'>Ticket ID</p>
                <span className='value'>0000000000</span>
              </div>
            </div>

            <div className='cta__buttons'>
              <Button text='Upgrade Ticket' />
              <Button text='Add to Calendar' variant='transparent' icon={<Calendar />} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetails;
