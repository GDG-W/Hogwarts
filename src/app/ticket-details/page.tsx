'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/components/header';
import ArrowRight from '../../../public/icons/arrow-right.svg';
import WhiteCalendar from '../../../public/icons/calendar-white.svg';
import Calendar from '../../../public/icons/calendar-black.svg';
import Button from '@/components/button';
import TextTemplate from '../../../public/ticket-template.svg';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { getUserProfile } from '@/lib/actions/user';
import { BlackButtonLoader } from '@/components/button/loader';
import { AxiosError } from 'axios';

interface ITicketDetail {
  email: string;
  name: string;
  ticketTitle: string;
  ticketId: string;
  ticketTag: 'day_one' | 'day_two' | 'both';
}
enum Dates {
  'day_one' = '15th Nov, 2024',
  'day_two' = '16th Nov, 2024',
  'both' = '15th & 16th Nov, 2024',
}
const TicketDetails = () => {
  const [isOneWayTicket] = useState(true);
  const [profile, setProfile] = useState<ITicketDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  const fetchProfile = async (token: string) => {
    try {
      const data = await getUserProfile(token);
      if (data) {
        const { email_address, fullname, id, ticket } = data;
        setProfile({
          email: email_address,
          name: fullname,
          ticketId: id,
          ticketTitle: ticket.title,
          ticketTag: ticket.tag,
        });
      }
      // eslint-disable-next-line no-console
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response) {
          // AxiosError with a response
          setError(error.response.data?.message || 'An error occurred');
        } else if (error.request) {
          // AxiosError with a request but no response
          setError('No response received from the server');
        } else {
          // Other AxiosError scenarios
          setError(error.message || 'An unknown error occurred');
        }
      } else if (error instanceof Error) {
        // Non-Axios errors that are instances of Error
        setError(error.message || 'An unknown error occurred');
      } else {
        // Fallback for unexpected error types
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = Cookies.get('token');
    setLoading(true);
    if (token == '' || token == undefined) {
      router.push('/login');
    } else {
      fetchProfile(token);
    }
  }, []);

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
          {!loading && profile !== null && (
            <div>
              <div className='ticket__image'>
                <TextTemplate />
                <div className='user__info'>
                  <div className='detail'>
                    <p className='property'>Location</p>
                    <span className='value'>Landmark Event Centre, Lagos</span>
                  </div>
                  <div className='detail'>
                    <p className='property'>Name</p>
                    <span className='value capitalize'>{profile?.name}</span>
                  </div>
                  <div className='detail__group'>
                    <div className='detail'>
                      <p className='property'>Ticket type</p>
                      <span className='value'>
                        {profile.ticketTag === 'both' ? 'Two-Day Access' : 'One-Day Access'}
                      </span>
                    </div>

                    <div className='detail'>
                      <p className='property'>Quantity</p>
                      <span className='value'>1</span>
                    </div>
                  </div>
                  <div className='detail__group'>
                    <div className='detail'>
                      <p className='property'>Date</p>
                      <span className='value wrap'>{Dates[profile.ticketTag]}</span>
                    </div>

                    <div className='detail'>
                      <p className='property'>Ticket ID</p>
                      <span className='value'>{profile?.ticketId}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className='cta__buttons mobile'>
                {/* {isOneWayTicket && <Button text='Upgrade Ticket' />} */}
                <Button
                  text='Add to Calendar'
                  variant={isOneWayTicket ? 'transparent' : 'primary'}
                  icon={isOneWayTicket ? <Calendar /> : <WhiteCalendar />}
                />
              </div>
              <div className='cta__buttons desktop'>
                {/* {isOneWayTicket && <Button text='Upgrade Ticket' />} */}
                <Button
                  text='Add to Calendar'
                  variant={isOneWayTicket ? 'transparent' : 'primary'}
                  icon={isOneWayTicket ? <Calendar /> : <WhiteCalendar />}
                />
              </div>
            </div>
          )}
          {loading && <BlackButtonLoader />}
          {!loading && error !== null && <p className='error'>{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default TicketDetails;
