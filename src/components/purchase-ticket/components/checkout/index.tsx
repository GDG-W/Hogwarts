import Button from '@/components/button';
import { ticketCheckout } from '@/lib/actions/tickets';
import { CacheKeys } from '@/utils/constants';
import { handleError } from '@/utils/helper';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { TicketPurchaseData, TTicketNumber } from '../../model';
import styles from './checkout.module.scss';

interface ICheckoutProps {
  selectDays: number;
  ticketNo: TTicketNumber;
  activeStep: number;
}

export const Checkout: React.FC<ICheckoutProps> = ({ selectDays, ticketNo, activeStep }) => {
  const oneDayTotal = 7000 * ticketNo.oneDay;
  const twoDayTotal = 10000 * ticketNo.twoDays;

  const queryClient = useQueryClient();
  const getTicketPurchaseData: TicketPurchaseData | undefined = queryClient.getQueryData([
    CacheKeys.USER_PURCHASE_TICKET,
  ]);

  // const [tickets, setTickets] = useState<Ticket[]>([]);

  // const handleFetchTickets = async () => {
  //   setTicketsFetching(true);
  //   try {
  //     const response = await fetchTicketsFromApi();
  //     setTickets(response);
  //   } catch (error) {
  //     console.log(error);
  //   } finally {
  //     setTicketsFetching(false);
  //   }
  // };

  const [formError, setFormError] = useState('');

  const ticketCheckoutMutation = useMutation({
    mutationFn: ticketCheckout,
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error: unknown) => {
      console.log(error);
      handleError(error, setFormError);
    },
  });

  const handleCheckout = () => {
    if (!getTicketPurchaseData?.email || !getTicketPurchaseData?.name) return;

    console.log(getTicketPurchaseData);

    const payload = {
      payer: {
        email_address: getTicketPurchaseData?.email,
        fullname: getTicketPurchaseData?.name,
      },
      payer_is_attendee: true,
      attendees: [
        {
          email_address: getTicketPurchaseData?.email,
          ticket_id: 'b3112420-3ed2-4d11-b38c-279ce3bbe22f',
          fullname: getTicketPurchaseData?.name,
          role: getTicketPurchaseData?.role,
          level_of_expertise: getTicketPurchaseData?.expertise,
          shirt_size: 'xl',
        },
      ],
    };

    ticketCheckoutMutation.mutateAsync(payload);
  };

  return (
    <div className={styles.main_container}>
      <div className={styles.main_container_header}>Order summary</div>

      <div className={styles.main_container_body}>
        {selectDays > 0 && (ticketNo.oneDay > 0 || ticketNo.twoDays > 0) ? (
          <>
            <ul className={styles.main_container_body_list_group}>
              {ticketNo.oneDay > 0 && (
                <li className={styles.main_container_body_list_group_item_one}>
                  <p className={styles.main_container_body_date}>
                    {selectDays === 1 && <> 15th</>}
                    {selectDays === 2 && <> 16th</>} November 2024
                  </p>

                  <li className={styles.main_container_body_list_group_item}>
                    <span>One day access x{ticketNo.oneDay}</span>
                    <span>N{oneDayTotal.toLocaleString()}</span>
                  </li>
                </li>
              )}

              {ticketNo.twoDays > 0 && (
                <li className={styles.main_container_body_list_group_item_two}>
                  <p className={styles.main_container_body_date}>15th & 16th November 2024</p>

                  <li className={styles.main_container_body_list_group_item}>
                    <span>Two days access x{ticketNo.twoDays}</span>
                    <span>N{twoDayTotal.toLocaleString()}</span>
                  </li>
                </li>
              )}

              <li className={styles.main_container_body_list_group_item}>
                <span>Subtotal </span>
                <span>N{(oneDayTotal + twoDayTotal).toLocaleString()}</span>
              </li>

              <li className={styles.main_container_body_list_group_item}>
                <span>Total </span>
                <span>N{(oneDayTotal + twoDayTotal).toLocaleString()}</span>
              </li>
            </ul>

            <p className={styles.error}> {formError}</p>

            <Button
              onClick={handleCheckout}
              fullWidth
              text='Checkout'
              variant={activeStep === 3 ? 'primary' : 'disabled'}
            />
          </>
        ) : (
          <p className={styles.main_container_body_date}>
            Select your event date and quantity to appear here
          </p>
        )}
      </div>
    </div>
  );
};
