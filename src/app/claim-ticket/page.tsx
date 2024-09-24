import { Suspense } from 'react';
import ClaimTickets from './components/ClaimTicket';

const ClaimTicketsPage = () => {
  return (
    <Suspense fallback={<div>Please wait...</div>}>
      <ClaimTickets />
    </Suspense>
  );
};

export default ClaimTicketsPage;
