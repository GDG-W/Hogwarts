'use client';
import { Footer } from '@/components/footer';
import FAQs from '@/components/home/faq/faq';
import Landing from '@/components/home/landing-section/landing';
import TargetAudience from '@/components/home/target-audience/target-audience';
import PurchaseYourTicket from '@/components/home/ticket-details/purchase';
import Value from '@/components/home/value/value';
import { ModalLayout } from '@/components/modal-layout';
import PurchaseTicket from '@/components/purchase-ticket';
import { CacheKeys } from '@/utils/constants';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

export default function Home() {
  const [showTicketModal, setShowTicketModal] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const closeModal = () => {
    setShowTicketModal(false);
  };

  useEffect(() => {
    if (!showTicketModal) {
      queryClient.setQueryData([CacheKeys.USER_PURCHASE_TICKET, CacheKeys.USER_TICKETS], undefined);
      queryClient.clear();
    }
  }, [showTicketModal]);

  return (
    <main className='main'>
      <div className='container'>
        <Landing setShowTicketModal={setShowTicketModal} showTicketModal={showTicketModal} />
        <Value />
        <PurchaseYourTicket
          setShowTicketModal={setShowTicketModal}
          showTicketModal={showTicketModal}
        />
        <FAQs />
        <TargetAudience setShowTicketModal={setShowTicketModal} showTicketModal={showTicketModal} />
        <Footer setShowTicketModal={setShowTicketModal} showTicketModal={showTicketModal} />
      </div>

      {/* <Modal showHeader open={showTicketModal} onClose={closeModal}>
        <PurchaseTicket closeModal={closeModal} />
      </Modal> */}

      <ModalLayout showHeader showModal={showTicketModal} onClose={closeModal}>
        <PurchaseTicket closeModal={closeModal} showTicketModal={showTicketModal} />
      </ModalLayout>
    </main>
  );
}
