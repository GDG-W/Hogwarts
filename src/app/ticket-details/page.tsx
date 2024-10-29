'use client';

import Header from '@/components/header';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
// import ArrowRight from '../../../public/icons/arrow-right.svg';
import Button from '@/components/button';
import { BlackButtonLoader } from '@/components/button/loader';
import { ModalLayout } from '@/components/modal-layout';
import { Dates, TicketDetailsResponse } from '@/lib/actions/tickets/models';
import { getUserProfile } from '@/lib/actions/user';
import { handleError } from '@/utils/helper';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import Calendar from '../../../public/icons/calendar-black.svg';
import WhiteCalendar from '../../../public/icons/calendar-white.svg';
import TextTemplate from '../../../public/ticket-template.svg';
import UpgradeTicketModal from './components/upgradeTicketModal';

enum CalendarLinks {
  'day_one' = 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=DevFest+Lagos+2024+Day+1&dates=20241115T000000/20241115T235959&details=You+can+find+the+event+agenda,+links+to+the+mobile+app,+manage+your+ticket+and+more+on+the+website+-+devfestlagos.com&location=Landmark+Centre,+Plot+2+%26+3,+Water+Corporation+Dr,+Victoria+Island,+Annex+106104,+Lagos,+Nigeria&sf=true',
  'day_two' = 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=DevFest+Lagos+2024+Day+2&dates=20241116T000000/20241116T235959&details=You+can+find+the+event+agenda,+links+to+the+mobile+app,+manage+your+ticket+and+more+on+the+website+-+devfestlagos.com&location=Landmark+Centre,+Plot+2+%26+3,+Water+Corporation+Dr,+Victoria+Island,+Annex+106104,+Lagos,+Nigeria&sf=true',
  'both_days' = 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=DevFest+Lagos+2024&dates=20241115T000000/20241116T235959&details=You+can+find+the+event+agenda,+links+to+the+mobile+app,+manage+your+ticket+and+more+on+the+website+-+devfestlagos.com&location=Landmark+Centre,+Plot+2+%26+3,+Water+Corporation+Dr,+Victoria+Island,+Annex+106104,+Lagos,+Nigeria&sf=true',
}

const TicketDetails = () => {
  const [error, setError] = useState('');
  const [profile, setProfile] = useState<TicketDetailsResponse | null>(null);
  const router = useRouter();

  const [showUpgradeTicketModal, setShowUpgradeTicketModal] = useState<boolean>(false);

  const closeModal = () => {
    setShowUpgradeTicketModal(false);
  };
  const openModal = () => {
    setShowUpgradeTicketModal(true);
  };

  const fetchProfile = useMutation({
    mutationFn: getUserProfile,
    onSuccess: (data) => setProfile(data),
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
    if (profile?.ticket?.tag) {
      router.push(CalendarLinks[profile.ticket.tag]);
    }
  };

  const canBeUpgraded = useMemo(() => {
    return profile?.ticket.tag !== 'both_days';
  }, [profile]);

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
                      <span className='value'>{profile.fullname}</span>
                    </div>
                    <div className='detail__group'>
                      <div className='detail'>
                        <p className='property'>Ticket type</p>
                        <span className='value'>
                          {profile?.ticket?.tag === 'both_days'
                            ? 'Two-Day Access'
                            : 'One-Day Access'}
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
                        <span className='value wrap'>{Dates[profile?.ticket?.tag]}</span>
                      </div>

                      <div className='detail'>
                        <p className='property'>Ticket ID</p>
                        <span className='value'>{profile.id}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='cta__buttons mobile'>
                  {canBeUpgraded && <Button text='Update / Upgrade Ticket' onClick={openModal} />}
                  <Button
                    text='Add to Calendar'
                    variant={canBeUpgraded ? 'transparent' : 'primary'}
                    icon={canBeUpgraded ? <Calendar /> : <WhiteCalendar />}
                    onClick={handleCalendarClick}
                  />
                </div>
              </div>

              <div className='ticket__content'>
                <div className='content__title'>
                  {profile?.ticket?.tag === 'both_days' ? 'Two-Day Access' : 'One-Day Access'}
                </div>
                <div className='detailed__content'>
                  <div className='detail'>
                    <p className='property'>Full Name</p>
                    <span className='value'>{profile.fullname}</span>
                  </div>
                  <div className='detail'>
                    <p className='property'>Location</p>
                    <span className='value'>Landmark Event Centre, Lagos</span>
                  </div>
                  <div className='detail'>
                    <p className='property'>Date</p>
                    <span className='value'>{Dates[profile?.ticket?.tag]}</span>
                  </div>
                  <div className='detail'>
                    <p className='property'>Time</p>
                    <span className='value'>08:00 AM WAT</span>
                  </div>
                  <div className='detail'>
                    <p className='property'>Quantity</p>
                    <span className='value'>1</span>
                  </div>
                  <div className='detail'>
                    <p className='property'>Ticket ID</p>
                    <span className='value'>{profile?.id}</span>
                  </div>
                </div>
                <div className='cta__buttons desktop'>
                  {canBeUpgraded && <Button text='Update / Upgrade Ticket' onClick={openModal} />}
                  <Button
                    text='Add to Calendar'
                    variant={canBeUpgraded ? 'transparent' : 'primary'}
                    icon={canBeUpgraded ? <Calendar /> : <WhiteCalendar />}
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

      <ModalLayout showHeader showModal={showUpgradeTicketModal} onClose={closeModal}>
        <UpgradeTicketModal
          closeModal={closeModal}
          showModal={showUpgradeTicketModal}
          ticketInformation={profile!}
        />
      </ModalLayout>
    </div>
  );
};

export default TicketDetails;
