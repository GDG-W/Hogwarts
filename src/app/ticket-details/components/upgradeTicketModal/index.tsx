import { Dates, TicketDetailsResponse, UpdateType } from '@/lib/actions/tickets/models';
import { useState } from 'react';
import TextTemplate from '../../../../../public/upgrade-ticket-template.svg';
import { UpgradeForm } from '../upgradeForm';
import styles from './style.module.scss';

interface IModalProps {
  closeModal: () => void;
  showModal: boolean;
  ticketInformation: TicketDetailsResponse;
}

const UpgradeTicketModal = (props: IModalProps) => {
  const { ticketInformation } = props;
  const [upgradeType, setUpgradeType] = useState<UpdateType | null>(null);

  if (!ticketInformation) return null;

  return (
    <div className={styles.ticket_container}>
      <div className={styles.ticket_body}>
        <div className={styles.title_container}>
          <h3 className={styles.title_container_name}>
            {upgradeType === 'change_day' ? 'Change Day' : 'Upgrade Ticket'}
          </h3>
          {upgradeType === 'change_day' ? (
            <p>Confirm the details to change your day to attend DevFest Lagos, 2024</p>
          ) : (
            <p>Change your chosen day or Upgrade to unlock exclusive benefits</p>
          )}
        </div>

        <div className={styles.wrapper}>
          <div className={`${styles.wrapper_sticky_top}`}>
            <div className={styles.ticket__image}>
              <TextTemplate />
              <div className={styles.user__info}>
                <div className={styles.detail}>
                  <p className={styles.property}>Location</p>
                  <span className={styles.value}>Landmark Event Centre, Lagos</span>
                </div>
                <div className={styles.detail}>
                  <p className={styles.property}>Name</p>
                  <span className={styles.value}>{ticketInformation?.fullname}</span>
                </div>
                <div className={styles.detail__group}>
                  <div className={styles.detail}>
                    <p className={styles.property}>Ticket type</p>
                    <span className={styles.value}>
                      {ticketInformation?.ticket?.tag === 'both_days'
                        ? 'Two-Day Access'
                        : 'One-Day Access'}
                    </span>
                  </div>

                  <div className={styles.detail}>
                    <p className={styles.property}>Quantity</p>
                    <span className={styles.value}>1</span>
                  </div>
                </div>
                <div className={styles.detail__group}>
                  <div className={styles.detail}>
                    <p className={styles.property}>Date</p>
                    <span className={styles.value}>{Dates[ticketInformation?.ticket?.tag]}</span>
                  </div>

                  <div className={styles.detail}>
                    <p className={styles.property}>Ticket ID</p>
                    <span className={styles.value}>{ticketInformation?.id}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={`${styles.form_container}  `}>
            <UpgradeForm
              ticketInformation={ticketInformation}
              setUpgradeType={setUpgradeType}
              upgradeType={upgradeType}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradeTicketModal;
