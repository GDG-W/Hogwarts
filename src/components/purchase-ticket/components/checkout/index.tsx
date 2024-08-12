import React from 'react';
import styles from './checkout.module.scss';
import { TTicketNumber } from '../../model';
import Button from '@/components/button';

interface ICheckoutProps {
  selectDays: number;
  ticketNo: TTicketNumber;
  activeStep: number;
}

export const Checkout: React.FC<ICheckoutProps> = ({ selectDays, ticketNo, activeStep }) => {
  const oneDayTotal = 10000 * ticketNo.oneDay;
  const twoDayTotal = 20000 * ticketNo.twoDays;

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
                <span>
                  N{(10000 * ticketNo.oneDay + 20000 * ticketNo.twoDays).toLocaleString()}
                </span>
              </li>
            </ul>

            <Button fullWidth text='Checkout' variant={activeStep === 3 ? 'primary' : 'disabled'} />
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
