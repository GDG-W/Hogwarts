import Button from '@/components/button';
import Radio from '@/components/form/radio/radio';
import { fetchTickets, updateTicket } from '@/lib/actions/tickets';
import { Ticket, TicketDetailsResponse, UpdateType } from '@/lib/actions/tickets/models';
import { classNames } from '@/utils/classNames';
import { CacheKeys, TICKET_PRICES } from '@/utils/constants';
import { handleError } from '@/utils/helper';
import { useMutation, useQuery } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import ArrowRight from '../../../../../public/icons/arrow-left.svg';
import styles from './checkout.module.scss';

import Modal from '@/components/modals';

interface UpgradeFormProps {
  ticketInformation: TicketDetailsResponse;
  setUpgradeType: (type: UpdateType | null) => void;
  upgradeType: UpdateType | null;
}

export const UpgradeForm = (props: UpgradeFormProps) => {
  const { ticketInformation, upgradeType, setUpgradeType } = props;

  const [showTicketUpdatedModal, setShowTicketUpdatedModal] = useState(false);
  const router = useRouter();

  const [tempUpgradeType, setTempUpgradeType] = useState<UpdateType | null>(null);
  const [confirmUpgrade, setConfirmUpgrade] = useState(false);

  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  const { mutateAsync, isPending: updatingTickets } = useMutation({
    mutationFn: updateTicket,
    onSuccess: (data: TicketDetailsResponse) => {
      if (data.payment_url && upgradeType === 'upgrade_ticket') {
        router.push(data.payment_url);

        setFormSuccess('Please wait, you will be redirected soon.');
      } else if (data.ticket_updated) {
        setShowTicketUpdatedModal(true);
        setFormSuccess('Ticket updated successfully');
        console.log(data);
      }
    },
    onError: (error: unknown) => {
      handleError(error, setFormError);
    },
  });

  const { data, isLoading: fetchingTickets } = useQuery<Ticket[]>({
    queryKey: [CacheKeys.USER_TICKETS],
    queryFn: fetchTickets,
  });

  const onHandleChangeDay = () => {
    const token = Cookies.get('token');

    if (!token) {
      setFormError('Error Validating User, Please Log in');

      router.push('/login');

      return;
    }

    const ticket = data?.find(
      (ticket) => ticket.tag !== 'both_days' && ticket.tag !== ticketInformation.ticket.tag,
    );

    if (!ticket) {
      setFormError('Error Retrieving Ticket. Please Reach out to the Team');

      return;
    }

    mutateAsync({
      ticket_id: ticket.id,
      update_type: 'change_day',
      token,
    });
  };

  const onHandleUpgrade = () => {
    const token = Cookies.get('token');

    if (!token) {
      setFormError('Error Validating User, Please Log in');

      router.push('/login');

      return;
    }

    const ticket = data?.find((ticket) => ticket.tag === 'both_days');

    if (!ticket) {
      setFormError('Error Retrieving Ticket. Please Reach out to the Team');

      return;
    }

    mutateAsync({
      ticket_id: ticket.id,
      update_type: 'upgrade_ticket',
      token,
    });
  };

  return (
    <div className={styles.main_container}>
      <div className={styles.main_container_header}>
        {upgradeType === 'change_day' ? 'Confirm Details' : 'Upgrade Options'}

        {upgradeType && (
          <button className={styles.backButton} onClick={() => setUpgradeType(null)}>
            <ArrowRight />
            Go Back
          </button>
        )}
      </div>

      {!upgradeType && (
        <div className={styles.main_container_body}>
          <ul className={styles.main_container_body_list_group}>
            <li className={styles.main_container_body_list_group_item_one}>
              <p className={styles.main_container_body_date}>Current Ticket</p>

              <li className={styles.main_container_body_list_group_item}>
                {ticketInformation.ticket.tag === 'both_days' && (
                  <>
                    <span>Two days access</span>
                    <span>N{TICKET_PRICES.DAY_TWO.toLocaleString()}</span>
                  </>
                )}

                {ticketInformation.ticket.tag !== 'both_days' && (
                  <>
                    <span>One day access</span>
                    <span>N{TICKET_PRICES.DAY_ONE.toLocaleString()}</span>
                  </>
                )}
              </li>
            </li>

            <li className={styles.main_container_body_list_group_item_one}>
              <p className={styles.main_container_body_date}>What would you like to to?</p>

              <Radio
                id='upgrade_ticket'
                name='upgrade_type'
                label='Upgrade to higher tier'
                checked={tempUpgradeType === 'upgrade_ticket'}
                onClick={() => setTempUpgradeType('upgrade_ticket')}
              />
              <Radio
                id='change_day'
                name='upgrade_type'
                label='Update day'
                checked={tempUpgradeType === 'change_day'}
                onClick={() => setTempUpgradeType('change_day')}
              />
            </li>
          </ul>

          <p className={styles.error}> {formError}</p>
          <p className={styles.success}> {formSuccess}</p>

          <Button
            onClick={() => setUpgradeType(tempUpgradeType!)}
            fullWidth
            text='Checkout'
            variant='primary'
            disabled={!tempUpgradeType}
          />
        </div>
      )}

      {upgradeType === 'change_day' && (
        <div className={styles.main_container_body}>
          <ul className={styles.main_container_body_list_group}>
            <li className={styles.main_container_body_list_group_item_one}>
              <p className={styles.main_container_body_date}>Current Ticket</p>

              <li className={styles.main_container_body_list_group_item}>
                {ticketInformation.ticket.tag === 'both_days' && (
                  <>
                    <span>Two days access</span>
                    <span className={styles.price}>N{TICKET_PRICES.DAY_TWO.toLocaleString()}</span>
                  </>
                )}

                {ticketInformation.ticket.tag !== 'both_days' && (
                  <>
                    <span>One day access</span>
                    <span className={styles.price}>N{TICKET_PRICES.DAY_ONE.toLocaleString()}</span>
                  </>
                )}
              </li>
            </li>

            <li className={styles.main_container_body_list_group_item_one}>
              <p className={styles.main_container_body_date}>Current Day</p>

              <li
                className={classNames(styles.main_container_body_list_group_item, styles.noBorder)}
              >
                <span>
                  {ticketInformation.ticket.tag === 'day_one' && <>15th</>}
                  {ticketInformation.ticket.tag === 'day_two' && <>16th</>} November 2024
                </span>
              </li>

              <p className={styles.main_container_body_date}>Change Day to</p>

              <li className={classNames(styles.main_container_body_list_group_item)}>
                <span>
                  {ticketInformation.ticket.tag === 'day_one' && <>16th</>}
                  {ticketInformation.ticket.tag === 'day_two' && <>15th</>} November 2024
                </span>
              </li>
            </li>
          </ul>

          <p className={styles.error}> {formError}</p>
          <p className={styles.success}> {formSuccess}</p>

          <Button
            onClick={onHandleChangeDay}
            fullWidth
            text='Confirm'
            variant='primary'
            disabled={updatingTickets || fetchingTickets}
            isLoading={updatingTickets || fetchingTickets}
          />
        </div>
      )}

      {upgradeType === 'upgrade_ticket' && (
        <>
          {!confirmUpgrade && (
            <div className={styles.main_container_body}>
              <ul className={styles.main_container_body_list_group}>
                <li className={styles.main_container_body_list_group_item_one}>
                  <p className={styles.main_container_body_date}>Current Ticket</p>

                  <li className={styles.main_container_body_list_group_item}>
                    {ticketInformation.ticket.tag === 'both_days' && (
                      <>
                        <span>Two days access</span>
                        <span className={styles.price}>
                          N{TICKET_PRICES.DAY_TWO.toLocaleString()}
                        </span>
                      </>
                    )}

                    {ticketInformation.ticket.tag !== 'both_days' && (
                      <>
                        <span>One day access</span>
                        <span className={styles.price}>
                          N{TICKET_PRICES.DAY_ONE.toLocaleString()}
                        </span>
                      </>
                    )}
                  </li>
                </li>

                <li className={styles.main_container_body_list_group_item_one}>
                  <p className={styles.main_container_body_date}>Upgrade Ticket To</p>

                  <li className={styles.main_container_body_list_group_item}>
                    <span>Two days access</span>
                    <span className={styles.price}>N{TICKET_PRICES.DAY_TWO.toLocaleString()}</span>
                  </li>
                </li>
              </ul>

              <p className={styles.error}> {formError}</p>
              <p className={styles.success}> {formSuccess}</p>

              <Button
                onClick={() => setConfirmUpgrade(true)}
                fullWidth
                text='Continue'
                variant='primary'
              />
            </div>
          )}

          {confirmUpgrade && (
            <div className={styles.main_container_body}>
              <ul className={styles.main_container_body_list_group}>
                <li className={styles.main_container_body_list_group_item_one}>
                  <p className={styles.main_container_body_date}>15th & 16th November 2024</p>

                  <li className={styles.main_container_body_list_group_item}>
                    <span>Two days access</span>

                    <span className={styles.price}>N{TICKET_PRICES.DAY_TWO.toLocaleString()}</span>
                  </li>
                </li>

                <li className={styles.main_container_body_list_group_item_one}>
                  <p className={styles.main_container_body_date}>Subtotal</p>

                  <li className={styles.main_container_body_list_group_item}>
                    <span>Amount to be Paid</span>
                    <span className={styles.price}>N5000</span>
                  </li>
                </li>

                <li className={styles.main_container_body_list_group_item}>
                  <span>Total </span>

                  <div className={styles.total_price_container}>
                    <span>N5000</span>
                  </div>
                </li>
              </ul>

              <p className={styles.error}> {formError}</p>
              <p className={styles.success}> {formSuccess}</p>

              <Button
                onClick={onHandleUpgrade}
                fullWidth
                text='Continue'
                variant='primary'
                disabled={updatingTickets || fetchingTickets}
                isLoading={updatingTickets || fetchingTickets}
              />
            </div>
          )}
        </>
      )}

      <Modal
        isOpen={showTicketUpdatedModal}
        onClose={() => setShowTicketUpdatedModal(false)}
        title={'Day Change Successful'}
        description={
          'You new day to attend DevFest Lagos, 2024 is now 16th November, 2024. We’ve sent you a confirmatory mail'
        }
        ctaFunc={() => setShowTicketUpdatedModal(false)}
        ctaText='Go to Ticket Page'
      />
    </div>
  );
};
