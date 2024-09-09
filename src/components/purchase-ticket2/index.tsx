import { useState } from 'react';
import { TicketProvider } from './context';
import { TicketTypeForm } from './ticket-type-form';
import styles from './ticket.module.scss';

const PurchaseTicket = () => {
  const [activeStep, setActiveStep] = useState<number>(1);

  const [isTicketTypeComplete] = useState<boolean>(false);
  const [isOrderInfoComplete] = useState<boolean>(false);
  const stepperLists = [
    { name: 'Ticket type', value: 1, isComplete: isTicketTypeComplete },
    { name: 'Order information', value: 2, isComplete: isOrderInfoComplete },
    { name: 'Checkout', value: 3 },
  ];

  // const handleNextStep = () => {
  //   if ((activeStep === 1 && !isTicketTypeComplete) || (activeStep === 2 && !isOrderInfoComplete)) {
  //     return; // Prevent moving to the next step if the current step is not complete
  //   }
  //   if (activeStep < 3) {
  //     setActiveStep(activeStep + 1);
  //   }
  // };

  return (
    <div>
      <TicketProvider>
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
                {activeStep === 1 && <TicketTypeForm />}
              </div>
            </div>
          </div>
        </div>
      </TicketProvider>
    </div>
  );
};

export default PurchaseTicket;
