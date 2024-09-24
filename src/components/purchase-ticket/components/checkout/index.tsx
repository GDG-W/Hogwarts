import Button from '@/components/button';
import { fetchTickets, getCouponInformation, ticketCheckout } from '@/lib/actions/tickets';
import { Ticket, TicketCheckoutPayload } from '@/lib/actions/tickets/models';
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

  const debouncedCouponCode = useDebounce(couponCode, 500);

  const {
    data: coupon,
    isLoading: isValidatingCoupon,
    refetch: validateCoupon,
  } = useQuery({
    queryKey: [CacheKeys.COUPON_CODE, debouncedCouponCode],
    queryFn: () => getCouponInformation(debouncedCouponCode),
    enabled: false,
  });

  useEffect(() => {
    if (!debouncedCouponCode.trim()) return;
    validateCoupon();
  }, [debouncedCouponCode]);

  const couponDetails = useMemo(() => {
    if (coupon) {
      queryClient.setQueryData([CacheKeys.USER_PURCHASE_TICKET], (prevData: TicketPurchaseData) => {
        return {
          ...prevData,
          couponCode: debouncedCouponCode,
        };
      });

      return coupon;
    }
  }, [coupon]);

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

      const payload: TicketCheckoutPayload = {
        payer: {
          fullname: getTicketPurchaseData?.buyerInformation.fullName,
          email_address: getTicketPurchaseData?.buyerInformation.email_address,
        },
        payer_is_attendee: true,
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

      if (couponDetails?.discount_rate) {
        payload['coupon_code'] = couponDetails.code;
      }

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

    const payload: TicketCheckoutPayload = {
      payer: {
        fullname: getTicketPurchaseData?.buyerInformation.fullName,
        email_address: getTicketPurchaseData?.buyerInformation.email_address,
      },
      payer_is_attendee: false,
      attendees: tickets,
    };

    if (couponDetails?.discount_rate) {
      payload['coupon_code'] = couponCode;
    }

    mutateAsync(payload);

    return;
  };

  function calculateDiscountedPrice(price: number, percentage: number): number {
    const discount = (price * percentage) / 100;
    const discountedPrice = price - discount;
    return discountedPrice;
  }

  const isButtonDisabled = useMemo(() => {
    return activeStep !== 3 || isLoading || isValidatingCoupon || isPending || formSuccess
      ? true
      : false;
  }, [isLoading, isValidatingCoupon, isPending, formSuccess, activeStep]);

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
                    <div
                      className={
                        styles.main_container_body_list_group_item_three_discount_container
                      }
                    >
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

                    <div
                      className={styles.main_container_body_list_group_item_three_discount_message}
                    >
                      {isValidatingCoupon && (
                        <>
                          <div className={styles.discount_button_loader}></div>

                          <span className={styles.discountPending}>Validating Coupon</span>
                        </>
                      )}

                      {!couponDetails && couponCode && !isValidatingCoupon && (
                        <span className={styles.discountError}>Coupon Not Found</span>
                      )}

                      {couponDetails && couponDetails?.discount_rate && (
                        <span className={styles.discountSuccess}>
                          Coupon Valid: {couponDetails?.discount_rate}%
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </li>

              <li className={styles.main_container_body_list_group_item}>
                <span>Total </span>

                <div className={styles.total_price_container}>
                  {couponDetails?.discount_rate ? (
                    <>
                      <span>
                        N{calculateDiscountedPrice(ticketTotal, couponDetails?.discount_rate)}
                      </span>
                      <span className={styles.oldPrice}>N{ticketTotal.toLocaleString()}</span>
                    </>
                  ) : (
                    <span>N{ticketTotal.toLocaleString()}</span>
                  )}
                </div>
              </li>
            </ul>

            <p className={styles.error}> {formError}</p>
            <p className={styles.success}> {formSuccess}</p>

            {activeStep === 3 && (
              <Button
                onClick={() => handleCheckout()}
                fullWidth
                text='Checkout'
                variant={!isButtonDisabled ? 'primary' : 'disabled'}
                isLoading={isLoading || isPending}
                disabled={isButtonDisabled}
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
