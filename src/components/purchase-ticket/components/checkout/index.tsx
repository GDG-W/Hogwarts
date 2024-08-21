import Button from '@/components/button';
import { fetchTickets, ticketCheckout } from '@/lib/actions/tickets';
import { CacheKeys } from '@/utils/constants';
import { handleError } from '@/utils/helper';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { TicketPurchaseData, TTicketNumber } from '../../model';
import styles from './checkout.module.scss';

interface ICheckoutProps {
  selectDays: number;
  ticketNo: TTicketNumber;
  activeStep: number;
  closeModal: () => void;
}

interface Ticket {
  id: string;
  title: string;
  description: string;
  tag: string;
  price: number;
  total_units: number;
  available_units: number;
  total_minted: number;
  created_at: string;
}

export const Checkout: React.FC<ICheckoutProps> = ({
  selectDays,
  ticketNo,
  activeStep,
  closeModal,
}) => {
  const oneDayTotal = 7000 * ticketNo.oneDay;
  const twoDayTotal = 10000 * ticketNo.twoDays;

  const queryClient = useQueryClient();
  const getTicketPurchaseData: TicketPurchaseData | undefined = queryClient.getQueryData([
    CacheKeys.USER_PURCHASE_TICKET,
  ]);

  const { data, isLoading, refetch } = useQuery<Ticket[]>({
    queryKey: [CacheKeys.USER_TICKETS],
    queryFn: fetchTickets,
  });

  const [formError, setFormError] = useState('');

  const { mutateAsync, isPending } = useMutation({
    mutationFn: ticketCheckout,
    onSuccess: (data) => {
      if (data.payment_url) {
        window.open(data.payment_url, '_blank');
      }

      queryClient.setQueryData([CacheKeys.USER_PURCHASE_TICKET, CacheKeys.USER_TICKETS], undefined);
      queryClient.clear();

      closeModal();
    },
    onError: (error: unknown) => {
      console.log(error);
      handleError(error, setFormError);
    },
  });

  const getTicketId = (
    selectedTicket: TicketPurchaseData,
    ticketArray: Ticket[],
  ): Ticket | undefined => {
    if (selectedTicket?.selectedDay == '1') {
      return ticketArray.find((ticket) => ticket.tag === 'day_one');
    } else if (selectedTicket?.selectedDay == '2') {
      return ticketArray.find((ticket) => ticket.tag === 'day_two');
    } else if (!selectedTicket.selectedDay) {
      return ticketArray.find((ticket) => ticket.tag === 'both_days');
    }

    return undefined;
  };

  const handleCheckout = async (retry: number = 0): Promise<void> => {
    if (
      !getTicketPurchaseData?.email ||
      !getTicketPurchaseData?.name ||
      !getTicketPurchaseData?.ticketNo
    )
      return;

    if (!data || data.length === 0) {
      if (retry >= 3) return;

      await refetch();
      return handleCheckout(retry + 1);
    }

    const selectedTicket = getTicketId(getTicketPurchaseData, data);

    if (!selectedTicket) return;

    const payload = {
      payer: {
        email_address: getTicketPurchaseData?.email,
        fullname: getTicketPurchaseData?.name,
      },
      payer_is_attendee: true,
      attendees: [
        {
          email_address: getTicketPurchaseData?.email,
          ticket_id: selectedTicket.id,
          fullname: getTicketPurchaseData?.name,
          role: getTicketPurchaseData?.role,
          level_of_expertise: getTicketPurchaseData?.expertise,
        },
      ],
    };

    mutateAsync(payload);
  };

  useEffect(() => {
    setFormError('');
  }, [selectDays, ticketNo, getTicketPurchaseData, activeStep]);

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
              onClick={() => handleCheckout()}
              fullWidth
              text='Checkout'
              variant={activeStep === 3 ? 'primary' : 'disabled'}
              isLoading={isLoading || isPending}
              disabled={activeStep !== 3 || isLoading || isPending}
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
