import Button from '@/components/button';
import { fetchTickets, ticketCheckout } from '@/lib/actions/tickets';
import { Ticket } from '@/lib/actions/tickets/models';
import { classNames } from '@/utils/classNames';
import { CacheKeys, TICKET_PRICES } from '@/utils/constants';
import { handleError } from '@/utils/helper';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';
import { SelectedTickets, TicketPurchaseData } from '../../model';
import { useDebounce, validateTicketPurchaseData } from '../../tickets.util';
import styles from './checkout.module.scss';

interface ICheckoutProps {
  activeStep: number;
  closeModal: () => void;
  selectedTickets: SelectedTickets;
}

export const Checkout: React.FC<ICheckoutProps> = ({ activeStep, selectedTickets }) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const getTicketPurchaseData: TicketPurchaseData | undefined = queryClient.getQueryData([
    CacheKeys.USER_PURCHASE_TICKET,
  ]);

  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [couponCode, setCouponCode] = useState(getTicketPurchaseData?.couponCode ?? '');

  const { data, isLoading, refetch } = useQuery<Ticket[]>({
    queryKey: [CacheKeys.USER_TICKETS],
    queryFn: fetchTickets,
  });

  const { one_day, two_days } = selectedTickets;

  const ticketTotal = useMemo(() => {
    const oneDayTotal = one_day.quantity * TICKET_PRICES.DAY_ONE;
    const twoDaysTotal = two_days.quantity * TICKET_PRICES.DAY_TWO;

    return oneDayTotal + twoDaysTotal;
  }, [selectedTickets]);

  const debouncedValue = useDebounce(couponCode, 500);

  useEffect(() => {
    queryClient.setQueryData([CacheKeys.USER_PURCHASE_TICKET], (prevData: TicketPurchaseData) => {
      return {
        ...prevData,
        couponCode: debouncedValue,
      };
    });
  }, [debouncedValue]);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: ticketCheckout,
    onSuccess: (data) => {
      if (data.payment_url) {
        router.push(data.payment_url);

        queryClient.setQueryData(
          [CacheKeys.USER_PURCHASE_TICKET, CacheKeys.USER_TICKETS],
          undefined,
        );

        queryClient.clear();

        setFormSuccess('Please Wait, You would be redirected Soon.');
      } else {
        handleError('Invalid Payment Link. Please Try again', setFormError);
      }

      // setTimeout(() => {
      //   closeModal();
      // }, 2000)
    },
    onError: (error: unknown) => {
      console.log(error);
      handleError(error, setFormError);
    },
  });

  const handleCheckout = async (retry: number = 0): Promise<void> => {
    if (!getTicketPurchaseData) return;

    const isFormValid = validateTicketPurchaseData(getTicketPurchaseData);

    if (!isFormValid) return;

    if (!data || data.length === 0) {
      if (retry >= 3) return;

      await refetch();

      return handleCheckout(retry + 1);
    }

    const { one_day, two_days } = getTicketPurchaseData.selectedTickets;

    const isPersonal = one_day.quantity + two_days.quantity === 1;

    if (isPersonal) {
      const selected = one_day.quantity === 0 ? 'both_days' : one_day.selectedDay;

      const ticket = data?.find((ticket) => ticket.tag === selected);

      if (!ticket) return;

      const payload = {
        payer: {
          fullname: getTicketPurchaseData?.buyerInformation.fullName,
          email_address: getTicketPurchaseData?.buyerInformation.email_address,
        },
        payer_is_attendee: true,
        coupon_code: couponCode,
        attendees: [
          {
            ticket_id: ticket.id,
            email_address: getTicketPurchaseData?.buyerInformation.email_address,
            fullname: getTicketPurchaseData?.buyerInformation.fullName,
            role: getTicketPurchaseData?.personalOrderInformation.role,
            level_of_expertise: getTicketPurchaseData?.personalOrderInformation.expertise,
          },
        ],
      };

      mutateAsync(payload);

      return;
    }

    function getOneDayTicketId() {
      const { quantity, selectedDay } = one_day;

      if (quantity === 0 || !selectedDay) return;

      const ticket = data?.find((ticket) => ticket.tag === selectedDay);

      if (!ticket) return;

      return ticket.id;
    }

    function getTwoDayTicketId() {
      const ticket = data?.find((ticket) => ticket.tag === 'both_days');

      if (!ticket) return;

      return ticket.id;
    }

    const { oneDayAccessEmails, twoDaysAccessEmails } =
      getTicketPurchaseData.othersOrderInformation;

    const tickets = [];

    const oneDayTicket = getOneDayTicketId();

    if (oneDayAccessEmails.length > 0 && oneDayTicket) {
      const oneDayTickets = oneDayAccessEmails.map((email) => {
        return {
          email_address: email,
          ticket_id: oneDayTicket,
        };
      });

      tickets.push(...oneDayTickets);
    }

    const twoDayTicket = getTwoDayTicketId();

    if (twoDaysAccessEmails.length > 0 && twoDayTicket) {
      const twoDayTickets = twoDaysAccessEmails.map((email) => {
        return {
          email_address: email,
          ticket_id: twoDayTicket,
        };
      });

      tickets.push(...twoDayTickets);
    }

    const payload = {
      payer: {
        fullname: getTicketPurchaseData?.buyerInformation.fullName,
        email_address: getTicketPurchaseData?.buyerInformation.email_address,
      },
      payer_is_attendee: false,
      coupon_code: couponCode,
      attendees: tickets,
    };

    mutateAsync(payload);

    return;
  };

  return (
    <div className={styles.main_container}>
      <div className={styles.main_container_header}>
        {activeStep === 3 ? 'Checkout' : 'Order summary'}
      </div>

      <div className={styles.main_container_body}>
        {one_day.quantity > 0 || two_days.quantity > 0 ? (
          <>
            <ul className={styles.main_container_body_list_group}>
              {one_day.quantity > 0 && (
                <li className={styles.main_container_body_list_group_item_one}>
                  <p className={styles.main_container_body_date}>
                    {one_day.selectedDay === 'day_one' && <> 15th</>}
                    {one_day.selectedDay === 'day_two' && <> 16th</>} November 2024
                  </p>

                  <li className={styles.main_container_body_list_group_item}>
                    <span>One day access x{one_day.quantity}</span>
                    <span>N{(one_day.quantity * TICKET_PRICES.DAY_ONE).toLocaleString()}</span>
                  </li>
                </li>
              )}

              {two_days.quantity > 0 && (
                <li className={styles.main_container_body_list_group_item_two}>
                  <p className={styles.main_container_body_date}>15th & 16th November 2024</p>

                  <li className={styles.main_container_body_list_group_item}>
                    <span>Two days access x{two_days.quantity}</span>
                    <span>N{(two_days.quantity * TICKET_PRICES.DAY_TWO).toLocaleString()}</span>
                  </li>
                </li>
              )}

              <li
                className={classNames(styles.main_container_body_list_group_item_three)}
                style={{ borderBottom: activeStep !== 3 ? '1px solid #cccccc' : '' }}
              >
                <div className={styles.main_container_body_list_group_item_three_subtotal}>
                  <span>Subtotal </span>
                  <span>N{ticketTotal.toLocaleString()}</span>
                </div>

                {activeStep === 3 && (
                  <div className={styles.main_container_body_list_group_item_three_discount}>
                    <input
                      type='text'
                      value={couponCode}
                      placeholder='Add Discount Code'
                      onChange={(e) => setCouponCode(e.target.value)}
                    />
                    <button type='button' onClick={() => setCouponCode('')}>
                      Clear
                    </button>
                  </div>
                )}
              </li>

              <li className={styles.main_container_body_list_group_item}>
                <span>Total </span>
                <span>N{ticketTotal.toLocaleString()}</span>
              </li>
            </ul>

            <p className={styles.error}> {formError}</p>
            <p className={styles.success}> {formSuccess}</p>

            {activeStep === 3 && (
              <Button
                onClick={() => handleCheckout()}
                fullWidth
                text='Checkout'
                variant={activeStep === 3 ? 'primary' : 'disabled'}
                isLoading={isLoading || isPending}
                disabled={activeStep !== 3 || isLoading || isPending || formSuccess ? true : false}
              />
            )}
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
