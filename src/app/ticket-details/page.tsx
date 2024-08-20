'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/components/header';
import { useMutation } from '@tanstack/react-query';
// import ArrowRight from '../../../public/icons/arrow-right.svg';
import { BlackButtonLoader } from '@/components/button/loader';
import WhiteCalendar from '../../../public/icons/calendar-white.svg';
import Calendar from '../../../public/icons/calendar-black.svg';
import Button from '@/components/button';
import TextTemplate from '../../../public/ticket-template.svg';
import { getUserProfile } from '@/lib/actions/user';
import { useRouter } from 'next/navigation';
import { handleError } from '@/utils/helper';
import Cookies from 'js-cookie';

interface ITicketDetail {
  email: string;
  name: string;
  ticketTitle: string;
  ticketId: string;
  ticketTag: 'day_one' | 'day_two' | 'both_days';
}

enum Dates {
  'day_one' = '15th Nov, 2024',
  'day_two' = '16th Nov, 2024',
  'both_days' = '15th & 16th Nov, 2024',
}
enum CalendarLinks {
  'day_one' = 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=DevFest+Lagos+2024+Day+1&dates=20241115T000000/20241115T235959&details=You+can+find+the+event+agenda,+links+to+the+mobile+app,+manage+your+ticket+and+more+on+the+website+-+devfestlagos.com&location=Landmark+Centre,+Plot+2+%26+3,+Water+Corporation+Dr,+Victoria+Island,+Annex+106104,+Lagos,+Nigeria&sf=true',
  'day_two' = 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=DevFest+Lagos+2024+Day+2&dates=20241116T000000/20241116T235959&details=You+can+find+the+event+agenda,+links+to+the+mobile+app,+manage+your+ticket+and+more+on+the+website+-+devfestlagos.com&location=Landmark+Centre,+Plot+2+%26+3,+Water+Corporation+Dr,+Victoria+Island,+Annex+106104,+Lagos,+Nigeria&sf=true',
  'both_days' = 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=DevFest+Lagos+2024&dates=20241115T000000/20241116T235959&details=You+can+find+the+event+agenda,+links+to+the+mobile+app,+manage+your+ticket+and+more+on+the+website+-+devfestlagos.com&location=Landmark+Centre,+Plot+2+%26+3,+Water+Corporation+Dr,+Victoria+Island,+Annex+106104,+Lagos,+Nigeria&sf=true',
}

const TicketDetails = () => {
  const [isOneWayTicket] = useState(true);
  const [error, setError] = useState('');
  const [profile, setProfile] = useState<ITicketDetail | null>(null);
  const router = useRouter();

  const fetchProfile = useMutation({
    mutationFn: getUserProfile,
    onSuccess: (data) => {
      const { email_address, fullname, id, ticket } = data;
      setProfile({
        email: email_address,
        name: fullname,
        ticketId: id,
        ticketTitle: ticket.title,
        ticketTag: ticket.tag,
      });
    },
    onError: (error) => {
      handleError(error, setError);
    },
  });

  useEffect(() => {
    const token = Cookies.get('token');
    if (token == '' || token == undefined) {
      router.push('/login');
    } else {
      fetchProfile.mutateAsync(token);
    }
  }, []);
  const handleCalendarClick = () => {
    if (profile?.ticketTag) {
      router.push(CalendarLinks[profile.ticketTag]);
    }
  };

  return (
    <div className='ticket__details'>
      <div className='ticket__container'>
        <Header
          handleClick={() => {}}
          // navContent={
          //   <>
          //     <span>Get Tickets For Your Friends</span>
          //     <ArrowRight />
          //   </>
          // }
        />

        <div className='ticket__heading'>
          <h1 className='ticket__title'>Ticket Details</h1>
          <h2 className='ticket__subtitle'>View all details of your ticket here.</h2>
        </div>

        <div className='ticket__info'>
          {!fetchProfile.isPending && profile !== null && (
            <>
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
                      <span className='value'>{profile.name}</span>
                    </div>
                    <div className='detail__group'>
                      <div className='detail'>
                        <p className='property'>Ticket type</p>
                        <span className='value'>
                          {profile.ticketTag === 'both_days' ? 'Two-Day Access' : 'One-Day Access'}
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
                        <span className='value'>{profile.ticketId}</span>
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
                    onClick={handleCalendarClick}
                  />
                </div>
              </div>
              <div className='ticket__content'>
                <div className='content__title'>Two-Day Access</div>
                <div className='detailed__content'>
                  <div className='detail'>
                    <p className='property'>Full Name</p>
                    <span className='value'>{profile.name}</span>
                  </div>
                  <div className='detail'>
                    <p className='property'>Location</p>
                    <span className='value'>Landmark Event Centre, Lagos</span>
                  </div>
                  <div className='detail'>
                    <p className='property'>Date</p>
                    <span className='value'>{Dates[profile.ticketTag]}</span>
                  </div>
                  <div className='detail'>
                    <p className='property'>Time</p>
                    <span className='value'>10:00 AM WAT</span>
                  </div>
                  <div className='detail'>
                    <p className='property'>Quantity</p>
                    <span className='value'>1</span>
                  </div>
                  <div className='detail'>
                    <p className='property'>Ticket ID</p>
                    <span className='value'>{profile?.ticketId}</span>
                  </div>
                </div>
                <div className='cta__buttons desktop'>
                  {/* {isOneWayTicket && <Button text='Upgrade Ticket' />} */}
                  <Button
                    text='Add to Calendar'
                    variant={isOneWayTicket ? 'transparent' : 'primary'}
                    icon={isOneWayTicket ? <Calendar /> : <WhiteCalendar />}
                    onClick={handleCalendarClick}
                  />
                </div>
              </div>
            </>
          )}
          {fetchProfile.isPending && (
            <div className='loader'>
              <BlackButtonLoader />
            </div>
          )}
          {fetchProfile.isPending && error !== null && <p className='error'>{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default TicketDetails;
