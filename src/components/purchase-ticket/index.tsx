import styles from './ticket.module.scss';
import React from 'react';
import { Checkout } from './components/checkout';
import { TicketType } from './components/ticket-type';
import { OrderInformation } from './components/order-information';
import { TTicketNumber } from './model';

const PurchaseTicket = () => {
  const [activeStep, seActiveStep] = React.useState<number>(1);
  const [selectDays, setSelectDays] = React.useState<number>(0);
  const [ticketNo, setTicketNo] = React.useState<TTicketNumber>({
    oneDay: 0,
    twoDays: 0,
  });
  const stepperLists = [
    { name: 'Ticket type', value: 1 },
    { name: 'Order information', value: 2 },
    { name: 'Checkout', value: 3 },
  ];
  const handleNextStep = () => {
    if (activeStep > 3) return;
    seActiveStep(activeStep + 1);
  };

  return (
    <div className={styles.ticket_container}>
      <div className={styles.ticket_body}>
        <div className={styles.title_container}>
          <h3 className={styles.title_container_name}>Purchase Ticket</h3>
          <ul className={styles.title_container_list_group}>
            {stepperLists.map((list, id) => (
              <li
                key={id}
                onClick={() => seActiveStep(list.value)}
                className={`
                  ${styles.title_container_list_group_item} 
                   ${activeStep >= list.value ? styles.title_container_list_group_active : ''}
                   `}
              >
                {list.name}
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.wrapper}>
          <div className={styles.wrapper_container}>
            {activeStep === 1 && (
              <TicketType
                selectDays={selectDays}
                handleChangeSelectDays={setSelectDays}
                ticketNo={ticketNo}
                handleChangeTicketNo={setTicketNo}
                handleNext={handleNextStep}
              />
            )}
            {activeStep >= 2 && <OrderInformation handleNext={handleNextStep} />}

            {activeStep === 3 && (
              <div className={styles.mob_checkout}>
                <Checkout selectDays={selectDays} ticketNo={ticketNo} activeStep={activeStep} />
              </div>
            )}
          </div>
          <div className={`${styles.wrapper_container} ${styles.wrapper_sticky_top}`}>
            <Checkout selectDays={selectDays} ticketNo={ticketNo} activeStep={activeStep} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseTicket;
