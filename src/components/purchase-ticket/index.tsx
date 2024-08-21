import React, { useEffect } from 'react';
import { Checkout } from './components/checkout';
import { OrderInformation } from './components/order-information';
import { TicketType } from './components/ticket-type';
import { TTicketNumber } from './model';
import styles from './ticket.module.scss';

interface IPurchaseTicketProps {
  closeModal: () => void;
  showTicketModal: boolean;
}

const PurchaseTicket = (props: IPurchaseTicketProps) => {
  const [activeStep, setActiveStep] = React.useState<number>(1);
  const [selectDays, setSelectDays] = React.useState<number>(0);
  const [ticketNo, setTicketNo] = React.useState<TTicketNumber>({
    oneDay: 0,
    twoDays: 0,
  });
  const [isTicketTypeComplete, setIsTicketTypeComplete] = React.useState<boolean>(false);
  const [isOrderInfoComplete, setIsOrderInfoComplete] = React.useState<boolean>(false);
  const stepperLists = [
    { name: 'Ticket type', value: 1, isComplete: isTicketTypeComplete },
    { name: 'Order information', value: 2, isComplete: isOrderInfoComplete },
    { name: 'Checkout', value: 3 },
  ];
  const handleNextStep = () => {
    if ((activeStep === 1 && !isTicketTypeComplete) || (activeStep === 2 && !isOrderInfoComplete)) {
      return; // Prevent moving to the next step if the current step is not complete
    }
    if (activeStep < 3) {
      setActiveStep(activeStep + 1);
    }
  };

  const handleTicketTypeCompletion = () => {
    if (selectDays > 0 && (ticketNo.oneDay > 0 || ticketNo.twoDays > 0)) {
      setIsTicketTypeComplete(true);
      handleNextStep();
    } else return;
  };

  const handleOrderInfoCompletion = () => {
    setIsOrderInfoComplete(true);
    handleNextStep();
  };

  useEffect(() => {
    if (!props.showTicketModal) {
      setActiveStep(1);
      setSelectDays(0);
      setTicketNo({ oneDay: 0, twoDays: 0 });
      setIsTicketTypeComplete(false);
      setIsOrderInfoComplete(false);
    }
  }, [props.showTicketModal]);

  return (
    <div className={styles.ticket_container}>
      <div className={styles.ticket_body}>
        <div className={styles.title_container}>
          <h3 className={styles.title_container_name}>Purchase Ticket</h3>
          <ul className={styles.title_container_list_group}>
            {stepperLists.map((list, id) => (
              <li
                key={id}
                onClick={() => list.isComplete && setActiveStep(list.value)}
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
                handleNext={handleTicketTypeCompletion}
              />
            )}
            {activeStep >= 2 && (
              <OrderInformation
                handleNext={handleOrderInfoCompletion}
                setActiveStep={setActiveStep}
              />
            )}

            {activeStep === 3 && (
              <div className={styles.mob_checkout}>
                <Checkout
                  closeModal={props.closeModal}
                  selectDays={selectDays}
                  ticketNo={ticketNo}
                  activeStep={activeStep}
                />
              </div>
            )}
          </div>
          <div className={`${styles.wrapper_container} ${styles.wrapper_sticky_top}`}>
            <Checkout
              closeModal={props.closeModal}
              selectDays={selectDays}
              ticketNo={ticketNo}
              activeStep={activeStep}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseTicket;
